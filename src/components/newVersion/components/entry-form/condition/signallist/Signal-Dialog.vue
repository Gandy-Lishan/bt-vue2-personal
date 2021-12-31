<template>
<div class="signalDialog">
  <el-dialog @open='getList' title="Select from signalList" :visible.sync="dialogTableVisible" :before-close='closeDialog' v-loading="loading">
  <el-tabs v-model="activeName" type="card">
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
      <el-table-column
        label="description"
        prop="description"
        align="center"
      ></el-table-column>
      <el-table-column label="analysis babel" prop="analysis" align="center" width="80px">
      </el-table-column>
        <el-table-column label="source" prop="user" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.user === 'admin'">system</span>
            <span v-else>custom</span>
          </template>
        </el-table-column>
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
      <el-table-column label="description" prop="description" align="center" width="80px">
             <el-table-column
        label="analysis basis"
        prop="analysis"
        align="center"
        width="105px"
      ></el-table-column></el-table-column>
        <el-table-column label="source" prop="user" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.user === 'admin'">system</span>
            <span v-else>custom</span>
          </template>
        </el-table-column>
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
import { Store } from 'vuex'
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import SignalCode from '@/tools/codeTool.js'
export default {
	extends: base,
  props: {
      dialogTableVisible: Boolean,
       },
  name: 'signalDialog',
  data(){
    return {
      signalList: [{entryChecked: false}],
      queryInfo: {
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
            const user = users
      let analysisBasis = this.$store.state.entryIndicatorRadio
      let indicator
      let type = this.$store.state.entryType
    if(this.type){
        type = JSON.stringify(['Long','Short'])}
      if(analysisBasis === 'sentiment'){
        indicator = ''
      }
      if(analysisBasis === 'technical'){
        indicator = JSON.stringify(['Commodity Channel Index', 'Relative Strength Index', 'MACD', 'Moving Average'])
      }
      
      //console.log(type,analysisBasis,indicator);
      this.signalList = []
      this.loading = true
      const { data: signalRes } = await this.$http.get('/dev/signal/', {
        params: {
          page: this.queryInfo.page,
          direction: type,
          user: user,
          analysis: analysisBasis,
          indicator: indicator
        }
      },{withCredentials: true})
       this.signalList = signalRes.results
       this.total = signalRes.count
      if(this.signalList.length !== 0){
        this.loading = false
      }
      console.log(signalRes);
      // this.total = systemRes.count + favoriteRes.count + customRes.count
      if(this.signalList.length <= 0){
        this.loading = false
      }

    },
    async getCustomList(users) {
      const user = users
            let analysisBasis = this.$store.state.entryIndicatorRadio
      let indicator
      let type = this.$store.state.entryType
    if(this.type){
        type = JSON.stringify(['Long','Short'])}
      if(analysisBasis === 'sentiment'){
        indicator = ''
      }
      if(analysisBasis === 'technical'){
        indicator = JSON.stringify(['Commodity Channel Index', 'Relative Strength Index', 'MACD', 'Moving Average'])
      }
      
      //console.log(type,analysisBasis,indicator);
      this.signalList = []
      this.loading = true
      const { data: res } = await this.$http.get('/dev/signal/', {
        params: {
          page: this.queryInfo.page,
          direction: type,
          user: user,
          analysis: analysisBasis,
          indicator: indicator
        }
      },{withCredentials: true})
       this.customList = res.results
       this.customTotal = res.count
      if(res.results.length <= 0){
        this.loading = false
      }
      this.loading = false
    },
    closeDialog(){
      this.$emit('openSignalDialog'),
      this.queryInfo.page = 1
    },
    checkEntry(scope){
      console.log('scope',scope)
        const obj = scope
        const a = new SignalCode()
        obj.code = a.decode(obj.code)
        obj.criteria = this.criteria
        obj.index = this.tabIndex
        console.log("1111",obj);
        const newObj = {fd: {},si: {}}
        // form detail
        newObj.fd.description = obj.description
        newObj.fd.direction = obj.direction
        newObj.fd.frequency = obj.frequency
        // signal indicator
        if(obj.code.analysis === "Technical"){
          newObj.si.technicalIndicator = obj.code.indicator
          newObj.si.sentimentIndicator = ""
        }else if(obj.code.analysis === "Sentiment") {
          newObj.si.sentimentIndicator = obj.code.indicator
          newObj.si.technicalIndicator = ""
        }
        this.$store.commit('setSignalDialogData',obj)
        this.closeDialog()
        this.signalList.entryChecked = !this.signalList.entryChecked
    },
    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.getSignallist("system")
    },
    async deleteFavoriteSignal(row){
      const { data: res } = await this.$http.delete('/dev/signal/'+row.id+"/")
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