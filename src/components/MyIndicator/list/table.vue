<template>
  <div>
    <div class="search-box">
      <el-button type="primary" round @click="handleCreate">Create New Indicator</el-button>
      <el-input placeholder="Search" v-model="searchKey" @keyup.enter.native="handleQuery" 					clearable
					@clear="handleQuery">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
      </el-input>
    </div>
    <el-table
			ref="MITable"
			class="my-indicator-table"
			:data="tableData"
			:row-class-name="tableRowClassName"
      empty-text="No data"
      v-loading="loading"
      :element-loading-text="loadTest"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @sort-change="changeTableSort"
      @row-click="handleRowClick"
			style="width: 100%; height: 100%"
		>
			<template v-for="(l, index) in tableCol">
				<el-table-column
					:label="l.label"
					:prop="l.value"
					:key="index"
				>
					<template slot-scope="scope">
						<p class="tableText">
							{{ scope.row[l.value] }}
						</p>
            <!-- <el-link type="primary">主要链接</el-link> -->
					</template>
				</el-table-column>
			</template>
      <el-table-column
      min-width="40"
      >
				<template slot-scope="scope">
          <el-button round size="mini" type="primary" icon="el-icon-delete" @click.stop="deleteIndicator(scope.row)"></el-button>
        </template>
      </el-table-column>
		</el-table>
		<el-pagination
		@current-change="handleCurrentChange"
		:page-size="pageSize"
		:total="total"
		layout="total, prev, pager, next, jumper"
		></el-pagination>
  </div>
</template>

<script>
import { delMyIndicator, getMyIndicatorsList, searchIndicator } from '@/service/service'

export default {
  name: 'MITable',
  data() {
    return {
      loading: false,
      pageSize: 10, // Default page size
      currentPage: 1, // Default current page
      loadTest: 'Loading...',
      searchKey: '',
      tableCol: [
        {
          label: 'Name',
          value: 'name'
        },
        {
          label: 'Categories',
          value: 'categories'
        },
        {
          label: 'The former',
          value: 'former',
        },
        {
          label: 'The latter',
          value: 'latter'
        },
      ],
      tableData: [],
      total: 0
    }
  },
  async created() {
    // 这里应该是请求下来的数据
    await this.getTableData(this.currentPage)
  },
  methods: {
    async getTableData(page) {
      this.loading = true
      let listRes
      try {
        listRes = await getMyIndicatorsList(page)
      } catch (error) {
        this.currentPage = 1; listRes = await getMyIndicatorsList(1)
      }
      this.total = listRes.data.count
      // 从localStorage获取数据
      const sentimentList = JSON.parse(localStorage.getItem('sentimentList'))
      const symbolList = JSON.parse(localStorage.getItem('symbolList'))
      console.log('listRes.data.results', listRes.data.results)
      const data = listRes.data.results.map(item => {
        const indicator_1 = sentimentList.find(ele => (ele.url === item.indicator_1_url))
        const symbol_1 = symbolList.find(ele => (ele.url === item.indicator_1_url))
        const indicator_2 = sentimentList.find(ele => (ele.url === item.indicator_2_url))
        const symbol_2 = symbolList.find(ele => (ele.url === item.indicator_2_url))
        const isIndicator = indicator_1 || indicator_2
        const maList = item.ma.split('_')
        const ma_1 = maList[0] !== '1' ? ` Moving Average ${maList[0]}` : ''
        const ma_2 = maList[1] !== '1' ? ` Moving Average ${maList[1]}` : ''
        const former = indicator_1?.label || symbol_1?.label
        const latter = indicator_2?.label || symbol_2?.label
        console.log('former latter', former, latter)
        return {
          ...item,
          categories: `${isIndicator ? 'Indicator' : 'Symbol'} ${item.calculate}`,
          former: `${former}${ma_1}`,
          latter: `${latter}${ma_2}`,
        }
      })
      this.tableData = data
      this.loading = false
    },
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'dark-row'
			}
			return ''
		},
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
      await this.getTableData(currentPage)
		},
    changeTableSort(column, prop, order) {
      console.log(column, prop, order)
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
    handleCreate() {
      this.$router.push('/myindicator/create')
    },
    handleRowClick(row) {
      console.log(row)
      const data = JSON.stringify(row)
      this.$router.push({
        name: 'MIcreate',
        params: {
          data,
          usedFor: 'showMyIndicators'
        }
      })
    },
    async deleteIndicator(row) {
      let res = await delMyIndicator(row.url)
      const code = res.data.code
				if(code == 200) {
            this.$message({
              message: 'The indicator has been removed from the list',
              center: true
            })
					}
					if(code == 404) {
              this.$message({
              message: 'The indicator is no longer in the list',
              center: true
            })
					}
					if(code == 403) {
            this.$message({
              message: 'Permission denied',
              center: true
            })
				}
      console.log('删除 res', res)
      await this.getTableData(this.currentPage)
    }
  }
}
</script>

<style lang="less" scoped>
.search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0px;
}
.el-input-group{
  width: 40%;
}
.my-indicator-table.el-table /deep/tr{
  cursor: pointer;
}
</style>