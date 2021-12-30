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
					
				<el-tooltip class="item" effect="light" content="Please enter a number from 0 to 1" placement="bottom">
					<el-input v-model="value_1" placeholder="Input Value" @input="getInputValue"  oninput="value=value.replace(/[^0-9.]/g,'')" ></el-input>
				</el-tooltip>
				</div>
			</div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="Sentiment Moving Average" @change="getValue">
				</el-radio>
				<div class="sentimentMABox">
					<el-tooltip class="item" effect="light" content="Please enter number" placement="bottom">
					<el-input @change="setPeriod" placeholder="Input Period" oninput ="value=value.replace(/[^\d]/g,'')" v-model="sc.period"></el-input>
					</el-tooltip>
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
					<el-tooltip class="item" effect="light" content="Please enter a number from 0 to 1" placement="bottom">
					<el-input v-model="value_2" placeholder="Input Value" @input="getInputValue"  oninput="value=value.replace(/[^0-9.]/g,'')" ></el-input>
					</el-tooltip>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div><h2 class="note">Signal Description</h2></div>
			<el-button plain style="margin: 5px 0px 5px 0px"
				>{{ sentiVal + "&nbsp;&nbsp;"+ sc.period + "&nbsp;&nbsp;"+ conditions[sc.condition].label + "&nbsp;&nbsp;" +  sc.value}}</el-button
			>
		</div>
	</div>
</template>
<script>
import { Store, mapGetters } from 'vuex'
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
export default {
	extends: base,
	props: {sentiVal: String},
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
				value: "",
				period: '',
			},
			value_1: "",
			value_2: "",
			maCondition: 3,
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
					const res = /^(1|0(\.\d{1,2})?)$/
					console.log("增则",res.test(val));
					if(res.test(val)){
						
				this.sc.value = val
					}}
			},
			getConditionVal(val) {
				if(this.conditionRadio === 'Sentiment Moving Average'){
				this.sc.condition = val}
			},
			setPeriod(val) {
				if(this.conditionRadio === 'Sentiment Moving Average'){
				  this.sc.period = val
				}
			},
		setScLoad(val) {
		 for(let key in val){
			 val[key] = Number(val[key])
		 }
		 if(val.period) {
			 this.conditionRadio = 'Sentiment Moving Average'
			 this.value_2 = val.value
			 this.sc = val
		 }else {
			 this.conditionRadio = 'Sentiment Value'
			 this.value_1 = val.value
			 this.sc = val
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