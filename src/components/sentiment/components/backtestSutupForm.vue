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
            <el-form-item label="Symbol:" prop="symbolName" size="mini">
              <div class="enterSymbolBox">
              <el-select
                  v-model="backtestSetupFormdata.symbolName"
                  id="symbolName"
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
              <el-input v-model="backtestSetupFormdata.startingCapital"  size="mini"
              @focus="setStartingCapital()" @blur="getStartingCapital()" ></el-input>
            </el-form-item>
            <el-form-item label="Commission:" prop="commission">
              <el-input v-model="backtestSetupFormdata.commission"  size="mini" @focus="setCommission()" @blur="getCommission()" ></el-input>
            </el-form-item>
            <el-form-item label="Slippage:" prop="slippage">
              <el-input v-model="backtestSetupFormdata.slippage"  size="mini" @focus="setSlippage()" @blur="getSlippage()"></el-input>
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
          
          <el-form-item label="Benchmark:" prop="benchmark" size="mini">
              <div class="enterSymbolBox">
              <!-- <el-select
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
              </el-select> -->
              <el-input v-model="backtestSetupFormdata.symbolName" disabled></el-input>
              </div>
            </el-form-item>
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
                @change="getStarDate(backtestSetupFormdata.starDate)"
              >
              </el-date-picker>
              <el-input
              v-else
              disabled
              v-model="backtestSetupFormdata.starDate">
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
                <el-col :offset="6">
                <el-button type="primary" @click="saveBacktest">Save Backtest</el-button>
                <!-- <el-button type="primary">Run Backtest</el-button> -->
                </el-col>
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
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
export default {
  data() {
    return{
      backtestSetupFormdata: {
        name: '',
        description: '',
        startingCapital: '100000',
        commission: '0.001',
        slippage: '0.001',
        backtestHistory: '',
        value: 0,
        historyValue: 1,
        options: [{
          value: 0,
          label: 'All In / All Out (CASH)'
        }, 
        // {
        //   value: 1,
        //   label: 'All In / When Out, (buy TLT)'
        // }, {
        //   value: 2,
        //   label: 'All In / When Out, (buy GLD)'
        // }, {
        //   value: 3,
        //   label: 'All In / When Out, (buy AGG)'
        // }
        ],
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
        initSymbolName: ''
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
    this.getData()
    this.backtestSetupFormdata.endDate = timestampToTime(new Date())
    const str = this.backtestSetupFormdata.endDate.split('-')
    str[0] = (Number(str[0]) - Number(this.backtestSetupFormdata.historyValue)) + ''
    this.backtestSetupFormdata.starDate = str.join('-')

      var that = this
      var utils = function () { 
        let vm = this; 
        vm.setSymbol = function (symbol) { 
          that.backtestSetupFormdata.symbolName = symbol
        }
        vm.b = function () { alert('b'); } 
      } 
      return window.utils = new utils(); 

    // preload data
    

    

  },
watch: {
backtestSetupFormdata: {
		handler(newVal, oldVal) {
      console.log('new',newVal.symbolName);
      console.log('state',this.$store.state.symbolName);
      if(newVal.symbolName !== this.$store.state.symbolName){
      this.$emit('resetResultData')
      this.$emit('resetPerformanceData')
      }
		},
		immediate: true,
    deep: true
	}
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
      async getData(){
          await this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getStocks',
              {auth:{
                username: 'sentimentrader_backtest_api',
                password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
              }}
              ).then(res => {
                this.symbolList = res.data
              }).catch(error => {
                console.warn(error);
          })

          await this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getIndexes',
              {auth:{
                username: 'sentimentrader_backtest_api',
                password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
              }}
              ).then(res => {
                this.indexList = res.data
              }).catch(error => {
                console.warn(error);
          })
      },
      async remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
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
      this.backtestSetupFormdata.starDate = str.join('-')
      }
      if(val === 21){
        this.backtestSetupFormdata.starDate = ''
      }
    },
    getSymbolName(val) {
      this.$store.commit('getSymbolName',val)
      this.$emit('resetResultData')
      this.$emit('resetPerformanceData')
      // for (var studyInstanceName in CIQ.stxx.layout.studies) {
      //     CIQ.Studies.removeStudy(CIQ.stxx, CIQ.stxx.layout.studies[studyInstanceName])
      // }

      CIQ.addSymbol(val)
      // remove markers when symbol changes
      CIQ.hideMarker()
    },
    getEditBacktestData() {
      const data = this.$store.state.editStrategyData
      const vm = this
      vm.backtestSetupFormdata.uuid = data.id
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
      if(vm.backtestSetupFormdata.uuid){
      strategyFormData.uuid = vm.backtestSetupFormdata.uuid}
      strategyFormData.stock = vm.backtestSetupFormdata.symbolName
      strategyFormData.name = vm.backtestSetupFormdata.name
      strategyFormData.description = vm.backtestSetupFormdata.description
      strategyFormData.note = 'my note'
      strategyFormData.cash = vm.backtestSetupFormdata.startingCapital
      strategyFormData.commission = vm.backtestSetupFormdata.commission
      strategyFormData.slippage = vm.backtestSetupFormdata.slippage
      strategyFormData.riskfreerate = vm.backtestSetupFormdata.slippage
      strategyFormData.cashalloc = 1
      console.log('tijiao',strategyFormData);
      if(this.backtestSetupFormdata.historyValue === 22){
        strategyFormData.fromdate = timestampToTime(vm.backtestSetupFormdata.starDate)
        strategyFormData.todate = timestampToTime(vm.backtestSetupFormdata.endDate)
      }else {
        strategyFormData.fromdate = vm.backtestSetupFormdata.starDate
        strategyFormData.todate = vm.backtestSetupFormdata.endDate
      }
      strategyFormData.status = 0
      strategyFormData.strategy = vm.$store.state.strategyId
      const params =  strategyFormData
            this.$http.post('/demo/backtest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then( res => {
        if(res.status === 201){
           this.$message.success({
           message: 'The save was successful',
           duration: 1000
         })
        this.$emit('updateFavoriteList')
        this.$emit('goToBacktestFavoriteForm')
        }
      }).catch( error => { console.warn(error); })
    },
    updataStrategylist() {
      this.$refs.strategyDialog.getStrategyList()
    },
    getEndDate(date){
      this.backtestSetupFormdata.endDate = date
      // const endDate = timestampToTime(date)
      // const str = endDate.split('-')
      // str[0] = (Number(str[0]) - Number(this.backtestSetupFormdata.historyValue)) + ''
      // this.backtestSetupFormdata.endDate = str.join('-')
    },
    getStarDate(date){
      this.backtestSetupFormdata.starDate = date
      // const starDate = timestampToTime(date)
      // const str = starDate.split('-')
      // str[0] = (Number(str[0]) - Number(this.backtestSetupFormdata.historyValue)) + ''
      // this.backtestSetupFormdata.starDate = str.join('-')
    },
    setStartingCapital() {
      if (this.backtestSetupFormdata.startingCapital == '100000'){this.backtestSetupFormdata.startingCapital =''}
    },
    getStartingCapital() {
      if (this.backtestSetupFormdata.startingCapital ==''){this.backtestSetupFormdata.startingCapital='100000'}
    },
    setCommission() {
      if (this.backtestSetupFormdata.commission == '0.001'){this.backtestSetupFormdata.commission =''}
    },
    getCommission() {
      if (this.backtestSetupFormdata.commission ==''){this.backtestSetupFormdata.commission='0.001'}
    },
    setSlippage() {
      if (this.backtestSetupFormdata.slippage == '0.001'){this.backtestSetupFormdata.slippage =''}
    },
    getSlippage() {
      if (this.backtestSetupFormdata.slippage ==''){this.backtestSetupFormdata.slippage='0.001'}
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