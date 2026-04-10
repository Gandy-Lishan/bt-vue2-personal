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
import { CIQ } from '@/components/common/chart/st-development/js'
import { mapMutations } from "vuex"
import { LoadingOverlayChart } from "@/components/common"
import { seeParams, getIndicatorsRowData} from '@/service/service'
import { getChartLayoutById } from '@/service/chartLayoutAPI'
import { getQueryVariable, LocalStorageUtil } from '@/utils'

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
	async created() {
		const params = this.$route.params	// from strategy link
		let backtestID = localStorage.getItem('backtestID') // from analyst's backtest link
		// let symbol = sessionStorage.getItem('symbol') // from indicators link
		// 从 url 中取出来
		let symbol = getQueryVariable('index') || ''
		let indicator = getQueryVariable('indicator') || ''
		let storeSymbol = this.$store.state.chart.JumpToBTSymbol || ''
		if (symbol === 'Unknown' && !storeSymbol){
			const rowData = await getIndicatorsRowData(indicator)
   const {market_symbol} = rowData?.data
			const _symbol = market_symbol || 'SPX'
			symbol = _symbol
		}else if(storeSymbol) {
			symbol = storeSymbol
		}
		if (symbol === 'TEN') symbol = 'ten'
		if(backtestID) {
			try {
					await seeParams(backtestID)
				} catch(error) {
					if(error.response.status === 404) {
						this.popUpMsgBox('This backtest has been deleted', 10000)
					}else {
						this.popUpMagBox('This backtest is unavailable', 10000)
					}
					console.log('error', error)
					backtestID = ''
					LocalStorageUtil.remove('backtestID')
				}
		}
		if((params.usedFor && params.usedFor === 'showBTForm') || backtestID || symbol) {
			this.default_symbol = null
		}
	},
	mounted() {
		const unwatch = this.$watch(
				() => this.chartLoadingSetting.isChartLoading,
				(newVal) => {
					if (!newVal) {
					this.$nextTick(() => {
						this.scrollToAnchor()
					})
					unwatch() // 只执行一次后移除 watcher
					}
				}
			)
	},
	methods: {
    	...mapMutations('chart', ['SET_CHART_READY_STATE']),
		async onChartReady() {
			this.hideComponents()	
			this.SET_CHART_READY_STATE(true)
			// if(!this.$store.state.user.is_admin) {
			// 	document.querySelectorAll(".cq-comparison-new")[0].style.display = 'none'
			// }
			await this.loadLayoutFromUrlParam()
			CIQ.hideCover()
            CIQ.nprogress.done()
		},
		hideComponents() {
			// let studies = document.querySelector(".ciq-studies")
			// studies.style.visibility = 'hidden'
		},
		scrollToAnchor() {
			if (this.$route.hash === '#scrollAnchor') {
			const el = document.querySelector('#scrollAnchor')
			if (el) el.scrollIntoView()
			}
		},
		// 从 URL 参数加载 layout from Quick Access(restore chart layout only)
		async loadLayoutFromUrlParam() {
			// 检查 URL 中是否有 layoutId
			const urlInfo = CIQ.checkLayoutIdInUrl()
			if (urlInfo && urlInfo.layoutId) {
				try {
					// 通过 API 获取 layout 数据
					const layoutData = await getChartLayoutById(urlInfo.layoutId)
					if (layoutData) {
						// 恢复 layout
						CIQ.restoreLayoutFromAPI(layoutData)
						// 清除 URL 参数
						const newUrl = window.location.pathname + window.location.hash
						window.history.replaceState({}, document.title, newUrl)
					}
				} catch (error) {
					console.error('Failed to load layout from URL:', error)
				}
			}
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