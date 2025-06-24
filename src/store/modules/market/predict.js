import predInfo from './pred_info_df.json';

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
   formatted = `${(value / 1e12)}T`;
 } else if (absValue >= 1e9) {
   formatted = `${(value / 1e9)}B`;
 } else if (absValue >= 1e6) {
   formatted = `${(value / 1e6)}M`;
 } else if (absValue >= 1e3) {
   formatted = `${(value / 1e3)}K`;
 } else {
   formatted = `${Number(value)}`;
 }
 if(type === 'percent') {
   return `${(Number(formatted) * 100).toFixed(2)}%`;
 }
 else if(type === 'avg') {
   return `${Number(formatted) > 0 ? '+' : ''}${formatted}%`
 }
 else if(type === 'dollar') {
   return `$${Number(formatted).toFixed(2)}`
 }else if(type === 'customSign') {
   return `${Number(formatted).toFixed(2)}${sign}`
 }
 return Number(formatted).toFixed(2);
}

const formatData = (data) => {
 const PredictData = []
 const PredictDataColumns = [
  { 
   type: 'link',
   sortable: true,
   link: (row) => `/market/sec/${row.Ticker}`,
   prop: 'Ticker', 
   label: 'Ticker', 
  },
  { 
    prop: 'PublishTime', 
    labelHTML: 'Publish<br>Time', 
    sortable: true 
  },
  { 
    prop: 'PublishPrice', 
    labelHTML: 'Publish<br>Price', 
    sortable: true
  },
  { 
    prop: 'Target',   
    label: 'Target', 
    sortable: true
  },
  { 
    prop: 'PredictEndDate', 
    labelHTML: 'Predict<br>End Date', 
    sortable: true 
  },
  { 
    prop: 'PhaseMinPrice', 
    label: 'Min Price', 
    sortable: true
  },
  { 
    prop: 'PhaseMaxPrice', 
    label: 'Max Price', 
    sortable: true
  },
  { 
    prop: 'Close', 
    label: 'Close', 
    sortable: true
  },
  { 
    prop: 'MeanAcc', 
    labelHTML: 'Mean<br>Accuracy', 
    sortable: true
  },
  { 
    prop: 'LastWinRate', 
    labelHTML: 'Last<br>Win Rate', 
    sortable: true
  }
 ]
 data.forEach((item, index) => {
   PredictData.push({
    Ticker: item.Ticker,
    PublishTime: formatUTCDate(item.PublishTime),
    PublishPrice: formatNumber(item.PublishPrice, 'dollar'),
    Target: formatNumber(item.Target, 'dollar'),
    PredictEndDate: formatUTCDate(item.PredictEndDate),
    PhaseMinPrice: formatNumber(item.PhaseMinPrice, 'dollar'),
    PhaseMaxPrice: formatNumber(item.PhaseMaxPrice, 'dollar'),
    Date: formatUTCDate(item.Date),
    Close: formatNumber(item.Close, 'dollar'),
    MeanAcc: formatNumber(item.MeanAcc, 'customSign', '%'),
    LastWinRate: formatNumber(item.LastWinRate, 'customSign', '%')
   }) 
 })
 return {PredictData, PredictDataColumns}
}

function preprocessData(raw) {
 // 處理 raw 為你需要的格式
 const data = raw
 let {PredictData, PredictDataColumns} = formatData(data)
 return {
   PredictData, 
   PredictDataColumns
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
   predictData: (state) => state.data,
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
   async fetchPredict({ commit }, val) {
     commit("SET_LOADING", true);
     try {
      debugger
       const processed = preprocessData(predInfo);
       console.log('lishan processed', processed)
       commit("SET_DATA", processed);
     } catch (err) {
       commit("SET_ERROR", err.message || "Predict data error.");
     } finally {
       commit("SET_LOADING", false);
     }
   },
 },
};
