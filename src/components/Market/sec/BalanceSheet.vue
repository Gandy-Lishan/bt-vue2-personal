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
    <div v-if="category == 'assets'">
      <div class="grid-col-1">
        <!-- total-assets-trend & asset-composition -->
        <section class="card total-assets-trend">
          <h3 class="card__subtitle">{{ balanceSheetPanels[4].title }}</h3>
          <BarChart
            ref="totalAssetsTrend"
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
      </div>
      <div class="grid-col-2">
        <!-- assets-current -->
        <section class="card assets-current">
          <div class="card__subtitle">{{ balanceSheetPanels[5].title }}</div>
          <base-table-simple
            :data="balanceSheetPanels[5].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card assets-noncurrent">
          <div class="card__subtitle">{{ balanceSheetPanels[6].title }}</div>
          <base-table-simple
            :data="balanceSheetPanels[6].data"
            :highlight-last-row="true"
          />
        </section>
      </div>
    </div>
    <div v-if="category == 'liabilitiesEquity'">
      <div class="grid-col-2">
        <!-- Liabilities Breakdown -->
        <section class="card lb">
          <h3 class="card__subtitle">{{ balanceSheetPanels[7].title }}</h3>
          <BarChart
            ref="lb"
            :chartData="balanceSheetPanels[7].data.chartData"
            :seriesConfigs="balanceSheetPanels[7].data.seriesConfigs"
            titleText=""
            yAxisTitleText=""
            orientation="column"
            :enableExporting="false"
            legendPosition="bottomcenter"
            :show-legend="true"
            chartHeight="400px"
          />
        </section>
        <section class="card shareholder">
          <h3 class="card__subtitle">{{ balanceSheetPanels[8].title }}</h3>
          <BarChart
            ref="shareholder"
            :chartData="balanceSheetPanels[8].data.chartData"
            :seriesConfigs="balanceSheetPanels[8].data.seriesConfigs"
            titleText=""
            yAxisTitleText=""
            orientation="column"
            :enableExporting="false"
            legendPosition="bottomcenter"
            :show-legend="true"
            chartHeight="400px"
          />
        </section>
      </div>
      <div class="grid-col-3">
        <section class="card liabilities-current">
          <div class="card__subtitle">{{ balanceSheetPanels[9].title }}</div>
          <base-table-simple
            :data="balanceSheetPanels[9].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card liabilities-noncurrent">
          <div class="card__subtitle">{{ balanceSheetPanels[10].title }}</div>
          <base-table-simple
            :data="balanceSheetPanels[10].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card shareholder-equity">
          <div class="card__subtitle">{{ balanceSheetPanels[11].title }}</div>
          <base-table-simple
            :data="balanceSheetPanels[11].data"
            :highlight-last-row="true"
          />
        </section>
      </div>
    </div>
    <div v-if="category == 'keyRatios'">
      <div class="grid-col-1">
        <!-- Liabilities Breakdown -->
        <section class="card key-performance-metrics">
          <h3 class="card__subtitle">{{ balanceSheetPanels[12].title }}</h3>
          <BarChart
            ref="keyPerformanceMetrics"
            :chartData="balanceSheetPanels[12].data.chartData"
            :seriesConfigs="balanceSheetPanels[12].data.seriesConfigs"
            titleText=""
            yAxisTitleText=""
            orientation="column"
            :enableExporting="false"
            legendPosition="bottomcenter"
            :show-legend="true"
            chartHeight="400px"
          />
        </section>
      </div>
      <div class="grid-col-3">
        <section class="card liabilities-current">
          <div class="card__subtitle">{{ balanceSheetPanels[9].title }}</div>
          <base-table-simple
            :data="balanceSheetPanels[9].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card liabilities-noncurrent">
          <div class="card__subtitle">{{ balanceSheetPanels[10].title }}</div>
          <base-table-simple
            :data="balanceSheetPanels[10].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card shareholder-equity">
          <div class="card__subtitle">{{ balanceSheetPanels[11].title }}</div>
          <base-table-simple
            :data="balanceSheetPanels[11].data"
            :highlight-last-row="true"
          />
        </section>
      </div>
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
        // 0
        {
          title: 'Total Assets',
          data: {
            id: 1,
            title: 'Total Assets',
            totalPremium: 5.27
          },
        },
        // 1
        {
          title: 'Fixed Assets',
          data: {
            id: 2,
            title: 'Fixed Assets',
            totalPremium: 211.99
          },
        },
        // 2
        {
          title: 'Total Liabilities',
          data: {
            id: 3,
            title: 'Total Liabilities',
            totalPremium: 166.4
          },
        },
        // 3
        {
          title: 'Total Equity',
          data: {
            id: 4,
            title: 'Total Equity',
            totalPremium: 186.2
          },
        },
         // 4 asset composition
        {
          title: 'Asset Composition',
          data: {
            chartData: [
              { date: '2020', total:475, current: 145, nonCurrent: 330 },
              { date: '2021', total:490, current: 140, nonCurrent: 350 },
              { date: '2022', total:492, current: 148, nonCurrent: 344 },
              { date: '2023', total:498, current: 150, nonCurrent: 348 },
              { date: '2024(TTM)', total:365, current: 145, nonCurrent: 220 },
            ],
            seriesConfigs: [
              { key: 'total', label: 'Total Assets', color: 'green' },
              { key: 'current', label: 'Current Assets', color: 'blue' },
              { key: 'nonCurrent', label: 'Non-Current Assets', color: 'red' },
            ],
          },
        },
        // 5 current || noncurrent assets
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
        // 6
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
        // 7
        {
          title: 'Liabilities Breakdown',
          data: {
            chartData: [
              { date: 'Jul 2023', total: 7, current: 5, nonCurrent: 2  },
              { date: 'Oct 2023', total: 8, current: 5, nonCurrent: 3 },
              { date: 'Dec 2023', total: 12, current: 7, nonCurrent: 5 },
              { date: 'Apr 2024', total: 5, current: 4, nonCurrent: 2 },
              { date: 'Jul 2024', total: 9, current: 2, nonCurrent: 7 },
              { date: 'Oct 2024', total: 5, current: 2, nonCurrent: 3 },
            ],
            seriesConfigs: [
              { key: 'total', label: 'Total Liabilities', color: 'green', type: 'line' },
              { key: 'current', label: 'Current Liabilities', color: 'blue' },
              { key: 'nonCurrent', label: 'Non-Current Liabilities', color: 'red' },
            ],
          }
        },
        // 8
        {
          title: `Shareholders' Equity Trend`,
          data: {
            chartData: [
              { date: 'Jul 2023', total: 2.5, retained: 4.7, common: 0  },
              { date: 'Oct 2023', total: 3, retained: 4, common: 0 },
              { date: 'Dec 2023', total: 2.8, retained: 4, common: 0 },
              { date: 'Apr 2024', total: 2.7, retained: 4, common: 0 },
              { date: 'Jul 2024', total: 3.8, retained: 3.8, common: 0 },
              { date: 'Oct 2024', total: 4, retained: 4, common: 1 },
            ],
            seriesConfigs: [
              { key: 'total', label: 'Total Equity', color: 'green', type: 'line' },
              { key: 'retained', label: 'Retained Earnings', color: 'blue' },
              { key: 'common', label: 'Common Stock', color: 'red' },
            ],
          }
        },
        // 9 Liabilities & Equity
        {
          title: 'Current Liabilities',
          data: [
            { label: 'Accounts Payable', value: '29.94B' },
            { label: 'Short-term Debt', value: '35.23B' },
            { label: 'Deferred Revenue', value: '66.24B' },
            { label: 'Current Liabilities', value: '152.99B' },
          ]
        },
        {
          title: 'Non-Current Liabilities',
          data: [
            { label: 'Long-term Debt', value: '29.94B' },
            { label: 'Deferred Revenue (Non-Current)', value: '35.23B' },
            { label: 'Other Non-Current Liabilities', value: '7.29B' },
            { label: 'Non-Current Liabilities', value: '152.99B' },
          ]
        },
        {
          title: `Stockholders' Equity`,
          data: [
            { label: 'Retained Earnings', value: '29.94B' },
            { label: 'Common Stock', value: '35.23B' },
            { label: 'Treasury Stock', value: '66.24B' },
            { label: 'Inventory', value: '7.29B' },
            { label: `Stockholders' Equity`, value: '152.99B' },
          ]
        },
        // 12 Key Performance Metrics
        {
          title: 'Key Performance Metrics',
          data: {
            chartData: [
              { date: '2017-12-30', currtRadio: 7, debt: 5, turnover: 2  },
              { date: '2018-12-29', currtRadio: 8, debt: 5, turnover: 3 },
              { date: '2019-12-28', currtRadio: 12, debt: 7, turnover: 5 },
              { date: '2021-01-02', currtRadio: 5, debt: 4, turnover: 2 },
              { date: '2022-01-01', currtRadio: 9, debt: 2, turnover: 7 },
              { date: '2022-12-31', currtRadio: 5, debt: 2, turnover: 3 },
              { date: '2023-12-30', currtRadio: 5, debt: 2, turnover: 3 },
              { date: '2024-12-28', currtRadio: 5, debt: 2, turnover: 3 },
            ],
            seriesConfigs: [
              { key: 'currtRadio', label: 'Current Ratio', color: 'green', type: 'line' },
              { key: 'debt', label: 'Debt to Equity', color: 'blue', type: 'line' },
              { key: 'turnover', label: 'Asset Turnover', color: 'red', type: 'line' },
            ],
          }
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

  // &__assets-grid {
  //   grid-template-areas:
  //     "a a b b";
  //   grid-template-columns: repeat(4, 1fr);
  // }
  // &__-liabilities-equity-grid {
  //   grid-template-areas:
  //     "a a b b";
  //   grid-template-columns: repeat(4, 1fr);
  // }
  // &__key-ratios-grid {
  //   grid-template-areas:
  //     "a a a a";
  //   grid-template-columns: repeat(4, 1fr);
  // }

  // // Assets cards
  // .total-assets-trend {
  //   grid-area: a;
  // }
  // .asset-composition {
  //   grid-area: b;
  // }

  // // Liabilities equity cards
  // .liabilities-breakdown {
  //   grid-area: a;
  // }
  // .equity-trend {
  //   grid-area: b;
  // }

  // // Key ratios
  // .key-performance-metrics {
  //   grid-area: a;
  // }
}
</style>

