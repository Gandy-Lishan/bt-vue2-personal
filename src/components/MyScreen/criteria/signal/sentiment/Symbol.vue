// symbol indicator input box
<template>
	<div class="senti-container">
		<el-form :model="sym" :rules="rules" ref="symbolForm" size="small">
			<div class="condition-container">
				<el-form-item :label="symbolLabel" class="indicator-alignment"></el-form-item>
				<div class="conditionSelect new">
					<el-form-item>
						<el-select
							v-model="sym.newCondition"
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
				<div class="conditionInput period" v-show="isROCLike && sym.newCondition!=12 && sym.newCondition!=13">
					<el-form-item prop="conditionPeriod">
						<el-input
							@input="calculateNewConditions"
							v-model="sym.conditionPeriod"
							placeholder="Condition Period"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect" v-show="isROCLike">
					<el-form-item>
						<el-select
							v-model="sym.condition"
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
						<el-input v-model="sym.value" placeholder="Input Value"></el-input>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from '@/components/common/chart/st-development/js'
import { mapGetters } from 'vuex'
import { CommonMethodsMixin } from "@/components/common/mixins/commonMethodsMixin"
import { getCoresSymbolDual } from '@/utils/globalFunc'
export default {
  name: 'symbol',
  props: {
    criteria: String,
    symUrl: String,
    symVal: String,
    panelIndex: Number,
    isRiskControl: Boolean,
    relation: [String, Number],
    score: [String, Number],
    period: [String, Number],
    delay_bars: [String, Number],
    tabLength: Number,
    isLimit: Boolean
  },
  mixins: [CommonMethodsMixin],
  data() {
    var validateValue = (rule, value, callback) => {
      console.log('symbol OHLCV', value)
      if (value === '') {
        return callback(new Error('Please input value'));
      } else if (isNaN(value)) {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
          value = '0' + value;
          this.sym.value = value
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
          this.sym.value = value
        }
        const pattern = /^((-?[1-9][0-9]*)|(-?[0]\.\d{1,4}|-?[1-9][0-9]*\.\d{1,4}))$/;
        if (!pattern.test(value) && value != 0) {
          return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
        } else {
          callback();
        }
      }
    };
    return {
      isROCLike: false,
      //preload: false,
      sym: {
        comparison: 'SV',
        condition: 3,
        newCondition: 3,
        value: '',
        conditionPeriod: '21',
      },
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
        { value: 16, label: 'N-Bars High' },
        { value: 17, label: 'N-Bars Low' },
        { value: 18, label: 'N-Bars Ago' },
      ],
      conditions: [
        { value: 0, label: '>' },
        { value: 1, label: '=' },
        { value: 2, label: '<' },
        { value: 3, label: 'CrossAbove' },
        { value: 4, label: 'CrossBelow' }
      ],
      description: '',
      editTechVal: '',
      rules: {
        value: [{ validator: validateValue, trigger: 'blur' }],
        conditionPeriod: [{ validator: validateConditionPeriod, trigger: 'blur' }],
      },
      symbolLabel: 'Symbol Condition'
    }
  },
  computed: {
    ...mapGetters(['getterDirection']),
    direction() {
      return this.getterDirection
    },
    updateSettingROC() {
			return this.$store.state.chart.studySettingROC
		},
  },
  watch: {
    symVal: {
      handler(newVal) {
        debugger
        if (CIQ.findSymbolIndicator(this.symVal,null)) this.symbolLabel = newVal
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    ROCLikeChange(val,limit) {
      this.isROCLike = 5 <= val && val <= 18
      // 如果不是ROC类型，则这两个condition值一致
      if (!this.isROCLike) {
        this.sym.condition = this.sym.newCondition
      }
    },
    change(e) {
      this.$forceUpdate()
    },
    clearForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.symbolForm.resetFields()
    },
    // Clear form authentication
    clearFormValidate() {
      this.$refs.symbolForm.clearValidate()
    },
    setDesciption(index) {
      let rocCond = {
        'newCondition': this.sym.newCondition,
        'conditionPeriod': this.sym.conditionPeriod,
      }
      let commentDes
      if (index === 0) {
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
      let period = this.sym.period ? this.sym.period : ''
      let condition = this.conditions[this.sym.condition].label
      let symVal = this.symVal ? this.symVal : this.editTechVal
      this.description = `${symVal} ${period} ${condition} ${this.sym.value}`
      if (this.isROCLike) {
        let _newCondition = this.newConditions[this.sym.newCondition].label
        const _condition = this.conditions[this.sym.condition].label
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
          case "N-Bars High":
            _newCondition = 'NH'
            break;
          case "N-Bars Low":
            _newCondition = 'NL'
            break;
          case "N-Bars Ago":
            _newCondition = 'NA'
            break;
          default:
            break;
        }
        const _value = this.sym.value
        const _conditionPeriod = this.sym.conditionPeriod
        let _description1
        if([12,13].includes(this.sym.newCondition)){
          _description1 =`${symVal} ${_newCondition} ${_condition} ${_value}`
        }else if(this.sym.newCondition == 14){
          _description1 = `Consecutive Number of Days with ${symVal} Above ${_conditionPeriod} ${_condition} ${_value}`
        }else if(this.sym.newCondition == 15){
          _description1 = `Consecutive Number of Days with ${symVal} Below ${_conditionPeriod} ${_condition} ${_value}`
        }else{
          _description1 = `${symVal} ${_newCondition}${_conditionPeriod} ${_condition} ${_value}`
        }

        this.description = _description1
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
      console.log('saveDescription', desObj, this.criteria)
      this.$store.commit('form/saveDescription', desObj)

    },
    saveCondition(index) {
      let checked = true
      let validForm
      if (!this.isRiskControl) {
        this.$refs['symbolForm'].validateField(['value'], (errorMsg) => {
          if (!errorMsg) {
            validForm = true
          }
        })
        if (validForm) {
          let sym = JSON.parse(JSON.stringify(this.sym))
          sym.criteria = this.criteria
          sym.index = index
          // 定义一个 vuex 新事件用于保存 condition数据
          this.$store.commit('form/saveCondition', sym)
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
        let obj = newVal[this.criteria].signals[this.panelIndex]
        // test在samebar(relation 2/3)的情况下
        let cond = newVal[this.criteria].cond[(this.relation == 2 || this.relation == 3) ? this.panelIndex + 1 : this.panelIndex]
        this.sym.condition = Number(obj.condition)
        this.sym.value = obj.value
        this.sym.comparison = obj.comparison

        this.sym.newCondition = Number(cond.newCondition) ? Number(cond.newCondition) : this.sym.condition
        this.sym.conditionPeriod = cond.conditionPeriod ? cond.conditionPeriod : ''
        this.editTechVal = obj.indicator

        // long: ROC加载脱离了setup表单渲染的限制，在restoreIndicatorLayoutView外部调用loopCalculateNewConditions
        // 之後用loopCalculateNewConditions代替senti組件内部的CalculateNewConditions,這一塊隱藏
        this.ROCLikeChange(this.sym.newCondition,this.$store.getters.getIsMarkerShownFlagState)

        this.clearFormValidate()
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
.indicator-alignment /deep/ label.el-form-item__label {
  width: 135px;
  text-align: left;
}
</style>