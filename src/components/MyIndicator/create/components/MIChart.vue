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
import { mapGetters } from 'vuex'
export default {
	name: 'MIChart',
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
		// Destroy the ChartEngine instance when unloading the component.
		// This will stop internal processes such as quotefeed polling.
		CIQ.stxx?.destroy()
	},
	methods:{
		onChartReady(){
			this.hideComponents()	
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