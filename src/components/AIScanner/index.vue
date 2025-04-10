// Home
<template>
	<div class="aiscanner-container">
    <router-view></router-view>
	</div>
</template>
<script>
export default {
	name: 'aiscannerLayout',
	data() {
		return {
		}
	},
}
</script>
<style lang="less" scoped>
.aiscanner-container {
	font-family: "Open Sans",sans-serif;
	padding-top: 30px;
	padding-right: 15px;
	padding-left: 15px;
	margin-right: auto;
	margin-left: auto;
}
@media (min-width: 768px) {
  .aiscanner-container {
      width: 750px;
  }
}
@media (min-width: 992px) {
  .aiscanner-container {
      width: 970px;
  }
}
@media (min-width: 1200px) {
  .aiscanner-container {
      width: 1170px;
  }
}
@media (min-width: 1921px) {
  .aiscanner-container {
      width: 1664px;
  }
}

/deep/ .el-table th.el-table__cell>.cell {
	padding-left: 0px;
	padding-right: 0px;
}
</style>
