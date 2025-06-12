<template>
  <div class="analyst-recommendations">
    <h2 class="title">Earnings</h2>
    <div class="contentWrapper">
      <h3 class="subtitle">EPS Trend & Estimates</h3>
      <div class="chart-container">
        <!-- 左侧半圆形图表 -->
        <div class="card semicircle-chart">
          <BarChart
            :chart-data="[
              { date: 'Q1', estimate: 1.2, actual: 1.5 },
              { date: 'Q2', estimate: 1.4, actual: 1.3 },
              { date: 'Q3', estimate: 1.6, actual: 1.7 }
            ]"
            :series-configs="[
              { key: 'estimate', label: 'Estimate ESP', color: '#3b82f6' },
              { key: 'actual', label: 'Actual ESP', color: '#b3d8ff' }
            ]"
            title-text="EPS Comparison"
            orientation="column"
            chart-height="auto"
            :enableExporting="false"
          />
        </div>
        
        <!-- 右侧条形图 -->
        <div class="bar-chart">
          <SectorCard
            v-for="sector in sectors"
            :key="sector.id"
            :title="sector.title"
            :region="sector.region"
            :total-premium="sector.totalPremium"
            :country-risk="sector.countryRisk"
          />
        </div>
      </div>
    </div>
    <div class="contentWrapper">
      <div class="chart-container">
        <!-- 左侧半圆形图表 -->
        <div class="esp-chart">
          <BarChart
            :chart-data="[
              { date: 'Q1 2024', estimate: 1.2 },
              { date: 'Q2 3023', estimate: 1.4 },
              { date: 'Q3 2022', estimate: 1.6 }
            ]"
            :series-configs="[
              { key: 'estimate', label: 'Estimate ESP', color: '#4CAF50' }
            ]"
            title-text="Earnings Surprise"
            orientation="column"
            chart-height="auto"
            :enableExporting="false"
          />
        </div>
        <div class="esp-chart">
          <ESPGrowthChart />
        </div>
      </div>
    </div>
    <div class="contentWrapper">
      <h3 class="subtitle">Earnings History</h3>
      <base-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        tip-text=""
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </base-table>
    </div>
    <div class="contentWrapper">
      <h3 class="subtitle">Earnings History</h3>
      <base-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        tip-text=""
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </base-table>
    </div>
  </div>
</template>

<script>
import BaseTable from "@/components/Market/components/tables/BaseTable";
import BarChart from '@/components/Market/components/charts/BarChart.vue';
import SectorCard from '@/components/Market/components/sectorCard/SectorCard.vue';
import ESPGrowthChart from '@/components/Market/components/charts/stockChart/ESPGrowthChart.vue';

export default {
  name: 'Earnings',
  props: {
  },
  data() {
    return {
      sectors: [
       {
         id: 1,
         title: 'China',
         totalPremium: 5.27
       },
       {
         id: 2,
         title: 'China',
         totalPremium: 5.27
       },
       {
         id: 3,
         title: 'China',
         totalPremium: 5.27
       }
     ],
      loading: false,
      tableData: [
        {
          period: '2025-06-11',
          date: '2025-06-11',
          estimated_EPS: 100,
          actual_EPS: 100,
          surprise: 10,
          est_revenue: 100,
          actual_revenue: 100,
          surprise_revenue: 10,
        },
        {
          period: '2025-06-11',
          date: '2025-06-11',
          estimated_EPS: 100,
          actual_EPS: 100,
          surprise: 10,
          est_revenue: 100,
          actual_revenue: 100,
          surprise_revenue: 10,
        }
      ],
      columns: [
        { prop: 'period', label: 'Period', sortable: true },
        { prop: 'date', label: 'Date', width: '120', sortable: true },
        { prop: 'estimated_EPS', label: 'Estimated EPS', sortable: true },
        { prop: 'actual_EPS', label: 'Actual EPS', sortable: true },
        { prop: 'surprise', label: 'Surprise', sortable: true },
        { prop: 'est_revenue', label: 'Est. Revenue', sortable: true },
        { prop: 'actual_revenue', label: 'Actual Revenue', sortable: true }
      ],
    }
  },
  components: {
    BaseTable,
    BarChart,
    SectorCard,
    ESPGrowthChart
  },
  computed: {
  },
  methods: {
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
// 设置边框和阴影
@mixin esp-border-shadow {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
}
.analyst-recommendations {
  margin: 0 auto;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px 0;
}

.contentWrapper {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.subtitle {
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  margin: 0 0 12px 0;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 0 12px 0;
}

.chart-container {
  display: flex;
  gap: 40px;
  align-items: stretch;
}

.semicircle-chart {
  flex: 1;
  @include esp-border-shadow;
}
.esp-chart {
  flex: 1;
  @include esp-border-shadow;
}

.chart-svg {
  overflow: visible;
}

.chart-label {
  font-size: 12px;
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
  gap: 12px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  font-size: 14px;
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
  .chart-container {
    flex-direction: column;
    gap: 24px;
  }
  
  .contentWrapper {
    padding: 16px;
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

