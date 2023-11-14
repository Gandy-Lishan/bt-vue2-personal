<template>
  <div>
    <el-table
			ref="MITable"
			class="my-indicator-table other-table"
			:data="paginatedData"
			:row-class-name="tableRowClassName"
      empty-text="No data"
      v-loading="loading"
      :element-loading-text="loadTest"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @sort-change="changeTableSort"
			style="width: 100%; height: 100%"
		>
			<template v-for="(l) in tableCol">
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          sortable
          v-if="
          (l.label == 'Day' && option == 3)
          ||
          (l.label == 'Day' && option == 2) || (l.label == 'Month' && option == 2) 
          "
				>
					<template slot-scope="scope">
						<p class="tableText">
              {{ scope.row[l.value] != undefined ? scope.row[l.value] : '' }}
						</p>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          sortable
          v-if="l.label != 'Month' && l.label != 'Day'"
				>
					<template slot-scope="scope">
						<p class="tableText">
              {{ scope.row[l.value] != undefined ? `${scope.row[l.value]} %` : '' }}
						</p>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:page-sizes="[10, 30, 50, 100, 200]"
		:page-size="pageSize"
		:total="tableData.length"
		layout="total, sizes, prev, pager, next, jumper"
		></el-pagination>
  </div>
</template>

<script>

export default {
  name: 'Table',
  props: {
    tableData: Array,
    option: Number
  },
  data() {
    return {
      loading: false,
      pageSize: 10, // Default page size
      currentPage: 1, // Default current page
      loadTest: 'Loading...',
      searchKey: '',
      tableCol: [
        {
          label: 'Month',
          value: 'Month'
        },
        {
          label: 'Day',
          value: 'Day'
        },
        {
          label: 'AVG RET',
          value: 'AVG RET'
        },
        {
          label: '% POS',
          value: '% POS'
        },
        {
          label: 'MAX',
          value: 'MAX'
        },
        {
          label: 'MIN',
          value: 'MIN'
        }
      ],
    }
  },
  computed: {
		// Filtered and paginated data to be displayed in the table
		paginatedData() {
      this.loading = true
			const startIndex = (this.currentPage - 1) * this.pageSize;
			const endIndex = startIndex + this.pageSize;
			// 当checkbox未勾选时，返回原始数据
      this.loading = false
			return this.tableData?.slice(startIndex, endIndex);
		},
	},
  methods: {
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'dark-row'
			}
			return ''
		},
    handleSizeChange(size) {
			this.pageSize = size;
			this.currentPage = 1; // Reset to the first page when the page size changes
		},
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},
    changeTableSort(column){
      console.log('column', column)
			var sortingOrder = column.order
			var colName = column.prop
			// 数字类型排序
			if(['Day', 'Month', 'AVG RET', '% POS', 'MAX', 'MIN'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.tableData.sort((a,b) => {
						return b[colName] - a[colName]
					})
				}else if(sortingOrder == 'descending'){
					this.tableData.sort((a,b) => {
						return a[colName] - b[colName]
					})
				}
			}
		},
    async handleQuery() {
      if(!this.searchKey) {this.getTableData(this.currentPage);return}
      this.loading = true
      console.log(this.searchKey)
      const data = {
        name: this.searchKey
      }
      let searchRes
      try {
        searchRes = await searchIndicator(data)
        console.log('searchRes', searchRes)
        if(searchRes.status == 200) {
          this.tableData = searchRes.data
        }
        if(searchRes.data.code == 406 || searchRes.data.code == 404) {
          this.tableData = []
        }
      } catch (error) {
        this.tableData = []
      }
      this.loading = false
      console.log(searchRes)
    },
  }
}
</script>

<style lang="less" scoped>
.my-indicator-table.el-table /deep/tr{
  cursor: pointer;
}
.el-form-item{
  margin-bottom: 0;
  span {
    color: #5b9bd1;
  }
}
.other-table{
  width: 100%;
}
</style>