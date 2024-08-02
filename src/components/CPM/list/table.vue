<template>
  <div class="CPM-list-container">
    <div class="search-box">
      <el-button type="primary" round @click="handleCreate">Create Correlation Pattern Match</el-button>
      <el-input placeholder="Search" v-model="searchKey" @keyup.enter.native="handleQuery" clearable @clear="handleQuery">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
      </el-input>
    </div>
    <el-table
			ref="Table"
			class="my-indicator-table"
      header-align="center"
			:data="tableData"
			:row-class-name="tableRowClassName"
      empty-text="No data"
      v-loading="loading"
      :element-loading-text="loadTest"
      element-loading-spinner="el-icon-loading"
			@sort-change="onSortChange"
      element-loading-background="rgba(0, 0, 0, 0.8)"
			style="width: 100%; height: 100%; margin: 0 auto;"
		>
    
      <!-- <el-table-column
        align="center"
        type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row :gutter="20">
              <el-col :span="12">
              <el-row :span="4">
              <el-form-item label="Name">
                  <span>{{ scope.row['name']}}</span>
              </el-form-item>
              </el-row>
              <el-row :span="4">
              <el-form-item label="Symbol">
                <span>{{ scope.row['symbol']}}</span>
              </el-form-item>
              </el-row>
              <el-row :span="4">
              <el-form-item label="Timeframe">
                <span>{{ scope.row['timeframe']}}</span>
              </el-form-item>
              </el-row>
              <el-row :span="4">
                <el-form-item label="Period">
                  <template v-for="(item, index) in scope.row['period']">
                    <span :key="index">{{ index === scope.row['period'].length - 1 ? item : `${item} to ` }}</span>
                  </template>
                </el-form-item>
              </el-row>
              </el-col>
              <el-col :span="12">
              <el-row :span="4">
              </el-row>
              <el-row :span="4">
              <el-form-item label="Total Trades">
                  <span>{{ scope.row['total_trades']}}</span>
              </el-form-item>
              </el-row>
              <el-row :span="4">
              <el-form-item label="Total Return">
                <span>{{ scope.row['total_return']}}</span>
              </el-form-item>
              </el-row>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column> -->
			<template v-for="(l) in tableCol">
				<el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
				  show-overflow-tooltip
          min-width="100px"
          v-if="l.label == 'Name'"
				>
					<template slot-scope="scope">
						<p class="tableText">
            <el-button type="text" @click="handleRowClick(scope.row)">{{ scope.row[l.value] }}</el-button>
						</p>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Symbol', 'Timeframe', 'Total Trades'].includes(l.label)"
          :sortable="['Total Trades'].includes(l.label) ? 'custom' : false"
				  :sort-orders="['ascending', 'descending', l.value]"
				>
					<template slot-scope="scope">
						<p class="tableText">
							{{ scope.row[l.value] }}
						</p>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Total Return'].includes(l.label)"
          :sortable="['Total Return'].includes(l.label) ? 'custom' : false"
				  :sort-orders="['ascending', 'descending', l.value]"
				>
					<template slot-scope="scope">
						<p class="tableText" v-if="!isNaN(scope.row[l.value]) && scope.row[l.value]">
							{{ scope.row[l.value] }}%
						</p>
            <p class="tableText" v-else>
							{{ scope.row[l.value] }}
						</p>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Period'].includes(l.label)"
				>
					<template slot-scope="scope">
            <template v-for="(item, index) in scope.row[l.value]">
              <div class="showDate" 
              :key="index">
              <el-button
							size="mini"
							type="info"
							plain
							>
              <span v-show="index == 0">Start: </span><span v-show="index == 1">End: </span>{{`${item}`}}</el-button>
              </div>
            </template>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Status'].includes(l.label)"
				>
					<template slot-scope="scope">
            <el-tag type="success" effect="plain" v-if="scope.row[l.value] == 'Finish'"><i class="el-icon-circle-check" style="margin-right: 2px;"></i>{{scope.row[l.value]}}</el-tag>
            <el-tag type="info" effect="plain" v-if="scope.row[l.value] == 'Running'"><i class="el-icon-loading" style="margin-right: 2px;"></i>{{scope.row[l.value]}}</el-tag>
            <el-tag type="danger" effect="plain" v-if="scope.row[l.value] == 'Fail'"><i class="el-icon-circle-close" style="margin-right: 2px;"></i>{{scope.row[l.value]}}</el-tag>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Bars Number'].includes(l.label)"
				>
        <template slot-scope="scope">
						<p class="tableText" v-if="!isNaN(scope.row[l.value]) && scope.row[l.value]">
							{{ scope.row[l.value] }}(Bars)
						</p>
            <p class="tableText" v-else>
							{{ scope.row[l.value] }}
						</p>
					</template>
				</el-table-column>
			</template>
      <el-table-column align="center">
				<template slot-scope="scope">
        <el-button round size="mini" type="primary" icon="el-icon-edit" @click="handleRowClick(scope.row)"></el-button>
        <el-button class="delete-btn" round size="mini" type="primary" icon="el-icon-delete" @click="deleteCPM(scope.row)"></el-button>
        </template>
      </el-table-column>
		</el-table>
		<el-pagination
		@current-change="handleCurrentChange"
    :current-page="currentPage"
		:page-size="pageSize"
		:total="total"
		layout="total, prev, pager, next, jumper"
		></el-pagination>
  </div>
</template>

<script>
import { delCPM, getCPMList, getCPMResults } from '@/service/service'
import { capitalizeFirstLetter } from "@/utils"

export default {
  name: 'Table',
  data() {
    return {
      loading: false,
      pageSize: 10, // Default page size
      currentPage: 1, // Default current page
      total: 0,
      loadTest: 'Loading...',
      searchKey: '',
      tableCol: [
        {
          label: 'Name',
          value: 'name',
          key: 'name'
        },
        {
          label: 'Symbol',
          value: 'symbol',
          key: 'symbol'
        },
        {
          label: 'Timeframe',
          value: 'timeframe',
          key: 'timeframe'
        },
        {
          label: 'Period',
          value: 'period',
          key: 'period'
        },
        {
          label: 'Status',
          value: 'status',
          key: 'status'
        },
        {
          label: 'Bars Number',
          value: 'bars_num',
          key: 'bars_num'
        },
        {
          label: 'Total Trades',
          value: 'total_trades',
          key: 'total_trades'
        },
        {
          label: 'Total Return',
          value: 'total_return',
          key: 'total_return'
        }
      ],
      tableData: [],
      currentSort: {}, // 当前的排序信息
    }
  },
  async created() {
    await this.getDataList()
    console.log('列表返回处理数据', this.tableData)
  },
  methods: {
    async getDataList(orderby) {
      this.loading = true
      let res = null
      const page = this.currentPage
			try {
				res = await getCPMList(page, orderby, this.searchKey)
        console.log('列表响应', res)
				if (res.status == 200) {
					let data = res.data.results
					data = data.map(item => {
            item.status = capitalizeFirstLetter(item.status)
            item.period = [item.start_date, item.end_date]
						return item
					})
					this.tableData = data
					this.total = res.data.count
				}
			} catch(error) {
				console.log('报错了', error)
        if(error.response.status === 404) {
          const newPage = page != 1 ? page - 1 : 1
          this.handleCurrentChange(newPage)
          return
        }
        this.currentPage = 1
        this.total = 0
        this.tableData = []
        
      } finally {
        this.loading = false
      }
    },
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'darken-row'
			}
			return ''
		},
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
      await this.applySort()
		},
    async onSortChange({ column, prop, order }) {
			if(this.currentPage != 1) this.currentPage = 1
      if (column.sortable !== 'custom') return
      this.currentSort = {
        prop: prop,
        order: order,
      };
      await this.applySort()
    },
    async applySort() {
      let { prop, order } = this.currentSort;
      //  order: 升 'ascending' | 降'descending' | 取消升降 null | order: total_return 
      if (order == null || order == prop) {
        // 不排序
        prop = null
      }
      if (order == 'ascending') {
        // 升序排列
        prop = `-${prop}`
      }
			await this.getDataList(prop)
		},
    handleCreate() {
      this.$router.push({
        name: 'CPMResults',
        params: {
          usedFor: 'createNewCPM',
        }
      })
    },
    async deleteCPM(row) {
      const { url } = row
      this.loading = true
			const res = await delCPM(url)
      const code = res.data.code
      if(code == 204) this.popUpMsgBox('Successfully deleted')
      if(code == 403) this.popUpMsgBox("Sorry, deleted item doesn't exist. Refresh the list")
      if(code == 404) {this.popUpMsgBox('Delete failed')}
			await this.getDataList(null)
			this.loading = false
    },
    async handleRowClick(row) {
      const {url} = row
      let res
      try {
        res = await getCPMResults(url)
      } catch (error) {
        this.$router.push({
          name: 'CPMResults'
        })
        return
      }
      const code = res.data.code
      if(code == 403) {this.popUpMsgBox('Sorry, details not found. Possibly deleted or moved'); return}
      if(code == 200) {
        this.$router.push({
        name: 'CPMResults',
        params: {
          data: res.data.data,
          usedFor: 'showCPMResults',
        }
      })
      }
      if(code != 200) {
        // row.url = null
        this.$router.push({
          name: 'CPMResults',
          params: {
            data: row,
            usedFor: 'emptyCPMResults',
          }
        })
      }
    },
    async handleQuery() {
      if(this.currentPage != 1) this.currentPage = 1
      await this.applySort()
    }
    },
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
.my-indicator-table{
  background-color: inherit;
}
.el-form-item{
  margin-bottom: 0;
  span {
    color: #5b9bd1;
  }
}
.delete-btn {
	background-color: #f59e0b;
  border: unset;
}
.delete-btn:hover {
  background-color: rgb(251, 192, 92);
}
/deep/ .el-popover {
  right: 100%;
}
.isLastRow /deep/ .el-popover {
  bottom: 0;
}
/deep/ .el-select .el-input__inner, .el-select {
  width: 100%;
  margin: 0;
  font-weight: 500;
  color: #909399;
}
.CPM-list-container{
  padding: 20px;
}
.showDate {
  margin: 5px 0;
}
.showDate .el-button--info.is-plain {
  width: 130px;
}
.el-tag--plain.el-tag--success {
  color: #289F6D;
  border-color: #289F6D;
}
.el-tag--plain.el-tag--danger {
  color: #dd3a13;
  border-color: #dd3a13;
}
/deep/ .el-button--text, /deep/ .el-button--info {
	font-weight: 600;
}
/deep/ .el-button--info {
  color: #606266;
}
</style>