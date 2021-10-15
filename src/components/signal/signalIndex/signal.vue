<template>
  <div>
    <!-- 面包屑导航区域 -->
    <router-view></router-view>
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
            <signal-table @openDialog="openDialog" :signalList="signalList" @addFavorites="addFavorites"></signal-table>
           
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
            <signal-table @openDialog="openDialog" :signalList="signalList"></signal-table>
  
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
            <signal-table @openDialog="openDialog" :signalList="signalList"></signal-table>
           
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
            <signal-table @openDialog="openDialog" :signalList="signalList"></signal-table>
   
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
  <!-- openDiaolog -->
  <el-dialog :visible.sync="dialogFormVisible">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">Signal</el-breadcrumb-item>
        <el-breadcrumb-item>Open Signal</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="left">
        <p>Name/Description:</p>
        <el-form
          ref="leftForm"
          :model="open_formdata"
          :rules="openFormRules"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="Name:" prop="name">
            <el-input v-model="open_formdata.name"  size="mini"></el-input>
          </el-form-item>
          <el-form-item label="Description:" prop="description">
            <el-input
              v-model="open_formdata.description"
              size="mini"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8 }"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item label="Type:">
            <el-input
              v-model="open_formdata.type"
              size="mini"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="Frequency:">
            <el-input
              v-model="open_formdata.frequency"
              size="mini"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <!-- <el-form ref="form" v-for="(item, index) in conditionList" :key="index" :model="item" label-width="90px" label-position="left"> -->
          <el-form ref="rightForm"  label-width="90px" label-position="left">
          <div v-for="(item, index) in conditionList" :key="index">
            <el-form-item label="condition_description:" size="mini">
            <el-input
              v-model="conditionList[index].condition_description"
              size="mini"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="parameter:" size="mini">
            <el-input
              v-model="conditionList[index].parameter"
              size="mini"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="condition:" size="mini">
            <el-input
              v-model="conditions[conditionList[index].condition]"
              size="mini"
              disabled
            ></el-input>
          </el-form-item>
           <el-form-item label="value:" size="mini">
            <el-input
              v-model="conditionList[index].value"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="index !== (conditionList.length - 1)" label="combination:" size="mini">
            <el-radio-group disabled v-model="open_formdata.combination">
              <el-radio :label="0">AND</el-radio>
              <el-radio :label="1">OR</el-radio>
              <el-radio :label="2">SUM</el-radio>
            </el-radio-group>
          </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    
      <div class="btns">
        <el-button size="mini" @click="clearDate">Back</el-button>
        <el-button
          size="mini"
          @click="submitForm()"
          type="primary"
          :disabled="(!open_formdata.name || !open_formdata.description)"
          >Save as</el-button
        >
      </div>
  </el-dialog>

</div>
</template>
<script>
import signalTable from "../signalComponents/signalTable.vue"
export default {
  name: 'signal',
  data() {
     const validateName = (rule, value, callback) => {
      const nameStr = window.sessionStorage.getItem('name')
      if (value === '') {
        callback(new Error('Enter name is empty'))
      }
    }
    const validateDes = (rule, value, callback) => {
      if ((value === '') | (value === undefined)) {callback(new Error('Input description is empty'))}
    }
    return {
      // 获取signal列表的参数对象
      queryInfo: {
        type: 'long',
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        // pagesize: 5
      },
      conditions:[">","<","CrossAbove","CrossBelow",],
      combinations:["AND","OR","SUM",],
      signalList: [],
      total: 0,
      dialogVisible: false,
      open_formdata: {},
      saveActive: true,
      nameStr: '',
      desStr: '',
      label: '',
      loading: false,
      conditionList: [],
      // 原始表单数据
      initialFromData: {},
      // 更改的表单数据
      submitFormDate: [],
      // 表单验证规则
      openFormRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        description: [{ validator: validateDes, trigger: 'blur' }]
      },
      dialogFormVisible: false,
    }
  },
  created() {
    this.getSignallist("system")
  },
  methods: {
    async openDialog(id,params) {
      this.open_formdata = params
      const lists = this.open_formdata
      this.initialFromData['name'] = lists.name
      this.initialFromData['description'] = lists.description
      const res = await this.$http.get('/demo/condition/', {
        params: {id: id}
      })
      if(res.status !== 200) return
      this.conditionList = res.data.results
      this.dialogFormVisible = true
      this.conditionList.forEach((item,index)=> {
        window.sessionStorage.setItem('value', item.value)
      })
    },
    async getSignallist(user) {
      this.signalList = []
      this.loading = true
      this.queryInfo.user = user
      const { data: res } = await this.$http.get('/demo/signal/',
       {
        params: this.queryInfo
      }
      )
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

    },

    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.getSignallist("system")
    },
    getFilterList(even) {
      this.queryInfo.type = even.name
      this.queryInfo.page = 1
      this.getSignallist("system")
    },
    // 提交表单：验证提交的是否与原来的相等以及value的值是否为空
    async submitForm() {
      let vm = this;
      const conditions = vm.conditionList
      let formData = vm.open_formdata
      // 提交的 ['name','description','value'] 组成的数组 submitFormDate
      const submitFormDate = {};
      submitFormDate['name'] = formData.name
      submitFormDate['description'] = formData.description
      conditions.forEach((item, index) => {
        submitFormDate['value'] = item.value
      })
      if(submitFormDate['name'] !== this.initialFromData['name'] && submitFormDate['description'] !== this.initialFromData['description']){
        if(submitFormDate['value'] !== ''){
                formData.conditions = JSON.stringify(conditions)
                const {data:res} = await vm.$http.post("/demo/create_signal/",vm.$qs.stringify(formData),{auth:{
                  // username: 'sentimentrader_backtest_api',
                  // password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
                  username: 'demo01',
                  password: 'admin123456'
                }})
                this.getSignallist()
                this.dialogFormVisible = false
                this.$message.success({
           message: 'Saved successfully',
           duration: 1000
         })
        }else{
          this.$message.error({
           message: 'The value of value entered is empty',
           duration: 1000
         })
        }
      }else {
        this.$message.error({
           message: 'The entered name and discription already exist',
           duration: 1000
         })
      }
    },
    backSignal() {
      this.$router.push('signal')
    },
    clearDate() {
      this.conditionList = []
      this.open_formdata = {}
      this.submitFormDate = []
      this.dialogFormVisible = false
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
  components:{signalTable},
  resetForm(formdata) {
      this.$refs[formdata].resetFields();

  }
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
