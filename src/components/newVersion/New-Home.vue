<template>
	<div class="home-container" id="content">
		<div class="home-box">
			<header class="header">
				<el-row
					><el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="2"
						><img src="../../assets/logo.png" alt="logo" /></el-col
				></el-row>

				<el-row type="flex" justify="center"
					><el-col><p>SentimentTrader Backtest Engine</p></el-col>
					<div class="refresh" @click="refreshPage" title="Reset backtest">
						<svg
							t="1642066388852"
							class="icon"
							viewBox="0 0 1024 1024"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							p-id="2121"
							width="90"
							height="90"
						>
							<path
								d="M849.2 637.1c-12.7-5.8-27.7-0.1-33.5 12.6-54 118.9-173.2 195.7-303.7 195.7-160.5 0-294.8-114-326.4-265.3l56.1 56.1c4.9 4.9 11.4 7.4 17.9 7.4 6.5 0 13-2.5 17.9-7.4 9.9-9.9 9.9-25.9 0-35.8L171.2 494.1c-1.2-1.2-2.5-2.2-3.9-3.2-0.6-0.4-1.3-0.7-1.9-1.1-0.8-0.4-1.6-0.9-2.4-1.3-0.8-0.3-1.7-0.5-2.5-0.8-0.7-0.2-1.4-0.5-2.2-0.7-1.6-0.3-3.1-0.5-4.7-0.5h-0.2-0.2c-1.6 0-3.2 0.2-4.7 0.5-0.8 0.2-1.5 0.4-2.2 0.7-0.8 0.2-1.7 0.4-2.5 0.8-0.9 0.4-1.6 0.8-2.4 1.3-0.6 0.4-1.3 0.6-1.9 1.1-2.8 1.9-5.2 4.2-7 7-0.4 0.6-0.7 1.3-1 1.9-0.4 0.8-0.9 1.6-1.3 2.4-0.3 0.8-0.5 1.7-0.8 2.6-0.2 0.7-0.5 1.4-0.6 2.2-0.3 1.6-0.5 3.3-0.5 5 0 211.7 172.3 384 384 384 150.3 0 287.6-88.5 349.8-225.4 5.5-12.7-0.1-27.7-12.9-33.5zM880.4 535.4c0.8-0.4 1.6-0.8 2.4-1.3 0.6-0.4 1.3-0.6 1.9-1.1 2.8-1.9 5.2-4.2 7-7 0.4-0.6 0.7-1.3 1-1.9 0.4-0.8 0.9-1.6 1.3-2.4 0.3-0.8 0.5-1.7 0.8-2.6 0.2-0.7 0.5-1.4 0.6-2.2 0.3-1.6 0.5-3.3 0.5-5 0-211.7-172.3-384-384-384-152.1 0-290.1 89.9-351.5 229.1-5.6 12.8 0.1 27.7 12.9 33.4 12.8 5.7 27.7-0.2 33.4-12.9C260.1 256.7 379.9 178.6 512 178.6c160.5 0 294.8 114 326.4 265.3l-56.1-56.1c-9.9-9.9-25.9-9.9-35.8 0-9.9 9.9-9.9 25.9 0 35.8L852.9 530c1.2 1.2 2.5 2.2 3.9 3.2 0.6 0.4 1.3 0.7 1.9 1.1 0.8 0.4 1.6 0.9 2.4 1.3 0.8 0.3 1.7 0.5 2.5 0.8 0.7 0.2 1.4 0.5 2.2 0.6 1.6 0.3 3.3 0.5 5 0.5 1.7 0 3.3-0.2 5-0.5 0.8-0.1 1.5-0.4 2.2-0.6 0.7-0.5 1.5-0.7 2.4-1z"
								p-id="2122"
								fill="#2372a0"
							></path>
						</svg>
					</div>
				</el-row>
				<div class="chart_box" id="chart_box">
					<chart width="100%" height="100%"></chart>
				</div>
			</header>
			<main class="main" style="padding-bottom: 50px">
				<div class="mainTagbar">
					<el-tabs v-model="activeName" type="card" :tab-position="tabPosition">
						<el-tab-pane
							style="height: 90%; overflow-x: hidden"
							label="Backtest Setup"
							name="first"
						>
							<el-tabs v-model="activeTag" type="card">
								<el-tab-pane
									style="height: 1100px; overflow-y: auto; overflow-x: hidden"
									label="Backtest Data"
									name="first-child-n1"
								>
									<el-row>
										<div class="iconNextBox1">
											<i
												class="iconfont icon-xiayibu"
												@click="validateSetUpForm"
											></i>
										</div>
									</el-row>
									<backtest-setup-form
										ref="setupChild"
										:backtestEditData="backtestEditData"
										@goToEntryForm="goToEntryForm"
									></backtest-setup-form>
								</el-tab-pane>
								<el-tab-pane
									style="height: 90%; overflow-y: auto; overflow-x: hidden"
									label="Entry Criteria"
									name="first-child-n2"
								>
									<div class="clearEntryBox">
										<div class="clearEntryItem">
											<h1 class="titleTxt">Entry Criteria</h1>
											<el-button class="clearBtn" round @click="clearForm"
												>Clear Form</el-button
											>
										</div>
										<div class="iconNextBox2">
											<i
												class="iconfont icon-xiayibu"
												@click="validateEntryForm"
											></i>
										</div>
									</div>
									<entry-form
										ref="entryFormChild"
										:criteria="'entry'"
										:fdLoad="fdLoad"
									></entry-form>
								</el-tab-pane>
								<el-tab-pane
									style="height: 90%; overflow-y: auto; overflow-x: hidden"
									label="Exit Criteria"
									name="first-child-n3"
								>
									<div class="clearEntryBox">
										<div class="clearEntryItem">
											<h1 class="titleTxt">Exit Criteria</h1>
											<el-button class="clearBtn" round @click="clearForm"
												>Clear Form</el-button
											>
										</div>
										<div class="iconNextBox2">
											<el-button round @click="saveBacktest"
												>Save Backtest</el-button
											>
										</div>
									</div>
									<exit-form
										style="height: 90%; overflow-y: auto; overflow-x: hidden"
										ref="exitFormChild"
										@showBacktestBtn="showBacktestBtn"
										:criteria="'exit'"
										:fdLoad="fdLoad"
										@goToFavorite="goToFavorite"
									></exit-form>
								</el-tab-pane>
							</el-tabs>
						</el-tab-pane>
						<el-tab-pane
							style="height: 90%; overflow-y: auto; overflow-x: hidden"
							label="Backtest Results"
							name="second"
						>
							<backtest-result-form
								:backtestResult="backtestResult"
								ref="resultChild"
							></backtest-result-form>
							<backtest-performance
								@setBacktestResult="setBacktestResult"
								ref="performanceChild"
							></backtest-performance>
						</el-tab-pane>
						<el-tab-pane
							style="height: 90%; overflow-y: auto; overflow-x: hidden"
							label="Favorites"
							name="third"
						>
							<favorite-form
								ref="favoriteChild"
								@goBacktestResultForm="goBacktestResultForm"
								@goTobacktestSetupForm="goTobacktestSetupForm"
							></favorite-form>
						</el-tab-pane>
						<el-tab-pane label="Strategies" name="fourth">
							<strategy-form
								ref="strategyChild"
								@goToFavoriteForm="goToFavoriteForm"
								@goTobacktestSetupForm="goTobacktestSetupForm"
								@goBacktestResultForm="goBacktestResultForm"
							></strategy-form>
						</el-tab-pane>
					</el-tabs>
				</div>
			</main>
		</div>
		<div class="try"></div>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
import SignalCode from '@/tools/codeTool.js'
import chart from '../chart/index.vue'
import backtestSetupForm from './components/Backtest-Setup-Form.vue'
import backtestResultForm from './components/Backtest-Result-Form.vue'
import favoriteForm from './components/Favorite-Form.vue'
import strategyFrom from './components/Strategy-Form.vue'
import backtestPerformance from './components/Backtest-Performance.vue'
import entryForm from './components/entry-form/Entry-Form.vue'
import exitForm from '@/components/newVersion/components/entry-form/Exit-Form.vue'
import deepClone1 from '@/tools/deepClone.js'
const _ = require('lodash')
const throttle = _.throttle
export default {
	data() {
		return {
			backtestResult: {},
			activeName: 'first',
			activeTag: 'first-child-n1',
			fdLoad: {},
			backtestEditData: {},
			pubilcEditData: { entry: { singals: [] }, exit: { singals: [] } },
			backtestBtnVisabled: true,
			check: false,
			tabPosition: 'top',
			clientHeight: document.body.clientHeight
		}
	},
	provide() {
		return {
			editBacktestData: () => this.pubilcEditData
		}
	},
	mounted() {
		this.$cookies.set('userid', 'test')
		// 在DOM渲染数据时，设置下区域高度为浏览器可视区域高度．
		this.clientHeight = document.body.clientHeight
		// 监听window的resize事件．在浏览器窗口变化时再设置下区域高度．
		const _this = this
		window.onresize = function temp() {
			window.screenWidth = document.body.clientWidth
			_this.clientHeight = window.screenWidth
			console.log(_this.clientHeight)
			if (_this.clientHeight < 768) {
				_this.tabPosition = 'left'
			} else {
				_this.tabPosition = 'top'
			}
		}
	},
	components: {
		chart: chart,
		'backtest-setup-form': backtestSetupForm,
		'backtest-result-form': backtestResultForm,
		'backtest-performance': backtestPerformance,
		'favorite-form': favoriteForm,
		'strategy-form': strategyFrom,
		'entry-form': entryForm,
		'exit-form': exitForm
	},
	computed: {
		...mapGetters(['getDialogFdData']),
		fdDialogData() {
			return this.getDialogFdData
		}
	},
	watch: {
		fdDialogData: {
			handler(newVal) {
				if (newVal.criteria === 'entry') {
					delete newVal.criteria
					this.fdLoad = newVal
				} else if (newVal.criteria === 'exit') {
					delete newVal.criteria
					this.fdLoad = newVal
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		goBacktestResultForm(row) {
			this.backtestResultData = row
			this.activeName = 'second'
			this.$refs.performanceChild.getResultData()
		},
		goToFavorite() {
			this.activeName = 'third'
			this.$refs.favoriteChild.getBacktestList()
		},
		setBacktestResult(data) {
			this.backtestResult = data
		},
		// async uploadIndicatorLayout(){
		// 	var indicatorLayout = {}
		// 	indicatorLayout.formIndicators = {
		// 		entry: this.$store.state.indicators.formIndicators.entry,
		// 		exit: this.$store.state.indicators.formIndicators.exit
		// 	}
		// 	indicatorLayout.technicalIndicators = this.$store.state.indicators.technicalIndicators
		// 	indicatorLayout.activatedMA = this.$store.state.activatedMA

		// 	try{
		// 		var res = await axios.put("/dev/layouts/",this.$qs.stringify.stringify(indicatorLayout),{withCredentials: true})
		// 	}catch(err){console.error("layouts",err);}
		// },
		saveBacktest() {
			let vm = this

			const backtestData = deepClone1(this.$store.state.backtestInfo)
			// vm.validateForm(backtestData)
			// if(!this.check){
			const signalEntryList = deepClone1(backtestData.entry.signals)
			const signalExitList = deepClone1(backtestData.exit.signals)

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

			console.log('backtestData: ', backtestData)

			this.$http
				.post('/dev/backtest/', this.$qs.stringify(backtestData), {
					withCredentials: true
				})
				.then((res) => {
					if (res.status === 201) {
						vm.$message.success('Save successfully')
						vm.goToFavorite()
						vm.$refs.favoriteChild.getBacktestList('system')
						vm.$store.commit('clearBacktest')
						vm.$store.commit('tryClear')
						vm.$store.commit('getExitDirection', '')
						vm.$store.commit('getFrequency', '')
						vm.backtestBtnVisabled = true
					} else {
						vm.$message.error('Save failed')
					}
				})
			// }
		},
		validateForm(data) {
			const bdData = data
			const entryData = data.entry
			const exitData = data.exit
			const entryList = data.entry.signals
			const exitList = data.exit.signals
			delete bdData.entry
			delete bdData.exit
			delete entryData.signals
			delete exitData.signals
			let bdCheck = false
			let entryCheck = false
			let exitCheck = false
			let entryListCheck = false
			let exitListCheck = false
			for (let key in bdData) {
				if (!bdData[key]) {
					if (key != 'win_rate') {
						bdCheck = true
						break
					}
				}
			}
			for (let key in entryData) {
				if (!entryData[key]) {
					entryCheck = true
					break
				}
			}
			for (let key in exitData) {
				if (!exitData[key]) {
					exitCheck = true
					break
				}
			}
			entryList.forEach((item) => {
				if (item.sentimentIndicator) {
					delete item.technicalIndicator
				} else if (item.technicalIndicator) {
					delete item.sentimentIndicator
				}
				for (let key in item) {
					if (item[key] === '') {
						entryListCheck = true
					}
				}
			})
			exitList.forEach((item) => {
				if (item.sentimentIndicator) {
					delete item.technicalIndicator
				} else if (item.technicalIndicator) {
					delete item.sentimentIndicator
				}
				for (let key in item) {
					if (item[key] === '') {
						exitListCheck = true
					}
				}
			})
			this.check =
				bdCheck || entryCheck || exitCheck || entryListCheck || exitListCheck
			if (this.check) {
				if (bdCheck) {
					this.$message.error('请将填全创建表单的字段')
					this.activeTag = 'first-child-n1'
					return
				}
				if (entryCheck || entryListCheck) {
					this.$message.error('请将填全进场表单的字段')
					this.activeTag = 'first-child-n2'
					return
				}
				if (exitCheck || exitListCheck) {
					this.$message.error('请将填全退场表单的字段')
					this.activeTag = 'first-child-n3'
					return
				}
			}
		},
		goTobacktestSetupForm(id) {
			// backtestEditData
			this.activeTag = 'first-child-n1'
			this.backtestEditData = {}
			this.$http.get('/dev/seeparams/' + id + '/').then((res) => {
				let data = res.data
				data.old_uuid = id
				data.entry = JSON.parse(data.entry)
				data.exit = JSON.parse(data.exit)
				delete data.results
				delete data.status
				delete data.backtest_id
				delete data.user_id
				delete data.uuid
				this.pubilcEditData = Object.assign(this.pubilcEditData, data)
				this.backtestBtnVisabled = false
				this.backtestEditData = data
			})
			this.activeName = 'first'
		},
		showBacktestBtn() {
			this.backtestBtnVisabled = !this.backtestBtnVisabled
		},
		clearForm() {
			this.$store.commit('tryClear')
			this.backtestBtnVisabled = true
		},

		refreshPage() {
			location.reload()
		},
		goToEntryForm() {
			this.activeTag = 'first-child-n2'
		},
		validateEntryForm() {
			// this.$refs.entryFormChild.validateEntryForm()
			this.activeTag = 'first-child-n3'
		},
		validateSetUpForm() {
			this.activeTag = 'first-child-n2'
			// 	let data = this.bd
			// 	let check = false
			// 	for(let key in data) {
			// 		if(!data[key]) {
			// 			if(key != 'win_rate'){
			// 			check = true
			// 			break}
			// 		}
			// 	}
			// 	if(check) {
			// 		 this.$notify({
			//   title: 'Field missing',
			//   message: 'Please fill out the form completely',
			//   offset: 100,
			//   type: 'warning'
			// });
			// 	}else {
			// 		this.$emit('goToEntryForm')
			// 	}
		},
		goToFavoriteForm() {
			this.activeName = 'third'
			this.$refs.favoriteChild.getBacktestList()
		}
	}
}
</script>
<style lang="less" scoped>
.active {
	display: none !important;
}
.iconNextBox1 {
	display: flex;
	align-content: center;
	justify-content: flex-end;
	margin-right: 100px;
	margin-bottom: 10px;
}
@media only screen and (min-width: 1600px) {
	.home_container {
		height: 100%;
		width: 100%;
		font-size: 16px;
		.home_box {
			height: 100%;
			// width: 90rem;
			margin: 0px 30rem;
		}
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
			text-align: center;
			font-size: 3rem;
			margin: 50px 0 50px 0;
			font-weight: lighter;
			color: #333333;
		}

		.chart_box {
			width: 100%;
			height: 65vh;
		}
		margin-bottom: 80px;
	}
	.clearEntryBox {
		display: flex;
		justify-content: space-between;
		.clearEntryItem {
			display: flex;
			margin-bottom: 20px;
			justify-content: flex-start;
			.el-button {
				align-self: center;
				margin-left: 20px;
				color: #d9001b;
			}
		}
		.iconNextBox2 {
			align-self: center;
			justify-content: flex-end;
		}
	}
	.titleTxt {
		font-weight: bold;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.clearEntryBox {
		display: flex;
		justify-content: space-between;
		.clearEntryItem {
			display: flex;
			margin-bottom: 20px;
			justify-content: flex-start;
			.el-button {
				align-self: center;
				margin-left: 20px;
				color: #d9001b;
			}
		}
		.iconNextBox2 {
			align-self: center;
			justify-content: flex-end;
			.el-button {
				color: #409eff;
			}
		}
	}
	.titleTxt {
		font-weight: bold;
		font-size: 16px;
	}
}

@media (min-width: 768px) and(max-width:899px) {
	// sm size
	.header {
		p:first-of-type {
			font-size: 2.5rem !important;
		}
	}
	/deep/.el-tabs__content {
		width: 90%;
		margin: 0 auto !important;
		overflow: hidden;
		position: relative;
	}
	.titleTxt {
		font-weight: bold;
		display: inline-block;
	}
	.clearEntryBox {
		display: flex;
		justify-content: space-between;
		.clearEntryItem {
			display: flex;
			margin-bottom: 20px;
			justify-content: flex-start;
			.el-button {
				align-self: center;
				margin-left: 20px;
				color: #d9001b;
			}
		}
		.iconNextBox2 {
			align-self: center;
			justify-content: flex-end;
			.el-button {
				color: #409eff;
			}
		}
	}
}
@media (max-width: 767px) {
	// xs size
	.header {
		p:first-of-type {
			font-size: 1.5rem !important;
		}
	}
}

.refresh {
	position: absolute;
	width: 90px;
	right: 0;
	height: 90px;
	cursor: pointer;
}
.refresh:hover {
	opacity: 0.6;
}
.refresh:active {
	top: 1px;
}

.home_container {
	height: 100%;
	width: 100%;
	font-size: 16px;
	.home_box {
		height: 100%;
		// width: 90rem;
		margin: 0px 30rem;
	}
}

p {
	font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
		'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
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
		text-align: center;
		font-size: 3rem;
		margin: 50px 0 50px 0;
		font-weight: lighter;
		color: #333333;
	}

	.chart_box {
		width: 100%;
		height: 65vh;
	}
	margin-bottom: 80px;
}
</style>