<template>
	<div class="senti-container">
		<el-form :model="tech" ref="macdForm" :rules="rules">
			<!-- <div class="ids-container">
				<el-form-item label="Slow moving average" prop="MACDSlow">
					<el-input
						v-model="tech.ids.MACDSlow"
						disabled
					></el-input>
				</el-form-item>
				<el-form-item label="Fast moving average" prop="MACDFast">
					<el-input
						disabled
						v-model="tech.ids.MACDFast"
					></el-input>
				</el-form-item>
				<el-form-item label="Signal line" prop="MACDSL">
					<el-input
						disabled
						v-model="tech.ids.MACDSL"
					></el-input>
				</el-form-item>
			</div> -->
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="radio"
						label="Indicator Value"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-tooltip style="diaplay:inline" effect="light" content="The way of comparing between comparison and value" placement="bottom">
						<el-select
							:disabled="!(radio === 'Indicator Value')"
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
					<el-form-item prop="value">
												<el-tooltip style="diaplay:inline" effect="light" content="Compare with indicator value" placement="bottom">
						<el-input
							:disabled="!(radio === 'Indicator Value')"
							v-model="tech.value"
							placeholder="Input Value"
						></el-input>
						</el-tooltip>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="radio"
						label="Indicator Value "
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-tooltip style="diaplay:inline" effect="light" content="The way of comparing between comparison and value" placement="bottom">
						<el-select
							:disabled="!(radio === 'Indicator Value ')"
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
						<el-button type="text"> Indicator Signal line </el-button>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="radio"
						label="Indicator Hist"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(radio === 'Indicator Hist')"
							v-model="histCondition"
							size="mini"
							filterable
							placeholder="Please select condition"
						>
							<el-option
								v-for="item in histConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item prop="histValue">
						<el-input
							:disabled="!(radio === 'Indicator Hist')"
							v-model="tech.histValue"
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
const throttle = require('lodash/throttle')
export default {
	name: 'macd',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		direction: String,
		isActived: Boolean,
		exitItemCheck: Boolean,
		relation: [String, Number],
score: [String, Number],
period: [String, Number],
delay_bars: [String, Number],
		tabLength: Number,

	},
	data() {
		let validateValue = (rule, value, callback) => {
			if (value === '') {
				return callback(new Error('Please input value'))
			}
			if (isNaN(value) && value !== 'MACDSL') {
				return callback(new Error('Please enter the correct format'))
			}
			const pattern =
				/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(value) && value != 0 && value !== 'MACDSL') {
				return callback(new Error('Enter up to two decimal places'))
			}
			callback()
		}
		let validateHistValue = (rule, value, callback) => {
			if (value === '') {
				return callback(new Error('Please input value'))
			}
			if (isNaN(value) && value !== 'MACDSL') {
				return callback(new Error('Please enter the correct format'))
			}
			const pattern =
				/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(value) && value != 0 && value !== 'MACDSL') {
				return callback(new Error('Enter up to two decimal places'))
			}
			callback()
		}
		return {
			tech: {
				ids: 'MACD',
				condition: 3,
				comparison: 'MACD',
				value: 0,
				histValue: 0
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			histConditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' }
			],
			description: '',
			editTechVal: '',
			histCondition: 0,
			radio: 'Indicator Value',
			rules: {
				value: [{ validator: validateValue, trigger: 'blur' }],
				histValue: [{ validator: validateHistValue, trigger: 'blur' }]
			}
		}
	},
	watch: {
		isActived: {
			handler(newVal) {
				if(newVal){
					var obj = CIQ.store.state.conditionRadio
					obj[this.criteria][this.panelIndex] = this.radio
					CIQ.store.commit('setConditionRadio', obj)
					//console.log('handle macd,',obj)
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			this.$refs.macdForm.resetFields()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.macdForm.clearValidate()
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
						relation = "Single Signal;"
						break;
					case 2:
						relation = "SameBar Multi Signal;"
						score = 'Score: ' + this.score + ';'
						break;
					case 3:
						relation = "TimeOrder Multi Signal;"
						period = 'Period: ' + this.period + ';'
						break;
					default:
						break;
				}
				let delay_bars = this.delay_bars?'Delay Bars: ' + this.delay_bars + ';':''
				commentDes = `${criteria} ${direction} ${relation} ${score?score:''} ${period?period:''} ${delay_bars}`
				 if(this.relation != 1) { let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = commentDes
					desObj.index = index
					this.$store.commit('saveDescription', desObj)}  
				  
			}
			let value = this.tech.value
			let condition = this.conditions[this.tech.condition].label
			let techVal = this.techVal ? this.techVal : this.editTechVal
			if (this.radio === 'Indicator Hist') {
				techVal += ' Hist'
				value = this.tech.histValue
				condition = this.conditions[this.histCondition].label
			}
			this.description = `${techVal} ${condition} ${value}`
				let desObj = {}
				desObj.criteria = this.criteria
					if(this.relation != 1) {
					desObj.description = this.description
					desObj.index = index + 1
					}
					if(this.relation == 1) {
						desObj.description = commentDes+ this.description
						desObj.index = 0
					}
				this.$store.commit('saveDescription', desObj)
		},
		getConditionRadio(val) {
			this.clearFormValidate()
			var obj = CIQ.store.state.conditionRadio
			obj[this.criteria][this.panelIndex] = val
			CIQ.store.commit('setConditionRadio', obj)
			switch (val) {
				case 'Indicator Value':
					this.tech.value = 0
					this.tech.comparison = 'MACD'
					break
				case 'Indicator Value ':
					this.tech.value = 'SL'
					this.tech.comparison = 'MACD'
					break
				case 'Indicator Hist':
					this.tech.value = 0
					this.tech.comparison = 'MACDH'
					break
			}
			//CIQ.exportEx()
		},
		saveCondition(index) {
			let checked = true
						if(this.exitItemCheck) {
				return checked = true
			}
			let validForm = true
			if(this.radio === 'Indicator Value') {
				this.$refs['macdForm'].validateField(['value'], (errorMsg) => {
					if (errorMsg) {
						validForm = false
					}
				})
			}
			if(this.radio === 'Indicator Value ') {
				this.$refs['macdForm'].validateField(['histValue'], (errorMsg) => {
					if (errorMsg) {
						validForm = false
					}
				})
			}
			if (validForm) {
				
				let tech = JSON.parse(JSON.stringify(this.tech))

				if (this.description) {
					this.setDesciption(index)
				}
				if (this.radio === 'Indicator Hist') {
					tech.condition = this.histCondition
					tech.value = tech.histValue
					delete tech.histValue
				}else{
					delete tech.histValue
				}
				tech.criteria = this.criteria
				tech.index = index
				this.$store.commit('saveCondition', tech)
				return checked
			} else {
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				this.clearFormValidate()
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.value = obj.value
				this.tech.comparison = obj.comparison
				if (this.tech.value === 'SL' && this.tech.comparison === 'MACD') {
					this.radio = 'Indicator Value '	
				    this.tech.condition = Number(obj.condition)
				}
				if (this.tech.comparison === 'MACDH') {
					this.radio = 'Indicator Hist'
					this.histCondition = Number(obj.condition)
				}
				if (this.tech.value !== 'SL' && this.tech.comparison === 'MACD') {
					this.radio = 'Indicator Value'
				    this.tech.condition = Number(obj.condition)
				}
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
	&:first-child {
		border-top: 1px solid #797979;
	}
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