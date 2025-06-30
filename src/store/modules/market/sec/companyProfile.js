// store/modules/market/overview.js
import {getCompanyProfile} from "@/service/market";
import { formatNumber } from '@/utils';

const formatCompanyDetails = (detail) => [
    { label: 'Market Cap', value: formatNumber(detail.market_cap, 'dollar') },
    { label: 'P/E Ratio', value: formatNumber(detail.pe_ratio) },
    { label: 'P/B Ratio', value: formatNumber(detail.pb_ratio) },
    { label: 'EV/Sales', value: formatNumber(detail.ev_to_sales) },
    { label: 'EV/EBITDA', value: formatNumber(detail.enterprise_value_over_ebitda) },
    { label: 'P/S Ratio', value: formatNumber(detail.price_to_sales_ratio) },
    { label: 'Beta', value: formatNumber(detail.beta) }, // 源数据中无 beta，可根据需要补充
    { label: 'Return on Equity', value: formatNumber(detail.roe, 'percent') },
    { label: 'ROIC', value: formatNumber(detail.roic, 'percent') },
    { label: 'Current Ratio', value: formatNumber(detail.current_ratio) },
    { label: 'FCF Yield', value: formatNumber(detail.free_cash_flow_yield, 'percent') },
    { label: 'Dividend Yield', value: formatNumber(detail.dividend_yield, 'percent') }
  ]
  
const formatTradingStats = (stat) => [
    { label: 'Price', value: formatNumber(stat.price, 'dollar') },
    { label: 'Open', value: formatNumber(stat.open_price, 'dollar')  }, // 源数据无 open
    { label: 'Previous Close', value: formatNumber(stat.previous_close, 'dollar') },
    { label: 'Day High', value: formatNumber(stat.day_high, 'dollar') },
    { label: 'Day Low', value: formatNumber(stat.day_low, 'dollar') },
    { label: '52W High', value: formatNumber(stat.year_high, 'dollar') },
    { label: '52W Low', value: formatNumber(stat.year_low, 'dollar') },
    { label: 'Volume', value: formatNumber(stat.volume) },
    { label: 'Avg Volume', value: formatNumber(stat.avg_volume) },
    { label: 'ATR (14)', value: formatNumber(stat.atr14) },
    {
      label: '200MA Distance',
      value: `${formatNumber(stat.ma200_distance, 'customSign', '%')}`,
      isNegative: stat.ma200_distance && parseFloat(stat.ma200_distance) < 0
    },
    {
      label: 'Relative Volume',
      value: `${formatNumber(stat.relative_volume, 'customSign', 'x')}`
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
