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
        		<BTChart :symbol="default_symbol" width="100%" height="100%" :onChartReady="onChartReady">	
					<LoadingOverlayChart
						:isLoading="chartLoadingSetting.isChartLoading"
						:progressText="chartLoadingSetting.progressText"
					>
					</LoadingOverlayChart>	
				</BTChart>  
			</div>
	</header>
</template>

<script>
import BTChart from "@/components/common/chart/index.vue"
import { LocalStorageUtil } from '@/utils'
import { CIQ } from '@/components/common/chart/st-development/js'
import { mapMutations } from "vuex"
import { LoadingOverlayChart } from "@/components/common"
import { seeParams} from '@/service/service'

export default {
  name: 'BTHeader',
  data() {
		return {
			default_symbol : process.env.VUE_APP_DEFAULT_SYMBOL,
		}
	},
  components: {
    BTChart,
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
		const params = this.$route.params	// from strategy link
		let backtestID = localStorage.getItem('backtestID') // from analyst's backtest link
		let symbol = sessionStorage.getItem('symbol') // from indicators link
		if((params.usedFor && params.usedFor === 'showBTForm') || backtestID || symbol) {
			this.default_symbol = null
		}
	},
	mounted() {
		// const chartBox = document.getElementsByClassName('chart_box')[0] 
   		//  if (chartBox) chartBox.style.width = ''
	},
	methods: {
    	...mapMutations('chart', ['SET_CHART_READY_STATE']),
		async onChartReady() {
			this.hideComponents()	
			this.SET_CHART_READY_STATE(true)
			// if(!this.$store.state.user.is_admin) {
			// 	document.querySelectorAll(".cq-comparison-new")[0].style.display = 'none'
			// }
			CIQ.hideCover()
            CIQ.nprogress.done()
		},
		hideComponents() {
			// let studies = document.querySelector(".ciq-studies")
			// studies.style.visibility = 'hidden'
		}
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
		margin: 10px 2rem 0rem 0rem;
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
	margin: 0 25px;
}
</style>