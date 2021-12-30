<template>
	<div class="extremumBox">
		<div><h3 class="miniNote">Indicator Default Setting</h3></div>
		<div class="extremumItemBox">
		<el-form-item label="OverBought bound">
			<el-input v-model="ids.over_bought_bound" oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"></el-input>
		</el-form-item>
		<el-form-item label="OverSold bound">
			<el-input v-model="ids.over_sold_bound" oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"></el-input>
		</el-form-item>
		<el-form-item label="Period">
			<el-input v-model="ids.period" oninput ="value=value.replace(/[^\d]/g,'')"></el-input>
		</el-form-item>
		</div>
	</div>
</template>
<script>
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
export default {
	extends: base,
	data() {
		return {
			ids: {
			over_bought_bound: "",
			over_sold_bound: "",
            period: ""}
		}
	},
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px){
.extremumBox .el-form-item {
	display: flex;
  justify-content: space-between;
}}
@media (min-width: 900px) and (max-width: 1599px) {
	.extremumBox .el-form-item {
		display: flex;
		justify-content: space-between;
	}
}
</style>