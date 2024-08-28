<template>
  <div class="form-content-container">
    <el-form
		ref="BasicForm"
		:model="data"
		label-position="top"
		size="small"
    :rules="rules"
	>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-form-item
        label="1. Correlation Pattern Match Name"
        prop="name"
      >
        <el-input v-model="data.name" placeholder="Enter cpm name"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item prop="symbol">
        <template slot="label">
          <label>
            2. Symbol
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Choose a stock/index/ETF as symbol.(default:SPX)</span>
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
      <el-form-item prop="ma_condition" label="3. Condition">
      <template slot="label">
        <label>
          3. Condition
          <el-tooltip effect="dark" placement="top">
            <span slot="content">
              It represents the relationship between the closing price of the End Date of the selected pattern<br/>
              and the Moving Average of the specified Period.<br/>
              For example, if you select Condition as Above and Period = 200,<br/>
              it means that the End Date of all selected patterns must close at a price greater than<br/>
              the Symbol Close 200-day Moving Average.
            </span>
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </label>
      </template>
        <el-select
            v-model="data.ma_condition"
            placeholder="— Select Condition —"
          >
            <el-option
              v-for="item in conditionOptions"
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
        label="4. Period"
        prop="ma"
      >
      <template slot="label">
        <label>
          4. Period
          <el-tooltip effect="dark" placement="top">
            <span slot="content">
              It represents the period of the Symbol Close's Moving Average, which defaults to 200.
            </span>
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </label>
      </template>
        <el-input v-model="data.ma">
        </el-input>
      </el-form-item>
    </el-col>
  </el-row>
  </el-form>
  <el-form
		ref="PreviewForm"
		:model="data"
		label-position="top"
		size="small"
    :rules="rules"
	>
  <el-row :gutter="10">
    <el-col :span="4">
      <el-form-item
				label="5. Pattern Start Date"
        prop="start_date"
			>
      <template slot="label">
        <label>
          5. Pattern Start Date
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >The date on which you would like to start the price comparison.</span>
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </label>
      </template>
        <el-date-picker
          v-model="data.start_date"
          type="date"
          placeholder="- Select Start Date -"
          value-format="yyyy-MM-dd"
          :picker-options="startPickerOptions"
          @change="calculateBarDistance"
        >
        </el-date-picker>
			</el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item
				label="6. Pattern End Date"
        prop="end_date"
			>
      <template slot="label">
        <label>
          6. Pattern End Date
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >The date on which you would like to stop the price comparison.</span>
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </label>
      </template>
        <el-date-picker
          v-model="data.end_date"
          type="date"
          placeholder="- Select End Date -"
          value-format="yyyy-MM-dd"
          :picker-options="endPickerOptions"
          @change="calculateBarDistance"
        >
        </el-date-picker>
			</el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item
        label="7. Number of Bars"
        prop="bars_num"
      >
        <el-input v-model="data.bars_num" :disabled="false" @change="changeNumberOfBars">
          <template v-slot:append>
            (≥3 and ≤252)
          </template>
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item prop="timeframe" label="8. Timeframe">
        <el-select
            v-model="data.timeframe"
            placeholder="— Select Timeframe —"
            @change="changeTimeframe"
            :disabled="previewBtnLoading || btnLoading"
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
    <el-col :span="8">
      <el-row :gutter="10">
        <el-col :span="14">
          <el-form-item
            label="9. Correlation Percentage"
            prop="corr_per"
          >
            <template slot="label">
              <label>
                9. Correlation Percentage
                <el-tooltip effect="dark" placement="top">
                  <span slot="content">
                    This is the minimum threshold required for matching patterns. <br />
                    Only values between 75-100 are accepted. A value of "90", <br/>
                    for example, means that only correlations above +0.90 will be shown.
                  </span>
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </label>
            </template>
            <el-input v-model="data.corr_per" placeholder="Enter correlation percentage">
              <template v-slot:append>
              (%)
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item class="CPM-btn" label=" ">
            <el-button type="warning" @click="previewForm" size="small" :loading="previewBtnLoading" :disabled="previewBtnLoading || btnLoading">Preview Pattern</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  </el-form>
  <el-form
		ref="BacktestForm"
		:model="data"
		label-position="top"
		size="small"
    :rules="rules"
	>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-row :gutter="10">
        <el-col :span="8">
        <el-form-item prop="direction" label="10. Direction">
          <el-select
              v-model="data.direction"
              placeholder="— Select Direction —"
            >
              <el-option
                v-for="item in directionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item
          label="11. Time In Market"
          prop="tim"
        >
          <template slot="label">
            <label>
              11. Time In Market
              <el-tooltip effect="dark" placement="top">
                <span slot="content">
                  Input a value of bars to stay in market after entry.<br />Exit
                    position when the specified Time In Market is reached.
                    (default: 21)<br
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
        <el-col :span="8">
          <el-form-item prop="backtestHistory" label="12. Lookback Period">
              <template slot="label">
                <label>
                  12. Lookback Period
                  <el-tooltip effect="dark" placement="top">
                    <span slot="content"
                      >Specify the start and end date of the backtest. <br />
                      Choose 'All History' to include all data since the inception of the backtesting stock/index/ETF. <br />
                      Additionally, select 'Custom' to input a custom year.<br
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
    </el-col>
    <el-col :span="12">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item
              label="13. Custom Duration"
              prop="year"
              v-if="data.lookback_period == 'Custom'"
            >
              <el-input
                v-model="data.year"
                placeholder="Enter custom years"
              ><template v-slot:append>
                (years)
                </template></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-button v-show="percentage == 0" size="small" class="CPM-btn" type="primary" :loading="btnLoading" @click="submitForm" :disabled="previewBtnLoading || btnLoading">Backtest Pattern</el-button>
            <div class="processTipsBox" v-show="percentage != 0">
            <el-progress :text-inside="true" :stroke-width="15" :percentage="percentage" :color="customColorMethod"></el-progress>
            </div>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item>
          <div class="processTips" v-if="percentage != 0"><span v-html="processTips"></span></div>
          </el-form-item>
        </el-col>
      </el-row>
  </el-form>
  </div>
</template>
 <script>
 import { CIQ } from '@/components/common/chart/st-development/js/components'
import { saveCPM, previewCPM, editCPM, getCPMList, getCPMResults, getCPMPreview } from '@/service/service'
import { createPositiveIntegerRule, createVerifyValueInListRule, validateMarginRule } from "@/utils/formValidate"
import { LoadingOverlay } from "@/components/common"
import { timestampToTime, isJson } from '@/utils'
import {createStateFilter} from '@/utils/globalFunc'
import { mapGetters } from "vuex"

export default {
  name: 'Form',
  components: {
    LoadingOverlay
  },
  data() {
    var validateBarsNum = (rule, value, callback) => {
        if (value < 3 || value > 252) {
          return callback(new Error('The number of bars should be between 3 and 252, please change your condition.'));
        } else {
          callback();
        }
    };
    return {
      data: {
        name: '',
        symbol: '',
        timeframe: 'Daily',
        start_date: '',
        end_date: '',
        lookback_period: 'All',
        corr_per: 90,
        tim: 21,
        year: '',
        exclude_overlap: true,
        direction: 'Long',
        bars_num: 0,
        ma_condition: 0,
        ma: 200
      },
      dropdownList: [],
      percentage: 0,
      processTips: '',
      frequencyOptions: [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' }
      ],
      conditionOptions: [
        { value: 0, label: 'None' },
        { value: 1, label: 'Above' },
        { value: 2, label: 'Below' }
      ],
      directionOptions: [
        { value: 'Long', label: 'Long' },
        { value: 'Short', label: 'Short' }
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
          value: 8,
          label: '8 Year'
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
          value: 'All',
          label: 'All History'
        },
        {
          value: 'Custom',
          label: 'Custom...'
        }
      ],
      rowUrl: null,
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      isExcludeOO: true,
      rules: {
        name: [
          { required: true, message: 'Enter a name', trigger: 'blur' }
        ],
        symbol: [
          { validator: createVerifyValueInListRule(this.$store.getters.getRefactoredSymbolList, 'Select a stock', 'Choose a stock from the dropdown'), trigger: 'blur' },
          { validator: createVerifyValueInListRule(this.$store.getters.getRefactoredSymbolList, 'Select a stock', 'Choose a stock from the dropdown'), trigger: 'change' },
        ],
        tim: [
          { validator: createPositiveIntegerRule('time in market', 0), trigger: 'blur' },
          { validator: createPositiveIntegerRule('time in market', 0), trigger: 'change' }
        ],
        ma: [
          { validator: createPositiveIntegerRule('period', 1), trigger: 'blur' },
          { validator: createPositiveIntegerRule('period', 1), trigger: 'change' }
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
          { validator: this.createYearLimitRule('custom years'), trigger: 'blur' }
        ],
        corr_per: [
          { validator: createPositiveIntegerRule('correlation percentage', 75,100), trigger: 'blur'}
        ],
        bars_num: [
          { validator: validateBarsNum, trigger: 'change' }
        ],
      },
      btnLoading: false,
      previewBtnLoading: false,
    }
  },
  computed: {
    ...mapGetters(['getBacktestSymbol']), // 监听chartiq和表单的symbol改动以双向响应
    handleGetBacktestSymbol() {
      return this.getBacktestSymbol
    },
    ...mapGetters({
      symbolList: 'getRefactoredSymbolList'
    })
  },
  watch: {
    handleGetBacktestSymbol: {
      handler(newVal) {
        this.data.symbol = newVal
      },
      immediate: true,
      deep: true
    },
  },
  async mounted() {
    this.setBacktestHistory(1)
    this.generateCPMName()
  },
  methods: {
    createYearLimitRule(errorMsgEmpty) {
      return (_, value, callback) => {
        if(value === '') {
          callback(new Error(`Enter ${errorMsgEmpty}`))
        }
        const pattern = /^\d+$/
        const isPositiveInteger = isNaN(value) || value <= 0 || !pattern.test(value)
        if (isPositiveInteger) {
          callback(new Error(`Enter positive integers only`))
        }
        const customYearLimit = CIQ.getYearInverval()
        if( customYearLimit < value){
          this.data.year = customYearLimit
          callback(new Error(`The Input Value Exceeds the Maximun Number of Years (${customYearLimit}) for This Symbol`))
        }
        callback()
      }
    },
    resetForm() {
      // 如果当前在预览或者回测状态，不允许重置
      if(this.previewBtnLoading || this.btnLoading) return true
      const resetData = {
        lookback_period: 'All',
        corr_per: 90,
        direction: 'Long',
        tim: 21,
        symbol: 'SPX',
        timeframe: 'Daily',
      }
      this.rowUrl = null
      this.data = {
        ...this.data,
        ...resetData
      }
      this.processTips = ''
      this.percentage = 0
      this.setBacktestHistory(1)
      this.generateCPMName()
      const formRef = ['BasicForm', 'PreviewForm', 'BacktestForm']
      formRef.forEach(ref => {
      this.$refs[ref].clearValidate()
      })

      this.resetChart()
    },
    calculateBarDistance() {
      // 计算区间内Bar Distance
      this.data.bars_num = CIQ.measureBarDistance(this.data.start_date,this.data.end_date)
    },
    generateCPMName() {
      const date = new Date()
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      this.data.name = this.data.symbol + '  ' + year + '-' + month + '-' + day + '  ' + hour + ':' + minute + ':' + second
    },
    resetChart() {
      CIQ.Marker.removeByLabel(CIQ.stxx, 'events');
      this.$store.commit('form/getFreqHighPriority', 'Daily')
      this.$store.commit('form/getBacktestSymbol', "SPX")
      CIQ.addIndicators({},()=>{
        this.calculateBarDistance()
        CIQ.hideCover()
        CIQ.nprogress.done()
      })
    },
    changeTimeframe(val) {
      CIQ.Marker.removeByLabel(CIQ.stxx, 'events');
      this.$store.commit('form/getFreqHighPriority', val)
      CIQ.addIndicators({},()=>{
        this.calculateBarDistance()
        CIQ.hideCover()
        CIQ.nprogress.done()
      })
    },
    changeNumberOfBars(val) {
      if(val>=3 && val<=252) this.data.start_date = CIQ.getStartDateByNumberOfBars(this.data.end_date,Number(val))
    },
    setBacktestHistory(val) {
      this.data.end_date = timestampToTime(new Date());
      const endDate = new Date(this.data.end_date);
      const startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - val);
      this.data.start_date = timestampToTime(startDate);
    },
    handleDisabledStartDate(time) {
      const today = timestampToTime(new Date())
      const endDay = timestampToTime(new Date(this.data.end_date))
      // 如果endDate取消选择，则startDate可以选择全部
      if(this.data.end_date){
        return timestampToTime(time) >= endDay
      }else{
        return (timestampToTime(time) > today)
      }
    },
    handleDisabledEndDate(time) {
      const today = timestampToTime(new Date())
      const startDay = timestampToTime(new Date(this.data.start_date))
      return (timestampToTime(time) > today) || (timestampToTime(time) <= startDay)
    },
    querySearch(queryString, cb) {
      if(!this.dropdownList || this.dropdownList.length == 0) {
        this.dropdownList = this.symbolList
      }
      var results = this.dropdownList.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)
      cb(results.sort((a, b) => b.priority - a.priority))
    },

    handleSelect(item) {
      this.data.symbol = item.url

      // this.$store.commit('form/getBacktestSymbol', this.data.symbol)
      CIQ.addSymbol(this.data.symbol,CIQ.stxx,()=>{
        this.calculateBarDistance()
        CIQ.Marker.removeByLabel(CIQ.stxx, 'events');
        CIQ.hideCover()
        CIQ.nprogress.done()
      })
    },
    async previewForm() {
      this.changeLoadingStatus('preview',true)
      let previewRes = null
      try {
        previewRes = await this.previewCPM()
      } catch (error) {
        this.changeLoadingStatus('preview',false); return
      }
      console.log('previewRes', previewRes)
      if(!previewRes) {this.changeLoadingStatus('preview',false); return}
     const code = previewRes.data.code
      if(code == 400) this.popUpMsgBox('Pattern preview failed')
      if(code == 401) this.popUpMsgBox('Calculate error')
      if(code == 404 || code == 403) this.popUpMsgBox('Save failed, Please try again')
      if(code == 406) {
        const name =  this.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407) this.popUpMsgBox('No correlation pattern match meeting the criteria found')
      this.changeLoadingStatus('preview',false)
      if(code == 200 && previewRes.status == 200) {
        this.popUpMsgBox('Pattern preview successful.')
        // 清空 results 数据
        this.$emit('clearResults', this.data)
        //将数据显示在 chartIQ 上
        let CPMObj = {
          symbol: this.data.symbol,
          timeframe: this.data.timeframe,
          result: JSON.parse(previewRes.data.data)
        }

        CIQ.Marker.removeByLabel(CIQ.stxx, 'events');
        CIQ.displayCPMLayout(CPMObj,()=>{
          this.calculateBarDistance()
          this.changeLoadingStatus('preview',false)
        })
      }
    },
    async submitForm() {
     this.changeLoadingStatus('backtest',true)
     this.percentage = 5
     let saveRes = null
     try {
      saveRes = await this.saveCPM()
     } catch (error) {
      this.processTips = '';
      this.percentage = 0
      this.changeLoadingStatus('backtest',false); return
     }
     if(!saveRes) {this.changeLoadingStatus('backtest',false); this.processTips = ''; this.percentage = 0; return}
     const code = saveRes.data.code
      if(code == 203) this.popUpMsgBox('The backtest pattern is running. You can wait or click the "+"" button to create a new pattern."')
      if(code == 401) this.popUpMsgBox('Calculate error')
      if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('Save failed, Please try again'); return}
      if(code == 406) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407) this.popUpMsgBox('No correlation pattern match meeting the criteria found')
      this.changeLoadingStatus('backtest',false)
      if(code == 200) {
        this.changeLoadingStatus('backtest',false)
        this.popUpMsgBox('Pattern backtest successful')
        let result = saveRes.data.data.result
        saveRes.data.data.result = isJson(result) ? JSON.parse(result) : result
        //将数据显示在 chartIQ 上
        let CPMObj = {
          symbol: this.data.symbol,
          timeframe: this.data.timeframe,
          result:saveRes.data.data.result
        }
        CIQ.Marker.removeByLabel(CIQ.stxx, 'events');
        CIQ.displayCPMLayout(CPMObj,()=>{
          this.calculateBarDistance()
          this.$emit('displayResultsData', saveRes.data.data)
          this.changeLoadingStatus('preview',false)
        })
      }
      this.percentage = 0
      this.processTips = ''
    },
    async checkDuplicateNames(name) {
        const nameLookupRes = await getCPMList(null, null, name)
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
    async previewCPM() {
      if(this.barDistance < 3) {this.popUpMsgBox('Bars must be 3 or more. Adjust the Pattern Start and End Dates accordingly');return}
      this.$refs['BacktestForm'].clearValidate()
      const validForm = await this.validForm(['BasicForm', 'PreviewForm'])
      if(!validForm) {return}
      console.log('表单是否验证成功', validForm)
      // 处理数据
      const exclude_overlap = this.isExcludeOO ? 1 : 0
      const saveData = {
        ...this.data,
        exclude_overlap,
        direction: 'Long',
        tim: 21
      }
      delete saveData.year
      if(saveData.lookback_period > 10 || saveData.lookback_period == 'All') {
        this.$notify.info({
            title: 'Tips:',
            message: 'In the case of previewing exceeding 10 years, anticipate longer processing time. We appreciate your patience...',
            duration: 8000
        })
      }
      const previewRes = await previewCPM(saveData)
      console.log('previewRes', previewRes)
      const code = previewRes.data?.code
      const url = previewRes.data?.data
      if(code != 201) {this.popUpMsgBox('Pattern preview failed'); return}
      let pollingRes = null
      do {
        pollingRes = await getCPMPreview(url)
        const code = pollingRes.data.code
        console.log('轮训响应', pollingRes)
        if (code == 200) {
          return pollingRes
        }
        if(code == 400 || code == 401 || code == 404 || code == 407) {return pollingRes}
        // Add a delay here to avoid excessive polling, e.g., using setTimeout
        await new Promise(resolve => setTimeout(resolve, 1500));
      } while (true); // Keep polling indefinitely
    },
    async saveCPM() {
      // const validForm = this.validForm()
      if(this.barDistance < 3) {this.popUpMsgBox('Bars must be 3 or more. Adjust the Pattern Start and End Dates accordingly');return}
      const validForm = await this.validForm(['BasicForm', 'PreviewForm', 'BacktestForm']);
      console.log('表单是否验证成功', validForm)
      this.processTips = `Tips: Saving your pattern matching parameters...`
      const rowUrl = this.rowUrl
      const name = this.data.name
      if(!validForm) return
      if(!rowUrl) {
        // 不是编辑是新建
        const nameChecked = await this.checkDuplicateNames(name)
        if(nameChecked) {this.popUpMsgBox(`The Correlation Pattern Match Name already exists`); return}
      }
      this.percentage = 8
      const exclude_overlap = this.isExcludeOO ? 1 : 0
      const saveData = {
        ...this.data,
        exclude_overlap
      }
      if(saveData.lookback_period == 'Custom') saveData.lookback_period = saveData.year
      delete saveData.year
      if(saveData.lookback_period > 10 || saveData.lookback_period == 'All') {
        this.$notify.info({
          title: 'Tips:',
          message: 'In the case of backtesting exceeding 10 years, anticipate longer processing time. We appreciate your patience...',
          duration: 8000
        })
      }
      let saveRes
      if(rowUrl) {saveRes = await editCPM(saveData, rowUrl)}
      else{saveRes = await saveCPM(saveData)}
      const code = saveRes.data?.code
      const failedConditions = [203, 403, 404, 406]
      if(failedConditions.includes(Number(code))) {
        // 保存失败, 不进入轮询
        return saveRes
      }
      this.processTips = 'Tips: The pattern backtest is in progress, which may take some time. Please be patient...'
      let url = saveRes.data?.url
      this.rowUrl = url
      let pollingRes = null
      do {
        if(this.percentage < 99) this.percentage += 1
        pollingRes = await getCPMResults(url)
        const code = pollingRes.data.code
        if (pollingRes.data.data?.status === 'finish' && code == 200) {
          return pollingRes
        }
        if(code == 401 || code == 403 || code == 404 || code == 407) return pollingRes
        // Add a delay here to avoid excessive polling, e.g., using setTimeout
        await new Promise(resolve => setTimeout(resolve, 1500));
      } while (true); // Keep polling indefinitely
    },
    async validForm(formRefs) {
      const validateForm = async (formRef) => {
        return new Promise(resolve => {
          this.$refs[formRef].validate(valid => {
            resolve(valid);
          });
        });
      };

      const validations = await Promise.all(formRefs.map(formRef => validateForm(formRef)));

      const isAllValid = validations.every(valid => valid);

      if (!isAllValid) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.');
      }

      return isAllValid;
    },
    displayData(data) {
      this.rowUrl = data.url
      const target = this.data
      for (const key in target) {
        if(key == 'exclude_overlap') {
          target[key] = data[key] == 1 ? true : false
        }else if (key == 'lookback_period'){
          const editPeriod = data[key]
          const exists = this.historyOptions.some(option => option.value == editPeriod)
          if(exists) target[key] = data[key] == 'All' ? data[key] : Number(data[key])
          if(!exists) { target[key] = 'Custom'}
        }else if(key == 'year'){
          if(this.data.lookback_period == 'Custom') {target['year'] = data['lookback_period']}
          else {target['year'] = ''}
        }else if(key === 'ma_condition' && !data[key]) {
          // 默认 None
          target[key] = 0
        }else if(key === 'ma' && !data[key]) {
          target[key] = 200
        }else {
          target[key] = data[key]
        }
      }
      this.data = target
    },
    changeLoadingStatus(type,state){
      if(state){
        if(type == 'preview') this.previewBtnLoading = true;
        else this.btnLoading = true;
        CIQ.addCover();
      }else {
        if(type == 'preview') this.previewBtnLoading = false;
        else this.btnLoading = false;
        CIQ.hideCover();
      }
    },
    customColorMethod(percentage) {
      if (percentage < 50) {
        return '#a0e3ec'
      } else if (percentage < 70) {
        return '#58d9ea';
      } else if(percentage < 90){
        return '#15cfe7';
      }else {
        return '#66ace5';
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
  width: 100%;
  height: 100%;
}
.el-button--warning {
  width: 100%;
  height: 100%;
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
  justify-content: center;
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
/deep/ .CPM-btn.el-form-item--small{
  margin-top: 19px;
}
.CPM-btn {
  margin: 42px 0px 0px 0px;
  width: 100%;
}
.processTips {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 14px;
    font-weight: 500;
    color: #606266;
  }
.processTipsBox {
    height: 100%;
    margin: 42px 0px 0px 0px;
  /deep/ .el-progress-bar__innerText {
    margin: 0px 5px 1px 5px;
  //   color: #ffffff !important;
  }
  /deep/ .el-progress-bar__outer {
    
    height: 32px !important;
    border-radius: 4px;
  }
  /deep/ .el-progress-bar__inner {
    border-radius: 4px;
  }
  /deep/ .el-progress--text-inside .el-progress-bar {
    height: 100%;
  }
  /deep/ .el-progress {
    height: 100%;
  }
}

/deep/ .el-form-item__label {
  font-weight: 600;
  color: #333;
  width: 300px;
}
/deep/ .el-button, /deep/ .el-input--small .el-input__inner, /deep/ .el-input-group__append {
  font-weight: 500;
}
</style>