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
			<el-form-item label="Extreme Optimism">
				<el-input
					v-model="ids.extreme_optimism"
					oninput="value=value.replace(/[^\-?\d.]/g,'')"
				></el-input>
			</el-form-item>
			<el-form-item label="Extreme Pessimism">
				<el-input
					v-model="ids.extreme_pessimism"
					oninput="value=value.replace(/^\-?\d.]/g,'')"
				></el-input>
			</el-form-item>
		</div>
	</div>
</template>
<script>
import { Store, mapGetters } from 'vuex'
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
export default {
	extends: base,	props: {
		editIds: Object,
		sentiUrl: String
	},
	data() {
		return {
			ids: {
				extreme_optimism: '',
				extreme_pessimism: ''
			}
		}
	},
	computed: {
		...mapGetters(['getExtremeValue']),
				extremeValue() {
			return this.getExtremeValue
		},
	},
		watch: {
		editIds: {
			handler(newVal) {
				this.ids = newVal
			},
			immediate: true,
			deep: true
		},
		extremeValue: {
			handler(newVal) {
				console.log('999999999999999');
				newVal.forEach(item => {
					if(item.indicator){
					if(item.indicator === this.sentiUrl) {
						this.$set(this.ids, 'extreme_pessimism', item.extremePessimism)
						this.$set(this.ids, 'extreme_optimism', item.extremeOptimism)
					}}
				})
			},
			immediate: true,
			deep: true
		}
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