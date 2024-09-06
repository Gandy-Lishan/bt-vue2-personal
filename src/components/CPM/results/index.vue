<template>
  <div class="CPMResults-container">
    <el-collapse v-model="activeNames" :accordion="false" class="CPMResults-content">
      <div class="chart">
        <Chart :default_symbol='default_symbol' :chart_data="chart_data" :breadcrumbTitle="breadcrumbTitle" @prepareData="prepareData" @calculateBarDistance="calculateBarDistance"></Chart>
      </div>
      <el-collapse-item name="1" class="form">
        <template v-slot:title>
          <div class="title">
            <p @click.stop>Correlation Pattern Match Parameters</p>
            <p>
              <el-tooltip class="item" effect="dark" content="Create New Correlation Backtest Pattern" placement="bottom-start">
                <el-button  type="warning" plain class="delete-btn" @click.stop="resetForm" size="small" icon="el-icon-plus">Create New</el-button>
              </el-tooltip>
            </p>
          </div>
        </template>
        <Form ref="Form" @displayResultsData="displayResultsData" @clearResults="clearResults"></Form>
      </el-collapse-item>
      <el-collapse-item name="2" class="form">
        <template v-slot:title>
          <div class="title">
            <p>Backtest Summary</p>
          </div>
        </template>
        <CPMSummary ref="Summary"></CPMSummary>
      </el-collapse-item>
      <el-collapse-item name="3" class="form">
        <template v-slot:title>
          <div class="title">
            <p
             @click.stop="() => {changeTab('statistics')}" :class="{ active: activeTab == 'statistics' || '' }"
            >Backtest Statistics</p>
            <p
             @click.stop="() => {changeTab('results')}" :class="{ active: activeTab == 'results' || '' }"
             >Multi-Timeframe Results</p>
             <p
             @click.stop="() => {changeTab('maxMin')}" :class="{ active: activeTab == 'maxMin' || '' }"
             >Max Gain and Loss</p>
             <p
             @click.stop="() => {changeTab('corrInfo')}" :class="{ active: activeTab == 'corrInfo' || '' }"
             >Correlation Info</p>
          </div>
          <div class="downLoadCsvBtn">
              <el-button
                @click.stop="() => {handleDownloadCsv()}"
                style="display: inline-block"
                type="primary"
                plain
                size="mini"
                icon="el-icon-download"
                >Export Data</el-button
              >
          </div>
        </template>
      <div class="content">
          <Statistics v-show="activeTab == 'statistics'" ref="Statistics"></Statistics>
          <TIM v-show="activeTab == 'results'" ref="TIM" :tradeData="tradeDate" :rowFrequency="rowFrequency" :tradePrice="tradePrice" :direction="direction"></TIM>
          <CorrInfo v-show="activeTab == 'corrInfo'" ref="CorrInfo"></CorrInfo>
          <MaxMin
            ref="maxMinChild"
            v-show="activeTab == 'maxMin'"
            :tradesData="tradeDate"
            :tradePrice="tradePrice"
            :rowFrequency="rowFrequency"
            :direction="direction"
          ></MaxMin>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
<script>
import CPMSummary from "./components/summary";
import Statistics from "./components/statistics";
import TIM from "./components/tim";
import Chart from "../create/components/Chart"
import CorrInfo from "./components/corrInfo";
import Form from "../create/components/Form";
import MaxMin from "../results/components/MaxMin";
const XLSX = require('xlsx');

export default {
  name: 'CPMResults',
  data() {
    return {
      activeNames: ['1', '2', '3'],
      activeTab: 'statistics',
      tradeDate: {},
      rowFrequency: 'Daily',
      tradePrice: 'Close',
      chart_data: {},
      breadcrumbTitle: 'Back to Correlation Pattern Match List',
      direction: 'Long',
      StartEndDateArray: [],
      default_symbol: ''
    }
  },
  components: {
    CPMSummary,
    Statistics,
    TIM,
    Chart,
    CorrInfo,
    Form,
    MaxMin
  },
    beforeRouteEnter(to, _, next) {
		if (to.path === '/cpm/results') {
			next((_this) => {
				if (to.params.usedFor && to.params.usedFor === 'showCPMResults') {
          const _data = to.params.data
          _this.chart_data = _data
          _this.displayResultsData(_data)
				} else if(to.params.usedFor && to.params.usedFor === 'emptyCPMResults') {
          const _data = to.params.data
          _this.chart_data = _data
          _this.$nextTick(() => {_this.$refs['Form'].displayData(_data)})
        }
			})
		} else {
			next()
		}
	},
  created() {
    // 如果不携带表单参数则显示默认symbol并分段加载
    if (this.$route.params.usedFor && this.$route.params.usedFor === 'showCPMResults'){
      this.default_symbol = ''
    }else{
      this.default_symbol = process.env.VUE_APP_DEFAULT_SYMBOL
    }
  },
  methods: {
    calculateBarDistance() {
      const _this = this
      _this.$nextTick(() => {
        _this.$refs['Form'].calculateBarDistance()
      });
    },
    changeTab(val) {
      this.activeTab = val
    },
    prepareData(data) {
      const _this = this
      _this.$nextTick(() => {
        const datatime = new Date(data.start_date)
        _this.$refs['TIM'].prepareData(_this.tradeDate, datatime)
        _this.$refs['maxMinChild'].prepareData(_this.tradeDate, datatime)
        _this.$refs['CorrInfo'].prepareData(_this.StartEndDateArray)
      });
    },
    displayResultsData(_data) {
      const _this = this
      const summary = {}
      summary.symbol = _data.symbol
      summary.timeframe = _data.timeframe
      summary.lookback_period = _data.lookback_period
      summary.exclude_overlapping = _data.exclude_overlap == 1 ? 'True' : 'False'
      summary.start_date = _data.start_date
      summary.end_date = _data.end_date
      summary.direction = _data.direction || 'Long'
      summary.corr_per = _data.corr_per
      let timeframe = _data.timeframe
      let period
      switch (timeframe) {
        case "Daily":
            period = "Days"
            break;
        case "Weekly":
            period = "Weeks"
            break;
        case "Monthly":
            period = "Months"
            break;
        default:
            console.error("Invalid timeframe value")
            break;
      }
      summary.observation_period = `${_data.tim} ${period}`
      _this.$refs['Summary'].displayData(summary)
      const statistics = {}
      statistics.totalReturn = _data.total_return
      statistics.medianReturn = _data.median_return
      statistics.averageReturn = _data.avg_return
      // statistics.tzScore = _data.tzScore
      // statistics.standardDeviation = _data.standardDeviation
      // statistics.maxRisk = _data.maxRisk
      statistics.buyHoldGain = _data.buy_and_hold
      statistics.winRate = _data.win_rate
      statistics.averageWin = _data.avg_win
      statistics.averageLoss = _data.avg_loss
      statistics.totalTrades = _data.total_trades
      statistics.totalPositive = _data.total_positive
      statistics.totalNegative = _data.total_negative
      statistics.timeInMarket = _data.time_in_market

      const result = _data.result
      const transformedResult = [];
      const TradeDateArray = [];
      const StartEndDateArray = [];
      
      for (let i = 0; i < result['End Date'].length; i++) {
        const tradeDate = result['End Date'][i];
        const symbolClose = result['Symbol Close'][i];
        const correlationPercentage = result['Correlation Percentage'][i];
        const marketCondition = result.hasOwnProperty('Market Condition') ? result['Market Condition'][i].join(', ') : null
        const eachReturn = result['Each Return'][i];
        const startDate = result['Start Date'][i];
        const endDate = result['End Date'][i];
        transformedResult.push({
          'TradeDate': tradeDate,
          'SymbolClose': symbolClose,
          'CorrelationPercentage': correlationPercentage,
          'Return': eachReturn,
          'MarketCondition': marketCondition
        });
        TradeDateArray.push(
          {'Date': tradeDate}
        )
        StartEndDateArray.push(
          {'StartDate': startDate, 'EndDate': endDate, 'CorrelationPercentage': correlationPercentage}
        )
      }
      _this.$refs['Statistics'].displayData(statistics, transformedResult)
      
      _this.tradeDate = TradeDateArray
      _this.rowFrequency = _data.timeframe
      _this.direction = _data.direction || 'Long'
      _this.StartEndDateArray = StartEndDateArray
      _this.$nextTick(() => {
        _this.$refs['Form'].displayData(_data)
        _this.prepareData(_data)
      });
    },
    clearResults(data) {
      this.$nextTick(() => {
        this.rowFrequency = data.timeframe
        this.$refs['Summary'].displayData({})
        this.$refs['Statistics'].displayData({}, [])
        this.$refs['TIM'].clearData(data.timeframe)
        this.$refs['maxMinChild'].clearData(data.timeframe)
        this.$refs['CorrInfo'].prepareData([])
      })
    },
    handleDownloadCsv() {
      const {backtestHistoryList, result_quotes, periods, defaultTableLabels} = this.$refs.TIM.exportData()
      const {summaryData, tradesData} = this.$refs.Statistics.exportData()
      const {StartEndDateArray} = this.$refs.CorrInfo.exportData()
      const {maxMinData} = this.$refs.maxMinChild.exportData()
      if (
        !(
          summaryData.length &&
          tradesData.length &&
          backtestHistoryList.length &&
          StartEndDateArray.length &&
          maxMinData.length
        )
      ) {
        this.popUpMsgBox('No data available for download')
        return
      }
      const summary = []
      summaryData.forEach((item, index) => {
        const obj = {}
        obj['TOTAL RETURN %'] = isNaN(item.totalReturn)
          ? 0
          : `${item.totalReturn}%`
        obj['MEDIAN RETURN %'] = isNaN(item.medianReturn)
          ? 0
          : `${item.medianReturn}%`
        obj['AVERAGE RETURN %'] = isNaN(item.averageReturn)
          ? 0
          : `${item.averageReturn}%`
        obj['BUY & HOLD %'] = isNaN(item.buyHoldGain)
          ? 0
          : `${item.buyHoldGain}%`
        obj['WIN RATE %'] = isNaN(item.winRate) ? 0 : `${item.winRate}%`
        obj['AVERAGE WIN %'] = isNaN(item.averageWin)
          ? 0
          : `${item.averageWin}%`
        obj['AVERAGE LOSS %'] = isNaN(item.averageLoss)
          ? 0
          : `${item.averageLoss}%`
        obj['TOTAL TRADES'] = isNaN(item.totalTrades)
          ? 0
          : `${item.totalTrades}`
        obj['TOTAL POSITIVE'] = isNaN(item.totalPositive)
          ? 0
          : `${item.totalPositive}`
        obj['TOTAL NEGATIVE'] = isNaN(item.totalNegative)
          ? 0
          : `${item.totalNegative}`
        obj['TIME IN MARKET %'] = isNaN(item.timeInMarket)
          ? 0
          : `${item.timeInMarket}%`
        summary.push(obj)
      })
      const trade = []
      tradesData.forEach((item, index) => {
        const obj = {}
        obj['Trade Date'] = item.TradeDate
        obj['Symbol Close'] = item.SymbolClose
        obj['Correlation Percentage'] = `${item.CorrelationPercentage}%`
        obj['Return'] = item.Return.toFixed(2) + '%'
        obj['Market Condition'] = item.MarketCondition
        trade.push(obj)
      })
      const correlationInfo = []
      StartEndDateArray.forEach((item, index) => {
        const obj = {}
        obj['Start Date'] = item.StartDate
        obj['End Date'] = item.EndDate
        obj['Correlation Percentage'] = `${item.CorrelationPercentage}%`
        correlationInfo.push(obj)
      })

        // Exit with default Time Frame
        const _backtestHistoryList = []
        backtestHistoryList.forEach((item) => {
          const obj = {}
          obj['Entry Date'] = item['Entry Date']
          for(var i=1;i < defaultTableLabels.length;i++ ){
            obj[defaultTableLabels[i].replace('[%]', 'Later [%]')] = item[defaultTableLabels[i]]
          }
          _backtestHistoryList.push(obj)
        })
        result_quotes.forEach(item => {
          const zscore = {};
          zscore['Entry Date'] = item['property'];
          for (let i = 1; i < defaultTableLabels.length; i++) {
            const value = item[periods[i - 1].period];
            // 检查值是否有效
            if (!isNaN(value) || (typeof value === 'string' && value.endsWith('%'))) {
              zscore[defaultTableLabels[i].replace('[%]', 'Later [%]')] = value;
            } else {
              zscore[defaultTableLabels[i].replace('[%]', 'Later [%]')] = ''; // 或者您可以设置为其他默认值
            }
          }
          _backtestHistoryList.push(zscore);
        });

      const _maxMinData = maxMinData.map(item => {
        const transformedItem = {
          "Dates of 1 Signals": item["Dates of 1 Signals"],
        };

        Object.keys(item).forEach(key => {
          if (key !== "Dates of 1 Signals" && key !== "Max Gain" && key !== "Max Loss") {
            Object.keys(item[key]).forEach(subKey => {
              transformedItem[`${key.replace('[%]', 'Later [%]')} - ${subKey}`] = item[key][subKey];
            });
          }
        });

        return transformedItem;
      });

      const dataList = [
        summary,
        trade,
        _backtestHistoryList,
        _maxMinData,
        correlationInfo
      ]
      const sheetNames = [
        'Summary',
        'Trades',
        'Multi-Timeframe Results',
        'Max Gain and Loss',
        'Correlation Info'
      ]
      this.exportDataToCSV(dataList, sheetNames)
    },
    exportDataToCSV(dataList, sheetNames) {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      for (let i = 0; i < dataList.length; i++) {
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataList[i])

        // Add the worksheet to the workbook with the given name
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[i])
      }

      // Convert the workbook to a binary string
      const workbookBinaryString = XLSX.write(workbook, {
        type: 'binary',
        bookType: 'xlsx'
      })
      // Create a Blob from the binary string
      const blob = new Blob([this.s2ab(workbookBinaryString)], {
        type: 'application/octet-stream'
      })

      // Create a download URL for the Blob
      const url = URL.createObjectURL(blob)

      // Create a link element for downloading the CSV file
      const link = document.createElement('a')
      link.style.display = 'none'
      link.setAttribute('href', url)
      link.setAttribute('download', 'Results.xlsx')
      link.innerHTML = 'Download XLSX'
      // Append the link element to the document body
      document.body.appendChild(link)

      // Trigger the download
      link.click()
    },
    // Utility function to convert a string to an ArrayBuffer
    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
    resetForm() {
      const NoResetAllowed = this.$refs['Form'].resetForm()
      if(NoResetAllowed) return
      this.clearResults('Daily')
    }
  }
}
</script>

<style lang="less" scoped>
.CPMResults-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  margin: 0 auto;
  .CPMResults-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
  .chart {
    width: 90%;
    background-color: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .form {
    width: 90%;
  }
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