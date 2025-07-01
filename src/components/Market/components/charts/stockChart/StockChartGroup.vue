<template>
    <div class="stock-chart-group">
      <div class="stock-chart-group__toolbar">
        <div class="stock-chart-group__legend">{{ currentSymbol }}</div>
        <div class="stock-chart-group__zoom-buttons">
          <button
            v-for="option in zoomOptions"
            :key="option.text"
            class="stock-chart-group__zoom-button"
            @click="setZoom(option)"
          >
            {{ option.text }}
          </button>
        </div>
      </div>
  
      <div class="stock-chart-group__charts">
        <StockChart
          v-for="symbol in symbols"
          :key="symbol"
          :symbol="symbol"
          :startDate="startDate"
          :endDate="endDate"
          :zoomRange="zoomRange"
          :showDefaultZoomSelector="false"
          @symbol-updated="currentSymbol = $event"
        />
      </div>
    </div>
  </template>
  
  <script>
  import StockChart from './StockChart.vue';
  
  export default {
    name: 'StockChartGroup',
    components: { StockChart },
    props: {
      symbols: { type: Array, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
    },
    data() {
      return {
        currentSymbol: '',
        zoomRange: null,
        zoomOptions: [
          { text: '3M', range: 1000 * 60 * 60 * 24 * 90 },
          { text: '6M', range: 1000 * 60 * 60 * 24 * 180 },
          { text: '1Y', range: 1000 * 60 * 60 * 24 * 365 },
          { text: 'All', range: null },
        ],
      };
    },
    methods: {
      setZoom(option) {
        const now = new Date(this.endDate).getTime();
        this.zoomRange = option.range
          ? { min: now - option.range, max: now }
          : null; // 'All'
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  .stock-chart-group {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    &__legend {
        font-weight: bold;
        font-size: 1.1em;
    }
    
    &__zoom-buttons {
        display: flex;
        gap: 8px;
    }
    
    &__zoom-button {
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
    
    &__charts {
        display: flex;
        flex-direction: row;
        gap: 24px;
    }
  }
  </style>
  