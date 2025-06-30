import { getBalanceSheet } from "@/service/market";
import { formatNumber } from '@/utils';

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
    // 比较当前数据的年份与 latestDataYear
    if (year === latestYear) {
      dateStr += ' (TTM)';
    }
  } else {
    dateStr = `${type}'${yearShort}`;
  }

  return dateStr;
};

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
          'date': formatQuartAnnualDate(i.date, i.period, lastedRow.date),
          'total': formatNumber(i.total_assets),
          'current': formatNumber(i.total_current_assets),
          'nonCurrent': formatNumber(i.total_non_current_assets)
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Assets', color: '#16A34A' },
          { key: 'current', label: 'Current Assets', color: '#3B82F6' },
          { key: 'nonCurrent', label: 'Non-Current Assets', color: '#DC2626' },
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
          'date': formatQuartAnnualDate(i.date, i.period, lastedRow.date),
          'total': formatNumber(i.total_liabilities),
          'current': formatNumber(i.total_current_liabilities),
          'nonCurrent': formatNumber(i.total_non_current_liabilities)
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Liabilities', color: '#16A34A' },
          { key: 'current', label: 'Current Liabilities', color: '#3B82F6' },
          { key: 'nonCurrent', label: 'Non-Current Liabilities', color: '#DC2626' },
        ],
      },
    },
    shareholdersEquityTrend: {
      title: `Shareholders' Equity Trend`,
      data: {
        chartData: raw.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRow.date),
          'total': formatNumber(i.total_stockholders_equity),
          'retained': formatNumber(i.retained_earnings),
          'common': formatNumber(i.common_stock)
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Equity', color: '#16A34A' },
          { key: 'retained', label: 'Retained Earnings', color: '#3B82F6' },
          { key: 'common', label: 'Common Stock', color: '#DC2626' },
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
          'date': formatQuartAnnualDate(i.date, i.period, lastedRow.date),
          'currtRadio': formatNumber(i.current_ratio),
          'debt': formatNumber(i.d2e_ratio),
          'turnover': formatNumber(i.asset_turnover)
        })) || [],
        seriesConfigs: [
          { key: 'currtRadio', label: 'Current Ratio', color: '#16A34A' },
          { key: 'debt', label: 'Debt to Equity', color: '#3B82F6' },
          { key: 'turnover', label: 'Asset Turnover', color: '#DC2626' },
        ],
      },
    },
    liquidityMetrics: {
      title: 'Liquidity Metrics',
      data: [
        { label: 'Current Ratio', value: formatNumber(lastedRow.current_ratio) },
        { label: 'Quick Ratio', value: formatNumber(lastedRow.quick_ratio) },
        { label: 'Cash Ratio', value: formatNumber(lastedRow.cash_ratio) },
      ]
    },
    assetManagement: {
      title: 'Asset Management',
      data: [
        { label: 'Asset Turnover', value: formatNumber(lastedRow.asset_turnover) },
        { label: 'Fixed Asset Turnover', value: formatNumber(lastedRow.fixed_asset_turnover) },
        { label: 'Inventory Turnover', value: formatNumber(lastedRow.inventory_turnover) },
      ]
    },
    capitalStructure: {
      title: 'Capital Structure',
      data: [
        { label: 'Debt to Equity', value: formatNumber(lastedRow.d2e_ratio,'percent') },
        { label: 'Debt to Capital', value: formatNumber(lastedRow.d2c_ratio,'percent') },
        { label: 'Equity Ratio', value: formatNumber(lastedRow.equity_ratio,'percent') },
      ]
    },
    growthAnalysis: {
      title: 'Growth Analysis',
      data: [
        { label: 'Asset Growth', value: formatNumber(lastedRow.asset_growth,'percent') },
        { label: 'Liabilities Growth', value: formatNumber(lastedRow.liabilities_growth,'percent') },
        { label: 'Equity Growth', value: formatNumber(lastedRow.equity_growth,'percent') },
      ]
    },
  };
}


export default {
  namespaced: true,
  state: () => ({
    // Initialize data with the full expected structure,
    // but with default/empty values.
    data: {
      totalAssets: { title: "", data: { totalPremium: null } },
      fixedAssets: { title: "", data: { totalPremium: null } },
      totalLiabilities: { title: "", data: { totalPremium: null } },
      totalEquity: { title: "", data: { totalPremium: null } },

      totalAssetsTrend: { title: "", data: { chartData: [], seriesConfigs: [] } },
      currentAssets: { title: "", data: [] },
      nonCurrentAssets: { title: "", data: [] },

      liabilitiesBreakdown: { title: "", data: { chartData: [], seriesConfigs: [] } },
      shareholdersEquityTrend: { title: "", data: { chartData: [], seriesConfigs: [] } },
      currentLiabilities: { title: "", data: [] },
      nonCurrentLiabilities: { title: "", data: [] },
      stockholdersEquity: { title: "", data: [] },

      keyPerformanceMetrics: { title: "", data: { chartData: [], seriesConfigs: [] } },
      liquidityMetrics: { title: "", data: [] },
      assetManagement: { title: "", data: [] },
      capitalStructure: { title: [], data: [] }, // Corrected based on your preprocessData
      growthAnalysis: { title: [], data: [] },   // Corrected based on your preprocessData
    },
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
        // debugger // You can keep this for debugging if needed
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "BalanceSheet data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};