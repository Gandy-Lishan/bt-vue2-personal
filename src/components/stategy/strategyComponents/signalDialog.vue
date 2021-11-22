<template>
<div class="signalDialog">
  <el-dialog @open='getList' title="signalList" :modal=false :visible.sync="dialogTableVisible" :before-close='closeDialog' v-loading="loading">
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
      customList: []
    }
  },
  methods: {
    getList(){
      this.getSignallist("system");
    },
    async getSignallist(users) {
      let analysisBasis
      if(this.entryTypeRadio === '1'){
        analysisBasis = 'sentiment'
      }
      if(this.entryTypeRadio === '2'){
        analysisBasis = 'technical'
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
          analysis_basis: 'sentiment'
        }
      },{auth:{
                  username: 'sentimentrader_backtest_api',
                  password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
                  // username: 'demo01',
                  // password: 'admin123456'
                }})
      this.signalList = signalRes.results
      if(this.signalList.length !== 0){
        this.loading = false
      }
      // this.total = systemRes.count + favoriteRes.count + customRes.count
      this.total = signalRes.count
      if(this.signalList.length <= 0){
        this.loading = false
      }

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
    }
  }
}
</script>
<style scoped>
</style>