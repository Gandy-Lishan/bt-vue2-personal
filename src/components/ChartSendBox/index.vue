<template>
 <div>

   <SNChart
     v-if="ready"
     :dynamicId="'ai-chart'"
     :dataList="chartData"
     :plotConfiguration="chartConfig"
   />

 </div>
</template>

<script>
import SNChart from '@/components/SNChart.vue'

export default {

 components: {
   SNChart
 },

 data() {
   return {

     ready: false,

     chartData: [],

     chartConfig: {}
   }
 },

 mounted() {

   // 暴露给 OpenClaw
   window.renderChart = this.renderChart

   // 让 AI 能读取当前 chart 数据
   window.getChartData = () => {
     return {
       data: this.chartData,
       config: this.chartConfig
     }
   }

   // 告诉 AI 页面已准备
   window.chartSandboxReady = true
 },

 methods: {

   renderChart(payload) {

     console.log('AI render chart', payload)

     this.ready = false

     this.chartData = payload.dataList

     this.chartConfig = payload.plotConfiguration

     this.$nextTick(() => {

       this.ready = true

       window.chartRendered = true
     })
   }
 }
}
</script>