<template>
	<div class="senti-container">
		<el-form :model="tech" :rules="rules" ref="adxForm">
			<!-- <div class="ids-container">
				<el-form-item label="Slow moving average" prop="MACDSlow">
					<el-input
						v-model="tech.ids.MACDSlow"
						disabled
					></el-input>
				</el-form-item>
				<el-form-item label="Fast moving average" prop="MACDFast">
					<el-input
						disabled
						v-model="tech.ids.MACDFast"
					></el-input>
				</el-form-item>
				<el-form-item label="Signal line" prop="MACDSL">
					<el-input
						disabled
						v-model="tech.ids.MACDSL"
					></el-input>
				</el-form-item>
			</div> -->
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="+DI ADX"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-tooltip style="diaplay:inline" effect="light" content="The way of comparing between comparison and value" placement="bottom">
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
						</el-tooltip>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item prop="valuePositive">
						<el-tooltip style="diaplay:inline" effect="light" content="Compare with indicator value" placement="bottom">
						<el-input
							:disabled="!(conditionRadio === '+DI ADX')"
							@input="setDesciption"
							v-model="tech.valuePositive"
							placeholder="Input Value"
						></el-input>
						</el-tooltip>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="-DI ADX"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-tooltip style="diaplay:inline" effect="light" content="The way of comparing between comparison and value" placement="bottom">
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
						</el-tooltip>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item prop="valueNegative">
						<el-tooltip style="diaplay:inline" effect="light" content="Compare with indicator value" placement="bottom">
						<el-input
							:disabled="!(conditionRadio === '-DI ADX')"
							@input="setDesciption"
							v-model="tech.valueNegative"
							placeholder="Input Value"
						></el-input>
						</el-tooltip>
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
		// editIndiData: Object,
		direction: String,
		isActived: Boolean,
		exitItemCheck: Boolean,
		relation: Number
	},
	data() {
		var validateValueNegative = (rule, value, callback) => {
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
		var validateValuePositive = (rule, value, callback) => {
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
					//console.log('watch techVal!!!!!!!!!',newVal)
					var obj = CIQ.store.state.conditionRadio
					obj[this.criteria][this.panelIndex] = this.conditionRadio
					CIQ.store.commit('setConditionRadio', obj)
					//console.log('handle ADX,',obj)
				}

			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			this.$refs.adxForm.resetFields()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.adxForm.clearValidate()
		},
		setDesciption: throttle(function(index) {
			let criteria = ''
			let direction = ''
			if (this.criteria == 'entry') {
				criteria = 'E:'
				direction = this.direction + ':'
			} else if (this.criteria == 'exit') {
				criteria = 'X:'

				if (this.direction == 'Long') {
					direction = 'Close:'
				} else if (this.direction == 'Short') {
					direction = 'Cover:'
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
			let relation = ''
			switch (this.relation) {
				case 0:
					relation = "Only Risk:"
					break;
				case 1:
					relation = ""
					break;
				case 2:
					relation = "SameBar:"
					break;
				case 3:
					relation = "TimeOrder:"
					break;
				default:
					break;
			}
			this.description = `${criteria} ${direction} ${relation} ${isPositive}${techVal} ${condition} ${value}`
		}, 500),
		getConditionRadio(val) {
			this.clearFormValidate()
			var obj = CIQ.store.state.conditionRadio
			obj[this.criteria][this.panelIndex] = val
			CIQ.store.commit('setConditionRadio', obj)
			if (val === ' +DI ADX ') {
				this.tech.comparison = 'PADX'
			} else if (val === '-DI ADX') {
				this.tech.comparison = 'NADX'
			}
			//CIQ.exportEx()
		},
		saveCondition(index) {
			let checked = true
			if(this.exitItemCheck) {
				return checked = true
			}
			let validForm
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
				this.$store.commit('saveCondition', tech)
				let desObj = {}
				desObj.criteria = this.criteria
				desObj.index = index
				desObj.description = this.description
				this.$store.commit('saveDescription', desObj)
				return checked
			} else {
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				//console.log('ADX编辑',newVal);
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
				this.setDesciption()
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
	&:first-child {
		border-top: 1px solid #797979;
	}
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