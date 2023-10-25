<template>
  <div>
    <el-form
		ref="specificForm"
		class="specific-form-container"
		:model="data"
		label-position="top"
		size="mini"
    :rules="rules"
	>
    <div class="specific-container-top">
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
          <el-button class="button-new-tag" size="mini" @click="showInput">+ Add Customize Time</el-button>
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
          <el-button class="button-new-tag" size="mini" @click="showInput" v-if="data.holidays != 9">+ Add Customize Time</el-button>
          </div>
        </div>
      </el-form-item>
    </div>
    <div class="specific-container-bottom">
      <SNChart></SNChart>
    </div>
    </el-form>
  </div>
</template>

<script>
import SNChart from "../SNChart/index.vue"
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
        start_date: null,
        end_date: null,
        customizeDate: null
      },
      dropdownList: [],
      options: [
        {label: 'New Year\'s Day', value: 0},
        {label: 'Independence Day', value: 1},
        {label: 'MLK Jr. Day', value: 2},
        {label: 'Labor Day', value: 3},
        {label: 'President\'s Day', value: 4},
        {label: 'Thanksgiving Day', value: 5},
        {label: 'Good Friday', value: 6},
        {label: 'Christmas Day', value: 7},
        {label: 'Memorial Day', value: 8},
        {label: 'Custom Time', value: 9},
      ],
      periodOptions: [
        {
          value: 1,
          label: '1 Year'
        },
        {
          value: 2,
          label: '2 Year'
        },
        {
          value: 3,
          label: '3 Year'
        },
        {
          value: 4,
          label: '4 Year'
        },
        {
          value: 5,
          label: '5 Year'
        },
        {
          value: 10,
          label: '10 Year'
        },
        {
          value: 15,
          label: '15 Year'
        },
        {
          value: 20,
          label: '20 Year'
        },
        {
          value: 21,
          label: 'All History'
        },
        {
          value: 22,
          label: 'Custom...'
        }
      ],
      datePickerOptions: {
        disabledDate(time) {
          return time.getFullYear() < 2013 || time.getFullYear() > 1800;
        },
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
      inputVisible: false,
      inputValue: '' 
  }
  },
  components: {
    SNChart,
    MonthDays
  },
  created() {
    const currentYear = new Date().getFullYear();
    this.data.end_date = (currentYear) + ''
    this.data.start_date = (currentYear - this.data.period) + ''
  },
  mounted() {
    this.dropdownList = JSON.parse(localStorage.getItem('symbolList'))
    console.log('this.dropdownList', this.dropdownList)
  },
  computed: {
    monthDaysText() {
      return {
      }
    }
  },
  methods: {
    pickStartDate() {
    // 更新结束日期选择器的可选范围
    this.$refs.endDatePicker.pickerOptions = {
      disabledDate(time) {
        return time.getFullYear() < 2013 || time.getFullYear() > 1800 || time > new Date();
      },
    };
  },
  pickEndDate() {
    // 更新开始日期选择器的可选范围
    this.$refs.startDatePicker.pickerOptions = {
      disabledDate(time) {
        return time.getFullYear() < 2013 || time.getFullYear() > 1800 || time > new Date();
      },
    };
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
    },
    handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue + ' day');
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>

<style lang="less" scoped>
.specific-form-container{
  display: grid;
  .specific-container-top{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 10px;
  }
  /deep/ input.el-input__inner{
    margin: 0;
  }
  .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--year {
    width: 150px;
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
.popover {
  display: inline-block;
}
.customize-box{
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #DCDFE6;
}
.dateTag{
  display: flex;
  margin-top: 10px;
  align-items: center;
  .el-tag--small{
    text-align: center;
    width: 67px;
    height: 28px;
    line-height: 28px;
    margin-right: 10px;
    background: #5b9bd1;
    border: 1px solid #5b9bd1;
  }
}
</style>