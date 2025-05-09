<template>
	<div class="page-content-wrapper" id="app">
		<div class="page-content">
			<div class="page-head">
				<div class="container">
					<!-- BEGIN PAGE TITLE -->
					
				<p class="backText" style="margin: 40px 0px 0px 20px; cursor: pointer;" @click="backToList"><i class="el-icon-arrow-left" style="margin-right: 5px;"></i>Back to Strategy List</p>
					<div class="page-title">
						<h1 v-text="title"></h1>
					</div>
					<!-- END PAGE TITLE -->
				</div>
			</div>
			<div class="container">
				<div class="row">
					<div class="row">
						<div class="col-md-12"></div>
					</div>
				</div>

				<div class="row">
					<div class="col-md-12">
						<div class="portlet light">
							<div col="col-md-12">
								<!-- <StrategyChart :strat_data="strat_data" :load_strategy_chart="true" v-show="!isShowChart"></StrategyChart> -->
								<newChart :data="strat_data" :load_strategy_chart="true" v-show="!isShowChart" :singleModel="singleModel"></newChart>
								<div v-html="convertedHTML"></div>
								<strong v-if="!hideJumpBTButton">
								Use BacktestEdge 2.0 to see more details of this strategy,
								<el-tooltip effect="dark" content="Click this button to backtest the strategy" placement="top-start">
								<el-button type="text" @click="_backtestStrategy" style="color: #5b9bd1; font-size: 16px"><strong>click here.</strong></el-button>
								</el-tooltip>
								</strong>
								<div v-html="performanceHTML"></div>
								<div v-html="annualReturnHTML"></div>

								<div class="portlet light">
									<div class="portlet-title">
										<div class="caption">Historical Return Details</div>
									</div>
									<div class="portlet-body">
										<div class="tabbable-custom nav-justified">
											<ul class="nav nav-tabs nav-justified">
												<template v-for="(item, index) in signalDes">
													<li :key="index" :class="{active: activeTab == item.symbol_not_long}">
														<button
														@click="activeTab = item.symbol_not_long"
														data-toggle="tab"
														aria-expanded="false"
														v-if="item.symbol_not_long !== 'CASH'"
													>{{`Model - ${item.symbol_not_long}`}}</button>
													<button
														:href="`#${item.symbol_not_long}`"
														@click="activeTab = item.symbol_not_long"
														data-toggle="tab"
														aria-expanded="false"
														v-else-if="item.symbol_not_long === 'CASH'"
													>{{`Model`}}</button>
												</li>
												</template>
											</ul>
											<div class="tab-content">
												<template v-for="(item, index) in signalDes">
													<div class="tab-pane" :class="{active: activeTab == item.symbol_not_long}" :id="`perf_tab_1_1_${index+1}`" :key="index" v-show="activeTab == item.symbol_not_long">
														<h5>Performance Statistics</h5>
														<div class="tg-wrap">
														<table class="tg">
															<tbody>
																<tr>
																<template v-for="(key, i) in Array.from(keyMatchMap.keys())">
																	<th class="tg-0lax" v-html="keyMatchMap.get(key)" :key="i"></th>
																</template>
																</tr>
																<tr>
																<template v-for="(key, i) in Array.from(keyMatchMap.keys())">
																	<td class="tg-0lax" :key="i">{{ `${item[key.toString()]}${['CAGR', 'benchmark_CAGR', 'max_drawdown', 'net_profit_pct', 'average_win', 'average_loss', 'win_rate_pct'].includes(key) ? '%' : ''}` }}</td>
																</template>
																</tr>
															</tbody>
														</table>
														<template v-if="item.trade_table_outfile">
															<hr />
															<p>Details of the 10 Most Recent Transactions(Table updated on a monthly basis)</p>
															<p></p>
															<center>
																<img
																	:src="item.trade_table_outfile"
																/>
															</center>
															<p></p>
														</template>
														<template v-if="Object.keys(item).find(element => performanceImgArray.includes(element))">
															<hr />
															<h5>Performance Charts</h5>
															<p>
																In the following Returns and Drawdown charts, the
																Strategy returns are shown in Blue and the Benchmark
																returns are shown in gray.
															</p>
															<template v-for="imgKey in performanceImgArray">
																<div :key="imgKey">
																	<p></p>
																<center>
																<img
																	:src="item[imgKey.toString()]"
																/>
															</center>
																<p></p>
																</div>
														</template>
														</template>
													</div>
													</div>
												</template>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import StrategyChart from "./Table/StrategyChart";
import newChart from "./Table/newChart.vue";
import { getStrategyDescription, getStrategiesJSON, getPairData } from '@/service/service'
import { getCookieData } from "@/utils/cryptoUtils/cookie";
import { isJson, timestampToTime } from '@/utils'

export default {
	name: 'Descriptions',
	components: {
		StrategyChart,
		newChart
	},
	data() {
		return {
			convertedHTML: '',
			performanceHTML: '',
			title: '',
			annualReturnHTML: '',
			signalDes: [],
			activeTab: 'CASH',
			keyMatchMap: new Map([
					['CAGR', `Strategy<br />CAGR`],
					['benchmark_CAGR', `Benchmark<br />CAGR`],
					['max_drawdown', `Max<br />Drawdown`],
					['net_profit_pct', `Net<br />Profit (%)`],
					['expectancy', `Expectancy`],
					['sharp_ratio', `Sharpe<br />Ratio`],
					['info_ratio', `Information <br />Ratio`],
					['profit_loss_ratio', `Profit/Loss<br />Ratio`],
					['average_win', `Average<br />Win`],
					['average_loss', `Average<br />Loss`],
					['total_trades', `Total<br />Trades`],
					['win_rate_pct', `Win<br />Rate (%)`],
					['trades_per_year', `Trades<br />Per Year`]
				]),
				performanceImgArray: ['returns_outfile', 'drawdown_outfile', 'heatmap_outfile', 'annual_returns_outfile'],
				backtestStrategy: null,
				strat_data: {},
				isShowChart: false,
				singleModel: 'False'
		}
	},
 computed: {
		hideJumpBTButton() {
    const access_level = getCookieData()?.access_level
    const cannotAccessReport = access_level.some(str => str.includes('corelite'))
    return cannotAccessReport
  }
	},
	beforeRouteEnter(to, from, next) {
  if (to.path.includes('/strategy/descriptions')) {
    next(async _this => {
			const url = to?.query?.url
			_this.title = to?.query?.name
			const frequency = to?.query?.frequency
			let isShowChart = false
			if(url) {
			// 发送请求取得具体描述信息
      const res = await getStrategyDescription(url)
      console.log('详情', res)
      const code = res?.data?.code
      if(code === 200) {
								_this.signalDes = res?.data?.data
        const data = res?.data?.data
				const _data = Array.isArray(data) ? data[0] : null
				let {start_date:_start_date, 
					end_date:_end_date, buy_signal_1:_buy_signal, 
					sell_signal_1: _sell_signal, buy_signal_2: _buy_signal_2, 
					sell_signal_2: _sell_signal_2, single_model,
					symbol1,
					symbol2
				} = _data
				_this.singleModel = single_model
				let pairDataDate2 = null
				const symbolName = {symbol1, symbol2}
				debugger
				// if(single_model === 'False') {
				// 	_buy_signal = _data.buy_signal_1
				// 	_sell_signal = _data.sell_signal_1
				// }
				const buy_signal = eval(_buy_signal)
				const sell_signal = eval(_sell_signal)
				const start_date = timestampToTime(_start_date)
				const end_date = timestampToTime(new Date())
				const isShowChart = buy_signal.length === 0 && sell_signal.length === 0
				const pairRes = await getPairData(start_date, end_date, frequency || 'Daily', symbol1)
				const pairDataDate = pairRes.data.map((item) => {
						const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
						if (dateRegex.test(item.DT)) {
							const currentDate = timestampToTime(item.DT)
							return [new Date(item.DT).getTime(), item.Close, buy_signal.includes(currentDate) ? 1 : null, sell_signal.includes(currentDate) ? -1 : null]
						} else {
								return [null, item.Close, buy_signal.includes(currentDate) ? 1 : null, sell_signal.includes(currentDate) ? -1 : null]
						}
				})
				if(single_model === 'False') {
					const buy_signal2 = eval(_buy_signal_2)
					const sell_signal2 = eval(_sell_signal_2)
					const pairRes = await getPairData(start_date, end_date, frequency || 'Daily', symbol2)
					pairDataDate2 = pairRes.data.map((item) => {
						const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
						if (dateRegex.test(item.DT)) {
							const currentDate = timestampToTime(item.DT)
							return [new Date(item.DT).getTime(), item.Close, buy_signal2.includes(currentDate) ? 1 : null, sell_signal2.includes(currentDate) ? -1 : null]
						} else {
								return [null, item.Close, buy_signal2.includes(currentDate) ? 1 : null, sell_signal2.includes(currentDate) ? -1 : null]
						}
					})
				}
				console.log('pairDataDate', pairDataDate)
				const description = Array.isArray(data) ? data[0]?.description : ''
				const convertToHTML = (text) => {
					// 替换换行符、制表符、大于号、和与号
					text = text.replace(/\\r/g, '<br>')
					text = text.replace(/\\n/g, '<br>')
					text = text.replace(/\\t/g, '&emsp;')
					text = text.replace(/&gt;/g, '>')
					text = text.replace(/&amp;/g, '&')
					text = text.replace(/&rsquo;/g, '\'')
					const getUrl = (name) => {
						let url, url2
						switch (name) {
								case 'Dual Trend Model With Fundamentals':
									url = 'https://users.sentimentrader.com/users/signal_descriptions/dual_trend_model';
										break;
								case 'Short-Term Combined Model':
									url = 'https://users.sentimentrader.com/users/charts/st_combined';
										break;
								case 'Simple Trading Model with Fundamentals and Sentiment':
									url = 'https://sentimentrader.com/blog/applying-sentiment-indicators-to-different-models';
										break;
								case 'Dual Trend Model with Fundamentals and Sentiment':
									url = 'https://users.sentimentrader.com/users/signal_descriptions/dual_trend_model_with_fundamentals'
									url2 = 'https://www.sentimentrader.com/blog/applying-sentiment-indicators-to-different-models'
									break;
								case 'High Yield Golden Cross':
									url = 'https://users.sentimentrader.com/users/charts/breadth_bonds_hy_adline'
									url2 = 'https://www.sentimentrader.com/blog/whats-the-message-from-the-junk-bond-market'
									break;
								case 'Aggregate Signal Model':
									url = 'https://users.sentimentrader.com/users/charts/aggregate_model'
									url2 = 'https://sentimentrader.com/users/signals'
									break;
								case 'Last Hour Strategy':
									url = 'https://www.sentimentrader.com/blog/a-sell-signal-in-the-cumulative-advance-decline-line-for-the-last-hour-of-trading'
									break;
								case 'Macro Index Model':
									url = 'https://users.sentimentrader.com/users/charts/macro_index_model'
									break;
								case 'Conference Board LEI Model with Sentiment':
									url = 'https://www.sentimentrader.com/blog/applying-sentiment-indicators-to-different-models'
									break;
								default:
									url = '#';
						}
						return {url, url2}
						}
					// 替换 <a> 标签的 href 属性
					const {url, url2} = getUrl(_this.title)
					let counter = 0; // 计数器用于区分不同的<a>标签
					text = text.replace(/<a\b[^>]*href=\"([^"]*)\"[^>]*>(.*?)<\/a>/g, (match, href, content) => {
						counter++
						if (counter === 1) {
								return `<a href="${url}">${content}</a>`
						} else if (counter === 2) {
								return `<a href="${url2}">${content}</a>`
						} else {
								return match
						}
					})
					return text
    }
				let _res = await getStrategiesJSON()
				let strategies = _res?.data
				_this.backtestStrategy = strategies.find((item) => item.name === _this.title) ? strategies.find((item) => item.name === _this.title) : null
				// 日期转换字符串
				const formatDate = (dateString) => {
					const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
					const date = new Date(dateString)
					const month = months[date.getMonth()]
					const year = date.getFullYear()
					return `${month} ${year}`
				}

				_this.$nextTick(async () => {
					if(!_data) return
					const  {start_date, end_date} = _data
					console.log('_data', _data)
					_this.convertedHTML = convertToHTML(description)
					_this.performanceHTML = `
						<h3>Performance</h3>
							<ul>
								<li>Last updated ${formatDate(end_date)}</li>
								<li>
									Backtest timeframe: <b>${timestampToTime(start_date)} to ${timestampToTime(end_date)}</b>. NOTE:
									These dates were chosen to provide the same coverage across
									all signals and ETF's used in those signals and are
									dependant on ETF start dates.
								</li>
								<li>
									For all backtests shown, we used active and 
									accessible ETF's
									(e.g., SPY, QQQ, TLT, LQD, etc). The prices of these ETF's
									are split and dividend adjusted.
								</li>

								<li>
									Shorting is performed by buying inverse ETFs. For these
									backtests, we used SH to short the S&amp;P500 and PSQ to
									short the NASDAQ. Using leveraged ETFs like SSO (2x) and
									UPRO (3x) may increase your returns and drawdowns. NOTE: For
									the REIT Trading Model, no shorting is done as their isn't
									an ETF with enough history and activity to cover the
									timeframe.
								</li>

								<li>
									Historical returns shown below include transaction fees of
									$1.5 per order (e.g., $3 per round-trip) but does not
									include slippage.
								</li>
							</ul>
					`
						_this.annualReturnHTML = `
						<h4>Model's average annual returns</h4>
						<ol>
							${data.map(item => {
								const subInfo = [
									['SH', '(long/short)'],
									['PSQ', '(long/short)'],
									['AGG', '(Multi-Asset Aggregate Bonds)'],
									['LQD', '(Multi-Asset Corporate Bonds)'],
									['TLT', '(Multi-Asset Treasury Bonds)'],
									['GLD', '(Gold)']
								]
								const map = new Map(subInfo)
								if(item.symbol_not_long === 'CASH') return `<li>Model: ${item.CAGR}%</li>`
								return `<li>Model: ${map.get(item.symbol_not_long)} - ${item.symbol_not_long}: ${item.CAGR}%</li>`
							}).join('')}
						</ol>
					`
				_this.isShowChart = isShowChart
				const _strat_data = [pairDataDate]
				if(pairDataDate2 !== null) _strat_data.push(pairDataDate2)
				_this.strat_data = {
					strat_data: _strat_data,
					symbolName
				}
				console.log('lishan strat_data', _this.strat_data)
				})
    }
			}
    })
    } else {
      next()
    }
  },
	methods: {
		backToList() {
			this.$router.push({path: '/strategy'})
		},
		_backtestStrategy() {
			debugger
			if(!this.backtestStrategy) return
					/* 为防止跳转 BT 出现重名, 在这里加上时间戳 */
					const date = new Date()
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const day = date.getDate();
					const hour = date.getHours();
					const minute = date.getMinutes();
					const second = date.getSeconds();
					this.backtestStrategy.name = `${this.backtestStrategy.name || 'Strategy'} (${year}-${month}-${day} ${hour}:${minute}:${second})`
					this.$router.push({
						name: 'SetUp',
						params: { data: JSON.stringify(this.backtestStrategy), usedFor: 'showBTForm' }
					},()=>{})
		}
 	}
}
</script>

<style lang="less" scoped>
.backText {
	color: #525456;
	font-weight: bold;
	font-size: 1.1rem;
	i {
		font-weight: bold;
	}
}
</style>