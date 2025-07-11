<template>
  <div class="ownership">
    <div class="title">Ownership</div>
    <div class="spacing-lg"></div>
    <div class="ownership-grid">
      <!-- <section class="card pie-chart-section">
        <div class="card__subtitle">Ownership Distribution</div>
          <PieChart
          :chart-data="[
            { name: 'Executive Insiders', y: 43.5, color: '#2196F3' },
            { name: 'Institutions', y: 33.5, color: '#1A237E' },
            { name: 'Mutual Funds', y: 23.0, color: '#03A9F4' },
            { name: 'Public Float', y: 0, color: '#B3E5FC' }
          ]"
          :show-legend="true"
          inner-size="50%"
          :enableExporting="true"
        />
      </section> -->
      <div class="tables-grid">
        <section class="card" v-for="panel in ownershipPanels" :key="panel.title">
          <div class="card__subtitle">{{ panel.title }}</div>
          <base-table-simple
            :data="panel.data"
            :highlight-last-row="false"
          />
        </section>
      </div>
    </div>
    <section class="card">
      <nav class="card-layout__nav">
        <div v-for="tab in tabs" :key="tab.name"
          class="card-layout__nav-item" :class="{ 'card-layout__nav-item--active': activeTab === tab.route }"
          @click="activeTab = tab.route">
          <span class="card-layout__nav-text">
            {{ tab.name }}
            <el-tooltip effect="dark" placement="top">
              <span slot="content" v-html="tab.desc">
              </span>
              <i class="iconfont icon-wenhao" style="font-size: 14px;font-weight: 300;"></i>
            </el-tooltip>
          </span>
      </div>
      </nav>
      <br/>
      <!-- <BarChart
        :chartData="trendsChartData"
        :seriesConfigs="trendsSeriesConfigs"
        titleText=""
        yAxisTitleText=""
        orientation="column"
        :enableExporting="false"
        legendPosition="topright"
        chartHeight="400px"
      /> -->
      <div class="ownership-table">
        <base-table
          :showSearch="true"
          :tableData="tableData"
          :columns="columns"
          :loading="loading"
          tip-text=""
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @change-table-sort="handleChangeTableSort"
        >
      </base-table>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BaseTableSimple from "@/components/Market/components/tables/BaseTableSimple";
import BarChart from '@/components/Market/components/charts/BarChart.vue';
import PieChart from '@/components/Market/components/charts/PieChart.vue';
import BaseTable from '@/components/Market/components/tables/BaseTable.vue';
import { isObject, formatNumber } from '@/utils';


export default {
  name: 'Ownership',
  data() {
    return {
      infoTag: {
        label: `Largest Transaction: $397.03M &nbsp; 90d Net Buying: 192 trades`,
        type: 'info',
        closable: false
      },
      ownershipPanels: [],
      
      timeframe: 'annual',

      // trends mockdata
      trendsOption: 'revenue',
      trendsChartData: [
        { date: '2020', revenue: 100, growth: 3 },
        { date: '2021', revenue: 150, growth: 3.5 },
        { date: '2022', revenue: 170, growth: 3.2 },
        { date: '2023', revenue: 168, growth: 2.9 },
        { date: '2024 (TTM)', revenue: 172, growth: 2.5 }
      ],
      trendsSeriesConfigs: [
        { key: 'revenue', label: 'Revenue', color: '#4A90E2' },
        { key: 'growth', label: 'Growth Rate', color: '#D32F2F' }
      ],
      trendOptionsMap: {
      revenue: {
        data: [
          { date: 'Jan', buys: 100, sells: 130 },
          { date: 'Feb', buys: 150, sells: 110 },
          { date: 'Mar', buys: 170, sells: 148 },
          { date: 'Apr', buys: 168, sells: 150 },
          { date: 'May', buys: 172, sells: 90 }
        ],
        config: [
          { key: 'buys', label: 'Buys', color: 'green' },
          { key: 'sells', label: 'Sells', color: 'red'}
        ]
      },
      grossProfit: {
        data: [
          { date: '2020', grossProfit: 50, margin: 25 },
          { date: '2021', grossProfit: 70, margin: 28 },
          { date: '2022', grossProfit: 80, margin: 30 },
          { date: '2023', grossProfit: 78, margin: 29 },
          { date: '2024 (TTM)', grossProfit: 82, margin: 31 }
        ],
        config: [
          { key: 'grossProfit', label: 'Gross Profit', color: '#7CB342' },
          { key: 'margin', label: 'Gross Margin %', color: '#FBC02D', type: 'line' }
        ]
      },
      operating: {
        data: [
          { date: '2020', operating: 30, margin: 18 },
          { date: '2021', operating: 42, margin: 21 },
          { date: '2022', operating: 47, margin: 22 },
          { date: '2023', operating: 45, margin: 21.5 },
          { date: '2024 (TTM)', operating: 48, margin: 23 }
        ],
        config: [
          { key: 'operating', label: 'Operating Income', color: '#00ACC1' },
          { key: 'margin', label: 'Operating Margin %', color: '#8E24AA', type: 'line' }
        ]
      },
      netIncome: {
        data: [
          { date: '2020', netIncome: 20, margin: 12 },
          { date: '2021', netIncome: 28, margin: 14 },
          { date: '2022', netIncome: 31, margin: 15 },
          { date: '2023', netIncome: 30, margin: 14.5 },
          { date: '2024 (TTM)', netIncome: 33, margin: 15.5 }
        ],
        config: [
          { key: 'netIncome', label: 'Net Income', color: '#EF5350' },
          { key: 'margin', label: 'Net Margin %', color: '#FFCA28', type: 'line' }
        ]
      },
      ebitda: {
        data: [
          { date: '2020', ebitda: 35, margin: 20 },
          { date: '2021', ebitda: 50, margin: 23 },
          { date: '2022', ebitda: 55, margin: 24 },
          { date: '2023', ebitda: 53, margin: 23.5 },
          { date: '2024 (TTM)', ebitda: 57, margin: 25 }
        ],
        config: [
          { key: 'ebitda', label: 'EBITDA', color: '#26A69A' },
          { key: 'margin', label: 'EBITDA Margin %', color: '#5E35B1', type: 'line' }
        ]
      }
    },

    // Income Metrics mockdata
      IncomeMeticsChartData: [
        { date: '2020', revenue: 100, netIncome:70, ebitda: 50 },
        { date: '2021', revenue: 150, netIncome:75, ebitda: 20 },
        { date: '2022', revenue: 300, netIncome:200, ebitda: 60 },
        { date: '2023', revenue: 200, netIncome:150, ebitda: 260 },
        { date: '2024 (TTM)', revenue: 100, netIncome:70, ebitda: 150 }
      ],
      IncomeMeticsSeriesConfigs: [
        { key: 'revenue', label: 'Revenue', color: 'blue' },
        { key: 'netIncome', label: 'Net Income', color: 'green' },
        { key: 'ebitda', label: 'EBITDA', color: 'purple' },
      ],

        // Income Metrics mockdata
        cashDebtChartData:  [
        { date: '2020', cash: 90, totalDebt:110 },
        { date: '2021', cash: 150, totalDebt:122 },
        { date: '2022', cash: 300, totalDebt:100 },
        { date: '2023', cash: 200, totalDebt:90 },
        { date: '2024 (TTM)', cash: 100, totalDebt:70 }
      ],
      cashDebtSeriesConfigs: [
        { key: 'cash', label: 'Cash', color: 'green' },
        { key: 'totalDebt', label: 'Total Debt', color: 'red' },
      ],
      tabs: [
        { name: 'Insider Transactions', route: 'insider-transactions', desc: `The number of shares and total value of stock sold by insiders on a specific date at a given price.` },
        { name: 'Total Institutional Holdings', route: 'institutional-holdings', desc: `A specific institution's change in holdings (both the number of shares and the corresponding market value) on a given day.` },
        { name: 'Total Mutual Fund Holdings', route: 'mutual-fund-holdings', desc: `A specific mutual fund's change in holdings (both the number of shares and the corresponding market value) on a given day.` },
        // { name: 'Political Trading Activity', route: 'political-trading-activity' },
      ],
      activeTab: 'insider-transactions',
      loading: false,
      tableData: [],
      insiderTransactionsColumns: [
        { prop: 'date', label: 'Date', sortable: true, type: 'date' },
        { prop: 'insider', label: 'Insider', width: '120', sortable: true, type: 'string' },
        { prop: 'type', label: 'Type', sortable: true, type: 'string' },
        { prop: 'shares', label: 'Shares', sortable: true, type: 'number' },
        { prop: 'price', label: 'Price', sortable: true, type: 'number', formatter: (row) => formatNumber(row.price, 'dollar', null, true) },
        { prop: 'value', label: 'Value', sortable: true, type: 'number', formatter: (row) => formatNumber(row.value, 'dollar', null, true) },
      ],
      institutionalHoldingsColumns: [
        { prop: 'name', label: 'Owner Name', sortable: true, type: 'string' },
        { prop: 'date', label: 'Date', sortable: true, type: 'date', formatter: (row) => this.formatUTCDate(row.date) },
        { prop: 'shares', label: 'Shares Held', sortable: true, type: 'number', formatter: (row) => formatNumber(row.shares, null, null, true) },
        { prop: 'changes_shares', label: 'Changes (Shares)', sortable: true, type: 'number', formatter: (row) => formatNumber(row.changes_shares, null, null, true) },
        { prop: 'change', label: 'Change (%)', sortable: true, type: 'number', formatter: (row) => formatNumber(row.change, 'customSign', '%', true) },
        { prop: 'value', label: 'Value', sortable: true, type: 'number', formatter: (row) => formatNumber(row.value, 'dollar', null, true) },
      ],
      mutualFundHoldingsColumns: [
        { prop: 'name', label: 'Fund Name', sortable: true, type: 'string' },
        { prop: 'shares', label: 'Shares Held', sortable: true, type: 'number', formatter: (row) => formatNumber(row.shares, null, null, true) },
        { prop: 'day_reported', label: 'Day Reported', sortable: true, type: 'date', formatter: (row) => this.formatUTCDate(row.day_reported) },
        { prop: 'value', label: 'Value', sortable: true, type: 'number', formatter: (row) => formatNumber(row.value, 'dollar', null, true) },
      ],
      politicalTradingActivityColumns: [
        { prop: 'date', label: 'Trede Date', sortable: true },
        { prop: 'politician', label: 'Politician', sortable: true },
        { prop: 'trade_type', label: 'Trade Type', sortable: true },
        { prop: 'amount', label: 'Amount', sortable: true },
      ],
      holder_info: {},
    }
  },
  components: {
    BaseTableSimple,
    BarChart,
    PieChart,
    BaseTable,
  },
  computed: {
    ...mapGetters("market/sec/ownership", [
      "ownershipData",
      "isLoading",
      "errorMessage",
    ]),
    symbol() {
      return this.$route.params.symbolname;
    },
    columns() {
      // 根据activeTab动态生成columns
      if (this.activeTab === 'insider-transactions') {
        return this.insiderTransactionsColumns;
      } else if (this.activeTab === 'institutional-holdings') {
        return this.institutionalHoldingsColumns;
      } else if (this.activeTab === 'mutual-fund-holdings') {
        return this.mutualFundHoldingsColumns;
      } else if (this.activeTab === 'political-trading-activity') {
        return this.politicalTradingActivityColumns;
      }
    }
  },
  watch: {
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol) {
        this.fetchOwnership(newSymbol);
      }
    },
    activeTab: {
      handler(newVal) {
        const {
          InsiderShipData,
          institutionalHoldingsData,
          mutualFundHoldingsData
        } = this.ownershipData
        if (newVal === 'insider-transactions') {
          this.tableData = InsiderShipData;
        } else if (newVal === 'institutional-holdings') {
          this.tableData = institutionalHoldingsData;
        } else if (newVal === 'mutual-fund-holdings') {
          this.tableData = mutualFundHoldingsData;
        }
      }
    },
    ownershipData: {
      handler(newVal) {
        if(isObject(newVal) && Object.keys(newVal).length > 0) {
          const {
            InsiderShipData,
            institutionalHoldingsData,
            mutualFundHoldingsData,
            ownershipPanels
          } = newVal;
          if (this.activeTab === 'insider-transactions') {
            this.tableData = InsiderShipData;
          } else if (this.activeTab === 'institutional-holdings') {
            this.tableData = institutionalHoldingsData;
          } else if (this.activeTab === 'mutual-fund-holdings') {
            this.tableData = mutualFundHoldingsData;
          }
          this.ownershipPanels = ownershipPanels; 
        }
      },
    }
  },
  created() {
    this.fetchOwnership(this.symbol);
  },
  methods: {
    ...mapActions("market/sec/ownership", [
      "fetchOwnership",
    ]),
    formatUTCDate(isoStr) {
      const [year, month, day] = isoStr.split("T")[0].split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(date);
    },
    handleSizeChange(size) {
      console.log('每页显示条数改变：', size)
    },
    handleCurrentChange(page) {
      console.log('当前页改变：', page)
    },
    updateTrendsChartByOption(optionKey) {
      const option = this.trendOptionsMap[optionKey];
      if (option) {
        this.trendsChartData = option.data;
        this.trendsSeriesConfigs = option.config;
      } else {
        this.trendsChartData = [];
        this.trendsSeriesConfigs = [];
      }
    },
    handleSizeChange(size) {
      console.log('每页显示条数改变：', size)
    },
    handleCurrentChange(page) {
      console.log('当前页改变：', page)
    },
    formatNumber(val) {
      if (!val || typeof val !== 'string') return 0;

      const str = val.trim();

      if (str === '-' || str.toLowerCase().includes('nan')) return 0;

      // 百分比
      if (str.endsWith('%')) {
        const percent = parseFloat(str.replace('%', ''));
        return isNaN(percent) ? 0 : percent;
      }

      // 匹配正负号、金额、单位
      const match = str.match(/^([-+])?[\$]?\s*([\d,]+(?:\.\d+)?)\s*([kmbtKMBT]?)$/);
      if (!match) return 0;

      const sign = match[1] === '-' ? -1 : 1;
      let num = parseFloat(match[2].replace(/,/g, ''));
      if (isNaN(num)) return 0;

      const unit = match[3].toUpperCase();
      const multipliers = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
      if (unit && multipliers[unit]) {
        num *= multipliers[unit];
      }

      return sign * num;
    },
    handleChangeTableSort(column){
    debugger
    const sortingOrder = column.order;
    const colName = column.prop;
    const columnDef = this.columns.find(col => col.prop === colName);
    const columnType = columnDef?.type || 'string';

    if (columnType === 'number' && (sortingOrder === 'ascending' || sortingOrder === 'descending')) {
      const sortedData = this.tableData.slice().sort((a, b) => {
        const aVal = (this.formatNumber(a[colName]));
        const bVal = (this.formatNumber(b[colName]));
        const aInvalid = aVal === null;
        const bInvalid = bVal === null;
        if (aInvalid && !bInvalid) return 1;
        else if (!aInvalid && bInvalid) return -1;
        else if (aInvalid && bInvalid) return 0;
        return sortingOrder === 'ascending' ? aVal - bVal : bVal - aVal;
      });
      this.tableData = [...sortedData];
    }
			// 日期类型排序
			if(['last_update'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.filterData.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.filterData.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
      if (['last_update'].indexOf(colName) !== -1) {
        // 处理日期字符串
        const isValidDate = date => !isNaN(Date.parse(date));
        const sortedData = this.filterData.sort((a, b) => {
        const dateA = new Date(a[colName])
        const dateB = new Date(b[colName])
        const isDateAValid = isValidDate(a[colName])
        const isDateBValid = isValidDate(b[colName])
        // 都是无效日期，保持原顺序
        if (!isDateAValid && !isDateBValid) return 0

        //a 是无效日期，排到最后 
        if (!isDateAValid) return 1;

        // b 是无效日期，排到最后
        if (!isDateBValid) return -1

        // 都是有效日期，按日期排序
        if (sortingOrder === 'ascending') {
        return dateB - dateA;
        } else if (sortingOrder === 'descending') {
        return dateA - dateB;
        }
        return 0
        })
        this.filterData = sortedData
        }
			// 字符串类型排序
			if(['chart_name','groups','timeframe','url', 'underlying_name'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.filterData.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.filterData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}
			}
    },
  }
}
</script>

<style scoped lang="scss">
@import "@/components/Market/market.scss";

.ownership {
  margin: 0 auto;
}

.btn-group {
  position: absolute;
  top: 80px;
}

@media (max-width: 768px) {
  .financials {
    &__card {
      padding: 16px;
    }
  }
}

// .ownership-grid {
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   gap: $spacing-md;
//   width: 100%;
// }
.tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: $spacing-md;
}
.card-layout {
  &__nav {
    display: flex;
    border-bottom: 1px solid $color-border-medium;
    padding: 0 $spacing-md;
    background-color: $color-bg-toolbar;
  }

  &__nav-item {
    padding: $spacing-sm $spacing-md;
    color: $color-text-secondary;
    text-decoration: none;
    font-weight: 500;

    &--active {
      color: $color-text-primary;
      border-bottom: 2px solid $color-text-highlight;
    }

    &:hover {
      color: $color-text-highlight;
    }
  }
}
</style>
