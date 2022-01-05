<template>
	<div class="extremumBox">
		<div><h3 class="miniNote">Indicator Default Setting</h3></div>
		<div class="extremumItemBox">
			<el-radio-group v-model="ids.ma_category" @change="getMaRadio">
				<el-radio label="SMA" style="margin-bottom: 30px"
					>Simple moving average</el-radio
				>
				<el-radio label="EMA">Exponential moving average</el-radio>
			</el-radio-group>
		</div>
	</div>
</template>
<script>
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
export default {
	extends: base,
	data() {
		return {
			ids: {
				ma_category: 'SMA'
			}
		}
	},
	methods: {
		getMaRadio(val) {
			//console.log(val)
			this.ids.ma_category = val
			if(val == 'SMA'){
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName];
					if(sd.type == "ma"){
						let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						console.log(dialogHelper.sd)
						dialogHelper.updateStudy({ inputs: { Type: "simple" } });
					}
				}	
			}else if(val == 'EMA'){
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName];
					if(sd.type == "ma"){
						let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						console.log(dialogHelper.sd)
						dialogHelper.updateStudy({ inputs: { Type: "exponential" } });
					}
				}	
			}
		}
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.extremumBox {
		display: flex;
		flex-direction: column;
		padding-top: 11px;
		margin-left: 10px;
		flex: 0.6;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.extremumBox .el-radio-group {
		display: flex;
		justify-content: space-between;
	}
}
</style>