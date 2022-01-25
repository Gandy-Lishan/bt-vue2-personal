<template>
	<div class="home">
		<div class="home-container">
			<header class="header">
				<el-row
					><el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="2"
						><img src="../../assets/logo.png" alt="logo" /></el-col
				></el-row>

				<el-row type="flex" justify="center"
					><el-col><p>BacktestEdge</p></el-col>
				</el-row>
				<div class="chart_box" id="chart_box">
					<chart width="100%" height="100%"></chart>
				</div>
			</header>
			<main class="main">
				<el-tabs v-model="activeName" type="card" :tab-position="tabPosition">
					<el-tab-pane label="Set up Backtest" name="first">
						<div class="set-up-container">
							<set-up ref="setUpChild"></set-up>
							<div class="criteria-container">
								<div class="criteria-box">
									<entry
										ref="entryChild"
										@setExitDirection="setExitDirection"
									></entry>
									<exit ref="exitChild" :exitDirection="exitDirection"></exit>
								</div>
							</div>
							<div class="backtest-btns">
								<el-button type="danger"> Clear Form</el-button>
								<el-button type="success" @click="runBacktest"
									>Run Backtest</el-button
								>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="Backtest History" name="second"
						><history></history
					></el-tab-pane>
					<el-tab-pane label="Backtest Results" name="third"
						><result></result>
						<performance></performance>
					</el-tab-pane>
					<el-tab-pane label="Your Favorites" name="forth"> </el-tab-pane>
					<el-tab-pane label="Sample Backtests" name="fifth"> </el-tab-pane>
				</el-tabs>
			</main>
		</div>
	</div>
</template>
<script>
const _ = require('lodash')
const throttle = _.throttle
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import SignalCode from '@/tools/codeTool.js'
import chart from '@/components/chart/index.vue'
import setUp from '@/components/BacktestEdge/SetUp.vue'
import entry from '@/components/BacktestEdge/Entry.vue'
import exit from '@/components/BacktestEdge/Exit.vue'
import result from '@/components/BacktestEdge/Result.vue'
import performance from '@/components/BacktestEdge/Performance.vue'
import history from '@/components/BacktestEdge/History.vue'
export default {
	name: 'home',
	data() {
		return {
			tabPosition: 'top',
			activeName: 'first',
			clientHeight: 0,
			exitDirection: ''
		}
	},
	components: {
		chart: chart,
		'set-up': setUp,
		entry,
		exit,
		result,
		performance,
		history
	},
	mounted() {
		this.$cookies.set('userid', 'test')
		// 在DOM渲染数据时，设置下区域高度为浏览器可视区域高度．
		this.clientHeight = document.body.clientHeight
		// 监听window的resize事件．在浏览器窗口变化时再设置下区域高度．
		const _this = this
		window.onresize = throttle(function temp() {
			window.screenWidth = document.body.clientWidth
			_this.clientHeight = window.screenWidth
			if (_this.clientHeight < 768) {
				_this.tabPosition = 'left'
			} else {
				_this.tabPosition = 'top'
			}
		}, 500)
	},
	methods: {
		setExitDirection(val) {
			this.exitDirection = val
		},
		runBacktest() {
			let setUp = this.$refs.setUpChild.saveBacktestData()
			if (setUp) {
				let entry = this.$refs.entryChild.saveBacktestData()
				if (entry) {
					let exit = this.$refs.exitChild.saveBacktestData()
					if (exit) {
						console.log('保存的backtest数据', this.$store.state.backtestInfo)
						let vm = this
						let signalEntryList = []
						let signalExitList = []
						let backtestData = this.$store.state.backtestInfo
						signalEntryList = backtestData.entry.signals
						signalExitList = backtestData.exit.signals
						signalEntryList.forEach((item) => {
							if (item.sentimentIndicator) {
								item.indicator = item.sentimentIndicator
								item.analysis = 'Sentiment'
								delete item.technicalIndicator
								delete item.sentimentIndicator
							}
							if (item.technicalIndicator) {
								item.indicator = item.technicalIndicator
								item.analysis = 'Technical'
								delete item.technicalIndicator
								delete item.sentimentIndicator
							}
						})
						signalExitList.forEach((item) => {
							if (item.sentimentIndicator) {
								item.indicator = item.sentimentIndicator
								item.analysis = 'Sentiment'
								delete item.technicalIndicator
								delete item.sentimentIndicator
							}
							if (item.technicalIndicator) {
								item.indicator = item.technicalIndicator
								item.analysis = 'Technical'
								delete item.technicalIndicator
								delete item.sentimentIndicator
							}
						})
						const b = new SignalCode()
						var entry_signal_list = []
						var exit_signal_list = []
						delete backtestData.entry.signals
						for (var i in signalEntryList) {
							let code = b.encode(signalEntryList[i])
							var singal = {
								code: code
							}
							entry_signal_list.push(singal)
						}
						delete backtestData.exit.signals
						for (var i in signalExitList) {
							let code = b.encode(signalExitList[i])
							var singal = {
								code: code
							}
							exit_signal_list.push(singal)
						}
						let entry = {
							description: backtestData.entry.description,
							direction: backtestData.entry.direction,
							frequency: backtestData.entry.frequency,
							signals: entry_signal_list
						}
						let exit = {
							description: backtestData.exit.description,
							direction: backtestData.exit.direction,
							frequency: backtestData.exit.frequency,
							signals: exit_signal_list
						}
						delete backtestData.entry
						delete backtestData.exit
						backtestData.entry = JSON.stringify(entry)
						backtestData.exit = JSON.stringify(exit)

						//上传indicator layout
						var indicatorLayout = {}
						indicatorLayout.formIndicators = {
							entry: this.$store.state.indicators.formIndicators.entry,
							exit: this.$store.state.indicators.formIndicators.exit
						}
						indicatorLayout.technicalIndicators =
							this.$store.state.indicators.technicalIndicators
						indicatorLayout.activatedMA = this.$store.state.activatedMA
						backtestData.indicator_layout = JSON.stringify(indicatorLayout)
						console.log('传递的参数', backtestData)
						this.$http
							.post('/dev/runbt/', this.$qs.stringify(backtestData), {
								withCredentials: true
							})
							.then((res) => {
								if (res.status === 201) {
									// vm.loading = false
									// vm.$store.commit('clearBacktest')
									// vm.$store.commit('tryClear')
									// vm.$store.commit('getExitDirection', '')
									// vm.$store.commit('getFrequency', '')
									vm.$message.success('Save successfully')
									// vm.goToFavoriteForm()
									// vm.$refs.favoriteChild.getBacktestList('system')
								} else {
									vm.$message.error('Save failed')
									// vm.loading = false
								}
							})
					}
				}
			}
		}
	}
}
</script>
<style lang="less" scoped>
.home-container {
	width: 90%;
	margin: 0 auto;
}
// 暂时的样式
header {
	margin-bottom: 20px;
}
.criteria-container {
	padding: 10px;
}
.chart_box {
	width: 100%;
	height: 65vh;
}
.criteria-box {
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid #797979;
}
.backtest-btns {
	margin-top: 10px;
	display: flex;
	justify-content: flex-end;
	margin-right: 20px;
	padding-bottom: 10px;
	.el-button:first-child {
		background: #d9001b;
	}
	.el-button:last-child {
		background: #03a113;
	}
}
</style>
