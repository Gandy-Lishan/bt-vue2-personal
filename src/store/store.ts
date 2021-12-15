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
    openedPorfolioBacktests: [],
    count: 1,
    porfolioCash: '11',
    savePorfolioData: [],
    favoriteBacktestRowData: {},
    editStrategyData: {},
    strategyEntryData: {},
    strategyExitData: {},
    indicators: {
      formIndicators: {
        entry: '',
        exit: '',
      },
      extraIndicators: [],
      technicalIndicators: [],
      exitFrequency: ''
    },
    customExitType: [{label: "short", value: "short"},{label: "longexit", value: "longexit"}],
    exitOption:  [{label: "longexit", value: "longexit"},
    {label: "short", value: "short"}],
    strategyId: '',
    indicatorsList: [],
    builtinList:[],
    symbolName: '',
    trades: [],
    indicatorRadio: 'Sentiment_Indicators:',
    conditionData: {},
    saveConditionFormdata: {},
    exitFrequency: '',
    entryType: 'long',
    exitTechType: '',
    activatedMA: [{period: 21, url: ""}],
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
    getEditBacktestData(state, row) {
      state.editStrategyData = row
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
    getIndicatorRadio(state, val){
      state.indicatorRadio = val
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
    getEntryType(state, val){
      state.entryType = val
    },
    getTechnicalIndicators(state, val){
    state.indicators.technicalIndicators = val
    },
    
}})