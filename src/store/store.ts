import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		favoriteIndicatorList: [],
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
		conditionRadio: {
			MACD_like: '',
			EFT_like: '',
			BollingerBands_like: '',
			Stochastics_like: '',
			ERI_like: '',
			ADX_like: '',
			MovingAverage_like: '',
			Aligator_like: '',
		},
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
			entry_description: [],
			exit_description: [],
			direction: 'Long',
			frequency: 'Daily',
			entry: {
				relation: 0,
				score: 1,
				signals: [
					{
						sentimentIndicator: '',
						technicalIndicator: ''
					}
				]
			},
			exit: {
				relation: 0,
				score: 1,
				signals: [{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: ''}]
			}
		},
		favoriteBacktestRowData: { id: 0 },
		favoriteBacktestData: [],
		indicators: {
			formIndicators: {
				entry: [],
				exit: []
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
		strategyId: '',
		indicatorsList: [],
		builtinList: [],
		trades: [],
		entryIndicatorRadio: 'sentiment',
		exitIndicatorRadio: 'Sentiment_Indicators:',
		saveConditionFormdata: {},
		activatedMA: [{ period: 21, url: '' }],
		// indicators look up
		allSymbolsList: [],
		stocksList: [],
		indexsList: [],
		tabIndex: 0,
		sentimentIndicatorList: [],
		backtestNameList: [],
		formateTechnicalList: []
	},
	getters: {
		getExtremeValue: (state) => {
			return state.extremeValue
		}
	},
	mutations: {
	setFavoriteIndicatorList(state, val){
		state.favoriteIndicatorList = val
	},
	setTechSD(state, val){
		state.techSD = val
	},	
	setSavedTechSD(state, val){
		console.log('sd changed: ',val)
		state.savedTechSD = val
	},
	setCurrentSenti(state,val){
		state.currentSenti = val
	},
	setCurrentTech(state,val){
		state.currentTech = val
	},
	setRestoreFreq(state,val){
		state.restoreFreq = val
	},
	getBacktestSymbol(state,val){
		state.backtestSymbol = val
	},
    resetState(state,val){
      state = val
    },
    setCopy(state,val){
      state.stateCopy = val
    },
	setFreqency(state,val){
		state.pairDataFreq = val
	},
    setConditionRadio(state,val){
      state.conditionRadio = val
    },
    setMaRadio(state,val){
      state.maRadio = val
    }
    ,
    getStMaPeriod(state,val){
      state.stMaPeriod = val
    },
    getMaPeriod(state,val){
      state.maPeriod = val
    },
    getImportedLayout(state,val){
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
		getRunBacktestData(state, row) {
			state.favoriteBacktestRowData = row
		},
		getRunBacktestAllResult(state, list) {
			state.favoriteBacktestData = list
		},
		getEntryIndicators(state, obj) {
			let {index,value} = obj
			state.indicators.formIndicators.entry[index] = value
		},
		getEntryIndicatorsList(state, list) {
			state.indicators.formIndicators.entry = list
		},
		getExitIndicators(state, obj) {
			let {index,value} = obj
			state.indicators.formIndicators.exit[index] = value
		},
		getExitIndicatorsList(state, list) {
			state.indicators.formIndicators.exit = list
		},
		getExtraIndicators(state, val) {
			state.indicators.extraIndicators = val
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
			state.backtestInfo.frequency = val
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
		saveCondictionData(state, val) {
			state.saveConditionFormdata = val
		},
		getDirection(state, val) {
			// 设置 backtestInfo 的 direction
			state.backtestInfo.direction = val
		},
		getTechnicalIndicators(state, val) {
			state.indicators.technicalIndicators = val
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
			try {
			state.backtestInfo[val.criteria].signals[val.index].sentimentIndicator =
			''
			state.backtestInfo[val.criteria].signals[val.index].technicalIndicator =
				''
			state.backtestInfo.exit.signals[val.index].riskIndicator =
				''
			} catch (error) {
				console.log(error);
				
			}
		},
		getTechValue(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index].technicalIndicator =
				obj.value
			console.log("保存的indicator", state.backtestInfo[obj.criteria].signals);
		},
		getRiskValue(state, obj) {
			state.backtestInfo.exit.signals[obj.index].riskIndicator = obj.value
			console.log("保存的indicator", state.backtestInfo.exit.signals);
			
				
		},
		getSentiValue(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator =
				obj.value
				console.log("保存的indicator", state.backtestInfo[obj.criteria].signals);
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
				state.backtestInfo.exit.signals[obj.index].riskIndicator =
				''
		},
		clearBacktest(state) {
			state.backtestInfo = {
				entry_description: [],
				exit_description: [],
				direction: 'Long',
				frequency: 'Daily',
				entry: {
					relation: 0,
					score: 1,
					signals: [
						{
							sentimentIndicator: '',
							technicalIndicator: ''
						}
					]
				},
				exit: {
					relation: 0,
					score: 1,
					signals: [{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '' }]
				}
			}
		},
		getSentimentList(state,list) {
			state.sentimentIndicatorList = list
		},
		saveCondition(state, obj) {
			let criteria = obj.criteria
			let index = obj.index
			delete obj.criteria
			delete obj.index
			let init = {sentimentIndicator: '', technicalIndicator: '',riskIndicator: ''}
			init.sentimentIndicator = state.backtestInfo[criteria].signals[index].sentimentIndicator
			init.technicalIndicator = state.backtestInfo[criteria].signals[index].technicalIndicator
			if(criteria === 'exit') {
			init.riskIndicator = state.backtestInfo.exit.signals[index].riskIndicator
			}
			// 在保存之前确保只有 sentimentIndicator 以及 technicalIndicator 两个属性
			if(criteria == 'exit') {
			state.backtestInfo.exit.signals[index] = Object.assign({}, init)
			}else if(criteria == 'entry') {
			  delete init.riskIndicator
			state.backtestInfo.entry.signals[index] = Object.assign({}, init)
			}
			for(let key in obj) {
				state.backtestInfo[criteria].signals[index][key] = obj[key]
			}
			
			console.log("保存 condition",state.backtestInfo[criteria]);
		},
		saveDescription(state, desObj) {
			if(Array.isArray(state.backtestInfo[desObj.criteria+'_description'])) {
				// state.backtestInfo[desObj.criteria+'_description'].splice(desObj.index, 0, desObj.description)
				state.backtestInfo[desObj.criteria+'_description'][desObj.index] = desObj.description
				console.log("成功保存的entry description",state.backtestInfo.entry_description);
				console.log("成功保存的exit description",state.backtestInfo.exit_description);
			
			}
		},
		initialBacktestInfo(state) {
			state.backtestInfo = {
				entry_description: [],
				exit_description: [],
				direction: 'Long',
				frequency: 'Daily',
				entry: {
					relation: 0,
					score: 1,
					signals: [
						{
							sentimentIndicator: '',
							technicalIndicator: ''
						}
					]
				},
				exit: {
					relation: 0,
					score: 1,
					signals: [{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '' }]
				}
			}
			state.backtestInfo.entry =  {
				score: 1,
				relation: 0,
				signals: [
					{
						sentimentIndicator: '',
						technicalIndicator: ''
					}
				]
			}
			state.backtestInfo.exit =  {
				relation: 0,
				score: 1,
				signals: [{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '' }]
			}
			state.backtestInfo.entry_description = []
			state.backtestInfo.exit_description = []
			
		},
		clearStoreDesciption(state) {
			state.backtestInfo.entry_description = []
			state.backtestInfo.exit_description = []	
		},
		getBacktestName(state, list) {
          state.backtestNameList = list
		},
		clearBacktestUuid(state) {
			if(state.backtestInfo.old_uuid) {
			delete state.backtestInfo.old_uuid}
			
		},
		saveFormatTechnicalList(state,list) {
			state.formateTechnicalList = list
		},
		addSignalLength(state,obj) {
			let newEntrySignal = {
				sentimentIndicator: '',
				technicalIndicator: ''
			}
			let newExitSignal = { sentimentIndicator: '', technicalIndicator: '', riskIndicator: '' }
			if(obj.criteria === 'entry') {
				state.backtestInfo[obj.criteria].signals[obj.index] = newEntrySignal
			}
			if(obj.criteria === 'exit') {
					state.backtestInfo[obj.criteria].signals[obj.index] = newExitSignal
			}
			console.log('添加后'+obj.criteria+'当前的信号结构',state.backtestInfo[obj.criteria].signals)
		},
		reduceSignalLength(state, obj) {
			state.backtestInfo[obj.criteria].signals.splice(obj.index, 1)
			console.log('删除后'+obj.criteria+'当前的信号结构',state.backtestInfo[obj.criteria].signals)
		},
		saveScoreValue(state, obj) {
			state.backtestInfo[obj.criteria].score = Number(obj.value)
			console.log("保存分数", state.backtestInfo[obj.criteria]);
			
		}
	},
	actions: {
		Try(context, val) {
			context.commit('setEntryData', val)
		}
	}

})
