<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Backtests</el-breadcrumb-item>
        <el-breadcrumb-item>Currrent Backtests</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格区域 -->


      <el-button @click="test" type="primary">Run Backtests</el-button>
      <el-button @click="savePorfolio" type="primary" plain>Save Porfolio</el-button>
      <el-table :data="backtestList" border stripe size="mini" v-loading='loading' @selection-change="isChecked">

        <el-table-column
          label="select"
          align="center"
          width="85px"
          type="selection"
        >
        <!-- <template slot-scope="scope">
                <el-checkbox v-model="checked" @click="isChecked(scope.row.id)"></el-checkbox>
          </template> -->
        </el-table-column>
        <el-table-column
          label="index"
          type="index"
          align="center"
          width="60px"
        ></el-table-column>
        <el-table-column
          label="name"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="description"
          prop="description"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="symbol"
          prop="stock"
          align="center"
        >
        </el-table-column>
      <el-table-column label="strategy name" align="center" prop="strategy.name">
        <template></template>
        </el-table-column>
      <el-table-column label="backtest period" prop="backtestPeriod" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="info" plain>{{scope.row.fromdate}}</el-button>
            <el-button size="mini" type="info" plain>{{scope.row.todate}}</el-button>
          </template>
      </el-table-column>
      <el-table-column label="status" prop="status" align="center" width="150px">
      </el-table-column>
      <el-table-column align="center" width="100px">
        <template slot-scope="scope">

            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              style="margin-right: 10px;"
              @click="showDialog(scope.row)"
            ></el-button>

          <el-popconfirm
            confirm-button-text='yes'
            cancel-button-text='no'
            icon="el-icon-info"
            icon-color="red"
            title="Are you sure you want to delete it?"
            @confirm="deleteBacktest(scope.row.id)"
          >
          <el-button type="danger" icon="el-icon-delete" circle slot="reference" size="mini"></el-button>
          </el-popconfirm>

        </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
        title="Backtest Result"
        :visible.sync="dialogVisible"
        width="30%">
          <el-table :data="backtestResultList" border stripe size="mini" v-loading="loading">
             <el-table-column
          label="Date"
          prop="Date"
          align="center"
        ></el-table-column>
         <el-table-column
          label="order"
          prop="order"
          align="center"
        ></el-table-column>
         <el-table-column
          label="price"
          prop="price"
          align="center"
        ></el-table-column>
          </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">cancle</el-button>
          <el-button type="primary" @click="dialogVisible = false">confirm</el-button>
        </span>
    </el-dialog>
    <edit-strategy-dialog
        :dialogFormVisible="dialogFormVisible"
        @closeBacktestDialog="closeBacktestDialog"
        :editData="editData"
        @getBacktestList="getBacktestList"
        :backtestItemId="backtestItemId"
      ></edit-strategy-dialog>
  </div>
</template>
<script>
import editStrategyDialog from '../backtestComponents/editStrategyDialog.vue'
export default {
  name: 'currentBacktest',
  data() {
    return {
      backtestList: [],
      strategyName: '',
      checkList: [],
      checked: false,
      backtestId: [],
      dialogVisible: false,
      img_data: '',
     dialogFormVisible: false,
     editData: {},
     loading: false,
     currentBacktestList: [],
     backtestItemId: 0,
     backtestResultList: [],
     loading: false
    }
  },
  created() {
    this.getBacktestList()
    this.getStrategyName()
  },
  components: {
    'edit-strategy-dialog': editStrategyDialog
  },
  methods: {
    selectBacktest(scope){
      this.$emit("setEntryData",(scope))
      this.closeDialog()
      this.signalList.entryChecked = !this.signalList.entryChecked
    },
    async getBacktestList() {
      this.loading = true
      const res = await this.$http.get('/demo/backtest/')
      if(res.status === 200){
        this.backtestList = res.data.results
        this.loading = false
      }else{
         this.loading = false                                                                                                                                                                                                                        
      }
    },
    async deleteBacktest(id){
      const { data: res } = await this.$http.delete('/demo/backtest/'+id+"/")
      this.$message.success({
           message: 'Successfully deleted',
           duration: 1000
         })
      this.getBacktestList()
    },
    test() {
      var params = {
        backtests: this.backtestId
      }
      this.loading = true
      ////('params',this.$qs.stringify(params));
      this.$http.post('/rundev/runbacktest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {
        this.backtestResultList = res.data.result
      this.img_data = res.data
      if(res.data !== ''){
        this.loading = false
        this.dialogVisible = !this.dialogVisible
      }}).catch(error => {
        console.warn(error)
        this.loading = false
      })
    },
    savePorfolio(){
      this.$store.commit('getSavePorfolioData',this.currentBacktestList)
      this.$router.push('/newporfolio',)
    },
    isChecked(val){
      ////(val);
      let backtests = [];
      this.currentBacktestList = val
      val.forEach(element => {
        backtests.push(element.id)
      });
      this.backtestId= backtests
      
    },
    async getStrategyName() {
      const id = this.backtestList
      // const res = await this.$http.get('/demo/strategies' + id + '/')

    },
    showDialog(row) {
      this.dialogFormVisible = !this.dialogFormVisible
      this.editData = row
      this.backtestItemId = row.id
    },
    closeBacktestDialog(){
      this.dialogFormVisible = false
    }
  }
}
</script>
<style lang="less" scoped></style>
