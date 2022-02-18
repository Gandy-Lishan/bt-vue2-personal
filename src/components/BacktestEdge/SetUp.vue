<template>
	<div class="backtest_container">
		<el-form ref="backtestSetupForm" :model="bd" label-position="left">
			<el-row>
				<el-col :xs="15" :sm="14" :md="12" :lg="12" :xl="12">
					<el-form-item label="Starting Capital:" prop="startingCapital">
						<el-input
							v-model="bd.capital"
							@input="validateStartingCapital"
							oninput="value=value.replace(/[^\d.]/g,'')"
						></el-input>
					</el-form-item>
					<el-form-item label="Commission:" prop="commission">
						<el-input
							v-model="temp.commission"
							@change="getCommission"
							@input="validateCommission"
							oninput="value=value.replace(/[^\d.]/g,'')"
						></el-input>
					</el-form-item>

					<span class="comUnitNote">(%)</span>
					<el-form-item label="Slippage:" prop="slippage">
						<el-input
							v-model="bd.slippage"
							oninput="value=value.replace(/[^\d.]/g,'')"
						></el-input> </el-form-item
					><span class="sliUnitNote">(per trade)</span>
					<el-form-item label="Benchmark:" prop="benchmark">
						<div class="enterSymbolBox">
							<el-select
								v-model="bd.benchmark"
								id="symbolName"
								filterable
								remote
								reserve-keyword
								automatic-dropdown
								@change="getBenchmark(bd.benchmark)"
								placeholder="enter keywords"
								:remote-method="remoteMethod"
								:loading="loading"
							>
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</div>
					</el-form-item>
					<!-- <el-form-item label="Money Management:" prop="moneyManagement">
						<div class="selectBox">
							<el-select
								v-model="mmValue"
								@change="getSizeAllocationValue(mmValue)"
								placeholder="Pleace select"
							>
								<el-option
									v-for="item in mmOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</div>
					</el-form-item> -->
				</el-col>
				<el-col :xs="15" :sm="14" :md="12" :lg="12" :xl="12" :span="2">
					<el-form-item label="Backtest Period:" prop="backtestHistory">
						<div class="selectBox">
							<el-select
								@change="getBacktestHistory(historyValue)"
								v-model="historyValue"
								placeholder="— Select Timeframe —"
							>
								<el-option
									v-for="item in historyOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</div>
					</el-form-item>
					<div class="dateBox">
						<el-form-item label="Start date:">
							<el-date-picker
								v-if="historyValue === 22"
								v-model="bd.start_date"
								@change="formateStartDate"
								type="date"
								placeholder="- Select Start Date -"
								prop="startDate"
							>
							</el-date-picker>
							<el-input v-else disabled v-model="bd.start_date"> </el-input>
						</el-form-item>
					</div>
					<div class="dateBox">
						<el-form-item label="End date:" prop="endDate">
							<el-date-picker
								v-if="historyValue === 22"
								v-model="bd.end_date"
								@change="formateEndDate"
								type="date"
								placeholder="- Select End Date -"
							>
							</el-date-picker>
							<el-input v-else disabled v-model="bd.end_date"> </el-input>
						</el-form-item>
					</div>
					<el-form-item label="Timeframe:" prop="frequency">
						<div class="selectBox">
							<el-select
								v-model="frequency"
								placeholder="— Select Timeframe —"
								@change="getFrequency"
							>
								<el-option
									v-for="item in frequencyOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<div class="nameBox">
					<el-form-item
						label="Backtest Name:"
						prop="name"
						placeholder="Give the backtest a name"
					>
						<el-input v-model="bd.name"></el-input>
					</el-form-item>
				</div>
			</el-row>
			<el-row>
				<div class="border-set">
					<el-form-item label="Direction:" prop="direction">
						<el-radio-group v-model="direction" @change="getDirection">
							<el-radio label="Long">Long</el-radio>
							<el-radio label="Short">Short</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
			</el-row>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
import { timestampToTime } from '@/tools/formatDate.js'
import deepClone1 from '@/tools/deepClone.js'
const _ = require('lodash')
export default {
	props: { backtestEditData: Object, editFrequency: String },
	name: 'setUp',
	data() {
		return {
			bd: {
				name: '',
				symbol: 'SPY',
				benchmark: 'SPY',
				strategy: 'Signal',
				capital: 100000.0,
				capital_alloc: 1.0,
				commission: 0.001,
				win_rate: 0.0,
				slippage: 0.1,
				start_date: '',
				end_date: '',
				description: 'backtest'
			},
			frequency: 'Daily',
			historyOptions: [
				{
					value: 1,
					label: '1 Year'
				},
				{
					value: 2,
					label: '2 Year'
				},
				{
					value: 3,
					label: '3 Year'
				},
				{
					value: 4,
					label: '4 Year'
				},
				{
					value: 5,
					label: '5 Year'
				},
				{
					value: 10,
					label: '10 Year'
				},
				{
					value: 15,
					label: '15 Year'
				},
				{
					value: 20,
					label: '20 Year'
				},
				{
					value: 21,
					label: 'All History'
				},
				{
					value: 22,
					label: 'Custom...'
				}
			],
			frequencyOptions: [
				{ value: 'Daily', label: 'Daily' },
				{ value: 'Weekly', label: 'Weekly' },
				{ value: 'Monthly', label: 'Monthly' }
			],
			mmValue: 0,
			mmOptions: [
				{
					value: 0,
					label: 'All In / All Out (CASH)'
				}
			],
			historyValue: 1,
			symbolList: [],
			indexList: [],
			loading: false,
			options: [],
			temp: { commission: '0.1', slippage: '0.1' },
			sentimentIndicatorList: [],
			direction: 'Long'
		}
	},
	mounted() {
		this.getIndicatorsList()
		this.loadSentimentList('Daily')
		this.getIndexsList()
		this.getStocksList()
		this.getEndDate()
	},
	computed: {
		// listSet() {
		// 	return this.symbolList.map((item) => {
		// 		return { value: `${item.stock}`, label: `${item.stock}` }
		// 	})
		// },
		// indexSet() {
		// 	return this.indexList.map((item) => {
		// 		return { value: `${item.symbol}`, label: `${item.symbol}` }
		// 	})
		// },
		...mapGetters(['getIsClearForm']),
		isClearForm() {
			return this.getIsClearForm
		},
		updateFreq() {
			return this.$store.state.pairDataFreq
		}
	},
	watch: {
		updateFreq(val) {
			switch (val) {
				case 'daily': {
					this.getFrequency('Daily')
					break
				}
				case 'weekly': {
					this.getFrequency('Weekly')
					break
				}
				case 'monthly': {
					this.getFrequency('Monthly')
					break
				}
			}
		},
		backtestEditData: {
			handler(newVal) {
				if (JSON.stringify(newVal) != '{}') {
					delete newVal.entry
					delete newVal.exit
					delete newVal.user_id
					delete newVal.status
					delete newVal.results
					delete newVal.uuid
					this.bd = Object.assign(this.bd, newVal)
					this.getSymbolName(newVal.symbol)
					this.frequency = this.editFrequency
					this.getFrequency(this.frequency)
					// console.log('频率', this.frequency)
					this.temp.commission = Number(newVal.commission) * 100
					this.temp.slippage = Number(newVal.slippage) * 100
					let year
					let month
					let day
					if (newVal.start_date && newVal.start_date !== '1800-10-01') {
						const starArr = newVal.start_date.toString().split('-')
						const endArr = newVal.end_date.toString().split('-')
						year = Number(endArr[0]) - Number(starArr[0])
						month = Number(endArr[1]) - Number(starArr[1])
						day = Number(endArr[2]) - Number(starArr[2])
						if (month == 0 && day == 0) {
							this.historyValue = year
						} else {
							this.historyValue = 22
						}
					} else {
						this.historyValue = 21
						this.bd.start_date = ''
					}
				}
			}
		},
		isClearForm: {
			handler(newVal) {
				let init = deepClone1(this.$options.data())
				Object.assign(this.$data, init)
				this.getEndDate()
			}
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.getEndDate()
		},
		getDirection(val) {
			// direction 设置到 vuex
			this.$store.commit('getExitDirection', val)
			// 设置 entry 和 exit 的 direction
			this.$emit('setDirection', val)
		},
		setEditDirection(val) {
			this.direction = val
			console.log('setup的方向', val)
		},
		validateCommission(val) {
			let list = val.split('.')
			if (list.length === 2) {
				let temp = ''
				if (list[0].search(/^[1-9]?\d{1}?$/) !== -1) temp = list[0]
				else {
					temp = list[0].substring(0, 2)
				}

				if (list[1].search(/^\d{0,3}?$/) !== -1) temp = temp + '.' + list[1]
				else {
					temp = temp + '.' + list[1].substring(0, 3)
				}

				this.temp.commission = temp
			} else if (list.length === 1) {
				if (list[0].search(/^[1-9]?\d{1}?$/) !== -1)
					this.bd.commission = list[0]
				else {
					this.temp.commission = list[0].substring(0, 2)
				}
			}
			// let re = /[1-9]{0,2}?0?\.?\d{0,2}?/g
			// if (val.search(re) !== -1) {
			// 	this.bd.commission = val
			// } else {
			// 	this.bd.commission = ''
			// }
		},
		validateSlippage(val) {
			let list = val.split('.')
			if (list.length === 2) {
				let temp = ''
				if (list[0].search(/^[1-9]?\d{1}?$/) !== -1) temp = list[0]
				else {
					temp = list[0].substring(0, 2)
				}

				if (list[1].search(/^\d{0,3}?$/) !== -1) temp = temp + '.' + list[1]
				else {
					temp = temp + '.' + list[1].substring(0, 3)
				}

				this.temp.slippage = temp
			} else if (list.length === 1) {
				if (list[0].search(/^[1-9]?\d{1}?$/) !== -1) this.bd.slippage = list[0]
				else {
					this.temp.slippage = list[0].substring(0, 2)
				}
			}
		},
		validateStartingCapital(val) {
			let re = /^\d+\.?\d{0,2}$/
			if (val.search(re) !== -1) {
				this.bd.capital = val
			} else if (val.search(/^\d+\.?\d+/) !== -1) {
				this.bd.capital =
					val.split('.')[0] + '.' + val.split('.')[1].substring(0, 2)
			} else {
				this.bd.capital = ''
			}
		},
		getSymbolName(val) {
			this.$store.commit('getSymbolName', val)
			// 清空 两个表单的方法
			// this.$emit('resetResultData')
			// this.$emit('resetPerformanceData')
			// for (var studyInstanceName in CIQ.stxx.layout.studies) {
			//     CIQ.Studies.removeStudy(CIQ.stxx, CIQ.stxx.layout.studies[studyInstanceName])
			// }

			CIQ.addSymbol(val)
			// remove markers when symbol changes
			CIQ.hideMarker()
		},
		getBenchmark(val) {
			console.log('benckmark', val)
			this.bd.benchmark = val
		},
		formateStartDate(val) {
			this.bd.start_date = timestampToTime(val)

			console.log('开始时间', this.bd.start_date)
		},
		formateEndDate(val) {
			this.bd.end_date = timestampToTime(val)
			console.log('开始时间', this.bd.end_date)
		},
		getEndDate() {
			this.bd.end_date = timestampToTime(new Date())
			const str = this.bd.end_date.split('-')
			str[0] = Number(str[0]) - Number(this.historyValue) + ''
			this.bd.start_date = str.join('-')

			var that = this
			var utils = function () {
				let vm = this
				vm.setSymbol = function (symbol) {
					that.bd.symbol = symbol
					// that.bd.benchmark = symbol
				}
				vm.b = function () {
					alert('b')
				}
			}
			return (window.utils = new utils())
		},
		async getIndexsList() {
			//console.log('vuex', this.$store.state.indexsList)
			if (this.$store.state.indexsList.length != 0) {
				this.indexList = this.$store.state.indexsList.map((item) => {
					return { value: `${item.symbol}`, label: `${item.symbol}` }
				})
			} else {
				await this.$http
					.get(
						'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getIndexes',
						{
							auth: {
								username: 'sentimentrader_backtest_api',
								password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
							}
						}
					)
					.then((res) => {
						this.indexList = res.data.map((item) => {
							return { value: `${item.symbol}`, label: `${item.symbol}` }
						})
					})
					.catch((error) => {
						console.warn(error)
					})
			}
		},
		async getStocksList() {
			if (this.$store.state.stocksList.length != 0) {
				this.symbolList = this.$store.state.stocksList.map((item) => {
					return { value: `${item.stock}`, label: `${item.stock}` }
				})
			} else {
				await this.$http
					.get(
						'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getStocks',
						{
							auth: {
								username: 'sentimentrader_backtest_api',
								password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
							}
						}
					)
					.then((res) => {
						this.symbolList = res.data.map((item) => {
							return { value: `${item.stock}`, label: `${item.stock}` }
						})
					})
					.catch((error) => {
						console.warn(error)
					})
			}
		},
		async remoteMethod(query) {
			if (query !== '') {
				this.loading = true
				setTimeout(() => {
					this.loading = false
					if (this.symbolList.length == 0 || this.indexList.length == 0) {
						this.getStocksList()
						this.getIndexsList()
					}
					var symbolListTemp = this.symbolList.filter((item) => {
						return (
							item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
							item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
						)
					})
					var IndexListTemp = this.indexList.filter((item) => {
						return (
							item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
							item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
						)
					})
					let options = symbolListTemp.concat(IndexListTemp)
					this.options = _.uniqWith(options, _.isEqual)
				}, 200)
			} else {
				this.options = []
			}
		},
		getBacktestHistory(val) {
			this.historyValue = val
			this.bd.end_date = timestampToTime(new Date())
			if (val <= 20) {
				this.bd.end_date = timestampToTime(new Date())
				const str = this.bd.end_date.split('-')
				str[0] = Number(str[0]) - Number(this.historyValue) + ''
				this.bd.start_date = str.join('-')
			}
			if (val === 21) {
				this.bd.start_date = ''
			}
		},
		getCommission(val) {
			this.bd.commission = val / 100
		},
		// getSlippage(val) {
		// 	this.bd.slippage = val / 100
		// },
		validateForm(newTag, oldTag) {
			let data = true
			this.$refs.backtestSetupForm.validate((valid) => {
				if (!valid) {
					this.$emit('validSetUpFail', oldTag)
					this.$message.error('Please complete the complete fields')
					data = false
				} else if (valid) {
					this.$emit('validSetUpSuccess', newTag)
				}
			})
			return data
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.backtestSetupForm.clearValidate()
		},
		getFrequency(val) {
			this.frequency = val
			this.$store.commit('getFrequency', val)
			this.$emit('getTimeFrame', val)
			this.loadSentimentList(val)
			// same as setPeriodicity
			var selectedFreq = ''
			switch (val) {
				case 'Monthly': {
					selectedFreq = 'month'
					break
				}
				case 'Weekly': {
					selectedFreq = 'week'
					break
				}
				case 'Daily': {
					selectedFreq = 'day'
					break
				}
				default:
			}

			CIQ.addIndicators(selectedFreq)
		},
		async loadSentimentList(val) {
			const vm = this
			var frequency = val
			var indicatorList = []

			if (CIQ.indicatorList) {
				if (CIQ.indicatorList.length != 0) {
					console.log(
						'data already in indicatorList from entry-form',
						CIQ.indicatorList.length
					)
					indicatorList = this.$store.state.indicatorsList
					indicatorList = CIQ.indicatorList
				}
			} else {
				console.log(
					'data is not in indicatorList from entry-form',
					CIQ.indicatorList
				)
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
			// vm.sentimentIndicatorList = res.data.map((obj) => {
			// 	if (frequency.toUpperCase().indexOf(obj.updated.toUpperCase()) !== -1) {
			// 		return { value: obj.chart_name, url: obj.url, updated: obj.updated }
			// 	}
			// })
			vm.sentimentIndicatorList = []
			if (frequency) {
				indicatorList.forEach((element) => {
					if (
						frequency.toUpperCase().indexOf(element.updated.toUpperCase()) !==
						-1
					) {
						vm.sentimentIndicatorList.push({
							value: element.chart_name,
							url: element.url,
							updated: element.updated
						})
					}
				})
			}
			this.$store.commit('getIndicatorsList', indicatorList)
			CIQ.indicatorList = indicatorList

			this.$store.commit('getSentimentList', vm.sentimentIndicatorList)

			const data = vm.$store.state.indicatorsList
			if (frequency !== '') {
				if (frequency == 'Daily') {
					vm.setSentiList(['Daily'], data)
				} else if (frequency == 'Weekly') {
					vm.setSentiList(['Daily', 'Weekly'], data)
				} else if (frequency == 'Monthly') {
					vm.setSentiList(['Daily', 'Weekly', 'Monthly'], data)
				}
			}
		},
		setSentiList(arr, data) {
			const vm = this
			vm.sentimentIndicatorList = []
			arr.forEach((fre) => {
				data.forEach((element) => {
					if (fre.toUpperCase().indexOf(element.updated.toUpperCase()) !== -1) {
						vm.sentimentIndicatorList.push({
							value: element.chart_name,
							url: element.url,
							updated: element.updated
						})
					}
				})
			})
			this.$store.commit('getSentimentList', vm.sentimentIndicatorList)
		},
		async getIndicatorsList() {
			const vm = this
			var indicatorList = []
			if (CIQ.indicatorList) {
				if (CIQ.indicatorList.length != 0) {
					console.log(
						'data already in indicatorList from entry-form',
						CIQ.indicatorList.length
					)
					indicatorList = this.$store.state.indicatorsList
					indicatorList = CIQ.indicatorList
				}
			} else {
				console.log(
					'data is not in indicatorList from entry-form',
					CIQ.indicatorList
				)
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
			this.$store.commit('getIndicatorsList', indicatorList)
			CIQ.indicatorList = indicatorList
		},
		saveBacktestData() {
			let checked = true
			let nameChecked = true
			if (this.bd.name) {
				if (!this.bd.old_uuid) {
					let nameList = this.$store.state.backtestNameList
					for (let i = 0; i < nameList.length; i++) {
						if (nameList[i] == this.bd.name) {
							nameChecked = false
							break
						}
					}
				}
				if (nameChecked) {
					if (this.bd.end_date) {
						// 保存 backtestform 的数据
						this.$store.commit('setBd', this.bd)
						return checked
					} else {
						this.$message.error('Please select end date')
						checked = false
						return checked
					}
				} else {
					this.$message.error('The backtest name already exists')
					checked = false
					return checked
				}
			} else {
				this.$message.error('Please give the backtest name')
				checked = false
				return checked
			}
		}
	}
}
</script>
<style lang="less" scoped>
/deep/
	.el-form-item.is-required:not(.is-no-asterisk)
	> .el-form-item__label:before {
	content: ' ';
	width: 0px;
	margin-right: 0px;
}
/deep/.dateBox .el-input__icon {
	width: 53px;
}

.comUnitNote {
	position: absolute;

	left: 329px;
	top: 56px;
}
.sliUnitNote {
	position: absolute;
	left: 329px;
	top: 105px;
}
.border-set {
	border-bottom: 1px solid #797979;
}
</style>