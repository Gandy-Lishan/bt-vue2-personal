<template>
	<div class="backtest_container">
		<el-row>
			<el-form ref="backtestSetupForm" :model="bd" label-position="left">
				<el-col :xs="20" :sm="24" :md="12" :lg="8" :xl="8">
					<el-form-item label="Name:" prop="name">
						<el-input v-model="bd.name" v-direction="{ x: 0, y: 0 }"></el-input>
					</el-form-item>
					<el-form-item label="Description:" prop="description">
						<el-input
							v-model="bd.description"
							v-direction="{ x: 1, y: 0 }"
							resize="none"
						></el-input>
					</el-form-item>
					<el-form-item label="Symbol:" prop="symbolName">
						<div class="enterSymbolBox">
							<el-select
								v-model="bd.symbol"
								id="symbolName"
								filterable
								remote
								reserve-keyword
								automatic-dropdown
								@change="getSymbolName(bd.symbol)"
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
				</el-col>
				<el-col :xs="20" :sm="24" :md="12" :lg="8" :xl="8">
					<el-form-item label="Starting Capital:" prop="startingCapital">
						<el-input
							v-model="bd.capital"
							v-direction="{ x: 2, y: 0 }"
							@input="validateStartingCapital"
						></el-input>
					</el-form-item>
					<el-form-item label="Commission:" prop="commission">
						<el-input
							v-model="temp.commission"
							v-direction="{ x: 3, y: 0 }"
							@change="getCommission"
							@input="validateCommission"
						></el-input>
					</el-form-item>
					<el-form-item label="Slippage:" prop="slippage">
						<el-input
							v-model="bd.slippage"
							v-direction="{ x: 4, y: 0 }"
							@input="validateSlippage"
						></el-input>
					</el-form-item>
					<el-form-item label="Money Management:" prop="moneyManagement">
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
					</el-form-item>
				</el-col>
				<el-col :xs="20" :sm="24" :md="12" :lg="8" :xl="8">
					<el-form-item label="Benchmark:" prop="benchmark">
						<div class="enterSymbolBox">
							<el-input
								v-model="bd.benchmark"
								v-direction="{ x: 5, y: 0 }"
							></el-input>
						</div>
					</el-form-item>
					<el-form-item label="Backtest History:" prop="backtestHistory">
						<div class="selectBox">
							<el-select
								@change="getBacktestHistory(historyValue)"
								v-model="historyValue"
								placeholder="Pleace select"
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
					<div class="dateNote">
						<el-form-item label="Start date">
							<el-date-picker
								v-if="historyValue === 22"
								v-model="bd.start_date"
								type="date"
								placeholder="Please select a start date"
							>
							</el-date-picker>
							<el-input v-else disabled v-model="bd.start_date"> </el-input>
						</el-form-item>
					</div>
					<el-form-item label="End date">
						<el-date-picker
							v-if="historyValue === 22"
							v-model="bd.end_date"
							type="date"
							placeholder="Please select a end date"
						>
						</el-date-picker>
						<el-input
							v-else
							disabled
							v-model="bd.end_date"
							placeholder="Please select a end date"
						>
						</el-input>
					</el-form-item>
				</el-col>
			</el-form>
		</el-row>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
import { timestampToTime } from '@/tools/formatDate.js'
import deepClone1 from '@/tools/deepClone.js'
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
export default {
	extends: base,
	props: { backtestEditData: Object },
	data() {
		return {
			bd: {
				name: '',
				description: '',
				symbol: 'AAPL',
				benchmark: 'AAPL',
				strategy: 'Signal',
				capital: 100000.0,
				capital_alloc: 1.0,
				commission: 0.001,
				win_rate: 0.0,
				slippage: 0.001,
				start_date: '',
				end_date: ''
			},
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
			temp: { commission: '0.1' }
		}
	},
	created() {
		
		this.getIndexsList()
		this.getStocksList()
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
		}
	},
	watch: {
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
			console.log('46474647647')
			let list = val.split('.')
			if (list.length === 2) {
				let temp = ''
				if (list[0].search(/^[1-9]?\d{1}?$/) !== -1) 
					temp = list[0]
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
					this.temp.commission = list[0].substring(0,2)
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
			let re = /0\.?\d{0,4}?/g
			if (val.search(re) !== -1) {
				this.bd.slippage = val
			} else {
				this.bd.slippage = ''
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
			this.bd.benchmark = val
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
					that.bd.benchmark = symbol
				}
				vm.b = function () {
					alert('b')
				}
			}
			return (window.utils = new utils())
		},
		async getIndexsList() {
			if(this.$store.state.indexsList.length != 0){
				console.log('data in indexsList from bascktest-setup',this.$store.state.indexsList.length)
				this.indexList = this.$store.state.indexsList
			}else{
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
			if(this.$store.state.stocksList.length != 0){
				console.log('data in stockList from bascktest-setup',this.$store.state.stocksList.length)
				this.symbolList = this.$store.state.stocksList
			}else{
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
		}
	}
}
</script>
<style lang="less" scoped>
.backtest_container {
	margin-top: 40px;
}
</style>