import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    
    newPorfolioInputsValues:{
      inputNameValue: '',
      inputDescriptionValue: '',
      inputOriginalAssetValue: ''
    },
    backtestInfo:{
        entry: {
          direction: '',
          frequency: '',
        signals: [{
          sentimentIndicator: '',
          technicalIndicator: ''
        }]
      },
    exit: {
      direction: '',
      frequency: '',
        signals: [{          sentimentIndicator: '',
        technicalIndicator: ''}]
      }
    },
    goToFavoritePage: false,
    openedPorfolioBacktests: [],
    count: 1,
    porfolioCash: '11',
    savePorfolioData: [],
    favoriteBacktestRowData: {},
    strategyEntryData: {},
    strategyExitData: {},
    indicators: {
      formIndicators: {
        entry: '',
        exit: '',
      },
      extraIndicators: [],
      technicalIndicators: [],
    },
    extremeValue: {
      extremeOptimism: undefined,
      extremePessimism: undefined,
    },
    // cciDefault: {
    //   over_bought_bound: undefined,
		// 	over_sold_bound: undefined,
    //   period: undefined
    // },
    // macdDefault: {
    //   SlowMA: undefined,
    //   FastMA: undefined,
    //   SL: undefined
    // },
    // rsiDefault: {
    //   over_bought_bound: undefined,
		// 	over_sold_bound: undefined,
    //   period: undefined
    // },
    customExitType: [{label: "short", value: "short"},{label: "longexit", value: "longexit"}],
    exitOption:  [{label: "longexit", value: "longexit"},
    {label: "short", value: "short"}],
    strategyId: '',
    indicatorsList: [],
    builtinList:[],
    symbolName: '',
    trades: [],
    entryIndicatorRadio: 'sentiment',
    exitIndicatorRadio: 'Sentiment_Indicators:',
    signalDialogData: {},
    saveConditionFormdata: {},
    exitFrequency: '',
    entryDirection: '',
    exitTechType: '',
    activatedMA: [{period: 21, url: ""}],
    favoriteList:[],
    // indicators look up
    allSymbolsList: [],
    stocksList: [],
    indexsList: [],
    editBacktestSetUpData: {},
    isShowExitForm: true,
    tabIndex: 0,
    fdDialogData: {}
  },
  getters:{
    getBacktestEntryFrequency: (state)=>{
      return state.backtestInfo.entry.frequency
    },
    getBacktestEntryDirection: (state) => {
      var obj=  {
				Long: "Short",
				Short: "Long"
			}
      
      return obj[state.backtestInfo.entry.direction]
    },
    getGoToFavoritePage: (state) => {
      return state.goToFavoritePage
    },
    getExtremeValue: (state) => {
      return state.extremeValue
    },
    getSignalDialogData: (state)=> {
      return state.signalDialogData
    },
    getDialogFdData: (state,) => {
      return state.fdDialogData
    },
    getSentimentIndicator: (state) => {
      return state.backtestInfo
    }
  },
  mutations: {
    
    getExtremeValue: (state,item)=>{
      //console.log(11111);
      
      state.extremeValue = {
          extremeOptimism: item.extremeOptimism,
          extremePessimism: item.extremePessimism
      }
    },
    getFavoriteList(state,list){
      state.favoriteList = list 
    },
    getAllSymbolsList(state,list){
      state.allSymbolsList = list
    },
    getStocksList(state,list){
      state.stocksList = list
    },
    getIndexsList(state,list){
      state.indexsList = list
    },
    getNewPorfolioInputsValues(state,row) {
      state.newPorfolioInputsValues.inputNameValue = row.name
      state.newPorfolioInputsValues.inputDescriptionValue = row.description
      state.newPorfolioInputsValues.inputOriginalAssetValue = row.original_asset
      state.openedPorfolioBacktests = row.backtests
    },
    getSavePorfolioData(state,list){
      state.savePorfolioData = list
    },
    getRunBacktestData(state, row){
      state.favoriteBacktestRowData = row
    },
    getEntryIndicators(state, val){
      state.indicators.formIndicators.entry = val
    },
    getExitIndicators(state, val){
      state.indicators.formIndicators.exit = val
    },
    getExtraIndicators(state, val){
      state.indicators.extraIndicators = val
    },
    getEntryData(state, val){
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
        ],
      }
      if (val === 'long') {
        state.customExitType = data.long
      } else {
        state.customExitType = data.short
      }
    },
    getExitOption(state ,val) {
      const data = {
        long: [
          { label: 'Short', value: 'short' },
          { label: 'Longexit', value: 'longexit' }
        ],
        short: [
          { label: 'Long', value: 'long' },
          { label: 'Shortexit', value: 'shortexit' }
        ],
      }
      if (val === 'long') {
        state.exitOption = data.long
      } else {
        state.exitOption = data.short
      }
    },
    getStrategyId(state, id){
      state.strategyId = id
    },
    getIndicatorsList(state, data){
      state.indicatorsList = data
    },
    getBuiltinList(state,data){
      state.builtinList = data
    },
    getSymbolName(state, val) {
      state.symbolName = val
    },
    getTradesData(state, data) {
      state.trades = data
    },
    getFrequency(state,val){
      state.exitFrequency = val
    },
    getMA(state,val){
      state.activatedMA = val
    },
    clearEntrySignal(state, val){
      state.indicators.formIndicators.entry = ''
    },
    clearExitSignal(state, val){
      state.indicators.formIndicators.exit = ''
    },
    getEntryIndicatorRadio(state, val){
      state.entryIndicatorRadio = val
    },
    getExitIndicatorRadio(state, val){
      state.exitIndicatorRadio = val
    },
    setSignalDialogData(state, val){
      state.signalDialogData = val
    },
    saveCondictionData(state, val){
      state.saveConditionFormdata = val
    },
    getExitTechList(state,val){
      state.exitTechType = val
    },
    getEntryDirection(state, val){
      state.entryDirection = val
      
    },
    getTechnicalIndicators(state, val){
    state.indicators.technicalIndicators = val
    },
    getBacktestetUpEditData(state, row){
      state.editBacktestSetUpData = row
    },
    // show exit form when save entrySignal
    showExitFormData(state, val){
      state.isShowExitForm = val
    },
    addSignal(state, val){
      state.backtestInfo[val]['signals'].push({})
    },
    moveSignal(state,val){
      state.backtestInfo[val]['signals'].slice(state.tabIndex,1)
    },
    setEntryData(state, obj) {
      var index = obj.index;
      state.tabIndex = index
      var criteria = obj.criteria
      delete obj.index
      delete obj.criteria
      if (index !== "" && criteria !== ""){
        if (index === undefined){
          return 
        }
        if (state.backtestInfo[criteria]["signals"].length !== (index+1)){
          state.backtestInfo[criteria]["signals"].push({})
        }
        var data = state.backtestInfo[criteria]["signals"][index]
        const newData = {}
        for(let key in obj) {
          //console.log("99999999999",obj[key]);
          
          if(obj[key] !=='' && obj[key] !== undefined){
            newData[key]=obj[key]
          }
        }
        data = Object.assign(data,newData)
        state.backtestInfo[criteria]["signals"][index] = data
        //console.log("监听数据", state.backtestInfo[criteria]["signals"][index]);
        
      }
      //console.log(state.backtestInfo.entry.signals);
      
    },
    setFd(state, obj){
      let criteria = obj.criteria
      delete obj.index
      delete obj.criteria
      for(let key in obj){
        if(obj[key]){
          state.backtestInfo[criteria][key] = obj[key]
        }
      }
     // console.log("backtest",state.backtestInfo.exit);
      
    },
    setBd(state, obj){
      for(let key in obj) {
        if(obj) {
          state.backtestInfo[key] = obj[key]
        }
      }
      
      
    },
    deleteIndicator(state,val){
      state.backtestInfo[val.criteria].signals[val.index].sentimentIndicator = ''
      state.backtestInfo[val.criteria].signals[val.index].technicalIndicator = ''
    },
    getTechValue(state, obj){
      state.backtestInfo[obj.criteria].signals[obj.index].technicalIndicator = obj.value
    },
    getSentiValue(state, obj) {
      state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator = obj.value
      //console.log("选择后的senitment",state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator);
      
    },
    // 用于单选框 切换时删除不必要字段
    delete(state,obj) {
      delete state.backtestInfo[obj.criteria].signals[obj.index][obj.delete]
    },
    clearSignal(state, obj) {
      state.backtestInfo[obj.criteria].signals[obj.index] = {}
      state.backtestInfo[obj.criteria].signals[obj.index].sentimentIndicator = ''
      state.backtestInfo[obj.criteria].signals[obj.index].technicalIndicator = ''
    },
    setSignalDialogFd(state, fd) {
      state.fdDialogData = fd
    },
    goToFavoritePage(state) {
      state.goToFavoritePage = !state.goToFavoritePage
    }
},
actions: {
  Try(context, val){
    context.commit('setEntryData', val)
  }
}
})
