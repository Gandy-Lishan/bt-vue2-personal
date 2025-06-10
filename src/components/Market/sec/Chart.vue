<template>
    <div>
    <div class="card__title">Chart</div>
    <div class="overview card">
      <div class="overview__toolbar">
        <div class="overview__legend">
          <div class="symbol-name">{{ symbol }}</div>
          <div class="symbol-price">
            <span class="price">${{ lastPrice }}</span>
            <span class="change up">
                {{ `${change>0?'+':'-'}${change}` }}
                {{ `${changePercentage>0?'+':'-'}${(changePercentage*100).toFixed(2)}%` }} 
                <span class="interval">1 day</span>
            </span>
          </div>
        </div>
        <div  class="overview__tool">
            <div class="overview__tool-zoom-buttons">
                <button
                    v-for="option in zoomOptions"
                    :key="option.text"
                    class="overview__tool__zoom-button"
                    :class="{ active: selectedZoom === option.text }"
                    @click="setZoom(option)"
                >
                    {{ option.text }}
                </button>
            </div>
            <select v-model="chartType" class="overview__tool-type">
                <option value="line">Line</option>
                <option value="candlestick">Candlestick</option>
            </select>
        </div>
      </div>
  
      <div class="overview__chart">
        <StockChart
          :symbol="symbol"
          :startDate="startDate"
          :endDate="endDate"
          :zoomRange="zoomRange"
          :showDefaultZoomSelector="false"
          chartHeight="400px"
          :chartType="chartType"
        />
      </div>
    </div>
</div>
  </template>
  
  <script>
  import StockChart from '@/components/Market/components/charts/stockChart/StockChart.vue'
  
  export default {
    name: 'Chart',
    components: {
      StockChart,
    },
    data() {
      return {
        chartType: 'candlestick',
        zoomRange: null,
        selectedZoom: 'All',
        zoomOptions: [
          { text: '1m', range: 1000 * 60 * 60 * 24 * 30 },
          { text: '3m', range: 1000 * 60 * 60 * 24 * 90 },
          { text: '6m', range: 1000 * 60 * 60 * 24 * 180 },
          { text: 'YTD', range: 'ytd' },
          { text: '1y', range: 1000 * 60 * 60 * 24 * 365 },
          { text: 'All', range: null },
        ],
        startDate: '2020-01-01',
        endDate: new Date().toISOString().slice(0, 10),
        lastPrice: 150.25,
        change: 3.29,
        changePercentage: 0.0164,
      };
    },
    computed: {
      symbol() {
        return this.$route.params.symbolname || 'AAPL';
      },
    },
    methods: {
      setZoom(option) {
        this.selectedZoom = option.text;
  
        const now = new Date(this.endDate).getTime();
  
        if (option.range === 'ytd') {
          const yearStart = new Date(new Date(this.endDate).getFullYear(), 0, 1).getTime();
          this.zoomRange = { min: yearStart, max: now };
        } else if (option.range === null) {
          this.zoomRange = null;
        } else {
          this.zoomRange = { min: now - option.range, max: now };
        }
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/components/Market/market.scss";
  
  .overview {
    padding: $spacing-md;
    background: $color-text-primary;
  
    &__toolbar {
        display: flex;
        justify-content: space-between;
        align-items: start;
        flex-direction: column;
        padding: $spacing-sm $spacing-md;
        margin-bottom: $spacing-sm;
        gap: $spacing-xs;
    }
  
    &__legend {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
  
      .symbol-name {
        font-size: 14px;
        font-weight: bold;
        color: #444;
      }
  
      .symbol-price {
        display: flex;
        gap: 8px;
        align-items: center;
        .price {
          font-size: 24px;
          font-weight: bold;
        }
  
        .change {
          font-size: 14px;
          &.up {
            color: #1abc9c;
          }
          &.down {
            color: #e74c3c;
          }
  
          .interval {
            font-size: 12px;
            color: #888;
            margin-left: 4px;
          }
        }
      }
    }
    &__tool {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    &__tool-zoom-buttons {
        display: flex;
        gap: 8px;
    }
    &__tool-zoom-button {
        margin: 0 4px;
        padding: 6px 12px;
        background: #f2f2f2;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 13px;
        cursor: pointer;

        &.active {
        background: #006cff;
        color: #fff;
        border-color: #006cff;
        }

        &:hover {
        background: #e0e0e0;
        }
    }
    &__chart {
      padding: 16px;
    }
  }
  </style>
  