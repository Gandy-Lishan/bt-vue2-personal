<template>
  <div class="analyst-recommendations">
    <div class="title">Analysts</div>
    <section class="card analysts__card">
      <div class="card__subtitle">Analyst Recommendations</div>
      <div class="analysts__chart-container">
        <!-- 左侧半圆形图表 -->
        <div class="semicircle-chart">
          <svg :width="chartSize" :height="chartSize / 2 + 50" class="chart-svg">
            <!-- 背景圆弧 -->
            <path
              v-for="(segment, index) in segments"
              :key="index"
              :d="getArcPath(segment.startAngle, segment.endAngle, segment.radius)"
              :fill="segment.color"
              :stroke="segment.color"
              stroke-width="2"
              class="segment-path"
              @mouseenter="hoveredSegment = segment"
              @mouseleave="hoveredSegment = null"
              :class="{ 'segment-hover': hoveredSegment === segment }"
            />
            <!-- 指针 -->
            <g :transform="`translate(${chartSize/2}, ${chartSize/2})`">
              <line
                :x1="0"
                :y1="0"
                :x2="pointerX"
                :y2="pointerY"
                stroke="#000"
                stroke-width="3"
                stroke-linecap="round"
              />
              <circle cx="0" cy="0" r="4" fill="#000" />
            </g>
            <!-- 标签 -->
            <text
              v-for="(label, index) in labels"
              :key="index"
              :x="label.x"
              :y="label.y"
              :text-anchor="label.anchor"
              :transform="`rotate(${label.rotation}, ${label.x}, ${label.y})`"
              class="chart-label"
              :class="{ 'label-visible': hoveredSegment && hoveredSegment.label === label.text }"
            >
              {{ label.text }}
            </text>
          </svg>
        </div>
        
        <!-- 右侧条形图 -->
        <div class="bar-chart">
          <div
            v-for="(item, index) in chartData"
            :key="index"
            class="bar-item"
          >
            <div class="bar-label">{{ item.label }}</div>
            <div class="bar-container">
              <div
                class="bar"
                :style="{
                  width: (item.value / maxValue * 100) + '%',
                  backgroundColor: item.color
                }"
              ></div>
            </div>
            <div class="bar-value">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </section>
    <section class="card analysts__card">
      <div class="card__subtitle">Analyst Predict Summary</div>
      <base-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        tip-text=""
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </base-table>
    </section>
  </div>
</template>

<script>
import BaseTable from "@/components/Market/components/tables/BaseTable";
export default {
  name: 'AnalystRecommendations',
  props: {
    data: {
      type: Array,
      default: () => [
        { label: 'Strong Buy', value: 7, color: '#1e40af' },
        { label: 'Buy', value: 23, color: '#3b82f6' },
        { label: 'Hold', value: 16, color: '#10b981' },
        { label: 'Sell', value: 2, color: '#f59e0b' },
        { label: 'Strong Sell', value: 1, color: '#ec4899' }
      ]
    }
  },
  data() {
    return {
      chartSize: 300,
      pointerAngle: -45, // 指针角度（度）
      hoveredSegment: null,
      loading: false,
      tableData: [
        {
          date: '2025-06-11',
          target: 'BTC',
          minPrice: 100,
          maxPrice: 100,
          reportNumber: 10,
          accuracy: '80%',
        },
        {
          date: '2025-06-11',
          target: 'ETH',
          minPrice: 200,
          maxPrice: 200,
          reportNumber: 10,
          accuracy: '80%'
        }
      ],
      columns: [
        { prop: 'date', label: 'Date', width: '120', sortable: true },
        { prop: 'target', label: 'Target', sortable: true },
        { prop: 'minPrice', label: 'Min Price', sortable: true },
        { prop: 'maxPrice', label: 'Max Price', sortable: true },
        { 
          prop: 'reportNumber', 
          label: 'Report Number', 
          sortable: true 
        },
        { 
          prop: 'accuracy', 
          label: 'Accuracy', 
          sortable: true 
        }
      ],
    }
  },
  components: {
    BaseTable
  },
  computed: {
    chartData() {
      return this.data
    },
    maxValue() {
      return Math.max(...this.chartData.map(item => item.value))
    },
    totalValue() {
      return this.chartData.reduce((sum, item) => sum + item.value, 0)
    },
    segments() {
      const radius = this.chartSize / 2 - 20  // 保持外半径
      const innerRadius = radius - 8  // 进一步减小宽度（从15减到8）
      let currentAngle = 180 // 从左侧开始（180度）
      
      return this.chartData.map((item, index) => {
        const percentage = item.value / this.totalValue
        const angleSpan = percentage * 180 // 半圆是180度
        const startAngle = currentAngle
        const endAngle = currentAngle + angleSpan
        
        currentAngle += angleSpan
        
        return {
          startAngle,
          endAngle,
          radius,
          innerRadius,
          color: item.color,
          label: item.label
        }
      })
    },
    labels() {
      const centerX = this.chartSize / 2
      const centerY = this.chartSize / 2
      const labelRadius = this.chartSize / 2 - 5  // 调整标签位置，使其更靠外
      
      return this.segments.map(segment => {
        // 计算标签的角度（扇形的中间角度）
        const labelAngle = (segment.startAngle + segment.endAngle) / 2
        const angleRad = (labelAngle * Math.PI) / 180
        
        // 计算标签位置
        const x = centerX + Math.cos(angleRad) * labelRadius
        const y = centerY + Math.sin(angleRad) * labelRadius
        
        // 计算旋转角度（使文字垂直于半径，并修正方向）
        const rotation = labelAngle + 90
        
        return {
          text: segment.label,
          x,
          y,
          rotation,
          anchor: 'middle'
        }
      })
    },
    pointerX() {
      const angle = (this.pointerAngle * Math.PI) / 180
      return Math.cos(angle) * (this.chartSize / 2 - 60)
    },
    pointerY() {
      const angle = (this.pointerAngle * Math.PI) / 180
      return Math.sin(angle) * (this.chartSize / 2 - 60)
    }
  },
  methods: {
    getArcPath(startAngle, endAngle, radius) {
      const centerX = this.chartSize / 2
      const centerY = this.chartSize / 2
      const innerRadius = radius - 30
      
      const startAngleRad = (startAngle * Math.PI) / 180
      const endAngleRad = (endAngle * Math.PI) / 180
      
      const x1 = centerX + Math.cos(startAngleRad) * radius
      const y1 = centerY + Math.sin(startAngleRad) * radius
      const x2 = centerX + Math.cos(endAngleRad) * radius
      const y2 = centerY + Math.sin(endAngleRad) * radius
      
      const x3 = centerX + Math.cos(endAngleRad) * innerRadius
      const y3 = centerY + Math.sin(endAngleRad) * innerRadius
      const x4 = centerX + Math.cos(startAngleRad) * innerRadius
      const y4 = centerY + Math.sin(startAngleRad) * innerRadius
      
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
      
      return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`
    },
    handleSizeChange(size) {
      console.log('每页显示条数改变：', size)
    },
    handleCurrentChange(page) {
      console.log('当前页改变：', page)
    },
  }
}
</script>

<style scoped lang="scss">
  @import "@/components/Market/market.scss";

.analyst-recommendations {
  margin: 0 auto;
}

.analysts {
  &__card {
    background-color: white;
    border-radius: $spacing-xs;
    padding: $spacing-lg;
  }
  &__chart-container {
    display: flex;
    align-items: center;
    gap: $spacing-xl;
  }
}

.semicircle-chart {
  flex-shrink: 0;
}

.chart-svg {
  overflow: visible;
}

.chart-label {
  font-size: $spacing-sm;
  fill: #333;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.label-visible {
  opacity: 1;
}

.bar-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.bar-label {
  font-size: $spacing-md;
  font-weight: 500;
  color: #374151;
  min-width: 80px;
  text-align: left;
}

.bar-container {
  flex: 1;
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.bar-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  min-width: 20px;
  text-align: right;
}

@media (max-width: 768px) {
  .analysts {
    &__card {
      padding: $spacing-md;
    }
    &__chart-container {
      flex-direction: column;
      gap: $spacing-lg;
    }
  }
}

.segment-path {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.segment-hover {
  opacity: 0.8;
  filter: brightness(1.2);
}
</style>

