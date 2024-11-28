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
          prop="symbol"
          >
          <template slot="label">
            <label>
              2. Symbol
            </label>
          </template>
          <el-select
            v-model="data.symbol"
            id="symbolName"
            filterable
            remote
            reserve-keyword
            automatic-dropdown
            placeholder="Enter Keywords"
            :remote-method="remoteMethod"
            @visible-change="remoteMethod"
            :value-key="'key'"
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
              3. Timeframe
            </label>
          </template>
          <el-select
              v-model="data.timeframe"
              placeholder="— Select type —"
            >
              <el-option
                v-for="item in timeframeOption"
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
    </el-form>
    <div class="setup">
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
    </div>
    <br>
    <el-row :gutter="10" type="flex" class="row-bg" justify="center">
        <el-col :span="6">
          <el-button type="warning" size="small" @click="resetForm">Clear Form</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" @click="submitForm" v-show="percentage == 0">Save Signal</el-button>
          <div class="processTipsBox" v-show="percentage != 0">
          <el-progress :text-inside="true" :stroke-width="15" :percentage="percentage" :color="customColorMethod"></el-progress>
          </div>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { isJson, timestampToTime, capitalizeFirstLetter, encodeBase64 } from '@/utils'
import SignalCode from '@/utils/cryptoUtils/codeTool'
import cloneDeep from 'lodash/cloneDeep'
import { saveMySignalForm, editMySignalForm, getScannerBTList, getMySignalResults, perviewScannerForm } from '@/service/service'
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
        timeframe: 'Daily',
        symbol: 'SPY',
      },
      rowUrl: null,
      isPolling: false,
      processTips: '',
      percentage: 0,
      symbolInfo: {strategy: 'Single', symbol: 'SPY', symbol2: ''}, 
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      typeOptions: [
        { value: 'stock', label: 'Stock' },
        { value: 'etf', label: 'ETF' },
        { value: 'stock/etf', label: 'Stock & ETF' },
      ],
      timeframeOption: [
        { value: 'Daily', label: 'Daily', disabled: false},
        { value: 'Weekly', label: 'Weekly', disabled: false},
        { value: 'Monthly', label: 'Monthly', disabled: false}
      ],
      capitalAllocates: [
        { value: 'Kelly', label: 'Auto Allocation'},
        { value: 'manual_input', label: 'Manual Input'}
      ],
      rules: {
        name: [
          { required: true, message: 'Enter a name', trigger: 'blur' },
          { required: true, message: 'Enter a name', trigger: 'change' }
        ],
        symbol: [
          { required: true, message: 'Select Symbol', trigger: 'blur' },
          { required: true, message: 'Select Symbol', trigger: 'change' }
        ],
        timeframe: [
          { required: true, message: 'Select Timeframe', trigger: 'blur' },
          { required: true, message: 'Select Timeframe', trigger: 'change' }
        ],
      },
      options: []
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
    // timeframeOption() {
    //   const currentTimeframe = this.$store.state.form.exitFrequency
    //   console.log('周期', currentTimeframe)
    //   return this.updateTimeframeOptions(currentTimeframe)
    // }
  },
  watch: {
    frequency: {
      handler(newVal, oldVal) {
        console.log('最大周期 lishan', newVal, oldVal)
        if(newVal) this.timeframeOption = this.updateTimeframeOptions(newVal)
      },
      deep: true
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
      this.data.name = `My Signal ${year}-${month}-${day} ${hour}:${minute}:${second}`
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
        if(timeframe === 'Daily') this.data.timeframe = currentTimeframe
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
          ...this.data,
          timeframe: 'Daily',
          symbol: 'SPY'
        }
        this.rowUrl = null
        this.processTips = ''
        this.percentage = 0
        this.generateCPMName()
        this.$refs['entryChild1'].clearForm()
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
      const _this = this
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly')
        return
      }
      // 初始化表单数据
      _this.$store.commit('form/initialBacktestInfo')
      this.processTips = `Tips: Based on your conditions, the Scanner is screening stocks...`
      const rowUrl = this.rowUrl
      this.percentage = 8
      this.$store.commit('form/setBd', this.data)

      const saveAndCheckCriteriaErrors = async (childName) => {
				const err = await _this.saveCriteriaData(childName);
				return err;
			};
			const checkAndHandleError = (err, errMsg) => {
				if (!err) {
					_this.popUpMsgBox(errMsg);
					return true;
				}
				return false;
			};
			const entryErr = await saveAndCheckCriteriaErrors('entryChild1')
			const errMsg = 'Error saving signal criteria...'
			if (checkAndHandleError(entryErr, errMsg)) return
			const saveObj = (type) => _this.handleSavedData(type);
			const entrySaveObj = saveObj('entry');
			const saveData = _this.reassignBTAttributes(entrySaveObj);
      debugger
      if(this.percentage < 99) this.percentage += 8
      let saveRes
      if(rowUrl) {saveRes = await editMySignalForm(saveData, rowUrl)}
      else{saveRes = await saveMySignalForm(saveData)}
      // 这里要发请求拿到状态
      const code = saveRes.data?.code
      const failedConditions = [404, 411, 511, 512, 513, 514]
      if(failedConditions.includes(Number(code))) {
        // 保存失败
        return saveRes
      }
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
				'symbol',
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
      if(code == 211 || code == 213) this.popUpMsgBox(`The signal is completed successfully`)
      // 运行成或者失败后刷新列表
      if((code == 211 || code == 213)) this.$emit('refreshBTList')
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
        symbol: data.symbol,
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
    remoteMethod: throttle(async function(query) {
      let vm = this
      if (typeof query == 'boolean' && query){ // 点击搜索栏初始化列表
        vm.loading = true
        var symbolListTemp = vm.symbolList.map((item, index) => {
          return { value: `${item.stock}`, label: `${item.stock}`, name: `${item.name}`, key: `${item.name}_${item.stock}_${index}` }
        })
        var IndexListTemp = vm.indexList.map((item, index) => {
          return { value: `${item.symbol}`, label: `${item.symbol}`, name: `${item.name}`, key: `${item.name}_${item.symbol}_${index}` }
        })
        
        vm.getCustomStocksList()

        this.options = symbolListTemp.concat(IndexListTemp).concat(vm.customStocksList)
        vm.loading = false
      }
      else if (typeof query != 'boolean' && query !== '') {
        vm.loading = true
        var symbolListTemp = vm.symbolList.map((item, index) => {
          return { value: `${item.stock}`, label: `${item.stock}`, name: `${item.name}`, key: `${item.name}_${item.stock}_${index}` }
        }).filter((item) => {
          return (
            item.key.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        })
        var IndexListTemp = vm.indexList.map((item, index) => {
          return { value: `${item.symbol}`, label: `${item.symbol}`, name: `${item.name}`, key: `${item.name}_${item.symbol}_${index}` }
        }).filter((item) => {
          return (
            item.key.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        })
        var customStocksListTemp = vm.customStocksList.filter((item) => {
          return (
            item.key.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        })
       
        let list = symbolListTemp.concat(IndexListTemp).concat(customStocksListTemp)
        let options = []
        let wholeWord = []
        // keyword全匹配
        for (var item of list) {
          if (
            item.value.toLowerCase() === query.toLowerCase() ||
            item.label.toLowerCase() === query.toLowerCase()
          ) {
            wholeWord.push(item)
            continue
          }
          options.push(item)
        }
        options.unshift(...wholeWord)
        // 去重
        this.options = options
        // 解除遮罩
        vm.loading = false
      } else {
        this.options = []
      }
    }, 500),
    getCustomStocksList() {
      let vm = this
      vm.customStocksList = vm.$store.getters.getMySymbollist.map((item, index) => {
        let url = encodeBase64(item.name) + '||' + encodeBase64(item.url)
        return { value: `${url}`, label: `${item.name}`, name: `${item.name}`, key: `${item.name}_${item.url}_${index}` }
      })
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
</style>