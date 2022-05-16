<template>
	<div class="home">
		<div class="home-container">
			<div class="navbar">
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
								<el-dropdown-item command="doc"> Tutorial </el-dropdown-item>
								<el-dropdown-item command="contact">
									Contant Us
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</div>
			<header class="header">
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
					<el-tooltip
						class="item"
						effect="dark"
						content="Clear chart and backtest set up form to create new backtests"
						placement="bottom"
					>
						<el-button
							@click="refreshPage"
							class="restartBtn"
							type="primary"
							icon="el-icon-refresh-right"
							>Create New Backtest</el-button
						></el-tooltip
					>
					<el-tooltip
						style="margin-left:10px !important"
						class="item"
						effect="light"
						content="Clear chart and backtest set up form to create new backtests"
						placement="bottom"
					>
						<el-button
							@click="test"
							class="restartBtn"
							type="success"
							icon="el-icon-s-claim"
							>Test</el-button
						></el-tooltip
					>
				</div>
				<el-tabs
					v-model="activeName"
					type="card"
					stretch
					:tab-position="tabPosition"
					@tab-click="handleTabClick"
				>
					<el-tab-pane
						label="Set up Backtest"
						name="first"
						v-loading="loading"
						element-loading-text="Loading..."
						element-loading-spinner="el-icon-loading"
						element-loading-background="rgba(0, 0, 0, 0.8)"
					>
						<div class="set-up-container" @click="tabContentClick">
							<set-up
								ref="setUpChild"
								:backtestEditData="backtestEditData"
								@IsRiskControl="IsRiskControl"
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
										:direction="direction"
										:exitSaveCheck="exitSaveCheck"
										@isOnlyRiskControl="isOnlyRiskControl"
										@sendExitSignalIndex="sendExitSignalIndex"
									></exit>
									<!-- <multi-exit></multi-exit> -->
								</div>
							</div>
							<div class="backtest-btns">
								<el-tooltip
									class="item"
									effect="dark"
									content="Clear the backtest set up form "
									placement="bottom"
								>
									<el-button type="danger" @click="clearForm">
										Clear Form</el-button
									>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="Complete the form filling, run the backtest, and view the results"
									placement="bottom"
								>
									<el-button type="success" @click="runBacktest"
										>Run Backtest</el-button
									></el-tooltip
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

			<el-tooltip
				class="item"
				effect="dark"
				content="Back to the top"
				placement="bottom"
			>
				<button class="toTop" @click="animationUp">
					<svg
						width="22"
						height="30"
						viewBox="0 0 22 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M-1.31134e-07 1.5C-5.87107e-08 0.671573 0.642374 5.61581e-08 1.43478 1.25433e-07L20.5652 1.79787e-06C21.3576 1.86714e-06 22 0.671574 22 1.5C22 2.32843 21.3576 3 20.5652 3L1.43478 3C0.642374 3 -2.03557e-07 2.32843 -1.31134e-07 1.5Z"
							fill="#F9FAFB"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M11.5 30C10.6716 30 10 29.2645 10 28.3571L10 8.64286C10 7.73553 10.6716 7 11.5 7C12.3284 7 13 7.73553 13 8.64286L13 28.3571C13 29.2645 12.3284 30 11.5 30Z"
							fill="#F9FAFB"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M21.5079 18.5152C20.8519 19.1616 19.7881 19.1616 19.1321 18.5152L11.5 10.9959L3.86794 18.5152C3.21186 19.1616 2.14814 19.1616 1.49206 18.5152C0.835983 17.8688 0.835983 16.8208 1.49206 16.1744L10.3121 7.48479C10.9681 6.8384 12.0319 6.8384 12.6879 7.48479L21.5079 16.1744C22.164 16.8208 22.164 17.8688 21.5079 18.5152Z"
							fill="#F9FAFB"
						></path>
					</svg>
				</button>
			</el-tooltip>
			<div class="footer">
				<p>
					Copyright © 2001 - 2022 Sundial Capital Research, Inc. All rights
					reserved.
				</p>
				<ul class="Footer_social___a7sK">
					<li>
						<a
							href="https://facebook.com/sentimentrader"
							target="_blank"
							rel="noopener noreferrer"
							><i class="fa fa-facebook"></i
						></a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/company/sentimentrader"
							target="_blank"
							rel="noopener noreferrer"
							><i class="fa fa-linkedin"></i
						></a>
					</li>
					<li>
						<a
							href="https://youtube.com/sentimentrader"
							target="_blank"
							rel="noopener noreferrer"
							><i class="fa fa-youtube"></i
						></a>
					</li>
					<li>
						<a
							href="https://twitter.com/sentimentrader"
							target="_blank"
							rel="noopener noreferrer"
							><i class="fa fa-twitter"></i
						></a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
const throttle = require('lodash/throttle')
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
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
import { runBacktest, seeParams } from '@/service/service'
import searchKeys from '@/tools/searchKeys.js'
import UUID from '@/tools/uuid.js'
import s3_tool from '@/tools/s3-upload.js'
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
			exitSaveCheck: false,
			historyFlag: true,
			favoriteFlag: true,
			entryLength: 1,
			exitLength: 1,
			direction: 'Long',
			isOnlyRisk: false
		}
	},
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
		let toTop = document.getElementsByClassName('toTop')[0]
		toTop.style.visibility = 'hidden'
		// 在DOM渲染数据时，设置下区域高度为浏览器可视区域高度．
		//this.clientHeight = document.body.clientHeight
		// 监听window的resize事件．在浏览器窗口变化时再设置下区域高度．
		const _this = this
		window.onscroll = function scroll() {
			_this.scroll =
				document.documentElement.scrollTop || document.body.scrollTop
		}
		window.onresize = throttle(function temp() {
			window.screenWidth = document.body.clientWidth
			_this.clientHeight = window.screenWidth
			if (_this.clientHeight < 768) {
				_this.tabPosition = 'left'
			} else {
				_this.tabPosition = 'top'
			}
			var chartBox = document.getElementsByClassName('chart_box')[0]
			chartBox.style.width = ''
		})

		this.myBrowser()
	},
	watch: {
		scroll: {
			handler(val) {
				try{
					let toTop = document.getElementsByClassName('toTop')[0]
					if (val <= 600) {
						toTop.style.visibility = 'hidden'
					} else {
						toTop.style.visibility = 'visible'
					}
				}catch(err){}
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
		test: function(){
			CIQ.downloadTest()
		},
		animationUp: function () {
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
		// 清除set up  表单
		clearForm() {
			//CIQ.reloadChart()
			Object.assign(this.$data, this.$options.data())
			this.$store.commit('initialBacktestInfo')
			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
		},
		clearAllDataForm() {
			Object.assign(this.$data, this.$options.data())
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
				case 'forth':
					if (this.favoriteFlag) {
						this.$refs.favoriteChild.getFavoriteList()
						this.favoriteFlag = false
					}
					break
				case 'fifth':
					this.$refs.sampleChild.getSampleList()
			}
		},
		IsRiskControl(val) {
			this.exitSaveCheck = val
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
		reloadData(data,freq) {
			let frequency = ''

			this.$store.commit('getEntryIndicatorsList', data.formIndicators.entry)
			this.$store.commit('getExitIndicatorsList', data.formIndicators.exit)
			this.$store.commit('getExtraIndicators', [])
			this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
			this.$store.commit('getMA', data.activatedMA)
			this.$store.commit('setTechSD', data.savedTechSD)
			//CIQ.savedTechSD = data.savedTechSD

			switch (freq) {
				case 'Daily': {
					frequency = 'daily'
					break
				}
				case 'Weekly': {
					frequency = 'weekly'
					break
				}
				case 'Monthly': {
					frequency = 'monthly'
					break
				}
				default: {
					break
				}
			}
			this.$store.commit('setRestoreFreq', frequency)
			// CIQ.addIndicatorsFromBacktest()
		},
		runBacktest: throttle(async function () {
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
					this.$refs.entryChild.saveSignalsInMarket()
					this.$refs.entryChild.saveDelayBar()
					this.$refs.entryChild.saveRelation()
				}
				let entryChecked = await entry
				if (entryChecked) {
					let exit
					let exitChecked
					for (let index = 0; index < this.exitLength; index++) {
						this.addExitSignalLength(index)
						exit = this.$refs.exitChild.saveBacktestData(index)
						exitChecked = await exit
						this.$refs.exitChild.saveScoreValue()
						this.$refs.exitChild.saveSignalsInMarket()
						this.$refs.exitChild.saveDelayBar()
						this.$refs.exitChild.saveRelation()
					}
					if (exitChecked) {
						this.loading = true
						let vm = this
						let signalEntryList = []
						let signalExitList = []
						let backtestData = JSON.parse(
							JSON.stringify(vm.$store.state.backtestInfo)
						)
						let entry_description = JSON.parse(
							JSON.stringify(vm.$store.state.backtestInfo.entry_description)
						)

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
								vm.loading = false
								return
							}
						}
						let exit_description = JSON.parse(
							JSON.stringify(vm.$store.state.backtestInfo.exit_description)
						)

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
								vm.loading = false
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
								delete item.riskIndicator
							}
						})
						if(!this.isOnlyRisk) {
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
						}
						const b = new SignalCode()
						var entry_signal_list = []
						var exit_signal_list = []

						let formateTechnicalList
						formateTechnicalList = vm.$store.state.formateTechnicalList
						if(formateTechnicalList.length === 0) {
							formateTechnicalList = vm.loadShortLong()
						}

						let entrySignal = backtestData.entry.signals.map((item) => {
							let signal = CIQ.indicatorList.find((i) => {
								return i.chart_name == item.indicator
							})
							if (!signal) {
								for (let i = 0; i < formateTechnicalList.length; i++) {
									if (formateTechnicalList[i].value == item.indicator) {
										return formateTechnicalList[i].url
									}
								}
							}
							return signal.url
						})
						let exitSignal
						if(!this.isOnlyRisk) {
						exitSignal = backtestData.exit.signals.map((item) => {
							let signal = CIQ.indicatorList.find((i) => {
								return i.chart_name == item.indicator
							})
							if (!signal) {
								for (let i = 0; i < formateTechnicalList.length; i++) {
									if (formateTechnicalList[i].value == item.indicator) {
										return formateTechnicalList[i].url
									}
								}
							}
							return signal.url
						})
						}else {
							exitSignal = [""]
						}
						delete backtestData.entry.signals
						for (let i = 0; i < signalEntryList.length; i++) {
							let code = b.encode(signalEntryList[i])
							var singal = {
								code: code
							}
							entry_signal_list.push(singal)
						}
						delete backtestData.exit.signals
						if(!this.isOnlyRisk) {
						for (var i in signalExitList) {
							let code = b.encode(signalExitList[i])
							var singal = {
								code: code
							}
							exit_signal_list.push(singal)
						}
						}
						if(this.isOnlyRisk) {
							exit_signal_list = [{code: "SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999"}]
						}
						let entry = {
							description: backtestData.entry.description,
							score: backtestData.entry.score,
							signals_in_market: backtestData.entry.signals_in_market,
							relation: backtestData.entry.relation,
							delay_bars: backtestData.entry.delay_bars,
							signals: entry_signal_list
						}
						let exit = {
							description: backtestData.exit.description,
							score: backtestData.exit.score,
							signals_in_market: backtestData.exit.signals_in_market,
							relation: backtestData.exit.relation,
							delay_bars: backtestData.exit.delay_bars,
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
							var output = {}
							if(CIQ.indicatorList.find((j) => { return j.url == CIQ.stxx.layout.studies[i].type }) == undefined){
								//console.log('isTech',CIQ.stxx.layout.studies[i].type)
								output = CIQ.stxx.layout.studies[i].outputs
							}
							savedTechSD.push({
								type: CIQ.stxx.layout.studies[i].type,
								inputs: CIQ.stxx.layout.studies[i].inputs,
								outputs: output,
								parameters: CIQ.stxx.layout.studies[i].parameters,
								panel: CIQ.stxx.layout.studies[i].panel
							})
							// var sd = CIQ.stxx.layout.studies[i]
							// savedTechSD.push([
							// 	sd.type,
							// 	sd.inputs,
							// 	sd.outputs,
							// 	sd.parameters,
							// ])
						}

						indicatorLayout.savedTechSD = savedTechSD
						indicatorLayout.activatedMA = this.$store.state.activatedMA

						backtestData.indicator_layout = JSON.stringify(indicatorLayout)

						
						//console.log('indicatorLayout: ', savedTechSD)
						let str = UUID(JSON.stringify(backtestData))

						backtestData.pk = str
					
						// 把对象里的数字字符串还原成数字
						backtestData.capital_alloc = parseFloat(backtestData.capital_alloc)
						backtestData.slippage = parseFloat(backtestData.slippage)
						backtestData.win_rate = parseFloat(backtestData.win_rate)


						CIQ.spanPeriod = {
							start_date: backtestData.start_date.replace(/-/g,'') * 1000000000,
							end_date: backtestData.end_date.replace(/-/g,'') * 1000000000
						}
						console.log(CIQ.spanPeriod)
						// 传给S3的backtestData copy
						var backtestParams = {}
						backtestParams.uuid = backtestData.pk
						backtestParams.benchmark = backtestData.benchmark
						backtestParams.capital = backtestData.capital
						backtestParams.capital_alloc = backtestData.capital_alloc
						backtestParams.commission = backtestData.commission
						backtestParams.create_date = backtestData.create_date
						backtestParams.direction = backtestData.direction
						backtestParams.create_date = backtestData.create_date
						backtestParams.end_date = backtestData.end_date
						backtestParams.entry = backtestData.entry
						backtestParams.exit = backtestData.exit
						backtestParams.frequency = backtestData.frequency
						backtestParams.name = backtestData.name
						backtestParams.risk_control = backtestData.risk_control
						backtestParams.slippage = backtestData.slippage
						backtestParams.start_date = backtestData.start_date
						backtestParams.strategy = backtestData.strategy
						backtestParams.symbol = backtestData.symbol
						backtestParams.win_rate = backtestData.win_rate
						console.log('编辑后传出去的数据', backtestParams)
						backtestParams = JSON.stringify(backtestParams)
						/* ********** */
						

						let backtestDataStr = this.$qs.stringify(backtestData)
						// 在回测前加载全时段的数据并生成csv上传s3,结果出来再更新表单
						this.reloadData(indicatorLayout,backtestData.frequency)
						// 1.上传数据文件
						// 2.上传参数文件
						// 3.判断文件上传状态，如果报错则不执行跑回测操作
						
						// TODO 
						// long
						CIQ.outputSignalsResult(str, async function () {
							if(arguments[0]==200){
								// 何上传的json
								try{
									var data = await s3_tool.upload({key:str + '/' + str + '_backtest_params.json',val:backtestParams})
									console.log("Upload json Success", data.key);
									try {
										console.log("start runBacktest");
										let res = await runBacktest(backtestDataStr)
										if (res.status === 201) {
											// 保存成功之后，将 backtestInfo 清空回原始的状态
											CIQ.isBacktestRun = true
											vm.$store.commit('initialBacktestInfo')
											vm.loading = false
											vm.goToHistoryForm()
											vm.$refs.historyChild.refreshHistory(res.data.id)
											// 保存成功之后应该清除表单的所有数据
											CIQ.hideMarker()
											CIQ.isMarkerShown = false 
											// 并且清除 old_uuid
											let backtestInfo = JSON.parse(
												JSON.stringify(vm.$store.state.backtestInfo)
											)
											if (backtestInfo.old_uuid) {
												vm.$store.commit('clearBacktestUuid')
											}
											// 清除 oldBacktestName
											vm.backtestEditData = {}
											vm.$refs.setUpChild.clearOldBacktestName()
											vm.$refs.favoriteChild.getFavoriteList()
										} else {
											vm.$message.error('Save failed')
											vm.loading = false
											CIQ.hideMarker()
											CIQ.isMarkerShown = false
										}
									} catch (error) {
										vm.$store.commit('initialBacktestInfo')
										vm.$refs.setUpChild.clearOldBacktestName()
										vm.$refs.favoriteChild.getFavoriteList()
										vm.loading = false
										vm.$message({
											message: 'The internal server is busy, please try again later ',
											type: 'error',
											offset: 300
										})
										// 初始化backtestInfo的数据
										vm.$store.commit('clearStoreDesciption')
									}	
								}catch(error){
									console.log("Error", error);
									alert('Upload JSON failed')
								}	
							}else{
								alert('Upload CSV failed')
							}						
						})


				
					}
				}
			}
		}, 1000),
		goToHistoryForm() {
			this.activeName = 'second'
		},
		async goTobacktestSetupForm(id) {
			// backtestEditData
			this.loading = true
			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
			let vm = this
			vm.activeName = 'first'
			vm.backtestEditData = {}
			try {
				const res = await seeParams(id)
				let data = res.data

				data.old_uuid = id
				data.entry = JSON.parse(data.entry)
				data.exit = JSON.parse(data.exit)
				delete data.results
				delete data.status
				delete data.backtest_id
				delete data.user_id
				delete data.uuid
				//console.log(data)
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
							if(value.code !== 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999') {
						return signalCode.decode(value.code)	}else{
							vm.$refs.exitChild.setRiskEditData(data)
							data.exit.signals = [{code: ''}]
							return
						}
					    })
						if(data.exit.signals.includes(undefined)) {
							data.exit.signals = [{code: ''}]
							vm.$refs.exitChild.setRiskEditData(data)
						}else {
				        let exitPanel = data.exit.signals.length
						let exitData = {}
						exitData.exit = data.exit
						vm.$refs.exitChild.setEditPanel(exitPanel, exitData)
						}
				}
				let entryPanel = data.entry.signals.length
				let entryData = {}
				entryData.entry = data.entry
				// entryData.entry_description = data.entry_description
				// exitData.exit_description = data.exit_description

				vm.$refs.entryChild.setEditPanel(entryPanel, entryData)
				// 拿到 frequency 的值
				vm.editFrequency = data.frequency
				vm.timeFrame = data.frequency
				vm.$store.commit('getFrequency', vm.editFrequency)
				vm.backtestEditData = data
				this.loading = false
			} catch (error) {
				console.error(error)
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
				this.loading = false
			}
		},
		goBacktestResultForm(row) {
			this.activeName = 'third'
			this.$refs.performanceChild.getResultData(row)
		},
		goToFavoritesForm() {
			this.activeName = 'forth'
			this.$refs.favoriteChild.getFavoriteList()
		},
		refFavoritesForm() {
			this.$refs.favoriteChild.getFavoriteList()
		},
		refHistoryForm() {
			this.$refs.historyChild.getHistoryList()
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
			this.$router.push('/doc')
		},
		isOnlyRiskControl(val) {
			this.isOnlyRisk = val
		},
		loadShortLong() {
			const technicalList = CIQ.technicalCategory
			let formatList = []
			for (let i = 0; i < technicalList.length; i++) {
				if (
					technicalList[i].class === 'No_display_technical_indicator' ||
					technicalList[i].class ===
						'Not_in_backtest_technical_indicator_but_visible_in_chatiq'
				)
					continue
				technicalList[i].studies.forEach((item) => {
					let obj = {}
					obj.class = technicalList[i].class
					obj.value = item.name
					obj.url = item.url
					formatList.push(obj)
				})
			}
			return formatList
		},
	}
}
</script>
<style lang="less" scoped>
main {
	padding: 0 50px;
	background: #f9fafb;
}
.gradient {
	padding-top: 88px;
	background: linear-gradient(180deg, #dde0e4, rgba(249, 250, 251, 0));
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
	z-index: 999;
	border: unset;
	position: fixed;
	left: 75px;
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
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%),
		0 10px 10px -5px rgb(0 0 0 / 4%);
}

.footer {
	background: #fff;
	display: flex;
	padding: 16px 16px 48px 16px;
	border-top: 1px solid #e5e7eb;
	margin-top: 50px;
	justify-content: space-between;
	align-items: center;
}
.footer p {
	text-align: center;
	color: #9ca3af;
	line-height: 21px;
}
ol,
ul {
	margin: 0;
	padding: 0;
	list-style: none;
}
.Footer_social___a7sK {
	display: flex;
}
.Footer_social___a7sK li {
	margin-right: 24px;
}
.Footer_social___a7sK a {
	font-size: 20px;
	color: #9ca3af;
}
.Footer_social___a7sK a:hover {
	font-size: 20px;
	color: #0284c7;
}
a {
	transition: color 0.3s ease-in-out;
	text-decoration: none;
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
.navbar {
	height: 78px;
}
.header_logo {
	padding: 12px 24px;
	display: flex;
	box-shadow: 0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 6%);
	position: fixed;
	z-index: 999;
	top: 0;
	width: 100%;
	background: #fff;
	justify-content: space-between;
	.menu {
		justify-self: center;
		align-self: center;
		margin-right: 50px;
	}
}
.criteria-container {
	padding: 10px;
}
.chart_box {
	padding: 10px 10px;
	resize: auto;
	overflow: hidden;
	margin: 0 25px;
}
.betaNote {
	padding: 22px 50px 10px 50px;
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
	.restartBtn {
		padding: 7px;
		font-size: 12px;
	}
	main {
		padding: 0px;
	}
	.backtest-btns {
		.el-button {
			padding: 7px;
			font-size: 12px;
		}
	}
}
.el-dropdown-link {
	cursor: pointer;
	//color: #409eff;
	font-weight: 500;
	line-height: 24px;
	display: inline-flex;
	align-items: center;
	padding: 0;
	transition: color 0.3s ease-in-out;
	color: #6b7280;
	border: none;
	outline: none;
	background: transparent;
}
.el-dropdown-link:hover {
	color: #111827;
}
.el-icon-arrow-down {
	font-size: 12px;
}
/deep/ .el-input__icon {
	line-height: 27px;
}
</style>
