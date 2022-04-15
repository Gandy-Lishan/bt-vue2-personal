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
					<el-select
						v-model="conditionRadio"
						size="mini"
						filterable
						@change="getConditionRadio"
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
							@change="changeValueCondition"
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
		direction: String
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
			conditionRadio: 'Symbol Close',
			radio: ' ',
			radioConditions: [
				{ value: 'Symbol Close', label: 'Symbol Close' },
				{ value: 'Symbol High', label: 'Symbol High' },
				{ value: 'Symbol Open', label: 'Symbol Open' },
				{ value: 'Symbol Low', label: 'Symbol Low' }
			],
			description: '',
			editTechVal: ''
		}
	},
	watch: {
		techVal: {
			handler(newVal) {
				//console.log('watch techVal!!!!!!!!!',newVal)
				var obj = CIQ.store.state.conditionRadio
				obj.BollingerBands_like = this.tech.value
				CIQ.store.commit('setConditionRadio', obj)
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
		},
		changeValueCondition(val) {
			var obj = CIQ.store.state.conditionRadio
			obj.BollingerBands_like = val
			CIQ.store.commit('setConditionRadio', obj)
			//CIQ.exportEx()
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
			let radio = this.conditionRadio
			this.description = `${criteria} ${direction} ${techVal} ${radio} ${condition} ${this.tech.value}`
			console.log(this.description)
		},
		getConditionRadio(val) {
			switch (val) {
				case 'Symbol Close':
					this.tech.comparison = 'SC'
					break
				case 'Symbol High':
					this.tech.comparison = 'SH'
					break
				case 'Symbol Open':
					this.tech.comparison = 'SO'
					break
				case 'Symbol Low':
					this.tech.comparison = 'SL'
					break
			}
		},
		saveCondition(index) {
			let checked = true
			if (this.description) {
				this.setDesciption()
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
		},
		// 设置编辑的数据
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				console.log('设置bolliger bands的数据')
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.comparison = obj.comparison
				this.tech.value = obj.value
				this.radio = ' '
				switch (this.tech.comparison) {
					case 'SC':
						this.conditionRadio = 'Symbol Close'
						break
					case 'SH':
						this.conditionRadio = 'Symbol High'
						break
					case 'SO':
						this.conditionRadio = 'Symbol Open'
						break
					case 'SL':
						this.conditionRadio = 'Symbol Low'
						break
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
</style>