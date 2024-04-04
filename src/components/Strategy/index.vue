<template>
  <div class="strategy-container">
    <div class="strategy-top">
			<h2 class="page-title" style="margin-top: 0px">Strategies</h2>
			<p>
				This page provides a highlight of our Strategies. These strategies are based on multiple trading models, each with its own pros/cons. 
        Some models have larger returns, while others have smaller drawdowns. Some models perform better in trending markets, while others perform better in choppy markets. These models were created to account for individual preferences, risk tolerance, etc. Ultimately, the model that you want to use is up to you.
			</p>
			<p>
				In the table below, a 'yellow' highlight on the row signifies a change in signal.
			</p>
			<p>
				You can now subscribe to receive email notifications when a Strategy updates. Visit the <a href="https://users.sentimentrader.com/users/preferences/">user 
        preferences page</a> to subscribe to our Strategies emails.
			</p>
		</div>
    <br>
    <div class="tagBox">
      <el-tag
        v-for="tag in tags"
        :key="tag.label"
        :type="tag.type"
        @click="highlightTag(tag)"
        :class="{ 'highlighted-tag': tag.label === highlightedTag }"
        effect="plain">
        {{ tag.label }}
      </el-tag>
    </div>
    <div class="strategy-main">
      <div class="strategy-table">
        <div class="tableHeader">
        <div class="btns">
          <el-button type="primary" size="mini"><i class="el-icon-download" style="margin-right: 10px"></i>Download CSV</el-button>
          <el-button type="primary" size="mini"><i class="el-icon-caret-right" style="margin-right: 10px"></i>View Summary Statistics</el-button>
          <el-button type="info" size="mini">Portfolio</el-button>
        </div>
        <div class="searchBox">
          <el-input placeholder="Search" v-model="searchItem" size="mini">
            <i slot="append" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Strategy',
  data() {
    return {
      tags: [
        { type: 'info', label: 'All' },
        { type: 'info', label: 'Legacy Index' },
        { type: 'info', label: 'Index' },
        { type: 'info', label: 'Bond' },
        { type: 'info', label: 'Factors' },
        { type: 'info', label: 'Sector' }
      ],
      highlightedTag: 'All'
    }
  },
  methods: {
    highlightTag(tag) {
      this.highlightedTag = tag.label;
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>