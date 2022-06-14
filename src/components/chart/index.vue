<template>
	<div class="chart-wrapper">
		<AdvancedChartComponent
			:config="config"
			:chartInitialized="chartInitialized"
		/>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AdvancedChartComponent from './AdvancedChartComponent.vue'
import { getCustomConfig } from './resources' // ChartIQ library resources
import store from '../../store/store'
import axios from 'axios'

// @ts-ignore
import { CIQ } from 'chartiq/js/components' // Required for types in chartInitialized

@Component({
	components: {
		AdvancedChartComponent
	}
})
export default class AdvancedWrapper extends Vue {
	@Prop({ type: String, default: '' }) symbol!: string
	@Prop({ type: String, default: '_advanced-chart' }) chartId!: string
	@Prop({ type: Boolean, default: false }) restore!: boolean

	@Prop({ type: Function, default: ({}) => {} }) onChartReady!: Function

	config: any

	constructor() {
		super()

		const { symbol, chartId, onChartReady, restore } = this
		this.config = getCustomConfig({ symbol, chartId, onChartReady, restore })
	}

	// async testIndicators(url,indicators) {

	// for ( var  i = 0; i < indicators.length; i++) {
	//     url += `${i==0?'&indicator=':`&indicator_${i+1}=`}`+indicators[i];
	// }
	// 	const res = await axios.get(
	// 		url,
	// 		{
	// 			auth: {
	// 				username: 'sentimentrader_backtest_api',
	// 				password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
	// 			},
	// 		}
	// 	)

	// 	// var sentimentIndicatorList = res.data.map((obj) => {
	// 	// 	return { value: obj.chart_name, url: obj.url }
	// 	// })

	// 	if(res.data.length!=0){
	// 	}
	// }
	chartInitialized({
		/* eslint-disable */
		chartEngine,
		uiContext,
		config
	}: /* esllint-enable */
	{
		chartEngine: CIQ.ChartEngine
		uiContext: CIQ.UI.Context
		config: any
	}) {
		CIQ.store = store
		CIQ.vue = Vue
		// refresh pag

		// console.log('first CIQ.addIndicators')
		// CIQ.addIndicators()
		var chartBox = document.getElementsByClassName("chart_box")[0]
		var height = 75/100*window.innerHeight
		chartBox.style.height = height.toString()+ 'px'
		CIQ.technicalCategory = config.technicalClassCategory
	}

}
</script>
<style lang="scss" scoped>
.chart-wrapper {
	position: relative;
	height: 100%;
	width: 100%;
	border: 1px solid black;
	border-radius: 5px;
}
@media (min-width: 375px) and (max-width: 767px) {
	.chart-wrapper {
		width: 92%;
	}
}
</style>