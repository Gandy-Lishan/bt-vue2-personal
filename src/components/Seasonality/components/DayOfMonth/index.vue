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
                  >Enter stock symbol or name</span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
        </template>
        <el-autocomplete
						class="inline-input"
						v-model="symbol"
						:fetch-suggestions="querySearch"
						placeholder="Please select indicator from the dropdown menu"
						@select="
							(item) => {
								handleSelect(item)
							}
						"
					>
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
            <!-- 使用 scoped slot 自定义选项 -->
						<template slot-scope="{ item }">
							<div class="custom-option">
								<span class="symbol-label">{{
									item.url
								}}</span>
								<span class="symbol-url">{{
									item.label
								}}</span>
							</div>
						</template>
					</el-autocomplete>
      </el-form-item>
      <el-form-item
        label="2.Date Range"
      >
      <template slot="label">
        <label>
          2.Date Range
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >Select date range</span>
            <i class="iconfont icon-wenhao"></i>
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
          label="3.Month Selection"
          prop="monthSelection"
          placeholder="Please input the name of your custom indicator"
        >
        <template slot="label">
          <label>
            3.Month Selection
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Choose a month</span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
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
export default {
  name: 'DayOfMonth',
  data() {
    return {
      data: {
        symbol: 'SPY',
        start_date: (new Date().getFullYear() - 20).toString(),
        end_date:  new Date().getFullYear().toString(),
        monthSelection: 0
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
        startPickerOptions: {
          disabledDate: this.handleDisabledStartDate
        },
        endPickerOptions: {
          disabledDate: this.handleDisabledEndDate
        },
        symbol: 'SPY',
        plotConfiguration: {
          title: 'Seasonality in the SPY',
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
    DOMChart
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
          symbol: newVal.symbol || ''
        }
      },
      deep: true,
      immediate: true,
     },
  },
  mounted() {
    this.dropdownList = JSON.parse(localStorage.getItem('symbolList'))
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
      var results = queryString
        ? dropdownList.filter(this.createFilter(queryString))
        : dropdownList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (dropdownList) => {
        const labelMatch =
          dropdownList.label
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        const urlMatch =
          dropdownList.url.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        return labelMatch || urlMatch
      }
    },
    handleSelect(item) {
      this.symbol = item.url
      this.data.symbol = item.url
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
</style>