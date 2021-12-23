<template>
  				<div class="extremumBox">
					<div><h3 class="miniNote">Indicator Default Setting</h3></div>
					<el-form-item label="OverBought bound">
						<el-input v-model="over_bought_bound"></el-input>
					</el-form-item>
					<el-form-item label="OverSold bound">
						<el-input v-model="over_sold_bound"></el-input>
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
      over_bought_bound: 70,
      over_sold_bound: 30,
      period: 14
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