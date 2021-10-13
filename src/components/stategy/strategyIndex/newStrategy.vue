<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '#' }">Stategies</el-breadcrumb-item>
          <el-breadcrumb-item>New Stategy</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="btns">
        <el-row>
          <el-button size="mini">Back</el-button>
          <el-button size="mini">Save</el-button>
          <el-button size="mini">Apply in main chart</el-button>
          <el-button size="mini">Backtest Strategy</el-button>
        </el-row>
      </div>
      <div class="newStategyForm">
        <div class="nameForm">
          <p>Name/Description</p>
          <el-form
            ref="form"
            :model="nameFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Name:">
              <el-input v-model="nameFormdata.name"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Description:">
              <el-input
                v-model="nameFormdata.description"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="entryForm">
          <el-form ref="form" :model="entryFormdata" label-width="90px" label-position="left">
            <el-form-item label="Entry" size="mini">
                <el-select v-model="entryFormdata.entry[0].label" clearable placeholder="请选择">
                  <el-option
                    v-for="item in entryFormdata.entry"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="Condition_1:">
              <el-input
                v-model="entryFormdata.condiction_1.macd_0"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_1.macd_1"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_1.macd_2"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_1.macd_3"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="combination:" size="mini">
              <el-radio-group v-model="entryFormdata.combination">
                <el-radio :label="0">AND</el-radio>
                <el-radio :label="1">OR</el-radio>
                <el-radio :label="2">SUM</el-radio>
              </el-radio-group>
            </el-form-item>
              <el-form-item  label="Condition_2:">
              <el-input
                v-model="entryFormdata.condiction_2.macd_0"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_2.macd_1"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_2.macd_2"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_2.macd_3"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="Action" size="mini">
                <el-select v-model="entryFormdata.action[0].label" clearable placeholder="请选择">
                  <el-option
                    v-for="item in entryFormdata.action"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="exitForm">
          <el-form ref="form" :model="entryFormdata" label-width="90px" label-position="left">
            <el-form-item label="Exit" size="mini">
                <el-select v-model="entryFormdata.entry[0].label" clearable placeholder="请选择">
                  <el-option
                    v-for="item in entryFormdata.entry"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="Condition_1:">
              <el-input
                v-model="entryFormdata.condiction_1.macd_0"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_1.macd_1"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_1.macd_2"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_1.macd_3"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="combination:" size="mini">
              <el-radio-group v-model="entryFormdata.combination">
                <el-radio :label="0">AND</el-radio>
                <el-radio :label="1">OR</el-radio>
                <el-radio :label="2">SUM</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item  label="Condition_2:">
              <el-input
                v-model="entryFormdata.condiction_2.macd_0"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_2.macd_1"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_2.macd_2"
                size="mini"
              ></el-input>
              <el-input
                v-model="entryFormdata.condiction_2.macd_3"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="Action" size="mini">
              <el-select v-model="entryFormdata.action[0].label" clearable placeholder="请选择">
                <el-option
                  v-for="item in entryFormdata.action"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
   name: 'newStategy',
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Enter name is empty'))
      }
      if(value === this.nameFormdata.name){
        callback(new Error('Name already exists'))
      }
    }
    const validateDes = (rule, value, callback) => {
      if ((value === '') | (value === undefined)) {
        callback(new Error('Input description is empty'))
      }
      if(value === this.nameFormdata.description){
        callback(new Error('Discription already exists'))
      }
    }
    return {
      nameFormdata: {
        name: '',
        discription: ''
      },
      entryFormdata: {
        entry: [{
          label: 'Browse from Entry List',
          value: 1
        },{
          label: 'Create New Entry',
          value: 2}],
        exit: [{
          label: 'Browse from Entry List',
          value: 1
        },{
          label: 'Create New Entry',
          value: 2}],
        condiction_1: {
          macd_0: 'MACD',
          macd_1: 'MACD 12MA',
          macd_2: 'Crossabove',
          macd_3: 'MACD 26MA',
        },
        condiction_2: {
          macd_0: 'RSI',
          macd_1: 'RSI value',
          macd_2: 'Less than',
          macd_3: 'Input Value',
        },
        combinations:["AND","OR","SUM", 0],
        action: [{label:'Long',value: 1},{label:'Short',value: 2}]
        }
      }
    },
  created() {
    // this.entryFormdata = this.$route.query.params
    // get conditions
    console.log("hello");
  },
  methods: {
    submitForm(form) {
      if (
        this.entryFormdata.name !== '' &&
        this.entryFormdata.description !== ''
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
.btns{
  position: absolute;
  left: 825px;
  top: 102px;
}
.newStategyForm{
  display: flex;
  width: 900px;
  margin: 0 auto;
  margin-top: 40px;
}
.nameForm{
  width: 273px;
  margin-right: 20px;
  border: 1px solid #666;
  flex-grow: 1;
  padding: 10px;
}
.entryForm{
  width: 273px;
  padding: 50px 0px 0px 0px;
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #666;
  margin-right: 20px
}
.exitForm{
  width: 273px;
  padding: 50px 0px 0px 0px;
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #666;
}
</style>