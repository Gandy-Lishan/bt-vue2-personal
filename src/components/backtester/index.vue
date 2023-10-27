<template>
	<div class="backtester">
    <BTChart></BTChart>
    <router-view></router-view>
	</div>
</template>
<script>
import { BTChart } from "./components"
export default {
  name: 'Backtester',
  components: {
    BTChart
  }
}
</script>
<style lang="less" scoped>
.backtester {
  //padding: 0 20px;
}
</style>
