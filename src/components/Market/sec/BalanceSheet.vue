<template>
    <div class="balance-sheet" v-loading="isLoading">
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
        :title="balanceSheetData[0].title"
        :region="balanceSheetData[0].data.region"
        :total-premium="balanceSheetData[0].data.totalPremium"
        :country-risk="balanceSheetData[0].data.countryRisk"
      />

      <SectorCard
        :title="balanceSheetData[1].title"
        :region="balanceSheetData[1].data.region"
        :total-premium="balanceSheetData[1].data.totalPremium"
        :country-risk="balanceSheetData[1].data.countryRisk"
      />

      <SectorCard
        :title="balanceSheetData[2].title"
        :region="balanceSheetData[2].data.region"
        :total-premium="balanceSheetData[2].data.totalPremium"
        :country-risk="balanceSheetData[2].data.countryRisk"
      />

      <SectorCard
        :title="balanceSheetData[3].title"
        :region="balanceSheetData[3].data.region"
        :total-premium="balanceSheetData[3].data.totalPremium"
        :country-risk="balanceSheetData[3].data.countryRisk"
      />
    </div>
    <div v-if="category == 'assets'">
      <div class="grid-col-1">
        <!-- total-assets-trend & asset-composition -->
        <section class="card total-assets-trend">
          <h3 class="card__subtitle">{{ balanceSheetData[4].title }}</h3>
          <BarChart
            ref="totalAssetsTrend"
            :chartData="balanceSheetData[4].data.chartData"
            :seriesConfigs="balanceSheetData[4].data.seriesConfigs"
            titleText=""
            yAxisTitleText=""
            orientation="column"
            :enableExporting="false"
            legendPosition="topright"
            :show-legend="false"
            chartHeight="400px"
            :loading="isLoading"
          />
        </section>
      </div>
      <div class="grid-col-2">
        <!-- assets-current -->
        <section class="card assets-current">
          <div class="card__subtitle">{{ balanceSheetData[5].title }}</div>
          <base-table-simple
            :data="balanceSheetData[5].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card assets-noncurrent">
          <div class="card__subtitle">{{ balanceSheetData[6].title }}</div>
          <base-table-simple
            :data="balanceSheetData[6].data"
            :highlight-last-row="true"
          />
        </section>
      </div>
    </div>
    <div v-if="category == 'liabilitiesEquity'">
      <div class="grid-col-2">
        <!-- Liabilities Breakdown -->
        <section class="card lb">
          <h3 class="card__subtitle">{{ balanceSheetData[7].title }}</h3>
          <BarChart
            ref="lb"
            :chartData="balanceSheetData[7].data.chartData"
            :seriesConfigs="balanceSheetData[7].data.seriesConfigs"
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
          <h3 class="card__subtitle">{{ balanceSheetData[8].title }}</h3>
          <BarChart
            ref="shareholder"
            :chartData="balanceSheetData[8].data.chartData"
            :seriesConfigs="balanceSheetData[8].data.seriesConfigs"
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
          <div class="card__subtitle">{{ balanceSheetData[9].title }}</div>
          <base-table-simple
            :data="balanceSheetData[9].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card liabilities-noncurrent">
          <div class="card__subtitle">{{ balanceSheetData[10].title }}</div>
          <base-table-simple
            :data="balanceSheetData[10].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card shareholder-equity">
          <div class="card__subtitle">{{ balanceSheetData[11].title }}</div>
          <base-table-simple
            :data="balanceSheetData[11].data"
            :highlight-last-row="true"
          />
        </section>
      </div>
    </div>
    <div v-if="category == 'keyRatios'">
      <div class="grid-col-1">
        <!-- Liabilities Breakdown -->
        <section class="card key-performance-metrics">
          <h3 class="card__subtitle">{{ balanceSheetData[12].title }}</h3>
          <BarChart
            ref="keyPerformanceMetrics"
            :chartData="balanceSheetData[12].data.chartData"
            :seriesConfigs="balanceSheetData[12].data.seriesConfigs"
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
          <div class="card__subtitle">{{ balanceSheetData[9].title }}</div>
          <base-table-simple
            :data="balanceSheetData[9].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card liabilities-noncurrent">
          <div class="card__subtitle">{{ balanceSheetData[10].title }}</div>
          <base-table-simple
            :data="balanceSheetData[10].data"
            :highlight-last-row="true"
          />
        </section>
        <section class="card shareholder-equity">
          <div class="card__subtitle">{{ balanceSheetData[11].title }}</div>
          <base-table-simple
            :data="balanceSheetData[11].data"
            :highlight-last-row="true"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
    ...mapGetters("market/sec/balanceSheet", [
      "balanceSheetData",
      "isLoading",
      "errorMessage",
    ]),
  },
  created() {
    this.fetchBalanceSheet();
  },
  methods: {
    ...mapActions("market/sec/balanceSheet", ["fetchBalanceSheet"]),
  },
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

