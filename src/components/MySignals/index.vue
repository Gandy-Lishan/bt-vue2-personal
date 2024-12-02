<template>
  <div class="CPMResults-container">
      <el-collapse accordion  class="header">
      <el-collapse-item>
        <template slot="title">
          <div class="title">
            <p>My signal (click to expand)</p><i class="header-icon el-icon-info"></i>
          </div>
        </template>
        <div class="portfolio-des">
          <p>
            My Signal is a convenient trading signals platform that provides customized trading signals through a variety of conditions to meet the needs of different users.
          </p>
          <p>
            In the table below, when a row is highlighted in “yellow”, it indicates a change in that trading signal.
          </p>
          <p>
            You can now subscribe to our service to receive email notifications when signals are updated. Please visit our Preferences page to subscribe to My Signal's trading signals emails.
          </p>
        </div>
      </el-collapse-item>
      </el-collapse>
    <el-collapse v-model="activeNames" :accordion="false" class="CPMResults-content">
      <el-collapse-item name="1" class="form">
        <template v-slot:title>
          <div class="title" ref="scrollTargetTable">
            <p @click.stop="() => {changeSecondTab('MySignal')}" :class="{ secondActive: activeSecondTab == 'MySignal' || '' }">My Signals List</p>
            <p @click.stop="() => {changeSecondTab('Sample')}" :class="{ secondActive: activeSecondTab == 'Sample' || '' }">Sample Signals List</p>
          </div>
        </template>
        <div class="content">
          <SignalsTable 
            v-show="activeSecondTab === 'MySignal'"
            currentPageTab="MySignal"
            ref="SignalsTable"
            @changeSecondTab="changeSecondTab"
            @displayResultsData="displayResultsData"
            @refreshBTList="refreshBTList"
          ></SignalsTable>
          <SignalsTable 
            v-show="activeSecondTab === 'Sample'"
            currentPageTab="Sample"
            ref="SampleTable"
            @changeSecondTab="changeSecondTab"
            @displayResultsData="displayResultsData" 
          ></SignalsTable>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" class="form">
        <template v-slot:title>
          <div class="title" ref="scrollTarget">
            <p @click.stop>Create New Signal</p>
          </div>
        </template>
        <ScannerForm
         ref="ScannerForm"
         :size="'small'"
         :parent-context="this"
         @changeSecondTab="changeSecondTab"
         @refreshBTList="refreshBTList" 
         @scrollToTarget="scrollToTarget" 
         @clearResults="clearResults"
         >
        </ScannerForm>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
<script>
import ScannerForm from "./ScannerForm";
import SignalsTable from "./Table";
import Trades from "./Trades";
import { saveMySignalForm } from '@/service/service';
import { isJson } from "@/utils"
const XLSX = require('xlsx');

export default {
  name: 'MySignals',
  data() {
    return {
      activeNames: ['1', '2', '3'],
      activeTab: 'statistics',
      activeSecondTab: 'MySignal',
      tradeDate: {},
      tradePrice: 'Close',
      chart_data: {},
      breadcrumbTitle: 'Back to Correlation Pattern Match List',
      direction: 'Long',
      default_symbol: '',
      loading: false,
      tradesData: [],
      midTermMap: {
        'Symbol Close > its\' MA200 and Optix MA5 < 35':'Optix #1',
        'Symbol Close > its\' MA200 and Optix < 30':'Optix #2',
        'Optix MA10 < 30 and Optix < 20':'Optix #3',
        'Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35':'Optix #5',
        'Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35':'Optix #6',
        'Symbol Close > its\' MA200 and Optix > 43 After Below 30':'Optix #7',
      },
      signalTableInfo: {
        loading: false,
        pageSize: 10,
        total: 0,
        tableCol: [
          {
            label: 'Name',
            value: 'name',
            key: 'name'
          },
          {
            label: 'Symbol',
            value: 'symbol',
            key: 'symbol'
          },
          {
            label: 'Timeframe',
            value: 'timeframe',
            key: 'timeframe'
          },
          {
            label: 'Signal',
            value: 'description',
            key: 'description',
            minWidth: '200px' 
          },
          {
            label: 'Last Signal Date',
            value: 'last_signal_date',
            key: 'last_signal_date'
          }
        ],
        tableData: []
      }
    }
  },
  components: {
    ScannerForm,
    SignalsTable,
    Trades
  },
  async mounted() {
    await this.$refs['SignalsTable'].getDataList('MySignal')
  },
  methods: {
    changeTab(val) {
      this.activeTab = val
    },
    async changeSecondTab(val) {
      debugger
      this.activeSecondTab = val
      if(val === 'MySignal') await this.$refs['SignalsTable'].getDataList(val)
      if(val === 'Sample') await this.$refs['SampleTable'].getDataList(val)
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
    displayResultsData(data) {
      this.$refs['ScannerForm'].displayData(data)
      this.scrollToTarget('scrollTarget')
    },
    clearResults() {
        this.activeSecondTab = 'filter'
        this.$refs['Statistics'].displayData({})
        this.tradesData = []
    },
    resetForm() {
      this.$nextTick(() => {
        const NoResetAllowed = this.$refs['ScannerForm'].resetForm()
        if(NoResetAllowed) return     
        this.clearResults()
      })
    },
    async refreshBTList() {
      const val = this.activeSecondTab
      if(val === 'MySignal') await this.$refs['SignalsTable'].getDataList(val)
      if(val === 'Sample') await this.$refs['SampleTable'].getDataList(val)
      if(val === 'Sample') this.activeSecondTab = 'MySignal'
      this.scrollToTarget('scrollTargetTable')
    },
    handleDownloadCsv() {
      const summary = this.$refs.Statistics.handleDownloadCsv()
      const trade = this.$refs.Trades.handleDownloadCsv()
      const filterList = this.$refs.filterTable.exportTable()
      if (
          !summary.length &&
          !trade.length &
          !filterList.length
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
    reassignBTAttributes(data) {
      debugger
      // use for copy
      data['cond'] = isJson(data['cond']) ? data['cond'] : JSON.stringify(data['cond'])
      data['description'] = isJson(data['description']) ? data['description'] : JSON.stringify(data['description'])
      data['signals'] = isJson(data['signals']) ? data['signals'] : JSON.stringify(data['signals'])
			const selectedProps = [
				'name',
				'symbol',
				'timeframe',
				'signals',
        'score',
        'signals_in_market',
        'relation',
        'start_date',
        'end_date',
        'delay_bars',
        'subscribe',
        'cond',
        'description'
			]
			let backtestParams = Object.assign(
				{},
				...selectedProps.map((prop) => ({ [prop]: data[prop] }))
			)
      console.log('backtestParams', backtestParams)
      return backtestParams
		},
  }
}
</script>

<style lang="less" scoped>
.back {
	font-size: 1.1rem;
  margin-bottom: 20px;
	i {
		font-weight: bold;
	}
	a {
		color: #525456;
		font-weight: bold;
		&:hover {
			color: #5b9bd1;
		}
	}
}
.CPMResults-container {
  margin: 5px auto auto auto;
  width: 90%;
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
.portfolio-header {
  /deep/ .el-collapse-item__header {
    height: 48px;
  }
}
.el-collapse.header .el-collapse-item /deep/ .el-collapse-item__header{
  background-color: #fff;
  margin-bottom: 20px;
}
.portfolio-des {
  padding: 0 20px;
  font-weight: 400;
  font-size: 14px;
  color: #333;
}
</style>