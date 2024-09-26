<template>
  <div>
    <div class="strategy-container">
    <div class="strategy-top">
      <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <h2 class="page-title">Strategies (click to expand)</h2><i class="header-icon el-icon-info"></i>
        </template>
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
      </el-collapse-item>
    </el-collapse>
		</div>
    <br>
    <div class="strategy-main">
      <div class="strategy-header">
        <div class="tableHeader">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Strategies'" :class="{ 'selected': selectedTitle === 'Strategies' }">Strategies</h4>
            <h4  @click="selectedTitle = 'Summary'" :class="{ 'selected': selectedTitle === 'Summary' }">View Summary Statistics</h4>
          </div>
          <div class="btns">
            <!-- <el-button type="primary" size="mini" @click="portfolio">Portfolio</el-button> -->
            <el-button type="primary" size="mini" @click="downloadCSV"><i class="el-icon-download" style="margin-right: 10px"></i>Download CSV</el-button>
          </div>
        </div>
        <div class="searchBox">
          <el-input placeholder="Search" v-model="searchKey" size="mini" @keyup.enter.native="handleQuery" clearable @clear="handleQuery">
            <i slot="append" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="handleQuery"></i>
          </el-input>
        </div>
      </div>
      <br>
      <StrategiesTable v-show="selectedTitle === 'Strategies'" ref="Strategies" @getUrlToNameMap="getUrlToNameMap" @highlightedTag="highlightedTag"></StrategiesTable>
      <SummaryTable v-show="selectedTitle === 'Summary'" ref="Summary" :urlToNameMap="urlToNameMap" :tag="tag"></SummaryTable>
    </div>
    </div>
  </div>
</template>
<script>
import StrategiesTable from "./StrategiesTable";
import SummaryTable from "./SummaryTable";
import { LocalStorageUtil } from "@/utils";
const XLSX = require('xlsx');

export default {
  name: 'StrategyList',
  data() {
    return {
      selectedTitle: 'Strategies',
      urlToNameMap: [],
      searchKey: '',
      tag: 'All'
    }
  },
  components: {
    StrategiesTable,
    SummaryTable
  },
  mounted() {
    const {selectedTitle, highlightedTag} = LocalStorageUtil.get('strategy_filter_state')
    this.selectedTitle = selectedTitle || 'Strategies'
    this.highlightedTag(highlightedTag || 'All')
    const tags = [
				{ type: 'info', label: 'All', value: 'All' },
				{ type: 'info', label: 'Legacy Index', value: 'Legacy' },
				{ type: 'info', label: 'Index', value: 'INDEX' },
				{ type: 'info', label: 'Bond', value: 'Bond' },
				{ type: 'info', label: 'Factors', value: 'Factors' },
				{ type: 'info', label: 'Sector', value: 'Sector' },
				{ type: 'info', label: 'My Favorites', value: 'Favorites' }
			]
    this.$refs['Strategies'].highlightTag(tags.find(tag => tag.value === highlightedTag) || tags[0])
  },
  beforeDestroy () {
    // 离开此组件前保存筛选条件状态
    console.log('离开此组件前保存筛选条件状态', {selectedTitle: this.selectedTitle, highlightedTag: this.tag})
    LocalStorageUtil.set('strategy_filter_state', {selectedTitle: this.selectedTitle, highlightedTag: this.tag})
  },
  methods: {
    portfolio() {
      this.$refs['Strategies'].portfolio()
    },
    async getUrlToNameMap(map) {
      this.urlToNameMap = map
      await this.$refs['Summary'].getDataList()
    },
    handleQuery() {
      this.$refs[this.selectedTitle].handleQuery(this.searchKey)
    },
    highlightedTag(tag) {
      debugger
      console.log('tag', tag)
      this.tag = tag
      this.$refs['Summary'].highlightedTag(tag)
    },
    downloadCSV() {
      // 访问组件示例数据
      const summaryData = this.$refs['Summary'].immutableTableData
      if (!summaryData.length) {
        this.popUpMsgBox('No data available for download')
        return
      }
			const processedData = summaryData.map(item => {
				return {
					'Model Name': item.model_name,
					'Strategy CAGR': `${item.CAGR}%`,
					'Benchmark CAGR': `${item.benchmark_CAGR}%`,
					'Max Drawdown': `${item.max_drawdown}%`,
					'Net Profit(%)': `${item.net_profit_pct}%`,
					'Sharpe Ratio': `${item.sharp_ratio}`,
					'Profit/Loss Ratio': `${item.profit_loss_ratio}%`,
					'Average Win': `${item.average_win}%`,
					'Average Loss': `${item.average_loss}%`,
					'Total Trades': item.total_trades,
					'Win Rate(%)': `${item.win_rate_pct}%`,
				}
			})
			const ws = XLSX.utils.json_to_sheet(processedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Summary Statistics');
      XLSX.writeFile(wb, 'Summary Statistics.xlsx');
    }
  }
}
</script>

<style lang="less" scoped>
@import "../index.less";
</style>