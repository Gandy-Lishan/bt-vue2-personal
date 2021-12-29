<template>
	<div>
		<div class="signal-condition-box">
			<div><h2 class="note">Signal Condition</h2></div>
			<div class="sentimentConditionBox">
				<el-radio
					v-model="conditionRadio"
					label="MACD Value"
					@change="getConditionRadio"
				>
				</el-radio>
				<div class="sentimentConditionItem">
					<el-select
						v-model="maCondition"
						filterable
						placeholder="Please select condition"
						@change="getConditionVal"
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
						v-model="value"
						oninput="value=value.replace(/[^0-9.]/g,'')"
						placeholder="Input Value"
						@input="getMaValue"
					></el-input>
				</div>
			</div>
			<div class="sentimentConditionBox">
				<el-radio
					v-model="conditionRadio"
					label="MACD SL"
					@change="getConditionRadio"
				>
				</el-radio>
				<div class="sentimentMABox">
					<el-select
						v-model="slCondition"
						filterable
						placeholder="Please select condition"
						@change="getConditionVal"
					>
						<el-option
							v-for="item in conditions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<!-- <el-input size="mini" v-model="technicalIndicator"></el-input> -->
					<span
						style="
							font-weight: 500;
							margin-left: 10px;
							line-height: 30px;
							font-size: 15px;
						"
						>MACD Signal line</span
					>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div><h2 class="note">Signal Description</h2></div>
			<el-button plain style="margin: 5px 0px 5px 0px">{{
				des.technicalIndicator + conditions[sc.condition].label + sc.value
			}}</el-button>
		</div>
	</div>
</template>
<script>
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
export default {
	extends: base,
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
				value: 'SL'
			},
			maCondition: 3,
			slCondition: 3,
			value: 0,
			conditionRadio: 'MACD SL',
			des: this.$store.state.backtestInfo[this.criteria].signals[this.tabIndex]
		}
	},
	methods: {
		getConditionRadio(val) {
			console.log(this.conditionRadio)
			if (val === 'MACD SL') {
				this.sc.value = 'SL'
			} else if (val === 'MACD Value') {
				this.sc.value = this.value
			}
		},
		getConditionVal(val) {
			if (this.conditionRadio === 'MACD Value') {
				this.sc.condition = this.maCondition
			} else if (this.conditionRadio === 'MACD SL') {
				this.sc.condition = this.slCondition
			}
		},
		getMaValue(val) {
			if (this.conditionRadio === 'MACD Value') {
				this.sc.value = val
			}
		},
		setScLoad(val) {
			for (let key in val) {
				if (Number(val[key]) !== NaN) {
					val[key] = Number(val[key])
				}
			}
			if(val.value === "SL") {
				this.conditionRadio = "MACD SL"
			}else {
				this.conditionRadio = "MACD Value"
			}
			this.sc = val
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
		flex: 0.7;
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
</style>