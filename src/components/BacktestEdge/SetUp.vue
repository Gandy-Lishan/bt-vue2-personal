// Set Up Backtest
<template>
	<div class="backtest_container">
		<el-form
			ref="backtestSetupForm"
			:model="bd"
			label-position="left"
			:rules="rules"
		>
			<el-row>
				<el-col :xs="15" :sm="14" :md="12" :lg="12" :xl="12">
					<el-form-item prop="symbol" label="Symbol">
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Choose a stock/index as backtest symbol. (default: SPY)<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
						<div class="enterSymbolBox">
							<el-select
								v-model="bd.symbol"
								id="symbolName"
								filterable
								remote
								reserve-keyword
								automatic-dropdown
								@change="getSymbol(bd.symbol)"
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
					<el-form-item
						prop="capital"
						label="
							Starting Capital"
					>
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Input the value of starting capital of the backtest. (default:
								100000)<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
						<el-input
							v-model="bd.capital"
							@input="validateStartingCapital"
						></el-input>
					</el-form-item>
					<el-form-item prop="commission" label="Commission">
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Input the percentage value of trading commission. (default:
								0.1%)<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
						<el-input
							v-model="bd.commission"
							@change="getCommission"
						></el-input>
					</el-form-item>
					<span class="comUnitNote">(%)</span>
					<el-form-item prop="slippage" label="Slippage">
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Input the value of slippage of trading price. (default: 0.1)<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
						<el-input v-model="bd.slippage"></el-input> </el-form-item
					><span class="sliUnitNote">(per trade)</span>
					<el-form-item prop="benchmark" label="Benchmark">
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Choose a stock/index with simple entry on the Start date & exit
								on the End date as benchmark compared with this backtest.
								(default: SPY)<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
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
					<div class="userTagBoc">
						<el-form-item label="User Tag" prop="use_tag" v-if="is_admin==true">
							<el-tooltip effect="dark" placement="top">
								<span slot="content"
									>Choose the type of backtest you want to create.<br
								/></span>
								<i class="iconfont icon-wenhao"></i>
							</el-tooltip>
							<div class="selectBox">
								<el-select
									v-model="bd.user_tag"
									placeholder="— Select User Tag —"
								>
									<el-option
										v-for="item in userTagOptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</div>
						</el-form-item>
					</div>
				</el-col>
				<el-col :xs="15" :sm="14" :md="12" :lg="12" :xl="12" :span="2">
					<el-form-item prop="backtestHistory" label="Backtest Period">
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Specify the start and end date of the backtest.<br />Choose
								'All History' to include all data since the inception of the
								backtesting stock/index.<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
						<div class="selectBox historySelectBox">
							<el-select
								@change="getBacktestHistory(historyValue)"
								@blur="setBacktestHistory(historyValue)"
								v-model="historyValue"
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
						<el-form-item label="Start Date">
							<el-date-picker
								v-if="historyValue === 22"
								v-model="bd.start_date"
								@change="formateStartDate"
								type="date"
								placeholder="- Select Start Date -"
								prop="startDate"
								value-format="yyyy-MM-dd"
							>
							</el-date-picker>
							<el-input v-else disabled v-model="bd.start_date"> </el-input>
						</el-form-item>
					</div>
					<div class="dateBox">
						<el-form-item prop="endDate" label="End Date">
							<el-date-picker
								v-if="historyValue === 22"
								v-model="bd.end_date"
								@change="formateEndDate"
								type="date"
								placeholder="- Select End Date -"
								value-format="yyyy-MM-dd"
							>
							</el-date-picker>
							<el-input v-else disabled v-model="bd.end_date"> </el-input>
						</el-form-item>
					</div>
					<el-form-item label="Timeframe" prop="frequency">
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Choose the timeframe of the backtest. The chart above will
								change accordingly to the selection of the timeframe.<br />if
								Daily is chosen, only daily sentiment indicators will be
								included in the below criteria sentiment indicators
								selection;<br />
								if Weekly is chosen, both weekly and daily sentiment indicators
								will be included in the below criteria sentiment indicators
								selection;<br />
								if Monthly is chosen, all monthly/weekly/daily sentiment
								indicators will be included in the below criteria sentiment
								indicators selection.<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
						<div class="selectBox">
							<el-select
								v-model="bd.frequency"
								placeholder="— Select Timeframe —"
								@change="changeTimeframe"
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
					<div class="backtestURLBox">
						<el-form-item label="Report URL" prop="report_url" v-if="bd.user_tag === 'analyst' && is_admin==true">
							<el-tooltip effect="dark" placement="top">
								<span slot="content"
									>Fill in the analyst's report url here.</span
								>
								<i class="iconfont icon-wenhao"></i>
							</el-tooltip>
							<el-input v-model="bd.report_url"></el-input>
						</el-form-item>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<div class="nameBox">
					<el-form-item
						label="Backtest Name"
						prop="name"
						placeholder="Give the backtest a name"
					>
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Input a unique name for each backtest.<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
						<el-input
							v-model="bd.name"
							oninput="value=value.replace(/[\+]/g,'')"
						></el-input>
					</el-form-item>
				</div>
			</el-row>
			<div>
				<el-form-item prop="direction" label="Direction">
					<el-tooltip effect="dark" placement="top">
						<span slot="content"
							>Select Long or Short to specify the starting position of the
							backtest.<br
						/></span>
						<i class="iconfont icon-wenhao"></i>
					</el-tooltip>
					<el-radio-group v-model="bd.direction" @change="getDirection">
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
			<div class="risk-control-container border-set">
				<div class="riskItem">
					<el-checkbox
						v-model="isRiskControl"
						border
						@change="selectRiskControl"
						>Risk Control at Exit

						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Check this option to include three methods of risk control to
								exit position.<br />
								The specified methods will serve as first-come,
								first-execute.<br />
								This option can be used combinedly as an OR condition with the
								Exit Criteria selection or be solely used in the Exit Criteria
								"Only Use Risk Control".<br
							/></span>
							<i class="iconfont icon-wenhao"></i> </el-tooltip
					></el-checkbox>
				</div>
				<div class="tpContainer riskItem" v-if="isRiskControl">
					<el-checkbox v-model="isTakeProfit">
						Take Profit
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Input a value of percentage to exit position when the specified
								profit is reached. (default: 20%)<br
							/></span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
					</el-checkbox>
					<el-input v-model="tp" @input="setDesciption"></el-input>
					<p style="margin: 0px">(%)</p>
				</div>
				<div class="slContainer riskItem" v-if="isRiskControl">
					<el-checkbox v-model="isStopLoss"
						>Stop Loss

						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Input a value of percentage to exit position when the specified
								loss is reached. (default: 10%)<br
							/></span>
							<i class="iconfont icon-wenhao"></i> </el-tooltip
					></el-checkbox>
					<el-input v-model="sl" @input="setDesciption"></el-input>
					<p>(%)</p>
				</div>
				<div class="timContainer riskItem" v-if="isRiskControl">
					<el-checkbox v-model="isTimeInMarket"
						>Time In Market
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Input a value of bars to stay in market after entry.<br />Exit
								position when the specified Time In Market is reached. (default:
								30)<br
							/></span>
							<i class="iconfont icon-wenhao"></i> </el-tooltip
					></el-checkbox>
					<el-input v-model="tim" @input="setDesciption"></el-input>
					<p>(Bars)</p>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { timestampToTime } from '@/tools/formatDate.js'
import Cookies from 'vue-cookies'
import {
	getIndicatorsList,
	getIndexsList,
	getStocksList,
	getBacktestName
} from '@/service/service.js'
import { permission } from '@/tools/copyBacktestID'
const throttle = require('lodash/throttle')
const uniqWith = require('lodash/uniqWith')
const isEqual = require('lodash/isEqual')
export default {
	props: { backtestEditData: Object },
	name: 'setUp',
	data() {
		var validateCapital = (rule, value, callback) => {
			const pattern = /^\d+(\.\d{1,2})?$/
			if (value == '') {
				callback(new Error('Please input starting capital'))
			}
			if (!pattern.test(value) && value != 0) {
				callback(
					new Error('Values greater than 1000, up to two decimal places')
				)
			}
			if (value < 1000) {
				callback(
					new Error('Values greater than 1000, up to two decimal places')
				)
			}
			callback()
		}
		var validateCommissionRule = (rule, value, callback) => {
			const pattern = /^\d+(\.\d{1,2})?$/
			if (value == '') {
				callback(new Error('Please input commission'))
			}
			if (!pattern.test(value) && value != 0) {
				callback(new Error('Value less than 50, up to two decimal places'))
			}
			if (value > 50) {
				callback(new Error('Value less than 50, up to two decimal places'))
			}
			callback()
		}
		var validateSlippageRule = (rule, value, callback) => {
			const pattern = /^\d+(\.\d{1,2})?$/
			if (value == '') {
				callback(new Error('Please input slippage'))
			}
			if (!pattern.test(value) && value != 0) {
				callback(new Error('Value greater than 0, up to two decimal places'))
			}
			if (value < 0) {
				callback(new Error('Value greater than 0, up to two decimal places'))
			}
			callback()
		}
		var validateNameRule = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('Please input backtest name'))
			} else {
				callback()
			}
		}
		var validateURLRule = (rule, value, callback) => {
			const pattern =
				/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
			if (value == '') {
				callback(new Error('Please enter the url of the analyst report'))
			}
			if (!pattern.test(value)) {
				callback(new Error('Url address format error'))
			}
			callback()
		}
		return {
			bd: {
				name: '',
				symbol: 'SPY',
				benchmark: 'SPY',
				strategy: 'Signal',
				capital: 100000.0,
				capital_alloc: 1.0,
				commission: 0.1,
				win_rate: 0.0,
				slippage: 0.1,
				start_date: '',
				end_date: '',
				description: 'backtest',
				direction: 'Long',
				frequency: 'Daily',
				risk_control: '//',
				report_url: '',
				user_tag: 'client'
			},
			permission: Cookies.get('devbt2Userid'),
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
			userTagOptions: [
				{ value: 'client', label: 'Client' },
				{ value: 'analyst', label: 'Analyst' },
				{ value: 'system', label: 'System' }
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
			tp: 20,
			sl: 10,
			tim: 120,
			isRiskControl: false,
			isTakeProfit: true,
			isStopLoss: true,
			isTimeInMarket: false,
			sentimentIndicatorList: [],
			rules: {
				capital: [
					{
						validator: validateCapital,
						trigger: 'blur'
					}
				],
				slippage: [
					{
						validator: validateSlippageRule,
						trigger: 'blur'
					}
				],
				commission: [
					{
						validator: validateCommissionRule,
						trigger: 'blur'
					}
				],
				name: [
					{
						validator: validateNameRule,
						trigger: 'blur'
					}
				],
				report_url: [
					{
						validator: validateURLRule,
						trigger: 'blur'
					}
				]
			},
			oldBacktestName: '',
			is_admin: false
		}
	},
	directives: {
		permission
	},
	created() {
		this.is_admin = this.$store.state.is_admin
	},
	mounted() {
		this.loadSentimentList('Daily')
		this.getEndDate()
	},
	computed: {
		updateFreq() {
			return this.$store.state.pairDataFreq
		},
		allRiskControlOptions() {
			return this.isTakeProfit || this.isStopLoss || this.isTimeInMarket
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
			handler(newVal) {}
		},
		allRiskControlOptions: {
			handler(newVal) {
				if (!newVal && this.isRiskControl) {
					this.$message({
						message: 'Select at least one Risk Control indicator',
						type: 'error',
						offset: 300
					})
					this.isTakeProfit = true
					this.selectRiskControl(this.isRiskControl)
				}
			}
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.is_admin = this.$store.state.is_admin
			this.getEndDate()
			this.bd.symbol = this.$store.state.backtestSymbol
			this.$emit('IsRiskControl', false)
			this.clearFormValidate()
		},
		setEditData(newVal) {			
			if (JSON.stringify(newVal) != '{}') {
				this.clearForm()
				delete newVal.entry
				delete newVal.exit
				delete newVal.user_id
				delete newVal.status
				delete newVal.results
				delete newVal.uuid
				delete newVal.entry_description
				delete newVal.exit_description
				delete newVal.entry
				delete newVal.exit
				delete newVal.results
				newVal.commission = (newVal.commission * 100).toFixed(2)
				newVal.slippage = Number(newVal.slippage).toFixed(2)
				this.is_admin = this.$store.state.is_admin
				this.bd = Object.assign(this.bd, newVal)	
				this.getFrequency(newVal.frequency)
				this.getDirection(newVal.direction)
				this.isRiskControl = false
				this.isTakeProfit = false
				this.isStopLoss = false
				this.isTimeInMarket = false
				if (newVal.risk_control) {
					let riskValArr = newVal.risk_control.split('/')
					if (riskValArr[0]) {
						this.isTakeProfit = true
						this.tp = riskValArr[0]
						this.isRiskControl = true
						this.$emit('IsRiskControl', true)
					}
					if (riskValArr[1]) {
						this.isStopLoss = true
						this.sl = riskValArr[1]
						this.isRiskControl = true
						this.$emit('IsRiskControl', true)
					}
					if (riskValArr[2]) {
						this.isTimeInMarket = true
						this.tim = riskValArr[2]
						this.isRiskControl = true
						this.$emit('IsRiskControl', true)
					}
					this.selectRiskControl(this.isRiskControl)
				}
				this.oldBacktestName = newVal.name
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
		},
		getDirection(val) {
			// Set direction to vuex
			this.$store.commit('getDirection', val)
			// Direction passed to entry and exit
			this.bd.direction = val
			this.$emit('setDirection', val)
		},
		validateStartingCapital: throttle(function (val) {
			let re = /^\d+\.?\d{0,2}$/
			if (val.search(re) !== -1) {
				this.bd.capital = val
			} else if (val.search(/^\d+\.?\d+/) !== -1) {
				this.bd.capital =
					val.split('.')[0] + '.' + val.split('.')[1].substring(0, 2)
			} else {
				this.bd.capital = ''
			}
		}, 500),

		getBenchmark(val) {
			this.bd.benchmark = val
		},
		getSymbol(val) {
			this.$store.commit('getBacktestSymbol', val)
			CIQ.addSymbol(val)
		},
		formateStartDate(val) {
			this.bd.start_date = val
		},
		formateEndDate(val) {
			this.bd.end_date = val
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
				}
			}
			return (window.utils = new utils())
		},
		async getIndexsList() {
			try {
				let vm = this
				if (vm.$store.state.indexsList.length != 0) {
					vm.indexList = vm.$store.state.indexsList.map((item) => {
						return { value: `${item.symbol}`, label: `${item.symbol}` }
					})
				} else {
					let res = await getIndexsList()
					vm.indexList = res.data.map((item) => {
						return { value: `${item.symbol}`, label: `${item.symbol}` }
					})
					vm.loading = false
				}
			} catch (error) {
				this.indexList = []
				vm.loading = false
			}
		},
		async getStocksList() {
			let vm = this
			
			if (vm.$store.state.stocksList.length != 0) {
				vm.symbolList = vm.$store.state.stocksList.map((item) => {
					return { value: `${item.stock}`, label: `${item.stock}` }
				})
			} else {
				try {
					let res = await getStocksList()
					vm.symbolList = res.data.map((item) => {
						return { value: `${item.stock}`, label: `${item.stock}` }
					})
				} catch (error) {
					console.warn(error)
					vm.loading = false
				}
			}
		},
		async remoteMethod(query) {
			let vm = this
			if (query !== '') {
				vm.loading = true
				if (vm.symbolList.length == 0 || vm.indexList.length == 0) {
					await vm.getStocksList()
					await vm.getIndexsList()
				}
				
				var symbolListTemp = vm.symbolList.filter((item) => {
					return (
						item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
						item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
					)
				})
				var IndexListTemp = vm.indexList.filter((item) => {
					return (
						item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
						item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
					)
				})

				let options = symbolListTemp.concat(IndexListTemp)
				// keyword全匹配
				for(var item of options){
					if(
						item.value.toLowerCase()===query.toLowerCase() || 
						item.label.toLowerCase()===query.toLowerCase()
					){	
						options.unshift(item)
						break
					}
				} 
				// 去重
				this.options = uniqWith(options, isEqual)
				// 解除遮罩
				vm.loading = false
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
		setBacktestHistory(val) {
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
		getCommission: throttle(function (val) {
			this.bd.commission = val
		}, 500),
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
		clearFormValidate() {
			this.$refs.backtestSetupForm.clearValidate()
		},
		changeTimeframe(val) {
			this.getFrequency(val)
			CIQ.addIndicators()
		},
		selectRiskControl(val) {
			if (!this.isRiskControl) {
				this.$emit('IsRiskControl', false)
			}
			if (
				this.isRiskControl &&
				(this.isTakeProfit || this.isTimeInMarket || this.isStopLoss)
			) {
				this.$emit('IsRiskControl', true)
			}
			if (
				this.isRiskControl &&
				!(this.isTakeProfit || this.isTimeInMarket || this.isStopLoss)
			) {
				this.isTakeProfit = true
				this.isStopLoss = true
				this.$emit('IsRiskControl', true)
			}
			this.$store.commit('isRiskControl', val)
		},
		getFrequency(val) {
			// getFrequency will no longer call addIndicator and pass a parameter to it
			this.bd.frequency = val
			this.$store.commit('getFrequency', val)
			this.loadSentimentList(val)
		},
		async loadSentimentList(val) {
			const vm = this
			var frequency = val
			var indicatorList = []

			if (CIQ.indicatorList) {
				if (CIQ.indicatorList.length != 0) {
					indicatorList = this.$store.state.indicatorsList
					indicatorList = CIQ.indicatorList
				}
			}
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
			try {
				const vm = this
				var indicatorList = []
				if (CIQ.indicatorList) {
					if (CIQ.indicatorList.length != 0) {
						indicatorList = this.$store.state.indicatorsList
						indicatorList = CIQ.indicatorList
					}
				} else {
					const res = await getIndicatorsList()
					indicatorList = res.data
				}
				this.$store.commit('getIndicatorsList', indicatorList)
				CIQ.indicatorList = indicatorList
			} catch (error) {
				console.error('indicator list request error', error)
			}
		},
		backtestNameCheck() {
			return getBacktestName(this.bd.name)
				.then((res) => {
					console.log('res count', res)
					if (res.data.count == 0) {
						this.saveBacktestData()
					} else {
					}
				})
				.then((res) => {
					return res
				})
		},
		saveBacktestData() {
			let checked = true
			// let nameChecked = true
			let validForm
			let bd = JSON.parse(JSON.stringify(this.bd))
			this.$refs.backtestSetupForm.validate((valid) => {
				validForm = valid
			})
			let riskCheck = true
			let slCheck
			let tpCheck
			let timCheck
			if (this.isRiskControl) {
				if (this.isStopLoss) {
					slCheck = this.validateStopLoss(this.sl)
				}
				if (this.isTakeProfit) {
					tpCheck = this.validateTakeProfit(this.tp)
				}
				if (this.isTimeInMarket) {
					timCheck = this.validateTimeInMarket(this.tim)
				}
				riskCheck =
					(this.isStopLoss ? slCheck : true) &&
					(this.isTakeProfit ? tpCheck : true) &&
					(this.isTimeInMarket ? timCheck : true)
			}
			
			if (validForm && riskCheck) {
				if (bd.end_date) {
					bd.commission = bd.commission / 100
					if (this.isRiskControl) {
						let riskStr = `${this.isTakeProfit ? this.tp : ''}/${
							this.isStopLoss ? this.sl : ''
						}/${this.isTimeInMarket ? this.tim : ''}`
						bd.risk_control = riskStr
						this.setDesciption()
					} else {
						bd.risk_control = '//'
					}
					if (this.historyValue == 21) {
						bd.start_date = '1800-10-01'
					}
					this.$store.commit('setBd', bd)
					return checked
				} else {
					this.$message({
						message: 'Please select end date',
						type: 'error',
						offset: 300
					})
					checked = false
					return checked
				}
			} else {
				this.$message({
					message:
						'Please check the setup form',
					type: 'error',
					offset: 300
				})
				checked = false
				return checked
			}
		},
		clearOldBacktestName() {
			this.oldBacktestName = ''
		},
		setDesciption() {
			let criteria = 'X:'
			let direction = ''
			let description
			if (this.bd.direction == 'Long') {
				direction = 'Close:'
			}
			if (this.bd.direction == 'Short') {
				direction = 'Cover:'
			}
			let tpStr = ''
			let slStr = ''
			let timStr = ''
			if (this.isRiskControl) {
				if (this.isTakeProfit) {
					tpStr = 'Take Profit ' + this.tp + '%'
				}
				if (this.isStopLoss) {
					slStr = 'Stop Loss ' + this.sl + '%'
				}
				if (this.isTimeInMarket) {
					timStr = 'Time In Market ' + this.tim + '(Bars)'
				}
			}
			description = `${criteria} ${direction} ${tpStr} ${slStr} ${timStr}`
			let desObj = {}
			desObj.description = description
			this.$store.commit('saveRiskDescription', desObj)
		},

		validateStopLoss(num) {
			if (num < 0) {
				this.$message({
					message:
						'Please enter Stop Loss,only positive numbers less than or equal to 100 are allowed',
					type: 'error',
					offset: 300
				})
				return false
			}
			const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(num) && num !== 0) {
				this.$message({
					message:
						'Please enter Stop Loss, only two decimal places are allowed',
					type: 'error',
					offset: 300
				})
				return false
			}
			return true
		},
		validateTakeProfit(num) {
			if (num < 0) {
				this.$message({
					message:
						'Please enter Take Profit, only positive numbers are allowed',
					type: 'error',
					offset: 300
				})
				return false
			}
			const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(num) && num !== 0) {
				this.$message({
					message:
						'Please enter Take Profit, only two decimal places are allowed',
					type: 'error',
					offset: 300
				})
				return false
			}
			return true
		},
		validateTimeInMarket(num) {
			if (isNaN(num) || num < 0 || !/^\d+$/.test(num)) {
				this.$message({
					message:
						'Please enter Time in Market, only positive integers are allowed',
					type: 'error',
					offset: 300
				})
				return false
			}
			return true
		},
		isEdit() {
			if (this.oldBacktestName == this.bd.name) {
				return true
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

	left: 335px;
	top: 105px;
}
.sliUnitNote {
	position: absolute;
	left: 335px;
	top: 152px;
}
@media (min-width: 1680px) {
	.comUnitNote {
		position: absolute;
		left: 454px;
		top: 105px;
	}
	.sliUnitNote {
		position: absolute;
		left: 454px;
		top: 152px;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.comUnitNote {
		position: absolute;
		left: 208px;
		top: 105px;
		font-size: 12px;
	}
	.sliUnitNote {
		position: absolute;
		left: 208px;
		top: 152px;
		font-size: 12px;
	}
	.el-input__suffix {
		right: 68px;
	}
	/deep/.el-select-dropdown__item {
		font-size: 12px;
		padding: 0 5px;
	}
	/deep/.el-select-dropdown {
		max-width: 206px;
		left: 107px;
	}
}
.border-set {
	border-bottom: 1px solid #797979;
}
.riskItem {
	display: flex;
	margin: 5px;
	justify-content: center;
	align-items: center;
}
.risk-control-container {
	display: flex;
}

.el-checkbox-group {
	display: flex;
	margin-bottom: 10px;
}
.el-input {
	display: inline;
}
.el-select {
	top: -41px;
	left: 16px;
}
/deep/.el-radio__input {
	margin-left: 10px;
}

/deep/ .backtestURLBox .el-form-item .el-form-item__label {
	width: 170px;
}
/deep/ .backtestURLBox .el-form-item .el-form-item__content {
	padding-left: 155px;
}
</style>