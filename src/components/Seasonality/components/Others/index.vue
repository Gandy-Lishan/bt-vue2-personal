<template>
  <div>
    <el-form
		ref="othersForm"
		class="others-form-container seasonality-form-container"
		:model="data"
		label-position="top"
		size="mini"
    :rules="rules"
	>
    <div class="others-container-top top">
      
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
						v-model="data.symbol"
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
          label="3.Category"
        >
      <template slot="label">
        <label>
          3.Category
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >Choose category</span>
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </label>
      </template>
          <el-select v-model="data.category" placeholder="Please select category" @change="changeCategory">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="others-container-bottom bottom" :class="{'show-table': [2, 3].includes(data.category)}">
      <OCDChart :plotConfiguration="plotConfiguration"></OCDChart>
    </div>
    </el-form>
  </div>
</template>

<script>
import OCDChart from "../SNChart/OCDChart.vue"
export default {
  name: 'Others',
  data() {
    return {
      data: {
        symbol: 'SPY',
        category: 0,
        start_date: (new Date().getFullYear() - 5).toString(),
        end_date:  new Date().getFullYear().toString(),
      },
      dropdownList: [],
        options: [
          {label: 'Return by Day of Week', value: 0},
          {label: 'Return by Month', value: 1},
          {label: 'Performance by Day of Month', value: 2},
          {label: 'Performance by Day of Year', value: 3}
        ],
        startPickerOptions: {
          disabledDate: this.handleDisabledStartDate
        },
        endPickerOptions: {
          disabledDate: this.handleDisabledEndDate
        },
        plotConfiguration: {
          title: 'Nasdaq Composite Avg Return Month',
          subtitle: '1971-2011',
          xAxisTitle: 'Month',
          customScale: true, // 如果需要自定义刻度
          formatter: true, // 如果需要自定义数据提示
          scaleSettings: {
              positiveColor: '#00B050',
              negativeColor: '#C0504D',
              yAxis_1: {
              tickPositions: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
              max: 4,
              min: -4,
              format: '{value} %'
              },
              yAxis_2: {
              tickPositions: [20, 30, 40, 50, 60, 70, 80],
              format: '{value} %'
              },
          }
        },
    }
  },
  components: {
    OCDChart
  },
  watch: {
    data: {
    handler(newVal, _) {
      if(Object.keys(newVal).length == 0) return
      const category = this.options[newVal.category].label.includes('Month') ? 'Month' : 'Weekday'
      this.plotConfiguration = {
        ...this.plotConfiguration,
        title: `${newVal.symbol || 'S&P 500'} Avg Return By ${category}`,
        subtitle: `${newVal.start_date} - ${newVal.end_date}`,
        xAxisTitle: `${category}`,
        start_date: newVal.start_date,
        end_date: newVal.end_date,
        category,
        option: newVal.category,
        symbol: newVal.symbol
      }
    },
    deep: true,
    immediate: true,
    },
  },
  mounted() {
    this.dropdownList = JSON.parse(localStorage.getItem('symbolList'))
    console.log('this.dropdownList', this.dropdownList)
  },
  methods: {
    handleDisabledStartDate(time) {
      const end_date = this.data.end_date
      return time.getFullYear() > end_date || time.getFullYear() < 1800;
    },
    handleDisabledEndDate(time) {
      return time.getFullYear() > new Date().getFullYear() || time.getFullYear() < 1800;
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
      this.data.symbol = item.url
    },
    changeCategory(value) {
      console.log(value)
    }
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
.seasonality-form-container .show-table {
  margin: unset;
  border-top: 2px solid #dbdbdb;
}
</style>