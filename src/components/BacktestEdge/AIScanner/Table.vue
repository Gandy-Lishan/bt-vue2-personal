<template>
	<div>
		<!-- <link rel="stylesheet" href="../../../../assets/font/iconfont.css"></link> -->
		<div class="table-header">
			<div class='header-part1'>
				<div class="tableLabel">
					<h4>AI Picks at the end of today</h4>
					<el-date-picker
						v-model="date"
						class="aiscanner-date"
						type="daterange"
						unlink-panels
						range-separator="to"
						start-placeholder="Start date"
						end-placeholder="End date"
						:picker-options="pickerOptions"
						@change="selectDate"
						value-format="yyyy-MM-dd"
					>
					</el-date-picker>

				</div>

				<div class="searchBox">
					<el-input 
						placeholder="" 
						v-model="searchItem" 
						class="search"
						@keyup.enter.native="handleQuery"
						clearable
						@clear="handleQuery"
					>
						<el-select v-model="searchCategory" slot="prepend" placeholder="Category">
							<el-option
								v-for="category in categories"
								:key="category.value"
								:label="category.label"
								:value="category.label"
							></el-option>
						</el-select>
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</div>
				<!-- swingai & midterm分类组被弃用了 -->
				<!-- <div class="categoryBtnGroup">
					<template
						v-for="(item, index) in categories"
					>
						<el-button 
							:key="index" 
							:class="{ active: activeCategory === item }" 
							@click="selectCategory(item)">{{item}}
						</el-button>
					</template>
				</div> -->
			</div>

			<!-- signal 按钮标签被弃用了 -->
			<!-- <div class="header-part2">
				<el-checkbox-group v-model="activeSignal" @change="selectSignal">
						<el-checkbox-button v-for="item in signalList" :label="item" :key="item">{{item}}		
							<i class="el-icon-info" v-hover-popup="{ item: item }"></i>
						</el-checkbox-button>
				</el-checkbox-group>
				<el-popover v-model="popupVisible" trigger="manual">
					<p v-show="currentItem === 'MA'">
						This strategy utilizes the crossover of closing prices and moving averages as trading signals.<br/>
						It can further specify the direction of trades and operating rules,<br/>
						such as determining buy signals after a golden cross and sell signals after a death cross.
					</p>
					<p v-show="currentItem === 'MAGap'">
						This strategy determines trading signals by comparing the difference between the moving average of the current day and the previous day.<br/>
						It can further specify the direction of trades and operating rules,<br/>
						such as determining buy signals after a golden cross and sell signals after a death cross.
					</p>
					<p v-show="currentItem === 'MACDHist'">
						This strategy uses the crossover signals of the MACD histogram as trading signals.<br/>
						It can further specify the direction of trades and operating rules,<br/>
						such as determining buy signals after a golden cross and sell signals after a death cross.
					</p>
					<p v-show="currentItem === 'MACDHistGap'">
						This strategy determines trading signals by comparing the difference between the MACDHist and the previous day's value.<br/>
						It can further specify the direction of trades and operating rules,<br/>
						such as determining buy signals after a golden cross and sell signals after a death cross.
					</p>
					<p v-show="currentItem === 'Hammer followed by a raise'">
						If the previous day's candlestick shows a long lower shadow,<br/>
						indicating support at the bottom,<br/>
						a buy signal is generated when the price rises above a certain threshold after the opening.
					</p>
					<p v-show="currentItem === 'Shooting Star followed by a fall'">
						If the previous day's candlestick shows a long upper shadow,<br/>
						indicating resistance at the top,<br/>
						a sell signal is generated when the price falls below a certain threshold after the opening.
					</p>
					<p v-show="currentItem === 'UpTrend Pattern'">
						When the price surpasses the upward trendline connecting the peak points of an uptrend,<br/>
						it indicates a potential future rise and generates a buy signal.
					</p>
					<p v-show="currentItem === 'DownTrend Pattern'">
						When the price falls below the downward trendline connecting the trough points of a downtrend,<br/>
						it indicates a potential future decline and generates a sell signal.
					</p>
					<p v-show="currentItem === 'Symbol Close > its\' MA200 and Optix MA5 < 35'">
						we want stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35.
					</p>
					<p v-show="currentItem === 'Symbol Close > its\' MA200 and Optix < 30'">
						we want stocks that are above their 200-day moving average with an Optix less than 30.
					</p>
					<p v-show="currentItem === 'Optix MA10 < 30 and Optix < 20'">
						Optix indicators with a 10-day moving average less than 30 and that day's Optix value is less than 20.
					</p>
					<p v-show="currentItem === 'PriceBreakout'">
						When the closing price of a stock ranks above 0 in relation to the closing prices of the past 21 trading days, <br/>
						a golden cross occurs, indicating an upward breakout and generating a buy signal. <br/>
						This suggests that the stock's price has entered a breakout phase and is likely to continue rising.
					</p>
					<p v-show="currentItem === 'HighPoints'">
						When the highest price of a stock ranks above 100 in relation to the highest prices of the<br/> 
						past 13 trading days (higher stock prices correspond to higher rankings), <br/>
						it forms a 13-day new high and generates a buy signal. This indicates that <br/>
						the stock is experiencing a positive breakthrough and is in an upward trend.
					</p>
					<p v-show="currentItem === 'LowPoints'">
						When the lowest price of a stock ranks below 0 in relation to the lowest prices of the past 13 trading days, <br/>
						it forms a 13-day new low and generates a sell signal. <br/>
						This indicates that the stock is in a downtrend and can be shorted.
					</p>
					<p v-show="currentItem === 'RSI'">
						When the RSI indicator forms a golden cross above 40, it suggests that the indicator is about to<br/>
					  recover from an oversold state to the midpoint, indicating a potential long entry signal. <br/>
						RSI can reflect whether a stock is in an overbought or oversold condition <br />
						but should be used in conjunction with the trend analysis.
					</p>
				</el-popover>
			</div> -->
		</div>
		<el-table
			ref="tableREF"
			class="aiscanner-table"
			:data="tableData.content"
			:row-class-name="tableRowClassName"
			empty-text="No recommendation for today"
			@sort-change="changeTableSort"
			@expand-change="changeExpand"
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
							<span>{{ Math.round((props.row['TradeNumber'] * props.row['Win Rate(%)']) / 100)}}</span>
						</el-form-item>
						<el-form-item label="TOTAL NEGATIVE">
							<span>{{ Math.round(props.row['TradeNumber'] - (props.row['TradeNumber'] * props.row['Win Rate(%)']) / 100)}}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<!-- :min-width="90" -->
			<template v-for="(l, index) in tableCol">
				<!-- :min-width="130" -->
				<el-table-column
					v-if="l == 'Select'"
					:label="l"
					:prop="l"
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
									scope.row['Profit Target(%)'],
									scope.row['Stop Loss(%)'],
									scope.row['Win Rate(%)'],
									scope.$index
								)
							"
						></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column		
					v-if="l == 'Symbol'"
					:label="l"
					:prop="l"
					:key="index"
					min-width="120"
				>
					<template slot-scope="scope">
						<router-link
							:to="{
								path: '/home/scannerai/scannerai_chart',
								query: {
									stock: scope.row.Symbol,
									id: 'test',
									rowData: JSON.stringify(scope.row)
								}
								
							}"
							>{{ scope.row.Symbol }}</router-link
						>
					</template>
				</el-table-column>
				<el-table-column
					v-if="
						l != 'Symbol' &&
						l != 'Select'
					"
					:sortable="
						[
							'Stop Loss(%)',
							'Win Rate(%)',
							'Best Time In Market(Bars)',
							'Time In Market(Bars)',
							'Profit Target(%)'
						].indexOf(l) !== -1
							? 'custom'
							: false
					"
					:label="l"
					:prop="l"
					:key="index"
					min-width="120"
				>
					<template slot-scope="scope">
						<p class="tableText">
							{{ scope.row[l] }}
						</p>
					</template>
				</el-table-column>
			</template>
		</el-table>
	</div>
</template>

<script>
import { timestampToTime } from '@/tools/formatDate.js'
const throttle = require('lodash/throttle')
import { getBacktestInfo } from '@/service/ai'
export default {
	name: 'Table',
	props: {
		data: Object,
		tableCol :Array,
		currTabPage: String,
		curDate: String
	},
	data() {
		return {
				pickerOptions: {
					disabledDate: this.disabledDate
				},
				date: [this.data.Date,this.data.Date],
				btnLoading: false,
				btInfo: [],
				
				checkboxGroupState: {},
				selectedStopLosses: [],
				selectedProfitTargets: [],
				selectedWinRates: [],

				activeCategory:this.data.Category,

				signalList: [],
				activeSignal: [],

				tableData: [],
				popupVisible: false, // 弹窗可见性
    			popupContent: '', // 弹窗内容
				hoveredItem: null, // 悬停的元素

				searchItem: '', // 搜索关键词
				searchCategory: "", // 存储选择的搜索类别
				categories: [{label:'Symbol',value:'Symbol'},{label:'Signal',value:'Signal'}]
		}
	},
	watch: {
		checkboxGroupState: {
			handler(newValue, oldValue){
				this.data.content.map((item)=>{
					if(this.checkboxGroupState[item.id]){
						this.selectedStopLosses.push(item['Stop Loss(%)'])
						this.selectedProfitTargets.push(item['Profit Target(%)'])
						this.selectedWinRates.push(item['Win Rate(%)'])
					}
				})
				this.calculateAlloc()
			},
			deep: true
		},
		data: {
			handler(newValue, oldValue){
				this.tableData = JSON.parse(JSON.stringify(this.data))
				this.signalList = [...new Set(this.data.content.map(item=>item.Signal))]
				console.log('signalList', this.signalList)
			},
			deep: true
		}
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
	created() {
	},
	mounted() {
		this.data.content.map((item,index)=>{
				item['Cash Alloc(%)'] = ''
		})	
	},
	methods: {
		handleQuery: throttle(function () { this.getSearchresult() }, 500),
		getSearchresult(){
			console.log(this.searchItem,this.searchCategory)
		},
		selectSignal(signal){	
			if(signal.length>1){
				signal.shift()
			}
			console.log('signal', signal)
			if(signal.length!=0){
				this.tableData.content = this.data.content.filter(item=>item.Signal == signal)
			}else{
				this.tableData.content = this.data.content
			}
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
		disabledDate(time) {
			let dis = timestampToTime(time) > this.curDate || (time.getDay() === 0 || time.getDay() === 6)
			return dis
		},
		tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'dark-row';
			}
			return '';
		},
		async changeExpand(row, expanded){
			// // only AI recommendation page can call this function
			// if(this.data.label=="AI Portfolio") return
			// if(expanded.find(x=>x.id == row.id)){
			// 	console.log(this.tableData.content,expanded,row)
			// 	let BacktestInfoContent = await getBacktestInfo({
			// 		symbol: row['Symbol'],
			// 		date: row['Date'],
			// 		signal: row['Signal'],
			// 		category: row['Category'],
			// 	})
			// 	this.btInfo.push({
			// 		id: row['id'],
			// 		WinRate:BacktestInfoContent['WinRate'],
			// 		AvgWin:BacktestInfoContent['AvgWin'],
			// 		AveLoss:BacktestInfoContent['AvgLoss'],
			// 		TradeNumber:BacktestInfoContent['TradeNumber'],
			// 		TotalPositive:Math.round((BacktestInfoContent['TradeNumber'] * BacktestInfoContent['WinRate']) / 100),
			// 		TotalNegative:Math.round(BacktestInfoContent['TradeNumber'] - 
			// 		(BacktestInfoContent['TradeNumber'] * BacktestInfoContent['WinRate']) / 100)
			// 	})
			// }
		},
		changeTableSort(column){
			var sortingOrder = column.order
			var colName = column.prop

			if(['Stop Loss(%)','Best Time In Market(Bars)','Profit Target(%)'].indexOf(colName) !== -1){
				if(sortingOrder == 'descending'){
					this.tableData.content.sort((a,b) => {
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _b - _a
					})
				}else if(sortingOrder == 'ascending'){
					this.tableData.content.sort((a,b) => {
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _a - _b
					})
				}else{
				}
			}
			if(['Win Rate(%)'].indexOf(colName) !== -1){
				if(sortingOrder == 'descending'){
					this.tableData.content.sort((a,b) => {
						return b[colName] - a[colName]
					})
				}else if(sortingOrder == 'ascending'){
					this.tableData.content.sort((a,b) => {
						return a[colName] - b[colName]
					})
				}else{
				}
			}
		},
		selectDate(){
			this.$emit('selectDate', this.date,this.activeCategory)
		},
		selectCategory(cate){
			this.activeCategory = cate
			this.$emit('selectDate', this.date,this.activeCategory)
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
					let kelly = kellyTotal*(item['Win Rate(%)']/Array.from(this.selectedWinRates).reduce((sum,value)=>{return Number(sum)+Number(value)},0))
					item['Cash Alloc(%)'] = (kelly*100).toFixed(2)
				}else{
					item['Cash Alloc(%)'] = ''
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
h4 {
	color: #2d3a4b;
}
.iconfont {
	font-family: 'iconfont' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.submitBtn .el-button {
	float: right;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
}
.table-label {
	margin: 20px 0;
}
.table-header {
	margin-bottom: 10px;
	
	.header-part1{
		display: flex;
		align-items: end;
		justify-content: space-between;
		// .categoryBtnGroup {
		// 	margin-left: 50px;
		// 	button {
		// 		width: 180px;
		// 		&.active {
		// 		/* 高亮状态的样式 */
		// 			color: #409EFF;
		// 			border-color: #c6e2ff;
		// 			background-color: #ecf5ff;	
		// 		}
		// 	}
		// }
		.searchBox {
			margin-left: 50px;
		}
	}
	.header-part2{
		margin-top: 20px;
	}
}
.admin-link {
	position: absolute;
	top: 15px;
	left: 185px;
}
.end-date {
	margin-left: 20px;
}

// mobile
@media only screen and (max-width: 992px) {
	.table-header {
		display: flex;
		align-items: flex-end;
		> :nth-child(1) {
			flex: 1;
			.el-input {
				width: 100%;
			}
		}
		> :nth-child(2) {
			flex: 1;
			margin-left: 8px;
			button {
				width: fit-content;
				height: 4rem;
				border-radius: 8px;
			}
		}
	}
}


</style>
