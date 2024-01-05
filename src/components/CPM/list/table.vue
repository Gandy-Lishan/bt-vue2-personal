<template>
  <div class="my-indicator-list-container">
    <div class="search-box">
      <el-button type="primary" round @click="handleCreate">Create Pattern Match</el-button>
      <el-input placeholder="Search" v-model="searchKey" @keyup.enter.native="handleQuery" 					clearable
					@clear="handleQuery">
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
      element-loading-background="rgba(0, 0, 0, 0.8)"
			style="width: 100%; height: 100%; margin: 0 auto;"
		>
    
      <el-table-column
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
                <span>{{ scope.row['time_frame']}}</span>
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
                <el-form-item label="Threshold">
                  [
                  <template v-for="(item, index) in scope.row['threshold']">
                    <span :key="index">{{ index === scope.row['threshold'].length - 1 ? item : `${item}, ` }}</span>
                  </template>
                  ]
                </el-form-item>
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
      </el-table-column>
			<template v-for="(l) in tableCol">
				<el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
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
          v-if="['Symbol', 'Timeframe', 'Total Trades', 'Total Return'].includes(l.label)"
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
							>{{`${item}`}}</el-button>
              </div>
            </template>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Threshold'].includes(l.label)"
				>
					<template slot-scope="scope">
            <template v-for="(item, index) in scope.row[l.value]">
              <p :key="index">{{`${item}`}}</p>
            </template>
					</template>
				</el-table-column>
			</template>
      <el-table-column align="center">
				<template slot-scope="scope">
        <el-button class="delete-btn" slot="reference" round size="mini" type="primary" icon="el-icon-delete"></el-button>
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
          value: 'name'
        },
        {
          label: 'Symbol',
          value: 'symbol'
        },
        {
          label: 'Timeframe',
          value: 'time_frame'
        },
        {
          label: 'Period',
          value: 'period'
        },
        {
          label: 'Threshold',
          value: 'threshold'
        },
        {
          label: 'Total Trades',
          value: 'total_trades'
        },
        {
          label: 'Total Return',
          value: 'total_return'
        },
      ],
      tableData: []
    }
  },
  async created() {
    this.tableData = [
      {
        name: 'CPM1',
        symbol: 'SPY',
        time_frame: 'Daily',
        period: ['2013-12-01', '2013-12-10'],
        threshold: [0.85, 0.99],
        total_trades: 35,
        total_return: '158.95%'
      },
      {
        name: 'CPM2',
        symbol: 'AAPL',
        time_frame: 'Weekly',
        period: ['2013-12-01', '2013-12-28'],
        threshold: [0.95, 1.0],
        total_trades: 35,
        total_return: '158.95%'
      }
    ]
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'darken-row'
			}
			return ''
		},
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},
    handleCreate() {
      this.$router.push('/cpm/create')
    },
    handleRowClick(row) {
      console.log(row)
      const data = JSON.stringify(row)
      this.$router.push({
        name: 'CPMResults',
        params: {
          data,
          usedFor: 'showCPMResults',
        }
      })
    },
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
.my-indicator-list-container{
  width: 90%;
  margin: 0 auto;
}
.showDate {
  margin: 5px 0;
}
</style>