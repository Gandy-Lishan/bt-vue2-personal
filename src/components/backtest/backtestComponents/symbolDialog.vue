<template>
<div class="symbolDialog">
  <el-dialog title="symbolList" :modal=false :visible.sync="symbolDialogVisible" :before-close='closeDialog'>
    <el-table :data="symbolList" border stripe size="mini">
      <el-table-column  width="35px">
          <template slot-scope="scope">
            <el-radio v-model="radio" @change="checkEntry(scope.row)" :label="scope.row.name">{{ '' }}</el-radio>
          </template>
      </el-table-column>
      <el-table-column label="name" prop="symbolName" align="center" >
      </el-table-column>
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
      radio: '',
    }
  },
  methods: {
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