<template>
	<!-- <div class="TVChartContainer" ref="chartContainer" /> -->
	<div class="chart_box" id="chart_box">
		<chart :symbol="symbol" :onChartReady="onChartReady" width="100%" height="100%"></chart>
	</div>
</template>

<script>
import chart from '@/components/chart/index.vue'
import { CIQ } from 'chartiq/js/components'
export default {
	name: 'TVChartContainer',
	props: {
		other: Object,
		symbol :String,
		direction: String,
	},
	data() {
		return {
			indicator : ''
		}
	},
	components: {
    	chart: chart,
	},
	created() {
		console.log(this.other,this.symbol)
	},
	methods:{
		onChartReady(){
			//this.loadDefaultStudy()
			CIQ.initiateChart(()=>{
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
			})

		},
		loadDefaultStudy() {
			// 默认显示signal indicator 和 tech indicator,如果没有就不显示
			for(var i in CIQ.technicalCategory){
				this.indicator = CIQ.technicalCategory[i]['studies'].find(item=>item.name == this.other['_Signal']).url
			}

			CIQ.Studies.addStudy(CIQ.stxx, this.indicator,{display:this.indicator});
			// macd gap和macd绑定显示
			if (this.indicator == 'macd_hist_gap') {
				CIQ.Studies.addStudy(CIQ.stxx, 'macd');
			}
			// ma gap和ma绑定显示
			if (this.indicator == 'ma_gap') {
				CIQ.Studies.addStudy(CIQ.stxx, 'ma');
			}


			// // 默认显示高低线和pattern,如果没有就不显示
			// let patterns = ['UpPattern', 'DownPattern']
			// if (patterns.indexOf(this.other['_Signal']) == -1) return

			// // 显示pattern标记
			// let lastItem = this.other['Point'].slice(this.other['Point'].length - 1)
			// const shapeOffset = 2
			// widget.activeChart().createShape(
			// 	{
			// 		time: new Date(lastItem[0].Date) / 1000,
			// 		price: lastItem[0].Value + shapeOffset
			// 	},
			// 	{
			// 		shape: 'note',
			// 		text: this.other['_Signal'],
			// 		lock: true,
			// 		overrides: {
			// 			backgroundColor: '#5000fc',
			// 			markerColor: '#5000fc',
			// 			textColor: '#FFFFFF',
			// 			fontsize: 14,
			// 			backgroundTransparency: 40
			// 		}
			// 	}
			// )
		},
		calculateBacktestHistory(dataSet, periodArray,direction) {
			//this.$store.dispatch('app/store_backtestResult', []).then(() => {
				let chartDataset = CIQ.stxx.chart.dataSet
				//const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
				dataSet = eval('(' + dataSet + ')')
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
	}
}
</script>

<style lang="less" scoped>
.TVChartContainer {
	//height: calc(100vh - 80px);
	height: 100%;
}
</style>