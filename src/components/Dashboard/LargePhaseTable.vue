<template>
  <div class="container">
    <PhaseTable :phase_table_data="dashBoardData.phase_table_data" large="true"></PhaseTable>
  </div>
</template>

<script>
import PhaseTable from "./PhaseTable";
import { getDashboardData } from "@/service/service";
import { isJson } from "@/utils";

export default {
  name: 'LargePhaseTable',
  components: {
    PhaseTable
  },

  data() {
    return {
      dashBoardData: {}
    }
  },
 beforeRouteEnter(to, from, next) {
  debugger
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