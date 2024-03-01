<template>
  <div class="scanner-form">
    <el-form
      ref="Form"
      :model="data"
      label-position="top"
      size="small"
      :rules="rules">
      <el-row :gutter="10">
      <el-col :span="6">
        <el-form-item
          label="3. Start Date"
          prop="start_date"
        >
        <template slot="label">
          <label>
            1. Start Date
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
      </el-col>
      <el-col :span="6">
        <el-form-item
        prop="end_date"
			  >
        <template slot="label">
          <label>
            2. End Date
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
      </el-col>
      <el-col :span="6">
        <el-form-item prop="find_type" label="3. Type">
        <el-select
            v-model="data.find_type"
            placeholder="— Select type —"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item
          prop="signals"
          >
          <template slot="label">
          <label>
            4. Signals
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
          </template>
            <SelectCheck ref="SelectCheck" :options="options" @selected="selected"/>
          </el-form-item>
      </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
         <el-form-item prop="long_short_ratio">
          <template slot="label">
            <label>
              5. Long / Short Percentage
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  ></span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
          </template>
          <div class="_conditionBox">
              <el-form-item prop="long_ratio" label-width="0px">
                <el-input v-model="data.long_ratio" placeholder="Enter ratio">
                  <template v-slot:append>(%)</template>
                </el-input>
              </el-form-item>
              <span>&nbsp;/&nbsp;</span>
              <el-form-item prop="short_ratio" label-width="0px">
                <el-input v-model="data.short_ratio" placeholder="Enter ratio">
                  <template v-slot:append>(%)</template>
                </el-input>
              </el-form-item>
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="risk_control_filter"
          >
          <template slot="label">
            <label>
              6. Stop Loss
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  ></span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
          </template>
          <div class="_conditionBox">
            <el-form-item prop="stop_loss_condition" label-width="0px">
                <el-input v-model="data.stop_loss_condition" placeholder="Enter number">
                  <template v-slot:append>(%)</template>
                </el-input>
            </el-form-item>
              <span>&nbsp;to&nbsp;</span>
              <el-form-item prop="stop_loss" label-width="0px">
              <el-input v-model="data.stop_loss" placeholder="Enter number">
                <template v-slot:append>(%)</template>
              </el-input>
              </el-form-item>
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="risk_control_filter"
          >
          <template slot="label">
            <label>
              7. Take Profit
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  ></span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
          </template>
          <div class="_conditionBox">
          <el-form-item prop="take_profit_condition" label-width="0px">
              <el-input v-model="data.take_profit_condition" placeholder="Enter number">
                <template v-slot:append>(%)</template>
              </el-input>
          </el-form-item>
            <span>&nbsp;to&nbsp;</span>
          <el-form-item prop="take_profit" label-width="0px">
          <el-input v-model="data.take_profit" placeholder="Enter number">
            <template v-slot:append>(%)</template>
          </el-input>
          </el-form-item>
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="risk_control_filter"
          >
          <template slot="label">
            <label>
              8. Time In Market
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  ></span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
          </template>
          <div class="_conditionBox">
          <el-form-item prop="time_in_market_condition" label-width="0px">
              <el-input v-model="data.time_in_market_condition" placeholder="Enter number">
                <template v-slot:append>(bars)</template>
              </el-input>
          </el-form-item>
            <span>&nbsp;to&nbsp;</span>
          <el-form-item prop="time_in_market" label-width="0px">
          <el-input v-model="data.time_in_market" placeholder="Enter bars">
            <template v-slot:append>(bars)</template>
          </el-input>
          </el-form-item>
          </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item
          prop="name"
          >
          <template slot="label">
          <label>
            9. Name
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
          <el-input v-model="data.name" placeholder="Enter a name"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="total_capital"
          >
          <template slot="label">
            <label>
              10. Total Capital
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  ></span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
          </template>
          <el-input v-model="data.total_capital"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="commission"
          >
          <template slot="label">
          <label>
            11. Commission
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
          <el-input v-model="data.commission"><template v-slot:append>(%)</template></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-form-item prop="rank_condition">
          <template slot="label">
          <label>
            12. Rank Condition
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
        <el-select
            v-model="data.rank_condition"
            placeholder="— Select type —"
          >
            <el-option
              v-for="item in RankCondition"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
        <el-form-item
        prop="daily_limit"
        >
        <template slot="label">
        <label>
          13. Daily Stock Nums
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              ></span>
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </label>
        </template>
          <el-input v-model="data.daily_limit" placeholder="Enter a number between 1 and 5">
            <template v-slot:append>(1-5)</template>
          </el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="capital_allocate"
          >
          <template slot="label">
          <label>
            14. Capital Allocate
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
          </template>
            <el-input v-model="data.capital_allocate" placeholder="Enter 'Kelly' or a number between 0 and 1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="processTipsBox">
            <span v-html="processTips"></span><small v-if="processTips.includes('patiently')"><strong>Won't wait? </strong><button type="button" @click="checkResLater" id="checkResBtn" title=" No need to wait for the backtest to finish. Check the results in 'Scanner Backtest List' later!">Check results later</button></small>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" class="row-bg" justify="end">
        <el-col :span="16"></el-col>
        <el-col :span="4">
            <el-button type="warning" size="small" @click="previewList" :loading="previewBtnLoading" :disabled="btnLoading || previewBtnLoading">View List</el-button>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" size="small" @click="submitForm" :loading="btnLoading" :disabled="btnLoading || previewBtnLoading">Run Backtest</el-button>
        </el-col>
        </el-row>
    </el-form>
  </div>
</template>

<script>
import { isJson, timestampToTime } from '@/utils'
import SelectCheck from "./SelectCheck";
import { validateCapitalRule, validateCommissionRule, createPositiveScopeIntegerRule, createTPSLScopeValidateRule, createPositiveIntegerRule   } from '@/utils/formValidate'
import { saveScannerForm, editScannerForm, getScannerBTList, getScannerBTResults, perviewScannerForm } from '@/service/service'

export default {
  name: 'ScannerForm',
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
          // 验证是否为 0 到 1 的最大两位小数值
          const numberValue = parseFloat(value);
          if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 100) {
            const decimalCount = (numberValue.toString().split('.')[1] || '').length;
            if (decimalCount <= 2) {
              callback(); // 验证通过
            } else {
              callback(new Error('Value between 0 and 100 with max two decimals'));
            }
          } else {
            callback(new Error("Value between 0 and 100 with max two decimals"));
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
        start_date: '',
        end_date: '',
        find_type: 'stock/etf',
        long_ratio: 80,
        short_ratio: 20,
        stop_loss_condition: 5,
        take_profit_condition: 5,
        time_in_market_condition: 5,
        stop_loss: 20,
        take_profit: 30,
        time_in_market: 21,
        name: '',
        total_capital: 1000000,
        commission: 0,
        rank_condition: 'Kelly',
        daily_limit: 3,
        capital_allocate: 'Kelly',
        signals: ['All']
      },
      rowUrl: null,
      btnLoading: false,
      previewBtnLoading: false,
      processTips: '',
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      typeOptions: [
        { value: 'stock', label: 'Stock' },
        { value: 'etf', label: 'ETF' },
        { value: 'stock/etf', label: 'Stock/ETF' },
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
        long_ratio: [
          {
            validator: validateRatio,
            trigger: 'change'
          }
        ],
        short_ratio: [
          {
            validator: validateRatio,
            trigger: 'change'
          }
        ],
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
        stop_loss_condition: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.stop_loss)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.stop_loss)(rule, value, callback), trigger: 'change' }
        ],
        stop_loss: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.stop_loss_condition)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.stop_loss_condition)(rule, value, callback), trigger: 'change' }
        ],
        take_profit_condition: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.take_profit)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.take_profit)(rule, value, callback), trigger: 'change' }
        ],
        take_profit: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.take_profit_condition)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.take_profit_condition)(rule, value, callback), trigger: 'change' }
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
    this.setBacktestHistory(10)
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
      startDate.setDate(endDate.getDate() - val);
      this.data.start_date = timestampToTime(startDate);
    },
    resetForm() {
      // 如果当前在回测状态，不允许重置
      if(this.previewBtnLoading || this.btnLoading) return true
      this.$refs['SelectCheck'].handleoptionsAllChange(true)
			Object.assign(this.$data, this.$options.data())
      this.data.signals = ['All']
      this.generateCPMName()
      this.setBacktestHistory(10)
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
      debugger
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
        long_short_ratio: `${(long_ratio / 100).toFixed(2)}/${(short_ratio / 100).toFixed(2)}`,
        risk_control_filter_number: `${stop_loss}/${take_profit}/${time_in_market}`,
        risk_control_filter_condition: `${stop_loss_condition}/${take_profit_condition}/${time_in_market_condition}`,
        commission: (commission / 100).toFixed(3),
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
      const {
        long_ratio, short_ratio, 
        stop_loss, take_profit, time_in_market,
        stop_loss_condition, take_profit_condition, time_in_market_condition,
        commission,
        signals
      } = this.data
      const saveData = {
        ...this.data,
        long_short_ratio: `${(long_ratio / 100).toFixed(2)}/${(short_ratio / 100).toFixed(2)}`,
        risk_control_filter_number: `${stop_loss}/${take_profit}/${time_in_market}`,
        risk_control_filter_condition: `${stop_loss_condition}/${take_profit_condition}/${time_in_market_condition}`,
        commission: (commission / 100).toFixed(3),
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
      let saveRes = null
      try {
        saveRes = await this.saveFormData()
      } catch (error) {
        this.btnLoading = false
        this.processTips = ''
      }
      debugger
     if(!saveRes) {this.btnLoading = false; this.processTips = ''; return}
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
        this.$emit('displayResultsAndFilter', saveRes.data.data)
        // 这里展示过滤列表
        const list = saveRes['TRADE LIST']
        if(list) this.$emit('displayPreviewList', JSON.parse(list))
      }
     // 运行成或者失败后刷新列表
     this.$emit('refreshBTList')
     this.btnLoading = false
    this.processTips = ''
    },
    displayData(data) {
      const {url, long_short_ratio, risk_control_filter_number, risk_control_filter_condition, commission, signals} = data
      this.rowUrl = url
      const target = this.data
      const [long_ratio, short_ratio] = long_short_ratio.split('/')
      const [stop_loss, take_profit, time_in_market] = risk_control_filter_number.split('/')
      const [stop_loss_condition, take_profit_condition, time_in_market_condition] = risk_control_filter_condition.split('/')
      const prepareData = {
        ...data,
        stop_loss,
        take_profit,
        time_in_market,
        long_ratio: (long_ratio * 100).toFixed(2),
        short_ratio: (short_ratio * 100).toFixed(2),
        stop_loss_condition,
        take_profit_condition,
        time_in_market_condition,
        commission: (commission * 100).toFixed(2),
        signals: isJson(signals) ? JSON.parse(signals) : signals
      }
      debugger
      for (const key in target) {
        if(key === 'signals') {
          if(Array.isArray(data[key]) && data[key].length === 1 && data[key][0] === 'All') {
            this.$refs['SelectCheck'].handleoptionsAllChange(true)
            target[key] = this.data.signals
          }else if(Array.isArray(data[key])){
            debugger
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
        this.previewBtnLoading = false
      }
      debugger
      console.log('previewRes', previewRes)
      if(!previewRes) {this.previewBtnLoading = false; return}
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
        // 清空 results 数据
        // this.$emit('clearResults', this.data)
      }
      this.previewBtnLoading = false
    },
    checkResLater() {
      //清空 rowUrl
      this.rowUrl = null
      this.btnLoading = false
      this.processTips = ''
      this.generateCPMName()
    }
  }
}
</script>

<style lang="less" scoped>
.scanner-form {
  padding: 20px 20px 0 20px;
  .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--year,
  .el-select, .el-date-editor.el-input, .el-date-editor.el-input__inner,
  /deep/ .el-form-item__label {
    width: 100%;
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
  .el-button--primary, .el-button--warning {
    width: 100%;
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
  .processTipsBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 46px 0px 0px 0px;
  }
}
</style>