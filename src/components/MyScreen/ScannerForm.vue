<template>
  <div class="signal-container">
    <el-form
      class="scanner-form"
      ref="Form"
      :model="data"
      label-position="top"
      size="small"
      :rules="rules">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item
          prop="name"
          >
          <template slot="label">
          <label>
            1. Name
          </label>
        </template>
          <el-input v-model="data.name" placeholder="Enter a name"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
          prop="category"
          >
          <template slot="label">
            <label>
              2. Category
            </label>
          </template>
          <el-select
              v-model="data.category"
              placeholder="— Select type —"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="timefame">
            <template slot="label">
            <label>
              3. Direction
            </label>
          </template>
          <el-select
              v-model="data.direction"
              placeholder="— Select type —"
            >
              <el-option
                v-for="item in directionOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
        </el-form-item>
        </el-col>
      </el-row>
      <div class="signals-div">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item prop="timefame">
            <template slot="label">
            <label>
              4. Signal
            </label>
          </template>
          <el-select
              v-model="data.relation"
              placeholder="— Select type —"
            >
              <el-option
                v-for="item in relationsOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
        </el-form-item>
        </el-col>
      </el-row>
      <div v-if="data.relation == 0">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="signal" label-width="0">
              <el-select
                  v-model="data.signal"
                  placeholder="— Select —"
                >
                  <el-option
                    v-for="item in signalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="condition" label-width="0">
              <el-select
                  v-model="data.condition"
                  placeholder="— Select —"
                >
                  <el-option
                    v-for="item in conditionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="signal" label-width="0">
              <el-select
                  v-model="data.value"
                  placeholder="— Select —"
                >
                  <el-option
                    v-for="item in signalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              <!-- <el-input
                v-model="data.value"
						></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="(data.score !== 0)">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="signal" label-width="0">
              <el-select
                  v-model="data.signal"
                  placeholder="— Select —"
                >
                  <el-option
                    v-for="item in signalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="condition" label-width="0">
              <el-select
                  v-model="data.condition"
                  placeholder="— Select —"
                >
                  <el-option
                    v-for="item in conditionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="signal" label-width="0">
              <el-input
                v-model="data.value2"
                placeholder="Input Value"
						></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="signal" label-width="0">
              <el-select
                  v-model="data.signal2"
                  placeholder="— Select —"
                >
                  <el-option
                    v-for="item in signalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="condition" label-width="0">
              <el-select
                  v-model="data.condition2"
                  placeholder="— Select —"
                >
                  <el-option
                    v-for="item in conditionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="signal" label-width="0">
              <el-input
                v-model="data.value3"
                placeholder="Input Value"
						></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
    </el-form>
    <!-- <div class="setup">
      <div class="set-up-container">
        <Criteria
          class="criteria"
          ref="entryChild1"
          :size="'small'"
          :config="setConfig('entry')"
          :isRiskControl="false"
          :symbolInfo="symbolInfo"
          :isIgnoreChart="true"
        >
        </Criteria>
      </div>
    </div> -->
    <br>
    <el-row :gutter="10" type="flex" class="row-bg" justify="center">
        <el-col :span="6">
          <el-button type="warning" size="small" @click="resetForm">Reset Form</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" @click="submitForm" v-show="percentage == 0">Save Screen</el-button>
          <div class="processTipsBox" v-show="percentage != 0">
          <el-progress :text-inside="true" :stroke-width="15" :percentage="percentage" :color="customColorMethod"></el-progress>
          </div>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { isJson, timestampToTime, capitalizeFirstLetter } from '@/utils'
import SignalCode from '@/utils/cryptoUtils/codeTool'
import cloneDeep from 'lodash/cloneDeep'
import { saveMyScreenForm, editMyScreenForm, getScreenResults } from '@/service/service'
import Criteria from "./criteria/index";
import { generateConfig } from './criteria/config'
import { CIQ } from '@/components/common/chart/st-development/js'
const throttle = require('lodash/throttle')
import { mapGetters } from "vuex"

export default {
  name: 'ScannerForm',
  props: ['parentContext'],
  components: {
    Criteria
  },
  data() {
    return {
      data: {
        name: '',
        direction: 'Long',
        category: 'Technology',
        relation: 0,
        signal: 'TrendScore',
        signal2: 'Change',
        condition: 0,
        condition2: 0,
        value: 'Close',
        value2: '',
        value3: ''
      },
      rowUrl: null,
      isPolling: false,
      processTips: '',
      percentage: 0,
      symbolInfo: {strategy: 'Single', category: 'SPY', symbol2: ''}, 
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      directionOption: [
        { value: 'Long', label: 'Long', disabled: false},
        { value: 'Short', label: 'Short', disabled: false}
      ],
      conditionOptions: [
        { value: 0, label: '>' },
        { value: 1, label: '=' },
        { value: 2, label: '<' }
      ],
      options: [
        { value: 'Communication Services', label: 'Communication Services', disabled: false},
        { value: 'Discretionary', label: 'Discretionary', disabled: false},
        { value: 'Energy', label: 'Energy', disabled: false},
        { value: 'Financials', label: 'Financials', disabled: false},
        { value: 'Health Care', label: 'Health Care', disabled: false},
        { value: 'Industrials', label: 'Industrials', disabled: false},
        { value: 'Materials', label: 'Materials', disabled: false},
        { value: 'Real Estate', label: 'Real Estate', disabled: false},
        { value: 'S&P 500', label: 'S&P 500', disabled: false},
        { value: 'Staples', label: 'Staples', disabled: false},
        { value: 'Technology', label: 'Technology', disabled: false},
        { value: 'Utilities', label: 'Utilities', disabled: false},
        { value: 'NDX', label: 'NDX', disabled: false}
      ],
      relationsOption: [
      { value: 0, label: 'Only', disabled: false},
      { value: 1, label: 'And', disabled: false},
      { value: 2, label: 'Or', disabled: false}
      ],
      signalOptions: [
        { label: 'Trend Score', value: 'TrendScore' },
        { label: 'Symbol Close', value: 'Close' },
        { label: 'Change', value: 'Change' },
        { label: 'Symbol Close 200-Day Moving Average', value: 'SMA200' },
        { label: 'Symbol Close 100-Day Moving Average', value: 'SMA100' },
        { label: 'Symbol Close 50-Day Moving Average', value: 'SMA50' },
        { label: 'Symbol Close 20-Day Moving Average', value: 'SMA20' },
        { label: 'Symbol Close 10-Day Moving Average', value: 'SMA10' },
        { label: 'Symbol Close 5-Day Moving Average', value: 'SMA5' },
        { label: 'Symbol Optix 50-Day Moving Average', value: 'Optix50' },
        { label: 'Symbol Optix 20-Day Moving Average', value: 'Optix20' },
        { label: 'Symbol Optix 10-Day Moving Average', value: 'Optix10' },
        { label: 'Symbol Optix 5-Day Moving Average', value: 'Optix5' },
        { label: 'Symbol Optix', value: 'Optix' },
        { label: 'Relative Strength Index (RSI)', value: 'RSI' },
        { label: 'Symbol Close All Time High', value: 'SATH' },
        { label: 'Symbol Close All Time Low', value: 'SATL' },
        { label: 'Symbol Close 52-Week High', value: 'S52WH' },
        { label: 'Symbol Close 52-Week Low', value: 'S52WL' },
        { label: 'Symbol Close 13-Week High', value: 'S13WH' },
        { label: 'Symbol Close 13-Week Low', value: 'S13WL' },
        { label: 'Symbol Close 4-Week High', value: 'S4WH' },
        { label: 'Symbol Close 4-Week Low', value: 'S4WL' }
      ],
      rules: {
        name: [
          { required: true, message: 'Enter a name', trigger: 'blur' },
          { required: true, message: 'Enter a name', trigger: 'change' }
        ],
        category: [
          { required: true, message: 'Select Symbol', trigger: 'blur' },
          { required: true, message: 'Select Symbol', trigger: 'change' }
        ],
        timeframe: [
          { required: true, message: 'Select Timeframe', trigger: 'blur' },
          { required: true, message: 'Select Timeframe', trigger: 'change' }
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      symbolList: 'getStockList',
      indexList: 'getIndexList',
    }),
    frequency() {
			return this.$store.state.form.mySignalTimeframe
		},
    signalOptions() {
      if(this.data.direction === 'Short') return [
        { value: 'Trend Score CrossBelow 3', label: 'Trend Score CrossBelow 3' },
        { value: 'Shooting Star followed by a fall', label: 'Shooting Star followed by a fall' },
        { value: 'RSI CrossBelow 75', label: 'RSI CrossBelow 75' },
        { value: 'Symbol Close CrossBelow SMA20', label: 'Symbol Close CrossBelow SMA20' },
        { value: 'SMA20 Gap CrossBelow 0', label: 'SMA20 Gap CrossBelow 0' },
        { value: 'Symbol Close < its\' SMA200 and Optix SMA5 > 65', label: 'Symbol Close < its\' SMA200 and Optix SMA5 > 65' },
        { value: 'Symbol Close < its\' SMA200 and Optix > 70', label: 'Symbol Close < its\' SMA200 and Optix > 70' },
        { value: 'Optix SMA10 > 70 and Optix > 80', label: 'Optix SMA10 > 70 and Optix > 80' },
        { value: 'Optix > 99.5', label: 'Optix > 99.5' },
        { value: 'Symbol Low OPR13 CrossBelow 0', label: 'Symbol Low OPR13 CrossBelow 0' },
        { value: 'Symbol 4 Weeks Low', label: 'Symbol 4 Weeks Low' },
        { value: 'Symbol 13 Weeks Low', label: 'Symbol 13 Weeks Low' },
        { value: 'Symbol 52 Weeks Low', label: 'Symbol 52 Weeks Low' },
        { value: 'Symbol All Time Low', label: 'Symbol All Time Low' },
        { value: 'Head and Shoulders Top', label: 'Head and Shoulders Top' },
        { value: 'Double Top', label: 'Double Top' },
        { value: 'Ascending Channel', label: 'Ascending Channel' }
      ]
      return [
        { value: 'Trend Score CrossAbove 7', label: 'Trend Score CrossAbove 7' },
        { value: 'Hammer followed by a rise', label: 'Hammer followed by a rise' },
        { value: 'RSI CrossAbove 40', label: 'RSI CrossAbove 40' },
        { value: 'Symbol Close CrossAbove SMA20', label: 'Symbol Close CrossAbove SMA20' },
        { value: 'SMA20 Gap CrossAbove 0', label: 'SMA20 Gap CrossAbove 0' },
        { value: 'Symbol Close > its\' SMA200 and Optix SMA5 > 43 After Below 35', label: 'Symbol Close > its\' SMA200 and Optix SMA5 > 43 After Below 35' },
        { value: 'Symbol Close > its\' SMA200 and Optix SMA10 > 43 After Below 35', label: 'Symbol Close > its\' SMA200 and Optix SMA10 > 43 After Below 35' },
        { value: 'Symbol Close > its\' SMA200 and Optix > 43 After Below 30', label: 'Symbol Close > its\' SMA200 and Optix > 43 After Below 30' },
        { value: 'Symbol Close > its\' SMA200 and Optix SMA5 < 35', label: 'Symbol Close > its\' SMA200 and Optix SMA5 < 35' },
        { value: 'Symbol Close > its\' SMA200 and Optix < 30', label: 'Symbol Close > its\' SMA200 and Optix < 30' },
        { value: 'Optix SMA10 < 30 and Optix < 20', label: 'Optix SMA10 < 30 and Optix < 20' },
        { value: 'Optix < 0.5', label: 'Optix < 0.5' },
        { value: 'Symbol High OPR13 CrossAbove 100', label: 'Symbol High OPR13 CrossAbove 100' },
        { value: 'Symbol 4 Weeks High', label: 'Symbol 4 Weeks High' },
        { value: 'Symbol 13 Weeks High', label: 'Symbol 13 Weeks High' },
        { value: 'Symbol 52 Weeks High', label: 'Symbol 52 Weeks High' },
        { value: 'Symbol All Time High', label: 'Symbol All Time High' },
        { value: 'Head and Shoulders Bottom', label: 'Head and Shoulders Bottom' },
        { value: 'Double Bottom', label: 'Double Bottom' },
        { value: 'Triple Tap', label: 'Triple Tap' },
        { value: 'Rounding Bottom', label: 'Rounding Bottom' },
        { value: 'Descending Channel', label: 'Descending Channel' }
      ]
    },
    _direction() {
      return this.data.direction
    }
  },
  watch: {
    frequency: {
      handler(newVal, oldVal) {
        console.log('最大周期 lishan', newVal, oldVal)
        if(newVal) this.timeframeOption = this.updateTimeframeOptions(newVal)
      },
      deep: true
    },
    _direction: {
      handler(newVal) {
        if(newVal === 'Short') this.data.signals = 'Trend Score CrossBelow 3'
        if(newVal === 'Long' || !newVal) this.data.signals = 'Trend Score CrossAbove 7'
      },
      immediate: true
    }
  },
  mounted() {
    this.setBacktestHistory(6)
    this.generateCPMName()
  },
  methods: {
    generateCPMName() {
      const date = new Date()
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      this.data.name = `My Screen ${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    updateTimeframeOptions(currentTimeframe) {
      const timeframeOption = [
        { value: 'Daily', label: 'Daily', disabled: false},
        { value: 'Weekly', label: 'Weekly', disabled: false},
        { value: 'Monthly', label: 'Monthly', disabled: false}
      ]
      const timeframe = this.data.timeframe
      if(currentTimeframe === 'Weekly') {
        if(timeframe === 'Daily') this.data.timeframe = currentTimeframe
        timeframeOption.forEach(option => {
          if(option.value === 'Weekly' || option.value === 'Monthly') option.disabled = false
          else option.disabled = true
        })
      }
      else if(currentTimeframe === 'Monthly') {
        if(timeframe === 'Daily' || timeframe === 'Weekly') this.data.timeframe = currentTimeframe
        timeframeOption.forEach(option => {
          if(option.value === 'Monthly') option.disabled = false
          else option.disabled = true
        })
      }
      return [...timeframeOption]
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
    setBacktestHistory(val) {
      this.data.end_date = timestampToTime(new Date());
      const endDate = new Date(this.data.end_date);
      const startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - val)
      this.data.start_date = timestampToTime(startDate);
    },
    resetForm() {
        this.data = {
          name: '',
          direction: 'Long',
          category: 'Technology',
          relation: 0,
          signal: 'TrendScore',
          signal2: 'Change',
          condition: 0,
          condition2: 0,
          value: 'Close',
          value2: '',
          value3: ''
        }
        this.rowUrl = null
        this.processTips = ''
        this.percentage = 0
        this.generateCPMName()
        // this.$refs['entryChild1'].clearForm()
    },
    async validForm(formName) {
      const validateForm = async (formRef) => {
        return new Promise(resolve => {
          this.$refs[formRef].validate(valid => {
            resolve(valid);
          });
        });
      };
      return await validateForm(formName)
    },
    async saveFormData() {
      debugger
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly')
        return
      }
      this.processTips = `Tips: Based on your conditions, the Scanner is screening stocks...`
      const rowUrl = this.rowUrl
      const {signal,signal2, relation, condition, condition2, value, value2, value3 } = this.data
      let signals = null
      let description = null
      this.percentage = 8
      debugger
      if(relation === 0) {
        signals = [{signal, condition, value }]
        const _condition = this.conditionOptions.find(ele => ele.value === condition)?.label
        description = [`${signal} ${_condition} ${value}`]
      }else {
        signals = [{signal, condition, value: value2}, {signal: signal2, condition: condition2, value: value3}]
        const _condition = this.conditionOptions.find(ele => ele.value === condition)?.label
        const _condition2 = this.conditionOptions.find(ele => ele.value === condition2)?.label
        description = [`${signal} ${_condition} ${value2}`, `${signal2} ${_condition2} ${value3}`]
      }
      const saveData = {...this.data,
        relation: this.data.relation,
        score: relation === 1 ? 2 : 1,
        signals: JSON.stringify(signals),
        start_date: '2005-01-01',
        end_date: '2050-01-01',
        description: JSON.stringify(description)
      }
      const remainProperties = (obj, properties) => {
        debugger
          const newObj = {}
          properties.forEach(property => {
            if (obj.hasOwnProperty(property)) {
              newObj[property] = obj[property]
            }
          })
          return newObj
      }
      // 要删除的属性列表
      const propertiesToRemain = ['category', 'name', 'start_date', 'end_date', 'signals', 'direction', 'relation', 'score', 'description']
      const _saveData = remainProperties(saveData, propertiesToRemain)
      if(this.percentage < 99) this.percentage += 8
      let saveRes
      if(rowUrl) {saveRes = await editMyScreenForm(_saveData, rowUrl)}
      else{saveRes = await saveMyScreenForm(_saveData)}
      // 这里要发请求拿到状态
      const code = saveRes.data?.code
      const failedConditions = [404, 411, 511, 512, 513, 514]
      if(failedConditions.includes(Number(code))) {
        // 保存失败
        return saveRes
      }
      saveRes.data.data = isJson(saveRes.data.data)?JSON.parse(saveRes.data.data):saveRes.data.data
      saveRes.data.data.data = isJson(saveRes.data.data.data)?JSON.parse(saveRes.data.data.data):saveRes.data.data.data
      let url = saveRes.data.data?.url
      this.rowUrl = url
      return saveRes
    },
    async saveCriteriaData(criteriaRef) {
      debugger
			const _this = this
try {
  const tabLength = _this.$refs[criteriaRef].addSignalLength()
			for (let index = 0; index < tabLength; index++) {
				const valid = await _this.$refs[criteriaRef].saveData(index)
				if (!valid) return false
			}
			_this.$refs[criteriaRef].saveScoreValue()
			_this.$refs[criteriaRef].saveSignalsInMarket()
			_this.$refs[criteriaRef].saveDelayBar()
			_this.$refs[criteriaRef].saveRelation()
} catch (error) {
  console.error(error);
  
}
			return _this.$refs[criteriaRef].isSameSignal()
		},
    handleSavedData(criteria) {
			/*
			saveObj should be like this:
			{
				[entry or exit]: {
					score: '',
					signals_in_market: '',
					relation: '',
					delay_bars: '',
					signals: [],
					cond: []
				},
				[entry or exit description]: JSON parsed array,
				indicatorLayout: {
					formIndicators: {
						[entry or exit Signal]: ''
					},
				}
			}
		*/
			const backtestData = cloneDeep(this.$store.state.form.backtestInfo)
			const { signal_list, signal } = this.encodeSignalList(criteria)
			let criteriaDescription = backtestData[`${criteria}_description`]
			let saveObj = {}
			const criteriaObj = {
				score: backtestData[criteria].score,
				signals_in_market: backtestData[criteria].signals_in_market,
				relation: backtestData[criteria].relation,
				delay_bars: backtestData[criteria].delay_bars,
				signals: signal_list,
				cond: criteriaDescription.map((i) => i.rocCond)
			}
			saveObj[criteria] = criteriaObj
			saveObj[`${criteria}_description`] = criteriaDescription
			// saveObj.indicatorLayout.formIndicators[`${criteria}Signal`] = signal
			// saveObj.indicatorLayout = {
			// 	formIndicators: {
			// 		[`${criteria}Signal`]: signal
			// 	}
			// }
			return saveObj
		},
    encodeSignalList(criteria) {
      debugger
			const backtestData = cloneDeep(this.$store.state.form.backtestInfo)
			const signalList = backtestData[criteria].signals
			const isOnlyUseRiskControl = backtestData[criteria].relation == 0
			const criteriaCapFirstL = capitalizeFirstLetter(criteria)
			const signal_list = []
			const b = new SignalCode()
			const isHandleIndicator = criteria.startsWith('entry') || (criteria.startsWith('exit') && !isOnlyUseRiskControl)
			if (isHandleIndicator) {
				signalList.forEach((item) => {
					// publicProperties 中的属性列表都应该保留
					const publicProperties = [
						'extreme_optimism',
						'extreme_pessimism',
						'comparison',
						'condition',
						'newCondition',
						'value',
						'conditionPeriod',
						'period',
						'ids',
						'comparison',
						'ma_period',
						'take_profit',
						'time_in_market',
						'stop_loss'
				]
					const indicators = {
						sentimentIndicator: {
							indicator: item.sentimentIndicator,
							analysis: 'Sentiment'
						},
						technicalIndicator: {
							indicator: item.technicalIndicator,
							analysis: 'Technical'
						},
						riskIndicator: { indicator: 'RC', analysis: 'Exit' },
						symbolIndicator: {
							indicator: item.symbolIndicator,
							analysis: 'Symbol'
						},
						usersOwnIndicator: {
							indicator: item.usersOwnIndicator,
							analysis: 'User'
						}
					}

					for (const [key, value] of Object.entries(indicators)) {
						if (item[key] || publicProperties.includes(item[key])) {
							item.indicator = value.indicator
							item.analysis = value.analysis
							for (const deleteKey of Object.keys(indicators)) {
								delete item[deleteKey]
							}
						}
					}
				})
			}
			const findSignal = (item, index) => {
				let signal = CIQ.findSentiIndicator(item.indicator, null)
				if (!signal) {
					signal = CIQ.findBuiltinTechIndicator(item.indicator, null)
				}
				// 在 symbol indicator list内检索url
				if (!signal) {
					if (CIQ.findSymbolIndicator(item.indicator, null)) {
						return item.indicator
					}
				}

				const usersOwnList = this.$store.state.form[`usersOwn${criteriaCapFirstL}FileHash`]
				return usersOwnList[index] !== ''
						? usersOwnList[index]
						: signal?.url || ''
			}

			let signal = null
			if(isHandleIndicator) signal = backtestData[criteria].signals.map(findSignal)

			if (isOnlyUseRiskControl && criteria.startsWith('exit')) {
				signal = ['']
				signal_list.push({
					code: 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999'
				})
			} else {
				for (let i = 0; i < signalList.length; i++) {
					console.log('未加密前的数据结构', signalList[i])
					const code = b.encode(signalList[i])
					signal_list.push({
						code: code
					})
				}
			}
			delete backtestData[criteria].signals
			return { signal_list, signal }
		},
    reassignBTAttributes(entrySaveObj, exitSaveObj, indicatorLayout, additionalSaveObj) {
      debugger
			let backtestInfo = cloneDeep(this.$store.state.form.backtestInfo)
			backtestInfo['signals'] = JSON.stringify(entrySaveObj['entry']['signals'])
			backtestInfo['cond'] = JSON.stringify(entrySaveObj['entry_description'].map(item => item.rocCond))
			backtestInfo['description'] = JSON.stringify(entrySaveObj['entry_description'].map(item => item.commentDes))
			backtestInfo['score'] = entrySaveObj['entry']['score']
			backtestInfo['signals_in_market'] = entrySaveObj['entry']['signals_in_market']
			backtestInfo['relation'] = entrySaveObj['entry']['relation']
			// backtestInfo.old_uuid = backtestInfo.old_uuid
			// if(!backtestInfo.old_uuid) delete backtestInfo.old_uuid
      // set default value
      backtestInfo = {
        ...backtestInfo,
        start_date: '2005-01-01',
        end_date: '2050-01-01',
        delay_bars: 0,
        subscribe: 0
      }
			const selectedProps = [
				'name',
				'category',
				'timeframe',
				'signals',
        'score',
        'signals_in_market',
        'relation',
        'start_date',
        'end_date',
        'delay_bars',
        'subscribe',
        'cond',
        'description'
			]
			let backtestParams = Object.assign(
				{},
				...selectedProps.map((prop) => ({ [prop]: backtestInfo[prop] }))
			)
      console.log('backtestParams', backtestParams)
      return backtestParams
		},
    async submitForm() {
      debugger
     this.percentage = 5
      let saveRes = null
      try {
        saveRes = await this.saveFormData()
        debugger
        const _resData = saveRes.data.data
        this.rowUrl = _resData.url
      } catch (error) {
        console.error(error);
        this.processTips = ''
        this.percentage = 0
      }
      debugger
     if(!saveRes) {this.processTips = ''; this.percentage = 0; return}
     console.log('success response', saveRes);
     
     const code = saveRes.data.code
     if(code === 511) this.popUpMsgBox('Save failed, Please try again')
     if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('Save failed, Please try again')}
     if(code == 411) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 214 || code == 213 || code === 211) {
        this.popUpMsgBox(`The screen is completed successfully`)
        this.$emit('refreshBTList');
        this.$emit('displayResultsData', saveRes.data.data.data)
      }
      // 运行成或者失败后刷新列表
      if((code == 214 || code == 213)) {
        this.$emit('refreshBTList');
        this.$emit('displayResultsData', saveRes.data.data.data)
      }
      this.processTips = ''
      this.percentage = 0
    },
    async displayData(data) {
      debugger
			let _this = this
      this.rowUrl = data.url
      this.data = {
        ...data,
        name: data.name,
        category: data.category,
        timeframe: data.timeframe
      }
      _this.$refs['entryChild1'].clearForm()
      let displayData = {
        ...data,
        entry_description: {
          commentDes: isJson(data['description']) ? JSON.parse(data['description']) : data['description'],
          rocCond: isJson( data['cond']) ? JSON.parse( data['cond']) :  data['cond']
        },
        entry: {
          score: data['score'],
          signals_in_market: data['signals_in_market'],
          relation: data['relation'],
          signals: data['signals'],
          cond: isJson( data['cond']) ? JSON.parse( data['cond']) :  data['cond']
        }
      }
			console.log('displayData', displayData)
			let signalCode = new SignalCode();
			const parseJsonIfNeeded = (data) => {
				return isJson(data) ? JSON.parse(data) : data;
			};

			const processSignals = (signals) => {
				return Array.isArray(signals) ? [...signals
					.filter(item => typeof item.code === 'string' && !['SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999', 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'].includes(item.code))
					.map(value => signalCode.decode(value.code)), ...signals.filter(item => (!('code' in item) && (typeof item === 'object')))] : []
			};

			const setEditPanel = (childRef, criteria, childName) => {
				const panelLength = criteria.signals.length;
				const childData = { [childName]: criteria };
				_this.$refs[childRef].setEditPanel(panelLength, childData);
			};

			const processCriteria = async (childRef, criteria, childName) => {
				displayData[childName] = parseJsonIfNeeded(criteria);
				displayData[childName]['signals'] = processSignals(displayData[childName]['signals']);
				setEditPanel(childRef, displayData[childName], childName);
			};

			await processCriteria('entryChild1', displayData.entry, 'entry');
      console.log('displayData',displayData)
		},
    displayData(data) {
      debugger
      this.rowUrl = data.url
      const {relation} = data
      const _data = {}
      const signals = isJson(data.signals) ? JSON.parse(data.signals) : data.signals
      signals.forEach((ele, index) => {
        const suffix = index === 0 ? '' : (index + 1)
        _data[`signal${suffix}`] = ele.signal,
        _data[`condition${suffix}`] = ele.condition
        if(relation === 0) _data.value = ele.value
        else _data[`value${(suffix === '' ? 1 : suffix) + 1}`] = ele.value
      })
      this.data = {
        ...data,
        ..._data
      }
		},
    customColorMethod(percentage) {
      if (percentage < 50) {
        return '#66ace5'
      } else if (percentage < 70) {
        return '#66ace5';
      } else if(percentage < 90){
        return '#66ace5';
      }else {
        return '#66ace5';
      }
    },
    setConfig(criteria) {
			// 传入 entry 和 exit 的配置
			return generateConfig(criteria)
		},
  }
}
</script>

<style lang="less" scoped>
.scanner-form {
  .el-select,
  /deep/ .el-form-item__label {
    width: 100%;
  }
  /deep/ .el-input-group__append,
  /deep/ .el-input-group__prepend {
    padding: 0 5px;
  }
/deep/ .el-form-item__label {
  font-weight: 600;
  color: #333;
}
/deep/ .el-button, /deep/ .el-input__inner, /deep/ .el-input-group__append, /deep/ .el-tag, .category-text, .sign {
  font-weight: 500;
}


}
.scanner-form /deep/ .el-input__inner {
  margin-left: 0px;
}
.set-up-container /deep/ .el-input__inner {
  margin-left: 0px;
}
.set-up-container /deep/ .el-form-item__content {
  width: 100%;
}
.signal-container {
  padding: 60px;
}
/deep/ .el-form-item__label {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}
/deep/ .el-button--small, .el-button--small.is-round {
  width: 100%;
}
.processTips {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 32px;
    margin: 42px 0px 0px 0px;
    font-weight: 500;
    color: #606266;
  }
  .processTipsBox {
    height: 100%;
  /deep/ .el-progress-bar__innerText {
    margin: 0px 5px 1px 5px;
    // color: #ffffff !important;
  }
  /deep/ .el-progress-bar__outer {
    height: 100% !important;
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
.signals-div {
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 10px;
  }
</style>