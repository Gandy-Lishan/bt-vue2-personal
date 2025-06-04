<template>
    <div class="market-overview">
      <h2 class="market-overview__heading">Market Overview</h2>
  
      <div class="market-overview__grid">
        <!-- 第一行：三列 -->
        <section class="card market-overview__card indicators-card">
          <h3 class="card__title">Indicators</h3>
          <el-table
            :data="indicators"
            border
            stripe
            height="200"
            style="width: 100%;"
            :header-cell-style="{ background: '#1e1e1e', color: '#ccc' }"
            :cell-style="{ color: '#ccc' }"
          >
            <el-table-column prop="name" label="Indicator Name" />
            <el-table-column prop="value" label="Value" />
          </el-table>
        </section>
  
        <section class="card market-overview__card news-card">
          <h3 class="card__title">News</h3>
          <div class="placeholder">[News Feed Placeholder]</div>
        </section>
  
        <section class="card market-overview__card snapshot-card">
          <h3 class="card__title">Market Snapshot</h3>
          <div class="placeholder">[Snapshot Placeholder]</div>
        </section>
  
        <!-- 第二行：两列 -->
        <section class="card market-overview__card sector-card">
          <h3 class="card__title">Sector Performance</h3>
          <div class="placeholder">[Sector Performance Placeholder]</div>
        </section>
  
        <section class="card market-overview__card volume-card">
          <h3 class="card__title">Volume</h3>
          <div class="placeholder">[Volume Placeholder]</div>
        </section>
  
        <!-- 第三行：一整行 -->
        <section class="card market-overview__card full-width-chart">
          <h3 class="card__title">Market Trend Chart</h3>
          <div class="placeholder" style="height: 300px;">[Highcharts Placeholder]</div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MarketOverview',
    data() {
      return {
        indicators: [
          { id: 1, name: 'Moving Average', value: '23.45' },
          { id: 2, name: 'RSI', value: '56' },
          { id: 3, name: 'MACD', value: '-0.12' },
          { id: 4, name: 'Bollinger Bands', value: 'Up' }
        ]
      };
    }
  };
  </script>
  
  <style scoped lang="scss">
  .market-overview {
    &__heading {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 16px;
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
      .card__title {
        font-size: 16px;
        font-weight: 600;
        color: #ccc;
        margin-bottom: 12px;
      }
  
      .placeholder {
        background-color: #2a2a2a;
        border-radius: 6px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-style: italic;
      }
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
  