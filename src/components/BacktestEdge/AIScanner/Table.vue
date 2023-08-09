<template>
	<div>
		<!-- <link rel="stylesheet" href="../../../../assets/font/iconfont.css"></link> -->
		<el-table
			ref="tableREF"
			class="aiscanner-table"
			:data="paginatedData"
			:row-class-name="tableRowClassName"
			empty-text="No recommendation for today"
				v-loading="loading"
				:element-loading-text="loadTest"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
			@sort-change="changeTableSort"
			style="width: 100%; height: 100%"
		>
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<!-- <el-form-item label="Description">
							<span>{{ props.row.address }}</span>
						</el-form-item>
						<el-form-item label="Symbol Name">
							<span>{{ props.row.desc }}</span>
						</el-form-item> -->
						<!-- <el-form-item label="Signal">
							<span>{{ props.row['Signal']}}</span>
						</el-form-item> -->
						<el-form-item label="AVERAGE WIN %">
							<span>{{ props.row['AvgWin']}}	</span>
						</el-form-item>
						<el-form-item label="AVERAGE LOSS %">
							<span>{{ props.row['AvgLoss']}}	</span>
						</el-form-item>
						<el-form-item label="TOTAL TRADES">
							<span>{{ props.row['TradeNumber']}}</span>
						</el-form-item>
						<el-form-item label="TOTAL POSITIVE">
							<span>{{ Math.round((props.row['TradeNumber'] * props.row['WinRate']) / 100)}}</span>
						</el-form-item>
						<el-form-item label="TOTAL NEGATIVE">
							<span>{{ Math.round(props.row['TradeNumber'] - (props.row['TradeNumber'] * props.row['WinRate']) / 100)}}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<!-- :min-width="90" -->
			<template v-for="(l, index) in tableCol">
				<!-- :min-width="130" -->
				<el-table-column
					v-if="l.label == 'Select'"
					:label="l.label"
					:prop="l.value"
					:key="index"
				>
					<template slot-scope="scope">
						<el-checkbox
							v-model="scope.row.Subscribe"
							@change="
								selectSymbol(
									scope.row.id,
									scope.row.Symbol,
									scope.row.Subscribe,
									scope.row['ProfitTarget'],
									scope.row['StopLoss'],
									scope.row['WinRate'],
									scope.row['ExpectedReturn'],
									scope.$index
								)
							"
						></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column		
					v-if="l.label == 'Symbol'"
					:label="l.label"
					:prop="l.value"
					:key="index"
					min-width="70"
				>
					<template slot-scope="scope">
						<router-link
							:to="{
								path: '/home/scannerai/scannerai_chart',
								query: {
									stock: scope.row[l.value],
									id: 'test',
									rowData: JSON.stringify(scope.row)
								}
								
							}"
							>{{ scope.row[l.value] }}</router-link
						>
					</template>
				</el-table-column>
				<el-table-column		
					v-if="l.label == 'Trend'"
					:label="l.label"
					:prop="l.value"
					:key="index"
					min-width="90"
					:sortable="
						[
							'Trend'
						].indexOf(l.label) !== -1
							? 'custom'
							: false
					"
				>
						<template slot="header">
							Trend
							<el-tooltip effect="dark" placement="top" style="diaplay: inline">
							<span slot="content" v-html="textContent['Trend']">
							</span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column		
					v-if="l.label == 'Signal'"
					:label="l.label"
					:prop="l.value"
					:key="index"
					min-width="100"
					:sortable="
						[
							'Signal'
						].indexOf(l.label) !== -1
							? 'custom'
							: false
					"
				>
					<template slot-scope="scope">
						<!-- {{ scope.row.Signal }} -->
						<span>{{midTermMap[scope.row[l.value]]?midTermMap[scope.row[l.value]]:scope.row[l.value]}}</span>
						<el-tooltip effect="dark" placement="top" style="diaplay: inline">
							<span slot="content" v-html="textContent[scope.row[l.value]]">
							</span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column		
					v-if="l.label == 'Expected Return(%)'"
					:label="l.label"
					:prop="l.value"
					:key="index"
					min-width="90"
					:sortable="
						[
							'Expected Return(%)'
						].indexOf(l.label) !== -1
							? 'custom'
							: false
					"
				>
						<template slot="header">
							Expected Return(%)
							<el-tooltip effect="dark" placement="top" style="diaplay: inline">
							<span slot="content" v-html="textContent['ExpectedReturn']">
							</span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column
					v-if="
						l.label != 'Symbol' &&
						l.label != 'Select' &&
						l.label != 'Signal' &&
						l.label != 'Trend' &&
						l.label != 'Expected Return(%)'
					"
					:sortable="
						[
							'Stop Loss(%)',
							'Win Rate(%)',
							'Best Time In Market(Bars)',
							'Time In Market(Bars)',
							'Profit Target(%)',
							'Date',
							'Z-Score',
							'Expected Return(%)',
							'Close','Direction'
						].indexOf(l.label) !== -1
							? 'custom'
							: false
					"
					:label="l.label"
					:prop="l.value"
					:key="index"
					:min-width="[
							'Best Time In Market(Bars)',
							'Time In Market(Bars)',
							'Expected Return(%)'
						].indexOf(l.label) !== -1 ? '90' : '80'"
				>
					<template slot-scope="scope">
						<p class="tableText">
							{{ scope.row[l.value] }}
						</p>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:page-sizes="[10]"
		:page-size="pageSize"
		:total="data.content.length"
		layout="total, sizes, prev, pager, next, jumper"
		></el-pagination>
	</div>
</template>

<script>
import { getBacktestInfo } from '@/service/ai'
export default {
	name: 'Table',
	props: {
		data: Object,
		tableCol :Array,
		currTabPage: String,
		curDate: String,
		loading: Boolean,
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

				loadTest: 'Loading...',
				
				textContent: {
					'MA':"This strategy utilizes the crossover of closing prices and moving averages as trading signals.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining buy signals after a golden cross and sell signals after a death cross.",
					'MAGap':"This strategy determines trading signals by comparing the difference between the moving average of the current day and the previous day.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining buy signals after a golden cross and sell signals after a death cross.",
					'MACDHist':"This strategy uses the crossover signals of the MACD histogram as trading signals.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining buy signals after a golden cross and sell signals after a death cross.",
					'MACDHistGap':"This strategy determines trading signals by comparing the difference between the MACDHist and the previous day's value.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining buy signals after a golden cross and sell signals after a death cross.",
					'Hammer followed by a raise':"If the previous day's candlestick shows a long lower shadow,<br/>indicating support at the bottom,<br/>a buy signal is generated when the price rises above a certain threshold after the opening.",
					'Shooting Star followed by a fall':"If the previous day's candlestick shows a long upper shadow,<br/>indicating resistance at the top,<br/>a sell signal is generated when the price falls below a certain threshold after the opening.",
					'UpTrend Pattern':"When the price surpasses the upward trendline connecting the peak points of an uptrend,<br/>it indicates a potential future rise and generates a buy signal.",
					'DownTrend Pattern':"When the price falls below the downward trendline connecting the trough points of a downtrend,<br/>it indicates a potential future decline and generates a sell signal.",
					'Symbol Close > its\' MA200 and Optix MA5 < 35':"stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35.",
					'Symbol Close > its\' MA200 and Optix < 30':"stocks that are above their 200-day moving average with an Optix less than 30.",
					'Optix MA10 < 30 and Optix < 20':"Optix indicators with a 10-day moving average less than 30 and that day's Optix value is less than 20.",
					'PriceBreakout':"When the closing price of a stock ranks above 0 in relation to the closing prices of the past 21 trading days, <br/>a golden cross occurs, indicating an upward breakout and generating a buy signal. <br/>This suggests that the stock's price has entered a breakout phase and is likely to continue rising.",
					'HighPoints':"When the highest price of a stock ranks above 100 in relation to the highest prices of the<br/> past 13 trading days (higher stock prices correspond to higher rankings), <br/>it forms a 13-day new high and generates a buy signal. This indicates that <br/>the stock is experiencing a positive breakthrough and is in an upward trend.",
					'LowPoints':"When the lowest price of a stock ranks below 0 in relation to the lowest prices of the past 13 trading days, <br/>it forms a 13-day new low and generates a sell signal. <br/>This indicates that the stock is in a downtrend and can be shorted.",
					'RSI':"When the RSI indicator forms a golden cross above 40, it suggests that the indicator is about to<br/>recover from an oversold state to the midpoint, indicating a potential long entry signal. <br/>RSI can reflect whether a stock is in an overbought or oversold condition <br />but should be used in conjunction with the trend analysis.",
					'Trend': 'Closing price above the 252-day moving average is considered as Uptrend.<br/>Closing price below the 252-day moving average is considered as Downtrend.<br/>The whole backtest period is considered as ALL.',
					'ExpectedReturn': 'ExpectedReturn = (WinRate * ProfitTarget - (100.0 - WinRate) * StopLoss) / 100.0'
				},
				midTermMap: {
					'Symbol Close > its\' MA200 and Optix MA5 < 35':'Optix #1',
					'Symbol Close > its\' MA200 and Optix < 30':'Optix #2',
					'Optix MA10 < 30 and Optix < 20':'Optix #3'
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
	directives: {
		'hover-popup': {
			bind(el, binding, vnode) {
			el.addEventListener('mouseover', () => {
				// 显示弹窗
				vnode.context.showPopup(binding.value.item);
			});

			el.addEventListener('mouseleave', () => {
				// 隐藏弹窗
				vnode.context.hidePopup();
			});
					const signalArr = ['MA', 'MAGap', 'MACDHist', 'MACDHistGap', 'Hammer followed by a raise', 'Shooting', 'UpTrend Pattern', 'DownTrend Pattern', 'Symbol Close > its\' MA200 and Optix MA5 < 35', 'Symbol Close > its\' MA200 and Optix < 30', 'Optix MA10 < 30 and Optix < 20', 'PriceBreakout', 'HighPoints', 'LowPoints', 'RSI']
					if (!signalArr.includes(binding.value.item)) {
				// 隐藏元素
				el.style.display = 'none';
			}
			}
		}
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
		tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'dark-row';
			}
			return '';
		},
		changeTableSort(column){
			var sortingOrder = column.order
			var colName = column.prop
			// 数字字符串转数字类型排序
			if(['StopLoss','TimeInMarket','ProfitTarget'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.data.content.sort((a,b) => {
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _b - _a
					})
				}else if(sortingOrder == 'descending'){
					this.data.content.sort((a,b) => {
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _a - _b
					})
				}else{
				}
			}
			// 数字类型排序
			if(['WinRate', 'ExpectedReturn', 'Z_Score', 'Close'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.data.content.sort((a,b) => {
						return b[colName] - a[colName]
					})
				}else if(sortingOrder == 'descending'){
					this.data.content.sort((a,b) => {
						return a[colName] - b[colName]
					})
				}else{
				}
			}
			// 日期类型排序
			if(['Date'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.data.content.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.data.content.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
			// 字符串类型排序
			if(['Market','_Signal','Direction'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.data.content.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.data.content.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else{
				}
			}
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
				const signalArr = ['MA', 'MAGap', 'MACDHist', 'MACDHistGap', 'Hammer followed by a raise', 'Shooting', 'UpTrend Pattern', 'DownTrend Pattern', 'Symbol Close > its\' MA200 and Optix MA5 < 35', 'Symbol Close > its\' MA200 and Optix < 30', 'Optix MA10 < 30 and Optix < 20', 'PriceBreakout', 'HighPoints', 'LowPoints', 'RSI']
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


</style>
