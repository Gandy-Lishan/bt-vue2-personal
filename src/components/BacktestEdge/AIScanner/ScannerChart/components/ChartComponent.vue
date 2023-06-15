<template>
	<!-- <div class="TVChartContainer" ref="chartContainer" /> -->
	<div class="chart_box" id="chart_box">
		<chart symbol="aaon" :onChartReady="onChartReady" width="100%" height="100%"></chart>
	</div>
</template>

<script>
import chart from '@/components/chart/index.vue'

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
	components: {
    	chart: chart,
	},
	created() {
		console.log(this.other,this.symbol)
	},
	methods:{
		onChartReady(){
			console.log('chart')
		}
	}
}
</script>

<style lang="less" scoped>
.TVChartContainer {
	//height: calc(100vh - 80px);
	height: 100%;
}
</style>