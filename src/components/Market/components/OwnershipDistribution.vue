<!-- OwnershipDistribution/index.vue -->
<template>
 <div class="ownership-distribution">
   <h2 class="chart-title">Ownership Distribution</h2>
   <div class="chart-container" ref="chartContainer"></div>
   <div class="legend">
     <div class="legend-item" v-for="(item, index) in legendItems" :key="index">
       <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
       <span class="legend-text">{{ item.name }}</span>
     </div>
   </div>
 </div>
</template>

<script>
import Highcharts from 'highcharts'

export default {
 name: 'OwnershipDistribution',
 data() {
   return {
     chart: null,
     legendItems: [
       { name: 'Executive Insiders', color: '#2196F3' },
       { name: 'Institutions', color: '#1A237E' },
       { name: 'Mutual Funds', color: '#03A9F4' },
       { name: 'Public Float(0%)', color: '#B3E5FC' }
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
   initChart() {
     const options = {
       chart: {
         type: 'pie',
         backgroundColor: 'transparent',
         height: '300px'
       },
       title: {
         text: ''
       },
       credits: {
         enabled: false
       },
       tooltip: {
         pointFormat: '{point.percentage:.1f}%'
       },
       plotOptions: {
         pie: {
           innerSize: '60%',
           borderWidth: 0,
           dataLabels: {
             enabled: true,
             format: '{point.percentage:.1f}%',
             distance: 20,
             style: {
               fontWeight: 'normal',
               fontSize: '12px'
             }
           },
           states: {
             hover: {
               brightness: 0.1
             }
           }
         }
       },
       series: [{
         name: 'Ownership',
         colorByPoint: true,
         data: [
           {
             name: 'Executive Insiders',
             y: 43.5,
             color: '#2196F3'
           },
           {
             name: 'Institutions',
             y: 33.5,
             color: '#1A237E'
           },
           {
             name: 'Mutual Funds',
             y: 23.0,
             color: '#03A9F4'
           },
           {
             name: 'Public Float',
             y: 0,
             color: '#B3E5FC'
           }
         ]
       }]
     }

     this.chart = Highcharts.chart(this.$refs.chartContainer, options)
   }
 }
}
</script>

<style scoped>
.ownership-distribution {
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
 margin: 0 auto;
 max-width: 400px;
}

.legend {
 display: flex;
 flex-wrap: wrap;
 justify-content: center;
 gap: 20px;
 margin-top: 20px;
}

.legend-item {
 display: flex;
 align-items: center;
 gap: 8px;
}

.legend-color {
 width: 12px;
 height: 12px;
 border-radius: 2px;
}

.legend-text {
 font-size: 14px;
 color: #666;
}
</style> 