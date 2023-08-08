<template>
	<div class="gridContainer">
		<el-card class="box-card">
<el-collapse class='collape-title'>
  <el-collapse-item>
    <template slot="title">
      Click here to view AI Stock Scanner Description<i class="header-icon el-icon-info"></i>
    </template>
    <h4>Our AI stock scanner is updated nightly by 11:40 PM Eastern Time. This system is designed to provide you with a list of stocks that have triggered a "Signal-for-Action", worthy of consideration for trading at the opening of the next market day. Currently, our system can scan the 1500 S&P stocks. We will announce when additional stocks from other market indices are included.</h4>
    <div>•	The system’s default setting displays the “end of today” shortlisting results. You can find historical results by selecting start and end dates from the past.</div>
	<div>•	Since our scan includes all stocks that trigger a signal, we've built a filter that sorts the list to show only "profit > stop loss"</div>
	<div>•	The list can also be filtered by entering a symbol or a specific signal for a specific day or period of time.</div>
	<div>•	In addition to the default display of key metrics, there's a dropdown menu for each stock that displays additional metrics.</div>
	<div>•	By clicking on the stock symbol, the system will direct you to detailed historical backtest results and a summary of key metrics for that stock. These backtest results ensure the reliability and accuracy of the "Signal-for-Action" list displayed by our system.</div>
  </el-collapse-item>
</el-collapse>
			
			<template
				v-for="(item, index) in tableDataList" 
			>
					<Table :data="item" :label="item.label" :key="index" :curDate="curDate" :tableCol="item.tableCol" @selectDate="selectDate" currTabPage="AIRecommendation">
					</Table>
			</template>
		</el-card>
	</div>
</template>

<script>
// import { getAIROBOT,getAIROBOTTemplate } from '@/api/app'
import { getAIPick } from '@/service/ai'

import Table from "./Table.vue";

export default {
  name: 'aiscanner',
	components: {
		Table
	},
  data() {
    return {
      tableDataList: [],
	  curDate: '',
	  
	  
    }
  },
  async created(){	
	this.curDate = this.$store.state.curDate

	//首先初始化数据
	this.loadData('US')
},
  methods: {
	async loadData(marketType){
		//this.activeIndex = index
		if(marketType=='US'){
			this.getAIPick([this.curDate,this.curDate])
		}
	},
	async getAIPick(date){
		if(!date) date = [this.curDate,this.curDate]
		this.tableDataList = []
		let AIPickContent = await getAIPick(date)
		
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
		AIPickObj['Date'] = date
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
		
		this.tableDataList.push(AIPickObj)
	},
	selectDate(date){
		this.getAIPick(date)
	},

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

</style>
