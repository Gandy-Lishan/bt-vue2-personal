<template>
<div class="signalDialog">
  <el-dialog @open='getList' title="Select from signalList" :modal=false :visible.sync="dialogTableVisible" :before-close='closeDialog' v-loading="loading">
  <el-tabs v-model="activeName">
    <el-tab-pane label="system" name="first">
   <el-pagination
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-table :data="signalList" border stripe size="mini">
      <el-table-column  width="35px">
          <!-- <template slot-scope="scope">
          <el-checkbox  v-model="value" :label="scope.row.id" change="checkEntry(scope)"></el-checkbox>
          </template> -->
          <template slot-scope="scope">
            <el-radio v-model="radio" @change="checkEntry(scope.row)" :label="scope.row.id">{{ '' }}</el-radio>
          </template>
      </el-table-column>
      <!-- <el-table-column label="select">
        <template slot-scope="scope">
          <el-button @click="selectSignal(scope.row)"></el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="type" prop="type" align="center" width="80px">
      </el-table-column>
        <el-table-column label="source" prop="user" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.user === 'admin'">system</span>
            <span v-else>custom</span>
          </template>
        </el-table-column>
       <el-table-column
        label="analysis basis"
        prop="analysis_basis"
        align="center"
        width="105px"
      ></el-table-column>
      <el-table-column
        label="name"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column
        label="used indicators"
        prop="used_indicators"
        align="center"
      ></el-table-column>
      <el-table-column label="frequency" prop="frequency" align="center" width="80px">
      </el-table-column>
    </el-table>
    </el-tab-pane>
    <el-tab-pane label="custom" name="second">
      <el-pagination
      @current-change="handleCurrentChange"
      :current-page="customInfo.page"
      :page-size="30"
      layout="total, prev, pager, next"
      :total="customTotal"
    >
    </el-pagination>
     <el-table :data="customList" border stripe size="mini">
      <el-table-column  width="35px">
          <!-- <template slot-scope="scope">
          <el-checkbox  v-model="value" :label="scope.row.id" change="checkEntry(scope)"></el-checkbox>
          </template> -->
          <template slot-scope="scope">
            <el-radio v-model="radio" @change="checkEntry(scope.row)" :label="scope.row.id">{{ '' }}</el-radio>
          </template>
      </el-table-column>
      <!-- <el-table-column label="select">
        <template slot-scope="scope">
          <el-button @click="selectSignal(scope.row)"></el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="type" prop="type" align="center" width="80px">
      </el-table-column>
        <el-table-column label="source" prop="user" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.user === 'admin'">system</span>
            <span v-else>custom</span>
          </template>
        </el-table-column>
       <el-table-column
        label="analysis basis"
        prop="analysis_basis"
        align="center"
        width="105px"
      ></el-table-column>
      <el-table-column
        label="name"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column
        label="used indicators"
        prop="used_indicators"
        align="center"
      ></el-table-column>
      <el-table-column label="frequency" prop="frequency" align="center" width="80px">
      </el-table-column>
      <el-table-column align="center" width="50px">
          <template slot-scope="scope">
            <el-popconfirm
            confirm-button-text='yes'
            cancel-button-text='no'
            icon="el-icon-info"
            icon-color="red"
            title="Are you sure you want to delete it?"
            @confirm="deleteFavoriteSignal(scope.row)"
            >
              <el-button type="danger" icon="el-icon-delete" circle size="mini" slot="reference"></el-button>
            </el-popconfirm>
          <!-- </span> -->
          </template>
        </el-table-column>
    </el-table>
    </el-tab-pane>
  </el-tabs>
</el-dialog>
</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
export default {
  props: {
      dialogTableVisible: Boolean,
      type: String,
      entryTypeRadio: String
       },
  name: 'signal-dialog',
  data(){
    return {
      signalList: [{entryChecked: false}],
      queryInfo: {
        type: this.type,
        page: 1
      },
      radio: "",
      total: 0,
      loading: false,
      favoriteList: [],
      customList: [],
      activeName: 'first',
      customTotal: 0,
      customInfo: {
        type: this.type,
        page: 1
      },
    }
  },
  methods: {
    getList(){
      this.getSignallist("system");
      this.getCustomList("custom_signal")
    },
    async getSignallist(users) {
      let analysisBasis
      let used_indicators
      if(this.entryTypeRadio === 'Sentiment_Indicators:'){
        analysisBasis = 'sentiment'
        used_indicators = ''
      }
      if(this.entryTypeRadio === 'Technical_Indicators:'){
        analysisBasis = 'technical'
        if(this.type === 'longexit'){
          used_indicators = JSON.stringify(['Commodity Channel Index','Relative Strength Index','MACD','Moving Average',
        'profit/loss exit signal','time-in-market exit signal','ATR Trailing Stops (Close)','Parabolic SAR',
        'ATR Trailing Stops (High)'])}else{
          used_indicators = JSON.stringify(['Commodity Channel Index','Relative Strength Index','MACD','Moving Average',
        'profit/loss exit signal','time-in-market exit signal','ATR Trailing Stops (Close)','Parabolic SAR',
        'ATR Trailing Stops (Low)'])
        }
      }
      this.signalList = []
      this.loading = true
      this.queryInfo.type = this.type
      this.queryInfo.analysis_basis = 'sentiment'
      this.queryInfo.user = users
      const { data: signalRes } = await this.$http.get('/demo/signal/', {
        params: {
          page: this.queryInfo.page,
          type: this.type,
          user: users,
          analysis_basis: analysisBasis,
          used_indicators: used_indicators
        }
      },{auth:{
                  username: 'sentimentrader_backtest_api',
                  password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
                  // username: 'demo01',
                  // password: 'admin123456'
                }})
      if(analysisBasis == 'sentiment'){
       this.signalList = signalRes.results
       this.total = signalRes.count
      }
      else{
        const arr = signalRes.results
        const newArr = []
        arr.forEach(item => {
          if(item.type !== 'neutral'){
            newArr.push(item)
          }
        })
        this.signalList = newArr
        this.total = signalRes.count
      }
      if(this.signalList.length !== 0){
        this.loading = false
      }
      // this.total = systemRes.count + favoriteRes.count + customRes.count
      if(this.signalList.length <= 0){
        this.loading = false
      }

    },
    async getCustomList(user) {
      let analysisBasis
      let used_indicators
      if(this.entryTypeRadio === 'Sentiment_Indicators:'){
        analysisBasis = 'sentiment'
        used_indicators = ''
      }
      if(this.entryTypeRadio === 'Technical_Indicators:'){
        analysisBasis = 'technical'
        if(this.type === 'longexit'){
          used_indicators = JSON.stringify(['Commodity Channel Index','Relative Strength Index','MACD','Moving Average',
        'profit/loss exit signal','time-in-market exit signal','ATR Trailing Stops (Close)','Parabolic SAR',
        'ATR Trailing Stops (High)'])}else{
          used_indicators = JSON.stringify(['Commodity Channel Index','Relative Strength Index','MACD','Moving Average',
        'profit/loss exit signal','time-in-market exit signal','ATR Trailing Stops (Close)','Parabolic SAR',
        'ATR Trailing Stops (Low)'])
        }
      }
      this.loading = true
      this.customInfo.type = this.type
      this.customInfo.user = user
      const { data: res } = await this.$http.get('/demo/signal/', {
        params: {
          type: this.customInfo.type,
          page: this.customInfo.page,
          user: user,
          analysis_basis: analysisBasis,
          used_indicators: used_indicators

        }
      })
      if(analysisBasis == 'sentiment'){
       this.customList = res.results
       this.customTotal = res.count
      }else{
        const arr = res.results
        const newArr = []
        arr.forEach(item => {
          if(item.type !== 'neutral'){
            newArr.push(item)
          }
        })
        this.customList = newArr
        this.customTotal = newArr.length
      }
      if(res.results.length <= 0){
        this.loading = false
      }
      this.loading = false
    },
    closeDialog(){
      this.$emit('openDialog'),
      this.queryInfo.page = 1
    },
    checkEntry(scope){
      this.$emit("setEntryData",(scope))
      this.closeDialog()
      this.signalList.entryChecked = !this.signalList.entryChecked
    },
    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.getSignallist("system")
    },
    async deleteFavoriteSignal(row){
      const { data: res } = await this.$http.delete('/demo/signal/'+row.id+"/")
      this.$message.success({
           message: 'Successfully deleted',
           duration: 1000
         })
      this.getCustomList("custom_signal")
    },
  }
}
</script>
<style scoped>
</style>