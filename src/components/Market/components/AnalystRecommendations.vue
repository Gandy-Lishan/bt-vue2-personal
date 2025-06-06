<!-- AnalystRecommendations/index.vue -->
<template>
  <div class="analyst-recommendations">
    <h2 class="chart-title">Analyst Recommendations</h2>
    <div class="charts-container">
      <div class="gauge-chart" ref="gaugeChart"></div>
      <div class="bar-list">
        <div v-for="(item, index) in recommendations" :key="index" class="bar-item">
          <span class="bar-label">{{ item.name }}</span>
          <div class="bar-wrapper">
            <div class="bar-bg"></div>
            <div class="bar" :style="{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }"></div>
          </div>
          <span class="bar-value">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsGauge from 'highcharts/modules/solid-gauge'

// 初始化额外的模块
HighchartsMore(Highcharts)
HighchartsGauge(Highcharts)

export default {
 name: 'AnalystRecommendations',
 data() {
   return {
     gaugeChart: null,
     recommendations: [
       { name: 'Strong Buy', value: 7, color: '#2196F3' },
       { name: 'Buy', value: 23, color: '#90CAF9' },
       { name: 'Hold', value: 16, color: '#80DEEA' },
       { name: 'Sell', value: 2, color: '#FFB74D' },
       { name: 'Strong Sell', value: 1, color: '#FF8A65' }
     ]
   }
 },
 computed: {
   maxValue() {
     return Math.max(...this.recommendations.map(r => r.value))
   }
 },
 mounted() {
   this.$nextTick(() => {
     this.initGaugeChart()
   })
 },
 beforeDestroy() {
   if (this.gaugeChart) {
     this.gaugeChart.destroy()
   }
 },
 methods: {
   initGaugeChart() {
     const options = {
       chart: {
         type: 'gauge',
         height: 200,
         backgroundColor: 'transparent',
         plotBackgroundColor: null,
         plotBackgroundImage: null,
         plotBorderWidth: 0,
         plotShadow: false
       },
       title: {
         text: ''
       },
       credits: {
         enabled: false
       },
       pane: {
         startAngle: 180,
         endAngle: 0,
         background: [{
           backgroundColor: '#f5f5f5',
           borderWidth: 0,
           outerRadius: '100%',
           innerRadius: '85%'
         }]
       },
       yAxis: {
         min: 0,
         max: 4,
         lineWidth: 0,
         minorTickInterval: null,
         tickWidth: 0,
         labels: {
           enabled: false
         },
         title: {
           text: ''
         },
         plotBands: [
           {
             from: 0,
             to: 0.8,
             color: '#FF8A65',
             innerRadius: '85%',
             outerRadius: '100%'
           },
           {
             from: 0.8,
             to: 1.6,
             color: '#FFB74D',
             innerRadius: '85%',
             outerRadius: '100%'
           },
           {
             from: 1.6,
             to: 2.4,
             color: '#80DEEA',
             innerRadius: '85%',
             outerRadius: '100%'
           },
           {
             from: 2.4,
             to: 3.2,
             color: '#90CAF9',
             innerRadius: '85%',
             outerRadius: '100%'
           },
           {
             from: 3.2,
             to: 4,
             color: '#2196F3',
             innerRadius: '85%',
             outerRadius: '100%'
           }
         ]
       },
       series: [{
         name: 'Rating',
         data: [2.8],
         dataLabels: {
           enabled: false
         },
         dial: {
           radius: '80%',
           backgroundColor: '#333',
           baseWidth: 3,
           topWidth: 1,
           baseLength: '0%',
           rearLength: '0%'
         },
         pivot: {
           backgroundColor: '#333',
           radius: 4
         }
       }]
     }

     this.gaugeChart = Highcharts.chart(this.$refs.gaugeChart, options)
   }
 }
}
</script>

<style scoped>
.analyst-recommendations {
 padding: 20px;
 background: white;
 border-radius: 8px;
 box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
 font-size: 18px;
 font-weight: 500;
 color: #333;
 margin-bottom: 20px;
}

.charts-container {
 display: flex;
 flex-direction: column;
 gap: 30px;
}

.gauge-chart {
 width: 100%;
 min-height: 200px;
 position: relative;
}

.gauge-chart::after {
 content: '';
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 70%;
 height: 70%;
 border-radius: 50%;
 background: white;
 z-index: -1;
}

.bar-list {
 display: flex;
 flex-direction: column;
 gap: 12px;
 padding: 0 20px;
}

.bar-item {
 display: flex;
 align-items: center;
 gap: 12px;
}

.bar-label {
 width: 80px;
 font-size: 14px;
 color: #333;
}

.bar-wrapper {
 flex: 1;
 position: relative;
 height: 8px;
}

.bar-bg {
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: #f5f5f5;
 border-radius: 4px;
}

.bar {
 position: absolute;
 top: 0;
 left: 0;
 bottom: 0;
 border-radius: 4px;
 transition: width 0.3s ease;
}

.bar-value {
 width: 30px;
 font-size: 14px;
 color: #666;
 text-align: right;
}

@media (min-width: 768px) {
 .charts-container {
   flex-direction: row;
 }
 
 .gauge-chart {
   flex: 1;
 }
 
 .bar-list {
   flex: 1;
   padding: 0;
 }
}
</style>