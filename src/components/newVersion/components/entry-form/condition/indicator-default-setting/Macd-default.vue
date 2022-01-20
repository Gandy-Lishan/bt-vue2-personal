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
			<el-form-item label="Slow moving average">
				<el-input
					v-model="ids.MACDSlow"
					oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
				></el-input>
			</el-form-item>
			<el-form-item label="Fast moving average">
				<el-input
					v-model="ids.MACDFast"
					oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
				></el-input>
			</el-form-item>
			<el-form-item label="Signal line">
				<el-input
					v-model="ids.MACDSL"
					oninput="this.value=this.value.replace(/[\d]/g,'')"
				></el-input>
			</el-form-item>
		</div>
	</div>
</template>
<script>
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import { Store, mapGetters } from 'vuex'
export default {
	extends: base,
	props: {
		editIds: Object,
		idsLoad: Object
	},
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
		this.$set(this.ids, 'MACDSlow', 26)
		this.$set(this.ids, 'MACDFast', 12)
		this.$set(this.ids, 'MACDSL', 9)
	},
	computed: {
		...mapGetters(['getExtremeValue']),
		extremeValue() {
			return this.getExtremeValue
		}
	},
	watch: {
		editIds: {
			handler(newVal) {
				if (JSON.stringify(newVal) != '{}') {
					this.$set(this.ids, 'MACDSlow', newVal.MACDSlow)
					this.$set(this.ids, 'MACDFast', newVal.MACDFast)
					this.$set(this.ids, 'MACDSL', newVal.MACDSL)
				}
			},
			immediate: true,
			deep: true
		}
		// idsLoad: {
		// 	handler(newVal) {
		// 		if(newVal.MACDSlow){
		// 			this.setIdsLoad(newVal)
		// 		}
		// 	},
		// 	immediate: true,
		// 	deep: true
		// },
	},
	mounted() {
		this.$set(this.ids, 'MACDSlow', 26)
		this.$set(this.ids, 'MACDFast', 12)
	},
	methods: {
		// setIdsLoad(value) {
		// 	const rule = /^-?0?\d*?\.?\d*?$/
		// 	for (let key in val) {
		// 		// moving average 不一样
		// 		if(typeof val[key] != String){
		// 		if (val[key].search(rule) != -1) {
		// 			val[key] = Number(val[key])
		// 	}}
		// 	}
		// 	this.ids = val
		// }
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.extremumBox .el-form-item {
		display: flex;
		justify-content: space-between;
	}
	.miniNote {
		display: inline-block;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.extremumBox .el-form-item {
		display: flex;
		justify-content: space-between;
	}
	.miniNote {
		display: inline-block;
	}
}
@media (min-width: 768px) and(max-width:899px) {
	.miniNote {
		display: inline-block;
	}
	.extremumBox .el-form-item {
		display: flex;
		justify-content: flex-start;
	}
}
@media (max-width: 767px) {
	.miniNote {
		display: inline-block;
	}
	.extremumBox .el-form-item {
		display: flex;
		justify-content: flex-start;
	}
}
</style>