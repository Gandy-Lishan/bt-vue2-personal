import { CIQ } from '@/components/common/chart/st-development/js'
import {
    getAllMySymbolsList,getSymbolCsv,
	getBTV1FavIndicator,getAllMyIndicatorsList,
	getForecastList,
} from '@/service/service.js'
import {Toast} from '@/utils'
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
	favIndicatorList: null,

	//chart_type
	chartType: 'line',

	//forecast
	forecastList: [],
	reportsAreDisplayed: {
		bullish: true,
		bearish: true,
	}
}

const mutations = {
	SET_FORECAST(state, list){
		state.forecastList = list
	},
	SET_REPORT_DISPLAYED(state,obj){
		state.reportsAreDisplayed[obj.type] = obj.val
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
	SET_FAVINDICATORLIST(state,obj){
		state.favIndicatorList = obj
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
	getExitIndicators(state, obj) {
		let { index, value } = obj
		state.indicators.formIndicators.exit[index] = value
	},
	// 以上两个准备被替换
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
	getTechLayout(state, val) {
		state.activatedTechLayout = val
	},
	saveFormatTechnicalList(state, list) {
		state.formateTechnicalList = list
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
}

const actions = {
/** Begin fetch resources */
	
/** End fetch resources */


/** Begin Report page*/
	get_forecast({ commit }, symbol) {
		return new Promise(async (resolve,reject) => {
			const result = state.forecastList.find(item=>item.symbol==symbol)
			if(!result){
				try{
					const res = await getForecastList(symbol)
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
						reject(new Error(`Unexpected error, status code: ${res.data.status}`));
					}
				}catch(err){
					reject(err)
				}
			}else{
				resolve(result.list)
			}
		})
	},
	reset_reports_events({ commit }) {
		commit('SET_REPORT_DISPLAYED', {type:'bullish',val:true})
		commit('SET_REPORT_DISPLAYED', {type:'bearish',val:true})
	},
	toggle_reports_events({ commit }, typeOfEvent) {
		if (state.reportsAreDisplayed[typeOfEvent]) {
			commit('SET_REPORT_DISPLAYED', {type:typeOfEvent,val:false})
			CIQ.removeForecastMarker(typeOfEvent)
		} else {
			CIQ.createForecastMarker(typeOfEvent);
			commit('SET_REPORT_DISPLAYED', {type:typeOfEvent,val:true})
		}
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
						console.error(`Unexpected status code: ${res.status}`);
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
			commit('SET_FAVINDICATORLIST', btvFavIndi)
			await getAllMyIndicatorsList(1,(data)=>{
				commit('SET_MYINDICATORLIST',data)
			})
			toggleOverlayIndicator('none');
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
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
