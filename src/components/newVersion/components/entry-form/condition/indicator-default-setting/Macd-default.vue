<template>
  				<div class="extremumBox">
					<div><h3 class="miniNote">Indicator Default Setting</h3></div>
          <div class="noColor">
					<el-form-item label="Slow moving average">
						<el-input v-model="SlowMA"></el-input>
					</el-form-item>
          </div>
          <div class="noColor">
					<el-form-item label="Fast moving average">
						<el-input v-model="FastMA"></el-input>
					</el-form-item>
          </div>
          <div class="noColor">
					<el-form-item label="Signal line">
						<el-input  v-model="SL"></el-input>
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
      SlowMA: 26,
      FastMA: 12,
      SL: 9
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