<template>
  <div>
    <div class="strategy-container">
    <div class="strategy-top">
      <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <h2 class="page-title">Strategies (click to expand)</h2>
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
      <div class="tagBox">
        <el-tag
          v-for="tag in tags"
          :key="tag.label"
          :type="tag.type"
          @click="highlightTag(tag)"
          :class="{ 'highlighted-tag': tag.value === activatedTag }"
          effect="plain"
        >
          {{ tag.label }}
        </el-tag>
      </div>
      <div class="strategy-header">
        <div class="tableHeader">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Strategies'" :class="{ 'selected': selectedTitle === 'Strategies' }">Strategies</h4>
            <h4  @click="selectedTitle = 'Summary'" :class="{ 'selected': selectedTitle === 'Summary' }">View Summary Statistics</h4>
          </div>
          <div class="btns">
            <!-- <el-button type="primary" size="mini" @click="portfolio">Portfolio</el-button> -->
            <el-button type="primary" size="mini" @click="downloadCSV" title="download csv"><i class="el-icon-download"></i></el-button>
          </div>
        </div>
        <div class="searchBox">
          <el-input placeholder="Search" v-model="searchKey" size="mini" @keyup.enter.native="handleQuery" clearable @clear="handleQuery">
            <i slot="append" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="handleQuery"></i>
          </el-input>
        </div>
      </div>
      <br>
      <StrategiesTable v-show="selectedTitle === 'Strategies'" ref="Strategies" :highlightedTag="activatedTag" @getUrlToNameMap="getUrlToNameMap" @highlightedTag="highlightedTag"></StrategiesTable>
      <SummaryTable v-show="selectedTitle === 'Summary'" ref="Summary" :urlToNameMap="urlToNameMap" :tag="activatedTag"></SummaryTable>
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
      tags: [
				{ type: 'info', label: 'All', value: 'All' },
				{ type: 'info', label: 'Legacy Index', value: 'Legacy' },
				{ type: 'info', label: 'Index', value: 'INDEX' },
				{ type: 'info', label: 'Bond', value: 'Bond' },
				{ type: 'info', label: 'Factors', value: 'Factors' },
				{ type: 'info', label: 'Sector', value: 'Sector' },
				{ type: 'info', label: 'My Favorites', value: 'Favorites' }
			],
			activatedTag: 'All',
    }
  },
  components: {
    StrategiesTable,
    SummaryTable
  },
  watch: {
    selectedTitle: {
      async handler() {
        LocalStorageUtil.set('strategy_filter_state', {selectedTitle: this.selectedTitle, highlightedTag: this.activatedTag})
        await this.$refs['Strategies'].mountedRequestList()
        await this.$refs['Summary'].getDataList()
      }
    }
  },
  async mounted() {
    const { selectedTitle = '', highlightedTag = '' } = LocalStorageUtil.get('strategy_filter_state') || {};
    this.selectedTitle = selectedTitle || 'Strategies'
    this.activatedTag = highlightedTag || 'All'
    await this.$refs['Strategies'].mountedRequestList()
    await this.$refs['Summary'].getDataList()
    if(this.selectedTitle === 'Summary') this.highlightedTag(this.activatedTag)
    else if(this.selectedTitle === 'Strategies') this.$refs['Strategies'].highlightTag(this.activatedTag)
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
      this.$refs['Summary'].highlightedTag(tag)
    },
    downloadCSV() {
      // 访问组件示例数据
      if(this.selectedTitle === 'Summary') {this.downloadSummaryCSV();return}
      if(this.selectedTitle === 'Strategies') {this.downloadStrategiesCSV();return}
    },
    downloadSummaryCSV() {
      const summaryData = this.$refs['Summary'].immutableTableData
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
    },
    downloadStrategiesCSV() {
      debugger
      const strategiesTable = this.$refs['Strategies'].immutableTableData
      const processedData = strategiesTable.map(item => {
				return {
					'Model Name': item.model_name,
					'Time Frame': item.type,
					'Current Signal: (e.g., Long, Sell, etc)': `${item.current_state}`,
					'Last Signal Date: (last change in Signal)': `${item.date}`,
					'Model Update Frequency': `${item.update_frequency}`,
					'YTD until 11/29/24 Return(%)': `${item.YTD_return}%`
				}
			})
			const ws = XLSX.utils.json_to_sheet(processedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Strategies');
      XLSX.writeFile(wb, 'Strategies.xlsx');
    },
    highlightTag(tag) {
			this.activatedTag = tag.value
      this.$refs['Strategies'].highlightTag(tag.value)
      this.highlightedTag(this.activatedTag)
      LocalStorageUtil.set('strategy_filter_state', {selectedTitle: this.selectedTitle, highlightedTag: this.activatedTag})
		},
  }
}
</script>

<style lang="less" scoped>
@import "../index.less";
.searchBox {
  align-content: flex-end;
  margin-left: 20px;
  .el-input-group {
    width: 300px;
  }
  /deep/ .el-input--mini .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
</style>