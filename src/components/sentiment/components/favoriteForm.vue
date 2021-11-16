<template>
  <el-row>
    <el-col :span="24">
      <div class="favoriteForm_container">
        <el-table :data="backtestList">
          <el-table-column
          label="Backtest Name"
          align="center"
          prop="name"
          >
          </el-table-column>
          <el-table-column
          label="Symbol"
          align="center"
          prop="stock"
          >
          </el-table-column>
          <el-table-column
          label="Entry Signal"
          align="center"
          prop="strategy.signal_entry.name"
          >
          </el-table-column>
          <el-table-column
          label="Exit Signal"
          align="center"
          prop="strategy.signal_entry.name"
          >
          </el-table-column>
          <el-table-column label="backtest period" prop="BacktestPeriod" align="center">
              <template slot-scope="scope">
                <div class="dataBox">
                      <el-button size="mini" type="info" plain>{{scope.row.fromdate}}</el-button>
                      <el-button size="mini" type="info" plain>{{scope.row.todate}}</el-button>
                </div>
              </template>
          </el-table-column>
          <el-table-column
          label="Status"
          align="center"
          prop="status"
          >
          </el-table-column>
          <el-table-column
          label="GAGR"
          align="center"
          prop="GAGR"
          >
          </el-table-column>
          <el-table-column
          label="Max DD"
          align="center"
          prop="maxDD"
          >
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
            <el-tooltip class="item" effect="light" content="edit" placement="bottom-start">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="editBacktest(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="copy" placement="bottom-start">
              <el-button type="info" icon="el-icon-copy-document" circle size="mini" @click="copyBacktest(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="delete" placement="bottom-start">
            <el-popconfirm
              confirm-button-text='yes'
              cancel-button-text='no'
              icon="el-icon-info"
              icon-color="red"
              title="Are you sure you want to delete it?"
              @confirm="deleteBacktest(scope.row.id)"
            >
              <el-button type="danger" icon="el-icon-delete" circle size="mini" slot="reference"></el-button>
            </el-popconfirm>
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
    return{
      backtestList: [],
      strategyName: '',
      checkList: [],
      checked: false,
      backtestId: [],
      dialogVisible: false,
      img_data: '',
      loading: false,
      currentBacktestList: [],
      backtestItemId: 0,
      backtestResultList: [],
      loading: false,
      editData: {}
    }
  },
  created() {
    this.getBacktestList()
    this.getStrategyName()
  },
  methods:{
    async getBacktestList() {
    this.loading = true
    const res = await this.$http.get('/demo/backtest/')
    if(res.status === 200){
      const arr = res.data.results
      this.loading = false
      arr.forEach(item => {
        item.strategy.signal_entry = JSON.parse(item.strategy.signal_entry)
        item.strategy.signal_exit = JSON.parse(item.strategy.signal_exit)
      })
      this.backtestList = arr
    }else{
        this.loading = false                                                                                                                                                                                                                        
    }
  },
  runbacktest(row) {
    let arr = []
    arr.push(row.id)
    this.backtestId= arr
     var params = {
        backtests: this.backtestId
      }
      this.loading = true
      this.$http.post('/rundev/runbacktest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {
        this.backtestResultList = res.data.result
      this.img_data = res.data
      if(res.data !== ''){
        this.loading = false
        this.dialogVisible = !this.dialogVisible
        // this.$emit('goBacktestResultForm')
      }}).catch(error => {
        console.log(error)
        this.loading = false
      })
  },
  async getStrategyName() {
    const id = this.backtestList
    const res = await this.$http.get('/demo/strategies' + id + '/')
  },
  editBacktest(row){
      // this.editData = row
      // this.backtestItemId = row.id
      this.$store.commit('getEditBacktestData',row)
      this.$emit('getBacktestDataTry')
      this.$emit('goTobacktestSetupForm')
      // this.$emit('getEditBacktestData',row)
  },
  async deleteBacktest(id){
    const { data: res } = await this.$http.delete('/demo/backtest/'+id+"/")
    this.$message.success({
          message: 'Successfully deleted',
          duration: 1000
        })
    this.getBacktestList()
  },
  copyBacktest(row){
      const strategyFormData = {}
      let currentBacktestData = {}
      currentBacktestData = row
      // strategyFormdata.sizeAllocation = currentBacktestData.value
      strategyFormData.stock = currentBacktestData.stock
      strategyFormData.name = currentBacktestData.name
      strategyFormData.description = currentBacktestData.description
      strategyFormData.note = 'my note'
      strategyFormData.cash = currentBacktestData.cash + ''
      strategyFormData.commission = currentBacktestData.commission + ''
      strategyFormData.slippage = currentBacktestData.slippage + ''
      strategyFormData.cashalloc = 0
      strategyFormData.riskfreerate = currentBacktestData.slippage + ''
      strategyFormData.fromdate = currentBacktestData.fromdate
      strategyFormData.todate = currentBacktestData.todate
      strategyFormData.status = 0
      strategyFormData.strategy = currentBacktestData.strategy.id
      const params =  strategyFormData
      this.$http.post('/demo/backtest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then( res => {
        if(res.status === 201){
           this.$message.success({
           message: 'The replication was successful',
           duration: 1000
         })
        //  this.$router.push('/currentBacktests')
        this.getBacktestList()
        }
      }).catch( error => { console.log(error) })
  },
  viewBacktestResults(row) {
    this.$store.commit('getRunBacktestData', row)
    this.$emit('getResultTry')
    this.$emit('goBacktestResultForm')
  }
}
}
</script>