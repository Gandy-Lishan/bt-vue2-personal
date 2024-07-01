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
            <el-form-item label="4. Starting Captial" prop="cash" label-width="70px" label-position="top">
              <el-input v-model="data.cash" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <div class="portfolioCheckedBox">
        <a @click="auto_portfolio = !auto_portfolio" style="cursor: pointer;"
          >Auto Portfolio<i :class="auto_portfolio ? 'el-icon-minus' : 'el-icon-plus'"></i></a>
        <div class="des-content" v-show="auto_portfolio">
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
                <el-button type="primary" :disabled="!auto_portfolio" @click="findPortfolio" :loading="findPortfolioLoading">Found Portfolio</el-button>
              </el-form-item>
              <div></div>
            </div>
        </el-form>
        </div>
    </div>
    <div>
    <br>
    <el-table
    :data="strategy_combination"
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
          v-model="portfolioFirstLine.strategy"
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
          v-model="scope.row.strategy"
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
                >({{ tags[item.category] }})</span
              >
            </div>
          </template>
        </el-autocomplete>
      </template>
    </el-table-column>
    <el-table-column label="Weight" header-align="center" align="center" prop="percent" width="200">
      <template slot-scope="scope">
        <el-input v-model="portfolioFirstLine.percent" size="mini" label-width="50px" disabled v-if="scope.$index === 0">
          <template v-slot:append>(%)</template>
        </el-input>
        <el-input v-model="scope.row.percent" size="mini" @input="validateWeightRule(scope.row)" label-width="50px" v-else>
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
        <el-button v-else-if="scope.$index >= 1" size="mini" type="primary" icon="el-icon-delete" @click.stop="deleteRow(scope)" class="delete-btn">Delete Strategies</el-button> 
      </template>
    </el-table-column>
    </el-table>
    <br>
    <el-row :gutter="10" type="flex" justify="center">
      <el-col :span="8"></el-col>
      <el-col :span="8">
        <el-button  v-show="percentage == 0" type="primary" size="small" icon="el-icon-caret-right" @click="submitForm" :loading="btnLoading" :disabled="btnLoading">Run Portfolio</el-button>
        <div class="processTipsBox" v-show="percentage != 0">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" :color="customColorMethod"></el-progress>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="processTips" v-show="percentage != 0"><span v-html="processTips"></span></div>
      </el-col>
    </el-row>
    <br>
    </div>
    <el-dialog title="Title" :visible.sync="dialogTableVisible" size="mini" class="portfolioDialogTable" :show-close="false" :close-on-click-modal="false" :close-on-press-escape	="false">
      <el-table
        :data="autoPortfolioData"
        stripe
        border
        size="mini"
        class="portfolioTable"                 
        >
        <el-table-column prop="isRight" width="50px">
					<template slot-scope="scope">
						<div>
							<el-checkbox
								v-model="scope.row.selection"
								@click.prevent.stop.native="
									handleListSelectedFn('selection', 'isIndeterminate', scope)
								"
							>
							</el-checkbox>
						</div>
					</template>
				</el-table-column>
      <el-table-column label="#" width="100px">
        <template slot-scope="scope">
          <p style="margin: 0">{{ `Strategy #${scope.$index + 1}` }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Model">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.array">
              <p :key="index" style="margin: 0">{{ `${index + 1}. ${item.model_name}` }}</p>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="mini" icon="el-icon-close">Cancel</el-button>
      <el-button @click="confirmStrategy" type="primary" size="mini" icon="el-icon-check" :disabled="disabled" :loading="checkStrategyLoading">Confirm selection</el-button>
   </span>
    </el-dialog>
  </div>
</template>

<script>
import { isJson, timestampToTime, capitalizeFirstLetter } from '@/utils'
import {createStateFilter} from '@/utils/globalFunc'
import { createIntegerRule, createPositiveIntegerRule, _validatePercentageRule } from '@/utils/formValidate'
import { RunPortfolio, AutoPortfolio, getPortfolioList, UpdatePortfolio, getStrategyList, getRunPortfolioResults } from '@/service/service'

export default {
  name: 'Form',
  props: ['parentContext'],
  data() {
    return {
      data: {
        name: 'my portfolio',
        start_date: '',
        end_date: '',
        cash: 1000000
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
      auto_portfolio: false,
      strategiesList: [],
      tags: {
        'Legacy': 'Legacy Index',
        'INDEX': 'Index',
        'Bond': 'Bond',
        'Factors': 'Factors',
        'Sector': 'Sector'
      },
      portfolioFirstLine: {
        strategy: 'Cash',
        url: 'cash',
        category: '',
        model: 'CASH',
        percent: 100
      },
      strategy_combination: [
        {},
        {
          strategy: 'Dual Trend Model',
          url: 'dual_trend_model',
          category: 'Legacy Index',
          model: '',
          percent: '',
          model_name: 'Dual Trend Model'
        }
      ],
      detailTableCol: [
        {
          label: '# Strategy',
          name: 'strategy',
          key: 'strategy',
          width: '100px'
        },
        {
          label: 'Model',
          name: 'model',
          key: 'model',
          width: '200px'
        },
        {
          label: 'Weight',
          name: 'percent',
          key: 'percent',
          width: '100px'
        }
      ],
      dialogTableVisible: false,
      rowUrl: null,
      btnLoading: false,
      isPolling: false,
      processTips: '',
      percentage: 0,
      disabled: true,
      findPortfolioLoading: false,
      checkStrategyLoading: false,
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
        cash: [
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
      if((!this.isPolling && this.btnLoading)) return true
			Object.assign(this.$data, this.$options.data())
      this.generateCPMName()
      this.setBacktestHistory(1)
      this.$refs['Form'].clearValidate()
    },
    async checkDuplicateNames(name) {
        const nameLookupRes = await getPortfolioList(null, null, name)
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
    async saveFormData() {
      
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Please review and correct form errors')
        return
      }
      if(this.auto_portfolio) {
        const validateAutoPortfolioForm = await this.validForm('AutoPortfolioForm')
        if(!validateAutoPortfolioForm) {
          // 选择了 auto portfolio，但是表单验证没有通过
          this.popUpMsgBox('Auto Portfolio needs more info. Correct format, please')
          return
        }
      }
      // 验证百分比
      const strategy_combination = this.strategy_combination.slice(1)
      let totalWeight = 0
      let rowWeightValid = true
      let inAllowedList = true
      for (const row of strategy_combination) {
        totalWeight += parseFloat(row.percent) || 0
        row.weightValidErrMsg = _validatePercentageRule(_, row.percent)
        if(row.weightValidErrMsg) rowWeightValid = false
        if(!this.strategiesList || !this.strategiesList.length) {this.strategiesList = await this.getStrategyList()}
        console.log('this.strategiesList', this.strategiesList)
        const isIn = (this.strategiesList.find(ele => ele.model_name.toLocaleLowerCase() === row.strategy.toLocaleLowerCase()) || this.strategiesList.find(ele => ele.url.toLocaleLowerCase() === row.url.toLocaleLowerCase()))?.model_name || false
        if(!isIn) inAllowedList = false
      }
      totalWeight += this.portfolioFirstLine.percent
      if(totalWeight > 100) {this.popUpMsgBox('Total weight percentages cannot exceed 100%'); return false}
      if(totalWeight != 100) {this.popUpMsgBox('Total weight percentages need to be 100%'); return false}
      if(!rowWeightValid) {this.popUpMsgBox('Incorrect Weight column input format'); return false}
      if(!inAllowedList) {this.popUpMsgBox('Please choose strategies from the dropdown'); return false}
      if(strategy_combination.length<1) {this.popUpMsgBox('Please select at least 1 strategies'); return false}
      this.processTips = `Tips: Saving portfolio...`
      const rowUrl = this.rowUrl
      const name = this.data.name
      if(!rowUrl) {
        const nameChecked = await this.checkDuplicateNames(name)
        if(nameChecked){this.popUpMsgBox(`The Name already exists`); return}
      }
      this.percentage = 8
      let saveData = {
        ...this.data,
        strategy_combination: JSON.stringify(this.strategy_combination.slice(1).length === 0 ? [] : this.strategy_combination.slice(1).map(item => {delete item.url; delete item.weightValidErrMsg; delete item.category; delete item.model_name; delete item._category; item.model = 'CASH'; return item})),
        auto_portfolio: capitalizeFirstLetter(this.auto_portfolio.toString()),
      }
      let saveRes
      if(rowUrl) {saveRes = await UpdatePortfolio(rowUrl,saveData)}
      else{saveRes = await RunPortfolio(saveData)}
      // 这里要发请求拿到预推荐列表
      // 刷新Backtest列表
      this.$emit('refreshBTList')
      const code = saveRes.data?.code
      const failedConditions = [203, 403, 404, 406, 443, 444, 445, 446, 500]
      if(failedConditions.includes(Number(code))) {
        // 保存失败, 不进入轮询
        return saveRes
      }
      this.processTips = 'Tips: Running portfolio. Please wait patiently...'
      saveRes.data.data = isJson(saveRes.data.data)?JSON.parse(saveRes.data.data):saveRes.data.data
      let url = saveRes.data.data?.url
      this.rowUrl = url
      let pollingRes = null
      do {
        if(this.percentage < 99) this.percentage += 1
        pollingRes = await getRunPortfolioResults(url)
        const code = pollingRes.data.code
        if (code === 200)  return pollingRes
        const _failedConditions = [401, 403, 443, 404, 407, 444, 445, 446, 500]
        if(_failedConditions.includes(Number(code))) return pollingRes
        // Add a delay here to avoid excessive polling, e.g., using setTimeout
        await new Promise(resolve => setTimeout(resolve, 1500));
      } while (true); // Keep polling indefinitely
    },
    async findPortfolio() {
      if(!this.auto_portfolio) return
      this.findPortfolioLoading = true
      const validateAutoPortfolioForm = await this.validForm('AutoPortfolioForm')
      if(!validateAutoPortfolioForm) {
        // 选择了 auto portfolio，但是表单验证没有通过
        this.findPortfolioLoading = false
        this.popUpMsgBox('Auto Portfolio needs more info. Correct format, please')
        return
      }
      const {
        CAGRChecked, min_CAGR, max_CAGR, 
        winRateChecked, min_win_rate, max_win_rate,
        YTD_returnChecked, min_YTD_return, max_YTD_return,
        max_drow_downChecked, min_max_drow_down, max_max_drow_down
      } = this.portfolioFormData
      const autoData = {
        return_range: YTD_returnChecked ? `${min_YTD_return}-${max_YTD_return}` : '',
        mdd_range: max_drow_downChecked ? `${min_max_drow_down}-${max_max_drow_down}` : '',
        win_rate_range: winRateChecked ? `${min_win_rate}-${max_win_rate}` : '',
        cagr_range: CAGRChecked ? `${min_CAGR}-${max_CAGR}` : '',
      }
      const res = await AutoPortfolio(autoData)
      console.log('res', res)
      const code = res.data.code
      if(code == 200) {
        const data = res.data.data.map(element => (JSON.parse(element))).map(item => ({selection: false,array: item}))
        // 这个时候应该弹出弹窗让用户选择 strategy
        console.log('data', data)
        this.dialogTableVisible = true
        this.autoPortfolioData = data
      }
      this.findPortfolioLoading = false
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
     if(!saveRes) { this.$emit('clearResults');
      this.btnLoading = false; this.processTips = ''; this.percentage = 0; return}
     const code = saveRes.data.code
     if(code == 203) this.popUpMsgBox(`The portfolio is running. You can wait or click the "+" button to create a new portfolio`)
     if(code == 401) this.popUpMsgBox('Calculate error')
     if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('Save failed, Please try again')}
     if(code == 406) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407) this.popUpMsgBox('Empty portfolio. Please run again')
      if(code == 200) {
        this.popUpMsgBox(`The portfolio is completed successfully`)
        this.$emit('displayResultsAndFilter', saveRes.data.data)
      }
      // 只要是错误状态码都要清空 filterList 和 result 数据
      if([400, 401, 404, 403, 406, 407].includes(code)) //this.$emit('clearResults')
      // 运行成或者失败后刷新列表
      this.$emit('refreshBTList')
      this.btnLoading = false
      this.processTips = ''
      this.percentage = 0
    },
    async displayData(data) {
      const row = isJson(data.row) ? JSON.parse(data.row) : data.row
      if(!row) return
      const {url, name, start_date, end_date, cash, strategy_combination} = row
      this.rowUrl = url
      this.auto_portfolio = false
      if(!this.strategiesList || !this.strategiesList.length) {this.strategiesList = await this.getStrategyList()}
      this.strategy_combination = [{}, ...strategy_combination.map(item => {
        const category = (this.strategiesList.find(ele => ele.model_name === item.strategy) || {})?.category || ''
        return {...item, model_name: item.model_name, url: item.model_name, category: this.tags[category], _category: category}
      })]
      let totalWeight = 0
      for (const row of this.strategy_combination.slice(1)) {
        totalWeight += parseFloat(row.percent) || 0
      }
      this.portfolioFirstLine.percent = 100 - totalWeight
      this.data = {name, start_date, end_date, cash}
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

      var results = dropdownList.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)
      cb(results.sort((a, b) => b.priority - a.priority))
    },
    validateTotalPercentage(row) {
      let weight = 0
      for (const _row of [this.portfolioFirstLine,...this.strategy_combination.slice(1)]) {
        weight += parseFloat(_row.percent) || 0
      }
      if(weight > 100) {row.weightValidErrMsg = 'Total weight percentages ≤ 100%'}
      return weight
    },
    addRow(row) {
      let percent = null
      const totalWeight = this.validateTotalPercentage(row)
      if(totalWeight > 0 && totalWeight < 100) {percent = 100 - totalWeight} else {percent = ''}
      if(this.strategy_combination.slice(1).length === 5) {this.popUpMsgBox(`Up to 5 rows can be added`); return}
      this.strategy_combination.push({ strategy: '', category: '', model: '', percent, weightValidErrMsg: '' });
    },
    deleteRow(scope) {
      this.strategy_combination.splice(scope.$index, 1)
      let weight = 0
      for (const _row of this.strategy_combination.slice(1)) {
        weight += parseFloat(_row.percent) || 0
      }
      const percent = 100 - weight
      if(percent >= 0) this.portfolioFirstLine.percent = percent
    },
    validateWeightRule(row) {
      console.log(row.percent)
      row.weightValidErrMsg = _validatePercentageRule(_, row.percent)
      // 每次都计算第一个 percent
      let totalWeight = 0
      for (const row of this.strategy_combination.slice(1)) {
        totalWeight += parseFloat(row.percent) || 0
      }
      if(totalWeight <= 0) return
      if(totalWeight > 100) {row.weightValidErrMsg = 'Total weight percentages ≤ 100%'; return}
      const percent = 100 - totalWeight
      if(percent >= 0) this.portfolioFirstLine.percent = percent
    },
    handleRowSelect(item, row) {
      row.model_name = item.model_name
      row.category = this.tags[item.category]
      row._category = item.category
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
    handleListSelectedFn(selectionvalue, isIndeterminatevalue, scope) {
    // 点击table列表内的选择框
    // 先将所有的选项状态设置为 false
    for (let i = 0; i < this.autoPortfolioData.length; i++) {
        this.autoPortfolioData[i][selectionvalue] = false
    }
    // 设置当前选中的选项状态为 true
    this.autoPortfolioData[scope.$index][selectionvalue] =
      !this.autoPortfolioData[scope.$index][selectionvalue]
      console.log('this.autoPortfolioData', this.autoPortfolioData)
      this.disabled = !this.autoPortfolioData.some(ele => ele.selection)
		},
    async confirmStrategy() {
      this.checkStrategyLoading = true
      const selected = this.autoPortfolioData.some(ele => ele.selection)
      // 判断有没有选择
      if(!selected) {
        this.checkStrategyLoading = false
        this.popUpMsgBox('Please select a strategy')
        return
      }
      if(!this.strategiesList || !this.strategiesList.length) {this.strategiesList = await this.getStrategyList()}
      const selectedStrategy = this.autoPortfolioData.filter((item) => item.selection)[0]?.array.map(item => {
        return {strategy: item.model_name, url: item.model, model: item.symbol_not_long, percent: item.percent, category: this.tags[(this.strategiesList.find(ele => ele.url === item.model) || {})?.category || ''], _category: item.category }
      })
      console.log(selectedStrategy)
      this.strategy_combination = [{}, ...selectedStrategy]
      let totalWeight = 0
      for (const row of this.strategy_combination.slice(1)) {
        totalWeight += parseFloat(row.percent) || 0
      }
      this.portfolioFirstLine.percent = 100 - totalWeight
      this.checkStrategyLoading = false
      this.dialogTableVisible = false
    },
    setPortfolio({strategy_combination, percent}) {
      this.strategy_combination = strategy_combination
      this.portfolioFirstLine.percent = percent
    }
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
  .dialog-footer .el-button--primary {
    width: auto;
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
  /deep/ .el-dialog__body {
    padding: 0px 20px;
  }
  /* 自定义样式 */
  .custom-option {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
      .type-label {
        font-size: 11px;
        color: #999999;
        font-weight: 500;
        margin-right: 10px;
        text-align: center;
        margin-left: 5px;
      }
      .item-label {
        font-size: 11px;
        font-weight: 500;
      }
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
    height: 32px;
  /deep/ .el-progress-bar__innerText {
    margin: 0px 5px 1px 5px;
    // color: #ffffff !important;
  }
  /deep/ .el-progress-bar__outer {
    height: 32px !important;
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
.processTips {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 32px;
    margin: 0px;
    font-weight: 500;
    color: #606266;
  }
}
</style>