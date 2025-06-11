<template>
    <div class="market-overview">
      <h2 class="heading market-overview__heading">Market Overview</h2>
  
      <div class="grid market-overview__grid">
        <!-- 第一行：三列 -->
        <section class="card market-overview__card indicators-card">
          <h3 class="card__title">Indicators</h3>
          <UseTable/>
        </section>
  
        <section class="card market-overview__card news-card">
          <h3 class="title card__title">News</h3>
          <!-- <div class="card__item">[News placeholder]</div> -->
          <BarChart
            :chart-data="[
              { date: 'Q1', estimate: 1.2, actual: 1.5 },
              { date: 'Q2', estimate: 1.4, actual: 1.3 },
              { date: 'Q3', estimate: 1.6, actual: 1.7 }
            ]"
            :series-configs="[
              { key: 'estimate', label: 'Estimate', color: '#A9A9A9' },
              { key: 'actual', label: 'Actual', color: '#4682B4' }
            ]"
            title-text="EPS Comparison"
            orientation="bar"
            chart-height="auto"
            :enableExporting="false"
          />
        </section>
  
        <section class="card market-overview__card volume-card">
          <h3 class="title card__title">Volume</h3>
            <div class="card__item">
              [Volume placeholder]
            </div>
        </section>
  
        <!-- 第二行：两列 -->
        <section class="card market-overview__card sector-card">
          <h3 class="title card__title">Sector Performance</h3>
          <SectorCardIndex/>
        </section>
  
        <section class="card market-overview__card snapshot-card">
          <h3 class="title card__title">Snapshot</h3>
             <StockChartGroup
                  :symbols="['AAPL','AAON']"
                  :startDate="startDate"
                  :endDate="endDate"
              />
        </section>
  
        <!-- 第三行：一整行 -->
        <section class="card market-overview__card ownership-chart">
          <h3 class="title card__title">Ownership Distribution</h3>
          <div class="card__item">
            <PieChart
            :chart-data="[
              { name: 'Executive Insiders', y: 43.5, color: '#2196F3' },
              { name: 'Institutions', y: 33.5, color: '#1A237E' },
              { name: 'Mutual Funds', y: 23.0, color: '#03A9F4' },
              { name: 'Public Float', y: 0, color: '#B3E5FC' }
            ]"
            title-text="Ownership Distribution"
            :show-legend="true"
            inner-size="50%"
            chart-height="350px"
            :enableExporting="true"
          />
          </div>
        </section>
        <section class="card market-overview__card transaction-chart">
          <h3 class="title card__title">Insider Transactions</h3>
          <div class="card__item">
            <BarChart
              :chart-data="[
                { date: '2024-Q1', shares: 123 },
                { date: '2024-Q2', shares: 156 },
                { date: '2024-Q3', shares: 98 },
                { date: '2024-Q4', shares: 172 }
              ]"
              :series-configs="[
                { key: 'shares', label: 'Total Shares', color: '#4CAF50' }
              ]"
              title-text="Quarterly Shares Growth"
              orientation="column"
              chart-height="auto"
              y-axis-title-text="Shares"
              :enableExporting="true"
            />  
          </div>
        </section> 
        <section class="card market-overview__card analyst-chart">
          <h3 class="title card__title">Analyst Recommendations</h3>
          <BaseDashboard
            title="Analyst Recommendations"
            :value="2.8"
            :data="[
              { name: 'Strong Buy', value: 7, color: '#2196F3' },
              { name: 'Buy', value: 23, color: '#90CAF9' },
              { name: 'Hold', value: 16, color: '#80DEEA' },
              { name: 'Sell', value: 2, color: '#FFB74D' },
              { name: 'Strong Sell', value: 1, color: '#FF8A65' }
            ]"
            :fullCircle="false"            
            :exportable="true"
          />
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import BaseTable from './components/tables/BaseTable.vue';
  import BarChart from './components/charts/BarChart.vue';
  import UseTable from './components/tables/UseTable.vue';
  import SectorCardIndex from './components/sectorCard/index.vue';
  import PieChart from './components/charts/PieChart.vue';
  import BaseDashboard from './components/charts/BaseDashboard.vue';
  import StockChartGroup from '@/components/Market/components/charts/stockChart/StockChartGroup.vue'

  export default {
    name: 'MarketOverview',
    components: { 
      BaseTable,
      BarChart,
      StockChartGroup,
      UseTable, SectorCardIndex, PieChart, BaseDashboard
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
        ],

        // stockchart group
        startDate: '2020-01-01',
        endDate: new Date().toISOString().slice(0, 10),
      };
    },
    mounted() {

    },
    methods: {

    }
  };
  </script>
  
  <style scoped lang="scss">
   @import "@/components/Market/market.scss";
  
  .market-overview {
    padding: $spacing-md;

    &__heading {
      color: $color-text-secondary;
    }
  
    &__grid {
      grid-template-areas:
        "indicators news volume"
        "sector snapshot snapshot"
        "chart chart chart"
        "ownership-chart transaction-chart analyst-chart";
      grid-template-columns: repeat(3, minmax(280px, 1fr));
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
  