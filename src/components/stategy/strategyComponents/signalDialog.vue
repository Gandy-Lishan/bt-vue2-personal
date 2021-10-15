<template>
<div class="signalDialog">
  <el-dialog @open='getList' title="signalList" :visible.sync="dialogTableVisible" :before-close='closeDialog'>
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
              <!-- <el-radio-group v-model="radio">
    <el-radio :label="scope.row.id">{{""}}</el-radio>
  </el-radio-group> -->
          </template>
      </el-table-column>
      <!-- <el-table-column label="select">
        <template slot-scope="scope">
          <el-button @click="selectSignal(scope.row)"></el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="type" prop="type" align="center" width="80px">
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
export default {
  props: {
      dialogTableVisible: Boolean,
      type: String
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
      total: 0
    }
  },
  methods: {
    getList(){
      this.getSignallist("system");
    },
    async getSignallist(user) {
      this.signalList = []
      console.log("aaa");
      this.loading = true
      this.queryInfo.type = this.type
      this.queryInfo.user = user
      const { data: res } = await this.$http.get('/demo/signal/',
       {
        params: this.queryInfo
      }
      )
      // if (res.status !== 200) {
      //   return this.$message.error('获取信号列表失败')
      // }
      this.signalList = this.signalList.concat(res.results)
      this.total = res.count
      if(res.results.length <= 0){
        this.loading = false
         this.$message.success({
           message: 'The list of signals is empty',
           duration: 1000
         })
      }
      // this.total = res.count
      this.loading = false

    },
    closeDialog(){
      this.$emit('openDialog')
    },
    checkEntry(scope){
      this.$emit("setEntryData",(scope))
      this.closeDialog()
      this.signalList.entryChecked = !this.signalList.entryChecked
      // console.log(id);
    },
    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.getSignallist("system")
    },
    // selectSignal(row){
    //   console.log(row);
    // }
  }
}
</script>
<style scoped>
</style>