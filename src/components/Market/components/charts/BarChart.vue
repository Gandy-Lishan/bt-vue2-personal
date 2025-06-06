<template>
    <div>
      <div v-if="isLoading" class="chart-loading">Loading chart data...</div>
      <div v-show="!isLoading" ref="chartContainer" :style="{ width: '100%', height: chartHeight }"></div>
      <div v-if="error && !isLoading" class="chart-error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import Highcharts from "highcharts"; // Use regular Highcharts for bar charts
  import Exporting from "highcharts/modules/exporting";
  import ExportData from "highcharts/modules/export-data";
  
  // No need for getPairData or timestampToTime for this bar chart example,
  // unless you intend to fetch data similarly.
  // import { isJson } from '@/utils'; // Keep if used elsewhere
  
  // Enable Highcharts modules
  Exporting(Highcharts);
  ExportData(Highcharts);
  
  export default {
    props: {
      chartData: {
        type: Array,
        required: true,
        validator: function (value) {
          // Basic validation: ensure it's an array of objects
          // with date, estimate, and actual properties.
          return (
            Array.isArray(value) &&
            value.every(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                "date" in item &&
                "estimate" in item &&
                "actual" in item
            )
          );
        },
      },
      titleText: { // Optional title for the chart
        type: String,
        default: "",
      },
      chartHeight: {
        type: String,
        default: "400px", // Bar charts might not need as much height by default
      },
      estimateColor: {
        type: String,
        default: "#A9A9A9", // Light gray for estimate
      },
      actualColor: {
        type: String,
        default: "#4682B4", // Steel blue for actual
      },
      enableExporting: {
        type: Boolean,
        default: true,
      },
      yAxisTitleText: { // Optional Y-axis title
          type: String,
          default: 'Value'
      }
    },
    data() {
      return {
        chart: null,
        isLoading: false, // Could be true if data was fetched async
        error: null,
        // For bar charts, categories and series are derived directly
        categories: [],
        seriesData: [],
      };
    },
    watch: {
      chartData: {
        deep: true, // Watch for changes inside the array/objects
        handler: "processDataAndInitializeChart",
      },
      chartHeight: "reRenderChartWithCurrentData",
      estimateColor: "reRenderChartWithCurrentData",
      actualColor: "reRenderChartWithCurrentData",
      enableExporting: "reRenderChartWithCurrentData",
      titleText: "reRenderChartWithCurrentData",
      yAxisTitleText: "reRenderChartWithCurrentData",
    },
    mounted() {
      if (this.chartData && this.chartData.length > 0) {
        this.processDataAndInitializeChart();
      } else {
        this.error = "No data provided to render the chart.";
      }
    },
    beforeDestroy() {
      this.destroyChart();
    },
    methods: {
      processDataAndInitializeChart() {
        if (!this.chartData || this.chartData.length === 0) {
          this.error = "No data available to process for the chart.";
          this.isLoading = false;
          this.destroyChart();
          return;
        }
  
        this.isLoading = true; // Simulate loading, or set based on actual async fetch
        this.error = null;
        this.destroyChart();
  
        try {
          this.categories = this.chartData.map(item => item.date);
          const estimateValues = this.chartData.map(item => item.estimate);
          const actualValues = this.chartData.map(item => item.actual);
  
          this.seriesData = [
            {
              name: "Estimate",
              data: estimateValues,
              color: this.estimateColor,
              type: "column", // 'column' for vertical bars, 'bar' for horizontal
            },
            {
              name: "Actual",
              data: actualValues,
              color: this.actualColor,
              type: "column",
            },
          ];
          
          this.initializeChart();
  
        } catch (err) {
          console.error("Error processing chart data:", err);
          this.error = "Failed to process chart data.";
          if (err.message) {
            this.error += ` Details: ${err.message}`;
          }
          this.categories = [];
          this.seriesData = [];
        } finally {
          this.isLoading = false;
        }
      },
  
      reRenderChartWithCurrentData() {
        // Only attempt to re-render if not loading, no critical error, and valid data exists
        if (!this.isLoading && !this.error && this.categories.length > 0 && this.seriesData.length > 0) {
          this.destroyChart();
          this.initializeChart();
        }
      },
  
      initializeChart() {
        if (!this.$refs.chartContainer || this.categories.length === 0 || this.seriesData.length === 0) {
          if (!this.error && !this.isLoading) {
            this.error = "Chart container not available or no data to display.";
          }
          return;
        }
  
        this.chart = Highcharts.chart(this.$refs.chartContainer, { // Use Highcharts.chart for non-stock charts
          chart: {
            type: "column", // Default chart type, series can override
            height: this.chartHeight,
          },
          title: {
            text: this.titleText,
          },
          exporting: {
            enabled: this.enableExporting,
            buttons: {
              contextButton: {
                menuItems: [
                  "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG",
                  "separator", "downloadCSV", "downloadXLS",
                ],
              },
            },
          },
          xAxis: {
            categories: this.categories,
            crosshair: true, // Shows a line across the plot area on hover
          },
          yAxis: {
            min: 0, // Typically bar charts start from 0
            title: {
              text: this.yAxisTitleText,
            },
            // Allow Highcharts to determine max based on data
          },
          legend: {
            enabled: true, // Show legend for 'Estimate' vs 'Actual'
          },
          credits: { // Optional: you can make this a prop too
            enabled: true,
            text: "SENTIMENTRADER", // Example credit text
            href: '#',
            position: { align: 'right', x: -10, y: -10 } // Adjusted for bar chart
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                         '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>', // Display one decimal place
            footerFormat: '</table>',
            shared: true, // Tooltip shows info for all series at that x-axis point
            useHTML: true,
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
              dataLabels: { // Optionally show data labels on bars
                  enabled: false, // Set to true to show values on bars
                  // format: '{point.y:.1f}'
              }
            },
            series: {
              // General series options if needed
            }
          },
          series: this.seriesData,
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
  /* Styles are identical to StockChart.vue for consistency */
  .chart-loading,
  .chart-error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px; /* Or bind to chartHeight prop for consistency */
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