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
              {{ `${change}` }}
              {{ `${(changePercentage * 100).toFixed(2)}%` }}
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

          <div class="grid-col-2 btn-grid">
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
                  <path fill="currentColor" d="M7 20v-2.25h-2v-11.5h2V4h1.5v2.25h2v11.5h-2V20h-1.5Zm-0.5 -3.75h2.5v-8.5h-2.5v8.5ZM15.5 20V14.75h-2v-6.5h2V4h1.5v4.25h2v6.5h-2V20h-1.5Zm-0.5 -6.75h2.5v-3.5h-2.5v3.5Z" stroke-width="0.5"></path>
                </svg>
              </button>
            </div>
            <a
              class="full-screen-button"
              href="/backtester/sr/setup"
              target=""
            >
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="currentColor"/>
                </svg>
              <span class="btn-text">Full Chart</span>
              </a>
          </div>
        </div>
      </div>

      <div class="overview__chart">
        <StockChart 
          :seriesData="seriesData"
          :isLoading="isLoading"
          :error="error"
          :zoomRange="zoomRange"
          :showDefaultZoomSelector="false"
          :chartHeight="chartHeight"
          :enableExporting="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import StockChart from '@/components/Market/components/charts/stockChart/StockChart.vue'
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Chart',
  components: {
    StockChart,
  },
  data() {
    return {
      chartType: 'candlestick',
      lineColor: '#007bff',
      zoomRange: null,
      chartHeight: '400px',
      startDate: '2020-01-01',
      endDate: new Date().toISOString().slice(0, 10),

      // zoom btns
      selectedZoom: 'All',
      zoomOptions: [
        { text: '1m', range: 1000 * 60 * 60 * 24 * 30 },
        { text: '3m', range: 1000 * 60 * 60 * 24 * 90 },
        { text: '6m', range: 1000 * 60 * 60 * 24 * 180 },
        { text: 'YTD', range: 'ytd' },
        { text: '1y', range: 1000 * 60 * 60 * 24 * 365 },
        { text: 'All', range: null },
      ],
    };
  },
  computed: {
    symbol() {
      return this.$route.params.symbolname || 'AAPL';
    },
    ...mapGetters("market/sec/metadataChart", [
      "pairData",
      "isLoading",
      "error",
    ]),
    seriesData() {
      // 根據 chartType 格式化數據
      if (!this.pairData || !this.pairData.length) return [];
      const processed = this.pairData.map(item => {
        // const timestamp = new Date(item.DT).getTime();
        const timestamp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(item.DT) ? new Date(item.DT).getTime() : null;
        return this.chartType === 'candlestick'
          ? [timestamp, item.Open, item.High, item.Low, item.Close]
          : [timestamp, item.Close];
      });

      return [
        {
          name: this.symbol,
          type: this.chartType,
          data: processed,
          color: this.lineColor,
          showInNavigator: true,
        },
      ];
    },
    lastPrice() {
      if (!this.pairData || this.pairData.length === 0) return null;
      return this.pairData[this.pairData.length - 1].Close;
    },
    change() {
      if (!this.pairData || this.pairData.length < 2) return null;
      const latest = this.pairData[this.pairData.length - 1].Close;
      const previous = this.pairData[this.pairData.length - 2].Close;
      return +(latest - previous).toFixed(2);
    },
    changePercentage() {
      if (!this.pairData || this.pairData.length < 2) return null;
      const latest = this.pairData[this.pairData.length - 1].Close;
      const previous = this.pairData[this.pairData.length - 2].Close;
      return +((latest - previous) / previous).toFixed(4);
    },
  },
  mounted() {
    this.reloadData();
  },
  watch: {
    symbol: 'reloadData',
    startDate: 'reloadData',
    endDate: 'reloadData',
    lineColor: 'reloadData',
  },
  methods: {
    ...mapActions("market/sec/metadataChart", ["fetchChartData"]),
    reloadData() {
      this.fetchChartData({
        symbol: this.symbol,
        startDate: this.startDate,
        endDate: this.endDate,
      });
    },
    setZoom(option) {
      this.selectedZoom = option.text;

      const now = new Date(this.endDate).getTime();

      if (option.range === 'ytd') {
        const yearStart = new Date(new Date(this.endDate).getFullYear(), 0, 1).getTime();
        this.zoomRange = { min: yearStart, max: now };
      } else if (option.range === null) {
        // 全部范围，清除 extremes
        this.zoomRange = { min: null, max: null };
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

.full-screen-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 $spacing-md;
  border: none;
  border-radius: $border-radius-base;
  background-color: $color-blue;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  box-shadow: 0 2px 4px $color-shadow;
}

.full-screen-button:hover:not(.is-disabled) {
  background-color: $color-blue-hover;
}

.full-screen-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.full-screen-button .icon {
  width: 20px; /* 图标大小 */
  height: 20px; /* 图标大小 */
  margin-right: $spacing-xs; /* 图标与文字间距 */
  vertical-align: middle; /* 垂直对齐 */
}

.full-screen-button .btn-text {
  vertical-align: middle; /* 垂直对齐 */
}

.btn-grid {
  grid-template-columns: auto 1fr;
}
</style>