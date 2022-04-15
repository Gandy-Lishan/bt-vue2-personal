<template>
	<div class="senti-container">
		<el-form :model="tech" :rules="rules" ref="adxForm">
			<!-- <div class="ids-container">
				<el-form-item label="Slow moving average" prop="MACDSlow">
					<el-input
						v-model="tech.ids.MACDSlow"
						disabled
						oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
				<el-form-item label="Fast moving average" prop="MACDFast">
					<el-input
						disabled
						v-model="tech.ids.MACDFast"
						oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
				<el-form-item label="Signal line" prop="MACDSL">
					<el-input
						disabled
						v-model="tech.ids.MACDSL"
						oninput="this.value=this.value.replace(/[\d]/g,'')"
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
					<el-form-item>
						<el-input
							:disabled="!(conditionRadio === '+DI ADX')"
							@input="setDesciption"
							v-model="tech.value"
							oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
							placeholder="Input Value"
						></el-input>
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
					<el-form-item>
						<el-input
							:disabled="!(conditionRadio === '-DI ADX')"
							@input="setDesciption"
							v-model="tech.value"
							oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
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
const _ = require('lodash')
const throttle = _.throttle
export default {
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		// editIndiData: Object,
		direction: String
	},
	data() {
		var validateValue = (rule, value, callback) => {
			if (value === '') {
				return callback(new Error('Please input value'))
			}
			if (isNaN(value)) {
				return callback(new Error('Please enter the correct format'))
			}
			const pattern =
				/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(value) && value != 0) {
				return callback(new Error('Enter up to two decimal places'))
			}
			callback()
		}
		return {
			tech: {
				ids: 'ADX',
				condition: 3,
				value: '',
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
				value: [{ validator: validateValue, trigger: 'blur' }]
			}
		}
	},
	watch: {
		techVal: {
			handler(newVal) {
				//console.log('watch techVal!!!!!!!!!',newVal)
				var obj = CIQ.store.state.conditionRadio
				obj.ADX_like = this.conditionRadio
				CIQ.store.commit('setConditionRadio', obj)
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.clearFormValidate()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.adxForm.clearValidate()
		},
		setDesciption(index) {
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
			let isPositive = '+'
			if (this.conditionRadio === '-DI ADX') {
				isPositive = '-'
			}
			this.description = `${criteria} ${direction} ${isPositive}${techVal} ${condition} ${this.tech.value}`
		},
		getConditionRadio(val) {
			var obj = CIQ.store.state.conditionRadio
			obj.ADX_like = val
			CIQ.store.commit('setConditionRadio', obj)
			if (val === ' +DI ADX ') {
				this.tech.comparison = 'PADX'
			} else if (val === '-DI ADX') {
				this.tech.comparison = 'NADX'
			}
			this.setDesciption()
			//CIQ.exportEx()
		},
		saveCondition(index) {
			let checked = true
			let validForm
			this.$refs.adxForm.validate((valid) => {
				validForm = valid
			})
			if (validForm) {
				let tech = this.tech
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
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.value = obj.value
				this.tech.comparison = obj.comparison
				if (this.tech.comparison === 'PADX') {
					this.conditionRadio = '+DI ADX'
				}
				if (this.tech.comparison === 'NADX') {
					this.conditionRadio = '-DI ADX'
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
</style>