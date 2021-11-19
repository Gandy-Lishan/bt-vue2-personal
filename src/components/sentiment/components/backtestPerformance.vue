<template>
   <el-tabs v-model="activePerTag" type="card" @tab-click="handleClick">
    <el-tab-pane label="Summary" name="first">Summary</el-tab-pane>
    <el-tab-pane label="Trades" name="second">Trades</el-tab-pane>
    <el-tab-pane label="Detailed Statistics" name="third">Detailed Statistics</el-tab-pane>
   </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      activePerTag: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
        console.log(tab, event);
      }
  }
}
</script>