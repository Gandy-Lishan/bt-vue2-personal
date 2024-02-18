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
				label="4. End Date"
        prop="end_date"
			  >
        <template slot="label">
          <label>
            4. End Date
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
				label="4. Strategy Chioce"
        prop="strategy_chioce"
        >
        <template slot="label">
          <label>
            4. Strategy Chioce
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                ></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
        <div class="conditionBox">
          <el-select
            v-model="data.type"
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
          prop="Commission"
          >
          <template slot="label">
          <label>
            10. Commission
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
            11. Daily Stock Nums
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
        <el-col :span="6">
          <el-form-item
          prop="rank_condition"
          >
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
            <el-input v-model="data.rank_condition"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item
          prop="signals"
          >
          <template slot="label">
          <label>
            13. Signals
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
      <el-row :span="6">
          <el-form-item class="CPM-btn" label=" ">
            <el-button type="primary" :loading="btnLoading" @click="submitForm" :disabled="previewBtnLoading || btnLoading">Backtest Pattern</el-button>
          </el-form-item>
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
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' }
      ],
      conditionOptions: [
        { value: 0, label: '>' },
        { value: 1, label: '=' },
        { value: 2, label: '<' },
      ],
      options: [
        {
          value: '001',
          label: '黄金糕',
          check: true
        },
        {
          value: '002',
          label: '双皮奶',
          check: true
        },
        {
          value: '003',
          label: '蚵仔煎',
          check: true
        },
        {
          value: '004',
          label: '龙须面',
          check: true
        },
        {
          value: '005',
          label: '北京烤鸭',
          check: true
        }
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
</style>