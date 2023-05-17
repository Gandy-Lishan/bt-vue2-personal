// Summary & Trades
<template>
	<div class="perfprmance-container">
		<p class="hint">
			Hint: Markers on the chart point to the buy/sell trade dates on the open
			<b>ONE</b> bar after entry/exit criteria met.
		</p>
		<el-tabs v-model="activePerTag" type="card" v-loading="loading">
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
					<div
						v-if="
							!returnImgUrl &&
							!drawDownImgUrl &&
							!monthReturnImgUrl &&
							!annualReturnImgUrl
						"
						style="text-align: left"
					>
						<el-empty image-size="80" description="No Data"></el-empty>
					</div>
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
						:data="splitTradeData"
						style="width: 100%"
						border
						:span-method="objectSpanMethod"
					>
						<el-table-column
							prop="trade_number"
							show-overflow-tooltip
							label="Trade #"
							width="150px"
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
							width="150px"
							show-overflow-tooltip
						>
						</el-table-column>
						<el-table-column
							prop="TradeStatus"
							label="Action"
							align="center"
							width="150px"
							show-overflow-tooltip
						>
						</el-table-column>
						<el-table-column
							prop="Indicator"
							label="Indicator"
							align="center"
							show-overflow-tooltip
						>
							<template slot-scope="scope">
								<div v-for="(item, index) in scope.row.Indicator" :key="index">
									<p>{{ item }}</p>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="TradePrice"
							label="Trade Price"
							width="150px"
							align="center"
						>
						</el-table-column>

						<el-table-column
							prop="TradeReturn"
							label="Trade Return %"
							width="150px"
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
							width="150px"
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
						<div slot="empty" style="text-align: left">
							<el-empty image-size="80" description="No Data"></el-empty>
						</div>
					</el-table>
					<div class="pagination-container">
						<span style="font-size: 13px; font-weight: 400; margin-right: 10px"
							>Total {{ totalTradesNumber }}</span
						>
						<el-pagination
							@current-change="handleCurrentChange"
							:current-page="queryInfo.page"
							:page-size="20"
							layout="prev, pager, next,slot"
							:total="queryInfo.total"
						>
						</el-pagination>
					</div>
					<!-- <el-pagination
				background
				layout="prev, pager, next"
				:total="queryInfo.total"
				>
				</el-pagination> -->
				</div>
			</el-tab-pane>
			<el-tab-pane
				label="Exit with different Time-In-Market frame"
				name="third"
			>
				<div class="trades-container">
					<p>
						The results below provide a multiple timeframe view of the backtest
						of the indicator and index that you have chosen. The 'Exit Criteria'
						selected for the backtest is not used for the results below.
						Instead, we provide a look at various time-frames from 1-Week to
						1-Year of returns.
					</p>

					<div class="history-container">
						<el-skeleton :rows="6" :loading="loading" animated>
							<template>
								<el-table
									:data="backtestHistoryList"
									stripe
									show-summary
									:summary-method="getSummaries"
									style="width: 100%; height: 100%"
								>
									<div v-if="defaultTableLabels.length > 0">
										<template v-for="(l, index) in defaultTableLabels">
											<el-table-column :label="l" :prop="l" :key="index">
												<template slot-scope="scope">
													<p class="tableText">
														{{ scope.row[l] }}
													</p>
												</template>
											</el-table-column>
										</template>
									</div>
									<div slot="empty" style="text-align: left">
										<el-empty image-size="80" description="No Data"></el-empty>
									</div>
								</el-table>
							</template>
						</el-skeleton>
					</div>
				</div>
			</el-tab-pane>
			<!-- <el-tab-pane label="Detailed Statistics" name="third">Detailed Statistics</el-tab-pane> -->
		</el-tabs>

		<div class="downLoadCsvBtn">
			<el-button
				@click="handleDownloadCsv"
				style="display: inline-block"
				type="primary"
				plain
				size="mini"
				icon="el-icon-download"
				>Export Data</el-button
			>
		</div>
	</div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import jutils from 'jutils-src'
import { seeReport } from '@/service/service'
const XLSX = require('xlsx');

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
      tradesData: [],
      queryInfo: {
        total: 0,
        page: 1
      },
      totalTradesNumber: 0,
      splitTradeData: [],
      defaultTableLabels: [
        '12 Months [%]',
        'Entry Date',
        '1 Week [%]',
        '2 Weeks [%]',
        '1 Month [%]',
        '2 Months [%]',
        '3 Months [%]',
        '6 Months [%]',
      ],
      backtestHistoryList: [],
			unSplitTadeData: []
    }
  },
  created() {
    this.getResultData({ id: 0 })
  },
  methods: {

    async getResultData(row, callback) {

      let vm = this
      let initalData = {}
      let data = {}
      // 清空performance表单
      vm.clearPerformanceData()
      if (!row.id) {
        return
      }

      if (row.status != 0) {
        if (this.$store.state.favoriteBacktestRowData.id) {
          let id = row.id
          try {

            const res = await seeReport(id)

            if (res.status == 200) {
              if (typeof res.data == "string") {
                initalData = JSON.parse(res.data)
              } else {
                initalData = res.data
              }

              // -------------------------------------  start ----------------
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
              if (initalData['Trades']) {
                // 有交易才填表单
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
                vm.queryInfo.total = initalData['Trades'].length
                vm.totalTradesNumber = (initalData['Trades'].length) / 2
                vm.handleCurrentChange(1)
                vm.tradesData = initalData['Trades']
								vm.unSplitTadeData =  vm.tradesData 

                // 保存tradesdata到store
                this.$store.commit('getTradesData', vm.tradesData)
                // 根据entrydate计算未来收益
                this.backtestHistoryList = this.calculateBacktestHistory(vm.tradesData)
              }

              // ---------------------------------------- end ----------------------------------
              // ----------------------- backtest result-------------------------------

              this.$emit('setBacktestResult', initalData['basic'])
              // ------------------------------ end -----------------------------------

            }
          } catch (error) {
            console.error('服务器报错', error)
            vm.tableData = []
            vm.tradesData = []
            vm.$emit('errorCatchPerformance')
          }
        }
      } else {
        console.error('row status is ', row.status)
      }
      setTimeout(() => {
        if (initalData.markerSet) {
          this.loadMarker(initalData.markerSet)
        }
        if (callback) { callback() }
      }, 0)
    },
    calculateBacktestHistory(dataSet) {
      let chartDataset = CIQ.stxx.chart.dataSet
      const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
      dataSet = dataSet.filter(item => item.TradeStatus == 'BUY')
      let backtestResult = []
      for (var data in dataSet) {
        var datatime = new Date(dataSet[data].Date)

        var offset = datatime.getTimezoneOffset() * 60 * 1000
        var entryDate = new Date(datatime.setTime(datatime.getTime() + offset))

        let res = chartDataset.findIndex(x => {
          return entryDate.getTime() == x.DT.getTime()
        })

        if (res != -1) {
          //拿进场价格和前一天作比较
          let entryPrice = chartDataset[res].Open
          let exitIn5Bar = chartDataset[res + 5] ? ((direction == 'Short' ? entryPrice - chartDataset[res + 5].Open : chartDataset[res + 5].Open - entryPrice) / entryPrice * 100).toFixed(2) + ' %' : ''
          let exitIn10Bar = chartDataset[res + 10] ? ((direction == 'Short' ? entryPrice - chartDataset[res + 10].Open : chartDataset[res + 10].Open - entryPrice) / entryPrice * 100).toFixed(2) + ' %' : ''
          let exitIn21Bar = chartDataset[res + 21] ? ((direction == 'Short' ? entryPrice - chartDataset[res + 21].Open : chartDataset[res + 21].Open - entryPrice) / entryPrice * 100).toFixed(2) + ' %' : ''
          let exitIn42Bar = chartDataset[res + 42] ? ((direction == 'Short' ? entryPrice - chartDataset[res + 42].Open : chartDataset[res + 42].Open - entryPrice) / entryPrice * 100).toFixed(2) + ' %' : ''
          let exitIn63Bar = chartDataset[res + 63] ? ((direction == 'Short' ? entryPrice - chartDataset[res + 63].Open : chartDataset[res + 63].Open - entryPrice) / entryPrice * 100).toFixed(2) + ' %' : ''
          let exitIn126Bar = chartDataset[res + 126] ? ((direction == 'Short' ? entryPrice - chartDataset[res + 126].Open : chartDataset[res + 126].Open - entryPrice) / entryPrice * 100).toFixed(2) + ' %' : ''
          let exitIn252Bar = chartDataset[res + 252] ? ((direction == 'Short' ? entryPrice - chartDataset[res + 252].Open : chartDataset[res + 252].Open - entryPrice) / entryPrice * 100).toFixed(2) + ' %' : ''
          backtestResult.push({
            '12 Months [%]': exitIn252Bar,
            'Entry Date': dataSet[data].Date,
            '1 Week [%]': exitIn5Bar,
            '2 Weeks [%]': exitIn10Bar,
            '1 Month [%]': exitIn21Bar,
            '2 Months [%]': exitIn42Bar,
            '3 Months [%]': exitIn63Bar,
            '6 Months [%]': exitIn126Bar,
          })
        }
      }
      return backtestResult
    },
    getSummaries(param) {
      const { columns, data } = param

      const sums = [] //声明变量
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Average'
          return
        }
        // if (index === 1) {
        // 	return
        // }
        const values = data.map((item) => {
          return Number(
            item[column.property].slice(0, item[column.property].length - 1)
          )
        })
        let totalCount = 0 // 求平均数使用
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value) && value != 0) {
            totalCount++
            return prev + curr
          } else {
            return prev
          }
        }, 0)

        sums[index] = sums[index] / totalCount

        // ***********演示完要删**************************************
        // if(this.rowData && this.rowData.Symbol=='WWW' && sums[index]<0){
        //   sums[index] = -sums[index]
        // }
        // *****************************************************

        sums[index] = sums[index].toFixed(2)
        sums[index] = sums[index] + ' %'
      })
      return sums
    },
    loadMarker(markerSet) {
      try {

        //load markers for initial quotefeed

        let list = this.filterMarkerDate(
          new Date(CIQ.initialDate.start),
          new Date(CIQ.initialDate.end),
          markerSet
        )
        CIQ.isMarkerShown = true

        // split the markers into several groups
        CIQ.groups = this.group(list)
        let markers = CIQ.groups.pop()

        // if the last groups has no enough number of items, merge it with the last one
        //console.log('CIQ.stxx.chart.xaxis[0]',CIQ.stxx.chart.xaxis[0])
        let c_date = jutils.formatDate(CIQ.stxx.chart.xaxis[0].DT, 'YYYYMMDD');
        if (CIQ.groups.slice(-1)[0]) {
          let m_date =
            CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(0, 4) +
            CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(5, 7) +
            CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(8, 10)
          if (c_date < m_date) {
            markers.unshift(...CIQ.groups.pop())
          }
        }
        console.log('initiating Markers...', markers)
        CIQ.loadChart(markers, CIQ.addMarker)
      } catch (error) {
        console.error(error)
        return
      }
    },
    group(data) {
      var result = [];
      var groupItem;
      for (var i = 0; i < data.length; i++) {
        if (i % 500 == 0) {
          groupItem != null && result.push(groupItem);
          groupItem = [];
        }
        groupItem.push(data[i]);
      }
      result.push(groupItem);
      return result;
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
      //splitTradeData和backtestHistoryList也要清空
      this.splitTradeData = []
      this.backtestHistoryList = []
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
    handleCurrentChange(page) {
      this.queryInfo.page = page
      this.$nextTick(() => {
        this.splitTradeData = this.tradesData.slice(20 * (this.queryInfo.page - 1), this.queryInfo.page * 20)
      })
    },
    handleDownloadCsv() {
      if (!(this.tableData.length && this.splitTradeData.length && this.backtestHistoryList.length)) {
        this.$message.warning('No data available for download.')
        return
      }
      const summary = []
      this.tableData.forEach((item, index) => {
        const obj = {}
        obj['TOTAL RETURN %'] = isNaN(item.totalReturn) ? 0 : `${item.totalReturn}%`
        obj['Annual Return % (CAGR)'] = isNaN(item.CAGR) ? 0 : `${item.CAGR}%`
        obj['MEDIAN RETURN %'] = isNaN(item.medianReturn) ? 0 : `${item.medianReturn}%`
        obj['AVERAGE RETURN %'] = isNaN(item.averageReturn) ? 0 : `${item.averageReturn}%`
        obj['Z_SCORE'] = isNaN(item.tzScore) ? 0 : `${item.tzScore}`
        obj['STD. DEV'] = isNaN(item.standardDeviation) ? 0 : `${item.standardDeviation}`
        obj['BUY & HOLD %'] = isNaN(item.buyHoldGain) ? 0 : `${item.buyHoldGain}%`
        obj['WIN RATE %'] = isNaN(item.winRate) ? 0 : `${item.winRate}%`
        obj['AVERAGE WIN %'] = isNaN(item.averageWin) ? 0 : `${item.averageWin}%`
        obj['AVERAGE LOSS %'] = isNaN(item.averageLoss) ? 0 : `${item.averageLoss}%`
        obj['MAX RISK %'] = isNaN(item.drawDown) ? 0 : `${item.drawDown}%`
        obj['TOTAL TRADES'] = isNaN(item.totalTrades) ? 0 : `${item.totalTrades}`
        obj['TOTAL POSITIVE'] = isNaN(item.totalPositive) ? 0 : `${item.totalPositive}`
        obj['TOTAL NEGATIVE'] = isNaN(item.totalNegative) ? 0 : `${item.totalNegative}`
        obj['TIME IN MARKET %'] = isNaN(item.timeInMarket) ? 0 : `${item.timeInMarket}%`
        summary.push(obj)
      })
      const tradeData = []
      this.unSplitTadeData.forEach((item, index) => {
        const obj = {}
        obj['Trade #'] = index + 1
        obj['Trade Date'] = item.Date
        obj['Action'] = item.TradeStatus
        obj['Indicator'] = item.Indicator.join(',')
        obj['Trade Price'] = item.TradePrice
        obj['Trade Return %'] = `${item.TradeReturn}%`
        obj['Total Return %'] = `${item.Return}%`
        tradeData.push(obj)
      })
      const backtestHistoryList = []
      this.backtestHistoryList.forEach(item => {
        const obj = {}
        obj['Entry Date'] = item['Entry Date']
        obj['1 Week [%]'] = item['1 Week [%]']
        obj['2 Weeks [%]'] = item['2 Weeks [%]']
        obj['1 Month [%]'] = item['1 Month [%]']
        obj['2 Months [%]'] = item['2 Months [%]']
        obj['3 Months [%]'] = item['3 Months [%]']
        obj['6 Months [%]'] = item['6 Months [%]']
        obj['12 Months [%]'] = item['12 Months [%]']
        backtestHistoryList.push(obj)
      })
      const dataList = [summary, tradeData, backtestHistoryList];
      const sheetNames = ["Summary", "Trades", "Exit with different Time Frame"];
			// console.log('准备下载的数据 dataList', dataList)
      this.exportDataToCSV(dataList, sheetNames);
    },
		exportDataToCSV(dataList, sheetNames) {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  for (let i = 0; i < dataList.length; i++) {
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataList[i]);

    // Add the worksheet to the workbook with the given name
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[i]);
  }

  // Convert the workbook to a binary string
  const workbookBinaryString = XLSX.write(workbook, {
    type: "binary",
    bookType: "xlsx",
  });

  // Create a Blob from the binary string
  const blob = new Blob([this.s2ab(workbookBinaryString)], {
    type: "application/octet-stream",
  });

  // Create a download URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element for downloading the CSV file
  const link = document.createElement("a");
	link.style.display = "none";
  link.setAttribute("href", url);
  link.setAttribute("download", "Results.xlsx");
  link.innerHTML = "Download XLSX";
  // Append the link element to the document body
  document.body.appendChild(link);

  // Trigger the download
  link.click();
		},
// Utility function to convert a string to an ArrayBuffer
		s2ab(s) {
			const buf = new ArrayBuffer(s.length);
			const view = new Uint8Array(buf);
			for (let i = 0; i < s.length; i++) {
				view[i] = s.charCodeAt(i) & 0xff;
			}
			return buf;
		}


  }
}
</script>
<style scoped>
.hint {
	position: absolute;
	font-size: 0.8rem;
	color: black !important;
	right: 8px;
	font-weight: 300;
	margin: 0;
}

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
.pagination-container {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.trades-container p {
	width: 90%;
	font-size: 0.8rem;
}
.downLoadCsvBtn {
	position: absolute;
right: 10px;
	top: 273px;
	color: #333333;
}
</style>