<template>
  <div class="base-dashboard">
    <h2 class="chart-title" v-if="title">{{ title }}</h2>
    <div class="charts-container">
      <div class="gauge-chart" ref="gaugeChart"></div>
      <div class="bar-list">
        <div v-for="(item, index) in data" :key="index" class="bar-item">
          <span class="bar-label">{{ item.name }}</span>
          <div class="bar-wrapper">
            <div class="bar-bg"></div>
            <div
              class="bar"
              :style="{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color
              }"
            ></div>
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
import Exporting from 'highcharts/modules/exporting'

HighchartsMore(Highcharts)
HighchartsGauge(Highcharts)
Exporting(Highcharts)

export default {
  name: 'BaseDashboard',
  props: {
    value: {
      type: Number,
      default: 2.8
    },
    data: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    fullCircle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gaugeChart: null
    }
  },
  computed: {
    maxValue() {
      return Math.max(...this.data.map(r => r.value), 1)
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
      this.gaugeChart = Highcharts.chart(this.$refs.gaugeChart, {
        chart: {
          type: 'gauge',
          height: 200,
          backgroundColor: 'transparent'
        },
        title: { text: '' },
        credits: { enabled: false },
        exporting: { enabled: true },
        pane: {
          startAngle: this.fullCircle ? 0 : -90,
          endAngle: this.fullCircle ? 360 : 90,
          background: [{
            backgroundColor: '#f5f5f5',
            innerRadius: '85%',
            outerRadius: '100%',
            shape: 'arc'
          }]
        },
        yAxis: {
          min: 0,
          max: 4,
          lineWidth: 0,
          tickWidth: 0,
          labels: { enabled: false },
          plotBands: [
            { from: 0, to: 0.8, color: '#FF8A65' },
            { from: 0.8, to: 1.6, color: '#FFB74D' },
            { from: 1.6, to: 2.4, color: '#80DEEA' },
            { from: 2.4, to: 3.2, color: '#90CAF9' },
            { from: 3.2, to: 4, color: '#2196F3' }
          ]
        },
        series: [{
          name: 'Rating',
          data: [this.value],
          dataLabels: {
            enabled: true,
            format: `<div style="text-align:center"><span style="font-size:16px;color:#333">{y}</span></div>`
          },
          dial: {
            radius: '80%',
            backgroundColor: '#333',
            baseWidth: 5,
            topWidth: 1
          },
          pivot: {
            backgroundColor: '#333',
            radius: 5
          }
        }]
      })
    }
  }
}
</script>

<style scoped>
.base-dashboard {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
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
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 80px;
  font-size: 14px;
  color: #000000;
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
  transition: width 0.4s ease;
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
    padding-left: 20px;
  }
}
</style>
