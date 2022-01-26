<template>
	<div class="backtest_container">
		<el-form
			ref="backtestSetupForm"
			:model="bd"
			label-position="left"
			:rules="setUpFormRules"
		>
			<el-row>
				<el-col :xs="15" :sm="14" :md="12" :lg="12" :xl="12">
					<el-form-item label="Starting Capital:" prop="startingCapital">
						<el-input
							v-model="bd.capital"
							v-direction="{ x: 1, y: 0 }"
							@input="validateStartingCapital"
						></el-input>
					</el-form-item>
					<el-form-item label="Commission:" prop="commission">
						<el-input
							v-model="temp.commission"
							v-direction="{ x: 2, y: 0 }"
							@change="getCommission"
							@input="validateCommission"
						></el-input>
					</el-form-item>

					<span class="comUnitNote">(per share)</span>
					<el-form-item label="Slippage:" prop="slippage">
						<el-input
							v-model="temp.slippage"
							@change="getSlippage"
							v-direction="{ x: 3, y: 0 }"
							@input="validateSlippage"
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
					<el-form-item label="Backtest History:" prop="backtestHistory">
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
				<div class="nameBox border-set">
					<el-form-item
						label="Backtest Name:"
						prop="name"
						placeholder="Give the backtest a name"
					>
						<el-input
							v-model="bd.name"
							v-direction="{ x: 4, y: 0 }"
							style="width: 720px"
						></el-input>
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
export default {
	props: { backtestEditData: Object },
	name: 'setUp',
	data() {
		return {
			bd: {
				name: '',
				symbol: 'AAPL',
				benchmark: 'SPY',
				strategy: 'Signal',
				capital: 100000.0,
				capital_alloc: 1.0,
				commission: 0.001,
				win_rate: 0.0,
				slippage: 0.001,
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
			setUpFormRules: {
				name: [
					{ required: true, message: 'Please enter name', trigger: 'blur' }
				]
			},
			sentimentIndicatorList: []
		}
	},
	mounted() {
		this.getIndicatorsList()
		this.loadSentimentList('Daily')
		// this.getIndexsList()
		// this.getStocksList()
		this.getEndDate()
		let direction = this.$getDirection()
		direction.on('keyup', function (e, val) {
			if (e.keyCode == 9) {
				direction.next()
			}
			direction.onEnd = function () {
				direction.previous(1, 0)
			}
		})
	},
	watch: {
		updateFreq(val) {
			console.log('updateFreq: ', val)
			switch (val) {
				case 'daily': {
					this.frequency = 'Daily'
					break
				}
				case 'weekly': {
					this.frequency = 'Weekly'
					break
				}
				case 'monthly': {
					this.frequency = 'Monthly'
					break
				}
			}
		}
	},
	computed: {
		listSet() {
			return this.symbolList.map((item) => {
				return { value: `${item.stock}`, label: `${item.stock}` }
			})
		},
		indexSet() {
			return this.indexList.map((item) => {
				return { value: `${item.symbol}`, label: `${item.symbol}` }
			})
		},
		...mapGetters(['getIsClearForm']),
		isClearForm() {
			return this.getIsClearForm
		},
		updateFreq() {
			return this.$store.state.pairDataFreq
		}
	},
	watch: {
		backtestEditData: {
			handler(newVal) {
				if (JSON.stringify(newVal) != '{}') {
					this.$refs['backtestSetupForm'].clearValidate()
					delete newVal.entry
					delete newVal.exit
					delete newVal.user_id
					delete newVal.status
					delete newVal.results
					delete newVal.uuid
					this.bd = Object.assign(this.bd, newVal)
					this.temp.commission = Number(newVal.commission) * 100
					var year
					const starArr = newVal.start_date.toString().split('-')
					const endArr = newVal.end_date.toString().split('-')
					year = Number(endArr[0]) - Number(starArr[0])
					this.historyValue = year
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
			this.bd.benchmark = val
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
			console.log('vuex', this.$store.state.indexsList)
			if (this.$store.state.indexsList.length != 0) {
				this.indexList = this.$store.state.indexsList
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
						this.indexList = res.data
					})
					.catch((error) => {
						console.warn(error)
					})
			}
		},
		async getStocksList() {
			console.log('vuex', this.$store.state.stocksList)
			if (this.$store.state.stocksList.length != 0) {
				this.symbolList = this.$store.state.stocksList
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
						this.symbolList = res.data
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
					var symbolListTemp = this.listSet.filter((item) => {
						return (
							item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
							item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
						)
					})
					var IndexListTemp = this.indexSet.filter((item) => {
						return (
							item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
							item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
						)
					})
					this.options = symbolListTemp.concat(IndexListTemp)
				}, 200)
			} else {
				this.options = []
			}
		},
		getBacktestHistory(val) {
			this.historyValue = val
			if (val <= 20) {
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
		getSlippage(val) {
			this.bd.slippage = val / 100
		},
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
			this.loadSentimentList(val)
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
			if (this.bd.name) {
				if (this.bd.start_date) {
					// 保存 backtestform 的数据
					this.$store.commit('setBd', this.bd)
					return checked
				} else {
					this.$message.error('Please select start date')
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
	width: 590px;
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