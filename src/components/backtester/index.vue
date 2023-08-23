<template>
	<div class="backtester">
    <BTHeader></BTHeader>
    <router-view></router-view>
	</div>
</template>
<script>
import { BTHeader } from "./components"
export default {
  name: 'Backtester',
  components: {
    BTHeader
  }
}
</script>
<style lang="less" scoped>
.backtester {
  //padding: 0 20px;
}
</style>
