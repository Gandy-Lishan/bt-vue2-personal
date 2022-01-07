<template>
	<div>
		<div class="signal-condition-box">
			<div><h2 class="note">Signal Condition</h2></div>
			<div class="sentimentConditionBox">
				<el-radio v-model="conditionRadio" label="ATR Trailing Stop"></el-radio>
				<div class="sentimentMABox">
                    <span style="font-weight: 500; margin-left: 10px; line-height: 30px; font-size: 15px"
						>multiplier:</span
					>
					<el-input v-model="sc.atr_multiplier" placeholder="Input Period" oninput ="value=value.replace(/[-+]?[^\d]/g,'')"></el-input>
					<span style="font-weight: 500; margin-left: 10px; line-height: 30px; font-size: 15px"
						>period:</span
					>
					<el-input v-model="sc.atr_period" placeholder="Input Period" oninput ="value=value.replace(/[-+]?[^\d]/g,'')"></el-input>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div><h2 class="note">Signal Description</h2></div>
			<el-button plain style="margin: 5px 0px 5px 0px"
				>{{  des.technicalIndicator + "&nbsp;&nbsp;" + "with" + "&nbsp;&nbsp;" + des.art_price}}</el-button
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
      conditionRadio: 'ATR Trailing Stop',
	sc:{
      atr_multiplier: 2.5,
      atr_period: 7
      },
	  des: this.$store.state.backtestInfo[this.criteria].signals[this.tabIndex]
    }
  },
  methods: {
	setScLoad(val) {
			const rule = /^-?0?\d*?\.?\d*?$/
			for (let key in val) {
				if(typeof val[key] == 'string'){
				if (val[key].search(rule) != -1) {
					val[key] = Number(val[key])
				}}
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