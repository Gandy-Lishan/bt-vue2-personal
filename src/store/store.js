/**
 *	2.2.0
 *	Vuex store
 */

import Vue from 'vue'
import Vuex from 'vuex'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		curDate: '',
		studySettingMA: {period:'',criteria:'',panelIndex:''},
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
		conditionRadio: {
			entry:new Array(5).fill(''),
			exit:new Array(5).fill(''),
		},
		maRadio: '',
		stMaPeriod: '',
		maPeriod: '',
		newPorfolioInputsValues: {
			inputNameValue: '',
			inputDescriptionValue: '',
			inputOriginalAssetValue: ''
		},
		backtestInfo: {
			entry_description: [],
			exit_description: [],
			description: '',
			direction: 'Long',
			frequency: 'Daily',
			entry: {
				relation: 0,
				score: 1,
				signals_in_market: 1,
				delay_bars: 0,
				signals: [
					{
						sentimentIndicator: '',
						technicalIndicator: '',
						usersOwnIndicator: '',
						symbolIndicator: ''
					}
				]
			},
			exit: {
				relation: 0,
				score: 1,
				signals_in_market: 1,
				delay_bars: 0,
				signals: [{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '', symbolIndicator: '', usersOwnIndicator: ''}]
			}
		},
		riskDescription: '',
		openedPorfolioBacktests: [],
		favoriteBacktestRowData: { id: 0 },
		favoriteBacktestData: [],
		indicators: {
			formIndicators: {
				entry: new Array(5),
				exit: new Array(5)
			},
			extraIndicators: [],
			technicalIndicators: []
		},
		extremeValue: [],
		strategyId: '',
		indicatorsList: [],
		builtinList: [],
		trades: [],
		entryIndicatorRadio: 'sentiment',
		exitIndicatorRadio: 'Sentiment_Indicators:',
		saveConditionFormdata: {},
		exitFrequency: '',
		activatedMA: [{ period: 21, url: '' }],
		activatedMALayout: [],
		// indicators look up
		allSymbolsList: [],
		stocksList: [],
		indexsList: [],
		tabIndex: 0,
		sentimentIndicatorList: [],
		backtestNameList: [],
		formateTechnicalList: [],
		riskControl: 'true',
		// read only
		symbolConditions : [
			{label:'Symbol Open',field:'Open'},
			{label:'Symbol High',field:'High'},
			{label:'Symbol Low',field:'Low'},
			{label:'Symbol Close',field:'Close'},
			{label:'Symbol Volume',field:'Volume'},
		],
		// a status before symbol is loaded as a study
		beforeCalculateNewConditions: false, 
		is_admin: false,
		role: '',
		usersOwnEntryFileHash: Array(5).fill(''),
		usersOwnExitFileHash: Array(5).fill(''),
		userUploadFileContent: Array(5).fill({}),
		backtestResult: [],
		tradePrice: 0,
		last_signal_array: [],
		_last_signal_array: [],
		hashTable: [],
		frequencyArray: new Map(),
		scannerai_filter: {},
		scannerai_flag: false,
		isBacktestRunning_flag:false,
	},
	getters: {
		getAllSignalArray: (state) => {
			return state.last_signal_array
		},
		getLastSignalArray: (state) => {
			return state._last_signal_array
		},
		getExtremeValue: (state) => {
			return state.extremeValue
		},
		getBeforeCalculateNewConditions: (state) => {
			return state.beforeCalculateNewConditions
		},
		getBacktestResult: (state) => {
			return state.backtestResult
		},
		exitFreqGetter: (state) => {
			return state.exitFrequency
		},
		getScannerAIFilterState: (state) => {
			return state.scannerai_filter
		},
		getScannerAIFlagState: (state) => {
			return state.scannerai_flag
		},
		getIsBacktestRunningFlagState: (state) => {
			return state.isBacktestRunning_flag
		}
	},
	mutations: {
		SET_LASTSIGNAL_ARRAY: (state,val)=>{
			state.last_signal_array = val
		},
		_SET_LASTSIGNAL_ARRAY: (state,val)=>{
			state._last_signal_array = val
		},
		SET_TRADE_PRICE: (state,val)=>{
			state.tradePrice = val
		},
		STORE_BACKTESTRESULT: (state,val)=>{
			state.backtestResult = val
		},
		SET_CUR_DATE: (state,val)=>{
			state.curDate = val
		},
		envokeBeforeCalculateNewConditions(state,val){
			state.beforeCalculateNewConditions = val
		},
		/**
		 * Sets up a mutations to store MA period when editting MA study to make sure the MA period is the same in chart and form 
		 */
		studySettingMAChange(state,obj){
			state.studySettingMA = obj
		},
		/**
		 * Sets up a mutations to store favoriteIndicatorList that is originally read from API
		 */
		setFavoriteIndicatorList(state, val){
			state.favoriteIndicatorList = val
		},
		/**
		 * Sets up a mutations to store favoriteSymbolList that is originally read from API
		 */
		setFavoriteSymbolList(state, val){
			state.favoriteSymbolList = val
		},
		/**
		 * Sets up a mutations to store the study objects that are read from API
		 */	
		setTechSD(state, val){
			state.techSD = val
		},
		/**
		 * Sets up a mutations to store the current study objects on chart
		 */
		setSavedTechSD(state, val){
			state.savedTechSD = val
		},
		/**
		 * Sets up a mutations to store the current selected sentiment indicator, it's used to trigger the listener for updating indicator in form
		 */
		setCurrentSenti(state,val){
			state.currentSenti = val
		},
		/**
		 * Sets up a mutations to store the current selected technical indicator, it's used to trigger the listener for updating indicator in form
		 */
		setCurrentTech(state,val){
			state.currentTech = val
		},
		/**
		 * Sets up a mutations to restore the timeframe of selected backtest
		 */	
		setRestoreFreq(state,val){
			state.restoreFreq = val
		},
		/**
		 * Sets up a mutations to restore the symbol of selected backtest
		 */	
		getBacktestSymbol(state,val){
			state.backtestSymbol = val
		},
		/**
		 * not in use
		 */	
		resetState(state,val){
		state = val
		},
		/**
		 * not in use
		 */	
		setCopy(state,val){
		state.stateCopy = val
		},
		/**
		 * no bug occurs, however, the logic inside is confusing
		 */	
		setFreqency(state,val){
			state.pairDataFreq = val
		},
		getFrequency(state, val) {
			if(val === undefined || val === null || val === ''){
				state.exitFrequency = 'Daily'
				state.backtestInfo.frequency = 'Daily'
				return
			}
			state.exitFrequency = val
			state.backtestInfo.frequency = val


		},
		setFrequencyArray(state, obj) {
			// 不管是exit和entry都推到这个Map里面
			const key = obj.key
			const relation = obj.relation
			const criteria = obj.criteria
			let entryPanel1 = null
			let exitPanel1 = null
			if(relation === 1 && criteria === 'entry') {
				entryPanel1 = state.frequencyArray.get(obj.key).value
			}
			if(relation === 1 && criteria === 'exit') {
				exitPanel1 = state.frequencyArray.get(obj.key).value
			}
			state.frequencyArray.set(key, obj)
			let freqEntryArray = new Array(5).fill('')
			let freqExitArray = new Array(5).fill('')
			for (let obj of state.frequencyArray.values()) {
				if(obj.criteria === 'entry'){
					freqEntryArray[obj.index] = obj.value
				}
				if(obj.criteria === 'exit'){
					freqExitArray[obj.index] = obj.value
				}
			}
			if(relation === 0 && criteria === 'exit') freqExitArray = []
			if(relation === 1 && criteria === 'exit') freqExitArray = [exitPanel1, ...new Array(4).fill('')]
			if(relation === 1 && criteria === 'entry') freqEntryArray = [entryPanel1, ...new Array(4).fill('')]

			freqEntryArray = freqEntryArray.filter(item => (item !== null && item !== undefined && item !== ''))
			freqExitArray = freqExitArray.filter(item => (item !== null && item !== undefined && item !== ''))
			freqEntryArray = Array.from(new Set(freqEntryArray))
			freqExitArray = Array.from(new Set(freqExitArray))
			const customSort = (a, b) => {
					const indexA = sortOrder.indexOf(a);
					const indexB = sortOrder.indexOf(b);
					return indexA - indexB;
			}
			const findMaxFreq = (currentFreq, previousFreq) => {
				let selectedTimeframe = currentFreq
				let previousTimeframe = previousFreq
				if (selectedTimeframe !== '' && selectedTimeframe !== undefined && selectedTimeframe !== null) {
					if (selectedTimeframe !== previousTimeframe) {
						// 根据时间范围的大小进行比较，取周期较大的那个
						const timeframes = ["Daily", "Weekly", "Monthly"];
						const previousIndex = timeframes.indexOf(previousTimeframe);
						const currentIndex = timeframes.indexOf(selectedTimeframe);
						const largerIndex = Math.max(previousIndex, currentIndex);
						selectedTimeframe = timeframes[largerIndex];
	
						// 更新之前的时间范围为当前选择
						previousTimeframe = selectedTimeframe;
					}
				}
				return previousTimeframe
			}
			const sortOrder = ['Daily', 'Weekly', 'Monthly'];
			freqEntryArray = freqEntryArray.sort(customSort);
			freqExitArray = freqExitArray.sort(customSort);
			console.log('Entry 的数组', freqEntryArray)
			console.log('Exit 的数组', freqExitArray)
			const maxEntryFreq = freqEntryArray[freqEntryArray.length - 1]
			const maxExitFreq = freqExitArray[freqExitArray.length - 1]
			const maxFreq = findMaxFreq(maxEntryFreq, maxExitFreq)
			if(maxFreq === undefined || maxFreq === null || maxFreq === ''){
				state.exitFrequency = 'Daily'
				state.backtestInfo.frequency = 'Daily'
				console.log('最大的周期', state.exitFrequency)
				return
			}
			state.exitFrequency = maxFreq
			state.backtestInfo.frequency = maxFreq
			console.log('最大的周期', state.exitFrequency)
		},
		setFreqencyLP(state, obj) {
			const key = obj.key
			state.frequencyArray.set(key, obj)
		},
		getFreqHighPriority(state, val) {
			state.exitFrequency = val
			state.backtestInfo.frequency = val
		},
		/**
		 * Sets up a mutations to store the condition of selected technical indicator in form, it's used for gennerating output csv
		 */
		setConditionRadio(state,val){
		state.conditionRadio = val
		},
		/**
		 * these 3 mutations below are used to update status of Moving average in MA.vue
		 */
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
		/**
		 * Sets up a mutations to store the extremeValue of an indicator
		 */	
		getExtremeValue: (state, list) => {
			state.extremeValue = list
		},
		/**
		 * Sets up a mutations to store the list of all indicators which is loaded from getAllSymbolsList API in project initiation
		 */	
		getAllSymbolsList(state, list) {
			state.allSymbolsList = list
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
		getNewPorfolioInputsValues(state, row) {
			state.newPorfolioInputsValues.inputNameValue = row.name
			state.newPorfolioInputsValues.inputDescriptionValue = row.description
			state.newPorfolioInputsValues.inputOriginalAssetValue = row.original_asset
			state.openedPorfolioBacktests = row.backtests
		},
		getRunBacktestData(state, row) {
			state.favoriteBacktestRowData = row
		},
		getRunBacktestAllResult(state, list) {
			state.favoriteBacktestData = list
		},
		/**
		 * set a single indicator to the indicator list
		 */	
		getEntryIndicators(state, obj) {
			let {index,value} = obj
			state.indicators.formIndicators.entry[index] = value
		},
		/**
		 * store a list of entry indicators
		 */	
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
		/**
		 * no bug occurs, however, the logic inside is confusing
		 */	
		getExtraIndicators(state, val) {
			state.indicators.extraIndicators = val
		},
		getStrategyId(state, id) {
			state.strategyId = id
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
			state.backtestInfo[val.criteria].signals[val.index].usersOwnIndicator =
			state.backtestInfo[val.criteria].signals[val.index].symbolIndicator =
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
		},
		getSymValue(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index].symbolIndicator =
				obj.value
		},
		getRiskValue(state, obj) {
			state.backtestInfo.exit.signals[obj.index].riskIndicator = obj.value		
		},
		getSentiValue(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator =
				obj.value
		},
		getUserValue(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index].usersOwnIndicator =
			obj.value
		},
		delete(state, obj) {
			delete state.backtestInfo[obj.criteria].signals[obj.index][obj.delete]
		},
		clearSignal(state, obj) {
			state.backtestInfo[obj.criteria].signals[obj.index] = {}
			state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator =
				''
			state.backtestInfo[obj.criteria].signals[obj.index].symbolIndicator =
				''
			state.backtestInfo[obj.criteria].signals[obj.index].technicalIndicator =
				''
			state.backtestInfo[obj.criteria].signals[obj.index].usersOwnIndicator = ''
				state.backtestInfo.exit.signals[obj.index].riskIndicator =
				''
		},
		clearEntrySignalArr(state) {
			state.backtestInfo.entry.signals = [
				{
					sentimentIndicator: '',
					technicalIndicator: '',
					usersOwnIndicator: '',
					symbolIndicator: '',
				}
			]
		},
		clearExitSignalArr(state) {
			
			state.backtestInfo.exit.signals = [
				{
					sentimentIndicator: '',
					technicalIndicator: '',
					riskIndicator: '',
					usersOwnIndicator: '',
					symbolIndicator: '',
				}
			]
		},
		clearBacktest(state) {
			state.backtestInfo = {
				entry_description: [],
				exit_description: [],
				description: '',
				direction: 'Long',
				frequency: 'Daily',
				entry: {
					relation: 0,
					score: 1,
					signals_in_market: 1,
					delay_bars: 0,
					signals: [
						{
							sentimentIndicator: '',
							technicalIndicator: '',
							usersOwnIndicator: '',
							symbolIndicator: '',
						}
					]
				},
				exit: {
					relation: 0,
					score: 1,
					signals_in_market: 1,
					delay_bars: 0,
					signals: [{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '', symbolIndicator: '', usersOwnIndicator: '' }]
				}
			}
			state.usersOwnEntryFileHash = Array(5).fill('')
			state.usersOwnExitFileHash = Array(5).fill('')
			state.frequencyArray = new Map()
		},
		getSentimentList(state,list) {
			state.sentimentIndicatorList = list
		},
		saveCondition(state, obj) {
			let criteria = obj.criteria
			let index = obj.index
			delete obj.criteria
			delete obj.index
			let init = {sentimentIndicator: '', technicalIndicator: '', riskIndicator: '', symbolIndicator: '', usersOwnIndicator: ''}
			init.sentimentIndicator = state.backtestInfo[criteria].signals[index].sentimentIndicator
			init.technicalIndicator = state.backtestInfo[criteria].signals[index].technicalIndicator
			init.usersOwnIndicator = state.backtestInfo[criteria].signals[index].usersOwnIndicator
			init.symbolIndicator = state.backtestInfo[criteria].signals[index].symbolIndicator

			if(criteria === 'exit') {
				init.riskIndicator = state.backtestInfo.exit.signals[index].riskIndicator
			}
			if(criteria == 'exit') {
				state.backtestInfo.exit.signals[index] = Object.assign({}, init)
			}else if(criteria == 'entry') {
				init.riskIndicator = ''
				state.backtestInfo.entry.signals[index] = Object.assign({}, init)
			}
			for(let key in obj) {
				state.backtestInfo[criteria].signals[index][key] = obj[key]
			}
			
		},
		saveDescription(state, desObj) {
			if(Array.isArray(state.backtestInfo[desObj.criteria+'_description'])) {
				state.backtestInfo[desObj.criteria+'_description'][desObj.index] = desObj.description
			
			}
		},
		saveRiskDescription(state, desObj) {
			state.riskDescription = desObj.description
		},
		initialBacktestInfo(state) {
			state.backtestInfo = {
				entry_description: [],
				exit_description: [],
				description: '',
				direction: 'Long',
				frequency: 'Daily',
				entry: {
					relation: 0,
					score: 1,
					signals_in_market: 1,
					delay_bars: 0,
					signals: [
						{
							sentimentIndicator: '',
							technicalIndicator: '',
							usersOwnIndicator: '',
							symbolIndicator: ''
						}
					]
				},
				exit: {
					relation: 0,
					score: 1,
					signals_in_market: 1,
					delay_bars: 0,
					signals: [{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '', symbolIndicator: '', usersOwnIndicator: '' }]
				}
			}
			state.backtestInfo.entry =  {
				score: 1,
				relation: 0,
				signals_in_market: 1,
				delay_bars: 0,
				signals: [
					{
						sentimentIndicator: '',
						technicalIndicator: '',
						usersOwnIndicator: '',
						symbolIndicator: ''
					}
				]
			}
			state.backtestInfo.exit =  {
				relation: 0,
				score: 1,
				signals_in_market: 1,
				delay_bars: 0,
				signals: [{ sentimentIndicator: '', technicalIndicator: '', riskIndicator: '', symbolIndicator: '', usersOwnIndicator: '' }]
			}
			state.backtestInfo.entry_description = []
			state.backtestInfo.exit_description = []
			state.frequencyArray = new Map()
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
				technicalIndicator: '',
				symbolIndicator: '',
				usersOwnIndicator: ''
			}
			let newExitSignal = { sentimentIndicator: '', technicalIndicator: '', riskIndicator: '', symbolIndicator: '', usersOwnIndicator: '' }

			if(obj.criteria === 'entry') {
				state.backtestInfo[obj.criteria].signals[obj.index] = newEntrySignal
			}
			if(obj.criteria === 'exit') {
					state.backtestInfo[obj.criteria].signals[obj.index] = newExitSignal
			}
		},
		reduceSignalLength(state, obj) {
			state.backtestInfo[obj.criteria].signals.splice(obj.index, 1)
		},
		saveScoreValue(state, obj) {
			state.backtestInfo[obj.criteria].score = Number(obj.value)
		},
		saveSignalsInMarket(state, obj) {
			state.backtestInfo[obj.criteria].signals_in_market = Number(obj.value)
		},
		saveDelayBar(state,obj) {
			state.backtestInfo[obj.criteria].delay_bars = Number(obj.value)
		},
		saveRelation(state,obj) {
			state.backtestInfo[obj.criteria].relation = Number(obj.value)
		},
		isRiskControl(state, val) {
			state.riskControl = val
		},
		setUserRole(state, val){
			state.is_admin = val.is_admin
			state.role = val.role
		},
		saveUsersOwnEntryFileHash(state, obj) {
			//console.log('saveUsersOwnEntryFileHash',obj)
			state.usersOwnEntryFileHash[obj.index] = obj.val
		},
		saveUsersOwnExitFileHash(state, obj) {
			state.usersOwnExitFileHash[obj.index] = obj.val
		},
		saveUserUploadFileContent(state, obj) {
			console.log('文件上传成功', obj)
			state.userUploadFileContent[obj.index] = obj.val
		},
		setHashTable(state, obj) {
				const value = {
					uuid: obj.id,
					csv: obj.csv,
					entry: obj.entry,
					exit: obj.exit
				}
				state.hashTable.push(value)
				console.log('setHashTable', state.hashTable)

		},
		clearHashTable(state) {
			state.hashTable = []
		},
	// TODO 整理是归类到state
		// 重置vuex本地储存状态
		// RESET_STORE: (state)=>{
		// 	Object.keys(state).forEach(key => {
		// 		state[key] = JSON.parse(JSON.stringify(window.SITE_CONFIG['storeState'][key]))
		// 	})
		// 	state.backtestSymbol = 'SPX'
		// 	console.log('RESET_STORE',state)
	  	// },
		RESET_CHART_CONDIG_STATE: (state)=>{
			// 清空chartiq图表配置
			state.pairDataFreq = 'daily'
			state.backtestSymbol = 'SPX'
			state.exitFrequency = 'Daily'
	  	},
		RESET_CHART_STUDY_STATE: (state)=> {
			// 清空表单indicator列表信息
			state.indicators =  {
				formIndicators: {
					entry: new Array(5),
					exit: new Array(5)
				},
				extraIndicators: [],
				technicalIndicators: []
			},
			state.activatedMA = [{ period: 21, url: '' }]
			state.activatedMALayout = []
		},
		SET_SCANNERAI_FILTER_STATE(state,obj) {
			state.scannerai_filter = obj
		},
		SET_SCANNERAI_FLAG(state,val) {
			state.scannerai_flag = val
		},
		SET_ISBACKTESTRUNNING_FLAG(state,val) {
			state.isBacktestRunning_flag = val
		},
	},
	actions: {
		set_scannerai_filter_state({commit}, obj){
			return new Promise(resolve=>{
			  commit('SET_SCANNERAI_FILTER_STATE',obj)
			  resolve();
			})
		},
		Try(context, val) {
			context.commit('setEntryData', val)
		},
		set_cur_date({commit}, val){
			return new Promise(resolve=>{
			  commit('SET_CUR_DATE',val)
			  resolve();
			})
		},
		store_backtestResult({commit}, val){
			return new Promise(resolve=>{
			  commit('STORE_BACKTESTRESULT',val)
			  resolve();
			})
		},
		reset_chart_config_state({commit}){
			return new Promise(resolve=>{
				// 清空chartiq图表配置
				commit('RESET_CHART_CONDIG_STATE')
				resolve();
			})
		},
		reset_chart_study_state({commit}){
			return new Promise(resolve=>{
				// 清空chartiq indicator内容
				for (var id in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[id];
					if (!sd.customLegend && !sd.permanent) CIQ.Studies.removeStudy(CIQ.stxx, sd);
				}
				CIQ.stxx.draw();
				CIQ.setPanelHeight([])

				commit('RESET_CHART_STUDY_STATE')
				resolve();
			})
		},
		set_scannerai_flag({commit},val){
			return new Promise(resolve=>{
				// 清空chartiq图表配置
				commit('SET_SCANNERAI_FLAG',val)
				resolve();
			})
		},
		set_isBacktestRunning_flag({commit},val){
			return new Promise(resolve=>{
				// 清空chartiq图表配置
				commit('SET_ISBACKTESTRUNNING_FLAG',val)
				resolve();
			})
		},
	}

})
