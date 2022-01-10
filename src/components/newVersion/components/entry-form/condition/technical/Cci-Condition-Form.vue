<template>
	<div>
		<div class="signal-condition-box">
			<div>
				<h2 class="note">Signal Condition</h2>
				<el-tooltip
					class="item"
					effect="dark"
					content="please refer to the above Extreme Optimism / Extreme Pessimism to enter a number"
					placement="bottom-start"
					><i class="iconfont icon-tishi"></i
				></el-tooltip>
			</div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="CCI Value"> </el-radio>
				<div class="sentimentConditionItem">
					<el-select
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
					<el-input
						v-model="sc.value"
						oninput="value=value.replace(/[^-?0-9.]/g,'')"
						placeholder="Input Value"
					></el-input>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div>
				<h2 class="note">Signal Description</h2>
				<el-tooltip
					class="item"
					effect="dark"
					content="Your signal description"
					placement="bottom-start"
					><i class="iconfont icon-tishi"></i
				></el-tooltip>
			</div>
			<el-button plain style="margin: 5px 0px 5px 0px">{{
`${techVal}&nbsp;&nbsp;
				${conditions[sc.condition].label}
				&nbsp;&nbsp;${sc.value}
				`
			}}</el-button>
		</div>
	</div>
</template>
<script>
import { Store } from 'vuex'
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
export default {
	extends: base,
	props: { techVal: String },
	data() {
		return {
			conditionRadio: 'CCI Value',
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			sc: {
				condition: 3,
				value: -200
			},
			des: this.$store.state.backtestInfo[this.criteria].signals[this.tabIndex]
		}
	},
	watch: {
		techVal: {
			handler(newVal) {
				this.techVal = newVal
			}
		}
	},
	methods: {
		setScLoad(val) {
			const rule = /^-?0?\d*?\.?\d*?$/
			for (let key in val) {
				if(typeof val[key] == 'string'){
				if (val[key].search(rule) != -1) {
					val[key] = Number(val[key])
				}
				}
			}
			this.sc = val
		}
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.note {
		display: inline-block;
	}
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
	.note {
		display: inline-block;
	}
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