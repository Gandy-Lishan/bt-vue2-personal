<template>
	<div>
		<div class="back">
			<router-link to="/cpm"><i class="el-icon-arrow-left"></i><span>{{breadcrumbTitle}}</span></router-link>
		</div>
			<div class="chart_box" id="chart_box">
				<chart width="100%" height="100%" :onChartReady="onChartReady">
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
	name: 'MIChart',
	props: {
		chart_data: Object,
		breadcrumbTitle: String
	},
	data() {
		return {
			indicator : '',
			trades : [],
			symbolUrl: '',
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
		
	},
	beforeDestroy() {
		// 清除预览和编辑产生的ownIndicator serie缓存
		// 获取所有 localStorage 的键名
			const keys = Object.keys(localStorage);

			// 要删除的特定字符串
			const searchString = 'previewIndicatorData';

			// 遍历所有键名并删除匹配的项
			keys.forEach(key => {
			// 检查当前键名是否包含指定的字符串
			if (key.includes(searchString)) {
				// 如果包含指定字符串，则使用 removeItem 方法删除该键名对应的数据
				localStorage.removeItem(key)
			}
			});
	
		
		CIQ.objIndicator = []
		this.$store.dispatch('chart/reset_chart_study_state')
		this.$store.dispatch('form/reset_chart_config_state')

		this.$store.dispatch('chart/reset_miFormState')
		// Destroy the ChartEngine instance when unloading the component.
		// This will stop internal processes such as quotefeed polling.
		CIQ.stxx?.destroy()
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
			let search = document.querySelector(".ciq-search")
			let indicatorSearch = document.querySelector(".ciq-indicators-search")
			let studies = document.querySelector(".ciq-studies")
			let favBtnContainer = document.querySelector(".favBtnContainer")
			let timeframeBtn = document.querySelector('.ciq-period')
			let footer = document.querySelector('.ciq-footer')

			search.style.visibility = 'hidden'
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
	margin: 30px 0px 20px 0px;
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