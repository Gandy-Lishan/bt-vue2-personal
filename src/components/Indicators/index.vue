<template>
  <IndicatorPage></IndicatorPage>
</template>

<script>
import IndicatorPage from "./Table/index";
export default {
  name: 'Indicators',
  components: {
    IndicatorPage
  },
  beforeDestroy() {
    this.$store.state.chart.indicatorsPageListdata = {}
  }
}
</script>

<style lang="less" scoped>
</style>