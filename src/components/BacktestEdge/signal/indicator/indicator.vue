<template>
	<div class="indicator-box">
		<el-form :model="si" ref="siForm">
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
							:disabled="
								indicatorRadio === 'Sentiment Indicators' ? false : true
							"
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
							:disabled="
								indicatorRadio === 'Technical Indicators' ? false : true
							"
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
			<div class="indicator-container techBox" v-if="criteria == 'exit'">
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
							:disabled="indicatorRadio === 'Risk Control' ? false : true"
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
import deepClone1 from '@/tools/deepClone.js'
export default {
	props: {
		// indicatorEditData: Object
		criteria: String
	},
	data() {
		var validateSenti = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('Please choose sentiment indicator'))
			} else {
				callback()
			}
		}
		var validateTech = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('Please choose technical indicator'))
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
			isCheckedIndicators: false,
			sentimentIndicatorList: this.$store.state.sentimentIndicatorList
		}
	},
	computed: {
		...mapGetters(['getIsClearForm']),
		isClearForm() {
			return this.getIsClearForm
		},
		updateSenti(){
			return this.$store.state.currentSenti
		},
		updateTech(){
			return this.$store.state.currentTech
		}
	},
	watch: {
		updateSenti(val){
			this.si.sentimentIndicator = val.name
			this.indicatorRadio = 'Sentiment Indicators'
		},
		updateTech(val){
			var builtinList = this.$store.state.builtinList
			builtinList.find(item => {
				if(item.url == val.url){
					this.si.technicalIndicator = item.value
					this.indicatorRadio = 'Technical Indicators'
				}
			})	
		},
		isClearForm: {
			handler(newVal) {
				let init = deepClone1(this.$options.data())
				Object.assign(this.$data, init)
			}
		}
		// editIndiData: {
		// 	async handler(newVal) {
		// 		if (JSON.stringify(newVal) != '{}') {
		// 			let vm = this
		// 			if (newVal[this.criteria].signals[0].analysis === 'Sentiment') {
		// 				this.$emit('getIndicatorRadio', 'sentiment')
		// 				this.$emit('getSentiVal', this.si.sentimentIndicator)
		// 				this.indicatorRadio = 'Sentiment Indicators'
		// 				this.isCheckedIndicators = false
		// 				this.si.sentimentIndicator =
		// 					newVal[this.criteria].signals[0].indicator
		// 				// 往父组件传值
		// 				let sentimentList = this.$store.state.sentimentIndicatorList
		// 				if (sentimentList.length == 0) {
		// 					const res = await this.$http.get(
		// 						'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
		// 						{
		// 							auth: {
		// 								username: 'sentimentrader_backtest_api',
		// 								password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
		// 							}
		// 						}
		// 					)
		// 					sentimentList = res.data.map((obj) => {
		// 						console.log(
		// 							frequency.toUpperCase().indexOf(obj.updated.toUpperCase())
		// 						)
		// 						if (
		// 							frequency.toUpperCase().indexOf(obj.updated.toUpperCase()) !==
		// 							-1
		// 						) {
		// 							if (obj.chart_name && obj.url && obj.updated) {
		// 								return {
		// 									value: obj.chart_name,
		// 									url: obj.url,
		// 									updated: obj.updated
		// 								}
		// 							}
		// 						}
		// 					})
		// 				}
		// 				let indi = this.si.sentimentIndicator
		// 				sentimentList.forEach((obj) => {
		// 					if (indi.toUpperCase() == obj.value.toUpperCase()) {
		// 						vm.$emit('getSentiUrl', obj.url)
		// 					}
		// 				})
		// 				// if(this.$store.state.sentimentIndicatorList)
		// 			} else if (
		// 				newVal[this.criteria].signals[0].analysis === 'Technical'
		// 			) {
		// 				this.$emit('getIndicatorRadio', 'technical')
		// 				let technicalIndicator = newVal[this.criteria].signals[0].indicator
		// 				let item = {}
		// 				item.value = technicalIndicator
		// 				vm.handleTechnicalSelect(item)
		// 				this.indicatorRadio = 'Technical Indicators'
		// 				this.isCheckedIndicators = true
		// 				this.$emit('getTechVal', vm.si.technicalIndicator)
		// 			}
		// 		}
		// 	},
		// 	deep: true
		// }
	},
	methods: {
		//  load sentiment list

		async loadSentimentList() {
			const vm = this
			var frequency = vm.$store.state.backtestInfo['entry']['frequency']
			var indicatorList = []

			if (this.$store.state.indicatorsList.length != 0) {
				console.log(
					'data in indicatorList from indicator-part',
					this.$store.state.indicatorsList.length
				)
				indicatorList = this.$store.state.indicatorsList
			} else {
				const res = await vm.$http.get(
					'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
					{
						auth: {
							username: 'sentimentrader_backtest_api',
							password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
						}
					}
				)
				indicatorList = res.data
			}
			vm.sentimentIndicatorList = indicatorList.map((obj) => {
				if (frequency.toUpperCase().indexOf(obj.updated.toUpperCase()) !== -1) {
					if (obj.chart_name && obj.url && obj.updated) {
						return { value: obj.chart_name, url: obj.url, updated: obj.updated }
					}
				}
			})
			this.$store.commit('getIndicatorsList', indicatorList)
			this.$store.commit('getSentimentList', vm.sentimentIndicatorList)
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
				return (
					state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
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
						.indexOf(queryString.toLowerCase()) === 0
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
						.indexOf(queryString.toLowerCase()) === 0
				)
			}
		},
		handleSentimentSelect(item) {
			// const obj = {}
			// obj.criteria = this.criteria
			// obj.index = this.tabIndex
			// obj.value = item.value
			// this.$store.commit('clearSignal', obj)
			this.si.sentimentIndicator = item.value
			this.$emit('getSentiVal', item.value)
			// remove a MA tat already exists in current criteria before loadin
			var activatedMAList = this.$store.state.activatedMA

			if (this.criteria == 'entry') {
				var MAListIndex = activatedMAList.findIndex(
					(item) =>
						item.url == this.$store.state.indicators.formIndicators.entry
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getEntryIndicators', item.url)
				this.$emit('getSentiUrl', item.url)
			} else {
				var MAListIndex = activatedMAList.findIndex(
					(item) => item.url == this.$store.state.indicators.formIndicators.exit
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getExitIndicators', item.url)
				this.$emit('getSentiUrl', item.url)
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
			// const obj = {}
			// obj.criteria = this.criteria
			// obj.index = this.tabIndex
			// obj.value = item.value
			// this.$store.commit('clearSignal', obj)
			this.si.technicalIndicator = item.value
			this.$emit('getTechVal', item.value)
			const vm = this
			let val = item.value
			const set = new Set([
				['Commodity Channel Index', 'cci'],
				['Relative Strength Index', 'rsi'],
				['Moving Average', 'ma'],
				['MACD', 'macd']
			])

			const newMap = new Map(set)
			var url = ''
			for (let i of newMap.entries()) {
				if (val === i[0]) {
					url = i[1]
					this.$emit('getTechIndiValue', i[1])
					// remove a MA tat already exists in current criteria before loadin
					if (this.criteria == 'entry') {
						// remove MA from Vuex after loading Tech
						var activatedMAList = CIQ.store.state.activatedMA

						var MAListIndex = activatedMAList.findIndex(
							(ma) =>
								ma.url == this.$store.state.indicators.formIndicators.entry
						)
						if (MAListIndex != -1) {
							activatedMAList.splice(MAListIndex, 1)
						}
						CIQ.store.commit('getMA', activatedMAList)
						this.$store.commit('getEntryIndicators', i[1])
					} else {
						// remove MA from Vuex after loading Tech
						var activatedMAList = CIQ.store.state.activatedMA

						var MAListIndex = activatedMAList.findIndex(
							(ma) => ma.url == this.$store.state.indicators.formIndicators.exit
						)
						if (MAListIndex != -1) {
							activatedMAList.splice(MAListIndex, 1)
						}

						CIQ.store.commit('getMA', activatedMAList)
						this.$store.commit('getExitIndicators', i[1])
					}
					// store tech indicators in Vuex and use it in addIndicator to test if a member in list is belong to tech
					let techIndicators = []
					techIndicators.push(...CIQ.store.state.indicators.technicalIndicators)
					techIndicators.push(i[1])
					this.$store.commit('getTechnicalIndicators', techIndicators)

					console.log('TechnicalSelect MA LIST', CIQ.store.state.activatedMA)

					// avoid add indicator redundantly
					for (var studyInstanceName in CIQ.stxx.layout.studies) {
						var sd = CIQ.stxx.layout.studies[studyInstanceName]
						if (sd.type == url) {
							return
						}
					}
					CIQ.addIndicators()
				}
			}
			vm.si.technicalIndicator = item.value
		},
		handleRiskSelect(item) {
			this.si.riskIndicator = item.value
			this.$emit('getRiskVal', item.value)
			let val = item.value
			const set = new Set([
				['Take Profit', 'tp'],
				['Stop Loss', 'sl'],
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
			console.log('事件的值', val)
			this.indicatorRadio = val
			console.log('indicatorRadio', this.indicatorRadio)
			this.isCheckedIndicators = !this.isCheckedIndicators
			const arr = [
				'Sentiment Indicators',
				'Technical Indicators',
				'Risk Control'
			]
			const obj = {}
			obj.criteria = this.criteria
			obj.index = 0
			this.$store.commit('deleteIndicator', obj)
			if (this.indicatorRadio === arr[0]) {
				this.$emit('getIndicatorRadio', 'sentiment')
				this.$store.commit('getEntryIndicatorRadio', 'sentiment')
			} else if (this.indicatorRadio === arr[1]) {
				this.$emit('getIndicatorRadio', 'technical')
				this.$store.commit('getEntryIndicatorRadio', 'technical')
			} else if (this.indicatorRadio === arr[2]) {
				this.$emit('getIndicatorRadio', 'risk')
				this.$store.commit('getEntryIndicatorRadio', 'risk')
			}
		},
		// load short and long technical list
		loadShortLong() {
			return [
				{ value: 'Commodity Channel Index' },
				{ value: 'Relative Strength Index' },
				{ value: 'MACD' },
				{ value: 'Moving Average' }
			]
		},
		loadRiskList() {
			return [
				{ value: 'Take Profit' },
				{ value: 'Stop Loss' },
				{ value: 'Time In Market' },
				{ value: 'Profit/Loss' }
			]
		},
		// setIndicatorRadio(obj) {
		// 	let vm = this
		// 	this.indicatorRadio = obj.radio
		// 	var data = Object.assign(obj)
		// 	if (data.sentimentIndicator) {
		// 		vm.si['sentimentIndicator'] = data['sentimentIndicator']
		// 		vm.$set(vm.si, 'sentimentIndicator', data.sentimentIndicator)
		// 		this.$emit('getSentiVal', data.sentimentIndicator)
		// 		const sentiObj = data
		// 		sentiObj.value = sentiObj.sentimentIndicator
		// 		this.$store.commit('getSentiValue', sentiObj)
		// 		this.isCheckedIndicators = false
		// 	} else if (data.technicalIndicator) {
		// 		vm.$set(this.si, 'technicalIndicator', obj.technicalIndicator)
		// 		this.$emit('getTechVal', obj.technicalIndicator)
		// 		const sentiObj = data
		// 		sentiObj.value = sentiObj.technicalIndicator
		// 		this.$store.commit('getTechValue', sentiObj)
		// 		this.isCheckedIndicators = true
		// 	}
		// },
		saveIndicator() {
			let checked = true
			if (this.indicatorRadio === 'Sentiment Indicators') {
				if (this.si.sentimentIndicator) {
					let obj = {}
					obj.criteria = this.criteria
					obj.index = 0
					obj.value = this.si.sentimentIndicator
					this.$store.commit('getSentiValue', obj)
					return checked
				} else {
					this.$message.error(
						'Please select' + ' ' + this.criteria + ' ' + 'sentiment indicator'
					)
					checked = false
					return checked
				}
			} else if (this.indicatorRadio === 'Technical Indicators') {
				if (this.si.technicalIndicator) {
					let obj = {}
					obj.criteria = this.criteria
					obj.index = 0
					obj.value = this.si.technicalIndicator
					this.$store.commit('getTechValue', obj)
					return checked
				} else {
					this.$message.error(
						'Please select' + ' ' + this.criteria + ' ' + ' technical indicator'
					)
					checked = false
					return checked
				}
			} else if (this.indicatorRadio === 'Risk Control') {
				if (this.si.riskIndicator) {
					let obj = {}
					obj.criteria = 'exit'
					obj.index = 0
					obj.value = 'RC'
					this.$store.commit('getRiskValue', obj)
					return checked
				} else {
					this.$message.error(
						'Please select' + ' ' + this.criteria + ' ' + ' risk indicator'
					)
					checked = false
					return checked
				}
			}
		},
		async setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let vm = this
				if (newVal[this.criteria].signals[0].analysis === 'Sentiment') {
					this.$emit('getIndicatorRadio', 'sentiment')
					// this.$emit('getSentiVal', this.si.sentimentIndicator)
					this.indicatorRadio = 'Sentiment Indicators'
					this.isCheckedIndicators = false
					this.si.sentimentIndicator =
						newVal[this.criteria].signals[0].indicator
					// 往父组件传值
					let sentimentList = this.$store.state.sentimentIndicatorList
					if (sentimentList.length == 0) {
						const res = await this.$http.get(
							'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
							{
								auth: {
									username: 'sentimentrader_backtest_api',
									password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
								}
							}
						)
						sentimentList = res.data.map((obj) => {
							console.log(
								frequency.toUpperCase().indexOf(obj.updated.toUpperCase())
							)
							if (
								frequency.toUpperCase().indexOf(obj.updated.toUpperCase()) !==
								-1
							) {
								if (obj.chart_name && obj.url && obj.updated) {
									return {
										value: obj.chart_name,
										url: obj.url,
										updated: obj.updated
									}
								}
							}
						})
					}
					let indi = this.si.sentimentIndicator
					sentimentList.forEach((obj) => {
						if (indi.toUpperCase() == obj.value.toUpperCase()) {
							vm.$emit('getSentiUrl', obj.url)
						}
					})
					// if(this.$store.state.sentimentIndicatorList)
				} else if (newVal[this.criteria].signals[0].analysis === 'Technical') {
					this.$emit('getIndicatorRadio', 'technical')
					let technicalIndicator = newVal[this.criteria].signals[0].indicator
					let item = {}
					item.value = technicalIndicator
					vm.handleTechnicalSelect(item)
					this.indicatorRadio = 'Technical Indicators'
					this.isCheckedIndicators = true
					// this.$emit('getTechVal', vm.si.technicalIndicator)
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
