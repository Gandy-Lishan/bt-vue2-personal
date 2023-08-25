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
										>Input the value of slippage of trading price. (default:
										0)<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<el-input v-model="bd.slippage"></el-input> </el-form-item
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
										v-if="bd.backtest_period === '22'"
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
										v-if="bd.backtest_period === '22'"
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
                  @blur="_validateExclude"
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
                    @blur="validateTP"
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
                    @blur="validateSL"
										@input="setDesciption"
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
                    @blur="validateTIM"
										@input="setDesciption"
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
import { timestampToTime } from '@/tools/formatDate.js'
import { validateCapitalRule, validateCommissionRule, validateSlippageRule, validateURLRule, createTPSLValidate, createPositiveIntegerValidate } from '@/utils/formValidate'
import { mapMutations } from "vuex"
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
      mmValue: 0,
      mmOptions: [
        {
          value: 0,
          label: 'All In / All Out (CASH)'
        }
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
      oldBacktestName: '',
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
    this.getEndDate()
  },
  computed: {
    updateFreq() {
      return this.$store.state.form.pairDataFreq
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
    ...mapMutations(['form', 'GET_END_DATE']),
    validateTP({ target: { value } }) {
      this.tpValidErrMsg = createTPSLValidate(0, value)
    },
    validateSL({ target: { value } }) {
      this.slValidErrMsg = createTPSLValidate(0, value)
    },
    validateTIM({ target: { value } }) {
      this.timValidErrMsg = createPositiveIntegerValidate(value)
    },
    _validateExclude({ target: { value } }) {
      this.excludeOOErrMsg = createPositiveIntegerValidate(value)
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
    clearForm() {
      Object.assign(this.$data, this.$options.data())
      this.is_admin = this.$store.getters.getIsAdmin
      this.getEndDate()
      if (this.$store.state.form.backtestSymbol) this.bd.symbol = this.$store.state.form.backtestSymbol
      this.generateBTName()
      this.$emit('IsRiskControl', true)
      this.clearFormValidate()
    },
    setEditData(newVal) {
      if (JSON.stringify(newVal) != '{}') {
        this.clearForm()
        console.log('未处理之前的编辑数据', newVal)
        delete newVal.entry
        delete newVal.exit
        delete newVal.user_id
        delete newVal.status
        delete newVal.results
        delete newVal.uuid
        delete newVal.entry
        delete newVal.exit
        delete newVal.results
        // newVal.user_tag = 'client'
        let description = {}
        try {
          if (newVal.description == null || newVal.description == undefined) {
            throw new Error('description is null')
          }
          description = JSON.parse(newVal.description)
        } catch (error) {
          console.log(error)
          description = {}
          // newVal.description.Introduction = 'edit'
          description.Introduction = ''
          // newVal.description.Rules = entry_description + '<br>'+ exit_description
          description.Rules = ''
        }
        newVal.description = description
        delete newVal.entry_description
        delete newVal.exit_description
        newVal.commission = (newVal.commission * 100).toFixed(2)
        newVal.slippage = Number(newVal.slippage).toFixed(2)
        newVal.trade_price = Number(newVal.trade_price)
        this.is_admin = this.$store.getters.getIsAdmin
        this.bd = Object.assign(this.bd, newVal)
        this.$set(this.bd, 'description', this.bd.description);
        //this.changeTimeframe(newVal.frequency)
        // 还是用getFrequency因为无需edit后再次调用addIndicators()
        this.getFrequency(newVal.frequency)

        this.getDirection(newVal.direction)
        this.getTradePrice(newVal.trade_price)
        this.isRiskControl = false
        this.isTakeProfit = false
        this.isStopLoss = false
        this.isTimeInMarket = false
        this.isExcludeOO = false
        if (this.bd.exclude_oo > 0) {
          this.isExcludeOO = true
        }
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
        try {
          this.bd.backtest_period = newVal.backtest_period
          if (newVal.backtest_period == '21') {
            this.bd.start_date = ''
          }
          if (newVal.backtest_period == null || newVal.backtest_period == undefined) {
            throw Error('不存在 backtest_period')
          }
        } catch (error) {
          console.error('不存在 backtest_period', error)
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
              this.bd.backtest_period = year + ''
            } else {
              this.bd.backtest_period = 22 + ''
            }
          } else {
            this.bd.backtest_period = 21 + ''
            this.bd.start_date = ''
          }
        }
        console.log('处理完成之后的编辑数据', this.bd, CIQ.stxx.chart)
      }
    },
    getDirection(val) {
      // Set direction to vuex
      this.$store.commit('form/getDirection', val)
      // Direction passed to entry and exit
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
      this.$store.commit('form/getBacktestSymbol', val)
      CIQ.addSymbol(val)
    },
    formateStartDate(val) {
      this.bd.start_date = val
    },
    formateEndDate(val) {
      this.bd.end_date = val
    },
    getEndDate() {
      // this.bd.end_date = timestampToTime(new Date())
      // const str = this.bd.end_date.split('-')
      // str[0] = Number(str[0]) - Number(this.bd.backtest_period) + ''
      // this.bd.start_date = str.join('-')

      // var that = this
      // var utils = function () {
      //   let vm = this
      //   vm.setSymbol = function (symbol) {
      //     that.bd.symbol = symbol
      //   }
      // }
      // return (window.utils = new utils())
      this.GET_END_DATE(this)
    },
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
    getBacktestHistory(val) {
      this.bd.end_date = timestampToTime(new Date())
      if (val <= 20 || val == 22) {
        this.bd.end_date = timestampToTime(new Date())
        const str = this.bd.end_date.split('-')
        str[0] = Number(str[0]) - Number(this.bd.backtest_period) + ''
        this.bd.start_date = str.join('-')
      }
      if (val == '21') {
        this.bd.start_date = ''
      }
    },
    setBacktestHistory(val) {
      this.bd.end_date = timestampToTime(new Date())
      if (val <= 20 || val == 22) {
        this.bd.end_date = timestampToTime(new Date())
        const str = this.bd.end_date.split('-')
        str[0] = Number(str[0]) - Number(this.bd.backtest_period) + ''
        this.bd.start_date = str.join('-')
      }
      if (val === '21') {
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
      this.bd.frequency = val
      this.$store.commit('form/getFreqHighPriority', val)
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
        this.isTimeInMarket = true
        this.$emit('IsRiskControl', true)
      }
      this.$store.commit('form/isRiskControl', val)
    },
    getFrequency(val) {
      // getFrequency will no longer call addIndicator and pass a parameter to it
      this.$store.commit('form/getFrequency', val)
    },
    async getIndicatorsList() {
      try {
        const vm = this
        var indicatorList = []
        if (CIQ.indicatorList) {
          if (CIQ.indicatorList.length != 0) {
            indicatorList = this.$store.state.chart.indicatorsList
            indicatorList = CIQ.indicatorList
          }
        } else {
          const res = await getIndicatorsList()
          indicatorList = res.data
        }
        this.$store.commit('chart/getIndicatorsList', indicatorList)
        CIQ.indicatorList = indicatorList
      } catch (error) {
        console.error('indicator list request error', error)
      }
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
      let excludeCheck = true
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
      if (this.isExcludeOO) {
        excludeCheck = this.validateExclude(this.bd.exclude_oo)
      }
      const filmCheck = validForm && riskCheck && excludeCheck
      if (!validForm) {
        this.$message({
          message:
            'Please check the setup form',
          type: 'error',
          offset: 150
        })
      }
      if (!filmCheck) return false
      if (filmCheck) {
        if (bd.end_date) {
          if (!this.isExcludeOO) { bd.exclude_oo = 0 }
          bd.commission = bd.commission / 100
          if (this.isRiskControl) {
            let riskStr = `${this.isTakeProfit ? this.tp : ''}/${this.isStopLoss ? this.sl : ''
              }/${this.isTimeInMarket ? this.tim : ''}`
            bd.risk_control = riskStr
            this.setDesciption()
          } else {
            bd.risk_control = '//'
          }
          if (this.bd.backtest_period >= 0 && this.bd.backtest_period <= 20) {
            // 改成最新的 start end
            // bd.end_date = '1800-10-01'
            bd.end_date = timestampToTime(new Date())
            const str = bd.end_date.split('-')
            str[0] = Number(str[0]) - Number(this.bd.backtest_period) + ''
            bd.start_date = str.join('-')
          }
          if (this.bd.backtest_period == '21') {
            bd.start_date = '1800-10-01'
            // end 改成最新的
            bd.end_date = timestampToTime(new Date())
          }
          // 这里是小薛的想法
          if (this.bd.backtest_period == '22') {
            // end 改成最新的
            bd.end_date = timestampToTime(new Date())
          }
          this.$store.commit('form/setBd', bd)
          return checked
        } else {
          this.$message({
            message: 'Please select end date',
            type: 'error',
            offset: 200
          })
          checked = false
          return checked
        }
      }
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
      this.$store.commit('form/saveRiskDescription', desObj)
    },
    validateStopLoss(num) {
      if (num < 0) {
        this.$message({
          message:
            'Please enter Stop Loss,only positive numbers less than or equal to 100 are allowed',
          type: 'error',
          offset: 100
        })
        return false
      }
      const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
      if (!pattern.test(num) && num !== 0) {
        this.$message({
          message:
            'Please enter Stop Loss, only two decimal places are allowed',
          type: 'error',
          offset: 100
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
          offset: 100
        })
        return false
      }
      const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
      if (!pattern.test(num) && num !== 0) {
        this.$message({
          message:
            'Please enter Take Profit, only two decimal places are allowed',
          type: 'error',
          offset: 100
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
          offset: 100
        })
        return false
      }
      return true
    },
    validateExclude(num) {
      if (isNaN(num) || num <= 0 || !/^\d+$/.test(num)) {
        this.$message({
          message:
            'Please enter Exclude Overlapping Observations, only positive integers are allowed',
          type: 'error',
          offset: 100
        })
        return false
      }
      return true
    },
    changeExcludeOO(val) {
      if (val) this.bd.exclude_oo = 1
    },
    isEdit() {
      if (this.oldBacktestName == this.bd.name) {
        return true
      }
    },
    change() {
      this.$forceUpdate()
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