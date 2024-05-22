<template>
  <div class="CPMResults-container">
    <div class="portfolio-header">
      <!-- <h2 class="portfolio-title">Portfolio<i class="header-icon el-icon-info"></i></h2>
        <div class="portfolio-des">
        <p>
          This page provides a highlight of our Strategies. These strategies are based on multiple trading models,
          each with its own pros/cons. Some models have larger returns, while others have smaller drawdowns. Some models 
          perform better in trending markets, while others perform better in choppy markets. These models were created to account 
          for individual preferences, risk tolerance, etc. Ulti, the model that you want to use is up to you.
        </p>
        <p>
          In the table below, a 'yellow' highlight on the row signifies a change in signal.
        </p>
        <p>
          You can now subscribe to receive email notifications when a Strategy updates. Visit the <a href="https://users.sentimentrader.com/users/preferences/">
          preferences page</a> to subscribe to our Strategies emails.
        </p>
        </div> -->
      <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <p class="page-title">Portfolio</p><i class="header-icon el-icon-info"></i>
        </template>
        <div class="portfolio-des">
          <p>
          This page provides a highlight of our Strategies. These strategies are based on multiple trading models, each with its own pros/cons. 
          Some models have larger returns, while others have smaller drawdowns. Some models perform better in trending markets, while others perform better in choppy markets. These models were created to account for individual preferences, risk tolerance, etc. Ultimately, the model that you want to use is up to you.
        </p>
        <p>
          In the table below, a 'yellow' highlight on the row signifies a change in signal.
        </p>
        <p>
          You can now subscribe to receive email notifications when a Strategy updates. Visit the <a href="https://users.sentimentrader.com/users/preferences/">
          preferences page</a> to subscribe to our Strategies emails.
        </p>
        </div>
      </el-collapse-item>
    </el-collapse>
    </div>
    <el-collapse v-model="activeNames" :accordion="false" class="CPMResults-content">
      <el-collapse-item name="1" class="form">
        <template v-slot:title>
          <div class="title">
            <p @click.stop>Portfolio List</p>
          </div>
        </template>
        <div class="content">
            <ScannerBTTable ref="ScannerBTTable" @displayResultsData="displayResultsData"></ScannerBTTable>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" class="form">
        <template v-slot:title>
          <div class="title" ref="formTarget">
            <p @click.stop>Create new Portfolio</p>
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
          <div class="downLoadCsvBtn">
              <el-button
                @click.stop="() => {handleDownloadCsv()}"
                style="display: inline-block"
                type="primary"
                plain
                size="mini"
                icon="el-icon-download"
                >Export Data</el-button
              >
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
<script>
import Statistics from "./Statistics";
// import TIM from "./components/tim";
// import CorrInfo from "./components/corrInfo";
import Form from "./Form";
// import MaxMin from "../results/components/MaxMin";
import ScannerBTTable from "./Table";
import FilterTable from "./FilterTable";
import { isJson } from '@/utils';
const XLSX = require('xlsx');

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
      const {row: {status}} = data
      this.$refs['Form'].displayData(data)
      debugger
      this.activeSecondTab = 'summary'
      if(status !== 'finish' && status !== 'Finish') {
        this.scrollToTarget('formTarget', -200)
        this.clearResults()
        return
      }
      this.displaySummary(data)
      this.scrollToTarget('scrollTarget')
    },
    displaySummary(data) {
      debugger
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
    handleDownloadCsv() {
      const {summary, trade} = this.$refs.Statistics.handleDownloadCsv()
      const filterList = this.$refs.filterTable.exportTable()
      if (
        !(
          summary.length &&
          trade.length &
          filterList.length
        )
      ) {
        this.popUpMsgBox('No data available for download')
        return
      }
      const dataList = [ 
        filterList,
        summary,
        trade
      ]
      const sheetNames = [
        'Preview Filter List',
        'Summary',
        'Trades'
      ]
      this.exportDataToCSV(dataList, sheetNames)
    },
    exportDataToCSV(dataList, sheetNames) {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      for (let i = 0; i < dataList.length; i++) {
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataList[i])

        // Add the worksheet to the workbook with the given name
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[i])
      }

      // Convert the workbook to a binary string
      const workbookBinaryString = XLSX.write(workbook, {
        type: 'binary',
        bookType: 'xlsx'
      })
      // Create a Blob from the binary string
      const blob = new Blob([this.s2ab(workbookBinaryString)], {
        type: 'application/octet-stream'
      })

      // Create a download URL for the Blob
      const url = URL.createObjectURL(blob)

      // Create a link element for downloading the CSV file
      const link = document.createElement('a')
      link.style.display = 'none'
      link.setAttribute('href', url)
      link.setAttribute('download', 'Results.xlsx')
      link.innerHTML = 'Download XLSX'
      // Append the link element to the document body
      document.body.appendChild(link)

      // Trigger the download
      link.click()
    },
    // Utility function to convert a string to an ArrayBuffer
    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
  }
}
</script>

<style lang="less" scoped>
.CPMResults-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  margin: 50px auto auto auto;
  width: 80%;
  padding: 20px;
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
}

.portfolio-header {
  /deep/ .el-collapse-item__header {
    background-color: #fff;
  }
}
.title {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  font-weight: 300;
  color: #666;
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

.downLoadCsvBtn {
	position: absolute;
	right: 90px;
  margin-left: 10px;
	color: #333333;
}
.page-title {
  padding: 0 0 0 20px;
}
.portfolio-des {
  padding: 0 20px;
  font-weight: 400;
  font-size: 14px;
  color: #333;
}
</style>