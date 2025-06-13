<template>
  <div class="eps-growth-chart">
    <!-- Header -->
    <div class="chart-header">
      <h3 class="chart-title">EPS Growth Rate</h3>
      <div class="chart-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="['tab-button', { active: activeTab === tab.value }]"
          @click="setActiveTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <svg :width="chartWidth" :height="chartHeight" class="chart-svg">
        <!-- Grid Lines -->
        <g class="grid-lines">
          <!-- Horizontal grid lines -->
          <line
            v-for="(line, index) in horizontalGridLines"
            :key="'h-' + index"
            :x1="padding.left"
            :y1="line.y"
            :x2="chartWidth - padding.right"
            :y2="line.y"
            stroke="#e5e7eb"
            stroke-width="1"
          />
          <!-- Vertical grid lines -->
          <line
            v-for="(line, index) in verticalGridLines"
            :key="'v-' + index"
            :x1="line.x"
            :y1="padding.top"
            :x2="line.x"
            :y2="chartHeight - padding.bottom"
            stroke="#e5e7eb"
            stroke-width="1"
          />
        </g>

        <!-- Area Fill -->
        <path
          :d="areaPath"
          fill="url(#areaGradient)"
          opacity="0.3"
        />

        <!-- Line Path -->
        <path
          :d="linePath"
          fill="none"
          stroke="#6366f1"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Data Points -->
        <circle
          v-for="(point, index) in chartPoints"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          r="4"
          fill="#6366f1"
          stroke="#ffffff"
          stroke-width="2"
        />

        <!-- Y-axis Labels -->
        <text
          v-for="(label, index) in yAxisLabels"
          :key="'y-' + index"
          :x="padding.left - 10"
          :y="label.y + 4"
          text-anchor="end"
          class="axis-label"
        >
          {{ label.text }}
        </text>

        <!-- X-axis Labels -->
        <text
          v-for="(label, index) in xAxisLabels"
          :key="'x-' + index"
          :x="label.x"
          :y="chartHeight - padding.bottom + 20"
          text-anchor="middle"
          class="axis-label"
        >
          {{ label.text }}
        </text>

        <!-- Gradient Definition -->
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ESPGrowthChart',
  props: {
    data: {
      type: Object,
      default: () => ({
        yoy: [
          { period: 'Q3 2023', value: -15 },
          { period: 'Q4 2023', value: 18 },
          { period: 'Q1 2024', value: 48 },
          { period: 'Q2 2024', value: -28 },
          { period: 'Q3 2024', value: 10 },
          { period: 'Q4 2024', value: 20 },
          { period: 'Q1 2025', value: 30 },
          { period: 'Q2 2025', value: 40 },
          { period: 'Q3 2025', value: 50 },
          { period: 'Q4 2025', value: 60 },
          { period: 'Q1 2026', value: 70 },
          { period: 'Q2 2026', value: 80 },
          { period: 'Q3 2026', value: 90 },
          { period: 'Q4 2026', value: 100 },
          { period: 'Q1 2027', value: 110 },
        ],
        qoq: [
          { period: 'Q3 2023', value: -8 },
          { period: 'Q4 2023', value: 25 },
          { period: 'Q1 2024', value: 35 },
          { period: 'Q2 2024', value: -15 },
          { period: 'Q3 2024', value: 10 },
          { period: 'Q4 2024', value: 20 },
          { period: 'Q1 2025', value: 30 },
          { period: 'Q2 2025', value: 40 },
          { period: 'Q3 2025', value: 50 },
          { period: 'Q4 2025', value: 60 },
          { period: 'Q1 2026', value: 70 },
          { period: 'Q2 2026', value: 80 },
          { period: 'Q3 2026', value: 90 },
          { period: 'Q4 2026', value: 100 },
          { period: 'Q1 2027', value: 110 },
        ]
      })
    }
  },
  data() {
    return {
      activeTab: 'yoy',
      chartWidth: 500,
      chartHeight: 350,
      padding: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 60
      },
      tabs: [
        { label: 'YoY', value: 'yoy' },
        { label: 'QoQ', value: 'qoq' }
      ]
    }
  },
  computed: {
    currentData() {
      return this.data[this.activeTab] || []
    },
    minValue() {
      const values = this.currentData.map(d => d.value)
      return Math.min(...values, 0)
    },
    maxValue() {
      const values = this.currentData.map(d => d.value)
      return Math.max(...values, 0)
    },
    yScale() {
      const range = this.maxValue - this.minValue
      const padding = range * 0.1
      return {
        min: this.minValue - padding,
        max: this.maxValue + padding,
        range: range + padding * 2
      }
    },
    chartPoints() {
      const plotWidth = this.chartWidth - this.padding.left - this.padding.right
      const plotHeight = this.chartHeight - this.padding.top - this.padding.bottom
      
      return this.currentData.map((item, index) => {
        const x = this.padding.left + (index / (this.currentData.length - 1)) * plotWidth
        const y = this.padding.top + plotHeight - ((item.value - this.yScale.min) / this.yScale.range) * plotHeight
        return { x, y, value: item.value, period: item.period }
      })
    },
    linePath() {
      if (this.chartPoints.length === 0) return ''
      
      let path = `M ${this.chartPoints[0].x} ${this.chartPoints[0].y}`
      for (let i = 1; i < this.chartPoints.length; i++) {
        path += ` L ${this.chartPoints[i].x} ${this.chartPoints[i].y}`
      }
      return path
    },
    areaPath() {
      if (this.chartPoints.length === 0) return ''
      
      const plotHeight = this.chartHeight - this.padding.top - this.padding.bottom
      const zeroY = this.padding.top + plotHeight - ((0 - this.yScale.min) / this.yScale.range) * plotHeight
      
      let path = `M ${this.chartPoints[0].x} ${zeroY}`
      path += ` L ${this.chartPoints[0].x} ${this.chartPoints[0].y}`
      
      for (let i = 1; i < this.chartPoints.length; i++) {
        path += ` L ${this.chartPoints[i].x} ${this.chartPoints[i].y}`
      }
      
      path += ` L ${this.chartPoints[this.chartPoints.length - 1].x} ${zeroY}`
      path += ' Z'
      
      return path
    },
    yAxisLabels() {
      const plotHeight = this.chartHeight - this.padding.top - this.padding.bottom
      const labels = []
      const step = 10
      
      for (let value = Math.ceil(this.yScale.min / step) * step; value <= this.yScale.max; value += step) {
        const y = this.padding.top + plotHeight - ((value - this.yScale.min) / this.yScale.range) * plotHeight
        labels.push({
          y,
          text: value + '%'
        })
      }
      
      return labels
    },
    xAxisLabels() {
      const plotWidth = this.chartWidth - this.padding.left - this.padding.right
      
      return this.currentData.map((item, index) => ({
        x: this.padding.left + (index / (this.currentData.length - 1)) * plotWidth,
        text: item.period
      }))
    },
    horizontalGridLines() {
      return this.yAxisLabels.map(label => ({ y: label.y }))
    },
    verticalGridLines() {
      return this.xAxisLabels.map(label => ({ x: label.x }))
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab
    }
  }
}
</script>

<style scoped>

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.chart-tabs {
  display: flex;
  gap: 8px;
}

.tab-button {
  padding: 6px 12px;
  border: none;
  background-color: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.tab-button.active {
  background-color: #dbeafe;
  color: #2563eb;
}

.chart-container {
  overflow: hidden;
}

.chart-svg {
  width: 100%;
  height: auto;
}

.axis-label {
  font-size: 12px;
  fill: #6b7280;
  font-weight: 400;
}

.grid-lines line {
  opacity: 0.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .eps-growth-chart {
    padding: 16px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .chart-title {
    font-size: 16px;
  }
  
  .tab-button {
    font-size: 13px;
    padding: 5px 10px;
  }
}

/* 动画效果 */
.chart-svg path {
  transition: d 0.3s ease;
}

.chart-svg circle {
  transition: cx 0.3s ease, cy 0.3s ease;
}
</style>

