<template>
  <div class="analyst-recommendations">
    <div class="title">Financials</div>
    <button-group 
      v-model="timeframe" 
      :options="[
        { label: 'Annual', value: 'annual' },
        { label: 'Quarterly', value: 'quarterly' },
      ]" 
      backgroundColor="#fff" 
      :enableTransition="true" 
    />
    <div class="spacing-lg"></div>
    <div class="grid">
      <section class="card financials__card" v-for="panel in financialPanels" :key="panel.title">
        <div class="card__subtitle">{{ panel.title }}</div>
        <base-table :data="panel.data" :columns="panel.columns" :loading="false" tip-text="" :show-pagination="false" />
      </section>
    </div>
    <section class="card financials__card">
      <h3 class="card__subtitle">Financial Trends</h3>
      <BarChart :chart-data="[
        { date: '2024-Q1', shares: 123 },
        { date: '2024-Q2', shares: 156 },
        { date: '2024-Q3', shares: 98 },
        { date: '2024-Q4', shares: 172 }
      ]" :series-configs="[
        { key: 'shares', label: 'Total Shares', color: '#4CAF50' }
      ]" title-text="Quarterly Shares Growth" orientation="column" chart-height="auto" y-axis-title-text="Shares"
        :enableExporting="true" />
    </section>
    <div class="grid">
      <section class="card financials__card">
        <div class="card__subtitle">Analyst Predict Summary</div>
      </section>
      <section class="card financials__card">
        <div class="card__subtitle">Analyst Predict Summary</div>
      </section>
    </div>
  </div>
</template>

<script>
import BaseTable from "@/components/Market/components/tables/BaseTable";
import BarChart from '@/components/Market/components/charts/BarChart.vue';
import ButtonGroup from '@/components/Market/components/baseButton/ButtonGroup.vue';
export default {
  name: 'Financials',
  data() {
    return {
      financialPanels: [
        {
          title: 'Margin Analysis',
          columns: [
            { prop: 'label', label: '', width: '160' },
            { prop: 'value', label: '' }
          ],
          data: [
            { label: 'Gross Margin', value: '46.21%' },
            { label: 'Operating Margin', value: '31.51%' },
            { label: 'Net Margin', value: '23.97%' }
          ]
        },
        {
          title: 'Earnings Surprises',
          columns: [
            { prop: 'label', label: '', width: '160' },
            { prop: 'value', label: '' }
          ],
          data: [
            { label: 'Asset Turnover', value: 'N/A' },
            { label: 'Return on Equity', value: 'N/A' },
            { label: 'Return on Assets', value: 'N/A' }
          ]
        },
        {
          title: 'Financial Scores',
          columns: [
            { prop: 'label', label: '', width: '160' },
            { prop: 'value', label: '' }
          ],
          data: [
            { label: 'Altman Z-Score', value: '2.15' },
            { label: 'Piotroski Score', value: '4.00' }
          ]
        }
      ],
      timeframe: 'annual'
    }
  },
  components: {
    BaseTable,
    BarChart,
    ButtonGroup,
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

.analyst-recommendations {
  margin: 0 auto;
}

.financials {
  &__card {
    background-color: white;
    border-radius: 8px;
    padding: 24px;
  }

  &__chart-container {
    display: flex;
    align-items: center;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .financials {
    &__card {
      padding: 16px;
    }
  }
}
</style>
