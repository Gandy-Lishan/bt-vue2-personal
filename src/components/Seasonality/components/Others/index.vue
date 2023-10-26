<template>
  <div>
    <el-form
		ref="othersForm"
		class="others-form-container"
		:model="data"
		label-position="top"
		size="mini"
    :rules="rules"
	>
    <div class="others-container-top">
      
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
      >
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
          label="2.Category"
        >
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
    <div class="others-container-bottom">
      <OCDChart></OCDChart>
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
        category: 0
      },
      dropdownList: [],
        options: [
          {label: 'Return by Day of Week', value: 0},
          {label: 'Return by Month', value: 1},
          {label: 'Performance by Day of Month', value: 2},
          {label: 'Performance by Day of Year', value: 3}
        ]
    }
  },
  components: {
    OCDChart
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
    changeCategory(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="less" scoped>
.others-form-container{
  display: grid;
  .others-container-top{
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
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
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
.select-container {
  display: flex;
  align-items: center; /* 垂直居中 */
}
.startAndEndBox {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between;
  width: 100%;
  span{
    margin: 0 5px;
  }
}
</style>