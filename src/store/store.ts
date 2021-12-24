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
        signals: [{}]
      },
    exit: {
      direction: '',
      frequency: '',
        signals: [{}]
      }
    },
    openedPorfolioBacktests: [],
    count: 1,
    porfolioCash: '11',
    savePorfolioData: [],
    favoriteBacktestRowData: {},
    editBacktestData: {},
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
    conditionData: {},
    saveConditionFormdata: {},
    exitFrequency: '',
    entryDirection: '',
    exitTechType: '',
    activatedMA: [{period: 21, url: ""}],
    editBacktestSetUpData: {},
    isShowExitForm: true,
    tabIndex: 0
  },
  getters:{
    getBacktestEntry: (state)=>{
      return state.backtestInfo.entry
    }
  },
  mutations: {
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
    getBacktestEditData(state, row) {
      state.editBacktestData = row
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
    getConditionData(state, val){
      state.conditionData = val
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
      // console.log(obj);
      // if(obj.criteria === 'entry'){
      //   const index = obj.index
      //   delete obj.index
      //   delete obj.criteria
      //   state.backtestInfo.entry.signals[index] = obj
      // }
      var index = obj.index;
      state.tabIndex = index
      var criteria = obj.criteria
      delete obj.index
      delete obj.criteria
      if (index !== "" && criteria !== ""){
        var data = state.backtestInfo[criteria]["signals"][index]
        data = Object.assign(data,obj)
        state.backtestInfo[criteria]["signals"][index] = data
        
      }
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
    }
},
actions: {
  Try(context, val){
    context.commit('setEntryData', val)
  }
}
})
