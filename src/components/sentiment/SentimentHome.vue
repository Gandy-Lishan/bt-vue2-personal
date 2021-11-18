<template>
  <div class="home_container" id="content">
    <div class="home_box">
      <header class="header">
        <img src="../../assets/logo.png" alt="logo" />
        <p>SentimentTrader Backtest Engine</p>
        <p>
          This is on Sentimentrader.com. It is an indicator page that is shown
          AAPL and AAPL Optix (lets assume that at least).  A user now wants to
          backtest this setup. There could be multiple indicators on this chart
          - some might be our sentiment indicators, some could be technical
          indicators
        </p>
        <div class="chart_box">
          <img src="../../assets/chart.png" alt="chart" />
        </div>
      </header>
      <main class="main">
        <div class="mainTagbar">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="Entry Criteria" name="first">
              <p style="font-weight: bold">Entry Criteria</p>
              <signal-form
                :signalFormTagName="signalFormTagName"
                ref="child"
                :exitLabel="exitLabel"
                @getExitLabel="getExitLabel"
                @sendEntryData="getEntryData"
                @sendExitData="getExitData"
                @goToExitSignalForm="goToExitSignalForm"
                @goToStrategyForm="goToStrategyForm"
              ></signal-form>
            </el-tab-pane>
            <el-tab-pane label="Exit Criteria" name="second">
              <p style="font-weight: bold">Exit Criteria</p>
              <signal-form
                :signalFormTagName="signalFormTagName"
                ref="child"
                :exitLabel="exitLabel"
                @getExitLabel="getExitLabel"
                @sendEntryData="getEntryData"
                @sendExitData="getExitData"
                @goToExitSignalForm="goToExitSignalForm"
                @goToStrategyForm="goToStrategyForm"
              ></signal-form>
            </el-tab-pane>
            <!-- <el-tab-pane label="New Strategy" name="third">
              <p class="strategyNote">New Strategy</p>
              <new-strategy-form ref="strategyChild" :strategyEntryData="strategyEntryData" :strategyExitData="strategyExitData" @updateStrategylist="updateStrategylist"></new-strategy-form>
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </main>
      <footer class="footer">
        <div class="footerTagbar">
          <el-tabs v-model="activeTag" type="card" @tab-click="handleTagClick">
            <el-tab-pane label="Backtest Setup" name="first">
              <backtest-setup-form ref="child" @goToBacktestFavoriteForm="goToBacktestFavoriteForm" @updateFavoriteList="updateFavoriteList"></backtest-setup-form>
            </el-tab-pane>
            <el-tab-pane label="Backtest Results" name="second">
              <backtest-result-form ref="resultChild" @goToBacktestFavoriteForm="goToBacktestFavoriteForm"></backtest-result-form>
            </el-tab-pane>
            <el-tab-pane label="Favorites" name="third">
              <favorite-form ref="favoriteChild" @getResultTry="getResultTry" @getBacktestDataTry="getBacktestDataTry" @goTobacktestSetupForm="goTobacktestSetupForm" @goBacktestResultForm="goBacktestResultForm"></favorite-form>
            </el-tab-pane>
            <el-tab-pane label="Strategies" name="fourth">
              <strategy-form ref="strategyChild"></strategy-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import signalForm from './components/signalForm.vue'
import backtestSetupForm from './components/backtestSutupForm.vue'
import backtestResultForm from './components/backtestResultForm.vue'
import favoriteForm from './components/favoriteForm.vue'
import newStrategyForm from './components/newStrategyForm.vue'
import strategyForm from './components/strategyForm.vue'
export default {
  data() {
    return {
      currentTag: 'first',
      activeName: 'first',
      activeTag: 'first',
      signalFormTagName: 'first',
      exitLabel: [],
      strategyEntryData: {},
      strategyExitData: {},
    }
  },
  components: {
    'signal-form': signalForm,
    'backtest-setup-form': backtestSetupForm,
    'backtest-result-form': backtestResultForm,
    'favorite-form': favoriteForm,
    'new-strategy-form': newStrategyForm,
    'strategy-form': strategyForm
  },
  methods: {
    handleClick(tab, event) {
      this.signalFormTagName = tab.name
    },
    handleTagClick(tab, event) {
      const tags = document.querySelector('.main')
      if (tab.name === 'second' || tab.name === 'third') {
        tags.style.display = 'none'
        this.returnTop()
      } else {
        tags.style.display = 'block'
        this.returnTop()
      }
    },
    returnTop() {
      content.scrollIntoView()
    },
    getExitLabel(type) {
      this.exitLabel = type
    },
    getEntryData(data) {
      this.strategyEntryData = data
    },
    getExitData(data) {
      this.strategyExitData = data
    },
    goToBacktestFavoriteForm() {
      this.activeTag = 'third'
    },
    goBacktestResultForm() {
      this.activeTag = 'second'
    },
    goTobacktestSetupForm() {
      this.activeTag = 'first'
    },
    goToExitSignalForm() {
      this.activeName = 'second'
    },
    goToStrategyForm() {
      this.activeName = 'third'
    },
    getBacktestDataTry() {
      this.$refs.child.getEditBacktestData()
    },
    getResultTry() {
      this.$refs.resultChild.getData()
    },
    updateStrategylist() {
      this.$refs.child.updataStrategylist()
    },
    updateFavoriteList() {
      this.$refs.favoriteChild.getBacktestList()
    }
  },
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
  width: 100%;
  font-size: 16px;
  .home_box {
    height: 100%;
    width: 85.71rem;
    margin: 0px auto;
  }
}
.header {
  p {
    margin: 1.14rem 0 1.14rem 0px;
    font-style: italic;
    color: #6c6c6c;
  }
  p:first-of-type {
    font-size: 2rem;
    margin: 0px;
    font-weight: lighter;
    color: #333333;
  }
  .chart_box img {
    width: 100%;
  }
  margin-bottom: 80px;
}
.left,
.right {
  border: 3px solid #adadad;
  border-radius: 5px;
  padding: 10px;
}
.left {
  height: 421px;
}
.titleTxt {
  margin: 20px 0px 30px 0px;
}
p {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
.right {
  margin-top: 68px;
  height: 421px;
}
.footer {
  margin-top: 100px;
  padding-bottom: 100px;
}
.strategyNote {
  font-weight: bold;
  margin: 20px 0px 40px 20px;
}
</style>