<template>
	<div class="CPM-list-container ScannerBTTable">
		<!-- <link rel="stylesheet" href="../../../../assets/font/iconfont.css"></link> -->
    <p class="filterTableDes">
					{{signalDes}}
    </p>
		<el-table
			ref="tableREF"
			class="ScannerBTTable"
			:data="paginatedData"
			empty-text="No Data"
      v-loading="loading"
			@sort-change="changeTableSort"
			style="width: 100%; height: 100%"
      size="small"
      stripe
		>
			<!-- :min-width="90" -->
			<template v-for="(l, index) in tableCol">
				<el-table-column		
					v-if="l.label == 'Symbol'"
					:label="l.label"
					:prop="l.value"
					:key="index"
					min-width="70"
					:sortable="
						[
							'Symbol'
						].indexOf(l.label) !== -1
							? 'custom'
							: false
					"
				>
					<template slot-scope="scope">
     {{ scope.row[l.value] || '' }}
					</template>
				</el-table-column>
				<el-table-column
					v-if="l.label != 'Symbol'"
					:sortable="'custom'"
					:label="l.label"
					:prop="l.value"
					:key="index"
				>
					<template slot-scope="scope">
						<span class="tableText">
							{{ `${scope.row[l.value]}${l.label.includes('%') ? '%' : ''}` }}
						</span>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:page-sizes="[10, 30, 50, 100, 200]"
		:page-size="pageSize"
		:current-page="currentPage"
		:total="data.content.length"
		layout="total, sizes, prev, pager, next, jumper"
		></el-pagination>
	</div>
</template>

<script>

export default {
	name: 'FilterTable',
	props: {
		data: Object,
		tableCol :Array,
		loading: Boolean,
		signalDes: String
	},
	data() {
		return {
				btnLoading: false,
				btInfo: [],
				
				checkboxGroupState: {},
				selectedStopLosses: [],
				selectedProfitTargets: [],
				selectedWinRates: [],

				activeSignal: [],

				popupVisible: false, // 弹窗可见性
    			popupContent: '', // 弹窗内容
				hoveredItem: null, // 悬停的元素
				
				textContent: {
					'MA':"This strategy utilizes the crossover of closing prices and moving averages as trading signals.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
					'MAGap':"This strategy determines trading signals by comparing the difference between the moving average of the current day and the previous day.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
					'MACDHist':"This strategy uses the crossover signals of the MACD histogram as trading signals.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
					'MACDHistGap':"This strategy determines trading signals by comparing the difference between the MACDHist and the previous day's value.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
					'Hammer followed by a rise':"If the previous day's candlestick shows a long lower shadow,<br/>indicating support at the bottom,<br/>a long signal is generated when the price rises above a certain threshold after the opening.",
					'Shooting Star followed by a fall':"If the previous day's candlestick shows a long upper shadow,<br/>indicating resistance at the top,<br/>a short signal is generated when the price falls below a certain threshold after the opening.",
					'UpTrend Pattern':"When the price surpasses the upward trendline connecting the peak points of an uptrend,<br/>it indicates a potential future rise and generates a long signal.",
					'DownTrend Pattern':"When the price falls below the downward trendline connecting the trough points of a downtrend,<br/>it indicates a potential future decline and generates a short signal.",
					'Symbol Close > its\' MA200 and Optix MA5 < 35':"stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35.",
					'Optix #1':"stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35.",
					'Symbol Close > its\' MA200 and Optix < 30':"stocks that are above their 200-day moving average with an Optix less than 30.",
					'Optix #2':"stocks that are above their 200-day moving average with an Optix less than 30.",
					'Optix #4':"stocks that Optix crossbelow 0.5.",
					'Optix #5': 'Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35',
					'Optix #6': 'Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35',
					'Optix #7': 'Symbol Close > its\' MA200 and Optix > 43 After Below 30',
					'Optix MA10 < 30 and Optix < 20':"Optix indicators with a 10-day moving average less than 30 and that day's Optix value is less than 20.",
					'Optix #3':"Optix indicators with a 10-day moving average less than 30 and that day's Optix value is less than 20.",
					'Optix #5':'stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35 then above 43.',
					'Optix #6':'stocks that are above their 200-day moving average with an Optix 10-day moving average less than 35 then above 43.',
					'Optix #7':'stocks that are above their 200-day moving average with an Optix less than 30 then above 43.',
					'PriceBreakout':"When the closing price of a stock ranks above 0 in relation to the closing prices of the past 21 trading days, <br/>a golden cross occurs, indicating an upward breakout and generating a long signal. <br/>This suggests that the stock's price has entered a breakout phase and is likely to continue rising.",
					'HighPoints':"When the highest price of a stock ranks above 100 in relation to the highest prices of the<br/> past 13 trading days (higher stock prices correspond to higher rankings), <br/>it forms a 13-day new high and generates a long signal. This indicates that <br/>the stock is experiencing a positive breakthrough and is in an upward trend.",
					'LowPoints':"When the lowest price of a stock ranks below 0 in relation to the lowest prices of the past 13 trading days, <br/>it forms a 13-day new low and generates a short signal. <br/>This indicates that the stock is in a downtrend and can be shorted.",
					'RSI':"When the RSI indicator forms a golden cross above 40, it suggests that the indicator is about to<br/>recover from an oversold state to the midpoint, indicating a potential long signal. <br/>RSI can reflect whether a stock is in an overbought or oversold condition <br />but should be used in conjunction with the trend analysis.",
					'Head and Shoulders Top': 'The stock price rises from the left shoulder to a peak, falls back to the support level, <br/>then rises higher to form a head, and then falls back to the support level again. Afterwards, the price rises to the height of the left shoulder <br/>to form the right shoulder, followed by a significant decline, breaking through the bottom of the pattern and continuing to decline. <br/>Head and shoulders tops are typical bear market signals.',
					'Head and Shoulders Bottom': 'Usually formed after a sharp market decline, indicating a market reversal. The pattern consists of the left shoulder, <br/>head, right shoulder, and neckline. The middle valley (head) is the deepest, while <br/>the front and back valleys (left and right shoulders) are shallower and almost symmetrical, forming <br/>a head and shoulders bottom shape.',
					'Double Top': 'Composed of two similar high points, shaped like the letter "M". The formation of a <br/>double top pattern is a reversal signal, indicating that prices will fall.',
					'Double Bottom': "Also known as a W bottom, formed when the low points of a stock price's two consecutive <br/>declines are roughly the same. It is a bullish reversal pattern.",
					'Triple Tap': 'Triple Tap refers to a scenario where stocks or other assets exhibit repeated bounces off <br/>the support line (the lower boundary of the price range). This pattern is often seen <br/>as a positive signal that stock prices are experiencing strong buying support near the support line.  <br/>By observing this pattern, investors may perceive the support line as an important price level that <br/>may have a positive impact on prices and may be a suitable buying opportunity.',
					'Rounding Bottom': `Rounding bottom is a chart pattern that's used in technical analysis. It's identified by <br/>a series of price movements that graphically form the shape of a "U". Rounding bottoms <br/>are found at the end of extended downward trends and signify a reversal in long-term price movements.`,
					'Ascending Channel': "Ascending channel is the price action contained between upward sloping parallel lines. <br/>Higher highs and higher lows characterize this price pattern. Before traders take a short position <br/>when price breaks below the lower channel line of an ascending channel, they should look <br/>for other signs that show weakness in the pattern.",
					'Descending Channel': "Descending channel is a chart pattern that indicates a downward trend in a security's price. <br/>Visually, a descending channel angles downward, from a high point to a lower point. The idea behind the descending channel <br/>is that once established, it may signify a continuation of lower high and low prices. Once the trendlines are solid and extended, <br/>traders can get a sense of points of price support and resistance.",
					'Trend': 'Closing price above the 252-day moving average is considered as Uptrend.<br/>Closing price below the 252-day moving average is considered as Downtrend.<br/>The whole backtest period is considered as ALL.',
					'ExpectedReturn': 'ExpectedReturn = (WinRate * ProfitTarget - (100.0 - WinRate) * StopLoss) / 100.0',
					'Symbol All-Time High': 'Symbol All-Time High is the highest closing price a symbol has reached in its trading history. <br/>Symbols that hit all-time high are often viewed as positive indicators, as it shows that investor <br/>confidence and demand for the symbol is continuing to grow.',
					'Symbol All-Time Low': 'Symbol All-Time Low refers to the lowest closing price the symbol has ever traded at over its entire history. <br/>It indicates the symbol has lost significant value compared to its past performance. Investors <br/>view all-time low as a sign of deep trouble.',
					'Symbol 52-Week High': 'Symbol 52-Week High is the highest closing price at which a symbol has traded in the last 52 weeks (1 year). <br/>A symbol hitting a new 52-week high is often seen as a positive technical indicator that the symbol <br/>is gaining momentum and is in an uptrend.',
					'Symbol 52-Week Low': 'Symbol 52-Week Low is the lowest closing price at which a symbol has traded in the past 52 weeks (1 year). <br/>Symbols trading at or near 52-week lows are generally considered to be in a downtrend or under significant <br/>selling pressure. 52-week lows can trigger technical sell signals and further downward momentum as investors try to cut their losses.',
					'Symbol 4-Week High': "Symbol 4-Week High refers to the highest closing price at which a symbol has traded in the last 4 weeks (1 month). <br/>It is a shorter-term technical indicator that gives an idea of a symbol's recent price performance. <br/>Symbols that make new four-week highs are often seen as having positive short-term momentum because they are trading <br/>at the highest price levels of the past month.",
					'Symbol 4-Week Low': "Symbol 4-Week Low is the lowest closing price at which a symbol has traded in the past 4 weeks (1 month). Tracking whether <br/>a symbol is near its 4-week low gives an idea of how weak the symbol's recent price has been compared <br/>to the past month. Symbols trading at or near 4-week lows are usually considered to be under short-term selling pressure <br/>or in a recent downtrend.",
					'Symbol 13-Week High': 'Symbol 13-Week High is the highest closing price at which a symbol has traded in the past 13 weeks (3 months). <br/>Symbols that make new 13-week high are often seen as having positive medium-term momentum because they are <br/>trading at their highest levels of the past quarter. A new 13-week high can be a bullish signal that <br/>a symbol is in an uptrend.',
					'Symbol 13-Week Low': "Symbol 13-Week Low refers to the lowest closing price a symbol has traded at over the past 13 weeks (3 months). <br/>Symbols trading at or near their 13-week lows are often seen as being in a medium-term downtrend or under selling <br/>pressure. The 13-week low gives a longer-term view on a symbol's recent price weakness. Hitting a new 13-week <br/>low can be a bearish signal, suggesting the symbol is in a downward trend.",
					'Trend Score Breakout': "When a stock's Trend Score rises above 7, it indicates a strong positive market trend. This score aggregates ten trend-following indicators, with values ranging from 0 (weakest) to 10 (strongest).",
					'Trend Score Breakdown': "When a stock's Trend Score falls below 3, it indicates a weak market trend. This score aggregates ten trend-following indicators, with values ranging from 0 (weakest) to 10 (strongest).",
				},
				midTermMap: {
					'Symbol Close > its\' MA200 and Optix MA5 < 35':'Optix #1',
					'Symbol Close > its\' MA200 and Optix < 30':'Optix #2',
					'Optix MA10 < 30 and Optix < 20':'Optix #3',
					'Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35':'Optix #5',
					'Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35':'Optix #6',
					'Symbol Close > its\' MA200 and Optix > 43 After Below 30':'Optix #7'
				},
				pageSize: 10, // Default page size
    currentPage: 1, // Default current page

		}
	},
	computed: {
		// Filtered and paginated data to be displayed in the table
		paginatedData() {
			const startIndex = (this.currentPage - 1) * this.pageSize;
			const endIndex = startIndex + this.pageSize;
			// 当checkbox未勾选时，返回原始数据
			return this.data.content?.slice(startIndex, endIndex);
		},
	},
	watch: {
		checkboxGroupState: {
			handler(newValue, oldValue){
				this.data.content.map((item)=>{
					if(this.checkboxGroupState[item.id]){
						this.selectedStopLosses.push(item['StopLoss'])
						this.selectedProfitTargets.push(item['ProfitTarget'])
						this.selectedWinRates.push(item['WinRate'])
						this.selectedWinRates.push(item['ExpectedReturn'])
					}
				})
				this.calculateAlloc()
			},
			deep: true
		},
	},
	mounted() {
		// this.data.content.map((item,index)=>{
		// 		item['Alloc'] = ''
		// })	
	},
	methods: {
		handleSizeChange(size) {
			this.pageSize = size;
			this.currentPage = 1; // Reset to the first page when the page size changes
		},
		pageReset(){
			this.currentPage = 1; // Reset to the first page when the filter query sent
		},
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},

		selectSymbol(id, Symbol, subscribe, pt,sl,wr,rowIndex) {
			
			/* 
			只是起模拟作用，后续要上接口
			*/
			// subscribe = !subscribe
			if(subscribe) {
				this.selectedStopLosses.push(sl)
				this.selectedProfitTargets.push(pt)
				this.selectedWinRates.push(wr)
			}else {
				this.selectedStopLosses.pop(sl)
				this.selectedProfitTargets.pop(pt)
				this.selectedWinRates.pop(wr)
			}
			this.checkboxGroupState[id] = subscribe
			
			this.calculateAlloc()
		},
		changeTableSort(column) {
				const sortingOrder = column.order; // 排序方向
				const colName = column.prop; // 当前排序的列名
				
				this.data.content.sort((a, b) => {
						let valA = a[colName];
						let valB = b[colName];

						// 处理 null 或 undefined，确保不会报错
						if (valA == null) valA = '';
						if (valB == null) valB = '';

						// 1. **尝试转换为数字排序**
						const numA = parseFloat(valA);
						const numB = parseFloat(valB);
						const isNumA = !isNaN(numA) && typeof numA !== 'boolean';
						const isNumB = !isNaN(numB) && typeof numB !== 'boolean';

						if (isNumA && isNumB) {
								return sortingOrder === 'ascending' ? numA - numB : numB - numA;
						}

						// 2. **尝试解析 YYYY-MM-DD 日期**
						const dateA = Date.parse(valA);
						const dateB = Date.parse(valB);

						if (!isNaN(dateA) && !isNaN(dateB)) {
								return sortingOrder === 'ascending' ? dateA - dateB : dateB - dateA;
						}

						// 3. **字符串排序**
						return sortingOrder === 'ascending'
								? valA.toString().localeCompare(valB.toString(), 'en', { sensitivity: 'base' })
								: valB.toString().localeCompare(valA.toString(), 'en', { sensitivity: 'base' });
				});
		},
		scrollListner(){
			var outDiv = document.getElementsByClassName('el-table__body-wrapper');  
			
			for(let item of outDiv){
			item.onwheel = function(event){  
				
				//禁止事件默认行为（此处禁止鼠标滚轮行为关联到"屏幕滚动条上下移动"行为）  
				event.preventDefault();  
				//设置鼠标滚轮滚动时屏幕滚动条的移动步长  
				var step = 50;  
				if(event.deltaY < 0){  
					//向上滚动鼠标滚轮，屏幕滚动条左移  
					this.scrollLeft -= step;  
				} else {  
					//向下滚动鼠标滚轮，屏幕滚动条右移  
					this.scrollLeft += step;  
				}  
			}
			}
		},
		calculateAlloc(){			
			let slMean = this.selectedStopLosses.reduce((sum,value)=>{return Number(sum)+Number(value)},0)/this.selectedStopLosses.length
			let ptMean = this.selectedProfitTargets.reduce((sum,value)=>{return Number(sum)+Number(value)},0)/this.selectedProfitTargets.length
			let wrMean = this.selectedWinRates.reduce((sum,value)=>{return Number(sum)+Number(value)},0)/this.selectedWinRates.length*0.01

			let kellyTotal = ((ptMean+slMean)*wrMean-slMean)/ptMean
			this.data.content.map((item,index)=>{
				if(this.checkboxGroupState[item.id]){
					let kelly = kellyTotal*(item['WinRate']/Array.from(this.selectedWinRates).reduce((sum,value)=>{return Number(sum)+Number(value)},0))
					item['Alloc'] = (kelly*100).toFixed(2)
				}else{
					item['Alloc'] = ''
				}
			})
		},
		showPopup(item) {
			// 设置当前悬停的项
				const signalArr = 
				['MA', 'MAGap', 'MACDHist', 'MACDHistGap', 'Hammer followed by a rise', 'Shooting', 'UpTrend Pattern', 'DownTrend Pattern', 'Symbol Close > its\' MA200 and Optix MA5 < 35', 'Symbol Close > its\' MA200 and Optix < 30', 'Optix MA10 < 30 and Optix < 20', 'PriceBreakout', 'HighPoints', 'LowPoints', 'RSI', 
				'Head and Shoulders Top', 'Head and Shoulders Bottom', 'Double Top', 'Double Bottom', 'Triple Tap', 'Rounding Bottom', 'Ascending Channel', 'Descending Channel',
				'Symbol All-Time High','Symbol All-Time Low','Symbol 52-Week High','Symbol 52-Week Low','Symbol 4-Week High','Symbol 4-Week Low','Symbol 13-Week High','Symbol 13-Week Low','Trend Score Breakout','Trend Score Breakdown']
				if(signalArr.includes(item)) {
					this.currentItem = item;
					// 显示弹窗
					this.popupVisible = true;
				}else {
					this.popupVisible = false;
				}
		},
		hidePopup() {
			// 隐藏弹窗
			this.popupVisible = false;
		},
		exportTable() {
			console.log('this.data.content', this.data.content)
			const data = this.data.content
			const processedData = data.map(item => {
				return {
					'Date': item.Date,
					'Symbol': item.Symbol,
					'Close': item.Close,
					'Direction': item.Direction,
					'Signal': this.midTermMap[item._Signal] || item._Signal,
					'Win Rate(%)': `${item.WinRate}%`,
					'Stop Loss(%)': `${item.StopLoss}%`,
					'Profit Target(%)': `${item.ProfitTarget}%`,
					'Best Time In Market(Bars)': item.TimeInMarket,
					'Expected Return(%)': `${item.ExpectedReturn}%`,
				}
			})
			return processedData
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.iconfont {
	font-family: 'iconfont' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.table-label {
	margin: 20px 0;
}
.el-table /deep/ thead .iconfont{
	color: #606266;
}
.filterTableDes {
  padding: 0px 0px 20px 0px;
  margin: 0px;
  font-size: 16px;
  border-bottom: 2px solid #dddddd;
  .strongSpan {
    font-weight: 500;
  }
}
.CPM-list-container{
  padding: 20px;
}
.ScannerBTTable .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  /deep/ .el-form-item__label {
    width: 200px;
  }
}
</style>
