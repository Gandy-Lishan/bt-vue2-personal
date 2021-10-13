<template>
  <el-dialog title="signalList" :visible.sync="dialogTableVisible">
    <el-table :data="signalList" border stripe size="mini">
      <el-table-column label="type" prop="type" align="center">
      </el-table-column>
       <el-table-column
        label="analysis basis"
        prop="analysis_basis"
        align="center"
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
      <el-table-column label="frequency" prop="frequency" align="center">
      </el-table-column>
    </el-table>
</el-dialog>
</template>
<script>
export default {
    props: {
      dialogTableVisible: Boolean
    },
  data(){
    return {
      signalList: [],
      user: ''
    }
  },
  created() {
    this.getSignallist("system")
  },
  methods: {
    async getSignallist(user) {
      this.signalList = []
      this.loading = true
      this.user = user
      const { data: res } = await this.$http.get('/demo/signal/',
       {
        params: this.queryInfo
      }
      )
      console.log('11111',res);
      // if (res.status !== 200) {
      //   return this.$message.error('获取信号列表失败')
      // }
      this.signalList = res.results
      if(res.results.length <= 0){
        this.loading = false
         this.$message.success({
           message: 'The list of signals is empty',
           duration: 1000
         })
      }
      this.total = res.count
      this.loading = false

    }
  }
}
</script>