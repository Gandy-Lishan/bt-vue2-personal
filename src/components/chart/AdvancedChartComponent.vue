<template>
	<cq-context ref="container">
		<cq-color-picker></cq-color-picker>
		
		<div class="ciq-nav full-screen-hide">
			<!-- enables the more button when in break-sm mode -->
			<div class="sidenav-toggle ciq-toggles">
				<cq-toggle
					class="ciq-sidenav"
					cq-member="sidenav"
					cq-toggles="sidenavOn,sidenavOff"
					cq-toggle-classes="active,"
					keyboard-navigation="false"
					><span></span>
					<cq-tooltip>More</cq-tooltip>
				</cq-toggle>
			</div>

			<!-- <cq-menu class="ciq-search">
				<cq-lookup cq-keystroke-claim cq-uppercase></cq-lookup>
			</cq-menu> -->

			<!-- any entry in this div will be shown in the side navigation bar in break-sm mode -->
			<cq-side-nav cq-on="sidenavOn">
				<div class="icon-toggles ciq-toggles">
					<cq-menu class="ciq-search">
						<cq-lookup cq-keystroke-claim cq-uppercase></cq-lookup>
					</cq-menu>
					<!-- <cq-toggle class="ciq-draw" cq-member="drawing">
						<cq-help help-id="drawing_tools_toggle"></cq-help>
						<span></span><cq-tooltip>Draw</cq-tooltip>
					</cq-toggle> -->
					<cq-menu class="ciq-indicators-search">
						<cq-indicators-lookup cq-keystroke-claim="" cq-uppercase=""></cq-indicators-lookup>
					</cq-menu>
					<!-- <cq-info-toggle-dropdown>
						<cq-toggle id="mStudies" class="ciq-CH" cq-member="crosshair">
							<span></span>
							<cq-tooltip>Crosshair (Alt + \)</cq-tooltip>
						</cq-toggle>

						<cq-menu class="ciq-menu toggle-options collapse">
							<span></span>
							<cq-menu-dropdown>
								<cq-item cq-member="crosshair"
									>Hide Heads-Up Display<span class="ciq-radio"
										><span></span></span
								></cq-item>
								<cq-item cq-member="headsUp-static"
									>Show Heads-Up Display<span class="ciq-radio"
										><span></span></span
								></cq-item>
							</cq-menu-dropdown>
						</cq-menu>
					</cq-info-toggle-dropdown> -->

					<cq-info-toggle-dropdown>
						<cq-toggle class="ciq-HU" id="ciq-HU" cq-member="headsUp">
							<span></span>
							<cq-tooltip>Info</cq-tooltip>
						</cq-toggle>
						<cq-menu class="ciq-menu toggle-options collapse tooltip-ui">
							<span></span>
							<cq-menu-dropdown>
								<cq-item cq-member="headsUp-floating"
									>Show Tooltip<span class="ciq-radio"><span></span></span
								></cq-item>
								<cq-item cq-member="headsUp-dynamic"
									>Show Dynamic Callout<span class="ciq-radio"
										><span></span></span
								></cq-item>		
							</cq-menu-dropdown>
						</cq-menu>
						<cq-toggle class="grid" id="grid" stxtap="Layout.xAixsGridLine()">
							<span></span>
							<cq-tooltip>grid</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="lastP" id="lastP" stxtap="Layout.lastPriceLabel()">
						<span></span>
						<cq-tooltip>last price</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="buy" id="buy" style="visibility:hidden;margin-left:28px">
							<span style='margin-right:10px'><svg t='1641979722051' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2092' width='30' height='30'><path d='M512 124L64 900h896z' p-id='2093' fill='#1afa29'></path></svg></span>
							<cq-tooltip>BUY</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="sell" id="sell" style="visibility:hidden">
							<span style='margin-right:10px'><svg t='1636008125523' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2169' width='30' height='30' ><path d='M525.873548 897.156129l-383.174193-761.723871 763.045161-1.981935-379.870968 763.705806z' p-id='2170' fill='#d81e06'></path></svg></span>
							<cq-tooltip>SELL</cq-tooltip>
						</cq-toggle>
					</cq-info-toggle-dropdown>
					<!-- <cq-toggle class="ciq-DT tableview-ui" cq-member="tableView"
						><span></span><cq-tooltip>Table View</cq-tooltip></cq-toggle
					> -->
				</div>
			</cq-side-nav>

			<div class="ciq-menu-section">
				<div class="ciq-dropdowns">
					<cq-menu class="ciq-menu ciq-period">
						<span
							><cq-clickable stxbind="Layout.periodicity"
								>1D</cq-clickable
							></span
						>
						<cq-menu-dropdown>
							<cq-menu-container cq-name="menuPeriodicity"></cq-menu-container>
						</cq-menu-dropdown>
					</cq-menu>
					<!-- customized features -->
					<!-- <cq-menu class="ciq-indicators-search">
						<cq-indicators-lookup cq-keystroke-claim="" cq-uppercase=""></cq-indicators-lookup>
					</cq-menu> -->

					<!-- <cq-menu class="ciq-menu ciq-views collapse">
						<span>Views</span>
						<cq-menu-dropdown>
							<cq-views></cq-views>
						</cq-menu-dropdown>
					</cq-menu> -->

					<cq-menu class="ciq-menu ciq-display collapse">
						<span>Display</span>
						<cq-menu-dropdown>
							<cq-menu-dropdown-section class="chart-types">
								<cq-heading>Chart Style</cq-heading>
								<cq-menu-container cq-name="menuChartStyle"></cq-menu-container>
							</cq-menu-dropdown-section>
							<!-- <cq-menu-dropdown-section class="chart-aggregations">
								<cq-menu-container
									cq-name="menuChartAggregates"
								></cq-menu-container>
							</cq-menu-dropdown-section> -->
						</cq-menu-dropdown>
					</cq-menu>

					<cq-menu class="ciq-menu ciq-studies collapse" cq-focus="input">
						<span>Studies</span>
						<cq-menu-dropdown>
							<cq-study-legend cq-no-close>
								<cq-section-dynamic>
									<cq-heading>Current Studies</cq-heading>
									<cq-study-legend-content>
										<template-placeholder cq-study-legend="true">
											<cq-item>
												<cq-label class="click-to-edit"></cq-label>
												<div class="ciq-icon ciq-close"></div>
											</cq-item>
										</template-placeholder>
									</cq-study-legend-content>
									<cq-placeholder>
										<div
											stxtap="Layout.clearStudies()"
											class="ciq-btn sm"
											keyboard-selectable="true"
										>
											Clear All
										</div>
									</cq-placeholder>
								</cq-section-dynamic>
							</cq-study-legend>
							<div class="scriptiq-ui">
								<cq-heading>ScriptIQ</cq-heading>
								<cq-item
									><cq-clickable
										cq-selector="cq-scriptiq-editor"
										cq-method="open"
										>New Script</cq-clickable
									></cq-item
								>
								<cq-scriptiq-menu></cq-scriptiq-menu>
								<cq-separator></cq-separator>
							</div>
							<cq-heading cq-filter cq-filter-min="15">Studies</cq-heading>
							<cq-scroll cq-no-maximize>
								<cq-studies></cq-studies>
							</cq-scroll>
						</cq-menu-dropdown>
					</cq-menu>

					<!-- <cq-menu class="ciq-menu stx-markers collapse">
						<span>Events</span>
						<cq-menu-dropdown>
							<cq-heading>Chart Events</cq-heading>
							<cq-item stxtap="Markers.showMarkers('square')"
								>Simple Square<span class="ciq-radio"><span></span></span>
							</cq-item>
							<cq-item stxtap="Markers.showMarkers('circle')"
								>Simple Circle<span class="ciq-radio"><span></span></span>
							</cq-item>
							<cq-item stxtap="Markers.showMarkers('callout')"
								>Callouts<span class="ciq-radio"><span></span></span>
							</cq-item>
							<cq-item
								class="ta_markers-ui"
								stxtap="Markers.showMarkers('trade')"
								>Trade<span class="ciq-radio"><span></span></span>
							</cq-item>
							<cq-item class="ta_markers-ui" stxtap="Markers.showMarkers('mMarker')">mMarker<span class="ciq-radio"><span></span></span>
							</cq-item>
							<cq-item
								class="video_markers-ui"
								stxtap="Markers.showMarkers('video')"
								>Video<span class="ciq-radio"><span></span></span>
							</cq-item>
							<cq-item stxtap="Markers.showMarkers('abstract')"
								>Abstract<span class="ciq-radio"><span></span></span>
							</cq-item>
							<cq-separator></cq-separator>
							<cq-item stxtap="Markers.showMarkers()" class="ciq-active"
								>None<span class="ciq-radio"><span></span></span>
							</cq-item>
							<div class="timespanevent-ui">
								<cq-separator></cq-separator>
								<cq-heading>Panel Events</cq-heading>
								<cq-item
									class="span-event"
									stxtap="TimeSpanEvent.showMarkers('Order')"
									cq-no-close
									>Order<span class="ciq-checkbox ciq-active"
										><span></span></span
								></cq-item>
								<cq-item
									class="span-event"
									stxtap="TimeSpanEvent.showMarkers('CEO')"
									cq-no-close
									>CEO<span class="ciq-checkbox ciq-active"><span></span></span
								></cq-item>
								<cq-item
									class="span-event"
									stxtap="TimeSpanEvent.showMarkers('News')"
									cq-no-close
									>News<span class="ciq-checkbox ciq-active"><span></span></span
								></cq-item>
							</div>
						</cq-menu-dropdown>
					</cq-menu> -->

					<cq-menu class="ciq-menu ciq-preferences collapse">
						<span></span>
						<cq-menu-dropdown>
							<cq-menu-dropdown-section class="chart-preferences">
								<cq-heading>Chart Preferences</cq-heading>
								<cq-menu-container
									cq-name="menuChartPreferences"
								></cq-menu-container>
								<cq-separator></cq-separator>
							</cq-menu-dropdown-section>
							<cq-menu-dropdown-section class="y-axis-preferences">
								<cq-heading>Y-Axis Preferences</cq-heading>
								<cq-menu-container
									cq-name="menuYAxisPreferences"
								></cq-menu-container>
								<cq-separator></cq-separator>
							</cq-menu-dropdown-section>
							<cq-menu-dropdown-section class="chart-addons">
								<cq-heading>Additional Features</cq-heading>
								<cq-menu-container cq-name="menuAddOns"></cq-menu-container>
								<cq-separator></cq-separator>
							</cq-menu-dropdown-section>
							<cq-menu-dropdown-section class="chart-theme">
								<cq-heading>Themes</cq-heading>
								<cq-themes></cq-themes>
								<cq-separator></cq-separator>
							</cq-menu-dropdown-section>
							<!-- <cq-menu-dropdown-section class="chart-locale">
								<cq-heading>Locale</cq-heading>
								<cq-item keyboard-selectable="false"
									><cq-clickable
										cq-selector="cq-timezone-dialog"
										cq-method="open"
										keyboard-selectable="true"
										>Change Timezone</cq-clickable
									></cq-item
								>
								<cq-item stxsetget="Layout.Language()">
									<cq-flag></cq-flag>
									<cq-language-name>Change Language</cq-language-name>
								</cq-item>
							</cq-menu-dropdown-section> -->
						</cq-menu-dropdown>
					</cq-menu>
				</div>

				<div class="trade-toggles ciq-toggles">
					<cq-toggle class="tfc-ui sidebar stx-trade" cq-member="tfc"
						><span></span><cq-tooltip>Trade</cq-tooltip></cq-toggle
					>
					<cq-toggle
						class="analystviews-ui stx-analystviews"
						cq-member="analystviews"
						><span></span><cq-tooltip>Analyst Views</cq-tooltip></cq-toggle
					>
					<cq-toggle
						class="technicalinsights-ui stx-technicalinsights"
						cq-member="technicalinsights"
						><span></span><cq-tooltip>Technical Insights</cq-tooltip></cq-toggle
					>
				</div>
			</div>
		</div>
		<!-- End Navbar -->

		<!-- custom tag for scriptiq only works when plugin is loaded -->
		<cq-scriptiq class="scriptiq-ui"></cq-scriptiq>

		<!-- custom tag for analystviews only works when plugin is loaded -->
		<cq-analystviews
			class="analystviews-ui"
			token="eZOrIVNU3KR1f0cf6PTUYg=="
			partner="1000"
			disabled
		></cq-analystviews>

		<!-- custom tag for technicalinsights only works when plugin is loaded -->
		<cq-technicalinsights uid="" lang="en" disabled></cq-technicalinsights>

		<cq-recent-symbols>
			<div class="ciq-chart-area">
				<div class="ciq-chart">
					<cq-message-toaster
						defaultDisplayTime="10"
						defaultTransition="slide"
						defaultPosition="top"
					></cq-message-toaster>
					<cq-palette-dock>
						<div class="palette-dock-container">
							<cq-drawing-palette
								class="palette-drawing grid palette-hide"
								docked="true"
								orientation="vertical"
								min-height="300"
								cq-drawing-edit="none"
							></cq-drawing-palette>
							<cq-drawing-settings
								class="palette-settings"
								docked="true"
								hide="true"
								orientation="horizontal"
								min-height="40"
								cq-drawing-edit="none"
							></cq-drawing-settings>
						</div>
					</cq-palette-dock>

					<div class="chartContainer">
						<!-- stx-hu-tooltip is required only if addon tooltip is used and customization is required -->
						<stx-hu-sttooltip>
							<stx-hu-tooltip-field field="DT">
								<stx-hu-tooltip-field-name>Date/Time</stx-hu-tooltip-field-name>
								<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
							</stx-hu-tooltip-field>
							<stx-hu-tooltip-field field="Close">
								<stx-hu-tooltip-field-name></stx-hu-tooltip-field-name>
								<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
							</stx-hu-tooltip-field>
						</stx-hu-sttooltip>

						<cq-chart-title cq-marker cq-browser-tab></cq-chart-title>

						<!-- customized features -->
						<!-- <cq-chartcontrol-group class="full-screen-show" cq-marker=""></cq-chartcontrol-group> -->
						<cq-sentiment-lookup></cq-sentiment-lookup>

						<!-- <cq-comparison-lookup></cq-comparison-lookup> -->

						<!-- <cq-comparison-favorite></cq-comparison-favorite> -->

						<cq-chart-legend></cq-chart-legend>

						<cq-loader class="loaderMain"></cq-loader>
					</div>
				</div>
			</div>
		</cq-recent-symbols>

		<!-- Markers/Events -->
		<cq-abstract-marker cq-type="helicopter"></cq-abstract-marker>
		<!-- End Marker/Events -->

		<!-- Attribution component -->
		<cq-attribution></cq-attribution>

		<div class="ciq-footer full-screen-hide">
			<!-- <cq-share-button></cq-share-button> -->
			<div class="reload" stxtap="Layout.reloadChart()">Clear chart</div>
			<!-- <div
				class="shortcuts-ui ciq-shortcut-button"
				stxtap="Layout.showShortcuts()"
				title="Toggle Shortcut Legend"
			></div>
			<div
				class="help-ui ciq-help-button"
				stxtap="Layout.toggleHelp()"
				title="Toggle Interactive Help"
			></div> -->
			<!-- <span class="watermark">sentimentrader.com</span> -->
			<cq-show-range></cq-show-range>
			
		</div>
		<cq-dialogs>
			<cq-dialog>
				<cq-drawing-context></cq-drawing-context>
			</cq-dialog>

			<cq-dialog class="description">
				<cq-study-context></cq-study-context>
			</cq-dialog>
			<cq-dialog class="description">
				<cq-study-context-default></cq-study-context-default>
			</cq-dialog>
		</cq-dialogs>

		<cq-side-panel></cq-side-panel>
		<!-- should be outside context before -->
		<div class="discription_div"></div>
	</cq-context>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
// @ts-ignore
import { CIQ } from 'chartiq/js/components'
import jutils from 'jutils-src'
//import { CIQ as ciqq} from 'chartiq/js/components'
import { getCustomConfig, marker } from './resources' // ChartIQ library resources

@Component({})
export default class AdvancedChartComponent extends Vue {
	
	@Prop() config: any
	@Prop({ type: Function, default: ({}) => {} }) chartInitialized!: Function

	@Ref('container') container!: HTMLElement

	stx: CIQ.ChartEngine | undefined
	
	
	mounted() {
		const config = this.config || getCustomConfig()
		
		const container = this.container
		var tooltip = document.getElementsByClassName("ciq-HU")[0]
		tooltip.onclick = function(){
			tooltip.classList.remove("active");	
			if (CIQ.stxx.layout.headsUp.floating == true){	
				tooltip.classList.remove("activated");	
				CIQ.stxx.layout.headsUp.floating = false	
			}
			else{
				tooltip.classList.add("activated");
				CIQ.stxx.layout.headsUp.floating = true
			}
		}

		
		portalizeContextDialogs(container)
		// Delay the call to createChartAndUI so any other AdvancedChart components on the page
		// have a chance to call portalizeContextDialogs
		CIQ.nprogress.start()
		CIQ.addCover()
		window.setTimeout(() => {
			const uiContext = this.createChartAndUI(config)
			this.stx = uiContext.stx
			CIQ.stxx = uiContext.stx
			CIQ.periodicity = {period:1, interval:1, timeUnit:'day'}

			var iter = CIQ.stxx.chart.market.newIterator({
			interval: CIQ.stxx.layout.interval,
			periodicity: CIQ.stxx.layout.periodicity,
			timeUnit: CIQ.stxx.layout.timeUnit,
			inZone: CIQ.stxx.dataZone,
			outZone: CIQ.stxx.displayZone,
			});
			
			// for (var studyInstanceName in CIQ.stxx.layout.studies) {
			// 	CIQ.Studies.removeStudy(CIQ.stxx, CIQ.stxx.layout.studies[studyInstanceName])
			// }
			
			CIQ.studys = []
			for (var study in CIQ.Studies.studyLibrary) {
				////(study)
				CIQ.studys.push(study)
			}

			//CIQ.stxx.setTimeZone("Asia/Hong_Kong", "America/New_York");

			CIQ.ChartEngine.prototype.prepend("draw", function () {
	
			});
			var node = document.getElementsByClassName("stx-subholder")[0]
			var newdiv=document.createElement("div");
			newdiv.className = 'stLogo'
			node.appendChild(newdiv)
			
			this.chartInitialized({ chartEngine: uiContext.stx, uiContext, config })
			
			CIQ.stxx.layout.headsUp = "floating";
			//console.log(CIQ.stxx.layout.headsUp.floating)
			var mNode = document.getElementsByClassName("ciq-HU")[0]
			mNode.classList.add("activated");		

			//CIQ.stxx.chart.yAxis.drawCurrentPriceLabel = false;
			this.initializeToggle()
			
			CIQ.stxx.addEventListener("scroll", function(object) {
				// same as "object.stx.markers.circle"
				if(CIQ.isMarkerShown){
					let c_date = jutils.formatDate(object.stx.chart.xaxis[0].DT, 'YYYYMMDD');
					let m_date =
							CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(0, 4) +
							CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(5, 7) +
							CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(8, 10)
					if(c_date<m_date){
						let markers = CIQ.groups.pop()
						console.log("new pagnigation start from ",
							CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(0, 4) +
							CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(5, 7) +
							CIQ.groups.slice(-1)[0].slice(-1)[0].DT.slice(8, 10))
						//console.log("an new group of marker is ready to load at: " + object.stx.chart.xaxis[0].DT,"\n marker : " + object.stx.markers.circle[0].params.x);
						CIQ.loadChart(markers, CIQ.addMarker)
					}
				}
			});
		}, 0)			
	}
	initializeToggle() {
		
		// var mNode = document.getElementsByClassName("ciq-HU")[0]
		// if (CIQ.stxx.layout.headsUp == "activated"){	
		// 	mNode.classList.add("activated");		
		// }
		// else{
		// 	mNode.classList.remove("activated");
		// }
		var mNode = document.getElementsByClassName("lastP")[0]
		if (CIQ.stxx.layout.lastPriceLabel){
			mNode.classList.remove("active");
		}
		else{
			mNode.classList.add("active");
		}
		var mNode = document.getElementsByClassName("grid")[0]
		if (CIQ.stxx.layout.xAixsGridLine){
			mNode.classList.remove("active");
		}
		else{
			mNode.classList.add("active");
		}
	}
	beforeDestroy() {
		// Destroy the ChartEngine instance when unloading the component.
		// This will stop internal processes such as quotefeed polling.
		//this.stx?.destroy()
	}

	

	createChartAndUI(config: any) {
		const container = this.container
		const chart = new CIQ.UI.Chart()
		const uiContext = chart.createChartAndUI({ container, config })

		return uiContext
	}
	
}

/**
 * For applications that have more then one chart, keep single dialog of the same type
 * and move it outside context node to be shared by all chart components
 */
function portalizeContextDialogs(container: HTMLElement) {
	container.querySelectorAll('cq-dialog').forEach(dialog => {
		dialog.remove()
		if (!dialogPortalized(dialog)) {
			document.body.appendChild(dialog)
		}
	})
}

function dialogPortalized(el: Element) {
	if (!el.firstChild) {
		throw new Error('Element has no children')
	}

	const tag = el.firstChild.nodeName.toLowerCase()
	const result = Array.from(document.querySelectorAll(tag)).some(
		el => !el.closest('cq-context')
	)

	return result
}
</script>
