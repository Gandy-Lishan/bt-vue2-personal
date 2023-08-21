<template>
	<div>
    <BTHeader></BTHeader>
    <Tabs></Tabs>
	</div>
</template>
<script>
import { BTHeader, Tabs } from "./components"
export default {
  name: 'Backtester',
  components: {
    BTHeader,
    Tabs
  }
}
</script>
<style lang="less" scoped>
</style>
