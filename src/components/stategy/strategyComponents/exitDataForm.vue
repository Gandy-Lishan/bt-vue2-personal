<template>
<div>
    <div class="header">
    </div>
    <div class="main">
      <div class="left">
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
          <el-form-item label="Type:" width="150px">
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
          <div v-for="(item, index) in conditionList" :key='index'>
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
    
      <!-- <div class="btns">
        <el-button size="mini" @click="clearDate">Back</el-button>
        <el-button
          size="mini"
          @click="submitForm()"
          type="primary"
          :disabled="(!open_formdata.name || !open_formdata.description)"
          >Save as</el-button
        >
      </div> -->
  </div>
</template>
<script>
export default {
  // name: 'openDialog',
  props: {
    exitData:Object,
  },
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
    openFormRules: {
    name: [{ validator: validateName, trigger: 'blur' }],
    description: [{ validator: validateDes, trigger: 'blur' }]
    },
    conditions:[">","<","CrossAbove","CrossBelow",],
    combinations:["AND","OR","SUM",],
    conditionList: [],
    open_formdata: {},
    initialFromData: {}
  }
  },
watch:{
  exitData(){
    this.openDialog();
  }
},
  methods: {
    clearDate() {
      this.conditionList = []
      this.open_formdata = {}
      this.submitFormDate = []
      this.dialogFormVisible = false
    },
    resetForm(formdata) {
      this.$refs[formdata].resetFields();

    },
    async openDialog(data) {
      let vm = this;
      this.conditionList = vm.exitData.conditions;
      this.open_formdata = vm.exitData
      Object.assign(vm.exitData,this.open_formdata)
      // const lists = this.open_formdata
      this.initialFromData['name'] = this.exitData.name
      this.initialFromData['description'] = this.exitData.description
      // const res = await this.$http.get('/demo/condition/', {
      //   params: {id: id}
      // })
      // if(res.status !== 200) return
      // this.conditionList = res.data.results
      // this.dialogFormVisible = true
      // this.conditionList.forEach((item,index)=> {
      //   window.sessionStorage.setItem('value', item.value)
      // })
    },
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
                // this.getFavoritelist()
                this.$emit('getFavoritelist')
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
  flex-direction: column;
}
.left {
  width: 355px;
}
.right {
  width: 355px;
}
</style>