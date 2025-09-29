<template>
  <div>
    <el-form
		ref="DOMForm"
		class="DOM-form-container seasonality-form-container"
		:model="data"
		label-position="top"
		size="mini"
    :rules="rules"
	>
    <div class=" top">
      <el-form-item
          prop="symbol"
        >
        <template slot="label">
            <label>
              1.Symbol
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  >Choose a stock/index/ETF as symbol.(default:SPX)</span>
                <i class="fa fa-question-circle right" aria-hidden="true"></i>
              </el-tooltip>
            </label>
        </template>
        <SearchAutocomplete
            v-model="symbol"
            @query="querySearch"
            @select="item => handleSelect(item)"
            placeholder="Please select indicator from the dropdown menu"
          />
      </el-form-item>
      <el-form-item
        label="2.Date Range"
      >
      <template slot="label">
        <label>
          2.Date Range
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >Select the start and end dates for the selected symbol data. <br/>
              For instance, the start date is 2020, and the end date is 2022. <br/>
              The selected symbol data will cover the period from January 1, 2020, to December 31, 2022.</span>
            <i class="fa fa-question-circle right" aria-hidden="true"></i>
          </el-tooltip>
        </label>
      </template>
        <div class="select-container">
        <div class="startAndEndBox">
          <el-date-picker
          ref="startDatePicker"
          @change="pickStartDate"
          value-format="yyyy"
          v-model="data.start_date"
          type="year"
          align="right"
          unlink-panels="true"
          range-separator="to"
          placeholder="Start Date"
          :picker-options="startPickerOptions"
          >
        </el-date-picker>
        <span>to</span>
        <el-date-picker
        ref="endDatePicker"
          @change="pickEndDate"
          value-format="yyyy"
          v-model="data.end_date"
          type="year"
          align="right"
          unlink-panels="true"
          range-separator="to"
          :picker-options="endPickerOptions"
          placeholder="End Date"
          >
        </el-date-picker>
        </div>
      </div>
      </el-form-item>
      <el-form-item
          label="3.Category"
          prop="category"
        >
        <template slot="label">
          <label>
            3.Category
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Calendar day refers to a natural date on the calendar. <br/>
                Trading day refers to a day when the stock market<br/> is open for regular trading activities</span>
              <i class="fa fa-question-circle right" aria-hidden="true"></i>
            </el-tooltip>
          </label>
        </template>
          <el-select v-model="data.category" placeholder="Please select category">
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
          label="4.Month Selection"
          prop="monthSelection"
          placeholder="Please input the name of your custom indicator"
        >
        <template slot="label">
          <label>
            4.Month Selection
          </label>
        </template>
          <el-select v-model="data.monthSelection" placeholder="Please select month" @change="changeMonth">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="DOM-container-bottom bottom">
      <DOMChart :plotConfiguration="plotConfiguration" :data="data"></DOMChart>
    </div>
    </el-form>
  </div>
</template>

<script>
import DOMChart from "../SNChart/DOMChart.vue"
import {createStateFilter} from '@/utils/globalFunc'
import { mapGetters } from "vuex"
import { SearchAutocomplete } from "@/components/common"

export default {
  name: 'DayOfMonth',
  data() {
    return {
      data: {
        symbol: process.env.VUE_APP_DEFAULT_SYMBOL,
        start_date: (new Date().getFullYear() - 20).toString(),
        end_date:  new Date().getFullYear().toString(),
        monthSelection: 0,
        category: 'calendar_day'
      },
      dropdownList: [],
        options: [
          {label: 'January', value: 0},
          {label: 'February', value: 1},
          {label: 'March', value: 2},
          {label: 'April', value: 3},
          {label: 'May', value: 4},
          {label: 'June', value: 5},
          {label: 'July', value: 6},
          {label: 'August', value: 7},
          {label: 'September', value: 8},
          {label: 'October', value: 9},
          {label: 'November', value: 10},
          {label: 'December', value: 11}
        ],
        categoryOptions: [
          {label: 'Calendar Day', value: 'calendar_day'},
          {label: 'Trading Day', value: 'trading_day'}
        ],
        startPickerOptions: {
          disabledDate: this.handleDisabledStartDate
        },
        endPickerOptions: {
          disabledDate: this.handleDisabledEndDate
        },
        symbol: process.env.VUE_APP_DEFAULT_SYMBOL,
        plotConfiguration: {
          title: 'Seasonality in the SPX',
          subtitle: 'Month of October',
          xAxisTitle: 'Day Of The Month',
          customScale: true, // 如果需要自定义刻度
          formatter: true, // 如果需要自定义数据提示
          scaleSettings: {
              positiveColor: '#00B050',
              negativeColor: '#C0504D',
              yAxis_1: {
              tickPositions: [-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5],
              max: 0.5,
              min: -0.5,
              format: '{value}'
              },
              yAxis_2: {
              tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
              format: '{value} %'
              },
          }
        },
    }
  },
  components: {
    DOMChart,
    SearchAutocomplete
  },
  computed: {
    // ...mapGetters({
    //   symbolList: 'getRefactoredSymbolList'
    // })
    symbolList() {
      const data = localStorage.getItem('refactoredConcatList');
      return data ? JSON.parse(data) : [];
    }
  },
  watch: {
     data: {
      handler(newVal, _) {
        if(Object.keys(newVal).length == 0) return
        this.plotConfiguration = {
          ...this.plotConfiguration,
          title: `Seasonality in the ${newVal.symbol || ''}`,
          subtitle: `Month of ${this.options[newVal.monthSelection].label}`,
          start_date: newVal.start_date,
          end_date: newVal.end_date,
          month: this.options[newVal.monthSelection].label,
          symbol: newVal.symbol || '',
          category: newVal.category
        }
      },
      deep: true,
      immediate: true,
     },
  },
  mounted() {
    this.dropdownList = this.symbolList
    this.data.monthSelection = new Date().getMonth()
  },
  methods: {
    handleDisabledStartDate(time) {
      const end_date = this.data.end_date
      return time.getFullYear() > end_date || time.getFullYear() < 1800;
    },
    handleDisabledEndDate(time) {
      return time.getFullYear() > new Date().getFullYear() || time.getFullYear() < 1800 || time.getFullYear() < this.data.start_date;
    },
    querySearch(queryString, cb) {
      var dropdownList = this.dropdownList
      if(!dropdownList || dropdownList.length == 0) {
        dropdownList = this.symbolList
      }
      var results = dropdownList.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)

      cb(results.sort((a, b) => b.priority - a.priority))
    },
    handleSelect(item) {
      this.$nextTick(()=>{
        this.symbol = item.url
        this.data.symbol = item.url
      });
    },
    changeMonth(month) {
      console.log(month)
    },
    pickStartDate(date) {
      console.log(date)
    },
    pickEndDate(date) {
      console.log(date)
    },
  }
}
</script>

<style lang="less" scoped>
@import "../../index.less";
.seasonality-form-container .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--year {
  width: 100%;
}
.seasonality-form-container .startAndEndBox {
  justify-content: space-between;
  width: 100%;
}
/deep/ .el-form-item__label {
  font-weight: 600;
  color: #000000;
}
/deep/ .el-button--primary, /deep/ .el-input__inner, /deep/ .el-input-group__append {
  font-weight: 600;
}
</style>