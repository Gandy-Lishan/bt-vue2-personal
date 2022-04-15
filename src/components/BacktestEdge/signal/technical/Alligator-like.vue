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
						label=" "
						@change="getRadioSelect"
					></el-radio>
					<el-select
						v-model="conditionRadio"
						size="mini"
						:disabled="!(this.radio === ' ')"
						filterable
						@change="getConditionRadio"
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
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.condition"
							:disabled="!(this.radio === ' ')"
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
							v-model="scValue"
							:disabled="!(this.radio === ' ')"
							size="mini"
							filterable
							placeholder="Please select condition"
							@change="getConditionRadioSymbolClose"
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
			<div class="condition-container">
				<el-form-item>
					<el-form-item>
						<el-radio
							v-model="radio"
							@change="getRadioSelect"
							label="  "
						></el-radio>
						<el-select
							v-model="radioValue"
							:disabled="!(this.radio === '  ')"
							size="mini"
							filterable
							@change="getRadioValue"
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
					</el-form-item>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.condition"
							filterable
							size="mini"
							:disabled="!(this.radio === '  ')"
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
							:disabled="!(this.radio === '  ')"
							size="mini"
							filterable
							placeholder="Please select condition"
							@change="getTechValue"
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
				{ value: 'Symbol Close', label: 'Symbol Close' },
				{ value: 'Symbol High', label: 'Symbol High' },
				{ value: 'Symbol Open', label: 'Symbol Open' },
				{ value: 'Symbol Low', label: 'Symbol Low' }
			],
			conditionRadio: 'Symbol Close',
			description: '',
			scValue: 'JAW',
			radioValue: 'JAW',
			editTechVal: '',
			radio: ' '
		}
	},
	watch: {
		techVal: {
			handler(newVal) {
				var _obj = {
					radio: this.conditionRadio,
					radioValue: this.radioValue,
					techValue: this.tech.value
				}
				var obj = CIQ.store.state.conditionRadio
				obj.Aligator_like = JSON.stringify(_obj)
				CIQ.store.commit('setConditionRadio', obj)
				//console.log('watch alligator techVal!!!!!!!!!',obj)
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
		},
		getConditionRadioSymbolClose(val) {
			this.scValue = val
			var _obj = {
				radio: this.conditionRadio,
				radioValue: this.radioValue,
				techValue: this.scValue
			}
			var obj = CIQ.store.state.conditionRadio
			obj.Aligator_like = JSON.stringify(_obj)
			CIQ.store.commit('setConditionRadio', obj)
			//CIQ.exportEx()
		},
		getRadioSelect(val) {
			this.radio = val
			if (val === ' ') {
				this.tech.comparison = 'SC'
				this.conditionRadio = 'Symbol Close'
				this.tech.value = this.scValue
			}
			if (val === '  ') {
				this.tech.comparison = this.radioValue
				this.radioValue = 'JAW'
				this.tech.value = 'TEETH'
			}
			var _obj = {
				radio: val,
				radioValue: this.radioValue,
				techValue: this.tech.value
			}
			var obj = CIQ.store.state.conditionRadio
			obj.Aligator_like = JSON.stringify(_obj)
			CIQ.store.commit('setConditionRadio', obj)

			this.setDesciption()
			//CIQ.exportEx()
		},
		getRadioValue(val) {
			for (let i = 0; i < this.valueConditions.length; i++) {
				this.valueConditions[i].disabled = false
				if (this.valueConditions[i].value === val) {
					this.valueConditions[i].disabled = true
				}
			}
			var _obj = {
				radio: this.conditionRadio,
				radioValue: this.radioValue,
				techValue: this.tech.value
			}
			var obj = CIQ.store.state.conditionRadio
			obj.Aligator_like = JSON.stringify(_obj)
			CIQ.store.commit('setConditionRadio', obj)
			//CIQ.exportEx()
		},
		getTechValue(val) {
			for (let i = 0; i < this.radioConditions.length; i++) {
				this.radioConditions[i].disabled = false
				if (this.radioConditions[i].value === val) {
					this.radioConditions[i].disabled = true
				}
			}
			var _obj = {
				radio: this.conditionRadio,
				radioValue: this.radioValue,
				techValue: this.tech.value
			}
			var obj = CIQ.store.state.conditionRadio
			obj.Aligator_like = JSON.stringify(_obj)
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
			let radio = this.radio === ' ' ? this.conditionRadio : this.radioValue
			let value = this.radio === ' ' ? this.scValue : this.tech.value
			let condition = this.conditions[this.tech.condition].label
			this.description = `${criteria} ${direction} ${techVal} ${radio} ${condition} ${value}`
			console.log(this.description)
		},
		saveCondition(index) {
			let checked = true
			if (this.conditionRadio === '  ') {
				this.tech.comparison = this.radioValue
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
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.comparison = obj.comparison
				this.tech.value = obj.value
				if (
					this.tech.comparison === 'SC' ||
					this.tech.comparison === 'SO' ||
					this.tech.comparison === 'SL' ||
					this.tech.comparison === 'SH'
				) {
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
					this.scValue = this.tech.value
				}
				if (
					this.tech.comparison === 'TEETH' ||
					this.tech.comparison === 'JAW' ||
					this.tech.comparison === 'LIPS'
				) {
					this.radio = '  '
					this.tech.scValue = this.tech.value
					this.radioValue = this.tech.comparison
					this.getRadioValue(this.radioValue)
				}
				this.editTechVal = obj.indicator
				this.setDesciption()
			}
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