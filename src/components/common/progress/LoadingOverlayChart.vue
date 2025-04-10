<template>
    <div :class="{ 'progress-container': isLoading, 'dont-show-content': !isLoading }">
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
  mounted(){
    // this.isLoading = true
  }
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
	z-index: 9999;
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transition: visibility .3s;
}
.progress-text{
	font-size: 16px;
	color: #409eff;
	margin-top: 10px;
	i {
		margin-right: 10px;
	}
}

.loading-icon{

	background-image:url(../../../assets/loading-spin-white.svg);
	background-size:cover;

  animation: spin 0.8s infinite linear;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 6px solid white;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-top-color: transparent;
  margin-left: 30px;
}
@keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}
.dont-show-content {
  visibility:hidden;
}
</style>
