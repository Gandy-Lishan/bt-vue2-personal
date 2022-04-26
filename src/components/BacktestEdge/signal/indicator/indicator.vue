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
			<div
				class="indicator-container techBox"
				v-if="criteria === 'exit' && isShowRisk === panelIndex"
			>
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Risk Control"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="riskIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
							:disabled="!(indicatorRadio === 'Risk Control')"
							class="inline-input"
							clearable
							prefix-icon="el-icon-search"
							v-model="si.riskIndicator"
							:fetch-suggestions="indicatorRiskSearch"
							placeholder="Input the Risk Control Indicator"
							@select="handleRiskSelect"
						></el-autocomplete>
					</div>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>
<script>
import { Store, mapGetters } from 'vuex'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import {getIndicatorsList} from '@/service/service'
export default {
	props: {
		criteria: String,
		panelIndex: Number,
		isShowRisk: Number,
		editableTabsValue: String,
		editableTabs: Array,
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
				riskIndicator: ''
			},
			sentimentIndicatorList: this.$store.state.sentimentIndicatorList,
			rules: {
				sentimentIndicator: [{ validator: validateSenti, trigger: 'change' }],
				technicalIndicator: [{ validator: validateTech, trigger: 'change' }],
				riskIndicator: [{ validater: validateRisk, trigger: 'change' }]
			}
		}
	},
	computed: {
		updateSenti() {
			return this.$store.state.currentSenti
		},
		updateTech() {
			return this.$store.state.currentTech
		}
	},
	watch: {
		updateSenti(val) {
			let tabs = this.editableTabs
			var absoluteIndex = ''
			tabs.forEach((tab, index) => {
				if(tab.name==this.editableTabsValue){
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
						if(this.criteria == 'entry'){
							this.$store.commit('getEntryIndicators', {index: this.panelIndex, value: CIQ.indicatorList[i].url})
						}else{
							this.$store.commit('getExitIndicators', {index: this.panelIndex, value: CIQ.indicatorList[i].url})
						}

						// extract this statement from handleSentimentSelect
							let valObj = {}
							valObj.value = CIQ.indicatorList[i].chart_name
							valObj.index = this.panelIndex
							this.$emit('getIndicatorVal', valObj)

						//this.handleSentimentSelect({value:CIQ.indicatorList[i].chart_name,url:CIQ.indicatorList[i].url})
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
					// 暂时注释掉，因为大部分tech没有加到back test内
					this.indicatorRadio = 'Technical Indicators'
					//this.handleTechnicalSelect({value:item.value})
				}
			})
		}
	},
	methods: {
		// 清除表单认证
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
		},
		// sentiment search
		indicatorSentimentSearch(queryString, cb) {
			var sentimentIndicatorList = this.$store.state.sentimentIndicatorList
			var results = queryString
				? sentimentIndicatorList.filter(
						this.createStateSentimentFilter(queryString)
				  )
				: sentimentIndicatorList

			clearTimeout(this.sentimentTimeout)
			this.sentimentTimeout = setTimeout(() => {
				cb(results)
			}, 3000 * Math.random())
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
			// 调用 callback 返回建议列表的数据
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
			     // old version only
                var countExistIndicator = 0
                for (var studyInstanceName in CIQ.stxx.layout.studies) {
                    for (var i in CIQ.store.state.builtinList){
                        if(CIQ.store.state.builtinList[i].url == CIQ.stxx.layout.studies[studyInstanceName].type){countExistIndicator--}
                    }
					if(CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA'){
						countExistIndicator--
					}
					countExistIndicator++
                } 

                if(countExistIndicator>=5){
                    CIQ.description("Maximum 5 signals can be displayed on chart")
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
					(item) => item.url == this.$store.state.indicators.formIndicators.entry[this.panelIndex]
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getEntryIndicators', {index: this.panelIndex, value: item.url})
				console.log(this.$store.state.indicators.formIndicators.entry)
						let obj = {}
						obj.index = this.panelIndex
						obj.url = item.url
						this.$emit('getIndicatorUrl', obj)
					} else {
						var MAListIndex = activatedMAList.findIndex(
							(item) => item.url == this.$store.state.indicators.formIndicators.exit[this.panelIndex]
						)
						if (MAListIndex != -1) {
							activatedMAList.splice(MAListIndex, 1)
						}
						this.$store.commit('getMA', activatedMAList)
						this.$store.commit('getExitIndicators', {index: this.panelIndex, value: item.url})
												let obj = {}
								obj.index = this.panelIndex
								obj.url = item.url
								this.$emit('getIndicatorUrl', obj)
					}
			console.log('current formIndicator: ',this.$store.state.indicators.formIndicators)
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
			// technical 的名字， 用于 description 显示
			let valObj = {}
			valObj.index = this.panelIndex
			valObj.value = item.value
			this.$emit('getIndicatorVal', valObj)
			const vm = this
			let val = item.value
			// const set = new Set([
			// 	['Commodity Channel Index', 'cci'],
			// 	['Relative Strength Index', 'rsi'],
			// 	['Moving Average', 'ma'],
			// 	['MACD', 'macd']
			// ])
			// const newMap = new Map(set)
			let url = item.url
			// for (let i of newMap.entries()) {
			// if (val === i[0]) {
			// url = i[1]
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
					(ma) => ma.url == this.$store.state.indicators.formIndicators.entry[this.panelIndex]
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				CIQ.store.commit('getMA', activatedMAList)
				this.$store.commit('getEntryIndicators', {index: this.panelIndex, value: url})
			} else {
				// remove MA from Vuex after loading Tech
				var activatedMAList = CIQ.store.state.activatedMA

				var MAListIndex = activatedMAList.findIndex(
					(ma) => ma.url == this.$store.state.indicators.formIndicators.exit[this.panelIndex]
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}

				CIQ.store.commit('getMA', activatedMAList)
				this.$store.commit('getExitIndicators', {index: this.panelIndex, value: url})
			}
			// store tech indicators in Vuex and use it in addIndicator to test if a member in list is belong to tech
			let techIndicators = []
			techIndicators.push(...CIQ.store.state.indicators.technicalIndicators)
			techIndicators.push(url)
			this.$store.commit('getTechnicalIndicators', techIndicators)

			// avoid add indicator redundantly
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]
				if (sd.type == url) {
					return
				}
			}

			// }
			// }
			vm.si.technicalIndicator = item.value

			if(arguments[1]!=true){
				CIQ.addIndicators()
			}
			
		},
		handleRiskSelect(item) {
			this.si.riskIndicator = item.value
			let obj = {}
			obj.value = item.value
			obj.index = this.panelIndex
			this.$emit('getRiskVal', obj)
			let val = item.value
			const set = new Set([
				['Time In Market', 'tim'],
				['Profit/Loss', 'pl']
			])
			const newMap = new Map(set)
			var url = ''
			for (let i of newMap.entries()) {
				if (val === i[0]) {
					url = i[1]
					this.$emit('getRiskIndiValue', i[1])
				}
				// this.$store.commit('getExitIndicators', 'Exit')
				// this.$store.commit('getRiskIndicators', 'RC')
			}
		},
		changeIndicatorChecked(val) {
			console.log('改变组件里面的radio', val)
			this.indicatorRadio = val
			this.clearFormValidate()
			const arr = [
				'Sentiment Indicators',
				'Technical Indicators',
				'Risk Control'
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
			// 在 vuex 中存入 formatList
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
			if (this.indicatorRadio === 'Sentiment Indicators') {
				this.$refs.siForm.validate((valid) => {
					validForm = valid
				})
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
							message: 'Please select indicator from the drop-down box',
							type: 'error',
							offset: 300
						})
					}
					checked = false
					return checked
				}
			} else if (this.indicatorRadio === 'Technical Indicators') {
				this.$refs.siForm.validate((valid) => {
					validForm = valid
				})
				let formateList = this.$store.state.formateTechnicalList
				if (formateList.length === 0) {
					vm.loadShortLong()
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
							message: 'Please select indicator from the drop-down box',
							type: 'error',
							offset: 300
						})
					}
					checked = false
					return checked
				}
			} else if (this.indicatorRadio === 'Risk Control') {
				this.$refs.siForm.validate((valid) => {
					validForm = valid
				})
				let formateList = this.loadRiskList()
				for (let i = 0; i < formateList.length; i++) {
					if (this.si.riskIndicator === formateList[i].value) {
						validName = true
						break
					}
				}
				if (validForm && validName) {
					let obj = {}
					obj.criteria = 'exit'
					obj.index = index
					obj.value = 'Risk Control'
					this.$store.commit('getRiskValue', obj)
					return checked
				} else {
					if (!validName) {
						this.$message({
							message: 'Please select indicator from the drop-down box',
							type: 'error',
							offset: 300
						})
					}
					checked = false
					return checked
				}
			}
		},
		async setEditData(newVal) {
			console.log("indicator编辑的数据",newVal);
			console.log("判断数据",newVal[this.criteria].signals[this.panelIndex]);
			if (JSON.stringify(newVal) != '{}') {
				this.clearFormValidate()
				let index = this.panelIndex
				let vm = this
				if (newVal[this.criteria].signals[index].analysis === 'Sentiment') {
					// let obj = {}
					// obj.value = 'sentiment'
					// obj.index = index
					// this.$emit('getIndicatorRadio', 'sentiment')
					// this.$emit('getSentiVal', this.si.sentimentIndicator)
					this.indicatorRadio = 'Sentiment Indicators'
					this.si.sentimentIndicator =
						newVal[this.criteria].signals[index].indicator
					// 往父组件传值
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
						
					})}

					let indi = this.si.sentimentIndicator
					sentimentList.forEach((item) => {
						if (indi.toUpperCase() == item.value.toUpperCase()) {
						let obj = {}
						obj.index = vm.panelIndex
						obj.url = item.url
						vm.$emit('getIndicatorUrl', obj)
						}
					})
					// if(this.$store.state.sentimentIndicatorList)
				}
				if (newVal[this.criteria].signals[index].analysis === 'Technical') {
					// let obj = {}
					// obj.value = 'technical'
					// obj.index = index
					// this.$emit('getIndicatorRadio', 'technical')
			console.log("进入technical");
					vm.indicatorRadio = 'Technical Indicators'
					let technicalIndicator =
						newVal[this.criteria].signals[index].indicator
					vm.si.technicalIndicators = technicalIndicator
					let formateList = this.$store.state.formateTechnicalList
					if (formateList.length === 0) {
						this.loadShortLong()
					}
					for (let i = 0; i < formateList.length; i++) {
						if (technicalIndicator === formateList[i].value) {
							let obj = formateList[i]
							let isFromEdit = true
							vm.handleTechnicalSelect(obj,isFromEdit)
							break
						}
					}
				}
				if (newVal[this.criteria].signals[index].analysis === 'Exit') {
					this.indicatorRadio = 'Risk Control'
					let obj = {}
					if (newVal[this.criteria].signals[index].time_in_market) {
						obj.value = 'Time In Market'
					}
					if (
						newVal[this.criteria].signals[index].stop_loss &&
						newVal[this.criteria].signals[index].take_profit
					) {
						obj.value = 'Profit/Loss'
					}
					this.handleRiskSelect(obj)
				}
		}
	}
}
}
</script>
<style lang="less" scoped>
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
</style>