import { formatNumber, isJson } from '@/utils';
import { getAnalystData } from '@/service/market';

const formatUTCDate = (isoStr) => {
  const [year, month, day] = isoStr.split("T")[0].split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

const formatData = (data) => {
  const AnalystData = []
  debugger
  const AnalystDataColumns = [
    { prop: 'date', label: 'Date', width: '120', sortable: true, type: 'date' },
    { prop: 'target', label: 'Target', sortable: true, type: 'number', formatter: (row) => formatNumber(row.target, 'dollar') },
    { prop: 'minPrice', label: 'Min Price', sortable: true, type: 'number', formatter: (row) => formatNumber(row.minPrice, 'dollar') },
    { prop: 'maxPrice', label: 'Max Price', sortable: true, type: 'number', formatter: (row) => formatNumber(row.maxPrice, 'dollar') },
    { prop: 'reportNum', label: 'Report Num', sortable: true, type: 'number' },
    { prop: 'accuracy', label: 'Accuracy', sortable: true, type: 'number', formatter: (row) => formatNumber(row.accuracy, 'customSign', '%') },
  ]
  const {
    analyst_ratings_buy,
    analyst_ratings_buy_percent,
    analyst_ratings_hold,
    analyst_ratings_hold_percent,
    analyst_ratings_sell,
    analyst_ratings_sell_percent,
    analyst_ratings_strong_buy,
    analyst_ratings_strong_buy_percent,
    analyst_ratings_strong_sell,
    analyst_ratings_strong_sell_percent,
  } = data.rating_data
  const pt_data = data.pt_data
  const ColumnBarData = [
    {label: 'Strong Buy', actual: analyst_ratings_strong_buy, value: analyst_ratings_strong_buy_percent, color: '#1e40af', multiplyBy: 2},
    {label: 'Buy', actual: analyst_ratings_buy, value: analyst_ratings_buy_percent, color: '#3b82f6', multiplyBy: 1},
    {label: 'Hold', actual: analyst_ratings_hold, value: analyst_ratings_hold_percent, color: '#10b981', multiplyBy: 0},
    {label: 'Sell', actual: analyst_ratings_sell, value: analyst_ratings_sell_percent, color: '#f59e0b', multiplyBy: -1},
    {label: 'Strong Sell', actual: analyst_ratings_strong_sell, value: analyst_ratings_strong_sell_percent, color: '#ec4899', multiplyBy: -2}
  ]
  pt_data.forEach((item, index) => {
    AnalystData.push({
      date: item.end_date,
      target: parseFloat(item.target_mean),
      minPrice: parseFloat(item.price_min),
      maxPrice: parseFloat(item.price_max),
      reportNum: parseFloat(item.num),
      accuracy: parseFloat(item.mean_acc)
    })
  })
  return {AnalystData, AnalystDataColumns, ColumnBarData}
}

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  debugger
  const data = raw.data.data
  let {AnalystData, AnalystDataColumns, ColumnBarData} = formatData(data)
  return {
    AnalystData, 
    AnalystDataColumns,
    ColumnBarData
  };
}

export default {
  namespaced: true,
  state: () => ({
    data: {},
    loading: false,
    error: null,
  }),
  getters: {
    analystData: (state) => state.data,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,
  },
  mutations: {
    SET_DATA(state, payload) {
      state.data = payload;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, err) {
      state.error = err;
    },
  },
  actions: {
    async fetchAnalyst({ commit }, val) {
      commit("SET_LOADING", true);
      try {
        const raw = await getAnalystData(val)
        debugger
        const processed = preprocessData(raw);
        console.log('lishan processed', processed)
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "Analyst data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
