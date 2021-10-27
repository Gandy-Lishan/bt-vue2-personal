<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Backtests</el-breadcrumb-item>
        <el-breadcrumb-item>Currrent Backtests</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格区域 -->
      <el-button @click="test">Run Backtests</el-button>
      <el-table :data="backtestList" border stripe size="mini" @selection-change="isChecked">
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
      <el-table-column label="strategy name" align="center" prop="strategy.name" width="85px">
        <template></template>
        </el-table-column>
      <el-table-column label="backtest period" prop="backtestPeriod" align="center">
          <template slot-scope="scope">
            <el-button size="mini">{{scope.row.fromdate}}</el-button>
            <el-button size="mini">{{scope.row.todate}}</el-button>
          </template>
      </el-table-column>
      <el-table-column label="status" prop="status" align="center" width="150px">
      </el-table-column>
      <el-table-column align="center" width="100px">
        <template slot-scope="scope">
          <!-- <span @click="deleteBacktest(scope.row.id)">
            <i class="el-icon-delete"></i>
          </span> -->
          <el-popconfirm
            confirm-button-text='continue'
            cancel-button-text='cancel'
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
      <!-- 若表格数据过多可以增加分页区域 -->
      <!-- <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination> -->
    </el-card>
    <el-dialog
        title="Backtest Result"
        :visible.sync="dialogVisible"
        width="30%">
          <img :src="'data:image/jpg;base64,'+ img_data"></img>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">cancle</el-button>
          <el-button type="primary" @click="dialogVisible = false">confirm</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
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
      img_data: ''
    }
  },
  created() {
    this.getBacktestList()
    this.getStrategyName()
  },
  methods: {
    selectBacktest(scope){
      this.$emit("setEntryData",(scope))
      this.closeDialog()
      this.signalList.entryChecked = !this.signalList.entryChecked
      // console.log(id);
    },
    async getBacktestList() {
      const res = await this.$http.get('/demo/backtest/')
      if(res.status === 200){
        this.backtestList = res.data.results
      }else{
           this.$message.success({
           message: 'The list of signals is empty',
           duration: 1000
         })
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
      this.$http.post('/rundev/runbacktest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {console.log(res);
      this.img_data = res.data
      if(res.data !== ''){
        this.dialogVisible = !this.dialogVisible
      }}).catch(error => {
        console.log(error);
      })
    },
    isChecked(val){
      let backtests = [];
      val.forEach(element => {
        backtests.push(element.id)
      });
      this.backtestId= backtests
      
    },
    async getStrategyName() {
      const id = this.backtestList
      const res = await this.$http.get('/demo/strategies' + id + '/')
      console.log('33333',res);
    }
  }
}
</script>
<style lang="less" scoped></style>
