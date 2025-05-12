<template>
  <div>
    <div class="container">
      <PhaseTable :phase_table_data="dashBoardData.phase_table_data" large="true"></PhaseTable>
    </div>
    <div class="row">
      <AboutUs></AboutUs>
    </div>
  </div>
</template>

<script>
import PhaseTable from "./PhaseTable";
import { getDashboardData } from "@/service/service";
import { isJson } from "@/utils";
import AboutUs from "@/components/Indicators/Table/AboutUs.vue";

export default {
  name: 'LargePhaseTable',
  components: {
    PhaseTable,
    AboutUs
  },

  data() {
    return {
      dashBoardData: {}
    }
  },
 beforeRouteEnter(to, from, next) {
  console.log('lishan data')

  if(to.path.includes('/dashboard/phase_table')) {
    next(async _this => {
      // 请求 phase_table_data
      let {data} = await getDashboardData()
      console.log('lishan data', data)
      _this.dashBoardData = data
    })
  }else {
    next()
  }
 },
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>