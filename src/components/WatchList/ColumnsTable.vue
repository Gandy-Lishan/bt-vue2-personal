<template>
	<div class="CPM-list-container ScannerBTTable">
		<!-- <link rel="stylesheet" href="../../../../assets/font/iconfont.css"></link> -->
    <p class="filterTableDes">
						After completing the above steps, click <span class="strongSpan">"View List"</span> to automatically generate a pre-filtered Watch List. If you’re satisfied with the results, simply click <span class="strongSpan">"Save Watch List"</span> to save it.
    </p>
		<el-table
			ref="tableREF"
			class="ScannerBTTable"
			:data="paginatedData"
			empty-text="Empty filter condition preview list"
   v-loading="loading"
			@sort-change="changeTableSort"
			style="width: 100%; height: 100%"
			size="small"
			stripe
		>
			<!-- :min-width="90" -->
			<template v-for="(l, index) in tableCol">
				<el-table-column		
					v-if="l.label === 'Button'"
					align="center"
					:key="index"
					:width="l.width"
					:sortable="false"
				>
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-close" @click="deleteRow(scope)" title="Delete Ticker" :loading="scope.row.deleteLoading" element-loading-spinner="el-icon-right"></el-button>
				</template>
				</el-table-column>
				<el-table-column		
					v-else-if="l.label !== 'Button'"
					:label="l.label"
					:prop="l.value"
					:key="index"
					sortable="custom"
				>
					<template slot-scope="scope">
       {{ scope.row[l.value] }}
					</template>
				</el-table-column>
			</template>
		</el-table>
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:page-sizes="[10, 30, 50, 100, 200]"
		:page-size="pageSize"
		:current-page="currentPage"
		:total="data.content.length"
		layout="total, sizes, prev, pager, next, jumper"
		></el-pagination>
	</div>
</template>

<script>

export default {
	name: 'FilterTable',
	props: {
		data: Object,
		tableCol :Array,
		loading: Boolean,
	},
	data() {
		return {
				pageSize: 10, // Default page size
    currentPage: 1, // Default current page

		}
	},
	computed: {
		// Filtered and paginated data to be displayed in the table
		paginatedData() {
			const startIndex = (this.currentPage - 1) * this.pageSize;
			const endIndex = startIndex + this.pageSize;
			// 当checkbox未勾选时，返回原始数据
			return this.data.content?.slice(startIndex, endIndex);
		},
	},
	methods: {
		handleSizeChange(size) {
			this.pageSize = size;
			this.currentPage = 1; // Reset to the first page when the page size changes
		},
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},
		changeTableSort(column){
			const sortingOrder = column.order
			const colName = column.prop
			if(!colName) return
			// 日期类型排序
			if(['Date'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.data.content.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.data.content.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
			// 字符串类型排序
			if(['Ticker'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.data.content.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.data.content.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else{
				}
			}

			const containsAnySubstring = (variable, keywords) => {
				return keywords.some(keyword => variable.includes(keyword))
			}
			const keywords = ['Trend Score', 'RelTrend Score', 'Optix', 'ROC', 'SMA', 'EMA']
			const result = containsAnySubstring(colName, keywords);
			// 数字字符串转数字类型排序
			if(result){
				if(sortingOrder == 'ascending'){
					this.data.content.sort((a,b) => {
						b[colName] = typeof b[colName] === 'number' ? b[colName] + '' : b[colName]
						a[colName] = typeof a[colName] === 'number' ? a[colName] + '' : a[colName]
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _b - _a
					})
				}else if(sortingOrder == 'descending'){
					this.data.content.sort((a,b) => {
						b[colName] = typeof b[colName] === 'number' ? b[colName] + '' : b[colName]
						a[colName] = typeof a[colName] === 'number' ? a[colName] + '' : a[colName]
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _a - _b
					})
				}else{
				}
			}
		},
		exportTable() {
			console.log('this.data.content', this.data.content)
			// const data = this.data.content
			// const processedData = data.map(item => {
			// 	return {
			// 		'Date': item.Date,
			// 		'Symbol': item.Symbol,
			// 		'Close': item.Close,
			// 		'Direction': item.Direction,
			// 		'Win Rate(%)': `${item.WinRate}%`,
			// 		'Stop Loss(%)': `${item.StopLoss}%`,
			// 		'Profit Target(%)': `${item.ProfitTarget}%`,
			// 		'Best Time In Market(Bars)': item.TimeInMarket,
			// 		'Expected Return(%)': `${item.ExpectedReturn}%`,
			// 	}
			// })
			// return processedData
		},
		deleteRow(scope) {
			const index = scope.$index
			console.log(scope) //scope.$index
			this.data.content.splice(index, 1)
			// delete form ticker and refresh heatmap
			this.$emit('deleteFormTicker', {...scope.row, index})
			this.$emit('deleteHeatMapTicker', {...scope.row, index})
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.iconfont {
	font-family: 'iconfont' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.table-label {
	margin: 20px 0;
}
.el-table /deep/ thead .iconfont{
	color: #606266;
}
.filterTableDes {
  padding: 0px 0px 20px 0px;
  margin: 0px;
  font-size: 16px;
  border-bottom: 2px solid #dddddd;
  .strongSpan {
    font-weight: 500;
  }
}
.CPM-list-container{
  padding: 20px;
}
.ScannerBTTable .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  /deep/ .el-form-item__label {
    width: 200px;
  }
}
i.el-icon-delete {
	color: #dd3a13;
}
</style>
