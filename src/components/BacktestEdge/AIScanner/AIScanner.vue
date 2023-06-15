<template>
	<div class="gridContainer">
		<el-card class="box-card">
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
	  curDate: ''
    }
  },
  async created(){	
	this.curDate = this.$store.state.curDate

	//首先初始化数据
	this.loadData('US')
},
  methods: {
	async loadData(marketType){
		if(marketType=='US'){
			this.getAIPick(this.curDate)
		}
	},
	async getAIPick(date){
		this.tableDataList = []
		let AIPickContent = await getAIPick(date)
		let AIPickContentString = JSON.stringify(AIPickContent)
								.replace(/TimeInMarket/g,'Best Time In Market(Bars)')
								.replace(/_Signal/g,'Signal')
								.replace(/Alloc/g,'Cash Alloc(%)')
								.replace(/StopLoss/g,'Stop Loss(%)')
								.replace(/ProfitTarget/g,'Profit Target(%)')
								.replace(/WinRate/g,'Win Rate(%)')

		AIPickContent = JSON.parse(AIPickContentString)	
		AIPickContent.forEach(x=>{
			x['Close'] = x['Close'].toFixed(2)
			x['Cash Alloc(%)'] = (x['Cash Alloc(%)']*100).toFixed(0)
			x['Stop Loss(%)'] = Number(x['Stop Loss(%)']).toFixed(2)
			x['Profit Target(%)'] = Number(x['Profit Target(%)']).toFixed(2)
			x['Win Rate(%)'] = Number(x['Win Rate(%)']).toFixed(2)

			// 给一些定值默认值
			x['Timing To Entry'] = 'Open'
		})
		let AIPickObj = {}

		AIPickObj['label'] = 'AI Picks at the end of today'
		AIPickObj['title'] = 'AI Picks at the end of today'
		AIPickObj['Date'] = date
		AIPickObj['tableCol'] = [
			'Symbol',
			'Close',
			'Direction',
			'Timing To Entry',
			//'Signal',
			'Win Rate(%)',
			'Stop Loss(%)',
			'Profit Target(%)',
			'Best Time In Market(Bars)',
			'Cash Alloc(%)'
		]

		// 如果是当天，则添加勾选栏
		// 测试
		
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
}

h4 {
	color: #2d3a4b;
}

.gridContainer,.box-card {
	height: fit-content
}
</style>
