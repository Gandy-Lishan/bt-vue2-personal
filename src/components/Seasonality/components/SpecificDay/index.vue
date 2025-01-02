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
                  >Choose a stock/index/ETF as symbol.(default:SPX)</span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
          </template>
        <el-autocomplete
            ref="autocomplete"
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
            <span slot="content">
              Select the start and end dates for the selected symbol data. <br/>
              For instance, the start date is 2020, and the end date is 2022. <br/>
              The selected symbol data will cover the period from January 1, 2020, to December 31, 2022.
            </span>
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </label>
      </template>
        <div class="select-container">
        <!-- <el-select v-model="data.period" @change="handlePeriodChange">
          <el-option
            v-for="item in periodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select> -->
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
          :picker-options="startPickerOptions"
          placeholder="Start Date"
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
          label="3.Specific Days"
          prop="holidays"
          class="holidays-box"
        >
      <template slot="label">
        <label>
          3.Specific Days
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >Choose specific days(Day 0 represents the selected day, when it is a trading day). <br/>To define a custom date please scroll down to choose "Custom Date"</span>
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </label>
      </template>
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
            v-for="(tag) in dynamicTags"
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
          <el-button class="button-new-tag" size="mini" @click="showInput">+ Modify Customize Time</el-button>
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
import { format } from 'date-fns';
import {createStateFilter} from '@/utils/globalFunc'
import { mapGetters } from "vuex"

export default {
  name: 'SpecificDay',
  data() {
    return {
      data: {
        symbol: process.env.VUE_APP_DEFAULT_SYMBOL,
        // period: 20,
        dateRange: [],
        holidays: 0,
        start_date: (new Date().getFullYear() - 20).toString(),
        end_date:  new Date().getFullYear().toString(),
        customizeDate: null,
        shift: [5]
      },
      dropdownList: [],
      options: [
        { label: "New Year's Day", month: 1, day: 1, value: 0 },
        { label: 'Independence Day', month: 7, day: 4, value: 1 },
        { label: 'MLK Jr. Day', month: 1, day: 15, value: 2 },
        { label: 'Labor Day', month: 9, day: 2, value: 3 },
        { label: "President's Day", month: 2, day: 19, value: 4 },
        { label: 'Thanksgiving Day', month: 11, day: 28, value: 5 },
        { label: 'Good Friday', month: 4, day: 5, value: 6 },
        { label: 'Christmas Day', month: 12, day: 25, value: 7 },
        { label: 'Memorial Day', month: 5, day: 27, value: 8 },
        { label: 'Custom Date', value: 9 },
        { label: 'FOMC Decision Day', month: 1, day: 31, value: 10 },
        { label: 'Monthly Option Expiration', month: 1, day: 19, value: 11 },
        { label: 'March Quad Option Expiration', month: 3, day: 15, value: 12 },
        { label: 'June Quad Option Expiration', month: 6, day: 21, value: 13 },
        { label: 'September Quad Option Expiration', month: 9, day: 20, value: 14 },
        { label: 'December Quad Option Expiration', month: 12, day: 20, value: 15 },
        { label: 'Election Day(US)', month: 11, day: 5, value: 16 },
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
      dynamicTags: ['5 days'],
      inputVisible: false,
      inputValue: '',
      previousCustomDateRef: null,
      symbol: process.env.VUE_APP_DEFAULT_SYMBOL,
      plotConfiguration: {
        title: 'Performance Surrounding Independence Day',
        subtitle: 'SPX, 1950-2011',
        xAxisTitle: 'Days Surrounding the Selected Day',
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
          tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          format: '{value} %'
          },
        }
      },

      // 自定义动态渲染下拉栏
      searchResults: [],
      currentPage: 1,
      pageSize: 20,
      hasMore: true, // 是否还有更多数据
  }
  },
  components: {
    SDChart,
    MonthDays
  },
  watch: {
    data: {
    handler(newVal, oldVal) {
      if(Object.keys(newVal).length == 0) return
      if(this.changeOptions()) return
      let holidays = this.options.find(ele => ele.value == newVal.holidays).label
      if(holidays == 'Custom Date') holidays = this.data.customizeDate
      this.plotConfiguration = {
        ...this.plotConfiguration,
        title: `Performance Surrounding ${holidays}`,
        subtitle: `${newVal.symbol || ''} ${newVal.start_date}-${newVal.end_date}`,
        start_date: newVal.start_date,
        end_date: newVal.end_date,
        symbol: newVal.symbol || '',
        holidays: this.options.find(ele => ele.value == newVal.holidays).label,
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
    this.data.start_date = (currentYear - 20) + ''
    this.data.customizeDate = `${month}-${day}`
    this.previousCustomDateRef = this.data.customizeDate

    // // 生成动态标签数组
    // const years = [1,2,3,4,5,10,15,20]
    // const periodOptions = [{label: `Current Year (${currentYear})`, value: 0}, ...years.map(item => ({label: `${currentYear - item} -> ${currentYear}`, value: item}))]

    // // 添加其他选项
    // periodOptions.push({ label: 'All History', value: currentYear - 2003 + 1 });
    // periodOptions.push({ label: 'Custom...', value: currentYear - 2003 + 2 });

    // // 输出生成的选项
    // this.periodOptions = periodOptions
    this.calculateHolidayDates()
  },
  mounted() {
    this.dropdownList = this.symbolList

    this.attachScrollListener()
  },
  beforeDestroy() {
    this.detachScrollListener(); // 在组件销毁前解绑滚动事件
  },
  computed: {
    monthDaysText() {
      return {
      }
    },
    // ...mapGetters({
    //   symbolList: 'getRefactoredSymbolList'
    // })
    symbolList() {
      const data = localStorage.getItem('refactoredConcatList');
      return data ? JSON.parse(data) : [];
    }
  },
  methods: {
    /** START 加载更多数据且保持滚动条位置 */
    // 绑定滚动事件
    attachScrollListener() {
      const refs = ['autocomplete']; // 要监听的下拉框的 ref 名称

      refs.forEach(refName => {
        const inputDropdown = this.$refs[refName]?.$refs.suggestions?.$el?.childNodes[0]?.childNodes[0]; // 获取下拉框的 DOM
        if (inputDropdown) {
          inputDropdown.addEventListener("scroll", (event) => this.handleDropdownScroll(event, refName));
        }
      });
    },
    // 解绑滚动事件
    detachScrollListener() {
      const refs = ['autocomplete']; // 要监听的下拉框的 ref 名称

      refs.forEach(refName => {
        const inputDropdown = this.$refs[refName]?.$refs.suggestions?.$el?.childNodes[0]?.childNodes[0]; // 获取下拉框的 DOM
        if (inputDropdown) {
          inputDropdown.removeEventListener("scroll", (event) => this.handleDropdownScroll(event, refName));
        }
      });
    },
    // 监听滚动事件，触发加载更多
    handleDropdownScroll(event, inputType) {
      var self = this;
      const dropdown = event.target;
      // 根据传入的 inputType 访问不同的 ref
      const inputRef = self.$refs[inputType];

      if (
        dropdown.scrollHeight - dropdown.scrollTop - 10 <
        dropdown.clientHeight
      ) {
        // 判断是否有更多数据
        if (!this.hasMore) return;

        // 记录滚动位置
        const currentScrollTop = dropdown.scrollTop;

        self.currentPage++;
        self.loadMore((results) => {
            inputRef.$data.suggestions = results;

            // 恢复滚动位置
            requestAnimationFrame(() => {
                dropdown.scrollTop = currentScrollTop;
            });
        });
      }
    },
    loadMore(cb) {
      // 根据页码从过滤后的结果中分页
      console.log('paginated results',this.currentPage, this.searchResults.length)
      const paginatedResults = this.searchResults.slice(0, this.currentPage * this.pageSize);
      if(this.currentPage * this.pageSize > this.searchResults.length) this.hasMore = false
      // 将分页后的数据传递给 closure
      cb(paginatedResults);
    },
    /** END 加载更多数据且保持滚动条位置 */
    
    calculateHolidayDates() {
      const year = new Date().getFullYear()
      const holidayDates = this.options.map((holiday) => {
        let date = null
        if(holiday.month && holiday.day) {date = new Date(year, holiday.month - 1, holiday.day); return { ...holiday, date: format(date, 'MM-dd') }}
        else {return {label: 'Custom Date', value: 9}}
      })
      // 先按照月份从小到大排序，再按照日期从小到大排序
      holidayDates.sort((a, b) => {
        if (a.month !== b.month) {
          return a.month - b.month;
        } else {
          return a.day - b.day;
        }})
      this.options = holidayDates
    },
    handleDisabledStartDate(time) {
      const end_date = this.data.end_date
      return time.getFullYear() > end_date || time.getFullYear() < 1800;
    },
    handleDisabledEndDate(time) {
      return time.getFullYear() > new Date().getFullYear() || time.getFullYear() < 1800  || time.getFullYear() < this.data.start_date;;
    },
    pickStartDate(start_date) {
      this.changeOptions()
    },
    pickEndDate(end_date) {
      this.changeOptions()
    },
    changeOptions() {
      const currentYear = new Date().getFullYear()
      if(this.data.start_date == currentYear && this.data.end_date == currentYear) {
        let dateObjects = this.options.map(ele => {
          if(ele.date) {
            const month = new Date().getMonth();
            const day = new Date().getDate();
            const [_month, _day] = ele.date.split('-').map(Number);
            const currentTime = new Date(currentYear, month, day)
            const time = new Date(currentYear, _month - 1, _day)
            if(time <= currentTime) {return ele}else{return {...ele, disabled: true}}
          }else {return ele}
        })
        this.options = dateObjects
        dateObjects = dateObjects.filter(ele => !ele.disabled)
        const allowedOptions = dateObjects.map(item => item.value)
        if(!allowedOptions.includes(this.data.holidays)) {
          const holiday = this.options.find(ele => ele.value == this.data.holidays).label
          const allowedHoliday = this.options[allowedOptions[0]].label
          this.popUpMsgBox(`Not ${holiday} yet this year, automatically switched to ${allowedHoliday}`)
          this.data.holidays = allowedOptions[0]
        }


      const compareDates = (today, selectDay) => {
        const year = new Date().getFullYear()
        const todayDate = new Date(`${year}-${today}`)
        const selectDate = new Date(`${year}-${selectDay}`)
        if(selectDate > todayDate && (this.data.start_date == year && this.data.end_date == year)) return false
        return true
      }
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const today = `${month}-${day}`;
      const selectDay = this.data.customizeDate
      const result = compareDates(today, selectDay);
      const holiday = this.options.find(ele => ele.value == this.data.holidays).label

      if(!result && holiday == 'Custom Date') {
        this.popUpMsgBox(`This year's date is not yet ${selectDay}. Please select another date`)
        this.data.start_date = this.plotConfiguration.start_date
        this.data.end_date = this.plotConfiguration.end_date
        return true
        }
      }else {
        this.options = this.options.map(ele => ({...ele, disabled: false}))
      }
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

      this.searchResults = results.sort((a, b) => b.priority - a.priority)
      this.currentPage = 1;
      this.hasMore = true;
      this.loadMore(cb)
    },
    handleSelect(item) {
      this.data.symbol = item.url
      this.symbol = item.url
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
      if(this.data.period == 21)  {
        this.data.start_date = '_'; 
        this.data.end_date = currentYear;
      }
      if(this.data.period == 0) {

        let dateObjects = this.options.map(ele => {
          if(ele.date) {
            const month = new Date().getMonth();
            const day = new Date().getDate();
            const [_month, _day] = ele.date.split('-').map(Number);
            const currentTime = new Date(currentYear, month, day)
            const time = new Date(currentYear, _month - 1, _day)
            if(time <= currentTime) {return ele}else{return {...ele, disabled: true}}
          }else {return ele}
        })

        this.options = dateObjects
        dateObjects = dateObjects.filter(ele => !ele.disabled)
        const allowedOptions = dateObjects.map(item => item.value)
        if(!allowedOptions.includes(this.data.holidays)) {
          const holiday = this.options[this.data.holidays].label
          const allowedHoliday = this.options[allowedOptions[0]].label
          this.popUpMsgBox(`Not ${holiday} yet this year, automatically switched to ${allowedHoliday}`)
          this.data.holidays = allowedOptions[0]
        }

      }else {
        this.options = this.options.map(ele => ({...ele, disabled: false}))
      }
    },
    pickCustomizeDate(value) {
      console.log(value)
    },
    getValue(value) {
      const _this = this
      const compareDates = (today, selectDay) => {
        const year = new Date().getFullYear()
        const todayDate = new Date(`${year}-${today}`)
        const selectDate = new Date(`${year}-${selectDay}`)
        if(selectDate > todayDate && (this.data.start_date == year && this.data.end_date == year)) return false
        return true
      }
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const today = `${month}-${day}`;

      const result = compareDates(today, value);
      if(result) {
          _this.data.customizeDate = value
          _this.previousCustomDateRef = value
        }else{
          _this.data.customizeDate = _this.previousCustomDateRef
          this.popUpMsgBox('The selected date should be less than or equal to today')
        }
      console.log('---------', _this.data.customizeDate)
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
        // this.dynamicTags.push(day);
        this.dynamicTags = [day];
        this.data.shift = this.getShift(this.dynamicTags)
      }else if(inputValue && !regex.test(inputValue)){
        this.popUpMsgBox('Only positive numbers are allowed')
      }
      this.inputVisible = false;
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
  // .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--year {
  //   width: 150px; // 不一样
  // }
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
    width: 100px;
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
/deep/ .el-form-item__label {
  font-weight: 600;
  color: #333;
}
/deep/ .el-button, /deep/ .el-input__inner, /deep/ .el-input-group__append, /deep/ .el-tag {
  font-weight: 600;
}
@import "../../index.less";
</style>