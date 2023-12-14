<template>
  <div>
    <el-table
			ref="MITable"
			class="my-indicator-table other-table default-table-class"
			:data="tableData"
			:row-class-name="tableRowClassName"
      empty-text="No data"
      v-loading="loading"
      :element-loading-text="loadTest"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @sort-change="changeTableSort"
      size="mini"
      border
		>
			<template v-for="(l) in tableCol">
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          sortable
          :sort-orders="['ascending', 'descending']"
          v-if="
          (l.label == 'Day' && option == 3)
          ||
          (l.label == 'Day' && option == 2) || (l.label == 'Month' && option == 2) 
          "
				>
					<template slot-scope="scope">
						<p class="tableText" :class="getCellStyle(scope.row[l.value])">
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
          :sort-orders="['ascending', 'descending']"
          v-if="l.label != 'Month' && l.label != 'Day'"
				>
					<template slot-scope="scope">
						<p class="tableText" :class="getCellStyle(scope.row[l.value])">
              {{ scope.row[l.value] != undefined ? `${scope.row[l.value]} %` : '' }}
						</p>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<!-- <el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:page-sizes="[10, 30, 50, 100, 200]"
		:page-size="pageSize"
		:total="parentData.length"
		layout="total, sizes, prev, pager, next, jumper"
		></el-pagination> -->
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
      sortOrders: {},
      paginatedData: []
    }
  },
  computed: {
    parentData() {
      return this.tableData
    }
	},
  watch: {
    tableData: {
      handler(newVal) {
        // this.loading = true
        // const startIndex = (this.currentPage - 1) * this.pageSize;
        // const endIndex = startIndex + this.pageSize;
        // // 当checkbox未勾选时，返回原始数据
        // this.loading = false
        // this.paginatedData =  newVal.slice(startIndex, endIndex);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'darken-row'
			}
			return ''
		},
    handleSizeChange(size) {
			this.pageSize = size;
			this.currentPage = 1; // Reset to the first page when the page size changes
      this.changeTableSort(this.sortOrders)
		},
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
      this.changeTableSort(this.sortOrders)
		},
    changeTableSort(column){
      console.log('column', column)
      this.sortOrders = column
			var sortingOrder = column.order
			var colName = column.prop
      console.log('Original Data', this.tableData);
      const tableData = JSON.parse(JSON.stringify(this.tableData))
			// 数字类型排序
			if(['Day', 'Month', 'AVG RET', '% POS', 'MAX', 'MIN'].includes(colName)){
				if(sortingOrder == 'ascending'){
				  tableData.sort((a,b) => {
						return Number(b[colName]) - Number(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					tableData.sort((a,b) => {
						return Number(a[colName]) - Number(b[colName])
					})
				}
        console.log('Sorted Data', tableData);
        // Update the existing array instead of assigning a new one
        this.tableData = tableData
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
    getCellStyle(value) {
      // Check if the value is negative and return a class name accordingly
      return {
        'negative-value': value < 0,
      };
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
.negative-value{
  color: #dd3a13;
}
 .el-table .cell{
    font-weight: 400;
	font-size: 14px;
  color: #333341;
  font-family: "Open Sans",sans-serif;
  text-align: center;
 }
.table thead tr th
  {
  font-weight: 600 !important;
  color: #333341;
}

.el-table th.el-table__cell>.cell
{
  font-weight: 600 !important;
}
.other-table{
  width: 1140px; 
  height: 100%; 
  margin: 0 auto
}
</style>