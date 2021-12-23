<template>
	<div>
		<div class="signal-condition-box">
			<div><h2 class="note">Signal Condition</h2></div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio_1" label="MACD Value" @change="handleSelect1"> </el-radio>
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
					<el-input v-model="value" placeholder="Input Value"></el-input>
				</div>
			</div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio_2" label="MACD Value" @change="handleSelect2"> </el-radio>
				<div class="sentimentMABox">
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
					<!-- <el-input size="mini" v-model="technicalIndicator"></el-input> -->
					<span style="font-weight: 500; margin-left: 10px; line-height: 30px; font-size: 15px"
						>MACD Signal line</span
					>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div><h2 class="note">Signal Description</h2></div>
			<el-button plain style="margin: 5px 0px 5px 0px"
				>MACD Value CrossAbove MACD Signal line</el-button
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
      conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
      condition: 3,
      maCondition: 3,
      value: 0,
      conditionRadio_1: 'MACD Value',
      conditionRadio_2: ''
    }
	},
  methods: {
    handleSelect1(e) {
      if(e === 'MACD Value'){
        this.conditionRadio_2 = ''
      }
    },
    handleSelect2(e) {
      if(e === 'MACD Value'){
        this.conditionRadio_1 = ''
      }
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
}}
</style>