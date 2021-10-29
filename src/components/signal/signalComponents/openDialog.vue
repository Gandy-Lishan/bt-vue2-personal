<template>
<div>
<el-dialog :visible="dialogFormVisible" :show-close="false" close="clearDate">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">Signal</el-breadcrumb-item>
        <el-breadcrumb-item>Open Signal</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="left">
        <div><p style="font-weight: bold;">Name/Description:</p></div>
        <div class="lForm">
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
      </div>
      <div class="right">
        <!-- <el-form ref="form" v-for="(item, index) in conditionList" :key="index" :model="item" label-width="90px" label-position="left"> -->
        <el-form ref="rightForm" label-width="90px" label-position="left">
          <div v-for="(item, index) in conditionList" :key='index'>
            <!-- 必需 -->
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
            <el-form-item label="Condition:" size="mini">
              <el-input
                v-model="conditions[conditionList[index].condition]"
                size="mini"
                disabled
              ></el-input>
            </el-form-item>
            <!-- 变动输入框,对所有的indicator判断是否存在 -->
            <!-- <el-form-item v-if="'judgement' in conditionList[index]" label="Judgement:" size="mini">
              <el-input
                v-model="conditionList[index].judgement"
                size="mini"
              ></el-input>
            </el-form-item> -->
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
              size="mini"
            >
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
              <el-radio-group v-model="open_formdata.combination">
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
export default {
  name: 'openDialog',

  data() {

    /* new */
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Enter name is empty'))
      }
      // if(value === this.open_formdata.name){
      //   callback(new Error('Name already exists'))
      // }
    }
    const validateDes = (rule, value, callback) => {
      if ((value === '') | (value === undefined)) {
        callback(new Error('Input description is empty'))
      }
      // if(value === this.open_formdata.description){
      //   callback(new Error('Discription already exists'))
      // }
    }
    return {
      conditions:[">","<","CrossAbove","CrossBelow",],
      combinations:["AND","OR","SUM",],

      conditionList: [
        // {
        //   "signal": 51,
        //   "condition_description": "Bollinger Band Width Less",
        //   "parameter": "Bollinger Band Width Value",
        //   "condition": 1,
        //   "str_value": "Last Bollinger Band Width Value"
        // },
        // {
        //   "signal": 51,
        //   "condition_description": "Bollinger Band Width Less",
        //   "parameter": "Bollinger Band Width Value",
        //   "condition": 1,
        //   "str_value": "Bollinger Band Width Value lowest in the past 120 days",
        //   "period": 120
        // }
      ],

      // conditionList: [
      //   {
      //     "signal": 52,
      //     "condition_description": "CMFI CrossAbove",
      //     "parameter": "CMFI Value",
      //     "condition": 2,
      //     "value": 0,
      //     "period": 21
      //   },
      //   {
      //     "signal": 52,
      //     "condition_description": "EMA200 Less",
      //     "parameter": "EMA200 Value",
      //     "condition": 1,
      //     "str_value": "price"
      //   }
      // ],


      /* new */
      initialConditionList: [],
      open_formdata: {},
      saveActive: true,
      // 原始表单数据
      initialFromData: {},
      // 更改的表单数据
      submitFormDate: [],
      // 表单验证规则
      openFormRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        description: [{ validator: validateDes, trigger: 'blur' }]
      }
    }
  },
  created() {

  },
  props:{
      dialogFormVisible: Boolean,
  },
  methods: {
    async openDialog(id,params) {
      this.open_formdata = params
      const lists = this.open_formdata
      this.initialFromData['name'] = lists.name
      this.initialFromData['description'] = lists.description

      // 先用mock data测试
      const res = await this.$http.get('/demo/condition/', {
        params: {id: id}
      })
      if(res.status !== 200) return
      this.conditionList = res.data.results
      /* new */
      this.initialConditionList = this.conditionList

      //同步更新Visible为true
      this.$emit("update:dialogFormVisible",true)
      this.conditionList.forEach((item,index)=> {
        window.sessionStorage.setItem('value', item.value)
      })
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
      //检查有无改动
      if(submitFormDate['name'] !== this.initialFromData['name'] && submitFormDate['description'] !== this.initialFromData['description']){
        if(submitFormDate['value'] !== ''){
                formData.conditions = JSON.stringify(conditions)
                const {data:res} = await vm.$http.post("/demo/create_signal/",vm.$qs.stringify(formData),{auth:{
                  // username: 'sentimentrader_backtest_api',
                  // password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
                  username: 'demo01',
                  password: 'admin123456'
                }})


                // 改这
                //this.getSignallist()
                this.$emit("call-father","system")
                this.$emit("update:dialogFormVisible",false);
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

    /* new */
    resetValidate(formName) {
      this.$refs[formName].clearValidate()
    }
    ,
    clearDate() {
      // conditionList会在dialog打开的时候请求获取一次
      this.conditionList = this.initialConditionList
      this.open_formdata.name = this.initialFromData.name
      this.open_formdata.description = this.initialFromData.description
      this.submitFormDate = []

      this.resetValidate('leftForm')
      this.$emit("update:dialogFormVisible",false);
    },
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

/* new */
.btns {
  position: absolute;
  left: 695px;
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


/* new */
  display: flex;
  flex-direction: column;
}
.right {
  width: 273px;
  padding: 50px 0px 0px 0px;
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #666;
}

/* new */
.lForm{
  flex:1;
}


/* new */
.el-form--label-left{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
</style>
