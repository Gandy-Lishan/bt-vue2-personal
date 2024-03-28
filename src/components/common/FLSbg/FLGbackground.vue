<template>
    <div id="myFLSbg">
      <div class="maskContent-fetch" v-if="
        getLastSignalArray.length==0 &&
        getAllSignalArray.length==0
      ">
        <img src="@/assets/fls-fetch.gif"/>
        <span>Fetching Backtests List</span> 
        <p>It might take a few seconds for the Backtests list be ready</p>
      </div>

      <div class="maskContent-loading" v-if="getLastSignalArray.length>0 && progressBarVal < 100">
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
        <div class='msg'>
          <div class='desc'>{{numOfProcessedBacktests}} out of {{getLastSignalArray.length}} tasks have been completed</div>
          <div class='time'><span><img src="@/assets/fls-time.png"/></span>{{ approTime}}</div>
        </div>

        <el-button @click="refreshPageTemp">Cancel</el-button>
      </div>    
      <div class="maskContent-sucess" v-if="
        getLastSignalArray.length>0 &&
        progressBarVal == 100 &&
        getLastSignalArray.findIndex(x=>x.state==2) == -1 &&
        getAllSignalArray.findIndex(x=>x.state==3) == -1 &&
        isAllFLSRequestsDone
      ">
        <img src="@/assets/allclear.png"/>
        <span>Find Sucessfully</span> 
        <p>All of the tasks have been completed</p>
        <el-button @click="viewSignal">View Signal</el-button>
      </div>
      <div class="maskContent-failed" v-if="
        getLastSignalArray.length>0 &&
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

      <div class="maskContent-loading" v-if="getAllSignalArray.length>0 && progressBarValALL < 100">
        <img src="@/assets/fls.gif"/>
        <span>Migrating backtests</span> 
        <progress-bar 
          class="progress-bar"
          bar-color="linear-gradient(to right,#A0E3EC, #66ACE5)" 
          :val="progressBarValALL" 
          :text="progressBarValALL + '%'"
          :title="progressBarValALL + '%'"
          bar-border-radius="20"
          size="huge"
        ></progress-bar>
        <div class='msg'>
          <div class='desc'>{{numOfProcessedBacktestsALL}} out of {{getAllSignalArray.length}} tasks have been completed</div>
          <div class='time'>{{approTime}}</div>
        </div>
        <el-button @click="refreshPageTemp">Cancel</el-button>
      </div>    
      <div class="maskContent-sucess" v-if="
        getAllSignalArray.length>0 &&
        progressBarValALL == 100 &&
        getAllSignalArray.findIndex(x=>x.state==2) == -1 &&
        getAllSignalArray.findIndex(x=>x.state==3) == -1
      ">
        <img src="@/assets/allclear.png"/>
        <span>Backtests From Backtest Engine V1.0 Have Been Migrated to Backtest Engine V2.0</span> 
        <!-- <p>All of the tasks have been completed</p> -->
        <el-button @click="viewSignal">View List</el-button>
      </div>
      <div class="maskContent-failed" v-if="
        getAllSignalArray.length>0 &&
        progressBarValALL == 100 &&
        getAllSignalArray.findIndex(x=>x.state==2) != -1
      ">
        <img src="@/assets/errorocuur.png"/>
        <span>Find Error</span> 
        <p>Please modify your backtest and try it again</p>
        <ul>
          Your signals have the following error:
          <li><img src="@/assets/erroritem.png"/><span>{{numOfFailedBacktestsALL}} errors were found</span></li>
        </ul>
        <el-button @click="viewSignal">Return for modification</el-button>
      </div>
      <div class="maskContent-noItem" v-if="
        getAllSignalArray.length==1 &&
        getAllSignalArray.findIndex(x=>x.state==3) == 0
      ">
        <img src="@/assets/allclear.png"/>
        <span>No Backtests Need to be Migrated</span> 
        <!-- <p>All of the tasks have been completed</p> -->
        <el-button @click="viewSignal">View List</el-button>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProgressBar from 'vue-simple-progress'

export default {
  name: 'FLGbackground',
  props: {
    isAllFLSRequestsDone: Boolean
  },
  components: {
    ProgressBar,
  },
  data() {
    return {
      // find the last signal
      progressBarVal: 0,
      numOfFailedBacktests: 0,
      numOfProcessedBacktests:0,

      // run all backtests
      progressBarValALL: 0,
      numOfFailedBacktestsALL: 0,
      numOfProcessedBacktestsALL:0,
    }
  },
  computed: {
    ...mapGetters(['getLastSignalArray']),
    handleLastSignalArrayChange() {
      return this.getLastSignalArray
    },
    ...mapGetters(['getAllSignalArray']),
    handleAllSignalArrayChange() {
      return this.getAllSignalArray
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
        const formatedSec = this.formatSec((arrayLenth-this.numOfProcessedBacktests)*7)
        this.approTime =  formatedSec[1] + 'mins ' + formatedSec[2] + 'seconds'

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
    handleAllSignalArrayChange: {
      handler(newVal) {
        let arrayLenth = newVal.length
        let progressNum = 0
        newVal.map(item=>{ 
          if(item.state!=0){
            progressNum ++
          }
        })
        this.numOfProcessedBacktestsALL = progressNum
        this.progressBarValALL = Math.ceil(progressNum/arrayLenth*100)
        const formatedSec = this.formatSec((arrayLenth-this.numOfProcessedBacktestsALL)*20)
        this.approTime =  formatedSec[1] + 'mins ' + formatedSec[2] + 'seconds'

        // 统计fls中失败的回测数量
        let count = 0
        newVal.map(x=>{
          if(x.state==2){
            count++
          }
        })
        this.numOfFailedBacktestsALL = count
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    formatSec(time) {
      // 转换为式分秒
      let h = parseInt(time / 60 / 60 % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt(time / 60 % 60)
        m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
        s = s < 10 ? '0' + s : s
      // 作为返回值返回
      return [h, m, s]
    },
    // 暂定cancel一个回测的解决方案
    refreshPageTemp(){
      this.$router.go(0)
    },
    viewSignal: function() {
      // this.$router.push('/backtester/list/favorites')
      const myFLSbg = document.querySelector('#myFLSbg')
      myFLSbg.classList.remove('activated')

      this.numOfProcessedBacktests = 0
      this.progressBarVal = 0
      this.numOfFailedBacktests = 0

      this.progressBarValALL = 0
      this.numOfFailedBacktestsALL = 0
      this.numOfProcessedBacktestsALL = 0

      this.approTime = 0

      this.$store.commit('form/SET_LASTSIGNAL_ARRAY',[])
      this.$store.commit('form/SET_RUNALL_BACKTEST_ARRAY',[])
    },
  }
}
</script>

<style lang="less" scoped>
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
    .maskContent-fetch{
      width: 60vw;
      height: 60vh;
      background: url(../../../assets/fls-background.png);
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
        font-size: 11px;
      }
    }
    .maskContent-loading{
      width: 60vw;
      height: 60vh;
      background: url(../../../assets/fls-background.png);
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
      >span {
        color: #5C9CD1;
        font-size: 1.1rem;
        font-weight: 500;
      }
      .msg {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 60%;
        .desc {
          font-size: 12px;
        }
        .time {
          font-size: 9px;
          color: #bbbbbb;
          img {
            position: relative;
            width: 13px;
            top: 1px;
            right: 4px;
          }
        }
      }

      .el-button{
        background: #EBF7FF;
        color: #5C9CD1;
        width: 200px;
        margin-top: 30px
      }
      .progress-bar{
        width: 60%;
        margin-top: 30px;
      }
    }
    .maskContent-sucess,.maskContent-noItem{
      width: 60vw;
      height: 60vh;
      background: url(../../../assets/fls-background.png);
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

        margin: 20px 210px 0 210px;
        text-align: center;
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
      background: url(../../../assets/fls-background.png);
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