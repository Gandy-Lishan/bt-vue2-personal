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
          prop="name"
          >
          <template slot="label">
          <label>
            1. Name
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >The name of the backtest strategy. <br/>Please enter a custom name for identification</span>
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
              2. Total Capital
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  >The total capital for backtesting.</span>
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
            3. Commission
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Trading commission rate.</span>
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
            4. Rank Condition
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Ranking criteria. Choose one condition to determine<br/>
                 how stocks or ETFs meeting the filtering criteria are ranked.</span>
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
          label="3. Start Date"
          prop="start_date"
        >
        <template slot="label">
          <label>
            5. Start Date
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Backtest start date. Data after this date will be used for backtesting</span>
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
            6. End Date
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Backtest end date. Data before this date will be used for backtesting.</span>
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
        <el-form-item prop="find_type">
          <template slot="label">
          <label>
            7. Type
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >The security type to search for. <br/>
                Selecting 'Stock' will only search for stocks, <br/>
                selecting 'ETF' will only search for ETFs, <br/>
                selecting 'Stock & ETF' will search for both. <br/>
                Please choose one of these options.</span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
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
            8. Signals
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >The trading signals used. <br/>
                Select one or more signals here to determine when to buy or sell.</span>
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
              9. Long / Short Percentage
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  >The long-short position during the backtest period. <br/>
                  Enter two values here, <br/>
                  representing the weights of long and short positions respectively.</span>
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
              <span class="sign">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
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
              10. Take Profit
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  >Set profit target range. 
                  Enter two values representing <br/>the minimum and maximum profit targets.</span>
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
            <span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
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
              11. Stop Loss
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  >Set stop-loss range. 
                  Enter two values representing <br/>the minimum and maximum stop-loss points.</span>
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
              <span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
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
              12. Time In Market
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  >Set market stay duration range.
                  Enter two values representing <br/>the minimum and maximum duration the market stays.</span>
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
            <span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
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
        prop="daily_limit"
        >
        <template slot="label">
        <label>
          13. MAX Daily Symbol Nums
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >Daily trading limit, indicating the maximum number of<br/> trades allowed per trading day.</span>
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
          <!-- <el-form-item
          prop="capital_allocate"
          >
          <template slot="label">
          <label>
            14. Capital Allocate
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Funds allocation method. Choosing the Kelly formula<br/>
                 allows the system to dynamically adjust fund allocation<br/>
                  based on strategy performance. Selecting maximum <br/>
                  capital allocation per trade enables you to manually <br/>
                  specify the maximum capital allocation for each trade.</span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
          </template>
            <el-input v-model="data.capital_allocate" placeholder="Enter 'Kelly' or a number between 0 and 1"></el-input>
            
        <el-select v-model="data.capital_allocate" @change="handleQuery">
          <el-option
            v-for="capitalAll in capitalAllocates"
            :key="capitalAll.value"
            :label="capitalAll.label"
            :value="capitalAll.value"
          ></el-option>
        </el-select>
					<el-input 
						placeholder="" 
						v-model="searchItem" 
						class="search"
						@input="handleQuery"
						clearable
						@clear="handleQuery"
					>
						<el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
					</el-input>
					<el-button @click="exportTable" type="primary" round size="mini" style="float: right; margin-top: 20px;"><i class="el-icon-arrow-left el-icon-download" style="margin-right: 5px;"></i>Export table</el-button>
          </el-form-item> -->
          <el-form-item
          >
          <template slot="label">
            <label>
            14. Capital Allocate
            <el-tooltip effect="dark" placement="top">
              <span slot="content">
                Manual Input: This refers to entering a<br/> 
                trade using a percentage of the cash <br/>
                remaining in the account.<br/>
                Auto Allocation: This involves <br/>
                calculating the proportion of capital to <br/>
                be used for entering trades on a given day, <br/>
                based on the information of selected stocks for that day, <br/>
                using the Kelly Criterion (Kelly Formula).
              </span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
          </template>
          <div class="_conditionBox">
          <el-form-item label-width="0px">
            <el-select v-model="data.capital_allocate">
              <el-option
                v-for="capitalAll in capitalAllocates"
                :key="capitalAll.value"
                :label="capitalAll.label"
                :value="capitalAll.value"
              ></el-option>
            </el-select>
          </el-form-item>
            <span class="sign">&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-form-item label-width="0px" v-if="data.capital_allocate === 'manual_input'" prop="capital_allocate_num">
            <el-input v-show="data.capital_allocate === 'manual_input'" v-model="data.capital_allocate_num" placeholder="Enter Percentage"><template v-slot:append v-if="data.capital_allocate === 'manual_input'">(%)</template></el-input>
          </el-form-item>
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
          <div class="processTips" v-show="percentage != 0"><i v-show="percentage != 0" class="el-icon-loading"></i><span v-html="processTips"></span></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" class="row-bg" justify="end">
        <el-col :span="16"></el-col>
        <el-col :span="4">
            <el-button type="warning" size="small" @click="previewList" :loading="previewBtnLoading" :disabled="btnLoading || previewBtnLoading">View List</el-button>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" size="small" @click="submitForm" :loading="btnLoading" :disabled="btnLoading || previewBtnLoading" v-show="percentage == 0">Run Backtest</el-button>
            <div class="processTipsBox" v-show="percentage != 0">
            <el-progress :text-inside="true" :stroke-width="15" :percentage="percentage" :color="customColorMethod"></el-progress>
            </div>
        </el-col>
        </el-row>
    </el-form>
  </div>
</template>

<script>
import { isJson, timestampToTime, trimTrailingZeros } from '@/utils'
import SelectCheck from "./SelectCheck";
import { validateCapitalRule, validateCommissionRule, createPositiveScopeIntegerRule, createTPSLScopeValidateRule, createPositiveIntegerRule   } from '@/utils/formValidate'
import { saveScannerForm, editScannerForm, getScannerBTList, getScannerBTResults, perviewScannerForm } from '@/service/service'

export default {
  name: 'ScannerForm',
  props: ['parentContext'],
  components: {
    SelectCheck
  },
  data() {
    var validateRatio = (rule, value, callback) => {
      // 验证是否为正整数
      const integerValue = parseInt(value);
      const field = rule.field
      const short_ratio = field == 'short_ratio' ? integerValue : parseInt(typeof this.data.short_ratio === 'undefined' ? 0 : this.data.short_ratio);
      const long_ratio = field == 'long_ratio' ? integerValue : parseInt(typeof this.data.long_ratio === 'undefined' ? 100 : this.data.long_ratio);
      if(this.data.short_ratio) this.data.short_ratio = short_ratio
      if(this.data.long_ratio) this.data.long_ratio = long_ratio
      if (short_ratio === 0 && long_ratio === 0) {
          callback(new Error("The percentages cannot be both 0"));
      } else if (!isNaN(integerValue) && integerValue >= 0 && short_ratio + long_ratio <= 100 && Number.isInteger(short_ratio) && Number.isInteger(long_ratio)) {
        this.$refs['Form'].fields.map(i => {
            const _field = field === 'short_ratio' ? 'long_ratio' : 'short_ratio'
            if (i.prop === _field) {
                i.clearValidate()
            }
        })
          callback(); // 验证通过
      } else {
          callback(new Error("Percentages must sum to 100% and be positive whole numbers"));
      }
    };
    var validatePercentage = (rule, value, callback) => {
      // 验证是否为正整数
      if(this.data.capital_allocate === 'Kelly') callback()
      const integerValue = parseInt(value);
      if (!isNaN(integerValue) && integerValue >= 0 && integerValue <= 100 && Number.isInteger(integerValue)) {
          callback(); // 验证通过
      } else {
          callback(new Error("Only positive integers between 0 and 100 allowed"));
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
        long_ratio: 100,
        short_ratio: 0,
        stop_loss_condition: 6,
        take_profit_condition: 8,
        time_in_market_condition: 5,
        stop_loss: 15,
        take_profit: 30,
        time_in_market: 34,
        name: '',
        total_capital: 1000000,
        commission: 0,
        rank_condition: 'StdDev',
        daily_limit: 3,
        capital_allocate: 'manual_input',
        capital_allocate_num: 60,
      },
      rowUrl: null,
      btnLoading: false,
      previewBtnLoading: false,
      isPolling: false,
      processTips: '',
      percentage: 0,
      signals: ['All'],
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
        // { value: 'Kelly', label: 'Kelly'},
        { value: 'WinRate', label: 'Win Rate(%)'},
        { value: 'Z_Score', label: 'Z-Score'},
        { value: 'StdDev', label: 'STD.DEV'},
        { value: 'Expected Return(%)', label: 'Expected Return(%)'},
        { value: 'SharpeRatio', label: 'Sharpe Ratio'},
      ],
      capitalAllocates: [
        { value: 'Kelly', label: 'Auto Allocation'},
        { value: 'manual_input', label: 'Manual Input'}
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
          value: 'Hammer followed by a rise',
          label: 'Hammer followed by a rise',
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
          value: 'Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35',
          label: 'Optix #5',
          check: true
        },
        {
          value: 'Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35',
          label: 'Optix #6',
          check: true
        },
        {
          value: 'Symbol Close > its\' MA200 and Optix > 43 After Below 30',
          label: 'Optix #7',
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
        },
        /** cpm pattern */
        {
          value: 'Head and Shoulders Top',
          label: 'Head and Shoulders Top',
          check: true
        },
        {
          value: 'Head and Shoulders Bottom',
          label: 'Head and Shoulders Bottom',
          check: true
        },
        {
          value: 'Double Top',
          label: 'Double Top',
          check: true
        },
        {
          value: 'Double Bottom',
          label: 'Double Bottom',
          check: true
        },
        {
          value: 'Triple Tap',
          label: 'Triple Tap',
          check: true
        },
        {
          value: 'Rounding Bottom',
          label: 'Rounding Bottom',
          check: true
        },
        {
          value: 'Ascending Channel',
          label: 'Ascending Channel',
          check: true
        },
        {
          value: 'Descending Channel',
          label: 'Descending Channel',
          check: true
        },
        /** 8 high-low signals */
        {
          value: 'Symbol All-Time High',
          label: 'Symbol All-Time High',
          check: true
        },
        {
          value: 'Symbol All-Time Low',
          label: 'Symbol All-Time Low',
          check: true
        },
        {
          value: 'Symbol 52-Week High',
          label: 'Symbol 52-Week High',
          check: true
        },
        {
          value: 'Symbol 52-Week Low',
          label: 'Symbol 52-Week Low',
          check: true
        },
        {
          value: 'Symbol 4-Week High',
          label: 'Symbol 4-Week High',
          check: true
        },
        {
          value: 'Symbol 4-Week Low',
          label: 'Symbol 4-Week Low',
          check: true
        },
        {
          value: 'Symbol 13-Week High',
          label: 'Symbol 13-Week High',
          check: true
        },
        {
          value: 'Symbol 13-Week Low',
          label: 'Symbol 13-Week Low',
          check: true
        },
        // trend score
        {
          value: 'Trend Score Breakout',
          label: 'Trend Score Breakout',
          check: true
        },
        {
          value: 'Trend Score Breakdown',
          label: 'Trend Score Breakdown',
          check: true
        },
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
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.stop_loss, true)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.stop_loss, true)(rule, value, callback), trigger: 'change' }
        ],
        stop_loss: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.stop_loss_condition, null, true)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.stop_loss_condition, null, true)(rule, value, callback), trigger: 'change' }
        ],
        take_profit_condition: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.take_profit, true)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.take_profit, true)(rule, value, callback), trigger: 'change' }
        ],
        take_profit: [
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.take_profit_condition, null, true)(rule, value, callback), trigger: 'blur' },
        { validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.take_profit_condition, null, true)(rule, value, callback), trigger: 'change' }
        ],
        commission: [
          { validator: validateCommissionRule, trigger: 'blur' },
          { validator: validateCommissionRule, trigger: 'change' }
        ],
        capital_allocate_num: [
          { validator: validatePercentage, trigger: 'blur' },
          { validator: validatePercentage, trigger: 'change' }
        ],
        total_capital: [
          { validator: validateCapitalRule, trigger: 'blur'},
          { validator: validateCapitalRule, trigger: 'change' }
        ],
        daily_limit: [
          { validator: createPositiveIntegerRule('MAX Daily Symbol Nums', 1, 5, true), trigger: 'blur' },
          { validator: createPositiveIntegerRule('MAX Daily Symbol Nums', 1, 5, true), trigger: 'change' }
        ],
      }
    }
  },
  mounted() {
    this.setBacktestHistory(6)
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
      this.data.name = `Scanner Backtest ${year}-${month}-${day} ${hour}:${minute}:${second}`
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
        this.$refs['Form'].resetFields()
        console.log(this.data)
        this.data = {
          ...this.data,
          ...{
          start_date: '',
          end_date: '',
          find_type: 'stock/etf',
          long_ratio: 100,
          short_ratio: 0,
          stop_loss_condition: 6,
          take_profit_condition: 8,
          time_in_market_condition: 5,
          stop_loss: 15,
          take_profit: 30,
          time_in_market: 34,
          total_capital: 1000000,
          commission: 0,
          rank_condition: 'StdDev',
          daily_limit: 3,
          capital_allocate: 'manual_input',
          capital_allocate_num: 60,
        }
        }
        this.signals = ['All']
        this.rowUrl = null
        this.btnLoading = false
        this.previewBtnLoading = false
        this.isPolling = false
        this.processTips = ''
        this.percentage = 0
        this.generateCPMName()
        this.setBacktestHistory(6)
        this.$refs['Form'].clearValidate()
    },
    selected(signals){
      console.log('触发了', signals)
      this.signals = signals
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
      
      if(this.signals.length === 0) {this.popUpMsgBox('Please select at least one signal');return}
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly')
        return
      }
      let {
        long_ratio, short_ratio, 
        stop_loss, take_profit, time_in_market,
        stop_loss_condition, take_profit_condition, time_in_market_condition,
        commission,
        capital_allocate,
        capital_allocate_num
      } = this.data
      let {signals} = this
      signals = Array.from(new Set([...signals]))
      const arraysEqualIgnoreOrder = (a, b) => {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
      }
      // 判断 signals 是数组，且内容为 ['All']
      const isArrEqual = Array.isArray(signals) &&
      signals.length === 1 &&
      signals[0] === 'All'
      const isStringEqual = typeof signals === 'string' &&
      String(signals) === 'All'
      const isSignalAll = arraysEqualIgnoreOrder(signals, this.options.map(item => item.value))
      const saveData = {
        ...this.data,
        long_short_ratio: `${(long_ratio / 100).toFixed(5)}/${(short_ratio / 100).toFixed(5)}`,
        risk_control_filter_number: `${take_profit}/${stop_loss}/${time_in_market}`,
        risk_control_filter_condition: `${take_profit_condition}/${stop_loss_condition}/${time_in_market_condition}`,
        commission: (commission / 100).toFixed(5),
        signals: JSON.stringify((isSignalAll || isArrEqual || isStringEqual) ? ['All'] : signals),
        capital_allocate: capital_allocate !== 'Kelly' ? `${(capital_allocate_num/100).toFixed(2)}` : 'Kelly'
      }
      const removeProperties = (obj, properties) => {
          properties.forEach(property => {
            if (obj.hasOwnProperty(property)) {
              delete obj[property]
            }
          })
      }
      // 要删除的属性列表
      const propertiesToRemove = ['long_ratio', 'short_ratio', 'stop_loss', 'take_profit', 'time_in_market', 'stop_loss_condition', 'take_profit_condition', 'time_in_market_condition', 'capital_allocate_num']
      removeProperties(saveData, propertiesToRemove)
      return await perviewScannerForm(saveData)
    },
    async saveFormData() {
      debugger
      if(this.signals.length === 0) {this.popUpMsgBox('Please select at least one signal');return}
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
      let {
        long_ratio, short_ratio, 
        stop_loss, take_profit, time_in_market,
        stop_loss_condition, take_profit_condition, time_in_market_condition,
        commission,
        capital_allocate,
        capital_allocate_num
      } = this.data
      let {signals} = this
      signals = Array.from(new Set([...signals]))
      const arraysEqualIgnoreOrder = (a, b) => {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
      }
      // 判断 signals 是数组，且内容为 ['All']
      const isArrEqual = Array.isArray(signals) &&
      signals.length === 1 &&
      signals[0] === 'All'
      const isStringEqual = typeof signals === 'string' &&
      String(signals) === 'All'
      const isSignalAll = arraysEqualIgnoreOrder(signals, this.options.map(item => item.value))
      const saveData = {
        ...this.data,
        long_short_ratio: `${(long_ratio / 100).toFixed(5)}/${(short_ratio / 100).toFixed(5)}`,
        risk_control_filter_number: `${take_profit}/${stop_loss}/${time_in_market}`,
        risk_control_filter_condition: `${take_profit_condition}/${stop_loss_condition}/${time_in_market_condition}`,
        commission: (commission / 100).toFixed(5),
        signals: JSON.stringify((isSignalAll || isArrEqual || isStringEqual) ? ['All'] : signals),
        capital_allocate: capital_allocate !== 'Kelly' ? `${(capital_allocate_num/100).toFixed(2)}` : 'Kelly'
      }
      const removeProperties = (obj, properties) => {
          properties.forEach(property => {
            if (obj.hasOwnProperty(property)) {
              delete obj[property]
            }
          })
      }
      // 要删除的属性列表
      const propertiesToRemove = ['long_ratio', 'short_ratio', 'stop_loss', 'take_profit', 'time_in_market', 'stop_loss_condition', 'take_profit_condition', 'time_in_market_condition', 'capital_allocate_num']
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
        if(code == 401 || code == 403 || code == 404 || code == 407 || this.percentage == 0 || this.processTips === '') return pollingRes
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
     if(code == 203 && this.processTips) this.popUpMsgBox(`The "${_name}" backtest is running. You can wait or click the "+" button to create a new backtest`)
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
      const {url, long_short_ratio, risk_control_filter_number, risk_control_filter_condition, commission, signals, capital_allocate} = data
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
        signals: isJson(signals) ? JSON.parse(signals) : signals,
        capital_allocate: capital_allocate !== 'Kelly' ? 'manual_input' : 'Kelly'
      }
      if(capital_allocate !== 'Kelly') prepareData.capital_allocate_num = trimTrailingZeros((capital_allocate * 100).toFixed(2))
      if(Array.isArray(data['signals']) && data['signals'].length === 1 && data['signals'][0] === 'All') {
        this.$refs['SelectCheck'].handleoptionsAllChange(true)
        this['signals'] = data.signals
        delete data.signals
      }else if(Array.isArray(data['signals'])){
        this.$refs['SelectCheck'].handleoptionsAllChange(false)
        const arr = []
        data['signals'].forEach(ele => {
          const item = {
            label: ele,
            value: ele,
            check: true
          }
          this.$refs['SelectCheck'].handleTaskItemChange(item)
          arr.push(ele)
        })
        this['signals'] = arr
      }
      for (const key in target) {target[key] = prepareData[key]}
      this.data = target
    },
    async rerunSCBacktest(data) {
      data.end_date = timestampToTime(new Date())
      this.displayData(data)
      await this.submitForm()
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
    customColorMethod(percentage) {
      if (percentage < 50) {
        return '#66ace5'
      } else if (percentage < 70) {
        return '#66ace5';
      } else if(percentage < 90){
        return '#66ace5';
      }else {
        return '#66ace5';
      }
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
/deep/ .el-form-item__label {
  font-weight: 600;
  color: #606266;
}
/deep/ .el-button, /deep/ .el-input__inner, /deep/ .el-input-group__append, /deep/ .el-tag, .category-text, .sign {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}
}
</style>