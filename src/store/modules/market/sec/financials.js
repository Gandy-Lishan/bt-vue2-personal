import { getFinancials } from "@/service/market";
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
const formatQuartAnnualDate = (isoStr, type) => {
  const year = isoStr.split("T")[0].split("-")[0];
  let dateStr;

  if (type === 'FY') {
    dateStr = year;
  } else {
    dateStr = formatUTCDate(isoStr)
  }

  return dateStr;
};

const formatFinancialsTrendInfo = (lastedRowIncome) => {
  // Return default structure if lastedRowIncome is undefined/null
  if (!lastedRowIncome) {
    return {
      revenue: { title: 'Current Revenue', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      grossProfit: { title: 'Current Gross Profit', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      operating: { title: 'Current Operating', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      netIncome: { title: 'Current Net Income', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      ebitda: { title: 'Current EBITDA', current: '-', yoy: '-', yoyColor: '', ratio: '-' },
    };
  }

  return {
    revenue: {
      title: 'Current Revenue', 
      current: formatNumber(lastedRowIncome.revenue),
      yoy: `${Number(lastedRowIncome.revenue_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.revenue_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.revenue_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.revenue_ratio, 'percent'),
    },
    grossProfit: {
      title: 'Current Gross Profit',
      current: formatNumber(lastedRowIncome.gross_profit),
      yoy: `${Number(lastedRowIncome.gross_profit_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.gross_profit_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.gross_profit_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.gross_profit_ratio, 'percent'),
    },
    operating: {
      title: 'Current Operating', 
      current: formatNumber(lastedRowIncome.operating_income),
      yoy: `${Number(lastedRowIncome.operating_income_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.operating_income_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.operating_income_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.operating_income_ratio, 'percent'),
    },
    netIncome: {
      title: 'Current Net Income', 
      current: formatNumber(lastedRowIncome.net_income),
      yoy: `${Number(lastedRowIncome.net_income_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.net_income_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.net_income_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.net_income_ratio, 'percent'),
    },
    ebitda: {
      title: 'Current EBITDA', 
      current: formatNumber(lastedRowIncome.ebitda),
      yoy: `${Number(lastedRowIncome.ebitda_yoy_growth) > 0 ? '+' : ''}` + formatNumber(lastedRowIncome.ebitda_yoy_growth, 'percent'),
      yoyColor: `${Number(lastedRowIncome.ebitda_yoy_growth) > 0 ? 'green' : 'red'}`,
      ratio: formatNumber(lastedRowIncome.ebitda_ratio, 'percent'),
    },
  }
}

function preprocessData(raw) {
  const {income, balanceSheet} = raw;
  // Make sure income and balanceSheet are arrays and not empty
  const lastedRowIncome = income && income.length > 0 ? income[income.length-1] : {};
  const lastedRowBalanceSheet = balanceSheet && balanceSheet.length > 0 ? balanceSheet[balanceSheet.length-1] : {};
  const totalDebtList = balanceSheet ? balanceSheet.map(i=>i.total_debt) : [];

  let res = {
    marginAnalysis: {
      title: "Margin Analysis",
      desc: ``,
      data: [
        { label: 'Gross Margin', value: formatNumber(lastedRowIncome.gross_margin,'percent'), desc: `Gross Profit Margin is calculated as (Gross Profit / Revenue) × 100%.` },
        { label: 'Operating Margin', value: formatNumber(lastedRowIncome.operating_margin,'percent'), desc: `Operating Profit Margin is calculated as (Operating Income / Revenue) × 100%.` },
        { label: 'Net Margin', value: formatNumber(lastedRowIncome.net_margin,'percent'), desc: `Net Profit Margin is calculated as (Net Income / Revenue) × 100%.` },
      ]
    },
    earningsSurprises: { // Note: Your data for this section seems to be more like 'Profitability Ratios' than 'Earnings Surprises'
      title: "Earnings Surprises",
      desc: ``,
      data: [
        { label: 'Asset Turnover', value: formatNumber(lastedRowIncome.asset_turnover), desc: `Asset Turnover Ratio is calculated as Revenue divided by Average Total Assets.` },
        { label: 'Return on Equity', value: formatNumber(lastedRowIncome.return_on_equity), desc: `Return on Equity (ROE) is calculated as Net Income divided by Average Shareholder Equity.` },
        { label: 'Return on Assets', value: formatNumber(lastedRowIncome.return_on_asset), desc: `Return on Assets (ROA) is calculated as Net Income divided by Average Total Assets.` },
      ]
    },
    financialScores: {
      title: "Financial Scores",
      desc: ``,
      data: [
        { label: 'Altman Z-Score', value: formatNumber(lastedRowIncome.altman_z_score), desc: `<h2>Altman Z-Score</h2>
<p>The <strong>Altman Z-Score</strong> is a multivariate formula developed by Edward I. Altman in 1968 to predict a company's probability<br /> of bankruptcy within two years. It combines several financial ratios, including:</p>
<ul>
    <li><strong>Working Capital / Total Assets</strong></li>
    <li><strong>Retained Earnings / Total Assets</strong></li>
    <li><strong>Earnings Before Interest and Taxes (EBIT) / Total Assets</strong></li>
    <li><strong>Market Value of Equity / Total Liabilities</strong></li>
    <li><strong>Sales / Total Assets</strong></li>
</ul>
<p>The interpretation of the Z-Score is as follows:</p>
<ul>
    <li><strong>Z-Score &gt; 2.99</strong>: Indicates a <strong>financially healthy company</strong> with a low risk of bankruptcy.</li>
    <li><strong>1.8 &lt; Z-Score &lt; 2.99</strong>: Falls into a <strong>"gray zone,"</strong> suggesting a moderate risk of bankruptcy.</li>
    <li><strong>Z-Score &lt; 1.8</strong>: Points to a <strong>high risk of bankruptcy</strong>.</li>
</ul>
<p>This score is highly valuable for investors and creditors when assessing a company's <strong>creditworthiness</strong> and <strong>risk</strong>.</p>` },
        { label: 'Piotroski Score', value: formatNumber(lastedRowIncome.piotroski_score), desc: `<h2>Piotroski F-Score</h2>
<p>The <strong>Piotroski F-Score</strong> is a 9-point scoring system introduced by Joseph Piotroski in 2000. It's used to identify <strong>value stocks</strong> with strong financial statements.<br /> The score is based on nine criteria related to a company's <strong>profitability, leverage, liquidity, and operational efficiency</strong>. A company earns 1 point for each<br /> criterion it meets, with a maximum possible score of 9.</p>
<ul>
    <li><strong>A higher score</strong> (generally, <strong>6 points or more is considered good</strong>) indicates that a company has sound financial health and stable operations, suggesting it<br /> might be a worthwhile value investment.</li>
    <li><strong>A lower score</strong> suggests potential financial issues or inefficient operations.</li>
</ul>
<p>This score is primarily used to screen for companies whose <strong>fundamentals are improving</strong> and whose <strong>valuation might be undervalued</strong>.</p>` },
      ]
    },

    // Financial Trend
    financialsTrendInfo: formatFinancialsTrendInfo(lastedRowIncome),
    revenue: {
      title: "Revenue",
      desc: `Revenue refers to the total amount of money a company earns from selling its goods or<br /> 
            providing its services within a specific period.
            <br /><br />
            Revenue is the most direct indicator of a company's size and market position. A trend of<br />
             consistently growing revenue signals that the company is expanding its market share and that<br />
              there's strong demand for its products or services, making it a key sign of company growth.`,
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'total': totalDebtList[index],
          'revenue': i.revenue,
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'revenue', label: 'Revenue', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    grossProfit: {
      title: "Gross Profit",
      desc: `Gross Profit is revenue minus the direct costs associated with selling goods or providing<br />
             services (Cost of Goods Sold, COGS).
            <br /><br />
            Gross profit reflects the profitability of a company's products or services. Consistently<br /> 
            growing gross profit indicates strong pricing power or high production efficiency, showing<br /> 
            effective control over direct costs.`,
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'total': totalDebtList[index],
          'grossProfit': i.gross_profit,
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'grossProfit', label: 'Gross Profit', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    operating: {
      title: "Operating",
      desc: `This reflects core business profitability.<br /><br />
            Its trend chart clearly illustrates the stability and growth of a company's core business <br />
            profitability. A stable upward trend indicates that the company's management is effectively <br />
            controlling operating expenses.`,
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'total': totalDebtList[index],
          'operating': i.operating_income,
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'operating', label: 'Operating Income', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    netIncome: {
      title: "Net Income",
      desc: `Net income is a company's final profit after all costs, expenses, interest, and taxes have been deducted.<br /><br />
            It's the ultimate measure of a company's overall profitability. Consistently growing net income is<br /> 
            direct proof of a company's healthy operations and its ability to create value for shareholders, <br />
            making it a key driver of stock price appreciation.`,
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'total': totalDebtList[index],
          'netIncome': i.net_income,
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Debt', color: '#16A34A' },
          { key: 'netIncome', label: 'Net Income', color: '#3B82F6', type: 'line' },
        ],
      },
    },
    ebitda: {
      title: "EBITDA",
      desc: `EBITDA represents a company's profit before accounting for interest, taxes, depreciation, <br />
            and amortization on the income statement.
            <br /><br />
            EBITDA measures a company's core business cash-generating capability because it excludes <br />
            non-cash expenses (depreciation and amortization), financing costs (interest), and the impact of <br />
            taxes. It's often used for cross-industry comparisons, especially in capital-intensive <br />
            industries, as it provides a clearer picture of a company's operational efficiency.`,
      data: {
        chartData: income.map((i,index) => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'total': totalDebtList[index],
          'ebitda': i.ebitda,
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
      desc: ``,
      data: {
        chartData: income.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'revenue': i.revenue,
          'netIncome': i.net_income,
          'ebitda': i.ebitda,
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
      desc: `<h2>Cash</h2>
<p><strong>Cash</strong> refers to the total amount of cash and cash equivalents held by a company.</p>
<h2>Total Debt</h2>
<p><strong>Total Debt</strong> refers to the sum of all a company's long-term and short-term interest-bearing liabilities.</p>`,
      data: {
        chartData: balanceSheet.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'cash': i.cash_and_cash_equivalents,
          'totalDebt': i.total_debt,
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
    // Initialize data with the full expected structure,
    // but with default/empty values.
    data: {
      marginAnalysis: { title: "", desc: ``, data: [] },
      earningsSurprises: { title: "", desc: ``, data: [] },
      financialScores: { title: "", desc: ``, data: [] },

      financialsTrendInfo: { // This structure matches `formatFinancialsTrendInfo`
        revenue: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
        grossProfit: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
        operating: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
        netIncome: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
        ebitda: { current: '-', yoy: '-', yoyColor: '', ratio: '-' },
      },
      revenue: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      grossProfit: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      operating: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      netIncome: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      ebitda: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },

      incomeMetics: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      cashDebt: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
    },
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
        // Add checks for raw.income and raw.balanceSheet before accessing
        // This is crucial because if getFinancials returns an empty or malformed object,
        // trying to access raw.income or raw.balanceSheet will cause an error
        // before preprocessData even runs.
        if (!raw || !raw.income || !Array.isArray(raw.income) || !raw.balanceSheet || !Array.isArray(raw.balanceSheet)) {
          throw new Error("Invalid financial data received.");
        }
        const processed = preprocessData(raw);
        // debugger // You can keep this for debugging if needed
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "Financials data error."); // Use err.message for consistency
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};