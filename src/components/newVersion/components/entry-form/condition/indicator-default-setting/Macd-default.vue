<template>
  				<div class="extremumBox">
					<div><h3 class="miniNote">Indicator Default Setting</h3></div>
					<div class="extremumItemBox">
					<el-form-item label="Slow moving average">
						<el-input v-model="ids.MACDSlow"></el-input>
					</el-form-item>
					<el-form-item label="Fast moving average">
						<el-input v-model="ids.MACDFast"></el-input>
					</el-form-item>
					<el-form-item label="Signal line">
						<el-input  v-model="ids.MACDSL"></el-input>
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
      MACDSlow: 26,
      MACDFast: 12,
      MACDSL: 9
      }
    }
  },
  mounted() {
	  this.$set(this.ids,'MACDSlow', 26)
	  this.$set(this.ids,'MACDFast', 12)
  }
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