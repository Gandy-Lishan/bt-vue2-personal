<template>
  <div class="pie-chart">
    <h2 v-if="titleText" class="chart-title">{{ titleText }}</h2>
    <div class="chart-container" ref="chartContainer"></div>
    <div v-if="showLegend" class="legend">
      <div
        class="legend-item"
        v-for="(item, index) in chartData"
        :key="index"
      >
        <span
          class="legend-color"
          :style="{ backgroundColor: item.color || defaultColors[index % defaultColors.length] }"
        ></span>
        <span class="legend-text">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
Exporting(Highcharts)

export default {
  name: 'PieChart',
  props: {
    chartData: {
      type: Array,
      required: true, // [{ name, y, color }]
      validator: (arr) =>
        arr.every(
          (item) =>
            typeof item.name === 'string' && typeof item.y === 'number'
        ),
    },
    titleText: {
      type: String,
      default: '',
    },
    chartHeight: {
      type: String,
      default: '300px',
    },
    innerSize: {
      type: String,
      default: '60%', // 控制中间空心半径
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
    dataLabelFormat: {
      type: String,
      default: '{point.percentage:.1f}%',
    },
    enableExporting: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      chart: null,
      defaultColors: ['#2196F3', '#1A237E', '#03A9F4', '#B3E5FC'],
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (this.chart) this.chart.destroy()
  },
  methods: {
    initChart() {
      this.chart = Highcharts.chart(this.$refs.chartContainer, {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          height: this.chartHeight,
        },
        title: { text: '' },
        credits: { enabled: false },
        tooltip: {
          pointFormat: this.dataLabelFormat,
        },
        exporting: {
          enabled: this.enableExporting,
          buttons: {
            contextButton: {
              menuItems: [
                'downloadPNG',
                'downloadJPEG',
                'downloadPDF',
                'downloadSVG',
                'separator',
                'downloadCSV',
                'downloadXLS',
                'viewData'
              ]
            }
          }
        },
        navigation: {
          buttonOptions: {
            align: 'right',
            verticalAlign: 'top',
            y: -10
          }
        },

        plotOptions: {
          pie: {
            innerSize: this.innerSize,
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: this.dataLabelFormat,
              distance: 20,
              style: {
                fontWeight: 'normal',
                fontSize: '12px',
              },
            },
            states: {
              hover: {
                brightness: 0.1,
              },
            },
          },
        },
        series: [
          {
            name: 'Ownership',
            colorByPoint: true,
            data: this.chartData.map((item, idx) => ({
              ...item,
              color: item.color || this.defaultColors[idx % this.defaultColors.length],
            })),
          },
        ],
      })
    },
  },
}
</script>

<style scoped>
.pie-chart {
  background: white;
  width: 100%;
  border-radius: inherit;
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
