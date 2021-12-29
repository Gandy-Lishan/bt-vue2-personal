<template>
  				<div class="extremumBox">
					<div><h3 class="miniNote">Indicator Default Setting</h3></div>
					<div class="extremumItemBox">
					  <el-radio-group v-model="ids.ma_category" @change="getMaRadio">
						<el-radio label="SMA" style="margin-bottom: 30px">Simple moving average</el-radio>
						<el-radio label="EMA">Exponential moving average</el-radio>
					</el-radio-group>
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
		  ma_category: "SMA"
	  }
    }
  },
  methods: {
	  getMaRadio(val) {
		  this.ids.ma_category = val
	  }
  }
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px){
.extremumBox {
	display: flex;
	flex-direction: column;
	padding-top: 11px;
	margin-left: 10px;
	flex: 0.6;
}}
@media (min-width: 900px) and (max-width: 1599px) {
	.extremumBox .el-radio-group {
		display: flex;
		justify-content: space-between;
	}
}
</style>