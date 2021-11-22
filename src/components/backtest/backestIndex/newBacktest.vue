<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Backtest</el-breadcrumb-item>
        <el-breadcrumb-item>New Backtest</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- symbol-dialog -->
      <!-- stratetgyDialog -->
      <strategy-dialog
        :strategyDialogVisible="strategyDialogVisible"
        @openStrategyDialog="openStrategyDialog"
        @setStrategyData="setStrategyData"
      ></strategy-dialog>
      <!-- btns -->
      <div class="btns">
        <el-row>
          <el-button size="mini">Back</el-button>
          <el-button size="mini" @click="saveNewBacktestFormdata" type="primary">Save</el-button>
          <el-button size="mini">Save and Run Backtest</el-button>
        </el-row>
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
            <!-- <el-form-item label="Note:" prop="note"> -->
              <!-- <el-input v-model="backtestFormdata.note" size="mini"></el-input>
            </el-form-item> -->
            </el-form>
        </div>
        <div class="strategyForm">
          <p class="pText">Strategy</p>
          <el-form
            :model="strategyFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Symbol:" size="mini">
              <el-button class="LisBtns" @click="openStrategyDialog" type="success" plain
                >Browse from Strategy List</el-button
              >
            </el-form-item>
            <el-form-item label="Name:" prop="name">
              <el-input v-model="strategyFormdata.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="strategyFormdata.description"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
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
    </el-card>
  </div>
</template>
<script>
import strategyDialog from '../backtestComponents/strategyDialog.vue'
import { timestampToTime } from '../../../tools/formatDate.js'
export default {
  name: 'newBacktest',
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
        backtestName: '',
        description: '',
        cash: '',
        note: ''
      },
      strategyFormdata: {},
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
      strategyDialogVisible: false,
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
    saveNewBacktestFormdata() {
      // this.newBacktestFormdata.sizeAllocation = this.moneyManagementFormdata.value
      this.newBacktestFormdata.stock = this.symbolFormdata.symbolName
      this.newBacktestFormdata.name = this.backtestFormdata.backtestName
      this.newBacktestFormdata.note = 'my note'
      this.newBacktestFormdata.description = this.backtestFormdata.description
      this.newBacktestFormdata.cash = this.backtestFormdata.cash
      this.newBacktestFormdata.cashalloc = this.moneyManagementFormdata.value
      this.newBacktestFormdata.commission = this.commissionFormdata.commission
      this.newBacktestFormdata.slippage = this.commissionFormdata.slippage
      this.newBacktestFormdata.riskfreerate = this.commissionFormdata.slippage
      this.newBacktestFormdata.fromdate = timestampToTime(this.testPeriodFormdata.starDate)
      this.newBacktestFormdata.todate = timestampToTime(this.testPeriodFormdata.endDate)
      this.newBacktestFormdata.status = 0
      this.newBacktestFormdata.strategy = this.strategyFormdata.id
      const params =  this.newBacktestFormdata
      //console.log('tijiao',this.newBacktestFormdata);ss
      this.$http.post('/demo/backtest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then( res => {
        if(res.status === 201){
           this.$message.success({
           message: 'The save was successful',
           duration: 1000
         })
         this.$router.push('/currentBacktests')
        }
      }).catch( error => { console.warn(error) })
    }
  },
}
</script>
<style>
.pText {
  font-size: 15px;
  margin: 0px 0px 30px 0px;
}
.btns {
  position: absolute;
  left: 997px;
  top: 102px;
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
</style>