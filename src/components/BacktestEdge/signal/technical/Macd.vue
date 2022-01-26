<template>
	<div class="senti-container">
		<el-form :model="tech">
			<div class="ids-container">
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
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="MACD Value"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="disabled"
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
					<el-form-item>
						<el-input
							:disabled="disabled"
							@blur="setDesciption"
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
						label="MACD Value "
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!disabled"
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
					<el-form-item>
						<el-button type="text"> MACD Signal line </el-button>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
export default {
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String
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
				value: ''
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			conditionRadio: 'MACD Value',
			disabled: false,
			description: ''
		}
	},
	methods: {
		setDesciption() {
			let condition = this.conditions[this.tech.condition].label
			let description = this.techVal + ' ' + condition + ' ' + this.tech.value
			this.description = description
			console.log('tech description', description)
		},
		getConditionRadio(val) {
			if (val === 'MACD Value ') {
				this.tech.value = 'MACDSL'
				this.disabled = !this.disabled
			} else if (val === 'MACD Value') {
				this.tech.value = 0
				this.disabled = !this.disabled
			}
			this.setDesciption()
		},
		saveCondition() {
			let checked = true
			if (this.tech.value) {
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
				this.$message.error('Please Input Value')
				checked = false
				return checked
			}
		}
	}
}
</script>
<style lang="less" scoped>
.ids-container {
	display: flex;
	flex-wrap: wrap;
	.el-form-item {
		display: inline-flex;
	}
	border-bottom: 1px solid #797979;
}
.condition-container {
	display: flex;
}
/deep/ .el-input__inner {
	padding-left: 5px;
	margin-left: 5px;
}
/deep/.el-input--suffix .el-input__inner {
	padding-right: 5px;
}
</style>