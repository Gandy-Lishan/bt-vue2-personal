<template>
  <header class="header">
			<p class="hint">
				Hint: Move cursor out of chart area to scroll down the page below
			</p>
			<!-- <el-row type="flex" justify="center"
					><el-col>
						<p class="betaNote">BacktestEdge Beta</p>
						<p class="hint">Hint: Move cursor out of chart area to scroll down the page below</p>
					</el-col>
				</el-row> -->
			<div class="chart_box" id="chart_box">
        <BTChart width="100%" height="100%" :onChartReady="onChartReady"></BTChart>  
			</div>
		</header>
</template>

<script>
import BTChart from "@/components/common/chart/index.vue"
import { LocalStorageUtil } from '@/utils'
import { CIQ } from '@/components/common/chart/st-development/js'

export default {
  name: 'BTHeader',
  components: {
    BTChart
  },
	mounted() {
		const chartBox = document.getElementsByClassName('chart_box')[0]
		console.log('chartBox', chartBox)   
    if (chartBox) chartBox.style.width = ''
	},
	methods: {
		async onChartReady() {
			debugger
      const _this = this
			let indicator = LocalStorageUtil.get('indicator')
      indicator = indicator.replace(/"/g, '');
      if(!indicator) return
      let indicatorList = LocalStorageUtil.get('indicatorList')
      const name = CIQ.findSentiIndicator(null, indicator)
      return
      // let newAllSymbolsList = []
      if(newAllSymbolsList.length == 0 || !newAllSymbolsList) {
        const resStocks = await getStocksList()
        let stocksList = resStocks.data
        const resIndexs = await getIndexsList()
        let indexsList = resIndexs.data
        const res = await getIndicatorsList()
		    let allSymbolsList = res.data
        for (var i = 0; i < allSymbolsList.length; i++) {
          let item = allSymbolsList[i]
          if (stocksList.find((j) => j.stock == item.url)) {
            let newName = item.url + ' Optix'
            newAllSymbolsList.push({
              chart_name: newName,
              url: item.url,
              updated: item.updated
            })
          } else {
            newAllSymbolsList.push(allSymbolsList[i])
          }
        }
      }
      // 根据 url 找出 updated 和 value
      const findSenti = (name,url) => {
        let signal
        if(name){
            signal = newAllSymbolsList.find((i) => {
                return i.chart_name == name
            })
        }
        if(url){
            signal = newAllSymbolsList.find((i) => {
                return i.url == url
            })
        }
        return signal
      }
      let senti = findSenti(null, indicator)
      console.log('sentisentisentisenti', senti)
      let value = senti.chart_name
      senti = {
        ...senti,
        value
      }
      await _this.$refs.entryChild.$refs.indiChild[0].handleSentimentSelect(senti)
      localStorage.removeItem('indicator')
      localStorage.removeItem('index')
    },
	}
}
</script>

<style lang="less" scoped>
// 暂时的样式
header {
	margin-bottom: 28px;
}
.header {
	img {
		width: 100%;
	}
	p {
		margin: 1rem 2rem 0rem 0rem;
		font-style: italic;
		color: #6c6c6c;
	}
	// p:first-of-type {
	// 	text-align: left;
	// 	font-size: 2.5rem;
	// 	margin: 0px;
	// 	font-weight: lighter;
	// 	color: #333333;
	// }
	background: url(../../../../assets/dots-blue.png);
}
.hint {
	// position: absolute;
	text-align: right;
	font-size: 0.8rem;
	color: black !important;
	bottom: -20px;
	right: 30px;
	font-weight: 300;
}
.chart_box {
	padding: 10px 10px;
	resize: auto;
	overflow: hidden;
	margin: 0 25px;
}
</style>