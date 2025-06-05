<template>
    <div :id="id" class="bar-chart"></div>
  </template>
  
  <script>
  import Highcharts from 'highcharts/highstock'
  import Exporting from 'highcharts/modules/exporting'
  import ExportData from 'highcharts/modules/export-data'
  
  Exporting(Highcharts)
  ExportData(Highcharts)
  
  export default {
    name: 'BarChart',
    props: {
      id: {
        type: String,
        required: true
      },
      epsData: {
        type: Array,
        required: false,
        default: () => [
          { date: '2021-Q1', estimate: 5.0, actual: 5.3 },
          { date: '2021-Q2', estimate: 6.3, actual: 6.1 },
          { date: '2021-Q3', estimate: 5.0, actual: 4.8 },
          { date: '2021-Q4', estimate: 7.0, actual: 7.2 },
          { date: '2022-Q1', estimate: 6.5, actual: 6.9 },
          { date: '2022-Q2', estimate: 8.1, actual: 8.3 },
          { date: '2022-Q3', estimate: 9.5, actual: 9.1 },
          { date: '2022-Q4', estimate: 10.0, actual: 10.5 }
        ]
      }
    },
    mounted() {
      this.initChart()
    },
    methods: {
      initChart() {
        const categories = this.epsData.map(item => item.date)
        const estimateData = this.epsData.map(item => item.estimate)
        const actualData = this.epsData.map(item => item.actual)
  
        Highcharts.chart(this.id, {
          chart: {
            type: 'column',
            backgroundColor: '#1e1e1e'
          },
          title: {
            text: 'EPS Growth Rate: Estimate vs Actual',
            style: { color: '#fff' }
          },
          xAxis: {
            categories,
            crosshair: true,
            labels: { style: { color: '#ccc' } }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'EPS',
              style: { color: '#ccc' }
            },
            labels: { style: { color: '#ccc' } },
            gridLineColor: '#333'
          },
          tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<span style="font-size: 10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                         '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
            footerFormat: '</table>'
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              groupPadding: 0.1,
              borderWidth: 0
            }
          },
          series: [
            {
              name: 'Estimate EPS',
              data: estimateData,
              color: '#2196f3'
            },
            {
              name: 'Actual EPS',
              data: actualData,
              color: '#4caf50'
            }
          ],
          credits: { enabled: false }
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .bar-chart {
    width: 100%;
    /* height: 400px; */
  }
  </style>
  