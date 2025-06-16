<template>
  <div class="earnings">
    <h2 class="title">Earnings</h2>

    <div class="grid earnings__grid">
      <!-- 左侧条形图 -->
      <section class="card earnings__card trend-estimate">
        <h3 class="card__subtitle">EPS Trend & Estimates</h3>
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
          title-text=""
          orientation="column"
          chart-height="auto"
          :enableExporting="false"
        />
      </section>

      <!-- 右侧信息卡 -->
      <section class="sector-group grid-row-3">
        <SectorCard
          class="sector-ave-eps"
          :title="sectors[0].title"
          :region="sectors[0].region"
          :total-premium="sectors[0].totalPremium"
          :country-risk="sectors[0].countryRisk"
        />

        <SectorCard
          class="sector-beat-miss-ratio"
          :title="sectors[1].title"
          :region="sectors[1].region"
          :total-premium="sectors[1].totalPremium"
          :country-risk="sectors[1].countryRisk"
        />

        <SectorCard
          class="sector-ave-surprise"
          :title="sectors[2].title"
          :region="sectors[2].region"
          :total-premium="sectors[2].totalPremium"
          :country-risk="sectors[2].countryRisk"
        />
      </section>

      <!-- 三列 -->
      <section class="card earnings__card eps-growth-rate">
        <h3 class="card__subtitle">EPS Growth Rate</h3>
        <ESPGrowthChart />
      </section>
      <section class="card earnings__card earnings-surprises">
        <h3 class="card__subtitle">Earnings Surprises</h3>
        <BarChart
          :chart-data="[
            { date: 'Q1 2024', estimate: 1.2 },
            { date: 'Q2 3023', estimate: 1.4 },
            { date: 'Q3 2022', estimate: 1.6 }
          ]"
          :series-configs="[
            { key: 'estimate', label: 'Estimate ESP', color: '#4CAF50', positiveColor: '#4CAF50', negativeColor: '#D64A3B' }
          ]"
          title-text="Earnings Surprise"
          orientation="column"
          chartHeight="auto"
          :enableExporting="false"
          :show-legend="false"
        />
      </section>
      <section class="card earnings__card revenue-surprises">
        <h3 class="card__subtitle">Revenue Surprises</h3>
        <BarChart
              :chart-data="[
                { date: 'Q1 2024', estimate: 1.2 },
                { date: 'Q2 2023', estimate: -0.8 },
                { date: 'Q3 2023', estimate: 1.6 }
              ]"
              :series-configs="[
                { key: 'estimate', label: 'Estimate ESP', color: '#4CAF50', positiveColor: '#4CAF50', negativeColor: '#D64A3B' }
              ]"
              title-text="Revenue Surprise"
              orientation="column"
              chart-height="auto"
              :enableExporting="false"
              :enablePositiveNegativeColors="true"
              :show-legend="false"
            />
      </section>

      <!-- 一整行 -->
      <section class="card earnings__card earnings-history">
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
      </section>
      <section class="card earnings__card upcoming-earnings">
        <h3 class="subtitle">Upcoming Earnings</h3>
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
 @import "@/components/Market/market.scss";

.earnings {
  margin: 0 auto;

  &__grid {
    grid-template-areas:
      "a a b"
      "a a b"
      "a a b"
      "c d e"
      "f f f"
      "g g g";
    grid-template-columns: repeat(3, minmax(280px, 1fr));
    
  }

  .trend-estimate {
    grid-area: a;
  }
  .sector-group {
    grid-area: b;
  }
  .eps-growth-rate {
    grid-area: c;
  }
  .earnings-surprises {
    grid-area: d;
  }
  .revenue-surprises {
    grid-area: e;
  }
  .earnings-history {
    grid-area: f;
  }
  .upcoming-earnings {
    grid-area: g;
  }
}
</style>

