// store/modules/stock.js
import { getPairData } from '@/service/service';
import { timestampToTime } from '@/utils';

const state = {
  pairData: [], // Highcharts 需要的格式
  error: null,
  isLoading: false,
  symbolName: '',
};

const actions = {
  async fetchChartData({ commit }, { symbol, startDate, endDate }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const resp = await getPairData(startDate, endDate, 'daily', symbol);
      commit('setPairData', resp.data || []);

      // const processed = (resp.data || []).map(item => {
      //   // const timestamp = new Date(item.DT).getTime();
      //   const timestamp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(item.DT) ? new Date(item.DT).getTime() : null;
      //   return chartType === 'candlestick'
      //     ? [timestamp, item.Open, item.High, item.Low, item.Close]
      //     : [timestamp, item.Close];
      // });
      // commit('setSeries', [{
      //   name: symbol,
      //   data: processed,
      //   type: chartType,
      //   color,
      //   showInNavigator: true,
      // }]);
      commit('setSymbolName', symbol);
    } catch (err) {
      commit('setError', err.message);
      commit('setSeries', []);
    } finally {
      commit('setLoading', false);
    }
  },
};

const mutations = {
  setPairData(state, s) { state.pairData = s; },
  setError(state, e) { state.error = e; },
  setLoading(state, f) { state.isLoading = f; },
  setSymbolName(state, s) { state.symbolName = s; },
};

const getters = {
  pairData: s => s.pairData,
  isLoading: s => s.isLoading,
  error: s => s.error,
  symbolName: s => s.symbolName,
};

export default { namespaced: true, state, actions, mutations, getters };
