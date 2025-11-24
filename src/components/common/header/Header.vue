<template>
  <div class="navbar">
    <div class="header_logo">
      <div class="logo_container" @click="$router.push('/backtester/sr/setup')">
        <span
          ><img
            style="width: 200px; height: 40px"
            src="../../../assets/newLogo.png"
            alt="logo"
        /></span>
        <div class="betaNote">SentimenTech</div>
      </div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo menu"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item class="home-link" index="9"
        v-if="getTokenRole() != 0 && getTokenRole() != 'None'"
          >Strategy</el-menu-item
        >
        <el-menu-item class="home-link" index="1"
        v-if="getTokenRole() != 0 && getTokenRole() != 'None'"
          >BacktestEdge</el-menu-item
        >
        <el-menu-item class="ai-link" index="3"
        v-if="getTokenRole() == 2 && getTokenRole() != 'None'"
          >Smart Stock Scanner</el-menu-item
        >
        <el-menu-item class="my-indicator-link home-link" index="6"
        v-if="getTokenRole() != 0 && getTokenRole() != 'None'"
          >My Indicator</el-menu-item
        >
        <el-menu-item class="seasonality-link home-link" index="7"
        v-if="getTokenRole() != 0 && getTokenRole() != 'None'"
          >Seasonality</el-menu-item
        >
        <el-menu-item class="seasonality-link home-link" index="8"
        v-if="getTokenRole() != 0 && getTokenRole() != 'None'"
          >Correlation Pattern Match</el-menu-item
        >
        <el-menu-item class="home-link" index="10"
        v-if="isAiTrading"
          >AI Trading</el-menu-item
        >
        <el-menu-item class="home-link" index="11"
        v-if="getTokenRole() != 0 && getTokenRole() != 'None' && isPortfolio"
          >Portfolio</el-menu-item
        >
        <el-menu-item class="home-link" index="12"
        v-if="getTokenRole() != 0 && getTokenRole() != 'None'"
          >Reports</el-menu-item
        >
        <el-menu-item class="home-link" index="13"
        v-if="getTokenRole() != 0 && getTokenRole() != 'None'"
          >Indicators</el-menu-item
        >
        <el-submenu class="help-title help-link" index="4" :class="{'help-link-active': activeIndex == '4'}">
          <template slot="title">
            <span>Help</span>
          </template>
          <el-menu-item index="4-1">Tutorial</el-menu-item>
          <!-- <el-menu-item index="4-2">Disclaimer</el-menu-item> -->
        </el-submenu>
        <!-- <el-menu-item class="news-icon" index="6">
          <div
            class="svgContainer"
            v-html="svgCode"
            @click="changeSvg"
          ></div>
        </el-menu-item> -->
        <!-- <el-submenu index="5">
          <template slot="title"
            ><i class="el-icon-s-tools tools"></i
          ></template> -->
          <!-- <el-menu-item index="5-1">User: {{$store.state.app.role}}</el-menu-item> -->
          <!-- <el-menu-item index="5-1">Theme</el-menu-item> -->
          <!-- <el-menu-item index="5-2">Language</el-menu-item> -->
        <!-- </el-submenu> -->
      </el-menu>
    </div>
	</div>
</template>
<script>
import { getTokenRole } from '@/utils'
import { getCookieData } from "@/utils/cryptoUtils/cookie";

export default {
  name: "Header",
  props: {
    svgCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      activeIndex: '',
      isAiTrading: false,
      isPortfolio: false,
      isButtonVisible: false,
      isReports: false,
    }
  },
  computed: {
    userRole() {
      return this.$store.state.user.role
    },
    is_admin() {
      return this.$store.state.user.is_admin
    }
  },
  watch: {
    '$route'(to, _) {
      // 在$route对象变化时执行逻辑
      if (to.path.includes('/backtester') || to.name == 'Backtester') {
        this.activeIndex = '1'
      } else if (to.path.includes('/scannerai') || to.name == 'scannerai_chart' || to.name == 'scannerai_backtest') {
        this.activeIndex = '3'
      }else if(to.path.includes('/doc')){
        this.activeIndex = '4'
      }else if(to.path.includes('/myindicator') || to.name ==  'MIList' || to.name == 'MIcreate'){
        this.activeIndex = '6'
      }else if(to.path.includes('/seasonality') || to.name == 'Seasonality'){
        this.activeIndex = '7'
      }else if(to.path.includes('/cpm') || to.name == 'CPM'){
        this.activeIndex = '8'
      }
      else if(to.path.includes('/strategy') || to.name == 'Strategy'){
        this.activeIndex = '9'
      }else if(to.path.includes('/portfolio') || to.name == 'Portfolio'){
        this.activeIndex = '11'
      }else if(to.path.includes('/MR') || to.name == 'ModelReport'){
        this.activeIndex = '12'
      }else if(to.path.includes('/indicators') || to.name == 'Indicators'){
        this.activeIndex = '13'
      }
      // const currentDomain = window.location.hostname;
    // 如果当前域名是 devbt2.sentimentrader.com 或 localhost，则将 isButtonVisible 设置为 true
    // if (currentDomain == 'devbt2.sentimentrader.com' || currentDomain == 'localhost') this.isButtonVisible = true
      }
  },
  mounted() {
    const email = getCookieData()?.username
    if(email === 'hao@sentimentrader.com') this.isAiTrading = true
    if(email !== 'hao@sentimentrader.com') this.isAiTrading = false
    const allowedReportEmails = ['hao@sentimentrader.com', 'dean@sentimentrader.com', 'jason@sentimentrader.com', 'kian@sentimentrader.com', 'reports@sentimentrader.com']
    if(allowedReportEmails.includes(email)) this.isReports = true
    if(!allowedReportEmails.includes(email)) this.isReports = false
    
    if(['hao@sentimentrader.com', 'eve@sentimentrader.com'].includes(email)) this.isPortfolio = true
    if(!['hao@sentimentrader.com', 'eve@sentimentrader.com'].includes(email)) this.isPortfolio = false
  },
  methods: {
    getTokenRole() {
      console.log('getTokenRole()', getTokenRole())
      return getTokenRole()
    },
    handleSelect(key, _) {
      let path = ''
      if (key == '1') {
        path = this.$router.resolve({
          path: '/'
        }).href
        this.$router.push(path)
      } else if (key == '3') {
        path = this.$router.resolve({
          path: '/scannerai'
        }).href
        this.$router.push(path)
      } else if (key == '4-1') {
        path = this.$router.resolve({
          path: '/doc'
        }).href
        window.open(path, '_blank')
      } else if (key == '4-2') {
        // path = 'https://users.sentimentrader.com/users/account/support/'
        path = '/doc/disclaimer'
        window.open(path, '_blank')
      } else if (key == '6') {
        path = this.$router.resolve({
          path: '/myindicator'
        }).href
        this.$router.push(path)
      } else if (key == '7') {
        path = this.$router.resolve({
          path: '/seasonality'
        }).href
        this.$router.push(path)
      } else if (key == '8') {
        path = this.$router.resolve({
          path: '/cpm'
        }).href
        this.$router.push(path)
      } else if (key == '9') {
        path = this.$router.resolve({
          path: '/strategy'
        }).href
        this.$router.push(path)
      }else if(key == '10') {
        window.open('https://autotrader-ui-dev-e20d0e03fac4.herokuapp.com/home/aitrade')
      }else if(key == '11') {
        path = this.$router.resolve({
          path: '/portfolio'
        }).href
        this.$router.push(path)
      }else if(key == '12') {
        path = this.$router.resolve({
          path: '/MR/sentimentedge'
        }).href
        this.$router.push(path)
      }else if(key == '13') {
        path = this.$router.resolve({
          path: '/indicators'
        }).href
        this.$router.push(path)
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import "./index.css";
</style>