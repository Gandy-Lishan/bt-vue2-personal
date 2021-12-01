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
    },
    
    customExitType: [{label: "longexit", value: "longexit"},
    {label: "short", value: "short"}],
    exitOption:  [{label: "longexit", value: "longexit"},
    {label: "short", value: "short"}],
    strategyId: '',
    indicatorsList: [],
    symbolName: '',
    trades: []
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
    getCustomExitType(state, val) {
      const data = {
        long: [
          { label: 'Longexit', value: 'longexit' },
          { label: 'Short', value: 'short' },
        ],
        short: [
          { label: 'Shortexit', value: 'shortexit' },
          { label: 'Long', value: 'long' },
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
          { label: 'Longexit', value: 'longexit' },
          { label: 'Short', value: 'short' },
        ],
        short: [
          { label: 'Shortexit', value: 'shortexit' },
          { label: 'Long', value: 'long' },
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
    getSymbolName(state, val) {
      state.symbolName = val
    },
    getTradesData(state, data) {
      state.trades = data
    }
  },
})