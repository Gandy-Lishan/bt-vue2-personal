import { getBalanceSheet } from "@/service/market";
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

function preprocessData(raw) {
  // 最新年度在前
  const lastedRow = raw[raw.length-1];

  return {
    totalAssets: {
      title: "Total Assets",
      desc: `Total assets represent the total value of all resources owned by a company on a specific date. This includes<br /> items such as cash, accounts receivable, inventory, property, plant, equipment, and intangible assets.`,
      data: {
        totalPremium: formatNumber(lastedRow.total_assets)
      },
    },
    fixedAssets: {
      title: "Fixed Assets",
      desc: `Fixed assets are high-value, non-current assets held by a company for use in producing goods or providing services,<br /> for rental to others, or for administrative purposes, and which have a useful life of more than one year. Examples<br /> include land, buildings, machinery, and transportation equipment.`,
      data: {
        totalPremium: formatNumber(lastedRow.total_non_current_assets)
      },
    },
    totalLiabilities: {
      title: "Total Liabilities",
      desc: `Total liabilities represent the total value of all debts and financial obligations a company owes on a specific date.<br /> This includes items such as accounts payable, short-term borrowings, long-term debt, and bonds payable. These are<br /> obligations the company must repay in the future.`,
      data: {
        totalPremium: formatNumber(lastedRow.total_liabilities)
      },
    },
    totalEquity: {
      title: "Total Equity",
      desc: `Total Shareholder Equity is the remaining portion of a company's assets after liabilities have been deducted, representing<br /> the net assets owned by the company's owners (shareholders). It includes components such as share capital,<br /> capital reserves, and retained earnings.`,
      data: {
        totalPremium: formatNumber(lastedRow.total_equity)
      },
    },

    // Assets
    totalAssetsTrend: {
      title: "Total Assets Trend",
      desc: `This displays the change in a company's total assets over a period of time.`,
      data: {
        chartData: raw.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'total': formatNumber(i.total_assets),
          'current': formatNumber(i.total_current_assets),
          'nonCurrent': formatNumber(i.total_non_current_assets)
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Assets', color: '#16A34A' },
          { key: 'current', label: 'Current Assets', color: '#3B82F6' },
          { key: 'nonCurrent', label: 'Non-Current Assets', color: '#DC2626' },
        ],
      },
    },
    currentAssets: {
      title: "Current Assets",
      desc: `Current assets are assets that are expected to be converted into cash or consumed within one year. Examples include<br /> cash, short-term investments, accounts receivable, and inventory.`,
      data: [
        { label: 'Cash & Equivalents', value: formatNumber(lastedRow.cash_and_cash_equivalents), desc: `Cash and cash equivalents refer to the cash held by a company, along with short-term, highly liquid investments<br /> that can be readily converted into a known amount of cash (such as bank deposits and short-term government bonds).`, },
        { label: 'Short-term Investments', value: formatNumber(lastedRow.short_term_investments), desc: `Short-term investments are investments held by a company that are expected to be converted into cash or mature within<br /> one year, such as short-term bonds or marketable securities.` },
        { label: 'Net Receivables', value: formatNumber(lastedRow.net_receivables), desc: `Net accounts receivable refers to the amount of money a company is owed by its customers for goods sold or services<br /> rendered, minus any allowance for doubtful accounts (bad debt).` },
        { label: 'Inventory', value: formatNumber(lastedRow.inventory), desc: `Inventory refers to the raw materials, work-in-progress, and finished goods that a company holds for sale or for<br /> use in the production process.` },
        { label: 'Total Current Assets', value: formatNumber(lastedRow.total_current_assets), desc: `Total current assets refers to assets that a business expects to convert into cash, sell, or use up within one year<br /> (or one normal operating cycle). Simply put, these are assets that can be turned into cash in the short term.` },
      ]
    },
    nonCurrentAssets: {
      title: "Non-Current Assets",
      desc: `Non-current assets are assets that are not expected to be converted into cash or consumed within one year.<br /> This category includes long-term investments, fixed assets, and intangible assets.`,
      data: [
        { label: 'Long-term Investments', value: formatNumber(lastedRow.long_term_investments), desc: `Long-term investments are investments held by a company that are expected to be converted into cash or mature<br /> in more than one year, such as equity investments in other companies or long-term bonds.` },
        { label: 'Property & Equipment', value: formatNumber(lastedRow.property_plant_equipment_net), desc: `Property, Plant, & Equipment (PP&E) refers to the tangible fixed assets owned by a company, such as land, buildings,<br /> and machinery. These are typically listed at their net book value (original cost minus accumulated depreciation).` },
        { label: 'Goodwill', value: formatNumber(lastedRow.goodwill), desc: `Goodwill represents the portion of the purchase price paid by a company when acquiring another firm that exceeds<br /> the fair value of the acquired identifiable net assets. It signifies the intangible value of the acquired company,<br /> such as its brand reputation, customer relationships, or technological expertise.` },
        { label: 'Intangivle Assets', value: formatNumber(lastedRow.intangible_assets), desc: `Intangible assets are assets that lack physical form but possess economic value. Examples include patents,<br /> trademarks, copyrights, franchises, and software. This category does not include goodwill.` },
        { label: 'Total Non-Current Assets', value: formatNumber(lastedRow.total_non_current_assets), desc: `Total non-current assets refers to assets that a business expects to convert into cash, sell, or<br /> use up in more than one year. These assets are typically held for a company's long-term<br /> operations and are intended to generate future economic benefits.` },
      ]
    },

    // Liabilities
    liabilitiesBreakdown: {
      title: "Liabilities Breakdown",
      desc: `
      <h2>Total Liabilities</h2>
      <p><strong>Total Liabilities</strong> refers to the sum of all debts a company owes at a specific point in time, including both short-term and long-term debt.</p>
      <br />
      <h2>Current Liabilities</h2>
      <p><strong>Current liabilities</strong> are debts that are expected to be paid off within one year (or one operating cycle).</p>
      <p>Common components include:</p>
      <ul>
          <li><strong>Accounts Payable</strong>: Money a company owes to its suppliers for goods or services purchased, typically short-term, interest-free credit.</li>
          <li><strong>Short-term Debt</strong>: Bank loans, commercial papers, and other borrowings that are due within one year.</li>
          <li><strong>Deferred Revenue (Current)</strong>: Money a company has received from customers for goods or services that have not yet been delivered or rendered, and which will be recognized as revenue within one year.</li>
      </ul>
      <br />
      <h2>Non-Current Liabilities</h2>
      <p><strong>Non-current liabilities</strong> are **debts that are expected to be paid off in more than one year**.</p>
      <p>Common components include:</p>
      <ul>
          <li><strong>Long-term Debt</strong>: Bank loans, corporate bonds, and other borrowings that are due after one year.</li>
          <li><strong>Deferred Revenue (Non-Current)</strong>: Prepayments received from customers for goods or services that will be delivered or rendered beyond one year.</li>
          <li><strong>Other Non-Current Liabilities</strong>: Such as long-term lease liabilities, accrued pension liabilities, and so on.</li>
      </ul>
      `,
      data: {
        chartData: raw.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'total': formatNumber(i.total_liabilities),
          'current': formatNumber(i.total_current_liabilities),
          'nonCurrent': formatNumber(i.total_non_current_liabilities)
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Liabilities', color: '#16A34A' },
          { key: 'current', label: 'Current Liabilities', color: '#3B82F6' },
          { key: 'nonCurrent', label: 'Non-Current Liabilities', color: '#DC2626' },
        ],
      },
    },
    shareholdersEquityTrend: {
      title: `Shareholders' Equity Trend`,
      desc: `
      <h2>Total Equity</h2>
      <p><strong>Total Equity</strong> refers to the total ownership stake shareholders have in a company's assets.</p>
      <br />
      <h2>Retained Earnings</h2>
      <p><strong>Retained Earnings</strong> represent the cumulative net profits a company has accumulated since its inception,<br /> minus any dividends already paid out to shareholders.</p>
      <br />
      <h2>Common Stock</h2>
      <p><strong>Common Stock</strong> represents the capital invested by shareholders to purchase a company's common shares,<br /> recorded at either par value or issue price.</p>
      `,
      data: {
        chartData: raw.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'total': formatNumber(i.total_stockholders_equity),
          'retained': formatNumber(i.retained_earnings),
          'common': formatNumber(i.common_stock)
        })) || [],
        seriesConfigs: [
          { key: 'total', label: 'Total Equity', color: '#16A34A' },
          { key: 'retained', label: 'Retained Earnings', color: '#3B82F6' },
          { key: 'common', label: 'Common Stock', color: '#DC2626' },
        ],
      },
    },
    currentLiabilities: {
      title: "Current Liabilities",
      desc: ``,
      data: [
        { label: 'Accounts Payable', value: formatNumber(lastedRow.account_payables), desc: `Accounts payable refers to the short-term, interest-free debt a company owes to its suppliers for goods or services purchased.` },
        { label: 'Short-term Debt', value: formatNumber(lastedRow.short_term_debt), desc: `Short-term debt refers to interest-bearing liabilities like bank loans and short-term notes that are due within one year.` },
        { label: 'Deferred Revenue', value: formatNumber(lastedRow.deferred_revenue), desc: `Deferred revenue refers to the portion of customer prepayments a company has received for goods or services<br /> not yet delivered or rendered, which is expected to be recognized as revenue within one year.` },
        { label: 'Current Liabilities', value: formatNumber(lastedRow.total_current_liabilities), desc: `Current liabilities, as a summary item, are a key component in measuring a company's short-term solvency.` },
      ]
    },
    nonCurrentLiabilities: {
      title: "Non-Current Liabilities",
      desc: ``,
      data: [
        { label: 'Long-term Debt', value: formatNumber(lastedRow.long_term_debt), desc: `Long-term debt refers to interest-bearing liabilities like bank loans and corporate bonds that are due in more than one year.` },
        { label: 'Deferred Revenue (Non-Current)', value: formatNumber(lastedRow.deferred_revenue_non_current), desc: `Deferred Revenue (Non-Current) refers to the portion of customer prepayments a company has received for goods<br /> or services not yet delivered or rendered, which is expected to be recognized as revenue after one year.` },
        { label: 'Other Non-Current Liabilities', value: formatNumber(lastedRow.other_non_current_liabilities), desc: `Other Non-Current Liabilities include all other liabilities due in more than one year, apart from the two<br /> categories above, such as long-term lease liabilities and accrued pension liabilities.` },
        { label: 'Non-Current Liabilities', value: formatNumber(lastedRow.total_non_current_liabilities), desc: `Non-Current Liabilities, as a summary item, are an important indicator for assessing a company's long-term financial<br /> leverage and risk.` },
      ]
    },
    stockholdersEquity: {
      title: `Stockholders' Equity`,
      desc: ``,
      data: [
        { label: 'Retained Earnings', value: formatNumber(lastedRow.retained_earnings), desc: `Retained Earnings represent the cumulative net profits a company has accumulated since its inception, minus any<br /> dividends already paid out to shareholders.` },
        { label: 'Common Stock', value: formatNumber(lastedRow.common_stock), desc: `Common Stock refers to the capital invested by shareholders through the purchase of a company's common shares.` },
        // { label: 'Treasury Stock', value: '-', desc: `` },
        { label: `Stockholders' Equity`, value: formatNumber(lastedRow.total_equity), desc: `Stockholders' Equity, as a summary item, is a key indicator for evaluating a company's financial soundness and<br /> shareholder wealth.` },
      ]
    },

    // Key Ratios
    keyPerformanceMetrics: {
      title: "Key Performance Metrics",
      desc: `
      <h2>Current Ratio</h2>
      <p><strong>Formula:</strong> Total Current Assets / Total Current Liabilities</p>
      <p><strong>Core Meaning:</strong> This ratio measures a company's ability to repay its <strong>short-term debts</strong>.<br /> A higher ratio is generally better, but it's important to evaluate it against industry standards.</p>
      <br />
      <h2>Debt to Equity</h2>
      <p><strong>Formula:</strong> Total Liabilities / Total Shareholder Equity</p>
      <p><strong>Core Meaning:</strong> This ratio measures the <strong>relative proportion of debt to equity</strong> in a company's<br /> financing structure. A higher ratio indicates greater reliance on debt, which may suggest a higher<br /> financial risk.</p>
      <br />
      <h2>Asset Turnover</h2>
      <p><strong>Formula:</strong> Net Sales / Average Total Assets</p>
      <p><strong>Core Meaning:</strong> This ratio measures how efficiently a company uses all its assets to <strong>generate sales</strong>.<br /> A higher ratio indicates greater asset utilization efficiency, meaning the company is more<br /> effective at generating revenue.</p>
      `,
      data: {
        chartData: raw.map(i => ({
          'date': formatQuartAnnualDate(i.date, i.period),
          'currtRadio': formatNumber(i.current_ratio),
          'debt': formatNumber(i.d2e_ratio),
          'turnover': formatNumber(i.asset_turnover)
        })) || [],
        seriesConfigs: [
          { key: 'currtRadio', label: 'Current Ratio', color: '#16A34A' },
          { key: 'debt', label: 'Debt to Equity', color: '#3B82F6' },
          { key: 'turnover', label: 'Asset Turnover', color: '#DC2626' },
        ],
      },
    },
    liquidityMetrics: {
      title: 'Liquidity Metrics',
      desc: ``,
      data: [
        { label: 'Current Ratio', value: formatNumber(lastedRow.current_ratio), desc: `
          <p><strong>Formula:</strong> Total Current Assets / Total Current Liabilities</p>
          <p><strong>Core Meaning:</strong> This ratio measures a company's ability to repay its short-term debts. A 2:1 ratio is<br /> generally considered healthy, though this can vary by industry. A higher ratio indicates stronger<br /> short-term solvency.</p>
          ` },
        { label: 'Quick Ratio', value: formatNumber(lastedRow.quick_ratio), desc: `
          <p><strong>Formula:</strong> (Total Current Assets - Inventory) / Total Current Liabilities</p>
          <p><strong>Core Meaning:</strong> This is a more stringent measure than the current ratio because it <strong>excludes inventory</strong><br /> (as inventory conversion to cash can be slow or involve devaluation risk). It assesses a<br /> company's ability to repay short-term debts <strong>without relying on inventory sales</strong>.</p>
          ` },
        { label: 'Cash Ratio', value: formatNumber(lastedRow.cash_ratio), desc: `
          <p><strong>Formula:</strong> Cash & Cash Equivalents / Total Current Liabilities</p>
          <p><strong>Core Meaning:</strong> This is the <strong>most stringent liquidity measure</strong>, as it only considers the cash and highly<br /> liquid assets immediately at the company's disposal. It reflects a company's ability to<br /> <strong>immediately repay its short-term debts</strong>.</p>
          ` },
      ]
    },
    assetManagement: {
      title: 'Asset Management',
      desc: ``,
      data: [
        { label: 'Asset Turnover', value: formatNumber(lastedRow.asset_turnover), desc: `
          <p><strong>Formula:</strong> Net Sales / Average Total Assets</p>
          <p><strong>Core Meaning:</strong> This ratio measures how efficiently a company uses all its assets to generate sales. A higher ratio<br /> indicates greater asset utilization efficiency.</p>
          ` },
        { label: 'Fixed Asset Turnover', value: formatNumber(lastedRow.fixed_asset_turnover), desc: `
          <p><strong>Formula:</strong> Net Sales / Average Net Fixed Assets</p>
          <p><strong>Core Meaning:</strong> This ratio measures how efficiently a company uses its fixed assets (like property, plant, and equipment)<br /> to generate sales. It's especially important for capital-intensive businesses.</p>
          ` },
        { label: 'Inventory Turnover', value: formatNumber(lastedRow.inventory_turnover), desc: `
          <p><strong>Formula:</strong> Cost of Goods Sold (COGS) / Average Inventory</p>
          <p><strong>Core Meaning:</strong> This ratio measures how quickly a company sells and replenishes its inventory. A high turnover ratio<br /> generally indicates efficient inventory management, but an excessively high ratio could also lead<br /> to stockouts.</p>
          ` },
      ]
    },
    capitalStructure: {
      title: 'Capital Structure',
      desc: ``,
      data: [
        { label: 'Debt to Equity', value: formatNumber(lastedRow.d2e_ratio,'percent'), desc: `
          <p><strong>Formula:</strong> Total Liabilities / Total Shareholder Equity</p>
          <p><strong>Core Meaning:</strong> This ratio measures the relative proportion of debt to equity in a company's financing. A higher ratio<br /> means the company relies more on debt, which can indicate higher financial risk.</p>
          ` },
        { label: 'Debt to Capital', value: formatNumber(lastedRow.d2c_ratio,'percent'), desc: `
          <p><strong>Formula:</strong> Total Debt / (Total Debt + Total Shareholder Equity)</p>
          <p><strong>Core Meaning:</strong> This ratio measures how much of a company's total capital (debt and equity) comes from debt. It's similar<br /> to the Debt-to-Equity Ratio but offers a slightly different perspective, more directly showing debt's<br /> share of total capital.</p>
          ` },
        { label: 'Equity Ratio', value: formatNumber(lastedRow.equity_ratio,'percent'), desc: `
          <p><strong>Formula:</strong> Total Shareholder Equity / Total Assets</p>
          <p><strong>Core Meaning:</strong> This ratio measures how much of a company's assets are financed by shareholder equity. It's the inverse of<br /> debt ratios: a higher ratio means greater reliance on shareholder equity and a more robust financial structure.</p>
          ` },
      ]
    },
    growthAnalysis: {
      title: 'Growth Analysis',
      desc: ``,
      data: [
        { label: 'Asset Growth', value: formatNumber(lastedRow.asset_growth,'percent'), desc: `
          <p><strong>Formula:</strong> ((Current Period Total Assets - Prior Period Total Assets) / Prior Period Total Assets) * 100%</p>
          <p><strong>Core Meaning:</strong> This measures the growth rate of a company's total assets, reflecting the expansion of its overall size.</p>
          ` },
        { label: 'Liabilities Growth', value: formatNumber(lastedRow.liabilities_growth,'percent'), desc: `
          <p><strong>Formula:</strong> ((Current Period Total Liabilities - Prior Period Total Liabilities) / Prior Period Total Liabilities) * 100%</p>
          <p><strong>Core Meaning:</strong> This measures the growth rate of a company's liabilities. When viewed alongside asset growth, it helps<br /> determine if the company's expansion is overly reliant on debt.</p>
          ` },
        { label: 'Equity Growth', value: formatNumber(lastedRow.equity_growth,'percent'), desc: `
          <p><strong>Formula:</strong> ((Current Period Shareholder Equity - Prior Period Shareholder Equity) / Prior Period Shareholder Equity) * 100%</p>
          <p><strong>Core Meaning:</strong> This measures the growth rate of shareholder equity, reflecting the company's ability to increase<br /> shareholder wealth through retained earnings or by issuing new shares.</p>
          ` },
      ]
    },
  };
}


export default {
  namespaced: true,
  state: () => ({
    // Initialize data with the full expected structure,
    // but with default/empty values.
    data: {
      totalAssets: { title: "", desc: ``, data: { totalPremium: null } },
      fixedAssets: { title: "", desc: ``, data: { totalPremium: null } },
      totalLiabilities: { title: "", desc: ``, data: { totalPremium: null } },
      totalEquity: { title: "", desc: ``, data: { totalPremium: null } },

      totalAssetsTrend: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      currentAssets: { title: "", desc: ``, data: [] },
      nonCurrentAssets: { title: "", desc: ``, data: [] },

      liabilitiesBreakdown: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      shareholdersEquityTrend: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      currentLiabilities: { title: "", desc: ``, data: [] },
      nonCurrentLiabilities: { title: "", desc: ``, data: [] },
      stockholdersEquity: { title: "", desc: ``, data: [] },

      keyPerformanceMetrics: { title: "", desc: ``, data: { chartData: [], seriesConfigs: [] } },
      liquidityMetrics: { title: "", desc: ``, data: [] },
      assetManagement: { title: "", desc: ``, data: [] },
      capitalStructure: { title: "", desc: ``, data: [] }, // Corrected based on your preprocessData
      growthAnalysis: { title: "", desc: ``, data: [] },   // Corrected based on your preprocessData
    },
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
    async fetchBalanceSheet({ commit, rootState }, { symbol, period }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const raw = await getBalanceSheet(symbol, period);
        const processed = preprocessData(raw);
        // debugger // You can keep this for debugging if needed
        commit("SET_DATA", processed);
      } catch (err) {
        commit("SET_ERROR", err.message || "BalanceSheet data error.");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};