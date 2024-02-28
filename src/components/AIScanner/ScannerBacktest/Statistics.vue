<template>
	<div class="statistics-container">
		<div class="statistics-title">
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
		<div>
			<el-table header-align="center" class="CPM-summary" :data="summaryData" size="small">
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
						<span v-else-if="isNaN(scope.row.totalReturn)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.totalReturn + '%'
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
						<span
							v-else-if="
								isNaN(scope.row.medianReturn) ||
								!scope.row.medianReturn ||
								scope.row.medianReturn == 'null' ||
								scope.row.medianReturn == '0'
							"
						></span>
						<span v-else style="color: #dd3a13">{{
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
						<span
							v-else-if="
								isNaN(scope.row.averageReturn) ||
								!scope.row.averageReturn ||
								scope.row.averageReturn == 'null' ||
								scope.row.averageReturn == '0'
							"
						></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.averageReturn + '%'
						}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column
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
                    <span v-else style="color: #dd3a13">{{ scope.row.tzScore }}</span>
                </template>
            </el-table-column> -->
				<!-- <el-table-column
							show-overflow-tooltip
							prop="standardDeviation"
							label="STD. DEV"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.standardDeviation >= 0">{{
									scope.row.standardDeviation
								}}</span>
								<span v-else-if="isNaN(scope.row.standardDeviation) || !scope.row.standardDeviation || scope.row.standardDeviation=='null' || scope.row.standardDeviation=='0'"></span>
								<span v-else style="color: #dd3a13">{{
									scope.row.standardDeviation
								}}</span>
							</template>
						</el-table-column> -->
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
                    <span v-else style="color: #dd3a13">{{ scope.row.tzScore }}</span>
                </template>
            </el-table-column>
				<el-table-column
					prop="winRate"
					label="WIN RATE %"
					show-overflow-tooltip
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.winRate >= 0">{{
							scope.row.winRate + '%'
						}}</span>
						<span v-else-if="isNaN(scope.row.winRate)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.winRate + '%'
						}}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-table class="CPM-summary" header-align="center" :data="summaryData" size="small">
			</el-table>
			<el-table class="CPM-summary" header-align="center" :data="summaryData" size="small">
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
						<span v-else-if="isNaN(scope.row.averageWin)"></span>
						<span v-else style="color: #dd3a13">{{
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
						<span v-else-if="isNaN(scope.row.averageLoss)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.averageLoss + '%'
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="totalTrades"
					label="TOTAL TRADES"
					show-overflow-tooltip
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.totalTrades >= 0">{{
							scope.row.totalTrades
						}}</span>
						<span v-else style="color: #dd3a13">{{
							scope.row.totalTrades
						}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column
							show-overflow-tooltip
							prop="maxRisk"
							label="MAX RISK%"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.maxRisk >= 0">{{
									scope.row.maxRisk + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.maxRisk) || !scope.row.maxRisk || scope.row.maxRisk=='null' || scope.row.maxRisk=='0'"></span>
								<span v-else style="color: #dd3a13">{{
									scope.row.maxRisk + '%'
								}}</span>
							</template>
						</el-table-column> -->
			</el-table>
			<el-table class="CPM-summary" header-align="center" :data="summaryData">
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
						<span v-else style="color: #dd3a13">{{
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
						<span v-else style="color: #dd3a13">{{
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
						<span v-else-if="isNaN(scope.row.timeInMarket)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.timeInMarket + '%'
						}}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="CPM-trades">
			<el-table
					:data="paginatedData"
					class="trades-table ScannerBTTable"
					size="small"
					stripe
        >
            <el-table-column
                show-overflow-tooltip
                prop="TradeNumber"
                label="#"
                width="50px"
                align="center"
            >
            <template slot-scope="scope">
                {{ Number(scope.row.TradeNumber) + 1 }}
            </template>
            </el-table-column>
						<el-table-column
							prop="Symbol"
							label="Symbol"
							align="center"
							width="100px"
							show-overflow-tooltip
            >
						</el-table-column>
						<el-table-column
							prop="Signal"
							label="Signal"
							align="center"
							show-overflow-tooltip
            >
            </el-table-column>
						<el-table-column
							prop="Direction"
							label="Direction"
							align="center"
							width="100px"
							show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="EntryDate"
                label="Entry Date"
                align="center"
								width="120px"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="EntryAction"
                label="Entry Action"
								width="120px"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="EntryPrice"
                label="Entry Price"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="ExitDate"
                label="Exit Date"
                align="center"
								width="120px"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="ExitAction"
                label="Exit Action"
                align="center"
								width="120px"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="ExitPrice"
                label="Exit Price"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="FloatProfit"
                label="Float Profit %"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.FloatProfit >= 0"
                        >{{ scope.row.FloatProfit }}%</span
                    >
                    <span v-else-if="scope.row.FloatProfit < 0" style="color: #dd3a13"
                        >{{ scope.row.FloatProfit }}%</span
                    >
                    <span v-else>{{ '' }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="ExitReason"
                label="Exit Reason"
                align="center"
            >
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
		</div>
	</div>
</template>
<script>
const XLSX = require('xlsx')

export default {
	name: 'Statistics',
	props: {
		tradesData: Array,
	},
	data() {
		return {
			summaryData: [{}],
			tradesData: [],
			queryInfo: {
				total: 0,
				page: 1
			},
			totalTradesNumber: 0,
			processedTradesData: [],
			textContent: {
					'MarketCondition': 'Indicates the market environment for this transaction:<br/> "Bear" stands for "Bear Market",<br/> "Bull" stands for "Bull Market",<br/> "Rec" stands for "Recession", "Ease" refers to "FOMC Easing",<br/> and "Tight" represents "FOMC Tightening".'
			},
      textContent: {'MarketCondition': 'Indicates the market environment for this transaction:<br/> "Bear" stands for "Bear Market",<br/> "Bull" stands for "Bull Market",<br/> "Rec" stands for "Recession", "Ease" refers to "FOMC Easing",<br/> and "Tight" represents "FOMC Tightening".'}
		}
	},
	computed: {
		// Filtered and paginated data to be displayed in the table
		paginatedData() {
			return this.processedTradesData.slice(
					20 * (this.queryInfo.page - 1),
					this.queryInfo.page * 20
			)
		},
	},
	watch: {
		tradesData: {
			handler(newValue, _){
				this.processedTradesData = newValue
				this.queryInfo.total = newValue.length
				this.totalTradesNumber = newValue.length
			},
			deep: true
		},
	},
	methods: {
		displayData(data) {
			this.summaryData = [
				{
					...data
				}
			]
		},
		handleCurrentChange(page){
				this.queryInfo.page = page
		},
		handleDownloadCsv() {
      const {summaryData, processedTradesData:tradesData} = this
      if (
        !(
          summaryData.length &&
          tradesData.length
        )
      ) {
        this.popUpMsgBox('No data available for download')
        return
      }
      const summary = []
      summaryData.forEach((item, index) => {
        const obj = {}
        obj['TOTAL RETURN %'] = isNaN(item.totalReturn)
          ? 0
          : `${item.totalReturn}%`
        obj['MEDIAN RETURN %'] = isNaN(item.medianReturn)
          ? 0
          : `${item.medianReturn}%`
        obj['AVERAGE RETURN %'] = isNaN(item.averageReturn)
          ? 0
          : `${item.averageReturn}%`
        obj['Z-SCORE'] = isNaN(item.tzScore)
          ? 0
          : `${item.buyHoldGain}%`
        obj['WIN RATE %'] = isNaN(item.winRate) ? 0 : `${item.winRate}%`
        obj['AVERAGE WIN %'] = isNaN(item.averageWin)
          ? 0
          : `${item.averageWin}%`
        obj['AVERAGE LOSS %'] = isNaN(item.averageLoss)
          ? 0
          : `${item.averageLoss}%`
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
      const trade = []
      tradesData.forEach((item, index) => {
        const obj = {}
        obj['#'] = item.TradeNumber
        obj['Symbol'] = item.Symbol
        obj['Signal'] = item.Signal
        obj['Direction'] = item.Direction
        obj['Entry Date'] = item.EntryDate
        obj['Entry Action'] = item.EntryAction
        obj['Entry Price'] = item.EntryPrice
        obj['Exit Date'] = item.ExitDate
        obj['Exit Action'] = item.ExitAction
        obj['Exit Price'] = item.ExitPrice
        obj['Float Profit %'] = item.FloatProfit ? `${item.FloatProfit}%` : ''
        obj['Exit Reason'] = item.ExitReason
        trade.push(obj)
      })
      const dataList = [
        summary,
        trade
      ]
      const sheetNames = [
        'Summary',
        'Trades'
      ]
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
		s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
	}
}
</script>

<style lang="less" scoped>
.statistics-container {
	padding: 20px;
	.statistics-title {
		padding: 20px 0px 20px 0px;
		border-bottom: 2px solid #dddddd;
	}
}
.CPM-summary {
	margin: 5px 0;
}
.CPM-trades {
	margin-top: 40px;
	border-top: 2px solid #dddddd;
}
.statistics-title {
	align-items: center;
	justify-content: flex-end;
	display: flex;
}
</style>