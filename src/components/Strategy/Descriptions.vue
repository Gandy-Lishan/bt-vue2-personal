<template>
	<div class="page-content-wrapper" id="app">
		<div class="page-content">
			<div class="page-head">
				<div class="container">
					<!-- BEGIN PAGE TITLE -->
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
								<div v-html="convertedHTML"></div>
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
															<p>Details of the 10 Most Recent Transactions</p>
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
import { getStrategyDescription } from '@/service/service'
import { timestampToTime } from '@/utils'

export default {
	name: 'Descriptions',
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
				performanceImgArray: ['returns_outfile', 'drawdown_outfile', 'heatmap_outfile', 'annual_returns_outfile']
		}
	},
	beforeRouteEnter(to, from, next) {
		console.log('TO', to, 'FROM', from)
  if (to.path.includes('/strategy/descriptions')) {
    next(async _this => {
			const url = to?.query?.url
			_this.title = to?.query?.name
			if(url) {
			// 发送请求取得具体描述信息
      const res = await getStrategyDescription(url)
      console.log('详情', res)
      const code = res?.data?.code
      if(code === 200) {
				_this.signalDes = res?.data?.data
        const data = res?.data?.data
				const _data = Array.isArray(data) ? data[0] : null
				const description = Array.isArray(data) ? data[0]?.description : ''
				const convertToHTML = (text) => {
					// 替换换行符、制表符、大于号、和与号
					text = text.replace(/\\r/g, '<br>')
					text = text.replace(/\\n/g, '<br>')
					text = text.replace(/\\t/g, '&emsp;')
					text = text.replace(/&gt;/g, '>')
					text = text.replace(/&amp;/g, '&')
					text = text.replace(/&rsquo;/g, '\'')
					text = text.replace(/<a\b[^>]*>(.*?)<\/a>/g, '$1');
					return text
      	}
				// 日期转换字符串
				const formatDate = (dateString) => {
					const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
					const date = new Date(dateString)
					const month = months[date.getMonth()]
					const year = date.getFullYear()
					return `${month} ${year}`
				}

				_this.$nextTick(() => {
					if(!_data) return
					const  {start_date, end_date} = _data
					_this.convertedHTML = convertToHTML(description)
					_this.performanceHTML = `
						<h3>Performance</h3>
							<ul>
								<li>Last updated ${formatDate(end_date)}</li>
								<li>
									Backtest timeframe: <b>${timestampToTime(start_date)} to ${timestampToTime(start_date)}</b>. NOTE:
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
				})
      }
			}
    })
    } else {
      next()
    }
  },
}
</script>

<style lang="less" scoped>
</style>