<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '#' }">Stategies</el-breadcrumb-item>
          <el-breadcrumb-item>New Stategy</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- signalDialog -->
      <signal-dialog :dialogTableVisible="dialogTableVisible" @openSignalDialog='openSignalDialog'></signal-dialog>
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
                <el-select v-model="entryFormdata.valueEntry" >
                  <el-option
                    v-for="item in entryFormdata.actionEntry"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Entry" size="mini">
                <el-button class="entryBtn" @click="openSignalDialog">{{entryFormdata.entry[0].label}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="exitForm">
          <el-form ref="form" :model="entryFormdata" label-width="90px" label-position="left">
            <el-form-item label="Action" size="mini">
              <el-select v-model="entryFormdata.valueExit">
                <el-option
                  v-for="(item, index) in entryFormdata.actionExit"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Exit" size="mini">
              <el-button class="entryBtn">{{entryFormdata.entry[0].label}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import signalDialog from '../strategyComponents/signalDialog.vue'
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
          label: 'Browse from signal List',
          value: 'Browse from signal List'
        }],
        actionEntry: [{label:'Long',value: '1'},{label:'Short',value: '2'}],
        actionExit: [{label:'Long',value: '1'},{label:'Short',value: '2'}],
        valueEntry: 'Long',
        valueExit: 'Short'
        },
        dialogTableVisible: false
      }
    },
  methods: {
    openSignalDialog() {
      this.dialogTableVisible = true
      console.log('opened');
    }
  },
  components: {
    'signal-dialog': signalDialog
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
.entryBtn{
  padding: 7px 24px;
}
</style>