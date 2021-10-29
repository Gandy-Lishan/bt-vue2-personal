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
    savePorfolioData: []
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
    }
  },
  actions: {}
})