// sentiment indicator input box
<template>
	<div class="senti-container">
		<el-form :model="senti" :rules="rules" ref="sentiForm" label-position="left" size="small">
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
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
					<el-form-item size="small">
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
				<div class="conditionInput period" v-show="isROCLike && senti.newCondition!=12 && senti.newCondition!=13">
					<el-form-item prop="conditionPeriod" size="small">
						<el-input
							:disabled="!(conditionRadio === 'Indicator Value')"
							v-model="senti.conditionPeriod"
							placeholder="Condition Period"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect" v-show="isROCLike">
					<el-form-item size="small">
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
					<el-form-item prop="value" size="small">
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
        <div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="ma_type"
							filterable
							:disabled="!(conditionRadio === 'Indicator Moving Average')"
							placeholder="Please select condition"
              @change="setPeriod(senti.period)"	
						>
							<el-option
								v-for="item in MATypeConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
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
					<el-form-item prop="conditionPeriod">
						<el-input
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
      <div class="condition-container">
        <el-form-item class="indicator-alignment">
					<el-radio
						class="condition-radio"
						v-model="conditionRadio"
						label="Indicator Value "
						@change="getConditionRadio"
					>
					</el-radio>
				</el-form-item>
        <div class="conditionSelect">
					<el-form-item size="small">
						<el-select
							:disabled="!(conditionRadio === 'Indicator Value ')"
							v-model="senti.newCondition"
              @change="ROCLikeChange"
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
					<el-form-item>
						<el-link type="info" :underline="false" class="ISL-text">Indicator Moving Average </el-link>
					</el-form-item>
				</div>
        <div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="ma_type"
							filterable
							:disabled="!(conditionRadio === 'Indicator Value ')"
							placeholder="Please select condition"
              @change="setPeriod(senti.period)"	
						>
							<el-option
								v-for="item in MATypeConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item prop="period" size="small">
						<el-input
							:disabled="!(conditionRadio === 'Indicator Value ')"
							v-model="senti.period"
							placeholder="Input Period"
              @input="setPeriod"
						></el-input>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from '@/components/common/chart/st-development/js'
const debounce = require('lodash/debounce')

import { mapGetters } from 'vuex'
import { CommonMethodsMixin } from "@/components/common/mixins/commonMethodsMixin"
export default {
  name: 'senti',
  props: {
    criteria: String,
    sentiUrl: String,
    sentiVal: String,
    panelIndex: Number,
    isRiskControl: Boolean,
    relation: [String, Number],
    score: [String, Number],
    period: [String, Number],
    delay_bars: [String, Number],
    tabLength: Number,
    indicatorRadio: String,
    isLimit: Boolean
  },
  mixins: [CommonMethodsMixin],
  data() {
    var validateValue = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Please input value'));
      } else if (isNaN(value)) {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
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
    var validateConditionPeriod = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Please input value'));
      } else if (isNaN(value)) {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
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
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
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
        conditionPeriod: '21',
        period: '',
        maValue: ''
      },
      periodTemp: '',
      newConditions: [
        { value: 0, label: '>' },
        { value: 1, label: '=' },
        { value: 2, label: '<' },
        { value: 3, label: 'CrossAbove' },
        { value: 4, label: 'CrossBelow' },
        { value: 5, label: 'Rate Of Change' },
        { value: 6, label: '% of Previous Range' },
        { value: 7, label: 'MA Ratio' },
        { value: 8, label: 'Range Rank' },
        { value: 9, label: 'DrawDown %' },
        { value: 10, label: 'DrawUp %' },
        { value: 11, label: 'Net Change' },
        { value: 12, label: 'All-time High' },
        { value: 13, label: 'All-time Low' },
        { value: 14, label: 'Consecutive Number of Days Above' },
        { value: 15, label: 'Consecutive Number of Days Below' },
      ],
      conditions: [
        { value: 0, label: '>' },
        { value: 1, label: '=' },
        { value: 2, label: '<' },
        { value: 3, label: 'CrossAbove' },
        { value: 4, label: 'CrossBelow' }
      ],
      MATypeConditions: [
        { value: 'S', label: 'Simple' },
        { value: 'E', label: 'Exponential' },
      ],
      conditionRadio: 'Indicator Value',
      description: '',
      editSentiVal: '',
      ma_type: 'S',
      rules: {
        value: [{ validator: validateValue, trigger: 'blur' }],
        conditionPeriod: [{ validator: validateConditionPeriod, trigger: 'blur' }],
        maValue: [{ validator: validateMaValue, trigger: 'blur' }],
        period: [{ validator: validatePeriod, trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters(['getExtremeValue', 'getterDirection']),
    extremeValue() {
      return this.getExtremeValue
    },
    direction() {
      return this.getterDirection
    },
    updateSettingROC() {
			return this.$store.state.chart.studySettingROC
		},
  },
  methods: {
    ROCLikeChange(val,limit) {
      this.isROCLike = 5 <= val && val <= 15
      // 如果不是ROC类型，则这两个condition值一致
      if (!this.isROCLike) this.senti.condition = this.senti.newCondition
      
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
      debugger
      let rocCond = {
        'newCondition': this.senti.newCondition,
        'conditionPeriod': this.senti.conditionPeriod,
        'ma_type': this.ma_type
      }
      let commentDes = ''
      if (index === 0 && this.relation >= 2) {
        let relation = ''
        let score = ''
        let period = ''
        switch (this.relation) {
          case 0:
            relation = "Only Risk;"
            break;
          case 1:
            relation = ""
            break;
          case 2:
            relation = "SameBar Multi Condition;"
            score = 'Score: ' + this.score + ';'
            break;
          case 3:
            relation = "TimeOrder Multi Condition;"
            const periodText = !this.isLimit ? 'No Limit' : this.period;
            period = 'Period: ' + periodText + ';'
            break;
          default:
            break;
        }
        let delay_bars = this.delay_bars ? 'Delay Bars: ' + this.delay_bars + ';' : ''
        console.log(score, period, delay_bars)
        commentDes = `${relation?`${relation} `:''}${score ? `${score} ` : ''}${period ? `${period} ` : ''}${delay_bars}`

        if (this.relation != 1) {
          let desObj = {}
          desObj.criteria = this.criteria
          desObj.description = {
            'commentDes': commentDes,
            'rocCond': rocCond
          }
          desObj.index = index

          console.log('this.relation != 1', this.criteria, desObj)
          this.$store.commit('form/saveDescription', desObj)
        }

      }
      let ma = this.senti.period ? 'Moving Average' : ''
      let period = this.senti.period ? this.senti.period : ''
      let condition = this.conditions[this.senti.condition]?.label
      let sentiVal = this.sentiVal ? this.sentiVal : this.editSentiVal
      let value =
        this.conditionRadio === 'Indicator Value'
          ? this.senti.value
          : this.senti.maValue
      let ma_type = (this.conditionRadio === 'Indicator Moving Average' || this.conditionRadio === 'Indicator Value ') ? this.ma_type : ''
      if(ma_type === 'S') ma_type = 'Simple'
      if(ma_type === 'E') ma_type = 'Exponential'
      this.description = `${sentiVal} ${ma_type !== '' ? ma_type + ' ' : ''}${ma} ${period} ${condition} ${value}`
      if(this.conditionRadio == 'Indicator Value ') this.description = `${sentiVal} ${condition} ${ma_type?`${ma_type} `:''}Moving Average ${period}`
      if (this.isROCLike) {
        let _newCondition = this.newConditions[this.senti.newCondition].label
        const _condition = this.conditions[this.senti.condition].label
        switch (_newCondition) {
          case "Rate Of Change":
            _newCondition = 'ROC'
            break;
          case "% of Previous Range":
            _newCondition = 'OPR'
            break;
          case "MA Ratio":
            _newCondition = 'MAR'
            break;
          case "Range Rank":
            _newCondition = 'RR'
            break;
          case "DrawDown %":
            _newCondition = 'DD'
            break;
          case "DrawUp %":
            _newCondition = 'DU'
            break;
          case "Net Change":
            _newCondition = 'NC'
            break;
          case "All-time High":
            _newCondition = 'ATH'
            break;
          case "All-time Low":
            _newCondition = 'ATL'
            break;
          case "Consecutive Number of Days Above":
            _newCondition = 'CNDA'
            break;
          case "Consecutive Number of Days Below":
            _newCondition = 'CNDB'
            break;
          default:
            break;
        }
        const _value = this.senti.value
        const _period = this.senti.period
        const _conditionPeriod = this.senti.conditionPeriod
        const _maValue = this.senti.maValue
        
        let _description1,_description2
        if([12,13].includes(this.senti.newCondition)){
          _description1 = `${sentiVal} ${ma_type ? `${ma_type} ` : ''}${ma} ${_newCondition} ${_condition} ${_value}`
          _description2 = `${sentiVal} ${ma_type ? `${ma_type} ` : ''}${ma} ${_period} ${_newCondition} ${_condition} ${_maValue}`
        }else if(this.senti.newCondition == 14){
          _description1 = `Consecutive Number of Days with ${sentiVal} Above ${_conditionPeriod} ${_condition} ${_value}`
          _description2 = `Consecutive Number of Days with ${sentiVal} ${ma_type ? `${ma_type} ` : ''}${ma} ${_period} Above  ${_conditionPeriod} ${_condition} ${_maValue}`
        }else if(this.senti.newCondition == 15){
          _description1 = `Consecutive Number of Days with ${sentiVal} Below ${_conditionPeriod} ${_condition} ${_value}`
          _description2 = `Consecutive Number of Days with ${sentiVal} ${ma_type ? `${ma_type} ` : ''}${ma} ${_period} Below  ${_conditionPeriod} ${_condition} ${_maValue}`
        }else{
          _description1 = `${sentiVal} ${ma_type ? `${ma_type} ` : ''}${ma} ${_newCondition}${_conditionPeriod} ${_condition} ${_value}`
          _description2 = `${sentiVal} ${ma_type ? `${ma_type} ` : ''}${ma} ${_period} ${_newCondition}${_conditionPeriod} ${_condition} ${_maValue}`
        }

        if(this.conditionRadio === 'Indicator Value') {this.description = _description1}
        else if(this.conditionRadio === 'Indicator Moving Average'){this.description = _description2}
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
          'commentDes': this.description,
          'rocCond': rocCond
        }
        desObj.index = 0
      }
      this.$store.commit('form/saveDescription', desObj)

    },
    getConditionRadio(val) {
      this.clearFormValidate()
      var obj = CIQ.store.state.form.conditionRadio
      obj[this.criteria][this.panelIndex] = val
      CIQ.store.commit('form/setConditionRadio', obj)

      if (val === 'Indicator Value') {
        // Clear moving average before switching back to the default senti radio
        this.periodTemp = this.senti.period
        // this.senti.period = ''
        this.senti.comparison = 'SV'
        var activatedMAList = this.$store.state.chart.activatedMA
        this.$store.commit('chart/getMA', activatedMAList)

      }
      if (val === 'Indicator Moving Average') {
        this.senti.comparison = 'SVMA'
        this.ma_type = 'S'
        // Ma is loaded when the default radio is switched to moving average radio
        this.setPeriod(this.senti.period)
      }
      if(val === 'Indicator Value ') {
        this.senti.comparison = 'SV'
        this.senti.value = ''
        this.senti.newCondition = 3 //  初始化单选框值
        this.ROCLikeChange(this.senti.newCondition)
        this.ma_type = 'S'
        this.setPeriod(this.senti.period)    
      }
    },
    setPeriod : debounce(function (val) {
      let _val = val
      // if (!_val) {
      //   _val = 5
      // }
      if (this.conditionRadio === 'Indicator Moving Average' || this.conditionRadio === 'Indicator Value ') {
        this.senti.period = _val
      } else {
        this.senti.period = ''
      }
      let result
      if(this.sentiUrl) result = CIQ.findSentiIndicator(null,this.sentiUrl)
      if (!result) {
        let obj = {}
        if (this.criteria.startsWith('entry')) {
          obj.url = this.$store.state.form.usersOwnEntryFileHash[this.panelIndex]
        } else {
          obj.url = this.$store.state.form.usersOwnExitFileHash[this.panelIndex]
        }
        result = obj
      }
      //console.log('setPeriod',result)
      // If the indicator is not loaded when changing to Ma radio, exit
      if (!result || result.url=='') { return }
      // keep current MA
      var objMA = {
        type: this.ma_type == 'S' ? 'simple' : 'exponential',
        period: _val,
        url: result.url,
        criteria: this.criteria,
        index: this.panelIndex,
      }
      var activatedMAList = this.$store.state.chart.activatedMA

      // remove current MA attached to an indicator
      var MAListIndex = activatedMAList.findIndex(
        (item) => item.url == result.url && item.criteria == this.criteria && item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      activatedMAList.push(objMA)

      this.$store.commit('chart/getMA', activatedMAList)

    }, 500),

    saveCondition(index) {
      let checked = true
      let validForm
      if (this.conditionRadio === 'Indicator Value' && !this.isRiskControl) {
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
          this.$store.commit('form/saveCondition', senti)
          return checked
        } else {
          checked = false
          return checked
        }
      }
      if (this.conditionRadio === 'Indicator Value ' && !this.isRiskControl) {
        let validPeriod = false
        this.$refs['sentiForm'].validateField(['period'], (errorMsg) => {
          if (!errorMsg) {
            validPeriod = true
          }
        })
        if (validPeriod) {
          let senti = JSON.parse(JSON.stringify(this.senti))
          senti.value = 'SVMA'
          delete senti.maValue
          senti.criteria = this.criteria
          senti.index = index
          // 定义一个 vuex 新事件用于保存 condition数据
          this.$store.commit('form/saveCondition', senti)
          return checked
        } else {
          checked = false
          return checked
        }
      }
      if (this.conditionRadio === 'Indicator Moving Average' && !this.isRiskControl) {
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
          this.$store.commit('form/saveCondition', senti)
          return checked
        } else {
          checked = false
          return checked
        }
      }
      if (this.isRiskControl) {
        return checked = true
      }
    },
    setEditData(newVal) {
      if (JSON.stringify(newVal) != '{}') {
        debugger
        let obj = newVal[this.criteria].signals[this.panelIndex]
        if(typeof obj == 'string') return
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
          this.ma_type = cond.ma_type || 'S'
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
        if(this.senti.comparison == 'SV' && this.senti.value === 'SVMA') {
          this.conditionRadio = 'Indicator Value '
          this.senti.period = obj.period
          this.senti.value = ''
        }

        // long: ROC加载脱离了setup表单渲染的限制，在restoreIndicatorLayoutView外部调用loopCalculateNewConditions
        // 之後用loopCalculateNewConditions代替senti組件内部的CalculateNewConditions,這一塊隱藏
  this.ROCLikeChange(this.senti.newCondition,this.$store.getters.getIsMarkerShownFlagState)
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
  display: flex;
  justify-content: space-between;
}
.condition-container {
	display: flex;
  align-items: center;
}
.el-select {
  margin: 0 5px;
}
.el-radio, /deep/ .el-form-item__label {
  margin-right: 5px;
}
.extreme-optimism /deep/ .el-form-item__label {
  width: 140px;
}
.indicator-alignment /deep/ label.el-radio.condition-radio {
  width: 135px;
}
.ISL-text {
	cursor: auto;
	font-size: 12px;
	margin-right: 5px;
}
.ISL-text:hover {
	color: #909399;
}
</style>