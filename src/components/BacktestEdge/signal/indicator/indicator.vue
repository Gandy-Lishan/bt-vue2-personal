// indicator search box
<template>
	<div class="indicator-box">
		<el-form :model="si" ref="siForm" :rules="rules">
			<div class="indicator-container sentiBox">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Sentiment Indicators"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="sentimentIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
							prefix-icon="el-icon-search"
							class="inline-input"
							clearable
							v-model="si.sentimentIndicator"
							:disabled="!(indicatorRadio === 'Sentiment Indicators')"
							:fetch-suggestions="indicatorSentimentSearch"
							placeholder="Input the sentiment indicator"
							@select="handleSentimentSelect"
							highlight-first-item
						></el-autocomplete>
						<!-- <div class="dropdown">
							<div @click="myFunction" class="dropbtn" id="dropbtn">{{category}}</div>
							<div ref="myDropdown" id="myDropdown" class="dropdown-content">
								<div @click="selectCategory">all</div>
								<div @click="selectCategory">model</div>
								<div @click="selectCategory">model2</div>
								<div @click="selectCategory">model3</div>
							</div>
						</div> -->
					</div>
				</el-form-item>
			</div>
			<div class="indicator-container techBox">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Technical Indicators"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="technicalIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
							:disabled="!(indicatorRadio === 'Technical Indicators')"
							class="inline-input"
							clearable
							prefix-icon="el-icon-search"
							v-model="si.technicalIndicator"
							:fetch-suggestions="indicatorTechnicalSearch"
							placeholder="Input the technical indicator"
							@select="handleTechnicalSelect"
						></el-autocomplete>
					</div>
				</el-form-item>
			</div>
			<div class="indicator-container customBox">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Custom Indicators"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="customIndicator">
					<div class="indicatorSearchBox">
						<el-upload
							class="upload-demo"
							action="https://jsonplaceholder.typicode.com/posts/"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:before-upload="beforeUpload"
							:multiple="false"
							:limit="1"
							:on-exceed="handleExceed"
							:file-list="fileList"
							:disabled="!(indicatorRadio === 'Custom Indicators')"
						>
							<el-button
								size="small"
								type="primary"
								class="upload-indicator-btn"
								>点击上传</el-button
							>
							<div slot="tip" class="el-upload__tip">
								只能上传csv/xlsx文件，且不超过1MB
							</div>
						</el-upload>
						<el-dialog :title="previewFileName" :visible.sync="previewVisible">
						<el-table :data="previewData" style="margin-top: 20px; max-height: 400px; overflow-y: auto;">
      <el-table-column label="Date" prop="Date"></el-table-column>
      <el-table-column label="Close" prop="Close"></el-table-column>
    </el-table>
	</el-dialog>
					</div>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>
<script>
import { Store, mapGetters } from 'vuex'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { getIndicatorsList } from '@/service/service'
import Papa from 'papaparse'
export default {
	props: {
		criteria: String,
		panelIndex: Number,
		editableTabsValue: String,
		editableTabs: Array,
		exitItemCheck: Boolean
	},
	data() {
		var validateSenti = (rule, value, callback) => {
			if (!value && this.indicatorRadio == 'Sentiment Indicators') {
				callback(new Error('Please choose sentiment indicator'))
			} else {
				callback()
			}
		}
		var validateTech = (rule, value, callback) => {
			if (!value && this.indicatorRadio == 'Technical Indicators') {
				callback(new Error('Please choose technical indicator'))
			} else {
				callback()
			}
		}
		var validateRisk = (rule, value, callback) => {
			if (!value && this.indicatorRadio == 'Risk Indicators') {
				callback(new Error('Please choose risk indicator'))
			} else {
				callback()
			}
		}
		return {
			indicatorRadio: 'Sentiment Indicators',
			si: {
				sentimentIndicator: '',
				technicalIndicator: '',
				riskIndicator: '',
				customIndicator: ''
			},
			sentimentIndicatorList: this.$store.state.sentimentIndicatorList,
			rules: {
				sentimentIndicator: [{ validator: validateSenti, trigger: 'change' }],
				technicalIndicator: [{ validator: validateTech, trigger: 'change' }],
				riskIndicator: [{ validater: validateRisk, trigger: 'change' }]
			},
			category: 'all',
			fileList: [],
			actionUrl: '', // 文件上传的接口地址
      headers: {}, // 请求头部
      previewVisible: false, // 是否显示预览表格
      previewData: [], // 预览表格的数据
			previewFileName: '',
			fieldErrors: []
		}
	},
	computed: {
		updateFreq() {
			return this.$store.state.pairDataFreq
		},
		updateSenti() {
			return this.$store.state.currentSenti
		},
		updateTech() {
			return this.$store.state.currentTech
		},
		frequency() {
			return this.$store.state.exitFrequency
		}
	},
	watch: {
		// Listen to freq on the indicator Vue is to make the indicators loaded by the form within the timeframe range
		updateFreq() {
			this.indicatorSentimentSearch(this.si.sentimentIndicator, (res) => {
				if (res.length == 0) {
					this.si.sentimentIndicator = ''
				}
			})
		},
		updateSenti(val) {
			let tabs = this.editableTabs
			var absoluteIndex = ''
			tabs.forEach((tab, index) => {
				if (tab.name == this.editableTabsValue) {
					absoluteIndex = index
				}
			})
			if (
				this.si.sentimentIndicator == '' &&
				this.si.technicalIndicator == '' &&
				this.si.riskIndicator == '' &&
				absoluteIndex == this.panelIndex
			) {
				this.si.sentimentIndicator = val.name
				for (var i in CIQ.indicatorList) {
					if (CIQ.indicatorList[i].chart_name == val.name) {
						this.indicatorRadio = 'Sentiment Indicators'
						if (this.criteria == 'entry') {
							this.$store.commit('getEntryIndicators', {
								index: this.panelIndex,
								value: CIQ.indicatorList[i].url
							})
						} else {
							this.$store.commit('getExitIndicators', {
								index: this.panelIndex,
								value: CIQ.indicatorList[i].url
							})
						}

						// extract this statement from handleSentimentSelect
						let valObj = {}
						valObj.value = CIQ.indicatorList[i].chart_name
						valObj.index = this.panelIndex
						this.$emit('getIndicatorVal', valObj)
						// Remove form verification
						this.clearFormValidate()
						let radioObj = {}
						radioObj.value = 'sentiment'
						radioObj.index = this.panelIndex
						this.$emit('getIndicatorRadio', radioObj)
						let obj = {}
						obj.index = this.panelIndex
						obj.url = CIQ.indicatorList[i].url
						this.$emit('getIndicatorUrl', obj)
					}
				}
			}
		},
		updateTech(val) {
			var builtinList = this.$store.state.builtinList
			builtinList.find((item) => {
				if (item.url == val.url) {
					// this.si.technicalIndicator = item.value
					/*
					Note it out for the time being, because most of the technologies are not added to the back test
					*/
					//this.indicatorRadio = 'Technical Indicators'
					// 					let radioObj = {}
					// radioObj.value = 'technical'
					// radioObj.index = this.panelIndex
					// this.$emit('getIndicatorRadio', radioObj)
					//this.handleTechnicalSelect({value:item.value})
				}
			})
		},
		frequency: {
			handler(newVal) {
				if (newVal != this.currentSentiUpdated) {
					// The changed timeframe is not equal to the current timeframe of the sentiment indicator
					switch (newVal) {
						case 'Daily':
							if (this.si.sentimentIndicator) {
								this.si.sentimentIndicator = ''
							}
							break
						case 'Weekly':
							if (
								this.currentSentiUpdated == 'Monthly' &&
								this.si.sentimentIndicator
							) {
								this.si.sentimentIndicator = ''
							}
							break
						default:
							break
					}
				}
			}
		}
	},
	methods: {
		myFunction() {
			this.$refs.myDropdown.classList.toggle('show')
		},
		/* 当用户选择indicator类别，进行搜索筛选*/
		selectCategory(e) {
			this.category = e.target.innerHTML
		},
		// Clear form authentication
		clearFormValidate() {
			this.$refs.siForm.clearValidate()
		},
		//  load sentiment list
		clearForm() {
			let data = {
				indicatorRadio: 'Sentiment Indicators',
				si: {
					sentimentIndicator: '',
					technicalIndicator: '',
					riskIndicator: ''
				},
				sentimentIndicatorList: []
			}
			data.sentimentIndicatorList = this.$store.state.sentimentIndicatorList
			Object.assign(this.$data, data)

			this.$refs.siForm.clearValidate()
		},
		// sentiment search
		indicatorSentimentSearch(queryString, cb) {
			var sentimentIndicatorList = this.$store.state.sentimentIndicatorList

			sentimentIndicatorList.sort(function (a, b) {
				return a.value.localeCompare(b.value)
			})
			var results = queryString
				? sentimentIndicatorList.filter(
						this.createStateSentimentFilter(queryString)
				  )
				: sentimentIndicatorList
			cb(results)
		},
		createStateSentimentFilter(queryString) {
			return (state) => {
				if (state.value.indexOf('Seasonality') !== -1) {
					return false
				}
				return (
					state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
				)
			}
		},
		// technical search
		indicatorTechnicalSearch(queryString, cb) {
			var technicaltIndicatorList = this.loadShortLong()
			if (this.criteria === 'entry') {
				let valueArr = ['ATR Trailing Stops', 'Parabolic SAR']
				technicaltIndicatorList = technicaltIndicatorList.filter(
					(item) => valueArr.indexOf(item.value) === -1
				)
			}
			var results = queryString
				? technicaltIndicatorList.filter(
						this.createTechnicalFilter(queryString)
				  )
				: technicaltIndicatorList

			// 调用 callback 返回建议列表的数据
			cb(results)
		},
		createTechnicalFilter(queryString) {
			return (technicaltIndicatorList) => {
				return (
					technicaltIndicatorList.value
						.toLowerCase()
						.indexOf(queryString.toLowerCase()) !== -1
				)
			}
		},
		indicatorRiskSearch(queryString, cb) {
			var riskIndicatorList = this.loadRiskList()
			var results = queryString
				? riskIndicatorList.filter(this.createRiskFilter(queryString))
				: riskIndicatorList
			// Call callback to return the data of the suggestion list
			cb(results)
		},
		createRiskFilter(queryString) {
			return (riskIndicatorList) => {
				return (
					riskIndicatorList.value
						.toLowerCase()
						.indexOf(queryString.toLowerCase()) !== -1
				)
			}
		},
		handleSentimentSelect(item) {
			this.currentSentiUpdated = item.updated
			// old version only
			var countExistIndicator = 0
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				for (var i in CIQ.store.state.builtinList) {
					if (
						CIQ.store.state.builtinList[i].url ==
						CIQ.stxx.layout.studies[studyInstanceName].type
					) {
						countExistIndicator--
					}
				}
				if (CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA') {
					countExistIndicator--
				}
				countExistIndicator++
			}

			if (countExistIndicator >= 10) {
				CIQ.description('Maximum 10 signals can be displayed on chart')
				return
			}

			this.si.sentimentIndicator = item.value
			let obj = {}
			obj.value = item.value
			obj.index = this.panelIndex
			this.$emit('getIndicatorVal', obj)
			// remove a MA tat already exists in current criteria before loading
			var activatedMAList = this.$store.state.activatedMA
			if (this.criteria == 'entry') {
				var MAListIndex = activatedMAList.findIndex(
					(item) =>
						item.url ==
						this.$store.state.indicators.formIndicators.entry[this.panelIndex]
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getEntryIndicators', {
					index: this.panelIndex,
					value: item.url
				})
				let obj = {}
				obj.index = this.panelIndex
				obj.url = item.url
				this.$emit('getIndicatorUrl', obj)
			} else {
				var MAListIndex = activatedMAList.findIndex(
					(item) =>
						item.url ==
						this.$store.state.indicators.formIndicators.exit[this.panelIndex]
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getExitIndicators', {
					index: this.panelIndex,
					value: item.url
				})
				let obj = {}
				obj.index = this.panelIndex
				obj.url = item.url
				this.$emit('getIndicatorUrl', obj)
			}
			// avoid add indicator redundantly
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]
				if (sd.type == item.url) {
					return
				}
			}
			CIQ.addIndicators()
		},
		handleTechnicalSelect(item) {
			this.si.technicalIndicator = item.value
			let valObj = {}
			valObj.index = this.panelIndex
			valObj.value = item.value
			this.$emit('getIndicatorVal', valObj)
			const vm = this
			let val = item.value
			let url = item.url
			this.$emit('getTechIndiValue', item.class)
			let obj = {}
			obj.index = this.panelIndex
			obj.class = item.class
			this.$emit('getTechIndiObj', obj)
			// remove a MA tat already exists in current criteria before loadin
			if (this.criteria == 'entry') {
				// remove MA from Vuex after loading Tech
				var activatedMAList = CIQ.store.state.activatedMA

				var MAListIndex = activatedMAList.findIndex(
					(ma) =>
						ma.url ==
						this.$store.state.indicators.formIndicators.entry[this.panelIndex]
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				CIQ.store.commit('getMA', activatedMAList)
				this.$store.commit('getEntryIndicators', {
					index: this.panelIndex,
					value: url
				})
			} else {
				// remove MA from Vuex after loading Tech
				var activatedMAList = CIQ.store.state.activatedMA

				var MAListIndex = activatedMAList.findIndex(
					(ma) =>
						ma.url ==
						this.$store.state.indicators.formIndicators.exit[this.panelIndex]
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}

				CIQ.store.commit('getMA', activatedMAList)
				this.$store.commit('getExitIndicators', {
					index: this.panelIndex,
					value: url
				})
			}
			// store tech indicators in Vuex and use it in addIndicator to test if a member in list is belong to tech
			let techIndicators = []
			techIndicators.push(...CIQ.store.state.indicators.technicalIndicators)
			techIndicators.push(url)
			techIndicators = [...new Set(techIndicators)]
			this.$store.commit('getTechnicalIndicators', techIndicators)

			// avoid add indicator redundantly
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]
				if (sd.type == url) {
					return
				}
			}
			vm.si.technicalIndicator = item.value

			if (arguments[1] != true) {
				CIQ.addIndicators()
			}
		},
		changeIndicatorChecked(val) {
			console.log('indicatorRadio', val)
			this.indicatorRadio = val
			this.clearFormValidate()
			const arr = [
				'Sentiment Indicators',
				'Technical Indicators',
				'Risk Control',
				'Custom Indicators'
			]
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.panelIndex
			this.$store.commit('deleteIndicator', obj)
			let radioObj = {}
			radioObj.index = this.panelIndex
			if (this.indicatorRadio === arr[0]) {
				radioObj.value = 'sentiment'
				this.$emit('getIndicatorRadio', radioObj)
				this.$store.commit('getEntryIndicatorRadio', 'sentiment')
			} else if (this.indicatorRadio === arr[1]) {
				radioObj.value = 'technical'
				this.$emit('getIndicatorRadio', radioObj)
				this.$store.commit('getEntryIndicatorRadio', 'technical')
			} else if (this.indicatorRadio === arr[2]) {
				radioObj.value = 'risk'
				this.$emit('getIndicatorRadio', radioObj)
				this.$store.commit('getEntryIndicatorRadio', 'risk')
			} else if (this.indicatorRadio === arr[3]) {
				radioObj.value = 'custom'
			}
		},
		// load short and long technical list
		loadShortLong() {
			const technicalList = CIQ.technicalCategory
			let formatList = []
			for (let i = 0; i < technicalList.length; i++) {
				if (
					technicalList[i].class === 'No_display_technical_indicator' ||
					technicalList[i].class ===
						'Not_in_backtest_technical_indicator_but_visible_in_chatiq'
				)
					continue
				technicalList[i].studies.forEach((item) => {
					let obj = {}
					obj.class = technicalList[i].class
					obj.value = item.name
					obj.url = item.url
					formatList.push(obj)
				})
			}
			formatList.sort(function (a, b) {
				return a.value.localeCompare(b.value)
			})
			this.$store.commit('saveFormatTechnicalList', formatList)
			return formatList
		},
		loadRiskList() {
			return [{ value: 'Time In Market' }, { value: 'Profit/Loss' }]
		},
		async saveIndicator(index) {
			let checked = true
			let validForm
			let validName = false
			if (
				this.indicatorRadio === 'Sentiment Indicators' &&
				!this.exitItemCheck
			) {
				this.$refs.siForm.validate((valid) => {
					validForm = valid
				})
				let sentimentList = this.$store.state.sentimentIndicatorList
				if (sentimentList.length == 0) {
					var indicatorList = []
					if (CIQ.indicatorList) {
						if (CIQ.indicatorList.length != 0) {
							indicatorList = this.$store.state.indicatorsList
							indicatorList = CIQ.indicatorList
						}
					}
					sentimentList = indicatorList.map((obj) => {
						if (obj.chart_name && obj.url && obj.updated) {
							return {
								value: obj.chart_name,
								url: obj.url,
								updated: obj.updated
							}
						}
					})
				}
				for (let i = 0; i < sentimentList.length; i++) {
					if (this.si.sentimentIndicator === sentimentList[i].value) {
						validName = true
						break
					}
				}
				if (validForm && validName) {
					let obj = {}
					obj.criteria = this.criteria
					obj.index = index
					obj.value = this.si.sentimentIndicator
					this.$store.commit('getSentiValue', obj)
					return checked
				} else {
					if (!validName) {
						this.$message({
							message:
								'Please select #' +
								(index + 1) +
								' ' +
								this.criteria +
								' indicator from the drop-down box',
							type: 'error'
						})
					}
					checked = false
					return checked
				}
			}
			if (
				this.indicatorRadio === 'Technical Indicators' &&
				!this.exitItemCheck
			) {
				this.$refs.siForm.validate((valid) => {
					validForm = valid
				})
				let formateList = this.$store.state.formateTechnicalList
				if (formateList.length === 0) {
					formateList = vm.loadShortLong()
				}
				for (let i = 0; i < formateList.length; i++) {
					if (this.si.technicalIndicator === formateList[i].value) {
						validName = true
						break
					}
				}
				if (validForm && validName) {
					let obj = {}
					obj.criteria = this.criteria
					obj.index = index
					obj.value = this.si.technicalIndicator
					this.$store.commit('getTechValue', obj)
					return checked
				} else {
					if (!validName) {
						this.$message({
							message:
								'Please select #' +
								(index + 1) +
								' ' +
								this.criteria +
								' indicator from the drop-down box',
							type: 'error',
							offset: 300
						})
					}
					checked = false
					return checked
				}
			}
			if (this.exitItemCheck) {
				checked = true
				return checked
			}
		},
		async setEditData(newVal) {
			try {
				if (JSON.stringify(newVal) != '{}') {
					this.clearFormValidate()
					let index = this.panelIndex
					let vm = this
					if (newVal[this.criteria].signals[index].analysis === 'Sentiment') {
						this.indicatorRadio = 'Sentiment Indicators'
						this.si.sentimentIndicator =
							newVal[this.criteria].signals[index].indicator
						let sentimentList = this.$store.state.sentimentIndicatorList

						if (sentimentList.length == 0) {
							let res = await getIndicatorsList()
							sentimentList = res.data.map((obj) => {
								if (obj.chart_name && obj.url && obj.updated) {
									return {
										value: obj.chart_name,
										url: obj.url,
										updated: obj.updated
									}
								}
							})
						}

						let indi = this.si.sentimentIndicator

						sentimentList.forEach((item) => {
							if (indi.toUpperCase() == item.value.toUpperCase()) {
								let obj = {}
								obj.index = vm.panelIndex
								obj.url = item.url
								// Set the tiemframe that currently fills the indicator. If the indicator does not match after switching the timeframe, it will be removed
								this.currentSentiUpdated = item.updated
								vm.$emit('getIndicatorUrl', obj)
							}
						})
					}
					if (newVal[this.criteria].signals[index].analysis === 'Technical') {
						vm.indicatorRadio = 'Technical Indicators'
						let technicalIndicator =
							newVal[this.criteria].signals[index].indicator
						vm.si.technicalIndicators = technicalIndicator
						let formateList = this.$store.state.formateTechnicalList
						if (formateList.length === 0) {
							formateList = vm.loadShortLong()
						}
						for (let i = 0; i < formateList.length; i++) {
							if (technicalIndicator === formateList[i].value) {
								let obj = formateList[i]
								let isFromEdit = true
								vm.handleTechnicalSelect(obj, isFromEdit)
								break
							}
						}
					}
				}
			} catch (error) {
				this.$notify({
					title: 'Failed',
					message: 'The internal server is busy, please try again later',
					type: 'error',
					offset: 100
				})
			}
		},
		handleRemove(file, fileList) {
			console.log(file, fileList)
		},
		handlePreview(file) {
			console.log('handlePreview', file)
			Papa.parse(file.raw, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          // 获取解析后的数据
          const data = result.data;
          // 更新预览表格的数据
          this.previewData = data;
					this.previewFileName = file.name
					console.log('previewData',data)
          // 显示预览表格
          this.previewVisible = true;
        },
        error: (error) => {
          // 解析错误时的处理逻辑
          console.error('解析错误:', error);
        }
      });
		},
		handleExceed(files, fileList) {
			this.$message.warning('只能上传单个 indicator 文件')
		},
		beforeUpload(file) {
			console.log('beforeUpload', file)
			if (!/(CSV)/i.test(file.type)) {
				this.$message.warning('上传的图片只能是 CSV 格式')
				return false
			}
			// 限制文件上传大小 1M
			if (file.size > 1 * 1024 * 1024) {
				this.$message.warning('上传的文件不能超过 1MB')
				return false
			}
			// 限制字段
			const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
				console.log('content',content)
			// 使用 PapaParse 解析 CSV 文件内容
			const result = Papa.parse(content, {
          header: true, // 指定是否将第一行作为字段名
					skipEmptyLines: true
        });
        // 获取解析结果
        const data = result.data;
				console.log('data', data)
        // 进行字段校验
        this.fieldErrors = this.validateFields(data);
      }
      reader.readAsText(file);
			console.log('错误的地方', this.fieldErrors)
			if (this.fieldErrors.length > 0) {
          // 如果有错误，显示错误信息
					this.$message.warning('字段校验未通过')
					return false
        } else {
          // 校验通过，可以继续处理解析后的数据
        }
      },
			validateFields(data) {
      // 在这里进行字段校验
      // 可以遍历解析后的数据对象数组，对每一行的字段进行校验
      // 如果有错误，将错误信息存储到一个数组中，并返回
      // 示例：校验字段是否存在且不为空
      const errors = [];
      data.forEach((row, index) => {
				console.log('row',row)
        if (!row.Date || !row.Close) {
          errors.push(`第 ${index + 1} 行字段校验未通过`);
        }
      });
      return errors;
    },
	}
}
</script>
<style lang="less" scoped>
.dropdown {
	display: block;
	left: unset;
	right: 0;
}
.dropbtn:after {
	right: 14px;
	top: 15px;
}

.indicator-container {
	display: flex;
}
/deep/ .sentiBox .el-input--prefix .el-input__inner:first-child {
	width: 334px;
	padding-left: 30px;
}
/deep/ .techBox .el-input--prefix .el-input__inner:first-child {
	width: 334px;
	padding-left: 30px;
}
/deep/ .el-radio__label {
	display: inline-block;
	width: 136px;
}
/deep/ .el-input__icon {
	width: 60px;
}
/deep/ .el-form-item {
	margin-bottom: 10px;
}
.upload-demo {
	display: flex;

	flex-direction: row-reverse;
}
.upload-demo {
	flex-direction: column;
	min-width: 300px;
	border-radius: 5px;
	border: 1px solid #dcdfe6;
	padding: 10px;
	margin-left: 20px;
}
.upload-indicator-btn {
	width: 100%;
}
</style>