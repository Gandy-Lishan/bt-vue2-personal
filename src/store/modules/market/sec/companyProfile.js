// store/modules/market/overview.js
import {getCompanyProfile} from "@/service/market";

const formatCompanyDetails = (detail) => [
    { label: 'Market Cap', value: `$${(Number(detail.market_cap) / 1e9).toFixed(2)}B` },
    { label: 'P/E Ratio', value: parseFloat(detail.pe_ratio).toFixed(2) },
    { label: 'P/B Ratio', value: parseFloat(detail.pb_ratio).toFixed(2) },
    { label: 'EV/Sales', value: parseFloat(detail.ev_to_sales).toFixed(2) },
    { label: 'EV/EBITDA', value: parseFloat(detail.enterprise_value_over_ebitda).toFixed(2) },
    { label: 'P/S Ratio', value: parseFloat(detail.price_to_sales_ratio).toFixed(2) },
    { label: 'Beta', value: 'N/A' }, // 源数据中无 beta，可根据需要补充
    { label: 'Return on Equity', value: `${(parseFloat(detail.roe) * 100).toFixed(2)}%` },
    { label: 'ROIC', value: `${(parseFloat(detail.roic) * 100).toFixed(2)}%` },
    { label: 'Current Ratio', value: parseFloat(detail.current_ratio).toFixed(2) },
    { label: 'FCF Yield', value: `${(parseFloat(detail.free_cash_flow_yield) * 100).toFixed(2)}%` },
    { label: 'Dividend Yield', value: `${(parseFloat(detail.dividend_yield) * 100).toFixed(2)}%` }
  ]
  
const formatTradingStats = (stat) => [
    { label: 'Price', value: `$${parseFloat(stat.price).toFixed(2)}` },
    { label: 'Open', value: `$${parseFloat(stat.open_price).toFixed(2)}`  }, // 源数据无 open
    { label: 'Previous Close', value: `$${parseFloat(stat.previous_close).toFixed(2)}` },
    { label: 'Day High', value: `$${parseFloat(stat.day_high).toFixed(2)}` },
    { label: 'Day Low', value: `$${parseFloat(stat.day_low).toFixed(2)}` },
    { label: '52W High', value: `$${parseFloat(stat.year_high).toFixed(2)}` },
    { label: '52W Low', value: `$${parseFloat(stat.year_low).toFixed(2)}` },
    { label: 'Volume', value: `${(stat.volume / 1e6).toFixed(2)}M` },
    { label: 'Avg Volume', value: `${(stat.avg_volume / 1e6).toFixed(2)}M` },
    { label: 'ATR (14)', value: stat.atr14 ? `${parseFloat(stat.atr14).toFixed(2)}` : 'N/A' },
    {
      label: '200MA Distance',
      value: stat.ma200_distance
        ? `${parseFloat(stat.ma200_distance).toFixed(2)}%`
        : 'N/A',
      isNegative: stat.ma200_distance && parseFloat(stat.ma200_distance) < 0
    },
    {
      label: 'Relative Volume',
      value: stat.relative_volume ? `${parseFloat(stat.relative_volume).toFixed(2)}x` : 'N/A'
    }
  ]

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  const data = raw.data.data
  let profile = data.profile
  profile.isEtf = profile.isEtf === 0 ? 'No' : 'Yes'
  profile.isFund = profile.isFund === 0 ? 'No' : 'Yes'
  let companyDetails = formatCompanyDetails(data.latest_detail)
  let tradingStats = formatTradingStats(data.trading_stat)
  debugger
  return {profile,companyDetails,tradingStats};
}

export default {
  namespaced: true,
  state: () => ({
    data: [],
    loading: false,
    error: null,
  }),
  getters: {
    companyProfileData: (state) => state.data,
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
    async fetchCompanyProfile({ commit }, val) {
      commit("SET_LOADING", true);
      try {
        const raw = await getCompanyProfile(val);
        const processed = preprocessData(raw);
        // 在這裡做數據預處理
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "CompanyProfile data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
