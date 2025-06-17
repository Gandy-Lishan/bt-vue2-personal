import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import chart from './modules/chart'
import form from './modules/form'
import states from './modules/states'
import user from './modules/user'

// import predict from "./modules/market/predict";
import balanceSheet from "./modules/market/sec/balanceSheet";

Vue.use(Vuex)
// TODO 按照page细分, 并做code grouping
const store = new Vuex.Store({
  modules: {
    chart,
    form,
    states,
    user,
    market: {
      namespaced: true,
      modules: {
        // overview,
        // predict,
        sec: {
          namespaced: true,
          modules: {
            balanceSheet,
          },
        },
      },
    },
  },
  getters,
})

export default store
