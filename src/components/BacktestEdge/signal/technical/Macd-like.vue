<template>
	<div class="senti-container">
		<el-form :model="tech">
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
						label="Indicator Value"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Indicator Value')"
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
							:disabled="!(conditionRadio === 'Indicator Value')"
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
						label="Indicator Value "
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Indicator Value ')"
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
						<el-button type="text"> Indicator Signal line </el-button>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="Indicator Hist"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Indicator Hist')"
							v-model="histCondition"
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
							:disabled="!(conditionRadio === 'Indicator Hist')"
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
		// editIndiData: Object,
		direction: String
	},
	data() {
		return {
			tech: {
				ids: {
					MACDSlow: 26,
					MACDFast: 12,
					MACDSL: 9
				},
				condition: 3,
				value: 0
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			conditionRadio: 'Indicator Value',
			disabled: false,
			description: '',
			editTechVal: '',
			histCondition: 0
		}
	},
	watch: {
		// editIndiData: {
		// 	handler(newVal) {
		// 		if (JSON.stringify(newVal) != '{}') {
		// 			this.tech.ids = newVal[this.criteria].signals[0].ids
		// 			this.tech.condition = Number(
		// 				newVal[this.criteria].signals[0].condition
		// 			)
		// 			this.disabled = false
		// 			this.tech.value = newVal[this.criteria].signals[0].value
		// 			if (this.tech.value === 'MACDSL') {
		// 				this.conditionRadio = ' Indicator Value '
		// 				this.disabled = true
		// 			}
		// 			this.setDesciption()
		// 		}
		// 	},
		// 	immediate: true,
		// 	deep: true
		// }
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
		},
		setDesciption: throttle(function () {
			let criteria = ''
			let direction = ''
			if (this.criteria == 'entry') {
				criteria = 'E:'
				direction = this.direction + ':'
			} else if (this.criteria == 'exit') {
				criteria = 'X:'

				if (this.direction == 'Long') {
					direction = 'Cover:'
				} else if (this.direction == 'Short') {
					direction = 'Close:'
				}
			}
			let techVal = this.techVal ? this.techVal : this.editTechVal
			let condition = this.conditions[this.tech.condition].label
			this.description = `${criteria} ${direction} ${techVal} ${condition} ${this.tech.value}`
			console.log('描述', this.description)
		}, 500),
		getConditionRadio(val) {
			CIQ.store.commit('setConditionRadio',val)
			if (val === ' Indicator Value ') {
				this.tech.value = 'MACDSL'
				this.disabled = !this.disabled
			} else if (val === ' Indicator Value') {
				this.tech.value = 0
				this.disabled = !this.disabled
			}
			this.setDesciption()
			CIQ.exportEx()
		},
		saveCondition() {
			let checked = true
			if (this.tech.value !== '') {
				let ids = {
					MACDSlow: 26,
					MACDFast: 12,
					MACDSL: 9
				}
				let tech = this.tech
				delete tech.ids
				tech = Object.assign(ids, tech)
				tech.criteria = this.criteria
				tech.index = 0
				this.$store.commit('saveCondition', tech)
				let desObj = {}
				desObj.criteria = this.criteria
				desObj.description = this.description
				this.$store.commit('saveDescription', desObj)
				return checked
			} else {
				this.$message({
					message: 'Please Input Value',
					type: 'error',
					offset: 300
				})
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				this.clearFormValidate()
				this.tech.ids = newVal[this.criteria].signals[0].ids
				this.tech.condition = Number(newVal[this.criteria].signals[0].condition)
				this.disabled = false
				this.tech.value = newVal[this.criteria].signals[0].value
				if (this.tech.value === 'MACDSL') {
					this.conditionRadio = ' Indicator Value '
					this.disabled = true
				}
				this.editTechVal = newVal[this.criteria].signals[0].indicator
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