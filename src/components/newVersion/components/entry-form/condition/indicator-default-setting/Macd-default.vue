<template>
  				<div class="extremumBox">
					<div><h3 class="miniNote">Indicator Default Setting</h3></div>
          <div class="noColor">
					<el-form-item label="Slow moving average">
						<el-input v-model="ids.SlowMA"></el-input>
					</el-form-item>
          </div>
          <div class="noColor">
					<el-form-item label="Fast moving average">
						<el-input v-model="ids.FastMA"></el-input>
					</el-form-item>
          </div>
          <div class="noColor">
					<el-form-item label="Signal line">
						<el-input  v-model="ids.SL"></el-input>
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
      SlowMA: 26,
      FastMA: 12,
      SL: 9
      }
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
@media (min-width: 900px) and (max-width: 1599px) {
	.extremumBox .el-form-item {
		display: flex;
		justify-content: space-between;
	}
}
</style>