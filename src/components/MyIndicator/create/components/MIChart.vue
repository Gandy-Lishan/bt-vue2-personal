<template>
		<div class="chart_box" id="chart_box">
			<div class="back">
				<router-link to="/myindicator"><i class="el-icon-arrow-left"></i><span>Back to my indicators list</span></router-link>
			</div>
			<chart :symbol="defaultSymbol" width="100%" height="100%" :onChartReady="onChartReady">
				<LoadingOverlayChart
						:isLoading="chartLoadingSetting.isChartLoading"
						:progressText="chartLoadingSetting.progressText"
					>
				</LoadingOverlayChart>	
			</chart>
		</div>
</template>

<script>
import chart from '@/components/common/chart/index.vue'
import { CIQ } from '@/components/common/chart/st-development/js/components'
import { LoadingOverlayChart } from "@/components/common"
export default {
	name: 'MIChart',
	props: {
		chart_data: Object
	},
	data() {
		return {
			indicator : '',
			trades : [],
			defaultSymbol: ''
		}
	},
	components: {
    	chart: chart,
		LoadingOverlayChart,
	},
	computed: {
		chartLoadingSetting() {
			// 从 Vuex store 中获取全局 loading 状态
			return this.$store.state.chart.chartLoadingSetting
		},
	},
	watch: {
		chartLoadingSetting: {
			handler(newValue, _) {
				// 在对象属性发生变化时触发的处理逻辑
				this.chartLoadingSetting = newValue
			},
			deep: true, // 启用深度监听，监视对象属性的变化
		},
	},
	created() {
		this.defaultSymbol = this.chart_data.hasOwnProperty('name')?null:process.env.VUE_APP_DEFAULT_SYMBOL
	},
	beforeDestroy() {
		this.$store.dispatch('chart/reset_miFormState')
	},
	methods:{
		onChartReady(){
			this.hideComponents()	
			//还原自定义indicator Layout
			if(this.chart_data.name) CIQ.displayUserOwnIndicatorLayout(this.chart_data)
			else CIQ.hideCover()

			console.log('chart_data',this.chart_data)
		},
		hideComponents() {
			//let search = document.querySelector(".ciq-search")
			let indicatorSearch = document.querySelector(".ciq-indicators-search")
			let studies = document.querySelector(".ciq-studies")
			let favBtnContainer = document.querySelector(".favBtnContainer")
			let timeframeBtn = document.querySelector('.ciq-period')
			//let footer = document.querySelector('.ciq-footer')

			//search.style.visibility = 'hidden'
			indicatorSearch.style.visibility = 'hidden'
			studies.style.visibility = 'hidden'
			favBtnContainer.style.display = 'none'
			timeframeBtn.style.display = 'none'
			// footer.style.display = 'none'
		}
	}
}
</script>

<style lang="less" scoped>
.back {
    position: absolute;
    top: 109px;
    left: 48px;
	font-size: 1.1rem;
	i {
		font-weight: bold;
	}
	a {
		color: #525456;
		font-weight: bold;
		&:hover {
			color: #5b9bd1;
		}
	}
}
#chart_box {
	margin-top: 80px
}
</style>