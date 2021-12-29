<template>
	<div class="home-container" id="content">
		<div class="home-box">
			<header class="header">
				<el-row
					><el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="2"
						><img src="../../assets/logo.png" alt="logo" /></el-col
				></el-row>
				<el-row type="flex" justify="center"
					><el-col><p>SentimentTrader Backtest Engine</p></el-col></el-row
				>
				<div class="chart_box" id="chart_box">
					<chart width="100%" height="100%"></chart>
				</div>
			</header>
			<main class="main" style="padding-bottom: 50px;">
				<div class="mainTagbar">
					<el-tabs  v-model="activeName" type="card">
						<el-tab-pane style="height:90%;overflow-x:hidden;"  label="Backtest Setup" name="first">
							<el-tabs v-model="activeTag" type="card">
								<el-tab-pane style="height:90%;overflow-y:auto;overflow-x:hidden;" label="Backtest Data" name="first-child-n1">
									<backtest-setup-form ref="setupChild"></backtest-setup-form>
								</el-tab-pane>
								<el-tab-pane style="height:90%;overflow-y:auto;overflow-x:hidden;"  label="Entry Criteria" name="first-child-n2">
									<div class="clearBox">
										<h1 class="titleTxt">Entry Criteria</h1>
										<el-button class="clearBtn" round>Clear Form</el-button>
									</div>
									<entry-form 
										ref="entryFormChild"
										:criteria="'entry'"
										:fdLoad="fdLoad"
									></entry-form>
								</el-tab-pane>
								<el-tab-pane style="height:90%;overflow-y:auto;overflow-x:hidden;" label="Exit Criteria" name="first-child-n3">
									<div class="clearBox">
										<h1 class="titleTxt">Exit Criteria</h1>
										<el-button class="clearBtn" round>Clear Form</el-button>
									</div>
									<exit-form style="height:90%;overflow-y:auto;overflow-x:hidden;" ref="exitFormChild" :criteria="'exit'"  :fdLoad="fdLoad"></exit-form>
								</el-tab-pane>
							</el-tabs>
						</el-tab-pane>
						<el-tab-pane style="height:90%;overflow-y:auto;overflow-x:hidden;" label="Backtest Results" name="second">
							<backtest-result-form :backtestResult="backtestResult"  ref="resultChild"></backtest-result-form>
							<backtest-performance
							@setBacktestResult="setBacktestResult"
								ref="performanceChild"
							></backtest-performance>
						</el-tab-pane>
						<el-tab-pane style="height:90%;overflow-y:auto;overflow-x:hidden;" label="Favorites" name="third">
							<favorite-form ref="favoriteChild" @goBacktestResultForm="goBacktestResultForm"></favorite-form>
						</el-tab-pane>
						<el-tab-pane label="Strategies" name="fourth">
							<strategy-form ref="strategyChild"></strategy-form>
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
import{ Store, mapGetters } from "vuex"
import chart from '../chart/index.vue'
import backtestSetupForm from './components/Backtest-Setup-Form.vue'
import backtestResultForm from './components/Backtest-Result-Form.vue'
import favoriteForm from './components/Favorite-Form.vue'
import strategyFrom from './components/Strategy-Form.vue'
import backtestPerformance from './components/Backtest-Performance.vue'
import entryForm from './components/entry-form/Entry-Form.vue'
import exitForm from '@/components/newVersion/components/entry-form/Exit-Form.vue'
export default {
	data() {
		return {
			backtestResult:{},
			activeName: 'first',
			activeTag: 'first-child-n1',
			fdLoad: {}
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
		...mapGetters(["getDialogFdData"]),
		fdDialogData() {
			return this.getDialogFdData
		}
	},
	watch: {
		fdDialogData: {
			handler(newVal) {
				if(newVal.criteria === "entry"){
					delete newVal.criteria
					this.fdLoad = newVal
				}else if(newVal.criteria === "exit"){
					delete newVal.criteria
					this.fdLoad = newVal
				}
			},
			immediate: true,
			deep: true
		}
	},
	// mounted(){
	// 	console.log('mounted')
	// 	var node = document.getElementsByClassName("el-tabs__content")[0]
	// 	node.style.height = "100%"
	// },
	methods: {
		goBacktestResultForm() {
			this.activeName = "second"
			this.$refs.performanceChild.getResultData()
		},
		setBacktestResult(data){

			this.backtestResult = data	
		}
	}
}
</script>
<style lang="less" scoped>

@media only screen and (min-width: 1600px) {
	.clearBox {
		margin-bottom: 20px;
		display: flex;
		.el-button {
			align-self: center;
			margin-left: 20px;
			color: #d9001b;
		}
	}
	.titleTxt {
		font-weight: bold;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.clearBox {
		margin-bottom: 20px;
		display: flex;
		.el-button {
			align-self: center;
			margin-left: 20px;
			color: #d9001b;
		}
	}
	.titleTxt {
		font-weight: bold;
		font-size: 16px;
	}
}

@media (min-width: 768px) and(max-width:992px) {
	// sm size
	.header {
		p:first-of-type {
			font-size: 2.5rem !important;
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