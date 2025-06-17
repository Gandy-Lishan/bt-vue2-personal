<template>
  <div>
    <div class="title">Chart</div>
    <div class="overview card">
      <div class="overview__toolbar">
        <div class="overview__legend">
          <div class="symbol-name">{{ symbol }}</div>
          <div class="symbol-price">
            <span class="price">${{ lastPrice }}</span>
            <span class="change up">
              {{ `${change > 0 ? '+' : '-'}${change}` }}
              {{ `${changePercentage > 0 ? '+' : '-'}${(changePercentage * 100).toFixed(2)}%` }}
              <span class="interval">1 day</span>
            </span>
          </div>
        </div>
        <div class="overview__tool">
          <div class="overview__tool-zoom-buttons">
            <button v-for="option in zoomOptions" :key="option.text" class="overview__tool-zoom-button"
              :class="{ active: selectedZoom === option.text }" @click="setZoom(option)">
              {{ option.text }}
            </button>
          </div>
          <!-- <select v-model="chartType" class="overview__tool-type">
                <option value="line">Line</option>
                <option value="candlestick">Candlestick</option>
            </select> -->
          <div class="card overview__tool-type-toggle">
            <button class="overview__tool-type-toggle-button" :class="{ active: chartType === 'line' }"
              @click="chartType = 'line'" title="Line Chart">
              <!-- 折线图图标 -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 17L10 11L14 15L20 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <circle cx="4" cy="17" r="1.5" fill="currentColor" />
                <circle cx="10" cy="11" r="1.5" fill="currentColor" />
                <circle cx="14" cy="15" r="1.5" fill="currentColor" />
                <circle cx="20" cy="9" r="1.5" fill="currentColor" />
              </svg>
            </button>
            <button class="overview__tool-type-toggle-button" :class="{ active: chartType === 'candlestick' }"
              @click="chartType = 'candlestick'" title="Candlestick Chart">
              <!-- K线图图标 -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Candlestick-Chart--Streamline-Sharp-Material" height="24" width="24">
                <desc>
                  Candlestick Chart Streamline Icon: https://streamlinehq.com
                </desc>
                <path fill="currentColor" d="M7 20v-2.25h-2v-11.5h2V4h1.5v2.25h2v11.5h-2V20h-1.5Zm-0.5 -3.75h2.5v-8.5h-2.5v8.5ZM15.5 20V14.75h-2v-6.5h2V4h1.5v4.25h2v6.5h-2V20h-1.5Zm-0.5 -6.75h2.5v-3.5h-2.5v3.5Z" stroke-width="0.5"></path>
              </svg>
            </button>
          </div>

        </div>
      </div>

      <div class="overview__chart">
        <StockChart :symbol="symbol" :startDate="startDate" :endDate="endDate" :zoomRange="zoomRange"
          :showDefaultZoomSelector="false" chartHeight="400px" :chartType="chartType" />
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
  background: $color-bg-primary;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: start;
    flex-direction: column;
    padding: $spacing-sm $spacing-md;
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

    &-zoom-buttons {
      display: flex;
      gap: $spacing-xs;
      padding: $spacing-xxs;

      .overview__tool-zoom-button {
        width: 36px;
        height: 36px;
        border: none;
        border-radius: $border-radius-base;
        background-color: #f5f5f5;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;
        font-size: 13px;

        &:hover {
          background-color: #e0e0e0;
        }

        &.active {
          background-color: $color-blue;
          color: white;
        }
      }
    }

    &-type-toggle {
      display: flex;
      gap: $spacing-xs;
      padding: $spacing-xxs;

      &-button {
        width: 36px;
        height: 36px;
        border: none;
        border-radius: $border-radius-base;
        background-color: #f5f5f5;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;

        svg {
          display: block;
        }

        &:hover {
          background-color: #e0e0e0;
        }

        &.active {
          background-color: $color-blue;
          color: white;
        }
      }
    }
  }

  &__chart {
    padding: 16px;
  }
}


</style>