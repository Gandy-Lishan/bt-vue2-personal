<template>
  <div v-show="isLoading">
    <div class="progress-container">
      <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26" :percentage="percentage" :color="customColorMethod"></el-progress>
      <span class="progress-text"><i class="el-icon-loading"></i>{{ progressText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    isLoading: Boolean,          // 是否显示遮罩
    showProgress: Boolean,       // 是否显示进度条
    percentage: Number,          // 进度条百分比
    progressText: String,        // 进度文本
    // customColorMethod: Function, // 自定义颜色方法
  },
  methods: {
    customColorMethod(percentage) {
      if (percentage < 50) {
        return '#909399'
      } else if (percentage < 70) {
        return '#f56c6c';
      } else if(percentage < 90){
        return '#e6a23c';
      }else {
        return '#67c23a';
      }
    },
  }
};
</script>

<style lang="less" scoped>
.progress-container {
	background: rgba(0, 0, 0, 0.8);
	border-radius: 20px;
	height: 100vh;
	/* opacity: 0.5; */
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	flex-direction: column;
}
.el-progress{
	width: 80%;
}
.progress-text{
	font-size: 12px;
	color: #409eff;
	margin-top: 10px;
	i {
		margin-right: 10px;
	}
}
</style>
