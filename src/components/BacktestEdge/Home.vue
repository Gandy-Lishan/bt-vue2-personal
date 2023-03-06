// Home
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
					<el-menu :default-active="activeIndex" class="el-menu-demo menu" mode="horizontal" @select="handleSelect">
						<el-submenu index="1">
							<template slot="title">Help</template>
							<el-menu-item index="1-1">Tutorial</el-menu-item>
							<!-- <el-menu-item index="1-2">Contant Us</el-menu-item> -->
						</el-submenu>
						<el-submenu index="2">
							<template slot="title"><i class="el-icon-s-tools"></i></template>
							<!-- <el-menu-item index="2-1">Theme</el-menu-item> -->
							<!-- <el-menu-item index="2-2">Language</el-menu-item> -->
						</el-submenu>
					</el-menu>
					<!-- <div class="menu">
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
					</div> -->
				</div>
			</div>
			<header class="header">
				<el-row type="flex" justify="center"
					><el-col>
						<p class="betaNote">BacktestEdge Beta</p>
						<p class="hint">Hint: Move cursor out of chart area to scroll down the page below</p>
					</el-col>
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
						content="Clear current chart & Backtest Setup Form and create a new backtest."
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
						<keep-alive>
							<set-up
								ref="setUpChild"
								:backtestEditData="backtestEditData"
								@IsRiskControl="IsRiskControl"
								@setDirection="setDirection"
							></set-up></keep-alive>
							<div class="criteria-container">
								<div class="criteria-box">
									<entry
										ref="entryChild"
										:direction="direction"
										@getEntryRelation="getEntryRelation"
										@sendEntrySignalIndex="sendEntrySignalIndex"
									></entry>
									<exit
										ref="exitChild"
										:direction="direction"
										@isOnlyRiskControl="isOnlyRiskControl"
										@getExitRelation="getExitRelation"
										@sendExitSignalIndex="sendExitSignalIndex"
									></exit>
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
								<el-checkbox style="margin-left:10px" v-model="test" label="download test csv" border></el-checkbox>
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
import { runBacktest, seeParams, getBacktestName,uploadS3 } from '@/service/service'
import searchKeys from '@/tools/searchKeys.js'
import UUID from '@/tools/uuid.js'
export default {
	name: 'home',
	data() {
		return {
			activeIndex: '1',
        	activeIndex2: '1',
			test: false,
			btnClickBool: true,
			scroll: '',
			tabPosition: 'top',
			activeName: 'first',
			clientHeight: document.body.clientWidth,
			loading: false,
			backtestEditData: {},
			editFrequency: 'Daily',
			historyFlag: true,
			favoriteFlag: true,
			entryLength: 1,
			exitLength: 1,
			direction: 'Long',
			isOnlyRisk: false,
			exitRelation: 1,
			entryRelation: 1
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
	async mounted() {

		let toTop = document.getElementsByClassName('toTop')[0]
		toTop.style.visibility = 'hidden'
		// When DOM renders data, set the height of the lower area to the height of the browser's visible area
		// Listen for the resize event of the window. Set the height of the lower area when the browser window changes
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

	const searchParams = new URLSearchParams(window.location.search);
  const backtestID = searchParams.get('backtestID');
	console.log('backtestID', backtestID)
	if(!backtestID) return
	const vm = this
	try {
				CIQ.addCover('Fetching backtest information...')
				CIQ.nprogress.start()
				const res = await seeParams(backtestID)
				res.data.entry_description = JSON.parse(res.data.entry_description)
				res.data.exit_description = JSON.parse(res.data.exit_description)
				res.data.result = JSON.parse(res.data.result)
				console.log('backtest res',res)
				document.getElementsByClassName('ciq-period')[0].style.display = ''
				//  Restore indicator layout
				this.$store.commit('getBacktestSymbol', res.data.symbol)
				CIQ.hideMarker()
				CIQ.isMarkerShown = false
				if (res.data.indicator_layout) {
					this.$refs.historyChild.restoreIndicatorLayoutEdit(
						JSON.parse(res.data.indicator_layout),
						res.data.frequency,
						res.data, res.data
					)
				} else {
					this.$store.commit('getRunBacktestData', res.data)
					this.goBacktestResultForm(res.data,() => {
						this.$emit('goTobacktestSetupForm', backtestID, res.data,() => {
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
				})
				}
			} catch (error) {
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
			}
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
		},
		test: {
			handler(val) {
				CIQ.downloadCSV = val 
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		handleSelect(key, keyPath) {
			let routeUrl = this.$router.resolve({
                path: '/doc',
            });
          	window.open(routeUrl.href, '_blank');
		},
		animationUp: function () {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			})
		},
		myBrowser: function () {
			//Get the useragent string of the browser
			var userAgent = navigator.userAgent
			var isOpera = userAgent.indexOf('Opera') > -1
			//Determine whether opera browser
			if (
				userAgent.indexOf('Chrome') > -1 &&
				userAgent.indexOf('Safari') > -1
			) {
			} else {
				alert('The best display is accessed using the chrome browser')
			}
		},
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
			this.$refs.exitChild.addRiskControlOption(val)
		},
		setDirection(val) {
			this.direction = val
		},
		refreshPage() {
			if (!CIQ.Studies) return;
			var stx = CIQ.stxx
			for (var id in stx.layout.studies) {
				var sd = stx.layout.studies[id];
				if (!sd.customLegend && !sd.permanent) CIQ.Studies.removeStudy(stx, sd);
			}
			stx.draw();
			var chartBox = document.getElementsByClassName("chart_box")[0]
			var height = 75/100*window.innerHeight
			chartBox.style.height = height+ 'px'
			const freq = CIQ.store.state.exitFrequency

			// remove all Studies from Vuex
			CIQ.store.commit('getEntryIndicatorsList',[])
			CIQ.store.commit('getExitIndicatorsList',[])
			CIQ.store.commit('getMA',[])
			CIQ.store.commit('getExtraIndicators',[])
			CIQ.store.commit('getTechnicalIndicators',[])

			CIQ.store.commit('getBacktestSymbol','SPY')
			CIQ.store.commit('getFrequency', 'Daily')

			// remove markers, prompt, recover timeframe dropdown
			CIQ.removePrompt()
			CIQ.hideMarker()
			CIQ.isMarkerShown = false
			document.getElementsByClassName("ciq-period")[0].style.display = "block"

			if(freq != 'Daily'){
				CIQ.addIndicators()
			}

			this.clearForm()

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
		},
		runBacktest: throttle(async function () {
			try {
				let setUp = this.$refs.setUpChild.saveBacktestData()
		  let setUpChecked = true
		  let entryChecked = true
		  let isEdit = this.$refs.setUpChild.isEdit()
			this.$refs.entryChild.addEntrySignalLength()
			this.$refs.exitChild.addExitSignalLength()
			let setUpRes = await getBacktestName(this.$store.state.backtestInfo.name)
			if(setUpRes.data.count != 0 && !isEdit) {
				this.$message({
						message: 'The backtest name already exists',
						type: 'error',
						offset: 300
					})
				setUpChecked = false
				this.$store.commit('clearBacktest')
				return
				}
			if(setUpRes.data.count == 0 || isEdit) {
				
				let entry
				for (let index = 0; index < this.entryLength; index++) {
					this.addEntrySignalLength(index)
					entry = this.$refs.entryChild.saveBacktestData(index)
				    entryChecked = await entry
					if(!entryChecked){
						return
					}
					this.$refs.entryChild.saveScoreValue()
					this.$refs.entryChild.saveSignalsInMarket()
					this.$refs.entryChild.saveDelayBar()
					this.$refs.entryChild.saveRelation()
				}
				if (entryChecked && setUpChecked) {
					let exit
					let exitChecked
					for (let index = 0; index < this.exitLength; index++) {
						exit = this.$refs.exitChild.saveBacktestData(index)
						exitChecked = await exit
						if(!exitChecked){
						return
					}
						this.$refs.exitChild.saveScoreValue()
						this.$refs.exitChild.saveSignalsInMarket()
						this.$refs.exitChild.saveDelayBar()
						this.$refs.exitChild.saveRelation()
					}
					if (exitChecked) {
						CIQ.addCover("Start running Backtest...")
						CIQ.nprogress.start()
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
						if(vm.entryRelation == 3){
							sameEntryIndexArr = []
						}
						if (sameEntryIndexArr.length >= 1) {
							for (let j = 0; j < sameEntryIndexArr.length; j++) {
								let sameItem = []
								let str = ''
								sameItem = sameEntryIndexArr[j].split(',')
								for (let n = 0; n < sameItem.length; n++) {
									str += 'Signal' + Number(sameItem[n]) + ' '
								}
								vm.$message({
									message:
										'The current entry ' + str + ' are the same, please change',
									type: 'error',
									offset: 300
								})
								CIQ.hideCover()
								CIQ.nprogress.done()
								return
							}
						}
						let exit_description = JSON.parse(
							JSON.stringify(vm.$store.state.backtestInfo.exit_description)
						)

						let sameExitIndexArr = searchKeys(exit_description)
						if(vm.exitRelation == 3){
							sameExitIndexArr = []
						}
						if (sameExitIndexArr.length >= 1) {
							for (let j = 0; j < sameExitIndexArr.length; j++) {
								let sameItem = []
								let str = ''
								sameItem = sameExitIndexArr[j].split(',')
								for (let n = 0; n < sameItem.length; n++) {
									str += 'Signal' + Number(sameItem[n]) + ' '
								}
								vm.$message({
									message:
										'The current exit ' + str + ' are the same, please change',
									type: 'error',
									offset: 300
								})
								CIQ.hideCover()
								CIQ.nprogress.done()
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
								delete item.riskIndicator
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
						//uploade indicator layout

						var indicatorLayout = {}
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
								output = CIQ.stxx.layout.studies[i].outputs
							}
							savedTechSD.push({
								type: CIQ.stxx.layout.studies[i].type,
								inputs: CIQ.stxx.layout.studies[i].inputs,
								outputs: output,
								parameters: CIQ.stxx.layout.studies[i].parameters,
								panel: CIQ.stxx.layout.studies[i].panel
							})
						}

						indicatorLayout.savedTechSD = savedTechSD
						indicatorLayout.activatedMA = this.$store.state.activatedMA

						backtestData.indicator_layout = JSON.stringify(indicatorLayout)

						
						let copyBacktestData = JSON.parse(JSON.stringify(backtestData))
						let str = UUID(JSON.stringify(copyBacktestData))

						backtestData.pk = str
					
						// Restore a numeric string in an object to a number
						backtestData.capital_alloc = parseFloat(backtestData.capital_alloc)
						backtestData.slippage = parseFloat(backtestData.slippage)
						backtestData.win_rate = parseFloat(backtestData.win_rate)

						CIQ.spanPeriod = {
							start_date: backtestData.start_date.replace(/-/g,'') * 1000000000,
							end_date: backtestData.end_date.replace(/-/g,'') * 1000000000
						}
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
						backtestParams = JSON.stringify(backtestParams)
						/* ********** */
						

						let backtestDataStr = this.$qs.stringify(backtestData)
						// Before the back test, load the data of the whole period and generate CSV to upload S3, and then update the form when the results come out
						this.reloadData(indicatorLayout,backtestData.frequency)
						// 1. Upload data file
						// 2. Upload parameter file
						// 3. Judge the file upload status. If an error is reported, run back test will not be performed
						
						// TODO 
						// long
						let attemptTime = 0

						let callback = async function () {
							if(arguments[0]==200){
								// He upload JSON
								try{
									var S3DataStr = vm.$qs.stringify({file_name:str + '/' + str + '_backtest_params.json',file_data:backtestParams})
                					var data = await uploadS3(S3DataStr)

									try {
										let res = await runBacktest(backtestDataStr)
										if (res.status === 201) {
											CIQ.isBacktestRun = true
											//After saving successfully, clear the backtestinfo back to the original state
											vm.$store.commit('initialBacktestInfo')

										

											vm.goToHistoryForm()
											vm.$refs.historyChild.refreshHistory(res.data.id)
											CIQ.hideMarker()
											CIQ.isMarkerShown = false 
											let backtestInfo = JSON.parse(
												JSON.stringify(vm.$store.state.backtestInfo)
											)
											//clear old_ uuid
											if (backtestInfo.old_uuid) {
												vm.$store.commit('clearBacktestUuid')
											}
											// clear oldBacktestName
											vm.backtestEditData = {}
											vm.$refs.setUpChild.clearOldBacktestName()
											vm.$refs.favoriteChild.getFavoriteList()
										} else {
											vm.$message.error('Save failed')
											CIQ.hideCover()
											CIQ.nprogress.done()
											CIQ.hideMarker()
											CIQ.isMarkerShown = false
										}
									} catch (error) {
										vm.$store.commit('initialBacktestInfo')
										vm.$refs.setUpChild.clearOldBacktestName()
										vm.$refs.favoriteChild.getFavoriteList()
										CIQ.hideCover()
										CIQ.nprogress.done()
										vm.$message({
											message: 'The internal server is busy, please try again later ',
											type: 'error',
											offset: 300
										})
										// Initialize the data of backtestinfo
										vm.$store.commit('clearStoreDesciption')
									}	
								}catch(error){
									// If uploading JSON fails, try again. Because it is not an Axios request, the retry logic should be written by yourself
									console.log("Upload JSON failed", error);
									if(attemptTime<4){
										CIQ.outputSignalsResult(str,callback)
										attemptTime++
										console.log("retry the upload request...");
									}else{
										CIQ.hideCover()
										CIQ.nprogress.done()
										//vm.loading = false
										alert('Upload JSON failed')	
									}
								}	
							}else{
								console.log("Upload CSV failed");
								// If the upload of CSV fails, the customization returns 500. Try again. Because it is not an Axios request, the retry logic should be written by yourself
								if(attemptTime<5){
									CIQ.outputSignalsResult(str,callback)
									attemptTime++
									console.log("retry the upload request...");
								}else{
									CIQ.hideCover()
									alert('Upload CSV failed')		
								}					
							}						
						}
						CIQ.outputSignalsResult(str,callback)
					}
				}
			}
			} catch (error) {
										this.$notify({
							title: 'Failed',
							message: 'The internal server is busy, please try again later',
							type: 'error',
							offset: 100
						})
			}
		}, 1000),
		goToHistoryForm() {
			this.activeName = 'second'
		},
		async goTobacktestSetupForm(id, resData, callback) {
			CIQ.nprogress.inc()
			CIQ.setCoverText('Restoring Backtest form...')
			
			this.$refs.setUpChild.clearForm()
			this.$refs.entryChild.clearForm()
			this.$refs.exitChild.clearForm()
			let vm = this
			vm.activeName = 'first'
			vm.backtestEditData = {}
			try {
				let data = resData

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
				data.entry.signals.forEach((item,index) => {
					if(!item.code) {
						data.entry.signals.splice(index,1)
					}
				})
					data.entry.signals = data.entry.signals.map((value) => {
						return signalCode.decode(value.code)
					})
				}
				if (data.exit.signals instanceof Array) {
					// Delete items with code false
						data.exit.signals.forEach((item,index) => {
							if(!item.code) {
								data.exit.signals.splice(index,1)
							}
						})
						data.exit.signals = data.exit.signals.map((value) => {
							if(value.code !== 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999') {
						return signalCode.decode(value.code)	}else{
							vm.$nextTick(() => {
							vm.$refs.exitChild.setRiskEditData(data)
							})
							data.exit.signals = [{code: ''}]
							return
						}
					    })
						if(data.exit.signals.includes(undefined)) {
							data.exit.signals = [{code: ''}]
							vm.$nextTick(() => {
							vm.$refs.exitChild.setRiskEditData(data)
							})
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

				vm.$refs.entryChild.setEditPanel(entryPanel, entryData)
				// Get the value of frequency
				vm.editFrequency = data.frequency
				vm.timeFrame = data.frequency
				vm.$store.commit('getFrequency', vm.editFrequency)
				vm.backtestEditData = data
				vm.$refs.setUpChild.setEditData(data)
			} catch (error) {
				console.error(error)
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
				CIQ.hideCover()
				CIQ.nprogress.done()
			}
			setTimeout(()=>{
				if(callback){callback()}
			},1000)
		},
		goBacktestResultForm(row, callback) {

			try {
			this.activeName = 'third'
			CIQ.nprogress.inc()
			CIQ.setCoverText('Generating Backtest report, please wait...')
			
			this.$refs.performanceChild.getResultData(row,() => {
				if(callback){callback()}
			})
			} catch (error) {
				console.error(error)
				
			}
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
		// Unable to get performance data, server exception
		errorCatchPerformance() {
			this.$notify({
				title: 'Try Another',
				message: 'The backtest cannot request data, please change parameter',
				offset: 100,
				type: 'warning'
			})
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
		getExitRelation(val) {
			this.exitRelation = val
		},
		getEntryRelation(val) {
			this.entryRelation = val
		}
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

.hint{
	position: absolute;
	font-size: 0.8rem;
	color: black !important;
	bottom:-20px;
	right:30px;
	font-weight: 300;
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
	display: flex;
	box-shadow: 0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 6%);
	position: fixed;
	z-index: 999;
	top: 0;
	width: 100%;
	background: #fff;
	align-items: center;
	justify-content: space-between;
	.menu {
		justify-self: center;
		align-self: center;
		margin-right: 7px;
	}
}
.header_logo>span{
	padding: 12px 24px;
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
