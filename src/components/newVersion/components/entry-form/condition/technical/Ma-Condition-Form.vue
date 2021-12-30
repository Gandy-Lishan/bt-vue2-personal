<template>
	<div>
		<div class="signal-condition-box">
			<div><h2 class="note">Signal Condition</h2></div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="Symbol Close" @change="getConditionRadio"> </el-radio>
				<div class="sentimentConditionItem">
					<el-select
						v-model="maCondition"
						filterable
						placeholder="Please select condition"
						@change="getConditionValue"
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
						@input="getSCvalue"
						oninput ="value=value.replace(/[-+]?[^\d]/g,'')"
						placeholder="Input Period"
					></el-input>
				</div>
			</div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="Moving Average" @change="getConditionRadio"> </el-radio>
				<div class="sentimentMABox">
					<el-input v-model="sc.ma_period" placeholder="Input Period" oninput ="value=value.replace(/[-+]?[^\d]/g,'')"></el-input>
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
					<span style="font-weight: 500; margin-left: 10px; line-height: 30px; font-size: 15px"
						>Moving Average</span
					>
					<el-input v-model="period_2" placeholder="Input Period" @input="getMaValue" oninput ="value=value.replace(/[-+]?[^\d]/g,'')"></el-input>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div><h2 class="note">Signal Description</h2></div>
			<el-button plain style="margin: 5px 0px 5px 0px"
				>{{  des.technicalIndicator + "&nbsp;&nbsp;" + conditions[sc.condition].label + "&nbsp;&nbsp;"+ "Moving Average" + "&nbsp;&nbsp;"+ des.period}}</el-button
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
	sc:{
      condition: 3,
      ma_period: "",
	  period: ""},
      period_1: '',
      period_2: 20,
	  maCondition: 3,
	  des: this.$store.state.backtestInfo[this.criteria].signals[this.tabIndex]
    }
  },
  methods: {
	  getConditionRadio(val) {
		  console.log(val);
		  if(val === "Symbol Close"){
			  delete this.sc.ma_period
			  this.sc.period = this.period_1
		  }else {
			  this.sc.ma_period = 5
		  }
	  },
	  getConditionValue(val) {
		  this.sc.condition = val
	  },
	  getSCvalue(val) {
		  if(this.conditionRadio === "Symbol Close"){
			//   delete this.sc.ma_period
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			obj.delete = 'ma_period'
			this.$store.commit('delete',obj)
						  this.sc.period = val
		  }
	  },
	  getMaValue(val) {
		  this.sc.period = val
	  },
	setScLoad(val) {
		 for(let key in val){
			 val[key] = Number(val[key])
		 }
		 if(val.ma_period){
			 this.conditionRadio = "Moving Average"
			 this.sc = val
			 this.period_2 = val.period
		 }else {
			 this.conditionRadio = "Symbol Close"
			 this.sc = val
			 this.period_1 = val.period
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