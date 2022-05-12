<template>
	<div class="perfprmance-container">
		<el-tabs
			v-model="activePerTag"
			type="card"
			@tab-click="handleClick"
			v-loading="loading"
		>
			<el-tab-pane label="Summary" name="first">
				<div class="summaryContainer">
					<el-table :data="tableData" style="width: 100%">
						<el-table-column
							prop="totalReturn"
							show-overflow-tooltip
							label="TOTAL RETURN %"
							align="center"
							algin="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.totalReturn >= 0">{{
									scope.row.totalReturn + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.totalReturn)">0</span>
								<span v-else style="color: red">{{
									scope.row.totalReturn + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="CAGR"
							show-overflow-tooltip
							label="Annual Return % (CAGR)"
							align="center"
							algin="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.CAGR >= 0">{{
									scope.row.CAGR + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.CAGR)">0</span>
								<span v-else style="color: red">{{
									scope.row.CAGR + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="medianReturn"
							label="MEDIAN RETURN %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.medianReturn >= 0">{{
									scope.row.medianReturn + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.medianReturn)">0</span>
								<span v-else style="color: red">{{
									scope.row.medianReturn + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="averageReturn"
							label="AVERAGE RETURN %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.averageReturn >= 0">{{
									scope.row.averageReturn + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.averageReturn)">0</span>
								<span v-else style="color: red">{{
									scope.row.averageReturn + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="tzScore"
							label="Z_SCORE"
							align="center"
							show-overflow-tooltip
						>
							<template slot-scope="scope">
								<span v-if="scope.row.tzScore >= 0">{{
									scope.row.tzScore
								}}</span>
								<span v-else-if="isNaN(scope.row.tzScore)">0</span>
								<span v-else style="color: red">{{ scope.row.tzScore }}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="standardDeviation"
							label="STD. DEV"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.standardDeviation >= 0">{{
									scope.row.standardDeviation
								}}</span>
								<span v-else-if="isNaN(scope.row.standardDeviation)">0</span>
								<span v-else style="color: red">{{
									scope.row.standardDeviation
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="buyHoldGain"
							label="BUY & HOLD %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.buyHoldGain >= 0">{{
									scope.row.buyHoldGain + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.buyHoldGain)">0</span>
								<span v-else style="color: red">{{
									scope.row.buyHoldGain + '%'
								}}</span>
							</template>
						</el-table-column>
					</el-table>

					<el-table
						header-align="center"
						:data="tableData"
						style="width: 100%; margin-top: 20px"
					>
						<el-table-column
							prop="winRate"
							label="WIN RATE %"
							show-overflow-tooltip
							width="180"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.winRate >= 0">{{
									scope.row.winRate + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.winRate)">0</span>
								<span v-else style="color: red">{{
									scope.row.winRate + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="averageWin"
							label="AVERAGE WIN %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.averageWin >= 0">{{
									scope.row.averageWin + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.averageWin)">0</span>
								<span v-else style="color: red">{{
									scope.row.averageWin + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="averageLoss"
							label="AVERAGE LOSS %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.averageLoss >= 0">{{
									scope.row.averageLoss + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.averageLoss)">0</span>
								<span v-else style="color: red">{{
									scope.row.averageLoss + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="drawDown"
							label="MAX RISK %"
							align="center"
							show-overflow-tooltip
						>
							<template slot-scope="scope">
								<span v-if="scope.row.drawDown >= 0">{{
									scope.row.drawDown + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.drawDown)">0</span>
								<span v-else style="color: red">{{
									scope.row.drawDown + '%'
								}}</span>
							</template>
						</el-table-column>
					</el-table>
					<el-table
						header-align="center"
						:data="tableData"
						style="width: 100%; margin-top: 20px"
					>
						<el-table-column
							prop="totalTrades"
							label="TOTAL TRADES"
							width="180"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.totalTrades >= 0">{{
									scope.row.totalTrades
								}}</span>
								<span v-else style="color: red">{{
									scope.row.totalTrades
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="totalPositive"
							label="TOTAL POSITIVE"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.totalPositive >= 0">{{
									scope.row.totalPositive
								}}</span>
								<span v-else style="color: red">{{
									scope.row.totalPositive
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="totalNegative"
							show-overflow-tooltip
							label="TOTAL NEGATIVE"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.totalNegative >= 0">{{
									scope.row.totalNegative
								}}</span>
								<span v-else style="color: red">{{
									scope.row.totalNegative
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="timeInMarket"
							show-overflow-tooltip
							label="TIME IN MARKET %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.timeInMarket >= 0">{{
									scope.row.timeInMarket + '%'
								}}</span>
								<span v-else style="color: red">{{
									scope.row.timeInMarket + '%'
								}}</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="imgBox">
					<div class="benchmarkReturnImg">
						<img :src="returnImgUrl" alt="" width="100%" />
					</div>
					<div class="drawDownReturnImg">
						<img :src="drawDownImgUrl" alt="" width="100%" />
					</div>
					<div class="monthReturnImg">
						<img :src="monthReturnImgUrl" alt="" width="100%" />
					</div>
					<div class="annualReturnImg">
						<img :src="annualReturnImgUrl" alt="" width="100%" />
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="Trades" name="second">
				<div class="trades-container">
					<el-table
						:data="tradesData"
						style="width: 100%"
						border
						:span-method="objectSpanMethod"
						:cell-style="try1"
					>
						<el-table-column
							prop="trade_number"
							show-overflow-tooltip
							label="Trade #"
							align="center"
						>
							<template slot-scope="scope">
								{{ Number(scope.row.trade_number) + 1 }}
							</template>
						</el-table-column>
						<el-table-column
							prop="Date"
							label="Trade Date"
							align="center"
							show-overflow-tooltip
						>
						</el-table-column>
						<el-table-column
							prop="TradeStatus"
							label="Action"
							align="center"
							show-overflow-tooltip
						>
						</el-table-column>
						<el-table-column
							prop="Indicator"
							label="Indicator"
							align="center"
							show-overflow-tooltip
						>
						</el-table-column>
						<el-table-column
							prop="TradePrice"
							label="Trade Price"
							align="center"
						>
						</el-table-column>

						<el-table-column
							prop="TradeReturn"
							label="Trade Return %"
							align="center"
							show-overflow-tooltip
						>
							<template slot-scope="scope">
								<span v-if="scope.row.TradeReturn == 'none'">{{ '' }}</span>
								<span v-else-if="scope.row.TradeReturn >= 0"
									>{{ scope.row.TradeReturn }}%</span
								>
								<span v-else style="color: red"
									>{{ scope.row.TradeReturn }}%</span
								>
							</template>
						</el-table-column>
						<el-table-column
							prop="Return"
							label="Total Return %"
							align="center"
							show-overflow-tooltip
						>
							<template slot-scope="scope">
								<span v-if="scope.row.Return == 'none'">{{ '' }}</span>
								<span v-else-if="scope.row.Return >= 0"
									>{{ (scope.row.Return * 100).toFixed(2) }}%</span
								>
								<span v-else style="color: red"
									>{{ (scope.row.Return * 100).toFixed(2) }}%</span
								>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-tab-pane>
			<!-- <el-tab-pane label="Detailed Statistics" name="third">Detailed Statistics</el-tab-pane> -->
		</el-tabs>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import jutils from 'jutils-src'
import { seeReport } from '@/service/service'

export default {
	data() {
		return {
			activePerTag: 'first',
			tableData: [],
			returnImgUrl: '',
			drawDownImgUrl: '',
			monthReturnImgUrl: '',
			annualReturnImgUrl: '',
			loading: false,
			tradesData: []
		}
	},
	created() {
		this.getResultData({ id: 0 })
	},
	methods: {
		handleClick(tab, event) {},

		async getResultData(row) {
			let vm = this
			let initalData = {}
			let data = {}
			if (!row.id) {
				return
			}
			if (row.status != 0) {
				if (this.$store.state.favoriteBacktestRowData.id) {
					vm.loading = true
					let id = row.id
					try {
						const res = await seeReport(id)
						
							console.log('Eric 返回的数据', res.data)
						if (res.status == 200) {
							if (typeof res.data == "string") {
								initalData = JSON.parse(res.data)
							}else{
								initalData = res.data
							}
							console.log('Eric 返回的数据', res.data)
							// 使用try-catch去捕捉错误
							// 直接使用JSON.parse去转译，并把转译结果判断一下是不是object类型，如果是的话就返回true,否则就返回false,这样就排除了转化后非object的类型，比如"123456789"
							// function isJSON(str) {
							// 	try {
							// 		if (typeof JSON.parse(str) == 'object') {
							// 			return true
							// 		}
							// 	} catch (e) {}
							// 	return false
							// }
							// console.log("判断返回值是不是json", isJSON(res.data))
							
							// -------------------------------------  text ----------------
							const tradeReturn = initalData['Each Return']
							data.uuid = initalData['UUID']
							data.symbol = initalData['Symbol']
							data.frequency = initalData['Frequency']
							data.totalTrades = initalData['Total Trades']
							data.totalPositive = initalData['Total Positive']
							data.totalNegative = initalData['Total Negative']
							data.scratch = initalData['Scratch']
							data.averageWin = initalData['Average Win %']
							data.averageLoss = initalData['Average Loss %']
							data.medianGain = initalData['Median Gain']
							data.medianLoss = initalData['Median Loss']
							data.averageReturn = initalData['Average Return']
							data.medianReturn = initalData['Median Return']
							data.buyHoldGain = initalData['BuyHoldGain']
							data.winRate = initalData['Win Rate']
							data.timeInMarket = initalData['Time in Market']
							data.totalReturn = initalData['Total Return (%)']
							data.tzScore = initalData['Z-score']
							data.standardDeviation = initalData['Standard Deviation']
							data.s3_status_response = initalData['s3_status_response']
							data.cagr = initalData['CAGR']
							data.annual_volatiltiy = initalData['annual_volatiltiy']
							data.calmar_ratio = initalData['calmar_ratio']
							data.sortino_ratio = initalData['sortino_ratio']
							data.tail_ratio = initalData['tail_ratio']
							data.var = initalData['VAR']
							data.capture = initalData['capture']
							data.alpha = initalData['alpha']
							data.beta = initalData['beta']
							data.information_ratio = initalData['information_ratio']
							data.sharpeRatio = initalData['Sharpe Ratio']
							data.drawDown = initalData['DrawDown']
							data.drawDownPeriod = initalData['DrawDown Period']
							data.drawDownImageUploaded = initalData['DrawDown Image Uploaded']
							data.ddFileURL = initalData['DD File URL']
							data.returnsImageUploaded = initalData['Returns Image Uploaded']
							data.returnsFileURL = initalData['Returns File URL']
							data.annualReturnsImageUploaded =
								initalData['Annual Returns Image Uploaded']
							data.annualReturnsFileURL = initalData['Annual Returns File URL']
							data.returnsheatmapImageUploadedURL =
								initalData['Returns Heatmap Image Uploaded']
							data.returnsHeatmapFileURL =
								initalData['Returns Heatmap File URL']
							data.CAGR = initalData['CAGR']
							vm.tableData = []
							//('data',data)
							vm.tableData.push(data)
							vm.returnImgUrl = data.returnsFileURL
							vm.drawDownImgUrl = data.ddFileURL
							vm.monthReturnImgUrl = data.returnsHeatmapFileURL
							vm.annualReturnImgUrl = data.annualReturnsFileURL

							for (let i = 0; i < initalData['Trades'].length; i++) {
								if (i % 2 == 0) {
									initalData['Trades'][i].trade_number = i / 2
									initalData['Trades'][i + 1].trade_number = i / 2
								}
							}

							for (let i = 0; i < initalData['Trades'].length; i++) {
								initalData['Trades'][i].TradeReturn =
									tradeReturn[initalData['Trades'][i].trade_number]
								if (i % 2 !== 0) {
									initalData['Trades'][i - 1].Return =
										initalData['Trades'][i].Return

								}
							}
							vm.tradesData = initalData['Trades']
							console.log('tradesData', vm.tradesData)
							// ---------------------------------------- end ----------------------------------
							// ----------------------- backtest result-------------------------------

							this.$emit('setBacktestResult', initalData['basic'])
							// ------------------------------ end -----------------------------------
							setTimeout(() => {
								this.loadMarker(initalData.markerSet)
							}, 0)

							//vm.$store.commit('getTradesData',initalData[])
							vm.loading = false
						}
					} catch (error) {
						console.error('服务器报错', error)
						// 清空数据并且进行提示
						vm.tableData = []
						vm.tradesData = []
						vm.$emit('errorCatchPerformance')
						vm.loading = false
					}
				}
			}
		},
		loadMarker(markerSet) {
			//load markers for initial quotefeed
			console.log("loadMarker timeperiod",CIQ.initialDate )
			let list = this.filterMarkerDate(
				new Date(CIQ.initialDate.start),
				new Date(CIQ.initialDate.end),
				markerSet
			)
			CIQ.store.commit('SetmarkerSet', markerSet)
			CIQ.isMarkerShown = true
			CIQ.loadChart(list, CIQ.addMarker)
		},
		filterMarkerDate(start_date, end_date, markerSet) {
			let list = []
			let _date = {
				start: jutils.formatDate(start_date, 'YYYYMMDD'),
				end: jutils.formatDate(end_date, 'YYYYMMDD')
			}
			for (var date in markerSet) {
				let markerSetDate =
					markerSet[date].DT.slice(0, 4) +
					markerSet[date].DT.slice(5, 7) +
					markerSet[date].DT.slice(8, 10)
				if (markerSetDate > _date.start && markerSetDate <= _date.end) {
					list.push(markerSet[date])
				}
			}
			return list
		},
		clearPerformanceData() {
			this.tableData = []
			this.tradesData = []
			this.returnImgUrl = ''
			this.drawDownImgUrl = ''
			this.monthReturnImgUrl = ''
			this.annualReturnImgUrl = ''
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
				if (rowIndex % 2 === 0) {
					return {
						rowspan: 2,
						colspan: 1
					}
				} else {
					return {
						rowspan: 0,
						colspan: 0
					}
				}
			}
			if (columnIndex === 5) {
				if (rowIndex % 2 === 0) {
					return {
						rowspan: 2,
						colspan: 1
					}
				} else {
					return {
						rowspan: 0,
						colspan: 0
					}
				}
			}
			if (columnIndex === 6) {
				if (rowIndex % 2 === 0) {
					return {
						rowspan: 2,
						colspan: 1
					}
				} else {
					return {
						rowspan: 0,
						colspan: 0
					}
				}
			}
		},
		try1({ row, column, rowIndex, columnIndex }) {
			// if (columnIndex === 6 && column.label == 'Total Return %') {
			// 	if (rowIndex % 2 === 0) {
			// 		row.Return = 'none'
			// 	}
			// }
			// if (columnIndex === 5 && column.label == 'Trade Return %') {
			// 	if (rowIndex % 2 === 0) {
			// 		row.Return = 'none'
			// 	}
			// }
		}
	}
}
</script>
<style scoped>
.imgBox {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.imgBox div {
	margin: 60px 0px 20px 0px;
}
.perfprmance-container {
	padding-bottom: 20px;
}
</style>