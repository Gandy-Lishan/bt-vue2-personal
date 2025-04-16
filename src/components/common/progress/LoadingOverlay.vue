<template>
    <div :class="{ 'progress-container': isLoading, 'dont-show-content': !isLoading }" :style="{ 'backgroundColor': backgroundColor }">
      <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26" :percentage="percentage" :color="customColorMethod"></el-progress>
      <span class="progress-text" :style="{'color': progressTextColor}"><i class="el-icon-loading"></i>{{ progressText }}</span>
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
    backgroundColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0.8)'
    }, // 背景颜色
  },
  data() {
    return {
      progressTextColor: '#409eff'
    }
  },
  methods: {
    customColorMethod(percentage) {
      if (percentage < 50) {
        this.progressTextColor = '#a0e3ec'
        return '#a0e3ec'
      } else if (percentage < 70) {
        this.progressTextColor = '#58d9ea'
        return '#58d9ea';
      } else if(percentage < 90){
        this.progressTextColor = '#15cfe7'
        return '#15cfe7';
      }else {
        this.progressTextColor = '#66ace5'
        return '#66ace5';
      }
    },
  },
};
</script>

<style lang="less" scoped>

.progress-container {
	border-radius: 20px;
	height: 100%;
  min-height: 500px;
	/* opacity: 0.5; */

	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	flex-direction: column;
  
	position: absolute;
	z-index: 9999;
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transition: opacity .3s;
}
.el-progress{
	width: 80%;
}
.progress-text{
	font-size: 16px;
	color: #409eff;
	margin-top: 10px;
	i {
		margin-right: 10px;
	}
}
.dont-show-content {
  opacity: 0;
}
</style>
