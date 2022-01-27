<template>
	<div class="senti-container">
		<el-form :model="senti">
			<div class="ids-container">
				<el-form-item label="Extreme Optimism" prop="extreme_optimism">
					<el-input
						v-model="senti.extreme_optimism"
						oninput="value=value.replace(/[^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
				<el-form-item label="Extreme Pessimism" prop="extreme_pessimism">
					<el-input
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
							:disabled="disabled"
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
					<el-form-item>
						<el-input
							:disabled="disabled"
							@blur="setDesciption"
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
					<el-form-item>
						<el-input
							@change="setPeriod"
							:disabled="!disabled"
							placeholder="Input Period"
							oninput="value=value.replace(/[^\d]/g,'')"
							v-model="senti.period"
							@blur="setDesciption"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="senti.condition"
							filterable
							:disabled="!disabled"
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
						<el-input
							:disabled="!disabled"
							v-model="senti.value"
							placeholder="Input Value"
							@blur="setDesciption"
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
export default {
	name: 'senti',
	props: {
		criteria: String,
		sentiUrl: String,
		sentiVal: String
	},
	data() {
		return {
			senti: {
				extreme_optimism: '',
				extreme_pessimism: '',
				condition: 3,
				value: '',
				period: ''
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
			description: ''
		}
	},
	computed: {
		...mapGetters(['getExtremeValue']),
		extremeValue() {
			return this.getExtremeValue
		}
	},
	watch: {
		extremeValue: {
			handler(newVal) {
				let vm = this
				newVal.forEach((item) => {
					if (item.indicator) {
						if (item.indicator === vm.sentiUrl) {
							vm.senti.extreme_pessimism = item.extremePessimism
							vm.senti.extreme_optimism = item.extremeOptimism
						}
					}
				})
			},
			immediate: true,
			deep: true
		},
		// 用于解决 entry 和 exit 选择相同 indicator 而无法展示极值的问题
		sentiUrl: {
			handler(newVal) {
				if (newVal) {
					let vm = this
					let extremeValue = this.extremeValue
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
		setDesciption() {
			let ma = this.senti.period ? 'moving average' : ''
			let period = this.senti.period ? this.senti.period : ''
			let condition = this.conditions[this.senti.condition].label
			let description =
				this.sentiVal +
				' ' +
				ma +
				' ' +
				period +
				' ' +
				condition +
				' ' +
				this.senti.value
			this.description = description
		},
		getConditionRadio(val) {
			if (val === 'Sentiment Value') {
				if ('period' in this.senti) {
					delete this.senti.period
				}
				this.disabled = !this.disabled
			} else if (val === 'Sentiment Moving Average') {
				this.senti.period = ''
				this.disabled = !this.disabled
			}
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
			console.log('setperiod', this.sentiVal)
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
			let checked = true
			if (this.conditionRadio === 'Sentiment Value') {
				if (this.senti.value) {
					let senti = this.senti
					delete senti.period
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
					this.$message.error('Please Input Value')
					checked = false
					return checked
				}
			} else if (this.conditionRadio === 'Sentiment Moving Average') {
				if (this.senti.value) {
					if (this.senti.period) {
						let senti = this.senti
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
						this.$message.error('Please Input Period')
						checked = false
						return checked
					}
				} else {
					this.$message.error('Please Input Value')
					checked = false
					return checked
				}
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
</style>