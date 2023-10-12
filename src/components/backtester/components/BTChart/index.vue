<template>
  <header class="header">
			<p class="hint">
				Hint: Move cursor out of chart area to scroll down the page below
			</p>
			<!-- <el-row type="flex" justify="center"
					><el-col>
						<p class="betaNote">BacktestEdge Beta</p>
						<p class="hint">Hint: Move cursor out of chart area to scroll down the page below</p>
					</el-col>
				</el-row> -->
			<div class="chart_box" id="chart_box">
        <BTChart width="100%" height="100%" :onChartReady="onChartReady"></BTChart>  
			</div>
		</header>
</template>

<script>
import BTChart from "@/components/common/chart/index.vue"
import { LocalStorageUtil } from '@/utils'
import { CIQ } from '@/components/common/chart/st-development/js'
import { mapMutations } from "vuex"

export default {
  name: 'BTHeader',
  components: {
    BTChart
  },
	mounted() {
		const chartBox = document.getElementsByClassName('chart_box')[0]
		console.log('chartBox', chartBox)   
    if (chartBox) chartBox.style.width = ''
	},
	methods: {
    ...mapMutations('chart', ['SET_CHART_READY_STATE']),
		async onChartReady() {
      this.SET_CHART_READY_STATE(true)
    },
	}
}
</script>

<style lang="less" scoped>
// 暂时的样式
header {
	margin-bottom: 28px;
}
.header {
	img {
		width: 100%;
	}
	p {
		margin: 1rem 2rem 0rem 0rem;
		font-style: italic;
		color: #6c6c6c;
	}
	// p:first-of-type {
	// 	text-align: left;
	// 	font-size: 2.5rem;
	// 	margin: 0px;
	// 	font-weight: lighter;
	// 	color: #333333;
	// }
	background: url(../../../../assets/dots-blue.png);
}
.hint {
	// position: absolute;
	text-align: right;
	font-size: 0.8rem;
	color: black !important;
	bottom: -20px;
	right: 30px;
	font-weight: 300;
}
.chart_box {
	padding: 10px 10px;
	resize: auto;
	overflow: hidden;
	margin: 0 25px;
}
</style>