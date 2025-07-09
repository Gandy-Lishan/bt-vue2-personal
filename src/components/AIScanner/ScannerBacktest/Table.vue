<template>
  <div class="CPM-list-container ScannerBTTable">
    <div class="search-box">
      <el-input placeholder="Search" v-model="searchKey" @keyup.enter.native="handleQuery" clearable @clear="handleQuery" size="small">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" size="small"></el-button>
      </el-input>
    </div>
    <el-table
			ref="Table"
			class="ScannerBTTable"
      header-align="center"
			:data="tableData"
      empty-text="No data"
      v-loading="loading"
			@sort-change="onSortChange"
      size="small"
			style="width: 100%; height: 100%; margin: 0 auto;"
      stripe
		>
    <el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="AVERAGE WIN %">
							<span>{{ props.row['avg_win'] ? `${props.row['avg_win']}%` : props.row['avg_win'] }}</span>
						</el-form-item>
						<el-form-item label="AVERAGE LOSS %">
							<span>{{ props.row['avg_loss'] ? `${props.row['avg_loss']}%` : props.row['avg_loss'] }}</span>
						</el-form-item>
						<el-form-item label="MEDIAN RETURN %">
							<span>{{ props.row['median_return'] ? `${props.row['median_return']}%` : props.row['median_return'] }}</span>
						</el-form-item>
						<el-form-item label="TOTAL TRADES">
							<span>{{ props.row['total_trades']}}</span>
						</el-form-item>
						<el-form-item label="TOTAL POSITIVE">
							<span>{{ props.row['total_positive'] }}</span>
						</el-form-item>
						<el-form-item label="TOTAL NEGATIVE">
							<span>{{ props.row['total_negative'] }}</span>
						</el-form-item>

						<!-- <el-form-item label="ANNUAL RETURN % (CAGR)">
							<span>{{ props.row['annual_return'] }}</span>
						</el-form-item> -->
						<!-- <el-form-item label="AVERAGE RETURN %">
							<span>{{ props.row['avg_return'] ? `${props.row['avg_return']}%` : props.row['avg_return'] }}</span>
						</el-form-item> -->
						<el-form-item label="STD. DEV">
							<span>{{ props.row['std_dev'] }}</span>
						</el-form-item>
            <el-form-item label="MAX RISK %">
							<span>{{ props.row['max_draw_down'] ? `${props.row['max_draw_down']}%` : props.row['max_draw_down'] }}</span>
						</el-form-item>
            <el-form-item label="TIME IN MARKET %">
							<span>{{ props.row['time_in_market'] ? `${props.row['time_in_market']}%` : props.row['time_in_market'] }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
    <el-table-column align="center" width="80px">
      <template #header>
        <!-- 将表头内容替换成 -->
        <el-button type="text" icon="el-icon-refresh" title="Refresh List" @click="() => {currentPage = 1;getDataList(null)}"></el-button>
      </template>
				<template slot-scope="scope">
          <el-button-group>
            <el-button type="text" icon="el-icon-caret-right" @click="runSCBacktest(scope.row)" title="Run Backtest" :loading="scope.row.viewLoading"></el-button>
            <!-- <el-button type="text" icon="el-icon-view" @click="handleRowClick(scope.row)" title="View Backtest Details" :loading="scope.row.viewLoading"></el-button> -->
            <el-button type="text" icon="el-icon-close" @click="deleteSCBT(scope.row)" title="Delete Backtest" :loading="scope.row.deleteLoading" element-loading-spinner="el-icon-right"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
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
						<span class="tableText">
              {{ scope.row[l.value] }}
						</span>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Total Trades'].includes(l.label)"
          :sortable="['Total Trades'].includes(l.label) ? 'custom' : false"
				  :sort-orders="['ascending', 'descending', l.value]"
				>
					<template slot-scope="scope">
						<span class="tableText">
							{{ scope.row[l.value] }}
						</span>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Total Return %', 'Win Rate %'].includes(l.label)"
          :sortable="['Total Return %', 'Win Rate %'].includes(l.label) ? 'custom' : false"
				  :sort-orders="['ascending', 'descending', l.value]"
				>
					<template slot-scope="scope">
						<span class="tableText" v-if="!isNaN(scope.row[l.value]) && scope.row[l.value]">
							{{ scope.row[l.value] }}%
						</span>
            <span class="tableText" v-else>
							{{ scope.row[l.value] }}
						</span>
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
            <span class="showDate">{{scope.row[l.value][0]}} to {{scope.row[l.value][1]}}</span>
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
            <span v-if="scope.row[l.value] == 'Finish'">{{scope.row[l.value]}}</span>
            <span v-if="scope.row[l.value] == 'Running'">{{scope.row[l.value]}}</span>
            <span v-if="scope.row[l.value] == 'Fail'">{{scope.row[l.value]}}</span>
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
						<span class="tableText" v-if="!isNaN(scope.row[l.value]) && scope.row[l.value]">
							{{ scope.row[l.value] }}(Bars)
						</span>
            <span class="tableText" v-else>
							{{ scope.row[l.value] }}
						</span>
					</template>
				</el-table-column>
			</template>
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
import { delScannerBT, getScannerBTList, getScannerBTResults, getScannerBTResultsList, runBacktest } from '@/service/service'
import { capitalizeFirstLetter, isJson, timestampToTime } from "@/utils"

export default {
  name: 'ScannerBTTable',
  data() {
    return {
      loading: false,
      pageSize: 10, // Default page size
      currentPage: 1, // Default current page
      total: 0,
      searchKey: '',
      tableCol: [
        {
          label: 'Name',
          value: 'name',
          key: 'name'
        },
        {
          label: 'Status',
          value: 'status',
          key: 'status'
        },
        {
          label: 'Period',
          value: 'period',
          key: 'period'
        },
        {
          label: 'Total Trades',
          value: 'total_trades',
          key: 'total_trades'
        },
        {
          label: 'Win Rate %',
          value: 'win_rate',
          key: 'win_rate'
        },
        {
          label: 'Total Return %',
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
				res = await getScannerBTList(page, orderby, this.searchKey)
        console.log('列表响应', res)
				if (res.status == 200) {
					let data = res.data.results
					data = data.map(item => {
            item.status = capitalizeFirstLetter(item.status)
            item.period = [item.start_date, item.end_date]
            item.signals = isJson(item.signals) ? JSON.parse(item.signals) : item.signals
            item.viewLoading = false
            item.deleteLoading = false
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
    async deleteSCBT(row) {
      const { url } = row
      const _this = this
      row.deleteLoading = true
			const res = await delScannerBT(url)
      const code = res.data.code
      if(code == 204) _this.popUpMsgBox('Successfully deleted')
      if(code == 403) _this.popUpMsgBox("Sorry, deleted item doesn't exist. Refresh the list")
      if(code == 404) {_this.popUpMsgBox('Delete failed')}
			row.deleteLoading = false
			await _this.getDataList(null)
    },
    async handleRowClick(row) {
      debugger
      row.viewLoading = true
      const {url, status:preStatus} = row
      const _this = this
      let res, listRes
      try {
        
        res = await getScannerBTResults(url)
        listRes = await getScannerBTResultsList(url)
      } catch (error) {
        console.error('error', error)
        _this.popUpMsgBox('Details Not Found')
        row.viewLoading = false
        return
      }
      const code = res.data?.code
      
      const status = res.data?.data?.status || preStatus
      if(code == 403) {_this.popUpMsgBox('Sorry, details not found. Possibly deleted or moved'); return}
      if(code == 200) {
        _this.popUpMsgBox('Backtest details viewed successfully')
        const data = res.data.data
        data['TRADE LIST'] = listRes.data.data
        _this.$emit('displayResultsData', data)
        // 如果说之前的状态是 running 之后的状态变成了 finish 或者 fail, 那么需要刷新列表
        if((preStatus === 'Running' || preStatus === 'running') && (['finish', 'Finish', 'Fail', 'fail'].includes(status))) await _this.getDataList(null) // 成功后刷新列表
      }
      if(status === 'Fail' || status === 'fail') _this.popUpMsgBox('Backtest failed. Adjust filters and rerun')
      if(code == 203) {row.viewLoading = false; _this.popUpMsgBox('Backtest in progress. Details and editing are unavailable');return}
      if(code != 200) {_this.$emit('displayResultsData', row)}
      row.viewLoading = false
    },
    async runSCBacktest(row) {
      debugger
      row.viewLoading = true
      // 如果结束时间是当天就直接调用 handleRowClick 方法
      if(row.end_date === timestampToTime(new Date())) {await this.handleRowClick(row); return}
      row.viewLoading = true
      await this.$emit('rerunSCBacktest', row)
      row.viewLoading = false
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
  justify-content: flex-end;
  align-items: center;
  padding: 0px 0px 20px 0px;
  border-bottom: 2px solid #dddddd;
}
.el-input-group{
  width: 20%;
}
.CPM-list-container{
  padding: 20px 20px 20px 0px;
}
.showDate {
  margin: 5px 0;
}
.ScannerBTTable .el-button i {
  font-size: 16px;
}
.ScannerBTTable .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  /deep/ .el-form-item__label {
    width: 200px;
  }
}
.demo-table-expand {
  margin-left: 130px;
}
</style>