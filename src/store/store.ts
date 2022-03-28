import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		favoriteIndicatorList: [],
		favoriteSymbolList: [],
		techSD: [],
		savedTechSD: [],
		currentSenti: {
			url: '',
			name: ''
		},
		currentTech: {
			url: '',
			name: ''
		},
		restoreFreq: '',
		backtestSymbol: '',
		pairDataFreq: '',
		stateCopy: {},
		conditionRadio: '',
		maRadio: '',
		stMaPeriod: '',
		maPeriod: '',
		importedLayout: '',
		newPorfolioInputsValues: {
			inputNameValue: '',
			inputDescriptionValue: '',
			inputOriginalAssetValue: ''
		},
		backtestInfo: {
			entry_description: '',
			exit_description: '',
			frequency: 'Daily',
			entry: {
				direction: 'Long',
				frequency: 'Daily',
				signals: [
					{
						sentimentIndicator: '',
						technicalIndicator: ''
					}
				]
			},
			exit: {
				direction: 'Short',
				frequency: 'Daily',
				signals: [
					{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '' }
				]
			}
		},
		openedPorfolioBacktests: [],
		count: 1,
		porfolioCash: '11',
		savePorfolioData: [],
		favoriteBacktestRowData: { id: 0 },
		favoriteBacktestData: [],
		strategyEntryData: {},
		strategyExitData: {},
		indicators: {
			formIndicators: {
				entry: '',
				exit: ''
			},
			extraIndicators: [],
			technicalIndicators: []
		},

		extremeValue: [],

		// extremeValue: [{
		// 	indicator: '',
		// 	extremeOptimism: '',
		// 	extremePessimism: ''
		// }],

		isClearForm: false,
		// cciDefault: {
		//   over_bought_bound: undefined,
		// 	over_sold_bound: undefined,
		//   period: undefined
		// },
		// macdDefault: {
		//   MACDSlow: undefined,
		//   MACDFast: undefined,
		//   MACDSL: undefined
		// },
		// rsiDefault: {
		//   over_bought_bound: undefined,
		// 	over_sold_bound: undefined,
		//   period: undefined
		// },
		customExitType: [
			{ label: 'short', value: 'short' },
			{ label: 'longexit', value: 'longexit' }
		],
		exitOption: [
			{ label: 'longexit', value: 'longexit' },
			{ label: 'short', value: 'short' }
		],
		strategyId: '',
		indicatorsList: [],
		builtinList: [],
		trades: [],
		entryIndicatorRadio: 'sentiment',
		exitIndicatorRadio: 'Sentiment_Indicators:',
		signalDialogData: {},
		saveConditionFormdata: {},
		exitFrequency: '',
		exitDirection: '',
		exitTechType: '',
		activatedMA: [{ period: 21, url: '' }],
		// indicators look up
		allSymbolsList: [],
		stocksList: [],
		indexsList: [],

		editBacktestSetUpData: {},
		isShowExitForm: true,
		tabIndex: 0,
		fdDialogData: {},
		sentimentIndicatorList: [],
		backtestNameList: [],
		isSavaDescription: false,
		formateTechnicalList: []
	},
	getters: {
		getterIsSavaDescription: (state) => {
			return state.isSavaDescription
		},
		getBacktestEntryFrequency: (state) => {
			return state.backtestInfo.entry.frequency
		},
		getBacktestExitDirection: (state) => {
			return state.exitDirection
		},
		getExtremeValue: (state) => {
			return state.extremeValue
		},
		getSignalDialogData: (state) => {
			return state.signalDialogData
		},
		getDialogFdData: (state) => {
			return state.fdDialogData
		},
		getSentimentIndicator: (state) => {
			return state.backtestInfo
		}
	},
	mutations: {
		setFavoriteIndicatorList(state, val) {
			state.favoriteIndicatorList = val
		},
		setFavoriteSymbolList(state, val){
			state.favoriteSymbolList = val
		},
		setTechSD(state, val){
			state.techSD = val
		},
		setSavedTechSD(state, val) {
			state.savedTechSD = val
		},
		setCurrentSenti(state, val) {
			state.currentSenti = val
		},
		setCurrentTech(state, val) {
			state.currentTech = val
		},
		setRestoreFreq(state, val) {
			state.restoreFreq = val
		},
		getBacktestSymbol(state, val) {
			state.backtestSymbol = val
		},
		resetState(state, val) {
			state = val
		},
		setCopy(state, val) {
			state.stateCopy = val
		},
		setFreqency(state, val) {
			state.pairDataFreq = val
		},
		setConditionRadio(state, val) {
			state.conditionRadio = val
		},
		setMaRadio(state, val) {
			state.maRadio = val
		},
		getStMaPeriod(state, val) {
			state.stMaPeriod = val
		},
		getMaPeriod(state, val) {
			state.maPeriod = val
		},
		getImportedLayout(state, val) {
			state.importedLayout = val
		},
		getExtremeValue: (state, list) => {
			state.extremeValue = list
		},

		getAllSymbolsList(state, list) {
			state.allSymbolsList = list
		},
		getStocksList(state, list) {
			state.stocksList = list
		},
		getIndexsList(state, list) {
			state.indexsList = list
		},
		getNewPorfolioInputsValues(state, row) {
			state.newPorfolioInputsValues.inputNameValue = row.name
			state.newPorfolioInputsValues.inputDescriptionValue = row.description
			state.newPorfolioInputsValues.inputOriginalAssetValue = row.original_asset
			state.openedPorfolioBacktests = row.backtests
		},
		getSavePorfolioData(state, list) {
			state.savePorfolioData = list
		},
		getRunBacktestData(state, row) {
			state.favoriteBacktestRowData = row
		},
		getRunBacktestAllResult(state, list) {
			state.favoriteBacktestData = list
		},
		getEntryIndicators(state, val) {
			state.indicators.formIndicators.entry = val
		},
		getExitIndicators(state, val) {
			state.indicators.formIndicators.exit = val
		},
		getExtraIndicators(state, val) {
			state.indicators.extraIndicators = val
		},
		getEntryData(state, val) {
			state.strategyEntryData = val
		},
		getExitData(state, val) {
			state.strategyExitData = val
		},
		getExitType(state, val) {
			const data = {
				long: [
					{ label: 'Short', value: 'short' },
					{ label: 'Longexit', value: 'longexit' }
				],
				short: [
					{ label: 'Long', value: 'long' },
					{ label: 'Shortexit', value: 'shortexit' }
				]
			}
			if (val === 'long') {
				state.customExitType = data.long
			} else {
				state.customExitType = data.short
			}
		},
		getExitOption(state, val) {
			const data = {
				long: [
					{ label: 'Short', value: 'short' },
					{ label: 'Longexit', value: 'longexit' }
				],
				short: [
					{ label: 'Long', value: 'long' },
					{ label: 'Shortexit', value: 'shortexit' }
				]
			}
			if (val === 'long') {
				state.exitOption = data.long
			} else {
				state.exitOption = data.short
			}
		},
		getStrategyId(state, id) {
			state.strategyId = id
		},
		getIndicatorsList(state, data) {
			state.indicatorsList = data
		},
		getBuiltinList(state, data) {
			state.builtinList = data
		},
		getTradesData(state, data) {
			state.trades = data
		},
		getFrequency(state, val) {
			state.exitFrequency = val
			state.backtestInfo.frequency = val
			// 将频率保存到 backtestInfo
			if (
				typeof state.backtestInfo.entry == 'object' &&
				typeof state.backtestInfo.exit == 'object'
			) {
				state.backtestInfo.entry.frequency = val
				state.backtestInfo.exit.frequency = val
			}
		},
		getMA(state, val) {
			state.activatedMA = val
		},
		clearEntrySignal(state, val) {
			state.indicators.formIndicators.entry = ''
		},
		clearExitSignal(state, val) {
			state.indicators.formIndicators.exit = ''
		},
		getEntryIndicatorRadio(state, val) {
			state.entryIndicatorRadio = val
		},
		getExitIndicatorRadio(state, val) {
			state.exitIndicatorRadio = val
		},
		setSignalDialogData(state, val) {
			state.signalDialogData = val
		},
		saveCondictionData(state, val) {
			state.saveConditionFormdata = val
		},
		getExitTechList(state, val) {
			state.exitTechType = val
		},
		getExitDirection(state, val) {
			let data = ''
			if (val == 'Long') {
				data = 'Short'
			} else if (val == 'Short') {
				data = 'Long'
			} else if (val == '') {
				data = ''
			}
			state.exitDirection = data
			// 设置 entry 和 exit 的 direction
			state.backtestInfo.entry.direction = val
			state.backtestInfo.exit.direction = data
		},
		getTechnicalIndicators(state, val) {
			state.indicators.technicalIndicators = val
		},
		// getRiskIndicators(state, val) {
		// 	state.indicators.riskIndicators = val
		// },
		getBacktestetUpEditData(state, row) {
			state.editBacktestSetUpData = row
		},
		// show exit form when save entrySignal
		showExitFormData(state, val) {
			state.isShowExitForm = val
		},
		addSignal(state, val) {
			state.backtestInfo[val]['signals'].push({})
		},
		moveSignal(state, val) {
			state.backtestInfo[val]['signals'].slice(state.tabIndex, 1)
		},
		setEntryData(state, obj) {
			var index = obj.index
			state.tabIndex = index
			var criteria = obj.criteria
			delete obj.index
			delete obj.criteria
			if (index !== '' && criteria !== '') {
				if (index === undefined) {
					return
				}
				if (state.backtestInfo[criteria]['signals'].length !== index + 1) {
					state.backtestInfo[criteria]['signals'].push({})
				}
				var data = state.backtestInfo[criteria]['signals'][index]
				const newData = {}
				for (let key in obj) {
					if (obj[key] !== '' && obj[key] !== undefined) {
						newData[key] = obj[key]
					}
				}
				data = Object.assign(data, newData)
				state.backtestInfo[criteria]['signals'][index] = data
			}
		},
		setFd(state, obj) {
			let criteria = obj.criteria
			delete obj.index
			delete obj.criteria
			for (let key in obj) {
				if (obj[key]) {
					state.backtestInfo[criteria][key] = obj[key]
				}
			}
		},
		setBd(state, obj) {
			for (let key in obj) {
				if (obj) {
					state.backtestInfo[key] = obj[key]
				}
			}
		},
		deleteIndicator(state, val) {
			state.backtestInfo[val.criteria].signals[val.index].sentimentIndicator =
				''
			state.backtestInfo[val.criteria].signals[val.index].technicalIndicator =
				''
			state.backtestInfo.exit.signals[val.index].riskIndicator = ''
		},
		getTechValue(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index].technicalIndicator =
				obj.value
		},
		getRiskValue(state, obj) {
			state.backtestInfo.exit.signals[obj.index].riskIndicator = obj.value
		},
		getSentiValue(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator =
				obj.value
		},
		// 用于单选框 切换时删除不必要字段
		delete(state, obj) {
			delete state.backtestInfo[obj.criteria].signals[obj.index][obj.delete]
		},
		clearSignal(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index] = {}
			state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator =
				''
			state.backtestInfo[obj.criteria].signals[obj.index].technicalIndicator =
				''
			state.backtestInfo.exit.signals[obj.index].riskIndicator = ''
		},
		clearBacktest(state) {
			state.backtestInfo = {
				entry_description: '',
				exit_description: '',
				frequency: 'Daily',
				entry: {
					direction: '',
					frequency: '',
					signals: [
						{
							sentimentIndicator: '',
							technicalIndicator: ''
						}
					]
				},
				exit: {
					direction: '',
					frequency: '',
					signals: [
						{
							sentimentIndicator: '',
							technicalIndicator: '',
							riskIndicator: ''
						}
					]
				}
			}
		},
		getSentimentList(state, list) {
			state.sentimentIndicatorList = list
		},
		setSignalDialogFd(state, fd) {
			state.fdDialogData = fd
		},
		tryClear(state) {
			state.isClearForm = !state.isClearForm
		},
		saveCondition(state, obj) {
			let criteria = obj.criteria
			let index = obj.index
			delete obj.criteria
			delete obj.index
			let init = {
				sentimentIndicator: '',
				technicalIndicator: '',
				riskIndicator: ''
			}
			init.sentimentIndicator =
				state.backtestInfo[criteria].signals[index].sentimentIndicator
			init.technicalIndicator =
				state.backtestInfo[criteria].signals[index].technicalIndicator
			if (criteria === 'exit') {
				init.riskIndicator =
					state.backtestInfo.exit.signals[index].riskIndicator
			}
			// 在保存之前确保只有 sentimentIndicator 以及 technicalIndicator 两个属性
			if (criteria == 'exit') {
				state.backtestInfo.exit.signals[index] = Object.assign({}, init)
			} else if (criteria == 'entry') {
				delete init.riskIndicator
				state.backtestInfo.entry.signals[index] = Object.assign({}, init)
			}
			for (let key in obj) {
				state.backtestInfo[criteria].signals[index][key] = obj[key]
			}
		},
		saveDescription(state, desObj) {
			state.backtestInfo[desObj.criteria + '_description'] = desObj.description
		},
		initialBacktestInfo(state) {
			state.backtestInfo = {
				entry_description: '',
				exit_description: '',
				frequency: 'Daily',
				entry: {
					direction: 'Long',
					frequency: 'Daily',
					signals: [
						{
							sentimentIndicator: '',
							technicalIndicator: ''
						}
					]
				},
				exit: {
					direction: 'Short',
					frequency: 'Daily',
					signals: [
						{
							sentimentIndicator: '',
							technicalIndicator: '',
							riskIndicator: ''
						}
					]
				}
			}
			state.backtestInfo.entry = {
				direction: 'Long',
				frequency: 'Daily',
				signals: [
					{
						sentimentIndicator: '',
						technicalIndicator: ''
					}
				]
			}
			state.backtestInfo.exit = {
				direction: 'Short',
				frequency: 'Daily',
				signals: [
					{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '' }
				]
			}
		},
		getBacktestName(state, list) {
			state.backtestNameList = list
		},
		savaDescriptionAgain(state, flag) {
			state.isSavaDescription = flag
		},
		clearBacktestUuid(state) {
			if (state.backtestInfo.old_uuid) {
				delete state.backtestInfo.old_uuid
			}
		},
		saveFormatTechnicalList(state, list) {
			state.formateTechnicalList = list
		}
	},
	actions: {
		Try(context, val) {
			context.commit('setEntryData', val)
		}
	}
})
