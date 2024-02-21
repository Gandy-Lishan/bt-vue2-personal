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
            @change="calculateBarDistance"
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
            @change="calculateBarDistance"
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
            <SelectCheck :options="options" @selected="selected"/>
          </el-form-item>
      </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
         <el-form-item prop="long_short_ratio">
          <template slot="label">
            <label>
              5. Long / Short
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  ></span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
          </template>
          <div class="_conditionBox">
              <el-form-item prop="long_ratio" label-width="0px">
                <el-input v-model="data.long_ratio" placeholder="Input Ratio">
                </el-input>
              </el-form-item>
              <span>&nbsp;/&nbsp;</span>
              <el-form-item prop="short_ratio" label-width="0px">
                <el-input v-model="data.short_ratio" placeholder="Input Ratio"></el-input>
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
            <el-select
              v-model="data.stop_loss_condition"
              placeholder="— Select Condition —"
          >
            <el-option
              v-for="item in conditionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
              <span>&nbsp;</span>
              <el-form-item prop="stop_loss" label-width="0px">
              <el-input v-model="data.stop_loss" placeholder="Input Number">
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
            <el-select
              v-model="data.take_profit_condition"
              placeholder="— Select Condition —"
          >
            <el-option
              v-for="item in conditionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span>&nbsp;</span>
          <el-form-item prop="take_profit" label-width="0px">
          <el-input v-model="data.take_profit" placeholder="Input Number">
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
            <el-select
              v-model="data.time_in_market_condition"
              placeholder="— Select Condition —"
          >
            <el-option
              v-for="item in conditionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span>&nbsp;</span>
          <el-form-item prop="time_in_market" label-width="0px">
          <el-input v-model="data.time_in_market" placeholder="Input Bars">
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
          <el-input v-model="data.name"></el-input>
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
          prop="Commission"
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
        <el-form-item prop="capital_allocate">
          <template slot="label">
          <label>
            12. Capital Allocate
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
        <el-select
            v-model="data.capital_allocate"
            placeholder="— Select type —"
          >
            <el-option
              v-for="item in AllocateOptions"
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
          <el-input v-model="data.daily_limit">
            <template v-slot:append>(1~5)</template>
          </el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="rank_condition"
          >
          <template slot="label">
          <label>
            14. Rank Condition
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
          </template>
            <el-input v-model="data.rank_condition"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" class="row-bg" justify="end">
        <el-col :span="16"></el-col>
        <el-col :span="4">
            <el-button type="warning" size="small">View List</el-button>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" size="small" @click="submitForm">Run Backtest</el-button>
        </el-col>
        </el-row>
    </el-form>
  </div>
</template>

<script>
import { timestampToTime } from '@/utils'
import SelectCheck from "./SelectCheck";
import { validateCapitalRule, validateCommissionRule, validateSlippageRule } from '@/utils/formValidate'

export default {
  name: 'ScannerForm',
  components: {
    SelectCheck
  },
  data() {
    return {
      data: {
        start_date: '',
        end_date: '',
        find_type: 'stock/etf',
        long_ratio: 0.8,
        short_ratio: 0.2,
        stop_loss_condition: '>',
        take_profit_condition: '>',
        time_in_market_condition: '>',
        stop_loss: 5,
        take_profit: 10,
        time_in_market: 21,
        name: '',
        total_capital: 100000,
        commission: 0.1,
        capital_allocate: 'Kelly',
        daily_limit: 3,
      },
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
      conditionOptions: [
        { value: '>', label: '>' },
        { value: '<', label: '<' },
      ],
      AllocateOptions: [
        { value: 'Kelly', label: 'Kelly'},
        { value: 'WinRate', label: 'WinRate'},
        { value: 'Z_Score', label: 'Z_Score'},
        { value: 'StdDev', label: 'StdDev'},
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
        },
        {
          value: 'ExpectedReturn',
          label: 'ExpectedReturn',
          check: true
        },
      ],
      rules: {
        long_ratio: [
          {
            validator: validateSlippageRule,
            trigger: 'blur'
          }
        ],
        short_ratio: [
          {
            validator: validateSlippageRule,
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: 'Enter a name', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    this.setBacktestHistory(10)
  },
  methods: {
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
    selected(value){
      console.log(value);
    }
  }
}
</script>

<style lang="less" scoped>
.scanner-form .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--year, .scanner-form .el-select, .el-date-editor.el-input, .el-date-editor.el-input__inner, .scanner-form /deep/ .el-form-item__label{
  width: 100%;
}
.conditionBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.scanner-form .el-button--primary, .scanner-form .el-button--warning {
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
.scanner-form /deep/ .el-input-group__append, .scanner-form /deep/ .el-input-group__prepend {
  padding: 0 5px;
}
</style>