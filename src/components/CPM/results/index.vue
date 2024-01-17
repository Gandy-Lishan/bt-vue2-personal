<template>
  <div class="CPMResults-container">
    <el-collapse v-model="activeNames" @change="handleChange" :accordion="false">
      <div class="chart">
        <Chart :chart_data="chart_data" :breadcrumbTitle="breadcrumbTitle" @prepareData="prepareData"></Chart>
      </div>
      <el-collapse-item name="1">
        <template v-slot:title>
          <div class="title">
            <p>Backtest Summary</p>
          </div>
        </template>
        <CPMSummary ref="Summary"></CPMSummary>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template v-slot:title>
          <div class="title">
            <p
             @click.stop="() => {changeTab('statistics')}" :class="{ active: activeTab == 'statistics' || '' }"
            >Backtest Statistics</p>
            <p
             @click.stop="() => {changeTab('results')}" :class="{ active: activeTab == 'results' || '' }"
             >Multi-Timeframe Results</p>
          </div>
        </template>
      <div class="content">
          <Statistics v-show="activeTab == 'statistics'" ref="Statistics"></Statistics>
          <TIM v-show="activeTab == 'results'" ref="TIM" :tradeDate="tradeDate" :rowFrequency="rowFrequency" :tradePrice="tradePrice" :direction="direction"></TIM>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import CPMSummary from "./components/summary";
import Statistics from "./components/statistics";
import TIM from "./components/tim";
import Chart from "../create/components/Chart"
import {isJson} from '@/utils'

export default {
  name: 'CPMResults',
  data() {
    return {
      activeNames: ['1', '2'],
      activeTab: 'statistics',
      tradeDate: {},
      rowFrequency: 'Daily',
      tradePrice: 'Close',
      chart_data: {},
      breadcrumbTitle: 'Back to CPM list',
      direction: 'Long'
    }
  },
  components: {
    CPMSummary,
    Statistics,
    TIM,
    Chart
  },
    beforeRouteEnter(to, _, next) {
		if (to.path === '/cpm/results') {
			next((_this) => {
				if (to.params.usedFor && to.params.usedFor === 'showCPMResults') {
					const { data } = to.params
					const _data = isJson(data) ? JSON.parse(data) : data
          _this.chart_data = _data
          const summary = {}
          summary.symbol = _data.symbol
          summary.timeframe = _data.timeframe
          summary.lookback_period = _data.lookback_period
          summary.exclude_overlapping = _data.exclude_overlapping == 1 ? 'True' : 'False'
          summary.start_date = _data.start_date
          summary.end_date = _data.end_date
          summary.direction = _data.direction || 'Long'
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
          summary.observation_period = `${_data.time_in_market} ${period}`
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
          for (let i = 0; i < result['End Date'].length; i++) {
            const tradeDate = result['End Date'][i];
            const symbolClose = result['Symbol Close'][i];
            const correlationPercentage = result['Correlation Percentage'][i];
            const eachReturn = result['Each Return'][i];
            transformedResult.push({
              'TradeDate': tradeDate,
              'SymbolClose': symbolClose,
              'CorrelationPercentage': correlationPercentage,
              'Return': eachReturn
            });
            TradeDateArray.push(
              {'Date': tradeDate}
            )
          }
          _this.$refs['Statistics'].displayData(statistics, transformedResult)
          _this.tradeDate = TradeDateArray
          _this.rowFrequency = _data.timeframe
          _this.direction = _data.direction || 'Long'
          // _this.$nextTick(() => {
          //   const datatime = new Date(_data.start_date)
          //   _this.$refs['TIM'].prepareData(TradeDateArray, datatime)
          // });

				}
			})
		} else {
			next()
		}
	},
  methods: {
    handleChange(val) {
    },
    changeTab(val) {
      this.activeTab = val
    },
    prepareData(data) {
      console.log('触发了')
      const _this = this
      _this.$nextTick(() => {
          const datatime = new Date(data.start_date)
          _this.$refs['TIM'].prepareData(_this.tradeDate, datatime)
        });
    }
  }
}
</script>

<style lang="less" scoped>
.CPMResults-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  width: 80vw;
  margin: 0 auto;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  font-weight: 300;
  color: #666;
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

</style>