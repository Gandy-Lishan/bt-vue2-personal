<template>
  				<div class="extremumBox">
					<div><h3 class="miniNote">Indicator Default Setting</h3></div>
					<div class="extremumItemBox">
					  <el-radio-group v-model="ids.art_price" @change="getRadio">
						<el-radio label="CP" style="margin-bottom: 30px">Close Price</el-radio>
						<el-radio label="HP">High Price</el-radio>
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
		  art_price: "CP"
	  }
    }
  },
  methods: {
	  getRadio(val) {
		  this.ids.art_price = val
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