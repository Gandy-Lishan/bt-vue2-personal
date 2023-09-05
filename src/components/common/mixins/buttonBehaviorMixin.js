// myMixin.js

export const ButtonBehaviorMixin = {
  methods: {
    async viewBacktestResults(row) {
      console.log('公共方法 viewBacktestResults', row)
      this.$store.commit('form/RESULT_DATA_FOR_SETUP_DISPLAY', row)
      // 在发送组件中进行路由跳转并传递参数
      this.$router.push({
        name: 'SetUpResults',
        params: { data: JSON.stringify(row), usedFor: 'viewResults' },
      });
      return
      this.$store.commit('form/getBacktestSymbol', row.symbol)
      this.$store.dispatch('states/set_isMarkerShown_flag',false)
      if (row.indicator_layout) {
        let parsedData = JSON.parse(row.indicator_layout.replaceAll('$r001$', '\u200c'))
        console.log('parsedData', parsedData)
        // this.restoreIndicatorLayoutView(
        //   parsedData,
        //   row.frequency,
        //   row, row
        // )
      } 
    },
    restoreIndicatorLayoutView(data, freq, row, resData) {
      // After the run back test and between the view result, a chart will be loaded to output signalouput
      var that = this
      if (that.$store.getters.getIsBacktestRunningFlagState == true) {
        that.$store.dispatch('states/set_isBacktestRunning_flag',false)
        //The outputsignalsresult is no longer used. The exportcsv is placed before the backtest and the callback is placed in place
        that.$store.commit('form/getRunBacktestData', row)
        that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
          that.$emit('goBacktestResultForm', row, () => {
            CIQ.hideCover()
            CIQ.nprogress.done()
          })
        })
      } else {
        this.reloadData(data, freq)
        CIQ.addIndicatorsFromBacktest(function () {
          that.$store.commit('form/getRunBacktestData', row)
          that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
            that.$emit('goBacktestResultForm', row, () => {
              CIQ.hideCover()
              CIQ.nprogress.done()
            })
          })
        })
      }
    },
  },
};