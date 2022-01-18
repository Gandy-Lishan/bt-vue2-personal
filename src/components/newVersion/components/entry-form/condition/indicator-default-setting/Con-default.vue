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
	extends: base,
	props: {
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
		}
	},
	watch: {
		editIds: {
			handler(newVal) {
				if (JSON.stringify(newVal) != '{}') {
					this.$set(this.ids, 'extreme_optimism', newVal.extreme_optimism)
					this.$set(this.ids, 'extreme_pessimism', newVal.extreme_pessimism)
				}
			},
			immediate: true,
			deep: true
		},
		sentiUrl: {
			handler(newVal) {
				let vm = this
				const arr = vm.extremeValue
				arr.forEach((item) => {
					if (item.indicator) {
						if (item.indicator === newVal) {
							vm.$set(vm.ids, 'extreme_pessimism', item.extremePessimism)
							vm.$set(vm.ids, 'extreme_optimism', item.extremeOptimism)
						}
					}
				})
			},
			immediate: true,
			deep: true
		},
		extremeValue: {
			handler(newVal) {
				let vm = this
				newVal.forEach((item) => {
					if (item.indicator) {
						if (item.indicator === vm.sentiUrl) {
							vm.$set(vm.ids, 'extreme_pessimism', item.extremePessimism)
							vm.$set(vm.ids, 'extreme_optimism', item.extremeOptimism)
						}
					}
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
@media (min-width: 768px) and(max-width:899px) {
	.miniNote {
		display: inline-block;
	}
	.extremumBox .el-form-item {
		display: flex;
		justify-content: flex-start;
	}
}
</style>