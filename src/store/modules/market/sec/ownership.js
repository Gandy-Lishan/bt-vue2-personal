// store/modules/market/overview.js
import {getOwnership} from "@/service/market";
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

const formatNumber = (value, type, sign) => {
  if (value === null || isNaN(value)) return '-';
  // 自动判断单位
  const absValue = Math.abs(value);
  let formatted;
  if (absValue >= 1e12) {
    formatted = `${(value / 1e12).toFixed(2)}T`;
  } else if (absValue >= 1e9) {
    formatted = `${(value / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    formatted = `${(value / 1e6).toFixed(2)}M`;
  } else if (absValue >= 1e3) {
    formatted = `${(value / 1e3).toFixed(2)}K`;
  } else {
    formatted = `${Number(value).toFixed(2)}`;
  }
  if(type === 'percent') {
    return `${(Number(formatted) * 100).toFixed(2)}%`;
  }
  else if(type === 'avg') {
    return `${Number(formatted) > 0 ? '+' : ''}${formatted}%`
  }
  else if(type === 'dollar') {
    return `$${formatted}`
  }else if(type === 'customSign') {
    return `${formatted}${sign}`
  }
  return formatted;
}

const formatOwnershipInfo = (detail) => [
    { title: 'Average EPS', totalPremium: formatNumber(detail.avg_eps, 'dollar')},
    // { title: 'vs. Est.', totalPremium: `$${Number(detail.avg_eps_est).toFixed(2)}` },
    { title: 'Beat/Miss Ratio', totalPremium: `${Number(detail.beat_count)}/${12-Number(detail.beat_count)}` },
    // { title: `${(parseFloat(detail.beat_rate) * 100).toFixed(2)}%`, totalPremium: 'Beat Rate' },
    { title: 'Average Surprice', totalPremium: formatNumber(detail.avg_eps_surprise, 'avg'), totalPremiumColor: `${Number(detail.avg_eps_surprise) > 0 ? 'green' : 'red'}`  },
    // { title: 'Last', totalPremium: `${Number(detail.last_eps_surprise)}%` },
  ]
const formatOwnershipData = (data) => {
  const InsiderShipData = []
  const InsiderShipChartData = []
  const institutionalHoldingsData = []
  const mutualFundHoldingsData = []
  const insider_data = isJson(data.insider_data.data) ? JSON.parse(data.insider_data.data) : []
  const institutional_holders = isJson(data.holder_data.institutional_holders) ? JSON.parse(data.holder_data.institutional_holders) : []
  const fund_holders = isJson(data.holder_data.fund_holders) ? JSON.parse(data.holder_data.fund_holders) : []
  const {
    insider_activity_annual_trading_volume, 
    insider_activity_buy_sell_ratio, 
    insider_activity_net_buy_sentiment,
    institution_activity_total_holding,
    institution_activity_quarterly_change,
    institution_activity_avg_position,
    mutual_fund_total_holding,
    mutual_fund_unique_funds,
    mutual_fund_avg_holding_size,
  } = data.holder_data
  const ownershipPanels = [
    {
      title: 'Executive Insider Activity',
      data: [
        { label: 'Annual Trading Volume', value: formatNumber(insider_activity_annual_trading_volume, 'dollar') },
        { label: 'Buy/Sell Ratio', value: formatNumber(insider_activity_buy_sell_ratio, 'customSign', 'x') },
        { label: 'Net Buying Sentiment', value: formatNumber(insider_activity_net_buy_sentiment, 'customSign', '%') }
      ]
    },
    {
      title: 'Institutional Activity',
      data: [
        { label: 'Total Holding', value: formatNumber(institution_activity_total_holding, 'dollar') },
        { label: 'Quarterly Change', value: formatNumber(institution_activity_quarterly_change, 'customSign', '%') },
        { label: 'Average Position', value: formatNumber(institution_activity_avg_position, 'dollar') }
      ]
    },
    {
      title: 'Mutual Fund Holdings',
      data: [
        { label: 'Total Fund Holding', value: formatNumber(mutual_fund_total_holding, 'dollar') },
        { label: 'Unique Funds', value: formatNumber(mutual_fund_unique_funds) },
        { label: 'Average Holding Size', value: formatNumber(mutual_fund_avg_holding_size, 'dollar') }
      ]
    }
  ]

  insider_data.forEach((item, index) => {
    const date = formatUTCDate(item.transaction_date);
    InsiderShipData.push({
      date: date,
      insider: item.reporting_name,
      type: item.type,
      shares: item.securities_transacted,
      price: formatNumber(item.price, 'dollar'),
      value: item.value
    })
    const yearStr = `Q${index + 1}'${item.transaction_date.slice(0, 4)}`
    InsiderShipChartData.push({
      date: yearStr,
      insider: item.reporting_name,
      type: item.type,
      shares: item.securities_transacted,
      price: formatNumber(item.price, 'dollar'),
    })
  })
  institutional_holders.forEach((item, index) => {
    institutionalHoldingsData.push({
      name: item.holder,
      date: formatUTCDate(item.date_reported),
      shares: formatNumber(item.shares),
      changes_shares: formatNumber(item.share_change),
      change: formatNumber(item.change_percent, 'customSign', '%'),
      value: formatNumber(item.value, 'dollar')
    })
  })
  fund_holders.forEach((item, index) => {
    mutualFundHoldingsData.push({
      name: item.holder,
      shares: formatNumber(item.shares),
      day_reported: formatUTCDate(item.date_reported),
      value: formatNumber(item.value, 'dollar')
    })
  })
  return {
    InsiderShipData,
    InsiderShipChartData,
    institutionalHoldingsData, 
    mutualFundHoldingsData, 
    institutional_holders,
    ownershipPanels
  }
}

const formatUpcomingEarning = (data) => {
  const UpcomingEarning = []
  const UpcomingEarningColumns = [
    { prop: 'date', label: 'Date', sortable: true, type: 'date' },
    { prop: 'eps_estimated', label: 'Estimated EPS', sortable: true, type: 'number' },
    { prop: 'revenue_estimated', label: 'Est. Revenue', sortable: true, type: 'number' }
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
  let {InsiderShipData, institutionalHoldingsData, mutualFundHoldingsData, ownershipPanels} = formatOwnershipData(data)
  return {
    InsiderShipData, 
    institutionalHoldingsData, 
    mutualFundHoldingsData,
    ownershipPanels
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
    ownershipData: (state) => state.data,
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
    async fetchOwnership({ commit }, val) {
      commit("SET_LOADING", true);
      try {
        const raw = await getOwnership(val)
        const processed = preprocessData(raw);
        console.log('lishan processed', processed)
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "Ownership data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
