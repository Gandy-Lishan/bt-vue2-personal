<template>
  <div class="porfolioBacktestDialog">
    <el-dialog :visible.sync="backtestDialogVisible" :modal=true @opened="getBacktestFormdata" :close-on-press-escape=true :before-close='closeDialog' title="backtestDialog">
      <!-- stratetgyDialog -->
      <!-- <strategy-dialog
        :strategyDialogVisible="strategyDialogVisible"
        @openStrategyDialog="openStrategyDialog"
        @setStrategyData="setStrategyData"
      ></strategy-dialog> -->
      <!-- btns -->
      <div class="backtestDialogBtns">
          <el-button size="mini" @click="editNewBacktestFormdata()" type="primary">Save</el-button>
      </div>
      <div class="newBackestForm">
        <div class="newStrategyForm">
          <p class="pText">Name/Description</p>
          <el-form
            :model="symbolFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Symbol name:" prop="symbolName" size="mini">
              <el-select
                  v-model="symbolFormdata.symbolName"
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
            </el-form-item>
          </el-form>
          <el-form
            :model="backtestFormdata"
            label-width="80px"
            label-position="left">
            <el-form-item label="Name" prop="backtestName">
              <el-input v-model="backtestFormdata.backtestName" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="backtestFormdata.description"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
              ></el-input>
            </el-form-item>
            <el-form-item label="Cash:" prop="cash">
              <el-input v-model="backtestFormdata.cash" size="mini"></el-input>
            </el-form-item>
            </el-form>
        </div>
        <div class="strategyForm">
          <p class="pText">Strategy</p>
          <el-form
            :model="strategyFormdata"
            label-width="80px"
            label-position="left"
          >
            <!-- <el-form-item label="Strategy:" size="mini">
              <el-button class="LisBtns" @click="openStrategyDialog" type="success" plain
                >Browse from Strategy List</el-button
              >
            </el-form-item> -->
            <el-form-item label="Name:" prop="name">
              <el-input v-model="strategyFormdata.name" size="mini" disabled></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="strategyFormdata.description"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
                disabled
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="testPeriodForm">
          <p class="pText">Test period</p>
          <el-form
            :model="testPeriodFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Start date" size="mini">
              <el-date-picker
                v-model="testPeriodFormdata.starDate"
                type="date"
                placeholder="Please select a start date"
                @change="getStarDate(testPeriodFormdata.starDate)"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="End date" size="mini">
              <el-date-picker
                v-model="testPeriodFormdata.endDate"
                type="date"
                placeholder="Please select a end date"
                @change="getEndDate(testPeriodFormdata.endDate)"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="newStrategyForm">
          <p class="pText">Commission/slippage</p>
          <el-form
            :model="commissionFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Commission" prop="commission">
              <el-input
                v-model="commissionFormdata.commission"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="Slippage" prop="slippage">
              <el-input
                v-model="commissionFormdata.slippage"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="moneyManagementForm">
          <p class="pText">Money Management</p>
          <el-form
            :model="moneyManagementFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Size Allocation" prop="options">
              <el-select
                size="mini"
                v-model="moneyManagementFormdata.value"
                placeholder="Pleace select"
                @change="getSizeAllocationValue(moneyManagementFormdata.value)"
              >
                <el-option
                  v-for="(item, index) in moneyManagementFormdata.options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div class="moneyAdvance">
              <div class="advanceRadio">
                <el-form-item>
                  <el-checkbox
                    v-model="moneyManagementFormdata.checked"
                    @change="getMoneyAdvancedValue(moneyManagementFormdata.checked)"
                    >Advanced</el-checkbox
                  >
                </el-form-item>
              </div>
              <el-form-item
                label="Cash allocation"
                class="cashAllocation"
                style="margin-left: 11px"
              >
              <el-radio-group v-model="moneyManagementFormdata.radio" @change="getCashAllocationValue(moneyManagementFormdata.radio)">
                <el-radio label="All Cash"
                  >All Cash</el-radio
                >
                <el-radio label="Buy Gold Fund"
                  >Buy Gold Fund</el-radio
                >
                <el-radio label="Buy Real Estate Fund"
                  >Buy Real Estate Fund</el-radio
                >
              </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import strategyDialog from '../../backtest/backtestComponents/strategyDialog.vue'
export default {
  name: 'newBacktest',
  props: {backtestDialogVisible: Boolean,
  openBacktestFormdata: Object},
  data() {
    return {
      options: [],
      value: {},
      list: [],
      loading: false,
      symbolList: [],
      indexList: [],
      symbolFormdata: {},
      backtestFormdata: {
        id: 0,
        backtestName: '',
        description: '',
        cash: '',
        note: ''
      },
      strategyFormdata: {
        name: '',
        description: ''
      },
      testPeriodFormdata: {
        lookPeriod: '',
        observaionPeriod: '',
        starDate: '',
        endDate: '',
        checked: false,
      },
      commissionFormdata: {
        commission: '',
        slippage: '',
      },
      moneyManagementFormdata: {
        options: [
          {
            value: 0,
            label: 'All In/out',
          },
          {
            value: 1,
            label: 'Divided Evenly',
          },
          {
            value: 2,
            label: 'Kelly Criterion',
          },
        ],
        value: 0,
        checked: false,
        radio: '',
        cashAllocationArray: ['All Cash','Buy Gold Fund','Buy Real Estate Fund']
      },
      // strategyDialogVisible: false,
      newBacktestFormdata: {}
    }
  },
  components: {
    'strategy-dialog': strategyDialog,
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
    // openStrategyDialog() {
    //   this.strategyDialogVisible = !this.strategyDialogVisible
    // },
    // setStrategyData(data) {
    //   this.strategyFormdata = data
    // },
    getAdvancedValue(val) {
      this.testPeriodFormdata.checked = val
    },
    getSizeAllocationValue(val) {
      this.moneyManagementFormdata.value = val
    },
    getMoneyAdvancedValue(val) {
      this.moneyManagementFormdata.checked = val
    },
    getCashAllocationValue(idx) {
      this.moneyManagementFormdata.radio = idx
    },
    getStarDate(date) {
      this.testPeriodFormdata.starDate = date
    },
    getEndDate(date) {
      this.testPeriodFormdata.endDate = date
    },
    editNewBacktestFormdata() {
      let vm = this
      this.newBacktestFormdata.id = Number(this.backtestFormdata.id)
      this.newBacktestFormdata.stock = this.symbolFormdata.symbolName
      this.newBacktestFormdata.name = this.backtestFormdata.backtestName
      this.newBacktestFormdata.note = 'my note'
      this.newBacktestFormdata.description = this.backtestFormdata.description
      this.newBacktestFormdata.cash = Number(this.backtestFormdata.cash)
      this.newBacktestFormdata.cashalloc = Number(this.moneyManagementFormdata.value)
      this.newBacktestFormdata.commission = Number(this.commissionFormdata.commission)
      this.newBacktestFormdata.slippage = Number(this.commissionFormdata.slippage)
      this.newBacktestFormdata.riskfreerate = Number(this.commissionFormdata.slippage)
      this.newBacktestFormdata.fromdate = this.testPeriodFormdata.starDate
      this.newBacktestFormdata.todate = this.testPeriodFormdata.endDate
      this.newBacktestFormdata.status = 0
      this.newBacktestFormdata.exit_option = 0
      this.newBacktestFormdata.strategy = this.strategyFormdata.id
      const params =  this.newBacktestFormdata
      this.$http.put('/demo/backtest/'+ this.backtestFormdata.id + '/',vm.$qs.stringify(params)).then(
        res => {if(res.status === 200){
          this.$message.success({
          message: 'The edit was successful',
           duration: 1000})
          this.$emit('showBacktestDialog')
        }else{
           this.$message.error({
          message: 'The edit failed',
           duration: 1000})
          this.$emit('showBacktestDialog')
        }}
      )
      // this.$http.post('/demo/backtest/',this.$qs.stringify(params),{auth:{
      //   username: 'sentimentrader_backtest_api',
      //   password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      // }}).then( res => {
      //   if(res.status === 201){
      //      this.$message.success({
      //      message: 'The save was successful',
      //      duration: 1000
      //    })
      //    this.$router.push('/currentBacktests')
      //   }
      // }).catch( error => { //(error) })
    },
    closeDialog(){
      this.$emit('showBacktestDialog')
    },
    getBacktestFormdata() {
      this.backtestFormdata.id = this.openBacktestFormdata.id
      this.symbolFormdata.symbolName = this.openBacktestFormdata.stock
      this.backtestFormdata.cash = this.openBacktestFormdata.cash
      this.backtestFormdata.backtestName = this.openBacktestFormdata.name
      this.backtestFormdata.description = this.openBacktestFormdata.description
      this.strategyFormdata.id = this.openBacktestFormdata.strategy
      this.$http.get('/demo/strategies/' + this.openBacktestFormdata.strategy + '/').then(
        res => {if(res.status === 200){
          this.strategyFormdata.name = res.data.name
          this.strategyFormdata.description = res.data.description
          this.strategyFormdata.signal_entry = res.data.signal_entry
          this.strategyFormdata.signal_exit = res.data.signal_exit
        }}
      )
      this.testPeriodFormdata.endDate = this.openBacktestFormdata.todate
      this.testPeriodFormdata.starDate = this.openBacktestFormdata.fromdate
      this.commissionFormdata.commission = this.openBacktestFormdata.commission
      this.commissionFormdata.slippage = this.openBacktestFormdata.slippage
      this.moneyManagementFormdata.value = this.openBacktestFormdata.cashalloc
    }
  },
}
</script>
<style>
.pText {
  font-size: 15px;
  margin: 0px 0px 30px 0px;
}
.backtestDialogBtns {
  position: absolute;
  left: 1104px !important;
  top: 62px !important;
}
.newStrategyForm,
.strategyForm,
.testPeriodForm,
.moneyManagementForm {
  border: 1px solid #666;
  width: 353px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.advansedBox {
  width: 345px;
  border: 1px solid #666;
}
.newBackestForm {
  display: flex;
  margin-top: 40px;
  width: 1500px;
  flex-wrap: wrap;
}
.moneyAdvance {
  border: 1px solid #666;
}
.cashAllocation {
  display: flex;
  padding: 10px;
}
.porfolioBacktestDialog .el-dialog__wrapper .el-dialog{
  width: 1186px !important;
}
</style>