<template>
  <div class="table-sidebar-des">
    <div class="sidebar-des">
      <div class="thumbnail" v-if="option == 2">
        <h4 style="text-align: center">Seasonality by Day of Month</h4>
        <p>
          To get a better feel for what days of the month have been consistently profitable, this table outlines the historical performance of each day of the month for the symbol data you selected from the start year through the end year.
        </p>
        <p>
          If your browser is relatively new, you will be able to click each of the column headings and have the table sort in ascending and descending order (if you click twice). It may take the table a few seconds to sort since there are so many data points.
        </p> 
        <p>
          Taking SPX, “Date Range” picks in 2003-2023 as an example, click on the "% Pos" heading once and the table will put the most negative days at the top of the table. When you do so, February 29th comes to the top. So, you now know that day in February has been the most negative for the SPX. 
        </p>
        <p>
          If you click on the "% Pos" heading once again, the table will re-sort and put the most positive days at the top of the table. Near the top is the September 11th, meaning that day in September is usually one of the most positive days out of any other day of any other month.
        </p>
        <el-divider></el-divider>
        <h5>Table Description</h5>
        <el-descriptions :column="1" :size="size" border>
          <el-descriptions-item>
            <template slot="label">
              MONTH
            </template>
            The month of the year (e.g. "1" is January, "3" is March, etc.).
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              DAY
            </template>
            The Calendar Day of the month.
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              AVG RET
            </template>
            The average amount that day rose or fell historically.
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              % POS
            </template>
            The percentage of time that day closed higher than the day before.
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              MAX
            </template>
            The largest gain on that day.
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              MIN
            </template>
            The largest loss on that day.
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="thumbnail" v-else>
        <h4 style="text-align: center">Seasonality by Day of Year</h4>
        <p>
          To get a better feel for which days of the year have been consistently profitable, this table outlines the historical performance of each trading day of the year for the symbol data you selected from the start year through the end year.
        </p>
        <p v-if="option == 3">
          If your browser is relatively new, you will be able to click each of the column headings and have the table sort in ascending and descending order (if you click twice). It may take the table a few seconds to sort since there are so many data points.
        </p>
        <p>Highlighted rows represent the latest trading day of the year.</p>
        <el-divider></el-divider>
        <h5>Table Description</h5>
        <el-descriptions :column="1" :size="size" border>
          <el-descriptions-item>
            <template slot="label">
              DAY
            </template>
            The trading day of the year.
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              AVG RET
            </template>
            The average amount that day rose or fell historically.
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              % POS
            </template>
            The percentage of time that day closed higher than the day before.
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              MAX
            </template>
            The largest gain on that day.
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
             MIN
            </template>
            The largest loss on that day.
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <!-- <span v-if="option == 3" class="Hits">Highlighted rows indicate the current day.</span> -->
    <el-table
			ref="CPMTable"
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
        <!-- <el-table-column
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
				</el-table-column> -->
        <el-table-column
          align="center"
          :label="l.label"
          :prop="l.value"
          :key="l.key"
          sortable
          :sort-orders="['ascending', 'descending']"
          v-if="(l.label == 'Day' && option == 3) || (l.label == 'Day' && option == 2) || (l.label == 'Month' && option == 2)"
        >
          <template slot-scope="scope">
            <p class="tableText" :class="getCellStyle(scope.row[l.value])">
              {{ scope.row[l.value] !== undefined ? scope.row[l.value] : '' }}
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
              {{ scope.row[l.value] != undefined ? `${scope.row[l.value]}%` : '' }}
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
    option: Number,
    tradingIndex: [Number, String],
    newest_day: [Object, Number],
    newest_month: [Object, Number]
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
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      const {Day, Month} = row
      if((this.option == 3 && rowIndex == (this.tradingIndex-1)) || (this.option == 2 && this.newest_day == Day && this.newest_month == Month)) return 'highlighted'
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
.table-sidebar-des {
  display: grid;
  grid-template-columns: 30% 70%;
  margin: 0 auto;
  place-items: start center
}
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
.thumbnail
{
  display: block;
  padding: 4px;
  margin-right: 20px;
  line-height: 1.42857143;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  -webkit-transition: all .2s ease-in-out;
  -o-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
  color: #333;
  font-weight: 500;
  font-family: "Open Sans",sans-serif;
}
.default-table-class {
  width: 1200px;
}
/deep/ th.el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label{
  font-weight: 600;
  color: #333;
}
/deep/ td.el-descriptions-item__cell.el-descriptions-item__content{
  font-weight: 500;
  color: #333;
}
.el-table /deep/ tr.highlighted{
  background-color: yellow;
}
.Hits {
  position: absolute;
  top: 100px;
  left: 510px;
  font-size: 14px;
}
</style>