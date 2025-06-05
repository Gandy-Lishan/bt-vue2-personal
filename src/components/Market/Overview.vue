<template>
    <div class="market-overview">
      <h2 class="heading market-overview__heading">Market Overview</h2>
  
      <div class="market-overview__grid">
        <!-- 第一行：三列 -->
        <section class="card market-overview__card indicators-card">
          <h3 class="card__title">Indicators</h3>
          <BaseTable
            :data="indicators"
            :columns="indicatorColumns"
            :searchable-fields="['name']"
          />
        </section>
  
        <section class="card market-overview__card news-card">
          <h3 class="title card__title">AAPL</h3>
          <BarChart id="eps-growth-chart" />
        </section>
  
        <section class="card market-overview__card snapshot-card">
          <h3 class="title card__title">Market Snapshot</h3>
          <StockChart
            symbol="aapl"
            start-date="2005-05-15"
            end-date="2025-06-01"
            frequency="Daily"
            :chart-height="550"
            line-color="#1E88E5"
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
      </div>
    </div>
  </template>
  
  <script>
  import BaseTable from './components/BaseTable.vue';
  import BarChart from './components/charts/BarChart.vue';
  import StockChart from './components/charts/StockChart.vue';

  export default {
    name: 'MarketOverview',
    components: { 
      BaseTable,
      BarChart,
      StockChart
    },
    data() {
      return {
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
  