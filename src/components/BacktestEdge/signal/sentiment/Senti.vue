// sentiment indicator input box
<template>
	<div class="senti-container">
		<el-form :model="senti" :rules="rules" ref="sentiForm">
			<div class="ids-container" v-if="indicatorRadio === 'sentiment'">
				<el-form-item label="Extreme Optimism" prop="extreme_optimism">
					<span slot="label">
						<span class="span-box">
							<span>Extreme Optimism:</span>
						</span>
					</span>
					<el-input disabled v-model="senti.extreme_optimism"></el-input>
				</el-form-item>
				<el-form-item label="Extreme Pessimism" prop="extreme_pessimism">
					<span slot="label">
						<span class="span-box">
							<span>Extreme Pessimism:</span>
						</span>
					</span>
					<el-input disabled v-model="senti.extreme_pessimism"></el-input>
				</el-form-item>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						class="condition-radio"
						v-model="conditionRadio"
						label="Indicator Value"
						@change="getConditionRadio"
					>
					</el-radio>
				</el-form-item>
				<!-- <el-form-item  v-show="isROCLike">

				</el-form-item> -->
				<div class="conditionSelect new">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Indicator Value')"
							v-model="senti.newCondition"
							class="newCond"
							filterable
							placeholder="Please select condition"
							@change="ROCLikeChange"
						>
							<el-option
								v-for="item in newConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="conditionInput period" v-show="isROCLike">
					<el-form-item prop="value">
						<el-input
							@input="calculateNewConditions"
							:disabled="!(conditionRadio === 'Indicator Value')"
							v-model="senti.conditionPeriod"
							placeholder="Condition Period"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect" v-show="isROCLike">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Indicator Value')"
							v-model="senti.condition"
							filterable
							placeholder="Please select condition"
						>
							<el-option
								v-for="item in conditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item prop="value">
						<el-input
							:disabled="!(conditionRadio === 'Indicator Value')"
							v-model="senti.value"
							placeholder="Input Value"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="Indicator Moving Average"
						@change="getConditionRadio"
					>
					</el-radio>
				</el-form-item>
				<div class="conditionInput">
					<el-form-item prop="period">
						<el-input
							@input="setPeriod"
							:disabled="!(conditionRadio === 'Indicator Moving Average')"
							placeholder="Input Period"
							v-model="senti.period"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect new">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Indicator Moving Average')"
							v-model="senti.newCondition"
							class="newCond"
							filterable
							placeholder="Please select condition"
							@change="ROCLikeChange"
						>
							<el-option
								v-for="item in newConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="conditionInput period" v-show="isROCLike">
					<el-form-item prop="value">
						<el-input
							@input="calculateNewConditions"
							:disabled="!(conditionRadio === 'Indicator Moving Average')"
							v-model="senti.conditionPeriod"
							placeholder="Condition Period"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect" v-show="isROCLike">
					<el-form-item>
						<el-select
							v-model="senti.condition"
							filterable
							:disabled="!(conditionRadio === 'Indicator Moving Average')"
							placeholder="Please select condition"
						>
							<el-option
								v-for="item in conditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item prop="maValue">
						<el-input
							:disabled="!(conditionRadio === 'Indicator Moving Average')"
							v-model="senti.maValue"
							placeholder="Input Value"
							@input="change($event)"
						></el-input>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
const throttle = require('lodash/throttle')
export default {
  name: 'senti',
  props: {
    criteria: String,
    sentiUrl: String,
    sentiVal: String,
    panelIndex: Number,
    direction: String,
    exitItemCheck: Boolean,
    relation: [String, Number],
    score: [String, Number],
    period: [String, Number],
    delay_bars: [String, Number],
    tabLength: Number,
    indicatorRadio: String
  },
  data() {
    var validateValue = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Please input value'));
      } else if (isNaN(value)) {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (value.startsWith('.') && value.length > 1) {
          value = '0' + value;
          this.senti.value = value
        }
        const pattern = /^((-?[1-9][0-9]*)|(-?[0]\.\d{1,4}|-?[1-9][0-9]*\.\d{1,4}))$/;
        if (!pattern.test(value) && value != 0) {
          return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
        } else {
          callback();
        }
      }
    };
    var validateMaValue = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Please input value'))
      } else if (isNaN(value)) {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'))
      } else if (value) {
        if (value.startsWith('.') && value.length > 1) {
          value = '0' + value;
          this.senti.maValue = value
        }
        const pattern =
          /^((-?[1-9][0-9]*)|(-?[0]\.\d{1,4}|-?[1-9][0-9]*\.\d{1,4}))$/
        if (!pattern.test(value) && value != 0) {
          return callback(new Error('Only numbers with a maximum of four decimal places allowed.'))
        } else {
          callback()
        }
      }
    }
    var validatePeriod = (rule, value, callback) => {
      console.log('period', value)
      if (value === 0 || value === '') {
        return callback(new Error('Please input period'))
      } else if (isNaN(value)) {
        return callback(new Error('Only positive integers allowed.'))
      } else if (value) {
        const pattern = /^[1-9]\d*$/
        if (!pattern.test(value)) {
          return callback(new Error('Only positive integers allowed.'))
        } else {
          callback()
        }
      }
    }
    return {
      isROCLike: false,
      //preload: false,
      senti: {
        extreme_optimism: '',
        extreme_pessimism: '',
        comparison: 'SV',
        condition: 3,
        newCondition: 3,
        value: '',
        conditionPeriod: '5',
        period: '',
        maValue: '',
      },
      periodTemp: '',
      newConditions: [
        { value: 0, label: '>' },
        { value: 1, label: '=' },
        { value: 2, label: '<' },
        { value: 3, label: 'CrossAbove' },
        { value: 4, label: 'CrossBelow' },
        { value: 5, label: 'Rate Of Change' },
        { value: 6, label: 'Range Of Rank' },
        { value: 7, label: 'MA Ratio' }
      ],
      conditions: [
        { value: 0, label: '>' },
        { value: 1, label: '=' },
        { value: 2, label: '<' },
        { value: 3, label: 'CrossAbove' },
        { value: 4, label: 'CrossBelow' }
      ],
      conditionRadio: 'Indicator Value',
      description: '',
      editSentiVal: '',
      rules: {
        value: [{ validator: validateValue, trigger: 'blur' }],
        maValue: [{ validator: validateMaValue, trigger: 'blur' }],
        period: [{ validator: validatePeriod, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['getExtremeValue']),
    extremeValue() {
      return this.getExtremeValue
    },
  },
  watch: {
    extremeValue: {
      handler(newVal) {
        let vm = this
        // To solve the problem that Ma cannot be saved after selecting Ma and then indicator
        if (this.conditionRadio == 'Indicator Moving Average') {
          this.setPeriod(this.senti.period)
        }
        this.calculateNewConditions()

        newVal.forEach((item) => {
          if (item.indicator) {
            if (item.indicator === vm.sentiUrl) {
              // When filling from chartiq, the extreme value changes
              vm.senti.extreme_pessimism = item.extremePessimism
              vm.senti.extreme_optimism = item.extremeOptimism
            }
          }
        })
        //vm.preload = false
      },
      immediate: true,
      deep: true
    },
    sentiUrl: {
      handler(newVal) {
        if (newVal) {
          var obj = CIQ.store.state.conditionRadio
          obj[this.criteria][this.panelIndex] = this.conditionRadio
          CIQ.store.commit('setConditionRadio', obj)

          let vm = this
          let extremeValue = this.$store.state.extremeValue
          extremeValue.forEach((item) => {

            if (item.indicator) {
              if (item.indicator === newVal) {
                vm.senti.extreme_pessimism = item.extremePessimism
                vm.senti.extreme_optimism = item.extremeOptimism
              }
            }
          })
        }
      }
    },
    indicatorRadio: {
      handler(newVal) {
        if (newVal == 'sentiment') {
          this.senti.extreme_optimism = ''
          this.senti.extreme_pessimism = ''
        }
      }
    }
  },
  methods: {
    ROCLikeChange(val) {
      this.isROCLike = 5 <= val && val <= 7
      // 如果不是ROC类型，则这两个condition值一致
      if (!this.isROCLike) {
        this.senti.condition = this.senti.newCondition

        let indicator_url = this.$store.state.indicators.formIndicators[this.criteria][this.panelIndex]
        let indicator_url_with_ma = ''
        if (indicator_url) {
          // 如果当前indicator自带ma,indicator_url改为ma_url
          for (var studyInstanceName in CIQ.stxx.layout.studies) {
            if (
              CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == indicator_url &&
              CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria == this.criteria &&
              CIQ.stxx.layout.studies[studyInstanceName].parameters.index == this.panelIndex
            ) {
              if (CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA') {
                indicator_url_with_ma = Object.keys(CIQ.stxx.layout.studies[studyInstanceName].outputMap)[0]
                break
              }
            }
          }
          for (var studyInstanceName in CIQ.stxx.layout.studies) {
            if (
              (CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == indicator_url_with_ma ||
                (CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == indicator_url &&
                  CIQ.stxx.layout.studies[studyInstanceName].type != 'ST MA')) &&
              CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria == this.criteria &&
              CIQ.stxx.layout.studies[studyInstanceName].parameters.index == this.panelIndex
            ) {
              // 在切换回非ROClike后清除ROCLike indicator
              CIQ.Studies.removeStudy(
                CIQ.stxx,
                CIQ.stxx.layout.studies[studyInstanceName]
              )
            }
          }
        }
      }
      // 开始计算数据并加载新的附属indicator
      this.calculateNewConditions()
    },
    change(e) {
      this.$forceUpdate()
    },
    clearForm() {
      //Object.assign(this.$data, this.$options.data())
      this.$refs.sentiForm.resetFields()
      this.conditionRadio = 'Indicator Value'
      this.periodTemp = ''
    },
    // Clear form authentication
    clearFormValidate() {
      this.$refs.sentiForm.clearValidate()
    },
    setDesciption(index) {
      let rocCond = {
        'newCondition': this.senti.newCondition,
        'conditionPeriod': this.senti.conditionPeriod,
      }
      let criteria = ''
      let direction = ''
      let commentDes
      if (index === 0) {
        if (this.criteria == 'entry') {
          criteria = 'E:'
          direction = this.direction + ';'
        }
        if (this.criteria == 'exit') {
          criteria = 'X:'
          if (this.direction == 'Long') {
            direction = 'Close;'
          } else if (this.direction == 'Short') {
            direction = 'Cover;'
          }
        }
        let relation = ''
        let score = ''
        let period = ''
        switch (this.relation) {
          case 0:
            relation = "Only Risk;"
            break;
          case 1:
            relation = "Single Condition"
            break;
          case 2:
            relation = "SameBar Multi Condition;"
            score = 'Score: ' + this.score + ';'
            break;
          case 3:
            relation = "TimeOrder Multi Condition;"
            period = 'Period: ' + this.period + ';'
            break;
          default:
            break;
        }
        let delay_bars = this.delay_bars ? 'Delay Bars: ' + this.delay_bars + ';' : ''
        console.log(score, period, delay_bars)
        commentDes = `${criteria} ${direction} ${relation} ${score ? score : ''} ${period ? period : ''} ${delay_bars}`

        if (this.relation != 1) {
          let desObj = {}
          desObj.criteria = this.criteria
          desObj.description = {
            'commentDes': commentDes,
            'rocCond': rocCond
          }
          desObj.index = index

          console.log('this.relation != 1', this.criteria, desObj)
          this.$store.commit('saveDescription', desObj)
        }

      }
      let ma = this.senti.period ? 'moving average' : ''
      let period = this.senti.period ? this.senti.period : ''
      let condition = this.conditions[this.senti.condition].label
      let sentiVal = this.sentiVal ? this.sentiVal : this.editSentiVal
      let value =
        this.conditionRadio === 'Indicator Value'
          ? this.senti.value
          : this.senti.maValue
      this.description = `${sentiVal} ${ma} ${period} ${condition} ${value}`
      if (this.isROCLike) {
        let _newCondition = this.newConditions[this.senti.newCondition].label
        const _condition = this.conditions[this.senti.condition].label
        switch (_newCondition) {
          case "Rate Of Change":
            _newCondition = 'ROC'
            break;
          case "Range Of Rank":
            _newCondition = 'ROR'
            break;
          case "MA Ratio":
            _newCondition = 'MAR'
            break;
          default:
            break;
        }
        const _value = this.senti.value
        const _period = this.senti.period
        const _conditionPeriod = this.senti.conditionPeriod
        const _maValue = this.senti.maValue
        const _description1 = `${sentiVal} ${ma} ${_newCondition}${_conditionPeriod} ${_condition} ${_value}`
        const _description2 = `${sentiVal} ${ma} ${_period} ${_newCondition}${_conditionPeriod} ${_condition} ${_maValue}`
        this.description = this.conditionRadio === 'Indicator Value' ? _description1 : _description2
      }
      let desObj = {}
      desObj.criteria = this.criteria
      if (this.relation != 1) {
        desObj.description = {
          'commentDes': this.description,
          'rocCond': rocCond
        }
        desObj.index = index + 1
      }
      if (this.relation == 1) {
        desObj.description = {
          'commentDes': commentDes + this.description,
          'rocCond': rocCond
        }
        desObj.index = 0
      }
      this.$store.commit('saveDescription', desObj)

    },
    getConditionRadio(val) {
      this.clearFormValidate()
      var obj = CIQ.store.state.conditionRadio
      obj[this.criteria][this.panelIndex] = val
      CIQ.store.commit('setConditionRadio', obj)

      if (val === 'Indicator Value') {
        // Clear moving average before switching back to the default senti radio
        this.periodTemp = this.senti.period
        this.senti.period = ''
        this.senti.comparison = 'SV'
        let result
        this.$store.state.indicatorsList.forEach((value, index) => {
          if (value.url == this.sentiUrl) {
            result = value
          }
        })
        if (!result) {
          let obj = {}
          if (this.criteria == 'entry') {
            obj.url = this.$store.state.usersOwnEntryFileHash[this.panelIndex]
          } else {
            obj.url = this.$store.state.usersOwnExitFileHash[this.panelIndex]
          }
          result = obj
        }
        // 限制只移除当前ma
        for (var studyInstanceName in CIQ.stxx.layout.studies) {
          if (
            CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == result.url &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria == this.criteria &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.index == this.panelIndex
            && CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA'
          ) {
            // 为什么不直接判断是否为st ma呢
            // sentiment indicator自带的ROCLike除外
            //if(studyInstanceName.indexOf('‌ST ROCLike‌')!=-1) continue					
            CIQ.Studies.removeStudy(
              CIQ.stxx,
              CIQ.stxx.layout.studies[studyInstanceName]
            )
          }
        }

        var activatedMAList = this.$store.state.activatedMA
        // remove current MA attached to an indicator
        var MAListIndex = activatedMAList.findIndex(
          (item) => item.url == result.url && item.criteria == this.criteria && item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('getMA', activatedMAList)

        this.calculateNewConditions()
      }
      if (val === 'Indicator Moving Average') {
        this.senti.comparison = 'SVMA'
        // Ma is loaded when the default radio is switched to moving average radio
        this.setPeriod(this.periodTemp)
      }
    },
    calculateNewConditions() {
      if (!this.isROCLike) return

      let indicator_url = this.$store.state.indicators.formIndicators[this.criteria][this.panelIndex]
      let indicator_url_with_ma = ''
      if (indicator_url) {
        // 如果当前indicator自带ma,indicator_url改为ma_url
        for (var studyInstanceName in CIQ.stxx.layout.studies) {
          if (
            CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == indicator_url &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria == this.criteria &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.index == this.panelIndex
          ) {
            if (CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA') {
              indicator_url_with_ma = Object.keys(CIQ.stxx.layout.studies[studyInstanceName].outputMap)[0]
              break
            }
          }
        }

        for (var studyInstanceName in CIQ.stxx.layout.studies) {
          if (
            (CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == indicator_url_with_ma ||
              (CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == indicator_url &&
                CIQ.stxx.layout.studies[studyInstanceName].type != 'ST MA')) &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria == this.criteria &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.index == this.panelIndex
          ) {
            // 在切换回非ROClike后清除ROCLike indicator
            CIQ.Studies.removeStudy(
              CIQ.stxx,
              CIQ.stxx.layout.studies[studyInstanceName]
            )
          }
        }
        const conditionMap = new Map([
          [5, { name: 'Rate Of Change', abbr: 'ROC' }],
          [6, { name: 'Range Of Rank', abbr: 'ROR' }],
          [7, { name: 'MA Ratio', abbr: 'MA' }]
        ])
        var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
          display: conditionMap.get(this.senti.newCondition).name,
          Field: indicator_url_with_ma ? indicator_url_with_ma : indicator_url,
          condition: conditionMap.get(this.senti.newCondition).abbr,
          period: this.senti.conditionPeriod
        }, null, {
          criteria: this.criteria,
          index: this.panelIndex
        })

        // 解决附属ma或者roc漂移问题
        CIQ.loadChart(CIQ.store.state.trades, CIQ.addDot)
      }
    },
    setPeriod(val) {
      let _val = val
      if (!_val) {
        _val = 5
      }
      if (this.conditionRadio === 'Indicator Moving Average') {
        this.senti.period = _val
      } else {
        this.senti.period = ''
      }
      let result

      this.$store.state.indicatorsList.forEach((value, index) => {
        if (this.sentiUrl) {
          if (value.url == this.sentiUrl) {
            result = value
          }
        }
      })
      if (!result) {
        let obj = {}
        if (this.criteria == 'entry') {
          obj.url = this.$store.state.usersOwnEntryFileHash[this.panelIndex]
        } else {
          obj.url = this.$store.state.usersOwnExitFileHash[this.panelIndex]
        }
        result = obj
      }
      //console.log('setPeriod',result)
      // If the indicator is not loaded when changing to Ma radio, exit
      if (!result || result.url=='') { return }
      for (var studyInstanceName in CIQ.stxx.layout.studies) {
        if (
          CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == result.url &&
          CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria == this.criteria &&
          CIQ.stxx.layout.studies[studyInstanceName].parameters.index == this.panelIndex
          && CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA'
        ) {
          // 为什么不直接判断是否为st ma呢
          // sentiment indicator自带的ROCLike除外
          //if(studyInstanceName.indexOf('‌ST ROCLike‌')!=-1) continue	
          CIQ.Studies.removeStudy(
            CIQ.stxx,
            CIQ.stxx.layout.studies[studyInstanceName]
          )
        }
      }
      console.log(result)
      var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
        Period: _val,
        display: 'ST MA',
        Field: result.url
      }, null, {
        criteria: this.criteria,
        index: this.panelIndex
      })
      // 解决附属ma或者roc漂移问题
      CIQ.loadChart(CIQ.store.state.trades, CIQ.addDot)

      // keep current MA
      var objMA = {
        period: _val,
        url: result.url,
        criteria: this.criteria,
        index: this.panelIndex
      }
      var activatedMAList = this.$store.state.activatedMA

      // remove current MA attached to an indicator
      var MAListIndex = activatedMAList.findIndex(
        (item) => item.url == result.url && item.criteria == this.criteria && item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      activatedMAList.push(objMA)

      this.$store.commit('getMA', activatedMAList)

      this.calculateNewConditions()
    },

    saveCondition(index) {
      let checked = true
      let validForm
      if (this.conditionRadio === 'Indicator Value' && !this.exitItemCheck) {
        this.$refs['sentiForm'].validateField(['value'], (errorMsg) => {
          if (!errorMsg) {
            validForm = true
          }
        })
        if (validForm) {
          let senti = JSON.parse(JSON.stringify(this.senti))
          senti.period = 1
          delete senti.maValue
          senti.criteria = this.criteria
          senti.index = index
          // 定义一个 vuex 新事件用于保存 condition数据
          this.$store.commit('saveCondition', senti)
          return checked
        } else {
          checked = false
          return checked
        }
      }
      if (this.conditionRadio === 'Indicator Moving Average' && !this.exitItemCheck) {
        let validMaValue = false
        let validatePeriod = false
        this.$refs['sentiForm'].validateField(['maValue'], (errorMsg) => {
          if (!errorMsg) {
            validMaValue = true
          }
        })
        this.$refs['sentiForm'].validateField(['period'], (errorMsg) => {
          if (!errorMsg) {
            validatePeriod = true
          }
        })
        validForm = validMaValue && validatePeriod
        if (validForm) {
          let senti = JSON.parse(JSON.stringify(this.senti))
          senti.value = senti.maValue
          delete senti.maValue
          senti.criteria = this.criteria
          senti.index = index
          this.$store.commit('saveCondition', senti)
          return checked
        } else {
          checked = false
          return checked
        }
      }
      if (this.exitItemCheck) {
        return checked = true
      }
    },
    setEditData(newVal) {
      if (JSON.stringify(newVal) != '{}') {
        let obj = newVal[this.criteria].signals[this.panelIndex]
        // test在samebar(relation 2/3)的情况下

        // handle unexist property for old backtesters
        let cond
        if('cond' in newVal[this.criteria]){
          cond = newVal[this.criteria].cond[(this.relation == 2 || this.relation == 3) ? this.panelIndex + 1 : this.panelIndex]
        }
        
        this.senti.extreme_optimism = obj.extreme_optimism
        this.senti.extreme_pessimism = obj.extreme_pessimism
        this.senti.condition = Number(obj.condition)
        this.senti.value = obj.value
        this.senti.comparison = obj.comparison

        if(cond && Number(cond.newCondition)){
          this.senti.newCondition =  Number(cond.newCondition)
        }else{
          this.senti.newCondition = this.senti.condition
        }

        if(cond){
          this.senti.conditionPeriod = cond.conditionPeriod ? cond.conditionPeriod : ''
        }else{
          this.senti.conditionPeriod = ''
        }
        
        this.conditionRadio = 'Indicator Value'

        this.editSentiVal = obj.indicator
        if (this.senti.comparison === 'SVMA') {
          this.conditionRadio = 'Indicator Moving Average'
          this.senti.maValue = this.senti.value
          this.senti.period = obj.period
        }
        this.ROCLikeChange(this.senti.newCondition)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ids-container {
	.el-form-item {
		display: inline-flex;
	}
	border-bottom: 1px solid #797979;
}
.condition-container {
	display: flex;
}
/deep/ .el-input__inner {
	padding-left: 5px;
	margin-left: 5px;
}
/deep/.el-input--suffix .el-input__inner {
	padding-right: 5px;
}

/deep/ .el-form-item__label {
	margin-right: 36px;
}
@media (min-width: 1280px) and (max-width: 1365px) {
	/deep/ .el-form-item__label {
		margin-right: 10px;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	/deep/ .el-form-item__label {
		margin-right: 0px;
		font-size: 12px;
	}
	.condition-container {
		display: flex;
		flex-wrap: wrap;
	}
}
</style>