<template>
	<div>
		<div class="signal-condition-box">
			<div><h2 class="note">Signal Condition</h2></div>
			<div class="sentimentConditionBox">
				<el-radio
					v-model="conditionRadio"
					label="Sentiment Value"
					@change="getConditionRadio"
				></el-radio>
				<div class="sentimentConditionItem">
					<el-select
						:disabled="disabled"
						v-model="sc.condition"
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

					<el-tooltip
						class="item"
						effect="light"
						content="Please enter number"
						placement="bottom"
					>
						<el-input
					       :disabled="disabled"
							v-model="sc.value"
							placeholder="Input Value"
							oninput="value=value.replace(/[-+]?[^0-9.]/g,'')"
						></el-input>
					</el-tooltip>
				</div>
			</div>
			<div class="sentimentConditionBox">
				<el-radio
					v-model="conditionRadio"
					label="Sentiment Moving Average"
					@change="getConditionRadio"
				>
				</el-radio>
				<div class="sentimentMABox">
					<el-tooltip
						class="item"
						effect="light"
						content="Please enter a number"
						placement="bottom"
					>
						<el-input
							@change="setPeriod"
					        :disabled="!disabled"
							placeholder="Input Period"
							oninput="value=value.replace(/[^\d]/g,'')"
							v-model="sc.period"
						></el-input>
					</el-tooltip>
					<el-select
						v-model="sc.condition"
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
					<el-tooltip
						class="item"
						effect="light"
						content="Please enter a number"
						placement="bottom"
					>
						<el-input
						   :disabled="!disabled"
							v-model="sc.value"
							placeholder="Input Value"
							oninput="value=value.replace(/[^0-9.]/g,'')"
						></el-input>
					</el-tooltip>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div><h2 class="note">Signal Description</h2></div>
			<el-button plain style="margin: 5px 0px 5px 0px">{{
				`${sentiVal}&nbsp;&nbsp;${sc.period ? sc.period : ''}&nbsp;&nbsp;${
					conditions[sc.condition].label
				}&nbsp;&nbsp;${sc.value}`
			}}</el-button>
		</div>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
export default {
	extends: base,
	props: { sentiVal: String },
	data() {
		return {
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			sc: {
				condition: 3,
				value: 20,
				period: ''
			},
			disabled: false,
			conditionRadio: 'Sentiment Value',
			des: this.$store.state.backtestInfo[this.criteria].signals[this.tabIndex]
		}
	},
	watch: {
		sentiVal: {
			handler(newVal) {
				this.sentiVal = newVal
			}
		}
	},
	methods: {
		getConditionRadio(val) {
			if (val === 'Sentiment Value') {
				if("period" in this.sc) {
					delete this.sc.period
				}
				this.disabled = !this.disabled
			} else if (val === 'Sentiment Moving Average') {
				this.sc.period = ''
				this.disabled = !this.disabled
			}
		},
		setPeriod(val) {
			if (this.conditionRadio === 'Sentiment Moving Average') {
				this.sc.period = val
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
			// const set = new Set(activatedMAList)
			// activatedMAList = [...set]
			this.$store.commit('getMA', activatedMAList)

			console.log(this.$store.state.activatedMA)
		},
		setScLoad(val) {
			for (let key in val) {
				val[key] = Number(val[key])
			}
			if (val.period) {
				this.conditionRadio = 'Sentiment Moving Average'
				this.sc = val
				this.disabled = true
			} else {
				this.conditionRadio = 'Sentiment Value'
				this.sc = val
				this.disabled = false
			}
		}
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.sentimentConditionBox {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.sentimentConditionBox .el-radio {
		line-height: 35px;
	}
	.sentimentConditionBox .el-select .el-input {
		flex: 1;
	}
	.sentimentConditionBox .el-input {
		flex: 0.4;
		margin-left: 5px;
	}
	.sentimentConditionBox .sentimentConditionItem {
		display: flex;
		justify-content: flex-end;
	}
	.sentimentConditionBox .sentimentMABox {
		display: flex;
		justify-content: flex-end;
	}
	.sentimentConditionBox .sentimentMABox .el-input {
		flex: 1;
	}
	.sentimentConditionBox .sentimentMABox .el-input:first-child {
		margin-right: 5px;
	}
	.sentimentConditionBox .el-radio {
		margin-right: 2px;
	}
	.signal-condition-box {
		padding-bottom: 10px;
		border-bottom: 1px solid black;
	}
	.signalDescriptionBox {
		display: flex;
		align-items: center;
		padding-bottom: 10px;
		border-bottom: 1px solid black;
		justify-content: space-around;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.sentimentConditionBox {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.sentimentConditionBox .el-radio {
		line-height: 35px;
	}
	.sentimentConditionBox .el-select .el-input {
		flex: 1;
	}
	.sentimentConditionBox .el-select {
		flex: 0.4;
		margin-left: 5px;
	}
	.sentimentConditionBox .el-input {
		flex: 0.2;
		margin-left: 5px;
	}
	.sentimentConditionBox .sentimentConditionItem {
		display: flex;
		justify-content: flex-start;
	}
	.sentimentConditionBox .sentimentMABox {
		display: flex;
		justify-content: flex-start;
	}
	.sentimentConditionBox .sentimentMABox .el-select {
		flex: 0.4;
	}
	.sentimentConditionBox .sentimentMABox .el-input {
		flex: 0.2;
	}
	.sentimentConditionBox .sentimentMABox .el-input:first-child {
		margin-right: 5px;
	}
	.sentimentConditionBox .el-radio {
		margin-right: 2px;
	}
	.signal-condition-box {
		padding-bottom: 10px;
		border-bottom: 1px solid black;
	}
	.signalDescriptionBox {
		display: flex;
		align-items: center;
		padding-bottom: 10px;
		border-bottom: 1px solid black;
		justify-content: space-around;
	}
}
</style>