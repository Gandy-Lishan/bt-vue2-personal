<template>
<el-row>
  <el-col :span="24">
    <!-- stratrgy-dialog -->
    <strategy-dialog
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
            <el-form-item label="Strategy:" size="mini">
              <el-button class="LisBtns" @click="openStrategyDialog" type="success" plain
                >Browse from Strategy List</el-button
              >
            </el-form-item>
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
                <el-select size="mini" v-model="backtestSetupFormdata.value" placeholder="Pleace select">
                      <el-option
                        v-for="item in backtestSetupFormdata.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
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
            <el-form-item label="Custom Dates for Backtest (Choose Custom in dropdown)"></el-form-item>
          </div>
            <el-form-item label="Start date" size="mini">
              <el-date-picker
                v-model="backtestSetupFormdata.starDate"
                type="date"
                placeholder="Please select a start date"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="End date" size="mini">
              <el-date-picker
                v-model="backtestSetupFormdata.endDate"
                type="date"
                placeholder="Please select a end date"
              >
              </el-date-picker>
            </el-form-item>
            <div class="setupBtns">
              <el-row>
                <el-button type="primary" @click="saveBacktest">Save Backtest</el-button>
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
        historyValue: 0,
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
          value: 0,
          label: '1 Year'
        }, {
          value: 1,
          label: '2 Year'
        }, {
          value: 2,
          label: '3 Year'
        }, {
          value: 3,
          label: '4 Year'
        }, {
          value: 4,
          label: '4 Year'
        },{
          value: 5,
          label: '10 Year'
        },
        {
          value: 6,
          label: '15 Year'
        },
        {
          value: 7,
          label: '20 Year'
        },{
          value: 8,
          label: 'All History'
        },{
          value: 9,
          label: 'Custom...'
        },
        ],
        starDate: '',
        endDate: '',
        symbolName: ''
      },
      strategyDialogVisible: false,
      strategyFormdata: {},
      symbolList: [],
      indexList: [],
      options: [],
      loading: false
    }
  },
 created(){
    this.getData()
  },
  components: {
    'strategy-dialog': strategyDialog
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
    }},
  methods: {
    getBacktestHistory(val) {
      this.backtestSetupFormdata.historyValue = val
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
      strategyFormData.fromdate = timestampToTime(vm.backtestSetupFormdata.starDate)
      strategyFormData.todate = timestampToTime(vm.backtestSetupFormdata.endDate)
      strategyFormData.status = 0
      strategyFormData.strategy = vm.strategyFormdata.id
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
        this.$emit('goToBacktestFavoriteForm')
        }
      }).catch( error => { console.log(error) })
    },
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
    setStrategyData(data) {
      this.strategyFormdata = data
    },
    openStrategyDialog() {
      this.strategyDialogVisible = !this.strategyDialogVisible
    },
    getData() {
      const data = this.$store.state.favoriteBacktestRowData
      if(data.length !== 0){
      this.backtestSetupFormdata.name = data.name
      this.backtestSetupFormdata.description = data.description
      this.backtestSetupFormdata.symbolName = data.stock
      this.strategyFormdata = data.strategy
      this.backtestSetupFormdata.startingCapital = data.cash
      this.backtestSetupFormdata.commission = data.commission
      this.backtestSetupFormdata.slippage = data.slippage
      this.backtestSetupFormdata.starDate = data.fromdate
      this.backtestSetupFormdata.endDate = data.todate
      // this.backtestSetupFormdata.historyValue = data.historyValue
      // this.backtestSetupFormdata.value = data.value
      }
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
</style>>