<template>
	<div class="statistics-container">
		<div class="statistics-title">
		</div>
		<div>
			<el-table header-align="center" class="CPM-summary" :data="summaryData" size="small">
				<el-table-column
					prop="total_assets"
					show-overflow-tooltip
					label="TOTAL ASSETS"
					align="center"
					algin="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.total_assets >= 0">{{
							scope.row.total_assets
						}}</span>
						<span v-else-if="isNaN(scope.row.total_assets)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.total_assets
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="float_profit"
					label="FLOAT PROFIT"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.float_profit >= 0">{{
							scope.row.float_profit + '%'
						}}</span>
						<span
							v-else-if="
								isNaN(scope.row.float_profit) ||
								!scope.row.float_profit ||
								scope.row.float_profit == 'null' ||
								scope.row.float_profit == '0'
							"
						></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.float_profit + '%'
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
						prop="cash"
						label="CASH"
						align="center"
						show-overflow-tooltip
				>
						<template slot-scope="scope">
								<span v-if="scope.row.cash >= 0">{{
										scope.row.cash
								}}</span>
								<span v-else-if="scope.row.cash < 0" style="color: #dd3a13">{{ scope.row.cash }}</span>
								<span v-else></span>
						</template>
				</el-table-column>
				<el-table-column
						prop="market_value"
						label="MARKET VALUE"
						show-overflow-tooltip
						align="center"
				>
						<template slot-scope="scope">
								<span v-if="scope.row.market_value >= 0">{{
										scope.row.market_value
								}}</span>
								<span v-else-if="scope.row.market_value < 0" style="color: #dd3a13">{{
										scope.row.market_value
								}}</span>
								<span v-else></span>
						</template>
				</el-table-column>
				<el-table-column
						prop="winrate"
						label="WIN RATE"
						show-overflow-tooltip
						align="center"
				>
						<template slot-scope="scope">
								<span v-if="scope.row.winrate >= 0">{{
										scope.row.winrate + '%'
								}}</span>
								<span v-else-if="scope.row.winrate < 0" style="color: #dd3a13">{{
										scope.row.winrate + '%'
								}}</span>
								<span v-else></span>
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
				style="width: 100%; height: 100%;"
        >
		<el-table-column label="#" align="center" width="50px">
      <template slot-scope="scope">
        <span>{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
			<template v-for="(l, index) in tableCol">
				<el-table-column
					v-if="['Symbol', 'Entry Price', 'Current Price', 
					'Shares', 'Profit', 'Market Value', 'Strategy'
					].includes(l.label)"
					show-overflow-tooltip
					:prop="l.value"
					:label="l.label"
					:width="l.width"
					align="center"
					:key="index"
					:sortable="
						[
							'Symbol', 'Entry Price', 'Current Price', 'Shares', 'Profit', 'Market Value', 'Strategy'
						].includes(l.label)
							? 'custom'
							: false
					"
					>
          </el-table-column>
					<el-table-column
					v-if="l.label == 'Total Position(%)'"
					show-overflow-tooltip
					:prop="l.value"
					:label="l.label"
					:width="l.width"
					align="center"
					:key="index"
					:sortable="
					l.label === 'Total Position(%)' ? 'custom' : false
					"
					>
					<template slot-scope="scope">
							<span v-if="scope.row[l.value] >= 0"
									>{{ scope.row[l.value] }}%</span
							>
							<span v-else-if="scope.row[l.value] < 0" style="color: #dd3a13"
									>{{ scope.row[l.value] }}%</span
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
          label: 'Symbol',
          value: 'Symbol',
          key: 'Symbol',
					width: '100px'
        },
				{
          label: 'Entry Price',
          value: 'Entry Price',
          key: 'Entry Price'
        },
				{
          label: 'Current Price',
          value: 'Current Price',
          key: 'Current Price'
        },
				{
          label: 'Shares',
          value: 'Shares',
          key: 'Shares'
        },
				{
          label: 'Profit',
          value: 'Profit',
          key: 'Profit'
        },
				{
          label: 'Market Value',
          value: 'Market Value',
          key: 'Market Value'
        },
				{
					label: 'Total Position(%)',
					value: 'Total position(%)',
					key: 'Total position(%)'
				},
				{
					label: 'Strategy',
					value: 'Strategy',
					key: 'Strategy'
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