<template>
  <div class="portfolio-form">
    <el-form
      ref="Form"
      :model="data"
      label-position="top"
      size="small"
      :rules="rules">
        <el-row :gutter="20">
            <el-col :span="6">
            <el-form-item label="1. Name" prop="name" label-width="70px" label-position="top">
              <el-input v-model="data.name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item
            label="Start Date"
            prop="start_date"
            label-width="120px"
            label-position="top"
          >
          <template slot="label">
            <label>
              2. Start Date
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
              label="End Date"
              prop="end_date"
              label-width="120px"
              label-position="top"
              >
              <template slot="label">
                <label>
                  3. End Date
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
            <el-form-item label="4. Starting Captial" prop="capital" label-width="70px" label-position="top">
              <el-input v-model="data.capital" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <div class="portfolioCheckedBox">
        <a @click="portfolioChecked = !portfolioChecked" style="cursor: pointer;"
          >Auto Portfolio<i :class="portfolioChecked ? 'el-icon-minus' : 'el-icon-plus'"></i></a>
        <div class="des-content" v-show="portfolioChecked">
        <el-form
          ref="AutoPortfolioForm"
          :model="portfolioFormData"
          label-position="left"
          size="small"
          :rules="portfolioRules"
        >
            <div class="grid-row main-row">
              <div class="left">
                <el-form-item>
                  <template slot="label">
                    <label>
                      <el-checkbox v-model="portfolioFormData.CAGRChecked" label="Return">GAGR</el-checkbox>
                    </label>
                  </template>
                  <div class="_conditionBox">
                      <el-form-item prop="min_CAGR" label-width="0px">
                        <el-input v-model="portfolioFormData.min_CAGR" placeholder="Input Value">
                          <template v-slot:append>(%)</template>
                        </el-input>
                      </el-form-item>
                      <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                      <el-form-item prop="max_CAGR" label-width="0px">
                        <el-input v-model="portfolioFormData.max_CAGR" placeholder="Input Value">
                          <template v-slot:append>(%)</template>
                        </el-input>
                      </el-form-item>
                  </div>
                </el-form-item>
                <el-row>
                <el-form-item prop="win_rate">
                  <template slot="label">
                    <label>
                      <el-checkbox v-model="portfolioFormData.winRateChecked" label="Return">Win Rate</el-checkbox>
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
                      <el-form-item prop="min_win_rate" label-width="0px">
                        <el-input v-model="portfolioFormData.min_win_rate" placeholder="Input Value">
                          <template v-slot:append>(%)</template>
                        </el-input>
                      </el-form-item>
                      <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                      <el-form-item prop="max_win_rate" label-width="0px">
                        <el-input v-model="portfolioFormData.max_win_rate" placeholder="Input Value">
                          <template v-slot:append>(%)</template>
                        </el-input>
                      </el-form-item>
                  </div>
                </el-form-item>
                </el-row>
              </div>
              <div></div>
              <div class="right">
                <el-form-item>
                  <template slot="label">
                    <label>
                      <el-checkbox v-model="portfolioFormData.YTD_returnChecked">YTD Return</el-checkbox>
                    </label>
                  </template>
                  <div class="_conditionBox">
                      <el-form-item prop="min_YTD_return" label-width="0px">
                        <el-input v-model="portfolioFormData.min_YTD_return" placeholder="Input Value">
                          <template v-slot:append>(%)</template>
                        </el-input>
                      </el-form-item>
                      <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                      <el-form-item prop="max_YTD_return" label-width="0px">
                        <el-input v-model="portfolioFormData.max_YTD_return" placeholder="Input Value">
                          <template v-slot:append>(%)</template>
                        </el-input>
                      </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item>
                  <template slot="label">
                    <label for="max_drow_down_checkbox">
                      <el-checkbox v-model="portfolioFormData.max_drow_downChecked" label="Max Drow Down" id="max_drow_down_checkbox"></el-checkbox>
                    </label>
                  </template>
                  <div class="_conditionBox">
                      <el-form-item prop="min_max_drow_down" label-width="0px">
                        <el-input v-model="portfolioFormData.min_max_drow_down" placeholder="Input Value">
                          <template v-slot:append>(%)</template>
                        </el-input>
                      </el-form-item>
                      <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span>
                      <el-form-item prop="max_max_drow_down" label-width="0px">
                        <el-input v-model="portfolioFormData.max_max_drow_down" placeholder="Input Value">
                          <template v-slot:append>(%)</template>
                        </el-input>
                      </el-form-item>
                  </div>
                </el-form-item>
              </div>
            </div>
            <div class="bottom-row">
              <div></div>
              <el-form-item label-width="0px">
                <el-button type="primary" :disabled="!portfolioChecked">Found Portfolio</el-button>
              </el-form-item>
              <div></div>
            </div>
        </el-form>
        </div>
    </div>
    <div>
    <br>
    <el-table
    :data="portfolioData"
    stripe
    border
    size="small"
    class="portfolioTable"                                      
    >
    <el-table-column label="Index" header-align="center" align="center" width="80px">
      <template slot-scope="scope">
        <span v-if="scope.$index === 0">1</span>
        <span v-else>{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Category" header-align="center" align="center" width="200px">
      <template slot-scope="scope">
        <el-input v-model="portfolioFirstLine.category" size="mini" disabled  v-if="scope.$index === 0"></el-input>
        <el-input v-model="scope.row.category" size="mini" disabled  v-else></el-input>
      </template>
    </el-table-column>
    <el-table-column label="Model Name" header-align="center" align="center" prop="indicator">
      <template slot-scope="scope">
        <el-autocomplete
          v-if="scope.$index === 0"
          disabled
          v-model="portfolioFirstLine.name"
          size="mini"
          :fetch-suggestions="querySearch"
          @select="
            (item) => {
              handleRowSelect(item, scope.row)
            }
          "
          >
          <i slot="prefix" class="el-input__icon el-icon-search"></i></el-autocomplete>
        <el-autocomplete
          v-else
          v-model="scope.row.name"
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
          <template slot-scope="{ item }">
            <div class="custom-option">
              <span class="item-label">{{
                item.model_name
              }}</span>
              <span class="type-label"
                >{{ tags[item.category] }}</span
              >
            </div>
          </template>
        </el-autocomplete>
      </template>
    </el-table-column>
    <el-table-column label="Model" header-align="center" align="center" prop="model" width="200">
      <template slot-scope="scope">
        <el-select v-model="portfolioFirstLine.model" disabled placeholder="- Select-" size="mini" v-if="scope.$index === 0">
          <el-option
            v-for="item in nonBondOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="scope.row.model" placeholder="- Select-" size="mini" v-else>
          <el-option
            v-for="item in (scope.row.category !== 'Bond' ? nonBondOptions : bondOptions)"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Weight" header-align="center" align="center" prop="weight" width="200">
      <template slot-scope="scope">
        <el-input v-model="portfolioFirstLine.weight" size="mini" label-width="50px" disabled v-if="scope.$index === 0">
          <template v-slot:append>(%)</template>
        </el-input>
        <el-input v-model="scope.row.weight" size="mini" @input="validateWeightRule(scope.row)" label-width="50px" v-else>
          <template v-slot:append>(%)</template>
        </el-input>
        <div class="weight-error-message">
          {{ scope.row.weightValidErrMsg }}
        </div>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" width="200">
      <template slot-scope="scope">
        <el-button v-if="scope.$index === 0" @click="addRow(scope.row)" icon="el-icon-circle-plus-outline" size="mini" type="primary">Add Strategies</el-button>
        <el-button v-else-if="scope.$index >= 1" size="mini" type="primary" icon="el-icon-delete" @click.stop="deleteRow(scope.$index)" class="delete-btn">Delete Strategies</el-button> 
      </template>
    </el-table-column>
    </el-table>
    <br>
    <div class="bottom-row">
      <div></div>
      <el-button type="primary" size="small" icon="el-icon-caret-right" @click="submitForm">Run Portfolio</el-button>
      <div></div>
    </div>
    <br>
    </div>
  </div>
</template>

<script>
import { isJson, timestampToTime, trimTrailingZeros, LocalStorageUtil } from '@/utils'
import { createIntegerRule, createPositiveIntegerRule, _validatePercentageRule } from '@/utils/formValidate'
import { saveScannerForm, editScannerForm, getScannerBTList, getScannerBTResults, perviewScannerForm, getStrategyList } from '@/service/service'

export default {
  name: 'Form',
  props: ['parentContext'],
  data() {
    return {
      data: {
        name: 'my portfolio',
        start_date: '',
        end_date: '',
        capital: 1000000
      },
      portfolioFormData: {
        CAGRChecked: true,
        min_CAGR: 5,
        max_CAGR: 15,
        winRateChecked: true,
        min_win_rate: 50,
        max_win_rate: 70,
        YTD_returnChecked: true,
        min_YTD_return: 0,
        max_YTD_return: 15,
        max_drow_downChecked: true,
        min_max_drow_down: 20,
        max_max_drow_down: 50
      },
      portfolioChecked: false,
      strategiesList: [],
      tags: {
        'Legacy': 'Legacy Index',
        'INDEX': 'Index',
        'Bond': 'Bond',
        'Factors': 'Factors',
        'Sector': 'Sector'
      },
      portfolioFirstLine: {
        name: 'Cash',
        url: 'cash',
        category: '',
        model: 'CASH',
        weight: 100
      },
      portfolioData: [
        {},
        {
          name: 'Dual Trend Model',
          url: 'dual_trend_model',
          category: 'Legacy Index',
          model: '',
          weight: ''
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
      bondOptions: [
        { value: 'CASH', label: 'CASH'},
        { value: 'BIL', label: 'BIL'},
        { value: 'MBB', label: 'MBB'},
        { value: 'TIP', label: 'TIP'},
        { value: 'CWB', label: 'CWB'},
        { value: 'LQD', label: 'LQD'},
        { value: 'HYG', label: 'HYG'},
        { value: 'TLT', label: 'TLT'},
        { value: 'IEF', label: 'IEF'},
        { value: 'MUB', label: 'MUB'},
        { value: 'SHY', label: 'SHY'}
      ],
      nonBondOptions: [
        { value: 'CASH', label: 'CASH'},
        { value: 'RSP', label: 'RSP'},
        { value: 'SPY', label: 'SPY'},
        { value: 'IWB', label: 'IWB'},
        { value: 'IWM', label: 'IWM'},
        { value: 'IWO', label: 'IWO'},
        { value: 'IWN', label: 'IWN'},
        { value: 'IWF', label: 'IWF'},
        { value: 'IWD', label: 'IWD'},
        { value: 'IWP', label: 'IWP'},
        { value: 'IWS', label: 'IWS'},
        { value: 'ONEQ', label: 'ONEQ'},
        { value: 'QQQ', label: 'QQQ'},
        { value: 'GLD', label: 'GLD'},
        { value: 'RWR', label: 'RWR'},
        { value: 'XLK', label: 'XLK'},
        { value: 'XLE', label: 'XLE'},
        { value: 'XLRE', label: 'XLRE'},
        { value: 'XLU', label: 'XLU'},
        { value: 'XLB', label: 'XLB'},
        { value: 'XLV', label: 'XLV'},
        { value: 'XLI', label: 'XLI'},
        { value: 'XLP', label: 'XLP'},
        { value: 'XLY', label: 'XLY'},
        { value: 'XLF', label: 'XLF'},
        { value: 'XLC', label: 'XLC'}
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
        capital: [
          { validator: (rule, value, callback) => createPositiveIntegerRule('Starting Capital', 1000, null)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createPositiveIntegerRule('Starting Capital', 1000, null)(rule, value, callback), trigger: 'change' }
        ]
      },
      portfolioRules: {
        min_CAGR: [
          { validator: (rule, value, callback) => createIntegerRule('Minimum CAGR', null, this.portfolioFormData.max_CAGR || 100)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createIntegerRule('Minimum CAGR', null, this.portfolioFormData.max_CAGR || 100)(rule, value, callback), trigger: 'change'}
        ],
        max_CAGR: [
          { validator: (rule, value, callback) => createIntegerRule('Maximum CAGR', this.portfolioFormData.min_CAGR || null, 100)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createIntegerRule('Maximum CAGR', this.portfolioFormData.min_CAGR || null, 100)(rule, value, callback), trigger: 'change'}
        ],
        min_YTD_return: [
          { validator: (rule, value, callback) => createIntegerRule('Minimum YTD Return', null, this.portfolioFormData.max_YTD_return || 100)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createIntegerRule('Minimum YTD Return', null, this.portfolioFormData.max_YTD_return || 100)(rule, value, callback), trigger: 'change'}
        ],
        max_YTD_return: [
          { validator: (rule, value, callback) => createIntegerRule('Maximum YTD Return', this.portfolioFormData.min_YTD_return || null, 100)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createIntegerRule('Maximum YTD Return', this.portfolioFormData.min_YTD_return || null, 100)(rule, value, callback), trigger: 'change'}
        ],
        min_win_rate: [
          { validator: (rule, value, callback) => createPositiveIntegerRule('Minimum Win Rate', 0, this.portfolioFormData.max_win_rate || 100)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createPositiveIntegerRule('Minimum Win Rate', 0, this.portfolioFormData.max_win_rate || 100)(rule, value, callback), trigger: 'change'}
        ],
        max_win_rate: [
          { validator: (rule, value, callback) => createPositiveIntegerRule('Maximum Win Rate', this.portfolioFormData.min_win_rate || 0, 100)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createPositiveIntegerRule('Maximum Win Rate', this.portfolioFormData.min_win_rate || 0, 100)(rule, value, callback), trigger: 'change'}
        ],
        min_max_drow_down: [
          { validator: (rule, value, callback) => createPositiveIntegerRule('Minimum Win Rate', 0, this.portfolioFormData.max_win_rate || 100)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createPositiveIntegerRule('Minimum Win Rate', 0, this.portfolioFormData.max_win_rate || 100)(rule, value, callback), trigger: 'change'}
        ],
        max_min_max_drow_down: [
          { validator: (rule, value, callback) => createPositiveIntegerRule('Maximum Win Rate', this.portfolioFormData.min_win_rate || 0, 100)(rule, value, callback), trigger: 'blur'},
          { validator: (rule, value, callback) => createPositiveIntegerRule('Maximum Win Rate', this.portfolioFormData.min_win_rate || 0, 100)(rule, value, callback), trigger: 'change'}
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
      this.data.name = `My Portfolio ${year}-${month}-${day} ${hour}:${minute}:${second}`
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
        this.popUpMsgBox('Please review and correct form errors')
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
      
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Please review and correct form errors')
        return
      }
      if(this.portfolioChecked) {
        const validateAutoPortfolioForm = await this.validForm('AutoPortfolioForm')
        if(!validateAutoPortfolioForm) {
          // 选择了 auto portfolio，但是表单验证没有通过
          this.popUpMsgBox('Auto Portfolio needs more info. Correct format, please')
          return
        }
      }
      // 验证百分比
      const portfolioData = this.portfolioData.slice(1)
      let totalWeight = 0
      let rowWeightValid = true
      let inAllowedList = true
      for (const row of portfolioData) {
        totalWeight += parseFloat(row.weight) || 0
        row.weightValidErrMsg = _validatePercentageRule(_, row.weight)
        if(row.weightValidErrMsg) rowWeightValid = false
        const isIn = (this.strategiesList.find(ele => ele.model_name.toLocaleLowerCase() === row.name.toLocaleLowerCase()) || this.strategiesList.find(ele => ele.url.toLocaleLowerCase() === row.url.toLocaleLowerCase()))?.model_name || false
        if(!isIn) inAllowedList = false
      }
      totalWeight += this.portfolioFirstLine.weight
      if(totalWeight > 100) {this.popUpMsgBox('Total weight percentages cannot exceed 100%'); return false}
      if(totalWeight != 100) {this.popUpMsgBox('Total weight percentages need to be 100%'); return false}
      if(!rowWeightValid) {this.popUpMsgBox('Incorrect Weight column input format'); return false}
      if(!inAllowedList) {this.popUpMsgBox('Please choose strategies from the dropdown'); return false}
      if(portfolioData.length<=1) {this.popUpMsgBox('Please select at least 1 strategies'); return false}
      return
      this.processTips = `Tips: Running portfolio backtest...`
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
      this.processTips = 'Tips: Running portfolio backtest. Please wait patiently...'
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
    async querySearch(queryString, cb) {
      
      if(!this.strategiesList || !this.strategiesList.length) {this.strategiesList = await this.getStrategyList()}
      var dropdownList = this.strategiesList
      var results = queryString
        ? dropdownList.filter(this.createFilter(queryString))
        : dropdownList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (dropdownList) => {
        const labelMatch = dropdownList.model_name.toLowerCase().includes(queryString.toLowerCase());
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
      this.portfolioData.push({ name: '', category: '', model: '', weight: '', weightValidErrMsg: '' });
    },
    deleteRow(index) {
      this.portfolioData.splice(index, 1)
    },
    validateWeightRule(row) {
      console.log(row.weight)
      row.weightValidErrMsg = _validatePercentageRule(_, row.weight)
      // 每次都计算第一个 weight
      let totalWeight = 0
      for (const row of this.portfolioData) {
        totalWeight += parseFloat(row.weight) || 0
      }
      const weight = 100 - totalWeight
      if(weight >= 0) this.portfolioFirstLine.weight = weight
    },
    handleRowSelect(item, row) {
      row.model_name = item.model_name
      row.category = this.tags[item.category]
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
    async getStrategyList() {
			let res = null
			try {
				res = await getStrategyList()
				const code = res?.data?.code
				if (code == 200) {
					const data = res?.data?.data
					for (let obj of data) {
						obj.date = timestampToTime(obj.date)
            obj.value = obj.model_name
					}
					this.strategiesList = data
				}
			} catch (error) {
				console.log('报错了', error)
				this.strategiesList = []
			}
      console.log('strategiesList', this.strategiesList)
      return this.strategiesList
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
    top: 34px;
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
  /deep/ .el-input.el-input--small {
    width: 100%;
    .el-input__inner {margin-left: 0px;}
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
    padding: 10px 10px 0px 10px;
  }
  .bottom-row {
    padding: 10px 10px 0px 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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
    .el-form-item--small.el-form-item, .el-form-item--small.el-form-item {
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
  /deep/ .portfolio-form .el-input--suffix .el-input__inner {
    margin-left: 0px;
  }
}

  
.portfolioCheckedBox {
  border: #cacaca solid 1px;
  padding: 0 5px 0 10px;
  border-radius: 4px;
  line-height: 28px;
  border-radius: 4px;
  }
  .portfolioCheckedBox a {
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    padding: 5px 5px 5px 0px
  }
  .portfolioCheckedBox a:hover {
    color: #5b9bd1;
  }
  .des-content {
    margin-top: 10px;
  }

// .el-form-item.portfolio-check.el-form-item--small {
//   margin-top: 40px;
// }
}

/* 自定义样式 */
.custom-option {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between;
    .type-label {
      font-size: 12px;
      color: #999999;
      font-weight: 600;
      margin-right: 10px;
      text-align: center;
    }
    .item-label {
      font-weight: 500;
    }
}
</style>