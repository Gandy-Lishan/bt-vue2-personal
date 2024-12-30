import { timestampToTime, capitalizeFirstLetter } from '@/utils'

const state = {
	restoreFreq: '', //form
	backtestSymbol: process.env.VUE_APP_DEFAULT_SYMBOL, //form
	pairDataFreq: '', //form
	exitFrequency: '', //form 考虑放到timeframe组件

	conditionRadio: {
		//form
		entry: new Array(5).fill(''),
		exit: new Array(5).fill(''),
		entry2: new Array(5).fill(''),
		exit2: new Array(5).fill(''),
	},
	maRadio: '', //form
	stMaPeriod: '', //form
	maPeriod: '', //form
	newPorfolioInputsValues: {
		//form
		inputNameValue: '',
		inputDescriptionValue: '',
		inputOriginalAssetValue: ''
	},
	backtestInfo: {
		//form
		entry_description: [],
		entry2_description: [],
		exit_description: [],
		exit2_description: [],
		description: '',
		direction: 'Long',
		frequency: 'Daily',
		backtest_period: '21',
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
		entry2: {
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
			signals: [
				{
					sentimentIndicator: '',
					technicalIndicator: '',
					riskIndicator: '',
					symbolIndicator: '',
					usersOwnIndicator: ''
				}
			]
		},
		exit2: {
			relation: 0,
			score: 1,
			signals_in_market: 1,
			delay_bars: 0,
			signals: [
				{
					sentimentIndicator: '',
					technicalIndicator: '',
					riskIndicator: '',
					symbolIndicator: '',
					usersOwnIndicator: ''
				}
			]
		},
		user_tag: 'client'
	},
	riskDescription: '', //form
	openedPorfolioBacktests: [], //form
	favoriteBacktestRowData: { id: 0 }, //form
	favoriteBacktestData: [], //form
	strategyId: '', //form
	saveConditionFormdata: {}, //form

	tabIndex: 0, //form
	riskControl: true, //form
	usersOwnEntryFileHash: Array(5).fill(''), //form
	usersOwnExitFileHash: Array(5).fill(''), //form
	usersOwnEntry2FileHash: Array(5).fill(''), //form
	usersOwnExit2FileHash: Array(5).fill(''), //form
	userUploadFileContent: Array(5).fill({}), //form
	backtestResult: [], //form
	tradePrice: 2, //form
	last_signal_array: [], //form
	run_all_backtest_array: [], //form
	hashTable: [], //form
	frequencyArray: new Map(), //form
	rowDataForDisplay: {}, // 用于保存BT运行结束后的数据,不包含 entry 和 exit
	cachedBTBasicInfoData: {}, // 用于缓存BT基本信息
	cachedScopedRowDataImmutable: {}, // 缓存 result 展示数据
	isListLoading: false, // 控制 list 的loading 状态
	setUpLoadingSetting: {
		// 控制 setup 的loading 状态
		isSetupLoading: false,
		showProgress: false,
		percentage: 0,
		progressText: 'Loading...'
	},
	resultsLoadingSetting: {
		// 控制 setup 的loading 状态
		isResultsLoading: false,
		showProgress: false,
		percentage: 0,
		progressText: 'Loading...'
	}, // 控制 results 的 loading 状态
	backtestZScoreResult: [],
	comparisonSymbol: {},
	mySignalTimeframe: 'Daily'
}

const mutations = {
	/**
	 * set a backtest symbol2 as comparison
	 */
	setComparisonSymbol(state, val) {
		state.comparisonSymbol = val
		state.rowDataForDisplay.symbol2 = val.url
		state.cachedBTBasicInfoData.symbol2 = val.url
	},

	/**
	 * Sets up a mutations to restore the timeframe of selected backtest
	 */

	setRestoreFreq(state, val) {
		state.restoreFreq = val
	},
	/**
	 * Sets up a mutations to restore the symbol of selected backtest
	 */

	getBacktestSymbol(state, val) {
		state.backtestSymbol = val
		// 改变表单的 frequency
		state.rowDataForDisplay.symbol = val
		state.cachedBTBasicInfoData.symbol = val
	},

	RESET_CHART_CONDIG_STATE: state => {
		// 还原默认timeframe和symbol配置
		state.pairDataFreq = ''
		state.backtestSymbol = process.env.VUE_APP_DEFAULT_SYMBOL
		state.exitFrequency = ''
		state.comparisonSymbol = {}
	},

	CLEAR_CHART_CONDIG_STATE: state => {
		// CLEAR CHART
		state.pairDataFreq = ''
		state.backtestSymbol = process.env.VUE_APP_DEFAULT_SYMBOL
		state.exitFrequency = ''
	},
	/**
	 * no bug occurs, however, the logic inside is confusing
	 */

	setFreqency(state, val) {
		state.rowDataForDisplay.frequency = capitalizeFirstLetter(val)
		state.cachedBTBasicInfoData.frequency = capitalizeFirstLetter(val)
		state.pairDataFreq = val
	},
	/**
	 * Sets up a mutations to store the condition of selected technical indicator in form, it's used for gennerating output csv
	 */
	setConditionRadio(state, val) {
		state.conditionRadio = val
	},
	/**
	 * these 3 mutations below are used to update status of Moving average in MA.vue
	 */
	getStMaPeriod(state, val) {
		state.stMaPeriod = val
	},
	getFrequency(state, val) {
		if (val === undefined || val === null || val === '') {
			state.exitFrequency = ''
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
		if (relation === 1 && criteria.startsWith('entry')) {
			entryPanel1 = state.frequencyArray.get(obj.key).value
		}
		if (relation === 1 && criteria.startsWith('exit')) {
			exitPanel1 = state.frequencyArray.get(obj.key).value
		}
		state.frequencyArray.set(key, obj)
		let freqEntryArray = new Array(10).fill('')
		let freqExitArray = new Array(10).fill('')
		for (let obj of state.frequencyArray.values()) {
			if (obj.criteria.startsWith('entry')) {
				freqEntryArray.push(obj.value)
			}
			if (obj.criteria.startsWith('exit')) {
				freqExitArray.push(obj.value)
			}
		}
		if (relation === 0 && criteria.startsWith('exit')) freqExitArray = []
		if (relation === 1 && criteria.startsWith('exit'))
			freqExitArray = [exitPanel1, ...new Array(9).fill('')]
		if (relation === 1 && criteria.startsWith('entry'))
			freqEntryArray = [entryPanel1, ...new Array(9).fill('')]

		freqEntryArray = freqEntryArray.filter(
			item => item !== null && item !== undefined && item !== ''
		)
		freqExitArray = freqExitArray.filter(
			item => item !== null && item !== undefined && item !== ''
		)
		freqEntryArray = Array.from(new Set(freqEntryArray))
		freqExitArray = Array.from(new Set(freqExitArray))
		const customSort = (a, b) => {
			const indexA = sortOrder.indexOf(a)
			const indexB = sortOrder.indexOf(b)
			return indexA - indexB
		}
		const sortOrder = ['Daily', 'Weekly', 'Monthly']
		freqEntryArray = freqEntryArray.sort(customSort)
		freqExitArray = freqExitArray.sort(customSort)
		console.log('Entry 的数组', freqEntryArray)

		const priority = { 'Daily': 1, 'Weekly': 2, 'Monthly': 3 };
		const getMaxTimeframe = (arr) => {
				// 过滤掉无效项并排序
				const validTimeframes = arr.filter(item => priority[item]).sort((a, b) => priority[b] - priority[a]);
				return validTimeframes.length > 0 ? validTimeframes[0] : null; // 返回最大周期
		};
		state.mySignalTimeframe = getMaxTimeframe(freqEntryArray)

		console.log('Exit 的数组', freqExitArray)
		const maxEntryFreq = freqEntryArray[freqEntryArray.length - 1] || 'Daily'
		const maxExitFreq = freqExitArray[freqExitArray.length - 1] || 'Daily'
		const maxFreqArr = [maxEntryFreq, maxExitFreq].sort(customSort)
		const maxFreq = maxFreqArr[maxFreqArr.length - 1] || 'Daily'
		if (maxFreq === undefined || maxFreq === null || maxFreq === '') {
			state.exitFrequency = ''
			state.backtestInfo.frequency = 'Daily'
			console.log('最大的周期', state.exitFrequency)
			return
		}
		console.log('面板的最大的周期', maxFreq)
		const _maxFreqIndex = sortOrder.findIndex(ele => ele === maxFreq)
		const _currentMaxFreqIndex = sortOrder.findIndex(ele => ele === state.backtestInfo.frequency)
		if(_maxFreqIndex !== -1 && _currentMaxFreqIndex !== -1) {
			if(_maxFreqIndex > _currentMaxFreqIndex) {
				state.exitFrequency = maxFreq
				state.backtestInfo.frequency = maxFreq
			}
		}else {
			state.exitFrequency = maxFreq
			state.backtestInfo.frequency = maxFreq
		}
		console.log('最后的最大的周期', state.exitFrequency)
	},
	getFreqHighPriority(state, val) {
		state.exitFrequency = val
		state.backtestInfo.frequency = val
	},
	getDirection(state, val) {
		state.backtestInfo.direction = val
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
	setBd(state, obj) {
		for (let key in obj) {
			if (obj) {
				state.backtestInfo[key] = obj[key]
			}
		}
	},
	deleteIndicator(state, val) {
		try {
			state.backtestInfo[val.criteria].signals[val.index].sentimentIndicator = ''
			state.backtestInfo[val.criteria].signals[val.index].technicalIndicator = ''
			state.backtestInfo[val.criteria].signals[val.index].usersOwnIndicator = state.backtestInfo[val.criteria].signals[val.index].symbolIndicator = ''
			state.backtestInfo.exit.signals[val.index].riskIndicator = ''
		} catch (error) {
			console.log(error)
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
	getSentiValue(state, obj) {
		state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator =
			obj.value
	},
	getUserValue(state, obj) {
		state.backtestInfo[obj.criteria].signals[obj.index].usersOwnIndicator =
			obj.value
	},
	saveCondition(state, obj) {
		let criteria = obj.criteria
		let index = obj.index
		delete obj.criteria
		delete obj.index
		let init = {
			sentimentIndicator: '',
			technicalIndicator: '',
			riskIndicator: '',
			symbolIndicator: '',
			usersOwnIndicator: ''
		}
		init.sentimentIndicator =
			state.backtestInfo[criteria].signals[index].sentimentIndicator
		init.technicalIndicator =
			state.backtestInfo[criteria].signals[index].technicalIndicator
		init.usersOwnIndicator =
			state.backtestInfo[criteria].signals[index].usersOwnIndicator
		init.symbolIndicator =
			state.backtestInfo[criteria].signals[index].symbolIndicator

		if (criteria.startsWith('exit')) {
			init.riskIndicator = state.backtestInfo[criteria].signals[index].riskIndicator
		}
		if (criteria.startsWith('exit')) {
			state.backtestInfo[criteria].signals[index] = Object.assign({}, init)
		} else if (criteria.startsWith('entry')) {
			init.riskIndicator = ''
			state.backtestInfo[criteria].signals[index] = Object.assign({}, init)
		}
		for (let key in obj) {
			state.backtestInfo[criteria].signals[index][key] = obj[key]
		}
	},
	saveDescription(state, desObj) {
		if (Array.isArray(state.backtestInfo[desObj.criteria + '_description'])) {
			state.backtestInfo[desObj.criteria + '_description'][desObj.index] =
				desObj.description
		}
	},
	initialBacktestInfo(state) {
		state.backtestInfo = {
			entry_description: [],
			entry2_description: [],
			exit_description: [],
			exit2_description: [],
			description: '',
			direction: 'Long',
			frequency: 'Daily',
			backtest_period: '21',
			entry: {
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
			},
			entry2: {
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
			},
			exit: {
				relation: 0,
				score: 1,
				signals_in_market: 1,
				delay_bars: 0,
				signals: [
					{
						sentimentIndicator: '',
						technicalIndicator: '',
						riskIndicator: '',
						symbolIndicator: '',
						usersOwnIndicator: ''
					}
				]
			},
			exit2: {
				relation: 0,
				score: 1,
				signals_in_market: 1,
				delay_bars: 0,
				signals: [
					{
						sentimentIndicator: '',
						technicalIndicator: '',
						riskIndicator: '',
						symbolIndicator: '',
						usersOwnIndicator: ''
					}
				]
			},
				user_tag: 'client'
		}
		state.frequencyArray = new Map()
	},
	clearBacktestUuid(state) {
		if (state.backtestInfo.old_uuid) {
			delete state.backtestInfo.old_uuid
		}
	},
	addSignalLength(state, obj) {
    const newSignal = {
        [obj.criteria]: {
            sentimentIndicator: '',
            technicalIndicator: '',
            symbolIndicator: '',
            usersOwnIndicator: ''
        }
    };

    if (obj.criteria.startsWith('exit')) {
        newSignal[obj.criteria].riskIndicator = ''; // 添加 riskIndicator 到 exit 类型
    }

    state.backtestInfo[obj.criteria].signals[obj.index] = newSignal[obj.criteria];
	},
	saveScoreValue(state, obj) {
		state.backtestInfo[obj.criteria].score = Number(obj.value)
	},
	saveSignalsInMarket(state, obj) {
		state.backtestInfo[obj.criteria].signals_in_market = Number(obj.value)
	},
	saveDelayBar(state, obj) {
		state.backtestInfo[obj.criteria].delay_bars = Number(obj.value)
	},
	saveRelation(state, obj) {
		state.backtestInfo[obj.criteria].relation = Number(obj.value)
	},
	saveRiskDescription(state, desObj) {
		state.riskDescription = desObj.description
	},

	getRunBacktestData(state, row) {
		state.favoriteBacktestRowData = row
	},
	isRiskControl(state, val) {
		state.riskControl = val
	},
	saveUsersOwnFileHash(state, obj) {
		let {index, val, criteriaCF} = obj
		state[`usersOwn${criteriaCF}FileHash`][index] = val
	},
	STORE_BACKTESTRESULT: (state, val) => {
		state.backtestResult = val
	},
	SET_TRADE_PRICE: (state, val) => {
		state.tradePrice = val
	},
	SET_LASTSIGNAL_ARRAY: (state, val) => {
		state.last_signal_array = val
	},
	SET_RUNALL_BACKTEST_ARRAY: (state, val) => {
		state.run_all_backtest_array = val
	},
	setHashTable(state, obj) {
		state.hashTable.push(obj)
	},
	clearHashTable(state) {
		state.hashTable = []
	},
	clearSignalArr(state, obj) {
		const {criteria} = obj
		const clearSignal = {
			sentimentIndicator: '',
			technicalIndicator: '',
			symbolIndicator: '',
			usersOwnIndicator: ''
		}

	if (criteria.startsWith('exit')) {
		clearSignal.riskIndicator = ''; // 添加 riskIndicator 到 exit 类型
	}
	state.backtestInfo[criteria].signals = [clearSignal]
	},
	setFreqencyLP(state, obj) {
		const key = obj.key
		state.frequencyArray.set(key, obj)
	},
	RESULT_DATA_FOR_SETUP_DISPLAY(state, obj) {
		console.log('缓存了 row 数据', obj)
		state.rowDataForDisplay = obj
		// 这是edit view之后保存的数据
		state.backtestInfo.old_uuid = obj.id
		state.backtestInfo.user_tag = obj.user_tag
	},
	CACHED_SCOPED_ROW_IMMUTABLE(state, obj) {
		state.cachedScopedRowDataImmutable = obj
	},
	SET_CACHED_SCOPED_ROW_IMMUTABLE_PROPS(state, obj) {
		const {key, value} = obj
		state.cachedScopedRowDataImmutable[key] = value
	},
	CACHED_BT_BASIC_INFO_DATA(state, obj) {
		state.cachedBTBasicInfoData = obj
		// 这是轮询之后保存的数据
		state.backtestInfo.old_uuid = obj.id
		state.backtestInfo.user_tag = obj.user_tag
	},
	SET_LIST_LOADING(state, loading) {
		state.isListLoading = loading
	},
	SET_SETUP_LOADING(state, obj) {
		const { isSetupLoading, percentage, progressText, showProgress } = obj
		state.setUpLoadingSetting = {
			isSetupLoading,
			showProgress,
			percentage,
			progressText
		}
	},
	SET_RESULTS_LOADING(state, obj) {
		const { isResultsLoading, percentage, progressText, showProgress } = obj
		state.resultsLoadingSetting = {
			isResultsLoading,
			showProgress,
			percentage,
			progressText
		}
	},
	STORE_BACKTEST_ZSCORE_RESULT: (state, val) => {
		state.backtestZScoreResult = val
	}
}

const actions = {
	reset_chart_config_state({ commit }) {
		return new Promise(resolve => {
			// 清空chartiq图表配置
			commit('RESET_CHART_CONDIG_STATE')
			resolve()
		})
	},
	clear_chart_config_state({ commit }) {
		return new Promise(resolve => {
			// 清空chartiq图表配置
			commit('CLEAR_CHART_CONDIG_STATE')
			resolve()
		})
	},
	cached_BT_basic_info_data({ commit }, val) {
		return new Promise(resolve => {
			commit('CACHED_BT_BASIC_INFO_DATA', val)
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
