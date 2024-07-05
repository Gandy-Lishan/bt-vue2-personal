<template>
	<div class="main-content">
		<Chart
			v-if="isAsyncDown"
			:symbol="rowData ? rowData.Symbol : 'AAPL'"
			:other="other"
			:direction="rowData ? rowData.Direction : null"
		/>
		<div class="gradient"></div>
		<!-- <el-card class="form-box"> -->
		<div class="form-box">
			<el-tabs v-model="activePerTag" type="card" stretch>
				<el-tab-pane label="History" name="first">
					<div class="history-container">
						<div class="form-label">
							<h2>Backtest Results</h2>
							<div class="form-label-detail">
								Symbol: {{ rowData ? rowData.Symbol : '' }}
							</div>
							<div class="hint-btn-box">
							<p class="hint">
								<i>Hint: Click the button to download all panel data.</i>
							</p>
							<div class="downLoadCsvBtn">
								<el-button
									@click="handleDownloadCsv"
									style="display: inline-block"
									type="primary"
									size="mini"
									icon="el-icon-download"
									>Export Data</el-button
								>
							</div>
						</div>
						</div>
						<el-skeleton :rows="6" :loading="loading" animated>
							<template>
								<el-table
									:data="backtestResultList"
									stripe
									show-summary
									:summary-method="getSummaries"
									class="aiResultsTable"
									border
								>
										<template v-for="(l, index) in defaultTableLabels">
											<el-table-column
												:label="l"
												:prop="l"
												:key="index"
											>
												<template slot-scope="scope">
													<p class="tableText" :class="getCellStyle(scope.row[l])">
														{{ scope.row[l] }}
													</p>
												</template>
											</el-table-column>
										</template>
								</el-table>
							</template>
						</el-skeleton>
						<div class="zscore-container">
							<el-skeleton :rows="2" :loading="loading" animated>
								<template>
									<el-table
										:data="result_quotes"
										:show-header="false"
										stripe
										class="aiResultsTable"
										border
									>

										<template v-for="column in defaultTableLabels">
											
										<el-table-column prop="property" label="Property" v-if="column == 'Entry Date'" :key="column">
										</el-table-column>
											<el-table-column
												v-else
												:key="column"
												:label="column"
												:prop="column"
											>
												<template slot-scope="scope">
													<p class="tableText" :class="getCellStyle(scope.row[column])">
														{{
															!Number.isNaN(scope.row[column])
																? typeof scope.row[column] == 'string'
																	? scope.row[column]
																	: parseFloat(
																			scope.row[column]
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
					</div>
				</el-tab-pane>
				<el-tab-pane
					label="Summary"
					name="second"
				>
					<Result
						v-if="isAsyncDown"
						:other="other"
						ref="Result"
						currTabPage="BacktestResult.Summary.tableCol"
					/>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- </el-card> -->
	</div>
</template>
<script>
import Result from './components/PerformanceComponent'
import Chart from './components/ChartComponent.vue'
import { mapGetters } from 'vuex'
import { getBacktestInfo } from '@/service/ai'
const XLSX = require('xlsx');

export default {
	name: 'scannerai_chart',
	components: {
		Chart,
		Result
	},
	 data() {
		return {
			activePerTag : 'first',
			loading : true,
			rowData : this.$route.query.rowData
				? JSON.parse(this.$route.query.rowData)
				: null,
			other : {},
			isAsyncDown : false,
			backtestResultList : [],
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
			currTabPage : 'BacktestResult',
			translateTabelCol : [],
			result_quotes: []
		}
	},
computed: {
		...mapGetters(['getBacktestResult', 'getBacktestZScoreResult']),
		backtestResult() {
			return this.getBacktestResult
		},
		backtestZScoreResult() {
			return this.getBacktestZScoreResult
		},
	},
	watch: {
		backtestResult: {
			handler(newVal) {
				this.backtestResultList = newVal
			},
			immediate: true,
			deep: true
		},
		backtestZScoreResult: {
			handler(newVal) {
				this.result_quotes = newVal
				console.log('this.backtestZScoreResult',newVal)
			},
			immediate: true,
			deep: true
		},
	},
	created() {
		this.loading = false
		this.getBacktestInfo({
			symbol: this.rowData['Symbol'],
			date: this.rowData['Date'],
			signal: this.rowData['_Signal'],
			category: this.rowData['Category'],
		})
	},
	mounted() {},
	methods: {
		async getBacktestInfo(date) {
			let BacktestInfoContent = await getBacktestInfo(date)

			this.other = BacktestInfoContent

			this.isAsyncDown = true

			return BacktestInfoContent
		},
		getSummaries(param) {
			const { columns, data } = param

			const sums = [] //声明变量
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = 'Average(%)'
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
				sums[index] = isNaN(sums[index]) ? '' : sums[index]
			})
			return sums
		},
		getCellStyle(value) {
			return {
        'negative-value': value < 0,
      };
		},
		handleDownloadCsv() {
			console.log('backtestResultList', this.backtestResultList)
			const backtestHistoryList = this.backtestResultList
			const result_quotes = this.result_quotes
			const defaultTableLabels = this.defaultTableLabels
			const {tableData, historyData} = this.$refs['Result'].exportData()
      if (
        !(
          backtestHistoryList.length &&
					tableData.length &&
					historyData.length
        )
      ) {
        this.popUpMsgBox('No data available for download')
        return
      }
			const _backtestHistoryList = []
			backtestHistoryList.forEach((item) => {
				const obj = {}
				obj['Entry Date'] = item['Entry Date']
				for(var i=1;i < defaultTableLabels.length;i++ ){
					obj[defaultTableLabels[i]] = item[defaultTableLabels[i]]
				}
				_backtestHistoryList.push(obj)
			})
			result_quotes.forEach(item => {
				const zscore = {};
				zscore['Entry Date'] = item['property'];
				for (let i = 1; i < defaultTableLabels.length; i++) {
					if(defaultTableLabels[i] == 'Entry Date') continue
					const value = item[defaultTableLabels[i]]
					// 检查值是否有效
					if (!isNaN(value) || (typeof value === 'string' && value.endsWith('%'))) {
						zscore[defaultTableLabels[i]] = value;
					} else {
						zscore[defaultTableLabels[i]] = ''; // 或者您可以设置为其他默认值
					}
				}
				_backtestHistoryList.push(zscore);
			})
      const summary = []
      tableData.forEach((item, index) => {
        const obj = {}
        obj['ANNUAL RETURN % (CAGR)'] = isNaN(item.CAGR) ? 0 : `${item.CAGR}%`
        obj['MEDIAN RETURN %'] = isNaN(item.medianReturn)
          ? 0
          : `${item.medianReturn}%`
        obj['AVERAGE RETURN %'] = isNaN(item.averageReturn)
          ? 0
          : `${item.averageReturn}%`
        obj['STD. DEV'] = isNaN(item.standardDeviation)
          ? 0
          : `${item.standardDeviation}`
				obj['MAX RISK %'] = isNaN(item.maxRisk) ? 0 : `${item.maxRisk}%`
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
        summary.push(obj)
      })
			const _historyData = []
			historyData.forEach((item, index) => {
				_historyData.push({
					'#': index + 1,
					'ENTRY DATE': item.entryDate,
					'EXIT DATE': item.exitDate,
					'EXIT REASON': item.exitReason,
					'EACH RETURN': isNaN(item.eachReturn)?0:`${item.eachReturn}%`
				})
			})
      let dataList = [
        _backtestHistoryList,
				summary,
				_historyData
      ]
      let sheetNames = [
        'History',
				'Summary(statistics)',
				'Summary(trades)'
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
    // Utility function to convert a string to an ArrayBuffer
    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
	},

}
</script>

<style scoped lang="less">
.gradient {
	padding-top: 88px;
	background: linear-gradient(180deg, #dde0e4, rgba(249, 250, 251, 0));
}
.main-content {
	//background: $dark_white;

	display: grid;
	grid-auto-rows: auto 1fr;
	grid-gap: 20px;
}
.chart_box {
	margin: 50px 50px;
	border-radius: 5px;
}
.form-box {
	margin: 0 50px 50px 50px;
	overflow: hidden;
}
.form-label h2 {
	color: black;
	text-align: center;
	margin-bottom: 5px;
}
.form-label-detail {
	font-size: 1rem;
	text-align: center;
	font-weight: 600;
}

// mobile
@media only screen and (max-width: 992px) {
	.chart_box {
		margin: 20px 15px;
	}
	.form-box {
		margin: 0 50px 15px 15px;
	}
}
.aiResultsTable{
	width: 1200px; 
	height: 100%; 
	margin: 0 auto
}
.hint-btn-box{
  width: 1200px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
	margin: 0 auto;
	.hint {
	/* position: absolute; */
	font-size: 1rem;
	color: black !important;
	/* right: 243px; */
	font-weight: 300;
	margin: 10px 10px 10px 10px;
}
}
</style>

