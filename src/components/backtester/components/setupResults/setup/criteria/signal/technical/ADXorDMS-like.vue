// ADX-Like input box
<template>
	<div class="senti-container">			
		<el-form :model="tech" :rules="rules" ref="adxForm" size="mini">
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
					<el-radio
						v-model="conditionRadio"
						label="+DI ADX"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === '+DI ADX')"
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
					<el-form-item prop="valuePositive">
						<el-input
							:disabled="!(conditionRadio === '+DI ADX')"
							v-model="tech.valuePositive"
							placeholder="Input Value"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
					<el-radio
						v-model="conditionRadio"
						label="-DI ADX"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === '-DI ADX')"
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
					<el-form-item prop="valueNegative">
						<el-input
							:disabled="!(conditionRadio === '-DI ADX')"
							v-model="tech.valueNegative"
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
		let validateValueNegative = (rule, value, callback) => {
      if (value === ''){
        return callback(new Error('Please input value'));
      } else if (isNaN(value)) {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
          value = '0' + value;
          this.tech.valueNegative = value
        }
        const pattern = /^((-?[1-9][0-9]*)|(-?[0]\.\d{1,4}|-?[1-9][0-9]*\.\d{1,4}))$/;
        if (!pattern.test(value) && value != 0) {
          return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
        } else {
          callback();
        }
      }
    };
		let validateValuePositive = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Please input value'));
      } else if (isNaN(value)) {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
          value = '0' + value;
          this.tech.valuePositive = value
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
				ids: 'ADX',
				condition: 3,
				valuePositive: '',
				valueNegative: '',
				comparison: 'PADX'
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			conditionRadio: '+DI ADX',
			description: '',
			editTechVal: '',
			rules: {
				valueNegative: [{ validator: validateValueNegative, trigger: 'blur' }],
				valuePositive: [{ validator: validateValuePositive, trigger: 'blur' }]
			}
		}
	},
	watch: {
		isActived: {
			handler(newVal) {
				if(newVal){
					let obj = CIQ.store.state.form.conditionRadio
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
			this.$refs?.adxForm.resetFields()
		},
		// Clear form authentication
		clearFormValidate() {
			this.$refs.adxForm.clearValidate()
		},
		setDesciption() {
			let index = this.panelIndex
			let criteria = ''
			let direction = ''
			let commentDes
			if(index === 0) {
			if (this.criteria.startsWith('entry')) {
				criteria = 'E:'
				direction = this.direction + ':'
			}
			if (this.criteria.startsWith('exit')) {
				criteria = 'X:'

				if (this.direction == 'Long') {
					direction = 'Close:'
				} else if (this.direction == 'Short') {
					direction = 'Cover:'
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
						relation = "Single Condition;"
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
				commentDes = `${criteria} ${direction} ${relation} ${score?score:''} ${period?period:''} ${delay_bars}`
				if(this.relation != 1) {
				   let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = {
						'commentDes':commentDes,
						'rocCond':null
					}
					desObj.index = index
					this.$store.commit('form/saveDescription', desObj)
				}
			}
			let techVal = this.techVal ? this.techVal : this.editTechVal
			let condition = this.conditions[this.tech.condition].label
			let value = this.tech.valuePositive
			let isPositive = '+'
			if (this.conditionRadio === '-DI ADX') {
				isPositive = '-'
				value = this.tech.valueNegative
			}
			this.description = `${isPositive}${techVal} ${condition} ${value}`
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
							'commentDes':commentDes + this.description,
							'rocCond':null
						}
						desObj.index = 0
					}
				this.$store.commit('form/saveDescription', desObj)
		},
		getConditionRadio(val) {
			this.clearFormValidate()
			let obj = CIQ.store.state.form.conditionRadio
			obj[this.criteria][this.panelIndex] = val
			CIQ.store.commit('form/setConditionRadio', obj)
			if (val === '+DI ADX') {
				this.tech.comparison = 'PADX'
				this.tech.valueNegative = ''
			} else if (val === '-DI ADX') {
				this.tech.comparison = 'NADX'
				this.tech.valuePositive = ''
			}
		},
		saveCondition() {
			let index = this.panelIndex
			let checked = true
			if(this.isRiskControl) {
				return checked = true
			}
			let validForm
			if(this.conditionRadio === '+DI ADX') {
				this.tech.comparison = 'PADX'
			}
			if(this.conditionRadio === '-DI ADX') {
				this.tech.comparison = 'NADX'
			}
			let tech = JSON.parse(JSON.stringify(this.tech))
			if (this.conditionRadio === '+DI ADX') {
				this.$refs['adxForm'].validateField(['valuePositive'], (errorMsg) => {
					if (!errorMsg) {
						validForm = true
					}
				})
				tech.value = tech.valuePositive
				delete tech.valuePositive
				delete tech.valueNegative
			}
			if (this.conditionRadio === '-DI ADX') {
				this.$refs['adxForm'].validateField(['valueNegative'], (errorMsg) => {
					if (!errorMsg) {
						validForm = true
					}
				})
				tech.value = tech.valueNegative
				delete tech.valuePositive
				delete tech.valueNegative
			}
			if (validForm) {
				tech.criteria = this.criteria
				tech.index = index
				this.$store.commit('form/saveCondition', tech)
				return checked
			} else {
				this.popUpMsgBox(`Please check that the #
				${this.panelIndex + 1}
				${this.criteria} panel field is filled in correctly`)
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
				if (this.tech.comparison === 'PADX') {
					this.conditionRadio = '+DI ADX'
					this.tech.valuePositive = obj.value
				}
				if (this.tech.comparison === 'NADX') {
					this.conditionRadio = '-DI ADX'
					this.tech.valueNegative = obj.value
				}
				this.editTechVal = obj.indicator

					let cr = CIQ.store.state.form.conditionRadio
					cr[this.criteria][this.panelIndex] = this.conditionRadio
					CIQ.store.commit('form/setConditionRadio', cr)
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
.indicator-alignment /deep/ label.el-radio {
  width: 135px;
}
</style>