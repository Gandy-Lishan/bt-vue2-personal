<template>
	<!-- <div class="TVChartContainer" ref="chartContainer" /> -->
	<!-- <div class=''>
		<el-button></el-button> -->
		<div class="chart_box" id="chart_box">
			<div class="back">
				<router-link to="/home/scannerai"><i class="el-icon-arrow-left"></i><span>Back to the stock scanner list</span></router-link>
			</div>
			<chart :symbol="symbol" :onChartReady="onChartReady" width="100%" height="100%"></chart>
		</div>
	<!-- </div> -->

</template>

<script>
import chart from '@/components/chart/index.vue'
import { CIQ } from 'chartiq/js/components'
import jutils from 'jutils-src'
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
		}
	},
	components: {
    	chart: chart,
	},
	created() {
		CIQ.addCover()
    	CIQ.nprogress.start()
	},
	beforeDestroy() {
		// 防止跳转到backtester时保留了Hammer followed by a raise等marker
		CIQ.removeALLStudies()

		// 还原chartiq默认study definition
		this.editStudies(true)
	},
	computed: {
		updateSettingMA() {
			return this.$store.state.studySettingMA
		},
	},
	watch: {
		updateSettingMA(val) {
			this.updateMAPeriod(val['period'])
		},
	},
	methods:{
		onChartReady(){
			this.overrideStudyDef()
			// 默认让indicator无法编辑
			this.editStudies(false)

			CIQ.initiateChart([CIQ.symbol],this.other['date'],()=>{
				try{
					this.hideComponents()
					const periodArray = [
						{ period: 1, timeframe: 'Week' },
						{ period: 2, timeframe: 'Week' },
						{ period: 1, timeframe: 'Month' },
						{ period: 2, timeframe: 'Month' },
						{ period: 3, timeframe: 'Month' },
						{ period: 6, timeframe: 'Month' },
						{ period: 12, timeframe: 'Month' }
					]
					this.calculateBacktestHistory(this.other['EntryTradeDate'], periodArray,this.direction)
					this.loadDefaultStudy()
					
				}catch(e){
					console.error(e)
				}finally{
					CIQ.hideCover()
					CIQ.nprogress.done()
				}
			})

		},
		overrideStudyDef(){
			CIQ.extend(CIQ.Studies.studyLibrary["rsi"], {
				calculateFN: CIQ.Studies.calculateSTRSI,
				outputs: { RSI: "auto",supLine:'#9a9a9a' }
			});
		},
		editStudies(bool){
			CIQ.extend(CIQ.Studies.studyLibrary["ma"], { edit:bool });
			CIQ.extend(CIQ.Studies.studyLibrary["macd"], { edit:bool });
			CIQ.extend(CIQ.Studies.studyLibrary["MAGap"], { edit:bool });
			CIQ.extend(CIQ.Studies.studyLibrary["MACDHistGap"], { edit:bool });
		},
		hideComponents() {
			let search = document.querySelector(".ciq-search")
			let indicatorSearch = document.querySelector(".ciq-indicators-search")
			let studies = document.querySelector(".ciq-studies")
			let favBtnContainer = document.querySelector(".favBtnContainer")
			search.style.visibility = 'hidden'
			indicatorSearch.style.visibility = 'hidden'
			studies.style.visibility = 'hidden'
			favBtnContainer.style.display = 'none'
		},
		async loadDefaultStudy() {
			 
			// 默认显示signal indicator 和 tech indicator,如果没有就不显示
			//if(this.other['_Signal'] == 'MA') this.other['_Signal'] = 'Moving Average'
				
			switch(this.other['_Signal']){
				case "Symbol Close > its\' MA200 and Optix MA5 < 35":
					await CIQ.getIndicatorMatedata([CIQ.symbol])
					CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
						Period: 5,
						display:"ST MA",
						Field: CIQ.symbol
					});
					CIQ.Studies.addStudy(CIQ.stxx, "ma",{
						Period: 200,
						Field: "Close"
					});
					CIQ.createOneTimePatternMarker(this.other.date,"Symbol Close > its\' MA200 and Optix MA5 < 35")
					break;
				case "Symbol Close > its\' MA200 and Optix < 30":
					await CIQ.getIndicatorMatedata([CIQ.symbol])
					CIQ.Studies.addStudy(CIQ.stxx, "ma",{
						Period: 200,
						Field: "Close"
					});
					CIQ.createOneTimePatternMarker(this.other.date,"Symbol Close > its\' MA200 and Optix < 30")
					break;
				case "Optix MA10 < 30 and Optix < 20":
					await CIQ.getIndicatorMatedata([CIQ.symbol])
					CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
						Period: 5,
						display:"ST MA",
						Field: CIQ.symbol
					});
					CIQ.createOneTimePatternMarker(this.other.date,"Optix MA10 < 30 and Optix < 20")
					break;
				case 'UpTrend Pattern':
					var points = eval('(' + this.other.Point + ')')
					CIQ.Studies.addStudy(CIQ.stxx, this.other['_Signal'],{display:this.other['_Signal']},null,{points:points})
					CIQ.createOneTimeScannerMarkerHighLowLine(points.slice(points.length - 1),this.other._Signal,points)
					break;
				case 'DownTrend Pattern':
					var points = eval('(' + this.other.Point + ')')
					CIQ.Studies.addStudy(CIQ.stxx, this.other['_Signal'],{display:this.other['_Signal']},null,{points:points})
					CIQ.createOneTimeScannerMarkerHighLowLine(points.slice(points.length - 1),this.other._Signal,points)
					break;
				case 'Hammer followed by a raise':
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
					CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
						display: '% of Previous Range',
						Field: 'Close',
						condition: 'OPR',
						period: 21
					},null,{showSupLine:0})
					CIQ.createOneTimePatternMarker(this.other.date,"PriceBreakout")
					break;
				case 'HighPoints' :
					CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
						display: '% of Previous Range',
						Field: 'High',
						condition: 'OPR',
						period: 13
					},null,{showSupLine:100})
					CIQ.createOneTimePatternMarker(this.other.date,"HighPoints")
					break;
				case 'LowPoints' :
					CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
						display: '% of Previous Range',
						Field: 'Low',
						condition: 'OPR',
						period: 13
					},null,{showSupLine:0})
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
				default: 
			}

			CIQ.stxx.setChartType("candle");
			this.loadMarker()
		},
		calculateBacktestHistory(dataSet, periodArray,direction) {
			//this.$store.dispatch('app/store_backtestResult', []).then(() => {
				let chartDataset = CIQ.stxx.chart.dataSet
				//const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
				dataSet = dataSet? eval('(' + dataSet + ')') : []
				let backtestResult = []
				for (var data in dataSet) {
					var datatime = new Date(dataSet[data])

					var offset = datatime.getTimezoneOffset() * 60 * 1000
					var entryDate = new Date(datatime.setTime(datatime.getTime() + offset))

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
							).toFixed(2)
							: ''
							obj[item.timeframe] = exitBar
						})
						backtestResult.push({ 'Entry Date': dataSet[data], ...obj })
					}
				}
				this.$store.commit('STORE_BACKTESTRESULT',backtestResult)
				//this.$store.dispatch('app/store_backtestResult', backtestResult)
			// }).catch(() => {
    		// })
		},
		transformData(data) {
			data = data.map(item => {
				if (item.period % 5 === 0 && item.timeframe === 'Day') {
				return { period: item.period / 5, timeframe: 'Week' }
				}
				if (item.period % 21 === 0 && item.timeframe === 'Day') {
				return { period: item.period / 21, timeframe: 'Month' }
				}
				return item
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
				default:
					break
				}
				return { timeframe, period: item.period, value }
			})
		},
		filterFormatMarkerDate(start_date, end_date) {
			// 把字符串列表entryDates, exitDates格式化为markerSet的对象数组
			const markerSet= []
			const dataSource = CIQ.stxx.chart.dataSet
            let entryTradeDateArr = this.other['EntryTradeDate'] ? eval('(' + this.other['EntryTradeDate'] + ')') : []
            if(entryTradeDateArr){
                entryTradeDateArr.forEach((item,index)=>{
					var datatime = new Date(item)
					var offset = datatime.getTimezoneOffset() * 60 * 1000
					const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))
                    let quote = dataSource.find(x=>{
                        return x.DT.getTime() == standardDate.getTime()
                    })
					let entryReason = this.other['_Signal']
					
                    markerSet.push({
                        DT: item,
                        Price: quote.Close,
                        Type: 'BUY',  
						Indicator: [entryReason],  
                    })
                })
            }
            let exitTradeDateArr = this.other['ExitTradeDate'] ? eval('(' + this.other['ExitTradeDate'] + ')') : []
            if(exitTradeDateArr){
                exitTradeDateArr.forEach((item,index)=>{
					var datatime = new Date(item)
					var offset = datatime.getTimezoneOffset() * 60 * 1000
					const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))
                    let quote = dataSource.find(x=>{
                        return x.DT.getTime() == standardDate.getTime()
                    })

					let exitReasonArr = eval('(' + this.other.ExitReason + ')')
                    markerSet.push({
                        DT: item,
                        Price: quote.Close,
                        Type: 'SELL',    
						Indicator: [exitReasonArr[index]]
                    })
                })
            }
			
			// 如果推荐日和最后一个退场日重叠，则隐藏退场日marker(一般情况都是重叠的)
			if(this.other['date'] == exitTradeDateArr[exitTradeDateArr.length-1]){
				markerSet.pop()
			}

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
				)
				this.trades = list
				CIQ.isMarkerShown = true
				
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
			
					CIQ.loadChart(this.trades.map(x=>{return {Date:x.DT,TradeStatus:x.Type}}), CIQ.addDot)
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
.back {
    position: absolute;
    top: 109px;
    left: 48px;
	font-size: 1.1rem;
	a {
		color: #727475;
		&:hover {
			color: #5b9bd1;
		}
	}
}
#chart_box {
	margin-top: 80px
}
</style>