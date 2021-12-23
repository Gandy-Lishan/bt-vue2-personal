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
	@Prop({ type: Boolean, default: true }) restore!: boolean

	@Prop({ type: Function, default: ({}) => {} }) onChartReady!: Function

	config: any

	constructor() {
		super()

		const { symbol, chartId, onChartReady, restore } = this
		this.config = getCustomConfig({ symbol, chartId, onChartReady, restore })
	}

	chartInitialized({
		/* eslint-disable */
		chartEngine,
		uiContext,
		config
		/* esllint-enable */
	}: {
		chartEngine: CIQ.ChartEngine
		uiContext: CIQ.UI.Context
		config: any
	}) {
		CIQ.store = store;
		CIQ.vue = Vue;
		// refresh page
		CIQ.addIndicators()
		// Methods for capturing state changes in chart engine and UI
		// 	Channel subscribe example to listen to breakpoint changes
		// 	const { channels } = config
		// 	const channelSubscribe = CIQ.UI.BaseComponent.prototype.channelSubscribe
		// 	channelSubscribe(
		// 		channels.breakpoint,
		// 		(value: any) => {
		// 			//('channels.breakpoint', value)
		// 		},
		// 		chartEngine
		// 	)
		// Layout listener example, see parameters at https://documentation.chartiq.com/global.html#layoutEventListener
		// uiContext.stx.addEventListener('layout', ({ layout }: any) => {
		// 	//('layout changed', layout)
		// })
		// Simulate L2 data using https://documentation.chartiq.com/CIQ.ChartEngine.html#updateCurrentMarketData
		// Requires import 'chartiq/examples/feeds/L2_simulator'
		// CIQ.simulateL2({ stx: chartEngine, onInterval: 1000, onTrade: true })
		// CIQ.stx.loadChart(	{ symbol: "AA",startDate:new Date(),endDate:new Date(), indicator:"AAPL"},)
	}
}
</script>
<style lang="scss" scoped>
.chart-wrapper {
	position: relative;
	margin: 10px;
	height: 100%;
	width: 100%;
}
</style>