<template>
	<div class="condition-form">
		<el-form label-position="left">
			<div><h2 class="note">Signal Condition</h2></div>
			<div class="signal-condition-box">
				<el-form-item>
					<div class="condition-item">
						<el-checkbox v-model="pte">Profit Take Exit</el-checkbox>
						<el-input ></el-input>
					</div>
				</el-form-item>
				<el-form-item>
					<div class="condition-item">
						<el-checkbox v-model="lse">Loss Stop Exit</el-checkbox>
						<el-input ></el-input>
					</div>
				</el-form-item>
				<el-form-item>
					<div class="condition-item">
						<el-checkbox v-model="tim">Time in Market</el-checkbox>
						<el-input ></el-input
						><span style="font-weight: 500">days</span>
					</div>
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="ts">Trailing Stop</el-checkbox>
				</el-form-item>
			</div>
			<div class="container">
				<div class="container-item">
					<div class="radio1">
						<el-radio v-model="indicatorRadio" label="ATR Exit"></el-radio>
					</div>
					<el-form-item label="period">
						<el-input v-model="technicalIndicator"></el-input
					></el-form-item>
					<el-form-item label="multiplier">
						<el-input v-model="technicalIndicator"></el-input
					></el-form-item>
				</div>
				<div class="container-item">
					<el-radio v-model="indicatorRadio" label="Parabolic SAR Exit">
					</el-radio>

					<el-form-item label="max step">
						<el-input v-model="technicalIndicator"></el-input
					></el-form-item>
					<el-form-item label="accelaration factor">
						<el-input v-model="technicalIndicator"></el-input
					></el-form-item>
				</div>
			</div>

			<div class="signalDescriptionBox">
				<div><h2 class="note">Signal Description</h2></div>
				<el-button  plain style="margin: 10px 50px"
					>Profit 20%/Loss 10%/Time in Market 30d/ATR exit 20p3m</el-button
				>
			</div>
			<div class="btnBox">
				<el-button round>Save Signal for Future Use</el-button>
				<el-button round>Load Signal From Databse</el-button>
			</div>
		</el-form>
	</div>
</template>
<script>
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
export default {
	extends: base,
	data() {
		return {
			indicatorRadio: '',
			sentimentIndicator: '',
			technicalIndicator: '',
			extremeOptimism: '',
			extremePessimism: ''
		}
	},
	methods: {}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px){
.btnBox {
	display: flex;
	margin-top: 10px;
	justify-content: center;
	align-self: flex-end;
	flex-wrap: wrap;
}
.signal-condition-box .el-form-item .condition-item {
	display: flex;
	flex-direction: row;
	margin-bottom: 10px;
}
.signal-condition-box .el-form-item .condition-item .el-input {
	flex: 0.3;
	margin: 0px 10px 0px 10px;
}
.container .container-item {
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: relative;
}
// .radio1 {
// 	position: absolute;
// 	top: 10px;
// 	left: 10px;
// }
.container .container-item .el-radio {
	margin-right: 5px;
}
.container .container-item .el-form-item {
	display: flex;
	margin-bottom: 10px;
	justify-content: flex-end;
}
.container .container-item .el-form-item .el-form-item__content {
	flex: 0.3;
}
.el-form-item {
	margin-bottom: 0px;
}
.signalDescriptionBox {
	border-bottom: 1px solid black;
}}
</style>>