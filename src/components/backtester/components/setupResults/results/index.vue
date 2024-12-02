<template>
    <div class="set-up-container">
     <div>
        <ResForm
          :backtestEditData="backtestEditData"
        />
        <Performance ref="performanceChild" :strategy="backtestEditData['strategy']"></Performance>
     </div>
      <LoadingOverlay
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
import { CIQ } from '@/components/common/chart/st-development/js'

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
  beforeRouteEnter(to, from, next) {
  if (to.path === '/backtester/sr/results' && from.path.includes('/backtester')) {
    next(async _this => {
			_this.setResultsLoadingSetting(true, false, 0, 'Loading data...')
      CIQ.addCover('the Marker is Loading')
      if(to.params.usedFor && to.params.usedFor === 'showBTResults'){
        console.log('说明是路由跳转过来携带参数的')
        // 说明是路由跳转过来携带参数的
        const { data } = to.params
        _this.backtestEditData = isJson(data) ? JSON.parse(data) : data
        await _this.$refs.performanceChild.getResultData(_this.backtestEditData,()=>{
          _this.setResultsLoadingSetting(false, false, 0, 'Loading data...')  // 需要在result數據加載結束并marker加載結束後接觸遮罩層
          CIQ.hideCover()
        })
      }else {
        // 说明不是路由跳转，而是从其他界面访问过来的，这个时候读缓存
        console.log('说明不是路由跳转，而是从其他界面访问过来的，这个时候读缓存')
        const editData = _this.$store.state.form.cachedScopedRowDataImmutable
        if(editData?.uuid === 'UUID') {
          _this.setResultsLoadingSetting(false, false, 0, 'Loading data...')
          CIQ.hideCover()
          return
        }
        if (Object.keys(editData).length !== 0) {
          _this.backtestEditData = isJson(editData) ? JSON.parse(editData) : editData
          await _this.$refs.performanceChild.getResultData(editData,()=>{
          _this.setResultsLoadingSetting(false, false, 0, 'Loading data...')
          CIQ.hideCover()
        })
        }else {
          // 這總情況我遇見的就是在初始狀態下切換到result，也需要接觸遮罩層
          _this.setResultsLoadingSetting(false, false, 0, 'Loading data...')
          CIQ.hideCover()
        }
      }
    });
    } else {
      next(_this => {_this.$store.state.form.cachedScopedRowDataImmutable = {}});
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
  beforeDestroy() {
    this.$refs['performanceChild'] = null
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
    position: relative;
  }
</style>