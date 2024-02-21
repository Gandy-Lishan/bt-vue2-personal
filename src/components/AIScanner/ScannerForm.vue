<template>
  <div class="scanner-form">
    <el-form
      ref="BasicForm"
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
        <el-form-item prop="type" label="3. Type">
        <el-select
            v-model="data.type"
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
          <el-form-item
          prop="long_short"
          >
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
          <div class="conditionBox">
          <el-input v-model="data.value" placeholder="Input Value"></el-input>
          &nbsp;/&nbsp;
          <el-input v-model="data.value" placeholder="Input Value"></el-input>
          </div>
         </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="stop_loss"
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
          <div class="conditionBox">
            <el-select
              v-model="data.condition"
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
          &nbsp;
          <el-input v-model="data.value" placeholder="Input Value"></el-input>
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="take_profit"
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
          <div class="conditionBox">
            <el-select
              v-model="data.condition"
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
          &nbsp;
          <el-input v-model="data.value" placeholder="Input Value"></el-input>
          </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="time_in_market"
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
          <div class="conditionBox">
            <el-select
              v-model="data.condition"
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
          &nbsp;
          <el-input v-model="data.value" placeholder="Input Value"></el-input>
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
          <el-input v-model="data.value"></el-input>
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
          <el-input v-model="data.commission"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
          prop="daily_stock_nums"
          >
          <template slot="label">
          <label>
            12. Daily Stock Nums
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
          </template>
            <el-input v-model="data.daily_stock_nums"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item
          prop="rank_condition"
          >
          <template slot="label">
          <label>
            13. Rank Condition
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
        <el-col :span="12"></el-col>
        <el-col :span="6">
            <el-button type="warning" :loading="btnLoading" size="small" @click="submitForm" :disabled="previewBtnLoading || btnLoading">View List</el-button>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" :loading="btnLoading" size="small" @click="submitForm" :disabled="previewBtnLoading || btnLoading">Run Backtest</el-button>
        </el-col>
        </el-row>
    </el-form>
  </div>
</template>

<script>
import { timestampToTime } from '@/utils'
import SelectCheck from "./SelectCheck";

export default {
  name: 'ScannerForm',
  components: {
    SelectCheck
  },
  data() {
    return {
      data: {
        start_date: '',
        end_date: ''
      },
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      typeOptions: [
        { value: 'Stock', label: 'Stock' },
        { value: 'ETF', label: 'ETF' }
      ],
      conditionOptions: [
        { value: 0, label: '>' },
        { value: 1, label: '<' },
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
    }
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
</style>