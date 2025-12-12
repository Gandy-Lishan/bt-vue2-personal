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
        :title="balanceSheetData['totalAssets'].title"
        :desc="balanceSheetData['totalAssets'].desc"
        :total-premium="balanceSheetData['totalAssets'].data.totalPremium"
        :isLoading="isLoading"
      />

      <SectorCard
        :title="balanceSheetData['fixedAssets'].title"
        :desc="balanceSheetData['fixedAssets'].desc"
        :total-premium="balanceSheetData['fixedAssets'].data.totalPremium"
        :isLoading="isLoading"
      />

      <SectorCard
        :title="balanceSheetData['totalLiabilities'].title"
        :desc="balanceSheetData['totalLiabilities'].desc"
        :total-premium="balanceSheetData['totalLiabilities'].data.totalPremium"
        :isLoading="isLoading"
      />

      <SectorCard
        :title="balanceSheetData['totalEquity'].title"
        :desc="balanceSheetData['totalEquity'].desc"
        :total-premium="balanceSheetData['totalEquity'].data.totalPremium"
        :isLoading="isLoading"
      />
    </div>
    <div v-if="category == 'assets'">
      <div class="grid-col-1">
        <!-- total-assets-trend & asset-composition -->
        <section class="card total-assets-trend">
          <h3 class="card__subtitle">
            {{ balanceSheetData['totalAssetsTrend'].title }}
            <el-tooltip v-if="balanceSheetData['totalAssetsTrend'].desc" effect="dark" placement="top">
              <span slot="content" v-html="balanceSheetData['totalAssetsTrend'].desc">
              </span>
              <i class="fa fa-question-circle right" aria-hidden="true"></i>
            </el-tooltip>
          </h3>
          <BarChart
            ref="totalAssetsTrend"
            :chartData="balanceSheetData['totalAssetsTrend'].data.chartData"
            :seriesConfigs="balanceSheetData['totalAssetsTrend'].data.seriesConfigs"
            titleText=""
            yAxisTitleText=""
            orientation="column"
            :enableExporting="false"
            legendPosition="topright"
            :show-legend="false"
            chartHeight="400px"
            :isLoading="isLoading"
          />
        </section>
      </div>
      <div class="grid-col-2">
        <!-- assets-current -->
        <section class="card assets-current">
          <div class="card__subtitle">{{ balanceSheetData['currentAssets'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['currentAssets'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </section>
        <section class="card assets-noncurrent">
          <div class="card__subtitle">{{ balanceSheetData['nonCurrentAssets'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['nonCurrentAssets'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </section>
      </div>
    </div>
    <div v-if="category == 'liabilitiesEquity'">
      <div class="grid-col-2">
        <!-- Liabilities Breakdown -->
        <section class="card lb">
          <h3 class="card__subtitle">
            {{ balanceSheetData['liabilitiesBreakdown'].title }}
            <el-tooltip v-if="balanceSheetData['liabilitiesBreakdown'].desc" effect="dark" placement="top">
              <span slot="content" v-html="balanceSheetData['liabilitiesBreakdown'].desc">
              </span>
              <i class="fa fa-question-circle right" aria-hidden="true"></i>
            </el-tooltip>
          </h3>
          <BarChart
            ref="lb"
            :chartData="balanceSheetData['liabilitiesBreakdown'].data.chartData"
            :seriesConfigs="balanceSheetData['liabilitiesBreakdown'].data.seriesConfigs"
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
        <section class="card shareholder">
          <h3 class="card__subtitle">
            {{ balanceSheetData['shareholdersEquityTrend'].title }}
            <el-tooltip v-if="balanceSheetData['shareholdersEquityTrend'].desc" effect="dark" placement="top">
              <span slot="content" v-html="balanceSheetData['shareholdersEquityTrend'].desc">
              </span>
              <i class="fa fa-question-circle right" aria-hidden="true"></i>
            </el-tooltip>
          </h3>
          <BarChart
            ref="shareholder"
            :chartData="balanceSheetData['shareholdersEquityTrend'].data.chartData"
            :seriesConfigs="balanceSheetData['shareholdersEquityTrend'].data.seriesConfigs"
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
      </div>
      <div class="grid-col-3">
        <section class="card liabilities-current">
          <div class="card__subtitle">{{ balanceSheetData['currentLiabilities'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['currentLiabilities'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </section>
        <section class="card liabilities-noncurrent">
          <div class="card__subtitle">{{ balanceSheetData['nonCurrentLiabilities'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['nonCurrentLiabilities'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </section>
        <section class="card shareholder-equity">
          <div class="card__subtitle">{{ balanceSheetData['stockholdersEquity'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['stockholdersEquity'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </section>
      </div>
    </div>
    <div v-if="category == 'keyRatios'">
      <div class="grid-col-1">
        <!-- Liabilities Breakdown -->
        <section class="card key-performance-metrics">
          <h3 class="card__subtitle">
            {{ balanceSheetData['keyPerformanceMetrics'].title }}
            <el-tooltip v-if="balanceSheetData['keyPerformanceMetrics'].desc" effect="dark" placement="top">
              <span slot="content" v-html="balanceSheetData['keyPerformanceMetrics'].desc">
              </span>
              <i class="fa fa-question-circle right" aria-hidden="true"></i>
            </el-tooltip>
          </h3>
          <BarChart
            ref="keyPerformanceMetrics"
            :chartData="balanceSheetData['keyPerformanceMetrics'].data.chartData"
            :seriesConfigs="balanceSheetData['keyPerformanceMetrics'].data.seriesConfigs"
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
      </div>
      <div class="grid-col-4">
        <section class="card" v-if="!hasZero(balanceSheetData['liquidityMetrics'].data)">
          <div class="card__subtitle">{{ balanceSheetData['liquidityMetrics'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['liquidityMetrics'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </section>
        <section class="card" v-if="!hasZero(balanceSheetData['assetManagement'].data)">
          <div class="card__subtitle">{{ balanceSheetData['assetManagement'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['assetManagement'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </section>
        <section class="card" v-if="!hasZero(balanceSheetData['capitalStructure'].data)">
          <div class="card__subtitle">{{ balanceSheetData['capitalStructure'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['capitalStructure'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
          />
        </section>
        <section class="card" v-if="!hasZero(balanceSheetData['growthAnalysis'].data)">
          <div class="card__subtitle">{{ balanceSheetData['growthAnalysis'].title }}</div>
          <base-table-simple
            :data="balanceSheetData['growthAnalysis'].data"
            :highlight-last-row="true"
            :isLoading="isLoading"
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
    ...mapActions("market/sec/balanceSheet", ["fetchBalanceSheet"]),
    fetchData() {
      this.fetchBalanceSheet({
        symbol: this.symbol,
        period: this.timeframe
      });
    },
    hasZero(data) {
      if (!Array.isArray(data)) return false;
      return data.some(row => ["0.00%", "0.00"].includes(row.value));
    }
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

