// store/modules/market/overview.js
import {getBalanceSheet} from "@/service/market";

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  return raw;
}

export default {
  namespaced: true,
  state: () => ({
    data: [],
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
    async fetchBalanceSheet({ commit }) {
      commit("SET_LOADING", true);
      try {
        const raw = await getBalanceSheet();
        const processed = preprocessData(raw);
        // 在這裡做數據預處理
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "BalanceSheet data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
