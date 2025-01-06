<template>
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
					'Entry Date', 'Entry Action', 'Entry Price', 'Shares',
					'Exit Date', 'Exit Action', 'Exit Price',
					'Exit Reason'
					].includes(l.label)"
					show-overflow-tooltip
					:prop="l.value"
					:min-width="l.minWidth"
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
					<template #header>
							<span v-html="l.labelHtml"></span>
					</template>
     </el-table-column>
					<el-table-column
					v-if="l.label == 'Floating Profit %'"
					show-overflow-tooltip
					:prop="l.value"
					:label="l.label"
					:min-width="l.minWidth"
					align="center"
					:key="index"
					:sortable="
					l.label === 'Floating Profit %' ? 'custom' : false
					"
					>
					<template #header>
							<span v-html="l.labelHtml"></span>
					</template>
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
</template>

<script>
export default {
 name: 'Trades',
 props: {
		tradesData: Array
	},
 data() {
  return {
			queryInfo: {
				total: 0,
				page: 1
			},
			totalTradesNumber: 0,
			processedTradesData: [],
			tableCol: [
        {
          label: '#',
										labelHtml: '#',
          value: 'TradeNumber',
          key: 'TradeNumber',
										minWidth: '50px'
        },
        {
          label: 'Symbol',
										labelHtml: 'Symbol',
          value: 'Symbol',
          key: 'Symbol',
										minWidth: '105px'
        },
        {
          label: 'Signal',
										labelHtml: 'Signal',
          value: 'Signal',
          key: 'Signal',
										minWidth: '120px'
        },
        {
          label: 'Direction',
										labelHtml: 'Direction',
          value: 'Direction',
          key: 'Direction',
										minWidth: '90px'
        },
        {
          label: 'Entry Date',
										labelHtml: 'Entry Date',
          value: 'EntryDate',
          key: 'EntryDate',
										minWidth: '130px'
        },
        {
          label: 'Entry Action',
										labelHtml: 'Entry<br/>Action',
          value: 'EntryAction',
          key: 'EntryAction',
										minWidth: '80px'
        },
				{
          label: 'Entry Price',
										labelHtml: 'Entry<br/>Price',
          value: 'EntryPrice',
          key: 'EntryPrice',
										minWidth: '90px'
        },
				{
          label: 'Exit Date',
										labelHtml: 'Exit Date',
          value: 'ExitDate',
          key: 'ExitDate',
										minWidth: '120px'
        },
				{
          label: 'Exit Action',
										labelHtml: 'Exit Action',
          value: 'ExitAction',
          key: 'ExitAction',
										minWidth: '90px'
        },
				{
          label: 'Exit Price',
										labelHtml: 'Exit<br/>Price',
          value: 'ExitPrice',
          key: 'ExitPrice',
										minWidth: '90px'
        },
				{
					label: 'Shares',
					labelHtml: 'Shares',
					value: 'Shares',
					key: 'Shares',
					minWidth: '90px'
				},
				{
          label: 'Floating Profit %',
										labelHtml: 'Floating<br/>Profit(%)',
          value: 'FloatProfit',
          key: 'FloatProfit',
										minWidth: '90px'
        },
				{
          label: 'Exit Reason',
										labelHtml: 'Exit<br/>Reason',
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
				debugger
				this.queryInfo.total = newValue.length
				this.totalTradesNumber = newValue.length
			},
			deep: true
		},
	},
 methods: {
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
      const {tradesData} = this
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
				obj['Shares'] = item.Shares
        obj['Floating Profit %'] = isNaN(item.FloatProfit) ? '' : `${item.FloatProfit}%`
        obj['Exit Reason'] = item.ExitReason
        trade.push(obj)
      })
			return trade
		}
 }
}
</script>

<style lang="less" scoped>
.CPM-trades {
	padding: 20px;
}
.trades-table {
 margin-top: 60px;
	border-top: 2px solid #dddddd;
}
</style>