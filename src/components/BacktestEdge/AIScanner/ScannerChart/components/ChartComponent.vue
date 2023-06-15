<template>
	<div class="TVChartContainer" ref="chartContainer" />
</template>

<script>

export default {
	name: 'TVChartContainer',
	props: {
		other: Object,
		symbol :String,
		direction: String,
	},
	data() {
		return {

		}
	},
	created() {
		console.log(this.other,this.symbol)
	},
}
</script>

<style lang="less" scoped>
.TVChartContainer {
	//height: calc(100vh - 80px);
	height: 100%;
}
</style>