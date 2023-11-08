<template>
  <div class="navbar">
    <div class="header_logo">
      <div class="logo_container" @click="$router.push('/backtester/sr/setup')">
        <span
          ><img
            style="width: 190px; height: 50px"
            src="../../../assets/logo.png"
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
        <el-menu-item class="ai-link" v-if="activeIndex==3"
          >AI Stock Scanner</el-menu-item
        >
        <!-- <el-menu-item class="home-link" v-if="activeIndex==1"
          >BacktestEdge</el-menu-item
        > -->
        <el-menu-item class="home-link" index="1"
          >BacktestEdge</el-menu-item
        >
        <el-menu-item class="my-indicator-link home-link" index="6"
          >My Indicator</el-menu-item
        >
        <el-menu-item class="seasonality-link home-link" index="7"
          >Seasonality</el-menu-item
        >

        <el-submenu class="help-title" index="4">
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
        <el-submenu index="5">
          <template slot="title"
            ><i class="el-icon-s-tools tools"></i
          ></template>
          <!-- <el-menu-item index="5-1">User: {{$store.state.app.role}}</el-menu-item> -->
          <!-- <el-menu-item index="5-1">Theme</el-menu-item> -->
          <!-- <el-menu-item index="5-2">Language</el-menu-item> -->
        </el-submenu>
      </el-menu>
    </div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
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
      activeIndex: '1'
    }
  },
  computed: {

  },
  watch: {
    '$route'(to, _) {
      console.log('to', to)
      // 在$route对象变化时执行逻辑
      if (to.path == '/strategy') {
        this.activeIndex = '2'
      } else if (to.path.includes('/backtester') || to.name == 'Backtests') {
        this.activeIndex = '1'
      } else if (to.path.includes('/scannerai') || to.name == 'scannerai_chart') {
        this.activeIndex = '3'
      }else if(to.path.includes('/myindicator') || to.name ==  'MIList'){
        this.activeIndex = '6'
      }else if(to.path.includes('/seasonality') || to.name == 'seasonality'){
        this.activeIndex = '7'
      }
      }
  },
  mounted() {
    if (this.$route.name == 'strategy') {
      this.activeIndex = '2'
    } else if (this.$route.name == 'backtester' || this.$route.name == 'Backtests') {
      this.activeIndex = '1'
    } else if (this.$route.name == 'scannerai' || this.$route.name == 'scannerai_chart') {
      this.activeIndex = '3'
    } else if(this.$route.name == 'myindicator' || this.$route.name == 'MIList'){
      this.activeIndex = '6'
    } else if(this.$route.name == 'seasonality' || this.$route.name == 'seasonality'){
      this.activeIndex = '7'
    }
  },
  methods: {
    handleSelect(key, _) {
      let path = ''
      if (key == '1') {
        path = this.$router.resolve({
          path: '/'
        }).href
        this.$router.push(path)
      } else if (key == '2') {
        path = this.$router.resolve({
          path: '/home/strategy'
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
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import "./index.css";
</style>