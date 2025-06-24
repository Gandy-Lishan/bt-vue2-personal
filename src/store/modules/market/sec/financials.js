import { getFinancials } from "@/service/market";

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

function preprocessData(raw) {
  const {income, balacneSheet} = raw
  // 最新年度在前
  const lastedRowIncome = income[income.length-1];
  const lastedRowBalacneSheet = balacneSheet[balacneSheet.length-1];
  return {
    marginAnalysis: {
      title: "Margin Analysis",
      data: [
        { label: 'Gross Margin', value: formatNumber(lastedRowIncome.gross_margin,'percent') },
        { label: 'Operating Margin', value: formatNumber(lastedRowIncome.operating_margin,'percent') },
        { label: 'Net Margin', value: formatNumber(lastedRowIncome.net_margin,'percent') },
      ]
    },
    earningsSurprises: {
      title: "Earnings Surprises",
      data: [
        { label: 'Asset Turnover', value: formatNumber(lastedRowIncome.asset_turnover) },
        { label: 'Return on Equity', value: formatNumber(lastedRowIncome.return_on_equity) },
        { label: 'Return on Assets', value: formatNumber(lastedRowIncome.return_on_asset) },
      ]
    },
    financialScores: {
      title: "Financial Scores",
      data: [
        { label: 'Altman Z-Score', value: formatNumber(lastedRowIncome.altman_z_score) },
        { label: 'Piotroski Score', value: formatNumber(lastedRowIncome.piotroski_score) },
      ]
    },

    // Financial Trend
    revebue: {
      title: "Revebue",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date),
          'total': formatNumber(0), 
          'revebue': formatNumber(0), 
        })) || {},
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'revebue', label: 'Revebue', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    grossProfit: {
      title: "Gross Profit",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date),
          'grossProfit': formatNumber(0), 
          'margin': formatNumber(0), 
        })) || {},
        seriesConfigs: [
          { key: 'grossProfit', label: 'Gross Profit', color: '#16A34A' },
          { key: 'margin', label: 'Gross Margin %', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    operating: {
      title: "Operating",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date),
          'operating': formatNumber(0), 
          'margin': formatNumber(0), 
        })) || {},
        seriesConfigs: [
          { key: 'operating', label: 'Operating Income', color: '#16A34A' },
          { key: 'margin', label: 'Operating Margin %', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    netIncome: {
      title: "Net Income",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date),
          'netIncome': formatNumber(0), 
          'margin': formatNumber(0), 
        })) || {},
        seriesConfigs: [
          { key: 'operating', label: 'Net Income', color: '#16A34A' },
          { key: 'margin', label: 'Net Margin %', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    ebitda: {
      title: "EBITDA",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date),
          'ebitda': formatNumber(0), 
          'margin': formatNumber(0), 
        })) || {},
        seriesConfigs: [
          { key: 'ebitda', label: 'EBITDA', color: '#16A34A' },
          { key: 'margin', label: 'EBITDA Margin %', color: '#3B82F6', type: 'line' },
        ],
      },
    },

    // Income Metrics
    incomeMetics: {
      title: "Income Metics",
      data: {
        chartData: lastedRowIncome.map(i => ({
          'date': formatUTCDate(i.date),
          'revenue': formatNumber(0), 
          'netIncome': formatNumber(0), 
          'ebitda': formatNumber(0), 
        })) || {},
        seriesConfigs: [
          { key: 'revenue', label: 'Revenue', color: '#3B82F6' },
          { key: 'netIncome', label: 'Net Income', color: '#16A34A' },
          { key: 'ebitda', label: 'EBITDA', color: '#818CF8' },
        ],
      },
    },
    cashDebt: {
      title: "Cash & Debt Position",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date),
          'cash': formatNumber(0), 
          'totalDebt': formatNumber(0), 
        })) || {},
        seriesConfigs: [
          { key: 'cash', label: 'Cash', color: '#3B82F6' },
          { key: 'totalDebt', label: 'Total Debt', color: '#16A34A' },
        ],
      },
    },
  };
}


export default {
  namespaced: true,
  state: () => ({
    data: [],
    loading: false,
    error: null,
  }),
  getters: {
    financialsData: (state) => state.data,
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
    async fetchFinancials({ commit, rootState }, { symbol, period }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const raw = await getFinancials(symbol, period);
        const processed = preprocessData(raw);
        debugger
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "Financials data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
