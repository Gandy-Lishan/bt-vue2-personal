<template>
	<div class="senti-container">
		<el-form :model="tech">
			<div class="ids-container">
				<el-form-item label="OverBought bound" prop="over_bought_bound">
					<el-input
						v-model="tech.ids.over_bought_bound"
						disabled
						oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
				<el-form-item label="OverSold bound" prop="over_sold_bound">
					<el-input
						disabled
						v-model="tech.ids.over_sold_bound"
						oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
				<el-form-item label="Period" prop="period">
					<el-input
						disabled
						v-model="tech.ids.period"
						oninput="value=value.replace(/[^-?\d]/g,'')"
					></el-input>
				</el-form-item>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio v-model="conditionRadio" label="CCI Value"></el-radio>
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
					<el-form-item>
						<el-input
							@blur="setDesciption"
							v-model="tech.value"
							oninput="value=value.replace(/[^-?0-9.]/g,'')"
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
export default {
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		editIndiData: Object
	},
	data() {
		return {
			tech: {
				ids: {
					over_bought_bound: 100,
					over_sold_bound: -100,
					period: 20
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
			conditionRadio: 'CCI Value',
			description: ''
		}
	},
	watch: {
		editIndiData: {
			handler(newVal) {
				if (JSON.stringify(newVal) != '{}') {
					this.tech.ids = newVal[this.criteria].signals[0].ids
					this.tech.condition = Number(
						newVal[this.criteria].signals[0].condition
					)
					this.tech.value = newVal[this.criteria].signals[0].value
					this.description = newVal[this.criteria + '_description']
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		setDesciption() {
			let period = this.tech.period ? this.tech.period : ''
			let condition = this.conditions[this.tech.condition].label
			let description =
				this.techVal + ' ' + period + ' ' + condition + ' ' + this.tech.value
			this.description = description
		},
		saveCondition() {
			let checked = true
			if (this.tech.value) {
				let ids = {
					over_bought_bound: 100,
					over_sold_bound: -100,
					period: 20
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