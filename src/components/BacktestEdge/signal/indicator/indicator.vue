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
import {getIndicatorsList} from '@/service/service'
export default {
	props: {
		criteria: String
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
			if (
				this.si.sentimentIndicator == '' &&
				this.si.technicalIndicator == '' && 
				this.si.riskIndicator == ''
			) {

				this.si.sentimentIndicator = val.name

				for (var i in CIQ.indicatorList) {
					if (CIQ.indicatorList[i].chart_name == val.name) {
						this.indicatorRadio = 'Sentiment Indicators'
						if(this.criteria == 'entry'){
							this.$store.commit('getEntryIndicators', CIQ.indicatorList[i].url)
						}else{
							this.$store.commit('getExitIndicators', CIQ.indicatorList[i].url)
						}
						// extract this statement from handleSentimentSelect.
						this.$emit('getSentiVal', CIQ.indicatorList[i].chart_name)						
						//this.handleSentimentSelect({value:CIQ.indicatorList[i].chart_name,url:CIQ.indicatorList[i].url})
						this.$emit('getSentiUrl', CIQ.indicatorList[i].url)
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
					//this.indicatorRadio = 'Technical Indicators'
					
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
			this.clearFormValidate()
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
			this.$emit('getSentiVal', item.value)
			// remove a MA tat already exists in current criteria before loading
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

					// avoid add indicator redundantly
					for (var studyInstanceName in CIQ.stxx.layout.studies) {
						var sd = CIQ.stxx.layout.studies[studyInstanceName]
						if (sd.type == url) {
							return
						}
					}
					if (arguments[1] != true) {
						CIQ.addIndicators()
					}
				}
			}
			vm.si.technicalIndicator = item.value
		},
		handleRiskSelect(item) {
			this.si.riskIndicator = item.value
			this.$emit('getRiskVal', item.value)
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
			this.indicatorRadio = val
			this.clearFormValidate()
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
			const technicalObj = CIQ.technicalCategory
			let formatObj = []
			return [
				{ value: 'Commodity Channel Index' },
				{ value: 'Relative Strength Index' },
				{ value: 'MACD' },
				{ value: 'Moving Average' }
			]
		},
		loadRiskList() {
			return [{ value: 'Time In Market' }, { value: 'Profit/Loss' }]
		},
		async saveIndicator() {
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
					obj.index = 0
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
						formateList = this.loadShortLong()
					}
				console.log(formateList)
				for (let i = 0; i < formateList.length; i++) {
					if (this.si.technicalIndicator === formateList[i].value) {
						validName = true
						break
					}
				}
				if (validForm && validName) {
					let obj = {}
					obj.criteria = this.criteria
					obj.index = 0
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
					obj.index = 0
					obj.value = 'RC'
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
			if (JSON.stringify(newVal) != '{}') {
				this.clearFormValidate()
				let vm = this
				if (newVal[this.criteria].signals[0].analysis === 'Sentiment') {
					this.$emit('getIndicatorRadio', 'sentiment')
					// this.$emit('getSentiVal', this.si.sentimentIndicator)
					this.indicatorRadio = 'Sentiment Indicators'
					this.si.sentimentIndicator =
						newVal[this.criteria].signals[0].indicator
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
					let isFromEdit = true
					vm.handleTechnicalSelect(item, isFromEdit)
					this.indicatorRadio = 'Technical Indicators'
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
@media (min-width: 1680px) {
	/deep/ .sentiBox .el-input--prefix .el-input__inner:first-child {
		width: 500px;
		padding-left: 30px;
	}
	/deep/ .techBox .el-input--prefix .el-input__inner:first-child {
		width: 500px;
		padding-left: 30px;
	}
}

@media (min-width: 1280px) and (max-width: 1365px) {
	/deep/ .sentiBox .el-input--prefix .el-input__inner:first-child {
		width: 300px;
		padding-left: 30px;
	}
	/deep/ .techBox .el-input--prefix .el-input__inner:first-child {
		width: 300px;
		padding-left: 30px;
	}
}
@media (min-width: 820px) and (max-width: 1279px) {
	/deep/ .sentiBox .el-input--prefix .el-input__inner:first-child {
		width: 500px;
		padding-left: 30px;
	}
	/deep/ .techBox .el-input--prefix .el-input__inner:first-child {
		width: 500px;
		padding-left: 30px;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	/deep/ .sentiBox .el-input--prefix .el-input__inner:first-child {
		width: 400px;
		padding-left: 30px;
	}
	/deep/ .techBox .el-input--prefix .el-input__inner:first-child {
		width: 400px;
		padding-left: 30px;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	/deep/ .sentiBox .el-input--prefix .el-input__inner:first-child {
		width: 232px;
		padding-left: 22px;
	}
	/deep/ .techBox .el-input--prefix .el-input__inner:first-child {
		width: 232px;
		padding-left: 22px;
	}
	.indicator-container {
		display: flex;
		flex-direction: column;
		// justify-content: center;
		// align-items: center;
	}
}
</style>
