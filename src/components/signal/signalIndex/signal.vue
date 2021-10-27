<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Signals</el-breadcrumb-item>
        <el-breadcrumb-item>System Signals</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 筛选框 -->
      <template>
        <el-tabs v-loading="loading" v-model="queryInfo.type" @tab-click="getFilterList">
          <el-tab-pane label="long" name="long">
            <!-- long 表格区域 -->
            <!-- <signal-table @openDialog="openDialog" :page="page" :signalList="signalList" @addFavorites="addFavorites"></signal-table> -->
            <signal-table @showDialog="showDialog" :signalList="signalList" @addFavorites="addFavorites" :page="page"></signal-table>
           
            <!-- 若表格数据过多可以增加分页区域 -->
           <el-pagination
              @current-change="handleCurrentChange"
              :current-page="queryInfo.page"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
           
          </el-tab-pane>
          <el-tab-pane label="short" name="short">
            <!-- short 表格区域 -->
            <!-- <signal-table @openDialog="openDialog" :page="page" :signalList="signalList"></signal-table> -->
            <signal-table :page="page" @showDialog="showDialog" :signalList="signalList"></signal-table>
            <!-- 若表格数据过多可以增加分页区域 -->
            <el-pagination
            
              @current-change="handleCurrentChange"
              :current-page="queryInfo.page"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="longexit" name="longexit">
            <!-- longexit 表格区域 -->
            <!-- <signal-table @openDialog="openDialog" :page="page" :signalList="signalList"></signal-table> -->
            <signal-table :page="page" @showDialog="showDialog" :signalList="signalList"></signal-table>
           
            <!-- 若表格数据过多可以增加分页区域 -->
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="queryInfo.page"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="shortexit" name="shortexit">
            <!-- shortexit 表格区域 -->
            <!-- <signal-table @openDialog="openDialog" :page="page" :signalList="signalList"></signal-table> -->
            <signal-table :page="page" @showDialog="showDialog" :signalList="signalList"></signal-table>
   
            <!-- 若表格数据过多可以增加分页区域 -->
           <el-pagination
              @current-change="handleCurrentChange"
              :current-page="queryInfo.page"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
  <open-dialog 
      @call-father="getSignallist"
      :dialogFormVisible.sync="dialogFormVisible" ref="child"
  >
  </open-dialog>

</div>
</template>
<script>
import signalTable from "../signalComponents/signalTable.vue"
import openDialog from '../signalComponents/openDialog.vue'

export default {
  name: 'signal',
  data() {
    /* 删除一部分重复的已从本文件中独立出去的代码 */
    //  const validateName = (rule, value, callback) => {
    //   const nameStr = window.sessionStorage.getItem('name')
    //   if (value === '') {
    //     callback(new Error('Enter name is empty'))
    //   }
    // }
    // const validateDes = (rule, value, callback) => {
    //   if ((value === '') | (value === undefined)) {callback(new Error('Input description is empty'))}
    // }
    return {
      // 获取signal列表的参数对象
      queryInfo: {
        type: 'long',
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        // pagesize: 5
      },
      page: 0,
      conditions:[">","<","CrossAbove","CrossBelow",],
      combinations:["AND","OR","SUM",],

      signalList: [],
      total: 0,
      //saveActive: true,
      nameStr: '',
      desStr: '',
      label: '',
      loading: false,
      // dialog默认关闭
      dialogFormVisible: false,
    }
  },
  created() {
    this.getSignallist("system")
    
  },
  methods: {
    showDialog(id,params){
      // 调用子组件函数,此时visibleDialog是作为false传过去
      this.$refs.child.openDialog(id,params)
    },
    
    async getSignallist(user) {
      this.loading = true
      this.queryInfo.user = user
      const { data: res } = await this.$http.get('/demo/signal/',
       {
        params: this.queryInfo
      }
      )
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

    },

    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      console.log(newpage);
      if(1< newpage < 4){
        this.page = newpage
      }
      if(newpage == 1){
        this.page = 0
      }
        this.getSignallist("system")
    },
    getFilterList(even) {
      this.page = 0
      this.queryInfo.type = even.name
      this.queryInfo.page = 1
      this.getSignallist("system")
    },
    searchSelect(val, idx) {
      if(val === 1) {
        this.signalList[idx].favorite = true
      }
      if(val === 2) {                                                                                                                                                                                                                                                        
        this.signalList[idx].favorite = false
      }
    },
    addFavorites(row){
      row.favorites = !row.favorites
      const addFavoritesData = row
      const vm = this
      if(addFavoritesData.favorites){
      this.$http.put('/demo/signal/'+row.id+"/",vm.$qs.stringify(addFavoritesData)).then(res => {}).catch(error => {console.log(error);})
    }
  },
  // removeFavorites(row){
  //   row.favorites = !row.favorites
  // }
  },
  components:{
    'signal-table':signalTable,
    'open-dialog':openDialog
  },  
}
</script>
<style scoped>
.container {
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  font-size: 13px;
}
.btns {
  position: absolute;
  left: 474px;
  top: 48px;
}
.main {
  width: 600px;
  display: flex;
}
.left {
  width: 150px;
  margin-right: 20px;
  border: 1px solid #666;
  flex-grow: 1;
  padding: 10px;
}
.right {
  width: 150px;
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #666;
}
</style>
