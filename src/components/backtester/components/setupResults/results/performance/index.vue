// Summary & Trades
<template>
	<div class="perfprmance-container">
    <div class="hint-btn-box">
      <p class="hint">
        <i>Hint: Click the button to download all panel data.</i>
      </p>
      <div class="downLoadCsvBtn">
        <el-button
          @click="handleDownloadCsv"
          style="display: inline-block"
          type="primary"
          size="small"
          icon="el-icon-download"
          title="Export Data"
          ></el-button
        >
      </div>
    </div>
		<el-tabs class="performance_tabs" v-model="activePerTag" type="card" v-loading="loading" :class="{'Dual': strategy === 'Dual'}">
      <el-tab-pane label="Summary" name="first">
        <Summary 
          :tableData="tableData" 
        ></Summary>
      </el-tab-pane>
			<el-tab-pane label="Trades" name="second">
        <Trades 
          :tradesData="tradesData"
          :strategy="strategy"
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
          v-show="strategy === 'Signal' || strategy === 'Single'"
        ></TIM>
			</el-tab-pane>
      <el-tab-pane
				label="Max Gain and Loss"
				name="forth"          
			>
        <MaxMin
          ref="maxMinChild"
          :tradesData="tradesData"
          :tradePrice="tradePrice"
          :editBacktestID="editBacktestID"
          :rowFrequency="rowFrequency"
          v-show="strategy === 'Signal' || strategy === 'Single'"
        ></MaxMin>
			</el-tab-pane>
			<!-- <el-tab-pane label="Detailed Statistics" name="third">Detailed Statistics</el-tab-pane> -->
			<el-tab-pane label="Major Sectors" name="five" v-if="Object.prototype.hasOwnProperty.call(initalData, 'Indexes Info')">
        <IndexesInfo ref="IndexesInfo" :IndexesInfo="IndexesInfo" :rowFrequency="rowFrequency"></IndexesInfo>
      </el-tab-pane>
      <el-tab-pane label="Major Indexes" name="six" v-if="Object.prototype.hasOwnProperty.call(initalData, 'Other Assert')">
        <OtherAssets ref="OtherAssets" :OtherAssets="OtherAssets" :rowFrequency="rowFrequency"></OtherAssets>
      </el-tab-pane>
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
import MaxMin from './MaxMin'
import IndexesInfo from "./IndexesInfo"
import OtherAssets from "./OtherAssets"
import { getSymbolInfo } from '@/utils/globalFunc'
const XLSX = require('xlsx');

export default {
  name: 'Performance',
  props: {
    strategy: String
  },
  components: {
    Summary,
    Trades,
    TIM,
    MaxMin,
    IndexesInfo,
    OtherAssets
  },
  data() {
    return {
      activePerTag: 'first',
      tableData: [],
      tradesData: [], 
      tradePrice: 'Close',
      editBacktestID: null,
      rowFrequency: 'Daily',
      IndexesInfo: [],
      OtherAssets: {},
      initalData: {},
      showLastSignalMarker1: '',
      showLastSignalMarker2: ''
    }
  },
  // async created() {
  //   await this.getResultData({ id: 0 })
  // },
  beforeDestroy() {
			let clearRefs = ['timChild', 'maxMinChild', 'IndexesInfo', 'OtherAssets']
			clearRefs.forEach(refName => {
        if(this.$refs[refName]) this.$refs[refName] = null
			});
	},
  methods: {
    clearForm() {
      Object.assign(this.$data, this.$options.data())
    },
    async getResultData(row, callback) {
      let vm = this
      let initalData = {}
      let data = {}
      if (row.analystID) {
        vm.$store.state.form.favoriteBacktestRowData.id = row.analystID
        row.id = row.analystID
        delete row.analystID
      }
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
          vm.tradePrice = row.trade_price == 0 ? 'Open' : 'Close'
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
                // 将 NaN 替换为 null
                const validJsonString = res.data.replace(/NaN/g, 'null');
                initalData = JSON.parse(validJsonString)
              } else {
                if(typeof res.data == 'string') {initalData = res.data.replace(/NaN/g, 'null'); initalData = JSON.parse(initalData)}
                initalData = res.data
              }

              // -------------------------------------  start ----------------
              // this.tradePrice = initalData['basic']['trade_price'] == 0 ? 'Open' : 'Close'// tim数据计算依赖backtester创建时选择的tradePrice类别，如Close/Open
              const tradeReturn = initalData['Each Return']
              const exitReason = initalData['Exit Reason'] ? initalData['Exit Reason'] : []
              const marketCondition = initalData['MarketCondition'] ? initalData['MarketCondition'] : []

              /** used for display last signal marker, if last signal and end date exist in report, then if they're the same , display marker */ 
              this.showLastSignalMarker1 = initalData['Symbol Last Signal'] ? 
                                            initalData['Symbol Last Signal'] == initalData['BT End Date'] ? 
                                            initalData['BT End Date'] : ''
                                          : ''
              this.showLastSignalMarker2 = initalData['Symbol2 Last Signal'] ? 
                                            initalData['Symbol2 Last Signal'] == initalData['BT End Date'] ? 
                                            initalData['BT End Date'] : ''
                                          : ''
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
              data.equityCurveFileURL = initalData['Equity Curve File URL'] || null
              data.wfd_file_url = initalData['Worst Five Drawdown File URL'] || null
              data.eoy_file_url = initalData['EOY File URL'] || null
              data.rb_file_url = initalData['Rolling Beta File URL'] || null
              data.returnsheatmapImageUploadedURL =
                initalData['Returns Heatmap Image Uploaded']
              data.returnsHeatmapFileURL =
                initalData['Returns Heatmap File URL']
              data.CAGR = initalData['CAGR']
              vm.tableData = []
              const OtherAssets = initalData['Other Assert']
              if(OtherAssets) {
                const addPercentageSign = (otherAsset) => {
                  // 遍历所有资产
                  Object.entries(otherAsset).forEach(([assetName, data]) => {
                    // 遍历每个资产的指标
                    Object.entries(data).forEach(([metric, values]) => {
                      if (metric === '% Positive') {
                        // 在 '% Positive' 的数值后面加上 '%'
                        data[metric] = values.map(value => `${(value !== null && value !== undefined && value !== '' && value !== NaN  && value !== 'NaN') ? `${value}%` : '-'}`);
                      }else {
                        data[metric] = values.map(value => `${(value !== null && value !== undefined && value !== '' && value !== NaN  && value !== 'NaN') ? `${value}` : '-'}`);
                      }
                    });
                  });
                  return otherAsset; // 返回修改后的数据
                }
                vm.OtherAssets = addPercentageSign(OtherAssets);
              }
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
                    (!marketCondition[initalData['Trades'][i].trade_number] || marketCondition[initalData['Trades'][i].trade_number]?.length == 0) ? ['N\/A'] : marketCondition[initalData['Trades'][i].trade_number]
                  
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
                vm.initalData = initalData
                this.$nextTick(() => {
                  // 这里访问prepareData，确保子组件内的tradesData已经更新
                  const datatime = initalData['basic']['start_date']
                  this.$refs.timChild.prepareData(row.id,datatime)
                  this.$refs.maxMinChild.prepareData(row.id,datatime)
                  debugger
                  this.$refs.IndexesInfo.prepareData(initalData['Indexes Info'] || {})
                  this.$refs.OtherAssets.prepareData(initalData['Other Assert'] || {})
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
        // console.log('CIQ.stxx.chart.xaxis[0]',CIQ.stxx.chart.xaxis[0])
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

        const comparisonSymbolUrl = CIQ.store.getters.getComparisonSymbol?.url
        if(this.showLastSignalMarker1) CIQ.createOneTimeLastSignalMarker(this.showLastSignalMarker1,`last signal`,null)
        if(comparisonSymbolUrl && this.showLastSignalMarker2) CIQ.createOneTimeLastSignalMarker(this.showLastSignalMarker2,`last signal`,comparisonSymbolUrl)
        this.$store.dispatch('states/set_isMarkerShown_flag',true)
      } catch (error) {
        console.error(error)
        return
      }
    },
    group(data) {
      const result = []

    // 交易数据分组
      // var groupItem
      // for (var i = 0; i < data.length; i++) {
      //   if (i % 500 == 0) {
      //     groupItem != null && result.push(groupItem)
      //     groupItem = []
      //   }
      //   groupItem.push(data[i])
      // }
      // result.push(groupItem)
    
    // 不分组，一次性加载全部
      result.push(data)
      return result
    },
    filterMarkerDate(start_date, end_date, markerSet) {
      let list = []
      let _date = {
        start: jutils.formatDate(start_date, 'YYYYMMDD'),
        end: jutils.formatDate(end_date, 'YYYYMMDD')
      }
      for (let date in markerSet) {
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
      this.$refs.maxMinChild?.clearData()
    },
    // 处理custom symbol的特殊url显示
		getProcessedSymbol(symbol) {
			if (!symbol) return '';
			const { name, type } = getSymbolInfo(symbol);
			return type === 'custom' ? name : symbol;
		},
    handleDownloadCsv() {
      debugger
      const {backtestHistoryList, TIMHistoryList, result_quotes, TIMResult_quotes, periodsTIM, periods, defaultTIMTableLabels, defaultTableLabels} = this.$refs.timChild.exportData()
      const {maxMinData} = this.$refs.maxMinChild.exportData()
      let medianReturn, consistency, OtherAssets
      try {
        if(this.$refs.IndexesInfo) {
        const {_medianReturn, _consistency} = this.$refs.IndexesInfo.exportData()
        medianReturn = _medianReturn
        consistency = _consistency
        }
        if(this.$refs.OtherAssets) {
            const sheetData = this.$refs.OtherAssets.exportData()
            OtherAssets = sheetData
        }
      } catch (error) {
        console.log(error)
      }
      if (
        !(
          this.tableData.length &&
          this.tradesData.length &&
          backtestHistoryList.length &&
          TIMHistoryList.length &&
          maxMinData.length
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
        obj['Symbol'] = this.getProcessedSymbol(item.Symbol)
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
        const formatEntryDate = entryData['Trade Date'].replaceAll('-','/')
        const formatExitDate = exitData['Trade Date'] ? exitData['Trade Date'].replaceAll('-','/') : '';
        mergedData.push({
          'Symbol': entryData.Symbol,
          'Entry Date': formatEntryDate,
          'Entry Action': entryData.Action.toUpperCase(),
          'Entry Price': !isNaN(entryData['Trade Price']) ?  Number(entryData['Trade Price']).toFixed(2) : '',
          'Exit Date': formatExitDate,
          'Exit Action': exitData.Action.toUpperCase(),
          'Exit Price': !isNaN(exitData['Trade Price']) ?  Number(exitData['Trade Price']).toFixed(2) : '',
          'Trade Return': !isNaN(exitData['Trade Return %']) ?  Number(exitData['Trade Return %']).toFixed(2) : '',
          'Total Return': !isNaN(exitData['Total Return %']) ?  Number(exitData['Total Return %']).toFixed(2) : '',
          'Exit Reason': exitData['Exit Reason'] || '',
          'Market Condition': exitData['Market Condition'] || 'N\/A',
        });
      }

      console.log(mergedData);
        // Exit with default Time Frame
        const _backtestHistoryList = []
        backtestHistoryList.forEach((item) => {
          const obj = {}
          obj['Entry Date'] = item['Entry Date']
          for(let i=1;i < defaultTableLabels.length;i++ ){
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

      // Exit with Customized TIM
        const _TIMHistoryList = []
        TIMHistoryList.forEach((item) => {
          const obj = {}
          obj['Entry Date'] = item['Entry Date']
          for(let i=1;i < defaultTIMTableLabels.length;i++ ){
            obj[defaultTIMTableLabels[i].replace('[%]', 'Later [%]')] = item[defaultTIMTableLabels[i]]
          }
          _TIMHistoryList.push(obj)
        })
        TIMResult_quotes.forEach(item => {
          const zscore = {}
          zscore['Entry Date'] = item['property']
          for (let i = 1; i < defaultTIMTableLabels.length; i++) {
            const value = item[periodsTIM[i - 1].period];
            // 检查值是否有效
            if (!isNaN(value) || (typeof value === 'string' && value.endsWith('%'))) {
              zscore[defaultTIMTableLabels[i].replace('[%]', 'Later [%]')] = value;
            } else {
              zscore[defaultTIMTableLabels[i].replace('[%]', 'Later [%]')] = ''; // 或者您可以设置为其他默认值
            }
          }
          _TIMHistoryList.push(zscore)
        })
        
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
      let dataList = [
        summary,
        mergedData,
        _backtestHistoryList,
        _TIMHistoryList,
        _maxMinData
      ]
      let sheetNames = [
        'Summary',
        'Trades',
        'Exit with default Time Frame',
        'Exit with Customized TIM',
        'Max Gain and Loss'
      ]
      if(this.strategy === 'Dual') {
        dataList = [summary,mergedData]
        sheetNames = ['Summary','Trades']
      }
      if(Object.prototype.hasOwnProperty.call(this.initalData, 'Indexes Info')) {
        sheetNames = [...sheetNames, 'Major Sectors(Median % Return)', 'Major Sectors(Consistency)']
        consistency = JSON.parse(JSON.stringify(consistency)).map(obj => {
          for (const key in obj) {
            
            if (Object.hasOwnProperty.call(obj, key) && key !== 'Consistency') {
              obj[key] = `${obj[key]}%`
            }
          }
          return obj
        })
        dataList = [...dataList, medianReturn, consistency]
      }
      if(Object.prototype.hasOwnProperty.call(this.initalData, 'Other Assert')) {
        sheetNames = [...sheetNames, 'Major Indexes']
        dataList = [...dataList, OtherAssets]
      }
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
	font-size: 1rem;
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
  margin: 0 auto;
  padding-right: 10px;
}
</style>