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
    { prop: 'reportNum', label: 'Number of Reports', sortable: true, type: 'number' },
    { prop: 'accuracy', label: 'Accuracy', sortable: true, type: 'number', formatter: (row) => formatNumber(row.accuracy, 'intAndCustomSign', '%') },
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
    latest_rating
  } = data.rating_data
  const pt_data = data.pt_data
  const ColumnBarData = [
    {label: 'Strong Buy', labelHtml: 'Strong<br>Buy', actual: analyst_ratings_strong_buy, value: analyst_ratings_strong_buy_percent, color: '#16A34A', multiplyBy: 2}, // 深绿色
    {label: 'Buy', labelHtml: 'Buy', actual: analyst_ratings_buy, value: analyst_ratings_buy_percent, color: '#A1B81D', multiplyBy: 1}, // 浅绿色
    {label: 'Hold', labelHtml: 'Hold', actual: analyst_ratings_hold, value: analyst_ratings_hold_percent, color: '#F59E0B', multiplyBy: 0}, // 浅蓝色
    {label: 'Sell', labelHtml: 'Sell', actual: analyst_ratings_sell, value: analyst_ratings_sell_percent, color: '#EA580C', multiplyBy: -1}, // 较浅的红色
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
  return {AnalystData, AnalystDataColumns, ColumnBarData, latestRating: latest_rating}
}

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  debugger
  const data = raw.data.data
  let {AnalystData, AnalystDataColumns, ColumnBarData, latestRating} = formatData(data)
  return {
    AnalystData, 
    AnalystDataColumns,
    ColumnBarData,
    latestRating
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
