// CCI-Like input box
<template>
	<div class="senti-container">
		<!-- <p class="hint">
			Hint: To change the indicator settings, right click the indicator in the
			above chart and select "Edit Setting"
		</p> -->
		<el-form :model="tech" :rules="rules" ref="cciForm">
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label=" Indicator Value"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.condition"
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
						<el-input v-model="tech.value" placeholder="Input Value"></el-input>
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
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		direction: String,
		exitItemCheck: Boolean,
		relation: [String, Number],
		score: [String, Number],
		period: [String, Number],
		delay_bars: [String, Number],
		tabLength: Number
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
				ids: 'CCI',
				comparison: 'CCI',
				condition: 3,
				value: ''
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			conditionRadio: ' Indicator Value',
			description: '',
			editTechVal: '',
			rules: { value: [{ validator: validateValue, trigger: 'blur' }] }
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.$refs.cciForm.resetFields()
		},
		// Clear form authentication
		clearFormValidate() {
			this.$refs.cciForm.clearValidate()
		},
		setDesciption(index) {
			let criteria = ''
			let direction = ''
			let commentDes
			if (index === 0) {
				if (this.criteria == 'entry') {
					criteria = 'E:'
					direction = this.direction + ':'
				}
				if (this.criteria == 'exit') {
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
						relation = 'Only Risk;'
						break
					case 1:
						relation = "Single Condition;"
						break;
					case 2:
						relation = "SameBar Multi Condition;"
						score = 'Score: ' + this.score + ';'
						break
					case 3:
						relation = "TimeOrder Multi Condition;"
						period = 'Period: ' + this.period + ';'
						break
					default:
						break
				}
				let delay_bars = this.delay_bars
					? 'Delay Bars: ' + this.delay_bars + ';'
					: ''
				commentDes = `${criteria} ${direction} ${relation} ${
					score ? score : ''
				} ${period ? period : ''} ${delay_bars}`
				if (this.relation != 1) {
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
			let period = this.tech.period ? this.tech.period : ''
			let condition = this.conditions[this.tech.condition].label
			this.description = `${techVal} ${period} ${condition} ${this.tech.value}`
			let desObj = {}
			desObj.criteria = this.criteria
			if (this.relation != 1) {
				desObj.description = {
					'commentDes':this.description,
					'rocCond':null
				}
				desObj.index = index + 1
			}
			if (this.relation == 1) {
				desObj.description = {
					'commentDes':commentDes + this.description,
					'rocCond':null
				}
				desObj.index = 0
			}
			this.$store.commit('form/saveDescription', desObj)
		},
		saveCondition(index) {
			let checked = true
			if (this.exitItemCheck) {
				return (checked = true)
			}
			let validForm
			this.$refs.cciForm.validate((valid) => {
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
				this.editTechVal = obj.indicator
        this.clearFormValidate()
			}
		}
	}
}
</script>
<style lang="less" scoped>
.ids-container {
	// hide attributes of technical indicators
	display: none;
	flex-wrap: wrap;
	.el-form-item {
		display: inline-flex;
	}
}
.condition-container {
	border-top: 1px solid #797979;
	display: flex;
}
/deep/ .el-input__inner {
	padding-left: 5px;
	margin-left: 5px;
}
/deep/.el-input--suffix .el-input__inner {
	padding-right: 5px;
}
@media (min-width: 1280px) and (max-width: 1365px) {
	/deep/ .el-form-item__label {
		margin-right: 10px;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	/deep/ .el-form-item__label {
		margin-right: 0px;
	}
	.condition-container {
		display: flex;
		flex-wrap: wrap;
	}
}
.hint {
	position: absolute;
	font-size: 0.7rem;
	color: black !important;
	top: 74px;
	left: 231px;
	font-weight: 300;
}
</style>