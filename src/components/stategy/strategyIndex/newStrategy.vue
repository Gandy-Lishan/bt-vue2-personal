<template>
  <div>
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
            <el-form-item label="Action" size="mini">
                <el-select v-model="entryType" @change="selectEntryAction(entryFormdata.valueEntry)" placeholder="Please select">
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
          <el-form ref="form" :model="entryFormdata" label-width="90px" label-position="left">
            <el-form-item label="Action" size="mini">
              <el-select v-model="exitType"  @change="selectExitAction(entryFormdata.valueExit)" placeholder="Pleace select">
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
      console.log(value);
      if(value === 'long'){
        this.entryFormdata.exit = data.long
      }else{
        this.entryFormdata.exit = data.short
      }
      this.entryFormdata.valueExit = ""
    },
    selectExitAction(value) {
      console.log(value);
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