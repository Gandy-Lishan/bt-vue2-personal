<template>
	<div class="senti-container">
		<el-form :model="tech" :rules="rules" ref="cciForm">
			<!-- <div class="ids-container">
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
			</div> -->
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
						<el-input
							@input="setDesciption"
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
		var validateValue = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('Please input value'))
			} else if (isNaN(value)) {
				callback(new Error('Please enter the correct format'))
			} else {
				const pattern =
					/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
				if (!pattern.test(value)) {
					callback(new Error('Enter up to two decimal places'))
				} else {
					callback()
				}
			}
		}
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
			conditionRadio: ' Indicator Value',
			description: '',
			editTechVal: '',
			rules: { value: [{ validator: validateValue, trigger: 'blur' }] }
		}
	},
	// computed: {
	// 	...mapGetters(['getterIsSavaDescription']),
	// 	isSavaDescriptionAgain() {
	// 		return this.getterIsSavaDescription
	// 	}
	// },
	watch: {
		// editIndiData: {
		// 	handler(newVal) {
		// 		if (JSON.stringify(newVal) != '{}') {
		// 			this.tech.ids = newVal[this.criteria].signals[0].ids
		// 			this.tech.condition = Number(
		// 				newVal[this.criteria].signals[0].condition
		// 			)
		// 			this.tech.value = newVal[this.criteria].signals[0].value
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
			this.clearFormValidate()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.cciForm.clearValidate()
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
			let period = this.tech.period ? this.tech.period : ''
			let condition = this.conditions[this.tech.condition].label
			this.description = `${criteria} ${direction} ${techVal} ${period} ${condition} ${this.tech.value}`
		}, 500),
		saveCondition() {
			let checked = true
			let validForm
			this.$refs.cciForm.validate((valid) => {
				validForm = valid
			})
			if (validForm) {
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
				// this.$message({
				// 	message: 'Please Input Value',
				// 	type: 'error',
				// 	offset: 300
				// })
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				this.clearFormValidate()
				this.tech.ids = newVal[this.criteria].signals[0].ids
				this.tech.condition = Number(newVal[this.criteria].signals[0].condition)
				this.tech.value = newVal[this.criteria].signals[0].value
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
</style>