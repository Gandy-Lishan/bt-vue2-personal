<template>
	<div>
		<div class="signal-condition-box">
			<div><h2 class="note">Signal Condition</h2></div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="Symbol Close"> </el-radio>
				<div class="sentimentConditionItem">
					<el-select
						v-model="condition"
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
					<span style="font-weight: 500; margin-left: 10px; line-height: 30px; font-size: 15px"
						>Moving Average</span
					>
					<el-input
						v-model="period_1"
						placeholder="Input Period"
					></el-input>
				</div>
			</div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="Moving Average"> </el-radio>
				<div class="sentimentMABox">
					<el-input v-model="ma_period" placeholder="Input Period"></el-input>
					<el-select
						v-model="maCondition"
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
					<span style="font-weight: 500; margin-left: 10px; line-height: 30px; font-size: 15px"
						>Moving Average</span
					>
					<el-input v-model="period_2" placeholder="Input Period"></el-input>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div><h2 class="note">Signal Description</h2></div>
			<el-button plain style="margin: 5px 0px 5px 0px"
				>Moving Average 5 CrossAbove Moving Average 20</el-button
			>
		</div>
	</div>
</template>
<script>
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
export default {
	extends: base,
  data() {
    return {
      conditionRadio: 'Moving Average',
      conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
      condition: 3,
      ma_period: 5,
      period_1: '',
      period_2: 20,
      condition: 3,
      maCondition: 3
    }
  }
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px){
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
	flex: 0.6;
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
	flex: 0.4;
}
.sentimentConditionBox .sentimentMABox .el-input:first-child {
	margin-right: 5px;
}
.sentimentConditionBox .el-radio {
	margin-right: 2px;
}
.signal-condition-box {
	border-bottom: 1px solid black;
	padding-bottom: 10px;
}
.signalDescriptionBox {
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding-bottom: 10px;
	border-bottom: 1px solid black;
}}
</style>