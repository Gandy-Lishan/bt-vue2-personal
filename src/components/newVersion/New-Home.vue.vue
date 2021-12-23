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
				<!-- <div class="chart_box" id="chart_box">
					<chart width="100%" height="100%"></chart>
				</div> -->
			</header>
			<main class="main">
				<div class="mainTagbar">
					<el-tabs v-model="activeName" type="card">
						<el-tab-pane label="Backtest Setup" name="first">
							<el-tabs v-model="activeTag" type="card">
								<el-tab-pane label="Backtest Data" name="first-child-n1">
									<backtest-setup-form ref="setupChild"></backtest-setup-form>
								</el-tab-pane>
								<el-tab-pane label="Entry Criteria" name="first-child-n2">
									<div class="clearBox">
										<h1 class="titleTxt">Entry Criteria</h1>
										<el-button class="clearBtn" round>Clear Form</el-button>
									</div>
									<entry-form ref="entryFormChild" :criteria="'entry'"></entry-form>
								</el-tab-pane>
								<el-tab-pane label="Exit Criteria" name="first-child-n3">
									<div class="clearBox">
										<h1 class="titleTxt">Exit Criteria</h1>
										<el-button class="clearBtn" round>Clear Form</el-button>
									</div>
									<exit-form ref="exitFormChild" :criteria="'exit'"></exit-form>
								</el-tab-pane>
							</el-tabs>
						</el-tab-pane>
						<el-tab-pane label="Backtest Results" name="second">
							<backtest-result-form
								ref="resultChild"
							></backtest-result-form>
							<backtest-performance
								ref="performanceChild"
							></backtest-performance>
						</el-tab-pane>
						<el-tab-pane label="Favorites" name="third">
							<favorite-form ref="favoriteChild"></favorite-form>
						</el-tab-pane>
						<el-tab-pane label="Strategies" name="fourth">
							<strategy-form ref="strategyChild"></strategy-form>
						</el-tab-pane>
					</el-tabs>
				</div>
			</main>
		</div>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
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
			activeName: 'first',
			activeTag: 'first-child-n1'
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
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
.clearBox {
	margin-bottom: 20px;
	display: flex;
	.el-button{
		align-self: center;
		margin-left: 20px;
		color: #D9001B;
	}
}
.titleTxt{
	font-weight: bold;
}
}@media (min-width: 900px) and (max-width: 1599px) {
.clearBox {
	margin-bottom: 20px;
	display: flex;
	.el-button{
		align-self: center;
		margin-left: 20px;
		color: #D9001B;
	}
}
.titleTxt{
	font-weight: bold;
	font-size: 16px;
}
}
</style>