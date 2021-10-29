<template>
<div class="strategyDialog">
  <el-dialog title="strategyList" :visible.sync="strategyDialogVisible" :before-close='closeDialog'>
   <!-- <el-pagination
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination> -->
    <div class="search-Box">
      <el-input   placeholder="enter name or description" icon="search"  class="search"  v-model="search"></el-input>
    </div>
    <el-table :data="tables" border stripe size="mini">
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
      <el-table-column label="name" prop="name" align="center" width="80px">
      </el-table-column>
       <el-table-column
        label="description"
        prop="description" 
        align="center"
      ></el-table-column>
        <el-table-column
          label="entry_name"
          prop="signal_entry.name"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="exit_name"
          prop="signal_exit.name"
          align="center"
        >
        </el-table-column>
    </el-table>
</el-dialog>
</div>
</template>
<script>
export default {
  name: 'strategyDialog',
  props: {
      symbolDialogVisible: Boolean,
      strategyDialogVisible: Boolean
       },
  name: 'symbolDialog',
  data(){
    return {
      search: '',
      strategyList: [],
      entryChecked: false,
      radio: '',
    }
  },
  created() {
    this.getStrategyList()
  },
  computed:{
    tables(){
      if(this.search == ''){
        return this.strategyList
      }
      var search=this.search;
      if(search){
        return  this.strategyList.filter( item => {
          return Object.keys(item ).some(function(key){
            return String(item [key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.tableData
    }
  },
  methods: {
    async getStrategyList() {
      const { data: res } = await this.$http.get('/demo/strategies/')
      this.strategyList = res.results
      this.total = res.count
      for (let i = 0; i < this.strategyList.length; i++) {
        this.strategyList[i].signal_entry = JSON.parse(this.strategyList[i].signal_entry)
        this.strategyList[i].signal_exit = JSON.parse(this.strategyList[i].signal_exit)
        
      }
    },
    closeDialog(){
      this.$emit('openStrategyDialog')
    },
    checkEntry(scope){
      this.$emit("setStrategyData",(scope))
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