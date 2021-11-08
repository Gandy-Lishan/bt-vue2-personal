<template>
  <div class="home_container" id="content">
    <div class="home_box">
      <header class="header">
        <img src="../../assets/logo.png" alt="logo">
        <p>SentimentTrader Backtest Engine</p>
        <p>This is on Sentimentrader.com. It is an indicator page that is shown AAPL and AAPL Optix (lets assume that at least).  A user now wants to
backtest this setup. There could be multiple indicators on this chart - some might be our sentiment indicators, some could be technical
indicators</p>
        <div class="chart_box">
           <img src="../../assets/chart.png" alt="chart">
        </div>
      </header>
      <main class="main">
        <div class="mainTagbar">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="Entry Signal" name="first">
                <p  style="font-weight: bold;">Entry Signal</p>
                <signal-form :signalFormData="signalFormData"></signal-form>
                  <el-row>
                    <el-col :span="16">
                    <div class="entryBtns">
                      <el-button type="info">Clear Entry Signal</el-button>
                      <el-button type="primary">Save Entry Signal</el-button>
                      <el-button type="warning">Load Entry Signal</el-button>
                    </div>
                    </el-col>
                  </el-row>
              </el-tab-pane>
              <el-tab-pane label="Exit Signal" name="second">
                <p  style="font-weight: bold;">Exit Signal</p>
                <signal-form :signalFormData="signalFormData"></signal-form>
                  <el-row>
                    <el-col :span="16">
                    <div class="entryBtns">
                      <el-button type="info">Clear Entry Signal</el-button>
                      <el-button type="primary">Save Entry Signal</el-button>
                      <el-button type="warning">Load Entry Signal</el-button>
                    </div>
                    </el-col>
                  </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
      </main>
      <footer class="footer">
        <div class="footerTagbar">
          <el-tabs v-model="activeTag" type="card" @tab-click="handleTagClick">
            <el-tab-pane label="Backtest Setup" name="first">
              <backtest-setup-form></backtest-setup-form>
            </el-tab-pane>
            <el-tab-pane label="Backtest Results" name="second">
              <backtest-result-form></backtest-result-form>
            </el-tab-pane>
            <el-tab-pane label="Favorites" name="third">
              <favorite-form></favorite-form>
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
export default {
  data(){
  return{
    currentTag: 'first',
    signalFormData:{
    id: 1,
    user: "admin",
    name: "long signal with Advisor and Investor Model",
    type: "long",
    analysis_basis: "sentiment",
    used_indicators: "Advisor and Investor Model",
    description: "Consider going long when indicator value crosses above 0.25 from below",
    frequency: "Weekly",
    winrate_percentage: "0.0",
    risk_reward_ratio: "0.0",
    favorites: true,
    combination: 0,
    complication: 0,
    score: 0
    },
    entryFormdata:{
      name: '',
      description: '',
      type: '',
      frequency: ''
    },
    conditionFormdata:{
      name: '',
      parameter: '',
      condition: '',
      value: '',
      ma: ''
    },
    activeName: 'first',
    activeTag: 'first',
  }},
  components: {
    'signal-form': signalForm,
    'backtest-setup-form': backtestSetupForm,
    'backtest-result-form': backtestResultForm,
    'favorite-form': favoriteForm
  },
  methods: {
  handleClick(tab, event) {
    console.log(tab, event);
  },
  handleTagClick(tab, event) {
    console.log('tag', tab.name);
    const tags = document.querySelector('.main')
    if(tab.name === 'second' || tab.name === 'third'){
      tags.style.display = 'none'
      this.returnTop()
    }else{
      tags.style.display = 'block'
      this.returnTop()
    }
  },
  returnTop() {
     content.scrollIntoView()
  }
}
  }
</script>
<style lang="less" scoped>
.home_container{
  height: 100%;
  width: 100%;
  font-size: 16px;
.home_box{
  height: 100%;
  width: 85.71rem;
  margin: 0px auto;
}
}
.header{
  p{
    margin: 1.14rem 0 1.14rem 0px;
    font-style:italic;
    color: #6c6c6c;
  }
  p:first-of-type{
    font-size: 2rem;
    margin: 0px;
    font-weight: lighter;
    color: #333333;
  }
  .chart_box img{
    width: 100%;
  }
  margin-bottom: 80px;
}
.left, .right{
  border: 3px solid #ADADAD;
  border-radius: 5px;
  padding: 10px;
}
.left{
  height: 421px;
}
.titleTxt{
  margin: 20px 0px 30px 0px;
}
p{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.right{
  margin-top: 68px;
  height: 421px;
}
.entryBtns button{
  margin: 30px 75px 0px 75px;
}
.footer{
  margin-top: 100px;
  padding-bottom: 100px;
}
</style>