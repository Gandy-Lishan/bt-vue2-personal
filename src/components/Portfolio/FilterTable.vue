<template>
	<div class="page-content-wrapper" id="app">
		<div class="page-content">
			<div class="container portfolio-container">
				<div class="row">
					<div class="col-md-12 portfolio">
						<div class="portlet">
							<div col="col-md-12 portfolio">
								<div class="portlet">
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
															<p>Details of the 10 Most Recent Transactions(Details of the 10 Most Recent Transactions)</p>
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

export default {
	props: {
		data: Object
	},
	name: 'Descriptions',
	data() {
		return {
			title: '',
			signalDes: [],
			activeTab: 'CASH',
			keyMatchMap: new Map([
					['CAGR', `Strategy<br />CAGR`],
					['benchmark_CAGR', `Benchmark<br />CAGR`],
					['max_drawdown', `Max<br />Drawdown`],
					['net_profit_pct', `Net<br />Profit (%)`],
					['Expectancy', `Expectancy`],
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
	watch: {
		data: {
			handler(newValue, oldValue){
				if(!newValue) return
				if(newValue.profit_loss_ratio == -1) newValue.profit_loss_ratio = 'Low risk'
				for (const key in newValue) {
					if(key !== 'profit_loss_ratio' && Array.from(this.keyMatchMap.keys()).includes(key)) newValue[key] = newValue[key].toFixed(2)
				}
			  this.signalDes = [newValue]
			},
			immediate: true,
			deep: true
		}
	}
}
</script>

<style lang="less" scoped>
</style>