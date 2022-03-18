<template>
	<div class="home">
		<div class="home-container">
			<header class="header">
				<el-row
					><el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="2"
						><img src="../../assets/logo.png" alt="logo" /></el-col
				></el-row>
				<el-row type="flex" justify="center"
					><el-col><p class="betaNote">BacktestEdge Beta</p></el-col>
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
				<el-tabs
					v-model="activeName"
					type="card"
					stretch
					tab-position
					@tab-click="handleTabClick"
				>
					<el-tab-pane label="Set up Backtest" name="first">
						<div class="set-up-container">
							<set-up
								ref="setUpChild"
								:backtestEditData="backtestEditData"
								:editFrequency="editFrequency"
								@getTimeFrame="getTimeFrame"
								@setDirection="setDirection"
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
								<el-button type="danger" @click="clearForm">
									Clear Form</el-button
								>
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
							@goTobacktestSetupForm="goTobacktestSetupForm"
							@goBacktestResultForm="goBacktestResultForm"
							@goToFavoritesForm="goToFavoritesForm"
						></favorite
					></el-tab-pane>
					<el-tab-pane label="Sample Backtests" name="fifth"
						><sample
							ref="sampleChild"
							@goToHistoryForm="goToHistoryForm"
							@refHistoryForm="refHistoryForm"
							@goTobacktestSetupForm="goTobacktestSetupForm"
							@goBacktestResultForm="goBacktestResultForm"
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
			// tabPosition: 'top',
			activeName: 'first',
			clientHeight: 0,
			loading: false,
			backtestEditData: {},
			editFrequency: 'Daily',
			timeFrame: 'Daily',
			historyFlag: true,
			favoriteFlag: true
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
		// // 在DOM渲染数据时，设置下区域高度为浏览器可视区域高度．
		// this.clientHeight = document.body.clientHeight
		// // 监听window的resize事件．在浏览器窗口变化时再设置下区域高度．
		// const _this = this
		// window.onresize = throttle(function temp() {
		// 	window.screenWidth = document.body.clientWidth
		// 	_this.clientHeight = window.screenWidth
		// 	if (_this.clientHeight < 768) {
		// 		_this.tabPosition = 'left'
		// 	} else {
		// 		_this.tabPosition = 'top'
		// 	}
		// }, 500)
	},
	methods: {
		// 清除set up  表单
		clearForm() {
			CIQ.reloadChart()
			this.$store.commit('initialBacktestInfo')
			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
		},
		handleTabClick(tab, event) {
			let tabName = tab.name
			switch (tabName) {
				case 'second':
					if (this.historyFlag) {
						this.$refs.historyChild.getBacktestList()
						this.historyFlag = false
					}
					break
				case 'forth':
					if (this.favoriteFlag) {
						this.$refs.favoriteChild.getBacktestList()
						this.favoriteFlag = false
					}
					break
				case 'fifth':
					this.$refs.sampleChild.getStrategyList()
			}
		},
		getTimeFrame(val) {
			this.timeFrame = val
		},
		setDirection(val) {
			this.$refs.entryChild.setDirection(val)
			let exit = ''
			if (val == 'Long') {
				exit = 'Short'
			} else if (val == 'Short') {
				exit = 'Long'
			}
			this.$refs.exitChild.setDirection(exit)
		},
		setExitDirection(val) {
			let exit = ''
			if (val == 'Long') {
				exit = 'Short'
			} else if (val == 'Short') {
				exit = 'Long'
			}
			this.$refs.exitChild.setDirection(exit)
			this.$refs.setUpChild.setEditDirection(val)
		},
		refreshPage() {
			location.reload()
		},
		runBacktest: throttle(function () {
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
						const set = new Set([
							['Commodity Channel Index', 'cci'],
							['Relative Strength Index', 'rsi'],
							['Moving Average', 'ma'],
							['MACD', 'macd'],
							['RC', '']
						])

						const newMap = new Map(set)

						var entrySignal = CIQ.indicatorList.find((item) => {
							return item.chart_name == backtestData.entry.signals[0].indicator
						})
						var exitSignal = CIQ.indicatorList.find((item) => {
							return item.chart_name == backtestData.exit.signals[0].indicator
						})
						if (!entrySignal) {
							for (let i of newMap.entries()) {
								if (backtestData.entry.signals[0].indicator === i[0]) {
									entrySignal = { url: i[1] }
								}
							}
						}
						if (!exitSignal) {
							for (let i of newMap.entries()) {
								if (backtestData.exit.signals[0].indicator === i[0]) {
									exitSignal = { url: i[1] }
								}
							}
						}
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
						// console.log("entry/exit: ",this.$store.state.indicators.formIndicators)
						indicatorLayout.formIndicators = {
							entry: this.$store.state.indicators.formIndicators.entry,
							exit: this.$store.state.indicators.formIndicators.exit
						}
						indicatorLayout.technicalIndicators =
							this.$store.state.indicators.technicalIndicators

						var savedTechSD = []
						for (var i in CIQ.stxx.layout.studies) {
							savedTechSD.push({
								type: CIQ.stxx.layout.studies[i].type,
								inputs: CIQ.stxx.layout.studies[i].inputs,
								outputs: CIQ.stxx.layout.studies[i].outputs,
								parameters: CIQ.stxx.layout.studies[i].parameters,
								panel: CIQ.stxx.layout.studies[i].panel
							})
						}

						indicatorLayout.savedTechSD = savedTechSD
						indicatorLayout.activatedMA = this.$store.state.activatedMA
						backtestData.indicator_layout = JSON.stringify(indicatorLayout)
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
									// 保存成功之后应该清除表单的所有数据
									vm.clearForm()
									// 并且清除 old_uuid
									let backtestInfo = vm.$store.state.backtestInfo
									if (backtestInfo.old_uuid) {
										vm.$store.commit('clearBacktestUuid')
									}
									vm.$refs.favoriteChild.getBacktestList()
								} else {
									vm.$message.error('Save failed')
									vm.loading = false
									vm.clearForm()
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
		}, 500),
		goToHistoryForm() {
			this.activeName = 'second'
		},
		goTobacktestSetupForm(id) {
			// backtestEditData

			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
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
				vm.timeFrame = data.entry.frequency
				vm.$store.commit('getFrequency', vm.editFrequency)
				vm.backtestEditData = data
			})
		},
		goBacktestResultForm(row) {
			this.activeName = 'third'
			this.$refs.performanceChild.getResultData(row)
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
@media screen and (max-width: 768px) {
	.restartBtn {
		position: relative;
		z-index: 1;
		width: 98%;
	}
}
@media screen and (min-width: 768px) {
	.restartBtn {
		margin-left: 10px;
		position: relative;
		z-index: 1;
		float: right;
		width: 12rem;
	}
}

.home-container {
	width: 85vw;
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
		margin: 0px;
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
	justify-content: space-between;
	border-bottom: 1px solid #797979;
}
@media (min-width: 820px) and (max-width: 1279px) {
	.criteria-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.criteria-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
.backtest-btns {
	margin-top: 10px;
	display: flex;
	justify-content: flex-end;
	margin-right: 20px;
	padding-bottom: 10px;
	margin-bottom: 100px;
	.el-button:first-child {
		background: #d9001b;
	}
	.el-button:last-child {
		background: #03a113;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.home-container {
		width: 100%;
		margin: 0 auto;
		padding: 0px 5px;
	}
	.criteria-container {
		padding: 0;
	}
	.criteria-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
	.el-tabs__nav-scroll {
		overflow: scroll;
	}
	/deep/.el-tabs__nav-scroll {
		overflow: scroll;
	}
}
</style>
