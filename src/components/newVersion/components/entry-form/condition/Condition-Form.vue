<template>
	<div>
		<div class="signal-condition-box">
			<div><h2 class="note">Signal Condition</h2></div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="Sentiment Value" @change="getValue"></el-radio>
				<div class="sentimentConditionItem">
					<el-select
						v-model="sc.condition"
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
					<el-input v-model="value_1" placeholder="Input Value" @input="getInputValue"  oninput="value=value.replace(/[^0-9.]/g,'')" ></el-input>
				</div>
			</div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="Sentiment Moving Average" @change="getValue">
				</el-radio>
				<div class="sentimentMABox">
					<el-input @change="setPeriod" placeholder="Input Period" oninput ="value=value.replace(/[^\d]/g,'')" v-model="sc.period"></el-input>
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
					<el-input v-model="value_2" placeholder="Input Value" @input="getInputValue"  oninput="value=value.replace(/[^0-9.]/g,'')" ></el-input>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div><h2 class="note">Signal Description</h2></div>
			<el-button plain style="margin: 5px 0px 5px 0px"
				>{{ des.sentimentIndicator + des.technicalIndicator +conditions[sc.condition].label+des.value}}</el-button
			>
		</div>
	</div>
</template>
<script>
import { Store } from 'vuex'
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
			sc: {
				condition: 3,
				value: 20,
				period: 1,
			},
			value_1: 20,
			value_2: 20,
			maCondition: 3,
			conditionRadio: 'Sentiment Value',
			des: this.$store.state.backtestInfo[this.criteria].signals[this.tabIndex]
		}
	},
	methods: {
		getValue(val) {
			this.sc = {}
			if(val === 'Sentiment Value'){
				if(this.value_1)
				{
			this.sc.value = this.value_1}
			}else if(val === 'Sentiment Moving Average'){
				if(this.value_2){
				this.sc.value = this.value_2}
			}
			},
			getInputValue(val) {
				if(this.conditionRadio === 'Sentiment Value'){
				this.sc.value = val}
			},
			getConditionVal(val) {
				if(this.conditionRadio === 'Sentiment Moving Average'){
				this.sc.condition = val}
			},
			setPeriod(val) {
				if(this.conditionRadio === 'Sentiment Moving Average'){
				  this.sc.period = val
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
 
</style>