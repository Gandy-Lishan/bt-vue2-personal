<!-- InsiderTransactions/index.vue -->
<template>
 <div class="insider-transactions">
   <h2 class="chart-title">Insider Transactions</h2>
   <div class="chart-container" ref="chartContainer"></div>
 </div>
</template>

<script>
import Highcharts from 'highcharts'

export default {
 name: 'InsiderTransactions',
 data() {
   return {
     chart: null,
     chartData: [
       { quarter: 'Q3 2022', buy: 120000, sell: 20000 },
       { quarter: 'Q4 2022', buy: 130000, sell: 15000 },
       { quarter: 'Q1 2023', buy: 25000, sell: 0 },
       { quarter: 'Q2 2023', buy: 20000, sell: 0 },
       { quarter: 'Q3 2024', buy: 15000, sell: 0 },
       { quarter: 'Q4 2024', buy: 140000, sell: 0 },
       { quarter: 'Q1 2025', buy: 135000, sell: 0 },
       { quarter: 'Q2 2025', buy: 145000, sell: 0 }
     ]
   }
 },
 mounted() {
   this.initChart()
 },
 beforeDestroy() {
   if (this.chart) {
     this.chart.destroy()
   }
 },
 methods: {
   formatVolume(value) {
     if (value >= 1e9) {
       return (value / 1e9).toFixed(2) + 'B'
     }
     if (value >= 1e6) {
       return (value / 1e6).toFixed(2) + 'M'
     }
     if (value >= 1e3) {
       return (value / 1e3).toFixed(2) + 'K'
     }
     return value.toString()
   },
   initChart() {
     const options = {
       chart: {
         type: 'bar',
         height: 400,
         backgroundColor: 'transparent'
       },
       title: {
         text: ''
       },
       credits: {
         enabled: false
       },
       xAxis: {
         categories: this.chartData.map(item => item.quarter),
         labels: {
           style: {
             color: '#666',
             fontSize: '12px'
           }
         }
       },
       yAxis: {
         title: {
           text: ''
         },
         labels: {
           formatter: function() {
             return this.value + 'k'
           },
           style: {
             color: '#666',
             fontSize: '12px'
           }
         },
         gridLineColor: '#eee'
       },
       tooltip: {
         shared: true,
         useHTML: true,
         formatter: function() {
           const point = this.points[0]
           const buyVolume = point.point.buy || 0
           const sellVolume = point.point.sell || 0
           
           return `
             <div style="padding: 8px;">
               <div style="font-weight: bold; margin-bottom: 5px;">${point.key}</div>
               ${buyVolume ? `<div>Buy Volume: ${buyVolume.toLocaleString()} shares</div>` : ''}
               ${sellVolume ? `<div>Sell Volume: ${sellVolume.toLocaleString()} shares</div>` : ''}
             </div>
           `
         }
       },
       plotOptions: {
         bar: {
           dataLabels: {
             enabled: false
           },
           borderWidth: 0,
           borderRadius: 4,
           pointPadding: 0.2
         },
         series: {
           states: {
             hover: {
               brightness: -0.1
             }
           }
         }
       },
       series: [{
         name: 'Volume',
         data: this.chartData.map(item => ({
           y: item.buy,
           buy: item.buy,
           sell: item.sell,
           color: '#2196F3'
         }))
       }]
     }

     this.chart = Highcharts.chart(this.$refs.chartContainer, options)
   }
 }
}
</script>

<style scoped>
.insider-transactions {
 padding: 20px;
 background: white;
 border-radius: 8px;
}

.chart-title {
 font-size: 18px;
 font-weight: 500;
 color: #333;
 margin-bottom: 20px;
}

.chart-container {
 width: 100%;
 min-height: 400px;
}
</style> 