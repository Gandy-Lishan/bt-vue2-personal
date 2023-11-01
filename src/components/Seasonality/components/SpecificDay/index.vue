<template>
  <div>
    <el-form
		ref="specificForm"
		class="specific-form-container seasonality-form-container"
		:model="data"
		label-position="top"
		size="mini"
    :rules="rules"
	>
    <div class="specific-container-top top">
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
        label="2.Period"
      >
        <div class="select-container">
        <el-select v-model="data.period" @change="handlePeriodChange">
          <el-option
            v-for="item in periodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="startAndEndBox">
          <el-date-picker
          ref="startDatePicker"
          :disabled="data.period != 22"
          @change="pickStartDate"
          value-format="yyyy"
          v-model="data.start_date"
          type="year"
          align="right"
          unlink-panels="true"
          range-separator="to"
          :picker-options="startPickerOptions"
          placeholder="Start Date"
          >
        </el-date-picker>
        <span>to</span>
        <el-date-picker
        ref="endDatePicker"
          :disabled="data.period != 22"
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
          label="3.Specific Days"
          prop="holidays"
          placeholder="Please input the name of your custom indicator"
          class="holidays-box"
        >
        <div class="holiday-box">
          <el-select v-model="data.holidays" placeholder="Please select month" @change="changeMonth">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            >
          </el-option>
        </el-select>
        <div class="customize-box" v-if="data.holidays == 9">
         <div class="dateSelect">
          <span>Date</span>
          <MonthDays v-model="data.customizeDate" :monthDaysOptions="monthDaysOptions" @getValue="getValue" :customText="englishText"></MonthDays>
         </div>
          <!-- <el-button class="button-new-tag" size="mini" @click="showInput">+ Add Customize Time</el-button> -->
        </div>
        <div class="dateTag">
            <el-tag
            :key="tag"
            size="small"
            v-for="(tag,index) in dynamicTags"
            :closable="index !== 0"
            :disable-transitions="false"
            @close="handleClose(tag)"
            effect="dark">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button class="button-new-tag" size="mini" @click="showInput">+ Add Customize Time</el-button>
          </div>
        </div>
      </el-form-item>
    </div>
    <div class="specific-container-bottom bottom">
      <SDChart :plotConfiguration="plotConfiguration"></SDChart>
    </div>
    </el-form>
  </div>
</template>

<script>
import SDChart from "../SNChart/SDChart.vue";
import MonthDays from "month-days-element";
export default {
  name: 'SpecificDay',
  data() {
    return {
      data: {
        symbol: 'SPY',
        period: 5,
        dateRange: [],
        holidays: 0,
        start_date: (new Date().getFullYear() - 5).toString(),
        end_date:  new Date().getFullYear().toString(),
        customizeDate: null,
        shift: [1]
      },
      dropdownList: [],
      options: [
        {label: "New Year's Day", value: 0},
        {label: 'Independence Day', value: 1},
        {label: 'MLK Jr. Day', value: 2},
        {label: 'Labor Day', value: 3},
        {label: "President's Day", value: 4},
        {label: 'Thanksgiving Day', value: 5},
        {label: 'Good Friday', value: 6},
        {label: 'Christmas Day', value: 7},
        {label: 'Memorial Day', value: 8},
        {label: 'Custom Time', value: 9},
      ],
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      monthDaysOptions: {
				placeholder: 'Please select', // 占位内容，默认为选择日期
				size: 'mini', // 输入框尺寸 large, small, mini 默认large
				clearable: true, // 是否显示清除按钮，默认true
				disabled: false, // 禁用，默认false
				readonly: false, // 只读，默认false
				popperClass: '' // 弹出框类名
			},
      englishText: {
        months: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      },
      dynamicTags: ['1 day'],
      inputVisible: true,
      inputValue: '',
      plotConfiguration: {
        title: 'Performance Surrounding Independence Day',
        subtitle: 'S&P 500, 1950-2011',
        xAxisTitle: 'Days Surrounding Holiday',
        customScale: true, // 如果需要自定义刻度
        formatter: true, // 如果需要自定义数据提示
        scaleSettings: {
          positiveColor: '#00B050',
          negativeColor: '#C0504D',
          yAxis_1: {
          tickPositions: [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3],
          max: 0.3,
          min: -0.3,
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
    SDChart,
    MonthDays
  },
  watch: {
    data: {
    handler(newVal, _) {
      if(Object.keys(newVal).length == 0) return
      this.plotConfiguration = {
        ...this.plotConfiguration,
        subtitle: `${newVal.symbol || 'S&P 500'} ${newVal.start_date}-${newVal.end_date}`,
        start_date: newVal.start_date,
        end_date: newVal.end_date,
        symbol: newVal.symbol || 'S&P 500',
        holidays: this.options[newVal.holidays].label,
        customizeDate: newVal.customizeDate,
        shift: newVal.shift
      }
    },
    deep: true,
    immediate: true,
    },
  },
  created() {
    const currentYear = new Date().getFullYear();
    const month = new Date().getMonth() + 1; // 获取当前月份（0 到 11，需要加 1）
    const day = new Date().getDate(); // 获取当前日期（1 到 31）
    this.data.end_date = (currentYear) + ''
    this.data.start_date = (currentYear - this.data.period) + ''
    this.data.customizeDate = `${month}-${day}`

    // 创建一个函数来生成标签
    function generateLabel(year, range) {
        const startYear = year - range + 1;
        return `${startYear} -> ${year}`;
    }

    // 生成动态标签数组
    const years = [1,2,3,4,5,10,15,20]
    const periodOptions = [{label: `Current Year (${currentYear})`, value: 0}, ...years.map(item => ({label: `${currentYear - item} -> ${currentYear}`, value: item}))]

    // 添加其他选项
    periodOptions.push({ label: 'All History', value: currentYear - 2003 + 1 });
    periodOptions.push({ label: 'Custom...', value: currentYear - 2003 + 2 });

    // 输出生成的选项
    this.periodOptions = periodOptions

  },
  mounted() {
    this.dropdownList = JSON.parse(localStorage.getItem('symbolList'))
  },
  computed: {
    monthDaysText() {
      return {
      }
    }
  },
  methods: {
    handleDisabledStartDate(time) {
      const end_date = this.data.end_date
      return time.getFullYear() > end_date || time.getFullYear() < 1800;
    },
    handleDisabledEndDate(time) {
      return time.getFullYear() > new Date().getFullYear() || time.getFullYear() < 1800;
    },
    pickStartDate() {
    },
    pickEndDate() {
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
    pickDate(date) {
      console.log(date)
    },
    changeMonth(month) {
      console.log(month)
    },
    handlePeriodChange(period) {
      const currentYear = new Date().getFullYear()
      this.data.end_date = currentYear + ''
      if(this.data.period != 22 && this.data.period != 21)  this.data.start_date = (currentYear - period) + ''
      if(this.data.period == 22)  this.data.start_date = (currentYear - 5) + ''
      if(this.data.period == 21)  this.data.start_date = '-'
    },
    pickStartDate(value) {
      console.log(value)
    },
    pickEndDate(value) {
      console.log(value)
    },
    pickCustomizeDate(value) {
      console.log(value)
    },
    getValue(value) {
      console.log(value)
      this.data.customizeDate = value
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.data.shift = this.getShift(this.dynamicTags)
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    getShift(dynamicTags) {
      const result = dynamicTags.map((dateStr) => {
      // 使用正则表达式匹配数字和时间单位
      const match = dateStr.match(/(-?\d+) (\w+)/);
      if (match) {
        const number = parseInt(match[1], 10); // 解析数字部分
        return number
      }
      });
      // 复制数组中的数字到新数组
      const symmetricArray = [...result]

      // 添加每个数字的相反数到新数组
      // result.forEach((number) => {
      //   symmetricArray.push(-number);
      // });

      // 对新数组进行排序
      symmetricArray.sort((a, b) => a - b);
      return symmetricArray
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      const regex = /^[1-9]\d*$/
      if (inputValue && regex.test(inputValue)) {
        const day = `${inputValue} ${inputValue > 1 ? 'days': 'day'}`
        this.dynamicTags.push(day);
      }
      this.inputVisible = false;
      this.inputValue = '';
      this.data.shift = this.getShift(this.dynamicTags)
  }
  }
}
</script>

<style lang="less" scoped>
.specific-form-container{
  grid-row-gap: 20px;
  min-height: 610px;
  display: grid;
  padding: 20px;
  .specific-container-top{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 10px;
  }
  /deep/ input.el-input__inner{
    margin: 0;
  }
  .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--year {
    width: 150px; // 不一样
  }
  /deep/ .el-autocomplete{
    width: 100%;
  }
  /deep/ .el-select{
    width: 100%;
  }
  .input-new-tag.el-input.el-input--mini {
    width: 67px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .input-new-tag.el-input.el-input--mini /deep/ input.el-input__inner {
    width: 67px;
    display: inline-block;
  }
  .customize-box span{
    font-weight: 500;
    color: #606266;
    font-size: 14px;
    margin-right: 10px;
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
  margin-left: 5px; /* 可根据需要调整间距 */
  span{
    margin: 0 5px;
  }
}
.customize-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 5px;
  border-bottom: 1px dashed #8e9fc5;
  border-right: 1px dashed #5b9bd1;
  border-left: 1px dashed #5b9bd1;
}
.dateTag{
  display: flex;
  padding: 20px 5px 10px 5px;
  align-items: center;
  border: 1px dashed #5b9bd1;
  border-radius: 0 0 4px 4px;
  border-top: unset;
  flex-wrap: wrap;
  .el-tag--small{
    text-align: center;
    width: 67px;
    height: 28px;
    line-height: 28px;
    margin-right: 10px;
    background: #5b9bd1;
    border: 1px solid #5b9bd1;
    margin-bottom: 10px;
  }
}
.specific-container-bottom{
  margin: 0 auto;
}
.button-new-tag {
  margin-bottom: 10px;
}
.dateSelect{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .popover{
    width: 100%;
  }
}
@import "../../index.less";
</style>