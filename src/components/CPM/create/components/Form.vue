<template>
  <div class="form-content-container">
	<el-form
		ref="Form"
		:model="data"
		label-position="top"
		size="small"
    :rules="rules"
	>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-form-item
				label="1.Name"
        prop="name"
			>
				<el-input v-model="data.name" placeholder="Enter indicator name"></el-input>
			</el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item prop="symbol">
        <template slot="label">
            <label>
              2.Symbol
              <el-tooltip effect="dark" placement="top">
                <span slot="content"
                  >Choose a stock/index/ETF as symbol.(default:SPY)</span>
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>
            </label>
          </template>
          <el-autocomplete
              class="inline-input"
              v-model="data.symbol"
              :fetch-suggestions="querySearch"
              placeholder="Select stock from the dropdown menu"
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
    </el-col>
    <el-col :span="6">
      <el-form-item
				label="3.Start Date"
        prop="start_date"
			>
        <el-date-picker
          v-model="data.start_date"
          type="date"
          placeholder="- Select Start Date -"
          value-format="yyyy-MM-dd"
          :picker-options="startPickerOptions"
        >
        </el-date-picker>
			</el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item
				label="4.End Date"
        prop="end_date"
			>
        <el-date-picker
          v-model="data.end_date"
          type="date"
          placeholder="- Select End Date -"
          value-format="yyyy-MM-dd"
          :picker-options="endPickerOptions"
        >
        </el-date-picker>
			</el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-form-item prop="timeframe" label="5.Timeframe">
        <el-select
            v-model="data.timeframe"
            placeholder="— Select Timeframe —"
            @change="changeTimeframe"
          >
            <el-option
              v-for="item in frequencyOptions"
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
				label="6.Correlation Percentage"
        prop="corr_per"
			>
        <template slot="label">
          <label>
            6.Correlation Percentage
            <el-tooltip effect="dark" placement="top">
              <span slot="content">
                Correlation Percentage
              </span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
				<el-input v-model="data.corr_per" placeholder="Enter correlation percentage"></el-input>
			</el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item
				label="7.Time In Market"
        prop="tim"
			>
        <template slot="label">
          <label>
            7.Time In Market
            <el-tooltip effect="dark" placement="top">
              <span slot="content">
                Input a value of bars to stay in market after entry.<br />Exit
                  position when the specified Time In Market is reached.
                  (default: 20)<br
                />
              </span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
        <el-input
          v-model="data.tim"
          placeholder="Enter time in market"
        ><template v-slot:append>
          (bars)
          </template></el-input>
			</el-form-item>
    </el-col>
    <el-col :span="6">
    <el-form-item prop="backtestHistory" label="8.Lookback Period(List)">
        <template slot="label">
          <label>
            8.Lookback Period(List)
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Specify the start and end date of the backtest.<br />Choose
                'All History' to include all data since the inception of the
                backtesting stock/index.<br
              /></span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
        <div class="selectBox historySelectBox">
          <el-select
            placeholder="- Select Lookback Period -"
            v-model="data.lookback_period"
          >
            <el-option
              v-for="item in historyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="6">
    </el-col>
    <el-col :span="6">
      <el-form-item
				label="9.Custom Duration"
        prop="year"
        v-if="data.lookback_period == 22"
			>
        <el-input
          v-model="data.year"
          placeholder="Enter custom years"
        ><template v-slot:append>
          (years)
          </template></el-input>
			</el-form-item>
    </el-col>
    <el-col :span="6">
    <div class="excludeBox">
        <el-checkbox v-model="isExcludeOO"
          >Exclude Overlapping Observations
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >Select this box if you want to exclude dates that are
              clustered together.<br />
              By selecting this option, the test will only allow one
              trade at a time. <br />
              For example, if you chose '10 days' in the Observation
              Period,
              <br />
              then once the Indicator meets the Indicator Level you
              specify,
              <br />
              the test will not allow another trade for the next 10
              days.<br />
            </span>
            <i class="iconfont icon-wenhao"></i> </el-tooltip
        ></el-checkbox>
      </div>
    </el-col>
    <el-col :span="6"></el-col>
  </el-row>
    <el-form-item>
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :span="6"></el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6">
          <div class="form-btn">
            <!-- <el-button type="primary" class="delete-btn">Preview the found KLine</el-button> -->
            <el-button type="primary" @click="submitForm">Save and Run Backtest</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
	</el-form>
  <LoadingOverlay
			:isLoading="isCreateLoading"
			:showProgress="false"
			:percentage="0"
			:progressText="progressText"
		>
		</LoadingOverlay>
  </div>
</template>
 <script>
 import { CIQ } from '@/components/common/chart/st-development/js/components'
import { saveCPM, getMyIndicatorData, delMyIndicator, editCPM, searchIndicator } from '@/service/service'
import { createPositiveIntegerRule, createVerifyValueInListRule, validateMarginRule } from "@/utils/formValidate"
import { LoadingOverlay } from "@/components/common"
import { timestampToTime } from '@/utils'

export default {
  name: 'Form',
  components: {
    LoadingOverlay
  },
  data() {
    return {
      data: {
        name: '',
        symbol: '',
        timeframe: 'Daily',
        start_date: '',
        end_date: '',
        lookback_period: 20,
        corr_per: '',
        tim: 21,
        year: '',
        exclude_overlap: false
      },
      dropdownList: [],
      frequencyOptions: [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' }
      ],
      historyOptions: [
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
          value: 6,
          label: '6 Year'
        },
        {
          value: 7,
          label: '7 Year'
        },
        {
          value: 6,
          label: '6 Year'
        },
        {
          value: 9,
          label: '9 Year'
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
      rowUrl: null,
      progressText: 'Loading...',
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      isExcludeOO: false,
      rules: {
        name: [
          { required: true, message: 'Enter a name', trigger: 'blur' }
        ],
        symbol: [
          { validator: createVerifyValueInListRule(JSON.parse(localStorage.getItem('symbolList')), 'Select a stock', 'Choose a stock from the dropdown'), trigger: 'blur' },
          { validator: createVerifyValueInListRule(JSON.parse(localStorage.getItem('symbolList')), 'Select a stock', 'Choose a stock from the dropdown'), trigger: 'change' },
        ],
        tim: [
          { validator: createPositiveIntegerRule('time in market'), trigger: 'blur' }
        ],
        start_date: [
        { required: true, message: 'Select start date', trigger: 'blur' },
        { required: true, message: 'Select start date', trigger: 'change' }
        ],
        end_date: [
        { required: true, message: 'Select end date', trigger: 'blur' },
        { required: true, message: 'Select end date', trigger: 'change' }
        ],
        year: [
          { validator: createPositiveIntegerRule('custom years'), trigger: 'blur' }
        ],
        corr_per: [
          { validator:  createPositiveIntegerRule('correlation percentage', 100), trigger: 'blur'}
        ]
      },
    }
  },
  computed: {
    isCreateLoading() {
      // 从 Vuex store 中获取全局 loading 状态
      return this.$store.state.states.isCreateLoading
    }
  },
  async mounted() {
    this.setBacktestHistory(20)
  },
  methods: {
    setBacktestHistory(val) {
      this.data.end_date = timestampToTime(new Date())
      const str = this.data.end_date.split('-')
      str[0] = Number(str[0]) - Number(val) + ''
      this.data.start_date = str.join('-')
    },
    handleDisabledStartDate(time) {
      const endDay = timestampToTime(new Date(this.data.end_date))
      return timestampToTime(time) > endDay
    },
    handleDisabledEndDate(time) {
      const today = timestampToTime(new Date())
      const startDay = timestampToTime(new Date(this.data.start_date))
      return (timestampToTime(time) > today) || (timestampToTime(time) <= startDay)
    },
    querySearch(queryString, cb) {
      if(!this.dropdownList || this.dropdownList.length == 0) {
        this.dropdownList = JSON.parse(localStorage.getItem('symbolList'))
      }
      var results = queryString
        ? this.dropdownList.filter(this.createFilter(queryString))
        : this.dropdownList
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
    async submitForm() {
     const saveRes = await this.saveCPM()
     console.log('saveRes', saveRes)
     if(!saveRes) return
     const code = saveRes.data.code
      if(code == 404) {this.popUpMsgBox('Permission denied')}
      if(code == 406) {
        const name =  saveRes.data.data.name
        this.$notify({
          title: `Duplicate Indicator: ${name} Exists`,
          message: `The same combination indicator <strong>${name}</strong> already exists. Please adjust your input to avoid duplicates.`,
          type: 'warning',
          dangerouslyUseHTMLString: true,
          duration: 6000
        });
        // this.popUpMsgBox(`The same combination already exists. Please review and adjust your input. The existing combination is named: ${name}.`)
      }
      if(saveRes.status == 201) {this.$router.push('/cpm/results')}
      // this.$store.commit('SET_CREACT_LOADING', false)
    },
    async checkDuplicateNames(name) {
        const nameLookupRes = await searchIndicator(name)
        const count = nameLookupRes.data.count
        const nameList = nameLookupRes.data.results
        // 有重名
        if(count != 0) {
          const duplicateItem = nameList.filter(item => item.name == name)
          if(duplicateItem) return true
        }
        // 不重名
        return false

    },
    async saveCPM() {
      const validForm = this.validForm()
      const rowUrl = this.rowUrl
      const name = this.data.name
      if(!validForm) return
      // if(!rowUrl) {
      //   // 不是编辑是新建
      //   const nameChecked = this.checkDuplicateNames(name)
      //   if(nameChecked) {this.popUpMsgBox(`Custom indicator name already in use. Please choose another`); return}
      // }
      const exclude_overlap = this.isExcludeOO ? 1 : 0
      const saveData = {
        ...this.data,
        exclude_overlap
      }
      // 如果是自定义时间，删除 year 字段
      if(this.lookback_period != 22) delete saveData.year

      if(rowUrl) return await editCPM(saveData, rowUrl)
      return await saveCPM(saveData);
    },
    validForm() {
      let formValid = null
      this.$refs['Form'].validate((valid) => {
        if(valid) {
          formValid = true
        }else {
          formValid = false
          this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.')
          return false
        }
      })
      console.log('表单校验是否成功', formValid)
      if(!formValid) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.')
        return false
      }
      return true
    },
    displayData(data) {
      this.rowUrl = data.url
      const target = this.data
      for (const key in target) {
        if(key == 'exclude_overlap') {
          target[key] = data[key] == 1 ? true : false
        }else {
          target[key] = data[key]
        }
      }
    }
  }
}
</script>
 <style lang="less" scoped>
.el-autocomplete {
  width: 100%;
}
/deep/.el-input__inner {
  margin-left: 0;
}
/* 自定义样式 */
.custom-option {
	display: flex;
	align-items: center; /* 垂直居中对齐 */
	justify-content: space-between;
}
.updated-label{
  font-size: 12px;
  font-weight: 600;
  margin-right: 10px;
  text-align: center;
}
.el-select.el-select--mini {
  width: 100%;
}
.el-select.el-select--small {
  width: 100%;
}
.error-message {
  position: absolute;
  font-size: 12px;
  line-height: 1;
  color: #F56C6C;
}
.el-button--primary {
  width: 200px;
}
.delete-btn {
	background-color: #f59e0b;
  border: unset;
}
.delete-btn:hover {
  background-color: rgb(251, 192, 92);
}
.category-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span{
    font-size: 12px;
    margin-top: 5px;
    color: #6f7174;
  }
}
/deep/ .el-form-item__label {
  width: auto
}
/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.form-content-container {
  padding: 20px 20px 0px 20px;
}
.form-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
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
/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa5c;
    color: #606266;
}
/deep/ .el-checkbox__label {
  line-height: 32px;
}
</style>