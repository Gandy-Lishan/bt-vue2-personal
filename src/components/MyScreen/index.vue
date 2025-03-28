<template>
  <div class="CPMResults-container">
      <el-collapse accordion  class="header">
      <el-collapse-item>
        <template slot="title">
          <div class="title" ref="scrollTopTarget">
            <p>My Screen (click to expand)</p>
          </div>
        </template>
        <div class="portfolio-des">
          <p>
            My Screen is a powerful screening tool that allows users to select specific signal criteria, quickly identify constituent stocks in designated sectors/indexes that meet these conditions, and provides detailed related information. 
          </p>
        </div>
      </el-collapse-item>
      </el-collapse>
    <el-collapse v-model="activeNames" :accordion="false" class="CPMResults-content">
      <el-collapse-item name="1" class="form">
        <template v-slot:title>
          <div class="title" ref="scrollTargetTable">
            <p @click.stop="() => {changeSecondTab('MyScreen')}" :class="{ secondActive: activeTab == 'MyScreen' || '' }">Screens List</p>
            <p @click.stop="() => {changeSecondTab('Result')}" :class="{ secondActive: activeTab == 'Result' || '' }">Screen Result</p>
            <p @click.stop="() => {changeSecondTab('System')}" :class="{ secondActive: activeTab == 'System' || '' }">System Screen List</p>
          </div>
        </template>
        <div class="content">
          <SignalsTable 
            v-show="activeTab === 'MyScreen'"
            currentPageTab="MyScreen"
            ref="SignalsTable"
            :lastSignalDate="lastSignalDate"
            @changeSecondTab="changeSecondTab"
            @displayFormData="displayFormData"
            @displayResultsData="displayResultsData"
            @refreshBTList="refreshBTList"
            @displayDes="displayDes"
            @saveJumpBacktestData="saveJumpBacktestData"
          ></SignalsTable>
          <FilterTable v-show="activeTab == 'Result'" ref="filterTable"
            :data="filterTableData" 
            :label="filterTableData.label" 
            :tableCol="filterTableData.tableCol" 
            :loading="loading"
            :signalDes="signalDes"
            :jumpBacktestData="jumpBacktestData"
            :currentRow="currentRow"
            ></FilterTable>
          <SignalsTable 
            v-show="activeTab === 'System'"
            currentPageTab="System"
            ref="SystemTable"
            @changeSecondTab="changeSecondTab"
            @displayFormData="displayFormData"
            @displayResultsData="displayResultsData" 
            @displayDes="displayDes"
            @saveJumpBacktestData="saveJumpBacktestData"
          ></SignalsTable>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" class="form">
        <template v-slot:title>
          <div class="title" ref="scrollTarget">
            <p>Create New Screen</p>
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
         @displayResultsData="displayResultsData"
         @displayDes="displayDes"
         @saveJumpBacktestData="saveJumpBacktestData"
         >
        </ScannerForm>
      </el-collapse-item>
      <!-- <el-collapse-item name="3" class="form">
        <template v-slot:title>
          <div class="title" ref="scrollTargetResults">
            <p @click.stop :class="{ secondActive: activeSecondTab == 'results' || '' }">Screen Result List</p>
          </div>
          <div class="downLoadCsvBtn">
              <el-button
                @click.stop="() => {handleDownloadCsv()}"
                style="display: inline-block"
                type="primary"
                size="small"
                icon="el-icon-download"
                title="Export Data"
                ></el-button
              >
          </div>
        </template>
        <div class="content">
            <FilterTable v-show="activeSecondTab == 'results'" ref="filterTable"
            :data="filterTableData" 
            :label="filterTableData.label" 
            :tableCol="filterTableData.tableCol" 
            :loading="loading"
            ></FilterTable>
        </div>
      </el-collapse-item> -->
    </el-collapse>
  </div>
</template>
<script>
import ScannerForm from "./ScannerForm";
import SignalsTable from "./Table";
import FilterTable from "./FilterTable";
import Trades from "./Trades";
import { getLastSignalDate, changeMySignalsSubscribe } from '@/service/service';
import { isJson, trimTrailingZeros } from "@/utils"

export default {
  name: 'MySignals',
  data() {
    return {
      activeNames: ['1', '2', '3'],
      activeTab: 'MyScreen',
      activeSecondTab: 'results',
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
      },
      lastSignalDate: '',
      checked: false,
      filterTableData: {
        content: [],
        label:'Filter Condition Preview',
        title: 'Filter Condition Preview',
        tableCol: [
          // {label:'Date',value:'Date',labelHtml:'Date'},
          // {label:'Symbol',value:'Symbol',labelHtml:'Symbol'},
          // {label:'Name',value:'Name',labelHtml:'Name'},
          // {label:'Optix Value',value:'Optix Value',labelHtml:'Optix Value'},
          // {label:'Optix 5-Day MA',value:'Optix 5-Day MA',labelHtml:'Optix 5-Day MA'},
          // {label:'Closing Price',value:'Closing Price',labelHtml:'Closing Price'},
          // {label:'Closing Price 200-Day MA',value:'Closing Price 200-Day MA',labelHtml:'Closing Price 200-Day MA)'}
        ]
      },
      signalDes: '',
      jumpBacktestData: {},
      currentRow: {}
    }
  },
  components: {
    ScannerForm,
    SignalsTable,
    Trades,
    FilterTable
  },
  async mounted() {
    // get the signal whose the last signal date is today
    await this.$refs['SignalsTable'].getDataList('MyScreen')
    // await this.$refs['SignalsTable'].onSortChange({column: 
    //   {sortable: 'custom'},
    //   prop: 'last_signal_date',
    //   order: 'descending'
    // })
  },
  methods: {
    changeTab(val) {
      this.activeTab = val
    },
    async changeSecondTab(val) {
      debugger
      this.activeTab = val
      if(val === 'MyScreen') await this.$refs['SignalsTable'].getDataList(val)
      if(val === 'Sample') {
        await this.$refs['SampleTable'].getDataList(val)
        await this.$refs['SampleTable'].onSortChange({column: 
          {sortable: 'custom'},
          prop: 'last_signal_date',
          order: 'descending'
        })
      }
      if(val === 'System') {
        await this.$refs['SystemTable'].getDataList(val)
      }
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
    displayResultsData(data, row={}) {
      debugger
      this.currentRow = row
      // this.$refs['ScannerForm'].displayData(data)
      const results = Array.isArray(data) && data.length !== 0
      if(!results) {
        this.popUpMsgBox(`No results found. Adjust the parameters and save again.`)
        // this.clearResults()
        // return
      }
      this.activeTab = 'Result'
      this.displayResultList(data)
      // this.scrollToTarget('scrollTargetTable', -200)
    },
    displayFormData(data, isScroll) {
      debugger
      this.$refs['ScannerForm'].displayData(data)
      if(isScroll) this.scrollToTarget('scrollTarget', -200)
    },
    displayResultList(content) {
      debugger
      if(!content) return
      if(Array.isArray(content) && content.length === 0) {
        this.filterTableData = {
          tableCol: [],
          content: []
        }
        return
      }
		  this.loading = true
      // this.$refs.filterTable.handleSizeChange(10)
      // 把数据处理成所需格式
      //  content.forEach(x => {
        // x['Close'] = x['Close'].toFixed(2)
		  	// x['Alloc'] = (x['Alloc']*100).toFixed(0)
			  // x['StopLoss'] = Number(x['StopLoss']).toFixed(2)
			  // x['ProfitTarget'] = Number(x['ProfitTarget']).toFixed(2)
			  // x['WinRate'] = Number(x['WinRate']).toFixed(2)
			  // x['ExpectedReturn'] = Number(x['Expected Return(%)']).toFixed(2)
			  // x['_Signal'] = x['Signal']
			  // x['TimeInMarket'] = x['TimeInMarket']
      //  })
      // 更新 tableCol
      const columns = Array.from(Object.keys(content[0])).map(column => {
        return {
          label: column,
          value: column,
          labelHtml: column
        }
      })
      const formatNumbers = (content) => {
        return content.map(item => {
          // 遍历对象的所有属性
          Object.keys(item).forEach(key => {
            const value = item[key];

            if (!isNaN(value) && typeof value !== 'boolean' && value !== null) {
              const num = parseFloat(value);
              if (!isNaN(num)) {
                item[key] = trimTrailingZeros(num.toFixed(2)); // 保留两位小数
              }
            }
          });
          return item;
        });
      };
      const _content = formatNumbers(content)
      this.$nextTick(() => {
        this.filterTableData = {
          ...this.filterTableData,
          tableCol: columns,
          content: _content
        }
      })
		    this.loading = false
    },
    clearResults() {
      this.filterTableData = {
        ...this.filterTableData,
        content: []
      }
    },
    resetForm() {
      this.$nextTick(() => {
        const NoResetAllowed = this.$refs['ScannerForm'].resetForm()
        if(NoResetAllowed) return     
        this.clearResults()
      })
    },
    async refreshBTList() {
      const val = this.activeTab
      if(val === 'MyScreen') await this.$refs['SignalsTable'].getDataList(val)
      if(val === 'Sample') await this.$refs['SampleTable'].getDataList(val)
      if(val === 'Sample') this.activeTab = 'MyScreen'
      // this.scrollToTarget('scrollTargetTable')
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
    async getLastSignalDate() {
      try {
        const res = await getLastSignalDate()
        console.log('res', res)
        const code = res?.data?.code
        if(code === 217) this.lastSignalDate = res?.data?.data
      } catch (error) {
        console.error(error);
        
      }
    },
    async checkedSignalAlert(checked) {
      const res = await changeMySignalsSubscribe({my_signal: Number(checked)})
        const code  = res.data?.code
        if(code === 220 && checked) this.popUpMsgBox('Signal Email has been subscribed successfully')
        else if(code === 220 && !checked) this.popUpMsgBox('Signal Email unsubscribed successfully')
        else if(code === 518) this.popUpMsgBox('Add Signal Email Subscribe failed')
        else if(code === 520) this.popUpMsgBox('Update Signal Email Subscribe failed')
    },
    displayDes(des) {
      this.signalDes = des
    },
    saveJumpBacktestData(data) {
      this.jumpBacktestData = data
    }
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
/deep/ .el-collapse {
  margin-bottom: 20px;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: unset;
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
}
.portfolio-des {
  padding: 0 20px;
  font-weight: 400;
  font-size: 14px;
  color: #333;
  p {
    margin: 0 0 3px 0;
  }
}
@media (min-width: 768px) {
  .CPMResults-container {
      width: 750px;
  }
}
@media (min-width: 992px) {
  .CPMResults-container {
      width: 970px;
  }
}
@media (min-width: 1200px) {
  .CPMResults-container {
      width: 1170px;
  }
}
</style>