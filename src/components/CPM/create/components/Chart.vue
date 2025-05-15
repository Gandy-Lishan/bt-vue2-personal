<template>
	<div>
		<div class="back">
			<router-link to="/cpm/list"><i class="el-icon-arrow-left"></i><span>{{breadcrumbTitle}}</span></router-link>
		</div>
			<div class="chart_box" id="chart_box">
				<chart :symbol="default_symbol" width="100%" height="100%" :onChartReady="onChartReady">
					<LoadingOverlayChart
							:isLoading="chartLoadingSetting.isChartLoading"
							:progressText="chartLoadingSetting.progressText"
						>
					</LoadingOverlayChart>	
				</chart>
			</div>
	</div>
</template>

<script>
import chart from '@/components/common/chart/index.vue'
import { CIQ } from '@/components/common/chart/st-development/js/components'
import { LoadingOverlayChart } from "@/components/common"
export default {
	name: 'Chart',
	props: {
		default_symbol: String,
		chart_data: Object,
		breadcrumbTitle: String
	},
	data() {
		return {
			indicator : '',
			trades : [],
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
		}

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
	beforeDestroy() {
		// 防止chartiq还没加载完就切换到其他页面
		CIQ.hideCover()
		CIQ.nprogress.done()
	},
	methods:{
		onChartReady(){
			this.hideComponents()	
			console.log('chart_data',this.chart_data)

			// 如果 Condition != None, 则画一根周期 = Period 的均线；
			if(this.chart_data.name && this.chart_data.ma_condition > 0) {	//只有在编辑查看cpm,且有condition,才显示均线
				CIQ.drawCPMMA(this.chart_data.ma)
			}

			if(this.chart_data.name) CIQ.displayCPMLayout(this.chart_data,()=>{		
				// 有result的情况下(success)执行此回调并计算TIM
				// backtest cpm后需要加载Chart后更新tim
				this.$emit('prepareData', this.chart_data)
				this.$emit('calculateBarDistance')
			})
			else{
				// 创建新CPM
				this.$emit('calculateBarDistance')
				CIQ.hideCover()
				CIQ.nprogress.done()
			}
		},
		hideComponents() {
			// let search = document.querySelector(".ciq-search")
			let indicatorSearch = document.querySelector(".ciq-indicators-search")
			let studies = document.querySelector(".ciq-studies")
			let favBtnContainer = document.querySelector(".favBtnContainer")
			let timeframeBtn = document.querySelector('.ciq-period')
			//let footer = document.querySelector('.ciq-footer')

			// search.style.visibility = 'hidden'
			indicatorSearch.style.visibility = 'hidden'
			studies.style.visibility = 'hidden'
			favBtnContainer.style.display = 'none'
			timeframeBtn.style.display = 'none'
			// footer.style.display = 'none'

			let menuYAxisPreferences = document.querySelector('[cq-name="menuYAxisPreferences"] :first-child')
			menuYAxisPreferences.style.display = 'none'

			// hide dual symbol
			document.querySelectorAll(".cq-comparison-new")[0].style.display = 'none'
		},
	}
}
</script>

<style lang="less" scoped>
.back {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0px 20px 0px;
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
</style>