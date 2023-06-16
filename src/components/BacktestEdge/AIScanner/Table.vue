<template>
	<div>
		<!-- <link rel="stylesheet" href="../../../../assets/font/iconfont.css"></link> -->
		<div class="table-header">
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
		</div>
		<el-table
			ref="tableREF"
			class="aiscanner-table"
			:data="data.content"
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
						<el-form-item label="Win Rate(%)">
							<span>{{
								btInfo.find(x=>x.id==props.row['id'])
									?btInfo.find(x=>x.id==props.row['id'])['WinRate']
									:''
								}}</span>
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
						l != 'Symbol'
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
				selectedStopLosses: new Set(),
				selectedProfitTargets: new Set(),
				selectedWinRates: new Set(),
				btInfo: []
		}
	},
	watch: {
	},
	created() {
	},
	mounted() {
		this.calculateAlloc()
	},
	methods: {
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
					signal: row['Signal']
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
					this.data.content.sort((a,b) => {
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _b - _a
					})
				}else if(sortingOrder == 'ascending'){
					this.data.content.sort((a,b) => {
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _a - _b
					})
				}else{
				}
			}
			if(['Win Rate(%)'].indexOf(colName) !== -1){
				if(sortingOrder == 'descending'){
					this.data.content.sort((a,b) => {
						return b[colName] - a[colName]
					})
				}else if(sortingOrder == 'ascending'){
					this.data.content.sort((a,b) => {
						return a[colName] - b[colName]
					})
				}else{
				}
			}
		},
		selectDate(){
			this.$emit('selectDate', this.date)
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
			this.selectedStopLosses = this.data.content.map(item=>item['Stop Loss(%)'])
			this.selectedProfitTargets = this.data.content.map(item=>item['Profit Target(%)'])
			this.selectedWinRates = this.data.content.map(item=>item['Win Rate(%)'])
			let slMean = this.selectedStopLosses.reduce((sum,value)=>{return Number(sum)+Number(value)},0)/this.selectedStopLosses.length
			let ptMean = this.selectedProfitTargets.reduce((sum,value)=>{return Number(sum)+Number(value)},0)/this.selectedProfitTargets.length
			let wrMean = this.selectedWinRates.reduce((sum,value)=>{return Number(sum)+Number(value)},0)/this.selectedWinRates.length*0.01
			
			let kellyTotal = ((ptMean+slMean)*wrMean-slMean)/ptMean
			this.data.content.map((item,index)=>{
				let kelly = kellyTotal*(item['Win Rate(%)']/Array.from(this.selectedWinRates).reduce((sum,value)=>{return Number(sum)+Number(value)},0))
				item['Cash Alloc(%)'] = (kelly*100).toFixed(2)
			})
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
