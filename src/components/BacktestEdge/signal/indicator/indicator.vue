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
							:action="uploadUrl"
							:on-preview="handlePreview"
							:on-progress="handleUploadProgress"
							:on-remove="handleRemove"
							:on-success="handleUploadSuccess"
							:on-error="handleUploadError"
							:http-request="uploadFile"
							:before-upload="beforeUpload"
							:multiple="false"
							:limit="1"
							:on-exceed="handleExceed"
							:file-list="fileList"
							ref="upload"
							:disabled="!(indicatorRadio === 'Custom Indicators')"
						>
							<el-button
								size="small"
								type="primary"
								class="upload-indicator-btn"
								>点击上传</el-button
							>
							<div slot="tip" class="el-upload__tip">
								只能上传 csv 文件，且不超过 1MB
							</div>
						</el-upload>
						<el-dialog :title="previewFileName" :visible.sync="previewVisible">
							<el-table
								:data="previewData"
								style="margin-top: 20px; max-height: 400px; overflow-y: auto"
							>
								<el-table-column label="Date" prop="Date"></el-table-column>
								<el-table-column label="Close" prop="Close"></el-table-column>
							</el-table>
						</el-dialog>
						<el-dialog
							:title="previewFileName"
							:visible.sync="dialogFormVisible"
							:close-on-click-modal="false"
							:close-on-press-escape="false"
							:show-close="false"
						>
							<el-form
								:model="form"
								class="custom-indicator-form"
								:rules="customIndicatorRules"
								ref="customForm"
							>
								<el-form-item
									label="indicator 名称"
									:label-width="formLabelWidth"
									prop="indicatorName"
								>
									<el-input
										v-model="form.indicatorName"
										autocomplete="off"
									></el-input>
								</el-form-item>
							</el-form>
							<div slot="footer" class="dialog-footer">
								<el-button @click="handleDialogClose">直接使用文件名</el-button>
								<el-button
									type="primary"
									@click="handleDialogConfirm('customForm')"
									>确 定</el-button
								>
							</div>
						</el-dialog>
					</div>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>
<script>
import SparkMD5 from 'spark-md5';
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { getIndicatorsList } from '@/service/service'
import Papa from 'papaparse'
import axios from 'axios'
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
		var validateIndicatorName = (rule, value, callback) => {
			const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
			if (!value) {
				callback(new Error('名称不能为空'))
			} else if (!reg.test(value)) {
				callback(new Error('必须以字母开头，并且只能够包含字母、数字和下划线'))
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
			cancelToken: null, // 用于保存取消上传请求的取消令牌
			uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
			uploadHeaders: {},
			// progress: 0, // 上传进度
			dialogFormVisible: false,
			form: {
				indicatorName: ''
			},
			formLabelWidth: '120px',
			customIndicatorRules: {
				indicatorName: [{ validator: validateIndicatorName, trigger: 'blur' }],
				dialogValid: false
			},
			rawMap: {} // 文件对象的 raw 属性备份
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
		uploadFile(file) {
			console.log('文件上传', file)
			const self = this
			// 创建 FormData 对象，将文件添加到 FormData 中

			const formData = new FormData()
			formData.append('file', file)

			// 创建 CancelToken 实例
			const cancelToken = axios.CancelToken.source()

			// 保存取消令牌，以便在需要终止上传时使用
			self.cancelToken = cancelToken
			// 发送上传请求
			axios
				.post(self.uploadUrl, formData, {
					headers: {
						...self.uploadHeaders,
						...{
							cancelToken: cancelToken.token
						}
					},
					onUploadProgress: (event) => {
						// 文件上传进度的处理逻辑
						// self.handleUploadProgress(event, file.uid, self.fileList);
						// const progress = Math.round((event.loaded * 100) / event.total)
						// const curLi =
						// 	self.$refs.upload.$el.querySelector('.el-progress-bar__inner') ||
						// 	null
						// console.log(
						// 	'lishan curli',
						// 	curLi,
						// 	self.$refs.upload.$el.querySelector('.el-progress__text')
						// )
						// self.$refs.upload.$el.querySelector(
						// 	'.el-progress-bar__inner'
						// ).style.width = progress + '%'
						// this.$refs.upload.$el.querySelector('.el-progress__text').innerHTML = this.progress + '%';
						// ...
					}
				})
				.then((response) => {
					// 文件上传完成后的处理逻辑
					console.log('文件上传成功', response)
					// 还原文件对象的 raw 属性
					self.$message.success('文件上传成功，可点击文件进行预览')
					// ...
				})
				.catch((error) => {
					// 文件上传出错的处理逻辑
					console.log('文件上传失败', error)
					self.$message.success('文件上传失败')

					// ...
				})
		},
		handleUploadSuccess(response, file, fileList) {
			// 上传成功回调
			console.log('上传成功回调：', response)
			// 更新文件列表中对应文件的状态为成功
			// this.fileList.forEach((item) => {
			// 	if (item.uid === file.uid) {
			// 		item.progress = 100 // 进度设置为 100
			// 		item.status = 'success' // 状态设置为成功
			// 	}
			// })
		},
		handleUploadError(error, file, fileList) {
			// 上传失败回调
			console.log('上传失败：', error)
			// 更新文件列表中对应文件的状态为
		},
		handleRemove(file, fileList) {
			console.log('处理删除', file)
			// 备份文件对象的 raw 属性
			this.rawMap[file.uid] = this.rawMap[file.uid] || file.raw
			const index = this.fileList.indexOf(file)
			if (index !== -1) {
				this.fileList.splice(index, 1)
			}
			// 在需要终止上传的地方调用 cancelToken.cancel() 方法
			if (this.cancelToken) {
				this.cancelToken.cancel()
				console.log('取消上传')
			}
			// 发送请求删除服务器上的文件
			// axios.post('/your-delete-api', { filename: file.name })
			//   .then(response => {
			//     console.log('文件已从服务器删除')
			//   })
			//   .catch(error => {
			//     console.log('文件删除失败：', error)
			//   })
		},
		handlePreview(file) {
			console.log('处理预览', file)
			file.raw = this.rawMap[file.uid] || file.raw
			Papa.parse(file.raw, {
				header: true,
				skipEmptyLines: true,
				complete: (result) => {
					// 获取解析后的数据
					const data = result.data
					// 更新预览表格的数据
					this.previewData = data
					this.previewFileName = file.name
					// 显示预览表格
					this.previewVisible = true
				},
				error: (error) => {
					// 解析错误时的处理逻辑
					console.error('解析错误:', error)
				}
			})
		},
		handleExceed(files, fileList) {
			console.log('处理超出', file)
			this.$message.warning('只能上传单个 indicator 文件')
		},
		beforeUpload(file) {
			console.log('上传前', file)
			// 备份文件对象的 raw 属性
			this.rawMap[file.uid] = this.rawMap[file.uid] || file.raw
			if (!/(CSV)/i.test(file.type)) {
				this.$message.warning('上传的文件只能是 CSV 格式')
				return false
			}
			const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
			if (!reg.test(file.name.replace('.csv', ''))) {
				this.$message.warning(
					'文件名以字母开头，并且只能够包含字母、数字和下划线'
				)
				return false
			}
			// 限制文件上传大小 1M
			if (file.size > 1 * 1024 * 1024) {
				this.$message.warning('上传的文件不能超过 1MB')
				return false
			}
			this.validateCSV(file)
			return false
		},
		handleUploadProgress(event, uid, fileList) {
			// 上传进度回调
			let { loaded, total } = event
			const progress = (loaded / total) * 100
			this.fileList = fileList.map((item) => {
				console.log('lishan item', item.uid, uid)
				console.log(item.uid)
				if (item.uid === uid) {
					item.progress = progress
				}
			})
			// const progress = Math.round(event.percent);
			// 自定义方式展示进度条
			// this.$refs.upload.$el.querySelector('.el-progress-bar__inner').style.width = progress + '%';
		},
		handleDialogClose() {
			console.log('弹窗关闭')
			this.$refs['customForm'].resetFields()
			this.dialogFormVisible = false
			const file = this.fileList[this.fileList.length - 1]
			this.uploadFile(file)
		},
		handleDialogConfirm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.fileList.map((item) => {
						const oldFileName = item.name
						const newFileName = oldFileName.replace(
							oldFileName.replace('.csv', ''),
							this.form.indicatorName
						)
						const file = this.fileList[this.fileList.length - 1]
						console.log('弹窗确认')
						const blob = file.slice(0, file.size, file.type)
						const newFile = new File([blob], newFileName, { type: file.type })
						newFile.uid = file.uid
						this.fileList.splice(-1, 1, newFile)
						this.dialogValid = true
						this.dialogFormVisible = false
						this.uploadFile(newFile)
					})
					// this.$refs.upload.submit()
					return
				}
			})
		},
		cancelIndicatorName(formName) {
			this.$refs[formName].resetFields()
			this.dialogFormVisible = false
		},
		validateCSV(file) {
			return new Promise((resolve, reject) => {
				// 限制字段
				let isDateFormat = true
				let isNumFormat = true
				const reader = new FileReader()
				reader.onload = (e) => {
					const content = e.target.result
					const hash = SparkMD5.hashBinary(reader.result);
					file.hash = hash
					// 使用 PapaParse 解析 CSV 文件内容
					const result = Papa.parse(content, {
						header: true, // 指定是否将第一行作为字段名
						skipEmptyLines: true,
						trimHeaders: true, // 去除表头中每个字段的空格
						trimRows: true, // 去除数据行中每个字段的空格
						step: function (row) {
							const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/
							const dateColumnIndex = 'Date'
							for (const key in row.data) {
								if (Object.hasOwnProperty.call(row.data, key)) {
									row.data[key] = row.data[key].trim()
								}
							}
							// const trimmedRow = row.data.map((value) => value.trim())
							const dateCell = row.data[dateColumnIndex]
							const numFormatRegex = /^\d+(\.\d{1,2})?$/
							const numColumnIndex = 'Close' // Change this to the index of the column you want to check
							const numCell = row.data[numColumnIndex]
							if (!dateFormatRegex.test(dateCell)) {
								console.log('日期格式校验失败')
								isDateFormat = false
								// parser.pause()
								return
							}
							if (!numFormatRegex.test(numCell)) {
								console.log('数字格式校验失败')
								isNumFormat = false
								// parser.pause()
								return
							}
							return
							// parser.resume()
						},
						complete: (results) => {
							console.log(results.data)
							// 在这里执行上传操作，仅上传符合要求的数据
						},
						error: (error) => {
							reject(error)
						}
					})
					// 获取解析结果
					const data = result.data
					// 进行字段校验
					const isVerified = this.validateFields(data)
					const lines = content.split('\n')
					// 获取 CSV 文件的字段顺序
					const fieldOrder = lines[0].trim().split(',')
					const isOrdered = this.validateCSVFieldOrder(fieldOrder)
					if (isVerified && isOrdered && isDateFormat && isNumFormat) {
						// this.progress = 0 // 每次上传前重置进度为0
						// this.fileList.push({
						// 	uid: file.uid,
						// 	name: file.name,
						// 	progress: 0, // 进度初始化为 0
						// 	status: 'uploading' // 状态设置为上传中
						// })
						this.form.indicatorName = file.name.replace('.csv', '')
						this.dialogFormVisible = true
						this.fileList.push(file)
						resolve(file)
					} // 校验通过，允许上传
					if (!isVerified) {
						reject(new Error('CSV字段校验失败'))
						return
					}
					if (!isOrdered) {
						reject(new Error('CSV字段顺序错误'))
						return
					}
					if (!isDateFormat) {
						this.$message.warning(
							`文件 Date 列数据格式错误，应为 yyyy-MM-dd, 如 2023-04-20`
						)
						reject(
							new Error(
								`文件 Date 列数据格式错误，应为 yyyy-MM-dd, 如 2023-04-20`
							)
						)
						return
					}
					if (!isNumFormat) {
						this.$message.warning(
							`文件 Close 列数据格式错误，应为数字，最多保存小数点后两位, 如 45.55`
						)
						reject(
							new Error(
								`文件 Close 列数据格式错误，应为数字，最多保存小数点后两位, 如 45.55`
							)
						)
						return
					}
				}
				reader.readAsText(file)
			})
		},
		validateFields(data) {
			// 在这里进行字段校验
			// 可以遍历解析后的数据对象数组，对每一行的字段进行校验
			// 如果有错误，将错误信息存储到一个数组中，并返回
			const errors = []
			data.forEach((row, index) => {
				if (!row.Date || !row.Close) {
					errors.push(`第 ${index + 1} 行字段校验未通过`)
				}
			})
			if (errors.length > 0) {
				// 如果有错误，显示错误信息
				this.$message.warning('字段名称校验未通过')
				return false
			}
			return true
		},
		validateCSVFieldOrder(fieldOrder) {
			// 在这里进行 CSV 字段顺序校验的逻辑
			const orderedValues = ['Date', 'Close'] // 规定顺序
			for (let i = 0; i < fieldOrder.length - 1; i++) {
				const currentIndex = orderedValues.indexOf(fieldOrder[i])
				const nextIndex = orderedValues.indexOf(fieldOrder[i + 1])
				// 首先名称存在，再判断顺序
				if (
					currentIndex !== -1 &&
					nextIndex !== -1 &&
					currentIndex > nextIndex
				) {
					this.$message.warning('字段顺序校验未通过')
					return false
				}
			}
			return true
		}
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