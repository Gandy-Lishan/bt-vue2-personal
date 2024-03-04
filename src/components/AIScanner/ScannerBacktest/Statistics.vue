<template>
	<div class="statistics-container">
		<div class="statistics-title">
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
                    <span v-else-if="scope.row.tzScore < 0" style="color: #dd3a13">{{ scope.row.tzScore }}</span>
                    <span v-else></span>
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
					@sort-change="changeTableSort"
					stripe
        >
			<template v-for="(l, index) in tableCol">
				<el-table-column
					v-if="['#', 'Symbol', 'Signal', 'Direction', 
					'Entry Date', 'Entry Action', 'Entry Price',
					'Exit Date', 'Exit Action', 'Exit Price',
					'Exit Reason'
					].includes(l.label)"
					show-overflow-tooltip
					:prop="l.value"
					:label="l.label"
					:width="l.width"
					align="center"
					:key="index"
					:sortable="
						[
							'Symbol', 'Signal', 'Entry Date', 'Exit Date', 'Exit Reason'
						].includes(l.label)
							? 'custom'
							: false
					"
					>
          </el-table-column>
					<el-table-column
					v-if="l.label == 'Float Profit %'"
					show-overflow-tooltip
					:prop="l.value"
					:label="l.label"
					:width="l.width"
					align="center"
					:key="index"
					:sortable="
					l.label === 'Float Profit %' ? 'custom' : false
					"
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
			</template>
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
			tableCol: [
        {
          label: '#',
          value: 'TradeNumber',
          key: 'TradeNumber',
					width: '50px'
        },
        {
          label: 'Symbol',
          value: 'Symbol',
          key: 'Symbol',
					width: '100px'
        },
        {
          label: 'Signal',
          value: 'Signal',
          key: 'Signal'
        },
        {
          label: 'Direction',
          value: 'Direction',
          key: 'Direction',
					width: '100px'
        },
        {
          label: 'Entry Date',
          value: 'EntryDate',
          key: 'EntryDate',
					width: '120px'
        },
        {
          label: 'Entry Action',
          value: 'EntryAction',
          key: 'EntryAction',
					width: '120px'
        },
				{
          label: 'Entry Price',
          value: 'EntryPrice',
          key: 'EntryPrice'
        },
				{
          label: 'Exit Date',
          value: 'ExitDate',
          key: 'ExitDate',
					width: '120px'
        },
				{
          label: 'Exit Action',
          value: 'ExitAction',
          key: 'ExitAction',
					width: '120px'
        },
				{
          label: 'Exit Price',
          value: 'ExitPrice',
          key: 'ExitPrice'
        },
				{
          label: 'Float Profit %',
          value: 'FloatProfit',
          key: 'FloatProfit'
        },
				{
          label: 'Exit Reason',
          value: 'ExitReason',
          key: 'ExitReason'
        }
      ],
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
		changeTableSort(column){
			debugger
			var sortingOrder = column.order
			var colName = column.prop
			// 数字类型排序
			if(['FloatProfit'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.processedTradesData.sort((a,b) => {
						return b[colName] - a[colName]
					})
				}else if(sortingOrder == 'descending'){
					this.processedTradesData.sort((a,b) => {
						return a[colName] - b[colName]
					})
				}else{
				}
			}
			// 日期类型排序
			if(['EntryDate', 'ExitDate'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.processedTradesData.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.processedTradesData.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
			// 字符串类型排序
			if(['Symbol','Signal','ExitReason', 'Direction'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.processedTradesData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.processedTradesData.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else{
				}
			}
		},
		handleDownloadCsv() {
      const {summaryData, tradesData} = this
      const summary = []
      summaryData.forEach((item, index) => {
        const obj = {}
        obj['TOTAL RETURN %'] = `${item.totalReturn}%`
        obj['MEDIAN RETURN %'] = `${item.medianReturn}%`
        obj['AVERAGE RETURN %'] = `${item.averageReturn}%`
        obj['Z-SCORE'] = item.tzScore
        obj['WIN RATE %'] = `${item.winRate}%`
        obj['AVERAGE WIN %'] = `${item.averageWin}%`
        obj['AVERAGE LOSS %'] =  `${item.averageLoss}%`
        obj['TOTAL TRADES'] =  `${item.totalTrades}`
        obj['TOTAL POSITIVE'] = `${item.totalPositive}`
        obj['TOTAL NEGATIVE'] =`${item.totalNegative}`
        obj['TIME IN MARKET %'] = `${item.timeInMarket}%`
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
			return {
				summary,
				trade
			}
		}
	}
}
</script>

<style lang="less" scoped>
.statistics-container {
	padding: 20px;
	.statistics-title {
		padding: 30px 0px 30px 0px;
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