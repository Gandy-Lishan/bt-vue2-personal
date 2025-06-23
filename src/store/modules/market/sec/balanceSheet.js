import { getBalanceSheet } from "@/service/market";

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
  // 最新年度在前
  const lastedRow = raw[raw.length-1];
  return {
    totalAssets: {
      title: "Total Assets",
      data: {
        totalPremium: formatNumber(lastedRow.total_assets)
      },
    },
    fixedAssets: {
      title: "Fixed Assets",
      data: {
        totalPremium: formatNumber(lastedRow.total_non_current_assets)
      },
    },
    totalLiabilities: {
      title: "Total Liabilities",
      data: {
        totalPremium: formatNumber(lastedRow.total_liabilities)
      },
    },
    totalEquity: {
      title: "Total Equity",
      data: {
        totalPremium: formatNumber(lastedRow.total_equity)
      },
    },

    // Assets
    totalAssetsTrend: {
      title: "Total Assets Trend",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date), 
          'total': formatNumber(i.total_assets), 
          'current': formatNumber(i.total_current_assets), 
          'nonCurrent': formatNumber(i.total_non_current_assets)
        })) || {},
        seriesConfigs: [
          { key: 'total', label: 'Total Assets', color: 'green' },
          { key: 'current', label: 'Current Assets', color: 'blue' },
          { key: 'nonCurrent', label: 'Non-Current Assets', color: 'red' },
        ],
      },
    },
    currentAssets: {
      title: "Current Assets",
      data: [
        { label: 'Cash & Equivalents', value: formatNumber(lastedRow.cash_and_cash_equivalents) },
        { label: 'Short-term Investments', value: formatNumber(lastedRow.short_term_investments) },
        { label: 'Net Receivables', value: formatNumber(lastedRow.net_receivables) },
        { label: 'Inventory', value: formatNumber(lastedRow.inventory) },
        { label: 'Total Current Assets', value: formatNumber(lastedRow.total_current_assets) },
      ]
    },
    nonCurrentAssets: {
      title: "Non-Current Assets",
      data: [
        { label: 'Long-term Investments', value: formatNumber(lastedRow.long_term_investments) },
        { label: 'Property & Equipment', value: formatNumber(lastedRow.property_plant_equipment_net) },
        { label: 'Goodwill', value: formatNumber(lastedRow.goodwill) },
        { label: 'Intangivle Assets', value: formatNumber(lastedRow.intangible_assets) },
        { label: 'Total Non-Current Assets', value: formatNumber(lastedRow.total_non_current_assets) },
      ]
    },

    // Liabilities
    liabilitiesBreakdown: {
      title: "Liabilities Breakdown",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date), 
          'total': formatNumber(i.total_assets), 
          'current': formatNumber(i.total_current_assets), 
          'nonCurrent': formatNumber(i.total_non_current_assets)
        })) || {},
        seriesConfigs: [
          { key: 'total', label: 'Total Liabilities', color: 'green' },
          { key: 'current', label: 'Current Liabilities', color: 'blue' },
          { key: 'nonCurrent', label: 'Non-Current Liabilities', color: 'red' },
        ],
      },
    },
    shareholdersEquityTrend: {
      title: `Shareholders' Equity Trend`,
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date), 
          'total': formatNumber(i.total_assets), 
          'retained': formatNumber(i.total_current_assets), 
          'common': formatNumber(i.total_non_current_assets)
        })) || {},
        seriesConfigs: [
          { key: 'total', label: 'Total Equity', color: 'green' },
          { key: 'retained', label: 'Retained Earnings', color: 'blue' },
          { key: 'common', label: 'Common Stock', color: 'red' },
        ],
      },
    },
    currentLiabilities: {
      title: "Current Liabilities",
      data: [
        { label: 'Accounts Payable', value: formatNumber(lastedRow.account_payables) },
        { label: 'Short-term Debt', value: formatNumber(lastedRow.short_term_debt) },
        { label: 'Deferred Revenue', value: formatNumber(lastedRow.deferred_revenue) },
        { label: 'Current Liabilities', value: formatNumber(lastedRow.total_current_liabilities) },
      ]
    },
    nonCurrentLiabilities: {
      title: "Non-Current Liabilities",
      data: [
        { label: 'Long-term Debt', value: formatNumber(lastedRow.long_term_debt) },
        { label: 'Deferred Revenue (Non-Current)', value: formatNumber(lastedRow.deferred_revenue_non_current) },
        { label: 'Other Non-Current Liabilities', value: formatNumber(lastedRow.other_non_current_liabilities) },
        { label: 'Non-Current Liabilities', value: formatNumber(lastedRow.total_non_current_liabilities) },
      ]
    },
    stockholdersEquity: {
      title: `Stockholders' Equity`,
      data: [
        { label: 'Retained Earnings', value: formatNumber(lastedRow.retained_earnings) },
        { label: 'Common Stock', value: formatNumber(lastedRow.common_stock) },
        { label: 'Treasury Stock', value: NaN },
        { label: `Stockholders' Equity`, value: formatNumber(lastedRow.total_equity) },
      ]
    },

    // Key Ratios
    keyPerformanceMetrics: {
      title: "Key Performance Metrics",
      data: {
        chartData: raw.map(i => ({
          'date': formatUTCDate(i.date), 
          'currtRadio': formatNumber(0), 
          'debt': formatNumber(0), 
          'turnover': formatNumber(0)
        })) || {},
        seriesConfigs: [
          { key: 'currtRadio', label: 'Current Ratio', color: 'green' },
          { key: 'debt', label: 'Debt to Equity', color: 'blue' },
          { key: 'turnover', label: 'Asset Turnover', color: 'red' },
        ],
      },
    },
    liquidityMetrics: {
      title: 'Liquidity Metrics',
      data: [
        { label: 'Current Ratio', value: formatNumber(0) },
        { label: 'Quick Ratio', value: formatNumber(0) },
        { label: 'Cash Ratio', value: formatNumber(0) },
      ]
    },
    assetManagement: {
      title: 'Asset Management',
      data: [
        { label: 'Asset Turnover', value: formatNumber(0) },
        { label: 'Fixed Asset Turnover', value: formatNumber(0) },
        { label: 'Inventory Turnover', value: formatNumber(0) },
      ]
    },
    capitalStructure: {
      title: 'Capital Structure',
      data: [
        { label: 'Debt to Equity', value: formatNumber(0) },
        { label: 'Debt to Capital', value: formatNumber(0) },
        { label: 'Equity Ratio', value: formatNumber(0) },
      ]
    },
    growthAnalysis: {
      title: 'Growth Analysis',
      data: [
        { label: 'Asset Growth', value: formatNumber(0) },
        { label: 'Liabilities Growth', value: formatNumber(0) },
        { label: 'Equity Growth', value: formatNumber(0) },
      ]
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
    balanceSheetData: (state) => state.data,
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
    async fetchBalanceSheet({ commit, rootState }, { symbol, period }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const raw = await getBalanceSheet(symbol, period);
        const processed = preprocessData(raw);
        debugger
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "BalanceSheet data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
