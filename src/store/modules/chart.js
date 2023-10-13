import { CIQ } from '@/components/common/chart/st-development/js'

const state = {
	curDate: '', //ai
	studySettingMA: { period: '', criteria: '', panelIndex: '' }, //chartiq
	favoriteIndicatorList: [], //chartiq
	favoriteSymbolList: [], //chartiq
	techSD: [], //chartiq
	savedTechSD: [], //chartiq
	currentSenti: {
		//chartiq
		url: '',
		name: ''
	},
	currentTech: {
		//chartiq
		url: '',
		name: ''
	},
	indicators: {
		//chartiq
		formIndicators: {
			entry: new Array(5),
			exit: new Array(5)
		},
		extraIndicators: [],
		technicalIndicators: []
	},
	extremeValue: [], //chartiq
	indicatorsList: [], //chartiq 代替了AllSymbolsList
	builtinList: [], //chartiq 包含完整techList
	trades: [], //chartiq
	activatedMA: [{ period: 21, url: '' }], //chartiq
	activatedMALayout: [], //chartiq
	// indicators look up
	stocksList: [], //chartiq
	indexsList: [], //chartiq
	formateTechnicalList: [], //chartiq 和builtinList不同，这个是只给表单提供的techList
	spanPeriod: {},
	sentimentIndicatorList: [],
	isBTChartReady: false,
	chartLoadingSetting: {
		// 控制 setup 的loading 状态
		isChartLoading: false,
		showProgress: false,
		percentage: 0,
		progressText: 'Loading...'
	},
}

const mutations = {
	SET_CUR_DATE: (state, val) => {
		state.curDate = val
	},
	/**
	 * Sets up a mutations to store MA period when editting MA study to make sure the MA period is the same in chart and form
	 */
	studySettingMAChange(state, obj) {
		state.studySettingMA = obj
	},
	/**
	 * Sets up a mutations to store favoriteIndicatorList that is originally read from API
	 */
	setFavoriteIndicatorList(state, val) {
		state.favoriteIndicatorList = val
	},
	/**
	 * Sets up a mutations to store favoriteSymbolList that is originally read from API
	 */
	setFavoriteSymbolList(state, val) {
		state.favoriteSymbolList = val
	},
	/**
	 * Sets up a mutations to store the study objects that are read from API,只是读取回测携带的indicator study信息
	 */

	setTechSD(state, val) {
		state.techSD = val
	},
	/**
	 * Sets up a mutations to store the current study objects on chart
	 */
	setSavedTechSD(state, val) {
		state.savedTechSD = val
	},
	/**
	 * Sets up a mutations to store the current selected sentiment indicator, it's used to trigger the listener for updating indicator in form
	 */
	setCurrentSenti(state, val) {
		state.currentSenti = val
	},
	/**
	 * Sets up a mutations to store the current selected technical indicator, it's used to trigger the listener for updating indicator in form
	 */
	setCurrentTech(state, val) {
		state.currentTech = val
	},
	/**
	 * Sets up a mutations to store the extremeValue of an indicator
	 */

	getExtremeValue: (state, list) => {
		state.extremeValue = list
	},
	/**
	 * Sets up a mutations to store the StocksList, it's usually called when the project is initiated
	 */

	getStocksList(state, list) {
		state.stocksList = list
	},
	/**
	 * Sets up a mutations to store the IndexsList, it's usually called when the project is initiated
	 */

	getIndexsList(state, list) {
		state.indexsList = list
	},
	/**
	 * set a single indicator to the indicator list
	 */

	getEntryIndicators(state, obj) {
		let { index, value } = obj
		state.indicators.formIndicators.entry[index] = value
	},
	/**
	 * store a list of entry indicators
	 */

	getEntryIndicatorsList(state, list) {
		state.indicators.formIndicators.entry = list
	},
	getExitIndicators(state, obj) {
		let { index, value } = obj
		state.indicators.formIndicators.exit[index] = value
	},
	getExitIndicatorsList(state, list) {
		state.indicators.formIndicators.exit = list
	},
	/**
	 * no bug occurs, however, the logic inside is confusing
	 */

	getExtraIndicators(state, val) {
		state.indicators.extraIndicators = val
	},

	/**
	 * no bug occurs, however, the logic inside is confusing
	 */

	getIndicatorsList(state, data) {
		state.indicatorsList = data
	},
	/**
	 * Sets up a mutations to store the technical indicators
	 */

	getBuiltinList(state, data) {
		state.builtinList = data
	},

	getTradesData(state, data) {
		state.trades = data
	},
	/**
	 * Sets up a mutations to store a list of the name of all rendered moving average line
	 */

	getMA(state, val) {
		state.activatedMA = val
	},
	getMALayout(state, val) {
		state.activatedMALayout = val
	},
	getTechnicalIndicators(state, val) {
		state.indicators.technicalIndicators = val
	},
	saveFormatTechnicalList(state, list) {
		state.formateTechnicalList = list
	},
	RESET_CHART_STUDY_STATE: state => {
		// 清空chartiq indicator study信息
		;(state.indicators = {
			formIndicators: {
				entry: new Array(5),
				exit: new Array(5)
			},
			extraIndicators: [],
			technicalIndicators: []
		}),
			(state.activatedMA = [{ period: 21, url: '' }])
		state.activatedMALayout = []
	},
	SET_SPAN_PERIOD: (state, val) => {
		state.spanPeriod = val
	},
	getSentimentList(state, list) {
		state.sentimentIndicatorList = list
	},
	SET_CHART_READY_STATE(state, _state) {
		state.isBTChartReady = _state
	},
	SET_CHART_LOADING(state, obj) {
		const { isChartLoading, percentage, progressText, showProgress } = obj
		state.chartLoadingSetting = {
			isChartLoading,
			showProgress,
			percentage,
			progressText
		}
	},
}

const actions = {
	Try(context, val) {
		context.commit('setEntryData', val)
	},
	set_cur_date({ commit }, val) {
		return new Promise(resolve => {
			commit('SET_CUR_DATE', val)
			resolve()
		})
	},
	reset_chart_study_state({ commit }) {
		return new Promise(resolve => {
			// 清空表单indicator列表信息
			for (var id in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[id]
				if (!sd.customLegend && !sd.permanent)
					CIQ.Studies.removeStudy(CIQ.stxx, sd)
			}
			CIQ.stxx.draw()
			CIQ.setPanelHeight([])

			commit('RESET_CHART_STUDY_STATE')
			resolve()
		})
	},
	set_span_period({ commit }, val) {
		return new Promise(resolve => {
			commit('SET_SPAN_PERIOD', val)
			resolve()
		})
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
