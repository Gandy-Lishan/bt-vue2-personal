// Bollinger-Bands-Like input box
<template>
	<div class="senti-container">
		<!-- <p class="hint">Hint: To change the indicator settings, right click the indicator in the above chart and select "Edit Setting"</p> -->
		<el-form :model="tech" size="mini">
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
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.value"
							size="mini"
							filterable
							placeholder="Please select condition"
							@change="getValueSelect"
						>
							<el-option
								v-for="item in valueConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from '@/components/common/chart/st-development/js'
import { mapGetters } from 'vuex'
export default {
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		isActived: Boolean,
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
				ids: 'BLB',
				condition: 3,
				value: 'HB',
				comparison: 'SC'
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			valueConditions: [
				{ value: 'LB', label: 'Low Band' },
				{ value: 'HB', label: 'High Band' },
				{ value: 'MB', label: 'Middle Band' }
			],
			radio: ' ',
			radioConditions: [
				{ value: 'SC', label: 'Symbol Close' },
				{ value: 'SH', label: 'Symbol High' },
				{ value: 'SO', label: 'Symbol Open' },
				{ value: 'SL', label: 'Symbol Low' }
			],
			description: '',
			editTechVal: ''
		}
	},
	watch: {
		isActived: {
			handler(newVal) {
				if(newVal){
					let obj = CIQ.store.state.form.conditionRadio
					obj[this.criteria][this.panelIndex] = this.tech.value
					CIQ.store.commit('form/setConditionRadio', obj)
				}
			},
			immediate: true,
			deep: true
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
		getValueSelect(val) {
			let obj = CIQ.store.state.form.conditionRadio
			obj[this.criteria][this.panelIndex] = val
			CIQ.store.commit('form/setConditionRadio', obj)
		},
		setDesciption() {
			let index = this.panelIndex
			let criteria = ''
			let direction = ''
			let commentDes
			if(index === 0) {
				if (this.criteria.startsWith('entry')) {
					criteria = 'E:'
					direction = this.direction + ':'
				}
				if (this.criteria.startsWith('exit')) {
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
							const periodText = !this.isLimit ? 'No Limit' : this.period;
							period = 'Period: ' + periodText + ';'
							break;
						default:
							break;
					}
					let delay_bars = this.delay_bars?'Delay Bars: ' + this.delay_bars  + ';':''
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
			let value
			switch(this.tech.value) {
				case 'LB':
					value = "Low Band"
					break;
				case 'HB':
					value = "High Band"
					break;
				case 'MB':
					value = "Middle Band"
					break;
				default:
					break;
			}
			let condition = this.conditions[this.tech.condition].label
			this.description = `${comparison} ${condition} ${techVal} ${value}`
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
		saveCondition() {
			let index = this.panelIndex
			let checked = true
			if(this.isRiskControl) {
				return checked = true
			}
			if (this.description) {
				this.setDesciption()
			}
			let tech = JSON.parse(JSON.stringify(this.tech))
			tech.criteria = this.criteria
			tech.index = index
			this.$store.commit('form/saveCondition', tech)
			if(!checked) this.popUpMsgBox(`Please check that the #
			${this.panelIndex}
			${this.criteriaNum} panel field is filled in correctly`)
			return checked
		},
		// Set edited data
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.comparison = obj.comparison
				this.tech.value = obj.value
				this.radio = ' '
				this.editTechVal = obj.indicator

					let cr = CIQ.store.state.form.conditionRadio
					cr[this.criteria][this.panelIndex] = this.tech.value
					CIQ.store.commit('form/setConditionRadio', cr)
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
</style>