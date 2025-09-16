/**
 *	2.2.0
 *	chartiq component for VUE
 */
<template>
	<cq-context ref="container">
		<cq-color-picker></cq-color-picker>
		
		<div class="ciq-nav full-screen-hide">
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

			<cq-side-nav cq-on="sidenavOn">
				<div class="icon-toggles ciq-toggles">
					<div class="search-bar-group">
						<!-- <cq-toggle class="search-bar-group--toggle"> -->
							<cq-menu class="ciq-search">	
								<cq-lookup cq-keystroke-claim cq-uppercase v-if="routeName != 'ActiveStudies'"></cq-lookup>
								<cq-reports-lookup cq-keystroke-claim cq-uppercase v-if="routeName == 'ActiveStudies'"></cq-reports-lookup>
								<div class="cq-tooltip-copy">Symbol Search</div>
							</cq-menu>
						<!-- </cq-toggle> -->
						<!-- <cq-toggle class="search-bar-group--toggle"> -->
							<cq-menu class="ciq-indicators-search">
								<cq-indicators-lookup cq-keystroke-claim="" cq-uppercase=""></cq-indicators-lookup>
								<div class="cq-tooltip-copy">Add Indicator</div>
							</cq-menu>
						<!-- </cq-toggle> -->
					</div>
					<cq-info-toggle-dropdown class="ch-headsup">
						<cq-toggle
								class="ciq-CH"
								cq-member="crosshair">
								<span></span>
								<cq-tooltip>Crosshair (Alt + \)</cq-tooltip>
						</cq-toggle>
						<cq-menu class="ciq-menu toggle-options collapse">
							<span></span>
							<cq-menu-dropdown>
								<cq-item
									cq-member="crosshair">Hide Heads-Up Display<span class="ciq-radio"><span></span></span>
								</cq-item>
								<cq-item
									cq-member="headsUp-static">Show Heads-Up Display<span class="ciq-radio"><span></span></span>
								</cq-item>
							</cq-menu-dropdown>
						</cq-menu>
					</cq-info-toggle-dropdown>
					<cq-info-toggle-dropdown  class="hu-tooltip">
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
					</cq-info-toggle-dropdown>
					<cq-info-toggle-dropdown class="grid-group">
						<cq-toggle class="grid" id="grid" stxtap="Layout.xAixsGridLine()">
							<span></span>
							<cq-tooltip>grid</cq-tooltip>
						</cq-toggle>
					</cq-info-toggle-dropdown>
					<cq-info-toggle-dropdown class="lastp-group">
						<cq-toggle class="lastP" id="lastP" stxtap="Layout.lastPriceLabel()">
							<span></span>
							<cq-tooltip>last price</cq-tooltip>
						</cq-toggle>
					</cq-info-toggle-dropdown>
					<cq-info-toggle-dropdown class="lastp-group" v-if="!!$route.matched.find(i=>i.path == '/backtester')">
						<cq-toggle class="trading-signal" @click="openModal('first')">
							<span></span>
							<cq-tooltip>Trading Signal</cq-tooltip>
						</cq-toggle>
					</cq-info-toggle-dropdown>
					<cq-info-toggle-dropdown class="lastp-group" v-if="!!$route.matched.find(i=>i.path == '/backtester') && $store.getters.getIsAdmin">
						<button class="ai-supline" :disabled="aISuplineloading" id="ai-supline" v-loading="aISuplineloading" @click="toogleAISupline">
							<svg width="22" height="22" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M32.4518 132.453L40.2018 140.165C40.347 140.311 40.5194 140.426 40.7092 140.505C40.899 140.584 41.1025 140.624 41.3081 140.624C41.5136 140.624 41.7171 140.584 41.9069 140.505C42.0967 140.426 42.2692 140.311 42.4143 140.165L88.2518 94.4778L107.314 113.478C109.752 115.903 113.702 115.903 116.139 113.478L167.739 62.0778C167.885 61.9327 168 61.7602 168.079 61.5704C168.158 61.3806 168.198 61.1771 168.198 60.9716C168.198 60.766 168.158 60.5625 168.079 60.3727C168 60.1829 167.885 60.0105 167.739 59.8653L159.989 52.1403C159.697 51.8502 159.301 51.6875 158.889 51.6875C158.477 51.6875 158.082 51.8502 157.789 52.1403L111.752 98.0403L92.6643 79.0403C91.4896 77.8785 89.904 77.2269 88.2518 77.2269C86.5996 77.2269 85.014 77.8785 83.8393 79.0403L32.4643 130.228C32.3173 130.372 32.2005 130.544 32.1208 130.734C32.0411 130.924 32 131.128 32 131.334C32 131.54 32.0411 131.744 32.1208 131.934C32.2005 132.124 32.3173 132.296 32.4643 132.44L32.4518 132.453Z" fill="black" fill-opacity="0.65"/>
							<path d="M160.495 111.517C160.305 111.322 160.072 111.175 159.814 111.089C159.6 111.017 159.374 110.988 159.149 111.004C158.924 111.02 158.705 111.08 158.503 111.181C158.301 111.282 158.122 111.421 157.974 111.592C157.826 111.762 157.714 111.96 157.643 112.174L153.78 123.813L142.155 127.897C141.812 128.016 141.515 128.24 141.308 128.538C141.1 128.836 140.992 129.192 141 129.555C141.008 129.918 141.131 130.269 141.352 130.558C141.572 130.846 141.879 131.057 142.227 131.161L153.758 134.645L157.379 146.22C157.487 146.566 157.702 146.87 157.993 147.086C158.284 147.302 158.637 147.421 159 147.424C159.363 147.427 159.717 147.315 160.012 147.104C160.307 146.892 160.528 146.593 160.642 146.248L164.512 134.624L176.365 131.096C176.718 130.996 177.03 130.785 177.254 130.494C177.478 130.203 177.603 129.848 177.61 129.481C177.618 129.114 177.507 128.755 177.294 128.455C177.082 128.156 176.778 127.933 176.429 127.819L164.526 123.784L160.906 112.21C160.826 111.95 160.685 111.712 160.495 111.517Z" fill="black"/>
							<rect x="22" y="149" width="38" height="14" rx="2" fill="black"/>
							<rect x="22" y="36" width="38" height="14" rx="2" fill="black"/>
							<rect x="81" y="149" width="38" height="14" rx="2" fill="black"/>
							<rect x="81" y="36" width="38" height="14" rx="2" fill="black"/>
							<rect x="140" y="149" width="38" height="14" rx="2" fill="black"/>
							<rect x="140" y="36" width="38" height="14" rx="2" fill="black"/>
							</svg>
							<div class="ai-supline--tooltip">AI Trend Insight</div>
						</button>
					</cq-info-toggle-dropdown>

					<div class="reports-filter-container" v-if="routeName === 'ActiveStudies'"></div>
					<cq-info-toggle-dropdown class="tradeMarkerWrapper flexRow">
						<cq-toggle class="buy" id="buy" @click="changeMarkerVisibility('buy')" style="display:none;">
							<span style='margin-right:10px;width: 32px'><svg t='1641979722051' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2092' width='30' height='30'><path d='M512 124L64 900h896z' p-id='2093' fill='#1afa29'></path></svg></span>
							<cq-tooltip style='left: -30px;width: 100px;padding-top: 2px;padding-bottom: 2px;'>BUY(SYMBOL 1)</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="sell" id="sell" @click="changeMarkerVisibility('sell')" style="display:none">
							<span style='margin-right:10px;width: 32px'><svg t='1636008125523' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2169' width='30' height='30' ><path d='M525.873548 897.156129l-383.174193-761.723871 763.045161-1.981935-379.870968 763.705806z' p-id='2170' fill='#d81e06'></path></svg></span>
							<cq-tooltip style='left: -30px;width: 100px;padding-top: 2px;padding-bottom: 2px;'>SELL(SYMBOL 1)</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="buy_2" id="buy_2" @click="changeMarkerVisibility('buy_2')" style="display:none">
							<span style='margin-right:10px;width: 32px'><svg t='1641979722051' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2092' width='30' height='30'><path d='M512 124L64 900h896z' p-id='2093' fill='#92d2cc'></path></svg></span>
							<cq-tooltip style='left: -30px;width: 100px;padding-top: 2px;padding-bottom: 2px;'>BUY(SYMBOL 2)</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="sell_2" id="sell_2" @click="changeMarkerVisibility('sell_2')" style="display:none">
							<span style='margin-right:10px;width: 32px'><svg t='1636008125523' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2169' width='30' height='30' ><path d='M525.873548 897.156129l-383.174193-761.723871 763.045161-1.981935-379.870968 763.705806z' p-id='2170' fill='#ff5290'></path></svg></span>
							<cq-tooltip style='left: -30px;width: 100px;padding-top: 2px;padding-bottom: 2px;'>SELL(SYMBOL 2)</cq-tooltip>
						</cq-toggle>
					</cq-info-toggle-dropdown>
					<cq-info-toggle-dropdown class="favBtnContainer">
						<button class='btnFav addFav'>
							<div><svg t='1638255076868' class='button_icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2654' width='200' height='200'><path d='M885.942179 427.687756l-267.445168-22.933315-104.470353-246.470461L409.553235 404.75444l-267.336698 22.933315 202.846918 175.770236-60.789505 261.34524 229.753731-138.569986 229.859132 138.569986-60.785411-261.34524L885.942179 427.687756zM514.026658 656.403854l-139.875724 84.425831 37.038568-159.160953-123.591853-106.975407 162.91751-14.053064 63.511499-150.116973 63.620993 150.116973 162.860205 14.053064-123.534548 106.975407 37.038568 159.160953L514.026658 656.403854z' p-id='2655' fill='#1296db'></path></svg><span>Add to favorites</span></div>
						</button>
					</cq-info-toggle-dropdown>
					<!-- <cq-toggle class="ciq-DT tableview-ui" cq-member="tableView"
						><span></span><cq-tooltip>Table View</cq-tooltip></cq-toggle
					> -->
				</div>
			</cq-side-nav>

			<div class="ciq-menu-section">
				<div class="ciq-dropdowns flexRow">
					<ManageLayout v-if="$store.getters.getIsAdmin"/>

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

					<cq-menu class="ciq-menu ciq-display collapse">
						<span>Display</span>
						<cq-menu-dropdown>
							<cq-menu-dropdown-section class="chart-types">
								<cq-heading>Chart Style</cq-heading>
								<cq-menu-container cq-name="menuChartStyle"></cq-menu-container>
							</cq-menu-dropdown-section>
						</cq-menu-dropdown>
					</cq-menu>

					<cq-menu class="ciq-menu ciq-studies collapse" cq-focus="input" @click="collapseStudies">
						<span>Studies</span>
						<cq-menu-dropdown style="width:400px;">
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
								<cq-studies v-if="isCollapse==true"></cq-studies>
							</cq-scroll>
						</cq-menu-dropdown>
					</cq-menu>

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
									ref="yAxisPreferencesMenu"
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

		<cq-scriptiq class="scriptiq-ui"></cq-scriptiq>

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
						<!-- <cq-sentiment-lookup></cq-sentiment-lookup> -->

						<cq-comparison-lookup></cq-comparison-lookup>

						<!-- <cq-comparison-favorite></cq-comparison-favorite> -->

						<cq-chart-legend></cq-chart-legend>

						<!-- 用loadingOverlay替代原装loader -->
						<!-- <cq-loader class="loaderMain"></cq-loader> -->
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
			<cq-dialog class="description">
				<cq-study-context-myindicator></cq-study-context-myindicator>
			</cq-dialog>
		</cq-dialogs>

		<cq-side-panel></cq-side-panel>
		<!-- should be outside context before -->
		<div class="discription_div"></div>

		<div id="stxEventHover" class="myEvents">
			<span class="content"></span>
			<span class="tooltip"></span>
		</div>
		<!-- last signal marker -->
		<div id="stxMessage" class="myMes"></div>
		<!-- last signal marker -->
		<div id="stxForecast" class="forecast"></div>
		<!-- HorizontalLabel marker -->
		<div id="stxHorizontalLabel" class="horizontalLabel"></div>
		<ModalBox ref="modalBox">
			<div class="strategy-container">
				<div class="dropdown">
					<el-button size="small" @click="showStrategyDescription"><b style="cursor: pointer; font-size: 16px">Click here to view Strategy Description</b></el-button>
						<div class="strategy-dropdown">
							<label for="strategy-select" style="margin-right: 15px; font-weight: bold;">
								Select Strategy:
							</label>
							<select v-model="strategyIndex">
								<option v-for="(strategy, index) in strategiesOptions" :key="index" :value="strategy.value">
									{{strategy.label}}
								</option>
							</select>
						</div>
				</div>
					<div class="centent" v-show="isShowStrategyDescription">
						<p style="margin-top: 0px; font-weight: bold;text-align: justify;">
							Trading Signal is the outcome of a three-year backtesting process conducted on 28 strategies specifically tailored to a particular symbol,
							from which the top three performing strategies were meticulously chosen.<br/>
							By selecting a strategy, you can delve into more detailed information about how that symbol performed under that specific strategy.<br/>
						</p>
					</div>
			</div>
			<ModalBoxContainer :tabs="tabs">
				<template #tab1>
					<StrategySigal
					:strategyIndex="strategyIndex"
					@getStrategiesOptions="getStrategiesOptions"
					@changeStrategyIndex="changeStrategyIndex"
						@error="closeModal"
					></StrategySigal>
				</template>
				<template #tab2>
					<SummaryChart symbol="AAPL" :strategyIndex="strategyIndex" @changeStrategyIndex="changeStrategyIndex" @error="closeModal"></SummaryChart>
				</template>
				<template #tab3>
					<TradesTable 
					:strategyIndex="strategyIndex"
					@error="closeModal" 
					@changeStrategyIndex="changeStrategyIndex"
					></TradesTable>
				</template>
				<template #tab4>
					<Description
					:strategyIndex="strategyIndex"
					@error="closeModal"
					@changeStrategyIndex="changeStrategyIndex"
					></Description>
				</template>
			</ModalBoxContainer>
			<p style="font-weight: bold;">Disclaimer: Past backtest does not guarantee future results, please be mindful that investing carries inherent risks.</p>
		</ModalBox>
	</cq-context>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
// @ts-ignore
//import { CIQ } from '@/components/common/chart/st-development/js'
import { CIQ } from '@/components/common/chart/st-development/js/components'
// import jutils from 'jutils-src'
import { getCustomConfig, marker } from './resources' // ChartIQ library resources
import { extendOverwrite } from './st-development/js/extensions/StudiesExtendOverwrite' // dual symbol new feature
import UploaderVue from '@/components/common/chart/st-development/js/webcomponents/Uploader.vue'
import ReportsFilter from '@/components/common/chart/st-development/js/webcomponents/ReportsFilter.vue'
import ModalBox from '@/components/common/modalBox/ModalBox.vue'
import ModalBoxContainer from '@/components/common/modalBox/ModalTabContainer.vue'
// TODO next is to intergrate them into an index entry file
import SummaryChart from '@/components/common/StrategyModal/SummaryChart/index.vue'
import StrategySigal from '@/components/common/StrategyModal/strategySignal/StrategySignal.vue'
import TradesTable from '@/components/common/StrategyModal/TradesTable/index.vue'
import Description from '@/components/common/StrategyModal/Description/index.vue'
import ManageLayout from '@/components/common/ManageLayout/index.vue'

@Component({
  components: {
    ModalBox,
	ModalBoxContainer,
	SummaryChart,
	StrategySigal,
	TradesTable,
	Description,
	ManageLayout,
  },
})
export default class AdvancedChartComponent extends Vue {
	
	@Prop() config: any
	@Prop({ type: Function, default: ({}) => {} }) chartInitialized!: Function
	@Prop() selectedStrategyIndex: any

	@Ref('container') container!: HTMLElement

	stx: CIQ.ChartEngine | undefined
	isCollapse: boolean | undefined
	resizeObserver: any | undefined
	//reportsAreDisplayed: any | undefined
	routeName: string | null | undefined
	modalContent: string | null = null
	tabs: Array<any>
	strategyIndex: number
	strategiesOptions: {label: string, value: number}[]
	isShowStrategyDescription: boolean
	aISuplineloading: boolean
	
	constructor() {
		super()
		this.modalContent = null, // 用于存储弹窗内容的状态
		this.tabs = [
        { label: 'Trading Strategy', name: 'tab1', slotName: 'tab1' },
        { label: 'Performance Summary', name: 'tab2', slotName: 'tab2' },
        { label: 'Signal Dates', name: 'tab3', slotName: 'tab3' },
				{ label: 'Strategy Description', name: 'tab4', slotName: 'tab4' },
      ]
		this.isCollapse = false 
		this.resizeObserver = null
		// this.reportsAreDisplayed = {
		// 	bullish: true,
		// 	bearish: true,
		// }
		this.routeName = this.$route.name
		this.strategyIndex = 0
		this.strategiesOptions = [{label: '- Select Strategy -', value: 0}]
		this.isShowStrategyDescription = false
		this.aISuplineloading = false
	}

	async mounted() {
		const config = this.config || getCustomConfig()
		
		const container = this.container

		this.overrideStudyDef()
		
		portalizeContextDialogs(container)
		// Delay the call to createChartAndUI so any other AdvancedChart components on the page
		// have a chance to call portalizeContextDialogs

		// don't add mask when initiating a chart
		
		window.setTimeout(() => {
			const uiContext = this.createChartAndUI(config)
			CIQ.stxx = uiContext.stx
			// If your feed returns data already rolled up in monthly or weekly ticks, 
			// you can override this behavior by setting stxx.dontRoll to true
			CIQ.stxx.dontRoll = true
			CIQ.stxx.maxDataSetSize = 0
			// Minimum candleWidth (in pixels) allowed when zooming out. Determines the maximum number of ticks to display on the chart.
			CIQ.stxx.minimumCandleWidth = 0.001;
			CIQ.periodicity = {period:1, interval:1, timeUnit:'day'}

			var iter = CIQ.stxx.chart.market.newIterator({
				interval: CIQ.stxx.layout.interval,
				periodicity: CIQ.stxx.layout.periodicity,
				timeUnit: CIQ.stxx.layout.timeUnit,
				inZone: CIQ.stxx.dataZone,
				outZone: CIQ.stxx.displayZone,
			});
			
			CIQ.studys = []
			for (var study in CIQ.Studies.studyLibrary) {
				////(study)
				CIQ.studys.push(study)
			}
			
			CIQ.stxx.setLineStyle({ width: 3 });

			// 防止Chartiq图表对主页面的鼠标滚轮事件产生冲突
			//CIQ.stxx.captureMouseWheelEvents = false 

			// CIQ.ChartEngine.YAxis.prototype.decimalPlaces=6;
			CIQ.ChartEngine.prototype.prepend("draw", function () {
	
			});

			// append Logo image
			var node = document.getElementsByClassName("chartContainer")[0]
			var newdiv=document.createElement("div");
			newdiv.className = 'stLogo'
			node.appendChild(newdiv)
			
			this.chartInitialized({ chartEngine: uiContext.stx, uiContext, config })		

			this.initializeToggle(uiContext.stx)
			this.createResizeListener()

			this.symbolMutationObserver()
			this.initializeReportsFilter()
		}, 0)
	}
	openModal(contentType: string) {
      this.modalContent = contentType; // 设置要显示的内容
	  const modal = this.$refs.modalBox as any;
      if (modal) {
				if(this.isShowStrategyDescription) this.isShowStrategyDescription = false
        modal.open(); // 确保 modal 存在后再调用 open 方法
      }
    }
	async toogleAISupline() {
		this.aISuplineloading = true
		let vm = this
		try {
			const msg = await CIQ.updateSupportLineWithChannelDrawing(vm);
			this.$message.success(msg);
		} catch (errMsg) {
			this.$message.warning(errMsg);
		}

		this.aISuplineloading = false
	}
	closeModal() {
		const modal = this.$refs.modalBox as any;
		if (modal) {
			if(this.isShowStrategyDescription) this.isShowStrategyDescription = false
			modal.close(); // 确保 modal 存在后再调用 close 方法
		}
	}
	changeStrategyIndex(index: number | string) {
		this.strategyIndex = Number(index)
	}
	showStrategyDescription() {
		this.isShowStrategyDescription = !this.isShowStrategyDescription
	}

	// initiate lastPrice and grid button
	initializeToggle(stx: any) {
		stx.layout.headsUp={floating:true};
		//stx.layout.headsUp = "floating";
		// var mNode = document.getElementsByClassName("ciq-HU")[0]
		// mNode.classList.add("activated");
		
		stx.layout.lastPriceLabel = false;
		stx.chart.yAxis.drawCurrentPriceLabel = false;

		stx.layout.xAixsGridLine = false
		stx.chart.yAxis.displayGridLines = false;
		stx.chart.xAxis.displayGridLines = false;

		stx.layout.crosshair = true;

		stx.changeOccurred("layout");
		stx.draw();
	}

	collapseStudies() {
		this.isCollapse = true
	}

	beforeDestroy() {
		// 清除预览和编辑产生的ownIndicator serie缓存
		// 获取所有 localStorage 的键名
		const keys = Object.keys(localStorage);

		// 要删除的特定字符串
		const searchString = 'previewIndicatorData';

		// 遍历所有键名并删除匹配的项
		keys.forEach(key => {
		// 检查当前键名是否包含指定的字符串
		if (key.includes(searchString)) {
			// 如果包含指定字符串，则使用 removeItem 方法删除该键名对应的数据
			localStorage.removeItem(key)
		}
		});
		
		// 防止跳转到backtester时保留了Hammer followed by a rise等marker
		CIQ.objIndicator = []
		CIQ.store.dispatch('chart/reset_chart_study_state')
		CIQ.store.dispatch('form/reset_chart_config_state')

		// Destroy the ChartEngine instance when unloading the component.
		// This will stop internal processes such as quotefeed polling.
		CIQ.stxx.destroy()

		// 防止chartiq还没加载完就切换到其他页面
		CIQ.hideCover()
		CIQ.nprogress.done()

		// 取消监听所有目标元素
		this.resizeObserver.disconnect();
	}

	createChartAndUI(config: any) {
		const container = this.container
		const chart = new CIQ.UI.Chart()
		const uiContext = chart.createChartAndUI({ container, config })

		return uiContext
	}
	
	// 统一复写默认Study(已存在的，不然则在STMovingAverages(已弃用)中配置)配置
	overrideStudyDef() {
		extendOverwrite()
	}

	// 工具栏按钮移除和显示marker功能，只影响显示
	// 目前只能移除和显示当前分组的交易marker，所以先渲染全部，权衡到性能已被优化
	changeMarkerVisibility(type) {
		// let markerClassName = type == 'buy'?'analysis':'dividend' 
		// let dotClassName = type == 'buy'?'trade-buy':'trade-sell' 
		
		// let markers = document.getElementsByClassName(`stx-marker ${markerClassName}`)
		// let dots = document.getElementsByClassName(`stx-marker ${dotClassName}`)

		// let display = markers[0].style.display=='none'?'block':'none'

		// for(var ele of markers){ 
		// 	ele.style.display = display 
		// }
		// for(var ele of dots){ 
		// 	ele.style.display = display 
		// }

		CIQ.setMarkerVisibility(type)
	}
	
	resizePatternMatch() {
		const yAxis = CIQ.stxx.chart.yAxis	
		//console.log(yAxis)
		const offset = (yAxis.high-yAxis.low)/4			// 依据Y轴长度设定的偏移量，以保证模式匹配阴影覆盖整个高度
		for(var i=0;i<CIQ.stxx.drawingObjects.length;i++){
			var myDrawing=CIQ.stxx.drawingObjects[i];
			myDrawing.v0 = yAxis.high + offset
			myDrawing.v1 = yAxis.low - offset
			myDrawing.adjust()
		}
		CIQ.stxx.draw();
	}

	createResizeListener() {
		const ele = document.querySelector('.chart-wrapper');
		let isResizing = false;

		// 監聽 mousedown 事件
		ele.addEventListener('mousedown', (e) => {
			isResizing = true;
			//console.log('mousedown',isResizing)
		});

		
		// 監聽 mouseup 事件
		ele.addEventListener('mouseup', (e) => {
			setTimeout(() => {
				isResizing = false;
				CIQ.isResizing = false	
			}, 500); // 0.5秒後設置isResizing為false
		});

		this.resizeObserver = new ResizeObserver(entries => {
		for (let entry of entries) {
			if (entry.target && isResizing) {
				CIQ.isResizing = true
			}
		}
		});

		// 開始觀察目標元素
		this.resizeObserver.observe(ele);
	}
	initializeReportsFilter() {
		const reportsFilter = document.querySelector('.reports-filter-container')
		if(reportsFilter){
			const FilterVueComponent = Vue.extend(ReportsFilter);
			const instance = new FilterVueComponent({
				store: this.$store,
			}).$mount();
			
			// 将 Vue 组件的根元素插入到 node 内部，而不是替换 node 本身
			reportsFilter.appendChild(instance.$el);
		}
	}
	initializeSymbolUploader(node) {
		const uploader = document.querySelector('.symbol-uploader')
		if(uploader) return
			if (node) {
					const UploaderVueComponent = Vue.extend(UploaderVue);
					const instance = new UploaderVueComponent({
						store: this.$store,
						router: this.$router, // 如果你有 router 也可以传递
					}).$mount();
					
					// 将 Vue 组件的根元素插入到 node 内部，而不是替换 node 本身
					node.appendChild(instance.$el);
			}
		}
	symbolMutationObserver(){
		// 选择需要观察变动的目标节点
		const targetNode = document.body;

		// 配置观察选项
		const config = { childList: true, subtree: true };
		var _this = this
		const callback = function(mutationsList, observer) {
			for(let mutation of mutationsList) {
				if (mutation.type === 'childList') {
					// 检查是否有 class 为 'symbol-upload' 的元素
					let cqLookupFiltersElement = document.querySelector('cq-uploader');
					//console.log('symbol-upload element has been rendered',cqLookupFiltersElement);
					// TODO 考虑DOM优化
					if (cqLookupFiltersElement) {	
						_this.initializeSymbolUploader(cqLookupFiltersElement)
						// 一旦找到了 'ciq-search' 元素，就可以停止觀察
						observer.disconnect();
						break;
					}
				}
			}
		};

		// 创建一个观察者实例并传入回调函数
		const observer = new MutationObserver(callback);

		// 以上述配置开始观察目标节点
		observer.observe(targetNode, config);
	}
	getStrategiesOptions(options: {label: string, value: number}[]) {
		this.strategiesOptions = options
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
<style lang="less" scoped>
select {
  font-weight: bold !important;
}
.dropdown {
	box-sizing: border-box;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30px 70px 0px 70px;
}

.flexRow {
	display: flex;
	flex-direction: row;
}
.tradeMarkerWrapper {
    margin-left: 28px;
	span {
		margin-left: 2px;
	}
}
.icon-toggles.ciq-toggles {
	display: flex;
}

.search-bar-group {
	margin: 0 10px;
	border-right: solid 1px black;

	display: flex;
	flex-direction: row;
	&--toggle {
		flex: 1;
		width: auto;
		margin: 0;
		padding: 0;
	}
}

.cq-tooltip-copy {
	bottom: -8px;
    position: absolute;
    display: block;
    background: #398dff;
    transition: opacity .1s 0s, margin .5s 0s;
    opacity: 0;
    z-index: 4;
    width: 44px;
    height: auto;
    left: -8px;
    text-align: center;
    font-weight: 400;
    font-size: 10px;
    color: #f8f8f8;
    border-radius: 1px;
    pointer-events: none;
	padding: 4px;
}
html:not([ciq-last-interaction='touch']) .ciq-search:hover .cq-tooltip-copy,
html:not([ciq-last-interaction='touch']) .ciq-indicators-search:hover .cq-tooltip-copy {
	opacity: 1;
		transition: opacity .1s .25s, bottom .5s .25s;
		bottom: -38px;
		border: 1px solid #e4e4e4;
}

html:not([ciq-last-interaction='touch']) .ciq-search:visited .cq-tooltip-copy,
html:not([ciq-last-interaction='touch']) .ciq-indicators-search:visited .cq-tooltip-copy {
	opacity: 0;
}

.ai-supline {
	/deep/ .el-loading-spinner{
		margin-top: -15px;
		.circular {
			width: 27px;
			height: 27px;
		}
	}
}
</style>