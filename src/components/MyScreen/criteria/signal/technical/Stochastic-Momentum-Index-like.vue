// Stochastic-Momentum-Index-Like input box
<template>
	<div class="senti-container">
		<!-- <p class="hint">Hint: To change the indicator settings, right click the indicator in the above chart and select "Edit Setting"</p> -->
		<el-form :model="tech" :rules="rules" ref="smiForm" size="mini">
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
					<el-radio
						v-model="radio"
						label="%K"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(radio === '%K')"
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
							:disabled="!(radio === '%K')"
							v-model="tech.value"
							placeholder="Input Value"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
					<el-radio
						v-model="radio"
						label="%D"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>

						<el-select
							:disabled="!(radio === '%D')"
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
					<el-form-item prop="valueD">

						<el-input
							:disabled="!(radio === '%D')"
							v-model="tech.valueD"
							placeholder="Input Value"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
					<el-radio
						v-model="radio"
						label="%K "
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>

						<el-select
							:disabled="!(radio === '%K ')"
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
						<el-link type="info" :underline="false" class="ISL-text"> %D </el-link>
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
	name: 'stochastic',
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
      } else if (isNaN(value) && value !== 'D') {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
          value = '0' + value;
          this.tech.value = value
        }
        const pattern = /^((-?[1-9][0-9]*)|(-?[0]\.\d{1,4}|-?[1-9][0-9]*\.\d{1,4}))$/;
        if (!pattern.test(value) && value != 0 && value !== 'D') {
          return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
        } else {
          callback();
        }
      }
    };
		var validateValueD = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Please input value'));
      } else if (isNaN(value) && value !== 'D') {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
          value = '0' + value;
          this.tech.valueD = value
        }
        const pattern = /^((-?[1-9][0-9]*)|(-?[0]\.\d{1,4}|-?[1-9][0-9]*\.\d{1,4}))$/;
        if (!pattern.test(value) && value != 0 && value !== 'D') {
          return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
        } else {
          callback();
        }
      }
    };
		return {
			tech: {
				ids: 'SMI',
				condition: 3,
				comparison: 'K',
				value: 0,
				valueD: 0
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			description: '',
			editTechVal: '',
			radio: '%K',
			rules: {
				value: [{ validator: validateValue, trigger: 'blur' }],
				valueD:[{ validator: validateValueD, trigger: 'blur' }]
			}
		}
	},
	watch: {
		isActived: {
			handler(newVal) {
				if(newVal){
					var obj = CIQ.store.state.form.conditionRadio
					obj[this.criteria][this.panelIndex] = this.radio
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
			this.$refs.smiForm.resetFields()
		},
		clearFormValidate() {
			this.$refs.smiForm.clearValidate()
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
				commentDes = `${`${relation} `}${score?`${score} `:''}${period?`${period} `:''}${delay_bars}`
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
			let value = this.radio !== '%D'?this.tech.value:this.tech.valueD
			let suffix = ''
			switch (this.radio) {
				case '%K':
					suffix = ' K'
					break
				case '%K ':
					suffix = ' K'
					break
				case '%D':
					suffix = ' D'
					break
			}
			this.description = `${techVal}${suffix} ${this.conditions[this.tech.condition].label} ${value}`
				let desObj = {}
				desObj.criteria = this.criteria
					if(this.relation != 1) {
						desObj.description = {
							'commentDes':this.description,
							'rocCond':null
						}
						desObj.index = index + 1
					}
					if(this.relation == 1) {
						desObj.description = {
							'commentDes':this.description,
							'rocCond':null
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
			switch (val) {
				case '%K':
					this.tech.value = 0
					this.tech.comparison = 'K'
					break
				case '%K ':
					this.tech.value = 'D'
					this.tech.comparison = 'K'
					break
				case '%D':
					this.tech.valueD = 0
					this.tech.comparison = 'D'
					break
			}
		},
		saveCondition(index) {
			let checked = true
						if(this.isRiskControl) {
				return checked = true
			}
			let validForm
			this.$refs.smiForm.validate((valid) => {
				validForm = valid
			})
			if (validForm) {
				if (this.description) {
					this.setDesciption(index)
				}
				let tech = JSON.parse(JSON.stringify(this.tech))
				tech.criteria = this.criteria
				tech.index = index
				if(this.radio === "%D") {
					tech.value = tech.valueD
				}
				delete tech.valueD
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
				if (this.tech.value !== 'D' && this.tech.comparison === 'K') {
					this.radio = '%K'
				}
				if (this.tech.value === 'D' && this.tech.comparison === 'K') {
					this.radio = '%K '
				}
				if (this.tech.comparison === 'D') {
					this.radio = '%D'
					this.tech.valueD = obj.value
				}
				this.editTechVal = obj.indicator
					var cr = CIQ.store.state.form.conditionRadio
					cr[this.criteria][this.panelIndex] = this.radio
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
.ISL-text {
	cursor: auto;
	font-size: 12px;
}
.ISL-text:hover {
	color: #909399;
}
</style>