<template>
		<div class="chart_box" id="chart_box">
			<div class="back">
				<router-link to="/myindicator"><i class="el-icon-arrow-left"></i><span>Back to my indicators list</span></router-link>
			</div>
			<chart width="100%" height="100%" :onChartReady="onChartReady"></chart>
		</div>
</template>

<script>
import chart from '@/components/common/chart/index.vue'
import { CIQ } from '@/components/common/chart/st-development/js/components'
import { mapGetters } from 'vuex'
export default {
	name: 'MIChart',
	props: {
		chart_data: Object
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
	},
	beforeDestroy() {
		// 清除预览缓存
		localStorage.setItem('previewIndicatorData', null)
		
		CIQ.objIndicator = []
		this.$store.dispatch('chart/reset_chart_study_state')
		this.$store.dispatch('form/reset_chart_config_state')
		// Destroy the ChartEngine instance when unloading the component.
		// This will stop internal processes such as quotefeed polling.
		CIQ.stxx?.destroy()
	},
	methods:{
		onChartReady(){
			this.hideComponents()	
			//还原自定义indicator Layout
			if(this.chart_data.name) CIQ.displayUserOwnIndicatorLayout(this.chart_data)

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
			footer.style.display = 'none'
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