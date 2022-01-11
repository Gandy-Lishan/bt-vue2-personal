<template>
	<div class="extremumBox">
		<div>
			<h3 class="miniNote">Indicator Default Setting</h3>
			<el-tooltip
				class="item"
				effect="dark"
				content="Indicator Default Setting"
				placement="bottom-start"
				><i class="iconfont icon-tishi"></i
			></el-tooltip>
		</div>
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
import { Store, mapGetters } from 'vuex'
export default {
	extends: base,	props: {
		editIds: Object,
		idsLoad: Object
	},
	data() {
		return {
			conditionRadio: 'Symbol Close',
			ids: {
				ma_category: 'SMA'
			}
		}
	},
		mounted() {
		this.$set(this.ids,'ma_category','SMA')
	},
	computed: {
		data () {
			return this.$store.state.conditionRadio
		}
	},
	watch: {
		data (val) {
			this.conditionRadio = val
		},
		editIds: {
			handler(newVal) {
				this.ids = newVal
			},
			immediate: true,
			deep: true
		}	
	},
	methods: {
		getMaRadio(val) {
			//console.log(val)
			this.ids.ma_category = val
			CIQ.store.commit("setMaRadio",val)

			if(val == 'SMA'){
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName];
					if(sd.type == 'ma'){
						// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						// dialogHelper.updateStudy({ inputs: { Period: val } });

						var replaceStudy = {
							name: "Moving Average",
							overlay: true,
							calculateFN: CIQ.Studies.calculateMovingAverage,
							inputs: { Period: CIQ.store.state.maPeriod?CIQ.store.state.maPeriod:50, Field: "field", Type: "simple", Offset: 0 },
							outputs: { MA: "#FF0000" }
						}
						CIQ.Studies.studyLibrary[sd.type] = replaceStudy
						var st = CIQ.Studies.replaceStudy(
							CIQ.stxx,
							sd.inputs.id,
							sd.type,
						);
						console.log('replaced study: ',st)
					}
				}		
			}else if(val == 'EMA'){
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName];
					if(sd.type == 'ma'){
						// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						// dialogHelper.updateStudy({ inputs: { Period: val } });

						// var st = CIQ.Studies.replaceStudy(
						// 	CIQ.stxx,
						// 	sd.inputs.id,
						// 	sd.type,
						// 	{Type: "exponential"}
						// );
						// console.log('replaced study: ',st)
						
						var replaceStudy = {
							name: "Moving Average",
							overlay: true,
							calculateFN: CIQ.Studies.calculateMovingAverage,
							inputs: { Period: CIQ.store.state.maPeriod?CIQ.store.state.maPeriod:50, Field: "field", Type: "exponential", Offset: 0 },
							outputs: { MA: "#FF0000" }
						}
						CIQ.Studies.studyLibrary[sd.type] = replaceStudy
						var st = CIQ.Studies.replaceStudy(
							CIQ.stxx,
							sd.inputs.id,
							sd.type,
						);
						console.log('replaced study: ',st)
					}
				}		
			}
			if(this.conditionRadio == 'Moving Average'){
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName];
					if(sd.type == 'ST MA' && sd.panel == 'chart'){
						// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						// dialogHelper.updateStudy({ inputs: { Period: val } });

						// 刷新附属ma
						var replaceStudy = {
							name: "Moving Average ",
							overlay: true,
							calculateFN: CIQ.Studies.calculateSTMovingAverage,
							inputs: { Period: CIQ.store.state.stMaPeriod?CIQ.store.state.stMaPeriod:5, Field: "field", Type: this.ids.ma_category=="SMA"?"simple":"exponential", Offset: 0 },
							outputs: { MA: "#FF000" },
						}
						CIQ.Studies.studyLibrary[sd.type] = replaceStudy
						var st = CIQ.Studies.replaceStudy(
							CIQ.stxx,
							sd.inputs.id,
							sd.type,
						);
						console.log('replaced st ma: ',st)
					}
				}
				// keep current MA
					var objMA = { period: CIQ.store.state.stMaPeriod?CIQ.store.state.stMaPeriod:5, url: 'ma', type: this.ids.ma_category}
					var activatedMAList = this.$store.state.activatedMA

					// remove current MA attached to an indicator
					var MAListIndex = activatedMAList.findIndex(
						(item) => item.url == 'ma'
					)
					if (MAListIndex != -1) {
						activatedMAList.splice(MAListIndex, 1)
					}
					activatedMAList.push(objMA)

					this.$store.commit('getMA', activatedMAList)
			}
		},
		// 		setIdsLoad(value) {
		// 	const rule = /^-?0?\d*?\.?\d*?$/
		// 	for (let key in val) {
		// 		// moving average 不一样
		// 		if (val[key].search(rule) == -1) {
		// 			this.ids.ma_category = val[key]
		// 	}
		// 	}
		// 	this.ids = val
		// }
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
	.miniNote {
		display: inline-block;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.extremumBox .el-radio-group {
		display: flex;
		justify-content: space-between;
	}
	.miniNote {
		display: inline-block;
	}
}
</style>