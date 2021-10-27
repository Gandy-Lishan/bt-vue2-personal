<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible">
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '#' }">Stategies</el-breadcrumb-item>
          <el-breadcrumb-item>New Stategy</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- signalDialog -->
      <signal-dialog :type="entryType"  :dialogTableVisible="entryDialogTableVisible" @openDialog="openEntryDialog" @setEntryData='setEntryData'></signal-dialog>
      <signal-dialog :type="exitType"  :dialogTableVisible="exitDialogTableVisible" @openDialog="openExitDialog" @setEntryData='setExitData'></signal-dialog>
      <div class="btns">
        <el-row>
          <el-button size="mini">Back</el-button>
          <el-button size="mini" @click="saveStrategyData">Save</el-button>
          <el-button size="mini">Apply in main chart</el-button>
          <el-button size="mini">Backtest Strategy</el-button>
        </el-row>
      </div>
      <div class="newStategyForm">
        <div class="nameForm">
          <p>Name/Description</p>
          <el-form
           :rules="nameFormdataRules"
            ref="nameForm"
            :model="nameFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Name:" prop="name">
              <el-input v-model="nameFormdata.name"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
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
          <el-form ref="entryForm" :model="entryFormdata" label-width="90px" label-position="left">
            <el-form-item label="Action" size="mini">
                <el-select v-model="entryType" @change="selectEntryAction(entryType)" placeholder="Please select">
                  <el-option
                    v-for="item in entryFormdata.actionEntry"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Entry" size="mini">
                <el-button class="entryBtn" v-on:click="openEntryDialog">{{entryFormdata.entry[0].label}}</el-button>
            </el-form-item>
                  <!-- entryDataForm -->
              <entry-data-form  ref="entryDataFrom" :entryData="entryData"></entry-data-form>
          </el-form>
        </div>
        <div class="exitForm">
          <el-form ref="exitForm" :model="entryFormdata" label-width="90px" label-position="left">
            <el-form-item label="Action" size="mini">
              <el-select v-model="exitType"  @change="selectExitAction(exitType)" placeholder="Pleace select">
                <el-option
                  v-for="(item, index) in entryFormdata.exit"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Exit" size="mini">
              <el-button class="entryBtn" v-on:click="openExitDialog">{{entryFormdata.entry[0].label}}</el-button>
            </el-form-item>
              <!-- exitDataForm -->
              <exit-data-form ref="exitDataFrom" :exitData="exitData"></exit-data-form>
          </el-form>
        </div>
      </div>
    </el-card>
    </el-dialog>
  </div>
</template>
<script>
import signalDialog from '../strategyComponents/signalDialog.vue'
import entryDataForm from '../strategyComponents/entryDataForm.vue'
import exitDataForm from '../strategyComponents/exitDataForm.vue'
export default {
   name: 'newStategy',
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '' | (value === undefined)) {
        callback(new Error('Enter name is empty'))
      }
    }
    const validateDes = (rule, value, callback) => {
      if ((value === '') | (value === undefined)) {
        callback(new Error('Input description is empty'))
      }
    }
    return {
      dialogFormVisible: true,
      nameFormdata: {
        name: '',
        description: ''
      },
      nameFormdataRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        description: [{ validator: validateDes, trigger: 'blur' }]
      },
      entryType: '',
      exitType: '',
      entryFormdata: {
        entry: [{
          label: 'Browse from signal List',
          value: 'Browse from signal List'
        }],
        actionEntry: [{label:'Long',value: 'long'},{label:'Short',value: 'short'}],
        actionExit: [{label:'Long',value: 'long'},{label:'Short',value: 'short'},{label:'Shortexit',value: 'shortexit'},{label:'Longexit',value: 'longexit'}],
        valueEntry: '',
        valueExit: '',
      exit:[],
        },
        strategyData:{ 
        signal_entry: {},
        signal_exit: {},
        },
        entryData:{},
        exitData: {},
        entryDialogTableVisible: false,
        exitDialogTableVisible:false
      }
    },
  methods: {
    async setEntryData(data){
       const res = await this.$http.get('/demo/condition/', {
        params: {id: data.id}
      })
      data.conditions = res.data.results;
      this.entryData = data;
      // this.$refs.entryDataFrom.openDialog(data);
    },
    async setExitData(data){
      const res = await this.$http.get('/demo/condition/', {
        params: {id: data.id}
      });
      data.conditions = res.data.results;
      this.exitData = data;
;
    },
    openEntryDialog() {
      this.entryDialogTableVisible  = !this.entryDialogTableVisible
    },
    openExitDialog() {
      this.exitDialogTableVisible  = !this.exitDialogTableVisible
    },
    selectEntryAction(value) {
      var data = {
        long:[{label:'Longexit',value: 'longexit'},{label:'Short',value: 'short'}],
        short:[{label:'Shortexit',value: 'shortexit'},{label:'Long',value: 'long'}]
      }
      this.valueEntry = value
      if(value === 'long'){
        this.entryFormdata.exit = data.long
      }else{
        this.entryFormdata.exit = data.short
      }
      this.entryFormdata.valueExit = ""
    },
    selectExitAction(value) {
      this.valueExit = value
    },
    saveStrategyData() {
      const nameForm = this.nameFormdata
      this.strategyData.name = this.nameFormdata.name
      this.strategyData.description = this.nameFormdata.description
      this.strategyData.signal_entry = this.entryData
      this.strategyData.signal_exit = this.exitData
      this.strategyData.signal_entry.entryAction = this.valueEntry
      this.strategyData.signal_exit.exitAction = this.valueExit
      var params =
          {name: this.strategyData.name,
          description: this.strategyData.description,
          signal_entry: JSON.stringify(this.strategyData.signal_entry),
          signal_exit: JSON.stringify(this.strategyData.signal_exit),
          user: ''
          }
      if((this.valueEntry === '' || this.valueExit === '') || (this.valueEntry === undefined || this.valueExit === undefined)){
            this.$message.error({
            message: 'Please select action',
            duration: 1000
          })
          return
      }
      if(this.entryData.id === undefined){
          this.$message.error({
            message: 'Please select entry signal',
            duration: 1000
          })
           return
      }
      if(this.exitData.id === undefined){
          this.$message.error({
            message: 'Please select exit signal',
            duration: 1000
          })
           return
      }
    const vm = this
    this.$http.post('/demo/strategies/',vm.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {if(res.status === 201){this.$message.success({
            message: 'The save was successful',
            duration: 1000
          });this.$router.push('/myStrategies')}else{this.$message.error({
            message: 'The save failed',
            duration: 1000
          })}}).catch(error => {
      console.log(error);
      })
    }
  },
  components: {
    'signal-dialog': signalDialog,
    'entry-data-form': entryDataForm,
    'exit-data-form': exitDataForm
  }
}
</script>
<style scoped>
.btns{
  position: absolute;
  left: 997px;
  top: 102px;
}
.newStategyForm{
  display: flex;
  margin: 0 auto;
  margin-top: 40px;
}
.nameForm{
  width: 353px;
  margin-right: 20px;
  border: 1px solid #666;
  padding: 10px;
}
.entryForm{
  width: 353px;
  padding: 50px 0px 0px 0px;
  padding: 10px;
  border: 1px solid #666;
  margin-right: 20px
}
.exitForm{
  width: 353px;
  padding: 50px 0px 0px 0px;
  padding: 10px;
  border: 1px solid #666;
}
.entryBtn{
  padding: 7px 24px;
}
</style>