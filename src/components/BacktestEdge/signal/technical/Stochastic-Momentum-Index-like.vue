<template>
	<div class="senti-container">
		<p class="hint">Hint: To change the indicator settings, right click the indicator in the above chart and select "Edit Setting"</p>
		<el-form :model="tech" :rules="rules" ref="smiForm">
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
						label="%K"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(radio === '%K')"
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
					<el-form-item prop="value">
						<el-input
							:disabled="!(radio === '%K')"
							v-model="tech.value"
							placeholder="Input Value"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="radio"
						label="%D"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>

						<el-select
							:disabled="!(radio === '%D')"
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
					<el-form-item prop="valueD">

						<el-input
							:disabled="!(radio === '%D')"
							v-model="tech.valueD"
							placeholder="Input Value"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="radio"
						label="%K "
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>

						<el-select
							:disabled="!(radio === '%K ')"
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
						<el-button type="text"> %D </el-button>
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
	name: 'stochastic',
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
delay_bars: [String, Number],
		tabLength: Number,

	},
	data() {
		var validateValue = (rule, value, callback) => {
			if (value === '') {
				return callback(new Error('Please input value'))
			}
			if (isNaN(value) && value !== 'D') {
				return callback(new Error('Please enter the correct format'))
			}
			const pattern =
				/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(value) && value != 0 && value !== 'D') {
				return callback(new Error('Enter up to two decimal places'))
			}
			callback()
		}
		var validateValueD = (rule, value, callback) => {
			console.log(value);
			if (value === '') {
				return callback(new Error('Please input value'))
			}
			if (isNaN(value) && value !== 'D') {
				return callback(new Error('Please enter the correct format'))
			}
			const pattern =
				/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(value) && value != 0 && value !== 'D') {
				return callback(new Error('Enter up to two decimal places'))
			}
			callback()
		}
		return {
			tech: {
				ids: 'SMI',
				condition: 3,
				comparison: 'K',
				value: 0,
				valueD: 0
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			description: '',
			editTechVal: '',
			radio: '%K',
			rules: {
				value: [{ validator: validateValue, trigger: 'blur' }],
				valueD:[{ validator: validateValueD, trigger: 'blur' }]
			}
		}
	},
	watch: {
		isActived: {
			handler(newVal) {
				if(newVal){
					//console.log('watch techVal!!!!!!!!!',newVal)
					var obj = CIQ.store.state.conditionRadio
					obj[this.criteria][this.panelIndex] = this.radio
					CIQ.store.commit('setConditionRadio', obj)
					//console.log('handle stocastic,',obj)
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			this.$refs.smiForm.resetFields()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.smiForm.clearValidate()
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
				if(this.relation != 1) {
				   let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = commentDes
					desObj.index = index
					this.$store.commit('saveDescription', desObj)
				}  
			}
			let techVal = this.techVal ? this.techVal : this.editTechVal
			let value = this.radio !== '%D'?this.tech.value:this.tech.valueD
			let suffix = ''
			switch (this.radio) {
				case '%K':
					suffix = ' K'
					break
				case '%K ':
					suffix = ' K'
					break
				case '%D':
					suffix = ' D'
					break
			}
			this.description = `${techVal}${suffix} ${this.conditions[this.tech.condition].label} ${value}`
			console.log(this.description);
				let desObj = {}
				desObj.criteria = this.criteria
					if(this.relation != 1) {
					desObj.description = this.description
					desObj.index = index + 1
					}
					if(this.relation == 1) {
						desObj.description = commentDes + this.description
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
				case '%K':
					this.tech.value = 0
					this.tech.comparison = 'K'
					break
				case '%K ':
					this.tech.value = 'D'
					this.tech.comparison = 'K'
					break
				case '%D':
					this.tech.valueD = 0
					this.tech.comparison = 'D'
					break
			}
			//CIQ.exportEx()
		},
		saveCondition(index) {
			let checked = true
						if(this.exitItemCheck) {
				return checked = true
			}
			let validForm
			this.$refs.smiForm.validate((valid) => {
				validForm = valid
			})
			if (validForm) {
				if (this.description) {
					this.setDesciption(index)
				}
				let tech = JSON.parse(JSON.stringify(this.tech))
				tech.criteria = this.criteria
				tech.index = index
				if(this.radio === "%D") {
					tech.value = tech.valueD
				}
				delete tech.valueD
				this.$store.commit('saveCondition', tech)
				return checked
			} else {
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				console.log("setEditData",newVal)
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.value = obj.value
				this.tech.comparison = obj.comparison
				if (this.tech.value !== 'D' && this.tech.comparison === 'K') {
					this.radio = '%K'
				}
				if (this.tech.value === 'D' && this.tech.comparison === 'K') {
					this.radio = '%K '
				}
				if (this.tech.comparison === 'D') {
					this.radio = '%D'
					this.tech.valueD = obj.value
				}
				this.editTechVal = obj.indicator
				//console.log("stocha this.radio",this.radio)
					var cr = CIQ.store.state.conditionRadio
					cr[this.criteria][this.panelIndex] = this.radio
					CIQ.store.commit('setConditionRadio', cr)
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
	margin-right: 36px;
}
</style>