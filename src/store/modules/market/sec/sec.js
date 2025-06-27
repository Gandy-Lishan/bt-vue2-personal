// store/modules/market/overview.js
import {getCompanySEC} from "@/service/market";

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

const formatSECData = (data) => {
  const SECData = []
  const SECDataColumns = [
    { prop: 'date', label: 'Date', sortable: true, type: 'date' },
    { prop: 'ticker', label: 'Ticker', sortable: true, type: 'string' },
    { prop: 'description', label: 'Description', sortable: true, type: 'string' },
    { prop: 'from', label: 'From', sortable: true, type: 'string' },
  ]
  data.forEach((item, index) => {
    SECData.push({
      date: formatUTCDate(item.filling_date),
      ticker: item.symbol,
      from: item.sec_type,
      rowLink: item.finalLink,
      description: item.description
    })
  })
  return {SECData, SECDataColumns}
}

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  const data = raw.data.data
  let {SECData, SECDataColumns} = formatSECData(data.sec_data)
  return {
    SECData, 
    SECDataColumns
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
    companySECData: (state) => state.data,
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
    async fetchCompanySEC({ commit }, val) {
      commit("SET_LOADING", true);
      try {
        const raw = await getCompanySEC(val)
        console.log('lishan raw', raw)
        debugger
        const processed = preprocessData(raw);
        console.log('lishan processed', processed)
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "CompanySEC data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
