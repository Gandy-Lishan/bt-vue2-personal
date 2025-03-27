<template>
  <div class="container">
    <Heatmap :heatmap_data="heatmap_data" ref="HeatMap" large="true"></Heatmap>
  </div>
</template>

<script>
import Heatmap from "./Heatmap";
import { getDashboardData } from "@/service/service";

export default {
  name: 'LargeHeatmap',
  components: {
    Heatmap
  },
  data() {
    return {
      heatmap_data: ''
    }
  },
 beforeRouteEnter(to, from, next) {
  debugger
  if(to.path.includes('/dashboard/heatmap')) {
    next(async _this => {
      // await _this.$nextTick(async () => {
        // 请求 phase_table_data

        if(_this.heatmap_data === '') {
          let {data} = await getDashboardData()
          console.log('lishan data beforeRouteEnter', data)
          _this.heatmap_data = data.heatmap_data || ''
        }
        _this.$refs.HeatMap.initializeHeatMap()
      // })
    })
  }else {
    next()
  }
 },
 async mounted() {
  if(this.heatmap_data === '') {
    let {data} = await getDashboardData()
    console.log('lishan data mounted', data)
    this.heatmap_data = data.heatmap_data || ''
    this.$refs.HeatMap.initializeHeatMap()
  }
 }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>