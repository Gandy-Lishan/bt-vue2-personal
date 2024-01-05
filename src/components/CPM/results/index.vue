<template>
  <div class="CPMResults-container">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="Backtest Summary" name="1">
        <CPMSummary></CPMSummary>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback" name="2">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import CPMSummary from "./components/summary";
export default {
  name: 'CPMResults',
  data() {
    return {
      activeNames: ['1']
    }
  },
  components: {
    CPMSummary
  },
  methods: {
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="less" scoped>
.CPMResults-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  width: 80vw;
  margin: 0 auto;
  background-color: #fff;
}
/deep/ .el-collapse-item__header {
  padding: 10px 15px;
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  font-weight: 300;
  color: #666;
}
</style>