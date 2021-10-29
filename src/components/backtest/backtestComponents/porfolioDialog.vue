<template>
  <div class="porfolioDialog">
  <el-dialog :visible.sync="dialogFormVisible" class="spec-dialog" @opened="getEditData" :modal=false :before-close='closeDialog' title="porfolioDialog">
    <!-- symbol-dialog -->
      <symbol-dialog
        :symbolDialogVisible="symbolDialogVisible"
        @openSymbolDialog="openSymbolDialog"
        @setSymbolData="setSymbolData"
      ></symbol-dialog>
    <!-- stratetgyDialog -->
    <strategy-dialog
      :strategyDialogVisible="strategyDialogVisible"
      @openStrategyDialog="openStrategyDialog"
      @setStrategyData="setStrategyData"
    ></strategy-dialog>
    <!-- btns -->
      <div class="porfolioBtns">
          <el-button size="mini" @click="saveNewBacktestFormdata" type="primary">Save</el-button>
      </div>
          <div class="newBackestForm">
        <div class="newStrategyForm">
          <p class="pText">Name/Description</p>
          <el-form
            :model="symbolFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Symbol:" size="mini">
              <el-button class="LisBtns" @click="openSymbolDialog"
                >Browse from Symbol List</el-button
              >
            </el-form-item>
            <el-form-item label="Symbol name:" prop="symbolName">
              <el-input v-model="symbolFormdata.symbolName" size="mini"></el-input>
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
            <el-form-item label="Strategy:" size="mini">
              <el-button class="LisBtns" @click="openStrategyDialog"
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
            <!-- <el-form-item label="Exit option" prop="options">
                <el-select size="mini" v-model="strategyFormdata.value" placeholder="Pleace select">
                  <el-option
                    v-for="(item,index) in strategyFormdata.options"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item> -->
          </el-form>
        </div>
        <div class="testPeriodForm">
          <p class="pText">Test period</p>
          <el-form
            :model="testPeriodFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Start data" size="mini">
              <!-- <el-button class="LisBtns">Browse from Calenda</el-button> -->
              <el-date-picker
                v-model="testPeriodFormdata.starDate"
                type="date"
                unlink-panels
                placeholder="Please select a start date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="End data" size="mini">
              <el-date-picker
                v-model="testPeriodFormdata.endDate"
                type="date"
                unlink-panels
                placeholder="Please select a end date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="newStrategyForm">
          <p class="pText">commission/slippage</p>
          <el-form
            :model="commissionFormdata"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="commission" prop="commission">
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
import symbolDialog from '../../backtest/backtestComponents/symbolDialog.vue'
import strategyDialog from '../../backtest/backtestComponents/strategyDialog.vue'
export default {
  name: 'newBacktest',
  props: {
    dialogFormVisible: Boolean,
    editData: Object
  },
  data() {
    return {
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
      symbolDialogVisible: false,
      strategyDialogVisible: false,
      newBacktestFormdata: {}
    }
  },
  components: {
    'symbol-dialog': symbolDialog,
    'strategy-dialog': strategyDialog,
  },
  methods: {
    openSymbolDialog() {
      this.symbolDialogVisible = !this.symbolDialogVisible
    },
    openStrategyDialog() {
      this.strategyDialogVisible = !this.strategyDialogVisible
    },
    setSymbolData(data) {
      this.symbolFormdata = data
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
    saveNewBacktestFormdata() {
      let vm = this;
      this.newBacktestFormdata.stock = this.symbolFormdata.symbolName
      this.newBacktestFormdata.name = this.backtestFormdata.backtestName
      this.newBacktestFormdata.note = 'my note'
      this.newBacktestFormdata.description = this.backtestFormdata.description
      this.newBacktestFormdata.cash = this.backtestFormdata.cash
      this.newBacktestFormdata.cashalloc = this.moneyManagementFormdata.value
      this.newBacktestFormdata.commission = this.commissionFormdata.commission
      this.newBacktestFormdata.slippage = this.commissionFormdata.slippage
      this.newBacktestFormdata.riskfreerate = this.commissionFormdata.slippage
      this.newBacktestFormdata.fromdate = this.testPeriodFormdata.starDate
      this.newBacktestFormdata.todate = this.testPeriodFormdata.endDate
      this.newBacktestFormdata.status = 0
      this.newBacktestFormdata.strategy = this.strategyFormdata.id
      //  this.newBacktestFormdata.percentage = this.backtestFormdata.percentage
      const params =  this.newBacktestFormdata
      const backtestArr = []
      backtestArr.push(params)
      this.$emit('submitBacktestData', backtestArr)
      this.closeDialog()
      this.$http.post('/demo/porfolioItem/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then( res => {
        const backtestId = res.data.id
        vm.$emit('createPorfolioItems', backtestId)
        if(res.status === 201){
           this.$message.success({
           message: 'The save was successful',
           duration: 1000
         })
        //  this.$router.push('/currentBacktests')
        }
      }).catch( error => { console.log(error) })
    },
    closeDialog(){
      this.$emit('closeBacktestDialog')
    },
    getEditData() {
      this.backtestFormdata.backtestName = this.editData.name
      this.backtestFormdata.description = this.editData.description
      this.symbolFormdata.symbolName = this.editData.stock
      this.backtestFormdata.cash = this.editData.cash
      this.strategyFormdata.name = this.editData.strategy.name
      this.strategyFormdata.description = this.editData.strategy.description
      this.testPeriodFormdata.starDate = this.editData.fromdate
      this.testPeriodFormdata.endDate = this.editData.todate
      this.commissionFormdata.commission = this.editData.commission
      this.commissionFormdata.slippage = this.editData.slippage
      this.moneyManagementFormdata.value = this.editData.cashalloc
    }
  }
}
</script>
<style>
.pText {
  font-size: 15px;
  margin: 0px 0px 30px 0px;
}
.porfolioBtns {
  position: absolute;
  left: 1075px;
  top: 50px;
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
.spec-dialog .el-dialog__body {
  padding: 3px 30px;
  overflow-y: auto;
  height: calc(100vh - 140px);
}
</style>