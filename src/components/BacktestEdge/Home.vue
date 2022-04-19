<template>
	<div class="home">
		<div class="home-container">
			<header class="header">
				<div class="header_logo">
					<span
						><img
							style="width: 190px; height: 50px"
							src="../../assets/logo.png"
							alt="logo"
					/></span>
					<div class="menu">
<el-dropdown :hide-on-click="false" @command="handleCommand">
  <span class="el-dropdown-link">
    Help<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item command="doc">
		文档教程
	</el-dropdown-item>
    <el-dropdown-item command="video">视频教程</el-dropdown-item>
    <el-dropdown-item command="contact">联系我们</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown></div>
				</div>
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
				<el-tabs
					v-model="activeName"
					type="card"
					:tab-position="tabPosition"
					@tab-click="handleTabClick"
				>
					<el-tab-pane label="Set up Backtest" name="first">
						<div class="set-up-container">
							<set-up
								ref="setUpChild"
								:backtestEditData="backtestEditData"
								@getTimeFrame="getTimeFrame"
								@setDirection="setDirection"
							></set-up>
							<div class="criteria-container">
								<div class="criteria-box">
									<entry
										ref="entryChild"
										:direction="direction"
										@sendEntrySignalIndex="sendEntrySignalIndex"
									></entry>
									<!-- <multi-entry></multi-entry> -->
									<exit
										ref="exitChild"
										:timeFrame="timeFrame"
										:direction="direction"
										@sendExitSignalIndex="sendExitSignalIndex"
									></exit>
									<!-- <multi-exit></multi-exit> -->
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
import multiEntry from '@/components/BacktestEdge/Multi-Entry.vue'
import multiExit from '@/components/BacktestEdge/Multi-Exit.vue'
import searchKeys from '@/tools/searchKeys.js'
import UUID from '@/tools/uuid.js'
import s3_tool from "@/tools/s3-upload.js"
export default {
	name: 'home',
	data() {
		return {
			tabPosition: 'top',
			activeName: 'first',
			clientHeight: 0,
			loading: false,
			backtestEditData: {},
			editFrequency: 'Daily',
			timeFrame: 'Daily',
			historyFlag: true,
			favoriteFlag: true,
			entryLength: 1,
			exitLength: 1,
			direction: 'Long'
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
		sample,
		'multi-entry': multiEntry,
		'multi-exit': multiExit
	},
	mounted() {
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
		// 清除set up  表单
		clearForm() {
			//CIQ.reloadChart()
			this.$store.commit('initialBacktestInfo')
			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
		},
		sendEntrySignalIndex(length) {
			this.entryLength = length
		},

		sendExitSignalIndex(length) {
			this.exitLength = length
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
			this.direction = val
		},
		refreshPage() {
			location.reload()
		},
		addEntrySignalLength(index) {
			let obj = {}
			obj.criteria = 'entry'
			obj.index = index
			this.$store.commit('addSignalLength', obj)
		},
		addExitSignalLength(index) {
			let obj = {}
			obj.criteria = 'exit'
			obj.index = index
			this.$store.commit('addSignalLength', obj)
		},
		runBacktest: throttle(async function () {
			console.log(
				'当前vuex中的entrysignal',
				this.$store.state.backtestInfo.entry_description
			)
			console.log('测试去重', searchKeys(['1', '2', '3', '1']))
			console.log(
				'当前vuex中的exitsignal',
				this.$store.state.backtestInfo.exit_description
			)
			let setUp = this.$refs.setUpChild.saveBacktestData()
			this.$refs.entryChild.addEntrySignalLength()
			this.$refs.exitChild.addExitSignalLength()
			if (setUp) {
				let entry
				// 申请空间
				for (let index = 0; index < this.entryLength; index++) {
					this.addEntrySignalLength(index)
					entry = this.$refs.entryChild.saveBacktestData(index)
					this.$refs.entryChild.saveScoreValue()
				}
				if (entry) {
					let exit
					for (let index = 0; index < this.exitLength; index++) {
						this.addExitSignalLength(index)
						exit = this.$refs.exitChild.saveBacktestData(index)
						this.$refs.exitChild.saveScoreValue()
					}
					if (exit) {
						this.loading = true
						let vm = this
						let signalEntryList = []
						let signalExitList = []
						let backtestData = vm.$store.state.backtestInfo
						let entry_description =
							vm.$store.state.backtestInfo.entry_description

						let sameEntryIndexArr = searchKeys(entry_description)
						if (sameEntryIndexArr.length >= 1) {
							for (let j = 0; j < sameEntryIndexArr.length; j++) {
								let sameItem = []
								let str = ''
								sameItem = sameEntryIndexArr[j].split(',')
								for (let n = 0; n < sameItem.length; n++) {
									str += 'Signal' + (Number(sameItem[n]) + 1) + ' '
								}
								vm.$message({
									message:
										'The current entry ' + str + ' are the same, please change',
									type: 'error',
									offset: 300
								})
								return
							}
						}
						let exit_description = vm.$store.state.backtestInfo.exit_description

						let sameExitIndexArr = searchKeys(exit_description)
						if (sameExitIndexArr.length > 1) {
							for (let j = 0; j < sameExitIndexArr.length; j++) {
								let sameItem = []
								let str = ''
								sameItem = sameExitIndexArr[j].split(',')
								for (let n = 0; n < sameItem.length; n++) {
									str += 'Signal' + (Number(sameItem[n]) + 1) + ' '
								}
								vm.$message({
									message:
										'The current exit ' + str + ' are the same, please change',
									type: 'error',
									offset: 300
								})
								return
							}
						}
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

						// const set = new Set([
						// 	['Commodity Channel Index', 'cci'],
						// 	['Relative Strength Index', 'rsi'],
						// 	['Moving Average', 'ma'],
						// 	['MACD', 'macd'],
						// 	['RC', '']
						// ])
						// const newMap = new Map(set)

						let formateTechnicalList
						formateTechnicalList = vm.$store.state.formateTechnicalList

						let entrySignal = backtestData.entry.signals.map(item => {
							let signal = CIQ.indicatorList.find((i) => {
								return i.chart_name == item.indicator
							})
							if(!signal){
								for (let i = 0; i < formateTechnicalList.length; i++) {
									if (
										formateTechnicalList[i].value == item.indicator
									) {
										return formateTechnicalList[i].url
									}
								}		
							}
							return signal.url
						})
						let exitSignal = backtestData.exit.signals.map(item => {
							let signal = CIQ.indicatorList.find((i) => {
								return i.chart_name == item.indicator
							})
							if(!signal){
								for (let i = 0; i < formateTechnicalList.length; i++) {
									if (
										formateTechnicalList[i].value == item.indicator
									) {
										return formateTechnicalList[i].url
									}
								}		
							}
							return signal.url
						})			

						// if (!entrySignal) {
						// 	// for (let i of newMap.entries()) {
						// 	// 	if (backtestData.entry.signals[0].indicator === i[0]) {
						// 	// 		entrySignal = { url: i[1] }
						// 	// 	}
						// 	// }
						// 	for (let i = 0; i < formateTechnicalList.length; i++) {
						// 		if (
						// 			backtestData.entry.signals[0].indicator ===
						// 			formateTechnicalList[i].value
						// 		) {
						// 			entrySignal = formateTechnicalList[i].url
						// 			break
						// 		}
						// 	}
						// }
						// if (!exitSignal) {
						// 	// for (let i of newMap.entries()) {
						// 	// 	if (backtestData.exit.signals[0].indicator === i[0]) {
						// 	// 		exitSignal = { url: i[1] }
						// 	// 	}
						// 	// }
						// 	for (let i = 0; i < formateTechnicalList.length; i++) {
						// 		if (
						// 			backtestData.exit.signals[0].indicator ===
						// 			formateTechnicalList[i].value
						// 		) {
						// 			exitSignal = formateTechnicalList[i].url
						// 			break
						// 		}
						// 	}
						// }
						delete backtestData.entry.signals
						// for (var i in signalEntryList) {
						// 	let code = b.encode(signalEntryList[i])
						// 	var singal = {
						// 		code: code
						// 	}
						// 	entry_signal_list.push(singal)
						// }
						for (let i = 0; i < signalEntryList.length; i++) {
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
							score: backtestData.entry.score,
							relation: 0,
							signals: entry_signal_list
						}
						let exit = {
							description: backtestData.exit.description,
							score: backtestData.exit.score,
							relation: 0,
							signals: exit_signal_list
						}
						delete backtestData.entry
						delete backtestData.exit
						backtestData.entry = JSON.stringify(entry)
						backtestData.exit = JSON.stringify(exit)
						if (Array.isArray(entry_description)) {
							backtestData.entry_description = JSON.stringify(entry_description)
						}
						if (Array.isArray(exit_description)) {
							backtestData.exit_description = JSON.stringify(exit_description)
						}
						//上传indicator layout
						
						var indicatorLayout = {}
						// console.log("entry/exit: ",this.$store.state.indicators.formIndicators)
						indicatorLayout.formIndicators = {
							entry: entrySignal,
							exit: exitSignal
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
						console.log("indicatorLayout: ",indicatorLayout)
						let str = UUID(JSON.stringify(backtestData))
						// let finalData = CIQ.exportEx(str)
						// console.log('finalCols: ',finalData)

						// let _obj = {
						// 	val: JSON.stringify(finalData),
						// 	key: str + '/'+ str + '_data.json'
						// }
						// let result = await s3_tool.send_obj_server(_obj)
						// console.log(result)

						
						backtestData.pk = str
						// console.log('编辑后传出去的数据', backtestData)
					    // console.log('编辑后传出去的ID', UUID(JSON.stringify(backtestData)))

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
									console.log(res.data)
									vm.$refs.historyChild.refreshHistory(res.data.id)
									console.log('运行之后的返回值', res.data)
									// 保存成功之后应该清除表单的所有数据
									vm.clearForm()
									vm.$store.commit('clearStoreDesciption')
									// 并且清除 old_uuid
									let backtestInfo = vm.$store.state.backtestInfo
									if (backtestInfo.old_uuid) {
										vm.$store.commit('clearBacktestUuid')
									}
									// 刷新 favorite 表单
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
								vm.$store.commit('clearStoreDesciption')
								vm.$store.commit('initialBacktestInfo')
							})
					}
				}
			}
		}, 5000),
		goToHistoryForm() {
			this.activeName = 'second'
		},
		goTobacktestSetupForm(id) {
			// backtestEditData
			
			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
			this.$store.commit('initialBacktestInfo')
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
					// data.entry.signals = signalCode.decode(data.entry.signals[0]['code'])
					data.entry.signals = data.entry.signals.map((value) => {
						return signalCode.decode(value.code)
					})
				}
				if (data.exit.signals instanceof Array) {
					// data.exit.signals[0] = signalCode.decode(data.exit.signals[0]['code'])
					data.exit.signals = data.exit.signals.map((value) => {
						return signalCode.decode(value.code)
					})
				}
				let entryPanel = data.entry.signals.length
				let exitPanel = data.exit.signals.length
				let entryData = {}
				entryData.entry = data.entry
				// entryData.entry_description = data.entry_description
				let exitData = {}
				exitData.exit = data.exit
				// exitData.exit_description = data.exit_description
				vm.$refs.entryChild.setEditPanel(entryPanel, entryData)
				vm.$refs.exitChild.setEditPanel(exitPanel, exitData)
				// 拿到 frequency 的值
				vm.editFrequency = data.frequency
				vm.timeFrame = data.frequency
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
		},
		handleCommand(command) {
			console.log("文档教程",command);
			this.$router.push('/doc')
		}
	}
}
</script>
<style lang="less" scoped>
@media screen and (max-width: 768px) {
	.restartBtn {
		position: relative;
		z-index: 1;
		width: 10rem;
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
	width: 1300px;
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
	background: url(../../assets/dots-blue.png);
}
.header_logo {
	padding: 12px 24px;
	display: flex;
	box-shadow: 0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 6%);
	position: sticky;
	z-index: 999;
	top: 0;
	width: 100%;
	background: #fff;
	justify-content: space-between;
	.menu{
		justify-self: center;
		align-self: center;
		margin-right: 50px;
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
	justify-content: space-around;
	// border-bottom: 1px solid #797979;
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
/deep/ .el-input__icon {
	line-height: 27px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
