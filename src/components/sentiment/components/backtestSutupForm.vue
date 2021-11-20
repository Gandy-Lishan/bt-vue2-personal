<template>
<el-row>
  <el-col :span="24">
    <!-- strategy-dialog -->
    <strategy-dialog
      ref="strategyDialog"
      :strategyDialogVisible="strategyDialogVisible"
      @openStrategyDialog="openStrategyDialog"
      @setStrategyData="setStrategyData"></strategy-dialog>
    <div class="backtest_container">
      <el-form
        ref="backtestSetupForm" 
        :model="backtestSetupFormdata"
        label-position="left">
        <el-col :span="8">
            <el-form-item label="Name:" prop="name">
              <el-input v-model="backtestSetupFormdata.name"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="backtestSetupFormdata.description"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 6 }"
                resize="none"
              ></el-input>
            </el-form-item>
            <el-form-item label="Symbol name:" prop="symbolName" size="mini">
              <div class="enterSymbolBox">
              <el-select
                  v-model="backtestSetupFormdata.symbolName"
                  filterable
                  remote
                  reserve-keyword
                  @change="getSymbolName(backtestSetupFormdata.symbolName)"
                  placeholder="enter keywords"
                  :remote-method="remoteMethod"
                  :loading="loading">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              </div>
            </el-form-item>
            <!-- <el-form-item label="Strategy:" size="mini">
              <el-button class="LisBtns" @click="openStrategyDialog" type="success" plain
                >Browse from Strategy List</el-button
              >
            </el-form-item> -->
        </el-col>
        <el-col :span="8">
            <el-form-item label="Starting Capital:" prop="startingCapital">
              <el-input v-model="backtestSetupFormdata.startingCapital"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Commission:" prop="commission">
              <el-input v-model="backtestSetupFormdata.commission"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Slippage:" prop="slippage">
              <el-input v-model="backtestSetupFormdata.slippage"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Money Management:" prop="moneyManagement">
              <div class="selectBox">
                <el-select size="mini" v-model="backtestSetupFormdata.value" 
                        @change="getSizeAllocationValue(backtestSetupFormdata.value)" placeholder="Pleace select">
                      <el-option
                        v-for="item in backtestSetupFormdata.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                      </el-option>
                    </el-select>
              </div>
            </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Backtest History:" prop="backtestHistory">
            <div class="selectBox">
              <el-select size="mini" @change="getBacktestHistory(backtestSetupFormdata.historyValue)" v-model="backtestSetupFormdata.historyValue" placeholder="Pleace select">
                <el-option
                  v-for="item in backtestSetupFormdata.historyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <div class="dateNote">
            <el-form-item label="Start date" size="mini">
              <el-date-picker
                v-if="backtestSetupFormdata.historyValue === 22"
                v-model="backtestSetupFormdata.starDate"
                type="date"
                placeholder="Please select a start date"
              >
              </el-date-picker>
              <el-input
              v-else
              disabled
              v-model="backtestSetupFormdata.starDate"
              placeholder="Please select a start date">
              </el-input>
            </el-form-item>
          </div>
            <el-form-item label="End date" size="mini">
              <el-date-picker
                v-if="backtestSetupFormdata.historyValue === 22"
                v-model="backtestSetupFormdata.endDate"
                type="date"
                placeholder="Please select a end date"
                @change="getEndDate(backtestSetupFormdata.endDate)"
              >
              </el-date-picker>
              <el-input
                v-else
                disabled
                v-model="backtestSetupFormdata.endDate"
                placeholder="Please select a end date">
              </el-input>
            </el-form-item>
            <div class="setupBtns">
              <el-row>
                <el-button type="primary" @click="saveBacktest">Save Backtest</el-button>
                <el-button type="primary">Run Backtest</el-button>
              </el-row>
            </div>
        </el-col>
      </el-form>
    </div>
  </el-col>
</el-row>
</template>
<script>
import strategyDialog from '../../backtest/backtestComponents/strategyDialog.vue'
import { timestampToTime } from '../../../tools/formatDate.js'
export default {
  data() {
    return{
      backtestSetupFormdata: {
        name: '',
        description: '',
        startingCapital: '',
        commission: '',
        slippage: '',
        backtestHistory: '',
        value: 0,
        historyValue: 1,
        options: [{
          value: 0,
          label: 'All In / All Out (CASH)'
        }, {
          value: 1,
          label: 'All In / When Out, (buy TLT)'
        }, {
          value: 2,
          label: 'All In / When Out, (buy GLD)'
        }, {
          value: 3,
          label: 'All In / When Out, (buy AGG)'
        }],
        historyOptions: [{
          value: 1,
          label: '1 Year'
        }, {
          value: 2,
          label: '2 Year'
        }, {
          value: 3,
          label: '3 Year'
        }, {
          value: 4,
          label: '4 Year'
        }, {
          value: 5,
          label: '5 Year'
        },{
          value: 10,
          label: '10 Year'
        },
        {
          value: 15,
          label: '15 Year'
        },
        {
          value: 20,
          label: '20 Year'
        },{
          value: 21,
          label: 'All History'
        },{
          value: 22,
          label: 'Custom...'
        },
        ],
        starDate: '',
        endDate: '',
        symbolName: '',
      },
      strategyDialogVisible: false,
      strategyFormdata: {},
      symbolList: [],
      indexList: [],
      options: [],
      loading: false
    }
  },
  components: {
    'strategy-dialog': strategyDialog
  },
  created() {
    this.backtestSetupFormdata.endDate = timestampToTime(new Date())
    const str = this.backtestSetupFormdata.endDate.split('-')
      str[0] = (Number(str[0]) - Number(this.backtestSetupFormdata.historyValue)) + ''
      this.backtestSetupFormdata.starDate = str.join('-')
  },
  computed: {
    listSet(){
      return this.symbolList.map(item => {
        return { value: `${item.stock}`, label: `${item.stock}` };
      });
    },
    indexSet(){
      return this.indexList.map(item => {
        return { value: `${item.symbol}`, label: `${item.symbol}` };
      });
    }
  },
  methods: {
      async remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          await this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getStocks?=ABMD',
          {auth:{
            username: 'sentimentrader_backtest_api',
            password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
          }}
          ).then(res => {
            this.symbolList = res.data
          }).catch(error => {
            console.log(error);
          })

          await this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getIndexes',
          {auth:{
            username: 'sentimentrader_backtest_api',
            password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
          }}
          ).then(res => {
            this.indexList = res.data
          }).catch(error => {
            console.log(error);
          })
          
          

          setTimeout(() => {
            this.loading = false;
            var symbolListTemp = this.listSet.filter(item => {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
                      item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
            var IndexListTemp = this.indexSet.filter(item => {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
                      item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
            this.options = symbolListTemp.concat(IndexListTemp)
          }, 200);
        } else {
          this.options = [];  
        }
    },
    openStrategyDialog() {
      this.strategyDialogVisible = !this.strategyDialogVisible
    },
    setStrategyData(data) {
      this.strategyFormdata = data
    },
    getSizeAllocationValue(val) {
      this.backtestSetupFormdata.value = val
    },
    getBacktestHistory(val) {
      this.backtestSetupFormdata.historyValue = val
      if(val <= 20){
      const str = this.backtestSetupFormdata.endDate.split('-')
      str[0] = (Number(str[0]) - Number(this.backtestSetupFormdata.historyValue)) + ''
      this.backtestSetupFormdata.starDate = str.join('-')}
      if(val === 21){
        this.backtestSetupFormdata.starDate = ''
      }
    },
    getSymbolName(val) {
      this.$store.commit('getSymbolName',val)
    },
    getEditBacktestData() {
      const data = this.$store.state.editStrategyData
      const vm = this
      vm.backtestSetupFormdata.name = data.name
      vm.backtestSetupFormdata.description = data.description
      vm.backtestSetupFormdata.symbolName = data.stock
      vm.backtestSetupFormdata.startingCapital = data.cash
      vm.backtestSetupFormdata.commission = data.commission
      vm.backtestSetupFormdata.slippage = data.slippage
      vm.backtestSetupFormdata.starDate = data.fromdate
      vm.backtestSetupFormdata.endDate = data.todate
    },
    saveBacktest() {
      const vm = this
      const strategyFormData = {}
      // strategyFormdata.sizeAllocation = vm.backtestSetupFormdata.value
      strategyFormData.stock = vm.backtestSetupFormdata.symbolName
      strategyFormData.name = vm.backtestSetupFormdata.name
      strategyFormData.description = vm.backtestSetupFormdata.description
      strategyFormData.note = 'my note'
      strategyFormData.cash = vm.backtestSetupFormdata.startingCapital
      strategyFormData.commission = vm.backtestSetupFormdata.commission
      strategyFormData.slippage = vm.backtestSetupFormdata.slippage
      strategyFormData.riskfreerate = vm.backtestSetupFormdata.slippage
      strategyFormData.cashalloc = 1
      if(this.backtestSetupFormdata.historyValue === 22){
        strategyFormData.fromdate = timestampToTime(vm.backtestSetupFormdata.starDate)
        strategyFormData.todate = timestampToTime(vm.backtestSetupFormdata.endDate)
      }else {
        strategyFormData.fromdate = vm.backtestSetupFormdata.starDate
        strategyFormData.todate = vm.backtestSetupFormdata.endDate
      }
      strategyFormData.status = 0
      strategyFormData.strategy = vm.$store.state.strategyId
      console.log('strategyFormData',strategyFormData);
      const params =  strategyFormData
            this.$http.post('/demo/backtest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then( res => {
        console.log('res',res);
        if(res.status === 201){
           this.$message.success({
           message: 'The save was successful',
           duration: 1000
         })
        this.$emit('updateFavoriteList')
        this.$emit('goToBacktestFavoriteForm')
        }
      }).catch( error => { console.log(error) })
    },
    updataStrategylist() {
      this.$refs.strategyDialog.getStrategyList()
    },
    getEndDate(date){
      this.backtestSetupFormdata.endDate = date
      const endDate = timestampToTime(date)
      const str = endDate.split('-')
      str[0] = (Number(str[0]) - Number(this.backtestSetupFormdata.historyValue)) + ''
      this.backtestSetupFormdata.starDate = str.join('-')
    }
  }
}
</script>
<style lang="less" scoped>
.backtest_container{
  margin-top: 40px;
}
.setupBtns button{
  margin: 10px 32px 0px 32px;
}
</style>