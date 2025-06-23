<template>
  <div class="financials">
    <div class="title">Financials</div>
    <button-group 
      v-model="timeframe" 
      :options="[
        { label: 'Annual', value: 'annual' },
        { label: 'Quarterly', value: 'quarterly' },
      ]" 
      backgroundColor="#fff" 
      :enableTransition="true" 
    />
    <div class="spacing-lg"></div>
    <div class="grid-col-3">
      <section class="card financials__card" v-for="panel in financialPanels" :key="panel.title">
        <div class="card__subtitle">{{ panel.title }}</div>
        <base-table-simple
          :data="panel.data"
          :highlight-last-row="false"
        />
      </section>
    </div>
    <section class="card financials__card">
      <h3 class="card__subtitle">Financial Trends</h3>
      <button-group 
        class="btn-group"
        v-model="trendsOption" 
        :options="[
          { label: 'Revebue', value: 'revebue' },
          { label: 'Gross Profit', value: 'grossProfit' },
          { label: 'Operating', value: 'operating' },
          { label: 'Net Income', value: 'netIncome' },
          { label: 'EBITDA', value: 'ebitda' },
        ]" 
        backgroundColor="#e7e7e7" 
        :enableTransition="true" 
      />
      <BarChart
        :chartData="trendsChartData"
        :seriesConfigs="trendsSeriesConfigs"
        titleText=""
        yAxisTitleText=""
        orientation="column"
        :enableExporting="false"
        legendPosition="topright"
        chartHeight="400px"
      />
      <!-- 預留sector card -->
    </section>
    <div class="grid-col-2">
      <section class="card financials__card">
        <div class="card__subtitle">Income Metrics</div>
        <BarChart
          :chartData="IncomeMeticsChartData"
          :seriesConfigs="IncomeMeticsSeriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="bottomcenter"
          chartHeight="400px"
        />
      </section>
      <section class="card financials__card">
        <div class="card__subtitle">Cash & Debt Position</div>
        <BarChart
          :chartData="cashDebtChartData"
          :seriesConfigs="cashDebtSeriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="bottomcenter"
          chartHeight="400px"
        />
      </section>
    </div>
  </div>
</template>

<script>
import BaseTableSimple from "@/components/Market/components/tables/BaseTableSimple";
import BarChart from '@/components/Market/components/charts/BarChart.vue';
import ButtonGroup from '@/components/Market/components/baseButton/ButtonGroup.vue';
export default {
  name: 'Financials',
  data() {
    return {
      financialPanels: [
        {
          title: 'Margin Analysis',
          data: [
            { label: 'Gross Margin', value: '46.21%' },
            { label: 'Operating Margin', value: '31.51%' },
            { label: 'Net Margin', value: '23.97%' }
          ]
        },
        {
          title: 'Earnings Surprises',
          data: [
            { label: 'Asset Turnover', value: 'N/A' },
            { label: 'Return on Equity', value: 'N/A' },
            { label: 'Return on Assets', value: 'N/A' }
          ]
        },
        {
          title: 'Financial Scores',
          data: [
            { label: 'Altman Z-Score', value: '2.15' },
            { label: 'Piotroski Score', value: '4.00' }
          ]
        }
      ],
      timeframe: 'annual',

      // trends mockdata
      trendsOption: 'revebue',
      trendsChartData: [
        { date: '2020', revenue: 100, growth: 3 },
        { date: '2021', revenue: 150, growth: 3.5 },
        { date: '2022', revenue: 170, growth: 3.2 },
        { date: '2023', revenue: 168, growth: 2.9 },
        { date: '2024 (TTM)', revenue: 172, growth: 2.5 }
      ],
      trendsSeriesConfigs: [
        { key: 'revenue', label: 'Revenue', color: '#4A90E2' },
        { key: 'growth', label: 'Growth Rate', color: '#D32F2F', type: 'line' }
      ],
      trendOptionsMap: {
      revebue: {
        data: [
          { date: '2020', revenue: 100, growth: 3 },
          { date: '2021', revenue: 150, growth: 3.5 },
          { date: '2022', revenue: 170, growth: 3.2 },
          { date: '2023', revenue: 168, growth: 2.9 },
          { date: '2024 (TTM)', revenue: 172, growth: 2.5 }
        ],
        config: [
          { key: 'revenue', label: 'Revenue', color: '#4A90E2' },
          { key: 'growth', label: 'Growth Rate', color: '#D32F2F', type: 'line' }
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
        { key: 'revenue', label: 'Revenue', color: '#3B82F6' },
        { key: 'netIncome', label: 'Net Income', color: '#16A34A' },
        { key: 'ebitda', label: 'EBITDA', color: '#818CF8' },
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
        { key: 'cash', label: 'Cash', color: '#16A34A' },
        { key: 'totalDebt', label: 'Total Debt', color: 'red' },
      ],
    }
  },
  components: {
    BaseTableSimple,
    BarChart,
    ButtonGroup,
  },
  computed: {
  },
  watch: {
    trendsOption: {
      immediate: true,
      handler(newVal) {
        this.updateTrendsChartByOption(newVal);
      }
    }
  },
  methods: {
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
  }
  }
}
</script>

<style scoped lang="scss">
@import "@/components/Market/market.scss";

.financials {
  margin: 0 auto;
  &__card {
    padding: 24px;

    position: relative; //爲了讓btn group position absolute顯示
  }
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
</style>
