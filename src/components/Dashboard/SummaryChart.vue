<template>
 <div>
   <div v-if="chart">
     <div :id="chart.chart_id" class="chart-container"></div>
   </div>
 </div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import "highcharts/modules/exporting";

export default {
 props: {
  chart: Object
 },
 data() {
   return {
   };
 },
 mounted() {
  this.renderChart(this.chart);
 },
 methods: {
   loadChart() {
     const urls = [
       { key: "country_ewa", url: "/users/country_spotlight.json" },
       { key: "po_pound", url: "/users/commod_spotlight.json" },
       { key: "etf_xlb", url: "/users/sector_spotlight.json" },
       { key: "model_score_int", url: "/users/dashboard_spotlight.json" }
     ];

     for (const { key, url } of urls) {
       if (typeof window[key] !== "undefined") {
         this.fetchChartData(url);
         break; // 只加载第一个找到的图表
       }
     }
   },
   renderChart(chart) {
     const chartData = chart.data.map((value) => [new Date(value[0]).getTime(), value[1]]);

     const chartOptions = {
       chart: {
         backgroundColor: "transparent",
         style: {
           fontFamily: "Open Sans, sans-serif"
         },
         zoomType: "x",
         pinchType: ""
       },
       credits: { enabled: false },
       navigator: { enabled: false },
       scrollbar: { enabled: false },
       rangeSelector: {
         selected: chart.zoom,
         inputEnabled: false,
         buttons: [
           { type: "month", count: 3, text: "3m" },
           { type: "month", count: 6, text: "6m" },
           { type: "ytd", text: "YTD" },
           { type: "year", count: 1, text: "1y" },
           { type: "year", count: 3, text: "3y" },
           { type: "year", count: 5, text: "5y" }
         ]
       },
       yAxis: {
         title: {
           enabled: true,
           text: chart.yaxistext
         },
         labels: { align: "left" }
       },
       title: {
         useHtml: true,
         text: `<a href="/backtester/sr/setup?index=Unknown&indicator=${chart.symbol}"><font color="black">${chart.title}</font></a>`,
         style: {
          fontWeight: 400
         }
       },
       exporting: { enabled: false },
       series: [
         {
           type: chart.chart_type,
           name: chart.chart_name,
           data: chartData,
           color: "#2f7ed8",
           tooltip: {
             valueDecimals: 2,
             pointFormat: "<b>{point.y}</b><br/>",
             followTouchMove: true,
             shared: true,
           }
         }
       ]
     };

     this.$nextTick(() => {
       Highcharts.stockChart(chart.chart_id, chartOptions);
     });
   }
 }
};
</script>

<style scoped>
.chart-container {
 width: 100%;
 height: 400px;
 margin-bottom: 20px;
}
</style>