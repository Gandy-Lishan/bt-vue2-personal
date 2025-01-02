<template>
  <div class="CPMResults-container">
      <el-collapse accordion  class="header">
      <el-collapse-item>
        <template slot="title">
          <div class="title">
            <p>My signal (click to expand)</p>
          </div>
        </template>
        <div class="portfolio-des">
          <p>
            My Signal is a convenient trading signals platform that provides customized trading signals through a variety of conditions to meet the needs of different users.
          </p>
          <p>
            In the table below, when a row is highlighted in “yellow”, it indicates a change in that trading signal.
          </p>
          <div class="subscribe-container">
            <p>
              <el-checkbox v-model="checked" @change="checkedSignalAlert">My Signal Alerts</el-checkbox>
            </p>
            <p>
              You can subscribe to receive email alerts for my signal by selecting the checkbox below.
              To subscribe (or unsubscribe) from the My Signal email alerts, check (to subscribe) or uncheck (to unsubscribe).
            </p>
          </div>
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
            :lastSignalDate="lastSignalDate"
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
<script>
import ScannerForm from "./ScannerForm";
import SignalsTable from "./Table";
import Trades from "./Trades";
import { getLastSignalDate, getMySignalsSubscribe, changeMySignalsSubscribe } from '@/service/service';
import { isJson } from "@/utils"

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
      },
      lastSignalDate: '',
      checked: false
    }
  },
  components: {
    ScannerForm,
    SignalsTable,
    Trades
  },
  async mounted() {
    // get the signal whose the last signal date is today
    await this.getMySignalsSubscribe()
    await this.getLastSignalDate()
    await this.$refs['SignalsTable'].getDataList('MySignal')
    await this.$refs['SignalsTable'].onSortChange({column: 
      {sortable: 'custom'},
      prop: 'last_signal_date',
      order: 'descending'
    })
  },
  methods: {
    async getMySignalsSubscribe() {
      const res = await getMySignalsSubscribe()
      const code  = res.data?.code
      if(code == 219) {
        const my_signals_subscribe = (isJson(res.data.data) ? JSON.parse(res.data.data) : res.data.data).my_signal
        this.checked = Boolean(Number(my_signals_subscribe))
      }
    },
    changeTab(val) {
      this.activeTab = val
    },
    async changeSecondTab(val) {
      debugger
      this.activeSecondTab = val
      if(val === 'MySignal') await this.$refs['SignalsTable'].getDataList(val)
      if(val === 'Sample') {
        await this.$refs['SampleTable'].getDataList(val)
        await this.$refs['SampleTable'].onSortChange({column: 
          {sortable: 'custom'},
          prop: 'last_signal_date',
          order: 'descending'
        })
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
        if(code === 220 && checked) this.popUpMsgBox('Add Subscribe successfully')
        else if(code === 220 && !checked) this.popUpMsgBox('Your subscription has been canceled')
        else if(code === 518) this.popUpMsgBox('Add Subscribe failed, Error occurred while Updating Subscribe')
        else if(code === 520) this.popUpMsgBox('Update subscribe failed')
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
.subscribe-container {
  border: 1px solid #e0e0e0;
  padding: 10px 20px 10px 20px;
  border-radius: 5px;
}
</style>