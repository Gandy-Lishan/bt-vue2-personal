<template>
	<div class="cpm-container">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'CPM',
	methods: {

	}
}
</script>

<style lang="less" scoped>
.cpm-container {
	font-family: "Open Sans",sans-serif;
	// padding-top: 50px;
	padding-right: 15px;
	padding-left: 15px;
	margin-right: auto;
	margin-left: auto;
}
@media (min-width: 768px) {
  .cpm-container {
      width: 750px;
  }
}
@media (min-width: 992px) {
  .cpm-container {
      width: 970px;
  }
}
@media (min-width: 1200px) {
  .cpm-container {
      width: 1170px;
  }
}
</style>