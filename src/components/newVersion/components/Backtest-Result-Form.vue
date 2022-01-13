<template>
<div class="backtest-result-container">
<el-row>
  <el-col :span="24">
    <div class="backtest_container">
      <el-form
        ref="backtestSetupForm" 
        :model="backtestResult"
        label-position="left">
        <el-col :span="8">
            <el-form-item label="Name:" prop="name">
              <el-input v-model="backtestResult.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="backtestResult.description"
                type="textarea"
                disabled
                :autosize="{ minRows: 6, maxRows: 6 }"
                resize="none"
              ></el-input>
            </el-form-item>
            <el-form-item label="Symbol name:" prop="symbol">
              <div class="enterSymbolBox">
              <el-select
                  disabled
                  v-model="backtestResult.symbol"
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
        </el-col>
        <el-col :span="8">
            <el-form-item label="Starting Capital:" prop="capital">
              <el-input v-model="backtestResult.capital" disabled></el-input>
            </el-form-item>
            <el-form-item label="Commission:" prop="commission">
              <el-input v-model="backtestResult.commission" disabled oninput="this.value=this.value.replace(/^0\.[0-9]{0,4}$/,'')" ></el-input>
            </el-form-item>
            <el-form-item label="Slippage:" prop="slippage">
              <el-input v-model="backtestResult.slippage"  disabled></el-input>
            </el-form-item>
            <el-form-item label="Money Management:" prop="moneyManagement">
              <div class="selectBox">
                <el-select v-model="value" disabled placeholder="Pleace select">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
              </div>
            </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Benchmark:" prop="benchmark">
              <div class="enterSymbolBox">
              <el-input v-model="backtestResult.benchmark" disabled></el-input>
              </div>
            </el-form-item>
          <!-- <div class="dateNote"> -->
            <!-- <el-form-item label="Start date"> -->
              <!-- <el-date-picker
                v-if="backtestResult.historyValue === 22"
                v-model="backtestResult.start_date"
                type="date"
                placeholder="Please select a start date"
              >
              </el-date-picker> -->
              <!-- <el-input
              disabled
              v-model="backtestResult.start_date"
              placeholder="Please select a start date">
              </el-input>
            </el-form-item> -->
          <!-- </div> -->
            <el-form-item label="End date">
              <!-- <el-date-picker
                v-if="backtestResult.historyValue === 22"
                v-model="backtestResult.end_date"
                type="date"
                placeholder="Please select a end date"
              >
              </el-date-picker> -->
              <el-input
                disabled
                v-model="backtestResult.end_date"
                placeholder="Please select a end date">
              </el-input>
            </el-form-item>
        </el-col>
      </el-form>
    </div>
  </el-col>
</el-row>
</div>
</template>
<script>
import { timestampToTime } from '../../../tools/formatDate.js'
export default {
  props:{
    backtestResult:Object
  },
  data() {
    return{
      strategyFormdata: {},
      symbolList: [],
      indexList: [],
      options: [{
					value: 0,
					label: 'All In / All Out (CASH)'
				}],
      loading: false,
      value: 0
    }
  },
 created(){
    this.backtestResult.endDate = timestampToTime(new Date())
    const str = this.backtestResult.endDate.split('-')
    str[0] = (Number(str[0]) - Number(this.backtestResult.historyValue)) + ''
    this.backtestResult.starDate = str.join('-')
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
    getEndDate(date){
      this.backtestResult.endDate = date
      const endDate = timestampToTime(date)
      const str = endDate.split('-')
      str[0] = (Number(str[0]) - Number(this.backtestResult.historyValue)) + ''
      this.backtestResult.starDate = str.join('-')
    },
    getBacktestHistory(val) {
      this.backtestResult.historyValue = val
      if(val <= 20){
      const str = this.backtestResult.endDate.split('-')
      str[0] = (Number(str[0]) - Number(this.backtestResult.historyValue)) + ''
      this.backtestResult.starDate = str.join('-')}
      if(val === 21){
        this.backtestResult.starDate = ''
      }
    },
    getBacktestHistory(val) {
      this.backtestResult.historyValue = val
    },
    saveBacktest() {
      const vm = this
      const strategyFormData = {}
      strategyFormData.stock = vm.backtestResult.symbolName
      strategyFormData.name = vm.backtestResult.name
      strategyFormData.description = vm.backtestResult.description
      strategyFormData.note = 'my note'
      strategyFormData.cash = vm.backtestResult.startingCapital
      strategyFormData.commission = vm.backtestResult.commission
      strategyFormData.slippage = vm.backtestResult.slippage
      strategyFormData.riskfreerate = vm.backtestResult.slippage
      strategyFormData.fromdate = timestampToTime(vm.backtestResult.starDate)
      strategyFormData.todate = timestampToTime(vm.backtestResult.endDate)
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
      }).catch( error => { console.warn(error); })
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
    getData() {
      const data = this.$store.state.favoriteBacktestRowData
      this.backtestId = data.id
      if(data.length !== 0){
      this.backtestResult.name = data.name
      this.backtestResult.description = data.description
      this.backtestResult.symbolName = data.stock
      this.strategyFormdata = data.strategy
      this.backtestResult.startingCapital = data.cash
      this.backtestResult.commission = data.commission
      this.backtestResult.slippage = data.slippage
      this.backtestResult.starDate = data.start_date
      this.backtestResult.endDate = data.end_date
      }
    },
    clearResultData() {
      this.backtestResult.name = ''
      this.backtestResult.description = ''
      this.backtestResult.startingCapital = ''
      this.backtestResult.commission = ''
      this.backtestResult.slippage = ''
      this.backtestResult.backtestHistory = ''
      this.backtestResult.value = 0
      this.backtestResult.historyValue = 0
      this.backtestResult.starDate = ''
      this.backtestResult.endDate = ''
      this.backtestResult.symbolName = ''
    }
  }
}
</script>
<style lang="less" scoped>
.backtest_container{
  margin-top: 40px;
}
.backtest-result-container {
  padding-bottom: 1.25rem;
  margin-bottom: 4.25rem;
  border-bottom: 1px solid #6c6c6c;
}
</style>