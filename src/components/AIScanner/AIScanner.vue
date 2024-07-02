<template>
	<div class="gridContainer">
		<el-card class="box-card">
		<el-collapse class='collape-title'>
		<el-collapse-item>
			<template slot="title">
			Click here to view Smart Stock Scanner Description<i class="header-icon el-icon-info"></i>
			</template>
			<h4>Our Smart Stock Scanner is updated nightly by 11:40 PM Eastern Time. This system is designed to provide you with a list of stocks that have triggered a "Signal-for-Action", worthy of consideration for trading at the opening of the next market day. Currently, our system can scan the 1500 S&P stocks. We will announce when additional stocks from other market indices are included.</h4>
			<div>•	The system’s default setting displays the “end of today” shortlisting results. You can find historical results by selecting start and end dates from the past.</div>
			<div>•	Since our scan includes all stocks that trigger a signal, we've built a filter that sorts the list to show only "take profit > stop loss"</div>
			<div>•	The list can also be filtered by entering a symbol or a specific signal for a specific day or period of time.</div>
			<div>•	In addition to the default display of key metrics, there's a dropdown menu for each stock that displays additional metrics.</div>
			<div>•	By clicking on the stock symbol, the system will direct you to detailed historical backtest results and a summary of key metrics for that stock. These backtest results ensure the reliability and accuracy of the "Signal-for-Action" list displayed by our system.</div>
		</el-collapse-item>
		</el-collapse>
		<div class="table-header">
			<div class='header-part1'>
				<div class="tableLabel">
					<h4>Daily Picks at the end of today</h4>
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
					<h6>Today's pick will be completed by 11:40pm US Eastern Time .</h6>
					<el-input 
						placeholder="" 
						v-model="searchItem" 
						class="search"
						@input="handleQuery"
						clearable
						@clear="handleQuery"
					>
						<el-select v-model="searchCategory" slot="prepend" placeholder="Category" @change="handleQuery">
							<el-option
								v-for="category in categories"
								:key="category.value"
								:label="category.label"
								:value="category.value"
							></el-option>
						</el-select>
						<el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
					</el-input>
					<el-button v-show="is_admin" @click="toScannerBacktest" type="warning" round size="mini" style="float: right; margin: 20px 5px 0px 10px; cursor: pointer;"><i class="el-icon-arrow-left el-icon-s-promotion" style="margin-right: 5px;"></i>Smart Scanner Backtest</el-button>
					<el-button @click="exportTable" type="primary" round size="mini" style="float: right; margin-top: 20px;"><i class="el-icon-arrow-left el-icon-download" style="margin-right: 5px;"></i>Export table</el-button>
				</div>
			</div>
			<!-- 预留一个过滤器的div -->
			<div class="header-part2">
				<div class="filterBox">
					<el-checkbox v-model="isPLSChecked" @change="PLSChecked"
						>Only Show Profit Target > Stop Loss
					</el-checkbox>
					<!-- <el-checkbox v-model="isShowShortChecked" @change="ShowShortChecked"
						>Only Show Direction Is Short
					</el-checkbox> -->

					<label for="radioGroup" class="direction">Direction: </label>
					<el-radio-group id="radioGroup" v-model="isShowShortChecked" @change="ShowShortChecked">
						<el-radio :label='false'>Long</el-radio>
						<el-radio :label='true'>Short</el-radio>
					</el-radio-group>
				</div>
			</div>
		</div>
			<Table 
				:data="tableData" 
				:label="tableData.label" 
				:key="index" 
				:tableCol="tableData.tableCol" 
				currTabPage="AIRecommendation" 
				:loading="loading"
				ref="tableChild">
			</Table>
		</el-card>
	</div>
</template>

<script>

const throttle = require('lodash/throttle')
import { getAIPick } from '@/service/ai'
import { timestampToTime } from '@/utils'

import Table from "./Table.vue";

export default {
  name: 'scannerai',
	components: {
		Table
	},
  data() {
    return {
    originData: {},
	  tableData: {},
	  curDate: '',
	  
	//table filter:
	// date selector
	  date: [],
	  pickerOptions: {
		disabledDate: this.disabledDate,
	  },
	// search bar
	  searchItem: '', // 搜索关键词
	  searchCategory: "Symbol", // 存储选择的搜索类别
	  categories: [{label:'Symbol',value:'Symbol'},{label:'Signal',value:'_Signal'}],

	midTermMap: {
		'Symbol Close > its\' MA200 and Optix MA5 < 35':'Optix #1',
		'Symbol Close > its\' MA200 and Optix < 30':'Optix #2',
		'Optix MA10 < 30 and Optix < 20':'Optix #3',
	},
	isPLSChecked: false,
	isShowShortChecked: false,
	loading: false
    }
  },
  async created(){	
	// 进入组件时还原筛选条件状态
	const state = this.$store.getters.getScannerAIFilterState

	this.curDate = this.$store.state.chart.curDate
	this.date = state?.date || [this.curDate,this.curDate]

	this.searchItem = state?.searchItem || ''
	this.searchCategory = state?.searchCategory || 'Symbol'
	this.isPLSChecked = state?.isPLSChecked || false
	//首先初始化数据
	this.loadData('US')
},
	beforeDestroy() {
		// 离开此组件前保存筛选条件状态
		this.$store.dispatch('states/set_scannerai_filter_state',{
			searchItem:this.searchItem,
			searchCategory:this.searchCategory,
			isPLSChecked:this.isPLSChecked,
			date:this.date,
		})
	},
	computed: {
		is_admin() {
			return this.$store.state.user.is_admin
		}
	},
	watch: {
		// 数据源更新时tableData同时响应,只会在getAIPick时获取originData
		originData: {
			handler(newValue, oldValue){
				this.tableData = JSON.parse(JSON.stringify(this.originData))
				this.filterData()
			},
			deep: true
		}
	},
  methods: {
	scannerBacktest() {
	},
	// table filter*********
	disabledDate(time) {
		let dis = timestampToTime(time) > this.curDate || (time.getDay() === 0 || time.getDay() === 6)
		return dis
	},

	handleQuery: throttle(function () { this.filterData() }, 500),
	filterData(){
		this.tableData.content = this.filterShowShortCondition(this.filterPLSCondition(this.getSearchresult()))
		this.$refs.tableChild.pageReset()
	},
	filterPLSCondition(searchResult){
		if (this.isPLSChecked) {
			// 当checkbox勾选时，返回被筛选过的数据
			return searchResult
					.filter(item=>parseFloat(item["ProfitTarget"])>parseFloat(item['StopLoss']));
		}
		return searchResult
	},
	filterShowShortCondition(searchResult){
		if (this.isShowShortChecked) {
			// 当checkbox勾选时，返回被筛选过的数据
			return searchResult
					.filter(item=>item["Direction"] == 'Short');
		}
		return searchResult.filter(item=>item["Direction"] == 'Long');
	},
	getSearchresult(){
		if(this.searchItem){
			// 在搜索之前对搜索关键词进行转义
			const trimmedStr = this.searchItem.trim()
			const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");
			return this.originData.content.filter(item => {
				let searchTarget = this.midTermMap[item[this.searchCategory]]?this.midTermMap[item[this.searchCategory]]:item[this.searchCategory]
				return regex.test(searchTarget)
			});
			//this.tableData.content = this.data.content.filter(item=>item[this.searchCategory].toLowerCase().indexOf(this.searchItem.toLowerCase())!=-1)
		}else{
			return this.originData.content
		}
	},
	// 使用反斜杠转义特殊字符
	escapeRegExp(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	},
	PLSChecked(){
		this.handleQuery()
	},
	ShowShortChecked(){
		this.handleQuery()
	},
    //**************table filter


	async loadData(marketType){
		//this.activeIndex = index
		if(marketType=='US'){
			this.getAIPick()
		}
	},
	async getAIPick(){
		this.loading = true
		let AIPickContent = await getAIPick(this.date || [this.curDate,this.curDate])
		
		// let AIPickContentString = JSON.stringify(AIPickContent)
		// 						.replace(/TimeInMarket/g,'Best Time In Market(Bars)')
		// 						.replace(/_Signal/g,'Signal')
		// 						.replace(/Alloc/g,'Cash Alloc(%)')
		// 						.replace(/StopLoss/g,'Stop Loss(%)')
		// 						.replace(/ProfitTarget/g,'Profit Target(%)')
		// 						.replace(/WinRate/g,'Win Rate(%)')
		// 						.replace(/Z_Score/g,'Z-Score')
		// 						.replace(/ExpectedReturn/g,'Expected Return(%)')

		// AIPickContent = JSON.parse(AIPickContentString)	
		AIPickContent.forEach(x=>{
			x['Close'] = x['Close'].toFixed(2)
			x['Alloc'] = (x['Alloc']*100).toFixed(0)
			x['StopLoss'] = Number(x['StopLoss']).toFixed(2)
			x['ProfitTarget'] = Number(x['ProfitTarget']).toFixed(2)
			x['WinRate'] = Number(x['WinRate']).toFixed(2)
			x['ExpectedReturn'] = Number(x['ExpectedReturn']).toFixed(2)
			// 给一些定值默认值
			//x['Timing To Entry'] = 'Open'
		})
		let AIPickObj = {}

		AIPickObj['label'] = 'AI Picks at the end of today'
		AIPickObj['title'] = 'AI Picks at the end of today'
		AIPickObj['tableCol'] = [
			{label:'Date',value:'Date'},
			{label:'Symbol',value:'Symbol'},
			{label:'Close',value:'Close'},
			{label:'Trend',value:'Market'},
			{label:'Direction',value:'Direction'},
			{label:'Signal',value:'_Signal'},
			{label:'Win Rate(%)',value:'WinRate'},
			{label:'Stop Loss(%)',value:'StopLoss'},
			{label:'Profit Target(%)',value:'ProfitTarget'},
			{label:'Best Time In Market(Bars)',value:'TimeInMarket'},
			//{label:'Cash Alloc(%)',value:'Alloc'},//'Cash Alloc(%)'
			{label:'Expected Return(%)',value:'ExpectedReturn'},
			{label:'Z-Score',value:'Z_Score'}, // 数据有误，先不显示	
		]
		// 测试
		//AIPickObj['tableCol'].unshift("Select")
		AIPickObj['content'] = AIPickContent
		
		this.originData = AIPickObj

		if(!this.date) this.date = [this.curDate,this.curDate]
		
		this.loading = false
	},
	selectDate(){
		this.getAIPick()
	},
	exportTable() {
		this.$refs.tableChild.exportTable()
	},
	toScannerBacktest() {
		this.$router.push({path: '/scannerai/backtest'})
	}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.gridContainer {
	display: grid;
	grid-template-columns: 100%;

	min-width: 65vw;
	background: #f9fafb;
	padding: 50px 50px;
}

h4 {
	color: #2d3a4b;
}

.gridContainer,.box-card {
	height: fit-content;
	box-shadow: unset;
	border: unset;
}

.collape-title {
	margin-bottom: 20px;
}

.direction {
	font-weight: 500;
    color: #606266;
    margin: 0 10px 0 20px;
}

// filter
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
.el-popper[x-placement^=right] .popper__arrow::after{
	border-right-color: aqua;
}
/deep/ .el-range-editor.el-input__inner{
	margin: 0;
	width: 100%;
}
.longShortLine{
	text-align: center;
	color: #606266;
	font-weight: 600;
}
</style>
