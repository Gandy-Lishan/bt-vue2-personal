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
  } else {
    dateStr = `${type}'${yearShort}`;
  }

  // 比较当前数据的年份与 latestDataYear
  if (year === latestYear) {
    dateStr += ' (TTM)';
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
  return {
    revenue: {
      current: formatNumber(lastedRowIncome.revenue),
      yoy: `${Number(lastedRowIncome.revenue_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.revenue_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.revenue_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.revenue_ratio, 'percent'),
    },
    grossProfit: {
      current: formatNumber(lastedRowIncome.gross_profit),
      yoy: `${Number(lastedRowIncome.gross_profit_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.gross_profit_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.gross_profit_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.gross_profit_ratio, 'percent'),
    },
    operating: {
      current: formatNumber(lastedRowIncome.operating_income),
      yoy: `${Number(lastedRowIncome.operating_income_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.operating_income_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.operating_income_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.operating_income_ratio, 'percent'),
    },
    netIncome: {
      current: formatNumber(lastedRowIncome.net_income),
      yoy: `${Number(lastedRowIncome.net_income_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.net_income_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.net_income_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.net_income_ratio, 'percent'),
    },
    ebitda: {
      current: formatNumber(lastedRowIncome.ebitda),
      yoy: `${Number(lastedRowIncome.ebitda_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.ebitda_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.ebitda_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.ebitda_ratio, 'percent'),
    },
  }
}

function preprocessData(raw) {
  const {income, balanceSheet} = raw
  // 最新年度在前
  const lastedRowIncome = income[income.length-1];
  const lastedRowBalanceSheet = balanceSheet[balanceSheet.length-1];
  const totalDebtList = balanceSheet.map(i=>i.total_debt)
  debugger
  let res = {
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
        commit("SET_ERROR", err || "Financials data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
