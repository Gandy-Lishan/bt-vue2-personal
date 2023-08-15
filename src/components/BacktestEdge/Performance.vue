// Summary & Trades
<template>
	<div class="perfprmance-container">
		<p class="hint">
			Hint: Markers on the chart point to the buy/sell trade dates on the open
			<b>ONE</b> bar after entry/exit criteria met.
		</p>
		<el-tabs class="performance_tabs" v-model="activePerTag" type="card" v-loading="loading">
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
							label="Z-SCORE"
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
							prop="ExitReason"
							label="Exit Reason"
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
					<el-tabs v-model="activeTIM" type="card" v-loading="loading">
						<el-tab-pane label="Exit With Default Time-In-Market" name="first">
							<div class="history-container">
								<el-skeleton :rows="6" :loading="loading" animated>
									<template>
										<el-table
											:data="backtestHistoryList"
											stripe
											style="width: 100%; height: 100%"
										>
											<template v-for="(l, index) in defaultTableLabels">
												<el-table-column :label="l" :prop="l" :key="index">
													<template slot-scope="scope">
														<p class="tableText">
                              {{
                                displayData(scope.row[l])
                              }}
														</p>
													</template>
												</el-table-column>
											</template>
											<div slot="empty" style="text-align: left">
												<el-empty
													image-size="80"
													description="No Data"
												></el-empty>
											</div>
										</el-table>
									</template>
								</el-skeleton>
							</div>
							<div class="zscore-container">
								<el-skeleton :rows="2" :loading="loading" animated>
									<template>
										<el-table
											:data="result_quotes"
											:show-header="false"
											stripe
											style="width: 100%; height: 100%"
										>
											<el-table-column prop="property" label="Property">
											</el-table-column>

											<template v-for="column in periods">
												<el-table-column
													:key="column.period"
													:label="column.period"
													:prop="column.period"
												>
													<template slot-scope="scope">
														<p class="tableText">
															{{
																!Number.isNaN(scope.row[column.period])
																	? typeof scope.row[column.period] == 'string'
																		? scope.row[column.period]
																		: parseFloat(
																				scope.row[column.period]
																		  ).toFixed(1)
																	: null
															}}
														</p>
													</template>
												</el-table-column>
											</template>
										</el-table>
									</template>
								</el-skeleton>
							</div>
						</el-tab-pane>
						<el-tab-pane
							label="Exit with Customized Time-In-Market"
							name="second"
						>
							<el-button
								type="primary"
								@click="showTableDialog"
								v-if="!showTable"
								>Edit exit with different TIM</el-button
							>
							<div class="history-container">
								<el-skeleton :rows="6" :loading="loading" animated>
									<template>
										<el-table
											:data="TIMHistoryList"
											stripe
											style="width: 100%; height: 100%"
										>
											<template v-for="(l, index) in defaultTIMTableLabels">
												<el-table-column :label="l" :prop="l" :key="index">
													<template slot-scope="scope">
														<p class="tableText">
															{{ 
                              displayData(scope.row[l])
                              }}
														</p>
													</template>
												</el-table-column>
											</template>
											<div slot="empty" style="text-align: left">
												<el-empty
													image-size="80"
													description="No Data"
												></el-empty>
											</div>
										</el-table>
									</template>
								</el-skeleton>
							</div>
							<div class="zscore-container">
								<el-skeleton :rows="2" :loading="loading" animated>
									<template>
										<el-table
											:data="TIMResult_quotes"
											:show-header="false"
											stripe
											style="width: 100%; height: 100%"
										>
											<el-table-column prop="property" label="Property">
											</el-table-column>
                      
											<template v-for="column in periodsTIM">
												<el-table-column
													:key="column.period"
													:label="column.period"
													:prop="column.period"
												>
													<template slot-scope="scope">
														<p class="tableText">
															{{
																!Number.isNaN(scope.row[column.period])
																	? typeof scope.row[column.period] == 'string'
																		? scope.row[column.period]
																		: parseFloat(
																				scope.row[column.period]
																		  ).toFixed(1)
																	: null
															}}
														</p>
													</template>
												</el-table-column>
											</template>
										</el-table>
									</template>
								</el-skeleton>
							</div>
							<el-dialog
								title="Edit exit with different TIM Table"
								:visible.sync="showTable"
								width="80%"
							>
								<div>
									<el-table
										:data="editTIMData"
										style="width: 100%"
										border
										ref="table"
									>
										<el-table-column
											type="index"
											label="Index"
											width="80"
											:header-align="'center'"
											:align="'center'"
										></el-table-column>
										<el-table-column
											label="Period"
											:header-align="'center'"
											:align="'center'"
										>
											<template slot-scope="scope">
												<el-input
													style="width: 100%"
													placeholder="input period"
													v-model="scope.row.period"
												></el-input>
											</template>
										</el-table-column>
										<el-table-column
											label="Timeframe"
											:header-align="'center'"
											:align="'center'"
										>
											<template slot-scope="scope">
												<el-select
													style="width: 100%"
													v-model="scope.row.timeframe"
												>
													<!-- <el-option label="Day(s)" value="Day"></el-option>
													<el-option label="Week(s)" value="Week"></el-option>
													<el-option label="Month(s)" value="Month"></el-option> -->

                          <el-option v-if="rowFrequency == 'Daily'" label="Day(s)" value="Day"></el-option>
                          <el-option v-if="rowFrequency == 'Weekly' || rowFrequency == 'Daily'" label="Week(s)" value="Week"></el-option>
                          <el-option v-if="rowFrequency == 'Monthly' || rowFrequency == 'Daily' || rowFrequency == 'Weekly'" label="Month(s)" value="Month"></el-option>
                          <el-option v-if="rowFrequency == 'Monthly' || rowFrequency == 'Weekly'" label="Year(s)" value="Year"></el-option>
												</el-select>
											</template>
										</el-table-column>
										<el-table-column
											label="Delete"
											width="65"
											:header-align="'center'"
											:align="'center'"
										>
											<template slot-scope="scope">
												<el-button
													type="danger"
													icon="el-icon-delete"
													size="mini"
													@click="deleteRow(scope.$index)"
												></el-button>
											</template>
										</el-table-column>
									</el-table>
									<el-button
										type="primary"
										icon="el-icon-plus"
										@click="addRow"
										style="margin-top: 10px"
										>Add Row</el-button
									>
								</div>
								<div slot="footer" class="dialog-footer">
									<el-button @click="cancelTable">Cancel</el-button>
									<el-button type="primary" @click="saveTable">Save</el-button>
								</div>
							</el-dialog>
						</el-tab-pane>
					</el-tabs>
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
import { seeReport, setCustomTIM, getCustomTIM } from '@/service/service'
// import sortByRule from "@/tools/sortTIM";
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
        'Entry Date',
        '1 Week [%]',
        '2 Weeks [%]',
        '1 Month [%]',
        '2 Months [%]',
        '3 Months [%]',
        '6 Months [%]',
        '12 Months [%]'
      ],
      backtestHistoryList: [],
      unSplitTadeData: [],
      // period_dict: {
      // 	5: "1WeekReturn", 10: "2WeeksReturn", 21: "1MonthReturn", 42: "2MonthsReturn",
      // 	63: "3MonthsReturn", 126: "6MonthsReturn", 252: "12MonthsReturn"
      // },
      start_date: null,
      result_quotes: [],
      periods: [],
      periodsTIM: [],
      showTable: false,
      editTIMData: [],
      activeTIM: 'first',
      defaultTIMTableLabels: [],
      TIMHistoryList: [],
      TIMResult_quotes: [],
      editBacktestID: null,
      tradePrice: 'Close',
      rowFrequency: 'Daily'
    }
  },
  created() {
    this.getResultData({ id: 0 })
  },
  methods: {
    clearForm() {
      Object.assign(this.$data, this.$options.data())
    },
    displayData(data) {
       const numberRegex = /^-?\d+(\.\d+)?$/;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (numberRegex.test(data)) {
        return parseFloat(data);
      } else if (dateRegex.test(data)) {
        return data
      } else {
        // 如果既不是数字也不是日期，则返回空字符串，即不显示"NAN"的数据
        return '';
      }
    },
    getAllDefaultTableLabels() {
      let periodArray = [
              { period: 1, timeframe: 'Week' },
              { period: 2, timeframe: 'Week' },
              { period: 1, timeframe: 'Month' },
              { period: 2, timeframe: 'Month' },
              { period: 3, timeframe: 'Month' },
              { period: 6, timeframe: 'Month' },
              { period: 1, timeframe: 'Year' }
            ]
      const frequency = this.rowFrequency
      switch (frequency) {
        case 'Daily':
          this.defaultTableLabels = [
            'Entry Date',
            '1 Week [%]',
            '2 Weeks [%]',
            '1 Month [%]',
            '2 Months [%]',
            '3 Months [%]',
            '6 Months [%]',
            '1 Year [%]'
          ]
          this.defaultTIMTableLabels = ['Entry Date', '1 Week [%]', '1 Month [%]']
          this.editTIMData = [
            {
              period: '1',
              timeframe: 'Week'
            },
            {
              period: '1',
              timeframe: 'Month',
            }
          ]
          break;
        case 'Weekly':
          this.defaultTableLabels = [
            'Entry Date',
            '1 Week [%]',
            '2 Weeks [%]',
            '1 Month [%]',
            '2 Months [%]',
            '3 Months [%]',
            '6 Months [%]',
            '1 Year [%]'
          ]
          this.defaultTIMTableLabels = ['Entry Date', '1 Month [%]', '3 Months [%]']
          this.editTIMData = [
            {
              period: '1',
              timeframe: 'Month'
            },
            {
              period: '3',
              timeframe: 'Month',
            }
          ]
          break;
        case 'Monthly':
          this.defaultTableLabels = [
            'Entry Date',
            '1 Month [%]',
            '3 Months [%]',
            '6 Months [%]',
            '9 Months [%]',
            '1 Year [%]',
            '2 Years [%]',
            '3 Years [%]',
          ]
          periodArray = [
              { period: 1, timeframe: 'Month' },
              { period: 3, timeframe: 'Month' },
              { period: 6, timeframe: 'Month' },
              { period: 9, timeframe: 'Month' },
              { period: 1, timeframe: 'Year' },
              { period: 2, timeframe: 'Year' },
              { period: 3, timeframe: 'Year' }
            ]
          this.defaultTIMTableLabels = ['Entry Date', '6 Months [%]', '1 Year [%]']
          this.editTIMData = [
            {
              period: '6',
              timeframe: 'Month'
            },
            {
              period: '1',
              timeframe: 'Year',
            }
          ]
          break;
        default:
          break;
      }
      return periodArray
    },
    generate_table_data() {
      this.generatePeriods()
      if (this.activeTIM == 'first') {
        // 鎻愬彇灞炴€т俊鎭
        let keys = Object.keys(this.result_quotes[0])
        keys.splice(keys.indexOf('Period'), 1)
        let result = []
        for (let i = 0; i < keys.length; i++) {
          result.push({
            property: keys[i]
          })
        }
        // 灏Periods 淇℃伅鎻掑叆鍒data 涓紝灏data 缁戝畾鍒table 涓
        for (let i = 0; i < this.periods.length; i++) {
          for (let j = 0; j < result.length; j++) {
            this.result_quotes.forEach((obj) => {
              if (obj.Period === this.periods[i].period) {
                result[j][this.periods[i].period] = obj[result[j].property]
              }
            })
          }
        }
        this.result_quotes = result
      } else {
        // 鎻愬彇灞炴€т俊鎭
        let keys = Object.keys(this.TIMResult_quotes[0])
        keys.splice(keys.indexOf('Period'), 1)
        let result = []
        for (let i = 0; i < keys.length; i++) {
          result.push({
            property: keys[i]
          })
        }
        // 灏Periods 淇℃伅鎻掑叆鍒data 涓紝灏data 缁戝畾鍒table 涓
        console.log('this.periodsTIM',this.periodsTIM,this.TIMResult_quotes)
        for (let i = 0; i < this.periodsTIM.length; i++) {
          for (let j = 0; j < result.length; j++) {
            this.TIMResult_quotes.forEach((obj) => {
              if (obj.Period === this.periodsTIM[i].period) {
                result[j][this.periodsTIM[i].period] = obj[result[j].property]
              }
            })
          }
        }
        this.TIMResult_quotes = result
       
      }

    },
    generatePeriods() {
      let quotes = []
      if (this.activeTIM == 'first') {
        quotes = this.result_quotes
        let set = new Set()
        for (let i = 0; i < quotes.length; i++) {
          set.add(quotes[i].Period)
        }
        let values = Array.from(set)
        let columns = []
        for (let i = 0; i < values.length; i++) {
          columns.push({
            period: values[i]
          })
        }
        this.periods = columns
      } else {
        quotes = this.TIMResult_quotes
        // 去重
        let set = new Set()
        for (let i = 0; i < quotes.length; i++) {
          set.add(quotes[i].Period)
        }
        let values = Array.from(set)
        // 为label排序
        values = this.transformDate(values)
        values.sort((a, b) => a.value - b.value);
        values = values.map(x=>x.label)
        let columns = []
        for (let i = 0; i < values.length; i++) {
          columns.push({
            period: values[i]
          })
        }
        this.periodsTIM = columns
        
      }
    },
    async getResultData(row, callback) {
      let vm = this
      let initalData = {}
      let data = {}
      vm.editBacktestID = row.id
      // 娓呯┖performance琛ㄥ崟
      vm.clearPerformanceData()
      if (!row.id) {
        return
      }

      if (row.status != 0) {
        if (this.$store.state.favoriteBacktestRowData.id) {
          let id = row.id
          vm.activePerTag = 'first'
          vm.rowFrequency = row.frequency
          try {
            let res = null
            try {
              res = await seeReport(id)
            } catch (error) {
              // 可能是没有交易，所以需要清除当前marker，防止保留上次回测的marker

              vm.$store.dispatch('set_isMarkerShown_flag',false)
              console.error(error)
              throw Error('report error')
            }
            console.log('report res', res)

            if (res.status == 200) {
              if (typeof res.data == 'string') {
                initalData = JSON.parse(res.data)
              } else {
                initalData = res.data
              }

              // -------------------------------------  start ----------------
              this.tradePrice = initalData['basic']['trade_price'] == 0 ? 'Open' : 'Close'// tim数据计算依赖backtester创建时选择的tradePrice类别，如Close/Open

              const tradeReturn = initalData['Each Return']
              const exitReason = initalData['Exit Reason'] ? initalData['Exit Reason'] : []
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
                // 鏈変氦鏄撴墠濉〃鍗
                vm.tableData.push(data)
                vm.returnImgUrl = data.returnsFileURL
                vm.drawDownImgUrl = data.ddFileURL
                vm.monthReturnImgUrl = data.returnsHeatmapFileURL
                vm.annualReturnImgUrl = data.annualReturnsFileURL
                try {
                  for (let i = 0; i < initalData['Trades'].length; i++) {
                  if (i % 2 == 0) {
                    initalData['Trades'][i].trade_number = i / 2
                    initalData['Trades'][i + 1].trade_number = i / 2
                  }
                }

                for (let i = 0; i < initalData['Trades'].length; i++) {
                  initalData['Trades'][i].TradeReturn =
                    tradeReturn[initalData['Trades'][i].trade_number]

                  initalData['Trades'][i].ExitReason =
                    exitReason[initalData['Trades'][i].trade_number]

                  if (i % 2 !== 0) {
                    initalData['Trades'][i - 1].Return =
                      initalData['Trades'][i].Return
                  }
                }
                } catch (error) {
                  console.log(error)
                }
                vm.queryInfo.total = initalData['Trades'].length
                vm.totalTradesNumber = initalData['Trades'].length / 2
                vm.handleCurrentChange(1)
                vm.tradesData = initalData['Trades']
                vm.unSplitTadeData = vm.tradesData

                // 淇濆瓨tradesdata鍒皊tore
                this.$store.commit('getTradesData', vm.tradesData)
                const periodArray = this.getAllDefaultTableLabels()
                this.backtestHistoryList = this.calculateBacktestHistory(
                  vm.tradesData,
                  periodArray
                )
                const res = await getCustomTIM(row.id)
                let timPeriodArray = null
                try {
                  timPeriodArray = JSON.parse(res.data[0].tim_data)
                  let timeframe = vm.rowFrequency
                  if (timeframe === 'Weekly') {
                    timPeriodArray = timPeriodArray.filter(item => item.timeframe !== 'Day');
                  } else if (timeframe === 'Monthly') {
                    timPeriodArray =  timPeriodArray.filter(item => item.timeframe !== 'Day' && item.timeframe !== 'Week');
                  }
                  this.editTIMData = timPeriodArray
                } catch (error) {
                  console.error(error)
                  timPeriodArray = this.editTIMData
                }
                const transformData = this.transformData(timPeriodArray)
                transformData.sort((a, b) => a.value - b.value);
                const table = ['Entry Date']
                transformData.map((item) => {
                  table.push(item.timeframe)
                })
                this.defaultTIMTableLabels = table
                this.TIMHistoryList = this.calculateBacktestHistory(vm.tradesData, timPeriodArray)
                // 2.1涓紩鍏ュ垎鏋愬笀鐨刏Score妯″潡
                var datatime = new Date(initalData['basic']['start_date'])
                var offset = datatime.getTimezoneOffset() * 60 * 1000
                this.start_date = new Date(
                  datatime.setTime(datatime.getTime() + offset)
                )
                this.activeTIM = 'second'
                this.calculateZScore(vm.tradesData, timPeriodArray)
                this.activeTIM = 'first'
                this.calculateZScore(vm.tradesData, periodArray)
              }

              // ---------------------------------------- end ----------------------------------
              // ----------------------- backtest result-------------------------------

              this.$emit('setBacktestResult', initalData['basic'])
              // ------------------------------ end -----------------------------------
            }
          } catch (error) {
            console.error('鏈嶅姟鍣ㄦ姤閿', error)
            vm.tableData = []
            vm.tradesData = []
            // vm.$emit('errorCatchPerformance')
          }
        }
      } else {
        console.error('row status is ', row.status)
      }
      setTimeout(() => {
        if (initalData.markerSet) {
          this.loadMarker(initalData.markerSet)
        }
        if (callback) {
          callback()
        }
      }, 0)
    },
    transformDate(arr){
      // 创建一个空对象，用于存储处理后的结果
      var processeArray  = [];

      // 遍历原始数组
      for (var i = 0; i < arr.length; i++) {
        var currentItem = arr[i];

        // 将当前项拆分成数字和单位
        var parts = currentItem.split(" ");
        var value = parseInt(parts[0]);
        var unit = parts[1];

        // 将不同天数的项进行合并，根据比率转换
        if (unit === "Days") {
          if (value % 252 === 0) {
            value = value / 252;
            unit = value==1?"Year":"Years";
          }
          if (value % 21 === 0) {
            value = value / 21;
            unit = value==1?"Month":"Months";
          }
          // if (value % 5 === 0) {
          //   value = value / 5;
          //   unit = value==1?"Week":"Weeks";
          // }
        }
        if (unit === "Weeks") {
          if (value % 52 === 0) {
            value = value / 52;
            unit = value==1?"Year":"Years";
          }
          // if (value % 4 === 0) {
          //   value = value / 4;
          //   unit = value==1?"Month":"Months";
          // }
        }
        if (unit === "Months") {
          if (value % 12 === 0) {
            value = value / 12;
            unit = value==1?"Year":"Years";
          }
        }
        if(this.rowFrequency === 'Daily') {
          if (unit === "Days") {
            if (value % 5 === 0) {
              value = value / 5;
              unit = value==1?"Week":"Weeks";
            }
            if (value % 13 === 0 && unit.includes('Week')) {
              value = (value / 13) * 3;
              unit = value==1?"Month":"Months";
            }
            if(value % 12 === 0 && unit.includes('Month')) {
              value = value / 12;
              unit = value==1?"Year":"Years";
            }
          }else if (unit === "Weeks") {
            if (value % 13 === 0) {
              value = (value / 13) * 3;
              unit = value==1?"Month":"Months";
            }
            if (value % 12 === 0 && unit.includes('Month')) {
              value = value / 12;
              unit = value==1?"Year":"Years";
            }
          }else if (unit === "Months") {
            if (value % 12 === 0) {
              value = value / 12;
              unit = value==1?"Year":"Years";
            }
          }
          }else if(this.rowFrequency === 'Weekly') {
            if (unit === 'Week') {
              // if(value % 4 === 0 && value <= 8) {
              //   value = value / 4;
              //   unit = value==1?"Month":"Months"
              // }else if(value % 13 === 0 && value > 8) {
              //   value = (value / 13) * 3;
              //   unit = value==1?"Month":"Months"
              // }
              if(((value % 13) % 4) === 0) {
                if(value % 13 === 12) {
                  // 不转
                  unit = value==1?"Week":"Weeks"
                }else{
                  let num = Math.trunc(value / 13)
                  let end = (value % 13) / 4
                  value = num * 3 + end
                  unit = value==1?"Month":"Months"
                }
              }
              if (value % 12 === 0  && unit.includes('Month')) {
                value = value / 12;
                unit = value==1?"Year":"Years";
              }
            } else if (unit === 'Month') {
              if (value % 12 === 0) {
                value = value / 12;
                unit = value==1?"Year":"Years";
              }
            }
        }else if(this.rowFrequency === 'Monthly') {
          if (unit === 'Month') {
            if (value % 12 === 0) {
              value = value / 12;
            }
          }
        }

        // 生成新的项
        var newItem = value + " " + unit;

        // 将新的项添加到 processedObj，使用项作为键名
        let res
        switch(unit){
          case "Days":
            res = 1*value
            break
          case "Day":
            res = 1*value
            break
          case "Weeks":
            res = 5*value
            break
          case "Week":
            res = 5*value
            break
          case "Months":
            res = 21*value
            break
          case "Month":
            res = 21*value
            break
          case "Years":
            res = 252*value
            break
           case "Year":
            res = 252*value
            break
          default:
            break
        }
        if(processeArray.map(x=>x.label).indexOf(newItem) == -1) processeArray.push({label:newItem,value:res})
        //processedObj[newItem] = res;
      }
      //console.log(processedObj)
      // 提取处理后的结果数组
     // var processedArray = Object.keys(processedObj);

      return processeArray;
    },
    transformData(data) {
      //console.log('trnasformData', data)
      data = data.map(item => {
        if (item.period % 252 === 0 && item.timeframe === 'Day') {
          return { period: item.period / 252, timeframe: 'Year' }
        }
        if (item.period % 21 === 0 && item.timeframe === 'Day') {
          return { period: item.period / 21, timeframe: 'Month' }
        }
        // if (item.period % 5 === 0 && item.timeframe === 'Day') {
        //   return { period: item.period / 5, timeframe: 'Week' }
        // }
        if (item.period % 52 === 0 && item.timeframe === 'Week') {
          return { period: item.period / 52, timeframe: 'Year' }
        }
        // if (item.period % 4 === 0 && item.timeframe === 'Week') {
        //   return { period: item.period / 4, timeframe: 'Month' }
        // }
        if (item.period % 12 === 0 && item.timeframe === 'Month') {
          return { period: item.period / 12, timeframe: 'Year' }
        }
        return item
      })

      // 更正一直判断到 Year
      data = data.map(item => {
        let period = item.period;
        let timeframe = item.timeframe;
        if(this.rowFrequency === 'Daily') {
        if (timeframe === 'Day') {
          if(period % 5 === 0) {
            period = period / 5;
            timeframe = 'Week';
          }
          if (period % 13 === 0 && timeframe.includes('Week')) {
            period = (period / 13) * 3;
            timeframe = 'Month';
          }
          if(period % 12 === 0 && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Week') {
          if (period % 13 === 0) {
            period = (period / 13) * 3;
            timeframe = 'Month';
          }
          if (period % 12 === 0 && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Month') {
          if (period % 12 === 0) {
            period = period / 12;
            timeframe = 'Year';
          }
        }
        return { period, timeframe }
        }else if(this.rowFrequency === 'Weekly') {
        if (timeframe === 'Week') {
          // if(period % 4 === 0 && period <= 8) {
          //   period = period / 4;
          //   timeframe = 'Month';
          // }else if(period % 13 === 0 && period > 8) {
          //   period = (period / 13) * 3;
          //   timeframe = 'Month';
          // }
          if(((period % 13) % 4) === 0) {
            if(period % 13 === 12) {
              // 不转
              timeframe = "Week"
            }else{
              let num = Math.trunc(period / 13)
              let end = (period % 13) / 4
              period = num * 3 + end
              timeframe = 'Month';
            }
          }
          if (period % 12 === 0  && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Month') {
          if (period % 12 === 0) {
            period = period / 12;
            timeframe = 'Year';
          }
        }
        return { period, timeframe }
        }else if(this.rowFrequency === 'Monthly') {
          if (timeframe === 'Month') {
            if (period % 12 === 0) {
              period = period / 12;
            }
          }
        return { period, timeframe }
        }
        })
      const uniqueData = [];
      data.forEach(item => {
        const isDuplicate = uniqueData.some(
          uniqueItem =>
            uniqueItem.period == item.period && uniqueItem.timeframe == item.timeframe
        );

        if (!isDuplicate) {
          uniqueData.push(item);
        }
      });
      /* 
      1month = 1Bar, 3Month = 3 Bars, 6Months=6Bars, 9Months = 9 Bars, 1year = 12Bars, 2 years = 24 Bars, 3years = 36Bars.
      */
      const frequency = this.rowFrequency
      return uniqueData.map((item) => {
        let timeframe =
          item.period > 1
            ? `${item.period} ${item.timeframe}s [%]`
            : `${item.period} ${item.timeframe} [%]`
        let value
        if(frequency == 'Daily') {
        switch (item.timeframe) {
          case 'Day':
            value = Number(item.period)
            break
          case 'Week':
            value = Number(item.period) * 5
            break
          case 'Month':
            value = Number(item.period) * 21
            break
          case 'Year':
            value = Number(item.period) * 252
            break
          default:
            break
        }
        }else 
        if(frequency == 'Weekly') {
        switch (item.timeframe) {
          case 'Week':
            value = Number(item.period)
            break
          case 'Month':
            const period = Number(item.period)
            let num_3 = null
              num_3 = Math.trunc(period / 3) // 去除小数点取整数
              let end_3 = period % 3 // 余数
            // value = num_3 === null ? period * 4 : period * 4 + num_3
            value = num_3 * 13 + end_3 * 4
            break
          case 'Year':
            value = Number(item.period) * 52
            break
          default:
            break
        }
        }else 
        if(frequency == 'Monthly') {
        switch (item.timeframe) {
          case 'Month':
            value = Number(item.period)
            break
          case 'Year':
            value = Number(item.period) * 12
            break
          default:
            break
        }
        }
        return { timeframe, period: item.period, value }
      })
    },
    calculateBacktestHistory(dataSet, periodArray) {
      /*
      periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
      */
      let chartDataset = CIQ.stxx.chart.dataSet
      const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
      const field = this.tradePrice
      dataSet = dataSet.filter((item) => item.TradeStatus == 'BUY')
      let backtestResult = []

      for (var data in dataSet) {
        var datatime = new Date(dataSet[data].Date)

        var offset = datatime.getTimezoneOffset() * 60 * 1000
        var entryDate = new Date(datatime.setTime(datatime.getTime() + offset))

        let res = chartDataset.findIndex((x) => {
          return entryDate.getTime() == x.DT.getTime()
        })

        if (res != -1) {
          //鎷胯繘鍦轰环鏍煎拰鍓嶄竴澶╀綔姣旇緝
          let entryPrice = chartDataset[res][field]
          const transformData = this.transformData(periodArray)
          transformData.sort((a, b) => a.value - b.value);
          let obj = {}
          transformData.map((item) => {
            let exitBar = chartDataset[res + item.value]
              ? (
                ((direction == 'Short'
                  ? entryPrice - chartDataset[res + item.value][field]
                  : chartDataset[res + item.value][field] - entryPrice) /
                  entryPrice) *
                100
              ).toFixed(2)
              : ''
            obj[item.timeframe] = exitBar
          })
          backtestResult.push({ 'Entry Date': dataSet[data].Date, ...obj })
        }
      }
      return backtestResult
    },
    transformZScoreData(data) {
      data = data.map(item => {
        if (item.period % 252 === 0 && item.timeframe === 'Day') {
          return { period: item.period / 252, timeframe: 'Year' }
        }
        if (item.period % 21 === 0 && item.timeframe === 'Day') {
          return { period: item.period / 21, timeframe: 'Month' }
        }
        // if (item.period % 5 === 0 && item.timeframe === 'Day') {
        //   return { period: item.period / 5, timeframe: 'Week' }
        // }
        if (item.period % 52 === 0 && item.timeframe === 'Week') {
          return { period: item.period / 52, timeframe: 'Year' }
        }
        // if (item.period % 4 === 0 && item.timeframe === 'Week') {
        //   return { period: item.period / 4, timeframe: 'Month' }
        // }
        if (item.period % 12 === 0 && item.timeframe === 'Month') {
          return { period: item.period / 12, timeframe: 'Year' }
        }
        return item
      })
      data = data.map(item => {
        let period = item.period;
        let timeframe = item.timeframe;
        if(this.rowFrequency === 'Daily') {
        if (timeframe === 'Day') {
          if(period % 5 === 0) {
            period = period / 5;
            timeframe = 'Week';
          }
          if (period % 13 === 0 && timeframe.includes('Week')) {
            period = (period / 13) * 3;
            timeframe = 'Month';
          }
          if(period % 12 === 0 && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Week') {
          if (period % 13 === 0) {
            period = (period / 13) * 3;
            timeframe = 'Month';
          }
          if (period % 12 === 0 && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Month') {
          if (period % 12 === 0) {
            period = period / 12;
            timeframe = 'Year';
          }
        }
        return { period, timeframe }
        }else if(this.rowFrequency === 'Weekly') {
        if (timeframe === 'Week') {
          // if(period % 4 === 0 && period <= 8) {
          //   period = period / 4;
          //   timeframe = 'Month';
          // }else if(period % 13 === 0 && period > 8) {
          //   period = (period / 13) * 3;
          //   timeframe = 'Month';
          // }
          if(((period % 13) % 4) === 0) {
            if(period % 13 === 12) {
              // 不转
              period = period
              timeframe = "Week"
            }else{
              let num = Math.trunc(period / 13)
              let end = (period % 13) / 4
              period = num * 3 + end
              timeframe = 'Month';
            }
          }
          if (period % 12 === 0  && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Month') {
          if (period % 12 === 0) {
            period = period / 12;
            timeframe = 'Year';
          }
        }
        return { period, timeframe }
        }else if(this.rowFrequency === 'Monthly') {
          if (timeframe === 'Month') {
            if (period % 12 === 0) {
              period = period / 12;
            }
          }
        return { period, timeframe }
        }
        })
      return data.map((item) => {
        let timeframe =
          item.period > 1
            ? `${item.period} ${item.timeframe}s`
            : `${item.period} ${item.timeframe}`
        let value
        const frequency = this.rowFrequency
        if(frequency == 'Daily') {
        switch (item.timeframe) {
          case 'Day':
            value = Number(item.period)
            break
          case 'Week':
            value = Number(item.period) * 5
            break
          case 'Month':
            value = Number(item.period) * 21
            break
          case 'Year':
            value = Number(item.period) * 252
            break
          default:
            break
        }
        }else 
        if(frequency == 'Weekly') {
        switch (item.timeframe) {
          case 'Week':
            value = Number(item.period)
            break
          case 'Month':
            const period = Number(item.period)
            // if(period % 3 == 0) {
            //   num_3 = Math.trunc(period / 3) // 去除小数点取整数
            // }
            // value = num_3 === null ? period * 4 : period * 4 + num_3
            let num_3 = null
              num_3 = Math.trunc(period / 3) // 去除小数点取整数
              let end_3 = period % 3 // 余数
            // value = num_3 === null ? period * 4 : period * 4 + num_3
            value = num_3 * 13 + end_3 * 4
            break
          case 'Year':
            value = Number(item.period) * 52
            break
          default:
            break
        }
        }else 
        if(frequency == 'Monthly') {
        switch (item.timeframe) {
          case 'Month':
            value = Number(item.period)
            break
          case 'Year':
            value = Number(item.period) * 12
            break
          default:
            break
        }
        }

        return { timeframe, period: item.period, value }
      })
    },
    calculateZScore(dataSet, periodArray) {
      /*
      periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
      */
      // masterData涓嶅寘鍚玦ndicator value,闃叉鏃爋hlcv鐨勬儏鍐
      let period_dict = this.transformZScoreData(periodArray)
      let quotes = CIQ.stxx.chart.masterData
      const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
      for (var i in period_dict) {
        quotes = this.generate_period_data(
          period_dict[i].timeframe,
          quotes,
          period_dict[i].value,
          direction
        )
      }
      // 鏁版嵁鍒囩墖
      quotes = quotes.filter((x) => {
        return this.start_date.getTime() <= x.DT.getTime()
      })
      //鎶婁氦鏄撳垪琛ㄨ浆鎹㈡垚鏃堕棿鎴
      let dataTimeList = []
      for (var data in dataSet) {
        if (dataSet[data].TradeStatus != 'BUY') continue
        var datatime = new Date(dataSet[data].Date)
        var offset = datatime.getTimezoneOffset() * 60 * 1000
        var entryDate = new Date(
          datatime.setTime(datatime.getTime() + offset)
        ).getTime()
        dataTimeList.push(entryDate)
      }
      let used_quotes = quotes.filter(
        (x) => dataTimeList.indexOf(x.DT.getTime()) != -1
      )
      //鏇挎崲NaN
      quotes = quotes.map((quote) => {
        const updatedQuote = {}
        for (const [key, value] of Object.entries(quote)) {
          updatedQuote[key] = isNaN(value) ? -100 : value
        }
        return updatedQuote
      })

      let median_list = [],
        positive_list = [],
        max_loss_list = [],
        max_gain_list = [],
        z_score_list = []
      for (var i in period_dict) {
        let temp_median = this.calculate_median(
          used_quotes.map((obj) => obj[period_dict[i].timeframe])
        )
        median_list.push(temp_median)
        positive_list.push(
          this.calculate_win_rate(
            used_quotes.map((obj) => obj[period_dict[i].timeframe])
          )
        )
        if (direction == 'Short') {
          max_loss_list.push(
            this.calculate_median(
              used_quotes.map((obj) => obj['MaxGain' + period_dict[i].value])
            )
          )
          max_gain_list.push(
            this.calculate_median(
              used_quotes.map((obj) => obj['MaxLoss' + period_dict[i].value])
            )
          )
        } else {
          max_loss_list.push(
            this.calculate_median(
              used_quotes.map((obj) => obj['MaxLoss' + period_dict[i].value])
            )
          )
          max_gain_list.push(
            this.calculate_median(
              used_quotes.map((obj) => obj['MaxGain' + period_dict[i].value])
            )
          )
        }

        let temp_std = this.calculate_std(
          used_quotes.map((obj) => obj[period_dict[i].timeframe])
        )
        let temp_mean = this.calculate_mean(
          quotes.map((obj) => obj[period_dict[i].timeframe])
        )
        z_score_list.push(
          parseFloat(
            (
              (temp_median - temp_mean) /
              (temp_std / Math.sqrt(used_quotes.length))
            ).toFixed(1)
          )
        )

        //  console.log(period_dict[period_list[i]] + ': ',used_quotes.map(obj=>obj[period_dict[period_list[i]]]))

        //  console.log('positive_list',positive_list)
        //  console.log("MaxLoss" + period_list[i] + ': ',used_quotes.map(obj=>obj["MaxLoss" + period_list[i]]))
        //  console.log("MaxGain" + period_list[i] + ': ',used_quotes.map(obj=>obj["MaxGain" + period_list[i]]))
        //  console.log('max_loss_list',max_loss_list)
        //  console.log('max_gain_list',max_gain_list)
        //  console.log('z_score_list',z_score_list)
      }
      const res = period_dict.map((val, i) => ({
        Period: val['timeframe'],
        Median: median_list[i],
        '% Positive': isNaN(positive_list[i]) ? '' : Math.round(positive_list[i] * 100) + ' %',
        'Avg Max Loss': (!median_list[i] && median_list[i]!=0) ? NaN : max_loss_list[i],
        'Avg Max Gain': (!median_list[i] && median_list[i]!=0) ? NaN : max_gain_list[i],
        'Z-Score': z_score_list[i]
      }))
      if (this.activeTIM == 'first') {
        this.result_quotes = res
      } else {
        // 重命名periods属性，和上方表格label一致
        this.TIMResult_quotes = res
        // 去重
        // 使用一个 Map 来辅助去重
        const map = new Map();

        // 遍历 data 数组
        this.TIMResult_quotes.forEach(item => {
          // 将 name 作为键，如果之前没有存储过该 name，则将整个对象存储到 Map 中
          if (!map.has(item.Period)) {
            map.set(item.Period, item);
          }
        });

        // 使用 Array.from 将 Map 转换回数组
        this.TIMResult_quotes = Array.from(map.values());

        let TIMResult_quotes_periods = this.TIMResult_quotes.map(x=>x.Period)
        TIMResult_quotes_periods = this.transformDate(TIMResult_quotes_periods)
        TIMResult_quotes_periods = TIMResult_quotes_periods.map(x=>x.label)

        this.TIMResult_quotes = this.TIMResult_quotes.map((obj,index) => {
          if(TIMResult_quotes_periods.includes(obj.Period)) {
            return obj
          }else{
            return null
          }
        })
        this.TIMResult_quotes = this.TIMResult_quotes.filter(item=>item!=null)
      }
      this.generate_table_data()
    },
    calculate_std(arr) {
      arr = arr.filter(function (x) {
        return !isNaN(x) // 鍓旈櫎NaN鍊約
      })
      if (arr.length == 0) return NaN

      const mean =
        arr.reduce(function (a, b) {
          return a + b
        }) / arr.length // 璁＄畻骞冲潎鏁
      const deviationArr = arr.map(function (x) {
        return Math.pow(x - mean, 2)
      })

      const variance =
        deviationArr.reduce(function (a, b) {
          return a + b
        }) /
        (deviationArr.length - 1) // 璁＄畻鏂瑰樊锛屼娇鐢ㄨ嚜鐢卞害=1

      const std = Math.sqrt(variance) // 璁＄畻鏍囧噯宸
      return std
    },
    calculate_win_rate(arr) {
      arr = arr.filter(function (x) {
        return !isNaN(x) // 鍓旈櫎NaN鍊約
      })
      if (arr.length == 0) return NaN

      let return_series = arr.map((x) => (x > 0 ? 1 : 0))
      return parseFloat(this.calculate_mean(return_series).toFixed(2))
    },
    calculate_mean(arr) {
      if (arr.length == 0) return NaN
      return arr.reduce((a, b) => a + b) / arr.length
    },
    calculate_median(arr) {
      arr = arr.filter((n) => !isNaN(n))
      if (arr.length == 0) return NaN
      const mid = Math.floor(arr.length / 2)
      const nums = [...arr].sort((a, b) => a - b)
      return parseFloat(
        (arr.length % 2 !== 0
          ? nums[mid]
          : (nums[mid - 1] + nums[mid]) / 2
        ).toFixed(1)
      )
    },
    generate_period_data(name, quotes, period, direction) {
      const field = this.tradePrice
      quotes = quotes.map((row, i) => {
        if (i < quotes.length - period) {
          //const change = parseFloat((100 * (quotes[i + period][field] / row[field] - 1)).toFixed(1))
          const change = parseFloat(
            (
              ((direction == 'Short'
                ? row[field] - quotes[i + period][field]
                : quotes[i + period][field] - row[field]) /
                row[field]) *
              100
            ).toFixed(1)
          )
          return {
            ...row,
            [field + period]: quotes[i + period][field],
            [name]: (change==Infinity || change==-Infinity) ? 0 : change
          }
        } else {
          return {
            ...row,
            [field + period]: NaN,
            [name]: NaN
          }
        }
      })
      const minCloseArr = this.get_period_parm(
        quotes.map((row) => row[field + period]),
        'min',
        period
      )
      const maxCloseArr = this.get_period_parm(
        quotes.map((row) => row[field + period]),
        'max',
        period
      )
      quotes = quotes.map((row, i) => {
        if (i >= period) {
          const change = parseFloat(
            (100 * (minCloseArr[i] / row[field] - 1)).toFixed(1)
          )
          return {
            ...row,
            ['MaxLoss' + period]: (change==Infinity || change==-Infinity) ? 0 : change
          }
        } else {
          return {
            ...row,
            ['MaxLoss' + period]: NaN
          }
        }
      })
      quotes = quotes.map((row, i) => {
        if (i >= period) {
          const change = parseFloat(
            (100 * (maxCloseArr[i] / row[field] - 1)).toFixed(1)
          )
          return {
            ...row,
            ['MaxGain' + period]: (change==Infinity || change==-Infinity) ? 0 : change
          }
        } else {
          return {
            ...row,
            ['MaxGain' + period]: NaN
          }
        }
      })

      return quotes
    },
    get_period_parm(dataSeries, paramType, period) {
      const typeDict = {
        max: Math.max,
        min: Math.min,
        mean: (arr) => arr.reduce((a, b) => a + b) / arr.length,
        sum: (arr) => arr.reduce((a, b) => a + b)
      }

      const dataArr = []

      for (let i = 0; i < dataSeries.length; i++) {
        if (i >= period) {
          const tmpData = typeDict[paramType](
            ...dataSeries.slice(i - period, i).filter((n) => !isNaN(n))
          )
          dataArr.push(Number(tmpData.toFixed(3)))
        } else {
          dataArr.push(NaN)
        }
      }
      return dataArr
    },
    loadMarker(markerSet) {
      try {
        //load markers for initial quotefeed

        let list = this.filterMarkerDate(
          new Date(CIQ.initialDate.start),
          new Date(CIQ.initialDate.end),
          markerSet
        )
        this.$store.dispatch('set_isMarkerShown_flag',true)

        // split the markers into several groups
        CIQ.groups = this.group(list)
        let markers = CIQ.groups.pop()

        // if the last groups has no enough number of items, merge it with the last one
        //console.log('CIQ.stxx.chart.xaxis[0]',CIQ.stxx.chart.xaxis[0])
        let c_date = jutils.formatDate(CIQ.stxx.chart.xaxis[0].DT, 'YYYYMMDD')
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
      var result = []
      var groupItem
      for (var i = 0; i < data.length; i++) {
        if (i % 500 == 0) {
          groupItem != null && result.push(groupItem)
          groupItem = []
        }
        groupItem.push(data[i])
      }
      result.push(groupItem)
      return result
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
      //splitTradeData鍜宐acktestHistoryList涔熻娓呯┖
      this.splitTradeData = []
      this.backtestHistoryList = []
      this.returnImgUrl = ''
      this.drawDownImgUrl = ''
      this.monthReturnImgUrl = ''
      this.annualReturnImgUrl = ''

      this.TIMHistoryList = []
      this.TIMResult_quotes = []
      this.result_quotes = []
      this.periodsTIM = []
      this.periods = []
      this.activeTIM = 'first'
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
      if (columnIndex === 7) {
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
        this.splitTradeData = this.tradesData.slice(
          20 * (this.queryInfo.page - 1),
          this.queryInfo.page * 20
        )
      })
    },
    handleDownloadCsv() {
      if (
        !(
          this.tableData.length &&
          this.splitTradeData.length &&
          this.backtestHistoryList.length
        )
      ) {
        this.$message.warning('No data available for download.')
        return
      }
      const summary = []
      this.tableData.forEach((item, index) => {
        const obj = {}
        obj['TOTAL RETURN %'] = isNaN(item.totalReturn)
          ? 0
          : `${item.totalReturn}%`
        obj['Annual Return % (CAGR)'] = isNaN(item.CAGR) ? 0 : `${item.CAGR}%`
        obj['MEDIAN RETURN %'] = isNaN(item.medianReturn)
          ? 0
          : `${item.medianReturn}%`
        obj['AVERAGE RETURN %'] = isNaN(item.averageReturn)
          ? 0
          : `${item.averageReturn}%`
        obj['Z_SCORE'] = isNaN(item.tzScore) ? 0 : `${item.tzScore}`
        obj['STD. DEV'] = isNaN(item.standardDeviation)
          ? 0
          : `${item.standardDeviation}`
        obj['BUY & HOLD %'] = isNaN(item.buyHoldGain)
          ? 0
          : `${item.buyHoldGain}%`
        obj['WIN RATE %'] = isNaN(item.winRate) ? 0 : `${item.winRate}%`
        obj['AVERAGE WIN %'] = isNaN(item.averageWin)
          ? 0
          : `${item.averageWin}%`
        obj['AVERAGE LOSS %'] = isNaN(item.averageLoss)
          ? 0
          : `${item.averageLoss}%`
        obj['MAX RISK %'] = isNaN(item.drawDown) ? 0 : `${item.drawDown}%`
        obj['TOTAL TRADES'] = isNaN(item.totalTrades)
          ? 0
          : `${item.totalTrades}`
        obj['TOTAL POSITIVE'] = isNaN(item.totalPositive)
          ? 0
          : `${item.totalPositive}`
        obj['TOTAL NEGATIVE'] = isNaN(item.totalNegative)
          ? 0
          : `${item.totalNegative}`
        obj['TIME IN MARKET %'] = isNaN(item.timeInMarket)
          ? 0
          : `${item.timeInMarket}%`
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
        obj['Exit Reason'] = item.ExitReason
        obj['Trade Return %'] = `${item.TradeReturn}%`
        obj['Total Return %'] = `${(item.Return * 100).toFixed(2)}%`
        tradeData.push(obj)
      })
      const backtestHistoryList = []
      this.backtestHistoryList.forEach((item) => {
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
      const dataList = [
        summary,
        tradeData,
        backtestHistoryList,
        this.TIMHistoryList
      ]
      const sheetNames = [
        'Summary',
        'Trades',
        'Exit with default Time Frame',
        'Exit with Customized TIM'
      ]
      // console.log('鍑嗗涓嬭浇鐨勬暟鎹dataList', dataList)
      this.exportDataToCSV(dataList, sheetNames)
    },
    exportDataToCSV(dataList, sheetNames) {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      for (let i = 0; i < dataList.length; i++) {
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataList[i])

        // Add the worksheet to the workbook with the given name
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[i])
      }

      // Convert the workbook to a binary string
      const workbookBinaryString = XLSX.write(workbook, {
        type: 'binary',
        bookType: 'xlsx'
      })
      // Create a Blob from the binary string
      const blob = new Blob([this.s2ab(workbookBinaryString)], {
        type: 'application/octet-stream'
      })

      // Create a download URL for the Blob
      const url = URL.createObjectURL(blob)

      // Create a link element for downloading the CSV file
      const link = document.createElement('a')
      link.style.display = 'none'
      link.setAttribute('href', url)
      link.setAttribute('download', 'Results.xlsx')
      link.innerHTML = 'Download XLSX'
      // Append the link element to the document body
      document.body.appendChild(link)

      // Trigger the download
      link.click()
    },
    // Utility function to convert a string to an ArrayBuffer
    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
    addRow() {
      if (this.editTIMData.length >= 10) {
        this.$message.warning('Cannot add more than 10 rows.')
        return
      }
      const frequency = this.rowFrequency
      console.log('frequency--------', frequency)
      let newRow = null
      switch (frequency) {
        case 'Daily':
          newRow = {
            period: '1',
            timeframe: 'Day'
          }
          break;
        case 'Weekly':
          newRow = {
            period: '1',
            timeframe: 'Week'
          }
          break;
        case 'Monthly':
          newRow = {
            period: '1',
            timeframe: 'Month'
          }
          break;
      
        default:
          break;
      }
      this.editTIMData.push(newRow);
    },
    getValues() {
      return this.editTIMData.map(row => {
        return { period: row.period, timeframe: row.timeframe };
      });
    },
    showTableDialog() {
      this.showTable = true;
    },
    async saveTable() {
      this.showTable = false;
      if (this.tradesData.length === 0) {
        this.$message.warning('No computable trades.')
        return
      }
      // 如果row删除为空，其他数据也要清空
      if (this.editTIMData.length === 0) {
        this.editTIMData = []
        // this.getAllDefaultTableLabels()
        this.defaultTIMTableLabels = []
        this.TIMHistoryList = []
        this.TIMResult_quotes = []
      }
      const f1 = Array.isArray(this.editTIMData) && !this.editTIMData.length
      if (f1) {
        return
      }
      CIQ.addCover('Calculating...')
      CIQ.nprogress.start()
      try {
        const periodArray = this.getValues()
        const isValid = this.validateData(periodArray)
        if (!isValid) {
          CIQ.hideCover()
          CIQ.nprogress.done()
          return
        }
        const uniqueData = [];
        periodArray.forEach(item => {
          const isDuplicate = uniqueData.some(
            uniqueItem =>
              uniqueItem.period === item.period && uniqueItem.timeframe === item.timeframe
          );

          if (!isDuplicate) {
            uniqueData.push(item);
          }
        });
        // 去重
        this.editTIMData = uniqueData
        const transformData = this.transformData(uniqueData)
        transformData.sort((a, b) => a.value - b.value);
        const table = ['Entry Date']
        transformData.map((item) => {
          table.push(item.timeframe)
        })
        this.defaultTIMTableLabels = table
        const data = this.calculateBacktestHistory(this.tradesData, uniqueData)
        this.$nextTick(() => {
          this.TIMHistoryList = data
        })
        this.calculateZScore(this.tradesData, uniqueData)
        //this.resetTable()
        const reqData = {
          backtest_id: this.editBacktestID,
          tim_data: uniqueData,
        }
        const res = await setCustomTIM(reqData)
      } catch (error) {
        console.log(error)
      }
      CIQ.hideCover()
      CIQ.nprogress.done()
    },
    cancelTable() {
      this.showTable = false;
      // this.resetTable();
    },
    resetTable() {
      this.editTIMData = [
        { period: '1', timeframe: 'Week' },
        { period: '1', timeframe: 'Month' }
      ]
    },
    validateData(data) {
      for (const item of data) {
        if (item.timeframe === 'Day' || item.timeframe === 'Days') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 252 || !Number.isInteger(Number(item.period))) {
            this.$message.warning('When the Timeframe is selected as Day(s), only positive integers between 1 and 252 are allowed to be entered.');
            return false;
          }
        }
        if (item.timeframe === 'Week' || item.timeframe === 'Weeks') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 52 || !Number.isInteger(Number(item.period))) {
            this.$message.warning('When the Timeframe is selected as Week(s), only positive integers between 1 and 52 are allowed to be entered.');
            return false;
          }
        }
        if (item.timeframe === 'Month' || item.timeframe === 'Months') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 120 || !Number.isInteger(Number(item.period))) {
            this.$message.warning('When the Timeframe is selected as Month(s), only positive integers between 1 and 120 are allowed to be entered.');
            return false;
          }
        }
      }
      return true;
    },
    deleteRow(index) {
      this.editTIMData.splice(index, 1)
      if (this.editTIMData.length === 0) {
        // this.editTIMData = []
        // // this.getAllDefaultTableLabels()
        // this.defaultTIMTableLabels = []
        // this.TIMHistoryList = []
        // this.TIMResult_quotes = []
        return
      }
    }
  }
}
</script>
<style scoped>
.zscore-container {
	border-top: solid 3px #00000042 !important;
}
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
	right: 28px;
	top: 320px;
	color: #333333;
}
.el-dialog .el-dialog__body .el-table /deep/.cell {
	padding-left: 0;
	padding-right: 0;
}
.el-dialog .el-dialog__body .el-table /deep/.el-input__inner {
	margin-left: 0;
}
.el-dialog__wrapper /deep/.el-dialog {
	width: 50% !important;
}
.el-table /deep/ th,
.el-table /deep/ td {
	text-align: center;
}
</style>