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
				<el-button
					@click="refreshPage"
					class="restartBtn"
					type="primary"
					icon="el-icon-refresh-right"
					>Create New Backtest</el-button
				>
				<el-tabs v-model="activeName" type="card" :tab-position="tabPosition">
					<el-tab-pane label="Set up Backtest" name="first">
						<div class="set-up-container">
							<set-up
								ref="setUpChild"
								:backtestEditData="backtestEditData"
								:editFrequency="editFrequency"
								@getTimeFrame="getTimeFrame"
							></set-up>
							<div class="criteria-container">
								<div class="criteria-box">
									<entry
										ref="entryChild"
										@setExitDirection="setExitDirection"
									></entry>
									<exit ref="exitChild" :timeFrame="timeFrame"></exit>
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
						><history
							ref="historyChild"
							@goTobacktestSetupForm="goTobacktestSetupForm"
							@goBacktestResultForm="goBacktestResultForm"
							@goToFavoritesForm="goToFavoritesForm"
							@refFavoritesForm="refFavoritesForm"
						></history
					></el-tab-pane>
					<el-tab-pane label="Backtest Results" name="third"
						><div class="set-up-container">
							<result
								:backtestEditData="backtestEditData"
								:editFrequency="editFrequency"
							></result>
						</div>
						<performance
							ref="performanceChild"
							:backtestEditData="backtestEditData"
							@errorCatchPerformance="errorCatchPerformance"
						></performance>
					</el-tab-pane>
					<el-tab-pane label="My Favorites" name="forth"
						><favorite
							ref="favoriteChild"
							@refHistoryForm="refHistoryForm"
							@refFavoritesForm="refFavoritesForm"
							@goTobacktestSetupForm="goTobacktestSetupForm"
							@goBacktestResultForm="goBacktestResultForm"
							@goToFavoritesForm="goToFavoritesForm"
						></favorite
					></el-tab-pane>
					<el-tab-pane label="Sample Backtests" name="fifth"
						><sample
							@goToHistoryForm="goToHistoryForm"
							@refHistoryForm="refHistoryForm"
						></sample
					></el-tab-pane>
				</el-tabs>
			</main>
		</div>
	</div>
</template>
<script>
const _ = require('lodash')
const throttle = _.throttle
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import deepClone1 from '@/tools/deepClone.js'
import SignalCode from '@/tools/codeTool.js'
import chart from '@/components/chart/index.vue'
import setUp from '@/components/BacktestEdge/SetUp.vue'
import entry from '@/components/BacktestEdge/Entry.vue'
import exit from '@/components/BacktestEdge/Exit.vue'
import result from '@/components/BacktestEdge/Result.vue'
import performance from '@/components/BacktestEdge/Performance.vue'
import history from '@/components/BacktestEdge/History.vue'
import favorite from '@/components/BacktestEdge/Favorite.vue'
import sample from '@/components/BacktestEdge/Sample.vue'
export default {
	name: 'home',
	data() {
		return {
			tabPosition: 'top',
			activeName: 'first',
			clientHeight: 0,
			exitDirection: '',
			loading: false,
			backtestEditData: {},
			editFrequency: 'Daily',
			timeFrame: 'Daily'
		}
	},
	// provide() {
	// 	return {
	// 		timeFrame: () => this.pubilcEditData
	// 	}
	// },
	components: {
		chart: chart,
		'set-up': setUp,
		entry,
		exit,
		result,
		performance,
		history,
		favorite,
		sample
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
		getTimeFrame(val) {
			this.timeFrame = val
		},
		setExitDirection(val) {
			let data = ''
			if (val == 'Long') {
				data = 'Short'
			} else if (val == 'Short') {
				data = 'Long'
			}
			// this.exitDirection = data
			this.$refs.exitChild.setDirection(data)
		},
		refreshPage() {
			location.reload()
		},
		runBacktest() {
			let setUp = this.$refs.setUpChild.saveBacktestData()
			if (setUp) {
				let entry = this.$refs.entryChild.saveBacktestData()
				if (entry) {
					let exit = this.$refs.exitChild.saveBacktestData()
					if (exit) {
						this.loading = true
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
								delete item.riskIndicator
							}
							if (item.technicalIndicator) {
								item.indicator = item.technicalIndicator
								item.analysis = 'Technical'
								delete item.technicalIndicator
								delete item.sentimentIndicator
								delete item.riskIndicator
							}
							if (item.riskIndicator) {
								item.indicator = 'RC'
								item.analysis = 'Exit'
								delete item.technicalIndicator
								delete item.sentimentIndicator
								delete item.riskIndicator
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
									// 保存成功之后，将 backtestInfo 清空回原始的状态
									vm.$store.commit('initialBacktestInfo')
									vm.loading = false
									vm.goToHistoryForm()
									vm.$refs.historyChild.refreshHistory(res.data.id)
								} else {
									vm.$message.error('Save failed')
									vm.loading = false
								}
							})
							.catch((error) => {
								this.$notify.error({
									title: 'Create New Backtest',
									message:
										'Please click the Create New Backtest button to a new Backtest',
									offset: 100
								})
								// 初始化backtestInfo的数据
								vm.$store.commit('initialBacktestInfo')
							})
					}
				}
			}
		},
		goToHistoryForm() {
			this.activeName = 'second'
		},
		goTobacktestSetupForm(id) {
			// backtestEditData
			let vm = this
			vm.activeName = 'first'
			vm.backtestEditData = {}
			vm.$http.get('/dev/seeparams/' + id + '/').then((res) => {
				let data = res.data
				data.old_uuid = id
				data.entry = JSON.parse(data.entry)
				data.exit = JSON.parse(data.exit)
				delete data.results
				delete data.status
				delete data.backtest_id
				delete data.user_id
				delete data.uuid
				let signalCode = new SignalCode()
				if (data.entry.signals instanceof Array) {
					data.entry.signals[0] = signalCode.decode(
						data.entry.signals[0]['code']
					)
				}
				if (data.exit.signals instanceof Array) {
					data.exit.signals[0] = signalCode.decode(data.exit.signals[0]['code'])
				}

				vm.$refs.entryChild.setEditData(id)
				vm.$refs.exitChild.setEditData(id)
				// 拿到 frequency 的值
				vm.editFrequency = data.entry.frequency
				vm.$store.commit('getFrequency', vm.editFrequency)
				vm.backtestEditData = data
			})
		},
		goBacktestResultForm(row) {
			this.activeName = 'third'
			this.$refs.performanceChild.getResultData(row.id)
		},
		goToFavoritesForm() {
			this.activeName = 'forth'
			this.$refs.favoriteChild.getBacktestList()
		},
		refFavoritesForm() {
			this.$refs.favoriteChild.getBacktestList()
		},
		refHistoryForm() {
			this.$refs.historyChild.getBacktestList()
		},
		// 无法拿到 performance 的数据，服务端异常
		errorCatchPerformance() {
			this.$notify({
				title: 'Try Another',
				message: 'The backtest cannot request data, please change parameter',
				offset: 100,
				type: 'warning'
			})
		}
	}
}
</script>
<style lang="less" scoped>
.restartBtn {
	position: relative;
	z-index: 1;
	float: right;
	width: 12rem;
}
.home-container {
	width: 1280px;
	margin: 0 auto;
}
// 暂时的样式
header {
	margin-bottom: 20px;
}
.header {
	img {
		width: 100%;
	}
	p {
		margin: 1.14rem 0 1.14rem 0px;
		font-style: italic;
		color: #6c6c6c;
	}
	p:first-of-type {
		text-align: left;
		font-size: 2.5rem;
		margin: 50px 0 50px 0;
		font-weight: lighter;
		color: #333333;
	}
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
