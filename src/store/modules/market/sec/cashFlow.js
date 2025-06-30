import { getCashFlow } from "@/service/market";

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
const formatQuartAnnualDate = (isoStr, type, latestDate) => {
  const year = isoStr.split("T")[0].split("-")[0];
  const yearShort = year.slice(-2);
  const latestYear = latestDate.split("T")[0].split("-")[0];
  let dateStr;

  if (type === 'FY') {
    dateStr = year;
    // // 比较当前数据的年份与 latestDataYear
    // if (year === latestYear) {
    //   dateStr += ' (TTM)';
    // }
  } else {
    dateStr = `${type}'${yearShort}`;
  }

  return dateStr;
};

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

function preprocessData(raw) {
  // 最新年度在前
  const lastedRow = raw[raw.length-1];
  return {
    operatingCashFlow: {
      title: "Operating Cash Flow",
      data: {
        totalPremium: formatNumber(lastedRow.net_cash_provided_by_operating_activities)
      },
    },
    freeCashFlow: {
      title: "Free Cash Flow",
      data: {
        totalPremium: formatNumber(lastedRow.free_cash_flow)
      },
    },
    cashBalance: {
      title: "Cash Balance",
      data: {
        totalPremium: formatNumber(lastedRow.cash_at_end_of_period)
      },
    },

    // Charts
    cashFlowComponents: {
      title: "Cash Flow Components",
      data: {
        chartData: raw.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRow.date),
          'operating': formatNumber(i.net_cash_provided_by_operating_activities), 
          'inversting': formatNumber(-(i.net_cash_used_for_investing_activities)), 
          'financing': formatNumber(i.net_cash_used_provided_by_financing_activities)
        })) || {},
        seriesConfigs: [
          { key: 'operating', label: 'Operating', color: '#16A34A' },
          { key: 'inversting', label: 'Inversting', color: '#3B82F6' },
          { key: 'financing', label: 'Financing', color: '#DC2626' },
        ],
      },
    },
    freeCashFlowTrend: {
      title: "Free Cash Flow Trend",
      data: {
        chartData: raw.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRow.date),
          'freeCashFlow': formatNumber(i.free_cash_flow),
        })) || {},
        seriesConfigs: [
          { key: 'freeCashFlow', label: 'Free Cash Flow', color: '#818CF8' },
        ],
      },
    },

    operatingActivities: {
      title: "Operating Activities",
      data: [
        { label: 'Net Income', value: formatNumber(lastedRow.net_income) },
        { label: 'Depreciation & Amortization', value: formatNumber(lastedRow.depreciation_and_amortization) },
        { label: 'Changes in Working Capital', value: formatNumber(lastedRow.change_in_working_capital) },
        { label: 'Net Cash From Operations', value: formatNumber(lastedRow.net_cash_provided_by_operating_activities) },
      ]
    },
    investingActivities: {
      title: "Investing Activities",
      data: [
        { label: 'Capital Expenditure', value: formatNumber(lastedRow.capital_expenditure) },
        { label: 'Acquisitions', value: formatNumber(lastedRow.acquisitions_net) },
        { label: 'Net Cash From Investing', value: formatNumber(lastedRow.net_cash_used_for_investing_activities) },
      ]
    },
    financingActivities: {
      title: "Financing Activities",
      data: [
        { label: 'Debt Repayment', value: formatNumber(lastedRow.debt_repayment) },
        { label: 'Stock Repurchase', value: formatNumber(-(lastedRow.common_stock_repurchased)) },
        { label: 'Dividends Paid', value: formatNumber(lastedRow.dividends_paid) },
        { label: 'Net Cash From Financing', value: formatNumber(lastedRow.net_cash_used_provided_by_financing_activities) },
      ]
    },
    summary: {
      title: "Summary",
      data: [
        { label: 'Net Change in Cash', value: formatNumber(lastedRow.net_change_in_cash) },
        { label: 'Free Cash Flow', value: formatNumber(lastedRow.free_cash_flow) },
        { label: 'Ending Cash Balance', value: formatNumber(lastedRow.cash_at_end_of_period) },
      ]
    },

    // the last row
    efficiencyMetrics: {
      title: "Efficiency Metrics",
      data: [
        { label: 'Gross Operating Cash Flow Ratio', value: formatNumber(lastedRow.operating_cash_flow_ratio) },
        { label: 'Cash Flow Yield', value: formatNumber(lastedRow.cash_flow_yield,'percent') },
        { label: 'Cash Conversion Cycle', value: formatNumber(lastedRow.cash_conversion_cycle) },
        { label: 'Operating Cash Flow Growth', value: formatNumber(lastedRow.operating_cash_flow_growth,'percent') },
        { label: 'Free Cash Flow Growth', value: formatNumber(lastedRow.free_cash_flow_growth,'percent') },
      ]
    },
    capitalAllocation: {
      title: "Capital Allocation",
      data: [
        { label: 'Reinvestment Rate', value: formatNumber(lastedRow.reinvestment_rate,'percent') },
        { label: 'CapEx to Operating Cash', value: formatNumber(lastedRow.capEx2operating_cash,'percent') },
        { label: 'Cash Flow Coverage', value: formatNumber(lastedRow.cash_flow_coverage) },
        { label: 'Cash Conversion Change', value: formatNumber(lastedRow.cash_conversion_change) },
        { label: 'Operating Ratio Change', value: formatNumber(lastedRow.operating_ratio_change) },
      ]
    },
    sustainabilityMetrics: {
      title: "Sustainability Metrics",
      data: [
        { label: 'Free Cash Flow Margin', value: formatNumber(lastedRow.free_cash_flow_margin,'percent') },
        { label: 'Cash Flow to Debt', value: formatNumber(lastedRow.free_flow2debt) },
      ]
    },
  };
}


export default {
  namespaced: true,
  state: () => ({
    data: {
      operatingCashFlow: { title: "", data: { totalPremium: null } },
      freeCashFlow: { title: "", data: { totalPremium: null } },
      cashBalance: { title: "", data: { totalPremium: null } },
      cashFlowComponents: { title: "", data: { chartData: [], seriesConfigs: [] } },
      freeCashFlowTrend: { title: "", data: { chartData: [], seriesConfigs: [] } },
      operatingActivities: { title: "", data: [] },
      investingActivities: { title: "", data: [] },
      financingActivities: { title: "", data: [] },
      summary: { title: "", data: [] },
      efficiencyMetrics: { title: "", data: [] },
      capitalAllocation: { title: "", data: [] },
      sustainabilityMetrics: { title: "", data: [] },
    },
    loading: false,
    error: null,
  }),
  getters: {
    cashFlowData: (state) => state.data,
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
    async fetchCashFlow({ commit, rootState }, { symbol, period }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const raw = await getCashFlow(symbol, period);
        const processed = preprocessData(raw);
        debugger
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "cashFlow data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
