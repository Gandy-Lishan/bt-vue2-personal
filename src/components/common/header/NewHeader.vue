<template>
  <div class="no-print">
    <header class="main-nav top">
      <img src="https://cdn.prod.website-files.com/650486dd4239644e595569c1/650486dd4239644e59556a01_ST%20Logo.png" alt="logo image" width="175px" height="35px" @click="backHome">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <div class="btn-group" id="notifications-group">
          <a
            href='/notifications'
            class="iconify"
          >
            <i id="notification-icon" class="fa fa-bell" style="vertical-align: middle; font-size: 22px;"></i>
            <span id="notifications-badge" class="badge badge-default"></span>
          </a>
        </div>
        <div class="btn-group" id="btv1-group">
          <el-tooltip
            class="item"
            effect="dark"
            content="Back to Classic Site"
            placement="bottom-end"
					>
          <a
            href="https://users.sentimentrader.com/users/"
            class="iconify"
          >
            <i class="fa fa-home" style="vertical-align: middle; font-size: 28px; color: #5b9bd1"></i>
          </a>
          </el-tooltip>
        </div>
        <!-- <el-menu-item index="2" class="tutorial-svg">
          <svg width="12" height="12" viewBox="0 0 186 186" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M164.301 0H21.4442C15.761 5.18001e-08 10.3105 2.25765 6.29191 6.27628C2.27327 10.2949 0.0156251 15.7454 0.015625 21.4286V164.286C0.0156251 169.969 2.27327 175.419 6.29191 179.438C10.3105 183.457 15.761 185.714 21.4442 185.714H164.301C169.985 185.714 175.435 183.457 179.454 179.438C183.472 175.419 185.73 169.969 185.73 164.286V21.4286C185.73 15.7454 183.472 10.2949 179.454 6.27628C175.435 2.25765 169.985 5.18001e-08 164.301 0ZM21.4442 14.2857H164.301C166.196 14.2857 168.013 15.0383 169.352 16.3778C170.692 17.7174 171.444 19.5342 171.444 21.4286V164.286C171.444 166.18 170.692 167.997 169.352 169.336C168.013 170.676 166.196 171.429 164.301 171.429H21.4442C19.5498 171.429 17.733 170.676 16.3934 169.336C15.0539 167.997 14.3013 166.18 14.3013 164.286V21.4286C14.3013 19.5342 15.0539 17.7174 16.3934 16.3778C17.733 15.0383 19.5498 14.2857 21.4442 14.2857Z" fill="#333"/>
            <path d="M71.4417 87.6857V145.414C71.4417 149.086 75.4132 151.371 78.5846 149.543L128.585 120.671C129.309 120.254 129.91 119.654 130.328 118.93C130.746 118.206 130.966 117.386 130.966 116.55C130.966 115.714 130.746 114.894 130.328 114.17C129.91 113.447 129.309 112.846 128.585 112.429L78.5846 83.5572C77.8606 83.1375 77.0387 82.9162 76.2018 82.9157C75.365 82.9152 74.5428 83.1354 73.8183 83.5542C73.0938 83.9729 72.4925 84.5754 72.0753 85.3008C71.658 86.0262 71.4395 86.8489 71.4417 87.6857ZM178.585 47.5C180.37 47.4967 182.091 48.1619 183.41 49.3644C184.729 50.567 185.55 52.2198 185.711 53.9975C185.873 55.7751 185.363 57.5487 184.281 58.969C183.2 60.3893 181.627 61.3534 179.87 61.6714L178.585 61.7857H7.15602C5.37108 61.789 3.64959 61.1239 2.33055 59.9213C1.01151 58.7188 0.19051 57.0659 0.0292318 55.2883C-0.132046 53.5106 0.378081 51.737 1.45916 50.3167C2.54024 48.8964 4.11392 47.9323 5.87031 47.6143L7.15602 47.5H178.585Z" fill="#333"/>
            <path d="M129.787 3.18624C130.778 1.70923 132.285 0.65516 134.012 0.23025C135.739 -0.194661 137.563 0.0401642 139.126 0.888783C140.689 1.7374 141.88 3.13875 142.464 4.81867C143.049 6.49858 142.986 8.33618 142.287 9.97196L141.673 11.1148L113.101 53.972C112.113 55.4587 110.604 56.5214 108.871 56.9509C107.139 57.3804 105.308 57.1454 103.74 56.2924C102.171 55.4393 100.979 54.0299 100.399 52.3418C99.8178 50.6537 99.8902 48.8093 100.601 47.172L101.216 46.0291L129.787 3.17196V3.18624ZM72.6443 3.18624C73.6354 1.70923 75.142 0.65516 76.8692 0.23025C78.5965 -0.194661 80.4201 0.0401642 81.9833 0.888783C83.5466 1.7374 84.737 3.13875 85.3216 4.81867C85.9062 6.49858 85.843 8.33618 85.1443 9.97196L84.53 11.1148L55.9586 53.972C54.9704 55.4587 53.4612 56.5214 51.7284 56.9509C49.9957 57.3804 48.1649 57.1454 46.5967 56.2924C45.0285 55.4393 43.8366 54.0299 43.2558 52.3418C42.675 50.6537 42.7473 48.8093 43.4586 47.172L44.0729 46.0291L72.6443 3.17196V3.18624Z" fill="#333"/>
          </svg>
          Tutorial Videos
        </el-menu-item> -->
        <el-submenu index="1">
          <template slot="title">
            Tutorial
            <i class="fa fa-angle-down" aria-hidden="true" style="margin-left: 3px;"></i>
          </template>
          <el-menu-item index="1-2">
            <i class="fa fa-play" aria-hidden="true" style="margin-right: 5px;"></i>
            Backtest Videos
          </el-menu-item>
          <el-menu-item index="1-3"><i class="fa fa-play" aria-hidden="true" style="margin-right: 5px;"></i>Overview Videos</el-menu-item>
          <el-menu-item index="1-4"><i class="fa fa-play" aria-hidden="true" style="margin-right: 5px;"></i>Analyst's Backtest Videos</el-menu-item>
          <el-menu-item index="1-5"><i class="fa fa-play" aria-hidden="true" style="margin-right: 5px;"></i>Other Tools Videos</el-menu-item>
          <el-menu-item index="1-6"><i class="fa fa-play" aria-hidden="true" style="margin-right: 5px;"></i>Webinar Videos</el-menu-item>
          <el-menu-item index="1-1"><i class="fa fa-book" aria-hidden="true" style="margin-right: 5px;"></i>BacktestEdge Document</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            Help
            <i class="fa fa-angle-down" aria-hidden="true" style="margin-left: 3px;"></i>
          </template>
          <el-menu-item index="2-1"><i class="fa fa-arrow-right" style="margin-right: 10px;"></i>Getting Started</el-menu-item>
          <el-menu-item index="2-2"><i class="fa fa-question" style="margin-right: 10px;"></i>Knowledge Base / FAQ's</el-menu-item>
          <el-menu-item index="2-3"><i class="fa fa-book" style="margin-right: 10px;"></i>Glossary of Terms</el-menu-item>
          <el-menu-item index="2-4"><i class="fa fa-plus" style="margin-right: 10px;"></i>Whats New</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            My Account
            <i class="fa fa-angle-down" aria-hidden="true" style="margin-left: 3px;"></i>
          </template>
          <el-menu-item index="3-1"><i class="fa fa-cog" style="margin-right: 10px;"></i>Website Preferences</el-menu-item>
          <el-menu-item index="3-2"><i class="fa fa-user" style="margin-right: 10px;"></i>Manage Account</el-menu-item>
          <el-menu-item index="3-3"><i class="fa fa-key" style="margin-right: 10px;"></i>Manage Password</el-menu-item>
          <el-menu-item index="3-4"><i class="fa fa-comment" style="margin-right: 10px;"></i>Contact Support</el-menu-item>
          <el-menu-item index="3-5"><i class="fa fa-info" style="margin-right: 10px;"></i>Status Page</el-menu-item>
          <el-menu-item index="3-6"><i class="fa fa-sign-out" style="margin-right: 10px;"></i>Log out</el-menu-item>
        </el-submenu>
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
            <span @click.stop="handleSubmenuClick(item)">{{item.label}}</span>
            <i class="fa fa-angle-down" aria-hidden="true" style="margin-left: 3px;"></i>
          </template>
          <template  v-for="(subItem, subIndex) in item.subMenu">
            <el-menu-item v-if="!Array.isArray(subItem.subMenuItem)" :index="subItem.keyPath" :key="subIndex">
              {{subItem.label}}
            </el-menu-item>
            <template v-if="Array.isArray(subItem.subMenuItem) && subItem.subMenuItem.length > 0">
            <el-divider :key="subIndex"></el-divider>
            <el-menu-item
              v-for="(child, childIndex) in subItem.subMenuItem"
              :index="child.keyPath"
              :key="childIndex"
            >
              {{ child.label }}
            </el-menu-item>
          </template>
          </template>
        </el-submenu>
        </template>
      </el-menu>
      <div class="autocomplete-wrapper">
        <autocomplete />
      </div>
    </header>
  </div>
</template>

<script>

import { getCookieData } from "@/utils/cryptoUtils/cookie";
import autocomplete from "./component/AlgoliaAutocomplete.vue";
import { checkEmail } from "@/service/service";
import { LocalStorageUtil } from '@/utils'

export default {
  name: 'NewHeader',
  components: {
    autocomplete
  },
  data() {
    return {
      navs: [
        {
          label: 'Dashboard',
          keyPath: '14',
          path: '/dashboard'
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
              label: 'Market Impact Analysis',
              keyPath: '10-10',
              path: '/MR/impactedge'
            },
            {
              label: 'My Favorites',
              keyPath: '10-5',
              path: '/MR/favorites'
            },
            {
              label: 'Active Studies',
              keyPath: '10-8',
              path: '/MR/active_studies'
            },
            {
              label: 'Intraday Minutes',
              keyPath: '10-9',
              path: '/MR/minutes'
            },
            {
              label: 'Daily Report',
              keyPath: '10-7',
              path: '/MR/archived_reports/2025'
            },
            {
              label: 'Archived Studies',
              keyPath: '10-6',
              path: '/MR/archived_studies'
            },
          ]
        },
        {
          label: 'Indicators',
          keyPath: '11',
          path: '/indicators'
        },
        {
          label: 'Trend Score',
          keyPath: '12',
          path: '/trend_score'
        },
        {
          label: 'Strategies',
          keyPath: '3',
          path: '/strategy'
        },
        {
          label: 'BacktestEdge',
          keyPath: '4',
          path: '/backtester',
          subMenu: [
            {
              label: 'Backtest Set Up',
              keyPath: '4-1',
              path: '/backtester/sr/setup'
            },
            {
              label: 'Backtest List',
              keyPath: '4-2',
              path: '/backtester/list/history'
            },
            {
              label: 'My Favorite Backtests',
              keyPath: '4-3',
              path: '/backtester/list/favorites'
            },
            {
              label: 'Sample Backtests',
              keyPath: '4-4',
              path: '/backtester/list/sample'
            },
            {
              label: 'Analysts\' Backtests',
              keyPath: '4-5',
              path: '/backtester/list/analyst'
            },
            {
              label: 'Subscriber Shared Backtests',
              keyPath: '4-7',
              path: '/backtester/list/shared'
            },
            {
              label: 'Backtest Concierge Setup Service',
              keyPath: '4-6',
              path: '/contact'
            }
          ]
        },
        {
          label: 'Smart Stock Scanner',
          keyPath: '5',
          path: '/scannerai'
        },
        {
          label: 'Seasonality',
          keyPath: '7',
          path: '/seasonality'
        },
        {
          label: 'Correlation',
          keyPath: '8',
          path: '/cpm',
          subMenu: [
            {
              label: 'Correlation Pattern Match',
              keyPath: '8-1',
              path: '/cpm/list'
            },
            {
              label: 'Symbol Correlation',
              keyPath: '8-2',
              path: '/cpm/symbol'
            },
            {
              label: 'Asset Correlation',
              keyPath: '8-3',
              path: '/cpm/asset'
            },
            {
              label: 'Date Range Correlation',
              keyPath: '8-4',
              path: '/cpm/pattern'
            }
          ]
        },
        {
          label: 'My Stuff',
          keyPath: '6',
          path: '/myindicator',
          subMenu: [
            {
              label: 'My Indicator',
              keyPath: '6-1',
              path: '/myindicator'
            },
            {
              label: 'My Signal',
              keyPath: '6-2',
              path: '/my_signals'
            },
            {
              label: 'My Screen',
              keyPath: '6-3',
              path: '/my_screen'
            },
            {
              label: 'My Watch List',
              keyPath: '6-4',
              path: '/watchlist'
            },
          ]
        },
        {
          label: 'AI Trading',
          keyPath: '10',
          path: 'https://autotrader-ui-dev-e20d0e03fac4.herokuapp.com/home/aitrade'
        },
        {
          label: 'Market Prediction',
          keyPath: '13',
          path: '/market/predict'
        },
        {
          label: 'Extra Tools',
          keyPath: '15',
          path: '/tools',
          subMenu: [
            {
              label: 'Intraday charts',
              keyPath: '15-1',
              path: 'https://users.sentimentrader.com/users/intraday/'
            },
            {
              label: 'Global Breadth Overview',
              keyPath: '15-2',
              path: 'https://users.sentimentrader.com/users/country_breadth_overview/'
            },
            {
              label: 'Monthly Update Archives',
              keyPath: '15-3',
              path: 'https://users.sentimentrader.com/users/monthly_archived_reports/'
            },
            {
              label: 'Market Sentiment Overview',
              keyPath: '15-4',
              path: 'https://users.sentimentrader.com/users/market_overview/'
            },
            {
              label: 'Optix Heatmap',
              keyPath: '15-5',
              path: 'https://users.sentimentrader.com/users/heatmap_optix/ALL'
            },
            {
              label: 'Optix Heatmap for stocks',
              keyPath: '15-6',
              path: 'https://users.sentimentrader.com/users/heatmap_symbol/XLB'
            },
            {
              label: 'User Defined Optix Heatmap',
              keyPath: '15-7',
              path: 'https://users.sentimentrader.com/users/heatmap_user_select/'
            },
            {
              label: 'Optix Geomap',
              keyPath: '15-8',
              path: 'https://users.sentimentrader.com/users/geo_sentiment'
            },
            {
              label: 'Risk Levels',
              keyPath: '15-9',
              path: 'https://users.sentimentrader.com/users/charts/risk_levels'
            },
            {
              label: 'Optix Phase Table',
              keyPath: '15-10',
              path: 'https://users.sentimentrader.com/users/phases/'
            },
            {
              label: 'Ranks',
              keyPath: '15-11',
              path: 'https://users.sentimentrader.com/users/ranks/'
            },
            {
              label: 'Index Seasonality',
              keyPath: '15-12',
              path: 'https://users.sentimentrader.com/users/index_seasonality/'
            },
            {
              label: 'Seasonality Calendar',
              keyPath: '15-13',
              path: 'https://users.sentimentrader.com/users/seasonality_calendar/'
            },
            {
              label: 'Spotlights',
              keyPath: '15-14',
              subMenuItem: [
                {
                  label: 'Risk On/Off Composite',
                  keyPath: '15-14-1',
                  path: 'https://users.sentimentrader.com/users/sentiment_spotlight/'
                },
                {
                  label: 'Market Environment Composite',
                  keyPath: '15-14-2',
                  path: 'https://users.sentimentrader.com/users/market_health_spotlight/'
                },
                {
                  label: 'Tactical Composite Trend Model',
                  keyPath: '15-14-3',
                  path: 'https://users.sentimentrader.com/users/content/tctm-and-component-updates/'
                },
                {
                  label: 'Market Breadth',
                  keyPath: '15-14-4',
                  path: 'https://users.sentimentrader.com/users/breadth_overview/'
                },
                {
                  label: 'Bonds',
                  keyPath: '15-14-5',
                  path: 'https://users.sentimentrader.com/users/sector_overview/bonds'
                },
                {
                  label: ' Energy',
                  keyPath: '15-14-6',
                  path: 'https://users.sentimentrader.com/users/sector_overview/energy'
                },
                {
                  label: 'Gold',
                  keyPath: '15-14-7',
                  path: 'https://users.sentimentrader.com/users/sector_overview/gold'
                },
                {
                  label: 'Macro',
                  keyPath: '15-14-8',
                  path: 'https://users.sentimentrader.com/users/sector_overview/macro'
                },
                
              ]
            }
          ]
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
      if(path.includes('/sector_trend_score')) {this.activeIndex = '12'; return}
      if(path.includes('/contact')) {this.activeIndex = '4-6'; return}
      if(nav && !nav.subMenu && (nav.label !== 'AI Trading' && nav.label !== 'Tutorial Videos')) this.activeIndex = nav.keyPath
      if(nav && nav.subMenu) {
        const navSubPath = nav.subMenu.find(ele => path.includes(ele.path))?.keyPath
        if(navSubPath) this.activeIndex =navSubPath
        else if(!navSubPath && to.path.includes('/MR')) {this.activeIndex = '10-1'}
        else if(!navSubPath && to.path.includes('/backtester')) {this.activeIndex = '4'}
      }

      // my stuff
      if(['/myindicator', '/my_signals', '/my_screen', '/watchlist'].includes(path)) {
        this.activeIndex = this.navs.find(ele => ele.keyPath == 6)?.subMenu.find(ele => ele.path == path)?.keyPath
      }
    }
  },
  async created() {
    const access_level = getCookieData()?.access_level
    const email = getCookieData()?.username
		const allowedUserList = ['jay@sentimentrader.com', 'dean@sentimentrader.com', 'jason@sentimentrader.com', 'hao@sentimentrader.com', 'jinjing@elixiroftechnology.com', 'kian@sentimentrader.com']
    let exists = LocalStorageUtil.get('upgradeUserLevel')
    if(!exists) {
      let {data:{exists:_exists}} = await checkEmail(getCookieData()?.username)
      exists = _exists
      LocalStorageUtil.set('upgradeUserLevel', exists)
    }
    // 权限验证的时候, report 子项要去掉: reports, corelite
    const canOnlyAccessPartOfReport = access_level.some(str => str.includes('reports')) || access_level.some(str => str.includes('corelite'))
    if(canOnlyAccessPartOfReport) {
      const reportIndex = this.navs.findIndex(ele => ele.label === 'Reports')
      const backtestIndex = this.navs.findIndex(ele => ele.label.includes('Backtest'))
      if(reportIndex !== -1) {
        this.navs[reportIndex].subMenu = [
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
              label: 'Market Impact Analysis',
              keyPath: '10-10',
              path: '/MR/impactedge'
          },
          {
              label: 'My Favorites',
              keyPath: '10-5',
              path: '/MR/favorites'
          }
        ]
      }
      if(backtestIndex !== -1 && canOnlyAccessPartOfReport) {
        this.navs[backtestIndex].subMenu = [
            {
              label: 'Backtest Set Up',
              keyPath: '4-1',
              path: '/backtester/sr/setup'
            },
            {
              label: 'Sample Backtests',
              keyPath: '4-4',
              path: '/backtester/list/sample'
            },
            {
              label: 'Analysts\' Backtests',
              keyPath: '4-5',
              path: '/backtester/list/analyst'
            },
            {
              label: 'Backtest Concierge Setup Service',
              keyPath: '4-6',
              path: '/contact'
            }
        ]
      }
    }
  },
  methods: {
    handleSubmenuClick(item) {
      if (Array.isArray(item.subMenu) && item.subMenu.length > 0) {
        const firstSubItem = item.subMenu[0];
        // 手动触发 handleSelect
        this.handleSelect(firstSubItem.keyPath);
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if(key === '10') {
        window.open('https://autotrader-ui-dev-e20d0e03fac4.herokuapp.com/home/aitrade')
        return
      }
      if(key === '1-1') {
        this.$router.push('/doc')
        return
      }
      else if(key === '1-2') {
        let path = 'https://users.sentimentrader.com/users/backtest_videos/'
        window.open(path, '_blank')
        return
      }
      else if(key === '1-3') {
        let path = 'https://users.sentimentrader.com/users/videos/'
        window.open(path, '_blank')
        return
      }
      else if(key === '1-4') {
        let path = 'https://users.sentimentrader.com/users/analysts_backtest_videos/'
        window.open(path, '_blank')
        return
      }
      else if(key === '1-5') {
        let path = 'https://users.sentimentrader.com/users/others_videos/'
        window.open(path, '_blank')
        return
      }
      else if(key === '1-6') {
        let path = 'https://users.sentimentrader.com/users/webinar_videos/'
        window.open(path, '_blank')
        return
      }
      else if(key === '2-1') {
        let path = 'https://users.sentimentrader.com/users/getting_started/'
        window.open(path, '_blank')
        return
      }
      else if(key === '2-2') {
        let path = 'https://users.sentimentrader.com/users/knowledge_base/'
        window.open(path, '_blank')
        return
      }
      else if(key === '2-3') {
        let path = 'https://users.sentimentrader.com/users/knowledge_base_article/Glossary%20of%20terms'
        window.open(path, '_blank')
        return
      }
      else if(key === '2-4') {
        let path = 'https://users.sentimentrader.com/users/knowledge_base_article/Whats%20New%20-%20Updates%20and%20New%20Features'
        window.open(path, '_blank')
        return
      }
      else if(key === '3-1') {
        let path = 'https://users.sentimentrader.com/users/preferences/'
        window.open(path, '_blank')
        return
      }
      else if(key === '3-2') {
        let path = 'https://account.sentimentrader.com/'
        window.open(path, '_blank')
        return
      }
      else if(key === '3-3') {
        let path = 'https://users.sentimentrader.com/users/account/mypassword/'
        window.open(path, '_blank')
        return
      }
      else if(key === '3-4') {
        let path = 'https://users.sentimentrader.com/users/account/support/'
        window.open(path, '_blank')
        return
      }
      else if(key === '3-5') {
        let path = 'http://status.sentimentrader.com/'
        window.open(path, '_blank')
        return
      }
      else if(key === '3-6') {
        // 删除 cookie
        const removeCookie = ({name, domain}) => {
          document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }

        [{name: 'sentimen_session', domain: '.sentimentrader.com'}, {name: 'session', domain: 'users.sentimentrader.com'}].forEach(removeCookie)
        // 调用
        removeCookie(['sentimen_session', 'session'])
        // Cookies.remove('session')
        this.$store.commit('states/setErrorMessage404', {
					status: 401,
					message: 'You have not logged in and do not have the access permission, Please sign in first'
				})
        this.$router.push('/404')
        return
      } else if(key.includes('15')) {
        let path = this.navs.find(ele => ele.keyPath == '15')?.subMenu.find(item => item.keyPath == key)?.path || this.navs.find(ele => ele.keyPath == '15')?.subMenu.find(item => item.keyPath.includes('15-14'))?.subMenuItem.find(subItem => subItem.keyPath == key)?.path
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
      if(keyPathEle && Array.isArray(keyPathEle) && keyPathEle.length > 0 && keyPathEle.label !== 'AI Trading' && key.includes('4-')) {
        window.location.href = keyPathEle[0].path + "#scrollAnchor"
      }
      else if(keyPathEle && Array.isArray(keyPathEle) && keyPathEle.length > 0 && keyPathEle.label !== 'AI Trading') window.location.href = keyPathEle[0].path
    },
    handleClick(e) {
      console.log('e', e)
    },
    showLabel(item) {
      const email = getCookieData()?.username
      const access_level = getCookieData()?.access_level
      const {label} = item
			const essentialLevel = (access_level.some(str => str.includes('essential')) || access_level.some(str => str.includes('research')))
      const exists = LocalStorageUtil.get('upgradeUserLevel')
      const accessAllPage = access_level.some(str => str.includes('everything')) || access_level.some(str => str.includes('premium')) || (essentialLevel && exists)
      const cannotAccessScanner = essentialLevel && !exists
      const cannotAccessReport = access_level.some(str => str.includes('datalite'))
      const canOnlyAccessReport = access_level.some(str => str.includes('reports'))
      const canOnlyAccessReportStategyScanner = access_level.some(str => str.includes('corelite'))
debugger
      if(['Strategies', 'My Indicator', 'Seasonality', 'Correlation', 'Indicators', 'Trend Score', 'My Stuff', 'Extra Tools'].includes(label)) {
        return accessAllPage || cannotAccessScanner || cannotAccessReport || (canOnlyAccessReportStategyScanner && label === 'Strategies')
      }
      if(label === 'BacktestEdge') {
        return accessAllPage || cannotAccessScanner || cannotAccessReport || (canOnlyAccessReportStategyScanner && label === 'Strategies') || canOnlyAccessReport
      }
      if(label === 'Smart Stock Scanner') {
        return accessAllPage  || cannotAccessReport || canOnlyAccessReportStategyScanner
      }
      if(label === 'AI Trading' || label === 'Market Prediction') {
        return email === 'hao@sentimentrader.com'
      }
      if(label === 'Portfolio') {
        return ['hao@sentimentrader.com', 'eve@sentimentrader.com'].includes(email)
      }
      if(label === 'Reports' || label === 'Dashboard') return accessAllPage || cannotAccessScanner || !cannotAccessReport|| canOnlyAccessReport || canOnlyAccessReportStategyScanner
      // if(label === 'Reports') {
      //   const allowedReportEmails = ['hao@sentimentrader.com', 'dean@sentimentrader.com', 'jason@sentimentrader.com']
      //   return allowedReportEmails.includes(email)
      // }
    },
    backHome() {
      this.$router.push('/')
    },
    animationUp: function (ph) {
      this.$nextTick(() => {
        window.scrollTo({
          top: ph,
          behavior: 'smooth'
        })
      })
    },
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
  /deep/ .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover {
    background-color: #5b9bd1 !important;
  }
  /deep/ .el-menu.el-menu--horizontal {
    border-bottom-color: transparent;
  }
  .el-menu-item {
    font-size: 14px;
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
      color: #000000;
    }
    .el-submenu__title i {
      color: #333 !important;
    }
  }
  &.bottom {
    /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
      background-color: #5b9bd1;
      color: white !important
    }
    .el-submenu__title i {
      color: white !important;
    }
    .report-menu /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
      height: 56px !important;
    }
    /deep/ .el-menu--horizontal>.el-menu-item:not(.is-disabled):not(.is-active):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):not(.is-active):hover {
    background-color: #666 !important;
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
    background-color: #5b9bd1;
    border-bottom: 4px solid #5b9bd1;
  }
}
.el-menu-item * {
  vertical-align: baseline;
}
.el-menu--horizontal>.el-menu-item {
  font-weight: 600;
}
// .el-submenu /deep/ .el-submenu__title {
//   font-size: 16px;
// }
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
  background-color: rgb(91, 155, 209);
}
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 4px solid #5b9bd1 !important;
}
.help-link-active, .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  color: black !important;
  background-color:  rgb(91, 155, 209) !important;
}
.el-menu--horizontal.el-menu-bottom li.el-menu-item {
  text-align: center;
  color: white !important;
}
// .el-menu--horizontal.el-menu-bottom li.el-menu-item:hover {
//   background-color: #666 !important;
// }
.el-menu--horizontal .el-menu .el-menu-item, .el-menu--horizontal .el-menu .el-submenu__title {
  font-weight: 600;
}
.main-nav.bottom {
  background-color: black;
  position: relative;
}
.bottom .el-menu.el-menu--horizontal {
  background-color: black;
  position: absolute;
}
@media (max-width: 768px) {
.main-nav {
  overflow-x: scroll;
  overflow-y: hidden;
  img {
    margin-right: 35px;
  }
  &.bottom {
    overflow-x: scroll;
    overflow-y: hidden;
  }
}
}
li.el-menu-item.tutorial-svg:hover {
  color: #909399;
}


.autocomplete-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;
  padding-left: 16px;
}

// notification
#notifications-group,#btv1-group {
    padding: 0 16px 0 0;
    margin-right: 10px;
}
.btn-group {
    position: relative;
    display: inline-block;
    vertical-align: middle;
}

.badge {
    position: absolute;
    right: 32px;
    font-weight: 300;
    background-color: #f36a5a;
    background-image: none;

}
.badge {
    font-size: 11px!important;
    height: 18px;
    border-radius: 12px!important;
    text-shadow: none!important;
    text-align: center;
    vertical-align: middle;
}
.badge {
    display: none;
    min-width: 18px;
    line-height: 18px;
    color: #fff;
    white-space: nowrap;
    padding: 0 2px;
}
#notification-icon {
  color: grey; //default color
}
</style>