<template>
<el-row>
  <el-col :span="24">
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
                :autosize="{ minRows: 10, maxRows: 10 }"
                resize="none"
              ></el-input>
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
          <div class="dateNote">
            <el-form-item label="Dates of backtest"></el-form-item>
            <el-form-item label="List out start and end dates"></el-form-item>
            <el-form-item label="Backtest Parameters"></el-form-item>
            <el-form-item label="List out all backtest parameters from entry/exit signals"></el-form-item>
          </div>
            <div class="setupBtns">
              <el-row>
                <el-button type="primary">Save Backtest</el-button>
              </el-row>
            </div>
        </el-col>
      </el-form>
    </div>
  </el-col>
</el-row>
</template>
<script>
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
        endDate: ''
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