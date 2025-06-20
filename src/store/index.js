import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import chart from './modules/chart'
import form from './modules/form'
import states from './modules/states'
import user from './modules/user'

// import predict from "./modules/market/predict";
import balanceSheet from "./modules/market/sec/balanceSheet";
import companyProfile from "./modules/market/sec/companyProfile";
import companyEarning from "./modules/market/sec/companyEarning";
import metadataChart from "./modules/market/sec/metadataChart";
import sec from "./modules/market/sec/sec";
import analyst from "./modules/market/sec/analyst";
import news from "./modules/market/sec/news";


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
            companyProfile,
            companyEarning,
            metadataChart,
            sec,
            analyst,
            news
          },
        },
      },
    },
  },
  getters,
})

export default store
