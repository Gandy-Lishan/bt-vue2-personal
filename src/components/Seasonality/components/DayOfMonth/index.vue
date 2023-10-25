<template>
  <div>
    <el-form
		ref="DOMForm"
		class="DOM-form-container"
		:model="data"
		label-position="top"
		size="mini"
    :rules="rules"
	>
    <div class="DOM-container-top">
      <el-form-item
          prop="symbol"
        >
        <template slot="label">
            <label>
              1.Symbol
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  ><br
                /></span>
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
        prop="dateRange"
      >
        <div class="block">
        <el-date-picker
          @change="pickDate"
          value-format="yyyy-MM-dd"
          v-model="data.dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="to"
          start-placeholder="Start Date"
          end-placeholder="End Date">
        </el-date-picker>
      </div>
      </el-form-item>
      <el-form-item
          label="3.Month Selection"
          prop="monthSelection"
          placeholder="Please input the name of your custom indicator"
        >
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
    <div class="DOM-container-bottom">
      <SNChart></SNChart>
    </div>
    </el-form>
  </div>
</template>

<script>
import SNChart from "../SNChart/index.vue"
export default {
  name: 'DayOfMonth',
  data() {
    return {
      data: {
        symbol: 'SPY',
        dateRange: [],
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
        ]
    }
  },
  components: {
    SNChart
  },
  mounted() {
    this.dropdownList = JSON.parse(localStorage.getItem('symbolList'))
    console.log('this.dropdownList', this.dropdownList)
  },
  methods: {
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
    pickDate(date) {
      console.log(date)
    },
    changeMonth(month) {
      console.log(month)
    }
  }
}
</script>

<style lang="less" scoped>
.DOM-form-container{
  display: grid;
  .DOM-container-top{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 10px;
  }
  /deep/ input.el-input__inner{
    margin: 0;
  }
  /deep/ .el-range-editor--mini.el-input__inner{
    margin: 0;
    width: 100%;
  }
  /deep/ .el-autocomplete{
    width: 100%;
  }
  /deep/ .el-select{
    width: 100%;
  }
}
.custom-option {
	display: flex;
	align-items: center; /* 垂直居中对齐 */
	justify-content: space-between;
}
.symbol-url{
  font-size: 12px;
  margin-right: 10px;
  text-align: center;
	color: #999999;
}

.symbol-label {
	font-weight: 500;
}
</style>