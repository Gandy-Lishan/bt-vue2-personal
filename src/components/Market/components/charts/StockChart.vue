<template>
    <div>
      <div v-if="isLoading" class="chart-loading">Loading chart data...</div>
      <div v-show="!isLoading" ref="chartContainer" :style="{ width: '100%', height: chartHeight }"></div>
      <div v-if="error && !isLoading" class="chart-error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import Highcharts from "highcharts/highstock";
  import Exporting from "highcharts/modules/exporting";
  import ExportData from "highcharts/modules/export-data";
  
  import { getPairData } from '@/service/service'
  import { isJson, timestampToTime } from '@/utils'

  
  // Enable Highcharts modules
  Exporting(Highcharts);
  ExportData(Highcharts);
  
  export default {
    props: {
      symbol: { // Changed from 'symbols' to 'symbol'
        type: String,
        required: true,
      },
      startDate: {
        type: String,
        required: true,
      },
      endDate: {
        type: String,
        required: true,
      },
      chartHeight: {
        type: String,
        default: '100%',
      },
      lineColor: { // Optional: allow customizing line color
        type: String,
        default: "#007bff" // A nice blue, change as you like
      },
      enableExporting: { // New prop to control exporting
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {
        chart: null,
        isLoading: false,
        error: null,
        // seriesDataCache will hold an array with a single series object
        seriesDataCache: [],
        currentSymbolName: "", // To store the symbol name for titles
      };
    },
    watch: {
      symbol: "fetchDataAndInitializeChart",
      startDate: "fetchDataAndInitializeChart",
      endDate: "fetchDataAndInitializeChart",
      chartHeight: "reRenderChartWithCurrentData",
      lineColor: "reRenderChartWithCurrentData",
      enableExporting: "reRenderChartWithCurrentData" // Re-render if exporting changes
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
          this.error = "Missing required props to fetch data (symbol, startDate, endDate).";
          this.isLoading = false; // Ensure loading is false if we bail early
          this.destroyChart();
          return;
        }
  
        this.isLoading = true;
        this.error = null;
        this.destroyChart();
  
        try {
          // Directly call the imported getPairData function
          const response = await getPairData(this.startDate, this.endDate, 'daily', this.symbol);
  debugger
          this.currentSymbolName = this.symbol;
  
          if (!response || !response.data || !Array.isArray(response.data)) {
            console.warn(`No data or malformed data returned for symbol: ${this.currentSymbolName}`);
            this.seriesDataCache = [{
              name: this.currentSymbolName,
              data: [],
              type: "line",
              color: this.lineColor,
              showInNavigator: true,
            }];
          } else {
            const processedData = response.data.map((item) => {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
                    if (dateRegex.test(item.DT)) {
                        const currentDate = timestampToTime(item.DT)
                        return [new Date(item.DT).getTime(), item.Close]
                    } else {
                            return [null, item.Close]
                    }
            })
  
            this.seriesDataCache = [{
              name: this.currentSymbolName,
              data: processedData,
              type: "line",
              color: this.lineColor,
              showInNavigator: true,
            }];
          }
          
          if (this.seriesDataCache[0].data.length === 0) {
               this.error = `No data points to display for ${this.currentSymbolName} over the selected period.`;
          } else {
              this.initializeChart();
          }
  
        } catch (err) {
          console.error(`Error fetching chart data for ${this.symbol}:`, err);
          this.error = `Failed to load chart data for ${this.symbol}.`;
          if (err.message) {
              this.error += ` Details: ${err.message}`;
          }
          this.seriesDataCache = [];
          this.currentSymbolName = "";
        } finally {
          this.isLoading = false;
        }
      },
  
      reRenderChartWithCurrentData() {
          if (this.seriesDataCache && this.seriesDataCache.length > 0 && this.seriesDataCache[0].data.length > 0 && !this.isLoading && !this.error) {
              this.destroyChart();
              this.initializeChart();
          } else if (this.error && this.isLoading){
              // If there was an error during load, and we are not loading, don't try to re-render
              // This case might be if height changes while an error is displayed
          } else if (!this.isLoading && (!this.seriesDataCache || this.seriesDataCache.length === 0 || this.seriesDataCache[0].data.length === 0)){
              // Data might have been empty, try to re-fetch if props like dates changed, handled by other watchers.
              // If only height or color changed and there's no data, do nothing or re-evaluate.
              // For now, we only re-render if valid data exists.
          }
      },
  
      initializeChart() {
        if (!this.$refs.chartContainer || !this.seriesDataCache || this.seriesDataCache.length === 0 || this.seriesDataCache[0].data.length === 0) {
          if (!this.error && !this.isLoading) { // Only set error if not already set by fetch
              this.error = "Chart container not available or no data to display.";
          }
          return;
        }
        
        const yAxisTitle = this.currentSymbolName || 'Value';
  
        this.chart = Highcharts.stockChart(this.$refs.chartContainer, {
          chart: {
            zoomType: "x",
            height: this.chartHeight,
          },
          title: {
            text: null,
          },
          exporting: { // Conditionally enable exporting
            enabled: this.enableExporting,
            buttons: { // Define buttons structure; Highcharts handles visibility if enabled is false
                contextButton: {
                menuItems: [
                    "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG",
                    "separator", "downloadCSV", "downloadXLS",
                ],
                },
            },
          },
          yAxis: [ // Single Y-axis configuration
            {
              title: { text: yAxisTitle },
              labels: {
                align: "right",
                x: -8,
                style: { color: this.lineColor }
              },
              //opposite: false, // Y-axis on the left
              gridLineWidth: 1,
            }
          ],
          legend: {
            enabled: false, // Legend not needed for a single series
          },
          rangeSelector: {
            selected: 1,
            allButtonsEnabled: true,
            buttons: [
                { type: 'month', count: 3, text: '3m' },
                { type: 'month', count: 6, text: '6m' },
                { type: 'ytd', text: 'YTD' },
                { type: 'year', count: 1, text: '1y' },
                { type: 'year', count: 3, text: '3y' },
                { type: 'year', count: 5, text: '5y' },
                { type: 'year', count: 10, text: '10y' },
                { type: 'all', text: 'All' }
            ]
          },
          credits: {
            enabled: true,
            text: "SENTIMENTRADER",
            href: '#',
            position: { align: 'right', x: -10, y: -5 }
          },
          tooltip: {
            // For a single series, 'split: false' and a simple pointFormat or formatter is often cleaner.
            // The previous shared tooltip is fine too, but this is an alternative:
            split: false,
            xDateFormat: '%A, %b %e, %Y',
            pointFormat: `<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:.2f}</b><br/>`,
            // If you prefer the previous formatter style:
            formatter: function () {
               let s = `${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}<br/>`;
               // this.points will only have one point for a single series chart if not shared
               const point = this.points ? this.points[0] : this.point;
               if (point) {
                 const colorSpan = `<span style="color:${point.series.color}">●</span> `;
                 s += `${colorSpan} ${point.series.name}: <b>${point.y.toFixed(2)}</b><br/>`;
               }
               return s;
            }
          },
          plotOptions: {
            line: {
              lineWidth: 2,
              states: {
                hover: {
                  lineWidthPlus: 1,
                },
              },
              marker: {
                enabled: false,
                radius: 3,
                states: { hover: { enabled: true } }
              }
            },
            series: {
               showInNavigator: true,
            }
          },
          series: this.seriesDataCache.filter(s => s.data && s.data.length > 0),
        });
      },
      destroyChart() {
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-loading,
  .chart-error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px; /* Or bind to chartHeight prop for consistency */
    /* min-height: var(--chart-height, 200px); /* Alternative using CSS var */
    color: #888;
    font-style: italic;
    border: 1px dashed #ccc; /* Optional: visual placeholder */
    box-sizing: border-box;
  }
  .chart-error {
    color: #D32F2F; /* A more distinct error red */
    background-color: #FFEBEE; /* Light red background */
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #FFCDD2;
  }
  </style>