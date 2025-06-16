<template>
    <div class="cashflow">
      <h2 class="title">Cash Flow</h2>
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
    <div class="grid-col-3">
      <SectorCard
        :title="cashflowPanels[0].title"
        :region="cashflowPanels[0].data.region"
        :total-premium="cashflowPanels[0].data.totalPremium"
        :country-risk="cashflowPanels[0].data.countryRisk"
      />

      <SectorCard
        :title="cashflowPanels[1].title"
        :region="cashflowPanels[1].data.region"
        :total-premium="cashflowPanels[1].data.totalPremium"
        :country-risk="cashflowPanels[1].data.countryRisk"
      />

      <SectorCard
        :title="cashflowPanels[2].title"
        :region="cashflowPanels[2].data.region"
        :total-premium="cashflowPanels[2].data.totalPremium"
        :country-risk="cashflowPanels[2].data.countryRisk"
      />
    </div>
    <div class="grid-col-2">
      <!-- cash flow components & free cash flow trend -->
      <section class="card total-assets-trend">
        <h3 class="card__subtitle">{{ cashflowPanels[3].title }}</h3>
        <BarChart
          ref="totalAssetsTrend"
          :chartData="cashflowPanels[3].data.chartData"
          :seriesConfigs="cashflowPanels[3].data.seriesConfigs"
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
      <section class="card asset-composition">
        <h3 class="card__subtitle">{{ cashflowPanels[4].title }}</h3>
        <BarChart
          ref="assetComposition"
          :chartData="cashflowPanels[4].data.chartData"
          :seriesConfigs="cashflowPanels[4].data.seriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="bottomcenter"
          :show-legend="false"
          chartHeight="400px"
          stacking="normal"
        />
      </section>
    </div>
      <!-- cash flow activities -->
      <section class="card">
        <div class="card__subtitle">Cash Flow Activities</div>
        <div class="grid-col-3">
          <base-table-simple
            :title="cashflowPanels[5].title"
            :data="cashflowPanels[5].data"
            :highlight-last-row="true"
          />
          <base-table-simple
            :title="cashflowPanels[6].title"
            :data="cashflowPanels[6].data"
            :highlight-last-row="true"
          />
          <base-table-simple
            :title="cashflowPanels[7].title"
            :data="cashflowPanels[7].data"
            :highlight-last-row="true"
          />
        </div>
        <div class="divider"></div>
        <base-table-simple
          :title="cashflowPanels[8].title"
          :data="cashflowPanels[8].data"
          :highlight-last-row="true"
          :transpose="true"
        />
      </section>

      <div class="grid-col-3">
        <section class="card">
          <div class="card__subtitle">Efficiency Metrics</div>
          <base-table-simple
            :data="cashflowPanels[9].data"
            :highlight-last-row="false"
          />
        </section>
        <section class="card">
          <div class="card__subtitle">Capital Allocation</div>
          <base-table-simple
            :data="cashflowPanels[10].data"
            :highlight-last-row="false"
          />
        </section>
        <section class="card">
          <div class="card__subtitle">Sustainability Metrics</div>
          <base-table-simple
            :data="cashflowPanels[11].data"
            :highlight-last-row="false"
          />
        </section>
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

      cashflowPanels: [
        // 0
        {
          title: 'Operating Cash Flow',
          data: {
            id: 1,
            title: 'Operating Cash Flow',
            totalPremium: 118.25
          },
        },
        // 1
        {
          title: 'Frae Cash Flow',
          data: {
            id: 2,
            title: 'Frae Cash Flow',
            totalPremium: 108.99
          },
        },
        // 2
        {
          title: 'Cash Balance',
          data: {
            id: 3,
            title: 'Cash Balance',
            totalPremium: 29.4
          },
        },
         // 3 cash flow components
        {
          title: 'Cash Flow Components',
          data: {
            chartData: [
              { date: '2020', operating: 80, inversting: -5, financing: -95 },
              { date: '2021', operating: 111, inversting: -12, financing: -115 },
              { date: '2022', operating: 122, inversting: -16, financing: -83 },
              { date: '2023', operating: 121, inversting: -26, financing: -95 },
              { date: '2024', operating: 108, inversting: -2, financing: -35 },
            ],
            seriesConfigs: [
              { key: 'operating', label: 'Operating', color: 'blue' },
              { key: 'inversting', label: 'Inversting', color: 'red' },
              { key: 'financing', label: 'Financing', color: 'orange' },
            ],
          },
        },
         // 4 free cash flow trend
        {
          title: 'Free Cash Flow Trend',
          data: {
            chartData: [
              { date: '2020', value: 75 },
              { date: '2021', value: 90 },
              { date: '2022', value: 110 },
              { date: '2023', value: 100 },
              { date: '2024(TTM)', value: 102 },
            ],
            seriesConfigs: [
              { key: 'value', label: 'Value', color: 'green' },
            ],
          },
        },
        // 5
        {
          title: 'Operating Activities',
          data: [
            { label: 'Net Income', value: '91.48B' },
            { label: 'Depreciation & Amortization', value: '45.68B' },
            { label: 'Changes in Working Capital', value: '0.00' },
            { label: 'Net Cash From Operations', value: '0.00' },
          ]
        },
        // 6
        {
          title: 'Investing Activities',
          data: [
            { label: 'Capital Expenditure', value: '91.48B' },
            { label: 'Acquisitions', value: '45.68B' },
            { label: 'Net Cash From Investing', value: '0.00' },
          ]
        },
        // 7
        {
          title: 'Financing Activities',
          data: [
            { label: 'Debt Repayment', value: '91.48B' },
            { label: 'Stock Repurchase', value: '45.68B' },
            { label: 'Dividends Paid', value: '0.00' },
            { label: 'Net Cash From Financing', value: '0.00' },
          ]
        },
        // 8
        {
          title: 'Summary',
          data: [
            { label: 'Net Change in Cash', value: '-$18.6B' },
            { label: 'Free Cash Flow', value: '$101.9B' },
            { label: 'Ending Cash Balance', value: '$90.5B' },
          ]
        },

        // 9 Efficiency Metrics
        {
          title: 'Efficiency Metrics',
          data: [
            { label: 'Gross Operating Cash Flow Ratio', value: '2.4%' },
            { label: 'Cash Flow Yield', value: '52%' },
            { label: 'Cash Conversion Cycle', value: '-52' },
            { label: 'Operating Cash Flow Growth', value: '000%' },
            { label: 'Free Cash Flow Growth', value: '0.00%' },
          ]
        },
        
        // 10 Capital Allocation
        {
          title: 'Capital Allocation',
          data: [
            { label: 'Reinvestment Rate', value: '2.3%' },
            { label: 'CapEx to Operating Cash', value: '151%' },
            { label: 'Cash Flow Coverage', value: '0.97' },
            { label: 'Cash Conversion Change', value: '-3.21' },
            { label: 'Operating Ratio Change', value: '0.12' },
          ]
        },
        
        // 11 Sustainability Metrics
        {
          title: 'Sustainability Metrics',
          data: [
            { label: 'Free Cash Flow Margin', value: '26.7%' },
            { label: 'Cash Flow to Debt', value: '1.01' },
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

.cashflow {
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

