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
			<el-form-item label="OverBought bound">
				<el-input
					v-model="ids.over_bought_bound"
					oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
				></el-input>
			</el-form-item>
			<el-form-item label="OverSold bound">
				<el-input
					v-model="ids.over_sold_bound"
					oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
				></el-input>
			</el-form-item>
			<el-form-item label="Period">
				<el-input
					v-model="ids.period"
					oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
				></el-input>
			</el-form-item>
		</div>
	</div>
</template>
<script>
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import { Store, mapGetters } from 'vuex'
export default {
	extends: base,	props: {
		editIds: Object,
		idsLoad: Object
	},
	data() {
		return {
			ids: {
				over_bought_bound: 80,
				over_sold_bound: 20,
				period: 14
			}
		}
	},	computed: {
		...mapGetters(['getExtremeValue']),
				extremeValue() {
			return this.getExtremeValue
		},
	},
		watch: {
				editIds: {
			handler(newVal) {
			this.$set(this.ids, 'over_bought_bound', newVal.extremeOptimism)
				this.$set(this.ids, 'over_sold_bound', newVal.extremePessimism)
			},
			immediate: true,
			deep: true
		},
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
</style>