// Moving-Average-Like input box
<template>
	<div class="senti-container">
		<!-- <p class="hint">Hint: To change the indicator settings, right click the indicator in the above chart and select "Edit Setting"</p> -->
		<el-form :model="tech" :rules="rules" ref="maForm" size="mini">
			<div class="condition-container">
				<el-form-item
						style="display: inline"
						effect="light"
						content="Compare with indicator value"
						placement="bottom"
						class="indicator-alignment"
					>
					<el-radio v-model="radio" label=" " @change="setRadio"></el-radio>
						<el-select
							v-model="tech.comparison"
							size="mini"
							filterable
							:disabled="!(radio === ' ')"
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
					<el-form-item
							style="display: inline"
							effect="light"
							content="The way of comparing between comparison and value"
							placement="bottom"
						>
							<el-select
								v-model="tech.condition"
								:disabled="!(radio === ' ')"
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
						<el-link type="info" :underline="false" class="ISL-text">Moving Average </el-link>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item prop="period">
							<el-input
								v-model="tech.period"
								:disabled="!(radio === ' ')"
								@input="getSCvalue"
								placeholder="Input Period"
							></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.ids"
							filterable
							:disabled="!(radio === ' ')"
							placeholder="Please select condition"
							@change="debouncedUpdateMaType"	
						>
							<el-option
								v-for="item in MATypeConditions"
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
					<el-radio
						v-model="radio"
						label="Moving Average"
						@change="setRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionInput">
					<el-form-item prop="ma_period">
							<el-input
								:disabled="!(radio === 'Moving Average')"
								v-model="tech.ma_period"
								placeholder="Input Period"
								@input="getMaPeriodValue"
							></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect">
					<el-form-item>
							<el-select
								v-model="tech.condition"
								filterable
								size="mini"
								:disabled="!(radio !== 'Moving Average')"
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
						<el-link type="info" :underline="false" class="ISL-text">Moving Average </el-link>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item prop="maPeriod">
							<el-input
								v-model="tech.maPeriod"
								:disabled="!(radio === 'Moving Average')"
								placeholder="Input Period"
								@input="getMaValue"
							></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.ids"
							filterable
							:disabled="!(radio === 'Moving Average')"
							placeholder="Please select condition"
							@change="debouncedUpdateMaType"	
						>
							<el-option
								v-for="item in MATypeConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
			</div>
			<!-- <div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="radio"
						label="Moving Average Ratio"
						@change="setRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionInput">
					<el-form-item prop="ma_period">

							<el-input
								:disabled="!(radio === 'Moving Average')"
								v-model="tech.ma_period"
								placeholder="Input Period"
								@input="getMaPeriodValue"
							></el-input>
					</el-form-item>
				</div>
				<el-form-item>
					/
				</el-form-item>
				<div class="conditionInput">
					<el-form-item prop="ma_period">

							<el-input
								:disabled="!(radio === 'Moving Average')"
								v-model="tech.ma_period"
								placeholder="Input Period"
								@input="getMaPeriodValue"
							></el-input>
					</el-form-item>
				</div>
				<el-form-item>
					ratio
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
							<el-select
								v-model="tech.condition"
								filterable
								size="mini"
								:disabled="!(radio === 'Moving Average')"
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
					<el-form-item prop="maPeriod">
							<el-input
								v-model="tech.maPeriod"
								:disabled="!(radio === 'Moving Average')"
								placeholder="Input Period"
								@input="getMaValue"
							></el-input>
					</el-form-item>
				</div>
			</div> -->
		</el-form>
	</div>
</template>
<script>
import { CIQ } from '@/components/common/chart/st-development/js'
import { mapGetters } from 'vuex'
const throttle = require('lodash/throttle')
export default {
	name: 'ma',
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
		let validatePeriod = (rule, value, callback) => {
			if (!/[1-9]\d*/.test(value)) {
				return callback(new Error('Please enter a positive integer'))
			}
			if (value === 0 || value === '') {
				return callback(new Error('Please input period'))
			}
			if (isNaN(value)) {
				return callback(new Error('Please enter the correct format'))
			}
			callback()
		}
		let validateMaPeriodRule = (rule, value, callback) => {
			if (!/[1-9]\d*/.test(value)) {
				return callback(new Error('Please enter a positive integer'))
			}
			if (value === 0 || value === '') {
				return callback(new Error('Please input period'))
			}
			if (isNaN(value)) {
				return callback(new Error('Please enter the correct format'))
			}
			callback()
		}
		let validateMaPeriod = (rule, value, callback) => {
			if (!/[1-9]\d*/.test(value)) {
				return callback(new Error('Please enter a positive integer'))
			}
			if (value === 0 || value === '') {
				return callback(new Error('Please input period'))
			}
			if (isNaN(value)) {
				return callback(new Error('Please enter the correct format'))
			}
			callback()
		}
		return {
			tech: {
				ids: 'SMA',
				condition: 3,
				comparison: 'SC',
				ma_period: 5,
				period: 21,
				maPeriod: 21
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			radio: ' ',
			maRadio: 'SMA',
			description: '',
			editTechVal: '',
			radioConditions: [
				{ value: 'SC', label: 'Symbol Close' },
				{ value: 'SH', label: 'Symbol High' },
				{ value: 'SO', label: 'Symbol Open' },
				{ value: 'SL', label: 'Symbol Low' }
			],
			rules: {
				period: [{ validator: validatePeriod, trigger: 'blur' }],
				ma_period: [{ validator: validateMaPeriod, trigger: 'blur' }],
				maPeriod: [{ validator: validateMaPeriodRule, trigger: 'blur' }]
			},
			MATypeConditions: [
				{ value: 'SMA', label: 'Simple' },
				{ value: 'EMA', label: 'Exponential' },
			],
		}
	},
	computed: {
		...mapGetters(['getterDirection']),
		direction() {
      return this.getterDirection
    },
		updateSettingMA() {
			return this.$store.state.chart.studySettingMA
		},
	},
	watch: {
		updateSettingMA(val) {
			if(val['criteria'] == this.criteria && val['panelIndex'] == this.panelIndex){
				this.getMaValue(val['period'])
				this.getSCvalue(val['period'])
			}
		},
		isActived: {
			handler(newVal) {
				if (newVal) {
					var obj = CIQ.store.state.form.conditionRadio
					obj[this.criteria][this.panelIndex] = this.radio
					CIQ.store.commit('form/setConditionRadio', obj)
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.$refs.maForm.resetFields()
		},
		clearFormValidate() {
			this.$refs.maForm.clearValidate()
		},
		setRadio(val) {
			this.clearFormValidate()
			var obj = CIQ.store.state.form.conditionRadio
			obj[this.criteria][this.panelIndex] = val
			CIQ.store.commit('form/setConditionRadio', obj)
			if (val === 'Moving Average') {
				this.tech.comparison = 'MA'
			}
			if (val === ' ') {
				this.tech.comparison = 'SC'
			}
		},
		setDesciption(index) {
			let commentDes
			if (index === 0) {
				let relation = ''
				let score = ''
				let period = ''
				switch (this.relation) {
					case 0:
						relation = 'Only Risk;'
						break
					case 1:
						relation = ''
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
				let delay_bars = this.delay_bars ? 'Delay Bars: ' + this.delay_bars + ';' : ''
				commentDes = `${relation ? `${relation} ` : ''}${score ? `${score} ` : ''}${period ? `${period} ` : ''}${delay_bars}`
				if(this.relation != 1) {
				let desObj = {}
				desObj.criteria = this.criteria
				desObj.description = {
					'commentDes':commentDes,
					'rocCond':{'ma_type': this.tech.ids}
				}
				desObj.index = index
				this.$store.commit('form/saveDescription', desObj)}
			}
				let techVal = this.techVal ? this.techVal : this.editTechVal
				let period =
					this.radio !== 'Moving Average'
						? this.tech.period
						: this.tech.maPeriod
				let ma_period =
					this.radio == 'Moving Average' ? this.tech.ma_period : ''
				let conditionRadio =
					this.radio == ' ' ? this.tech.comparison : this.radio
				let comparison
				switch (this.tech.comparison) {
					case 'SC':
						comparison = 'Symbol Close'
						break
					case 'SH':
						comparison = 'Symbol High'
						break
					case 'SL':
						comparison = 'Symbol Low'
						break
					case 'SO':
						comparison = 'Symbol Open'
						break
					case 'MA':
						comparison = 'Moving Average'
						break
					default:
						break
				}
				let condition = this.conditions[this.tech.condition].label
				const maType = this.tech.ids == 'SMA' ? 'Simple' : 'Exponential'
				this.description = `${comparison} ${ma_period ? `${ma_period} ` : ''}${condition} ${maType} Moving Average ${period}`

				let desObj = {}
				desObj.criteria = this.criteria
				if(this.relation != 1) {
					desObj.description = {
						'commentDes':this.description,
						'rocCond':{'ma_type': this.tech.ids}
					}
					desObj.index = index + 1
					}
				if(this.relation == 1) {
						desObj.description = {
							'commentDes':commentDes + this.description,
							'rocCond':{'ma_type': this.tech.ids}
						}
						desObj.index = 0
				}
				this.$store.commit('form/saveDescription', desObj)
		},
		getMaPeriodValue(val, limit) {
			
			this.tech.ma_period = val
			// keep current MA
			var objMA = { 
				period: this.tech.ma_period, 
				url: 'ma', 
				type: this.maRadio == 'SMA' ? 'simple' : 'exponential',
				criteria: this.criteria, 
				index: this.panelIndex
			}
			var activatedMAList = this.$store.state.chart.activatedMA

			// remove current MA attached to an indicator
			var MAListIndex = activatedMAList.findIndex(
				(item) => item.url == 'ma' && item.criteria == this.criteria && item.index == this.panelIndex
			)
			if (MAListIndex != -1) {
				activatedMAList.splice(MAListIndex, 1)
			}
			activatedMAList.push(objMA)

			this.$store.commit('chart/getMA', activatedMAList)
			this.$store.commit('form/getStMaPeriod', val)
		},
		getSCvalue(val, limit) {
			if (this.tech.comparison !== 'MA') {
				this.tech.period = val
		}
		},
		getMaValue: throttle(function (val, limit) {
			this.tech.maPeriod = val
		}, 500),
		saveCondition(index) {
			let checked = true
			if (this.isRiskControl) {
				return (checked = true)
			}
			let validForm
			if (this.radio !== 'Moving Average') {
				this.$refs['maForm'].validateField(['period'], (errorMsg) => {
					if (!errorMsg) {
						validForm = true
					}
				})
				if (validForm) {
					let tech = JSON.parse(JSON.stringify(this.tech))
					delete tech.ma_period
					delete tech.maPeriod
					tech.criteria = this.criteria
					tech.index = index
					this.$store.commit('form/saveCondition', tech)
					return checked
				} else {
					checked = false
					return checked
				}
			} else {
				let validMa_Period = false
				let validMaPeriod = false
				this.$refs['maForm'].validateField(['ma_period'], (errorMsg) => {
					if (!errorMsg) {
						validMa_Period = true
					}
				})
				this.$refs['maForm'].validateField(['maPeriod'], (errorMsg) => {
					if (!errorMsg) {
						validMaPeriod = true
					}
				})
				validForm = validMa_Period && validMaPeriod
				if (validForm) {
					let tech = JSON.parse(JSON.stringify(this.tech))
					tech.period = tech.maPeriod
					delete tech.maPeriod
					tech.criteria = this.criteria
					tech.index = index
					this.$store.commit('form/saveCondition', tech)
					return checked
				} else {
					checked = false
					return checked
				}
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				this.clearFormValidate()
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.comparison = obj.comparison
				if (this.tech.comparison === 'MA') {
					if(cond){
						this.tech.ids = cond.ma_type || 'SMA'
					}
					this.radio = 'Moving Average'
					this.tech.ma_period = obj.ma_period
					this.tech.maPeriod = obj.period
					this.getMaPeriodValue(obj.ma_period,this.$store.getters.getIsMarkerShownFlagState)
					this.getMaValue(obj.period,this.$store.getters.getIsMarkerShownFlagState)
				} else {
					this.radio = ' '
					this.tech.period = obj.period
					this.getSCvalue(this.tech.period,this.$store.getters.getIsMarkerShownFlagState)
				}
				this.editTechVal = obj.indicator

					var cr = CIQ.store.state.form.conditionRadio
					cr[this.criteria][this.panelIndex] = this.radio
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
}
.el-select {
  margin: 0 5px;
}
.el-radio, /deep/ .el-form-item__label {
  margin-right: 5px;
}
.indicator-alignment /deep/ label.el-radio {
	margin-right: -6px;
}
.ISL-text {
	cursor: auto;
	font-size: 12px;
	margin-right: 5px;
}
.ISL-text:hover {
	color: #909399;
}
</style>