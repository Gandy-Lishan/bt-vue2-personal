<template>
  <div class="set-up-container">
    <ResForm
      :backtestEditData="backtestEditData"
    />
    <Performance ref="performanceChild"></Performance>
  </div>
</template>

<script>
import ResForm from "./resultForm"
import Performance from "./performance"
import {isJson} from '@/tools/isJson'

export default {
  name: 'Results',
  components: {
    ResForm,
    Performance
  },
  data() {
    return {
      backtestEditData: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('result to', to)
    console.log('result from', from)
    console.log('result next', next)
  if (to.path === '/backtester/sr/results') {
    next(async _this => {
      if(to.params.usedFor && to.params.usedFor === 'showBTResults'){
        console.log('说明是路由跳转过来携带参数的')
        // 说明是路由跳转过来携带参数的
        const { data } = to.params
        _this.backtestEditData = isJson(data) ? JSON.parse(data) : data
        await _this.$refs.performanceChild.getResultData(_this.backtestEditData)
      }else {
        // 说明不是路由跳转，而是从其他界面访问过来的，这个时候读缓存
        console.log('说明不是路由跳转，而是从其他界面访问过来的，这个时候读缓存')
        const cachedData = _this.$store.getters.cachedBTBasicInfoData;
        if (Object.keys(cachedData).length !== 0) {
          _this.backtestEditData = isJson(cachedData) ? JSON.parse(cachedData) : cachedData
          await _this.$refs.performanceChild.getResultData(cachedData)
        }
      }
    });
  } else {
    next();
  }
},

}
</script>

<style lang="less" scoped>
  .set-up-container{
    padding-top: 20px;
    background-color: #fff;
  }
</style>