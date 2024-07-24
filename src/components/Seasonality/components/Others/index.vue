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
                  >Choose a stock/index/ETF as symbol.(default:SPX)</span>
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
              >Select the start and end dates for the selected symbol data. <br/>
              For instance, the start date is 2020, and the end date is 2022. <br/>
              The selected symbol data will cover the period from January 1, 2020, to December 31, 2022.</span>
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
import {createStateFilter} from '@/utils/globalFunc'
import { mapGetters } from "vuex"

export default {
  name: 'Others',
  data() {
    return {
      data: {
        symbol: process.env.VUE_APP_DEFAULT_SYMBOL,
        category: 0,
        start_date: (new Date().getFullYear() - 20).toString(),
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
        symbol: process.env.VUE_APP_DEFAULT_SYMBOL,
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
              tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
              format: '{value} %'
              },
          }
        },
    }
  },
  components: {
    OCDChart
  },
  computed: {
    ...mapGetters({
      symbolList: 'getRefactoredSymbolList'
    })
  },
  watch: {
    data: {
    handler(newVal, _) {
      if(Object.keys(newVal).length == 0) return
      const category = this.options[newVal.category].label.includes('Month') ? 'Month' : 'Weekday'
      this.plotConfiguration = {
        ...this.plotConfiguration,
        title: `${newVal.symbol || ''} Avg Return By ${category}`,
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
    this.dropdownList = this.symbolList
    console.log('this.dropdownList', this.dropdownList)
  },
  methods: {
    handleDisabledStartDate(time) {
      const end_date = this.data.end_date
      return time.getFullYear() > end_date || time.getFullYear() < 1800;
    },
    handleDisabledEndDate(time) {
      return time.getFullYear() > new Date().getFullYear() || time.getFullYear() < 1800 || time.getFullYear() < this.data.start_date;;
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
      this.data.symbol = item.url
      this.symbol = item.url
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
.show-table{
  width: 100%;
}
</style>