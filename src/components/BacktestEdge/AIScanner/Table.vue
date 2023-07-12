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
						type="date"
						placeholder="Select Date"
						:picker-options="pickerOptions"
						@change="selectDate"
						value-format="yyyy-MM-dd"
					>
					</el-date-picker>
				</div>
				<div class="categoryBtnGroup">
					<template
						v-for="(item, index) in categories"
					>
						<el-button 
							:key="index" 
							:class="{ active: activeCategory === item }" 
							@click="selectCategory(item)">{{item}}
						</el-button>
					</template>
				</div>
			</div>

			<div class="header-part2">
				<!-- <template
					v-for="(item, index) in signalList"
				>
					<el-button 
						:key="index" 
						:class="{ active: activeSignal === item }" 
						@click="selectSignal(item)">{{item}}
					</el-button>
				</template> -->
				<el-checkbox-group v-model="activeSignal" @change="selectSignal">
						<el-checkbox-button v-for="item in signalList" :label="item" :key="item">{{item}}		
						<!-- <el-tooltip effect="dark" placement="bottom" v-model="popupVisible">
							<span slot="content" v-if="currentItem === 'MA'">
								Long: Symbol Close CrossAbove SMA20;<br/>
								Short: Symbol Close CrossBelow SMA20
							</span>
							<span slot="content" v-if="currentItem === 'MAGap'">
								Long: The difference between Symbol Close and SMA20 CrossAbove 0;<br/>
								Short: The difference between Symbol Close and SMA20 CrossBelow 0
							</span>
							<span slot="content" v-if="currentItem === 'MACDHist'">
								Long: The MACD CrossAbove Signal Line;<br/>
								Short: The MACD CrossBelow Signal Line
							</span>
							<span slot="content" v-if="currentItem === 'MACDHistGap'">
								Long: The difference between MACDHist and its previous day CrossAbove 0;<br/>
								Short: The difference between MACDHist and its previous day CrossBelow 0
							</span>
							<span slot="content" v-if="currentItem === 'Hammer'">
								Only Long: The day before the collection of a long shadow line, the next day closed up
							</span>
							<span slot="content" v-if="currentItem === 'Shooting'">
								Only Short: The day before a long upward thread, the next day closed down
							</span>
							<span slot="content" v-if="currentItem === 'UpTrend Pattern'">
								Only Long: Symbol Close trend upward
							</span>
							<span slot="content" v-if="currentItem === 'DownTrend Pattern'">
								Only Long: Symbol Close trend downward
							</span>
							<i class="el-icon-info" v-hover-popup="{ item: item }"></i></el-tooltip> -->
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
					<p v-show="currentItem === 'Hammer'">
						If the previous day's candlestick shows a long lower shadow,<br/>
						indicating support at the bottom,<br/>
						a buy signal is generated when the price rises above a certain threshold after the opening.
					</p>
					<p v-show="currentItem === 'Shooting'">
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
					<p v-show="currentItem === 'Idea'">
						we want stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35.
					</p>
					<p v-show="currentItem === 'Trend'">
						Optix indicators with a 10-day moving average > 70 and that day's Optix value is > 80.
					</p>
					<p v-show="currentItem === 'Exhaustion'">
						Optix indicators with a 10-day moving average > 70 and that day's Optix value is > 80.
					</p>
				</el-popover>
			</div>
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
						<el-form-item label="Signal">
							<span>{{ props.row['Signal']}}</span>
						</el-form-item>
						<el-form-item label="AVERAGE WIN %">
							<span>{{
								btInfo.find(x=>x.id==props.row['id'])
									?btInfo.find(x=>x.id==props.row['id'])['AvgWin']
									:''
								}}</span>
						</el-form-item>
						<el-form-item label="AVERAGE LOSS %">
							<span>{{
								btInfo.find(x=>x.id==props.row['id'])
									?btInfo.find(x=>x.id==props.row['id'])['AveLoss']
									:''
								}}</span>
						</el-form-item>
						<el-form-item label="TOTAL TRADES">
							<span>{{
								btInfo.find(x=>x.id==props.row['id'])
									?btInfo.find(x=>x.id==props.row['id'])['TradeNumber']
									:''
								}}</span>
						</el-form-item>
						<el-form-item label="TOTAL POSITIVE">
							<span>{{
								btInfo.find(x=>x.id==props.row['id'])
									?btInfo.find(x=>x.id==props.row['id'])['TotalPositive']
									:''
								}}</span>
						</el-form-item>
						<el-form-item label="TOTAL NEGATIVE">
							<span>{{
								btInfo.find(x=>x.id==props.row['id'])
									?btInfo.find(x=>x.id==props.row['id'])['TotalNegative']
									:''
								}}</span>
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
				date: this.data.Date,
				btnLoading: false,
				btInfo: [],
				
				checkboxGroupState: {},
				selectedStopLosses: [],
				selectedProfitTargets: [],
				selectedWinRates: [],

				categories: ['SwingAI','MidTermAI'],
				activeCategory:this.data.Category,

				signalList: [],
				activeSignal: [],

				tableData: [],
				popupVisible: false, // 弹窗可见性
    		popupContent: '', // 弹窗内容
				hoveredItem: null, // 悬停的元素
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
			const signalArr = ['MA', 'MAGap', 'MACDHist', 'MACDHistGap', 'Hammer', 'Shooting', 'UpTrend Pattern', 'DownTrend Pattern', 'Idea', 'Trend', 'Exhaustion']
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
			// only AI recommendation page can call this function
			if(this.data.label=="AI Portfolio") return
			if(expanded.find(x=>x.id == row.id)){
				let BacktestInfoContent = await getBacktestInfo({
					symbol: row['Symbol'],
					date: row['Date'],
					signal: row['Signal'],
					category: row['Category'],
				})
				this.btInfo.push({
					id: row['id'],
					WinRate:BacktestInfoContent['WinRate'],
					AvgWin:BacktestInfoContent['AvgWin'],
					AveLoss:BacktestInfoContent['AvgLoss'],
					TradeNumber:BacktestInfoContent['TradeNumber'],
					TotalPositive:Math.round((BacktestInfoContent['TradeNumber'] * BacktestInfoContent['WinRate']) / 100),
					TotalNegative:Math.round(BacktestInfoContent['TradeNumber'] - 
					(BacktestInfoContent['TradeNumber'] * BacktestInfoContent['WinRate']) / 100)
				})
			}
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
		const signalArr = ['MA', 'MAGap', 'MACDHist', 'MACDHistGap', 'Hammer', 'Shooting', 'UpTrend Pattern', 'DownTrend Pattern', 'Idea', 'Trend', 'Exhaustion']
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
		.categoryBtnGroup {
			margin-left: 50px;
			button {
				width: 180px;
				&.active {
				/* 高亮状态的样式 */
					color: #409EFF;
					border-color: #c6e2ff;
					background-color: #ecf5ff;	
				}
			}
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
