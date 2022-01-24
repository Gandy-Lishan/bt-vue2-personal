<template>
	<div class="home">
		<div class="home-container">
			<header class="header">
				<el-row
					><el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="2"
						><img src="../../assets/logo.png" alt="logo" /></el-col
				></el-row>

				<el-row type="flex" justify="center"
					><el-col><p class="page-header">BacktestEdge</p></el-col>
				</el-row>
				<div class="chart_box" id="chart_box">
					<chart width="100%" height="100%"></chart>
				</div>
			</header>
			<main class="main">
				<el-tabs v-model="activeName" type="card" :tab-position="tabPosition">
					<el-tab-pane label="Set up Backtest" name="first">
						<set-up></set-up>
						<div class="criteria-container">
							<div class="criteria-box">
								<entry></entry>
								<exit></exit>
							</div>

							<div class="backtest-btns">
								<el-button type="danger"> Clear Form</el-button>
								<el-button type="success">Run Backtest</el-button>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="Backtest History" name="second"> </el-tab-pane>
					<el-tab-pane label="Backtest Results" name="third"> </el-tab-pane>
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
import chart from '@/components/chart/index.vue'
import setUp from '@/components/BacktestEdge/SetUp.vue'
import entry from '@/components/BacktestEdge/Entry.vue'
import exit from '@/components/BacktestEdge/Exit.vue'
export default {
	name: 'home',
	data() {
		return {
			tabPosition: 'top',
			activeName: 'first',
			clientHeight: 0
		}
	},
	components: {
		chart: chart,
		'set-up': setUp,
		entry,
		exit
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
			console.log(window.screenWidth)
			if (_this.clientHeight < 768) {
				_this.tabPosition = 'left'
			} else {
				_this.tabPosition = 'top'
			}
		}, 500)
	}
}
</script>
<style lang="less" scoped>
.page-header {
	font-size: 2rem;
    margin-left: 15px;
    font-weight: bold;
}
.home-container {
	width: 1120px;
	margin: 0 auto;
	background: #f2f2f2;
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
	justify-content: space-around;
	align-items: center;

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
