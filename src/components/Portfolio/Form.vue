<template>
  <div class="portfolio-form">
    <el-form
      ref="Form"
      :model="data"
      size="mini"
      label-width="150px"
      label-position="left"
      :rules="rules">
      <div class="grid-row">
          <el-form-item label="1. Name" prop="name">
            <el-input v-model="data.name" clearable></el-input>
          </el-form-item>
          <div></div>
          <el-form-item prop="portfolioChecked" class="portfolio-check" style="margin-left: 0px;">
            <el-checkbox v-model="portfolioChecked">2. Auto Portfolio</el-checkbox>
          </el-form-item>
      </div>
      <div class="form-main">
        <div class="grid-row main-row">
          <div class="left">
            <el-form-item
                label="Start Date"
                prop="start_date"
              >
              <template slot="label">
                <label>
                  Start Date
                  <el-tooltip effect="dark" placement="top">
                    <span slot="content"
                      ></span>
                    <i class="iconfont icon-wenhao"></i>
                  </el-tooltip>
                </label>
              </template>
                <el-date-picker
                  v-model="data.start_date"
                  type="date"
                  placeholder="- Select Start Date -"
                  value-format="yyyy-MM-dd"
                  :picker-options="startPickerOptions"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="return">
              <template slot="label">
                <label>
                  <el-checkbox v-model="returnChecked" label="Return">Return</el-checkbox>
                  <!-- <el-tooltip effect="dark" placement="top">
                    <span slot="content"
                      >The long-short position during the backtest period. <br/>
                      Enter two values here, <br/>
                      representing the weights of long and short positions respectively.</span>
                    <i class="iconfont icon-wenhao"></i>
                  </el-tooltip> -->
                </label>
              </template>
              <div class="_conditionBox">
                  <el-form-item prop="min_return" label-width="0px">
                    <el-input v-model="data.min_return" placeholder="Input Value">
                    </el-input>
                  </el-form-item>
                  <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                  <el-form-item prop="max_return" label-width="0px">
                    <el-input v-model="data.max_return" placeholder="Input Value">
                    </el-input>
                  </el-form-item>
              </div>
            </el-form-item>
            <el-form-item prop="win_rate">
              <template slot="label">
                <label>
                  <el-checkbox v-model="data.winRateChecked" label="Return">Win Rate</el-checkbox>
                  <!-- <el-tooltip effect="dark" placement="top">
                    <span slot="content"
                      >The long-short position during the backtest period. <br/>
                      Enter two values here, <br/>
                      representing the weights of long and short positions respectively.</span>
                    <i class="iconfont icon-wenhao"></i>
                  </el-tooltip> -->
                </label>
              </template>
              <div class="_conditionBox">
                  <el-form-item prop="win_rate" label-width="0px">
                    <el-input v-model="data.win_rate" placeholder="Input Value">
                    </el-input>
                  </el-form-item>
                  <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                  <el-form-item prop="win_rate" label-width="0px">
                    <el-input v-model="data.win_rate" placeholder="Input Value">
                    </el-input>
                  </el-form-item>
              </div>
            </el-form-item>
          </div>
          <div></div>
          <div class="right">
            <el-form-item
                label="End Date"
                prop="end_date"
              >
              <template slot="label">
                <label>
                  End Date
                  <el-tooltip effect="dark" placement="top">
                    <span slot="content"
                      ></span>
                    <i class="iconfont icon-wenhao"></i>
                  </el-tooltip>
                </label>
              </template>
                <el-date-picker
                  v-model="data.end_date"
                  type="date"
                  placeholder="- Select End Date -"
                  value-format="yyyy-MM-dd"
                  :picker-options="endPickerOptions"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="max_drow_down">
              <template slot="label">
                <label>
                  <el-checkbox v-model="data.max_drow_downChecked" label="Return">Max Drow Down</el-checkbox>
                  <!-- <el-tooltip effect="dark" placement="top">
                    <span slot="content"
                      >The long-short position during the backtest period. <br/>
                      Enter two values here, <br/>
                      representing the weights of long and short positions respectively.</span>
                    <i class="iconfont icon-wenhao"></i>
                  </el-tooltip> -->
                </label>
              </template>
              <div class="_conditionBox">
                  <el-form-item prop="max_drow_down" label-width="0px">
                    <el-input v-model="data.max_drow_down" placeholder="Input Value">
                    </el-input>
                  </el-form-item>
                  <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                  <el-form-item prop="max_drow_down" label-width="0px">
                    <el-input v-model="data.max_drow_down" placeholder="Input Value">
                    </el-input>
                  </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-button type="primary" :disabled="!portfolioChecked">Found Portfolio</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div>
      <br>
      <el-table
      :data="portfolioData"
      stripe
      border
      size="mini"
      class="portfolioTable"
      highlight-current-row                                       
      >
      <el-table-column label="Index" header-align="center" align="center" width="80px">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="Model Name" header-align="center" align="center" prop="indicator">
        <template slot-scope="scope" >
          <el-autocomplete
            v-model="scope.row.name"
            :disabled="scope.$index === 0"
            size="mini"
            :fetch-suggestions="querySearch"
            @select="
							(item) => {
								handleRowSelect(item, scope.row)
							}
						"
            >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <!-- 使用 scoped slot 自定义选项 -->
						<!-- <template slot-scope="{ item }">
							<div class="custom-option">
								<span class="item-label" v-if="item.type === 'Indicator'">{{
									item.label
								}}</span>
								<span class="item-label" v-else-if="item.type === 'Symbol'">{{
									item.url
								}}</span>
								<span v-if="item.type === 'Symbol'" class="symbol-label">{{
									item.label
								}}</span>
								<span v-if="item.type === 'Symbol'" class="type-label"
									>Symbol</span
								>
								<span v-if="item.type === 'Indicator'" class="type-label"
									><span class="updated-label">{{item.updated}}</span>
                  Indicator</span
								>
							</div>
						</template> -->
          </el-autocomplete>
        </template>
      </el-table-column>
      <el-table-column label="Weight" header-align="center" align="center" prop="weight" width="200">
        <template slot-scope="scope">
          <!-- 注释掉：无需校验 totalWeight <= 100 -->
          <!-- <el-input v-model="scope.row.weight" size="mini" @input="validateWeightRule(scope.row)" @blur="validateTotalPercentage(scope.row)"> -->
          <el-input v-model="scope.row.weight" size="mini" @input="validateWeightRule(scope.row)" label-width="50px" :disabled="scope.$index === 0">
            <template v-slot:append>(%)</template>
          </el-input>
          <div class="weight-error-message">
            {{ scope.row.weightValidErrMsg }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="300">
        <template slot-scope="scope">
          <!-- <el-form-item label="Starting Capital" v-if="scope.$index === 0">
              <el-input v-model="scope.row.starting_capital" size="mini"></el-input>
          </el-form-item> -->
          <div class="starting-capital" v-if="scope.$index === 0">
            <span>Starting Capital</span>
            <el-input v-model="scope.row.starting_capital" size="mini" @input="validateStartingCapital(scope.row.starting_capital)"></el-input>
            <div class="error-message">{{ validCapitalErrMsg }}</div>
          </div>
          <el-button v-if="scope.$index === 1" @click="addRow(scope.row)" icon="el-icon-circle-plus-outline" size="mini" type="primary">Add Strategies</el-button>
          <el-button v-else-if="scope.$index > 1" size="mini" type="primary" icon="el-icon-delete" @click.stop="deleteRow(scope.$index)" class="delete-btn">Delete Strategies</el-button> 
        </template>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { isJson, timestampToTime, trimTrailingZeros } from '@/utils'
import SelectCheck from "./SelectCheck";
import { validateCapitalRule, validateCommissionRule, createPositiveScopeIntegerRule, createTPSLScopeValidateRule, createPositiveIntegerRule, createPositiveIntegerValidate, validatePercentageRule } from '@/utils/formValidate'
import { saveScannerForm, editScannerForm, getScannerBTList, getScannerBTResults, perviewScannerForm } from '@/service/service'

export default {
  name: 'Form',
  props: ['parentContext'],
  components: {
    SelectCheck
  },
  data() {
    var validateCapitalAllocate = (rule, value, callback) => {
      if (value === 'Kelly') {
          callback(); // 验证通过
        } else {
          // 验证是否为 0 到 1 的最大两位小数值
          const numberValue = parseFloat(value);
          if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 1) {
            const decimalCount = (numberValue.toString().split('.')[1] || '').length;
            if (decimalCount <= 2) {
              callback(); // 验证通过
            } else {
              callback(new Error('Value between 0 and 1 with max two decimals'));
            }
          } else {
            callback(new Error("Value should be 'Kelly' or a number 0-1"));
          }
        }
    };
    var validateRatio = (rule, value, callback) => {
      // 验证是否为正整数
      const integerValue = parseInt(value);
      const field = rule.field
      const short_ratio = field == 'short_ratio' ? integerValue : parseInt(typeof this.data.short_ratio === 'undefined' ? 20 : this.data.short_ratio);
      const long_ratio = field == 'long_ratio' ? integerValue : parseInt(typeof this.data.long_ratio === 'undefined' ? 80 : this.data.long_ratio);

      if (short_ratio === 0 && long_ratio === 0) {
          callback(new Error("The percentages cannot be both 0"));
      } else if (!isNaN(integerValue) && integerValue >= 0 && short_ratio + long_ratio <= 100 && Number.isInteger(integerValue)) {
          callback(); // 验证通过
      } else {
          callback(new Error("Percentages must sum to 100% and be positive whole numbers"));
      }
    };
    var validateSignals = (rule, value, callback) => {
      if(Array.isArray(value) && value.length === 0) {
        callback(new Error('Please select at least one signal'))
      }else {
        callback()
      }
    };
    return {
      data: {
        name: 'my portfolio',
        checked: false,
        start_date: '',
        end_date: '',
        returnChecked: false,
        max_drow_downChecked: false,
        max_drow_down: ''
      },
      portfolioChecked: false,
      returnChecked: false,
      validCapitalErrMsg: '',
      portfolioData: [
        {
          name: 'Cash',
          weight: '100',
          starting_capital: 1000000
        },
        {
          name: 'Dual Trend Model',
          weight: '',
          starting_capital: ''
        }
      ],
      rowUrl: null,
      btnLoading: false,
      previewBtnLoading: false,
      isPolling: false,
      processTips: '',
      percentage: 0,
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      typeOptions: [
        { value: 'stock', label: 'Stock' },
        { value: 'etf', label: 'ETF' },
        { value: 'stock/etf', label: 'Stock & ETF' },
      ],
      RankCondition: [
        { value: 'Kelly', label: 'Kelly'},
        { value: 'WinRate', label: 'Win Rate(%)'},
        { value: 'Z_Score', label: 'Z-Score'},
        { value: 'StdDev', label: 'STD.DEV'},
        { value: 'Expected Return(%)', label: 'Expected Return(%)'},
      ],
      options: [
        {
          value: 'MA',
          label: 'MA',
          check: true
        },
        {
          value: 'MAGap',
          label: 'MAGap',
          check: true
        },
        {
          value: 'MACDHist',
          label: 'MACDHist',
          check: true
        },
        {
          value: 'MACDHistGap',
          label: 'MACDHistGap',
          check: true
        },
        {
          value: 'Hammer followed by a raise',
          label: 'Hammer followed by a raise',
          check: true
        },
        {
          value: 'Shooting Star followed by a fall',
          label: 'Shooting Star followed by a fall',
          check: true
        },
        {
          value: 'UpTrend Pattern',
          label: 'UpTrend Pattern',
          check: true
        },
        {
          value: 'DownTrend Pattern',
          label: 'DownTrend Pattern',
          check: true
        },
        {
          value: 'Optix #1',
          label: 'Optix #1',
          check: true
        },
        {
          value: 'Optix #2',
          label: 'Optix #2',
          check: true
        },
        {
          value: 'Optix #3',
          label: 'Optix #3',
          check: true
        },
        {
          value: 'Optix #4',
          label: 'Optix #4',
          check: true
        },
        {
          value: 'PriceBreakout',
          label: 'PriceBreakout',
          check: true
        },
        {
          value: 'HighPoints',
          label: 'HighPoints',
          check: true
        },
        {
          value: 'LowPoints',
          label: 'LowPoints',
          check: true
        },
        {
          value: 'RSI',
          label: 'RSI',
          check: true
        }
      ],
      rules: {
        name: [
          { required: true, message: 'Enter a name', trigger: 'blur' },
          { required: true, message: 'Enter a name', trigger: 'change' }
        ],
        start_date: [
        { required: true, message: 'Select start date', trigger: 'blur' },
        { required: true, message: 'Select start date', trigger: 'change' }
        ],
        end_date: [
        { required: true, message: 'Select end date', trigger: 'blur' },
        { required: true, message: 'Select end date', trigger: 'change' }
        ],
        time_in_market_condition: [
          { validator: (rule, value, callback) => createPositiveScopeIntegerRule('time in market', 0, this.data.time_in_market)(rule, value, callback), trigger: 'blur' },
          { validator: (rule, value, callback) => createPositiveScopeIntegerRule('time in market', 0, this.data.time_in_market)(rule, value, callback), trigger: 'change' }
        ],
        time_in_market: [
          { validator: (rule, value, callback) => createPositiveScopeIntegerRule('time in market', this.data.time_in_market_condition)(rule, value, callback), trigger: 'blur' },
          { validator: (rule, value, callback) => createPositiveScopeIntegerRule('time in market', this.data.time_in_market_condition)(rule, value, callback), trigger: 'change' }
        ],
        min_return: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(null, this.data.min_return)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.max_return, null)(rule, value, callback), trigger: 'change' }
        ],
        max_return: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule()(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule()(rule, value, callback), trigger: 'change' }
        ],
        take_profit_condition: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.take_profit)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.take_profit)(rule, value, callback), trigger: 'change' }
        ],
        commission: [
          { validator: validateCommissionRule, trigger: 'blur' },
          { validator: validateCommissionRule, trigger: 'change' }
        ],
        total_capital: [
          { validator: validateCapitalRule, trigger: 'blur'},
          { validator: validateCapitalRule, trigger: 'change' }
        ],
        daily_limit: [
          { validator: createPositiveIntegerRule('Daily Stock Nums', 1, 5), trigger: 'blur' },
          { validator: createPositiveIntegerRule('Daily Stock Nums', 1, 5), trigger: 'change' }
        ],
        capital_allocate: [
          { required: true, message: 'Enter Rank Condition', trigger: 'blur' },
          { validator: validateCapitalAllocate, trigger: 'blur' },
          { validator: validateCapitalAllocate, trigger: 'change' },
        ],
        signals: [
          { validator: validateSignals, trigger: 'blur' },
          { validator: validateSignals, trigger: 'change' },
        ]
      }
    }
  },
  mounted() {
    this.setBacktestHistory(1)
    this.generateCPMName()
  },
  methods: {
    generateCPMName() {
      const date = new Date()
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      this.data.name = `ScannerAI Backtest ${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    handleDisabledStartDate(time) {
      const today = timestampToTime(new Date())
      const endDay = timestampToTime(new Date(this.data.end_date))
      // 如果endDate取消选择，则startDate可以选择全部
      if(this.data.end_date){
        return timestampToTime(time) >= endDay
      }else{
        return (timestampToTime(time) > today)
      }
    },
    handleDisabledEndDate(time) {
      const today = timestampToTime(new Date())
      const startDay = timestampToTime(new Date(this.data.start_date))
      return (timestampToTime(time) > today) || (timestampToTime(time) <= startDay)
    },
    setBacktestHistory(val) {
      this.data.end_date = timestampToTime(new Date());
      const endDate = new Date(this.data.end_date);
      const startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - val)
      this.data.start_date = timestampToTime(startDate);
    },
    resetForm() {
      // 如果当前在预览状态，不允许重置; 运行但是没进入轮询: isPolling: false; btnLoading: true
      if((!this.isPolling && this.btnLoading) || this.previewBtnLoading) return true
      this.$refs['SelectCheck'].handleoptionsAllChange(true)
			// Object.assign(this.$data, this.$options.data())
      this.data.signals = ['All']
      this.generateCPMName()
      this.setBacktestHistory(1)
      this.$refs['Form'].clearValidate()
    },
    selected(signals){
      console.log('触发了', signals)
      this.data.signals = signals
    },
    async checkDuplicateNames(name) {
        const nameLookupRes = await getScannerBTList(null, null, name)
        const count = nameLookupRes.data.count
        const nameList = nameLookupRes.data.results
        // 有重名
        if(count != 0) {
          const duplicateItem = nameList.filter(item => item.name == name)
          if(duplicateItem.length) return true
        }
        // 不重名
        return false

    },
    async validForm(formName) {
      const validateForm = async (formRef) => {
        return new Promise(resolve => {
          this.$refs[formRef].validate(valid => {
            resolve(valid);
          });
        });
      };
      return await validateForm(formName)
    },
    async previewSCList() {
      if(this.data.signals.length === 0) {this.popUpMsgBox('Please select at least one signal');return}
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly')
        return
      }
      const {
        long_ratio, short_ratio, 
        stop_loss, take_profit, time_in_market,
        stop_loss_condition, take_profit_condition, time_in_market_condition,
        commission,
        signals
      } = this.data
      const saveData = {
        ...this.data,
        long_short_ratio: `${(long_ratio / 100).toFixed(5)}/${(short_ratio / 100).toFixed(5)}`,
        risk_control_filter_number: `${take_profit}/${stop_loss}/${time_in_market}`,
        risk_control_filter_condition: `${take_profit_condition}/${stop_loss_condition}/${time_in_market_condition}`,
        commission: (commission / 100).toFixed(5),
        signals: JSON.stringify(signals.length !== 16 ? signals : ['All'])
      }
      const removeProperties = (obj, properties) => {
          properties.forEach(property => {
            if (obj.hasOwnProperty(property)) {
              delete obj[property]
            }
          })
      }
      // 要删除的属性列表
      const propertiesToRemove = ['long_ratio', 'short_ratio', 'stop_loss', 'take_profit', 'time_in_market', 'stop_loss_condition', 'take_profit_condition', 'time_in_market_condition']
      removeProperties(saveData, propertiesToRemove)
      return await perviewScannerForm(saveData)
    },
    async saveFormData() {
      if(this.data.signals.length === 0) {this.popUpMsgBox('Please select at least one signal');return}
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly')
        return
      }
      this.processTips = `Tips: Based on your conditions, the Scanner is screening stocks...`
      const rowUrl = this.rowUrl
      const name = this.data.name
      if(!rowUrl) {
        const nameChecked = await this.checkDuplicateNames(name)
        if(nameChecked){this.popUpMsgBox(`The Name already exists`); return}
      }
      this.percentage = 8
      const {
        long_ratio, short_ratio, 
        stop_loss, take_profit, time_in_market,
        stop_loss_condition, take_profit_condition, time_in_market_condition,
        commission,
        signals
      } = this.data
      const saveData = {
        ...this.data,
        long_short_ratio: `${(long_ratio / 100).toFixed(5)}/${(short_ratio / 100).toFixed(5)}`,
        risk_control_filter_number: `${take_profit}/${stop_loss}/${time_in_market}`,
        risk_control_filter_condition: `${take_profit_condition}/${stop_loss_condition}/${time_in_market_condition}`,
        commission: (commission / 100).toFixed(5),
        signals: JSON.stringify(signals.length !== 16 ? signals : ['All'])
      }
      const removeProperties = (obj, properties) => {
          properties.forEach(property => {
            if (obj.hasOwnProperty(property)) {
              delete obj[property]
            }
          })
      }
      // 要删除的属性列表
      const propertiesToRemove = ['long_ratio', 'short_ratio', 'stop_loss', 'take_profit', 'time_in_market', 'stop_loss_condition', 'take_profit_condition', 'time_in_market_condition']
      removeProperties(saveData, propertiesToRemove)
      let saveRes, previewRes
      if(rowUrl) {saveRes = await editScannerForm(saveData, rowUrl)}
      else{saveRes = await saveScannerForm(saveData)}
      // 这里要发请求拿到预推荐列表
      try {
        this.isPolling = true
        previewRes = await perviewScannerForm(saveData)
      } catch (error) {
        // 预览失败, 设置状态码为 408
        previewRes = {
          data: {
            code: 408
          }
        }
      }
      // 刷新Backtest列表
      this.$emit('refreshBTList')
      const code = saveRes.data?.code
      const failedConditions = [203, 403, 404, 406]
      if(failedConditions.includes(Number(code))) {
        // 保存失败, 不进入轮询
        return saveRes
      }
      this.processTips = 'Tips: Backtesting selected stocks. Please wait patiently...'
      saveRes.data.data = isJson(saveRes.data.data)?JSON.parse(saveRes.data.data):saveRes.data.data
      let url = saveRes.data.data?.url
      this.rowUrl = url
      let pollingRes = null
      do {
        if(this.percentage < 99) this.percentage += 1
        pollingRes = await getScannerBTResults(url)
        const code = pollingRes.data.code
        if (pollingRes.data.data?.status === 'finish' && code == 200) {
          const previewCode = previewRes.data?.code
          if(previewCode == 200) pollingRes['TRADE LIST'] = previewRes.data.data
          return pollingRes
        }
        if(code == 401 || code == 403 || code == 404 || code == 407) return pollingRes
        // Add a delay here to avoid excessive polling, e.g., using setTimeout
        await new Promise(resolve => setTimeout(resolve, 1500));
      } while (true); // Keep polling indefinitely
    },
    async submitForm() {
      this.btnLoading = true
     this.percentage = 5
      let saveRes = null
      try {
        saveRes = await this.saveFormData()
      } catch (error) {
        this.$emit('clearResults')
        this.btnLoading = false
        this.processTips = ''
        this.percentage = 0
      }
     if(!saveRes) {this.$emit('clearResults'); this.btnLoading = false; this.processTips = ''; this.percentage = 0; return}
     const code = saveRes.data.code
     const name = saveRes.data?.data?.name
     const _name = typeof name === 'string' && name ? name : ''
     if(code == 203) this.popUpMsgBox(`The "${_name}" backtest is running. You can wait or click the "+" button to create a new backtest`)
     if(code == 401) this.popUpMsgBox('Calculate error')
     if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('Save failed, Please try again')}
     if(code == 406) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407) this.popUpMsgBox('Empty backtest list. Please adjust "Filter Criteria" and run again')
      if(code == 200) {
        this.popUpMsgBox(`The "${_name}" backtest is completed successfully`)
        // 这里添加过滤列表
        const list = saveRes['TRADE LIST']
        if(list) saveRes.data.data['TRADE LIST'] = list
        this.$emit('displayResultsAndFilter', saveRes.data.data)
      }
      // 只要是错误状态码都要清空 filterList 和 result 数据
      if([400, 401, 404, 403, 406, 407].includes(code)) this.$emit('clearResults')
      // 运行成或者失败后刷新列表
      this.$emit('refreshBTList')
      this.btnLoading = false
      this.processTips = ''
      this.percentage = 0
    },
    displayData(data) {
      const {url, long_short_ratio, risk_control_filter_number, risk_control_filter_condition, commission, signals} = data
      this.rowUrl = url
      const target = this.data
      const [long_ratio, short_ratio] = long_short_ratio.split('/')
      const [take_profit, stop_loss, time_in_market] = risk_control_filter_number.split('/')
      const [take_profit_condition, stop_loss_condition, time_in_market_condition] = risk_control_filter_condition.split('/')
      const prepareData = {
        ...data,
        stop_loss,
        take_profit,
        time_in_market,
        long_ratio: trimTrailingZeros((long_ratio * 100).toFixed(2)),
        short_ratio: trimTrailingZeros((short_ratio * 100).toFixed(2)),
        stop_loss_condition,
        take_profit_condition,
        time_in_market_condition,
        commission: trimTrailingZeros((commission * 100).toFixed(2)),
        signals: isJson(signals) ? JSON.parse(signals) : signals
      }
      for (const key in target) {
        if(key === 'signals') {
          if(Array.isArray(data[key]) && data[key].length === 1 && data[key][0] === 'All') {
            this.$refs['SelectCheck'].handleoptionsAllChange(true)
            target[key] = this.data.signals
          }else if(Array.isArray(data[key])){
            this.$refs['SelectCheck'].handleoptionsAllChange(false)
            const arr = []
            data[key].forEach(ele => {
              const item = {
                label: ele,
                value: ele,
                check: true
              }
              this.$refs['SelectCheck'].handleTaskItemChange(item)
              arr.push(ele)
            })
            target[key] = arr
          }
        }else {target[key] = prepareData[key]}
      }
      this.data = target
    },
    async previewList() {
      let previewRes = null
      this.previewBtnLoading = true
      try {
        previewRes = await this.previewSCList()
      } catch (error) {
        this.$emit('clearResults')
        this.previewBtnLoading = false
      }
      console.log('previewRes', previewRes)
      if(!previewRes) {this.previewBtnLoading = false; this.$emit('clearResults'); return}
     const code = previewRes.data.code
      if(code == 400) this.popUpMsgBox('Scanner Backtest List preview failed')
      if(code == 401) this.popUpMsgBox('Calculate error')
      if(code == 404 || code == 403) this.popUpMsgBox('Preview failed, Please try again')
      if(code == 406) {
        const name =  this.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407) this.popUpMsgBox('Empty preview list. Please adjust "Filter Criteria" and run again')
      if(code == 200 && previewRes.status == 200) {
        this.popUpMsgBox('Preview successful')
        const previewData = JSON.parse(previewRes.data.data)
        console.log('previewData', previewData)
        this.$emit('changeSecondTab', 'filter')
        this.$emit('displayPreviewList', previewData)
        this.$emit('scrollToTarget', 'scrollTarget')
        // 只清空 results 数据
        this.parentContext.tradesData = []
        this.parentContext.$refs['Statistics'].displayData({})
      }
      // 只要是错误状态码都要清空 filterList 和 result 数据
      if([400, 401, 404, 403, 406, 407].includes(code)) this.$emit('clearResults')
      this.previewBtnLoading = false
    },
    checkResLater() {
      //清空 rowUrl
      this.rowUrl = null
      this.btnLoading = false
      this.processTips = ''
      this.percentage = 0
      this.generateCPMName()
    },
    querySearch(queryString, cb) {
      this.dropdownList = JSON.parse(localStorage.getItem('sentimentList'))
      if(!this.dropdownList || !this.dropdownList.length) {this.dropdownList = this.getList()}
      var dropdownList = this.dropdownList
      var results = queryString
        ? dropdownList.filter(this.createFilter(queryString))
        : dropdownList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (dropdownList) => {
        const labelMatch = dropdownList.label.toLowerCase().includes(queryString.toLowerCase());
        const urlMatch = dropdownList.url.toLowerCase().includes(queryString.toLowerCase());
        return labelMatch || urlMatch;
      };
    },
    addRow(row) {
      /*
      lishan 注释掉，因为不需要限制 totalWeight 为 100 了
      let weight = null
      const totalWeight = this.validateTotalPercentage(row)
      if(totalWeight > 0 && totalWeight < 100) {weight = 100 - totalWeight}
      else {weight = ''}
      this.portfolioData.push({ weight, indicator: '', indicator_url: '', weightValidErrMsg: '' });
      */
     if(this.portfolioData.length == 10) {this.popUpMsgBox(`Up to 10 rows can be added`); return}
      this.portfolioData.push({ name: '', weight: '', starting_capital: '', weightValidErrMsg: '' });
    },
    deleteRow(index) {
      this.portfolioData.splice(index, 1)
    },
    validateWeightRule(row) {
      console.log(row.weight)
      row.weightValidErrMsg = validatePercentageRule(_, row.weight)
    },
    handleRowSelect(item, row) {
      
      console.log('item', item, row)
      row.name = item.label
      row.indicator_url = item.url
      
      console.log(this.weightData)

      this.data.time_frame = this.findMaxFreq() 
      console.log('当前最大的 timeframe 是', this.data.time_frame)
    },
    findMaxFreq() {
      const sentimentList = JSON.parse(localStorage.getItem('sentimentList'))
      let frequencyArray = []
        frequencyArray = this.portfolioData.map(item => {
          const url = item.indicator_url
            return sentimentList.find(ele => ele.url.toLocaleLowerCase() === url.toLocaleLowerCase())?.updated?.toLowerCase()
        })
      frequencyArray = frequencyArray.filter(item => item)
      // 结合indicator的周期数组和用户选择周期计算最大周期
      return this.getMaxTimeframe(frequencyArray)
    },
    getMaxTimeframe(timeframes) {
        let maxTimeframe
        let timeframeArr = [...timeframes,this.userSelectedTimeFrame]

        const validTimeframes = ['daily', 'weekly', 'monthly'];
        const filteredTimeframes = timeframeArr.filter(timeframe =>
          validTimeframes.includes(timeframe)
        );
        if (filteredTimeframes.length === 0) {
          maxTimeframe = 'daily';
        } else if (filteredTimeframes.length === 1) {
          maxTimeframe = filteredTimeframes[0];
        } else {
          maxTimeframe = filteredTimeframes.reduce((max, timeframe) => {
            return validTimeframes.indexOf(timeframe) > validTimeframes.indexOf(max) ? timeframe : max;
          });
        }
        return maxTimeframe;
     },
     changeTimeFrame(item) {
      this.userSelectedTimeFrame = item
      this.data.time_frame = this.findMaxFreq() 
    },
    validateStartingCapital(value) {
      this.validCapitalErrMsg = createPositiveIntegerValidate(value, 1000)
      return this.validCapitalErrMsg
    },
  }
}
</script>

<style lang="less" scoped>
.portfolio-form {
  padding: 20px 20px 0 20px;
  .error-message {
  position: absolute;
  line-height: 1;
  font-size: 10px;
  color: #F56C6C;
  white-space: nowrap;
  top: 17px
  }
  .weight-error-message {
    position: absolute;
    line-height: 1;
    font-size: 10px;
    color: #F56C6C;
    white-space: nowrap;
  }
  .delete-btn {
    background-color: #f59e0b;
    border: unset;
  }
  .delete-btn:hover {
    background-color: rgb(251, 192, 92);
  }
  .starting-capital {
    display: grid;
    grid-template-columns: 120px auto;
    align-items: center;
    justify-items: center;
    position: relative;
    margin: 5px 0;
    span {
      font-weight: 500;
      color: #606266;
      font-size: 14px;
    }
    /deep/ .el-input--mini .el-input__inner {
      margin-left: 0;
    }
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #333;
    background-color: #fbfbfb;
  }
  /deep/ .el-autocomplete {
    width: 100%;
    .el-input--mini .el-input__inner {
      margin-left: 0px;
    }
  }
    /deep/ .el-input-group--append .el-input__inner, .el-input-group__prepend {
      margin-left: 0px;
    }
  /deep/ .el-input.el-input--mini {
    width: 100%;
    .el-input__inner {margin-left: 0px;}
  }
  /deep/ .el-checkbox__label {
    font-size: 14px;
  }
  /deep/ .el-input-group__append,
  /deep/ .el-input-group__prepend {
    padding: 0 5px;
  }
  .conditionBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
  }
  .main-row {
    border: 2px solid #94bde0;
    padding: 18px 18px 0px 18px;
    border-radius: 4px;
  }
  .portfolioTable {
    border-top: 2px solid #dddddd;
  }
  .el-button--primary, .el-button--warning {
    width: 100%;
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }
  .el-form-item.portfolio-check /deep/ .el-form-item__content{
    margin-left: 0px !important;
  }
  ._conditionBox {
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 0px;
      width: 100%;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .processTips {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 32px;
    margin: 42px 0px 0px 0px;
    font-weight: 500;
    color: #606266;
  }
  .processTipsBox {
    height: 100%;
  /deep/ .el-progress-bar__innerText {
    margin: 0px 5px 1px 5px;
    // color: #ffffff !important;
  }
  /deep/ .el-progress-bar__outer {
    
    height: 100% !important;
    border-radius: 4px;
  }
  /deep/ .el-progress-bar__inner {
    border-radius: 4px;
  }
  /deep/ .el-progress--text-inside .el-progress-bar {
    height: 100%;
  }
  /deep/ .el-progress {
    height: 100%;
  }
}
}
</style>