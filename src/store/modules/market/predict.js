import predInfo from './pred_info_df.json';
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
    sortable: true,
    type: 'date',
  },
  { 
    prop: 'PublishPrice', 
    labelHTML: 'Publish<br>Price', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.PublishPrice, 'dollar')
  },
  { 
    prop: 'Target',   
    label: 'Target', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.Target, 'dollar')
  },
  { 
    prop: 'PredictEndDate', 
    labelHTML: 'Predict<br>End Date', 
    sortable: true,
    type: 'date',
  },
  { 
    prop: 'PhaseMinPrice', 
    label: 'Min Price', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.PhaseMinPrice, 'dollar')
  },
  { 
    prop: 'PhaseMaxPrice', 
    label: 'Max Price', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.PhaseMaxPrice, 'dollar')
  },
  { 
    prop: 'Close', 
    label: 'Close', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.Close, 'dollar')
  },
  { 
    prop: 'MeanAcc', 
    labelHTML: 'Mean<br>Accuracy', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.MeanAcc, 'customSign', '%')
  },
  { 
    prop: 'LastWinRate', 
    labelHTML: 'Last<br>Win Rate', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.LastWinRate, 'customSign', '%')
  }
 ]
 data.forEach((item, index) => {
   PredictData.push({
    Ticker: item.Ticker,
    PublishTime: formatUTCDate(item.PublishTime),
    PublishPrice: item.PublishPrice,
    Target: item.Target,
    PredictEndDate: formatUTCDate(item.PredictEndDate),
    PhaseMinPrice: item.PhaseMinPrice,
    PhaseMaxPrice: item.PhaseMaxPrice,
    Date: formatUTCDate(item.Date),
    Close: item.Close,
    MeanAcc: item.MeanAcc,
    LastWinRate: item.LastWinRate,
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
