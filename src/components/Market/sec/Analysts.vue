<template>
  <div class="analyst-recommendations">
    <div class="title">Analysts</div>
    <section class="card analysts__card">
      <div class="card__subtitle">
        Analyst Recommendations
        <el-tooltip effect="dark" placement="top">
          <span slot="content" v-html="analystRecommendationsContent">
          </span>
          <i class="iconfont icon-wenhao" style="font-size: 18px;font-weight: 300;"></i>
        </el-tooltip>
      </div>
      <div class="analysts__chart-container">
        <div class="semicircle-chart">
          <div class="semicircle-chart-wrapper">
            <svg :width="chartSize" :height="chartSize / 2" :viewBox="`0 0 ${chartSize} ${chartSize / 2}`" class="chart-svg">
            <defs>
              <linearGradient v-for="(segment, index) in segments" :id="'pie-gradient-' + index" :key="'pie-gradient-' + index"
                :gradientUnits="'userSpaceOnUse'"
                :x1="chartSize / 2 + Math.cos((segment.startAngle * Math.PI) / 180) * segment.radius"
                :y1="chartSize / 2 + Math.sin((segment.startAngle * Math.PI) / 180) * segment.radius"
                :x2="chartSize / 2 + Math.cos((segment.endAngle * Math.PI) / 180) * segment.radius"
                :y2="chartSize / 2 + Math.sin((segment.endAngle * Math.PI) / 180) * segment.radius">
                <stop offset="0%" :stop-color="segment.color" />
                <stop offset="100%" :stop-color="index === segments.length - 1 ? segment.color : (segments[(index + 1) % segments.length]?.color || segment.color)" />
              </linearGradient>
            </defs>
            <path v-for="(segment, index) in segments" :key="(segment.label || index) + '-' + index"
              :d="getArcPath(segment.startAngle, segment.endAngle, segment.radius)"
              :fill="'url(#pie-gradient-' + index + ')'"
              stroke="none" stroke-width="0" class="segment-path" @mouseenter="hoveredSegment = segment"
              @mouseleave="hoveredSegment = null"
              :class="{ 'segment-hover': hoveredSegment === segment, 'segment-loading': isLoading }" />
            <!-- 指针：始终显示，并添加加载时的 class 和动画 -->
            <g :transform="`translate(${chartSize / 2}, ${chartSize / 2})`" :class="{ 'pointer-loading': isLoading && !animationComplete }">
              <line :x1="0" :y1="0" :x2="pointerX" :y2="pointerY" stroke="#000" stroke-width="3"
                stroke-linecap="round" />
              <circle cx="0" cy="0" r="4" fill="#000" />
            </g>
            <!-- 标签：添加 v-if="!isLoading" 确保加载时不显示 -->
            <g v-if="!isLoading">
              <text v-for="(label, index) in labels" :key="(label.text || index) + '-' + index" :x="label.x" :y="label.y"
                :text-anchor="label.anchor"
                class="chart-label"
                v-html="label.labelHtml">
              </text>
            </g>
          </svg>
          </div>
        </div>

        <div class="bar-chart">
          <div v-for="(item, index) in chartData" :key="item.label || index" class="bar-item">
            <div class="bar-label">{{ item.label }}</div>
            <div class="bar-container">
              <!-- 条形图：宽度由 animatedBarWidths 控制，加载时添加 loading class -->
              <div class="bar" :style="{
                width: animatedBarWidths[index] + '%',
                backgroundColor: item.color
              }" :class="{ 'bar-loading': isLoading && !barAnimationComplete }"></div>
            </div>
            <div class="bar-value">
              <span v-if="!isLoading">{{ `${item.value}% (${item.actual})` }}</span>
              <span v-else>&nbsp;</span>
            </div>
          </div>
          <div v-if="!isLoading && (!chartData || chartData.length === 0)" class="no-data-message">
            No analyst recommendation data available.
          </div>
        </div>
      </div>
    </section>
    <section class="card analysts__card">
      <div class="card__subtitle">
        Analyst Predict Summary
        <el-tooltip effect="dark" placement="top">
          <span slot="content" v-html="analystPredictSummaryContent">
          </span>
          <i class="iconfont icon-wenhao" style="font-size: 18px;font-weight: 300;"></i>
        </el-tooltip>
      </div>
      <base-table :tableData="tableData" :columns="columns" :loading="isLoading" tip-text=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </base-table>
    </section>
  </div>
</template>

<script>
import BaseTable from "@/components/Market/components/tables/BaseTable";
import { mapGetters, mapActions } from 'vuex';
import { isObject, formatNumber } from '@/utils';

export default {
  name: 'AnalystRecommendations',
  data() {
    return {
      chartSize: 280,
      animatedPointerAngle: 0, // 用于动画的当前指针角度，初始设为0度（最右侧）
      animationComplete: false, // 标记指针动画是否完成
      hoveredSegment: null,
      tableData: [],
      columns: [],
      chartData: [],
      animatedBarWidths: [], // 新增：用于条形图动画的宽度数组
      barAnimationComplete: false, // 新增：标记条形图动画是否完成
    }
  },
  // percentage 加起来 * 0.45 + 90
  components: {
    BaseTable
  },
  computed: {
    ...mapGetters("market/sec/analyst", [
      "analystData",
      "isLoading",
      "errorMessage",
    ]),
    symbol() {
      return this.$route.params.symbolname;
    },
    totalValue() {
      return this.chartData.reduce((sum, item) => sum + item.value, 0)
    },
    segments() {
      const radius = this.chartSize / 2 - 20;
      const innerRadius = radius - 8;
      // 均分 5 份，每份 36 度
      const segmentCount = this.chartDataForPie.length;
      const angleSpan = 180 / (segmentCount || 1);
      let currentAngle = 180;
      return this.chartDataForPie.map((item, index) => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + angleSpan;
        currentAngle += angleSpan;
        return {
          startAngle,
          endAngle,
          radius,
          innerRadius,
          color: item.color,
          label: item.label
        }
      });
    },
    labels() {
      const centerX = this.chartSize / 2;
      const centerY = this.chartSize / 2;
      const labelRadius = this.chartSize / 2 - 5;
      return this.segments.map(segment => {
        const labelAngle = (segment.startAngle + segment.endAngle) / 2;
        const angleRad = (labelAngle * Math.PI) / 180;
        const x = centerX + Math.cos(angleRad) * labelRadius;
        // 统一 label 距离扇形的距离
        const baseY = centerY + Math.sin(angleRad) * labelRadius ;
        let labelHtml = segment.label;
        // 对于两行的 label，让两行的中线与单行 label baseline 对齐
        if (segment.label === 'Strong Buy') {
          labelHtml = 'Strong<tspan x="' + (x + 15) + '" y="' + (baseY + 32) + '">Buy</tspan>';
          // 整体下移，远离弧线
          return { text: segment.label, labelHtml, x: x + 15, y: baseY + 18, anchor: 'middle' };
        }
        if (segment.label === 'Strong Sell') {
          labelHtml = 'Strong<tspan x="' + (x - 15) + '" y="' + (baseY + 32) + '">Sell</tspan>';
          return { text: segment.label, labelHtml, x: x - 15, y: baseY + 18, anchor: 'middle' };
        }
        return { text: segment.label, labelHtml, x: x, y: baseY, anchor: 'middle' };
      });
    },
    pointerX() {
      // 使用 animatedPointerAngle 进行计算
      const angle = (this.animatedPointerAngle * Math.PI) / 180
      return Math.cos(angle) * (this.chartSize / 2 - 60)
    },
    pointerY() {
      // 使用 animatedPointerAngle 进行计算
      const angle = (this.animatedPointerAngle * Math.PI) / 180
      return Math.sin(angle) * (this.chartSize / 2 - 60)
    },
    analystRecommendationsContent() {
      return `
        <p><strong>Analyst Recommendations</strong> refers to the <strong>latest compilation of attitudes and forecasts from financial analysts.</strong></p>
      `;
    },
    analystPredictSummaryContent() {
      return `
        <p>This refers to the <strong>detailed historical forecasts</strong> made by analysts for a specific Ticker</p>
      `;
    },
    chartDataForPie() {
      // 只用于扇形，顺序为 Strong Sell, Sell, Hold, Buy, Strong Buy
      if (!this.chartData) return [];
      const order = ['Strong Sell', 'Sell', 'Hold', 'Buy', 'Strong Buy'];
      return order
        .map(label => this.chartData.find(item => item.label === label))
        .filter(Boolean);
    },
    totalValueForPie() {
      return this.chartDataForPie.reduce((sum, item) => sum + item.value, 0)
    },
    pointerAngleDynamic() {
      if (!this.chartData || this.chartData.length === 0) return 270; // 默认指向正上
      // 1. 计算推荐值
      const sum = this.chartData.reduce(
        (acc, item) => acc + (item.value * (item.multiplyBy || 0)),
        0
      );
      // // 2. 计算最大最小推荐值
      // const minVal = -2 * 100; // Strong Sell 100%
      // const maxVal = 2 * 100;  // Strong Buy 100%
      // // 3. 映射到 180~360
      // const clamped = Math.max(minVal, Math.min(maxVal, sum));
      // const angle = 180 + ((clamped - minVal) / (maxVal - minVal)) * 180;
      // return angle;
      return sum * 0.45 -90
    },
  },
  watch: {
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol) {
        this.fetchAnalyst(newSymbol);
      }
    },
    analystData: {
      handler(newVal) {
        if (isObject(newVal) && Object.keys(newVal).length > 0) {
          const {
            AnalystData,
            AnalystDataColumns,
            ColumnBarData
          } = newVal
          this.tableData = AnalystData
          this.columns = AnalystDataColumns
          this.chartData = ColumnBarData

          // 根据加载状态初始化 animatedBarWidths
          if (this.isLoading) {
            this.animatedBarWidths = ColumnBarData.map(() => 0); // 加载时从0开始动画
          } else {
            this.animatedBarWidths = ColumnBarData.map(item => item.value); // 非加载时直接显示最终值
            this.barAnimationComplete = true; // 如果初始就不加载，则条形图动画视为已完成
          }
        } else {
          this.tableData = [];
          this.columns = [];
          this.chartData = [];
          this.animatedBarWidths = []; // 清空条形图宽度
        }
      },
      deep: true,
      immediate: true // 组件创建时立即运行 handler
    },
    isLoading(newVal) {
      if (newVal) {
        // 当开始加载时，重置指针和条形图动画到起始点，并标记动画未完成
        this.animatedPointerAngle = 0; // 指针动画起始角度，最右侧
        this.animationComplete = false;
        this.animatedBarWidths = this.chartData.map(() => 0); // 条形图宽度重置为0
        this.barAnimationComplete = false;
      } else {
        // 当加载结束时，触发指针和条形图动画
        this.$nextTick(() => {
          this.animatePointer();
          this.animateBars(); // 调用新的条形图动画函数
        });
      }
    }
  },
  created() {
    this.fetchAnalyst(this.symbol);
    // 组件创建时根据加载状态初始化指针和条形图角度/宽度
    if (this.isLoading) {
      this.animatedPointerAngle = 0; // 初始加载时指针从0开始
      // animatedBarWidths 会由 analystData handler 初始化
    } else {
      this.animatedPointerAngle = this.pointerAngleDynamic;
      this.animationComplete = true; // 如果初始就不加载，则指针动画视为已完成
      // animatedBarWidths 会由 analystData handler 初始化
    }
  },
  methods: {
    ...mapActions("market/sec/analyst", ["fetchAnalyst"]),
    getArcPath(startAngle, endAngle, radius) {
      const centerX = this.chartSize / 2
      const centerY = this.chartSize / 2
      const innerRadius = radius - 10 // 让扇形更细

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
    // 指针动画函数
    animatePointer() {
      const startAngle = 0; // 动画起始角度设为0度 (最右侧)
      const endAngle = this.pointerAngleDynamic; // 动态角度
      const duration = 800; // 动画持续时间（毫秒）
      let startTime = null;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          // 线性插值计算当前角度
          this.animatedPointerAngle = startAngle + (endAngle - startAngle) * progress;
          requestAnimationFrame(animate);
        } else {
          this.animatedPointerAngle = endAngle; // 确保最终值精确
          this.animationComplete = true; // 动画完成
        }
      };

      requestAnimationFrame(animate);
    },
    // 新增：条形图动画函数
    animateBars() {
      const duration = 800; // 动画持续时间（毫秒），与指针动画保持一致
      let startTime = null;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          this.animatedBarWidths = this.chartData.map(item => {
            const startWidth = 0; // 从0开始动画
            const endWidth = item.value;
            return startWidth + (endWidth - startWidth) * progress;
          });
          requestAnimationFrame(animate);
        } else {
          this.animatedBarWidths = this.chartData.map(item => item.value); // 确保最终值精确
          this.barAnimationComplete = true; // 动画完成
        }
      };

      requestAnimationFrame(animate);
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
  margin: 0 24px;
}

.semicircle-chart-wrapper {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.chart-svg {
  overflow: visible;
}

.chart-label {
  font-size: $spacing-sm;
  fill: #888;
  font-weight: 500;
  opacity: 1;
  transition: none;
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
  width: 88px;
  text-align: left;
}

.bar-container {
  flex: 1;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.bar {
  height: 100%;
  border-radius: 10px;
  /* 移除 width 的 CSS transition，由 JS 动画控制 */
  /* transition: width 0.3s ease; */
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

.bar-loading {
  background-color: #e0e0e0 !important;
  /* 加载时灰色背景 */
  animation: pulse 1.5s infinite ease-in-out;
  /* 脉冲动画 */
}

.segment-loading {
  opacity: 0.3;
  /* 加载时半透明 */
  animation: pulse 1.5s infinite ease-in-out;
}

/* 指针加载样式：在动画完成前保持半透明脉冲效果 */
.pointer-loading {
  opacity: 0.3;
  animation: pulse 1.5s infinite ease-in-out;
}

.no-data-message {
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
}

/* Optional: Keyframes for a pulsing loading animation */
@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}
</style>
