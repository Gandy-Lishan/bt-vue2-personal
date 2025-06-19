<template>
  <div class="bar-chart">
    <div v-if="isLoading" class="chart-loading">Loading chart data...</div>

    <div
      v-show="!isLoading"
      ref="chartContainer"
      :style="{ width: '100%', height: chartHeight, borderRadius: 'inherit' }"
    ></div>

    <div v-if="error && !isLoading" class="chart-error">{{ error }}</div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";

Exporting(Highcharts);
ExportData(Highcharts);

export default {
  props: {
    chartData: { type: Array, required: true },
    seriesConfigs: {
      type: Array,
      required: true,
      validator: arr =>
        Array.isArray(arr) &&
        arr.every(item =>
          item &&
          typeof item === "object" &&
          "key" in item &&
          "label" in item &&
          "color" in item
        ),
    },
    titleText: { type: String, default: "" },
    chartHeight: { type: String, default: "400px" },
    enableExporting: { type: Boolean, default: true },
    orientation: {
      type: String,
      default: "column",
      validator: val => ["column", "bar"].includes(val),
    },
    yAxisTitleText: { type: String, default: "Value" },
    legendPosition: {
      type: String,
      default: "bottomcenter",
      validator: val => ["topleft", "topright", "bottomcenter"].includes(val),
    },
    showLegend: { type: Boolean, default: true },
    stacking: {
      type: String,
      default: null,
      validator: val => ["normal", "percent", null].includes(val),
    },
    enablePositiveNegativeColors: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false }, // 👈 新增由外部控制的 isLoading prop
  },
  data() {
    return {
      chart: null,
      error: null,
      categories: [],
      seriesData: [],
      resizeObserver: null,
      _rawLabels: {},
    };
  },
  watch: {
    chartData: { deep: true, handler: "processDataAndInitializeChart" },
    seriesConfigs: { deep: true, handler: "reRenderChartWithCurrentData" },
    chartHeight: "reRenderChartWithCurrentData",
    orientation: "reRenderChartWithCurrentData",
    enableExporting: "reRenderChartWithCurrentData",
    titleText: "reRenderChartWithCurrentData",
    yAxisTitleText: "reRenderChartWithCurrentData",
    legendPosition: "reRenderChartWithCurrentData",
    isLoading: "reRenderChartWithCurrentData", // 👈 isLoading 變化也重新渲染
  },
  mounted() {
    if (!this.isLoading && this.chartData?.length > 0) {
      this.processDataAndInitializeChart();
    }

    const el = this.$refs.chartContainer;
    if (el) {
      this.resizeObserver = new ResizeObserver(() => {
        this.reflowChart();
      });
      this.resizeObserver.observe(el);
    }
  },
  beforeDestroy() {
    this.destroyChart();
    this.resizeObserver?.disconnect();
  },
  methods: {
    processDataAndInitializeChart() {
      if (this.isLoading) return;

      if (!this.chartData || this.chartData.length === 0) {
        this.error = "No data available to process for the chart.";
        this.destroyChart();
        return;
      }

      const valueAndLabel = (raw) => {
        if (typeof raw === 'number') return { value: raw, label: String(raw) };
        if (typeof raw === 'string') {
          const match = raw.match(/^([^\d\.-]*)([\d\.,+-]+)(.*)$/);
          if (match) {
            const num = parseFloat(match[2].replace(/,/g, ''));
            return { value: isNaN(num) ? null : num, label: raw };
          }
          return { value: null, label: raw };
        }
        return { value: null, label: '' };
      };

      try {
        this.error = null;
        this.destroyChart();

        this.categories = this.chartData.map(item => item.date);
        this._rawLabels = {};
        this.seriesData = this.seriesConfigs.map(cfg => {
          const dataArr = this.chartData.map(item => {
            const { value, label } = valueAndLabel(item[cfg.key]);
            if (!this._rawLabels[cfg.key]) this._rawLabels[cfg.key] = [];
            this._rawLabels[cfg.key].push(label);
            return value;
          });
          const baseConfig = {
            name: cfg.label,
            data: dataArr,
            type: cfg.type || this.orientation,
          };

          if (this.enablePositiveNegativeColors) {
            baseConfig.zones = [
              { value: 0, color: "#D64A3B" },
              { color: "#4CAF50" },
            ];
          } else {
            baseConfig.color = cfg.color;
          }

          return baseConfig;
        });

        this.initializeChart();
      } catch (err) {
        console.error("Error processing chart data:", err);
        this.error = "Failed to process chart data." + (err.message ? ` Details: ${err.message}` : "");
        this.categories = [];
        this.seriesData = [];
      }
    },

    reRenderChartWithCurrentData() {
      if (!this.isLoading && !this.error && this.categories.length > 0 && this.seriesData.length > 0) {
        this.destroyChart();
        this.initializeChart();
      }
    },

    initializeChart() {
      if (!this.$refs.chartContainer) {
        this.error = "Chart container not available.";
        return;
      }

      this.chart = Highcharts.chart(this.$refs.chartContainer, {
        chart: {
          type: this.orientation,
          height: this.chartHeight,
          spacingTop: 30,
        },
        title: { text: this.titleText },
        exporting: { enabled: this.enableExporting },
        xAxis: {
          categories: this.categories,
          crosshair: true,
        },
        yAxis: {
          title: { text: this.yAxisTitleText },
          labels: {
            formatter: function() {
              const chart = this.axis.chart;
              if (!chart.options._rawLabels) return this.value;
              const rawLabelsArr = Object.values(chart.options._rawLabels)[0];
              if (!rawLabelsArr) return this.value;
              let closest = this.value, minDiff = Infinity;
              for (const raw of rawLabelsArr) {
                const match = raw.match(/([\d\.,+-]+)/);
                if (match) {
                  const num = parseFloat(match[1].replace(/,/g, ''));
                  if (!isNaN(num)) {
                    const diff = Math.abs(num - this.value);
                    if (diff < minDiff) {
                      minDiff = diff;
                      closest = raw;
                    }
                  }
                }
              }
              return closest;
            }
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
          footerFormat: "</table>",
          shared: true,
          useHTML: true,
        },
        legend: this.showLegend
          ? {
              ...this.getLegendConfig(),
              enabled: true,
              margin: 24,
            }
          : { enabled: false },
        credits: {
          enabled: true,
          text: "SENTIMENTRADER",
          href: "#",
          position: { align: "right", x: -10, y: -10 },
        },
        plotOptions: {
          [this.orientation]: {
            pointPadding: 0.2,
            groupPadding: 0.1,
            borderWidth: 0,
            stacking: this.stacking || undefined,
            dataLabels: { enabled: false },
          },
        },
        series: this.seriesData,
        _rawLabels: this._rawLabels,
      });
    },

    getLegendConfig() {
      const positions = {
        topleft: { align: "left", verticalAlign: "top", layout: "horizontal", x: 0, y: 0 },
        topright: { align: "right", verticalAlign: "top", layout: "horizontal", x: 0, y: -20 },
        bottomcenter: { align: "center", verticalAlign: "bottom", layout: "horizontal", x: 0, y: 0 },
      };
      return {
        ...positions[this.legendPosition],
        symbolRadius: 4,
        itemMarginTop: 5,
        itemStyle: {
          fontWeight: "normal",
          fontSize: "12px",
        },
      };
    },

    destroyChart() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    },

    reflowChart() {
      if (this.chart) {
        console.log("reflow barchart");
        this.chart.reflow();
      }
    },
  },
};
</script>

<style scoped>
.bar-chart {
  background: white;
  width: 100%;
  border-radius: inherit;
}

.chart-loading,
.chart-error {
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
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ffcdd2;
}
</style>
