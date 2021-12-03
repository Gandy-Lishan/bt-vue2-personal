<template>
  <el-row>
    <el-col :span="24">
      <div class="favoriteForm_container">
        <el-table :data="strategyList">
          <el-table-column
          label="Backtest Name"
          align="center"
          prop="name"
          >
          </el-table-column>
          <el-table-column
          label="Symbol"
          align="center"
          prop="symbol"
          >
          </el-table-column>
          <el-table-column
          label="Entry Signal"
          align="center"
          prop="entrySignal"
          >
          </el-table-column>
          <el-table-column
          label="Exit Signal"
          align="center"
          prop="exitSignal"
          >
          </el-table-column>
          <el-table-column
          label="Backtest Period"
          align="center"
          prop="backtestPeriod"
          width="219px"
          >
            <template slot-scope="scope">
              <div class="dataBox">
                <el-button size="mini" type="info" plain>{{
                  scope.row.fromdate
                }}</el-button>
                <el-button size="mini" type="info" plain>{{
                  scope.row.todate
                }}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
          align="center"
          width="300px"
          >
          <template slot-scope="scope">
          <el-row>
            <el-tooltip class="item" effect="light" content="run" placement="bottom-start">
              <el-button type="success" icon="el-icon-caret-right" circle size="mini" @click="runbacktest(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="copy" placement="bottom-start">
              <el-button type="info" icon="el-icon-copy-document" circle size="mini" @click="copyBacktest(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="view results" placement="bottom-start">
              <el-button type="warning" icon="el-icon-view" circle size="mini" @click="viewBacktestResults(scope.row)"></el-button>
            </el-tooltip>
          </el-row>
          </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      strategyList: [
        {
          name: 'Short Term Combined Model',
          symbol: 'SPY',
          entrySignal: '<= -10',
          exitSignal: '>= 13.5',
          fromdate: '2000-1-2',
          todate: '2021-12-3'
        },
        {
          name: 'Macro Index Model',
          symbol: 'SPY',
          entrySignal: '>= 0.7',
          exitSignal: '< 0.7',
          fromdate: '2002-1-2',
          todate: '2021-12-3'
        }
      ]
    }
  },
  created() {
    this.getStrategyList()
  },
  methods: {
      async getStrategyList() {
      this.loading = true
      const { data: res } = await this.$http.get('/demo/strategies/')
      console.log(res);
      // this.strategyList = res.results
      // if(res.results.length <= 0){
      //   this.loading = false
      // }
      // this.total = res.count
      // this.loading = false
      // for (let i = 0; i < this.strategyList.length; i++) {
      //   this.strategyList[i].signal_entry = JSON.parse(
      //     this.strategyList[i].signal_entry
      //   )
      //   this.strategyList[i].signal_exit = JSON.parse(
      //     this.strategyList[i].signal_exit
      //   )
      // }
    },
  }
}
</script>