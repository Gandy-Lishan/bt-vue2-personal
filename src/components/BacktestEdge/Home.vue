// Home
<template>
	<div>
		<header class="header">
			<p class="hint">
				Hint: Move cursor out of chart area to scroll down the page below
			</p>
			<!-- <el-row type="flex" justify="center"
					><el-col>
						<p class="betaNote">BacktestEdge Beta</p>
						<p class="hint">Hint: Move cursor out of chart area to scroll down the page below</p>
					</el-col>
				</el-row> -->
			<div class="chart_box" id="chart_box">
				<chart width="100%" height="100%"></chart>
			</div>
		</header>
		<div class="gradient"></div>
		<main class="main">
			<div class="alignRight" style="display: flex; align-items: center">
				<i
					@click="sidebar"
					class="fa fa-outdent navCheck"
					style="font-size: 30px"
				></i>
				<!-- <el-tooltip
					class="item"
					effect="dark"
					content="Clear current chart & Backtest Setup Form and create a new backtest."
					placement="bottom"
				>
					<el-button
						@click="refreshPage"
						class="restartBtn"
						type="primary"
						icon="el-icon-refresh-right"
						>Create New Backtest</el-button
					></el-tooltip
				> -->
			</div>
			<el-tabs
				ref="tabs"
				class="tabs"
				v-model="activeName"
				type="card"
				stretch
				:tab-position="tabPosition"
				@tab-click="handleTabClick"
			>
				<el-tab-pane
					label="Set up"
					name="first"
					v-loading="loading"
					element-loading-text="Loading..."
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"
				>
					<div class="set-up-container" @click="tabContentClick">
						<keep-alive>
							<set-up
								ref="setUpChild"
								:backtestEditData="backtestEditData"
								@IsRiskControl="IsRiskControl"
								@setDirection="setDirection"
							></set-up
						></keep-alive>
						<div class="criteria-container">
							<div class="criteria-box">
								<entry
									ref="entryChild"
									:direction="direction"
									@getEntryRelation="getEntryRelation"
									@sendEntrySignalIndex="sendEntrySignalIndex"
								></entry>
								<div class="divider"></div>
								<exit
									ref="exitChild"
									:direction="direction"
									@isOnlyRiskControl="isOnlyRiskControl"
									@getExitRelation="getExitRelation"
									@sendExitSignalIndex="sendExitSignalIndex"
								></exit>
							</div>
						</div>
						<div class="backtest-btns">
							<el-tooltip
								class="item"
								effect="dark"
								content="Clear the backtest set up form "
								placement="bottom"
							>
								<el-button type="danger" @click="clearForm">
									Clear Form</el-button
								>
							</el-tooltip>
							<el-tooltip
								class="item"
								effect="dark"
								content="Complete the form filling, run the backtest, and view the results"
								placement="bottom"
							>
								<el-button type="success" @click="runBacktest"
									>Run Backtest</el-button
								></el-tooltip
							>
							<!-- <el-checkbox style="margin-left:10px" v-model="test" label="download test csv" border></el-checkbox> -->
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="History" name="second"
					><history
						ref="historyChild"
						@goTobacktestSetupForm="goTobacktestSetupForm"
						@goBacktestResultForm="goBacktestResultForm"
						@goToFavoritesForm="goToFavoritesForm"
						@refFavoritesForm="refFavoritesForm"
						@switchTab="switchTab"
						@rerun="rerun"
					></history
				></el-tab-pane>
				<el-tab-pane label="Results" name="third"
					><div class="set-up-container">
						<result
							:backtestEditData="resultEditData"
							:editFrequency="editFrequency"
						></result>
					</div>
					<performance
						ref="performanceChild"
						:backtestEditData="backtestEditData"
						@errorCatchPerformance="errorCatchPerformance"
					></performance>
				</el-tab-pane>
				<el-tab-pane label="My Favorites" name="forth"
					><favorite
						ref="favoriteChild"
						@refHistoryForm="refHistoryForm"
						@goToHistoryForm="goToHistoryForm"
						@goTobacktestSetupForm="goTobacktestSetupForm"
						@goBacktestResultForm="goBacktestResultForm"
						@goToFavoritesForm="goToFavoritesForm"
						@switchTab="switchTab"
						@rerun="rerun"
					></favorite
				></el-tab-pane>
				<el-tab-pane label="Sample Backtests" name="fifth"
					><sample
						ref="sampleChild"
						@goToHistoryForm="goToHistoryForm"
						@refHistoryForm="refHistoryForm"
						@goTobacktestSetupForm="goTobacktestSetupForm"
						@goBacktestResultForm="goBacktestResultForm"
					></sample
				></el-tab-pane>
				<el-tab-pane label="Analysts' Backtest" name="sixth">
					<router-view
						@goToHistoryForm="goToHistoryForm"
						@refHistoryForm="refHistoryForm"
						@goTobacktestSetupForm="goTobacktestSetupForm"
						@goBacktestResultForm="goBacktestResultForm"
					></router-view>
				</el-tab-pane>
				<el-tab-pane :label="renderLabel()" name="seventh" v-if="0">
					<router-view></router-view>
				</el-tab-pane>
				<el-tab-pane name="eight" label="Hey, Sentimentrader">
					<!-- <router-view></router-view> -->
          <Chat
          @goTobacktestSetupForm="goTobacktestSetupForm"
          @goBacktestResultForm="goBacktestResultForm"
          ></Chat>
				</el-tab-pane>
			</el-tabs>
			<div class="maintabBtnContainer">
				<div>
					<button
						class="sidebar activated"
						ref="setup"
						@click="switchMainTab('setup')"
					>
						<div>
							<svg
								class="sidebar_button_icon"
								width="11"
								height="11"
								viewBox="0 0 11 11"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M9.54049 8.59834L11 10.1387L10.1839 11L8.72434 9.45968C8.21313 9.83138 7.59301 10.0495 6.92526 10.0495C5.17227 10.0495 3.75119 8.5497 3.75119 6.69964C3.75119 4.84062 5.16378 3.34982 6.92526 3.34982C8.68674 3.34982 10.0993 4.84062 10.0993 6.69964C10.0993 7.40436 9.8927 8.05882 9.54049 8.59834ZM6.96527e-07 -8.88999e-09L10.3879 -2.67563e-08L10.3879 1.21812L6.43281e-07 1.21812L6.96527e-07 -8.88999e-09ZM8.94513 6.69964C8.94513 5.51337 8.04929 4.56794 6.92526 4.56794C5.80123 4.56794 4.9054 5.51337 4.9054 6.69964C4.9054 7.87695 5.80972 8.83135 6.92526 8.83135C7.48319 8.83135 7.98737 8.59342 8.35352 8.20699C8.71968 7.82056 8.94513 7.28847 8.94513 6.69964ZM4.83544e-07 4.87247L2.88552 4.87247L2.88552 6.09058L4.30299e-07 6.09058L4.83544e-07 4.87247ZM2.70562e-07 9.74494L2.88552 9.74494L2.88552 10.9631L2.17316e-07 10.9631L2.70562e-07 9.74494Z"
								/>
							</svg>
							<span>Backtest setup and result</span>
						</div>
					</button>
				</div>
				<div>
					<button class="sidebar" ref="list" @click="switchMainTab('list')">
						<div>
							<svg
								class="sidebar_button_icon"
								width="10"
								height="12"
								viewBox="0 0 10 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M0 1.2C0 0.537259 0.526723 0 1.17647 0H7.5966L10 2.45147V10.8C10 11.4627 9.47328 12 8.82353 12H1.17647C0.526724 12 0 11.4627 0 10.8V1.2ZM7.10929 1.2L1.17647 1.2V10.8H8.82353V2.94853L7.10929 1.2ZM7.35294 5.7H2.64706V4.5H7.35294V5.7ZM5.58824 8.1H2.64706V6.9H5.58824V8.1Z"
								/>
							</svg>
							<span>Backtest list</span>
						</div>
					</button>
				</div>
        <!-- todo: long xue 记得在这里解除注释 -->

				<!-- <div>
					<button class="sidebar" ref="chat" @click="switchMainTab('chat')">
						<div class="chat-sidebar">
              <svg class="sidebar_button_icon" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.58277 1.03846C6.86659 0.737403 8.21558 0.887891 9.40075 1.46454C10.586 2.04121 11.5346 3.0087 12.085 4.2032L11.3676 5.34418C10.9856 3.94334 10.0941 2.93488 8.95502 2.38065C7.98068 1.90658 6.87126 1.78274 5.81536 2.03034C4.7595 2.27794 3.82284 2.88154 3.16418 3.73802C2.50556 4.59443 2.1654 5.65098 2.20102 6.72819L1.18278 6.76185C1.13935 5.44812 1.55426 4.16023 2.35659 3.11694C3.15887 2.07371 4.29892 1.33951 5.58277 1.03846Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.68958 8.78271L0.366135 6.49043L3.01304 6.49043L1.68958 8.78271Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.302 12.2675C7.01818 12.5685 5.66918 12.418 4.48401 11.8414C3.2988 11.2647 2.35017 10.2972 1.79981 9.10271L2.51716 7.96173C2.8992 9.36257 3.79065 10.371 4.92975 10.9253C5.90409 11.3993 7.01351 11.5232 8.0694 11.2756C9.12526 11.028 10.0619 10.4244 10.7206 9.56789C11.3792 8.71147 11.7194 7.65493 11.6837 6.57772L12.702 6.54406C12.7454 7.85778 12.3305 9.14568 11.5282 10.189C10.7259 11.2322 9.58584 11.9664 8.302 12.2675Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1952 4.52344L13.5186 6.81572L10.8717 6.81572L12.1952 4.52344Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7051 8.78271L17.1762 11.3641C17.3806 11.4821 17.4506 11.7435 17.3326 11.9479L16.8342 12.8112C16.7161 13.0156 16.4548 13.0857 16.2503 12.9676L11.7793 10.3863V10.3863C12.1673 9.92861 12.4728 9.40694 12.6821 8.84457L12.7051 8.78271Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.96091 9.3088H6.84846L6.6231 8.34322H5.21877L4.99341 9.3088H3.88574V9.29583L5.33839 4.21484H6.51783L7.96091 9.3088ZM6.4652 7.69009L5.91878 5.39489L5.3671 7.69009H6.4652Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99828 9.3088H8.97949V4.21484H9.99828V9.3088Z"/>
              </svg>
							<span>Hey, Sentimentrader</span>
						</div>
					</button>
				</div> -->
				<!-- <div>
					<el-tooltip
					class="item"
					effect="dark"
					content="Clear current chart & Backtest Setup Form and create a new backtest."
					placement="bottom">
						<button class='sidebar refresh' @click="refreshPage">
						<div>
						<svg class='sidebar_button_icon' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M2.65079 2.59434C3.35727 1.87621 4.22963 1.43305 5.14214 1.26312L4.91451 0C3.75791 0.215381 2.65102 0.77807 1.75752 1.68632C-0.585841 4.06838 -0.585841 7.93048 1.75752 10.3125L0.679249 11.4086H3.72907V8.30844L2.65079 9.40452C0.80077 7.52394 0.80077 4.47492 2.65079 2.59434ZM11.3208 0.591377H8.27093V3.69156L9.34921 2.59548C11.1992 4.47606 11.1992 7.52508 9.3492 9.40566C8.64273 10.1238 7.77037 10.567 6.85785 10.7369L7.08549 12C8.24209 11.7846 9.34898 11.2219 10.2425 10.3137C12.5858 7.93161 12.5858 4.06952 10.2425 1.68746L11.3208 0.591377Z"/>
						</svg>
						<span>Create new backtest</span>
						</div>
						</button>
					</el-tooltip>
					</div> -->
			</div>
			<el-tooltip
				class="item"
				effect="dark"
				content="Back to the top"
				placement="bottom"
			>
				<button class="toTop" @click="animationUp(0)">
					<svg
						width="12"
						height="15"
						viewBox="0 0 22 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M-1.31134e-07 1.5C-5.87107e-08 0.671573 0.642374 5.61581e-08 1.43478 1.25433e-07L20.5652 1.79787e-06C21.3576 1.86714e-06 22 0.671574 22 1.5C22 2.32843 21.3576 3 20.5652 3L1.43478 3C0.642374 3 -2.03557e-07 2.32843 -1.31134e-07 1.5Z"
							fill="#F9FAFB"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M11.5 30C10.6716 30 10 29.2645 10 28.3571L10 8.64286C10 7.73553 10.6716 7 11.5 7C12.3284 7 13 7.73553 13 8.64286L13 28.3571C13 29.2645 12.3284 30 11.5 30Z"
							fill="#F9FAFB"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M21.5079 18.5152C20.8519 19.1616 19.7881 19.1616 19.1321 18.5152L11.5 10.9959L3.86794 18.5152C3.21186 19.1616 2.14814 19.1616 1.49206 18.5152C0.835983 17.8688 0.835983 16.8208 1.49206 16.1744L10.3121 7.48479C10.9681 6.8384 12.0319 6.8384 12.6879 7.48479L21.5079 16.1744C22.164 16.8208 22.164 17.8688 21.5079 18.5152Z"
							fill="#F9FAFB"
						></path>
					</svg>
				</button>
			</el-tooltip>
			<el-tooltip
				class="item"
				effect="dark"
				content="Create New Backtest"
				placement="bottom"
			>
				<button class="createNew" @click="refreshPage">
					<svg
						class="sidebar_button_icon"
						width="12"
						height="12"
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
				</button>
			</el-tooltip>
      <div id="myFLSbg">
        <div class="maskContent-loading" v-if="progressBarVal < 100">
          <img src="@/assets/fls.gif"/>
          <span>Finding the last signal</span> 
          <progress-bar 
            class="progress-bar"
            bar-color="linear-gradient(to right,#A0E3EC, #66ACE5)" 
            :val="progressBarVal" 
            :text="progressBarVal + '%'"
            :title="progressBarVal + '%'"
            bar-border-radius="20"
            size="huge"
          ></progress-bar>
          <p>{{numOfProcessedBacktests}} out of {{getLastSignalArray.length}} tasks have been completed</p>
          <el-button @click="refreshPageTemp">Cancel</el-button>
        </div>    
        <div class="maskContent-sucess" v-if="
          progressBarVal == 100 &&
          getLastSignalArray.findIndex(x=>x.state==2) == -1
        ">
          <img src="@/assets/allclear.png"/>
          <span>Find Sucessfully</span> 
          <p>All of the tasks have been completed</p>
          <el-button @click="viewSignal">View Signal</el-button>
        </div>
        <div class="maskContent-failed" v-if="
          progressBarVal == 100 &&
          getLastSignalArray.findIndex(x=>x.state==2) != -1
        ">
          <img src="@/assets/errorocuur.png"/>
          <span>Find Error</span> 
          <p>Please modify your backtest and try it again</p>
          <ul>
            Your signals have the following error:
            <li><img src="@/assets/erroritem.png"/><span>{{numOfFailedBacktests}} errors were found</span></li>
          </ul>
          <el-button @click="viewSignal">Return for modification</el-button>
        </div>
      </div>
		</main>
	</div>
</template>
<script>
const throttle = require('lodash/throttle')

import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import SignalCode from '@/tools/codeTool.js'
import chart from '@/components/chart/index.vue'
import setUp from '@/components/BacktestEdge/SetUp.vue'
import entry from '@/components/BacktestEdge/Entry.vue'
import exit from '@/components/BacktestEdge/Exit.vue'
import result from '@/components/BacktestEdge/Result.vue'
import performance from '@/components/BacktestEdge/Performance.vue'
import history from '@/components/BacktestEdge/History.vue'
import favorite from '@/components/BacktestEdge/Favorite.vue'
import sample from '@/components/BacktestEdge/Sample.vue'
import Chat from "@/components/BacktestEdge/Chat.vue";
import { mapGetters } from 'vuex'
import ProgressBar from 'vue-simple-progress'

import {
  runBacktest,
  seeParams,
  getBacktestName,
  uploadS3
} from '@/service/service'
import searchKeys from '@/tools/searchKeys.js'
import UUID from '@/tools/uuid.js'
export default {
  name: 'home',
  data() {
    return {
      test: false,
      btnClickBool: true,
      scroll: '',
      tabPosition: 'top',
      activeName: 'first',
      clientHeight: document.body.clientWidth,
      loading: false,
      backtestEditData: {},
      editFrequency: '',
      historyFlag: true,
      favoriteFlag: true,
      entryLength: 1,
      exitLength: 1,
      direction: 'Long',
      isOnlyRisk: false,
      exitRelation: 1,
      entryRelation: 1,
      activeTab: '', // 用于存储当前选中的选项卡
      options: [
        { label: 'Exit with custom TIM frame', value: 'exit_with_custom_TIM_frame' }
      ],
      resultEditData: {},
      mainTabState: 0,

      // find the last signal
      progressBarVal: 0,
      numOfFailedBacktests: 0,
      numOfProcessedBacktests:0,
    }
  },
  components: {
    chart: chart,
    'set-up': setUp,
    entry,
    exit,
    result,
    performance,
    history,
    favorite,
    sample,
    Chat,
    ProgressBar,
  },
  async mounted() {
    let toTop = document.getElementsByClassName('toTop')[0]
    toTop.style.visibility = 'hidden'
    let maintabBtn = document.getElementsByClassName('maintabBtnContainer')[0]
    maintabBtn.style.visibility = 'hidden'
    // When DOM renders data, set the height of the lower area to the height of the browser's visible area
    // Listen for the resize event of the window. Set the height of the lower area when the browser window changes
    const _this = this
    window.onscroll = function scroll() {
      _this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop
    }
    window.onresize = throttle(function temp() {
      window.screenWidth = document.body.clientWidth
      _this.clientHeight = window.screenWidth
      if (_this.clientHeight < 768) {
        _this.tabPosition = 'left'
      } else {
        _this.tabPosition = 'top'
      }
      var chartBox = document.getElementsByClassName('chart_box')[0]
      if (chartBox) chartBox.style.width = ''
    })

    this.myBrowser()

    const pathname = window.location.pathname
    if (pathname.includes('backtests')) {
      const targetPath = '/home/backtester/backtests';
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath);
      }
      this.switchMainTab('list')
      this.activeName = 'sixth';
    }
    if (pathname.includes('brainstorm')) {
      this.activeName = 'seventh'
    }
    const searchParams = new URLSearchParams(window.location.search)
    const backtestID = searchParams.get('backtestID')

    if (!backtestID) return
    const vm = this
    try {
      CIQ.addCover('Fetching backtest information...')
      CIQ.nprogress.start()
      let res = null
      try {
        await seeParams(backtestID)
      } catch (error) {
        throw Error('Request Error')
      }
      res.data.entry_description = JSON.parse(res.data.entry_description)
      res.data.exit_description = JSON.parse(res.data.exit_description)
      res.data.result = JSON.parse(res.data.result)
      console.log('backtest res', res)
      document.getElementsByClassName('ciq-period')[0].style.display = ''
      //  Restore indicator layout
      this.$store.commit('getBacktestSymbol', res.data.symbol)
      CIQ.hideMarker()
      CIQ.isMarkerShown = false
      if (res.data.indicator_layout) {
        this.$refs.historyChild.restoreIndicatorLayoutEdit(
          JSON.parse(res.data.indicator_layout),
          res.data.frequency,
          res.data,
          res.data
        )
      } else {
        this.$store.commit('getRunBacktestData', res.data)
        this.goBacktestResultForm(res.data, () => {
          this.$emit('goTobacktestSetupForm', backtestID, res.data, () => {
            CIQ.hideCover()
            CIQ.nprogress.done()
          })
        })
      }
    } catch (error) {
      console.log(error)
      vm.$message({
        message: 'The internal server is busy, please try again later ',
        type: 'error'
      })
    }
  },
  computed: {
    ...mapGetters(['getLastSignalArray']),
    handleLastSignalArrayChange() {
      return this.getLastSignalArray
    },
  },
  watch: {
    handleLastSignalArrayChange: {
      handler(newVal) {
        
        let arrayLenth = newVal.length
        let progressNum = 0
        newVal.map(item=>{ 
          if(item.state!=0){
            progressNum ++
          }
        })
        this.numOfProcessedBacktests = progressNum
        this.progressBarVal = Math.ceil(progressNum/arrayLenth*100)

        // 统计fls中失败的回测数量
        let count = 0
        newVal.map(x=>{
          if(x.state==2){
            count++
          }
        })
        this.numOfFailedBacktests = count
      },
      immediate: true,
      deep: true
    },
    scroll: {
      handler(val) {
        try {
          if (typeof val == 'string') val = 360
          let toTop = document.getElementsByClassName('toTop')[0]
          let maintabBtn = document.getElementsByClassName('maintabBtnContainer')[0]
          if (val <= 600) {
            toTop.style.visibility = 'hidden'
          } else {
            toTop.style.visibility = 'visible'
          }
          if (val <= 350) {
            maintabBtn.style.visibility = 'hidden'
          } else {
            maintabBtn.style.visibility = 'visible'
          }
        } catch (err) { }
      },
      immediate: true,
      deep: true
    },
    clientHeight: {
      handler(val) {
        this.clientHeight = val
        if (this.clientHeight < 768) {
          this.tabPosition = 'left'
        } else {
          this.tabPosition = 'top'
        }
      },
      immediate: true,
      deep: true
    },
    test: {
      handler(val) {
        CIQ.downloadCSV = val
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.progressBarVal = 0
  },
  methods: {
    // 暂定cancel一个回测的解决方案
    refreshPageTemp(){
      this.$router.go(0)
    },
    viewSignal: function() {
      this.switchMainTab('list')
      this.goToFavoritesForm()
      const myFLSbg = document.querySelector('#myFLSbg')
      myFLSbg.classList.remove('activated')
    },
    animationUp: function (ph) {
      window.scrollTo({
        top: ph,
        behavior: 'smooth'
      })
    },
    switchMainTab: function (refName) {
      // this.mainTabState = refName == 'setup' ? 0 : 1
      console.log('refName', refName)
      switch (refName) {
        case 'setup':
          this.mainTabState = 0
          break;
        case 'list':
          this.mainTabState = 1
          break;
        case 'chat':
          this.mainTabState = 2
          break;
      }
      console.log('this.mainTabState', this.mainTabState)
      if (this.mainTabState == 0) {

        this.$refs.tabs.$children[0].$refs.tabs[0].style.display = 'unset'
        this.$refs.tabs.$children[0].$refs.tabs[1].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[2].style.display = 'unset'
        this.$refs.tabs.$children[0].$refs.tabs[3].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[4].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[5].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[6].style.display = 'none'
        this.activeName = 'first'

        this.$refs.setup.classList.add('activated')
        this.$refs.list.classList.remove('activated')
        //this.$refs.chat.classList.remove('activated')
        this.animationUp(650)
      } else if (this.mainTabState == 1) {
        this.$refs.tabs.$children[0].$refs.tabs[0].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[1].style.display = 'unset'
        this.$refs.tabs.$children[0].$refs.tabs[2].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[3].style.display = 'unset'
        this.$refs.tabs.$children[0].$refs.tabs[4].style.display = 'unset'
        this.$refs.tabs.$children[0].$refs.tabs[5].style.display = 'unset'
        this.$refs.tabs.$children[0].$refs.tabs[6].style.display = 'none'
        this.activeName = 'second'

        this.$refs.setup.classList.remove('activated')
        //this.$refs.chat.classList.remove('activated')
        this.$refs.list.classList.add('activated')

        this.animationUp(650)
      } else if (this.mainTabState == 2) {
        this.$refs.tabs.$children[0].$refs.tabs[0].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[1].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[2].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[3].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[4].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[5].style.display = 'none'
        this.$refs.tabs.$children[0].$refs.tabs[6].style.display = 'unset'
        this.activeName = 'eight'
       // this.$refs.chat.classList.add('activated')
        this.$refs.setup.classList.remove('activated')
        this.$refs.list.classList.remove('activated')
      }
    },
    myBrowser: function () {
      //Get the useragent string of the browser
      var userAgent = navigator.userAgent
      var isOpera = userAgent.indexOf('Opera') > -1
      //Determine whether opera browser
      if (
        userAgent.indexOf('Chrome') > -1 &&
        userAgent.indexOf('Safari') > -1
      ) {
      } else {
        alert('The best display is accessed using the chrome browser')
      }
    },
    tabContentClick() {
      try {
        let sidebar = document.getElementsByClassName('el-tabs__header is-left')
        let tabContent = document.getElementsByClassName('el-tabs__content')
        let btn = document.getElementsByClassName('fa fa-outdent navCheck')
        sidebar[0].style.left = '-110px'
        tabContent[0].style.left = '-110px'
        btn[0].style.transform = 'rotate3d(0, 1, 0, -180deg)'
        btn[0].style.transition = 'all 0.5s'
        this.btnClickBool = false
      } catch (error) { }
    },
    sidebar() {
      try {
        let sidebar = document.getElementsByClassName('el-tabs__header is-left')
        let tabContent = document.getElementsByClassName('el-tabs__content')
        let btn = document.getElementsByClassName('fa fa-outdent navCheck')
        if (this.btnClickBool == true) {
          sidebar[0].style.left = '-110px'
          tabContent[0].style.left = '-110px'
          btn[0].style.transform = 'rotate3d(0, 1, 0, -180deg)'
          btn[0].style.transition = 'all 0.5s'
          this.btnClickBool = false
        } else {
          sidebar[0].style.left = '0px'
          tabContent[0].style.left = '0px'
          btn[0].style.transform = 'rotate3d(0, 1, 0, 0deg)'
          btn[0].style.transition = 'all 0.5s'
          this.btnClickBool = true
        }
      } catch (error) { }
    },
    clearForm() {
      const resultEditData = JSON.parse(JSON.stringify(this.resultEditData))
      const editFrequency = this.editFrequency
      Object.assign(this.$data, this.$options.data())
      this.resultEditData = resultEditData
      this.editFrequency = editFrequency
      this.$store.commit('initialBacktestInfo')
      this.$refs.setUpChild.clearForm()
      this.$refs.entryChild.clearForm()
      this.$refs.exitChild.clearForm()
    },
    createNewBacktest() {
      Object.assign(this.$data, this.$options.data())
      this.$store.commit('initialBacktestInfo')
      this.$refs.setUpChild.clearForm()
      this.$refs.entryChild.clearForm()
      this.$refs.exitChild.clearForm()
      this.$refs.performanceChild.clearForm()
    },
    clearAllDataForm() {
      Object.assign(this.$data, this.$options.data())
      this.$store.commit('initialBacktestInfo')
      this.$refs.setUpChild.clearForm()
      this.$refs.entryChild.clearForm()
      this.$refs.exitChild.clearForm()
    },
    sendEntrySignalIndex(length) {
      this.entryLength = length
    },
    sendExitSignalIndex(length) {
      this.exitLength = length
    },
    handleTabClick(tab, event) {
      let tabName = tab.name
      let targetPath = ''
      switch (tabName) {
        case 'first':
          targetPath = '/home/backtester';
          if (this.$route.path !== targetPath) {
            this.$router.push(targetPath);
          }
          break
        case 'second':
          targetPath = '/home/backtester';
          if (this.$route.path !== targetPath) {
            this.$router.push(targetPath);
          }
          break
        case 'third':
          targetPath = '/home/backtester';
          if (this.$route.path !== targetPath) {
            this.$router.push(targetPath);
          }
          break
        case 'forth':
          if (this.favoriteFlag) {
            targetPath = '/home/backtester';
            if (this.$route.path !== targetPath) {
              this.$router.push(targetPath);
            }
            this.$refs.favoriteChild.getFavoriteList()
            this.favoriteFlag = false
          }
          break
        case 'fifth':
          targetPath = '/home/backtester';
          if (this.$route.path !== targetPath) {
            this.$router.push(targetPath);
          }
          this.$refs.sampleChild.getSampleList()
          break
        case 'sixth':
          targetPath = '/home/backtester/backtests'
          if (this.$route.path !== targetPath) {
            this.$router.push(targetPath);
          }
          break
        case 'seventh':
          targetPath = '/home/backtester/brainstorm'
          if (this.$route.path !== targetPath) {
            this.$router.push(targetPath);
          }
        default:
          if (window.location.pathname.includes('backtests')) {
            targetPath = '/home/backtester/backtests';
            if (this.$route.path !== targetPath) {
              this.$router.push(targetPath);
            }
          }
      }
    },
    IsRiskControl(val) {
      this.$refs.exitChild.addRiskControlOption(val)
    },
    setDirection(val) {
      this.direction = val
    },
    refreshPage() {
      if (!CIQ.Studies) return
      var stx = CIQ.stxx
      for (var id in stx.layout.studies) {
        var sd = stx.layout.studies[id]
        if (!sd.customLegend && !sd.permanent) CIQ.Studies.removeStudy(stx, sd)
      }
      stx.draw()
      CIQ.setPanelHeight([])
      const freq = CIQ.store.state.exitFrequency

      // remove all Studies from Vuex
      CIQ.store.commit('getEntryIndicatorsList', [])
      CIQ.store.commit('getExitIndicatorsList', [])
      CIQ.store.commit('getMA', [])
      CIQ.store.commit('getExtraIndicators', [])
      CIQ.store.commit('getTechnicalIndicators', [])

      CIQ.store.commit('getBacktestSymbol', 'SPY')
      CIQ.store.commit('getFrequency', 'Daily')

      // remove markers, prompt, recover timeframe dropdown
      CIQ.removePrompt()
      CIQ.hideMarker()
      CIQ.isMarkerShown = false
      CIQ.store.commit('getTradesData', [])
      document.getElementsByClassName('ciq-period')[0].style.display = 'block'
      if (
        stx.chart.symbol != CIQ.store.state.backtestSymbol ||
        freq != 'Daily'
      ) {
        CIQ.addIndicators()
      }
      this.createNewBacktest()
      this.animationUp(0)
      this.switchMainTab('setup')
    },
    addEntrySignalLength(index) {
      let obj = {}
      obj.criteria = 'entry'
      obj.index = index
      this.$store.commit('addSignalLength', obj)
    },
    addExitSignalLength(index) {
      let obj = {}
      obj.criteria = 'exit'
      obj.index = index
      this.$store.commit('addSignalLength', obj)
    },
    reloadData(data, freq) {
      let frequency = ''
      this.$store.commit('getEntryIndicatorsList', data.formIndicators.entry)
      this.$store.commit('getExitIndicatorsList', data.formIndicators.exit)
      this.$store.commit('getExtraIndicators', [])
      this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
      this.$store.commit('getMA', data.activatedMA)
      // 暂定，读取回测携带的ma位置和信息
      this.$store.commit('getMALayout', data.activatedMALayout)
      this.$store.commit('setTechSD', data.savedTechSD)

      switch (freq) {
        case 'Daily': {
          frequency = 'daily'
          break
        }
        case 'Weekly': {
          frequency = 'weekly'
          break
        }
        case 'Monthly': {
          frequency = 'monthly'
          break
        }
        default: {
          break
        }
      }
      this.$store.commit('setRestoreFreq', frequency)
    },
    runBacktest: throttle(async function () {
      try {
        let setUp = this.$refs.setUpChild.saveBacktestData()
        if (!setUp) return
        let setUpChecked = true
        let entryChecked = true
        // let isEdit = this.$refs.setUpChild.isEdit()
        let backtestInfo = JSON.parse(JSON.stringify(this.$store.state.backtestInfo))
        this.$refs.entryChild.addEntrySignalLength()
        this.$refs.exitChild.addExitSignalLength()
        let setUpRes = {}
        try {
          setUpRes = await getBacktestName(
            this.$store.state.backtestInfo.name
          )
        } catch (error) {
          console.log(error)
          this.$notify({
            title: 'Failed',
            message: 'The internal server is busy, please try again later',
            type: 'error'
          })
          return
        }
        // if (setUpRes.data.count != 0 && !isEdit || (setUpRes.data.count != 0 && !backtestInfo.hasOwnProperty('old_uuid'))) {
        if (setUpRes.data.count != 0 && !backtestInfo.hasOwnProperty('old_uuid')) {
          this.$message({
            message: 'The backtest name already exists',
            type: 'error'
          })
          setUpChecked = false
          this.$store.commit('clearBacktest')
          return
        }
        // 首次创建
        // if (setUpRes.data.count == 0 && !isEdit) this.$store.commit('clearBacktestUuid')

        // if (setUpRes.data.count == 0 || isEdit) {
        // 有名字并且是编辑 没名字是编辑 没名字是新建
        if ((setUpRes.data.count != 0 && backtestInfo.hasOwnProperty('old_uuid')) || (setUpRes.data.count == 0) && backtestInfo.hasOwnProperty('old_uuid') || (setUpRes.data.count == 0) && !backtestInfo.hasOwnProperty('old_uuid')) {
          let entry
          for (let index = 0; index < this.entryLength; index++) {
            this.addEntrySignalLength(index)
            entry = this.$refs.entryChild.saveBacktestData(index)
            entryChecked = await entry
            if (!entryChecked) {
              return
            }
            this.$refs.entryChild.saveScoreValue()
            this.$refs.entryChild.saveSignalsInMarket()
            this.$refs.entryChild.saveDelayBar()
            this.$refs.entryChild.saveRelation()
          }
          const checked = entryChecked && setUpChecked && setUp
          if (!checked) return
          if (checked) {
            let exit
            let exitChecked
            for (let index = 0; index < this.exitLength; index++) {
              exit = this.$refs.exitChild.saveBacktestData(index)
              exitChecked = await exit
              if (!exitChecked) {
                return
              }
              this.$refs.exitChild.saveScoreValue()
              this.$refs.exitChild.saveSignalsInMarket()
              this.$refs.exitChild.saveDelayBar()
              this.$refs.exitChild.saveRelation()
            }
            if (exitChecked) {
              CIQ.addCover('Start running Backtest...')
              CIQ.nprogress.start()
              let vm = this
              let signalEntryList = []
              let signalExitList = []
              let backtestData = JSON.parse(
                JSON.stringify(vm.$store.state.backtestInfo)
              )
              console.log('store 中存储的 backtestdata', backtestData)
              let entry_description = vm.$store.state.backtestInfo.entry_description
              if (typeof entry_description == 'string') {
                entry_description = JSON.parse(vm.$store.state.backtestInfo.entry_description)
              }
              let sameEntryIndexArr = searchKeys(entry_description)
              if (vm.entryRelation == 3) {
                sameEntryIndexArr = []
              }
              if (sameEntryIndexArr.length >= 1) {
                for (let j = 0; j < sameEntryIndexArr.length; j++) {
                  let sameItem = []
                  let str = ''
                  sameItem = sameEntryIndexArr[j].split(',')
                  for (let n = 0; n < sameItem.length; n++) {
                    str += 'Signal' + Number(sameItem[n]) + ' '
                  }
                  vm.$message({
                    message:
                      'The current entry ' +
                      str +
                      ' are the same, please change',
                    type: 'error'
                  })
                  CIQ.hideCover()
                  CIQ.nprogress.done()

                  // FindLastSignal过程中代表一个项目的运行结束
                  CIQ.isFindLastSignalRuning = false
                  vm.$store.state.last_signal_array.map(item=>{
                    if(item.name == backtestData.name){
                      item.state = 2
                    }
                  })
                  console.log('FindLastSignalRuning done, The current entry are the same',backtestData,vm.$store.state.last_signal_array)
                  return
                }
              }
              let exit_description = vm.$store.state.backtestInfo.exit_description
              if (typeof exit_description == 'string') {
                exit_description = JSON.parse(vm.$store.state.backtestInfo.exit_description)
              }
              let sameExitIndexArr = searchKeys(exit_description)
              if (vm.exitRelation == 3) {
                sameExitIndexArr = []
              }
              if (sameExitIndexArr.length >= 1) {
                for (let j = 0; j < sameExitIndexArr.length; j++) {
                  let sameItem = []
                  let str = ''
                  sameItem = sameExitIndexArr[j].split(',')
                  for (let n = 0; n < sameItem.length; n++) {
                    str += 'Signal' + Number(sameItem[n]) + ' '
                  }
                  vm.$message({
                    message:
                      'The current exit ' +
                      str +
                      ' are the same, please change',
                    type: 'error'
                  })
                  CIQ.hideCover()
                  CIQ.nprogress.done()

                  // FindLastSignal过程中代表一个项目的运行结束
                  CIQ.isFindLastSignalRuning = false
                  vm.$store.state.last_signal_array.map(item=>{
                    if(item.name == backtestData.name){
                      item.state = 2
                    }
                  })
                  console.log('FindLastSignalRuning done, The current exit are the same',backtestData,vm.$store.state.last_signal_array)
                  return
                }
              }
              signalEntryList = backtestData.entry.signals
              signalExitList = backtestData.exit.signals
              signalEntryList.forEach((item) => {
                if (item.sentimentIndicator) {
                  item.indicator = item.sentimentIndicator
                  item.analysis = 'Sentiment'
                  delete item.technicalIndicator
                  delete item.sentimentIndicator
                  delete item.usersOwnIndicator
                  delete item.riskIndicator
                }
                if (item.technicalIndicator) {
                  item.indicator = item.technicalIndicator
                  item.analysis = 'Technical'
                  delete item.technicalIndicator
                  delete item.sentimentIndicator
                  delete item.usersOwnIndicator
                  delete item.riskIndicator
                }
                if (item.symbolIndicator) {
                  item.indicator = item.symbolIndicator
                  item.analysis = 'Symbol'
                  delete item.technicalIndicator
                  delete item.sentimentIndicator
                  delete item.symbolIndicator
                  delete item.riskIndicator
                }
                if (item.usersOwnIndicator) {
                  item.indicator = item.usersOwnIndicator
                  item.analysis = 'User'
                  // item.analysis = 'Sentiment'
                  delete item.technicalIndicator
                  delete item.sentimentIndicator
                  delete item.usersOwnIndicator
                  delete item.riskIndicator
                }
              })
              if (!this.isOnlyRisk) {
                signalExitList.forEach((item) => {
                  if (item.sentimentIndicator) {
                    item.indicator = item.sentimentIndicator
                    item.analysis = 'Sentiment'
                    delete item.technicalIndicator
                    delete item.sentimentIndicator
                    delete item.usersOwnIndicator
                    delete item.riskIndicator
                  }
                  if (item.technicalIndicator) {
                    item.indicator = item.technicalIndicator
                    item.analysis = 'Technical'
                    delete item.technicalIndicator
                    delete item.sentimentIndicator
                    delete item.usersOwnIndicator
                    delete item.riskIndicator
                  }
                  if (item.riskIndicator) {
                    item.indicator = 'RC'
                    item.analysis = 'Exit'
                    delete item.technicalIndicator
                    delete item.sentimentIndicator
                    delete item.usersOwnIndicator
                    delete item.riskIndicator
                  }
                  if (item.symbolIndicator) {
                    item.indicator = item.symbolIndicator
                    item.analysis = 'Symbol'
                    delete item.technicalIndicator
                    delete item.sentimentIndicator
                    delete item.symbolIndicator
                    delete item.riskIndicator
                  }
                  if (item.usersOwnIndicator) {
                    item.indicator = item.usersOwnIndicator
                    item.analysis = 'User'
                    // item.analysis = 'Sentiment'
                    delete item.technicalIndicator
                    delete item.sentimentIndicator
                    delete item.usersOwnIndicator
                    delete item.riskIndicator
                  }
                })
              }
              const b = new SignalCode()
              var entry_signal_list = []
              var exit_signal_list = []

              let formateTechnicalList
              formateTechnicalList = vm.$store.state.formateTechnicalList
              if (formateTechnicalList.length === 0) {
                formateTechnicalList = vm.loadShortLong()
              }

              let entrySignal = backtestData.entry.signals.map((item, index) => {
                // if it is senti
                let signal = CIQ.indicatorList.find((i) => {
                  return i.chart_name == item.indicator
                })
                // if it is not senti?
                if (!signal) {
                  for (let i = 0; i < formateTechnicalList.length; i++) {
                    if (formateTechnicalList[i].value == item.indicator) {
                      return formateTechnicalList[i].url
                    }
                  }
                }
                // 在 symbol indicator list内检索url
                if (!signal) {
                  if (this.$store.state.symbolConditions.findIndex(i => i.label == item.indicator) !== -1) {
                    return item.indicator
                  }
                }
                console.log('runbacktest', vm.$store.state.usersOwnEntryFileHash)
                let usersOwnEntryList = vm.$store.state.usersOwnEntryFileHash
                if (usersOwnEntryList[index] != '') {
                  return usersOwnEntryList[index]
                }
                return signal?.url || ''
              })

              //entrySignal = entrySignal.concat(this.$store.state.usersOwnEntryFileHash).filter(item => item !== '')
              let exitSignal
              if (!this.isOnlyRisk) {
                exitSignal = backtestData.exit.signals.map((item, index) => {
                  let signal = CIQ.indicatorList.find((i) => {
                    return i.chart_name == item.indicator
                  })

                  if (!signal) {
                    for (let i = 0; i < formateTechnicalList.length; i++) {
                      if (formateTechnicalList[i].value == item.indicator) {
                        return formateTechnicalList[i].url
                      }
                    }
                  }
                  // 在 symbol indicator list内检索url
                  if (!signal) {
                    if (this.$store.state.symbolConditions.findIndex(i => i.label == item.indicator) !== -1) {
                      return item.indicator
                    }
                  }
                  let usersOwnExitList = vm.$store.state.usersOwnExitFileHash
                  if (usersOwnExitList[index] != '') {
                    return usersOwnExitList[index]
                  }
                  return signal?.url || ''
                })
                //exitSignal = exitSignal.concat(this.$store.state.usersOwnExitFileHash).filter(item => item !== '')
              } else {
                exitSignal = ['']
              }
              delete backtestData.entry.signals
              for (let i = 0; i < signalEntryList.length; i++) {
                let code = b.encode(signalEntryList[i])
                var singal = {
                  code: code
                }
                entry_signal_list.push(singal)
              }
              console.log('encode: ', signalEntryList, entry_signal_list)

              delete backtestData.exit.signals
              if (!this.isOnlyRisk) {
                for (var i in signalExitList) {
                  let code = b.encode(signalExitList[i])
                  var singal = {
                    code: code
                  }
                  exit_signal_list.push(singal)
                }
              }
              if (this.isOnlyRisk) {
                exit_signal_list = [
                  {
                    code: 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'
                  }
                ]
              }
              let entry = {
                description: backtestData.entry.description,
                score: backtestData.entry.score,
                signals_in_market: backtestData.entry.signals_in_market,
                relation: backtestData.entry.relation,
                delay_bars: backtestData.entry.delay_bars,
                signals: entry_signal_list,
                cond: entry_description.map((i) => i.rocCond)

              }
              let exit = {
                description: backtestData.exit.description,
                score: backtestData.exit.score,
                signals_in_market: backtestData.exit.signals_in_market,
                relation: backtestData.exit.relation,
                delay_bars: backtestData.exit.delay_bars,
                signals: exit_signal_list,
                cond: exit_description.map((i) => i.rocCond)
              }
              delete backtestData.entry
              delete backtestData.exit
              backtestData.description = JSON.stringify(backtestData.description)
              backtestData.entry = JSON.stringify(entry)
              backtestData.exit = JSON.stringify(exit)
              if (Array.isArray(entry_description)) {
                backtestData.entry_description =
                  JSON.stringify(entry_description)
              }
              if (Array.isArray(exit_description)) {
                backtestData.exit_description = JSON.stringify(exit_description)
              }
              //uploade indicator layout

              var indicatorLayout = {}
              indicatorLayout.formIndicators = {
                entry: entrySignal,
                exit: exitSignal
              }
              indicatorLayout.technicalIndicators =
                this.$store.state.indicators.technicalIndicators
              var savedTechSD = []
              for (var i in CIQ.stxx.layout.studies) {
                var output = {}
                if (
                  CIQ.indicatorList.find((j) => {
                    return j.url == CIQ.stxx.layout.studies[i].type
                  }) == undefined
                ) {
                  output = CIQ.stxx.layout.studies[i].outputs
                }
                savedTechSD.push({
                  type: CIQ.stxx.layout.studies[i].type,
                  inputs: CIQ.stxx.layout.studies[i].inputs,
                  outputs: output,
                  parameters: CIQ.stxx.layout.studies[i].parameters,
                  panel: CIQ.stxx.layout.studies[i].panel
                })
              }

              indicatorLayout.savedTechSD = savedTechSD
              indicatorLayout.activatedMA = this.$store.state.activatedMA
              // 暂定，把MA对应位置和信息存在回测内
              indicatorLayout.activatedMALayout = this.$store.state.activatedMALayout
              backtestData.indicator_layout = JSON.stringify(
                indicatorLayout
              ).replaceAll('\u200c', '$r001$')

              let copyBacktestData = JSON.parse(JSON.stringify(backtestData))
              copyBacktestData.currentdate = new Date().getTime()
              let str = UUID(JSON.stringify(copyBacktestData))

              backtestData.pk = str

              // Restore a numeric string in an object to a number
              backtestData.capital_alloc = parseFloat(
                backtestData.capital_alloc
              )
              backtestData.slippage = parseFloat(backtestData.slippage)
              backtestData.win_rate = parseFloat(backtestData.win_rate)

              CIQ.spanPeriod = {
                start_date:
                  backtestData.start_date.replace(/-/g, '') * 1000000000,
                end_date: backtestData.end_date.replace(/-/g, '') * 1000000000
              }
              var backtestParams = {}
              backtestParams.uuid = backtestData.pk
              backtestParams.benchmark = backtestData.benchmark
              backtestParams.capital = backtestData.capital
              backtestParams.capital_alloc = backtestData.capital_alloc
              backtestParams.commission = backtestData.commission
              backtestParams.create_date = backtestData.create_date
              backtestParams.direction = backtestData.direction
              backtestParams.create_date = backtestData.create_date
              backtestParams.end_date = backtestData.end_date
              backtestParams.entry = backtestData.entry
              backtestParams.exit = backtestData.exit
              backtestParams.frequency = backtestData.frequency
              backtestParams.name = backtestData.name
              backtestParams.risk_control = backtestData.risk_control
              backtestParams.slippage = backtestData.slippage
              backtestParams.start_date = backtestData.start_date
              backtestParams.strategy = backtestData.strategy
              backtestParams.symbol = backtestData.symbol
              backtestParams.win_rate = backtestData.win_rate
              backtestParams.backtest_period = backtestData.backtest_period
              backtestParams.trade_price = backtestData.trade_price
              backtestParams.exclude_oo = backtestData.exclude_oo
              backtestParams.description = backtestData.description

              console.log('处理过后的 backtestData', backtestParams)
              backtestParams = JSON.stringify(backtestParams)
              /* ********** */
              let backtestDataStr = this.$qs.stringify(backtestData)
              console.log('backtestDataStr', backtestData)

              // Before the back test, load the data of the whole period and generate CSV to upload S3, and then update the form when the results come out
              this.reloadData(indicatorLayout, backtestData.frequency)
              // 1. Upload data file
              // 2. Upload parameter file
              // 3. Judge the file upload status. If an error is reported, run back test will not be performed

              // TODO
              // long
              let attemptTime = 0

              let callback = async function () {
                if (arguments[0] == 200) {
                  // He upload JSON
                  try {
                    var S3DataStr = vm.$qs.stringify({
                      file_name: backtestData.pk + '/' + backtestData.pk + '_backtest_params.json',
                      file_data: backtestParams
                    })
                    var data = await uploadS3(S3DataStr)
                    try {
                      let res = null
                      try {
                        res = await runBacktest(backtestDataStr)
                      } catch (error) {
                        console.error('error', error)
                        switch (error?.response?.status) {
                          	case 401:
                              vm.$message({
                                message:
                                  'No permission',
                                type: 'error'
                              })
                          		break;
                          	case 403:
                              vm.$message({
                                message:
                                  'The backtest name already exists',
                                type: 'error'
                              })
                          		break;
                          	case 500:
                              vm.$message({
                                message:
                                  'Internal Server Error',
                                type: 'error'
                              })
                          		break;
                          	default:
                              vm.$message({
                                message:
                                  'Unknown error',
                                type: 'error'
                              })
                        }
                        CIQ.hideCover()
                        CIQ.nprogress.done()
                        return
                      }
                      if (res.status === 201) {
                        
                        CIQ.isBacktestRun = true
                        
                        //After saving successfully, clear the backtestinfo back to the original state
                        vm.$store.commit('initialBacktestInfo')
                        vm.goToHistoryForm()
                        vm.$refs.historyChild.refreshHistory(res.data.id)
                        CIQ.hideMarker()
                        CIQ.isMarkerShown = false
                        let backtestInfo = JSON.parse(
                          JSON.stringify(vm.$store.state.backtestInfo)
                        )
                        //clear old_ uuid
                        if (backtestInfo.old_uuid) {
                          vm.$store.commit('clearBacktestUuid')
                        }
                        // clear oldBacktestName
                        vm.backtestEditData = {}
                        vm.resultEditData = {}
                        vm.$refs.setUpChild.clearOldBacktestName()
                        vm.$refs.favoriteChild.getFavoriteList()
                      } else {
                        vm.$message.error('Save failed')
                        CIQ.hideCover()
                        CIQ.nprogress.done()
                        CIQ.hideMarker()
                        CIQ.isMarkerShown = false
                        vm.$refs.setUpChild.clearOldBacktestName()

                        // FindLastSignal过程中代表一个项目的运行结束
                        CIQ.isFindLastSignalRuning = false
                        vm.$store.state.last_signal_array.map(item=>{
                          if(item.name == backtestData.name){
                            item.state = 2
                          }
                        })
                        console.log('FindLastSignalRuning done, runBacktest status !== 201',backtestData,vm.$store.state.last_signal_array)
                      }
                    } catch (error) {

                      vm.$store.commit('initialBacktestInfo')
                      vm.$refs.setUpChild.clearOldBacktestName()
                      vm.$refs.favoriteChild.getFavoriteList()
                      CIQ.hideCover()
                      CIQ.nprogress.done()

                      // FindLastSignal过程中代表一个项目的运行结束
                      CIQ.isFindLastSignalRuning = false
                      vm.$store.state.last_signal_array.map(item=>{
                        if(item.name == backtestData.name){
                          item.state = 2
                        }
                      })
                      console.log('FindLastSignalRuning done, runBacktest 失败',backtestData,vm.$store.state.last_signal_array)

                      switch (error?.response?.status) {
                        case 401:
                          vm.$message({
                            message:
                              'Sample backtest can only be viewed but not run',
                            type: 'error'
                          })
                          break;
                        case 500:
                          vm.$message({
                            message:
                              'Internal Server Error',
                            type: 'error'
                          })
                          break;
                        default:
                          vm.$message({
                            message:
                              'The internal server is busy, please try again later ',
                            type: 'error'
                          })
                      }

                      // Initialize the data of backtestinfo
                      vm.$store.commit('clearStoreDesciption')
                    }
                  } catch (error) {
                    // If uploading JSON fails, try again. Because it is not an Axios request, the retry logic should be written by yourself
                    console.log('Upload JSON failed', error)
                    if (attemptTime < 4) {
                      CIQ.outputSignalsResult(str, callback)
                      attemptTime++
                      console.log('retry the upload request...')
                    } else {
                      CIQ.hideCover()
                      CIQ.nprogress.done()
                      //vm.loading = false
                      alert('Upload JSON failed')

                      // FindLastSignal过程中代表一个项目的运行结束
                      CIQ.isFindLastSignalRuning = false
                      vm.$store.state.last_signal_array.map(item=>{
                        if(item.name == backtestData.name){
                          item.state = 2
                        }
                      })
                      console.log('FindLastSignalRuning done, Upload JSON failed',backtestData,vm.$store.state.last_signal_array)
                    }
                  }
                } else {
                  console.log('Upload CSV failed')
                  // If the upload of CSV fails, the customization returns 500. Try again. Because it is not an Axios request, the retry logic should be written by yourself
                  if (attemptTime < 5) {
                    CIQ.outputSignalsResult(str, callback)
                    attemptTime++
                    console.log('retry the upload request...')
                  } else {
                    CIQ.hideCover()
                    alert('Upload CSV failed')

                    // FindLastSignal过程中代表一个项目的运行结束
                    CIQ.isFindLastSignalRuning = false
                    vm.$store.state.last_signal_array.map(item=>{
                      if(item.name == backtestData.name){
                        item.state = 2
                      }
                    })
                    console.log('FindLastSignalRuning done, Upload CSV failed',backtestData,vm.$store.state.last_signal_array)
                  }
                }
              }
              CIQ.outputSignalsResult(str, callback)
            }
          }
        }
      } catch (error) {
        console.log('抓取error:', error)
        this.$notify({
          title: 'Failed',
          message: 'The internal server is busy, please try again later',
          type: 'error'
        })
      }
      this.$refs.setUpChild.clearOldBacktestName()
    }, 1000),
    goToHistoryForm() {
      this.activeName = 'second'
    },
    async goTobacktestSetupForm(id, resData, action, callback) {
      CIQ.nprogress.inc()
      CIQ.setCoverText('Restoring Backtest form...')
      this.switchMainTab('setup')

      this.$refs.setUpChild.clearForm()
      this.$refs.entryChild.clearForm()
      this.$refs.exitChild.clearForm()
      let vm = this
      //vm.activeName = 'first'
      vm.backtestEditData = {}
      vm.resultEditData = {}
      try {
        let data = resData
        if (action === 'edit' || action === 'canDelView') {
          data.old_uuid = id
        } else if (action === 'cannotDelView') {
          if (data.hasOwnProperty('old_uuid')) {
            delete data.old_uuid
          }
        }
        data.entry = JSON.parse(data.entry)
        data.exit = JSON.parse(data.exit)
        delete data.results
        delete data.status
        delete data.backtest_id
        delete data.user_id
        delete data.uuid
        let signalCode = new SignalCode()
        if (data.entry.signals instanceof Array) {
          data.entry.signals.forEach((item, index) => {
            if (!item.code) {
              data.entry.signals.splice(index, 1)
            }
          })
          data.entry.signals = data.entry.signals.map((value) => {
            return signalCode.decode(value.code)
          })
        }
        if (data.exit.signals instanceof Array) {
          // Delete items with code false
          data.exit.signals.forEach((item, index) => {
            if (!item.code) {
              data.exit.signals.splice(index, 1)
            }
          })
          data.exit.signals = data.exit.signals.map((value) => {
            if (
              value.code !==
              'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'
            ) {
              return signalCode.decode(value.code)
            } else {
              vm.$nextTick(() => {
                vm.$refs.exitChild.setRiskEditData(data)
              })
              data.exit.signals = [{ code: '' }]
              return
            }
          })
          if (data.exit.signals.includes(undefined)) {
            data.exit.signals = [{ code: '' }]
            vm.$nextTick(() => {
              vm.$refs.exitChild.setRiskEditData(data)
            })
          } else {
            let exitPanel = data.exit.signals.length
            let exitData = {}
            exitData.exit = data.exit
            vm.$refs.exitChild.setEditPanel(exitPanel, exitData)
          }
        }
        let entryPanel = data.entry.signals.length
        let entryData = {}
        entryData.entry = data.entry
        vm.$refs.entryChild.setEditPanel(entryPanel, entryData)
        // Get the value of frequency
        vm.editFrequency = data.frequency
        vm.timeFrame = data.frequency
        vm.$store.commit('getFrequency', vm.editFrequency)
        vm.backtestEditData = data
        vm.resultEditData = data
        vm.$refs.setUpChild.setEditData(data)
      } catch (error) {
        console.error(error)
        vm.$message({
          message: 'The internal server is busy, please try again later ',
          type: 'error'
        })
        CIQ.hideCover()
        CIQ.nprogress.done()
        CIQ.isEditFinish = false
        vm.$store.state._last_signal_array.map(item=>{
          if(item.name == resData.name){
            item.state = 2
          }
        })
        // FindLastSignal过程中代表一个项目的运行结束
        CIQ.isFindLastSignalRuning = false
        vm.$store.state.last_signal_array.map(item=>{
          if(item.name == resData.name){
            item.state = 2
          }
        })
        console.log('FindLastSignalRuning done, goTobacktestSetupForm',resData,vm.$store.state.last_signal_array)
      }
      setTimeout(() => {
        if (callback) {
          callback()
        }
      }, 1000)
    },
    goBacktestResultForm(row, callback) {
      try {
        this.activeName = 'third'
        CIQ.nprogress.inc()
        CIQ.setCoverText('Generating Backtest report, please wait...')
        this.$refs.performanceChild.getResultData(row, () => {
          if (callback) {
            callback()
          }
        })
      } catch (error) {
        console.error(error)
      }
    },
    goToFavoritesForm() {
      this.activeName = 'forth'
      this.$refs.favoriteChild.getFavoriteList()
    },
    refFavoritesForm() {
      this.$refs.favoriteChild.getFavoriteList()
    },
    refHistoryForm() {
      this.$refs.historyChild.getHistoryList()
    },
    // Unable to get performance data, server exception
    errorCatchPerformance() {
      this.$notify({
        title: 'Try Another',
        message: 'The backtest cannot request data, please change parameter',
        type: 'warning'
      })
    },
    isOnlyRiskControl(val) {
      this.isOnlyRisk = val
    },
    loadShortLong() {
      const technicalList = CIQ.technicalCategory
      let formatList = []
      for (let i = 0; i < technicalList.length; i++) {
        if (
          technicalList[i].class === 'No_display_technical_indicator' ||
          technicalList[i].class ===
          'Not_in_backtest_technical_indicator_but_visible_in_chatiq'
        )
          continue
        technicalList[i].studies.forEach((item) => {
          let obj = {}
          obj.class = technicalList[i].class
          obj.value = item.name
          obj.url = item.url
          formatList.push(obj)
        })
      }
      return formatList
    },
    getExitRelation(val) {
      this.exitRelation = val
    },
    getEntryRelation(val) {
      this.entryRelation = val
    },
    renderLabel() {
      return this.$createElement('el-select', {
        class: 'brainstorm-select',
        props: {
          value: 'Brainstorm',
          placeholder: 'Please select'
        },
        on: {
          input: this.handleTabChange
        }
      }, this.options.map(option => this.$createElement('el-option', {
        props: {
          label: option.label,
          value: option.value
        }
      })));
    },
    handleTabChange(value) {
      this.activeName = 'seventh'
      const targetPath = `/home/backtester/brainstorm/${value}`;
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath);
      }
    },
    switchTab(tabName) {
      this.activeName = tabName
    },
    rerun() {
      this.runBacktest()
    }
  }
}
</script>
<style lang="less" scoped>
main {
	padding: 0 30px;
	background: #f9fafb;
}
.gradient {
	padding-top: 88px;
	background: linear-gradient(180deg, #dde0e4, rgba(249, 250, 251, 0));
}
@media screen and (max-width: 768px) {
	.restartBtn {
		position: relative;
		z-index: 1;
		width: 10rem;
		margin-left: 100px;
		margin-right: 30px;
		flex: 1;
		//width: 98%;
	}
	.alignRight {
		float: none;
	}
}
@media screen and (min-width: 768px) {
	.navCheck {
		display: none;
	}
	.restartBtn {
		margin-left: 0px !important;
		position: relative;
		z-index: 1;
		width: 12rem;
		flex: 1;
	}
	.alignRight {
		float: right;
		margin: 5px 0 0 10px;
	}
}

.hint {
	// position: absolute;
	text-align: right;
	font-size: 0.8rem;
	color: black !important;
	bottom: -20px;
	right: 30px;
	font-weight: 300;
}

// 暂时的样式
header {
	margin-bottom: 28px;
}
.header {
	img {
		width: 100%;
	}
	p {
		margin: 1rem 2rem 0rem 0rem;
		font-style: italic;
		color: #6c6c6c;
	}
	// p:first-of-type {
	// 	text-align: left;
	// 	font-size: 2.5rem;
	// 	margin: 0px;
	// 	font-weight: lighter;
	// 	color: #333333;
	// }
	background: url(../../assets/dots-blue.png);
}

.criteria-container {
	// padding: 10px;
}
.chart_box {
	padding: 10px 10px;
	resize: auto;
	overflow: hidden;
	margin: 0 25px;
}

.criteria-box {
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #797979;
	align-items: flex-start;
}
.divider {
	width: 1.5px;
	background-color: #e8e6e6;
	opacity: 0.8;
	margin: 10px;
	align-self: stretch;
}
@media (min-width: 820px) and (max-width: 1279px) {
	.criteria-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.criteria-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
.backtest-btns {
	margin-top: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20px;
	padding-bottom: 10px;
	margin-bottom: 12px;
	.el-button:first-child {
		background: rgb(251, 192, 92);
		border: none;
		width: 250px;
	}
	.el-button:first-child:hover {
		background-color: #f59e0b;
	}
	.el-button:last-child {
		background: #5b9bd1;
		border: none;
		width: 250px;
	}
	.el-button:last-child:hover {
		background-color: #409eff;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.criteria-container {
		padding: 0;
	}
	.criteria-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
	.restartBtn {
		padding: 7px;
		font-size: 12px;
	}
	main {
		padding: 0px;
	}
	.backtest-btns {
		.el-button {
			padding: 7px;
			font-size: 12px;
		}
	}
}

.el-dropdown-link {
	cursor: pointer;
	//color: #409eff;
	font-weight: 500;
	line-height: 24px;
	display: inline-flex;
	align-items: center;
	padding: 0;
	transition: color 0.3s ease-in-out;
	color: #6b7280;
	border: none;
	outline: none;
	background: transparent;
}
.el-dropdown-link:hover {
	color: #111827;
}
.el-icon-arrow-down {
	font-size: 12px;
}
/deep/ .el-input__icon {
	line-height: 27px;
}

// maintab btn
.maintabBtnContainer {
	position: fixed;
	left: 0px;
	bottom: 160px;
	z-index: 999;
	> * {
		margin: 15px 0;
	}

	button.sidebar {
		width: 45px;
		height: 40px;
		border-radius: 0px 20px 20px 0px;
		border: 0;
		font-size: 0.6rem;
		font-weight: bold;
		background: #e1e1e1;
		color: #666666;
		font-family: Helvetica, sans-serif;
		cursor: pointer;
		transition: width 0.2s linear;
		&.activated {
			background: #5b9bd1;
			color: white;
		}
		&.refresh {
			border-radius: 21px;
			width: 40px;
			height: 40px;
			margin: 0 5px;
		}
		&:active {
			position: relative;
			top: 1px;
		}
		div {
			align-items: center;
		}
		span {
			white-space: nowrap;
			display: none;
		}
		&:hover {
			width: 229px;
			transition: width 0.2s linear;
		}
		&:hover span {
			white-space: nowrap;
			display: block;
		}
		&.refresh svg.sidebar_button_icon {
			float: none;
		}
		&.refresh:hover svg.sidebar_button_icon {
			float: left;
		}
		svg.sidebar_button_icon {
			float: left;
			margin: 0 5px 0 6px;
			width: 16px;
			height: 16px;
			fill: #666666;
		}
		&.activated svg.sidebar_button_icon {
			float: left;
			margin: 0 5px 0 6px;
			width: 16px;
			height: 16px;
			fill: white;
		}
    // img {
		// 	float: left;
		// 	margin: 0 5px 0 6px;
		// 	width: 16px;
		// 	height: 16px;
		// 	fill: #666666;
		// }
    // &.activated img {
		// 	float: left;
		// 	margin: 0 5px 0 6px;
		// 	width: 16px;
		// 	height: 16px;
		// 	fill: white;
		// }
	}
}
button.createNew,
.toTop {
	// opacity: 0.4;
	z-index: 999;
	border: unset;
	position: fixed;
	right: 60px;
	bottom: 63px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 100%;
	background-image: initial;
	background-position-x: initial;
	background-position-y: initial;
	background-size: initial;
	background-repeat-x: initial;
	background-repeat-y: initial;
	background-attachment: initial;
	background-origin: initial;
	background-clip: initial;
	// background-color: #94989f;
	// background-color: #f59e0b;
	background-color: #fbc05c;
	// box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%),
	// 	0 10px 10px -5px rgb(0 0 0 / 4%);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
	svg.sidebar_button_icon {
		// float: left;
		// margin: 0 5px 0 6px;
		// width: 16px;
		// height: 16px;
		// fill:#666666;
	}
}
.toTop {
	background-color: #b8b9bb;
	bottom: 110px;
}
.createNew:hover {
	background-color: #f59e0b;
	box-shadow: 0 6px 20px #f59e0b;
}
.toTop:hover {
	background-color: #94989f;
	box-shadow: 0 6px 20px #94989f;
}
.createNew_hint {
	position: fixed;
	right: 75px;
	bottom: 120px;
	border: 1px solid black;
	border-radius: 50%;
}

#myFLSbg {
    visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #8b8a8a;
    position: fixed !important;
    z-index: 9998;
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity .3s;
    &.activated {
      visibility: visible;
    }
    .maskContent-loading{
      width: 60vw;
      height: 60vh;
      background: url(../../assets/fls-background.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      img {
        width: 242px;
      }
      span {
        color: #5C9CD1;
        font-size: 1.1rem;
        font-weight: 500;
      }
      p {
        position: relative;
        right: 73px;
        font-size: 14px;
        bottom: 27px;
      }
      .el-button{
        background: #EBF7FF;
        color: #5C9CD1;
        width: 200px;
      }
      .progress-bar{
        width: 60%;
        margin-top: 30px;
      }
    }
    .maskContent-sucess{
      width: 60vw;
      height: 60vh;
      background: url(../../assets/fls-background.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      img {
        width: 60px;
      }
      span {
        color: #5C9CD1;
        font-size: 1.1rem;
        font-weight: 500;
      }
      .el-button{
        background: #EBF7FF;
        color: #5C9CD1;
        width: 200px;
        margin-top: 92px;
      }
      .progress-bar{
        width: 60%;
      }
    }
    .maskContent-failed{
      width: 60vw;
      height: 60vh;
      background: url(../../assets/fls-background.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      > img {
        width: 60px;
      }
      > span {
        color: #FBC05C;
        font-size: 1.1rem;
        font-weight: 500;
      }
      .el-button{
        background: #EBF7FF;
        color: #5C9CD1;
        width: 200px;
        margin-top: 92px;
      }
      ul li{
        display: flex;
        align-items: center;
        img {
          max-height: 100%;
          margin-right: 5px; /* 图标与文字之间的间距 */
        }
      }
      .progress-bar{
        width: 60%;
      }
    }

}
</style>
