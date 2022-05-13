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
					<el-radio
						v-model="radio"
						label="first"
						@change="setRadio"
					>&nbsp;</el-radio>
					<el-tooltip style="diaplay:inline" effect="light" content="Compare with indicator value" placement="bottom">
					<el-select
						v-model="tech.comparison"
						@change="setDesciption"
						size="mini"
						:disabled="!(this.radio === 'first')"
						filterable
						placeholder="Please select condition"
					>
						<el-option
							v-for="item in scRadioConditions"
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
							:disabled="!(this.radio === 'first')"
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
				<div class="conditionSelect">
					<el-form-item>
						<el-tooltip style="diaplay:inline" effect="light" content="Compare with indicator value" placement="bottom">
						<el-select
							v-model="tech.value"
							:disabled="!(this.radio === 'first')"
							size="mini"
							filterable
							placeholder="Please select condition"
							@change="getValue1Select"
						>
							<el-option
								v-for="item in valueConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
						</el-tooltip>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-form-item>
						<el-radio
							v-model="radio"
							@change="setRadio"
							label="second"
						>&nbsp;</el-radio>
						<el-tooltip style="diaplay:inline" effect="light" content="Compare with indicator value" placement="bottom">
						<el-select
							v-model="comparison2"
							:disabled="!(this.radio === 'second')"
							size="mini"
							filterable
							@change="getRadio2Select"
							placeholder="Please select condition"
						>
							<el-option
								v-for="item in radioConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
								:disabled="item.disabled"
							>
							</el-option>
						</el-select>
						</el-tooltip>
					</el-form-item>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-tooltip style="diaplay:inline" effect="light" content="The way of comparing between comparison and value" placement="bottom">
						<el-select
							v-model="tech.condition"
							filterable
							size="mini"
							:disabled="!(this.radio === 'second')"
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
				<div class="conditionSelect">
					<el-form-item>
						<el-tooltip style="diaplay:inline" effect="light" content="Compare with indicator value" placement="bottom">
						<el-select
							v-model="value2"
							:disabled="!(this.radio === 'second')"
							size="mini"
							filterable
							placeholder="Please select condition"
							@change="getValue2Select"
						>
							<el-option
								v-for="item in valueConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
								:disabled="item.disabled"
							>
							</el-option>
						</el-select>
						</el-tooltip>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
const throttle = require('lodash/throttle')
export default {
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		// editIndiData: Object,
		direction: String,
		isActived: Boolean,
		exitItemCheck: Boolean,
		relation: [String, Number],
score: [String, Number],
period: [String, Number],
delay_bars: [String, Number]
	},
	data() {
		return {
			tech: {
				ids: 'ALLI',
				comparison: 'SC',
				condition: 3,
				value: 'JAW'
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			radioConditions: [
				{ value: 'JAW', label: 'Jaw', disabled: false },
				{ value: 'TEETH', label: 'Teeth', disabled: true },
				{ value: 'LIPS', label: 'Lips', disabled: false }
			],
			valueConditions: [
				{ value: 'JAW', label: 'Jaw', disabled: true },
				{ value: 'TEETH', label: 'Teeth', disabled: false },
				{ value: 'LIPS', label: 'Lips', disabled: false }
			],
			scRadioConditions: [
				{ value: 'SC', label: 'Symbol Close' },
				{ value: 'SH', label: 'Symbol High' },
				{ value: 'SO', label: 'Symbol Open' },
				{ value: 'SL', label: 'Symbol Low' }
			],
			description: '',
			value2: 'TEETH',
			comparison2: 'JAW',
			editTechVal: '',
			radio: 'first'
		}
	},
	watch: {
		isActived: {
			handler(newVal) {
				if(newVal){
					var _obj = {
						radio: this.radio,
						radioValue: this.comparison2,
						techValue: this.radio === 'first' ? this.tech.value : this.value2
					}
					var obj = CIQ.store.state.conditionRadio
					//obj.Aligator_like = JSON.stringify(_obj)
					obj[this.criteria][this.panelIndex] = JSON.stringify(_obj)
					CIQ.store.commit('setConditionRadio', obj)
					//console.log('handle alligator,',obj)
				}	
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
		},
		getValue1Select(val) {
			this.tech.value = val
			var _obj = {
				radio: this.radio,
				radioValue: this.comparison2,
				techValue: this.radio === 'first' ? this.tech.value : this.value2
			}
			var obj = CIQ.store.state.conditionRadio
			//obj.Aligator_like = JSON.stringify(_obj)
			obj[this.criteria][this.panelIndex] = JSON.stringify(_obj)
			//console.log(obj)
			CIQ.store.commit('setConditionRadio', obj)
			this.setDesciption()
			//CIQ.exportEx()
		},
		setRadio(val) {
			var _obj = {
				radio: val,
				radioValue: this.comparison2,
				techValue: this.radio === 'first' ? this.tech.value : this.value2
			}
			var obj = CIQ.store.state.conditionRadio
			//obj.Aligator_like = JSON.stringify(_obj)
			obj[this.criteria][this.panelIndex] = JSON.stringify(_obj)
			//console.log(obj)
			CIQ.store.commit('setConditionRadio', obj)
			//CIQ.exportEx()
		},
		getRadio2Select(val) {
			for (let i = 0; i < this.valueConditions.length; i++) {
				this.valueConditions[i].disabled = false
				if (this.valueConditions[i].value === val) {
					this.valueConditions[i].disabled = true
				}
			}
			var _obj = {
				radio: this.radio,
				radioValue: this.comparison2,
				techValue: this.value2
			}
			var obj = CIQ.store.state.conditionRadio
			//obj.Aligator_like = JSON.stringify(_obj)
			obj[this.criteria][this.panelIndex] = JSON.stringify(_obj)
			//console.log(obj)
			CIQ.store.commit('setConditionRadio', obj)
			this.setDesciption()
			//CIQ.exportEx()
		},
		getValue2Select(val) {
			for (let i = 0; i < this.radioConditions.length; i++) {
				this.radioConditions[i].disabled = false
				if (this.radioConditions[i].value === val) {
					this.radioConditions[i].disabled = true
				}
			}
			var _obj = {
				radio: this.radio,
				radioValue: this.comparison2,
				techValue: this.value2
			}
			//console.log(_obj)
			var obj = CIQ.store.state.conditionRadio
			//obj.Aligator_like = JSON.stringify(_obj)
			obj[this.criteria][this.panelIndex] = JSON.stringify(_obj)
			CIQ.store.commit('setConditionRadio', obj)
			//CIQ.exportEx()
			this.setDesciption()
		},
		setDesciption(index) {
			let criteria = ''
			let direction = ''
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
						relation = "Single Signal;"
						break;
					case 2:
						relation = "SameBar Multi Signal;"
						score = 'Score: ' + this.score
						break;
					case 3:
						relation = "TimeOrder Multi Signal;"
						period = 'Period: ' + this.period
						break;
					default:
						break;
				}
				let delay_bars = this.delay_bars?'Delay Bars: ' + this.delay_bars:''
				let commentDes = `${criteria} ${direction} ${relation} ${score?score:''} ${period?period:''} ${delay_bars}`
				   let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = commentDes
					desObj.index = index
					this.$store.commit('saveDescription', desObj)
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
			let radio = this.radio === 'first' ? comparison : this.comparison2
			let value = this.radio === 'first' ? this.tech.value : this.value2
			let condition = this.conditions[this.tech.condition].label
			this.description = `${techVal} ${radio} ${condition} ${value}`
			console.log(this.description)
		},
		saveCondition(index) {
			let checked = true

			if(this.exitItemCheck) {
				return checked = true
			}
			if (this.radio === 'second') {
				this.tech.comparison = this.comparison2
			}
			let tech = JSON.parse(JSON.stringify(this.tech))
			tech.criteria = this.criteria
			tech.index = index
			this.$store.commit('saveCondition', tech)
			let desObj = {}
			desObj.criteria = this.criteria
			desObj.index = index + 1
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
				if (
					this.tech.comparison === 'SC' ||
					this.tech.comparison === 'SO' ||
					this.tech.comparison === 'SL' ||
					this.tech.comparison === 'SH'
				) {
					this.radio = 'first'
					this.tech.comparison = obj.comparison
				    this.tech.value = obj.value
				}
				if (
					this.tech.comparison === 'TEETH' ||
					this.tech.comparison === 'JAW' ||
					this.tech.comparison === 'LIPS'
				) {
					this.radio = 'second'
					this.value2 = obj.value
					this.comparison2 = obj.comparison
					this.getRadio2Select(this.comparison2)
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