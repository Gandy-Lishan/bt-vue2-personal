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
    <el-col :span="12">
      <el-form-item
        label="1. CPM Name"
        prop="name"
      >
        <el-input v-model="data.name" placeholder="Enter cpm name"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
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
				label="3. Pattern Start Date"
        prop="start_date"
			>
      <template slot="label">
        <label>
          3. Pattern Start Date
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >"Start Date" denotes the commencement time of the candlestick pattern.</span>
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
				label="4. Pattern End Date"
        prop="end_date"
			>
      <template slot="label">
        <label>
          4. Pattern End Date
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >"End Date" indicates the conclusion time of the candlestick pattern.</span>
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
        label="5. Number of Bars"
      >
        <el-input v-model="data.bar_distance" :disabled="true">
          <template v-slot:append>
            (≥4)
          </template>
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item prop="timeframe" label="6. Timeframe">
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
    <el-col :span="8">
      <el-row :gutter="10">
        <el-col :span="14">
          <el-form-item
            label="7. Correlation Percentage"
            prop="corr_per"
          >
            <template slot="label">
              <label>
                7. Correlation Percentage
                <el-tooltip effect="dark" placement="top">
                  <span slot="content">
                    Correlation Percentage
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
            <el-button type="primary" @click="previewForm" size="small" class="delete-btn" :loading="previewBtnLoading">Preview Pattern</el-button>
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
    <el-col :span="6">
      <el-form-item prop="direction" label="8. Direction">
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
    <el-col :span="6">
      <el-form-item
				label="9. Time In Market"
        prop="tim"
			>
        <template slot="label">
          <label>
            9. Time In Market
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
    <el-col :span="6">
      <el-form-item prop="backtestHistory" label="10. Lookback Period">
        <template slot="label">
          <label>
            10. Lookback Period
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Specify the start and end date of the backtest. <br />
                Choose 'All History' to include all data since the inception of the backtesting stock/index. <br />
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
    <el-col :span="6">
      <el-row :gutter="10">
        <el-col>
          <el-form-item
				label="11. Custom Duration"
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
      </el-row>
    </el-col>
  </el-row>
  </el-form>
  <el-form
		ref="Form"
		:model="data"
		label-position="top"
		size="small"
    :rules="rules"
	>
  <el-form-item>
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :span="8"></el-col>
        <el-col :span="8">
          <div class="form-btn">
            <!-- <el-button type="primary" class="delete-btn">Preview the found KLine</el-button> -->
            <el-button type="primary" @click="submitForm" :loading="btnLoading">Backtest Pattern</el-button>
          </div>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </el-form-item>
  </el-form>
	<!-- <el-form
		ref="Form"
		:model="data"
		label-position="top"
		size="small"
    :rules="rules"
	>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-form-item
				label="1. CPM Name"
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
				label="3.Pattern Start Date"
        prop="start_date"
			>
      <template slot="label">
        <label>
          3. Pattern Start Date
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >"Start Date" denotes the commencement time of the candlestick pattern.</span>
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
    <el-col :span="6">
      <el-form-item
				label="4.Pattern End Date"
        prop="end_date"
			>
      <template slot="label">
        <label>
          4. Pattern End Date
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >"End Date" indicates the conclusion time of the candlestick pattern.</span>
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
  </el-row>
  <el-row :gutter="20">
    <el-col :span="6">
      {{barDistance}}
      <el-form-item prop="direction" label="5. Direction">
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
    <el-col :span="6">
      <el-form-item prop="timeframe" label="6. Timeframe">
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
				label="7. Correlation Percentage"
        prop="corr_per"
			>
        <template slot="label">
          <label>
            7. Correlation Percentage
            <el-tooltip effect="dark" placement="top">
              <span slot="content">
                Correlation Percentage
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
    <el-col :span="6">
      <el-form-item
				label="8. Time In Market"
        prop="tim"
			>
        <template slot="label">
          <label>
            8. Time In Market
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
  </el-row>
  <el-row :gutter="20">
    <el-col :span="6">
    <el-form-item prop="backtestHistory" label="9. Lookback Period">
        <template slot="label">
          <label>
            9. Lookback Period
            <el-tooltip effect="dark" placement="top">
              <span slot="content"
                >Specify the start and end date of the backtest. <br />
                Choose 'All History' to include all data since the inception of the backtesting stock/index. <br />
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
    <el-col :span="6">
      <el-form-item
				label="10. Custom Duration"
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
    <el-col :span="6">
    <div class="excludeBox">
        <el-checkbox v-model="isExcludeOO"
          >Exclude Overlapping Observations
          <el-tooltip effect="dark" placement="top">
            <span slot="content"
              >
              After checking, ensure no signal overlap.
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
            <el-button type="primary" class="delete-btn" :loading="btnLoading" size="large">Preview Pattern</el-button>
            <el-button type="primary" @click="submitForm" :loading="btnLoading" size="large">Backtest Pattern</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
	</el-form> -->
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
import { saveCPM, previewCPM, editCPM, getCPMList } from '@/service/service'
import { createPositiveIntegerRule, createVerifyValueInListRule, validateMarginRule } from "@/utils/formValidate"
import { LoadingOverlay } from "@/components/common"
import { timestampToTime, isJson } from '@/utils'
import { mapGetters } from "vuex"

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
        corr_per: 90,
        tim: 21,
        year: '',
        exclude_overlap: false,
        direction: 'Long',
        bar_distance: 0,
      },
      dropdownList: [],
      frequencyOptions: [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' }
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
          value: 'All',
          label: 'All History'
        },
        {
          value: 'Custom',
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
      isExcludeOO: true,
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
          { validator:  createPositiveIntegerRule('correlation percentage', 75,100), trigger: 'blur'}
        ]
      },
      btnLoading: false,
      previewBtnLoading: false
    }
  },
  computed: {
    isCreateLoading() {
      // 从 Vuex store 中获取全局 loading 状态
      return this.$store.state.states.isCreateLoading
    },
    ...mapGetters(['getBacktestSymbol']), // 监听chartiq和表单的symbol改动以双向响应
    handleGetBacktestSymbol() {
      return this.getBacktestSymbol
    },
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
    this.setBacktestHistory(10)
    this.generateCPMName()
  },
  methods: {
    calculateBarDistance() {
      this.data.bar_distance = CIQ.measureBarDistance(this.data.start_date,this.data.end_date)
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
    changeTimeframe(val) {
      this.$store.commit('form/getFreqHighPriority', val)
      CIQ.addIndicators(()=>{
        this.calculateBarDistance()
        CIQ.hideCover()
        CIQ.nprogress.done()
      })
    },
    setBacktestHistory(val) {
      this.data.end_date = timestampToTime(new Date());
      const endDate = new Date(this.data.end_date);
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - val);
      this.data.start_date = timestampToTime(startDate);
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

      // CIQ.objIndicator = []
      // CIQ.stxx.loadChart({
      //     symbol: this.data.symbol,
      //     startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),
      //     endDate:new Date(),
      // },()=>{
      //     CIQ.hideCover()
      // })
      this.$store.commit('form/getBacktestSymbol', this.data.symbol)
      CIQ.addSymbol(this.data.symbol,()=>{
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
      if(code == 401) this.popUpMsgBox('Calculate error')
      if(code == 404 || code == 403) this.popUpMsgBox('Permission denied')
      if(code == 406) {
        const name =  this.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another.`)
      }
      if(code == 407) this.popUpMsgBox('No CPM meeting the criteria found.')
      this.changeLoadingStatus('preview',false)
      if(code == 200 && previewRes.status == 200) {
        //将数据显示在 chartIQ 上
        let CPMObj = {
          symbol: this.data.symbol,
          timeframe: this.data.timeframe,
          result: JSON.parse(previewRes.data.data)
        }
        CIQ.displayCPMLayout(CPMObj,()=>{
          this.calculateBarDistance()
          this.changeLoadingStatus('preview',false)
        })
      }
    },
    async submitForm() {
     this.changeLoadingStatus('backtest',true)
     let saveRes = null
     try {
      saveRes = await this.saveCPM()
     } catch (error) {
      this.changeLoadingStatus('backtest',false); return
     }
     console.log('saveRes', saveRes)
     if(!saveRes) {this.changeLoadingStatus('backtest',false); return}
     const code = saveRes.data.code
      if(code == 401) this.popUpMsgBox('Calculate error')
      if(code == 404 || code == 403) this.popUpMsgBox('Permission denied')
      if(code == 406) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another.`)
      }
      if(code == 407) this.popUpMsgBox('No CPM meeting the criteria found.')
      this.changeLoadingStatus('backtest',false)
      if(saveRes.status == 201) {
        this.changeLoadingStatus('backtest',false)
        const result = saveRes.data.result
        saveRes.data.result = isJson(result) ? JSON.parse(result) : result
        const data = JSON.stringify(saveRes.data)
        this.$router.push({
          name: 'CPMResults',
          query: {
            data,
            usedFor: 'showCPMResults',
          }
        })}
      // this.$store.commit('SET_CREACT_LOADING', false)
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
      if(this.barDistance < 4) {this.popUpMsgBox('Bars must be 4 or more. Adjust the Pattern Start and End Dates accordingly');return}
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
        lookback_period: 'All',
        tim: 21
      }
      delete saveData.year
      return await previewCPM(saveData)
    },
    async saveCPM() {
      // const validForm = this.validForm()
      if(this.barDistance < 4) {this.popUpMsgBox('Bars must be 4 or more. Adjust the Pattern Start and End Dates accordingly');return}
      const validForm = await this.validForm(['BasicForm', 'PreviewForm', 'BacktestForm']);
      console.log('表单是否验证成功', validForm)
      const rowUrl = this.rowUrl
      const name = this.data.name
      if(!validForm) return
      if(!rowUrl) {
        // 不是编辑是新建
        const nameChecked = await this.checkDuplicateNames(name)
        if(nameChecked) {this.popUpMsgBox(`Custom indicator name already in use. Please choose another`); return}
      }
      const exclude_overlap = this.isExcludeOO ? 1 : 0
      const saveData = {
        ...this.data,
        exclude_overlap
      }
      if(saveData.lookback_period == 'Custom') saveData.lookback_period = saveData.year
      delete saveData.year

      if(rowUrl) return await editCPM(saveData, rowUrl)
      return await saveCPM(saveData);
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
          if(exists) target[key] = Number(data[key])
          if(!exists) { target[key] = 'Custom'}
        }else if(key == 'year'){
          if(this.data.lookback_period == 'Custom') {target['year'] = data['lookback_period']}
          else {target['year'] = ''}
        }else {
          target[key] = data[key]
        }
      }
      this.data = target
    },
    changeLoadingStatus(type,state){
      if(state){
        if(type == 'preview') this.$store.commit('states/SET_MI_CREATE_LOADING', true);
        CIQ.addCover();this.previewBtnLoading = true;this.btnLoading = true;
      }else {
        if(type == 'preview') this.$store.commit('states/SET_MI_CREATE_LOADING', false);
        CIQ.hideCover();this.previewBtnLoading = false;this.btnLoading = false;
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
  // display: flex;
  // align-items: center;
  // justify-content: flex-end;
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
/deep/ .el-form-item.CPM-btn.el-form-item--small{
  margin-top: 19px;
}
.delete-btn {
	background-color: #f59e0b;
  border: unset;
}
.delete-btn:hover {
  background-color: rgb(251, 192, 92);
}
</style>