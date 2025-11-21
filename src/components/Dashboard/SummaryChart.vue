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
  chart: Object,
  enlarged: Boolean
 },
watch: {
  chart: {
    handler(chart){
      if(chart && chart.data && Array.isArray(chart.data)) {
        this.renderChart(this.chart);
      }
    },
    deep: true
  },
  enlarged() {
    this.renderChart(this.chart)
  }
},
mounted() {
  this.renderChart(this.chart);
},
 methods: {
  renderChart(chart) {
    if(!chart || !chart.data || !Array.isArray(chart.data)) return
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