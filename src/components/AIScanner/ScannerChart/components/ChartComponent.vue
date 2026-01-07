<template>
	<!-- <div class="TVChartContainer" ref="chartContainer" /> -->
	<!-- <div class=''>
		<el-button></el-button> -->
		<div class="chart_box" id="chart_box">
			<chart :onChartReady="onChartReady" width="100%" height="100%">
        <LoadingOverlayChart
						:isLoading="chartLoadingSetting.isChartLoading"
						:progressText="chartLoadingSetting.progressText"
					>
					</LoadingOverlayChart>	
      </chart>
		</div>
	<!-- </div> -->

</template>

<script>
import chart from '@/components/common/chart/index.vue'
import { CIQ } from '@/components/common/chart/st-development/js/components'
import jutils from 'jutils-src'
import { isJson } from '@/utils'
import { formatStandardTime } from '@/utils'
import { LoadingOverlayChart } from "@/components/common"
export default {
	name: 'TVChartContainer',
	props: {
		other: Object,
		symbol :String,
		direction: String,
	},
	data() {
		return {
			indicator : '',
			trades : [],
			symbolUrl: '',
			result_quotes: [],
			periods: []
		}
	},
	components: {
    	chart: chart,
      LoadingOverlayChart,
	},
	created() {
		CIQ.addCover()
    CIQ.symbol = this.symbol
	},
	beforeDestroy() {
    // 还原chartiq默认study definition
		this.editStudies(true)

    /** 已经在AdvancedChartComponent里了 */
		// // 防止跳转到backtester时保留了Hammer followed by a rise等marker
		// CIQ.objIndicator = []
		// this.$store.dispatch('chart/reset_chart_study_state')
		// this.$store.dispatch('form/reset_chart_config_state')

		
		// // Destroy the ChartEngine instance when unloading the component.
		// // This will stop internal processes such as quotefeed polling.
		// CIQ.stxx?.destroy()

    // // 防止chartiq还没加载完就切换到其他页面
		// CIQ.hideCover()
		// CIQ.nprogress.done()
	},
	computed: {
		updateSettingMA() {
			return this.$store.state.chart.studySettingMA
		},
		updateTimeframe() {
			return this.$store.state.form.exitFrequency
		},
    chartLoadingSetting() {
			// 从 Vuex store 中获取全局 loading 状态
			return this.$store.state.chart.chartLoadingSetting
		},
	},
	watch: {
		updateSettingMA(val) {
			this.updateMAPeriod(val['period'])
		},
		updateTimeframe(val) {
			CIQ.addCover()
			CIQ.initiateChart([this.symbolUrl],this.other['date'],()=>{
				try{
					// 切换timeframe前先清空已有studies
					this.$store.dispatch('chart/reset_chart_study_state')
					this.loadDefaultStudy().then(()=>{
						this.loadMarker()
					})
					
				}catch(e){
					console.error(e)
				}finally{	
					CIQ.hideCover()
				}
			})
		},
    chartLoadingSetting: {
			handler(newValue, _) {
				// 在对象属性发生变化时触发的处理逻辑
				this.chartLoadingSetting = newValue
			},
			deep: true, // 启用深度监听，监视对象属性的变化
		},
	},
	methods:{
		onChartReady(){
			// 默认让indicator无法编辑
			this.editStudies(false)

			this.symbolUrl = CIQ.findSentiIndicator(null,this.symbol) // 先看是不是列表现存的url
                        ?this.symbol  // 是列表现存的项，用this.symbol做url (AAON)
                        :CIQ.findSentiIndicator(this.symbol + ' Optix',null)  // 不是的话再看是不是列表现存的symbol (AAON Optix)
                          ?CIQ.findSentiIndicator(this.symbol + ' Optix',null).url  // 是列表现存的symbol，取其url
                          :this.symbol  // 不是列表现存的项，用this.symbol做url
      if(['Trend Score Breakout','Trend Score Breakdown'].includes(this.other['_Signal'])) {
        this.symbolUrl = this.symbolUrl + '_trend'
      }
			CIQ.initiateChart([this.symbolUrl],this.other['date'],()=>{
				try{
					this.hideComponents()
					const periodArray = [
						{ period: 1, timeframe: 'Month' },
						{ period: 2, timeframe: 'Month' },
						{ period: 3, timeframe: 'Month' },
						{ period: 4, timeframe: 'Month' },
						{ period: 5, timeframe: 'Month' },
						{ period: 6, timeframe: 'Month' },
						{ period: 1, timeframe: 'Year' }
					]
					this.calculateBacktestHistory(this.other['EntryTradeDate'], periodArray,this.direction)
					this.calculateZScore(this.other, periodArray, this.direction)
					this.loadDefaultStudy().then(()=>{
						this.loadMarker()
					})
					
				}catch(e){
					console.error(e)
				}finally{
					CIQ.hideCover()
				}
			})

		},
		editStudies(bool){
			CIQ.extend(CIQ.Studies.studyLibrary["ma"], { edit:bool });
			CIQ.extend(CIQ.Studies.studyLibrary["macd"], { edit:bool });
			CIQ.extend(CIQ.Studies.studyLibrary["MAGap"], { edit:bool });
			CIQ.extend(CIQ.Studies.studyLibrary["MACDHistGap"], { edit:bool });
			CIQ.extend(CIQ.Studies.studyLibrary["rsi"], { edit:bool });
			CIQ.extend(CIQ.Studies.studyLibrary["ST ROCLike"], { edit:bool });
		},
		hideComponents() {
			let search = document.querySelector(".ciq-search")
			let indicatorSearch = document.querySelector(".ciq-indicators-search")
      let tickerIndicator = document.querySelector(".manage-layout-wrapper")
			let studies = document.querySelector(".ciq-studies")
			let favBtnContainer = document.querySelector(".favBtnContainer")
			let timeframeBtn = document.querySelector('.ciq-period')
			let footer = document.querySelector('.ciq-footer')

			search.style.visibility = 'hidden'
			indicatorSearch.style.visibility = 'hidden'
      tickerIndicator.style.visibility = 'hidden'
			studies.style.visibility = 'hidden'
			favBtnContainer.style.display = 'none'
			timeframeBtn.style.display = 'none'
			footer.style.display = 'none'

			// hide dual symbol
			document.querySelectorAll(".cq-comparison-new")[0].style.display = 'none'
		},
		loadDefaultStudy() {
			 return new Promise(async (resolve)=>{
				// 默认显示signal indicator 和 tech indicator,如果没有就不显示
				//if(this.other['_Signal'] == 'MA') this.other['_Signal'] = 'Moving Average'
        const ma_color = this.$store.getters.getColorByCriteriaAndIndex(0, 0)
        const patternMap = {
          'Head and Shoulders Top': 17,
          'Head and Shoulders Bottom': 17,
          'Double Top': 13,
          'Double Bottom': 13,
          'Triple Tap': 21,
          'Rounding Bottom': 21,
          'Ascending Channel': 16,
          'Descending Channel': 19,
        };
				switch(this.other['_Signal']){
					case "Symbol Close > its\' MA200 and Optix MA5 < 35":
						await CIQ.getIndicatorMatedata([this.symbolUrl],CIQ.stxx)
						CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
							Period: 5,
							display:"ST MA",
							Field: this.symbolUrl
						},{ MA: ma_color });
						CIQ.Studies.addStudy(CIQ.stxx, "ma",{
							Period: 200,
							Field: "Close"
						});
						CIQ.createOneTimePatternMarker(this.other.date,"Symbol Close > its\' MA200 and Optix MA5 < 35")					
						break;
					case "Symbol Close > its\' MA200 and Optix < 30":
            await CIQ.getIndicatorMatedata([this.symbolUrl],CIQ.stxx)
						CIQ.Studies.addStudy(CIQ.stxx, "ma",{
							Period: 200,
							Field: "Close"
						});
						CIQ.createOneTimePatternMarker(this.other.date,"Symbol Close > its\' MA200 and Optix < 30")						
						break;
					case "Optix MA10 < 30 and Optix < 20":
            await CIQ.getIndicatorMatedata([this.symbolUrl],CIQ.stxx)
						CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
							Period: 10,
							display:"ST MA",
							Field: this.symbolUrl
						},{ MA: ma_color });
						CIQ.createOneTimePatternMarker(this.other.date,"Optix MA10 < 30 and Optix < 20")						
						break;
					case "Optix #4":
            await CIQ.getIndicatorMatedata([this.symbolUrl],CIQ.stxx)
						CIQ.createOneTimePatternMarker(this.other.date,"Optix CrossBelow 0.5")						
						break;
          case "Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35":  // Optix #5
            await CIQ.getIndicatorMatedata([this.symbolUrl],CIQ.stxx)
						CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
							Period: 5,
							display:"ST MA",
							Field: this.symbolUrl
						},{ MA: ma_color });
            CIQ.Studies.addStudy(CIQ.stxx, "ma",{
							Period: 200,
							Field: "Close"
						});
						CIQ.createOneTimePatternMarker(this.other.date,"Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35")						
						break;
          case "Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35":  // Optix #6
            await CIQ.getIndicatorMatedata([this.symbolUrl],CIQ.stxx)
						CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
							Period: 10,
							display:"ST MA",
							Field: this.symbolUrl
						},{ MA: ma_color });
            CIQ.Studies.addStudy(CIQ.stxx, "ma",{
							Period: 200,
							Field: "Close"
						});
						CIQ.createOneTimePatternMarker(this.other.date,"Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35")						
						break;
          case "Symbol Close > its\' MA200 and Optix > 43 After Below 30":  // Optix #7
            await CIQ.getIndicatorMatedata([this.symbolUrl],CIQ.stxx)
            CIQ.Studies.addStudy(CIQ.stxx, "ma",{
							Period: 200,
							Field: "Close"
						});
						CIQ.createOneTimePatternMarker(this.other.date,"Symbol Close > its\' MA200 and Optix > 43 After Below 30")						
						break;
					case 'UpTrend Pattern':
						var points = eval('(' + this.other.Point + ')')
						CIQ.Studies.addStudy(CIQ.stxx, this.other['_Signal'],{display:this.other['_Signal']},null,{points:points})
						CIQ.createOneTimeScannerMarkerHighLowLine(this.other.date,this.other._Signal,points)						
						break;
					case 'DownTrend Pattern':
						var points = eval('(' + this.other.Point + ')')
						CIQ.Studies.addStudy(CIQ.stxx, this.other['_Signal'],{display:this.other['_Signal']},null,{points:points})
						CIQ.createOneTimeScannerMarkerHighLowLine(this.other.date,this.other._Signal,points)						
						break;
					case 'Hammer followed by a rise':
						CIQ.createOneTimeScannerMarkerHammer(this.other.EntryTradeDate,this.other.date,this.other._Signal)						
						break;
					case 'Shooting Star followed by a fall':
						CIQ.createOneTimeScannerMarkerHammer(this.other.EntryTradeDate,this.other.date,this.other._Signal)						
						break;
					case 'MAGap':
						CIQ.Studies.addStudy(CIQ.stxx, this.other['_Signal'],{display:this.other['_Signal']})
						CIQ.Studies.addStudy(CIQ.stxx,"ma",{display:'ma'});
						CIQ.createOneTimePatternMarker(this.other.date,"MAGap")
						
						break;
					case 'MACDHistGap':
						CIQ.Studies.addStudy(CIQ.stxx, this.other['_Signal'],{display:this.other['_Signal']})
						CIQ.Studies.addStudy(CIQ.stxx,"macd",{display:'macd'});
						CIQ.createOneTimePatternMarker(this.other.date,"MACDHistGap")						
						break;
					case 'PriceBreakout' :
            CIQ.setMALayout('Symbol Close', 'entry', 0, {ticker: this.symbol})
						CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
							display: '% of Previous Range',
							Field: 'Close',
							condition: 'OPR',
							period: 21
						},null,{criteria: 'entry',index: 0,showSupLine:0})
						CIQ.createOneTimePatternMarker(this.other.date,"PriceBreakout")
						break;
					case 'HighPoints' :
            CIQ.setMALayout('Symbol High', 'entry', 0, {ticker: this.symbol})
						CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
							display: '% of Previous Range',
							Field: 'High',
							condition: 'OPR',
							period: 13
						},null,{criteria: 'entry',index: 0,showSupLine:100})
						CIQ.createOneTimePatternMarker(this.other.date,"HighPoints")
						break;
					case 'LowPoints' :
            CIQ.setMALayout('Symbol Low', 'entry', 0, {ticker: this.symbol})
						CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
							display: '% of Previous Range',
							Field: 'Low',
							condition: 'OPR',
							period: 13
						},null,{criteria: 'entry',index: 0,showSupLine:0})
						CIQ.createOneTimePatternMarker(this.other.date,"LowPoints")
						break;
					case 'RSI' :
						CIQ.Studies.addStudy(CIQ.stxx, 'rsi',null,null,{showSupLine:40})
						CIQ.createOneTimePatternMarker(this.other.date,"RSI")
						break;
					case 'MA' :
						CIQ.Studies.addStudy(CIQ.stxx, "ma",{
							Period: 20,
							Type: 'simple',
							Field: "Close"
						});
						CIQ.createOneTimePatternMarker(this.other.date,"MA")
						break;
					case 'MACDHist' :
						CIQ.Studies.addStudy(CIQ.stxx, "macd",{
							Period: 20,
							Type: 'simple',
							Field: "Close"
						});
						CIQ.createOneTimePatternMarker(this.other.date,"MACD")
						break;
          /** CPM pattern */
          case 'Head and Shoulders Top' :   
          case 'Head and Shoulders Bottom' :
          case 'Double Top' : 
          case 'Double Bottom' :
          case 'Triple Tap' :
          case 'Rounding Bottom' :
          case 'Ascending Channel' :
          case 'Descending Channel' :
            const entryTradeDateArr = this.other['EntryTradeDate'] ? eval('(' + this.other['EntryTradeDate'] + ')') : []
            // 需要包括最新一天的cpm阴影
            CIQ.createCorrelationPatternMatchDrawing([...entryTradeDateArr,this.other.date], 'scannerai', patternMap[this.other['_Signal']]);
            CIQ.createOneTimePatternMarker(this.other.date,this.other['_Signal'])
            break;
          /** 8 high-low signals */
          case 'Symbol All-Time High' :
          case 'Symbol All-Time Low' :
          case 'Symbol 52-Week High' :
          case 'Symbol 52-Week Low' :
          case 'Symbol 4-Week High' :
          case 'Symbol 4-Week Low' :
          case 'Symbol 13-Week High' :
          case 'Symbol 13-Week Low' :
            CIQ.createOneTimePatternMarker(this.other.date,this.other['_Signal'])
            break;
          // Trend Score
          case 'Trend Score Breakout' :
          case 'Trend Score Breakdown' :
            await CIQ.getIndicatorMatedata([this.symbolUrl],CIQ.stxx)
            CIQ.createOneTimePatternMarker(this.other.date,this.other['_Signal'])
            break;
					default: 
				}
				if(this.other['Category'] != 'MidTermAI'){
					CIQ.Studies.addStudy(CIQ.stxx, "ma",{
						Period: 252,
						Type: 'simple',
						Field: "Close"
					});
				}
				
				resolve()
			 })	
		},
		calculateBacktestHistory(dataSet, periodArray,direction) {
			let chartDataset = CIQ.stxx.chart.dataSet
			//const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
			dataSet = dataSet? eval('(' + dataSet + ')') : []
			let backtestResult = []
			for (var data in dataSet) {
				var entryDate = formatStandardTime(dataSet[data])

				let res = chartDataset.findIndex((x) => {
					return entryDate.getTime() == x.DT.getTime()
				})
				

				if (res != -1) {
					//console.log('backtestResult',dataSet[data])
					//鎷胯繘鍦轰环鏍煎拰鍓嶄竴澶╀綔姣旇緝
					let entryPrice = chartDataset[res].Open
					const transformData = this.transformData(periodArray)
					transformData.sort((a, b) => a.value - b.value);
					let obj = {}
					transformData.map((item) => {
						let exitBar = chartDataset[res + item.value]
						? (
							((direction == 'Short'
							? entryPrice - chartDataset[res + item.value].Open
							: chartDataset[res + item.value].Open - entryPrice) /
							entryPrice) *
							100
						).toFixed(1)
						: ''
						obj[item.timeframe] = exitBar
					})
					backtestResult.push({ 'Entry Date': dataSet[data], ...obj })
				}
			}
			this.$store.commit('form/STORE_BACKTESTRESULT',backtestResult)
		},
		calculateZScore(dataSet, periodArray, direction) {
      /*
      periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
      */
      // masterData涓嶅寘鍚玦ndicator value,闃叉鏃爋hlcv鐨勬儏鍐
      let period_dict = this.transformZScoreData(periodArray)
      let quotes = CIQ.stxx.chart.masterData
      for (var i in period_dict) {
        quotes = this.generate_period_data(
          period_dict[i].timeframe,
          quotes,
          period_dict[i].value,
          direction
        )
      }
      // 鏁版嵁鍒囩墖
      // quotes = quotes.filter((x) => {
      //   return this.start_date.getTime() <= x.DT.getTime()
      // })
      //鎶婁氦鏄撳垪琛ㄨ浆鎹㈡垚鏃堕棿鎴
			const dateString = dataSet.EntryTradeDate
      if(!dateString) return
			// 将单引号替换为双引号以构成有效的 JSON 字符串
			const validJsonString = dateString.replace(/'/g, "\"")

			// 解析 JSON 字符串为数组
			const dateArray = isJson(validJsonString) ? JSON.parse(validJsonString) : []
      if(dateArray.length == 0) return

      let used_quotes = quotes.map(
        (x) => {
					// 创建一个日期对象
					const originalDate = new Date(x.DT);

					// 获取年、月、日信息
					const year = originalDate.getFullYear();
					const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1，并确保是两位数
					const day = originalDate.getDate().toString().padStart(2, '0'); // 确保是两位数的日期 2020-10-10

					// 构建新的日期格式
					const formattedDate = `${year}-${month}-${day}`;
					if(dateArray.includes(formattedDate)) return x
			}
      )
			
			// 使用filter()方法过滤掉空值项
			used_quotes = used_quotes.filter(item => item !== null && item !== undefined && item !== '');
      //鏇挎崲NaN
      quotes = quotes.map((quote) => {
        const updatedQuote = {}
        for (const [key, value] of Object.entries(quote)) {
          updatedQuote[key] = isNaN(value) ? -100 : value
        }
        return updatedQuote
      })

      let median_list = [],
        positive_list = [],
        max_loss_list = [],
        max_gain_list = [],
        z_score_list = [],
				temp_mean_list = []
      for (var i in period_dict) {
        let temp_median = this.calculate_median(
          used_quotes.map((obj) => obj[period_dict[i].timeframe])
        )
        median_list.push(temp_median)
        positive_list.push(
          this.calculate_win_rate(
            used_quotes.map((obj) => obj[period_dict[i].timeframe])
          )
        )
        if (direction == 'Short') {
          max_loss_list.push(
            this.calculate_median(
              used_quotes.map((obj) => obj['MaxGain' + period_dict[i].value])
            )
          )
          max_gain_list.push(
            this.calculate_median(
              used_quotes.map((obj) => obj['MaxLoss' + period_dict[i].value])
            )
          )
        } else {
          max_loss_list.push(
            this.calculate_median(
              used_quotes.map((obj) => obj['MaxLoss' + period_dict[i].value])
            )
          )
          max_gain_list.push(
            this.calculate_median(
              used_quotes.map((obj) => obj['MaxGain' + period_dict[i].value])
            )
          )
        }

        let temp_std = this.calculate_std(
          used_quotes.map((obj) => obj[period_dict[i].timeframe])
        )
        let temp_mean = this.calculate_mean(
          used_quotes.map((obj) => obj[period_dict[i].timeframe])
        )
        const _temp_mean = parseFloat(temp_mean.toFixed(1))
				temp_mean_list.push(_temp_mean)
				const sqrt_length = used_quotes.map((obj) => obj[period_dict[i].timeframe]).filter(e => !isNaN(e)).length
        z_score_list.push(
          parseFloat(
            (
              (temp_median - temp_mean) /
              (temp_std / Math.sqrt(sqrt_length))
            ).toFixed(1)
          )
        )

        //  console.log(period_dict[period_list[i]] + ': ',used_quotes.map(obj=>obj[period_dict[period_list[i]]]))

        //  console.log('positive_list',positive_list)
        //  console.log("MaxLoss" + period_list[i] + ': ',used_quotes.map(obj=>obj["MaxLoss" + period_list[i]]))
        //  console.log("MaxGain" + period_list[i] + ': ',used_quotes.map(obj=>obj["MaxGain" + period_list[i]]))
        //  console.log('max_loss_list',max_loss_list)
        //  console.log('max_gain_list',max_gain_list)
        //  console.log('z_score_list',z_score_list)
      }
      const res = period_dict.map((val, i) => {
			  const Positive = isNaN(positive_list[i]) ? '' : Math.round(positive_list[i] * 100)
        let AvgMaxLoss = (!median_list[i] && median_list[i]!=0) ? NaN : max_loss_list[i].toFixed(1)
        let AvgMaxGain = (!median_list[i] && median_list[i]!=0) ? NaN : max_gain_list[i].toFixed(1)
        // 如果为字符串类型，先转换为数字；注意要排除 NaN 的情况
        if (direction === 'Short' && !isNaN(AvgMaxLoss)) {
          AvgMaxLoss = -parseFloat(AvgMaxLoss);
        }
        if (direction === 'Short' && !isNaN(AvgMaxGain)) {
          AvgMaxGain = -parseFloat(AvgMaxGain);
        }
        return {
          Period: val['timeframe'],
					'Mean(%)': temp_mean_list[i],
          'Median(%)': median_list[i],
          '% Positive': Positive,
          'Avg Max Loss': AvgMaxLoss,
          'Avg Max Gain': AvgMaxGain,
          'Z-Score': z_score_list[i]
        }
      })
      this.result_quotes = res
      this.generate_table_data()
    },
		generate_period_data(name, quotes, period, direction) {
      // const field = this.tradePrice
      const field = 'Open'
      quotes = quotes.map((row, i) => {
        if (i < quotes.length - period) {
          //const change = parseFloat((100 * (quotes[i + period][field] / row[field] - 1)).toFixed(1))
          const change = parseFloat(
            (
              ((direction == 'Short'
                ? row[field] - quotes[i + period][field]
                : quotes[i + period][field] - row[field]) /
                row[field]) *
              100
            )
          )
          return {
            ...row,
            [field + period]: quotes[i + period][field],
            [name]: (change==Infinity || change==-Infinity) ? 0 : change
          }
        } else {
          return {
            ...row,
            [field + period]: NaN,
            [name]: NaN
          }
        }
      })
      const minCloseArr = this.get_period_parm(
        quotes.map((row) => row[field + period]),
        'min',
        period
      )
      const maxCloseArr = this.get_period_parm(
        quotes.map((row) => row[field + period]),
        'max',
        period
      )
      quotes = quotes.map((row, i) => {
        if (i >= period) {
          const change = parseFloat(
            (100 * (minCloseArr[i] / row[field] - 1))
          )
          return {
            ...row,
            ['MaxLoss' + period]: (change==Infinity || change==-Infinity) ? 0 : change
          }
        } else {
          return {
            ...row,
            ['MaxLoss' + period]: NaN
          }
        }
      })
      quotes = quotes.map((row, i) => {
        if (i >= period) {
          const change = parseFloat(
            (100 * (maxCloseArr[i] / row[field] - 1))
          )
          return {
            ...row,
            ['MaxGain' + period]: (change==Infinity || change==-Infinity) ? 0 : change
          }
        } else {
          return {
            ...row,
            ['MaxGain' + period]: NaN
          }
        }
      })

      return quotes
    },
		calculate_win_rate(arr) {
      arr = arr.filter(function (x) {
        return !isNaN(x) // 鍓旈櫎NaN鍊約
      })
      if (arr.length == 0) return NaN

      let return_series = arr.map((x) => (x > 0 ? 1 : 0))
      return parseFloat(this.calculate_mean(return_series).toFixed(1))
    },
		calculate_mean(arr) {
      arr = arr.filter(function (x) {
        return !isNaN(x) // 鍓旈櫎NaN鍊約
      })
      if (arr.length == 0) return NaN
      return arr.reduce((a, b) => a + b) / arr.length
    },
		calculate_median(arr) {
      arr = arr.filter((n) => !isNaN(n))
      if (arr.length == 0) return NaN
      const mid = Math.floor(arr.length / 2)
      const nums = [...arr].sort((a, b) => a - b)
      return parseFloat(
        (arr.length % 2 !== 0
          ? nums[mid]
          : (nums[mid - 1] + nums[mid]) / 2
        )
      )
    },
		calculate_std(arr) {
      arr = arr.filter(function (x) {
        return !isNaN(x) // 鍓旈櫎NaN鍊約
      })
      if (arr.length == 0) return NaN

      const mean =
        arr.reduce(function (a, b) {
          return a + b
        }) / arr.length // 璁＄畻骞冲潎鏁
      const deviationArr = arr.map(function (x) {
        return Math.pow(x - mean, 2)
      })

      const variance =
        deviationArr.reduce(function (a, b) {
          return a + b
        }) /
        (deviationArr.length - 1) // 璁＄畻鏂瑰樊锛屼娇鐢ㄨ嚜鐢卞害=1

      const std = Math.sqrt(variance) // 璁＄畻鏍囧噯宸
      return std
    },
    get_period_parm(dataSeries, paramType, period) {
			const typeDict = {
				max: Math.max,
				min: Math.min,
				mean: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length,
				sum: (arr) => arr.reduce((a, b) => a + b, 0),
			};

			const dataArr = [];

			// ✅ period = 1（或更小）特殊处理
			if (period <= 1) {
				for (let i = 0; i < dataSeries.length; i++) {
				const val = dataSeries[i];
				dataArr.push(
					isNaN(val) ? NaN : Number(val.toFixed(3))
				);
				}
				return dataArr;
			}

			// ✅ period > 1 走原逻辑
			for (let i = 0; i < dataSeries.length; i++) {
				if (i >= period) {
				const window = dataSeries
					.slice(i - period, i)
					.filter((n) => !isNaN(n));

				if (window.length === 0) {
					dataArr.push(NaN);
					continue;
				}

				const tmpData =
					paramType === 'mean' || paramType === 'sum'
					? typeDict[paramType](window)
					: typeDict[paramType](...window);

				dataArr.push(Number(tmpData.toFixed(3)));
				} else {
				dataArr.push(NaN);
				}
			}

			return dataArr;
		},
		transformZScoreData(data) {
			const rowFrequency = 'Daily'
      data = data.map(item => {
        if (item.period % 252 === 0 && item.timeframe === 'Day') {
          return { period: item.period / 252, timeframe: 'Year' }
        }
        if (item.period % 21 === 0 && item.timeframe === 'Day') {
          return { period: item.period / 21, timeframe: 'Month' }
        }
        // if (item.period % 5 === 0 && item.timeframe === 'Day') {
        //   return { period: item.period / 5, timeframe: 'Week' }
        // }
        if (item.period % 52 === 0 && item.timeframe === 'Week') {
          return { period: item.period / 52, timeframe: 'Year' }
        }
        // if (item.period % 4 === 0 && item.timeframe === 'Week') {
        //   return { period: item.period / 4, timeframe: 'Month' }
        // }
        if (item.period % 12 === 0 && item.timeframe === 'Month') {
          return { period: item.period / 12, timeframe: 'Year' }
        }
        return { period: item.period, timeframe: item.timeframe }
      })
      data = data.map(item => {
        let period = item.period;
        let timeframe = item.timeframe;
        if(rowFrequency === 'Daily') {
        if (timeframe === 'Day') {
          if(period % 5 === 0) {
            period = period / 5;
            timeframe = 'Week';
          }
          if (period % 13 === 0 && timeframe.includes('Week')) {
            period = (period / 13) * 3;
            timeframe = 'Month';
          }
          if(period % 12 === 0 && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Week') {
          if (period % 13 === 0) {
            period = (period / 13) * 3;
            timeframe = 'Month';
          }
          if (period % 12 === 0 && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Month') {
          if (period % 12 === 0) {
            period = period / 12;
            timeframe = 'Year';
          }
        }
        return { period, timeframe }
        }else if(rowFrequency === 'Weekly') {
        if (timeframe === 'Week') {
          // if(period % 4 === 0 && period <= 8) {
          //   period = period / 4;
          //   timeframe = 'Month';
          // }else if(period % 13 === 0 && period > 8) {
          //   period = (period / 13) * 3;
          //   timeframe = 'Month';
          // }
          if(((period % 13) % 4) === 0) {
            if(period % 13 === 12) {
              // 不转
              period = period
              timeframe = "Week"
            }else{
              let num = Math.trunc(period / 13)
              let end = (period % 13) / 4
              period = num * 3 + end
              timeframe = 'Month';
            }
          }
          if (period % 12 === 0  && timeframe.includes('Month')) {
            period = period / 12;
            timeframe = 'Year';
          }
        } else if (timeframe === 'Month') {
          if (period % 12 === 0) {
            period = period / 12;
            timeframe = 'Year';
          }
        }
        return { period, timeframe }
        }else if(rowFrequency === 'Monthly') {
          if (timeframe === 'Month') {
            if (period % 12 === 0) {
              period = period / 12;
            }
          }
        return { period, timeframe }
        }
        })
      return data.map((item) => {
        let timeframe =
          item.period > 1
            ? `${item.period} ${item.timeframe}s`
            : `${item.period} ${item.timeframe}`
        let value
        const frequency = rowFrequency
        if(frequency == 'Daily') {
        switch (item.timeframe) {
          case 'Day':
            value = Number(item.period)
            break
          case 'Week':
            value = Number(item.period) * 5
            break
          case 'Month':
            value = Number(item.period) * 21
            break
          case 'Year':
            value = Number(item.period) * 252
            break
          default:
            break
        }
        }else 
        if(frequency == 'Weekly') {
        switch (item.timeframe) {
          case 'Week':
            value = Number(item.period)
            break
          case 'Month':
            const period = Number(item.period)
            // if(period % 3 == 0) {
            //   num_3 = Math.trunc(period / 3) // 去除小数点取整数
            // }
            // value = num_3 === null ? period * 4 : period * 4 + num_3
            let num_3 = null
              num_3 = Math.trunc(period / 3) // 去除小数点取整数
              let end_3 = period % 3 // 余数
            // value = num_3 === null ? period * 4 : period * 4 + num_3
            value = num_3 * 13 + end_3 * 4
            break
          case 'Year':
            value = Number(item.period) * 52
            break
          default:
            break
        }
        }else 
        if(frequency == 'Monthly') {
        switch (item.timeframe) {
          case 'Month':
            value = Number(item.period)
            break
          case 'Year':
            value = Number(item.period) * 12
            break
          default:
            break
        }
        }

        return { timeframe, period: item.period, value }
      })
    },
		transformData(data) {
			data = data.map(item => {
				if (item.period % 5 === 0 && item.timeframe === 'Day') {
				return { period: item.period / 5, timeframe: 'Week' }
				}
				if (item.period % 21 === 0 && item.timeframe === 'Day') {
				return { period: item.period / 21, timeframe: 'Month' }
				}
				return { period: item.period, timeframe: item.timeframe }
			})
			const uniqueData = [];
			data.forEach(item => {
				const isDuplicate = uniqueData.some(
				uniqueItem =>
					uniqueItem.period == item.period && uniqueItem.timeframe == item.timeframe
				);

				if (!isDuplicate) {
				uniqueData.push(item);
				}
			});
			return uniqueData.map((item) => {
				let timeframe =
				item.period > 1
					? `${item.period} ${item.timeframe}s [%]`
					: `${item.period} ${item.timeframe} [%]`
				let value
				switch (item.timeframe) {
				case 'Day':
					value = Number(item.period)
					break
				case 'Week':
					value = Number(item.period) * 5
					break
				case 'Month':
					value = Number(item.period) * 21
					break
				case 'Year':
					value = Number(item.period) * 252
					break
				default:
					break
				}
				return { timeframe, period: item.period, value }
			})
		},
		transformDate(arr){
      // 创建一个空对象，用于存储处理后的结果
      var processeArray  = [];

      // 遍历原始数组
      for (var i = 0; i < arr.length; i++) {
        var currentItem = arr[i];

        // 将当前项拆分成数字和单位
        var parts = currentItem.split(" ");
        var value = parseInt(parts[0]);
        var unit = parts[1];

        // 将不同天数的项进行合并，根据比率转换
        if (unit === "Days") {
          if (value % 252 === 0) {
            value = value / 252;
            unit = value==1?"Year":"Years";
          }
          if (value % 21 === 0) {
            value = value / 21;
            unit = value==1?"Month":"Months";
          }
          // if (value % 5 === 0) {
          //   value = value / 5;
          //   unit = value==1?"Week":"Weeks";
          // }
        }
        if (unit === "Weeks") {
          if (value % 52 === 0) {
            value = value / 52;
            unit = value==1?"Year":"Years";
          }
          // if (value % 4 === 0) {
          //   value = value / 4;
          //   unit = value==1?"Month":"Months";
          // }
        }
        if (unit === "Months") {
          if (value % 12 === 0) {
            value = value / 12;
            unit = value==1?"Year":"Years";
          }
        }
        if(this.rowFrequency === 'Daily') {
          if (unit === "Days") {
            if (value % 5 === 0) {
              value = value / 5;
              unit = value==1?"Week":"Weeks";
            }
            if (value % 13 === 0 && unit.includes('Week')) {
              value = (value / 13) * 3;
              unit = value==1?"Month":"Months";
            }
            if(value % 12 === 0 && unit.includes('Month')) {
              value = value / 12;
              unit = value==1?"Year":"Years";
            }
          }else if (unit === "Weeks") {
            if (value % 13 === 0) {
              value = (value / 13) * 3;
              unit = value==1?"Month":"Months";
            }
            if (value % 12 === 0 && unit.includes('Month')) {
              value = value / 12;
              unit = value==1?"Year":"Years";
            }
          }else if (unit === "Months") {
            if (value % 12 === 0) {
              value = value / 12;
              unit = value==1?"Year":"Years";
            }
          }else {
            value = value
            unit = value==1?unit:`${unit}s`
          }
          }else if(this.rowFrequency === 'Weekly') {
            if (unit === 'Week') {
              // if(value % 4 === 0 && value <= 8) {
              //   value = value / 4;
              //   unit = value==1?"Month":"Months"
              // }else if(value % 13 === 0 && value > 8) {
              //   value = (value / 13) * 3;
              //   unit = value==1?"Month":"Months"
              // }
              if(((value % 13) % 4) === 0) {
                if(value % 13 === 12) {
                  // 不转
                  unit = value==1?"Week":"Weeks"
                }else{
                  let num = Math.trunc(value / 13)
                  let end = (value % 13) / 4
                  value = num * 3 + end
                  unit = value==1?"Month":"Months"
                }
              }
              if (value % 12 === 0  && unit.includes('Month')) {
                value = value / 12;
                unit = value==1?"Year":"Years";
              }
            } else if (unit === 'Month') {
              if (value % 12 === 0) {
                value = value / 12;
                unit = value==1?"Year":"Years";
              }
            }
        }else if(this.rowFrequency === 'Monthly') {
          if (unit === 'Month') {
            if (value % 12 === 0) {
              value = value / 12;
            }
          }
        }

        // 生成新的项
        var newItem = value + " " + unit;

        // 将新的项添加到 processedObj，使用项作为键名
        let res
        switch(unit){
          case "Days":
            res = 1*value
            break
          case "Day":
            res = 1*value
            break
          case "Weeks":
            res = 5*value
            break
          case "Week":
            res = 5*value
            break
          case "Months":
            res = 21*value
            break
          case "Month":
            res = 21*value
            break
          case "Years":
            res = 252*value
            break
           case "Year":
            res = 252*value
            break
          default:
            break
        }
        if(processeArray.map(x=>x.label).indexOf(newItem) == -1) processeArray.push({label:newItem,value:res})
        //processedObj[newItem] = res;
      }
      //console.log(processedObj)
      // 提取处理后的结果数组
     // var processedArray = Object.keys(processedObj);

      return processeArray;
    },
		generate_table_data() {
      this.generatePeriods()
        // 鎻愬彇灞炴€т俊鎭
        let keys = Object.keys(this.result_quotes[0])
        keys.splice(keys.indexOf('Period'), 1)
        let result = []
        for (let i = 0; i < keys.length; i++) {
          result.push({
            property: keys[i]
          })
        }
        // 灏Periods 淇℃伅鎻掑叆鍒data 涓紝灏data 缁戝畾鍒table 涓
        for (let i = 0; i < this.periods.length; i++) {
          for (let j = 0; j < result.length; j++) {
            this.result_quotes.forEach((obj) => {
              if (obj.Period === this.periods[i].period) {
                result[j][this.periods[i].period] = obj[result[j].property]
              }
            })
          }
        }
				result = result.map((item) => {
					// 创建一个新的对象，将key值修改为'key [%]'
					return {
						'1 Month [%]': item['1 Month'],
						'2 Months [%]': item['2 Months'],
						'3 Months [%]': item['3 Months'],
						'4 Months [%]': item['4 Months'],
						'5 Months [%]': item['5 Months'],
						'6 Months [%]': item['6 Months'],
						'1 Year [%]': item['1 Year'],
						property: item.property
					 }
				})
        this.result_quotes = result
				console.log('zscode结果', result)
				this.$store.commit('form/STORE_BACKTEST_ZSCORE_RESULT',this.result_quotes)
    },
		generatePeriods() {
      let quotes = []
        quotes = this.result_quotes
        let set = new Set()
        for (let i = 0; i < quotes.length; i++) {
          set.add(quotes[i].Period)
        }
        let values = Array.from(set)
        let columns = []
        for (let i = 0; i < values.length; i++) {
          columns.push({
            period: values[i]
          })
        }
        this.periods = columns
				console.log('this.periods-', this.periods)
    },
		concatenateEntryAndExit(){
			// 把字符串列表entryDates, exitDates格式化为markerSet的对象数组
			let markerSet= []

      let entryTradeDateArr = this.other['EntryTradeDate'] ? eval('(' + this.other['EntryTradeDate'] + ')') : []
			let entryTradePriceArr = this.other['EntryTradePrice'] ? eval('(' + this.other['EntryTradePrice'] + ')') : []
      const entryMarkerType = this.direction == 'Short' ? 'SELL' : 'BUY'
      if(entryTradeDateArr){
          entryTradeDateArr.forEach((item,index)=>{
            let entryReason = this.other['_Signal']
            markerSet.push({
                DT: item,
                Price: entryTradePriceArr[index],
                Type: entryMarkerType,  
                Indicator: [entryReason],  
                reason: 'meet Entry Criteria',
                isEndDate: false,
            })
          })
      }
      let exitTradeDateArr = this.other['ExitTradeDate'] ? eval('(' + this.other['ExitTradeDate'] + ')') : []
			let exitTradePriceArr = this.other['ExitTradePrice'] ? eval('(' + this.other['ExitTradePrice'] + ')') : []
      const exitMarkerType = this.direction == 'Short' ? 'BUY' : 'SELL'
      if(exitTradeDateArr){
          exitTradeDateArr.forEach((item,index)=>{
            let exitReasonArr = eval('(' + this.other.ExitReason + ')')

            markerSet.push({
                DT: item,
                Price: exitTradePriceArr[index],
                Type: exitMarkerType,    
                Indicator: [exitReasonArr[index]], 
                reason: exitReasonArr[index],
                isEndDate: index == exitTradeDateArr.length-1,  //實際上scannerai最後一個退場在當天的話不繪製marker，所以可以不管
            })
          })
      }
      debugger
			markerSet = markerSet.sort((a,b)=>new Date(a['DT'])-new Date(b['DT']))
			
			// 如果推荐日和最后一个退场日重叠，则隐藏退场日marker(一般情况都是重叠的)
			if(this.other['date'] == exitTradeDateArr[exitTradeDateArr.length-1]){
				markerSet.pop()
			}
			return markerSet
		},
		filterFormatMarkerDate(start_date, end_date, markerSet) {
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
		loadMarker() {
			try {
				//load markers for initial quotefeed

				let list = this.filterFormatMarkerDate(
					new Date(CIQ.initialDate.start),
					new Date(CIQ.initialDate.end),
					this.concatenateEntryAndExit()
				)
				this.trades = list
				this.$store.dispatch('states/set_isMarkerShown_flag',true)
				
				// split the markers into several groups
				CIQ.groups = this.group(list)
				let markers = CIQ.groups.pop()

				// if the last groups has no enough number of items, merge it with the last one
				//console.log('CIQ.stxx.chart.xaxis[0]',CIQ.stxx.chart.xaxis[0])
				// let c_date = jutils.formatDate(CIQ.stxx.chart.xaxis[0].DT, 'YYYYMMDD')
        const firstNonEmpty = CIQ.stxx.chart.xaxis.find(obj => Object.keys(obj).length > 0);
        let c_date = jutils.formatDate(firstNonEmpty.DT, 'YYYYMMDD')
				if (CIQ.groups.slice(-1)[0]) {
				let m_date =
					CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(0, 4) +
					CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(5, 7) +
					CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(8, 10)
				if (c_date < m_date) {
					markers.unshift(...CIQ.groups.pop())
				}
				}
				console.log('initiating Markers...', markers,CIQ.groups)
				CIQ.loadChart(markers, CIQ.addMarker)
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
		updateMAPeriod(val) {
			// update MA period
			
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]
				if (
					sd.type == 'ma' && sd.panel == 'chart'
				) {
					var replaceStudy = {
						name: 'Moving Average',
						overlay: true,
						calculateFN: CIQ.Studies.calculateMovingAverage,
						inputs: {
							Period: val,
							Field: sd.inputs.Field,
							Type: 'simple',
							Offset: 0
						},
						outputs: { MA: '#FF0000' }
					}
					CIQ.Studies.studyLibrary[sd.type] = replaceStudy
					var st = CIQ.Studies.replaceStudy(CIQ.stxx, sd.inputs.id, sd.type, null, null, {
						criteria: null,
						index: null
					})
			
					CIQ.loadChart(this.trades.map(x=>{return {Date:x.DT,TradeStatus:x.Type}}), CIQ.addMarker)
				}
			}
		}	
	}
}
</script>

<style lang="less" scoped>
.TVChartContainer {
	//height: calc(100vh - 80px);
	height: 100%;
}
#chart_box {
	// margin-top: 80px
}
</style>