<template>
    <div :class="{ 'progress-container': isLoading }">
      <span class="progress-text"><div class="loading-icon"></div></span>
    </div>
</template>

<script>
export default {
  name: 'LoadingOverlayChart',
  props: {
    isLoading: Boolean,          // 是否显示遮罩
    progressText: String,        // 进度文本
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
.progress-container {
	background: rgba(0, 0, 0, 0.8);
	height: 100%;
  min-height: 500px;
	/* opacity: 0.5; */

	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	flex-direction: column;
  
	position: absolute;
	z-index: 2000;
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transition: opacity .3s;
}
.progress-text{
	font-size: 12px;
	color: #409eff;
	margin-top: 10px;
	i {
		margin-right: 10px;
	}
}

.loading-icon{
  height: 50px;
  width: 50px;
	background-image:url(../../../assets/loading-spin-white.svg);
	background-size:cover;
}
</style>
