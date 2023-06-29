<template>
  <div class="chat-container">
    <div class="slogan">
      <div class="slogan-item">
        <p>Chat with me and grasp the pulse of the stock market!</p>
      </div>
      <div class="slogan-item">
        <p>Explore opportunities in the stock world through conversation!</p>
      </div>
      <div class="slogan-item">
        <p>Engage in a dialogue with me and discover the potential of investments!</p>
      </div>
      <div class="slogan-item">
        <p>Chat with an intelligent investment partner and gain insights into stock investments!</p>
      </div>
    </div>
    <div class="input-box">
    <el-input placeholder="Input some info for backtesting" v-model="inputText">
    <el-button slot="append" @click="chatClick">Go</el-button>
  </el-input>
    </div>
  </div>
</template>

<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { seeParams } from '@/service/service';
export default {
  name: 'Chat',
  data() {
    return {
      inputText: ''
    };
  },
  methods: {
    async chatClick(id) {
      id = 'd2fd9178-f3fb-980c-1c03-9c8389b860b1'
      CIQ.addCover('Fetching backtest information...')
      CIQ.nprogress.start()
      const res = await seeParams(id)
      console.log('RES', res)
      this.$store.commit('getBacktestSymbol', res.data.symbol)
      CIQ.hideMarker()
      CIQ.isMarkerShown = false
      if (res.data.indicator_layout) {
          let parsedData = JSON.parse(res.data.indicator_layout.replaceAll('$r001$', '\u200c'))
          this.restoreIndicatorLayoutView(
            parsedData,
            res.data.frequency,
            res.data,
            res.data
          )
        } else {
          this.$store.commit('getRunBacktestData', res.data)
          this.$emit('goTobacktestSetupForm', id, res.data, 'canDelView', () => {
            this.$emit('goBacktestResultForm', res.data, () => {
              CIQ.hideCover()
              CIQ.nprogress.done()
            })
          })
        }
      this.inputText = '';
    },
    restoreIndicatorLayoutView(data, freq, row, resData) {
      // After the run back test and between the view result, a chart will be loaded to output signalouput
      if (CIQ.isBacktestRun == true) {
        CIQ.isBacktestRun = false
        var that = this
        //The outputsignalsresult is no longer used. The exportcsv is placed before the backtest and the callback is placed in place
        that.$store.commit('getRunBacktestData', row)
        that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
          that.$emit('goBacktestResultForm', row, () => {
            CIQ.hideCover()
            CIQ.nprogress.done()
          })
        })
      } else {
        this.reloadData(data, freq)
        var that = this
        CIQ.addIndicatorsFromBacktest(function () {
          that.$store.commit('getRunBacktestData', row)
          that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
            that.$emit('goBacktestResultForm', row, () => {
              CIQ.hideCover()
              CIQ.nprogress.done()
            })
          })
        })
      }
    },
    reloadData(data, freq) {
      let frequency = ''
      this.$store.commit('getEntryIndicatorsList', data.formIndicators.entry)
      this.$store.commit('getExitIndicatorsList', data.formIndicators.exit)
      this.$store.commit('getExtraIndicators', [])
      // filter garbage in TechnicalIndicators
      // const technicalIndicators = data.technicalIndicators.filter(item=>{
      // 	data.formIndicators.entry.indexOf(item) != -1 || data.formIndicators.exit.indexOf(item) != -1
      // })
      this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
      this.$store.commit('getMA', data.activatedMA)
      // 暂定，编辑时读取回测携带的ma位置和信息
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
  }
};
</script>
<style lang="less" scoped>
.chat-container{
  background-color: #fff;
}
.input-box{
  width: 90%;
  margin-bottom: 20px;
}
.slogan{
  background-color: #f8f8f8;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  height: 350px;
}
.slogan-item{
  background-color: #eeeeee;
  width: 200px;
  height: 150px;
  padding: 10px;
  border-radius: 10px;
  // text-align: center;
}
p{
	line-height: 1.7;
	font-weight: 400;
  margin: 0 auto;
}
</style>
