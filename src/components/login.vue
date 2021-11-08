<template>
  <div class="sentiment_container">
    <div class="sentiment_box">
      <div class="header">
        <div class="logo_box">
          <img src="../assets/logo.png" alt="logo">
          <p>This is on Sentimentrader.com. It is an indicator page that is shown AAPL and AAPL Optix (lets assume that at least).  A user now wants to
backtest this setup. There could be multiple indicators on this chart - some might be our sentiment indicators, some could be technical
indicators</p>
        </div>
      </div>
      <div class="main">
        <p>Note: Ignore formatting / color of chart. Just using as a placeholder. ALso, ingore the menu dropdown on right side.</p>
        <img src="../assets/chart.png" alt="">
      </div>
      <div class="footer">
        <div class="top">
        <div class="return_box">
          <el-button type="primary" @click="returnEstimate">Estimate Returns</el-button>
          <div><p>Return Estimatation</p>
<p>1.) They push “Estimate Returns” button. </p>
<p>2.) They are taken to the *CURRENT* backtest engien</p>
          </div>
        </div>
        <div class="backtest_box">
          <el-button type="primary" @click="backtestChart">Backtest This Chart</el-button>
                    <div><p>Return Estimatation</p>
<p>1.) They push “Estimate Returns” button. </p>
<p>2.) They are taken to the *CURRENT* backtest engien</p>
          </div>
        </div></div>
        <p class="last_note">Note: Ignore formatting and placement of buttons above. They are just shown for illustration purproses</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 点击重置按钮，重置表单
    returnEstimate() {
      // this.$refs.loginFormRef.resetFields()
      this.$router.push('/welcome')
      this.$message.success('登录成功')
    },
    backtestChart() {
      this.$router.push('/sentimentHome')
    }
  }
}
</script>
<style lang="less" scoped>
.sentiment_container {
  background-color: #fff;
  height: 100%;
  width: 100%;
}
.header{
  padding-top: 40px;
  .logo_box p{
    color: #d9001b;
    word-break: keep-all;
    position: relative;
    top: -72px;
    left: 315px;
    margin: 0px;
    text-overflow:ellipsis;
    overflow:hidden;
    width: 883px;
  }
}
.main{
  p{
    font-style:italic;
    color: #a8a7a7;
    margin: 0px;
    margin-bottom: 40px;
  }
  img{
    display: block;
    width: 100%;
  }
}
.footer{
  height: 200px;
  position: relative;
  .top{
  display: flex;
  padding-top: 40px;
  justify-content: center;
  .return_box{
    margin-right: 60px;
    display: inline-block;
    width: 494px;
    position: relative;
    div{
      position: absolute;
      top: 10px;
      left: 160px;
      p{
      margin: 0px;
      color: #d9001b;}
    }
  }
  .backtest_box{
    position: relative;
    width: 494px;
    display: inline-block;
    div{
      position: absolute;
      top: 10px;
      left: 176px;
      p{
      margin: 0px;
      color: #d9001b;}
    }
  }
  }
  .last_note{
    color: #333333;
    margin: 0px;
    position: absolute;
    bottom: 0px;
    left: 10px;
    font-size: 14px;
  }
}
.sentiment_box{
  height: 100%;
  width: 1200px;
  margin: 0px auto;
  background-color: #fff;
}
</style>
