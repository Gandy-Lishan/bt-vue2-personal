<template>
  <div class="CPMResults-container">
    <div class="portfolio-header">
      <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <p class="page-title">Portfolio (click to expand)</p><i class="header-icon el-icon-info"></i>
        </template>
        <div class="portfolio-des">
          <p>
            Design, build, and analyze your custom investment portfolios. Select from various available strategies, assign specific weights to control allocation, and define your desired simulation period (start date, end date) along with the initial capital. Execute the simulation by clicking 'Run Portfolio'. The results provide a comprehensive overview, including key summary statistics, a detailed list of current holdings, and access to the performance and trade details for each individual strategy within the portfolio.
        </p>
        </div>
      </el-collapse-item>
    </el-collapse>
    </div>
    <el-collapse v-model="activeNames" :accordion="false" class="CPMResults-content">
      <el-collapse-item name="1" class="form">
        <template v-slot:title>
          <div class="title">
            <p>Portfolio List</p>
          </div>
        </template>
        <div class="content">
            <ScannerBTTable ref="ScannerBTTable" @displayResultsData="displayResultsData"></ScannerBTTable>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" class="form">
        <template v-slot:title>
          <div class="title" ref="formTarget">
            <p>Create new Portfolio</p>
            <p>
              <el-tooltip class="item" effect="dark" content="Create New Portfolio" placement="bottom-start">
                <el-button  type="warning" plain class="delete-btn" @click.stop="resetForm" size="small" icon="el-icon-plus">Create New</el-button>
              </el-tooltip>
            </p>
          </div>
        </template>
        <Form
         ref="Form"
         :parent-context="this"
         @changeSecondTab="changeSecondTab"
         @displayPreviewList="displayPreviewList" 
         @displayResultsAndFilter="displayResultsAndFilter" 
         @refreshBTList="refreshBTList" 
         @scrollToTarget="scrollToTarget" 
         @clearResults="clearResults">
        </Form>
      </el-collapse-item>
      <el-collapse-item name="3" class="form">
        <template v-slot:title>
          <div class="title" ref="scrollTarget">
            <p @click.stop="() => {changeSecondTab('summary')}" :class="{ secondActive: activeSecondTab == 'summary' || '' }">Summary</p>
            <template v-for="(item, index) in strategy_details">
            <p @click.stop="() => {changeSecondTab(`${item.model}_${index}`)}" :class="{ secondActive: activeSecondTab == `${item.model}_${index}` || '' }" :key="index">{{ item.model }}</p>
            </template>
          </div>
        </template>
        <!-- <CPMSummary ref="Summary"></CPMSummary> -->
        <Statistics v-show="activeSecondTab == 'summary'" ref="Statistics" :tradesData="tradesData"></Statistics>
        <div class="content">
          <template v-for="(ele, index) in strategy_details">
            <FilterTable v-show="activeSecondTab == `${ele.model}_${index}`"
            :data="ele" 
            :label="filterTableData.label" 
            :tableCol="filterTableData.tableCol" 
            :loading="loading"
            :key="index"
            ></FilterTable>
          </template>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import Statistics from "./Statistics";
import Form from "./Form";
import ScannerBTTable from "./Table";
import FilterTable from "./FilterTable";
import { isJson } from '@/utils';

export default {
  name: 'Portfolio',
  data() {
    return {
      activeNames: ['1', '2', '3'],
      activeTab: 'statistics',
      activeSecondTab: 'summary',
      tradeDate: {},
      tradePrice: 'Close',
      chart_data: {},
      breadcrumbTitle: 'Back to Correlation Pattern Match List',
      direction: 'Long',
      default_symbol: '',
      loading: false,
      tradesData: [],
      filterTableData: {
        content: [],
        label:'Filter Condition Preview',
        title: 'Filter Condition Preview',
        tableCol: [
          {label:'Date',value:'Date'},
          {label:'Symbol',value:'Symbol'},
          {label:'Close',value:'Close'},
          // {label:'Trend',value:'Market'},
          {label:'Direction',value:'Direction'},
          {label:'Signal',value:'_Signal'},
          {label:'Win Rate(%)',value:'WinRate'},
          {label:'Stop Loss(%)',value:'StopLoss'},
          {label:'Profit Target(%)',value:'ProfitTarget'},
          {label:'Best Time In Market(Bars)',value:'TimeInMarket'},
          //{label:'Cash Alloc(%)',value:'Alloc'},//'Cash Alloc(%)'
          {label:'Expected Return(%)',value:'ExpectedReturn'},
          // {label:'Z-Score',value:'Z_Score'},
        ]
      },
      strategy_details: []
    }
  },
  beforeRouteEnter(to, from, next) {
  if (from.path.includes('/strategy')) {
    next(async _this => {
      if (to.params.usedFor && to.params.usedFor === 'SetPortfolio') {
        const data = isJson(to?.params?.data) ? JSON.parse(to?.params?.data) : []
        if(!data || !data.length) return
        const _percent = Math.floor(100 / data.length) || 0
        const selectedStrategy = data.map(item => {return {...item, percent: _percent}})
        const strategy_combination = [{}, ...selectedStrategy]
        let totalWeight = 0
        for (const row of selectedStrategy) {
          totalWeight += parseFloat(row.percent) || 0
        }
        const percent = 100 - totalWeight
        _this.$nextTick(() => {
         _this.$refs['Form'].setPortfolio({strategy_combination, percent})
        })
      }
    })
    } else {
      next()
    }
  },
  components: {
    Form,
    ScannerBTTable,
    FilterTable,
    Statistics
  },
  methods: {
    changeTab(val) {
      this.activeTab = val
    },
    changeSecondTab(val) {
      this.activeSecondTab = val
      this.$nextTick(() => {
      this.activeSecondTab = val    
      })
    },
    scrollToTarget(refName, height=-80) {
      this.$nextTick(() => {
          const element = this.$refs[refName];
          const rect = element.getBoundingClientRect();
          const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
          const offset = rect.top + scrollPosition + height; // 往上滚动 200px
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });
        });
    },
    displayResultsAndFilter(data) {
      
      // 至展示 filter 和 result 不重新赋值 form
      this.activeSecondTab = 'summary'
      this.displaySummary(data)
      this.scrollToTarget('scrollTarget')
    },
    displayResultsData(data) {
      const {row: {status}, portfolio_details:statistics, strategy_details} = data
      this.$refs['Form'].displayData(data)
      this.activeSecondTab = 'summary'
      if(status !== 'finish' && status !== 'Finish') {
        this.scrollToTarget('formTarget', -200)
        this.clearResults()
        return
      }
      if(!statistics || !strategy_details) {this.popUpMessage('Portfolio is empty. Please adjust filters');this.scrollToTarget('formTarget', -200); this.clearResults(); return}
      this.displaySummary(data)
      this.scrollToTarget('scrollTarget')
    },
    displaySummary(data) {
      const {portfolio_details:statistics, strategy_details} = data
      const _result = isJson(data.portfolio_details.portfolio_details) ? JSON.parse(data.portfolio_details.portfolio_details) : data.portfolio_details.portfolio_details
      this.strategy_details = isJson(strategy_details) ? JSON.parse(strategy_details) : strategy_details
      this.tradesData = _result
      this.$nextTick(() => {
        this.$refs['Statistics'].displayData(statistics)
      })
    },
    displayPreviewList(content) {
      
      if(!content) return
		  this.loading = true
      this.$refs.filterTable.handleSizeChange(10)
      // 把数据处理成所需格式
       content.forEach(x => {
        x['Close'] = x['Close'].toFixed(2)
		  	// x['Alloc'] = (x['Alloc']*100).toFixed(0)
			  x['StopLoss'] = Number(x['StopLoss']).toFixed(2)
			  x['ProfitTarget'] = Number(x['ProfitTarget']).toFixed(2)
			  x['WinRate'] = Number(x['WinRate']).toFixed(2)
			  x['ExpectedReturn'] = Number(x['Expected Return(%)']).toFixed(2)
			  x['_Signal'] = x['Signal']
			  x['TimeInMarket'] = x['TimeInMarket']
       })
        this.filterTableData = {
          ...this.filterTableData,
          content
        }
		    this.loading = false
    },
    clearResults() {
        this.activeSecondTab = 'summary'
        this.$refs['Statistics'].displayData({})
        this.tradesData = []
        this.strategy_details = []
    },
    resetForm() {
      this.$nextTick(() => {
        const NoResetAllowed = this.$refs['Form'].resetForm()
        if(NoResetAllowed) return     
        this.clearResults()
      })
    },
    async refreshBTList() {
      await this.$refs['ScannerBTTable'].getDataList()
    },
  }
}
</script>

<style lang="less" scoped>
.CPMResults-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  // margin: 50px auto auto auto;
  // width: 80%;
  width: 100%;
  // padding: 20px;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  font-weight: 300;
  color: #666;
  position: relative;
  flex-wrap: wrap;
  height: auto;
}

.portfolio-header {
  /deep/ .el-collapse-item__header {
    height: 48px;
  }
}
.title {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  font-weight: 300;
  color: #333;
  flex-wrap: wrap;
}
.title p {
  padding: 0 20px;
  margin: 0;
}
.title p:hover {
  color: #428bca;
}
.secondActive {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}
.active {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}
.chart {
  background-color: inherit;
  margin-bottom: 20px;
}
/deep/ .el-collapse {
  border-top: unset;
  border-bottom: unset;
}
.page-title {
  margin: 0;
  padding: 0 5px 0 20px;
  color: #333;
}
.portfolio-des {
  padding: 0 20px;
  font-weight: 400;
  font-size: 14px;
  color: #333;
}
</style>