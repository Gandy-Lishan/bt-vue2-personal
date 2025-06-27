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

const raw = [
  {
      Date: "2021-09-01",
      Target: 165,
      MinPrice: 126.1,
      MaxPrice: 153.49,
      ReportNum: 1,
      Accuracy: 70
  },
  {
      Date: "2021-12-01",
      Target: 155,
      MinPrice: 138.27,
      MaxPrice: 165.7,
      ReportNum: 1,
      Accuracy: 100
  },
  {
      Date: "2022-03-01",
      Target: 200,
      MinPrice: 152,
      MaxPrice: 182.94,
      ReportNum: 1,
      Accuracy: 64
  },
  {
      Date: "2022-04-01",
      Target: 190.58,
      MinPrice: 150.1,
      MaxPrice: 179.61,
      ReportNum: 12,
      Accuracy: 72
  },
  {
      Date: "2022-05-01",
      Target: 186.5,
      MinPrice: 150.1,
      MaxPrice: 179.61,
      ReportNum: 4,
      Accuracy: 81
  },
  {
      Date: "2022-06-01",
      Target: 190.2,
      MinPrice: 132.61,
      MaxPrice: 179.61,
      ReportNum: 5,
      Accuracy: 81
  },
  {
      Date: "2022-07-01",
      Target: 194.6,
      MinPrice: 129.04,
      MaxPrice: 178.49,
      ReportNum: 15,
      Accuracy: 75
  },
  {
      Date: "2022-08-01",
      Target: 180.75,
      MinPrice: 129.04,
      MaxPrice: 166.48,
      ReportNum: 4,
      Accuracy: 72
  },
  {
      Date: "2022-09-01",
      Target: 180.53,
      MinPrice: 129.04,
      MaxPrice: 176.15,
      ReportNum: 8,
      Accuracy: 91
  },
  {
      Date: "2022-10-01",
      Target: 177.86,
      MinPrice: 138,
      MaxPrice: 176.15,
      ReportNum: 7,
      Accuracy: 95
  },
  {
      Date: "2022-11-01",
      Target: 188,
      MinPrice: 134.37,
      MaxPrice: 176.15,
      ReportNum: 2,
      Accuracy: 77
  },
  {
      Date: "2022-12-01",
      Target: 191.4,
      MinPrice: 134.37,
      MaxPrice: 164.26,
      ReportNum: 5,
      Accuracy: 52
  },
  {
      Date: "2023-01-01",
      Target: 173.6,
      MinPrice: 125.87,
      MaxPrice: 157.5,
      ReportNum: 5,
      Accuracy: 66
  },
  {
      Date: "2023-03-01",
      Target: 182.5,
      MinPrice: 124.17,
      MaxPrice: 157.38,
      ReportNum: 2,
      Accuracy: 56
  },
  {
      Date: "2023-04-01",
      Target: 158,
      MinPrice: 124.17,
      MaxPrice: 165,
      ReportNum: 5,
      Accuracy: 100
  },
  {
      Date: "2023-05-01",
      Target: 172.25,
      MinPrice: 143.9,
      MaxPrice: 169.85,
      ReportNum: 8,
      Accuracy: 91
  },
  {
      Date: "2023-06-01",
      Target: 199,
      MinPrice: 147.61,
      MaxPrice: 179.35,
      ReportNum: 1,
      Accuracy: 61
  },
  {
      Date: "2023-07-01",
      Target: 192.5,
      MinPrice: 159.78,
      MaxPrice: 194.48,
      ReportNum: 2,
      Accuracy: 100
  },
  {
      Date: "2023-08-01",
      Target: 188.75,
      MinPrice: 164.31,
      MaxPrice: 198.23,
      ReportNum: 4,
      Accuracy: 100
  },
  {
      Date: "2023-09-01",
      Target: 217.5,
      MinPrice: 171.96,
      MaxPrice: 198.23,
      ReportNum: 2,
      Accuracy: 57
  },
  {
      Date: "2023-10-01",
      Target: 220,
      MinPrice: 167.62,
      MaxPrice: 198.23,
      ReportNum: 2,
      Accuracy: 58
  },
  {
      Date: "2023-11-01",
      Target: 225,
      MinPrice: 165.67,
      MaxPrice: 189.98,
      ReportNum: 1,
      Accuracy: 40
  },
  {
      Date: "2023-12-01",
      Target: 225.25,
      MinPrice: 165.67,
      MaxPrice: 192.93,
      ReportNum: 4,
      Accuracy: 45
  },
  {
      Date: "2024-01-01",
      Target: 240,
      MinPrice: 165.67,
      MaxPrice: 199.62,
      ReportNum: 1,
      Accuracy: 45
  },
  {
      Date: "2024-02-01",
      Target: 196.5,
      MinPrice: 173.35,
      MaxPrice: 199.62,
      ReportNum: 2,
      Accuracy: 100
  },
  {
      Date: "2024-05-01",
      Target: 220,
      MinPrice: 164.08,
      MaxPrice: 191.05,
      ReportNum: 1,
      Accuracy: 48
  },
  {
      Date: "2024-06-01",
      Target: 201.67,
      MinPrice: 164.08,
      MaxPrice: 193,
      ReportNum: 3,
      Accuracy: 76
  },
  {
      Date: "2024-07-01",
      Target: 191,
      MinPrice: 164.08,
      MaxPrice: 220.2,
      ReportNum: 4,
      Accuracy: 100
  },
  {
      Date: "2024-08-01",
      Target: 208.86,
      MinPrice: 180.42,
      MaxPrice: 237.23,
      ReportNum: 7,
      Accuracy: 100
  },
  {
      Date: "2024-09-01",
      Target: 241.67,
      MinPrice: 193.63,
      MaxPrice: 237.23,
      ReportNum: 6,
      Accuracy: 90
  },
  {
      Date: "2024-10-01",
      Target: 255,
      MinPrice: 196,
      MaxPrice: 237.23,
      ReportNum: 5,
      Accuracy: 69
  },
  {
      Date: "2024-11-01",
      Target: 255.82,
      MinPrice: 196,
      MaxPrice: 237.49,
      ReportNum: 11,
      Accuracy: 69
  },
  {
      Date: "2024-12-01",
      Target: 270.25,
      MinPrice: 213.92,
      MaxPrice: 237.81,
      ReportNum: 4,
      Accuracy: 42
  },
  {
      Date: "2025-01-01",
      Target: 224.46,
      MinPrice: 219.71,
      MaxPrice: 260.1,
      ReportNum: 2,
      Accuracy: 100
  },
  {
      Date: "2025-02-01",
      Target: 225,
      MinPrice: 219.38,
      MaxPrice: 260.1,
      ReportNum: 3,
      Accuracy: 100
  },
  {
      Date: "2025-03-01",
      Target: 243.42,
      MinPrice: 219.38,
      MaxPrice: 260.1,
      ReportNum: 2,
      Accuracy: 100
  },
  {
      Date: "2025-04-01",
      Target: 238.56,
      MinPrice: 208.42,
      MaxPrice: 250,
      ReportNum: 12,
      Accuracy: 100
  },
  {
      Date: "2025-05-01",
      Target: 275,
      MinPrice: 169.21,
      MaxPrice: 250,
      ReportNum: 1,
      Accuracy: 76
  },
  {
      Date: "2025-06-01",
      Target: 252,
      MinPrice: 169.21,
      MaxPrice: 225.62,
      ReportNum: 1,
      Accuracy: 68
  }
]

const formatData = (data) => {
  const AnalystData = []
  const AnalystDataColumns = [
    { prop: 'date', label: 'Date', width: '120', sortable: true, type: 'date' },
    { prop: 'target', label: 'Target', sortable: true, type: 'number' },
    { prop: 'minPrice', label: 'Min Price', sortable: true, type: 'number' },
    { prop: 'maxPrice', label: 'Max Price', sortable: true, type: 'number' },
    { prop: 'reportNum', label: 'Report Num', sortable: true, type: 'number' },
    { prop: 'accuracy', label: 'Accuracy', sortable: true, type: 'number' },
  ]
  data.forEach((item, index) => {
    AnalystData.push({
      date: item.Date,
      target: formatNumber(item.Target, 'dollar'),
      minPrice: formatNumber(item.MinPrice, 'dollar'),
      maxPrice: formatNumber(item.MaxPrice, 'dollar'),
      reportNum: item.ReportNum,
      accuracy: formatNumber(item.Accuracy, 'customSign', '%')
    })
  })
  return {AnalystData, AnalystDataColumns}
}

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  const data = raw
  let {AnalystData, AnalystDataColumns} = formatData(data)
  return {
    AnalystData, 
    AnalystDataColumns
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
    analystData: (state) => state.data,
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
    async fetchAnalyst({ commit }, val) {
      commit("SET_LOADING", true);
      try {
        // const raw = await getAnalyst(val)
        debugger
        const processed = preprocessData(raw);
        console.log('lishan processed', processed)
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "Analyst data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
