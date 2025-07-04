// store/modules/market/overview.js
import {getCompanyEarning} from "@/service/market";
import { isJson, formatNumber } from "@/utils";

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
const formatQuartAnnualDate = (isoStr, type) => {
  const year = isoStr.split("T")[0].split("-")[0];
  const yearShort = year.slice(-2);
  let dateStr;

  if (type === 'FY') {
    dateStr = year;
  } else {
    dateStr = formatQuartStr(type,yearShort);
  }
  return dateStr;
}

const formatQuartStr = (str, yearShort) => {
  const num = str[1]
  const num_res = Number(num) - 1 > 0 ? num - 1 : 4
  const year_res = Number(num) - 1 > 0 ? Number(yearShort) : Number(yearShort) - 1
  return 'Q' + num_res + ' ' + year_res
}

const formatEarningsInfo = (detail) => [
    { title: 'Average EPS', totalPremium: formatNumber(detail.avg_eps, 'dollar'), desc: `<p><strong>Earnings Per Share (EPS)</strong> is calculated as <strong>Net Income</strong> divided by the <strong>number of outstanding common shares</strong>. This is one of the most<br /> closely watched metrics by investors because it directly reflects the <strong>profit a company generates for each share of its stock</strong>.</p>`},
    // { title: 'vs. Est.', totalPremium: `$${Number(detail.avg_eps_est).toFixed(2)}` },
    { title: 'Beat/Miss Ratio', totalPremium: `${Number(detail.beat_count)}/${Number(detail.miss_count)}`, desc: `<p>The <strong>Beat/Miss Ratio (EPS)</strong> measures the frequency with which a company's actual earnings (or revenue) exceed or fall short of analyst expectations.</p>` },
    // { title: `${(parseFloat(detail.beat_rate) * 100).toFixed(2)}%`, totalPremium: 'Beat Rate' },
    { title: 'Average Surprice', totalPremium: formatNumber(detail.avg_eps_surprise, 'avg'), totalPremiumColor: `${Number(detail.avg_eps_surprise) > 0 ? 'green' : 'red'}`, desc: `<p><strong>Average Surprise</strong> is the average percentage difference between a company's actual earnings (or revenue) and analyst expectations.</p>`  },
    // { title: 'Last', totalPremium: `${Number(detail.last_eps_surprise)}%` },
  ]
const formatEPSData = (data) => {
  const EPSTrendEstimates = []
  const EPSGrowthRate = {
    yoy: [],
    qoq: []
  }
  const EarningSurprise = []
  const RevenueSurprises = []
  const EarningHistory = []
  const EarningHistoryColumns = [
    { prop: 'period', label: 'Period', sortable: true, type: 'date'},
    { prop: 'date', label: 'Date', width: '120', sortable: true, type: 'quarter' },
    { prop: 'estimated_eps', label: 'Estimated EPS', sortable: true, type: 'number', formatter: (row) => formatNumber(row.estimated_eps, 'dollar'), desc: `Estimated EPS refers to analysts' consensus forecast for Earnings Per Share (EPS) for the reported period.` },
    { prop: 'actual_eps', label: 'Actual EPS', sortable: true, type: 'number', formatter: (row) => formatNumber(row.actual_eps, 'dollar'), desc: `Actual EPS refers to the Earnings Per Share (EPS) a company actually reports.` },
    { prop: 'surprise', label: 'Surprise', sortable: true, type: 'number', formatter: (row) => formatNumber(row.surprise, 'avg'), desc: `Surprise refers to the absolute or percentage difference between actual EPS and estimated EPS.` },
    { prop: 'est_revenue', label: 'Est. Revenue', sortable: true, type: 'number', formatter: (row) => formatNumber(row.est_revenue), desc: `Estimated Revenue refers to analysts' consensus forecast for a company's total revenue for the reported period.` },
    { prop: 'actual_revenue', label: 'Actual Revenue', sortable: true, type: 'number', formatter: (row) => formatNumber(row.actual_revenue), desc: `Actual Revenue refers to the total revenue a company actually reports.` }
  ]
debugger
  data.forEach((item, index) => {
    // const date = item.fiscal_date_ending.split("T")[0].split("-")[0].slice(-2);
    // const dateStr = `Q${index + 1}'${date}`
    // const yearStr = `Q${index + 1}'${item.fiscal_date_ending.slice(0, 4)}`

    const dateStr = formatQuartAnnualDate(item.fiscal_date_ending, item.period)

    EPSTrendEstimates.push({
      date: dateStr,
      estimate: item.eps_estimated,
      actual: item.eps
    })
    EPSGrowthRate.yoy.push({
      period: dateStr,
      value: formatNumber(item.yoy_growth, 'percent'),
    })
    EPSGrowthRate.qoq.push({
      period: dateStr,
      value: formatNumber(item.qoq_growth, 'percent')
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
      date: dateStr,
      estimated_eps: item.eps_estimated,
      actual_eps: item.eps,
      surprise: item.eps_surprise,
      est_revenue: item.revenue_estimated,
      actual_revenue: item.revenue
    })
  })
  return {EPSTrendEstimates, EPSGrowthRate, EarningSurprise, RevenueSurprises, EarningHistory, EarningHistoryColumns}
}

const formatUpcomingEarning = (data) => {
  const UpcomingEarning = []
  const UpcomingEarningColumns = [
    { prop: 'date', label: 'Date', sortable: true, type: 'date', desc: `<p><strong>Period Ending</strong> refers to the <strong>accounting period to which an upcoming earnings report pertains</strong> (for example, the second quarter of 2024 would end on June 30th).</p>` },
    { prop: 'eps_estimated', label: 'Estimated EPS', sortable: true, type: 'number', formatter: (row) => formatNumber(row.eps_estimated, 'dollar'), desc: `<p><strong>Period Ending</strong> refers to the <strong>accounting period to which an upcoming earnings report pertains</strong> (for example, the second quarter of 2024 would end on June 30th).</p>` },
    { prop: 'revenue_estimated', label: 'Est. Revenue', sortable: true, type: 'number', formatter: (row) => formatNumber(row.revenue_estimated), desc: `<p><strong>EPS Estimate</strong> refers to the <strong>latest consensus forecast for Earnings Per Share (EPS)</strong> by analysts for the reported period.</p>` }
  ]
  data.forEach((item, index) => {
    UpcomingEarning.push({
      date: formatUTCDate(item.fiscal_date_ending),
      eps_estimated: item.eps_estimated,
      revenue_estimated: item.revenue_estimated
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
