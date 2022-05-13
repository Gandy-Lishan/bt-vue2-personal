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
					<el-form-item label="Starting Capital:" prop="capital">
						<el-input
							v-model="bd.capital"
							@input="validateStartingCapital"
						></el-input>
					</el-form-item>
					<el-form-item label="Commission:" prop="commission">
						<el-input
							v-model="bd.commission"
							@change="getCommission"
						></el-input>
					</el-form-item>
					<span class="comUnitNote">(%)</span>
					<el-form-item label="Slippage:" prop="slippage">
						<el-input
							v-model="bd.slippage"
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
				</el-col>
				<el-col :xs="15" :sm="14" :md="12" :lg="12" :xl="12" :span="2">
					<el-form-item label="Backtest Period:" prop="backtestHistory">
						<div class="selectBox">
							<el-select
								@change="getBacktestHistory(historyValue)"
								@blur="setBacktestHistory(historyValue)"
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
				</el-col>
			</el-row>
			<el-row>
				<div class="nameBox">
					<el-form-item
						label="Backtest Name:"
						prop="name"
						placeholder="Give the backtest a name"
					>
						<el-input v-model="bd.name" oninput="value=value.replace(/[\+]/g,'')"></el-input>
					</el-form-item>
				</div>
			</el-row>
			<div>
				<el-form-item label="Direction:" prop="direction">
					<el-radio-group v-model="bd.direction" @change="getDirection">
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
			<div class="risk-control-container border-set">
						 <div class="riskItem">
							 
    <el-checkbox v-model="isRiskControl" border @change="selectRiskControl">Risk Control at Exit:</el-checkbox>
						 </div>
	<div class="tpContainer riskItem" v-if="isRiskControl">
    <el-checkbox v-model="isTakeProfit" @change="selectRiskControl">Take Profit</el-checkbox>
	<el-input v-model="tp" @input="setDesciption"></el-input><p style="margin:0px">(%)</p>
	</div>
		<div class="slContainer riskItem"  v-if="isRiskControl">
    <el-checkbox v-model="isStopLoss" @change="selectRiskControl">Stop Loss</el-checkbox>
	<el-input v-model="sl" @input="setDesciption"></el-input><p>(%)</p>
		</div>
		<div class="timContainer riskItem"  v-if="isRiskControl">
	    <el-checkbox v-model="isTimeInMarket" @change="selectRiskControl">Time In Market</el-checkbox>
		<el-input v-model="tim" @input="setDesciption"></el-input><p>(Bars)</p>
		</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
import { timestampToTime } from '@/tools/formatDate.js'
import { getIndicatorsList, getIndexsList, getStocksList } from "@/service/service.js"
const throttle = require('lodash/throttle')
const uniqWith = require('lodash/uniqWith')
const isEqual = require('lodash/isEqual')
export default {
	props: { backtestEditData: Object },
	name: 'setUp',
	data() {
		var validateCapital = (rule, value, callback) => {
			const pattern = /^\d+(\.\d{1,2})?$/
			if ( value == '') {
				callback(new Error('Please input starting capital'))
			}
			if (!pattern.test(value) && value != 0) {
				callback(new Error('Values greater than 1000, up to two decimal places'))
			}
			if(value < 1000) {
				callback(new Error('Values greater than 1000, up to two decimal places'))
			}
				callback()
		}
		var validateCommissionRule = (rule, value, callback) => {
			const pattern = /^\d+(\.\d{1,2})?$/
			if (value == '') {
				callback(new Error('Please input commission'))
			} 
			if (!pattern.test(value) && value != 0) {
				callback(new Error('Value less than 50, up to two decimal places'))}
			if(value > 50){
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
			if(value < 0) {
				callback(new Error('Value greater than 0, up to two decimal places'))
			}
				callback()
		}
		var validateNameRule = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('Please give a backtest name'))
			} else {
				callback()
			}
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
				risk_control: '//'
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
				]
			},
			oldBacktestName: ''
		}
	},
	mounted() {
		this.getIndicatorsList()
		this.loadSentimentList('Daily')
		// this.getIndexsList()
		// this.getStocksList()
		this.getEndDate()
	},
	computed: {
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
					console.log("编辑展示的数据",newVal);
					this.clearFormValidate()
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
					newVal.slippage = (Number(newVal.slippage)).toFixed(2)
					//console.log("bd",bd);
				    this.bd = Object.assign(this.bd, newVal)
					CIQ.hideMarker()
					this.getFrequency(newVal.frequency)
					this.getDirection(newVal.direction)
					if(newVal.risk_control){
					let riskValArr = newVal.risk_control.split('/')
					if(riskValArr[0]) {
						this.isTakeProfit = true
						this.tp = riskValArr[0]
						this.isRiskControl = true
						this.selectRiskControl(true)
						
					}
					if(riskValArr[1]) {
						this.isStopLoss = true
						this.sl = riskValArr[1]
						this.isRiskControl = true
						this.selectRiskControl(true)
					}
					if(riskValArr[2]) {
						this.isTimeInMarket = true
						this.tim = riskValArr[2]
						this.isRiskControl = true
						this.selectRiskControl(true)
					}
					}
					// 保存编辑之前旧的名字
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
			}
		}
	},
	methods: {
		clearForm() {
			this.clearFormValidate()
			Object.assign(this.$data, this.$options.data())
			this.getEndDate()
			this.bd.symbol = this.$store.state.backtestSymbol
		},
		getDirection(val) {
			// direction 设置到 vuex
			this.$store.commit('getDirection', val)
			// 传给 entry 和 exit 的 direction\
			console.log("direction",val);
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
		formateStartDate(val) {
			this.bd.start_date = timestampToTime(val)
		},
		formateEndDate(val) {
			this.bd.end_date = timestampToTime(val)
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
				}
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
					this.options = uniqWith(options, isEqual)
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
		setBacktestHistory(val) {
			//console.log("blur年限",val);
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
		// 清除表单认证
		clearFormValidate() {
			this.$refs.backtestSetupForm.clearValidate()
			this.$emit('IsRiskControl', this.isRiskControl)
		},
		changeTimeframe(val) {
			this.getFrequency(val)
			CIQ.addIndicators()
		},
		selectRiskControl(val) {
			console.log(val);
			if(this.isRiskControl && (this.isTakeProfit || this.isTimeInMarket || this.isStopLoss)) {
			this.$emit('IsRiskControl', true)
			}else{
				this.$emit('IsRiskControl', false)
			}
		},
		getFrequency(val) {
			// getFrequency will no longer call addIndicator and pass a parameter to it
			this.bd.frequency = val
			this.$store.commit('getFrequency', val)
			this.loadSentimentList(val)
			// same as setPeriodicity
			// var selectedFreq = ''
			// switch (val) {
			// 	case 'Monthly': {
			// 		selectedFreq = 'month'
			// 		break
			// 	}
			// 	case 'Weekly': {
			// 		selectedFreq = 'week'
			// 		break
			// 	}
			// 	case 'Daily': {
			// 		selectedFreq = 'day'
			// 		break
			// 	}
			// 	default:
			// }
			// CIQ.addIndicators(selectedFreq)
		},
		async loadSentimentList(val) {
			const vm = this
			var frequency = val
			var indicatorList =                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               []

			if (CIQ.indicatorList) {
				if (CIQ.indicatorList.length != 0) {
					indicatorList = this.$store.state.indicatorsList
					indicatorList = CIQ.indicatorList
				}
			} else {
				const res = await getIndicatorsList()
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
					indicatorList = this.$store.state.indicatorsList
					indicatorList = CIQ.indicatorList
				}
			} else {
				const res = await getIndicatorsList()
				indicatorList = res.data
			}
			this.$store.commit('getIndicatorsList', indicatorList)
			CIQ.indicatorList = indicatorList
		},
		saveBacktestData() {
			let checked = true
			let nameChecked = true
			let validForm
			let bd = JSON.parse(JSON.stringify(this.bd))
			this.$refs.backtestSetupForm.validate((valid) => {
				validForm = valid
			})
			let riskCheck = true
			let slCheck
			let tpCheck
			let timCheck
			if(this.isRiskControl) {
				if (this.isStopLoss) {
					slCheck = this.validateStopLoss(this.sl)
				}
				if(this.isTakeProfit) {
					tpCheck = this.validateTakeProfit(this.tp)
				}
				if(this.isTimeInMarket){
					timCheck = this.validateTimeInMarket(this.tim)
				}
				riskCheck = (this.isStopLoss?slCheck:true) && (this.isTakeProfit?tpCheck:true) && (this.isTimeInMarket?timCheck:true)
			}
			
			if (validForm && riskCheck) {
				let nameList = this.$store.state.backtestNameList
				if (nameList.indexOf(bd.name) === -1) {
					bd.favorites = false
					delete bd.old_uuid
				}
				if (
					nameList.indexOf(bd.name) > -1 &&
					this.oldBacktestName === ''
				) {
					bd.favorites = false
					delete bd.old_uuid
					nameChecked = false
				}
				if (
					nameList.indexOf(bd.name) > -1 &&
					this.oldBacktestName === bd.name &&
					this.oldBacktestName !== ''
				) {
					// 说明重名要进行替换，不删除 old_uuid
				}
				if (
					nameList.indexOf(bd.name) > -1 &&
					this.oldBacktestName !== bd.name &&
					this.oldBacktestName !== ''
				) {
					// 说明不重名，直接创建新的，删除 old_uuid
					// this.$store.commit('clearBacktestUuid')
					nameChecked = false
				}
				if (nameChecked) {
					if (bd.end_date) {
						// 保存 backtestform 的数据
						bd.commission = bd.commission / 100
		if(this.isRiskControl) {
	    let riskStr = `${this.isTakeProfit?this.tp:''}/${this.isStopLoss?this.sl:''}/${this.isTimeInMarket?this.tim:''}`
	    bd.risk_control = riskStr
		this.setDesciption()
		
		}
		console.log("bd",bd);
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
						message: 'The backtest name already exists',
						type: 'error',
						offset: 300
					})
					checked = false
					return checked
				}
			} else {
				// this.$message({
				// 	message: 'Please give the backtest name',
				// 	type: 'error',
				// 	offset: 300
				// })
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
			if(this.isRiskControl) {
				if(this.isTakeProfit) {
					tpStr = 'Take Profit ' + this.tp + '%'
				}
				if(this.isStopLoss) {
					slStr = 'Stop Loss ' + this.sl + '%'
				}
				if(this.isTimeInMarket) {
					timStr = 'Time In Market ' + this.tim + '(Bars)'
				}
			}
           description = `${criteria} ${direction} ${tpStr} ${slStr} ${timStr}`
		   console.log('risk description',description)
		   let desObj = {}
				// desObj.criteria = 'exit'
				// desObj.index = 0
				desObj.description = description
				this.$store.commit('saveRiskDescription', desObj)
		},
		
		validateStopLoss(num) {
			if (num < 0 || num > 100) {
					this.$message({
						message:
							'Only positive numbers less than or equal to 100 are allowed',
						type: 'error',
						offset: 300
					})
				return false
			}
			const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(num) && num !== 0) {
					this.$message({
						message: 'Please enter a two-decimal number',
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
						message: 'Only positive numbers are allowed',
						type: 'error',
						offset: 300
					})
				return false
			}
			const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(num) && num !== 0) {
					this.$message({
						message: 'Please enter a two-decimal number',
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
						message: 'Only positive integers are allowed',
						type: 'error',
						offset: 300
					})
				return false
			}
			return true
		},
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
	top: 56px;
}
.sliUnitNote {
	position: absolute;
	left: 335px;
	top: 105px;
}
@media (min-width: 1680px) {
	.comUnitNote {
		position: absolute;
		left: 454px;
		top: 56px;
	}
	.sliUnitNote {
		position: absolute;
		left: 454px;
		top: 105px;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.comUnitNote {
		position: absolute;
		left: 208px;
		top: 56px;
		font-size: 12px;
	}
	.sliUnitNote {
		position: absolute;
		left: 208px;
		top: 103px;
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
.riskItem{
	display: flex;
	margin: 5px;
	justify-content: center;
	align-items: center;
}
.risk-control-container{
	display: flex;
}

.el-checkbox-group{
	display: flex;
	margin-bottom: 10px;
}
</style>