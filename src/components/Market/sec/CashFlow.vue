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
        :title="cashFlowData['operatingCashFlow'].title"
        :desc="cashFlowData['operatingCashFlow'].desc"
        :total-premium="cashFlowData['operatingCashFlow'].data.totalPremium"
        :isLoading="isLoading"
      />

      <SectorCard
        :title="cashFlowData['freeCashFlow'].title"
        :desc="cashFlowData['freeCashFlow'].desc"
        :total-premium="cashFlowData['freeCashFlow'].data.totalPremium"
        :isLoading="isLoading"
      />

      <SectorCard
        :title="cashFlowData['cashBalance'].title"
        :desc="cashFlowData['cashBalance'].desc"
        :total-premium="cashFlowData['cashBalance'].data.totalPremium"
        :isLoading="isLoading"
      />
    </div>
    <div class="grid-col-2">
      <!-- cash flow components & free cash flow trend -->
      <section class="card total-assets-trend">
        <h3 class="card__subtitle">
          {{ cashFlowData['cashFlowComponents'].title }}
          <el-tooltip v-if="cashFlowData['cashFlowComponents'].desc" effect="dark" placement="top">
            <span slot="content" v-html="cashFlowData['cashFlowComponents'].desc">
            </span>
            <i class="fa fa-question-circle right" aria-hidden="true"></i>
          </el-tooltip>
        </h3>
        <BarChart
          ref="totalAssetsTrend"
          :chartData="cashFlowData['cashFlowComponents'].data.chartData"
          :seriesConfigs="cashFlowData['cashFlowComponents'].data.seriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="bottomcenter"
          :show-legend="true"
          chartHeight="400px"
          :isLoading="isLoading"
        />
      </section>
      <section class="card asset-composition">
        <h3 class="card__subtitle">
          {{ cashFlowData['freeCashFlowTrend'].title }}
          <el-tooltip v-if="cashFlowData['freeCashFlowTrend'].desc" effect="dark" placement="top">
            <span slot="content" v-html="cashFlowData['freeCashFlowTrend'].desc">
            </span>
            <i class="fa fa-question-circle right" aria-hidden="true"></i>
          </el-tooltip>
        </h3>
        <BarChart
          ref="assetComposition"
          :chartData="cashFlowData['freeCashFlowTrend'].data.chartData"
          :seriesConfigs="cashFlowData['freeCashFlowTrend'].data.seriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="bottomcenter"
          :show-legend="false"
          chartHeight="400px"
          :isLoading="isLoading"
        />
      </section>
    </div>
      <!-- cash flow activities -->
      <section class="card">
        <div class="card__subtitle">
          Cash Flow Activities
        </div>
        <div class="grid-col-3">
          <base-table-simple
            :title="cashFlowData['operatingActivities'].title"
            :data="cashFlowData['operatingActivities'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
          <base-table-simple
            :title="cashFlowData['investingActivities'].title"
            :data="cashFlowData['investingActivities'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
          <base-table-simple
            :title="cashFlowData['financingActivities'].title"
            :data="cashFlowData['financingActivities'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </div>
        <div class="divider"></div>
        <base-table-simple
          :title="cashFlowData['summary'].title"
          :data="cashFlowData['summary'].data"
          :highlight-last-row="true"
          :transpose="true"
          :isLoading="isLoading"
        />
      </section>

      <div class="grid-col-3">
        <section class="card">
          <div class="card__subtitle">Efficiency Metrics</div>
          <base-table-simple
            :data="cashFlowData['efficiencyMetrics'].data"
            :highlight-last-row="false"
            :isLoading="isLoading"
          />
        </section>
        <section class="card">
          <div class="card__subtitle">Capital Allocation</div>
          <base-table-simple
            :data="cashFlowData['capitalAllocation'].data"
            :highlight-last-row="false"
            :isLoading="isLoading"
          />
        </section>
        <section class="card">
          <div class="card__subtitle">Sustainability Metrics</div>
          <base-table-simple
            :data="cashFlowData['sustainabilityMetrics'].data"
            :highlight-last-row="false"
            :isLoading="isLoading"
          />
        </section>
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
    ...mapGetters("market/sec/cashFlow", [
      "cashFlowData",
      "isLoading",
      "errorMessage",
    ]),
    symbol() {
      return this.$route.params.symbolname;
    }
  },
  watch: {
    timeframe: 'fetchData',
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol) {
        this.fetchData();
      }
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions("market/sec/cashFlow", ["fetchCashFlow"]),
    fetchData() {
      this.fetchCashFlow({
        symbol: this.symbol,
        period: this.timeframe
      });
    },
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

