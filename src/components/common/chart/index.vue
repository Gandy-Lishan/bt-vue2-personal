
<template>
	<div class="chart-wrapper">
		<AdvancedChartComponent
			:config="config"
			:chartInitialized="chartInitialized"
		/>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AdvancedChartComponent from './AdvancedChartComponent.vue'
import { getCustomConfig } from './resources.js' // ChartIQ library resources
import store from '../../../store'

// @ts-ignore
//import { CIQ } from './st-development/js/entryIndicator'
import { CIQ } from '@/components/common/chart/st-development/js/components' // Required for types in chartInitialized

@Component({
	components: {
		AdvancedChartComponent,
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

		// 设置chartBox为单例以统一管理高度
		// CIQ.chartBox = document.getElementsByClassName("chart_box")[0] as HTMLElement;
		// CIQ.setPanelHeight([])

		this.initiateTechList(config)
	}

    async initiateTechList(config:any) {
		await store.dispatch('chart/initiate_tech_list', config.technicalClassCategory)
    }
}
</script>
<style lang="scss" scoped>
.chart-wrapper {
	position: relative;
	//height: 100%;
	width: 100%;
	border: 1px solid black;
	border-radius: 5px;
	resize: auto;
    overflow: hidden;
}
@media (min-width: 375px) and (max-width: 767px) {
	.chart-wrapper {
		width: 92%;
	}
}
</style>
