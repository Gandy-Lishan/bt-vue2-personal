<template>
    <chart :symbol="default_symbol" width="100%" height="100%" :onChartReady="onChartReady">
      <LoadingOverlayChart
          :isLoading="chartLoadingSetting.isChartLoading"
          :progressText="chartLoadingSetting.progressText"
        >
      </LoadingOverlayChart>	
    </chart>
</template>

<script>
import chart from '@/components/common/chart/index.vue'
import { CIQ } from '@/components/common/chart/st-development/js/components'
import { LoadingOverlayChart } from "@/components/common"
import { mapGetters } from "vuex"
export default {
name: 'Reports',
data() {
  return {
    default_symbol: process.env.VUE_APP_DEFAULT_SYMBOL
  }
},
components: {
    chart: chart,
    LoadingOverlayChart,
},
computed: {
  ...mapGetters(['getBacktestSymbol']), // 监听chartiq和表单的symbol改动以双向响应
    handleGetBacktestSymbol() {
      return this.getBacktestSymbol
    },
  chartLoadingSetting() {
    // 从 Vuex store 中获取全局 loading 状态
    return this.$store.state.chart.chartLoadingSetting
  },
},
watch: {
  handleGetBacktestSymbol: {
      handler(newVal) {
        CIQ.removeForecastMarker()
        CIQ.createForecastMarker()
      },
      //immediate: true,
      deep: true
    },
  chartLoadingSetting: {
    handler(newValue, _) {
      // 在对象属性发生变化时触发的处理逻辑
      this.chartLoadingSetting = newValue
    },
    deep: true, // 启用深度监听，监视对象属性的变化
  },
},
beforeDestroy() {
  // clear all report forecast marker
  CIQ.removeForecastMarker()
},
methods:{
  onChartReady(){
    this.hideComponents()	
    CIQ.createForecastMarker()
    CIQ.hideCover()
    CIQ.nprogress.done()
  },
  hideComponents() {
    //let search = document.querySelector(".ciq-search")
    let indicatorSearch = document.querySelector(".ciq-indicators-search")
    let studies = document.querySelector(".ciq-studies")
    let favBtnContainer = document.querySelector(".favBtnContainer")
    let timeframeBtn = document.querySelector('.ciq-period')
    //let footer = document.querySelector('.ciq-footer')

    //search.style.visibility = 'hidden'
    indicatorSearch.style.visibility = 'hidden'
    studies.style.visibility = 'hidden'
    favBtnContainer.style.display = 'none'
    timeframeBtn.style.display = 'none'
    // footer.style.display = 'none'
    
    // hide dual symbol
    document.querySelectorAll(".cq-comparison-new")[0].style.display = 'none'
  }
}
}
</script>

<style lang="less" scoped>
.chart-wrapper {

	border: none;

	resize: none;
}
</style>