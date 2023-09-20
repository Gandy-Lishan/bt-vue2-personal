// Set Up Backtest
<template>
	<div class="set-up-container">
		<div class="backtest_container setup_container">
			<el-form
				ref="backtestSetupForm"
				:model="bd"
				label-position="left"
				:rules="rules"
				size="mini"
			>
				<div class="setupTop">
						<div class="setupCenter">
							<el-form-item prop="symbol" label="Symbol">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Choose a stock/index as backtest symbol. (default: SPX)<br
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
										>Input the value of starting capital of the backtest.
										(default: 100000)<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<el-input
									v-model="bd.capital"
									@blur="bd.capital = removeDecimalPlaces(bd.capital)"
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
									@blur="bd.commission = removeDecimalPlaces(bd.commission)"
								></el-input>
							</el-form-item>
							<span class="comUnitNote">(%)</span>
							<el-form-item prop="slippage" label="Slippage">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Input the value of slippage of trading price. (default:
										0)<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<el-input v-model="bd.slippage" @blur="bd.slippage = removeDecimalPlaces(bd.slippage)"></el-input> </el-form-item
							><span class="sliUnitNote">(per trade)</span>
							<el-form-item prop="benchmark" label="Benchmark">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Choose a stock/index with simple entry on the Start date &
										exit on the End date as benchmark compared with this
										backtest. (default: SPX)<br
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
								<el-form-item label="User Tag" prop="use_tag" v-if="is_admin">
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
						</div>
						<div class="setupCenter">
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
										@change="setBacktestHistory(bd.backtest_period)"
										@blur="setBacktestHistory(bd.backtest_period)"
										v-model="bd.backtest_period"
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
										v-if="bd.backtest_period == '22'"
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
										v-if="bd.backtest_period == '22'"
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
										if Weekly is chosen, both weekly and daily sentiment
										indicators will be included in the below criteria sentiment
										indicators selection;<br />
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
							<el-form-item label="Trade Price" prop="trade_price">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>The price used during the transaction,<br />'Next'
										indicates that the trade will only be executed on the next
										bar after the conditions are met on the current day.<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<div class="selectBox">
									<el-select
										v-model="bd.trade_price"
										placeholder="— Select Trade Price —"
										@change="getTradePrice"
									>
										<el-option
											v-for="item in tradePriceOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</div>
							</el-form-item>
							<div class="excludeBox">
								<!-- <el-form-item prop="exclude_oo"> -->
								<el-checkbox v-model="isExcludeOO" @change="changeExcludeOO"
									>Exclude Overlapping Observations
									<el-tooltip effect="dark" placement="top">
										<span slot="content"
											>Select this box if you want to exclude dates that are
											clustered together.<br />
											By selecting this option, the test will only allow one
											trade at a time. <br />
											For example, if you chose '10 days' in the Observation
											Period,
											<br />
											then once the Indicator meets the Indicator Level you
											specify,
											<br />
											the test will not allow another trade for the next 10
											days.<br />
										</span>
										<i class="iconfont icon-wenhao"></i> </el-tooltip
								></el-checkbox>
								<el-input
									v-model="bd.exclude_oo"
									:style="{ visibility: isExcludeOO ? 'visible' : 'hidden' }"
									size="mini"
                  @blur="validateExclude(bd.exclude_oo)"
								></el-input>
                <div class="exclude-error-message" v-if="excludeOOErrMsg">
                   {{ excludeOOErrMsg }}
                </div>
								<!-- </el-form-item> -->
							</div>
							<div class="backtestURLBox">
								<el-form-item
									label="Report URL"
									prop="report_url"
									size="mini"
									v-if="bd.user_tag === 'analyst' && is_admin"
								>
									<el-tooltip effect="dark" placement="top">
										<span slot="content"
											>Fill in the analyst's report url here.</span
										>
										<i class="iconfont icon-wenhao"></i>
									</el-tooltip>
									<el-input v-model="bd.report_url"></el-input>
								</el-form-item>
							</div>
						</div>
				</div>
				<div class="setupFooter">
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
							<div class="descriptionBox">
								<a @click="isToggle = !isToggle"
									>Backtest Description (click to expand)<i
										:class="isToggle ? 'el-icon-minus' : 'el-icon-plus'"
									></i
								></a>
								<div class="des-content" v-show="isToggle">
									<div class="des">
										<!-- <el-form-item
            v-if="bd.description.Introduction != 'edit'"
							label="Introduction"
							prop="introduction"
							placeholder="Give the backtest a introduction"
						>
							<el-input
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 5 }"
								v-model="bd.description.Introduction"
							>
							</el-input>
						</el-form-item> -->
										<!-- 开放权限都可以改 -->
										<el-form-item
											label="Introduction"
											prop="introduction"
											placeholder="Give the backtest a introduction"
										>
											<el-input
												type="textarea"
												@input="change($event)"
												:autosize="false"
												v-model="bd.description.Introduction"
											>
											</el-input>
										</el-form-item>
										<!-- <el-form-item
								v-if="bd.description.Rules"
								label="Rules"
								prop="rules"
								placeholder="Give the backtest rules"
							>
								<el-input
                  disabled
									type="textarea"
									:autosize="{ minRows: 2, maxRows: 5 }"
									v-model="bd.description.Rules"
								>
								</el-input>
							</el-form-item> -->
										<!-- 开放权限都可以改 -->
										<el-form-item
											label="Rules"
											prop="rules"
											placeholder="Give the backtest rules"
										>
											<el-input
												type="textarea"
												@input="change($event)"
												:autosize="false"
												v-model="bd.description.Rules"
											>
											</el-input>
										</el-form-item>
									</div>
								</div>
							</div>
							<div class="direction">
								<el-form-item prop="direction" label="Direction">
									<el-tooltip effect="dark" placement="top">
										<span slot="content"
											>Select Long or Short to specify the starting position of
											the backtest.<br
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
												>Check this option to include three methods of risk
												control to exit position.<br />
												The specified methods will serve as first-come,
												first-execute.<br />
												This option can be used combinedly as an OR condition
												with the Exit Criteria selection or be solely used in
												the Exit Criteria "Only Use Risk Control".<br
											/></span>
											<i class="iconfont icon-wenhao"></i> </el-tooltip
									></el-checkbox>
								</div>
								<div class="tpContainer riskItem" v-if="isRiskControl">
									<el-checkbox v-model="isTakeProfit">
										Take Profit
										<el-tooltip effect="dark" placement="top">
											<span slot="content"
												>Input a value of percentage to exit position when the
												specified profit is reached. (default: 10%)<br
											/></span>
											<i class="iconfont icon-wenhao"></i>
										</el-tooltip>
									</el-checkbox>
									<el-input
										v-model="tp"
                    @blur="tp = removeDecimalPlaces(tp); validateTP(tp)"
										size="mini"
									></el-input>
									<p style="margin: 0px;">(%)</p>
                  <div class="error-message" v-if="tpValidErrMsg">
                   {{ tpValidErrMsg }}
                  </div>
								</div>
								<div class="slContainer riskItem" v-if="isRiskControl">
									<el-checkbox v-model="isStopLoss"
										>Stop Loss

										<el-tooltip effect="dark" placement="top">
											<span slot="content"
												>Input a value of percentage to exit position when the
												specified loss is reached. (default: 5%)<br
											/></span>
											<i class="iconfont icon-wenhao"></i> </el-tooltip
									></el-checkbox>
									<el-input
										v-model="sl"
                    @blur="sl = removeDecimalPlaces(sl); validateSL(sl)"
										size="mini"
									></el-input>
									<p>(%)</p>
                  <div class="error-message" v-if="slValidErrMsg">
                   {{ slValidErrMsg }}
                  </div>
								</div>
								<div class="timContainer riskItem" v-if="isRiskControl">
									<el-checkbox v-model="isTimeInMarket"
                  size="mini"
										>Time In Market
										<el-tooltip effect="dark" placement="top">
											<span slot="content"
												>Input a value of bars to stay in market after entry.<br />Exit
												position when the specified Time In Market is reached.
												(default: 20)<br
											/></span>
											<i class="iconfont icon-wenhao"></i> </el-tooltip
									></el-checkbox>
									<el-input
										v-model="tim"
                    @blur="validateTIM(tim)"
										size="mini"
									></el-input>
									<p>(Bars)</p>
                  <div class="error-message" v-if="timValidErrMsg">
                   {{ timValidErrMsg }}
                  </div>
								</div>
							</div>

				</div>
			</el-form>
		</div>
	</div>
</template>
<script>
import { CIQ } from '@/components/common/chart/st-development/js'
import { timestampToTime } from '@/tools/formatDate'
import {isJson} from '@/tools/isJson'
import { validateCapitalRule, validateCommissionRule, validateSlippageRule, validateURLRule, createTPSLValidate, createPositiveIntegerValidate } from '@/utils/formValidate'
import { mapGetters } from "vuex"
import {
  getIndexsList,
  getStocksList,
  getBacktestName
} from '@/service/service.js'
const throttle = require('lodash/throttle')
const uniqWith = require('lodash/uniqWith')
const isEqual = require('lodash/isEqual')
export default {
  props: { backtestEditData: Object },
  name: 'BasicInfo',
  data() {
    return {
      bd: {
        name: '',
        symbol: 'SPX',
        benchmark: 'SPX',
        strategy: 'Signal',
        capital: 100000.0,
        capital_alloc: 1.0,
        commission: 0.1,
        win_rate: 0.0,
        slippage: 0.0,
        start_date: '',
        end_date: '',
        direction: 'Long',
        frequency: 'Daily',
        risk_control: '//',
        report_url: '',
        user_tag: 'client',
        backtest_period: '21',
        trade_price: 2,
        exclude_oo: 0,
        description: {
          Introduction: '',
          Rules: ''
        },
      },
      historyOptions: [
        {
          value: '1',
          label: '1 Year'
        },
        {
          value: '2',
          label: '2 Year'
        },
        {
          value: '3',
          label: '3 Year'
        },
        {
          value: '4',
          label: '4 Year'
        },
        {
          value: '5',
          label: '5 Year'
        },
        {
          value: '10',
          label: '10 Year'
        },
        {
          value: '15',
          label: '15 Year'
        },
        {
          value: '20',
          label: '20 Year'
        },
        {
          value: '21',
          label: 'All History'
        },
        {
          value: '22',
          label: 'Custom...'
        }
      ],
      frequencyOptions: [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' }
      ],
      tradePriceOptions: [
        { value: 0, label: 'Next Open' },
        { value: 1, label: 'Next Close' },
        { value: 2, label: 'Current Close' },
      ],
      userTagOptions: [
        { value: 'client', label: 'Client' },
        { value: 'analyst', label: 'Analyst' },
        { value: 'system', label: 'System' }
      ],
      symbolList: [],
      indexList: [],
      loading: false,
      options: [],
      tp: 10,
      sl: 5,
      tim: 20,
      isRiskControl: true,
      isTakeProfit: false,
      isStopLoss: false,
      isTimeInMarket: true,

      rules: {
        capital: [
          {
            validator: validateCapitalRule,
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
          { required: true, message: 'Please input backtest name', trigger: 'blur' },
        ],
        report_url: [
          {
            validator: validateURLRule,
            trigger: 'blur'
          }
        ]
      },
      is_admin: false,
      isExcludeOO: false,
      isToggle: false,
      tpValidErrMsg: '',
      slValidErrMsg: '',
      timValidErrMsg: '',
      excludeOOErrMsg: '',
    }
  },
  created() {
    this.is_admin = this.$store.getters.getIsAdmin
    this.generateBTName()
  },
  mounted() {
    this.$emit('IsRiskControl', true)
    // 用于获取 start_date & end_date
    this.getBTDate()
  },
  computed: {
    ...mapGetters(['getterBacktestInfo']),
    updateFreq() {
      return this.$store.state.form.pairDataFreq
    },
    allRiskControlOptions() {
      return this.isTakeProfit || this.isStopLoss || this.isTimeInMarket
    },
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
      handler(newVal) { }
    },
    allRiskControlOptions: {
      handler(newVal) {
        if (!newVal && this.isRiskControl) {
          this.$message({
            message: 'Select at least one Risk Control indicator',
            type: 'error'
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
      this.is_admin = this.$store.getters.getIsAdmin
      this.getBTDate()
      if (this.$store.state.form.backtestSymbol) this.bd.symbol = this.$store.state.form.backtestSymbol
      this.generateBTName()
      this.$emit('IsRiskControl', true)
      this.clearFormValidate()
    },
    clearFormValidate() {
      this.$refs.backtestSetupForm.clearValidate()
    },
    validateTP(value) {
      this.tpValidErrMsg = createTPSLValidate(0, value)
      return this.tpValidErrMsg
    },
    validateSL(value) {
      this.slValidErrMsg = createTPSLValidate(0, value)
      return this.slValidErrMsg
    },
    validateTIM(value) {
      this.timValidErrMsg = createPositiveIntegerValidate(value)
      return this.timValidErrMsg
    },
    validateExclude(value) {
      this.excludeOOErrMsg = createPositiveIntegerValidate(value)
      return this.excludeOOErrMsg
    },
    generateBTName() {
      const date = new Date()
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      this.bd.name = this.bd.symbol + '  ' + year + '-' + month + '-' + day + '  ' + hour + ':' + minute + ':' + second
    },
    getTradePrice(val) {
      this.$store.commit('form/SET_TRADE_PRICE', val)
    },
    getSymbol(val) {
      this.$store.commit('form/getBacktestSymbol', val)
      CIQ.addSymbol(val)
    },
    getBTDate() {
      this.bd.end_date = timestampToTime(new Date())
      if(this.bd.backtest_period == '21') {this.bd.start_date = ''; return}
      const str = this.bd.end_date.split('-')
      str[0] = Number(str[0]) - Number(this.bd.backtest_period) + ''
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
    getDirection(val) {
      // Set direction to vuex
      this.$store.commit('form/getDirection', val)
      // Direction passed to entry and exit
    },
    setBacktestHistory(val) {
      this.bd.end_date = timestampToTime(new Date())
      if (val <= 20 || val == 22) {
        const str = this.bd.end_date.split('-')
        str[0] = Number(str[0]) - Number(this.bd.backtest_period) + ''
        this.bd.start_date = str.join('-')
      }
      if (val == '21') {
        this.bd.start_date = ''
      }
    },
    changeTimeframe(val) {
      this.$store.commit('form/getFreqHighPriority', val)
      CIQ.addIndicators()
    },
    changeExcludeOO(val) {
      if (val) this.bd.exclude_oo = 1
    },
    /* blur 时移除小数点多余位 remove decimal places */
    removeDecimalPlaces: throttle(function (val) {
      let re = /^\d+\.?\d{0,2}$/
      if (val.search(re) !== -1) {
        return val
      } else if (/^\d+\.\d{2,}$/.test(val)) {
        return val.split('.')[0] + '.' + val.split('.')[1].substring(0, 2)
      } else {
        return val
      }
    }, 500),
    async getIndexsList() {
      try {
        let vm = this
        if (vm.$store.state.chart.indexsList.length != 0) {
          vm.indexList = vm.$store.state.chart.indexsList.map((item) => {
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

      if (vm.$store.state.chart.stocksList.length != 0) {
        vm.symbolList = vm.$store.state.chart.stocksList.map((item) => {
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
        for (var item of options) {
          if (
            item.value.toLowerCase() === query.toLowerCase() ||
            item.label.toLowerCase() === query.toLowerCase()
          ) {
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
        this.isTimeInMarket = true
        this.$emit('IsRiskControl', true)
      }
      this.$store.commit('form/isRiskControl', val)
    },
    getFrequency(val) {
      // getFrequency will no longer call addIndicator and pass a parameter to it
      this.bd.frequency = val
      this.$store.commit('form/getFrequency', val)
    },
    setSetUpLoadingSetting(isSetupLoading, percentage, progressText) {
			this.$store.commit('form/SET_SETUP_LOADING', {
				isSetupLoading,
				percentage,
				progressText
			})
		},
    saveData() {
      /* 校验表单字段 */
      if(!this.validateForm()) {this.setSetUpLoadingSetting(false, 0, '');return}
      let bd = JSON.parse(JSON.stringify(this.bd))
      this.getTradePrice(bd.trade_price)
      /* 处理数据 */
      if(bd.backtest_period == '21') bd.start_date = '1800-10-01'
      if(!this.isExcludeOO) bd.exclude_oo = 0
      bd.commission = (bd.commission / 100)
      bd.risk_control = this.isRiskControl ? `${this.isTakeProfit ? this.tp : ''}/${this.isStopLoss ? this.sl : ''}/${this.isTimeInMarket ? this.tim : ''}` : '//'
      if(this.isRiskControl) this.setDesciption()
      console.log(bd)
      this.$store.commit('form/setBd', bd)
    },
    async validateForm() {
      /* 校验表单字段 */
      let formValid, riskControlValid, stopLossValid, takeProfitValid, timeInMarketValid, excludeValid, nameValid, setUpValid, nameLookupRes, nameValidPass
      let _this = this
      if(!_this.bd.end_date) {
        _this.$message.error('Please select end date')
        return false
      }
      _this.$refs['backtestSetupForm'].validate((valid) => {
        if(valid) {
          formValid = true
        }else {
          formValid = false
          _this.$message.error('Kindly ensure that the form fields are filled correctly.')
          return false
        }
      })
      /* 如果勾选了 risk control,则校验 stop loss, take profit, time in market */
      if(_this.isRiskControl) {
        if(_this.isStopLoss) stopLossValid = _this.validateTP(_this.sl)
        if(_this.isTakeProfit) takeProfitValid = _this.validateSL(_this.tp)
        if(_this.isTimeInMarket) timeInMarketValid = _this.validateTIM(_this.tim)
        riskControlValid = (_this.isStopLoss ? (stopLossValid === '') : true) && (_this.isTakeProfit ? (takeProfitValid === '') : true) && (_this.isTimeInMarket ? (timeInMarketValid === '') : true)
      }
      /* 如果勾选了 exclude overlapping observations,则校验 exclude overlapping observations */
      if(_this.isExcludeOO) excludeValid = (_this.validateExclude(_this.bd.exclude_oo) === '')
      /* 表单总验证 */
      setUpValid = (formValid && ((_this.isRiskControl && riskControlValid) || !_this.isRiskControl) && ((_this.isExcludeOO && excludeValid) || !_this.isExcludeOO) )
      if(!setUpValid){ _this.$message.error('Kindly ensure that the form fields are filled correctly.'); return false }
      /* backtest name 校验 */
      nameLookupRes = await getBacktestName(_this.bd.name)
      const nameList = nameLookupRes.data.results
      if(nameList.length === 0) nameValid = true
        for (let i = 0; i < nameList.length; i++) {
          if (nameList[i].name == _this.bd.name) {
            // 重名
            nameValid = false
            break
          }
          nameValid = true
        }
      /* 重名且编辑 没名字是编辑 没名字是新建 */
      nameValidPass = (!nameValid && _this.getterBacktestInfo.hasOwnProperty('old_uuid')) || (nameValid) && _this.getterBacktestInfo.hasOwnProperty('old_uuid') || (nameValid) && !_this.getterBacktestInfo.hasOwnProperty('old_uuid')
      if(!nameValidPass) {_this.$message.error('The backtest name already exists.'); return false}
      return setUpValid && nameValidPass
    },
    setDesciption() {
      let criteria = 'X:', desObj = {}, description, tpStr='', slStr='', timStr=''
      let direction = this.bd.direction == 'Long' ? 'Close' : 'Cover'
      description = `${criteria} ${direction}:`
      if (this.isRiskControl) {
        if (this.isTakeProfit) {
          description += ` Take Profit ${this.tp}%`
        }
        if (this.isStopLoss) {
          description += ` Stop Loss ${this.sl}%`
        }
        if (this.isTimeInMarket) {
          description += ` Time In Marke ${this.tim}(Bars)`
        }
      }
      desObj.description = description
      this.$store.commit('form/saveRiskDescription', desObj)
    },
    setEditData(editData) {
      if(Object.keys(editData).length === 0) return
        let description, riskValArr = [], backtestPeriod, propertiesToDelete = [
          'entry', 
          'exit', 
          'user_id', 
          'status', 
          'results', 
          'uuid',
          'entry_description',
          'exit_description'
        ]
        this.clearForm() // clear set up form before editting
        propertiesToDelete.forEach(property => {
          delete editData[property];
        })
        try {
          description = JSON.parse(exitData.description)
        } catch (error) {
          description = {}
          description.Introduction = ''
          description.Rules = ''
        }
        /* 设置编辑数据 */
        editData.description = description
        editData.commission = (editData.commission * 100).toFixed(2)
        editData.slippage = Number(editData.slippage).toFixed(2)
        editData.trade_price = Number(editData.trade_price)
        this.is_admin = this.$store.getters.getIsAdmin
        this.bd = Object.assign(this.bd, editData)
        if (this.bd.exclude_oo > 0) this.isExcludeOO = true
        if (editData.risk_control) {
          riskValArr = editData.risk_control.split('/')
          riskValArr.forEach((value, index) => {
            if (value) {
              this.isRiskControl = true;
              if (index === 0) {
                this.isTakeProfit = true;
                this.tp = value;
              } else if (index === 1) {
                this.isStopLoss = true;
                this.sl = value;
              } else if (index === 2) {
                this.isTimeInMarket = true;
                this.tim = value;
              }
            }
          });
          if (this.isRiskControl) {
            this.selectRiskControl(true);
          }
        }
        // 还是用getFrequency因为无需edit后再次调用addIndicators()
        this.getFrequency(editData.frequency)
        this.getDirection(editData.direction)
        this.getTradePrice(editData.trade_price)
        /* set latest backtest period */
        backtestPeriod = editData.backtest_period
        if(!backtestPeriod) {this.caculateBacktestPeriod()}
        this.bd.end_date = timestampToTime(new Date())
        // 如果是 custom 不改变 start_date, 如果是 all history, start_date 为空, 其他的都要改 start_date
        if(this.bd.backtest_period <= 20) {
          // start_date 也要改
          const str = this.bd.end_date.split('-')
          str[0] = Number(str[0]) - Number(this.bd.backtest_period) + ''
          this.bd.start_date = str.join('-')
        }else if(this.bd.backtest_period == '21') {
          this.bd.start_date = ''
        }
    },
    caculateBacktestPeriod() {
      let { start_date, end_date } = this.bd;
      if (!start_date || start_date === '1800-10-01') {
        // All History
        this.bd.backtest_period = '21';
      } else {
        let startArr = start_date.toString().split('-');
        let endArr = end_date.toString().split('-');
        let year = Number(endArr[0]) - Number(startArr[0]);
        let month = Number(endArr[1]) - Number(startArr[1]);
        let day = Number(endArr[2]) - Number(startArr[2]);
        this.bd.backtest_period = month === 0 && day === 0 ? year.toString() : '22';
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.css';
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

	left: 346px;
	top: 92px;
}
.sliUnitNote {
	position: absolute;
	left: 346px;
	top: 135px;
}
@media (min-width: 1680px) {
	.comUnitNote {
		position: absolute;
		left: 700px;
		top: 90px;
	}
	.sliUnitNote {
		position: absolute;
		left: 700px;
		top: 133px;
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
// .border-set {
// 	border-bottom: 1px solid #797979;
// }
.riskItem {
	display: flex;
	margin: 0px 5px 5px 5px;
	justify-content: center;
	align-items: center;
  position: relative;
}
.risk-control-container {
	display: flex;
	justify-content: flex-end;
}

.el-checkbox-group {
	display: flex;
	margin-bottom: 10px;
}
.el-input {
	display: inline;
}
.el-select {
	top: -30px;
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
.descriptionBox {
  width: 73%;
	padding: 10px;
	border: 1px solid #dcdfe6;
	border-radius: 10px;
}
.direction {
  width: 73%;
}
.descriptionBox a {
	font-weight: 500;
	display: flex;
	justify-content: center;
	align-items: center;
	justify-content: space-between;
}
.descriptionBox a:hover {
	color: #5b9bd1;
}
.des-content {
	margin-top: 10px;
}
.set-up-container {
	padding-top: 20px;
}
.setupCenter {
	display: flex;
	flex-direction: column;
	justify-content: center; /* 水平居中 */
	align-items: start; /* 垂直居中 */
	height: 100%; /* 确保内容占据整个列的高度 */
  width: 50%;
}
.backtest_container .el-form-item__content {
}
.setupTop {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: start;
}
.setupFooter {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
  .nameBox{
		width: 100%;
	}
}
.backtest_container{
	border-bottom: 1px solid #797979;
}

.excludeBox {
    position: relative;
    padding-bottom: 20px;
  }
.error-message,.exclude-error-message  {
    margin-top: 40px;
    position: absolute;
    line-height: 1;
    font-size: 10px;
    color: #F56C6C;
}
.exclude-error-message{
  margin-top: 0px;
  right: 0;
}
</style>