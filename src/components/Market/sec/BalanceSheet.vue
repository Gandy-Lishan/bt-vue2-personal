<template>
    <div class="balance-sheet">
      <h2 class="title">Balance Sheet</h2>
      <div style="display: flex;gap:16px">
      <button-group 
        v-model="timeframe" 
        :options="[
          { label: 'Annual', value: 'annual' },
          { label: 'Quarterly', value: 'quarterly' },
        ]" 
        backgroundColor="#fff" 
        :enableTransition="true" 
      />
      <button-group 
        v-model="category" 
        :options="[
          { label: 'Assets', value: 'assets' },
          { label: 'liabilities & Equity', value: 'liabilitiesEquity' },
          { label: 'Key Ratios', value: 'keyRatios' },
        ]" 
        backgroundColor="#fff" 
        :enableTransition="true" 
      />
    </div>
    <div class="spacing-lg"></div>
    <div class="grid-col-4">
      <SectorCard
        :title="balanceSheetPanels[0].title"
        :region="balanceSheetPanels[0].data.region"
        :total-premium="balanceSheetPanels[0].data.totalPremium"
        :country-risk="balanceSheetPanels[0].data.countryRisk"
      />

      <SectorCard
        :title="balanceSheetPanels[1].title"
        :region="balanceSheetPanels[1].data.region"
        :total-premium="balanceSheetPanels[1].data.totalPremium"
        :country-risk="balanceSheetPanels[1].data.countryRisk"
      />

      <SectorCard
        :title="balanceSheetPanels[2].title"
        :region="balanceSheetPanels[2].data.region"
        :total-premium="balanceSheetPanels[2].data.totalPremium"
        :country-risk="balanceSheetPanels[2].data.countryRisk"
      />

      <SectorCard
        :title="balanceSheetPanels[3].title"
        :region="balanceSheetPanels[3].data.region"
        :total-premium="balanceSheetPanels[3].data.totalPremium"
        :country-risk="balanceSheetPanels[3].data.countryRisk"
      />
    </div>
    <div v-if="category == 'assets'" class="grid balance-sheet__assets-grid">
      <section class="card total-assets-trend">
        <h3 class="card__subtitle">{{ balanceSheetPanels[4].title }}</h3>
        <BarChart
          :chartData="balanceSheetPanels[4].data.chartData"
          :seriesConfigs="balanceSheetPanels[4].data.seriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="topright"
          :show-legend="false"
          chartHeight="400px"
        />
      </section>
      <section class="card asset-composition">
        <h3 class="card__subtitle">{{ balanceSheetPanels[5].title }}</h3>
        <BarChart
          :chartData="balanceSheetPanels[5].data.chartData"
          :seriesConfigs="balanceSheetPanels[5].data.seriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="bottomcenter"
          :show-legend="true"
          chartHeight="400px"
          stacking="normal"
        />
      </section>
      <section class="card assets-current">
        <div class="card__subtitle">{{ balanceSheetPanels[6].title }}</div>
        <base-table-simple
          :data="balanceSheetPanels[6].data"
          :highlight-last-row="false"
        />
      </section>
      <section class="card assets-noncurrent">
        <div class="card__subtitle">{{ balanceSheetPanels[7].title }}</div>
        <base-table-simple
          :data="balanceSheetPanels[7].data"
          :highlight-last-row="false"
        />
      </section>
    </div>
    <div v-if="category == 'liabilitiesEquity'" class="grid balance-sheet__liabilities-equity-grid">
    </div>
    <div v-if="category == 'keyRatios'" class="grid balance-sheet__key-ratios-grid">
    </div>
  </div>
</template>

<script>
import BaseTableSimple from "@/components/Market/components/tables/BaseTableSimple";
import BarChart from '@/components/Market/components/charts/BarChart.vue';
import SectorCard from '@/components/Market/components/sectorCard/SectorCard.vue';
import ButtonGroup from '@/components/Market/components/baseButton/ButtonGroup.vue';

export default {
  name: 'BalanceSheet',
  props: {
  },
  data() {
    return {
      timeframe: 'annual',
      category: 'assets',

      balanceSheetPanels: [
        {
          title: 'Total Assets',
          data: {
            id: 1,
            title: 'Total Assets',
            totalPremium: 5.27
          },
        },
        {
          title: 'Fixed Assets',
          data: {
            id: 2,
            title: 'Fixed Assets',
            totalPremium: 211.99
          },
        },
        {
          title: 'Total Liabilities',
          data: {
            id: 3,
            title: 'Total Liabilities',
            totalPremium: 166.4
          },
        },
        {
          title: 'Total Equity',
          data: {
            id: 4,
            title: 'Total Equity',
            totalPremium: 186.2
          },
        },
         // total assets trend 
        {
          title: 'Total Assets Trend',
          data: {
            chartData: [
              { date: '2020', value: 100 },
              { date: '2021', value: 150 },
              { date: '2022', value: 170 },
              { date: '2023', value: 168 },
            ],
            seriesConfigs: [
              { key: 'value', label: 'Value', color: '#4A90E2' },
            ],
          },
        },
         // asset composition
        {
          title: 'Asset Composition',
          data: {
            chartData: [
              { date: '2020', current: 145, nonCurrent: 330 },
              { date: '2021', current: 140, nonCurrent: 350 },
              { date: '2022', current: 148, nonCurrent: 344 },
              { date: '2023', current: 150, nonCurrent: 348 },
              { date: '2024(TTM)', current: 145, nonCurrent: 220 },
            ],
            seriesConfigs: [
              { key: 'current', label: 'Current Assets', color: 'blue' },
              { key: 'nonCurrent', label: 'Non-Current Assets', color: 'green' },
            ],
          },
        },
        // current || noncurrent assets
        {
          title: 'Current Assets',
          data: [
            { label: 'Cash & Equivalents', value: '29.94B' },
            { label: 'Short-term Investments', value: '35.23B' },
            { label: 'Net Receivables', value: '66.24B' },
            { label: 'Inventory', value: '7.29B' },
            { label: 'Total Current Assets', value: '152.99B' },
          ]
        },
        {
          title: 'Non-Current Assets',
          data: [
            { label: 'Long-term Investments', value: '91.48B' },
            { label: 'Property & Equipment', value: '45.68B' },
            { label: 'Goodwill', value: '0.00' },
            { label: 'Intangivle Assets', value: '0.00' },
            { label: 'Total Non-Current Assets', value: '364.98B' },
          ]
        },
      ],

      loading: false,
    }
  },
  components: {
    BaseTableSimple,
    BarChart,
    SectorCard,
    ButtonGroup,
  },
  computed: {
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
 @import "@/components/Market/market.scss";

.balance-sheet {
  margin: 0 auto;

  &__assets-grid {
    grid-template-areas:
      "a a b b"
      "c c d d";
    grid-template-columns: repeat(4, 1fr);
  }
  &__-liabilities-equity-grid {
    grid-template-areas:
      "a a b b"
      "c c c c";
    grid-template-columns: repeat(4, 1fr);
  }
  &__key-ratios-grid {
    grid-template-areas:
      "a a a a"
      "b c d e";
    grid-template-columns: repeat(4, 1fr);
  }

  // Assets cards
  .total-assets-trend {
    grid-area: a;
  }
  .asset-composition {
    grid-area: b;
  }
  .assets-current {
    grid-area: c;
  }
  .assets-noncurrent {
    grid-area: d;
  }

  // Liabilities equity cards
  .liabilities-breakdown {
    grid-area: a;
  }
  .equity-trend {
    grid-area: b;
  }
  .liabilities-equity {
    grid-area: c;
  }

  // Key ratios
  .key-performance-metrics {
    grid-area: a;
  }
  .liquidity-metrics {
    grid-area: b;
  }
  .asset-management {
    grid-area: c;
  }
  .capital-structure {
    grid-area: d;
  }
  .growth-analysis {
    grid-area: e;
  }
}
</style>

