// Summary & Trades
<template>
	<div class="perfprmance-container">
		<el-tabs class="performance_tabs" v-model="activePerTag" type="card" v-loading="loading">
    <div class="hint-btn-box">
      <p class="hint">
        Hint: Markers on the chart point to the buy/sell trade dates on the open
        <b>ONE</b> bar after entry/exit criteria met.
      </p>
      <div class="downLoadCsvBtn">
        <el-button
          @click="handleDownloadCsv"
          style="display: inline-block"
          type="primary"
          plain
          size="mini"
          icon="el-icon-download"
          >Export Data</el-button
        >
      </div>
    </div>
      <el-tab-pane label="Summary" name="first">
        <Summary 
          :tableData="tableData" 
        ></Summary>
      </el-tab-pane>
			<el-tab-pane label="Trades" name="second">
        <Trades 
          :tradesData="tradesData"
        ></Trades>
			</el-tab-pane>
			<el-tab-pane
				label="Exit with different Time-In-Market frame"
				name="third"
			>
        <TIM
          ref="timChild"
          :tradesData="tradesData"
          :tradePrice="tradePrice"
          :editBacktestID="editBacktestID"
          :rowFrequency="rowFrequency"
        ></TIM>
			</el-tab-pane>
			<!-- <el-tab-pane label="Detailed Statistics" name="third">Detailed Statistics</el-tab-pane> -->
		</el-tabs>
	</div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
<script>
import { CIQ } from '@/components/common/chart/st-development/js'
import jutils from 'jutils-src'
import { seeReport } from '@/service/service'
import Summary from './summary'
import Trades from './trades'
import TIM from './tim'
const XLSX = require('xlsx');

export default {
  name: 'Performance',
  components: {
    Summary,
    Trades,
    TIM,
  },
  data() {
    return {
      activePerTag: 'first',
      tableData: [],
      tradesData: [], 
      tradePrice: 'Close',
      editBacktestID: null,
      rowFrequency: 'Daily'
    }
  },
  // async created() {
  //   await this.getResultData({ id: 0 })
  // },
  methods: {
    clearForm() {
      Object.assign(this.$data, this.$options.data())
    },
    async getResultData(row, callback) {
      let vm = this
      let initalData = {}
      let data = {}
      vm.editBacktestID = row.id
      // 娓呯┖performance琛ㄥ崟
      vm.clearPerformanceData()
      if (!row.id) {
        return
      }

      if (row.status != 0) {
        if (this.$store.state.form.favoriteBacktestRowData.id) {
          let id = row.id
          vm.activePerTag = 'first'
          vm.rowFrequency = row.frequency
          try {
            let res = null
            try {
              res = await seeReport(id)
            } catch (error) {
              // 可能是没有交易，所以需要清除当前marker，防止保留上次回测的marker
              if(error?.response?.status == 404) vm.popUpMsgBox(`The backtest has no results. Please readjust the parameters and run the backtest again`)

              vm.$store.dispatch('states/set_isMarkerShown_flag',false)
              console.error(error)
              throw Error('report error')
            }
            console.log('report res', res)

            if (res.status == 200) {
              if (typeof res.data == 'string') {
                initalData = JSON.parse(res.data)
              } else {
                initalData = res.data
              }

              // -------------------------------------  start ----------------
              this.tradePrice = initalData['basic']['trade_price'] == 0 ? 'Open' : 'Close'// tim数据计算依赖backtester创建时选择的tradePrice类别，如Close/Open

              const tradeReturn = initalData['Each Return']
              const exitReason = initalData['Exit Reason'] ? initalData['Exit Reason'] : []
              const marketCondition = initalData['Market Condition'] ? initalData['Market Condition'] : []
              data.uuid = initalData['UUID']
              data.symbol = initalData['Symbol']
              data.frequency = initalData['Frequency']
              data.totalTrades = initalData['Total Trades']
              data.totalPositive = initalData['Total Positive']
              data.totalNegative = initalData['Total Negative']
              data.scratch = initalData['Scratch']
              data.averageWin = initalData['Average Win %']
              data.averageLoss = initalData['Average Loss %']
              data.medianGain = initalData['Median Gain']
              data.medianLoss = initalData['Median Loss']
              data.averageReturn = initalData['Average Return']
              data.medianReturn = initalData['Median Return']
              data.buyHoldGain = initalData['BuyHoldGain']
              data.winRate = initalData['Win Rate']
              data.timeInMarket = initalData['Time in Market']
              data.totalReturn = initalData['Total Return (%)']
              data.tzScore = initalData['Z-score']
              data.standardDeviation = initalData['Standard Deviation']
              data.s3_status_response = initalData['s3_status_response']
              data.cagr = initalData['CAGR']
              data.annual_volatiltiy = initalData['annual_volatiltiy']
              data.calmar_ratio = initalData['calmar_ratio']
              data.sortino_ratio = initalData['sortino_ratio']
              data.tail_ratio = initalData['tail_ratio']
              data.var = initalData['VAR']
              data.capture = initalData['capture']
              data.alpha = initalData['alpha']
              data.beta = initalData['beta']
              data.information_ratio = initalData['information_ratio']
              data.sharpeRatio = initalData['Sharpe Ratio']
              data.drawDown = initalData['DrawDown']
              data.drawDownPeriod = initalData['DrawDown Period']
              data.drawDownImageUploaded = initalData['DrawDown Image Uploaded']
              data.ddFileURL = initalData['DD File URL']
              data.returnsImageUploaded = initalData['Returns Image Uploaded']
              data.returnsFileURL = initalData['Returns File URL']
              data.annualReturnsImageUploaded =
                initalData['Annual Returns Image Uploaded']
              data.annualReturnsFileURL = initalData['Annual Returns File URL']
              data.returnsheatmapImageUploadedURL =
                initalData['Returns Heatmap Image Uploaded']
              data.returnsHeatmapFileURL =
                initalData['Returns Heatmap File URL']
              data.CAGR = initalData['CAGR']
              vm.tableData = []
              if (initalData['Trades']) {
                // 鏈変氦鏄撴墠濉〃鍗
                vm.tableData.push(data)
                try {
                  for (let i = 0; i < initalData['Trades'].length; i++) {
                  if (i % 2 == 0) {
                    initalData['Trades'][i].trade_number = i / 2
                    initalData['Trades'][i + 1].trade_number = i / 2
                  }
                }

                for (let i = 0; i < initalData['Trades'].length; i++) {
                  initalData['Trades'][i].TradeReturn =
                    tradeReturn[initalData['Trades'][i].trade_number]

                  initalData['Trades'][i].ExitReason =
                    exitReason[initalData['Trades'][i].trade_number]

                  initalData['Trades'][i].MarketCondition =
                    marketCondition[initalData['Trades'][i].trade_number]
                  
                  if (i % 2 !== 0) {
                    initalData['Trades'][i - 1].Return =
                      initalData['Trades'][i].Return
                  }
                }
                } catch (error) {
                  console.log(error)
                }
                
                vm.tradesData = initalData['Trades']
                this.$store.commit('chart/getTradesData', vm.tradesData)
                
                // TIM 数据准备
                this.$nextTick(() => {
                  // 这里访问prepareData，确保子组件内的tradesData已经更新
                  const datatime = new Date(initalData['basic']['start_date'])
                  this.$refs.timChild.prepareData(row.id,datatime)
                });
              }
              // ------------------------------ end -----------------------------------
            }
          } catch (error) {
            console.error('鏈嶅姟鍣ㄦ姤閿', error)
            vm.tableData = []
            vm.tradesData = []
            // vm.$emit('errorCatchPerformance')
          }
        }
      } else {
        console.error('row status is ', row.status)
      }
      setTimeout(() => {
        if (initalData.markerSet) {
          this.loadMarker(initalData.markerSet)
        }
        if (callback) {
          callback()
        }
      }, 0)
    },

    loadMarker(markerSet) {
      try {
        //load markers for initial quotefeed

        let list = this.filterMarkerDate(
          new Date(CIQ.initialDate.start),
          new Date(CIQ.initialDate.end),
          markerSet
        )
        
        // split the markers into several groups
        CIQ.groups = this.group(list)
        let markers = CIQ.groups.pop()

        // if the last groups has no enough number of items, merge it with the last one
        //console.log('CIQ.stxx.chart.xaxis[0]',CIQ.stxx.chart.xaxis[0])
        let c_date = jutils.formatDate(CIQ.stxx.chart.xaxis[0].DT, 'YYYYMMDD')
        if (CIQ.groups.slice(-1)[0]) {
          let m_date =
            CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(0, 4) +
            CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(5, 7) +
            CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(8, 10)
          if (c_date < m_date) {
            markers.unshift(...CIQ.groups.pop())
          }
        }
        console.log('initiating Markers...', markers)
        
        // 如果marker已经加载了，则无需重复加载，主要是防止重构后反复查看result tab导致的重复加载
        if(!CIQ.store.getters.getIsMarkerShownFlagState) CIQ.loadChart(markers, CIQ.addMarker)
        
        this.$store.dispatch('states/set_isMarkerShown_flag',true)
      } catch (error) {
        console.error(error)
        return
      }
    },
    group(data) {
      var result = []
      var groupItem
      for (var i = 0; i < data.length; i++) {
        if (i % 500 == 0) {
          groupItem != null && result.push(groupItem)
          groupItem = []
        }
        groupItem.push(data[i])
      }
      result.push(groupItem)
      return result
    },
    filterMarkerDate(start_date, end_date, markerSet) {
      let list = []
      let _date = {
        start: jutils.formatDate(start_date, 'YYYYMMDD'),
        end: jutils.formatDate(end_date, 'YYYYMMDD')
      }
      for (var date in markerSet) {
        let markerSetDate =
          markerSet[date].DT.slice(0, 4) +
          markerSet[date].DT.slice(5, 7) +
          markerSet[date].DT.slice(8, 10)
        if (markerSetDate > _date.start && markerSetDate <= _date.end) {
          list.push(markerSet[date])
        }
      }
      return list
    },
    clearPerformanceData() {
      this.tableData = []
      this.tradesData = []

      // 触发tim clear form
      this.$refs.timChild?.clearData()
    },
    handleDownloadCsv() {
      const {backtestHistoryList, TIMHistoryList, result_quotes, TIMResult_quotes, periodsTIM, periods, defaultTIMTableLabels, defaultTableLabels} = this.$refs.timChild.exportData()
      
      if (
        !(
          this.tableData.length &&
          this.tradesData.length &&
          backtestHistoryList.length &&
          TIMHistoryList.length
        )
      ) {
        this.popUpMsgBox('No data available for download')
        return
      }
      const summary = []
      this.tableData.forEach((item, index) => {
        const obj = {}
        obj['TOTAL RETURN %'] = isNaN(item.totalReturn)
          ? 0
          : `${item.totalReturn}%`
        obj['Annual Return % (CAGR)'] = isNaN(item.CAGR) ? 0 : `${item.CAGR}%`
        obj['MEDIAN RETURN %'] = isNaN(item.medianReturn)
          ? 0
          : `${item.medianReturn}%`
        obj['AVERAGE RETURN %'] = isNaN(item.averageReturn)
          ? 0
          : `${item.averageReturn}%`
        obj['Z_SCORE'] = isNaN(item.tzScore) ? 0 : `${item.tzScore}`
        obj['STD. DEV'] = isNaN(item.standardDeviation)
          ? 0
          : `${item.standardDeviation}`
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
        obj['MAX RISK %'] = isNaN(item.drawDown) ? 0 : `${item.drawDown}%`
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
      const tradeData = []
      this.tradesData.forEach((item, index) => {
        const obj = {}
        obj['Trade #'] = index + 1
        obj['Trade Date'] = item.Date
        obj['Action'] = item.TradeStatus
        obj['Indicator'] = item.Indicator.join(';')
        obj['Trade Price'] = item.TradePrice
        obj['Exit Reason'] = item.ExitReason
        obj['Trade Return %'] = `${item.TradeReturn}%`
        obj['Total Return %'] = `${(item.Return * 100).toFixed(2)}%`
        obj['Market Condition'] = item.MarketCondition.join(';')
        tradeData.push(obj)
      })

      const mergedData = [];

      for (let i = 0; i < tradeData.length; i += 2) {
        const entryData = tradeData[i];
        const exitData = tradeData[i + 1] || {}; // 确保后面有对象或使用一个空对象
        // 转换日期格式
        const formatEntryDate = new Date(entryData['Trade Date']).toLocaleDateString();
        const formatExitDate = exitData['Trade Date'] ? new Date(exitData['Trade Date']).toLocaleDateString() : '';
        mergedData.push({
          'Entry Date': formatEntryDate,
          'Entry Action': entryData.Action.toUpperCase(),
          'Entry Price': entryData['Trade Price'],
          'Entry Indicator': entryData.Indicator || '',
          'Exit Date': formatExitDate,
          'Exit Action': exitData.Action.toUpperCase(),
          'Exit Price': exitData['Trade Price'] || '',
          'Trade Return': exitData['Trade Return %'] || '',
          'Total Return': exitData['Total Return %'] || '',
          'Exit Reason': exitData['Exit Reason'] || '',
          'Market Condition': exitData.MarketCondition || '',
          'Exit Indicator': exitData.Indicator || ''
        });
      }

      console.log(mergedData);
        // Exit with default Time Frame
        const _backtestHistoryList = []
        backtestHistoryList.forEach((item) => {
          const obj = {}
          obj['Entry Date'] = item['Entry Date']
          for(var i=1;i < defaultTableLabels.length;i++ ){
            obj[defaultTableLabels[i]] = item[defaultTableLabels[i]]
          }
          _backtestHistoryList.push(obj)
        })
        result_quotes.forEach(item => {
          const zscore = {}
          zscore['Entry Date'] = item['property']
          for(var i=1;i < defaultTableLabels.length;i++ ){
            zscore[defaultTableLabels[i]] = item[periods[i-1].period]
          }
          _backtestHistoryList.push(zscore)
        })
      // Exit with Customized TIM
        const _TIMHistoryList = []
        TIMHistoryList.forEach((item) => {
          const obj = {}
          obj['Entry Date'] = item['Entry Date']
          for(var i=1;i < defaultTIMTableLabels.length;i++ ){
            obj[defaultTIMTableLabels[i]] = item[defaultTIMTableLabels[i]]
          }
          _TIMHistoryList.push(obj)
        })
        TIMResult_quotes.forEach(item => {
          const zscore = {}
          zscore['Entry Date'] = item['property']
          for(var i=1;i < defaultTIMTableLabels.length;i++ ){
            zscore[defaultTIMTableLabels[i]] = item[periodsTIM[i-1].period]
          }
          _TIMHistoryList.push(zscore)
        })
      const dataList = [
        summary,
        mergedData,
        _backtestHistoryList,
        _TIMHistoryList
      ]
      const sheetNames = [
        'Summary',
        'Trades',
        'Exit with default Time Frame',
        'Exit with Customized TIM'
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
  }
}
</script>
<style scoped>
.zscore-container {
	border-top: solid 3px #00000042 !important;
}
.hint {
	/* position: absolute; */
	font-size: 0.8rem;
	color: black !important;
	/* right: 243px; */
	font-weight: 300;
	margin: 0;
}
.perfprmance-container {
	padding-bottom: 20px;
}
.performance_tabs {
  width: 1200px;
  margin: 0 auto;
}
.pagination-container {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.trades-container p {
	width: 90%;
	font-size: 0.8rem;
}
.downLoadCsvBtn {
	/* position: absolute;
	right: 28px;
	top: 320px; */
  margin-left: 10px;
	color: #333333;
}
.el-dialog .el-dialog__body .el-table /deep/.cell {
	padding-left: 0;
	padding-right: 0;
}
.el-dialog .el-dialog__body .el-table /deep/.el-input__inner {
	margin-left: 0;
}
.el-dialog__wrapper /deep/.el-dialog {
	width: 50% !important;
}
.el-table /deep/ th,
.el-table /deep/ td {
	text-align: center;
}
.perfprmance-container /deep/ .el-tabs__header.is-top {
  padding-bottom: 1rem;
}
.hint-btn-box{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>