<template>
	<div class="my-inicator-container">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'MyIndicator',
	methods: {}
}
</script>

<style lang="less" scoped>
@media (min-width: 768px) {
  .my-inicator-container {
      width: 750px;
  }
}
@media (min-width: 992px) {
  .my-inicator-container {
      width: 970px;
  }
}
@media (min-width: 1200px) {
  .my-inicator-container {
      width: 1170px;
  }
}
.my-inicator-container {
	padding-top: 0px;
	padding-right: 15px;
	padding-left: 15px;
	margin-right: auto;
	margin-left: auto;
}
</style>