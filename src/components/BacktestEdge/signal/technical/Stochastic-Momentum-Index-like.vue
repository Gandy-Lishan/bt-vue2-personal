<template>
	<div class="senti-container">
		<el-form :model="tech" :rules="rules" ref="smiForm">
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
						v-model="radioObj.kRadio1"
						label="%K"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(radioObj.kRadio1 === '%K')"
							v-model="kCondition1"
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
							:disabled="!(radioObj.kRadio1 === '%K')"
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
						v-model="radioObj.dRadio"
						label="%D"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(radioObj.dRadio === '%D')"
							v-model="dCondition"
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
							:disabled="!(radioObj.dRadio === '%D')"
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
						v-model="radioObj.kRadio2"
						label="%K "
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(radioObj.kRadio2 === '%K ')"
							v-model="kCondition2"
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
						<el-button type="text"> %D </el-button>
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
	name: 'macd',
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
			if (isNaN(value) && value !== 'D') {
				return callback(new Error('Please enter the correct format'))
			}
			const pattern =
				/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(value) && value != 0 && value !== 'D') {
				return callback(new Error('Enter up to two decimal places'))
			}
			callback()
		}
		return {
			tech: {
				ids: 'SMI',
				condition: 3,
				comparison: 'K',
				value: 0
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
			kCondition1: 0,
			dCondition: 0,
			kCondition2: 3,
			conditionRadio: '%K',
			radioObj: {
				kRadio1: '%K',
				kRadio2: '',
				dRadio: ''
			},
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
				obj.Stochastics_like = this.conditionRadio
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
			this.$refs.smiForm.clearValidate()
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
			let suffix = ''
			if (this.radioObj.kRadio1 || this.radioObj.kRadio2) {
				suffix = ' K'
			}
			if (this.radioObj.dRadio) {
				suffix = ' D'
			}
			let condition = this.conditions[this.tech.condition].label
			if (this.radioObj.kRadio1 === '%K') {
				condition = this.conditions[this.kCondition1].label
			}
			if (this.radioObj.kRadio2 === '%K ') {
				condition = this.conditions[this.kCondition2].label
			}
			if (this.radioObj.dRadio === '%D') {
				condition = this.conditions[this.dCondition].label
			}
			this.description = `${criteria} ${direction} ${techVal}${suffix} ${condition} ${this.tech.value}`
		},
		getConditionRadio(val) {
			// 排他思想
			this.conditionRadio = val
			var obj = CIQ.store.state.conditionRadio
			obj.Stochastics_like = val
			CIQ.store.commit('setConditionRadio', obj)
			for (let key in this.radioObj) {
				this.radioObj[key] = ''
			}
			switch (val) {
				case '%K':
					this.radioObj.kRadio1 = val
					this.tech.value = 0
					this.tech.comparison = 'K'
					this.tech.condition = this.kCondition1
					break
				case '%K ':
					this.radioObj.kRadio2 = val
					this.tech.value = 'D'
					this.tech.comparison = 'K'
					this.tech.condition = this.kCondition2
					break
				case '%D':
					this.radioObj.dRadio = val
					this.tech.value = 0
					this.tech.comparison = 'D'
					this.tech.condition = this.dCondition
					break
			}
			this.setDesciption()
			//CIQ.exportEx()
		},
		saveCondition(index) {
			let checked = true
			let validForm
			this.$refs.smiForm.validate((valid) => {
				validForm = valid
			})
			if (validForm) {
				if (this.description) {
					this.setDesciption()
				}
				if (this.radioObj.dRadio === '%D') {
					this.tech.condition = this.dCondition
				}
				if (this.radioObj.kRadio1 === '%K') {
					this.tech.condition = this.kCondition1
				}
				if (this.radioObj.kRadio2 === '%K ') {
					this.tech.condition = this.kCondition2
				}
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
				console.log('编辑')
				for (let key in this.radioObj) {
					this.radioObj[key] = ''
				}
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.value = obj.value
				this.tech.comparison = obj.comparison
				if (this.tech.value !== 'D' && this.tech.comparison === 'K') {
					this.radioObj.kRadio1 = '%K'
					this.kCondition1 = this.tech.condition
				}
				if (this.tech.value === 'D' && this.tech.comparison === 'K') {
					this.radioObj.kRadio2 = '%K '
					this.kCondition2 = this.tech.condition
				}
				if (this.tech.comparison === 'D') {
					this.radioObj.dRadio = '%D'
					this.dCondition = this.tech.condition
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