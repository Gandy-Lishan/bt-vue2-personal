<template>
	<el-row>
			<div class="backtest_container">
				<el-form
					ref="backtestSetupForm"
					:model="bd"
					label-position="left"
				>
					<el-col :xs="20" :sm="24" :md="12" :lg="8" :xl="8">
						<el-form-item label="Name:" prop="name">
							<el-input v-model="bd.name"></el-input>
						</el-form-item>
						<el-form-item label="Description:" prop="description">
							<el-input
								v-model="bd.description"
								type="textarea"
								:autosize="{ minRows: 6, maxRows: 6 }"
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
								@focus="setStartingCapital()"
								@blur="getStartingCapital()"
							></el-input>
						</el-form-item>
						<el-form-item label="Commission:" prop="commission">
							<el-input
								v-model="bd.commission"
								@focus="setCommission()"
								@blur="getCommission()"
							></el-input>
						</el-form-item>
						<el-form-item label="Slippage:" prop="slippage">
							<el-input
								v-model="bd.slippage"
								@focus="setSlippage()"
								@blur="getSlippage()"
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
								<el-input v-model="bd.benchmark"></el-input>
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
								<el-input
									v-else
									disabled
									v-model="bd.start_date"
								>
								</el-input>
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
			</div>
	</el-row>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters} from "vuex"
import { timestampToTime } from '@/tools/formatDate.js'
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
export default {
  extends: base,
  props: {backtestEditData: Object},
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
			options: []
		}
	},
	created() {
		this.getSymbolList()
		this.getEndDate()
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
		}
	},
	watch: {
		backtestEditData: {
			handler(newVal) {
				delete newVal.entry
				delete newVal.exit
				delete newVal.user_id
				delete newVal.status
				delete newVal.results
				delete newVal.uuid
				this.bd = Object.assign(this.bd,newVal)
				console.log(this.bd);
			}
		}
	},
	methods: {
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
		async getSymbolList() {
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
				str[0] =
					Number(str[0]) - Number(this.historyValue) + ''
				this.bd.start_date = str.join('-')
			}
			if (val === 21) {
				this.bd.start_date = ''
			}
		}
	}
}
</script>
<style lang="less" scoped>
.backtest_container {
	margin-top: 40px;
}
</style>