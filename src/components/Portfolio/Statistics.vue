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
							scope.row.float_profit
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
							scope.row.float_profit
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="total_return"
					show-overflow-tooltip
					label="TOTAL RETURN %"
					align="center"
					algin="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.total_return >= 0">{{
							scope.row.total_return
						}}%</span>
						<span v-else-if="isNaN(scope.row.total_return)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.total_return
						}}%</span>
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
						label="WIN RATE %"
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
		<div class="downLoadCsvBtn">
			<span>HOLDING DETAILS</span>
			<el-button
				@click.stop="() => {handleDownloadCsv()}"
				style="display: inline-block"
				type="primary"
				size="mini"
				icon="el-icon-download"
				>Download CSV</el-button>
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
					'Shares', 'Profit', 'Market Value'
					].includes(l.label)"
					show-overflow-tooltip
					:prop="l.value"
					:label="l.label"
					:width="l.width"
					:min-width="l.minWidth"
					:max-width="l.maxWidth"
					align="center"
					:key="index"
					:sortable="
						[
							'Symbol', 'Entry Price', 'Current Price', 'Shares', 'Profit', 'Market Value'
						].includes(l.label)
							? 'custom'
							: false
					"
					>
     </el-table-column>
					<el-table-column
     v-if="l.label == 'Strategy'"
     show-overflow-tooltip
     :prop="l.value"
     :label="l.label"
     :width="l.width"
     :min-width="l.minWidth"
     :max-width="l.maxWidth"
     align="center"
     :key="index"
     :sortable="
     l.label === 'Strategy' ? 'custom' : false
     "
     >
     <template slot-scope="scope">
        <div v-for="(item, index) in scope.row[l.value]" :key="index">
            <p><span v-if="scope.row[l.value]?.length > 1">{{ index + 1 }}.</span
             >{{ item }}</p>
        </div>
      </template>
     </el-table-column>
					<el-table-column
					v-if="l.label == 'Total Position(%)'"
					show-overflow-tooltip
					:prop="l.value"
					:label="l.label"
					:width="l.width"
					:min-width="l.minWidth"
					:max-width="l.maxWidth"
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
const XLSX = require('xlsx');

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
					minWidth: '120px'
        },
				{
          label: 'Entry Price',
          value: 'Entry Price',
          key: 'Entry Price',
					minWidth: '90px'
        },
				{
          label: 'Current Price',
          value: 'Current Price',
          key: 'Current Price',
					minWidth: '100px'
        },
				{
          label: 'Shares',
          value: 'Shares',
          key: 'Shares',
					width: '100px'
        },
				{
          label: 'Profit',
          value: 'Profit',
          key: 'Profit',
					width: '90px'
        },
				{
          label: 'Market Value',
          value: 'Market Value',
          key: 'Market Value',
					minWidth: '90px',
					maxWidth: '160px'
        },
				{
					label: 'Total Position(%)',
					value: 'Total position(%)',
					key: 'Total position(%)',
					minWidth: '140px',
					maxWidth: '180px'
				},
				{
					label: 'Strategy',
					value: 'Strategy',
					key: 'Strategy',
					minWidth: '200px'
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
			const summary = []
      this.summaryData.forEach((item, index) => {
        const obj = {}
        obj['TOTAL ASSETS'] = item.total_assets
        obj['FLOAT PROFIT'] = item.float_profit
        obj['TOTAL RETURN %'] = `${item.total_return}%`
        obj['CASH'] = item.cash
        obj['MARKET VALUE'] = item.market_value
				obj['WIN RATE %'] = `${item.winrate}%`
        summary.push(obj)
      })
			const trade = []
			this.tradesData.forEach((item, index) => {
				const obj = {}
        obj['#'] = index + 1
        obj['Symbol'] = item.Symbol
        obj['Entry Price'] = item['Entry Price']
        obj['Current Price'] = item['Current Price']
        obj['Shares'] = item['Shares']
        obj['Profit'] = item['Profit']
        obj['Market Value'] = item['Market Value']
        obj['Total Position(%)'] = `${item['Total position(%)']}%`
        obj['Strategy'] = item.Strategy.join(', ')
        trade.push(obj)
			})
      if (
        !(
          summary.length &&
          trade.length
        )
      ) {
        this.popUpMsgBox('No data available for download')
        return
      }
      const dataList = [ 
				summary,
        trade
      ]
      const sheetNames = [
        'Summary',
        'HOLDING DETAILS'
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
	/deep/ .el-table .cell {
  white-space: break-spaces;
 }
}
.CPM-summary {
	margin: 5px 0;
}
.CPM-trades {
	border-top: 2px solid #dddddd;
}
.statistics-title {
	align-items: center;
	justify-content: flex-end;
	display: flex;
}
.downLoadCsvBtn {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 20px 0px;
	span {
		font-size: 18px;
		font-weight: 600;
	}
}
</style>