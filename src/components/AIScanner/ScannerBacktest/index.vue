<template>
  <div class="CPMResults-container">
    <el-collapse v-model="activeNames" :accordion="false" class="CPMResults-content">
      <el-collapse-item name="1" class="form">
        <template v-slot:title>
          <div class="title">
            <p @click.stop>Scanner Backtest List</p>
          </div>
        </template>
        <div class="content">
            <ScannerBTTable ref="ScannerBTTable" @displayResultsData="displayResultsData"></ScannerBTTable>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" class="form">
        <template v-slot:title>
          <div class="title">
            <p @click.stop>Select Condition</p>
            <p>
              <el-tooltip class="item" effect="dark" content="Create New Scanner Backtest" placement="bottom-start">
                <el-button  type="warning" plain class="delete-btn" @click.stop="resetForm" size="small" icon="el-icon-plus">Create New</el-button>
              </el-tooltip>
            </p>
          </div>
        </template>
        <ScannerForm ref="ScannerForm" @changeSecondTab="changeSecondTab" @displayPreviewList="displayPreviewList" 
            @displayResultsAndFilter="displayResultsAndFilter" @refreshBTList="refreshBTList"></ScannerForm>
      </el-collapse-item>
      <el-collapse-item name="3" class="form">
        <template v-slot:title>
          <div class="title">
            <p @click.stop="() => {changeSecondTab('filter')}" :class="{ secondActive: activeSecondTab == 'filter' || '' }">Preview Filter List</p>
            <p @click.stop="() => {changeSecondTab('summary')}" :class="{ secondActive: activeSecondTab == 'summary' || '' }">Backtest Summary</p>
          </div>
        </template>
        <!-- <CPMSummary ref="Summary"></CPMSummary> -->
        <div class="content">
            <FilterTable v-show="activeSecondTab == 'filter'" ref="filterTable"
            :data="filterTableData" 
            :label="filterTableData.label" 
            :tableCol="filterTableData.tableCol" 
            :loading="loading"
            ></FilterTable>
            <Statistics v-show="activeSecondTab == 'summary'" ref="Statistics" :tradesData="tradesData"></Statistics>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
<script>
import Statistics from "./Statistics";
// import TIM from "./components/tim";
// import CorrInfo from "./components/corrInfo";
import ScannerForm from "./ScannerForm";
// import MaxMin from "../results/components/MaxMin";
import ScannerBTTable from "./Table";
import FilterTable from "./FilterTable";
const XLSX = require('xlsx');

export default {
  name: 'scannerai_backtest',
  data() {
    return {
      activeNames: ['1', '2', '3'],
      activeTab: 'statistics',
      activeSecondTab: 'filter',
      tradeDate: {},
      tradePrice: 'Close',
      chart_data: {},
      breadcrumbTitle: 'Back to Correlation Pattern Match List',
      direction: 'Long',
      StartEndDateArray: [],
      default_symbol: '',
      loading: false,
      tradesData: [],
      filterTableData: {
        content: [],
        label:'Filter Condition Preview',
        title: 'Filter Condition Preview',
        tableCol: [
          {label:'Date',value:'Date'},
          {label:'Symbol',value:'Symbol'},
          {label:'Close',value:'Close'},
          // {label:'Trend',value:'Market'},
          {label:'Direction',value:'Direction'},
          {label:'Signal',value:'_Signal'},
          {label:'Win Rate(%)',value:'WinRate'},
          {label:'Stop Loss(%)',value:'StopLoss'},
          {label:'Profit Target(%)',value:'ProfitTarget'},
          {label:'Best Time In Market(Bars)',value:'TimeInMarket'},
          //{label:'Cash Alloc(%)',value:'Alloc'},//'Cash Alloc(%)'
          {label:'Expected Return(%)',value:'ExpectedReturn'},
          // {label:'Z-Score',value:'Z_Score'},
        ]
      }
    }
  },
  components: {
    ScannerForm,
    ScannerBTTable,
    FilterTable,
    Statistics
  },
  methods: {
    changeTab(val) {
      this.activeTab = val
    },
    changeSecondTab(val) {
      this.activeSecondTab = val
    },
    displayResultsAndFilter(data) {
      debugger
      // 至展示 filter 和 result 不重新赋值 form
      const result = data.result.result
      this.activeSecondTab = 'summary'
      this.displaySummary(result)
    },
    displayResultsData(data) {
      debugger
      this.$refs['ScannerForm'].displayData(data)
      this.activeSecondTab = 'summary'
      const status = data.status
      if(status !== 'finish' && status !== 'Finish') {
        this.clearResults()
        return
      }
      const result = data.result
      const list = JSON.parse(data['TRADE LIST'])
      this.displaySummary(result)
      this.displayPreviewList(list)
    },
    displaySummary(result) {
      debugger
      const statistics = {}
      statistics.totalReturn = result['TOTAL RETURN']
      statistics.medianReturn = result['MEDIAN RETURN']
      statistics.averageReturn = result['AVERAGE RETURN']
      // statistics.tzScore = result['Z-SCORE'] // 缺少
      // statistics.standardDeviation = _data.standardDeviation
      // statistics.maxRisk = _data.maxRisk
      // statistics.buyHoldGain = _data.buy_and_hold 缺少
      // MDD + STD.DEV 我没加进去的
      statistics.winRate = result['WIN RATE']
      statistics.averageWin = result['AVERAGE WIN']
      statistics.averageLoss = result['AVERAGE LOSS']
      statistics.totalTrades = result['TOTAL TRADES']
      statistics.totalPositive = result['TOTAL POSITIVE']
      statistics.totalNegative = result['TOTAL NEGATIVE']
      statistics.timeInMarket = result['TIME IN MARKET']
      const transformedResult = []
      const _result = result.result
      const ID = _result['ID']
      const indexMap = {}
      ID.forEach((id, index) => {
        if (!(id in indexMap)) {
          indexMap[id] = []
        }
        indexMap[id].push(index)
      })
      const _ID = Object.values(indexMap) //输出: [[0, 2], [1, 3]] 这里没有考虑传入数据总数的奇偶问题

      for (let i = 0; i < _ID.length; i++) {
        // ID[i] => [0, 2]
        const direction = _result['Direction'][_ID[i][0]]
        const action = _result['Action'][_ID[i][0]]
        const nextAction = _result['Action'][_ID[i][1]]
        let dataSource // (0 第一行 1 第二行)
        if(direction == 'Long') {
          // 如果等于 Direction 等于 Long, 找出 Action 等于 SELL 的
          // if(action == 'SELL') {
          //   dataSource = 0
          // }else if(nextAction == 'SELL'){
          //   dataSource = 1
          // }
          dataSource = 0
        }else if(direction == 'Short'){
          // 如果等于 Direction 等于 Short, 找出 Action 等于 BUY 的
          // if(action == 'BUY') {
          //   dataSource = 0
          // }else if(nextAction == 'BUY'){
          //   dataSource = 1
          // }
          dataSource = 1
        }
        const oppositeDataSource = 1 - dataSource
        debugger
        const data = {
          Symbol: _result['Symbol'][_ID[i][dataSource]],
          Signal: _result['Signal'][_ID[i][dataSource]],
          Direction: _result['Direction'][_ID[i][dataSource]],
          EntryDate: _result['Start Date'][_ID[i][dataSource]],
          EntryAction: _result['Action'][_ID[i][dataSource]],
          EntryPrice: _result['Price'][_ID[i][dataSource]],
          ExitDate: _result['Start Date'][_ID[i][oppositeDataSource]],
          ExitAction: _result['Action'][_ID[i][oppositeDataSource]],
          ExitPrice: _result['Close'][_ID[i][dataSource]],
          FloatProfit: _result['ProfitTarget'][_ID[i][dataSource]],
          ExitReason: _result['OrderStatus'][_ID[i][dataSource]],
          TradeNumber: i
        }
        transformedResult.push(data)
      }
      transformedResult.sort(function(a, b) {
          var dateA = new Date(a.EntryDate)
          var dateB = new Date(b.EntryDate)
          return dateA - dateB
      })
      this.tradesData = transformedResult
      this.$nextTick(() => {
        this.$refs['Statistics'].displayData(statistics)
      })
    },
    displayPreviewList(content) {
      debugger
		  this.loading = true
      const formattedDate = (timestamp) => {
        // timestamp 例如：时间戳为 1672704000000
        const offset = new Date(timestamp).getTimezoneOffset() * 60 * 1000;
        const adjustedTimestamp = timestamp + offset;
        const adjustedDate = new Date(adjustedTimestamp);
        const year = adjustedDate.getFullYear();
        const month = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = adjustedDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
        //输出: "2011-01-01"
      }
      // 把数据处理成所需格式
       content.forEach(x => {
        x['Close'] = x['Close'].toFixed(2)
		  	// x['Alloc'] = (x['Alloc']*100).toFixed(0)
			  x['StopLoss'] = Number(x['StopLoss']).toFixed(2)
			  x['ProfitTarget'] = Number(x['ProfitTarget']).toFixed(2)
			  x['WinRate'] = Number(x['WinRate']).toFixed(2)
			  x['ExpectedReturn'] = Number(x['Expected Return(%)']).toFixed(2)
			  x['_Signal'] = x['Signal']
        x['Date'] = formattedDate(x['Date'])
       })
        this.filterTableData = {
          ...this.filterTableData,
          content
        }
		    this.loading = false
    },
    clearResults() {
        this.activeSecondTab = 'filter'
        this.displayPreviewList([])
        this.$refs['Statistics'].displayData({})
        this.tradesData = []
    },
    resetForm() {
      this.$nextTick(() => {
        const NoResetAllowed = this.$refs['ScannerForm'].resetForm()
        if(NoResetAllowed) return     
        this.clearResults()
      })
    },
    async refreshBTList() {
      await this.$refs['ScannerBTTable'].getDataList()
    }
  }
}
</script>

<style lang="less" scoped>
.CPMResults-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  margin: 50px auto auto auto;
  width: 90%;
  padding: 20px;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  font-weight: 300;
  color: #666;
  position: relative;
}
.title {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  font-weight: 300;
  color: #666;
}
.title p {
  padding: 0 20px;
  margin: 0;
}
.title p:hover {
  color: #428bca;
}
.secondActive {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}
.active {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}
.chart {
  background-color: inherit;
  margin-bottom: 20px;
}
/deep/ .el-collapse {
  border-top: unset;
  border-bottom: unset;
}

.downLoadCsvBtn {
	position: absolute;
	right: 90px;
  margin-left: 10px;
	color: #333333;
}
// .delete-btn {
// 	background-color: #f59e0b;
//   border: unset;
// }
// .delete-btn:hover {
//   background-color: rgb(251, 192, 92);
// }
</style>