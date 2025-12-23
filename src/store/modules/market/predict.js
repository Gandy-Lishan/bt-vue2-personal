import { getPredictData } from '@/service/market';
import { formatNumber, isJson } from '@/utils';

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
// Ticker, Prediction End Date, Last Price, Historical Prediction Periods (历史上一共预测的多少期)，Mean Accuracy，Last Period Accuracy，Latest Rating.
const formatData = (data) => {
 const PredictData = []
 const PredictDataColumns = [
  { 
   type: 'link',
   sortable: true,
   link: (row) => `/market/sec/${row.Ticker}/analysts`,
   prop: 'Ticker', 
   label: 'Ticker',
  },
  { 
    prop: 'LastPrice', 
    label: 'Last Price', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.LastPrice, 'dollar'),
    desc: 'The latest price of the stock'
  },
  { 
    prop: 'PredictEndDate', 
    labelHTML: 'Prediction<br/>End Date', 
    sortable: true,
    type: 'date',
    desc: 'The future date to which the forecast applies'
  },
  { 
    prop: 'Target', 
    label: 'Target', 
    sortable: true,
    type: 'number',
    formatter: (row) => row.Target,
    desc: 'The future price to which this forecast applies'
  },
  { 
    prop: 'HistoryPredictionPeriods', 
    labelHTML: 'Total Analyst<br/>Predictions', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.HistoryPredictionPeriods, null, null, true),
    desc: 'The total count of price target estimates made by financial analysts across all historical periods.'
  },
  { 
    prop: 'MeanAcc', 
    labelHTML: 'Mean<br>Accuracy', 
    sortable: true,
    type: 'number',
    formatter: (row) => formatNumber(row.MeanAcc, 'intAndCustomSign', '%', true),
    desc: 'The average forecast accuracy across all historical periods'
  },
  // { 
  //   prop: 'LastPeriodAcc', 
  //   labelHTML: 'Last<br/>Period Accuracy', 
  //   sortable: true,
  //   type: 'number',
  //   formatter: (row) => formatNumber(row.LastPeriodAcc, 'intAndCustomSign', '%', true),
  //   desc: 'The forecast accuracy for the most recent period'
  // },
  { 
    prop: 'LatestRating', 
    labelHTML: 'Latest Rating', 
    sortable: true,
    type: 'string',
    formatter: (row) => (row.LatestRating),
    desc: 'A rating based on recent performance'
  }
 ]
 data.forEach((item, index) => {
   PredictData.push({
    Ticker: item.Ticker,
    LastPrice: item.Close,
    PredictEndDate: formatUTCDate(item.PredictEndDate),
    Target: item.Target,
    HistoryPredictionPeriods: item.history_count,
    MeanAcc: item.MeanAcc,
    LastPeriodAcc: item.LastWinRate,
    LatestRating: item.latest_rating,
   }) 
 })
 return {PredictData, PredictDataColumns}
}

function preprocessData(raw) {
  debugger
 // 處理 raw 為你需要的格式
 const data = isJson(raw.data.data.all_pred_data) ? JSON.parse(raw.data.data.all_pred_data) : raw.data.data.all_pred_data
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
      const res = await getPredictData(val)
      const processed = preprocessData(res);
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
