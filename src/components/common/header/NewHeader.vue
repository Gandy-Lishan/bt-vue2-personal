<template>
  <div>
    <header class="main-nav top">
      <img src="https://cdn.prod.website-files.com/650486dd4239644e595569c1/650486dd4239644e59556a01_ST%20Logo.png" alt="logo image" width="175px" height="35px" @click="backHome">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">
            <i class="fa fa-question-circle" aria-hidden="true" style="margin-right: 3px;"></i>
            Help
            <i class="fa fa-angle-down" aria-hidden="true" style="margin-left: 3px;"></i>
          </template>
          <el-menu-item index="1-1">Tutorial Document</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" class="tutorial-svg">
          <svg width="12" height="12" viewBox="0 0 186 186" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M164.301 0H21.4442C15.761 5.18001e-08 10.3105 2.25765 6.29191 6.27628C2.27327 10.2949 0.0156251 15.7454 0.015625 21.4286V164.286C0.0156251 169.969 2.27327 175.419 6.29191 179.438C10.3105 183.457 15.761 185.714 21.4442 185.714H164.301C169.985 185.714 175.435 183.457 179.454 179.438C183.472 175.419 185.73 169.969 185.73 164.286V21.4286C185.73 15.7454 183.472 10.2949 179.454 6.27628C175.435 2.25765 169.985 5.18001e-08 164.301 0ZM21.4442 14.2857H164.301C166.196 14.2857 168.013 15.0383 169.352 16.3778C170.692 17.7174 171.444 19.5342 171.444 21.4286V164.286C171.444 166.18 170.692 167.997 169.352 169.336C168.013 170.676 166.196 171.429 164.301 171.429H21.4442C19.5498 171.429 17.733 170.676 16.3934 169.336C15.0539 167.997 14.3013 166.18 14.3013 164.286V21.4286C14.3013 19.5342 15.0539 17.7174 16.3934 16.3778C17.733 15.0383 19.5498 14.2857 21.4442 14.2857Z" fill="#333"/>
            <path d="M71.4417 87.6857V145.414C71.4417 149.086 75.4132 151.371 78.5846 149.543L128.585 120.671C129.309 120.254 129.91 119.654 130.328 118.93C130.746 118.206 130.966 117.386 130.966 116.55C130.966 115.714 130.746 114.894 130.328 114.17C129.91 113.447 129.309 112.846 128.585 112.429L78.5846 83.5572C77.8606 83.1375 77.0387 82.9162 76.2018 82.9157C75.365 82.9152 74.5428 83.1354 73.8183 83.5542C73.0938 83.9729 72.4925 84.5754 72.0753 85.3008C71.658 86.0262 71.4395 86.8489 71.4417 87.6857ZM178.585 47.5C180.37 47.4967 182.091 48.1619 183.41 49.3644C184.729 50.567 185.55 52.2198 185.711 53.9975C185.873 55.7751 185.363 57.5487 184.281 58.969C183.2 60.3893 181.627 61.3534 179.87 61.6714L178.585 61.7857H7.15602C5.37108 61.789 3.64959 61.1239 2.33055 59.9213C1.01151 58.7188 0.19051 57.0659 0.0292318 55.2883C-0.132046 53.5106 0.378081 51.737 1.45916 50.3167C2.54024 48.8964 4.11392 47.9323 5.87031 47.6143L7.15602 47.5H178.585Z" fill="#333"/>
            <path d="M129.787 3.18624C130.778 1.70923 132.285 0.65516 134.012 0.23025C135.739 -0.194661 137.563 0.0401642 139.126 0.888783C140.689 1.7374 141.88 3.13875 142.464 4.81867C143.049 6.49858 142.986 8.33618 142.287 9.97196L141.673 11.1148L113.101 53.972C112.113 55.4587 110.604 56.5214 108.871 56.9509C107.139 57.3804 105.308 57.1454 103.74 56.2924C102.171 55.4393 100.979 54.0299 100.399 52.3418C99.8178 50.6537 99.8902 48.8093 100.601 47.172L101.216 46.0291L129.787 3.17196V3.18624ZM72.6443 3.18624C73.6354 1.70923 75.142 0.65516 76.8692 0.23025C78.5965 -0.194661 80.4201 0.0401642 81.9833 0.888783C83.5466 1.7374 84.737 3.13875 85.3216 4.81867C85.9062 6.49858 85.843 8.33618 85.1443 9.97196L84.53 11.1148L55.9586 53.972C54.9704 55.4587 53.4612 56.5214 51.7284 56.9509C49.9957 57.3804 48.1649 57.1454 46.5967 56.2924C45.0285 55.4393 43.8366 54.0299 43.2558 52.3418C42.675 50.6537 42.7473 48.8093 43.4586 47.172L44.0729 46.0291L72.6443 3.17196V3.18624Z" fill="#333"/>
          </svg>
          Tutorial Videos
        </el-menu-item>
      </el-menu>
    </header>
    <header class="main-nav bottom">
      <el-menu :default-active="activeIndex" class="el-menu-demo el-menu-bottom" mode="horizontal" @select="handleSelect">
        <template
          v-for="(item, index) in navs"
        >
          <el-menu-item
            v-if="!item.subMenu && showLabel(item)"
            :class="{'menu-item-active': activeIndex == item.keyPath}"
            :key="index"
            :index="item.keyPath"
          >
          {{item.label}}
          </el-menu-item>
          <el-submenu
            v-else-if="Array.isArray(item.subMenu) && showLabel(item)"
            :class="{'menu-item-active': activeIndex == item.keyPath, 'report-menu': true}"
            :key="index"
            :index="item.keyPath"
          >
          <template slot="title">
            <span>{{item.label}}</span>
            <i class="fa fa-angle-down" aria-hidden="true" style="margin-left: 3px;"></i>
          </template>
            <el-menu-item v-for="(subItem, subIndex) in item.subMenu" :index="subItem.keyPath" :key="subIndex">{{subItem.label}}</el-menu-item>
        </el-submenu>
        </template>
      </el-menu>
    </header>
  </div>
</template>

<script>
import { getTokenRole } from '@/utils'
import { getCookieData } from "@/utils/cryptoUtils/cookie";

export default {
  name: 'NewHeader',
  data() {
    return {
      navs: [
        {
          label: 'Help',
          keyPath: '1',
          path: '/doc',
          subMenu: [
            {
              label: 'Tutorial Document',
              keyPath: '1-1',
              path: '/doc'
            }
          ]
        },
        {
          label: 'Tutorial Videos',
          keyPath: '2',
          path: '/youtube'
        },
        {
          label: 'Strategy',
          keyPath: '3',
          path: '/strategy'
        },
        {
          label: 'BacktestEdge',
          keyPath: '4',
          path: '/backtester'
        },
        {
          label: 'Smart Stock Scanner',
          keyPath: '5',
          path: '/scannerai'
        },
        {
          label: 'My Indicator',
          keyPath: '6',
          path: '/myindicator'
        },
        {
          label: 'Seasonality',
          keyPath: '7',
          path: '/seasonality'
        },
        {
          label: 'Correlation Pattern Match',
          keyPath: '8',
          path: '/cpm'
        },
        {
          label: 'AI Trading',
          keyPath: '9',
          path: 'https://autotrader-ui-dev-e20d0e03fac4.herokuapp.com/home/aitrade'
        },
        {
          label: 'Reports',
          keyPath: '10',
          path: '/MR',
          subMenu: [
            {
              label: 'SentimentEdge',
              keyPath: '10-1',
              path: '/MR/sentimentedge'
            },
            {
              label: 'ModelEdge',
              keyPath: '10-2',
              path: '/MR/modeledge'
            },
            {
              label: 'Kaeppel\'s Corner',
              keyPath: '10-3',
              path: '/MR/quantedge'
            },
            {
              label: 'TradingEdge',
              keyPath: '10-4',
              path: '/MR/tradingedge'
            },
            {
              label: 'My Favorites',
              keyPath: '10-5',
              path: '/MR/favorites'
            },
            {
              label: 'Archived Studies',
              keyPath: '10-6',
              path: '/MR/archived_studies'
            },
            {
              label: 'Daily Report',
              keyPath: '10-7',
              path: '/MR/archived_reports'
            },
            {
              label: 'Active Studies',
              keyPath: '10-8',
              path: '/MR/active_studies'
            },
          ]
        },
        {
          label: 'Indicators',
          keyPath: '11',
          path: '/indicators'
        },
      ],
      activeIndex: '1',
    }
  },
  watch: {
    '$route'(to, _) {
      // 在$route对象变化时执行逻辑
      const path = to.path
      console.log('path', path)
      const nav = this.navs.find(ele => path.includes(ele.path))
      console.log('nav', nav)
      if(nav && !nav.subMenu && (nav.label !== 'AI Trading' && nav.label !== 'Tutorial Videos')) this.activeIndex = nav.keyPath
      if(nav && nav.subMenu) this.activeIndex = nav.subMenu.find(ele => path.includes(ele.path)).keyPath
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if(key === '9') {
        window.open('https://autotrader-ui-dev-e20d0e03fac4.herokuapp.com/home/aitrade')
        return
      }
      if(key === '1-1') {
        this.$router.push('/doc')
        return
      }
      if(key === '2') {
        let path = '/'
        if (this.$route.path.includes('/backtester')) {
          path = 'https://www.youtube.com/playlist?list=PL_pqMRWeHIxPgRS4tQryQ-efk2cNFf0hb'
        }else if(this.$route.path.includes('myindicator') || this.$route.path.includes('MIList')){
          path = 'https://www.youtube.com/playlist?list=PL_pqMRWeHIxNvxaxmrJmLlzizXe38Is_d'
        }
        window.open(path, '_blank')
        return
      }
      this.activeIndex = key
      const keyPathEle = this.navs.map(ele => {
        if(ele.keyPath == key && !ele.subMenu) return ele
        if(ele.subMenu && Array.isArray(ele.subMenu)) {
          return ele.subMenu.find(item => item.keyPath == key)
        }
      }).filter(value => (value !== undefined && value !== null && value !== ''))
      console.log('keyPathEle',keyPathEle)
      if(keyPathEle && Array.isArray(keyPathEle) && keyPathEle.length > 0 && keyPathEle.label !== 'AI Trading') this.$router.push(keyPathEle[0].path)
    },
    showLabel(item) {
      const email = getCookieData()?.username
      const {label} = item
      if(['Strategy', 'BacktestEdge', 'My Indicator', 'Seasonality', 'Correlation Pattern Match', 'Indicators'].includes(label)) {
        return (getTokenRole() != 0 && getTokenRole() != 'None')
      }
      if(label === 'AI Trading') {
        return email === 'hao@sentimentrader.com'
      }
      if(label === 'Portfolio') {
        return ['hao@sentimentrader.com', 'eve@sentimentrader.com'].includes(email)
      }
      if(label === 'Reports') {
        const allowedReportEmails = ['hao@sentimentrader.com', 'dean@sentimentrader.com', 'jason@sentimentrader.com']
        return allowedReportEmails.includes(email)
      }
    },
    backHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.css";
.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 0px 20px 0px 20px;
  border-bottom: 1px solid #eee;
  height: 62px;
  /deep/ .el-menu.el-menu--horizontal {
    border-bottom-color: transparent;
  }
  img {
    padding-left: 10px;
    cursor: pointer;
  }
  &.top ul.el-menu-demo.el-menu--horizontal.el-menu {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.top {
    /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
      color: #333;
    }
    .el-submenu__title i {
      color: #333 !important;
    }
  }
  &.bottom {
    /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
      background-color: #666;
      color: white !important
    }
    .el-submenu__title i {
      color: white !important;
    }
  }
  /deep/ li.el-submenu.report-menu .el-submenu__title{
    color: white;
  }
  /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
    border-bottom: unset;
  }
  /deep/ li.el-submenu.is-active.report-menu {
    color: white !important;
    background-color: #666;
    border-bottom: 4px solid #5b9bd1;
  }
}
.el-menu-item * {
  vertical-align: baseline;
}
.el-menu--horizontal>.el-menu-item {
  font-weight: 600;
}
.el-submenu /deep/ .el-submenu__title {
  font-size: 14px;
}
.main-nav.top {
  /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
    border: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
  }
  li.el-submenu.is-active {
    /deep/ .el-submenu__title {
      border-bottom: 4px solid #5b9bd1 !important;
    }
  }
}
/deep/ li.el-menu-item.tutorial-svg {
  border: 1px solid #ccc;
  height: 40px;
  line-height: 40px;
}
/deep/ .el-submenu__title, .tutorial-svg {
  border-bottom-color: #ccc !important;
  color: black;
}
.el-menu--horizontal.el-menu-bottom {
  display: flex;
  width: 100%;
  align-items: center;
}
li.el-menu-item.is-active.menu-item-active {
  color: black !important;
  background-color: #666;
}
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 4px solid #5b9bd1 !important;
}
.help-link-active, .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  color: black !important;
  background-color: #666 !important;
}
.el-menu--horizontal.el-menu-bottom li.el-menu-item {
  text-align: center;
  color: white !important;
}
.el-menu--horizontal.el-menu-bottom li.el-menu-item:hover {
  background-color: #666 !important;
}
.el-menu--horizontal .el-menu .el-menu-item, .el-menu--horizontal .el-menu .el-submenu__title {
  font-weight: 600;
}
.main-nav.bottom {
  background-color: black;
}
.bottom .el-menu.el-menu--horizontal {
  background-color: black;
}
li.el-menu-item.tutorial-svg:hover {
  color: #909399;
}
</style>