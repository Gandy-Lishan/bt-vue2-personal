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

const formatFinancialsTrendInfo = (lastedRowIncome) => {
  // Return default structure if lastedRowIncome is undefined/null
  if (!lastedRowIncome) {
    return {
      revenue: { title: 'Current Revenue', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      grossProfit: { title: 'Current Gross Profit', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      operating: { title: 'Current Operating', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      netIncome: { title: 'Current Net Income', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      ebitda: { title: 'Current EBITDA', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
    };
  }

  return {
    revenue: {
      title: 'Current Revenue', 
      current: formatNumber(lastedRowIncome.revenue),
      yoy: `${Number(lastedRowIncome.revenue_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.revenue_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.revenue_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.revenue_ratio, 'percent'),
    },
    grossProfit: {
      title: 'Current Gross Profit',
      current: formatNumber(lastedRowIncome.gross_profit),
      yoy: `${Number(lastedRowIncome.gross_profit_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.gross_profit_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.gross_profit_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.gross_profit_ratio, 'percent'),
    },
    operating: {
      title: 'Current Operating', 
      current: formatNumber(lastedRowIncome.operating_income),
      yoy: `${Number(lastedRowIncome.operating_income_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.operating_income_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.operating_income_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.operating_income_ratio, 'percent'),
    },
    netIncome: {
      title: 'Current Net Income', 
      current: formatNumber(lastedRowIncome.net_income),
      yoy: `${Number(lastedRowIncome.net_income_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.net_income_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.net_income_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.net_income_ratio, 'percent'),
    },
    ebitda: {
      title: 'Current EBITDA', 
      current: formatNumber(lastedRowIncome.ebitda),
      yoy: `${Number(lastedRowIncome.ebitda_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.ebitda_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.ebitda_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.ebitda_ratio, 'percent'),
    },
  }
}

function preprocessData(raw) {
  const {income, balanceSheet} = raw;
  // Make sure income and balanceSheet are arrays and not empty
  const lastedRowIncome = income && income.length > 0 ? income[income.length-1] : {};
  const lastedRowBalanceSheet = balanceSheet && balanceSheet.length > 0 ? balanceSheet[balanceSheet.length-1] : {};
  const totalDebtList = balanceSheet ? balanceSheet.map(i=>i.total_debt) : [];

  let res = {
    marginAnalysis: {
      title: "Margin Analysis",
      data: [
        { label: 'Gross Margin', value: formatNumber(lastedRowIncome.gross_margin,'percent') },
        { label: 'Operating Margin', value: formatNumber(lastedRowIncome.operating_margin,'percent') },
        { label: 'Net Margin', value: formatNumber(lastedRowIncome.net_margin,'percent') },
      ]
    },
    earningsSurprises: { // Note: Your data for this section seems to be more like 'Profitability Ratios' than 'Earnings Surprises'
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
    financialsTrendInfo: formatFinancialsTrendInfo(lastedRowIncome),
    revenue: {
      title: "Revenue",
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRowIncome.date),
          'total': formatNumber(totalDebtList[index]),
          'revenue': formatNumber(i.revenue),
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'revenue', label: 'Revenue', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    grossProfit: {
      title: "Gross Profit",
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRowIncome.date),
          'total': formatNumber(totalDebtList[index]),
          'grossProfit': formatNumber(i.gross_profit),
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'grossProfit', label: 'Gross Profit', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    operating: {
      title: "Operating",
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRowIncome.date),
          'total': formatNumber(totalDebtList[index]),
          'operating': formatNumber(i.operating_income),
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'operating', label: 'Operating Income', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    netIncome: {
      title: "Net Income",
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRowIncome.date),
          'total': formatNumber(totalDebtList[index]),
          'netIncome': formatNumber(i.net_income),
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'netIncome', label: 'Net Income', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    ebitda: {
      title: "EBITDA",
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRowIncome.date),
          'total': formatNumber(totalDebtList[index]),
          'ebitda': formatNumber(i.ebitda),
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'ebitda', label: 'EBITDA', color: '#3B82F6', type: 'line' },
        ],
      },
    },

    // Income Metrics
    incomeMetics: {
      title: "Income Metics",
      data: {
        chartData: income.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRowIncome.date),
          'revenue': formatNumber(i.revenue),
          'netIncome': formatNumber(i.net_income),
          'ebitda': formatNumber(i.ebitda),
        })) || [],
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
        chartData: balanceSheet.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period, lastedRowBalanceSheet.date),
          'cash': formatNumber(i.cash_and_cash_equivalents),
          'totalDebt': formatNumber(i.total_debt),
        })) || [],
        seriesConfigs: [
          { key: 'cash', label: 'Cash', color: '#3B82F6' },
          { key: 'totalDebt', label: 'Total Debt', color: '#16A34A' },
        ],
      },
    },
  };
  return res
}


export default {
  namespaced: true,
  state: () => ({
    // Initialize data with the full expected structure,
    // but with default/empty values.
    data: {
      marginAnalysis: { title: "", data: [] },
      earningsSurprises: { title: "", data: [] },
      financialScores: { title: "", data: [] },

      financialsTrendInfo: { // This structure matches `formatFinancialsTrendInfo`
        revenue: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
        grossProfit: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
        operating: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
        netIncome: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
        ebitda: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      },
      revenue: { title: "", data: { chartData: [], seriesConfigs: [] } },
      grossProfit: { title: "", data: { chartData: [], seriesConfigs: [] } },
      operating: { title: "", data: { chartData: [], seriesConfigs: [] } },
      netIncome: { title: "", data: { chartData: [], seriesConfigs: [] } },
      ebitda: { title: "", data: { chartData: [], seriesConfigs: [] } },

      incomeMetics: { title: "", data: { chartData: [], seriesConfigs: [] } },
      cashDebt: { title: "", data: { chartData: [], seriesConfigs: [] } },
    },
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
        // Add checks for raw.income and raw.balanceSheet before accessing
        // This is crucial because if getFinancials returns an empty or malformed object,
        // trying to access raw.income or raw.balanceSheet will cause an error
        // before preprocessData even runs.
        if (!raw || !raw.income || !Array.isArray(raw.income) || !raw.balanceSheet || !Array.isArray(raw.balanceSheet)) {
          throw new Error("Invalid financial data received.");
        }
        const processed = preprocessData(raw);
        // debugger // You can keep this for debugging if needed
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "Financials data error."); // Use err.message for consistency
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};