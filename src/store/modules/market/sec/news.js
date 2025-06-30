// store/modules/market/overview.js
import {getCompanyNews} from "@/service/market";
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
const formatDateUTC = (dateStr) => {
  const date = new Date(dateStr);  // ISO 字符串自动按 UTC 解析

  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();

  let hour = date.getUTCHours();
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${month}/${day}/${year} ${hour}:${minute} ${ampm}`;
}

const formatCompanyNewsData = (data) => {
  const companyNewsData = []
  const companyNewsDataColumns = [
    { prop: 'time', label: 'Time', sortable: true, width: '150px', type: 'date' },
    { prop: 'symbol', label: 'Symbol', sortable: true, width: '100px', type: 'string' },
    { prop: 'title', label: 'Title', sortable: true, type: 'string' },
    { prop: 'image', label: 'Source', type: 'image', imageWidth: '100px', imageHeight: '20px', width: '120px' },
  ]
  data.forEach((item, index) => {
    companyNewsData.push({
      time: formatDateUTC(item.published_date),
      symbol: item.symbol,
      title: item.news_title,
      source: item.source,
      rowLink: item.news_url,
      image: item.image_url
    })
  })
  return {companyNewsData, companyNewsDataColumns}
}

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  const data = raw.data.data
  let {companyNewsData, companyNewsDataColumns} = formatCompanyNewsData(data.news_data)
  return {
    companyNewsData, 
    companyNewsDataColumns
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
    companyNewsData: (state) => state.data,
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
    async fetchCompanyNews({ commit }, val) {
      commit("SET_LOADING", true);
      try {
        const raw = await getCompanyNews(val)
        const processed = preprocessData(raw);
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "CompanyNews data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
