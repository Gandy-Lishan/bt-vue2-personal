// store/modules/market/overview.js
import {getCompanyEarning} from "@/service/market";
import { isJson } from "@/utils";

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

const formatNumber = (value, type) => {
  if (value === null || isNaN(value)) return '-';
  if(type === 'percent') {
    return `${(Number(value) * 100).toFixed(2)}%`;
  }
  else if(type === 'avg') {
    return `${Number(value) > 0 ? '+' : ''}${Number(value).toFixed(2)}%`
  }
  else if(type === 'dollar') {
    return `$${Number(value).toFixed(2)}`
  }
  // 自动判断单位
  const absValue = Math.abs(value);
  let formatted;
  if (absValue >= 1e12) {
    formatted = `${(value / 1e12).toFixed(2)}T`;
  } else if (absValue >= 1e9) {
    formatted = `${(value / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    formatted = `${(value / 1e6).toFixed(2)}M`;
  } else {
    formatted = `${Number(value).toFixed(2)}`;
  }
  return formatted;
}

const formatEarningsInfo = (detail) => [
    { title: 'Average EPS', totalPremium: formatNumber(detail.avg_eps, 'dollar')},
    // { title: 'vs. Est.', totalPremium: `$${Number(detail.avg_eps_est).toFixed(2)}` },
    { title: 'Beat/Miss Ratio', totalPremium: `${Number(detail.beat_count)}/${12-Number(detail.beat_count)}` },
    // { title: `${(parseFloat(detail.beat_rate) * 100).toFixed(2)}%`, totalPremium: 'Beat Rate' },
    { title: 'Average Surprice', totalPremium: formatNumber(detail.avg_eps_surprise, 'avg'), totalPremiumColor: `${Number(detail.avg_eps_surprise) > 0 ? 'green' : 'red'}`  },
    // { title: 'Last', totalPremium: `${Number(detail.last_eps_surprise)}%` },
  ]
const formatEPSData = (data) => {
  const EPSTrendEstimates = []
  const EPSGrowthRate = []
  const EarningSurprise = []
  const RevenueSurprises = []
  const EarningHistory = []
  const EarningHistoryColumns = [
    { prop: 'period', label: 'Period', sortable: true },
    { prop: 'date', label: 'Date', width: '120', sortable: true },
    { prop: 'estimated_eps', label: 'Estimated EPS', sortable: true },
    { prop: 'actual_eps', label: 'Actual EPS', sortable: true },
    { prop: 'surprise', label: 'Surprise', sortable: true },
    { prop: 'est_revenue', label: 'Est. Revenue', sortable: true },
    { prop: 'actual_revenue', label: 'Actual Revenue', sortable: true }
  ]

  data.forEach((item, index) => {
    const date = item.fiscal_date_ending.split("T")[0].split("-")[0].slice(-2);
    const dateStr = `Q${index + 1}'${date}`
    const yearStr = `Q${index + 1}'${item.fiscal_date_ending.slice(0, 4)}`

    EPSTrendEstimates.push({
      date: dateStr,
      estimate: item.eps_estimated,
      actual: item.eps
    })
    EPSGrowthRate.push({
      date: dateStr,
      yoy_growth: formatNumber(item.yoy_growth, 'percent'),
      qoq_growth: formatNumber(item.qoq_growth, 'percent')
    })
    EarningSurprise.push({
      date: dateStr,
      surprise: formatNumber(item.eps_surprise)
    })
    RevenueSurprises.push({
      date: dateStr,
      surprise: formatNumber(item.revenue_surprise)
    })
    EarningHistory.push({
      period: formatUTCDate(item.fiscal_date_ending),
      date: yearStr,
      estimated_eps: formatNumber(item.eps_estimated, 'dollar'),
      actual_eps: formatNumber(item.eps, 'dollar'),
      surprise: formatNumber(item.eps_surprise, 'avg'),
      est_revenue: formatNumber(item.revenue_estimated),
      actual_revenue: formatNumber(item.revenue)
    })
  })
  return {EPSTrendEstimates, EPSGrowthRate, EarningSurprise, RevenueSurprises, EarningHistory, EarningHistoryColumns}
}

const formatUpcomingEarning = (data) => {
  const UpcomingEarning = []
  const UpcomingEarningColumns = [
    { prop: 'date', label: 'Date', sortable: true },
    { prop: 'eps_estimated', label: 'Estimated EPS', sortable: true },
    { prop: 'revenue_estimated', label: 'Est. Revenue', sortable: true }
  ]
  data.forEach((item, index) => {
    UpcomingEarning.push({
      date: formatUTCDate(item.fiscal_date_ending),
      eps_estimated: formatNumber(item.eps_estimated, 'dollar'),
      revenue_estimated: formatNumber(item.revenue_estimated)
    })
  })
  return {UpcomingEarning, UpcomingEarningColumns}
}

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  const data = raw.data.data
  let EarningsInfo = formatEarningsInfo(data.earning_data)
  let {EPSTrendEstimates, EPSGrowthRate, EarningSurprise, RevenueSurprises, EarningHistory, EarningHistoryColumns} = formatEPSData(isJson(data.earning_data.history_earn_data) ? JSON.parse(data.earning_data.history_earn_data) : [])
  let {UpcomingEarning, UpcomingEarningColumns} = formatUpcomingEarning(isJson(data.earning_data.upcoming_earn_data) ? JSON.parse(data.earning_data.upcoming_earn_data) : [])
  return {
    EarningsInfo, 
    EPSTrendEstimates, 
    EPSGrowthRate, 
    EarningSurprise, 
    RevenueSurprises, 
    EarningHistory, 
    EarningHistoryColumns, 
    UpcomingEarning, 
    UpcomingEarningColumns
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
    companyEarningData: (state) => state.data,
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
    async fetchCompanyEarning({ commit }, val) {
      commit("SET_LOADING", true);
      try {
        const raw = await getCompanyEarning(val)
        debugger
        const processed = preprocessData(raw);
        console.log('lishan processed', processed)
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "CompanyEarning data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
