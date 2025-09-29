<template>
<div>
  <div class="gradient">
    <div class="btn-group">
      <button class="tutorial" @click="jumpToTutoiral">
					<svg width="15" height="15" viewBox="0 0 186 186" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M164.301 0H21.4442C15.761 5.18001e-08 10.3105 2.25765 6.29191 6.27628C2.27327 10.2949 0.0156251 15.7454 0.015625 21.4286V164.286C0.0156251 169.969 2.27327 175.419 6.29191 179.438C10.3105 183.457 15.761 185.714 21.4442 185.714H164.301C169.985 185.714 175.435 183.457 179.454 179.438C183.472 175.419 185.73 169.969 185.73 164.286V21.4286C185.73 15.7454 183.472 10.2949 179.454 6.27628C175.435 2.25765 169.985 5.18001e-08 164.301 0ZM21.4442 14.2857H164.301C166.196 14.2857 168.013 15.0383 169.352 16.3778C170.692 17.7174 171.444 19.5342 171.444 21.4286V164.286C171.444 166.18 170.692 167.997 169.352 169.336C168.013 170.676 166.196 171.429 164.301 171.429H21.4442C19.5498 171.429 17.733 170.676 16.3934 169.336C15.0539 167.997 14.3013 166.18 14.3013 164.286V21.4286C14.3013 19.5342 15.0539 17.7174 16.3934 16.3778C17.733 15.0383 19.5498 14.2857 21.4442 14.2857Z" fill="white"/>
					<path d="M71.4417 87.6857V145.414C71.4417 149.086 75.4132 151.371 78.5846 149.543L128.585 120.671C129.309 120.254 129.91 119.654 130.328 118.93C130.746 118.206 130.966 117.386 130.966 116.55C130.966 115.714 130.746 114.894 130.328 114.17C129.91 113.447 129.309 112.846 128.585 112.429L78.5846 83.5572C77.8606 83.1375 77.0387 82.9162 76.2018 82.9157C75.365 82.9152 74.5428 83.1354 73.8183 83.5542C73.0938 83.9729 72.4925 84.5754 72.0753 85.3008C71.658 86.0262 71.4395 86.8489 71.4417 87.6857ZM178.585 47.5C180.37 47.4967 182.091 48.1619 183.41 49.3644C184.729 50.567 185.55 52.2198 185.711 53.9975C185.873 55.7751 185.363 57.5487 184.281 58.969C183.2 60.3893 181.627 61.3534 179.87 61.6714L178.585 61.7857H7.15602C5.37108 61.789 3.64959 61.1239 2.33055 59.9213C1.01151 58.7188 0.19051 57.0659 0.0292318 55.2883C-0.132046 53.5106 0.378081 51.737 1.45916 50.3167C2.54024 48.8964 4.11392 47.9323 5.87031 47.6143L7.15602 47.5H178.585Z" fill="white"/>
					<path d="M129.787 3.18624C130.778 1.70923 132.285 0.65516 134.012 0.23025C135.739 -0.194661 137.563 0.0401642 139.126 0.888783C140.689 1.7374 141.88 3.13875 142.464 4.81867C143.049 6.49858 142.986 8.33618 142.287 9.97196L141.673 11.1148L113.101 53.972C112.113 55.4587 110.604 56.5214 108.871 56.9509C107.139 57.3804 105.308 57.1454 103.74 56.2924C102.171 55.4393 100.979 54.0299 100.399 52.3418C99.8178 50.6537 99.8902 48.8093 100.601 47.172L101.216 46.0291L129.787 3.17196V3.18624ZM72.6443 3.18624C73.6354 1.70923 75.142 0.65516 76.8692 0.23025C78.5965 -0.194661 80.4201 0.0401642 81.9833 0.888783C83.5466 1.7374 84.737 3.13875 85.3216 4.81867C85.9062 6.49858 85.843 8.33618 85.1443 9.97196L84.53 11.1148L55.9586 53.972C54.9704 55.4587 53.4612 56.5214 51.7284 56.9509C49.9957 57.3804 48.1649 57.1454 46.5967 56.2924C45.0285 55.4393 43.8366 54.0299 43.2558 52.3418C42.675 50.6537 42.7473 48.8093 43.4586 47.172L44.0729 46.0291L72.6443 3.17196V3.18624Z" fill="white"/>
					</svg>
          <span>Watch BacktestEdge Tutorial</span>
				</button>
        <button class="createNew" @click="refreshPageTemp">
					<svg
						class="sidebar_button_icon"
						width="15"
						height="15"
						viewBox="0 0 12 12"
						fill="white"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M2.65079 2.59434C3.35727 1.87621 4.22963 1.43305 5.14214 1.26312L4.91451 0C3.75791 0.215381 2.65102 0.77807 1.75752 1.68632C-0.585841 4.06838 -0.585841 7.93048 1.75752 10.3125L0.679249 11.4086H3.72907V8.30844L2.65079 9.40452C0.80077 7.52394 0.80077 4.47492 2.65079 2.59434ZM11.3208 0.591377H8.27093V3.69156L9.34921 2.59548C11.1992 4.47606 11.1992 7.52508 9.3492 9.40566C8.64273 10.1238 7.77037 10.567 6.85785 10.7369L7.08549 12C8.24209 11.7846 9.34898 11.2219 10.2425 10.3137C12.5858 7.93161 12.5858 4.06952 10.2425 1.68746L11.3208 0.591377Z"
						/>
					</svg>
          <span>Create New Backtest</span>
				</button>
    </div>
  </div>
  <main>
    <el-menu :default-active="activeIndex" class="el-menu-demo" :mode="mode" @select="handleSelect">
    <!-- <el-menu-item index="1">Set Up</el-menu-item>
    <el-menu-item index="2">Results</el-menu-item> -->
    <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
      {{item.lable}}
      <span
        v-if="item.lable === 'Analysts\' Backtests' && analystCountRedDot"
        class="new-badge"
      >
        NEW
      </span>
      <span
        v-else-if="item.lable === 'Subscriber Shared Backtests' && sharedCountRedDot"
        class="new-badge"
      >
        NEW
      </span>
    </el-menu-item>
    </el-menu>
    <!-- <keep-alive> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
	</main>
</div>
</template>

<script>
import {
	getAnalystList,
	getUserSharedBacktestList
} from '@/service/service.js'
export default {
  name: 'Tabs',
  props: {
    activeIndex: String,
    mode: String,
    handleSelect: Function,
    menuItems: Array
  },
  data() {
    return {
      analystCountRedDot: false,
      sharedCountRedDot: false,
      analystCount: 0,
      sharedCount: 0,
    }
  },
  watch: {
    activeIndex() {
      if(this.activeIndex === 'analyst') {
        this.analystCountRedDot = false
        localStorage.setItem('analystCount', this.analystCount)
      } else if(this.activeIndex === 'shared') {
        this.sharedCountRedDot = false
        localStorage.setItem('sharedCount', this.sharedCount)
      }
    }
  },
  async mounted() {
    if (this.$route.path.startsWith('/backtester/list')) {
      await this.checkTabCount(getAnalystList, 'analystCount');
      await this.checkTabCount(getUserSharedBacktestList, 'sharedCount');
    }
  },
  methods: {
    async checkTabCount(fetchFn, storageKey) {
      const res = await fetchFn(1, null, null, null);
      const { count } = res.data;
      this[storageKey] = count
      const lastCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
      // 第一次进入 || count 变化
      if ((!lastCount || count > lastCount)) {
        this[`${storageKey}RedDot`] = true
      }
    },
    refreshPageTemp(){
      //this.$router.go(0)
      this.$router.push('/backtester/').finally(()=>{location.reload()})
    },
    jumpToTutoiral(){
      let path
      if (this.$route.name == 'strategy') {

      } else if (this.$route.path.includes('/backtester')) {
        path = 'https://www.youtube.com/playlist?list=PL_pqMRWeHIxPgRS4tQryQ-efk2cNFf0hb'
      } else if (this.$route.name == 'scannerai' || this.$route.name == 'scannerai_chart') {

      } else if(this.$route.path.includes('myindicator') || this.$route.path.includes('MIList')){
        path = 'https://www.youtube.com/playlist?list=PL_pqMRWeHIxNvxaxmrJmLlzizXe38Is_d'
      } else if(this.$route.name == 'seasonality' || this.$route.name == 'seasonality'){

      }
      window.open(path, '_blank')
    },
    async fetchListCount() {

    }
  }
}
</script>

<style lang="less" scoped>
main {
  padding: 0 30px;
  background: #f9fafb;
  min-height: 500px;
}
.el-menu.el-menu--horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
main .el-menu--horizontal > .el-menu-item{
  line-height: 40px;
  height: 40px;
  width: 50%;
  text-align: center;
  color: #000000;
  font-weight: 700;
  font-size: 16px;
  background-color: #d7d7d7;
  border-radius: 4px;
  &:hover {
  background-color: #d7d7d7;
  color: #5b9bd1;
  }
}
main .el-menu--horizontal>.el-menu-item.is-active {
  color: white !important;
  background-color:#5b9bd1;
  border-bottom: none;
}
.gradient {
  position: relative;
	padding-top: 88px;
	background: linear-gradient(180deg, #dde0e4, rgba(249, 250, 251, 0));
}

.btn-group {
  display: flex;
  justify-content: right;
  position: absolute;
  right: 20px;
  top: 30px;
  button.createNew,
  .tutorial {
    border: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 42px;
    border-radius: 10px;
    background-image: initial;
    background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    margin: 0 10px 10px 0;
    svg {
      padding-right: 10px;
    }

    span {
      color: #ffffff;
    }
  }
  .createNew {
      background: #fbc05c;
      &:hover {
        background: #f59e0b;
        box-shadow: 0 6px 20px #f59e0b;
      }
  }
  .tutorial {
      background: darksalmon;
      &:hover {
        background: rgb(233, 111, 70);
        box-shadow: 0 6px 20px rgb(233, 111, 70);
      }
  }
}
.red-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 4px;
  background-color: red;
  border-radius: 50%;
}
.new-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  background-color: red;
  border-radius: 8px;
  line-height: 14px;
  height: 14px;
  vertical-align: middle;
}
</style>