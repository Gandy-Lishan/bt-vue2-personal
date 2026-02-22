// Trailing-Stop-Like input box
<template>
	<div class="senti-container">
		<!-- <p class="hint">
			Hint: To change the indicator settings, right click the indicator in the
			above chart and select "Edit Setting"
		</p> -->
		<el-form :model="tech" size="mini">
			<div class="condition-container">
				<el-form-item>
					<el-radio v-model="emptyRadio" label=" "></el-radio>
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
import { mapGetters } from 'vuex'
export default {
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		isRiskControl: Boolean,
		relation: [String, Number],
		score: [String, Number],
		period: [String, Number],
		delay_bars: [String, Number],
		tabLength: Number,
		isLimit: Boolean
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
			emptyRadio: ' '
		}
	},
	computed: {
		...mapGetters(['getterDirection']),
		direction() {
      return this.getterDirection
    }
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
		},
		setDesciption() {
			let index = this.panelIndex
			let criteria = ''
			let direction = ''
			let commentDes
			if (index === 0) {
				if (this.criteria.startsWith('entry')) {
					criteria = 'E:'
					direction = this.direction + ';'
				} else if (this.criteria.startsWith('exit')) {
					criteria = 'X:'

					if (this.direction == 'Long') {
						direction = 'Close;'
					} else if (this.direction == 'Short') {
						direction = 'Cover;'
					}
				}
				let relation = ''
				let score = ''
				let period = ''
				switch (this.relation) {
					case 0:
						relation = 'Only Risk;'
						break
					case 1:
						relation = 'Single Condition;'
						break
					case 2:
						relation = 'SameBar Multi Condition;'
						score = 'Score: ' + this.score + ';'
						break
					case 3:
						relation = 'TimeOrder Multi Condition;'
            const periodText = !this.isLimit ? 'No Limit' : this.period;
            period = 'Period: ' + periodText + ';'
						break
					default:
						break
				}
				let delay_bars = this.delay_bars
					? 'Delay Bars: ' + this.delay_bars + ';'
					: ''
				commentDes = `${criteria} ${direction} ${relation} ${
					score ? score : ''
				} ${period ? period : ''} ${delay_bars}`
				if (this.relation != 1) {
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
			let radio
			switch (this.tech.comparison) {
				case 'SC':
					radio = 'Symbol Close'
					break
				case 'SO':
					radio = 'Symbol Open'
					break
				case 'SH':
					radio = 'Symbol High'
					break
				case 'SL':
					radio = 'Symbol Low'
					break
				default:
					break
			}
			this.description = `${techVal} ${radio} ${condition} ${this.tech.value}`
			let desObj = {}
			desObj.criteria = this.criteria
			if (this.relation != 1) {
				desObj.description = {
					'commentDes':this.description,
					'rocCond':null
				}
				desObj.index = index + 1
			}
			if (this.relation == 1) {
				desObj.description = {
					'commentDes':commentDes + this.description,
					'rocCond':null
				}
				desObj.index = 0
			}
			this.$store.commit('form/saveDescription', desObj)
		},
		saveCondition() {
			let index = this.panelIndex
			let checked = true
			if (this.isRiskControl) {
				return (checked = true)
			}
			if (this.description) {
				this.setDesciption()
			}
			let tech = this.tech
			tech.criteria = this.criteria
			tech.index = index
			this.$store.commit('form/saveCondition', tech)
			if(!checked) this.popUpMsgBox(`Please check that the #
			${this.panelIndex + 1}
			${this.criteria} panel field is filled in correctly`)
			return checked
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let obj = newVal[this.criteria].signals[this.panelIndex]

				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.comparison = obj.comparison
				this.tech.value = obj.value
				this.editTechVal = obj.indicator
			}
		}
	}
}
</script>
<style lang="less" scoped>
.ids-container {
	.el-form-item {
		display: inline-flex;
	}
  display: flex;
  justify-content: space-between;
}
.condition-container {
	display: flex;
  align-items: center;
}
.el-select {
  margin: 0 5px;
}
.el-radio, /deep/ .el-form-item__label {
  margin-right: 5px;
}
@media (max-width: 768px) {
  .ids-container {
    flex-wrap: wrap;
  }
  .condition-container {
    display: block;
  }
  /deep/ .el-select {
    margin: 0;
  }
}
</style>