// Elder-Ray-Like input box
<template>
	<div class="senti-container">
		<!-- <p class="hint">Hint: To change the indicator settings, right click the indicator in the above chart and select "Edit Setting"</p> -->
		<el-form :model="tech" :rules="rules" ref="eriForm" size="mini">
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
					<el-radio
						v-model="conditionRadio"
						label="Indicator hist1"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Indicator hist1')"
							v-model="tech.condition"
							size="mini"
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
							:disabled="!(conditionRadio === 'Indicator hist1')"
							v-model="tech.value"
							placeholder="Input Value"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
					<el-radio
						v-model="conditionRadio"
						label="Indicator hist2"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Indicator hist2')"
							v-model="tech.condition"
							size="mini"
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
						<el-input
							:disabled="!(conditionRadio === 'Indicator hist2')"
							v-model="tech.value"
							placeholder="Input Value"
						></el-input>
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
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,

		panelIndex: Number,
		isActived: Boolean,
		isRiskControl: Boolean,
		relation: [String, Number],
score: [String, Number],
period: [String, Number],
delay_bars: [String, Number],
		tabLength: Number,
		isLimit: Boolean
	},
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
          this.tech.value = value
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
			tech: {
				ids: 'ERI',
				condition: 0,
				value: 0,
				comparison: 'ERIH1'
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' }
			],
			conditionRadio: 'Indicator hist1',
			description: '',
			editTechVal: '',
			rules: {
				value: [{ validator: validateValue, trigger: 'blur' }]
			}
		}
	},
	watch: {
		isActived: {
			handler(newVal) {
				if(newVal) {
					
					var obj = CIQ.store.state.form.conditionRadio
					obj[this.criteria][this.panelIndex] = this.conditionRadio
					CIQ.store.commit('form/setConditionRadio', obj)
				}
			},
			immediate: true,
			deep: true
		}
	},
	computed: {
		...mapGetters(['getterDirection']),
		direction() {
      return this.getterDirection
    }
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.$refs.eriForm.resetFields()
		},
		clearFormValidate() {
			this.$refs.eriForm.clearValidate()
		},
		setDesciption(index) {
			let commentDes
			if(index === 0) {
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
				let delay_bars = this.delay_bars?'Delay Bars: ' + this.delay_bars + ';':''
				commentDes = `${relation ? `${relation} ` : ''}${score?`${score} `:''}${period?`${period} `:''}${delay_bars}`
				 if(this.relation != 1) {let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = {
						'commentDes':commentDes,
						'rocCond':null
					}
					desObj.index = index
					this.$store.commit('form/saveDescription', desObj)}  
				   
			}
			let techVal = this.techVal ? this.techVal : this.editTechVal
			let condition = this.conditions[this.tech.condition].label
			let isPositive = 'Hist 1'
			if (this.conditionRadio === 'Indicator hist2') {
				isPositive = 'Hist 2'
			}
			this.description = `${techVal} ${isPositive} ${condition} ${this.tech.value}`
				let desObj = {}
				desObj.criteria = this.criteria
					if(this.relation != 1) {
					desObj.description = {
						'commentDes':this.description,
						'rocCond':null
					}
					desObj.index = index + 1
					}
					if(this.relation == 1)  {
						desObj.description = {
							'commentDes':this.description,
							'rocCond':null
						}
						desObj.index = 0
					}
				this.$store.commit('form/saveDescription', desObj)
		},
		getConditionRadio(val) {
			this.conditionRadio = val
			var obj = CIQ.store.state.form.conditionRadio
			obj[this.criteria][this.panelIndex] = val
			CIQ.store.commit('form/setConditionRadio', obj)
			if (val === ' Indicator hist1 ') {
				this.tech.comparison = 'ERIH1'
			} else if (val === 'Indicator hist2') {
				this.tech.comparison = 'ERIH2'
			}
		},
		saveCondition(index) {
			let checked = true
			if(this.isRiskControl) {
				return checked = true
			}
			let validForm
			this.$refs.eriForm.validate((valid) => {
				validForm = valid
			})
			if (validForm) {
				let tech = JSON.parse(JSON.stringify(this.tech))
				tech.criteria = this.criteria
				tech.index = index
				this.$store.commit('form/saveCondition', tech)
				return checked
			} else {
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.value = obj.value
				this.tech.comparison = obj.comparison
				if (this.tech.comparison === 'ERIH1') {
					this.conditionRadio = 'Indicator hist1'
				}
				if (this.tech.comparison === 'ERIH2') {
					this.conditionRadio = 'Indicator hist2'
				}
				this.editTechVal = obj.indicator

					var cr = CIQ.store.state.form.conditionRadio
					cr[this.criteria][this.panelIndex] = this.conditionRadio
					CIQ.store.commit('form/setConditionRadio', cr)
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

.indicator-alignment /deep/ label.el-radio {
  width: 135px;
}
@media (max-width: 768px) {
  .ids-container {
    flex-wrap: wrap;
  }
  .condition-container {
    display: block;
  }
  /deep/ .el-select {
    margin: 0;
  }
}
</style>