<template>
  <div class="CPMResults-container">
    <el-collapse v-model="activeNames" @change="handleChange" :accordion="false">
      <el-collapse-item name="1">
        <template v-slot:title>
          <div class="title">
            <p>Backtest Summary</p>
          </div>
        </template>
        <CPMSummary></CPMSummary>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template v-slot:title>
          <div class="title">
            <p
             @click.stop="() => {changeTab('statistics')}" :class="{ active: activeTab == 'statistics' || '' }"
            >Backtest Statistics</p>
            <p
             @click.stop="() => {changeTab('results')}" :class="{ active: activeTab == 'results' || '' }"
             >Multi-Timeframe Results</p>
          </div>
        </template>
      <div class="content">
          <Statistics v-show="activeTab == 'statistics'"></Statistics>
          <TIM v-show="activeTab == 'results'"></TIM>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import CPMSummary from "./components/summary";
import Statistics from "./components/statistics";
import TIM from "./components/tim";
export default {
  name: 'CPMResults',
  data() {
    return {
      activeNames: ['1', '2'],
      activeTab: 'statistics'
    }
  },
  components: {
    CPMSummary,
    Statistics,
    TIM
  },
  methods: {
    handleChange(val) {
    },
    changeTab(val) {
      this.activeTab = val
    }
  }
}
</script>

<style lang="less" scoped>
.CPMResults-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  width: 80vw;
  margin: 0 auto;
  background-color: #fff;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  font-weight: 300;
  color: #666;
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
.active {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

</style>