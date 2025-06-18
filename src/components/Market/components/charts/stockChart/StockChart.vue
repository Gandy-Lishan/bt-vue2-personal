<template>
  <div>
    <div v-if="isLoading" class="chart-loading">Loading chart data...</div>
    <div v-else-if="error" class="chart-error">{{ error }}</div>
    <div v-else ref="chartContainer" style="width:100%; height:100%"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
Exporting(Highcharts);
ExportData(Highcharts);

export default {
  props: {
    seriesData: Array,
    isLoading: Boolean,
    error: String,
    zoomRange: Object,
    showDefaultZoomSelector: Boolean,
    chartHeight: String,
    enableExporting: Boolean,
  },
  watch: {
    seriesData: {
      immediate: true,
      deep: true,
      handler() {
        if (this.isLoading || this.error) return;

        this.$nextTick(() => {
          this.drawChart();
        });
      },
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
  data() { return { chart: null }; },
  mounted() {},
  beforeDestroy() { this.destroyChart(); },
  methods: {
    drawChart() {
      debugger
      if (this.isLoading || this.error) { this.destroyChart(); return; }
      if (this.chart) this.destroyChart();

      if (!this.seriesData.length) return;

      this.chart = Highcharts.stockChart(this.$refs.chartContainer, {
        chart: { zoomType: 'x', height: this.chartHeight },
        exporting: { enabled: this.enableExporting },
        yAxis: [{
          title: { text: this.currentSymbolName },
          labels: { align: 'right', x: -8, style: { color: '#007bff' } },
          gridLineWidth: 1,
        }],
        tooltip: {
          split: false,
          xDateFormat: '%A, %b %e, %Y',
          formatter() {
            const p = this.points?.[0] || this.point;
            const date = Highcharts.dateFormat('%A, %b %e, %Y', this.x);

            if (p.series.type === 'candlestick') {
              const [open, high, low, close] = [p.open, p.high, p.low, p.close];
              return `
                ${date}<br/>
                <span style="color:${p.series.color}">●</span> ${p.series.name}<br/>
                Open: <b>${open.toFixed(2)}</b><br/>
                High: <b>${high.toFixed(2)}</b><br/>
                Low: <b>${low.toFixed(2)}</b><br/>
                Close: <b>${close.toFixed(2)}</b>
              `;
            } else {
              return `
                ${date}<br/>
                <span style="color:${p.series.color}">●</span> ${p.series.name}: <b>${p.y.toFixed(2)}</b>
              `;
            }
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
        series: this.seriesData,
        rangeSelector: { 
          enabled: this.showDefaultZoomSelector 
        },
      });
      // Apply external zoom if present
      if (this.zoomRange?.min && this.zoomRange?.max) {
        this.chart.xAxis[0].setExtremes(this.zoomRange.min, this.zoomRange.max);
      }
    },

    destroyChart() { this.chart?.destroy(); this.chart = null; },
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
  height: 400px;
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
