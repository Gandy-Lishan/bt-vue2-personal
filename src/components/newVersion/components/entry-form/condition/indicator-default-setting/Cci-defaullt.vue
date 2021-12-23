<template>
	<div class="extremumBox">
		<div><h3 class="miniNote">Indicator Default Setting</h3></div>
		<el-form-item label="OverBought bound">
			<el-input v-model="overBoughtBound"></el-input>
		</el-form-item>
		<el-form-item label="OverSold bound">
			<el-input v-model="overSoldBound"></el-input>
		</el-form-item>
		<el-form-item label="Period">
			<el-input v-model="period"></el-input>
		</el-form-item>
	</div>
</template>
<script>
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
export default {
	extends: base,
	data() {
		return {
			overBoughtBound: 200,
			overSoldBound: -200,
      period: 20
		}
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px){
.extremumBox .el-form-item {
	display: flex;
  justify-content: space-between;
}}
</style>