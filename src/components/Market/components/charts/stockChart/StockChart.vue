// StockChart.vue
<template>
  <div class="stock-chart">
    {{chartType}}
    {{seriesDataCache}}
    <div v-if="isLoading" class="chart-loading">Loading chart data...</div>
    <div v-show="!isLoading" ref="chartContainer" :style="{ width: '100%', height: chartHeight, borderRadius: 'inherit' }"></div>
    <div v-if="error && !isLoading" class="chart-error">{{ error }}</div>
  </div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import { getPairData } from '@/service/service';
import { timestampToTime } from '@/utils';

Exporting(Highcharts);
ExportData(Highcharts);

export default {
  props: {
    symbol: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    chartHeight: { type: String, default: '100%' },
    lineColor: { type: String, default: '#007bff' },
    enableExporting: { type: Boolean, default: true },
    zoomRange: { type: Object, default: null },
    showDefaultZoomSelector: { type: Boolean, default: true },
    chartType: { type: String, default: 'line' },
  },
  data() {
    return {
      chart: null,
      isLoading: false,
      error: null,
      seriesDataCache: [],
      currentSymbolName: '',
    };
  },
  watch: {
    symbol: 'fetchDataAndInitializeChart',
    startDate: 'fetchDataAndInitializeChart',
    endDate: 'fetchDataAndInitializeChart',
    chartHeight: 'reRenderChartWithCurrentData',
    lineColor: 'reRenderChartWithCurrentData',
    enableExporting: 'reRenderChartWithCurrentData',
    chartType(newType) {
      this.updateChartTypeOnly(newType);
    },
    zoomRange: {
      handler(val) {
        if (this.chart) {
          if (val?.min && val?.max) {
            this.chart.xAxis[0].setExtremes(val.min, val.max);
          } else {
            this.chart.xAxis[0].setExtremes(); // Reset to full range
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchDataAndInitializeChart();
  },
  beforeDestroy() {
    this.destroyChart();
  },
  methods: {
    async fetchDataAndInitializeChart() {
      if (!this.symbol || !this.startDate || !this.endDate) {
        this.error = 'Missing required props to fetch data.';
        this.isLoading = false;
        this.destroyChart();
        return;
      }
      this.isLoading = true;
      this.error = null;
      this.destroyChart();

      try {
        const response = await getPairData(this.startDate, this.endDate, 'daily', this.symbol);
        this.currentSymbolName = this.symbol;
        const processedData = (response?.data || []).map(item => {
          // return [/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(item.DT) ? new Date(item.DT).getTime() : null, item.Close];
          const timestamp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(item.DT) ? new Date(item.DT).getTime() : null;
          if (this.chartType === 'candlestick') {
            return [timestamp, item.Open, item.High, item.Low, item.Close];
          } else {
            return [timestamp, item.Close];
          }
        });

        this.seriesDataCache = [{
          name: this.currentSymbolName,
          data: processedData,
          type: this.chartType, 
          color: this.lineColor,
          showInNavigator: true,
        }];

        this.$emit('symbol-updated', this.currentSymbolName);

        if (processedData.length > 0) {
          this.initializeChart();
        } else {
          this.error = `No data to display for ${this.currentSymbolName}`;
        }
      } catch (err) {
        this.error = `Failed to load chart data: ${err.message}`;
      } finally {
        this.isLoading = false;
      }
    },
    reRenderChartWithCurrentData() {
      if (this.seriesDataCache[0]?.data?.length && !this.isLoading && !this.error) {
        this.destroyChart();
        this.initializeChart();
      }
    },
    initializeChart() {
      if (!this.$refs.chartContainer || !this.seriesDataCache[0]?.data?.length) return;

      this.chart = Highcharts.stockChart(this.$refs.chartContainer, {
        chart: { zoomType: 'x', height: this.chartHeight, backgroundColor: 'transparent' },
        title: { text: null },
        exporting: {
          enabled: this.enableExporting,
          buttons: {
            contextButton: {
              menuItems: ["printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"],
            },
          },
        },
        yAxis: [{
          title: { text: this.currentSymbolName },
          labels: { align: 'right', x: -8, style: { color: this.lineColor } },
          gridLineWidth: 1,
        }],
        legend: { enabled: false },
        credits: { enabled: false },
        tooltip: {
          split: false,
          xDateFormat: '%A, %b %e, %Y',
          formatter() {
            const p = this.points?.[0] || this.point;
            return `${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}<br/><span style=\"color:${p.series.color}\">●</span> ${p.series.name}: <b>${p.y.toFixed(2)}</b>`;
          },
        },
        plotOptions: {
          line: {
            lineWidth: 2,
            states: { hover: { lineWidthPlus: 1 } },
            marker: { enabled: false, radius: 3, states: { hover: { enabled: true } } },
          },
          series: { showInNavigator: true },
        },
        series: this.seriesDataCache,
        rangeSelector: {
          enabled: this.showDefaultZoomSelector,
        },
      });

      // Apply external zoom if present
      if (this.zoomRange?.min && this.zoomRange?.max) {
        this.chart.xAxis[0].setExtremes(this.zoomRange.min, this.zoomRange.max);
      }
    },
    destroyChart() {
      this.chart?.destroy();
      this.chart = null;
    },
    updateChartTypeOnly(newType) {
      if (!this.chart || !this.seriesDataCache.length) return;

      // 如果是 candlestick，需要 5 个值，否则只取收盘价重新构造数据
      const rawData = this.seriesDataCache[0].data;

      const newData = rawData.map(d => {
        if (newType === 'candlestick') {
          // 如果原始数据就是 [timestamp, open, high, low, close]
          return d.length === 5 ? d : [d[0], d[1], d[1], d[1], d[1]];
        } else {
          // 使用收盘价（或你可以选择返回 d[4]）
          return [d[0], d.length === 5 ? d[4] : d[1]];
        }
      });

      this.seriesDataCache[0].type = newType;
      this.seriesDataCache[0].data = newData;

      // 更新图表中的 series
      const chartSeries = this.chart.series[0];
      chartSeries.update({
        type: newType,
        data: newData,
      }, true);
    },
  },
};
</script>

<style scoped>
.stock-chart {
  background: white;
  width: 100%;
  border-radius: inherit;
}
.chart-loading, .chart-error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #888;
  font-style: italic;
  border: 1px dashed #ccc;
  box-sizing: border-box;
}
.chart-error {
  color: #D32F2F;
  background-color: #FFEBEE;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #FFCDD2;
}
</style>
