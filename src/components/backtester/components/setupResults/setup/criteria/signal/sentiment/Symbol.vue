// symbol indicator input box
<template>
	<div class="senti-container">
		<el-form :model="sym" :rules="rules" ref="symbolForm">
			<div class="condition-container">
				<el-form-item :label="symbolLabel"></el-form-item>
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
				<div class="conditionInput period" v-show="isROCLike">
					<el-form-item prop="value">
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
  },
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
    return {
      isROCLike: false,
      //preload: false,
      sym: {
        comparison: 'SV',
        condition: 3,
        newCondition: 3,
        value: '',
        conditionPeriod: '5',
      },
      newConditions: [
        { value: 0, label: '>' },
        { value: 1, label: '=' },
        { value: 2, label: '<' },
        { value: 3, label: 'CrossAbove' },
        { value: 4, label: 'CrossBelow' },
        { value: 5, label: 'Rate Of Change' },
        { value: 6, label: '% of Previous Range' },
        { value: 7, label: 'MA Ratio' }
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
      },
      symbolLabel: 'Symbol Condition'
    }
  },
  computed: {
    ...mapGetters(['getBeforeCalculateNewConditions', 'getterDirection']),
    beforeCalculateNewConditions() {
      return this.getBeforeCalculateNewConditions
    },
    direction() {
      return this.getterDirection
    }
  },
  watch: {
    beforeCalculateNewConditions: {
      handler(newVal) {
        this.calculateNewConditions()
      },
      immediate: true,
      deep: true
    },
    symVal: {
      handler(newVal) {
        if (CIQ.findSymbolIndicator(this.symVal,null)) this.symbolLabel = newVal
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    ROCLikeChange(val) {
      this.isROCLike = 5 <= val && val <= 7
      // 如果不是ROC类型，则这两个condition值一致
      if (!this.isROCLike) {
        this.sym.condition = this.sym.newCondition
        const fieldName = CIQ.findSymbolIndicator(this.symVal,null).field
        for (var studyInstanceName in CIQ.stxx.layout.studies) {
          if (
            CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == fieldName &&
            CIQ.stxx.layout.studies[studyInstanceName].type != 'ST MA' &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria == this.criteria &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.index == this.panelIndex
          ) {
            // 添加ROCLike（包括修改study）前先清除已有的
            CIQ.Studies.removeStudy(
              CIQ.stxx,
              CIQ.stxx.layout.studies[studyInstanceName]
            )
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
            relation = "Single Signal"
            break;
          case 2:
            relation = "SameBar Multi Signal;"
            score = 'Score: ' + this.score + ';'
            break;
          case 3:
            relation = "TimeOrder Multi Signal;"
            period = 'Period: ' + this.period + ';'
            break;
          default:
            break;
        }
        let delay_bars = this.delay_bars ? 'Delay Bars: ' + this.delay_bars + ';' : ''
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
          default:
            break;
        }
        const _value = this.sym.value
        const _conditionPeriod = this.sym.conditionPeriod
        const _description1 = `${symVal} ${_newCondition}${_conditionPeriod} ${_condition} ${_value}`
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
          'commentDes': commentDes + this.description,
          'rocCond': rocCond
        }
        desObj.index = 0
      }
      console.log('saveDescription', desObj, this.criteria)
      this.$store.commit('form/saveDescription', desObj)

    },
    calculateNewConditions() {
      if (!this.isROCLike) return
      // 用symVal因为symUrl当前生命周期不存在
      if (this.symVal) {
        let symbolCond = CIQ.findSymbolIndicator(this.symVal,null)
        const fieldName = symbolCond?symbolCond.field:''

        for (var studyInstanceName in CIQ.stxx.layout.studies) {
          if (
            CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == fieldName &&
            CIQ.stxx.layout.studies[studyInstanceName].type != 'ST MA' &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria == this.criteria &&
            CIQ.stxx.layout.studies[studyInstanceName].parameters.index == this.panelIndex
          ) {
            // 添加ROCLike（包括修改study）前先清除已有的
            CIQ.Studies.removeStudy(
              CIQ.stxx,
              CIQ.stxx.layout.studies[studyInstanceName]
            )
          }
        }
        const conditionMap = new Map([
          [5, { name: 'Rate Of Change', abbr: 'ROC' }],
          [6, { name: '% of Previous Range', abbr: 'OPR' }],
          [7, { name: 'MA Ratio', abbr: 'MA' }]
        ])


        var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
          display: conditionMap.get(this.sym.newCondition).name,
          Field: fieldName,
          condition: conditionMap.get(this.sym.newCondition).abbr,
          period: this.sym.conditionPeriod
        }, null, {
          criteria: this.criteria,
          index: this.panelIndex
        })
        // 解决附属ma或者roc漂移问题
        CIQ.loadChart(CIQ.store.state.chart.trades, CIQ.addDot)
      }
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
        this.ROCLikeChange(this.sym.newCondition)
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