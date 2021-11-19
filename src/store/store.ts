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
      entry: '',
      exit: '',
    },
    customExitType: [{label: "string", value: "string"}],
    exitOption: [{label: "string", value: "string"}],
    strategyId: ''
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
      state.indicators.entry = val
    },
    getExitIndicators(state, val){
      state.indicators.exit = val
    },
    getEntryData(state, val){
      state.strategyEntryData = val
      console.log('entryData',val);
    },
    getExitData(state, val) {
      state.strategyExitData = val
      console.log('exitData',val);
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
        console.log(state.exitOption);
      } else {
        state.exitOption = data.short
      }
    },
    getStrategyId(state, id){
      state.strategyId = id
    }
  },
})