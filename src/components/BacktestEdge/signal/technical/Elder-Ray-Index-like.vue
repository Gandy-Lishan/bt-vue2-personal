<template>
	<div class="senti-container">
		<el-form :model="tech" :rules="rules" ref="eriForm">
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
					<el-form-item>
						<el-input
							:disabled="!(conditionRadio === 'Indicator hist1')"
							@input="setDesciption"
							v-model="tech.value"
							placeholder="Input Value"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
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
							@input="setDesciption"
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
		direction: String,
		exitItemCheck: Boolean
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
		techVal: {
			handler(newVal) {
				//console.log('watch techVal!!!!!!!!!',newVal)
				var obj = CIQ.store.state.conditionRadio
				obj.ERI_like = this.conditionRadio
				CIQ.store.commit('setConditionRadio', obj)
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			this.$refs.eriForm.resetFields()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.eriForm.clearValidate()
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
			let isPositive = 'Hist 1'
			if (this.conditionRadio === 'Indicator hist2') {
				isPositive = 'Hist 2'
			}
			this.description = `${criteria} ${direction} ${techVal} ${isPositive} ${condition} ${this.tech.value}`
		},
		getConditionRadio(val) {
			this.conditionRadio = val
			var obj = CIQ.store.state.conditionRadio
			obj.ERI_like = val
			CIQ.store.commit('setConditionRadio', obj)
			if (val === ' Indicator hist1 ') {
				this.tech.comparison = 'ERIH1'
			} else if (val === 'Indicator hist2') {
				this.tech.comparison = 'ERIH2'
			}
			this.setDesciption()
			//CIQ.exportEx()
		},
		saveCondition(index) {
			let checked = true
						if(this.exitItemCheck) {
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
				console.log('ERI的编辑')
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