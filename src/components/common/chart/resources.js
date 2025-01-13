/**
 *	2.2.0
 *	Required imports from chartiq for advanced chart
 */

// @ts-ignore
//import { CIQ } from '@/components/common/chart/st-development/js'
import { CIQ } from '@/components/common/chart/st-development/js/components'
// @ts-ignore
import 'chartiq/js/advanced'

import 'chartiq/js/addOns'

// Symbol mapping to market definition
import 'chartiq/examples/markets/marketDefinitionsSample'
import 'chartiq/examples/markets/marketSymbologySample'

import 'chartiq/examples/feeds/symbolLookupChartIQ'

import 'chartiq/examples/translations/translationSample'

// 这里是多余的
// import 'chartiq/js/componentUI'
// import 'chartiq/st-development/js/components'

// Event Markers
// @ts-ignore
import marker from '@/components/common/chart/st-development/components/markers/markersSample.js'
import '@/components/common/chart/st-development/components/markers/tradeAnalyticsSample.js'
import "@/components/common/chart/st-development/components/markers/mMarker.js"
import 'chartiq/examples/markers/videoSample'

import 'chartiq/js/extras/svgcharts/piechart.js'


// import 'chartiq/examples/help/helpContent.js'

// @ts-ignore
import quoteFeed from '@/components/common/chart/st-development/feeds/STStockDataFeed'
import "@/components/common/chart/st-development/feeds/STIndicatorSymbols.js"

// Uncomment the following for the forecasting simulator (required for the forecasting sample).
// @ts-ignore
import forecastQuoteFeed from 'chartiq/examples/feeds/quoteFeedForecastSimulator.js'

// @ts-ignore
import PerfectScrollbar from 'chartiq/js/thirdparty/perfect-scrollbar.esm.js'

// @ts-ignore
//import defaultConfig from 'chartiq/st-development/js/defaultConfiguration'
import defaultConfig from '@/components/common/chart/st-development/js/defaultConfiguration'

// Plugins

// Crypto, L2 Heat Map, Market Depth,
// Important Note. Uncomment the corresponding configuration object below when enabling this plugin.
// import 'chartiq/plugins/activetrader/cryptoiq'

// ScriptIQ
// import 'chartiq/plugins/scriptiq/scriptiq'

// Trading Central: Technical Insights
// import 'chartiq/plugins/technicalinsights/components'

// TFC plugin
// Important Note. Uncomment the corresponding configuration object below when enabling this plugin.
// import 'chartiq/plugins/tfc/tfc-loader'
// import 'chartiq/plugins/tfc/tfc-demo' /* if using demo account class */

// Time Span Events
// Important Note. Uncomment the corresponding configuration object below when enabling this plugin.
import 'chartiq/plugins/timespanevent/timespanevent'
import 'chartiq/plugins/timespanevent/examples/timeSpanEventSample' /* if using sample */

// Trading Central: Analyst Views
// import 'chartiq/plugins/analystviews/components'

// Visual Earnings
// Important Note. Uncomment the corresponding configuration object below when enabling this plugin.
// import 'chartiq/plugins/visualearnings/visualearnings'

// Uncomment the following for the L2 simulator (required for the crypto sample and MarketDepth addOn)
// import 'chartiq/examples/feeds/L2_simulator' /* for use with cryptoiq */

// Creates a complete customised configuration object
function getConfig() {
	////(marker.MarkersSample.prototype.showmMarker('mMarker'))
	return defaultConfig({
		quoteFeed: quoteFeed,
		forecastQuoteFeed: forecastQuoteFeed, // uncomment to enable forecast quote feed simulator
		markerSample: marker.MarkersSample,
		scrollStyle: PerfectScrollbar,
		nameValueStore: CIQ.NameValueStore
	})
	
}

// Creates a complete customised configuration object
function getCustomConfig({
	chartId,
	symbol,
	restore,
	onChartReady
} = {}) {
	const config = getConfig()
	// Update chart configuration by modifying default configuration
	config.chartId = chartId || '_advanced-chart'

	config.initialSymbol = symbol

	if (typeof restore == 'boolean') config.restore = restore

	config.quoteFeeds[0].behavior.refreshInterval = 0; // disables quotefeed refresh
	config.onChartReady = onChartReady

	// Select only plugin configurations that needs to be active for this chart
	const {
		/* eslint-disable */
		marketDepth,
		termStructure,
		tfc,
		timeSpanEventPanel,
		visualEarnings
		/* eslint-enable */
	} = config.plugins
	config.plugins = {
		// marketDepth,
		// termStructure,
		// tfc,
		timeSpanEventPanel,
		// visualEarnings
	}

	// Enable / disable addOns
	// config.enabledAddOns.tooltip = false;
	// config.enabledAddOns.continuousZoom = true;

	return config
}

export { getConfig, getCustomConfig, marker}

