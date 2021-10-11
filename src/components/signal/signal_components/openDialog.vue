<template>
<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
  <div class="container">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">Signal</el-breadcrumb-item>
        <el-breadcrumb-item>Open Signal</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="btns">
        <el-button size="mini" @click="backSignal">Back</el-button>
        <el-button
          size="mini"
          @click="submitForm('form')"
          type="primary"
          :disabled="!open_formdata.name || !open_formdata.description"
          >Save</el-button
        >
      </div>
    </div>
    <div class="main">
      <div class="left">
        <p>Name/Description</p>
        <el-form
          ref="form"
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
        <el-form ref="form" :model="open_formdata" label-width="90px">
          <el-form-item label="Construction:" size="mini">
            <el-input
              v-model="open_formdata.construction"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item  label="Condition_1:">
            <el-select v-model="open_formdata.symbol" size="mini">
              <el-option label="MACD" value="symbol"></el-option>
            </el-select>
            <el-select v-model="open_formdata.symbol" size="mini">
              <el-option label="MACD 12MA" value="symbol"></el-option>
            </el-select>
            <el-select v-model="open_formdata.symbol" size="mini">
              <el-option label="Crossabove" value="symbol"></el-option>
            </el-select>
            <el-select v-model="open_formdata.symbol" size="mini">
              <el-option label="MACD 26MA" value="symbol"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Condition_2:">
            <el-select v-model="open_formdata.symbol" size="mini">
              <el-option label="MACD" value="symbol"></el-option>
            </el-select>
            <el-select v-model="open_formdata.symbol" size="mini">
              <el-option label="MACD 12MA" value="symbol"></el-option>
            </el-select>
            <el-select v-model="open_formdata.symbol" size="mini">
              <el-option label="Crossabove" value="symbol"></el-option>
            </el-select>
            <el-select v-model="open_formdata.symbol" size="mini">
              <el-option label="MACD 26MA" value="symbol"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</el-dialog>
</template>
<script>
export default {
  name: 'openDialog',
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Enter name is empty'))
      }
      if(value === this.open_formdata.name){
        callback(new Error('Name already exists'))
      }
    }
    const validateDes = (rule, value, callback) => {
      if ((value === '') | (value === undefined)) {
        callback(new Error('Input description is empty'))
      }
      if(value === this.open_formdata.description){
        callback(new Error('Discription already exists'))
      }
    }
    return {
      open_formdata: {},
      saveActive: true,
      // 表单验证规则
      openFormRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        description: [{ validator: validateDes, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.open_formdata = this.$route.query.params
    // get conditions
    
  },
  methods: {
    submitForm(form) {
      if (
        this.open_formdata.name !== '' &&
        this.open_formdata.description !== ''
      ) {
        this.$message.success('submitted successfully')
      } else {
        this.$message.error('cannot submit null value')
      }
    },
    backSignal() {
      this.$router.push('signal')
    }
  }
}
</script>
<style scoped>
.container {
  width: 600px;
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
  left: 494px;
  top: 23px;
}
.main {
  display: flex;
}
.left {
  width: 273px;
  margin-right: 20px;
  border: 1px solid #666;
  flex-grow: 1;
  padding: 10px;
}
.right {
  width: 273px;
  padding: 50px 0px 0px 0px;
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #666;
}
</style>
