import { CIQ } from '@/components/common/chart/st-development/js'
import {
    getAllMySymbolsList,getSymbolCsv,
    getBTV1FavIndicator,getAllMyIndicatorsList,
    getForecastList,
    getStocksList,
    getIndexsList,
    getIndicatorsList,
    getSymbollistForecast,
	getFavorite,updateFavorite,
	obtainIndicatorsList,
	obtainBTV1IndicatorsList
} from '@/service/service.js'
import {Toast, capitalizeFirstLetter, isJson, unifyNumber, timestampToTime } from '@/utils'
import { uniqueObjectArray } from '@/utils/formValidate'

const toggleOverlaySymbol = function(displayStyle) {
	var filters = document.querySelectorAll("cq-lookup-filters");
	
	filters.forEach(function(filter) {
	  var overlay = filter.querySelector(".overlay");
	  if (overlay) {
		overlay.style.display = displayStyle;
	  }
	});
  }
const toggleOverlayIndicator = function(displayStyle) {
	var filters = document.querySelectorAll("cq-indicators-lookup-filters");
	
	filters.forEach(function(filter) {
	  var overlay = filter.querySelector(".overlay");
	  if (overlay) {
		overlay.style.display = displayStyle;
	  }
	});
  }
const state = {
	curDate: '', //ai
	studySettingMA: { period: '', criteria: '', panelIndex: '' }, //chartiq
	studySettingROC: { period: '', criteria: '', panelIndex: '' }, 
	favoriteIndicatorList: [], //chartiq
	favoriteSymbolList: [], //chartiq
	techSD: [], //chartiq
	savedTechSD: [], //chartiq
	currentSenti: {
		//chartiq
		url: '',
		name: ''
	},
	indicators: {
		//chartiq
		formIndicators: {
			entry: new Array(5),
			exit: new Array(5),
			entry2: new Array(5),
			exit2: new Array(5),
		},
		extraIndicators: [],
	},
	extremeValue: [], //chartiq
	indicatorsList: [], //chartiq 代替了AllSymbolsList
	builtinList: [], //chartiq 包含完整techList
	maLikeTech: [
		'ma',
		// 'Awesome',
		// 'cci'
	],
	trades: [], //chartiq
	activatedMA: [{ period: 21, url: '' }], //chartiq
	activatedMALayout: [], //chartiq
	activatedTechLayout: [], // dual symbol new feature
	// indicators look up
	stocksList: [], //chartiq
	indexsList: [], //chartiq
	formateTechnicalList: [], //chartiq 和builtinList不同，这个是只给表单提供的techList
	spanPeriod: {},
	isBTChartReady: false,
	chartLoadingSetting: {
		// 控制 setup 的loading 状态
		isChartLoading: false,
		showProgress: false,
		percentage: 0,
		progressText: 'Loading...'
	},
	// rocLikeCount: 0,
	// studiesCount: 0,

	// 以下管理user's own indicator chartiq 状态
	/*********** START */
	miFormCategories: 'Indicator Spread',
	miFormCategoriesIndicator1:{name:'',url:''},
	miFormCategoriesIndicator2:{name:'',url:''},

	miFormWeightedList: [],
	miBenmark: process.env.VUE_APP_DEFAULT_SYMBOL,
	/******* END */

	ma_color_1: ["#FF0000"],
    ma_color_2: ["#f59e0b"],

	//用戶自定義symbolList, 緩存在vuex
	mySymbolList: [],
	mySymbolQuotefeedCache: [],
	myIndicatorList: [],
	favoriteIndicatorListBtv1: null,

	//chart_type
	chartType: 'line',

	//forecast
	forecastList: [],
	forecastAuthorList: [],
  	symbollistForecast: [],
	forecastMarket: 'SPY', //暂时用来单独存report forecast的symbol,因为他很特殊,可能是大小写不同甚至为url或者name
	// 何总写的提供给cpm,myindicator,seasonality的修改后的senti&symbol list
	refactoredSentimentList: [],
	refactoredSymbolList: [],
	indicatorsPageListdata: {},
	cssMonthLabel: '',
	indicatorPageBtv1List: null
}

const mutations = {
	SET_FORECAST_MARKET(state, val){
			state.forecastMarket = val
	},
	SET_FORECAST(state, list){
		state.forecastList = list
	},
	SET_FORECAST_AUTHOR_LIST(state, list){
		state.forecastAuthorList = list
	},
	SET_SYMBOLLIST_FORECAST(state, list){
		state.symbollistForecast = list
	},
  	SET_REFACTORED_SENTIMENTLIST(state, list){
		state.refactoredSentimentList = list
	},
	SET_REFACTORED_SYMBOLLIST(state, list){
		state.refactoredSymbolList = list
	},


	SET_CHART_TYPE(state, val){
		state.chartType = val
	},


	SET_MYSYMBOL_QUOTEFEED_CACHE(state,list){
		state.mySymbolQuotefeedCache = list
	},
	SET_MYSYMBOLLIST(state,list){
		state.mySymbolList = list
	},
	SET_MYINDICATORLIST(state,list){
		state.myIndicatorList = list
	},
	SET_FAVORITE_INDICATOR_LIST_BTV1(state,obj){
		state.favoriteIndicatorListBtv1 = obj
	},
	SET_INDICATOR_PAGE_BTV1_LIST(state, res) {
		state.indicatorPageBtv1List = res?.data?.data || res?.data || []
	},
	/**
	 * 更新user's own indicator Weighted列表状态
	 */
	miFormWeightedListChange(state, val) {
		state.miFormWeightedList = val
	},
	/**
	 * 更新user's own indicator chartiq 状态
	 */
	miFormStateChange(state, obj) {
		state.miFormCategories = obj.categories
		state.miFormCategoriesIndicator1 = {name:obj.indicator_1,url:obj.indicator_1_url}
		state.miFormCategoriesIndicator2 = {name:obj.indicator_2,url:obj.indicator_2_url}
	},
	SET_CUR_DATE: (state, val) => {
		state.curDate = val
	},
	/**
	 * Sets up a mutations to store MA period when editting MA study to make sure the MA period is the same in chart and form
	 */
	studySettingMAChange(state, obj) {
		state.studySettingMA = obj
	},
	studySettingROCChange(state, obj) {
		state.studySettingROC = obj
	},
	/**
	 * Sets up a mutations to store favoriteIndicatorList that is originally read from API
	 */
	SET_FAVORITE_INDICATOR_LIST(state, val) {
		state.favoriteIndicatorList = val
	},
	/**
	 * Sets up a mutations to store favoriteSymbolList that is originally read from API
	 */
	SET_FAVORITE_SYMBOL_LIST(state, val) {
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
	 * Sets up a mutations to store the extremeValue of an indicator
	 */

	getExtremeValue: (state, list) => {
		state.extremeValue = list
	},


	/**
	 * Sets up a mutations to store the StocksList, it's usually called when the project is initiated
	 */
	SET_STOCKLIST(state, list) {
		state.stocksList = list
	},
	/**
	 * Sets up a mutations to store the IndexsList, it's usually called when the project is initiated
	 */
	SET_INDEXLIST(state, list) {
		state.indexsList = list
	},
	/**
	 * Sets up a mutations to store the IndicatorsList, it's usually called when the project is initiated
	 */
	SET_INDICATORSLIST(state, data) {
		state.indicatorsList = data
	},
	/**
	 * Sets up a mutations to store the technical indicators
	 */
	SET_TECH_CATEGORY(state, data) {
		state.technicalCategory = data
	},
	SET_BUILTIN_LIST(state, data) {
		state.builtinList = data
	},
	SET_FORMAT_TECH_LIST(state, list) {
		state.formateTechnicalList = list
	},


	getIndicators(state, obj) {
		let {index, value, criteria} = obj
		state.indicators.formIndicators[criteria][index] = value
	},
	/**
	 * store a list of entry indicators
	 */
	getCriteriaIndicatorsList(state, obj) {
		let {criteria, list} = obj
		state.indicators.formIndicators[criteria] = list
	},
	/**
	 * no bug occurs, however, the logic inside is confusing
	 */
	getExtraIndicators(state, val) {
		state.indicators.extraIndicators = val
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
	getTechLayout(state, val) {
		state.activatedTechLayout = val
	},

	RESET_CHART_STUDY_STATE: state => {
		// 清空chartiq indicator study信息
		;(state.indicators = {
			formIndicators: {
				entry: new Array(5),
				exit: new Array(5),
				entry2: new Array(5),
				exit2: new Array(5),
			},
			extraIndicators: [],
		}),
			(state.activatedMA = [{ period: 21, url: '' }])
		state.activatedMALayout = [],
		state.activatedTechLayout = [],
		state.extremeValue = []

		//重置交易结果列表
		state.trades = []
	},
	SET_SPAN_PERIOD: (state, val) => {
		state.spanPeriod = val
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
	SEI_MI_BENCHMARK(state, val) {
		state.miBenmark = val
	},
	SET_INDICATORS_PAGE_LIST_DATA(state, { url, data }) {
		if(!url) return
		state.indicatorsPageListdata[url] = !data ? null : JSON.stringify(data)
	}
}

const actions = {
/** Begin manage fav indicator & symbol list */
	get_favorite({ commit }) {
		return new Promise(async (resolve,reject) => {
			try{
				const res = await getFavorite()
				if (res.status === 200 || res.status === 201) {
					let favoriteSymbolList = [];
					let favoriteIndicatorList = [];
					try {
						favoriteSymbolList = res.data.favorite_symbol ? JSON.parse(res.data.favorite_symbol) : [];
						favoriteIndicatorList = res.data.favorite_indicator ? JSON.parse(res.data.favorite_indicator) : [];
					} catch (e) {
						console.error("Error parsing favorite data:", e);
					}
					commit('SET_FAVORITE_INDICATOR_LIST', favoriteIndicatorList)
					commit('SET_FAVORITE_SYMBOL_LIST', favoriteSymbolList)
					resolve()
				}else {
					// 处理其他状态码
					console.error(`Unexpected status code: ${res.status}`);
					reject(new Error(`Unexpected error, status code: ${res.status}`));
				}
			}catch(err){
				reject(err)
			}
		})
	},
	update_favorite({ commit },obj) {
		return new Promise(async (resolve,reject) => {
			commit('SET_FAVORITE_INDICATOR_LIST', JSON.parse(obj.indicator))
			commit('SET_FAVORITE_SYMBOL_LIST', JSON.parse(obj.symbol))
			try{
				const res = await updateFavorite(obj.indicator,obj.symbol)
				if (res.status === 200 || res.status === 201) {	
					resolve()
				}else {
					// 处理其他状态码
					console.error(`Unexpected status code: ${res.status}`);
					reject(new Error(`Unexpected error, status code: ${res.status}`));
				}
			}catch(err){
				reject(err)
			}
		})
	},
	update_indicators_favorite({ commit },obj) {
		return new Promise(async (resolve,reject) => {
			commit('SET_FAVORITE_INDICATOR_LIST', JSON.parse(obj.indicator))
			commit('SET_FAVORITE_SYMBOL_LIST', JSON.parse(obj.symbol))
			try{
				const res = await updateFavorite(obj.indicator,obj.symbol)
				if (res.status === 200 || res.status === 201) {	
					resolve()
				}else {
					// 处理其他状态码
					console.error(`Unexpected status code: ${res.status}`);
					reject(new Error(`Unexpected error, status code: ${res.status}`));
				}
			}catch(err){
				reject(err)
			}
		})
	},
/** End manage fav indicator & symbol list */


/** Begin fetch resources */
	fetch_stocklist({ commit }) {
		return new Promise(async (resolve,reject) => {
			const list = state.stocksList
			if(list.length == 0){
				try{
					const res = await getStocksList()
					if (res.status === 200 || res.status === 201) {
						commit('SET_STOCKLIST', res.data)
						resolve(res.data)
					}else {
						// 处理其他状态码
						console.error(`Unexpected status code: ${res.status}`);
						reject(new Error(`Unexpected error, status code: ${res.status}`));
					}
				}catch(err){
					reject(err)
				}
			}else{
				resolve(list)
			}
		})
	},
	fetch_indexlist({ commit }) {
		return new Promise(async (resolve,reject) => {
			const list = state.indexsList
			if(list.length == 0){
				try{
					const res = await getIndexsList()
					if (res.status === 200 || res.status === 201) {
						commit('SET_INDEXLIST', res.data)
						resolve(res.data)
					}else {
						// 处理其他状态码
						console.error(`Unexpected status code: ${res.status}`);
						reject(new Error(`Unexpected error, status code: ${res.status}`));
					}
				}catch(err){
					reject(err)
				}
			}else{
				resolve(list)
			}
		})
	},
	fetch_indicatorsList({ commit }) {
		return new Promise(async (resolve,reject) => {
			const list = state.indicatorsList
			if(list.length == 0){
				try{
					const res = await getIndicatorsList()
					if (res.status === 200 || res.status === 201) {
						let allSymbolsList = uniqueObjectArray(res.data)
						let newAllSymbolsList = []
						for (var i = 0; i < allSymbolsList.length; i++) {	// indicatorlist
							let item = allSymbolsList[i]
							if (state.stocksList.find(j => j.stock == item.url)) {
								let newName = item.url + ' Optix'
								newAllSymbolsList.push({
									chart_name: newName,
									url: item.url + '@indicator',
									updated: item.updated
								})
							} else {
								newAllSymbolsList.push(allSymbolsList[i])
							}
						}
						commit('SET_INDICATORSLIST', newAllSymbolsList)
						resolve(newAllSymbolsList)
					}else {
						// 处理其他状态码
						console.error(`Unexpected status code: ${res.status}`);
						reject(new Error(`Unexpected error, status code: ${res.status}`));
					}
				}catch(err){
					reject(err)
				}
			}else{
				resolve(list)
			}
		})
	},
	initiate_tech_list({ commit }, list){
		return new Promise(async (resolve,reject) => {
			let buildinTechList = []
			for (let i = 0; i < list.length; i++) {
				list[i].studies.forEach((item) => {
					buildinTechList.push({
						class:list[i].class,
						value:item.name,
						url:item.url
					})
				})
			}
			let formatList = buildinTechList.filter(item=>
				item.class !== 'No_display_technical_indicator' &&
				item.class !== 'Not_in_backtest_technical_indicator_but_visible_in_chatiq'
			).sort(function (a, b) {
				return a.value.localeCompare(b.value)
			})
			commit('SET_TECH_CATEGORY', list)
			commit('SET_BUILTIN_LIST',buildinTechList);
			commit('SET_FORMAT_TECH_LIST', formatList)
			resolve()
		})
	},
/** End fetch resources */


/** Begin Report page*/
	get_forecast({ commit }, symbol) {
		return new Promise(async (resolve,reject) => {
			const result = state.forecastList.find(item=>item.symbol==symbol)
			if(!result){
				try{
					const res = await getForecastList(CIQ.store.getters.getForecastMarket)
					if (res.status === 200 || res.status === 201) {
						const list = res.data
						commit('SET_FORECAST', [...state.forecastList, {
							symbol: symbol,
							list: list,
						}])
						resolve(list)
					}else if (res.status === 401) {
						Toast('Symbol not provided.',2000)
						reject(new Error('Symbol not provided.'));
					} else if (res.status === 404) {
						Toast('Such symbol no related report.',2000)
						reject(new Error('Such symbol no related report.'));
					} else {
						// 处理其他状态码
						console.error(`Unexpected status code: ${res.status}`);
						reject(new Error(`Unexpected error, status code: ${res.status}`));
					}
				}catch(err){
					reject(err)
				}
			}else{
				resolve(result.list)
			}
		})
	},
	get_forecast_author_list({ commit }, list) {
		commit('SET_FORECAST_AUTHOR_LIST', list)
	},
	get_symbollist_forecast({ commit }) {
		return new Promise(async resolve => {
			toggleOverlaySymbol('flex');
			let symbollistForecast = await getSymbollistForecast()
			commit('SET_SYMBOLLIST_FORECAST',symbollistForecast)
			toggleOverlaySymbol('none');
			resolve()
		})
	},
/** End Report page*/

	
	/** 控制图表绘制类型,line或者candle, myIndicator用CIQ.isOHLCVSelectedMI指标控制特殊判断 */
	set_chart_type({ commit }, val) {
		commit('SET_CHART_TYPE', val)
	},


	// 獲取單個symbol ohlcv(讀取緩存或者直接請求數據)並緩存
	get_mysymbolCSV({ commit }, obj) {
		return new Promise(async (resolve,reject) => {
			const {url,timeframe} = obj
			const quote = state.mySymbolQuotefeedCache.find(item=>item.url==url && item.timeframe==timeframe)
			if(!quote){
				try{
					const res = await getSymbolCsv(url,timeframe)
					if (res.data.status === 200 || res.data.status === 201) {
						const csvContent = res.data.data.csv_content
						commit('SET_MYSYMBOL_QUOTEFEED_CACHE', [...state.mySymbolQuotefeedCache, {
							url: url,
							timeframe: timeframe,
							quotes: csvContent
						}])
						resolve(csvContent)
					}else if (res.data.status === 401) {
						Toast('this backtesting utilizes an user customized indicator that is deleted, this page will be refresh in 2 seconds',2000)
						setTimeout(() => {
							window.location.reload();
						}, 2000); // 2000毫秒 = 3秒
						reject(new Error('this backtesting utilizes an user customized indicator that is deleted, this page will be refresh in 2 seconds'));
					} else {
						// 处理其他状态码
						console.error(`Unexpected status code: ${res.data.status}`);
						reject(new Error(`Unexpected error, status code: ${res.data.status}`));
					}
				}catch(err){
					reject(err)
				}
			}else{
				resolve(quote.quotes)
			}
		})
	},
	// 獲取mysymbol列表包括url和name etc.
	get_mysymbolist({ commit }) {
		return new Promise(async resolve => {
			toggleOverlaySymbol('flex');
			await getAllMySymbolsList(1,(data)=>{
				commit('SET_MYSYMBOLLIST',data)
			})
			toggleOverlaySymbol('none');
			resolve()
		})
	},
	// 獲取myindicator和favindicator列表
	get_myindicator({ commit }) {
		return new Promise(async resolve => {
			toggleOverlayIndicator('flex');
			let btvFavIndi = await getBTV1FavIndicator()
			commit('SET_FAVORITE_INDICATOR_LIST_BTV1', btvFavIndi)
			await getAllMyIndicatorsList(1,(data)=>{
				commit('SET_MYINDICATORLIST',data)
			})
			toggleOverlayIndicator('none');
			resolve()
		})
	},

get_indicator_page_btv1_list({ commit }) {
		return new Promise(async resolve => {
			let btv1List = await obtainBTV1IndicatorsList()
			commit('SET_INDICATOR_PAGE_BTV1_LIST', btv1List)
			resolve()
		})
	},
/** Begin MyIndicator page*/
	reset_miFormState({ commit }, val) {
		return new Promise(resolve => {
			commit('miFormStateChange', {
				categories:'Indicator Spread',
				indicator_1: '',indicator_1_url:'',
				indicator_2: '',indicator_2_url:'',
			})
			commit('miFormWeightedListChange', [])
			resolve()
		})
	},
	set_miFormWeightedListChange({ commit }, val ) {
		return new Promise(resolve => {
		
			const newVal = JSON.parse(JSON.stringify(val.data));
			const oldVal = JSON.parse(JSON.stringify(state.miFormWeightedList));

            CIQ.displayWeightOwnIndicator(oldVal,newVal,val.url)
			
			commit('miFormWeightedListChange', newVal)
			resolve()
		})
	},
	set_miFormSOHLCVChange({ commit }, val ) {
		return new Promise(resolve => {
            CIQ.changeUserOwnIndicatorSymbol(val.data)
			resolve()
		})
	},
	set_miFormStateChange({ commit }, val) {
		return new Promise(resolve => {
			const newVal = 	{
				categories : val.categories,
				indicator1 : {name:val.indicator_1,url:val.indicator_1_url},
				indicator2 : {name:val.indicator_2,url:val.indicator_2_url},
			}
			const oldVal = {
				categories : state.miFormCategories,
				indicator1 : state.miFormCategoriesIndicator1,
				indicator2 : state.miFormCategoriesIndicator2,
			}
			CIQ.updateUserOwnIndicator(newVal,oldVal).then(()=>{
				commit('miFormStateChange', val)
				resolve()
			})

		})
	},
	/**
	 * 在切换symbol以及timeframe时重新请求数据并刷新study
	 * @param {*} param0 
	 * @param {*} val 
	 * @returns 
	 */
	set_miFormStateRefresh() {
		return new Promise(resolve => {
			const newVal = 	{
				categories : state.miFormCategories,
				indicator1 : state.miFormCategoriesIndicator1,
				indicator2 : state.miFormCategoriesIndicator2,
			}
			const oldVal = {
				categories : state.miFormCategories,
				indicator1 : {name:'',url:''},
				indicator2 : {name:'',url:''},
			}
			// 刷新前清空已有study,只是刷新study以更新timeframe所以不commit更改状态
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
				CIQ.Studies.removeStudy(CIQ.stxx, sd); 
			}
			CIQ.updateUserOwnIndicator(newVal,oldVal).then(()=>{
				resolve()
			})
		})
	},
	/**
	 * 在切换symbol以及timeframe时重新请求数据并刷新study
	 * 切换symbol时更新newVal
	 * @param {*} param0 
	 * @param {*} val 
	 * @returns 
	 */
	set_miFormWeightedListRefresh({ commit }, val) {
		return new Promise(resolve => {
			const newVal = JSON.parse(JSON.stringify(val?val.data:state.miFormWeightedList));
			const oldVal = []
			// 刷新前清空已有study,只是刷新study以更新timeframe所以不commit更改状态
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
				CIQ.Studies.removeStudy(CIQ.stxx, sd); 
			}
            CIQ.displayWeightOwnIndicator(oldVal,newVal,val?val.url:null)
			resolve()
		})
	},
/** End MyIndicator page*/


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

			// CIQ.stxx.draw()
			// CIQ.setPanelHeight([])

			commit('RESET_CHART_STUDY_STATE')
			commit('SET_CHART_READY_STATE',false)
			resolve()
		})
	},
	set_span_period({ commit }, val) {
		return new Promise(resolve => {
			commit('SET_SPAN_PERIOD', val)
			resolve()
		})
	},
	async fetchIndicatorsPageList({ commit, dispatch, state }, url) {
		debugger
		if (!state.indicatorsPageListdata[url]) {
			try {
				let requestUrl = url
				// 替换板块的 url
				if(['spx', 'ndx', 'etf', 'sp1500'].some(subUrl => url.includes(subUrl))) requestUrl = `trend_reltrend?index=${url}`
				let response = await obtainIndicatorsList(requestUrl);
				let _results = response.data || []
				if(url === 'commod_sentiment_seasonality') {
          const {month, screen_data} = _results
          state.cssMonthLabel = `for ${month}`
          _results = isJson(screen_data) ? JSON.parse(screen_data) : []
        }
        if(!state.indicatorPageBtv1List) await dispatch('get_indicator_page_btv1_list')
        if(!state.favoriteIndicatorList.length) await dispatch('get_favorite')
        console.log('commod_sentiment_seasonality', _results)
								_results = _results.map(obj => {
										for (const key in obj) {
												if (Object.hasOwnProperty.call(obj, key)) {
														if(key === 'timeframe') {
																if(['Short to Intermediate', 'Intermediate to Long', 'Intermediate', 'Medium-Term'].includes(obj[key])){obj[key] = 'Medium'}
																else if(['Short', 'Short-Term'].includes(obj[key])){obj[key] = 'Short'}
																else if(['Long', 'Long-Term'].includes(obj[key])){obj[key] = 'Long'}
														}else if((key === 'groups' || key === 'sub_type') && ['stock_complete_list', 'etf_complete_list', 'bond_complete_list', 'etf_breadth', 'etf_flow', 'monthly_fund_flows', 'shares_outstanding', 'bond_seasonality', 'commod_seasonality', 'etf_seasonality', 'most_popular', 'commodity_complete_list', 'commod_sentiment_seasonality', 'commod_optix_trend', 'cot_max_min'].includes(url)) {
										if(url === 'commodity_complete_list' && key === 'sub_type' && obj['url'].startsWith('vol_')) {
											obj[key] = 'Volatility'
										}else if(url === 'etf_complete_list' && obj['sub_type'] === 'etf_bond' && obj['url'].startsWith('etf_') && (obj['underlying_name'] && obj['underlying_name'].endsWith('Treasury'))) {
												obj['chart_name'] = obj['underlying_name'].replace('Treasury', 'Optix')
												if(obj['sub_type'] === 'etf_bond') obj['sub_type'] = 'Bond'
										}else if(url === 'etf_seasonality' && obj['type'] === 'etf_seasonality' && (obj['underlying_name'] && (obj['underlying_name'].includes('Industrial') || obj['underlying_name'].includes('Discretionary')))) {
												if(obj['underlying_name'].includes('Industrial')) obj['underlying_name'] = obj['underlying_name'].replace('Industrial', 'Ind.')
													if(obj['underlying_name'].includes('Discretionary')) obj['underlying_name'] = obj['underlying_name'].replace('Discretionary', 'Disc.')
										} else if(url === 'bond_complete_list' && key === 'sub_type') {
										const chartNamesFor10Year = [
										'Bond Optix', '10-Year Optix', '10-Year Treasury Hedgers Position',
										'10-Year Bond Put/Call Ratio', '10-Year Treasury Seasonality','Conference Board - Bonds',
										'Ultra 10-Year Treasuries Hedgers Position', 'Ultra 10-Year Treasury Hedgers Position',
										'2-Year / 10-Year Yield Curve', 'BBB - AAA Corporate Bond Yield Spread'
										]
										const chartNamesFor20Year = [
											'TLT Optix', 'TLT Seasonality', 'TLT Open Interest Ratio'
										]
										const chartNamesFor2Year = [
											'2-Year Optix', '2-Year Treasury Hedgers Position', '2-Year Treasury Seasonality'
										]
										const chartNamesFor30Year = [
											'30-Year Treasury Hedgers Position', '30-Year Bond Put/Call Ratio', 'Rydex Bond Bear Assets',
											'Rydex Bond Bull Assets', 'Rydex Bond Bull Ratio', '30-Year Treasury Seasonality', 'AAII Allocation - Bonds',
											'Strategist Allocation - Bonds', '30-Year Optix', 'Fund Flow - Combined Bond', 'Fund Flow - ETF Bond',
											'Fund Flow - Mutual Fund Bond', 'Ultra 30-Year Treasuries Hedgers Position', 'Ultra 30-Year Treasury Hedgers Position'
										]
										const chartNamesFor5Year = [
											'5-Year Treasury Hedgers Position', '5-Year Treasury Seasonality', '5-Year Treasury', '5-Year Optix'
										]
										const chartNamesForEurodollar = [
											'Eurodollar Optix', 'Eurodollar Hedgers Position', 'Eurodollar Price Seasonality'
										]
										const chartNamesForHighYield = [
											'High Yield Bond Advance-Decline', 'High Yield Bond NH - NL',
											'HYG Optix', 'JNK Optix', 'HYG Seasonality', 'JNK Seasonality',
											'High Yield Bond Cumulative A/D Line', 'High Yield McClellan Oscillator', 'High Yield McClellan Summation'
										]
										const chartNamesForInvestmentGrade = [
											'BND Optix', 'LQD Optix', 'LQD Seasonality'
										]
										if(chartNamesFor10Year.includes(obj['chart_name'])) obj['sub_type'] = '10-Year Treasury'
										else if(chartNamesFor20Year.includes(obj['chart_name'])) obj['sub_type'] = '20-Year Treasury'
										else if(chartNamesFor2Year.includes(obj['chart_name'])) obj['sub_type'] = '2-Year Treasury'
										else if(chartNamesFor30Year.includes(obj['chart_name'])) obj['sub_type'] = '30-Year Treasury'
										else if(chartNamesFor5Year.includes(obj['chart_name'])) obj['sub_type'] = '5-Year Treasury'
										else if(chartNamesForEurodollar.includes(obj['chart_name'])) obj['sub_type'] = 'Eurodollar'
										else if(chartNamesForHighYield.includes(obj['chart_name'])) obj['sub_type'] = 'High-Yield'
										else if(chartNamesForInvestmentGrade.includes(obj['chart_name'])) obj['sub_type'] = 'Investment Grade'
										else {obj['sub_type'] = capitalizeFirstLetter(obj['sub_type'])}
									}else {
										if (obj['sub_type'] === 'vol') {
											obj['sub_type'] = 'Volatility';
										} else if (obj['sub_type'] === 'stock_sent') {
											obj['sub_type'] = 'Stock Sentiment';
										} else if (obj['sub_type'] === 'pc_ratio') {
											obj['sub_type'] = 'PutCall';
										}else if (['equity', 'cot'].includes(obj['sub_type'])) {
											obj['sub_type'] = 'COT';
										} else if (['etf_index', 'etf_social_index'].includes(obj['sub_type'])) {
											obj['sub_type'] = 'Index';
										} else if (['etf_etf', 'etf_social_sector', 'etf_sector', 'mff_sector'].includes(obj['sub_type'])) {
											obj['sub_type'] = 'Sector';
										} else if (['etf_bond', 'etf_social_bond', 'mff_bond'].includes(obj['sub_type'])) {
											obj['sub_type'] = 'Bond';
										} else if (['etf_commod', 'etf_social_commod', 'mff_commod'].includes(obj['sub_type'])) {
											obj['sub_type'] = 'Commodity';
										} else if (obj['sub_type'] === 'etf_breadth') {
											obj['sub_type'] = 'Sector Breadth';
										} else if (['etf_country', 'etf_social_country'].includes(obj['sub_type'])) {
											obj['sub_type'] = 'Country';
										} else if (obj['sub_type'] === 'etf_social') {
											obj['sub_type'] = 'Social';
										} else if (obj['sub_type'] === 'seasonality') {
											obj['sub_type'] = 'Seasonality';
										} else if (obj['sub_type'] === 'optix') {
											obj['sub_type'] = 'Optix';
										} else if (obj['sub_type'] === 'model') {
											obj['sub_type'] = 'Model';
										} else if (obj['sub_type'] === 'more') {
											obj['sub_type'] = 'More';
										} else if (obj['sub_type'] === 'rydex') {
											obj['sub_type'] = 'Rydex';
										} else if (obj['sub_type'] === 'mff_stocks') {
											obj['sub_type'] = 'Stocks';
										} else if (obj['sub_type'].startsWith('etf_fund_')) {
											obj['sub_type'] = obj['sub_type'].split('_')[2].charAt(0).toUpperCase() + obj['sub_type'].split('_')[2].slice(1); // Capitalize the 3rd part
										} else {
											obj['sub_type'] = obj['sub_type'].charAt(0).toUpperCase() + obj['sub_type'].slice(1);
										}}}
									if(['last_value', 'last_change', 'win_rate', 'avg_return', 'z_score', 'avg_net_return', 'AvgReturn'].includes(key)) {
											if(['last_value', 'last_change'].includes(key)){obj[key] = unifyNumber(obj[key], 4)}
											else if(key === 'z_score'){obj[key] = obj[key] = unifyNumber(obj[key], 1)}
											else if(key === 'win_rate' || key === 'avg_net_return' || key === 'AvgReturn'){obj[key] = obj[key] = unifyNumber(obj[key], 2)}
											else if(key === 'avg_return'){obj[key] = obj[key] = unifyNumber(obj[key], 3)}}
									if(key === 'last_update' && (url === 'most_popular' || url === 'commod_sentiment_seasonality' || url === 'commod_optix_trend' || url === 'cot_max_min')) obj['last_update'] = timestampToTime(obj[key])
									if(key === 'chart_url' && (url === 'commod_sentiment_seasonality' || url === 'commod_optix_trend' || url === 'cot_max_min')) obj['url'] = obj[key]
									const isInBtv1List = state.indicatorPageBtv1List.find(item => (item.url === obj['url']))
									const isInBtv2List = state.favoriteIndicatorList.find(item => (item.url === obj['url']))
									if((key === 'url' || key === 'chart_url') && isInBtv1List) {
											obj['source'] = 'Backtest Engine v1.0'
											obj['favorite'] = true
									}else if((key === 'url' || key === 'chart_url') && isInBtv2List) {
											obj['source'] = 'Backtest Engine v2.0'
											obj['favorite'] = true
									}else if((key === 'url' || key === 'chart_url') && isInBtv2List && isInBtv1List) {
											obj['source'] = 'Backtest Engine v1.0 & v2.0'
											obj['favorite'] = true
									}else if((key === 'url' || key === 'chart_url') && !isInBtv1List && !isInBtv2List) {
											obj['source'] = 'Backtest Engine v2.0'
											obj['favorite'] = false
									}
									// 加按钮 loading
									obj['loading'] = false
								// 加来源列表
								obj['source_list'] = url

									if(
											((key === 'last_value' || key === 'last_change') && (url === 'stock_complete_list' || url === 'most_popular') && obj['last_change_type'] === 'percent')
											|| (key === 'win_rate' && ['bond_seasonality', 'commod_seasonality', 'etf_seasonality'].includes(url))
											|| (key === 'avg_return' && ['bond_seasonality', 'commod_seasonality', 'etf_seasonality'].includes(url))
											|| (key === 'avg_net_return' && url === 'etf_seasonality'
											|| (key === 'AvgReturn' && url === 'commod_sentiment_seasonality')
											)
									){
											if(obj[key] !== '' && obj[key] !== null && obj[key] !== 'null') obj[key] =  `${obj[key]}%`
											// 加 %
									}else if((key === 'url' && ['ndx_100_complete_list', 'sp_1500_complete_list', 'cot_max_min'].includes(url))) {
											// 全部大写
											obj[key] = obj[key].toUpperCase()
									}
												}
										}
					return obj
			})
    console.log(_results)
				if (url === 'etf_seasonality') {
					const seenUrls = new Set();
					_results = _results.filter(item => {
							if (item['url'] === 'etf_seasonality') {
									if (!seenUrls.has(item['url'])) {
											seenUrls.add(item['url']);
											return true;
									}
									return false;
							}
							return true;
					});
			}
				commit('SET_INDICATORS_PAGE_LIST_DATA', { url, data: _results });
			} catch (error) {
				console.error('Error fetching data:', error);
				commit('SET_INDICATORS_PAGE_LIST_DATA', { url, data: [] });
			}
		}
}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
