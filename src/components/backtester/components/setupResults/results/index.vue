<template>
    <div class="set-up-container">
     <div v-show="!resultsLoadingSetting.isResultsLoading">
        <ResForm
          :backtestEditData="backtestEditData"
        />
        <Performance ref="performanceChild"></Performance>
     </div>
      <LoadingOverlay
        v-show="resultsLoadingSetting.isResultsLoading"
        :isLoading="resultsLoadingSetting.isResultsLoading"
        :showProgress="resultsLoadingSetting.showProgress"
        :percentage="resultsLoadingSetting.percentage"
        :progressText="resultsLoadingSetting.progressText"
      >
      </LoadingOverlay>
    </div>
</template>

<script>
import ResForm from "./resultForm"
import Performance from "./performance"
import {isJson} from '@/utils'
import { LoadingOverlay } from "@/components/common"

export default {
  name: 'Results',
  components: {
    ResForm,
    Performance,
    LoadingOverlay
  },
  data() {
    return {
      backtestEditData: {}
    }
  },
  beforeRouteEnter(to, _, next) {
  if (to.path === '/backtester/sr/results') {
    next(async _this => {
			_this.setResultsLoadingSetting(true, false, 0, 'Loading data...')
      if(to.params.usedFor && to.params.usedFor === 'showBTResults'){
        console.log('说明是路由跳转过来携带参数的')
        // 说明是路由跳转过来携带参数的
        const { data } = to.params
        _this.backtestEditData = isJson(data) ? JSON.parse(data) : data
        await _this.$refs.performanceChild.getResultData(_this.backtestEditData)
      }else {
        // 说明不是路由跳转，而是从其他界面访问过来的，这个时候读缓存
        console.log('说明不是路由跳转，而是从其他界面访问过来的，这个时候读缓存')
        const editData = _this.$store.getters.rowDataForDisplay
        if (Object.keys(editData).length !== 0) {
          _this.backtestEditData = isJson(editData) ? JSON.parse(editData) : editData
          await _this.$refs.performanceChild.getResultData(editData)
        }
      }
			_this.setResultsLoadingSetting(false, false, 0, 'Loading data...')
    });
    } else {
      next();
    }
  },
  computed: {
    resultsLoadingSetting() {
      // 从 Vuex store 中获取全局 loading 状态
      return this.$store.state.form.resultsLoadingSetting
    },
  },
	watch: {
    resultsLoadingSetting: {
      handler(newValue, _) {
        // 在对象属性发生变化时触发的处理逻辑
				this.resultsLoadingSetting = newValue
      },
      deep: true, // 启用深度监听，监视对象属性的变化
    },
  },
  methods: {
    setResultsLoadingSetting(isResultsLoading, showProgress, percentage, progressText) {
			this.$store.commit('form/SET_RESULTS_LOADING', {
				isResultsLoading,
				showProgress,
				percentage,
				progressText
			})
		},
  }

}
</script>

<style lang="less" scoped>
  .set-up-container{
    padding-top: 20px;
    background-color: #fff;
  }
</style>