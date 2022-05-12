<template>
	<div class="senti-container">
		<el-form :model="tech">
			<!-- <div class="ids-container">
				<el-radio-group v-model="tech.ids.ma_category" @change="getMaRadio">
					<el-radio label="SMA" style="margin-bottom: 30px"
						>Simple moving average</el-radio
					>
					<el-radio label="EMA">Exponential moving average</el-radio>
				</el-radio-group>
			</div> -->
			<div class="condition-container">
				<el-form-item>
					<el-radio v-model="radio" label=" "></el-radio>
<el-tooltip style="diaplay:inline" effect="light" content="Compare with indicator value" placement="bottom">
					<el-select
						v-model="tech.comparison"
						size="mini"
						filterable
						@change="setDesciption"
						placeholder="Please select condition"
					>
						<el-option
							v-for="item in radioConditions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
</el-tooltip>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-tooltip style="diaplay:inline" effect="light" content="The way of comparing between comparison and value" placement="bottom">
						<el-select
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
					<el-form-item>
						<el-button type="text">Indicator Value</el-button>
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
		exitItemCheck: Boolean,
		relation: Number
	},
	data() {
		return {
			tech: {
				ids: 'LRF',
				condition: 3,
				value: 'LRF',
				comparison: 'SC'
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			radioConditions: [
				{ value: 'SC', label: 'Symbol Close' },
				{ value: 'SH', label: 'Symbol High' },
				{ value: 'SO', label: 'Symbol Open' },
				{ value: 'SL', label: 'Symbol Low' }
			],
			description: '',
			editTechVal: '',
			radio: ' '
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
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
			let comparison
			switch (this.tech.comparison) {
				case 'SC':
					comparison = "Symbol Close"
					break;
				case 'SH':
					comparison = "Symbol High"
					break;
				case 'SL':
					comparison = "Symbol Low"
					break;
				case 'SO':
					comparison = "Symbol Open"
					break;
				default:
					break;
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
			this.description = `${criteria} ${direction} ${relation} ${techVal} ${comparison} ${condition} ${this.tech.value}`
			//console.log(this.description)
		},
		saveCondition(index) {
			let checked = true
						if(this.exitItemCheck) {
				return checked = true
			}
			if (this.description) {
				this.setDesciption()
			}
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
		},
		// 设置编辑的数据
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.comparison = obj.comparison
				this.tech.value = obj.value
				this.radio = ' '
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
/deep/ .el-radio {
	margin-right: -3px;
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