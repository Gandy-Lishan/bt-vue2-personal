<template>
  				<div class="extremumBox">
					<div><h3 class="miniNote">Indicator Default Setting</h3></div>
					<el-radio
						v-model="defaultRadio"
						label="Simple moving average"
						style="margin-bottom: 30px"
					></el-radio>
					<el-radio v-model="defaultRadio" label="Exponential moving average">
					</el-radio>
				</div>
</template>
<script>
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
export default {
	extends: base,
  data() {
    return {
      defaultRadio: 'Simple moving average' 
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
</style>