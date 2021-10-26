<template>
<div class="symbolDialog">
  <el-dialog title="symbolList" :visible.sync="symbolDialogVisible" :before-close='closeDialog'>
   <!-- <el-pagination
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination> -->
    <el-table :data="symbolList" border stripe size="mini">
      <el-table-column  width="35px">
          <!-- <template slot-scope="scope">
          <el-checkbox  v-model="value" :label="scope.row.id" change="checkEntry(scope)"></el-checkbox>
          </template> -->
          <template slot-scope="scope">
            <el-radio v-model="radio" @change="checkEntry(scope.row)" :label="scope.row.name">{{ '' }}</el-radio>
          </template>
      </el-table-column>
      <!-- <el-table-column label="select">
        <template slot-scope="scope">
          <el-button @click="selectsymbol(scope.row)"></el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="name" prop="symbolName" align="center" >
      </el-table-column>
       <!-- <el-table-column
        label="description"
        prop="description" 
        align="center"
      ></el-table-column>
      <el-table-column
        label="cash"
        prop="cash"
        align="center"
      ></el-table-column>
      <el-table-column
        label="note"
        prop="note"
        align="center"
      ></el-table-column> -->
    </el-table>
</el-dialog>
</div>
</template>
<script>
export default {
  props: {
      symbolDialogVisible: Boolean
       },
  name: 'symbolDialog',
  data(){
    return {
      symbolList: [{
        symbolName: 'AAPL'
      },
      {
        symbolName: 'APG'
      }],
        entryChecked: false,
      // queryInfo: {
      //   type: this.type,
      //   page: 1
      // },
      radio: '',
      // total: 0
    }
  },
  methods: {
    // getList(){
    //   this.getsymbollist("system");
    // },
    // async getsymbollist(user) {
    //   this.symbolList = []
    //   console.log("aaa");
    //   this.loading = true
    //   this.queryInfo.type = this.type
    //   this.queryInfo.user = user
    //   const { data: res } = await this.$http.get('/demo/symbol/',
    //    {
    //     params: this.queryInfo
    //   }
    //   )
    //   // if (res.status !== 200) {
    //   //   return this.$message.error('获取信号列表失败')
    //   // }
    //   this.symbolList = this.symbolList.concat(res.results)
    //   this.total = res.count
    //   if(res.results.length <= 0){
    //     this.loading = false
    //      this.$message.success({
    //        message: 'The list of symbols is empty',
    //        duration: 1000
    //      })
    //   }
    //   // this.total = res.count
    //   this.loading = false

    // },
    closeDialog(){
      this.$emit('openSymbolDialog')
    },
    checkEntry(scope){
      this.$emit("setSymbolData",(scope))
      this.closeDialog()
      this.entryChecked = !this.entryChecked
    },
    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.getsymbollist("system")
    }
  }
}
</script>
<style scoped>
</style>