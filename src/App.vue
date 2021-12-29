<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>
<style lang="scss">
@import '../node_modules/chartiq/css/normalize.css';
@import '../node_modules/chartiq/css/page-defaults.css';
@import '../node_modules/chartiq/css/stx-chart.css'; // Chart API
@import '../node_modules/chartiq/css/chartiq.css'; // Chart UI
@import '../node_modules/chartiq/st-development/css/ST-chartiq.css';
#app {
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  
}
</style>
