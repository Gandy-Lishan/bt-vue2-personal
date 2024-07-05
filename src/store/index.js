import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import chart from './modules/chart'
import form from './modules/form'
import states from './modules/states'
import user from './modules/user'

Vue.use(Vuex)
// TODO
const store = new Vuex.Store({
  modules: {
    chart,
    form,
    states,
    user
  },
  getters,
})

export default store
