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
					<cq-menu class="ciq-search">
						<cq-lookup cq-keystroke-claim cq-uppercase v-if="routeName != 'ActiveStudies'"></cq-lookup>
						<cq-reports-lookup cq-keystroke-claim cq-uppercase v-if="routeName == 'ActiveStudies'"></cq-reports-lookup>
					</cq-menu>
					<cq-menu>
						<div class='symbol-up'></div>
					</cq-menu>
					<cq-menu class="ciq-indicators-search">
						<cq-indicators-lookup cq-keystroke-claim="" cq-uppercase=""></cq-indicators-lookup>
					</cq-menu>
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

					<div class="reports-filter-container" v-if="routeName === 'ActiveStudies'"></div>
					<cq-info-toggle-dropdown>
						<cq-toggle class="buy" id="buy" @click="changeMarkerVisibility('buy')" style="visibility:hidden;margin-left:28px">
							<span style='margin-right:10px;width: 32px'><svg t='1641979722051' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2092' width='30' height='30'><path d='M512 124L64 900h896z' p-id='2093' fill='#1afa29'></path></svg></span>
							<cq-tooltip style='left: -30px;width: 100px;padding-top: 2px;padding-bottom: 2px;'>BUY(SYMBOL 1)</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="sell" id="sell" @click="changeMarkerVisibility('sell')" style="visibility:hidden">
							<span style='margin-right:10px;width: 32px'><svg t='1636008125523' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2169' width='30' height='30' ><path d='M525.873548 897.156129l-383.174193-761.723871 763.045161-1.981935-379.870968 763.705806z' p-id='2170' fill='#d81e06'></path></svg></span>
							<cq-tooltip style='left: -30px;width: 100px;padding-top: 2px;padding-bottom: 2px;'>SELL(SYMBOL 1)</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="buy_2" id="buy_2" @click="changeMarkerVisibility('buy_2')" style="visibility:hidden">
							<span style='margin-right:10px;width: 32px'><svg t='1641979722051' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2092' width='30' height='30'><path d='M512 124L64 900h896z' p-id='2093' fill='#92d2cc'></path></svg></span>
							<cq-tooltip style='left: -30px;width: 100px;padding-top: 2px;padding-bottom: 2px;'>BUY(SYMBOL 2)</cq-tooltip>
						</cq-toggle>
						<cq-toggle class="sell_2" id="sell_2" @click="changeMarkerVisibility('sell_2')" style="visibility:hidden">
							<span style='margin-right:10px;width: 32px'><svg t='1636008125523' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2169' width='30' height='30' ><path d='M525.873548 897.156129l-383.174193-761.723871 763.045161-1.981935-379.870968 763.705806z' p-id='2170' fill='#ff5290'></path></svg></span>
							<cq-tooltip style='left: -30px;width: 100px;padding-top: 2px;padding-bottom: 2px;'>SELL(SYMBOL 2)</cq-tooltip>
						</cq-toggle>
					</cq-info-toggle-dropdown>
					<div class="favBtnContainer">
						<button class='test' stxtap='SentimentLook.delSymbolCookie()' style="width: 188px;height: 32px;border-radius: 20px;border: 0.1rem rgb(80, 166, 252) solid;font-size: 0.6rem;font-weight:bold;background: #5b9bd1;color: white;font-family: Helvetica, sans-serif;cursor:pointer;">
						<div>
						<svg t='1638255076868' class='button_icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2654' width='200' height='200'><path d='M885.942179 427.687756l-267.445168-22.933315-104.470353-246.470461L409.553235 404.75444l-267.336698 22.933315 202.846918 175.770236-60.789505 261.34524 229.753731-138.569986 229.859132 138.569986-60.785411-261.34524L885.942179 427.687756zM514.026658 656.403854l-139.875724 84.425831 37.038568-159.160953-123.591853-106.975407 162.91751-14.053064 63.511499-150.116973 63.620993 150.116973 162.860205 14.053064-123.534548 106.975407 37.038568 159.160953L514.026658 656.403854z' p-id='2655' fill='#FFFFFF'></path></svg>
						<span>Remove from favorites</span>
						</div></button>
					</div>
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
		<div id="stxMessage" class="myMes">
		<!-- last signal marker -->
		<div id="stxForecast" class="forecast"></div>
		</div>
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
import { extendOverwrite } from './st-development/js/StudiesExtendOverwrite' // dual symbol new feature
import UploaderVue from './st-development/components/Uploader.vue'
import ReportsFilter from './st-development/components/ReportsFilter.vue'
import ModalBox from '@/components/common/modalBox/ModalBox.vue'
import ModalBoxContainer from '@/components/common/modalBox/ModalTabContainer.vue'
// TODO next is to intergrate them into an index entry file
import SummaryChart from '@/components/common/StrategyModal/SummaryChart/index.vue'
import StrategySigal from '@/components/common/StrategyModal/strategySignal/StrategySignal.vue'
import TradesTable from '@/components/common/StrategyModal/TradesTable/index.vue'
import Description from '@/components/common/StrategyModal/Description/index.vue'
import { getSymbolStrategySigal } from '@/service/service'

@Component({
  components: {
    ModalBox,
	ModalBoxContainer,
	SummaryChart,
	StrategySigal,
	TradesTable,
	Description,
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
			CIQ.stxx.minimumCandleWidth = 0.06;
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

		await this.getSymbolStrategyData()
	}
	openModal(contentType: string) {
      this.modalContent = contentType; // 设置要显示的内容
	  const modal = this.$refs.modalBox as any;
      if (modal) {
				if(this.isShowStrategyDescription) this.isShowStrategyDescription = false
        modal.open(); // 确保 modal 存在后再调用 open 方法
      }
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
		
		// 防止跳转到backtester时保留了Hammer followed by a raise等marker
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
	
	// 统一复写默认Study(已存在的，不然则在STMovingAverages中配置)配置
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
</style>