<template>
  <div>
    <div class="strategy-container">
    <div class="strategy-top">
      <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <h2 class="page-title">Strategies</h2><i class="header-icon el-icon-info"></i>
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
            <el-button type="primary" size="mini" @click="portfolio">Portfolio</el-button>
            <el-button type="primary" size="mini"><i class="el-icon-download" style="margin-right: 10px"></i>Download CSV</el-button>
          </div>
        </div>
        <div class="searchBox">
          <el-input placeholder="Search" v-model="searchKey" size="mini">
            <i slot="append" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <br>
      <StrategiesTable v-if="selectedTitle === 'Strategies'"></StrategiesTable>
      <SummaryTable v-if="selectedTitle === 'Summary'"></SummaryTable>
    </div>
    </div>
  </div>
</template>
<script>
import StrategiesTable from "./Table/StrategiesTable";
import SummaryTable from "./Table/SummaryTable";
export default {
  name: 'Strategy',
  data() {
    return {
      selectedTitle: 'Strategies',
    }
  },
  components: {
    StrategiesTable,
    SummaryTable
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>