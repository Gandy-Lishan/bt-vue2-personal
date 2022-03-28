<template>
	<div class="home">
		<div class="home-container">
			<header class="header">
				<div class="header_logo"
					><span
						><img style="max-width: 190px" src="../../assets/logo.png" alt="logo" /></span
				></div>
				<el-row type="flex" justify="center"
					><el-col><p class="betaNote">BacktestEdge Beta</p></el-col>
				</el-row>
				<div class="chart_box" id="chart_box">
					<chart width="100%" height="100%"></chart>
				</div>
			</header>
			<div class="gradient"></div>
			<main class="main">
				<div class="alignRight" style="display: flex; align-items: center">
					<i
						@click="sidebar"
						class="fa fa-outdent navCheck"
						style="font-size: 30px"
					></i>
					<el-button
						@click="refreshPage"
						class="restartBtn"
						type="primary"
						icon="el-icon-refresh-right"
						>Create New Backtest</el-button
					>
				</div>
				<el-tabs
					v-model="activeName"
					type="card"
					stretch
					:tab-position="tabPosition"
					@tab-click="handleTabClick"
				>
					<el-tab-pane label="Set up Backtest" name="first">
						<div class="set-up-container" @click="tabContentClick">
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
			<button class="toTop" @click="animationUp"><svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M-1.31134e-07 1.5C-5.87107e-08 0.671573 0.642374 5.61581e-08 1.43478 1.25433e-07L20.5652 1.79787e-06C21.3576 1.86714e-06 22 0.671574 22 1.5C22 2.32843 21.3576 3 20.5652 3L1.43478 3C0.642374 3 -2.03557e-07 2.32843 -1.31134e-07 1.5Z" fill="#F9FAFB"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 30C10.6716 30 10 29.2645 10 28.3571L10 8.64286C10 7.73553 10.6716 7 11.5 7C12.3284 7 13 7.73553 13 8.64286L13 28.3571C13 29.2645 12.3284 30 11.5 30Z" fill="#F9FAFB"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.5079 18.5152C20.8519 19.1616 19.7881 19.1616 19.1321 18.5152L11.5 10.9959L3.86794 18.5152C3.21186 19.1616 2.14814 19.1616 1.49206 18.5152C0.835983 17.8688 0.835983 16.8208 1.49206 16.1744L10.3121 7.48479C10.9681 6.8384 12.0319 6.8384 12.6879 7.48479L21.5079 16.1744C22.164 16.8208 22.164 17.8688 21.5079 18.5152Z" fill="#F9FAFB"></path></svg></button>
			<div class="footer">
				<p>Copyright © 2001 - 2022 Sundial Capital Research, Inc. All rights reserved.</p>
			</div>
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
			btnClickBool: true,
			scroll: '',
			tabPosition: 'top',
			activeName: 'first',
			clientHeight: document.body.clientWidth,
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
		let toTop = document.getElementsByClassName("toTop")[0]
		toTop.style.visibility = "hidden"
		// 在DOM渲染数据时，设置下区域高度为浏览器可视区域高度．
		//this.clientHeight = document.body.clientHeight
		// 监听window的resize事件．在浏览器窗口变化时再设置下区域高度．
		const _this = this
		window.onscroll = function scroll(){
			_this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
		}
		window.onresize = throttle(function temp() {
			window.screenWidth = document.body.clientWidth
			_this.clientHeight = window.screenWidth
			if (_this.clientHeight < 768) {
				_this.tabPosition = 'left'
			} else {
				_this.tabPosition = 'top'
			}
		})
		// this.myBrowser()
	},
	watch: {
		scroll: {
			handler(val) {
				let toTop = document.getElementsByClassName("toTop")[0]
				if(val<=600){
					toTop.style.visibility = "hidden"
				}else{
					toTop.style.visibility = "visible"
				}
			},
			immediate: true,
			deep: true
		},
		clientHeight: {
			handler(val) {
				this.clientHeight = val
				if (this.clientHeight < 768) {
					this.tabPosition = 'left'
				} else {
					this.tabPosition = 'top'
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		animationUp: function() {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			})
		},
		myBrowser: function () {
			//取得浏览器的userAgent字符串
			var userAgent = navigator.userAgent
			var isOpera = userAgent.indexOf('Opera') > -1
			//判断是否Opera浏览器
			if (
				userAgent.indexOf('Chrome') > -1 &&
				userAgent.indexOf('Safari') > -1
			) {
				// alert('Chrome浏览器')
			} else {
				alert('The best display is accessed using the chrome browser')
			}
		},
		// 清除set up  表单
		tabContentClick() {
			try {
				let sidebar = document.getElementsByClassName('el-tabs__header is-left')
				let tabContent = document.getElementsByClassName('el-tabs__content')
				let btn = document.getElementsByClassName('fa fa-outdent navCheck')
				sidebar[0].style.left = '-110px'
				tabContent[0].style.left = '-110px'
				btn[0].style.transform = 'rotate3d(0, 1, 0, -180deg)'
				btn[0].style.transition = 'all 0.5s'
				this.btnClickBool = false
			} catch (error) {}
		},
		sidebar() {
			try {
				let sidebar = document.getElementsByClassName('el-tabs__header is-left')
				let tabContent = document.getElementsByClassName('el-tabs__content')
				let btn = document.getElementsByClassName('fa fa-outdent navCheck')
				if (this.btnClickBool == true) {
					sidebar[0].style.left = '-110px'
					tabContent[0].style.left = '-110px'
					btn[0].style.transform = 'rotate3d(0, 1, 0, -180deg)'
					btn[0].style.transition = 'all 0.5s'
					this.btnClickBool = false
				} else {
					sidebar[0].style.left = '0px'
					tabContent[0].style.left = '0px'
					btn[0].style.transform = 'rotate3d(0, 1, 0, 0deg)'
					btn[0].style.transition = 'all 0.5s'
					this.btnClickBool = true
				}
			} catch (error) {}
		},
		clearForm() {
			// CIQ.reloadChart()
			this.$store.commit('initialBacktestInfo')
			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
		},
		clearAllDataForm() {
			this.$store.commit('initialBacktestInfo')
			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
		},
		handleTabClick(tab, event) {
			let tabName = tab.name
			switch (tabName) {
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
		runBacktest: throttle(async function () {
			let setUp = this.$refs.setUpChild.saveBacktestData()
			if (setUp) {
				let entry = this.$refs.entryChild.saveBacktestData()
				let entryChecked = await entry
				if (entryChecked) {
					let exit = this.$refs.exitChild.saveBacktestData()
					let exitChecked = await exit
					if (exitChecked) {
						this.loading = true
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
						indicatorLayout.formIndicators = {
							entry: entrySignal.url,
							exit: exitSignal.url
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
									// vm.clearAllDataForm()
									CIQ.hideMarker()
									// 并且清除 old_uuid
									let backtestInfo = vm.$store.state.backtestInfo
									if (backtestInfo.old_uuid) {
										vm.$store.commit('clearBacktestUuid')
									}
									// 清除 oldBacktestName
									vm.$refs.setUpChild.clearOldBacktestName()
									vm.$refs.favoriteChild.getBacktestList()
								} else {
									vm.$message.error('Save failed')
									vm.loading = false
									// vm.clearAllDataForm()
									CIQ.hideMarker()
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
		}, 1000),
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
			// this.$store.commit('clearBacktestUuid')
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

main{
	padding: 0 50px;
	background: #f9fafb;
}
.gradient{
	padding-top: 88px;
	background: linear-gradient(180deg,#dde0e4,rgba(249,250,251,0));
}
@media screen and (max-width: 768px) {
	.restartBtn {
		position: relative;
		z-index: 1;
		width: 10rem;
		margin-left: 100px;
		margin-right: 30px;
		flex: 1;
		//width: 98%;
	}
	.alignRight {
		float: none;
	}
}
@media screen and (min-width: 768px) {
	.navCheck {
		display: none;
	}
	.restartBtn {
		margin-left: 0px !important;
		position: relative;
		z-index: 1;
		width: 12rem;
		flex: 1;
	}
	.alignRight {
		float: right;
		margin: 1px 0 0 10px;
	}
}

button.toTop {
	border:unset;
    position: fixed;
    right: 75px;
    bottom: 63px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    background: #111827;
    background-image: initial;
    background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    background-repeat-x: initial;
    background-repeat-y: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: rgb(17, 24, 39);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 4%);
}

.footer{
	background: #fff;
    display: flex;
    padding: 16px;
    border-top: 1px solid #e5e7eb;
	margin-top: 50px;
}
.footer p{
    text-align: center;
	color: #9ca3af;
	line-height: 21px;
}

.home-container {
	margin: 0 auto;
}
// 暂时的样式
header {
	margin-bottom: 28px;
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
	background: url(../../assets/dots-blue.png);
}
.header_logo{
	padding: 12px 24px;
	display: flex;
	box-shadow: 0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 6%);
	position: sticky;
    z-index: 999;
    top: 0;
    width: 100%;
    background: #fff;
}
.criteria-container {
	padding: 10px;
}
.chart_box {
    padding: 0 50px;
}
.betaNote{
	padding: 22px 50px;
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
	margin-bottom: 12px;
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
	// .el-tabs__nav-scroll {
	// 	overflow: scroll;
	// }
	// /deep/.el-tabs__nav-scroll {
	// 	overflow: scroll;
	// }
}
</style>
