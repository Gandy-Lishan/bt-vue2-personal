<template>
<el-row>
  <el-col :span="16">
      <div class="main">
      <div class="signalLeft">
        <div><p>Name/Description:</p></div>
        <div class="signalLeftForm">
          <!-- signal-dialog -->
          <signal-dialog :type="entryType"  :dialogTableVisible="entryDialogTableVisible" @openDialog="openEntryDialog" @setEntryData='setEntryData'></signal-dialog>
          <el-form
            ref="leftForm"
            :model="signalFormData"
            :rules="signalFormRules"
            label-position="left"
          >
            <el-form-item label="Action" size="mini">
              <div class="selectBox">
                <el-select v-model="entryType" @change="selectEntryAction(entryType)" placeholder="Please select">
                  <el-option
                    v-for="item in entryFormdata.actionEntry"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="Entry" size="mini">
                <el-button class="entryBtn" v-on:click="openEntryDialog" type="success" plain>{{entryFormdata.entry[0].label}}</el-button>
            </el-form-item>
            <el-form-item label="Name:" prop="name">
              <el-input v-model="signalFormData.name"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="signalFormData.description"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
              ></el-input>
            </el-form-item>
            <el-form-item label="Type:">
              <el-input
                v-model="signalFormData.type"
                size="mini"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="Frequency:">
              <el-input
                v-model="signalFormData.frequency"
                size="mini"
                disabled
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="signalRight">
        <el-form ref="rightForm" label-position="left" label-width="80px" :rules="conditionsFormRules">
          <div v-for="(item, index) in conditionList" :key='index'>
            <!-- 必需 -->
            <el-form-item label="Indicators:" size="mini">
              <div class="searchBox">
                <el-input
                  v-model="conditionList[index].condition_description"
                  size="mini"
                >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="Condition_description:" size="mini">
              <el-input
                v-model="conditionList[index].condition_description"
                size="mini"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="Parameter:" size="mini">
              <el-input
                v-model="conditionList[index].parameter"
                size="mini"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="MA:" size="mini">
              <div class="selectBox">
                  <el-select v-model="maValue" placeholder="Pleace select">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </div>
            </el-form-item>
            <el-form-item label="Condition:" size="mini">
              <el-input
                v-model="conditions[conditionList[index].condition]"
                size="mini"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Two Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Two Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Three Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0' 
              label="FastMA:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].fast_ma"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Three Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Two Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Three Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="MiddleMA:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].middle_ma"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Two Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Three Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Two Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Three Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="LowMA:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].low_ma"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["MACD CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["MACD CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="MACDFast:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].macd_fast"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["MACD CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["MACD CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="MACDSlow:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].macd_slow"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["MACD CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["MACD CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="MACDSig:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].macd_sig"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["price lower Low"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Accumulation & Distribution Higher"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Price Higher High"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Accumulation & Distribution Lower"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["ATR trailing stop (High）line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["ATR trailing stop (Close) line CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Above Bollinger Upper Band"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Below Bollinger Lower Band"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Band Width Greater"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Band Width Less"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["EMA200 Less"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["EMA200 Greater"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Chandelier Exits CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Chandelier Exits CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["NAsdAQ Composite / S&P 500 Greater"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["S&P 500 Moving Average Greater"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Stay Above Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Stay Below Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Touch Above Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Touch Below Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Breakout Support"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Breakout Resistance"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Upper Band CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Lower Band CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Triple Tap Trend Reversal Divergence"].indexOf(conditionList[index].condition_description) === 0'  
              label="Str_value:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].str_value"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Parabolic SAR CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Parabolic SAR CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["price lower Low"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Accumulation & Distribution Higher"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Price Higher High"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Accumulation & Distribution Lower"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["ATR trailing stop (High）line CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["ATR trailing stop (Close) line CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["MACD CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["MACD CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Above Bollinger Upper Band"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Below Bollinger Lower Band"].indexOf(conditionList[index].condition_description) === -1 &&     
                    ["Bollinger Band Width Greater"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Bollinger Band Width Less"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["EMA200 Less"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["EMA200 Greater"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Chandelier Exits CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Chandelier Exits CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["NAsdAQ Composite / S&P 500 Greater"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["S&P 500 Moving Average Greater"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Two Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Two Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Three Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Three Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Stop Loss and Take profit"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Stay Above Moving Average"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Stay Below Moving Average"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Touch Above Moving Average"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Touch Below Moving Average"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Breakout Support"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Breakout Resistance"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Bollinger Upper Band CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Bollinger Lower Band CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Triple Tap Trend Reversal Divergence"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["stay how many days in the market"].indexOf(conditionList[index].condition_description) === -1'
              label="Value:"
              prop="value" 
              size="mini">
              <el-input
                v-model="conditionList[index].value"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Parabolic SAR CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Parabolic SAR CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Band Width Less"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["CMFI CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["CMFI CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Stay Above Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Stay Below Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["stay how many days in the market"].indexOf(conditionList[index].condition_description) === 0'  
              label="Period:" 
              size="mini">
              <el-input
                v-model="conditionList[index].period"
                size="mini"
              ></el-input>
          </el-form-item>
          <el-form-item 
            v-if='["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["ATR trailing stop (High）line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["ATR trailing stop (Close) line CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Chandelier Exits CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Chandelier Exits CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
            label="ATR_multiplier:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].atr_multiplier"
                size="mini"
              ></el-input>
          </el-form-item>
          <el-form-item 
            v-if='["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["ATR trailing stop (High）line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["ATR trailing stop (Close) line CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Chandelier Exits CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Chandelier Exits CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
            label="ATR_period:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].atr_period"
                size="mini"
              ></el-input>
          </el-form-item>
          <el-form-item 
            v-if='["Above Bollinger Upper Band"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Below Bollinger Lower Band"].indexOf(conditionList[index].condition_description) === 0'   
            label="SD:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].sd"
                size="mini"
              ></el-input>
          </el-form-item>

          <el-form-item 
            v-if='["Parabolic SAR CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Parabolic SAR CrossAbove"].indexOf(conditionList[index].condition_description) === 0'   
            label="Max_step:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].max_step"
                size="mini"
              ></el-input>
          </el-form-item>

          <el-form-item 
            v-if='["Parabolic SAR CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Parabolic SAR CrossAbove"].indexOf(conditionList[index].condition_description) === 0'   
            label="Acceleration_factor:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].acceleration_factor"
                size="mini"
              ></el-input>
          </el-form-item>

          <el-form-item 
            v-if='["Stop Loss and Take profit"].indexOf(conditionList[index].condition_description) === 0'   
            label="Stop_loss:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].stop_loss"
                size="mini"
              ></el-input>
          </el-form-item>

          <el-form-item 
            v-if='["Stop Loss and Take profit"].indexOf(conditionList[index].condition_description) === 0'   
            label="Take_profit:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].take_profit"
                size="mini"
              ></el-input>
          </el-form-item>
          
            <el-form-item v-if="index !== (conditionList.length - 1)" label="Combination:" size="mini">
              <el-radio-group v-model="signalFormData.combination">
                <el-radio :label="0">AND</el-radio>
                <el-radio :label="1">OR</el-radio>
                <el-radio :label="2">SUM</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </el-col>
</el-row>
</template>
<script>
import signalDialog from '../../stategy/strategyComponents/signalDialog.vue'
export default {
  props: {
    signalFormData: Object
  },
  data() {
  return {
    // Form validation rules
    signalFormRules: {
    name: [{ required: true, message: 'Please enter the name of the signal', trigger: 'blur' }],
    description: [{ required: true, message: 'Please enter a description of the signal', trigger: 'blur' }]
    },
    conditionsFormRules: {
    value: [{ required: true, message: 'Please enter the name of the signal', trigger: 'blur' },
    {type: 'number',message: 'Please enter number', trigger: 'blur'}]
    },
    conditions:[">","<","CrossAbove","CrossBelow",],
    combinations:["AND","OR","SUM",],
    conditionList: [],
    initialConditionList: [],
    initialFromData: {},
    maValue: 5,
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
    options: [{
          value: 5,
          label: 5
        }, {
          value: 10,
          label: 10
        }, {
          value: 20,
          label: 20
        }, {
          value: 30,
          label: 30
        }, {
          value: 60,
          label: 60
        }],
    entryDialogTableVisible: false,
    entryType: ''
  }
  },
  created(){
    this.openDialog(1)
  },
  components: {
    'signal-dialog': signalDialog
  },
  methods: {
    clearDate() {
      this.conditionList = this.initialConditionList
      
      this.signalFormData = this.initialFromData
      console.log(this.signalFormData)
      this.submitFormDate = []
    },
    resetForm(formdata) {
      this.$refs[formdata].resetFields();

    },
    async openDialog(id) {
      const lists = this.signalFormData
      this.initialFromData['name'] = lists.name
      this.initialFromData['description'] = lists.description
      const res = await this.$http.get('/demo/condition/', {
        params: {id: id}
      })
      if(res.status !== 200) return
      this.conditionList = res.data.results
      this.conditionList.forEach((item,index)=> {
        window.sessionStorage.setItem('value', item.value)
      })
    },
    openEntryDialog() {
      this.entryDialogTableVisible  = !this.entryDialogTableVisible
    },
    async setEntryData(data){
       const res = await this.$http.get('/demo/condition/', {
        params: {id: data.id}
      })
      data.conditions = res.data.results;
      this.entryData = data;
      // this.$refs.entryDataFrom.openDialog(data);
    },
  }
}
</script>
<style lang="less" scoped>
.main {
  display: flex;
  margin-top: 20px;
}
.signalLeft {
  margin-right: 20px;
  border: 2px solid #6c6c6c;
  border-radius: 10px;
  flex-grow: 1;
  padding: 10px;

  display: flex;
  flex-direction: column;
}
.signalRight {
  border-radius: 10px;
  padding: 65px 10px 10px 10px;
  flex-grow: 1;
  border: 2px solid #6c6c6c;
}
.signalLeftForm{
  flex:1;
}
.el-form .el-form-item .el-form-item__label{
    width: 80px !important;
  }
</style>