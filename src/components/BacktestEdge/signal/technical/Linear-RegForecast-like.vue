// Linear-RegForecast-Like input box
<template>
	<div class="senti-container">
		<!-- <p class="hint">Hint: To change the indicator settings, right click the indicator in the above chart and select "Edit Setting"</p> -->
		<el-form :model="tech">
			<div class="condition-container">
				<el-form-item>
					<el-radio v-model="radio" label=" "></el-radio>
					<el-select
						v-model="tech.comparison"
						size="mini"
						filterable
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
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
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
import { CIQ } from '@/components/common/chart/st-development/js'
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
		direction: String,
		exitItemCheck: Boolean,
		relation: [String, Number],
score: [String, Number],
period: [String, Number],
delay_bars: [String, Number],
		tabLength: Number,

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
						relation = "Single Condition;"
						break;
					case 2:
						relation = "SameBar Multi Condition;"
						score = 'Score: ' + this.score + ';'
						break;
					case 3:
						relation = "TimeOrder Multi Condition;"
						period = 'Period: ' + this.period + ';'
						break;
					default:
						break;
				}
				let delay_bars = this.delay_bars?'Delay Bars: ' + this.delay_bars + ';':''
				commentDes = `${criteria} ${direction} ${relation} ${score?score:''} ${period?period:''} ${delay_bars}`
				if(this.relation != 1) {
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = {
						'commentDes':commentDes,
						'rocCond':null
					}
					desObj.index = index
					this.$store.commit('form/saveDescription', desObj)
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
			let value = this.tech.value
			if(value == 'SL'){
				value = 'Single Line'
			}
			this.description = `${techVal} ${comparison} ${condition} ${value}`
			let desObj = {}
			desObj.criteria = this.criteria
           if(this.relation != 1) {
					desObj.description = {
						'commentDes':this.description,
						'rocCond':null
					}
					desObj.index = index + 1
					}
					if(this.relation == 1) {
						desObj.description = {
							'commentDes':commentDes + this.description,
							'rocCond':null
						}
						desObj.index = 0
					}
			this.$store.commit('form/saveDescription', desObj)
		},
		saveCondition(index) {
			let checked = true
						if(this.exitItemCheck) {
				return checked = true
			}
			if (this.description) {
				this.setDesciption(index)
			}
			let tech = JSON.parse(JSON.stringify(this.tech))
			tech.criteria = this.criteria
			tech.index = index
			this.$store.commit('form/saveCondition', tech)
			return checked
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.comparison = obj.comparison
				this.tech.value = obj.value
				this.radio = ' '
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
}
.hint{
    position: absolute;
    font-size: 0.7rem;
    color: black !important;
    top: 74px;
    left: 231px;
    font-weight: 300;
}
/deep/ .el-input__inner {
	padding-left: 5px;
	margin-left: 5px;
}
/deep/.el-input--suffix .el-input__inner {
	padding-right: 5px;
}
/deep/ .el-form-item__label {
	margin-right: 5px;
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