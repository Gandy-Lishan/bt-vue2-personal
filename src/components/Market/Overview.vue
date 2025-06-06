<template>
    <div class="market-overview">
      <h2 class="heading market-overview__heading">Market Overview</h2>
  
      <div class="market-overview__grid">
        <!-- 第一行：三列 -->
        <section class="card market-overview__card indicators-card">
          <h3 class="card__title">Indicators</h3>
          <UseTable/>
        </section>
  
        <section class="card market-overview__card news-card">
          <h3 class="title card__title">AAPL</h3>
          <!-- <div class="card__item">[News placeholder]</div> -->
          <BarChart
            :chart-data="performanceData"
            title-text="Earnings: Estimate vs. Actual"
            y-axis-title-text="Earnings (Millions USD)"
            chart-height="auto"
            :enable-exporting="false"
            estimate-color="#B0C4DE"
            actual-color="#FF6347"
          />
        </section>
  
        <section class="card market-overview__card snapshot-card">
          <h3 class="title card__title">Market Snapshot</h3>
          <StockChart
            symbol="aapl"
            start-date="2005-01-01"
            end-date="2025-06-01"
            line-color="#1E88E5"
            :enable-exporting="false"
          />

        </section>
  
        <!-- 第二行：两列 -->
        <section class="card market-overview__card sector-card">
          <h3 class="title card__title">Sector Performance</h3>
          <div class="card__item">[Sector Performance placeholder]</div>
        </section>
  
        <section class="card market-overview__card volume-card">
          <h3 class="title card__title">Volume</h3>
          <div class="card__item">[Volume placeholder]</div>
        </section>
  
        <!-- 第三行：一整行 -->
        <section class="card market-overview__card full-width-chart">
          <h3 class="title card__title">Market Trend Chart</h3>
          <div class="card__item" style="height: 300px;">[Highcharts placeholder]</div>
        </section>

        <!-- <section class="card market-overview__card full-width-chart">
          <h3 class="title card__title">Sector Performance</h3>
          <SectorCardIndex/>
        </section> -->
        <!-- <section class="card market-overview__card full-width-chart">
          <h3 class="title card__title">Ownership Distribution</h3>
          <OwnershipDistribution/>
        </section> -->
        <!-- <section class="card market-overview__card full-width-chart">
          <h3 class="title card__title">Insider Transactions</h3>
          <InsiderTransactions/>
        </section> -->
        <section class="card market-overview__card full-width-chart">
          <h3 class="title card__title">Analyst Recommendations</h3>
          <AnalystRecommendations/>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import BaseTable from './components/BaseTable.vue';
  import BarChart from './components/charts/BarChart.vue';
  import StockChart from './components/charts/StockChart.vue';
  import UseTable from './components/UseTable.vue';
  import SectorCardIndex from './components/SectorCardIndex.vue';
  import OwnershipDistribution from './components/OwnershipDistribution.vue';
  import InsiderTransactions from './components/InsiderTransactions.vue';
  import AnalystRecommendations from './components/AnalystRecommendations.vue';

  export default {
    name: 'MarketOverview',
    components: { 
      BaseTable,
      BarChart,
      StockChart,
      UseTable, SectorCardIndex, OwnershipDistribution, InsiderTransactions, AnalystRecommendations
    },
    data() {
      return {
        // data table example data
        indicators: [
          { id: 1, name: 'Moving Average', value: '23.45' },
          { id: 2, name: 'RSI', value: '56' },
          { id: 3, name: 'MACD', value: '-0.12' },
          { id: 4, name: 'Bollinger Bands', value: 'Up' }
        ],
        indicatorColumns: [
          { prop: 'name', label: 'Indicator Name' },
          { prop: 'value', label: 'Value' }
        ],

        // barchart example data
        performanceData: [
          { date: '2021-Q1', estimate: 5.0, actual: 5.3 },
          { date: '2021-Q2', estimate: 6.3, actual: 6.1 },
          { date: '2021-Q3', estimate: 5.0, actual: 4.8 },
          { date: '2021-Q4', estimate: 7.0, actual: 7.2 },
          { date: '2022-Q1', estimate: 6.5, actual: 6.9 },
          { date: '2022-Q2', estimate: 8.1, actual: 8.3 },
          { date: '2022-Q3', estimate: 9.5, actual: 9.1 },
          { date: '2022-Q4', estimate: 10.0, actual: 10.5 }
        ]

      };
    },
    mounted() {

    },
    methods: {

    }
  };
  </script>
  
  <style scoped lang="scss">
  @import "./market.scss";
  
  .market-overview {
    &__heading {
      color: $color-bg-primary;
    }
  
    &__grid {
      display: grid;
      grid-template-areas:
        "indicators news snapshot"
        "sector volume volume"
        "chart chart chart";
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: auto;
      gap: 16px;
    }
  
    &__card {
    
    }
  
    .indicators-card {
      grid-area: indicators;
    }
  
    .news-card {
      grid-area: news;
    }
  
    .snapshot-card {
      grid-area: snapshot;
    }
  
    .sector-card {
      grid-area: sector;
    }
  
    .volume-card {
      grid-area: volume;
    }
  
    .full-width-chart {
      grid-area: chart;
    }
  }
  </style>
  