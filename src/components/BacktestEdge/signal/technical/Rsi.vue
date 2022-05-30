<template>
	<div class="senti-container">
		<el-form :model="tech" :rules="rules" ref="rsiForm">
			<!-- <div class="ids-container">
				<el-form-item label="OverBought bound" prop="over_bought_bound">
					<el-input
						v-model="tech.ids.over_bought_bound"
						disabled
					></el-input>
				</el-form-item>
				<el-form-item label="OverSold bound" prop="over_sold_bound">
					<el-input
						disabled
						v-model="tech.ids.over_sold_bound"
					></el-input>
				</el-form-item>
				<el-form-item label="Period" prop="period">
					<el-input
						disabled
						v-model="tech.ids.period"
					></el-input>
				</el-form-item>
			</div> -->
			<div class="condition-container">
				<el-form-item>
					<el-radio v-model="conditionRadio" label="RSI Value"></el-radio>
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
						<el-input
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
		tabLength: Number,

	},
	data() {
		var validateValue = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('Please input value'))
			} else if (isNaN(value)) {
				callback(new Error('Please enter the correct format'))
			} else {
				const pattern =
					/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
				if (!pattern.test(value) && value != 0) {
					callback(new Error('Enter up to two decimal places'))
				} else {
					callback()
				}
			}
		}
		return {
			tech: {
				ids: {
					over_bought_bound: 80,
					over_sold_bound: 20,
					period: 14
				},
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
			conditionRadio: 'RSI Value',
			description: '',
			editTechVal: '',
			rules: { value: [{ validator: validateValue, trigger: 'blur' }] }
		}
	},
	methods: {
		clearForm() {
			this.$refs.rsiForm.resetFields()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.rsiForm.clearValidate()
		},
		setDesciption(index) {
			let criteria = ''
			let direction = ''
			let commentDes
			if(index === 0) {
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
						relation = "Only Risk;"
						break;
					case 1:
						relation = "Single Signal;"
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
				let delay_bars = this.delay_bars?'Delay Bars: ' + this.delay_bars + ';':''
				commentDes = `${criteria} ${direction} ${relation} ${score?score:''} ${period?period:''} ${delay_bars}`
				if(this.relation != 1) {let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = commentDes
					desObj.index = index
					this.$store.commit('saveDescription', desObj)
				}  
				   
			}
			let techVal = this.techVal ? this.techVal : this.editTechVal
			let period = this.tech.period ? this.tech.period : ''
			let condition = this.conditions[this.tech.condition].label
			this.description = `${criteria} ${direction} ${relation} ${techVal} ${period} ${condition} ${this.tech.value}`
				let desObj = {}
				desObj.criteria = this.criteria
if(this.relation != 1) {
					desObj.description = this.description
					desObj.index = index + 1
					}
					if(this.relation == 1) {
						desObj.description = commentDes + this.description
						desObj.index = 0
					}
				this.$store.commit('saveDescription', desObj)
		},
		saveCondition(index) {
			let checked = true
						if(this.exitItemCheck) {
				return checked = true
			}
			let validForm
			this.$refs.rsiForm.validate((valid) => {
				validForm = valid
			})
			if (validForm) {
				let ids = {
					over_bought_bound: 80,
					over_sold_bound: 20,
					period: 14
				}
				let tech = JSON.parse(JSON.stringify(this.tech))
				delete tech.ids
				tech = Object.assign(ids, tech)
				tech.criteria = this.criteria
				tech.index = index
				this.$store.commit('saveCondition', tech)
				return checked
			} else {
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				this.clearForm()

				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.value = obj.value
				this.editTechVal = obj.indicator
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
	display: flex;
	border-top: 1px solid #797979;
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
</style>