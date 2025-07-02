// store/modules/market/overview.js
import {getCompanyProfile} from "@/service/market";
import { formatNumber } from '@/utils';

const formatCompanyDetails = (detail) => [
    { label: 'Market Cap', value: formatNumber(detail.market_cap, 'dollar'), desc: `Market cap is the most direct indicator of a company's size. It's calculated by multiplying<br /> the total number of outstanding shares by the current stock price. This figure represents<br /> the company's total value in the stock market. A larger market cap generally signifies a larger<br /> company and stronger market influence.`},
    { label: 'P/E Ratio', value: formatNumber(detail.pe_ratio), desc: `The Price-to-Earnings (P/E) ratio is calculated by dividing the current share price by the earnings<br /> per share (EPS). It's one of the most commonly used metrics for stock valuation, indicating<br /> how much investors are willing to pay for each unit of a company's earnings.` },
    { label: 'P/B Ratio', value: formatNumber(detail.pb_ratio), desc: `The Price-to-Book (P/B) ratio is calculated by dividing the current share price by the book value per share. It<br /> compares a company's market value to its book value (net assets).` },
    { label: 'EV/Sales', value: formatNumber(detail.ev_to_sales), desc: `EV/Sales is calculated by dividing a company's Enterprise Value (EV) by its total sales revenue. Enterprise Value (EV)<br /> typically includes market capitalization plus total debt minus cash and cash equivalents. This metric is similar to the<br /> Price-to-Sales (P/S) ratio but offers a more comprehensive view of a company's overall value by factoring in its debt and cash. It's<br /> frequently used to evaluate high-growth technology companies or startups that may not yet be profitable.` },
    { label: 'EV/EBITDA', value: formatNumber(detail.enterprise_value_over_ebitda), desc: `EV/EBITDA is calculated by dividing a company's Enterprise Value (EV) by its Earnings Before Interest, Taxes, Depreciation,<br /> and Amortization (EBITDA). EBITDA measures a company's profitability before accounting for interest, taxes, depreciation<br />, and amortization, making it a better reflection of the core business's cash-generating capability.` },
    { label: 'P/S Ratio', value: formatNumber(detail.price_to_sales_ratio), desc: `The Price-to-Sales (P/S) ratio is calculated by dividing a company's market capitalization by its total sales revenue from<br /> the last fiscal year. This metric compares a company's market value to its sales performance, making it particularly useful for<br /> evaluating growth companies that may not yet be profitable or have unstable earnings.` },
    { label: 'Beta', value: formatNumber(detail.beta), desc: `The Beta Coefficient measures the volatility of an individual stock or investment portfolio relative to the overall market.` }, // 源数据中无 beta，可根据需要补充
    { label: 'Return on Equity', value: formatNumber(detail.roe, 'percent'), desc: `Return on Equity (ROE) is the ratio of a company's net income to its average shareholders' equity. It measures how effectively a<br /> company is using the capital invested by its shareholders to generate profits.` },
    { label: 'ROIC', value: formatNumber(detail.roic, 'percent'), desc: `Return on Invested Capital (ROIC) is calculated as Earnings Before Interest and Taxes (EBIT) multiplied by (1 - Tax Rate),<br /> then divided by Invested Capital. Invested capital typically includes shareholders' equity and interest-bearing debt,<br /> among other things. ROIC measures how efficiently a company uses all its invested capital (both equity and debt) to generate<br /> profits, reflecting management's ability to create value.` },
    { label: 'Current Ratio', value: formatNumber(detail.current_ratio), desc: `The Current Ratio is calculated by dividing current assets by current liabilities. It measures a company's ability to pay off its short-term debts.` },
    { label: 'FCF Yield', value: formatNumber(detail.free_cash_flow_yield, 'percent'), desc: `Free Cash Flow Yield is calculated by dividing a company's Free Cash Flow (FCF) by its market capitalization. Free cash flow<br /> represents the cash a company has left over and can freely use after covering its day-to-day operations and capital expenditures.` },
    { label: 'Dividend Yield', value: formatNumber(detail.dividend_yield, 'percent'), desc: `Dividend yield is calculated by dividing the annual dividend per share (cash dividend) by the current share price. It measures<br /> how much cash dividend an investor receives for each unit of stock held.` }
  ]
  
const formatTradingStats = (stat) => [
    { label: 'Price', value: formatNumber(stat.price, 'dollar'), desc: `` },
    { label: 'Open', value: formatNumber(stat.open_price, 'dollar'), desc: `` }, // 源数据无 open
    { label: 'Previous Close', value: formatNumber(stat.previous_close, 'dollar'), desc: `` },
    { label: 'Day High', value: formatNumber(stat.day_high, 'dollar'), desc: `` },
    { label: 'Day Low', value: formatNumber(stat.day_low, 'dollar'), desc: `` },
    { label: '52W High', value: formatNumber(stat.year_high, 'dollar'), desc: `` },
    { label: '52W Low', value: formatNumber(stat.year_low, 'dollar'), desc: `` },
    { label: 'Volume', value: formatNumber(stat.volume), desc: `` },
    { label: 'Avg Volume', value: formatNumber(stat.avg_volume), desc: `` },
    { label: 'ATR (14)', value: formatNumber(stat.atr14), desc: `` },
    {
      label: '200MA Distance',
      value: `${formatNumber(stat.ma200_distance, 'customSign', '%')}`,
      isNegative: stat.ma200_distance && parseFloat(stat.ma200_distance) < 0,
      desc: ``
    },
    {
      label: 'Relative Volume',
      value: `${formatNumber(stat.relative_volume, 'customSign', 'x')}`,
      desc: ``
    }
  ]

function preprocessData(raw) {
  // 處理 raw 為你需要的格式
  const data = raw.data.data
  let profile = data.profile
  profile.isEtf = profile.isEtf === 0 ? 'No' : 'Yes'
  profile.isFund = profile.isFund === 0 ? 'No' : 'Yes'
  let companyDetails = formatCompanyDetails(data.latest_detail)
  let tradingStats = formatTradingStats(data.trading_stat)
  debugger
  return {profile,companyDetails,tradingStats};
}

export default {
  namespaced: true,
  state: () => ({
    data: [],
    loading: false,
    error: null,
  }),
  getters: {
    companyProfileData: (state) => state.data,
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
    async fetchCompanyProfile({ commit }, val) {
      commit("SET_LOADING", true);
      try {
        const raw = await getCompanyProfile(val);
        const processed = preprocessData(raw);
        // 在這裡做數據預處理
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "CompanyProfile data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
