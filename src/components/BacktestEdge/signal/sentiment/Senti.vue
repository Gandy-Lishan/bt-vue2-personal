<template>
	<div class="senti-container">
		<el-form :model="senti" :rules="rules" ref="sentiForm">
			<div class="ids-container">
				<el-form-item label="Extreme Optimism" prop="extreme_optimism">
					<el-input
						disabled
						v-model="senti.extreme_optimism"
						oninput="value=value.replace(/[^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
				<el-form-item label="Extreme Pessimism" prop="extreme_pessimism">
					<el-input
						disabled
						v-model="senti.extreme_pessimism"
						oninput="value=value.replace(/^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="Sentiment Value"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							:disabled="!(conditionRadio === 'Sentiment Value')"
							v-model="senti.condition"
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
							:disabled="!(conditionRadio === 'Sentiment Value')"
							@input="setDesciption"
							v-model="senti.value"
							placeholder="Input Value"
							oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="Sentiment Moving Average"
						@change="getConditionRadio"
					>
					</el-radio>
				</el-form-item>
				<div class="conditionInput">
					<el-form-item prop="period">
						<el-input
							@change="setPeriod"
							:disabled="!(conditionRadio === 'Sentiment Moving Average')"
							placeholder="Input Period"
							oninput="value=value.replace(/[^\d]/g,'')"
							v-model="senti.period"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="senti.condition"
							filterable
							:disabled="!(conditionRadio === 'Sentiment Moving Average')"
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
					<el-form-item prop="maValue">
						<el-input
							:disabled="!(conditionRadio === 'Sentiment Moving Average')"
							v-model="senti.maValue"
							placeholder="Input Value"
							@input="change($event)"
							oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
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
const _ = require('lodash')
const throttle = _.throttle
export default {
	name: 'senti',
	props: {
		criteria: String,
		sentiUrl: String,
		sentiVal: String,
		// editIndiData: Object,
		direction: String
	},
	data() {
		var validateValue = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('Please input value'))
			} else if (isNaN(value)) {
				callback(new Error('Please enter the correct format'))
			} else {
				const pattern =
					/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
				if (!pattern.test(value) && value != 0) {
					callback(new Error('Enter up to two decimal places'))
				} else {
					callback()
				}
			}
		}
		var validateMaValue = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('Please input value'))
			} else if (isNaN(value)) {
				callback(new Error('Please enter the correct format'))
			} else if (value) {
				const pattern =
					/^((-?[1-9][0-9]*)|(-?[0]\.\d{1,2}|-?[1-9][0-9]*\.\d{1,2}))$/
				if (!pattern.test(value) && value != 0) {
					callback(new Error('Enter up to two decimal places'))
				} else {
					callback()
				}
			}
		}
		var validatePeriod = (rule, value, callback) => {
			if (value === 0 || value === '') {
				callback(new Error('Please input period'))
			} else if (isNaN(value)) {
				callback(new Error('Please enter the correct format'))
			} else if (value) {
				const pattern = /[1-9]\d*/
				if (!pattern.test(value)) {
					callback(new Error('Please enter a positive integer'))
				} else {
					callback()
				}
			}
		}
		return {
			preload: false,
			senti: {
				extreme_optimism: '',
				extreme_pessimism: '',
				condition: 3,
				value: '',
				period: '',
				maValue: ''
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],

			disabled: false,
			conditionRadio: 'Sentiment Value',
			description: '',
			editSentiVal: '',
			rules: {
				value: [{ validator: validateValue, trigger: 'blur' }],
				maValue: [{ validator: validateMaValue, trigger: 'blur' }],
				period: [{ validator: validatePeriod, trigger: 'blur' }]
			},
			maValue: ''
		}
	},
	computed: {
		...mapGetters(['getExtremeValue']),
		extremeValue() {
			return this.getExtremeValue
		},
		updateSenti() {
			return this.$store.state.currentSenti
		}
	},
	watch: {
		updateSenti: {
			handler() {
				this.preload = true
			},
			immediate: true,
			deep: true
		},
		extremeValue: {
			handler(newVal) {
				let vm = this
				newVal.forEach((item) => {
					if (item.indicator) {
						if (item.indicator === vm.sentiUrl || vm.preload == true) {
							vm.senti.extreme_pessimism = item.extremePessimism
							vm.senti.extreme_optimism = item.extremeOptimism
						}
					}
				})
				vm.preload = false
			},
			immediate: true,
			deep: true
		},
		sentiUrl: {
			handler(newVal) {
				if (newVal) {
					let vm = this
					let extremeValue = this.$store.state.extremeValue
					extremeValue.forEach((item) => {
						if (item.indicator) {
							if (item.indicator === newVal) {
								vm.senti.extreme_pessimism = item.extremePessimism
								vm.senti.extreme_optimism = item.extremeOptimism
							}
						}
					})
				}
			}
		}
	},
	methods: {
		change(e) {
			// const vm = this
			this.$forceUpdate()
			// console.log('强制刷新事件', e)
			// vm.$refs['sentiForm'].validateField(['maValue'], (errorMsg) => {
			// 	if (!errorMsg) {
			// 		console.log('校验失败')
			// 	}
			// })
		},
		clearForm() {
			// Object.assign(this.$data, this.$options.data())
			this.$refs.sentiForm.resetFields()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.sentiForm.clearValidate()
		},
		// clearNoNum(value) {
		// 	console.log(value)
		// 	//先把非数字的都替换掉，除了数字和.
		// 	// value = value.replace(/[^\d.]/g, '')
		// 	//保证只有出现一个.而没有多个.
		// 	value = value.replace(/\.{2,}/g, '.')
		// 	//必须保证第一个为数字而不是.
		// 	value = value.replace(/^\./g, '')
		// 	//保证.只出现一次，而不能出现两次以上
		// 	value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
		// 	//只能输入两个小数
		// 	value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3')
		// 	value = value.replace(/^0+\./, '0.')
		// 	value = value.replace(/^\-+/g, '-')
		// 	console.log('处理过后的值', value)
		// 	this.senti.value = value
		// },
		setDesciption(val) {
			let criteria = ''
			let direction = ''
			if (this.criteria == 'entry') {
				criteria = 'E:'
				direction = this.direction + ':'
			} else if (this.criteria == 'exit') {
				criteria = 'X:'
				if (this.direction == 'Long') {
					direction = 'Cover:'
				} else if (this.direction == 'Short') {
					direction = 'Close:'
				}
			}
			let ma = this.senti.period ? 'moving average' : ''
			let period = this.senti.period ? this.senti.period : ''
			let condition = this.conditions[this.senti.condition].label
			let sentiVal = this.sentiVal ? this.sentiVal : this.editSentiVal
			let value =
				this.conditionRadio === 'Sentiment Value'
					? this.senti.value
					: this.senti.maValue
			this.description = `${criteria} ${direction} ${sentiVal} ${ma} ${period} ${condition} ${value}`
		},
		getConditionRadio(val) {
			this.$refs.sentiForm.clearValidate()
			// this.$forceUpdate()
			// this.clearFormValidate()
			// this.$refs.sentiForm.resetFields()
			// this.senti.maValue = ''
			// this.senti.period = ''
			// this.senti.value = ''
			// this.$refs.sentiForm.clearValidate(['validatePeriod', 'validateMaValue'])
			// this.$refs.sentiForm.clearValidate(['validateValue'])
			console.log('消除校验')
			// if (val === 'Sentiment Value') {
			// 	this.$nextTick(() => {
			// 		this.$refs.sentiForm.clearValidate([
			// 			'validatePeriod',
			// 			'validateMaValue'
			// 		])
			// 		this.$refs.sentiForm.clearValidate(['validateValue'])
			// 		console.log('消除校验')
			// 	})
			// 	// this.$refs.sentiForm.clearValidate('validateMaValue')
			// 	// 	if ('period' in this.senti) {
			// 	// 		delete this.senti.period
			// 	// 		delete this.senti.maValue
			// 	// 	}
			// 	// 	this.disabled = !this.disabled
			// 	// } else if (val === 'Sentiment Moving Average') {
			// 	// 	this.disabled = !this.disabled
			// 	// 	this.senti.period = ''
			// 	// 	this.senti.maValue = ''
			// } else {
			// 	this.$nextTick(() => {
			// 		this.$refs.sentiForm.clearValidate([
			// 			'validatePeriod',
			// 			'validateMaValue'
			// 		])
			// 		this.$refs.sentiForm.clearValidate(['validateValue'])
			// 	})
			// }
		},
		setPeriod(val) {
			if (this.conditionRadio === 'Sentiment Moving Average') {
				this.senti.period = val
			}
			let result
			this.$store.state.indicatorsList.forEach((value, index) => {
				if (this.sentiVal) {
					if (value.chart_name.indexOf(this.sentiVal) !== -1) {
						result = value
					}
				} else {
					if (value.chart_name.indexOf(this.sentiVal) !== -1) {
						result = value
					}
				}
			})
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				if (
					CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == result.url
				) {
					CIQ.Studies.removeStudy(
						CIQ.stxx,
						CIQ.stxx.layout.studies[studyInstanceName]
					)
				}
			}

			var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
				Period: val,
				display: 'ST MA',
				Field: result.url
			})
			// CIQ.exportEx()
			// keep current MA
			var objMA = { period: val, url: result.url }
			var activatedMAList = this.$store.state.activatedMA

			// remove current MA attached to an indicator
			var MAListIndex = activatedMAList.findIndex(
				(item) => item.url == result.url
			)
			if (MAListIndex != -1) {
				activatedMAList.splice(MAListIndex, 1)
			}
			activatedMAList.push(objMA)

			this.$store.commit('getMA', activatedMAList)
		},
		saveCondition() {
			let vm = this
			let checked = true
			let validForm
			if (this.conditionRadio === 'Sentiment Value') {
				this.$refs['sentiForm'].validateField(['value'], (errorMsg) => {
					if (!errorMsg) {
						validForm = true
					}
				})
				if (validForm) {
					let senti = this.senti
					// if(senti.value === '') {
					// 	senti.value = 0
					// }
					delete senti.period
					delete senti.maValue
					senti.criteria = this.criteria
					senti.index = 0
					// 定义一个 vuex 新事件用于保存 description
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = this.description
					this.$store.commit('saveDescription', desObj)
					// 定义一个 vuex 新事件用于保存 condition数据
					this.$store.commit('saveCondition', senti)
					return checked
				} else {
					// this.$message({
					// 	message: 'Please Input Value',
					// 	type: 'error',
					// 	offset: 300
					// })
					checked = false
					return checked
				}
			} else if (this.conditionRadio === 'Sentiment Moving Average') {
				this.$refs['sentiForm'].validateField(
					['maValue', 'period'],
					(errorMsg) => {
						if (!errorMsg) {
							validForm = true
						}
					}
				)
				if (validForm) {
					// if (this.senti.period) {
					let senti = this.senti
					senti.value = senti.maValue
					delete senti.maValue
					senti.criteria = this.criteria
					senti.index = 0
					// 定义一个 vuex 新事件用于保存 description
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = this.description
					this.$store.commit('saveDescription', desObj)
					// 定义一个 vuex 新事件用于保存 condition数据
					this.$store.commit('saveCondition', senti)
					return checked
					// } else {
					// 	this.$message({
					// 		message: 'Please Input Period',
					// 		type: 'error',
					// 		offset: 300
					// 	})
					// 	checked = false
					// 	return checked
					// }
				} else {
					// this.$message({
					// 	message: 'Please Input Value',
					// 	type: 'error',
					// 	offset: 300
					// })
					checked = false
					return checked
				}
			}
			this.clearForm()
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				this.clearFormValidate()
				this.senti.extreme_optimism =
					newVal[this.criteria].signals[0].extreme_optimism
				this.senti.extreme_pessimism =
					newVal[this.criteria].signals[0].extreme_pessimism
				this.senti.condition = Number(
					newVal[this.criteria].signals[0].condition
				)
				this.senti.value = newVal[this.criteria].signals[0].value

				this.conditionRadio = 'Sentiment Value'
				this.senti.period = ''
				this.disabled = false
				// delete this.senti.period
				let period = newVal[this.criteria].signals[0].period
				if (period) {
					this.conditionRadio = 'Sentiment Moving Average'
					this.senti.period = period
					this.senti.maValue = this.senti.value
					this.setPeriod(period)
					this.disabled = true
				}
				this.editSentiVal = newVal[this.criteria].signals[0].indicator
				this.setDesciption()
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
	border-bottom: 1px solid #797979;
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