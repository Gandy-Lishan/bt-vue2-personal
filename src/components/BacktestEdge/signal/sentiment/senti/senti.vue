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
							oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="descriptionBox">
				<p plain style="margin: 5px 0px 5px 0px" class="description-note">
					{{
						`${sentiVal}&nbsp;&nbsp;${
							senti.period ? 'moving average' : ''
						}&nbsp;&nbsp;${senti.period ? senti.period : ''}&nbsp;&nbsp;${
							conditions[senti.condition].label
						}&nbsp;&nbsp;${senti.value}`
					}}
				</p>
			</div>
		</el-form>
	</div>
</template>
<script>
export default {
	props: {
		criteria: String
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
			conditionRadio: 'Sentiment Value'
		}
	},
	methods: {
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
.description-note {
	border: 1px solid #333333;
	padding: 0px 10px 0px 10px;
	color: #000000;
	font-weight: 400;
}
/deep/ .el-input__inner {
	padding-left: 5px;
	margin-left: 5px;
}
/deep/.el-input--suffix .el-input__inner {
	padding-right: 5px;
}
</style>