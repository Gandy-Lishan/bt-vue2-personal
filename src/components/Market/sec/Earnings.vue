<template>
  <div class="earnings">
    <h2 class="title">Earnings</h2>

    <div class="grid earnings__grid">
      <!-- 左侧条形图 -->
      <section class="card earnings__card trend-estimate">
        <h3 class="card__subtitle">
          EPS Trend & Estimates
          <el-tooltip effect="dark" placement="top">
            <span slot="content" v-html="trendEstimateContent">
            </span>
            <i class="fa fa-question-circle right" aria-hidden="true"></i>
          </el-tooltip>
        </h3>
        <BarChart
          :chart-data="EPSTrendEstimates"
          :series-configs="[
            { key: 'estimate', label: 'Estimate ESP', color: '#3b82f6' },
            { key: 'actual', label: 'Actual ESP', color: '#b3d8ff' }
          ]"
          title-text=""
          orientation="column"
          chart-height="auto"
          :enableExporting="false"
          :isLoading="isLoading"
        />
      </section>

      <!-- 右侧信息卡 -->
      <section class="sector-group grid-row-3">
        <SectorCard
            class="sector-ave-eps"
            :title="EarningsInfo[0]?.title"
            :desc="EarningsInfo[0]?.desc"
            :total-premium="EarningsInfo[0]?.totalPremium"
            :total-premium-color="EarningsInfo[0]?.totalPremiumColor"
            :isLoading="isLoading"
          />
          <SectorCard
            class="sector-ave-eps"
            :title="EarningsInfo[1]?.title"
            :desc="EarningsInfo[1]?.desc"
            :total-premium="EarningsInfo[1]?.totalPremium"
            :total-premium-color="EarningsInfo[1]?.totalPremiumColor"
            :isLoading="isLoading"
          />
          <SectorCard
            class="sector-ave-eps"
            :title="EarningsInfo[2]?.title"
            :desc="EarningsInfo[2]?.desc"
            :total-premium="EarningsInfo[2]?.totalPremium"
            :total-premium-color="EarningsInfo[2]?.totalPremiumColor"
            :isLoading="isLoading"
          />
      </section>

      <!-- 三列 -->
      <section v-loading="isLoading" class="card earnings__card eps-growth-rate">
        <h3 class="card__subtitle">
          EPS Growth Rate
          <el-tooltip effect="dark" placement="top">
            <span slot="content" v-html="EPSGrowthRateContent">
            </span>
            <i class="fa fa-question-circle right" aria-hidden="true"></i>
          </el-tooltip>
        </h3>
        <ESPGrowthChart :data="EPSGrowthRate" />
      </section>
      <section v-loading="isLoading" class="card earnings__card earnings-surprises">
        <h3 class="card__subtitle">
          Earnings Surprises
          <el-tooltip effect="dark" placement="top">
            <span slot="content" v-html="earningsSuprisesContent">
            </span>
            <i class="fa fa-question-circle right" aria-hidden="true"></i>
          </el-tooltip>
        </h3>
        <BarChart
          :chart-data="EarningSurprise"
          :series-configs="[
            { key: 'surprise', label: 'Estimate Surprise', color: '#4CAF50', positiveColor: '#4CAF50', negativeColor: '#D64A3B' }
          ]"
          title-text=""
          orientation="column"
          chartHeight="auto"
          :enableExporting="false"
          :show-legend="false"
          :isLoading="isLoading"
        />
      </section>
      <section v-loading="isLoading" class="card earnings__card revenue-surprises">
        <h3 class="card__subtitle">
          Revenue Surprises
          <el-tooltip effect="dark" placement="top">
            <span slot="content" v-html="revenueSuprisesContent">
            </span>
            <i class="fa fa-question-circle right" aria-hidden="true"></i>
          </el-tooltip>
        </h3>
        <BarChart
          :chart-data="RevenueSurprises"
          :series-configs="[
            { key: 'surprise', label: 'Estimate Surprise', color: '#4CAF50', positiveColor: '#4CAF50', negativeColor: '#D64A3B' }
          ]"
          title-text=""
          orientation="column"
          chart-height="auto"
          :enableExporting="false"
          :enablePositiveNegativeColors="true"
          :show-legend="false"
          :isLoading="isLoading"
        />
      </section>

      <!-- 一整行 -->
      <section v-loading="isLoading" class="card earnings__card earnings-history">
        <h3 class="subtitle">Earnings History</h3>
        <base-table
          :tableData="EarningHistory"
          :columns="EarningHistoryColumns"
          :loading="isLoading"
          tip-text=""
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </base-table>
      </section>
      <section class="card earnings__card upcoming-earnings">
        <h3 class="subtitle">Upcoming Earnings</h3>
        <base-table
          :tableData="UpcomingEarning"
          :columns="UpcomingEarningColumns"
          :loading="isLoading"
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
import { mapGetters, mapActions } from 'vuex';
import BaseTable from "@/components/Market/components/tables/BaseTable";
import BarChart from '@/components/Market/components/charts/BarChart.vue';
import SectorCard from '@/components/Market/components/sectorCard/SectorCard.vue';
import ESPGrowthChart from '@/components/Market/components/charts/stockChart/ESPGrowthChart.vue';
import { isObject } from '@/utils';

export default {
  name: 'Earnings',
  props: {
  },
  data() {
    return {
      EarningsInfo: [],
      EPSTrendEstimates: [],
      EarningSurprise: [],
      RevenueSurprises: [],
      EarningHistory: [],
      EarningHistoryColumns: [],
      UpcomingEarning: [],
      UpcomingEarningColumns: [],
      EPSGrowthRate: {
        yoy: [],
        qoq: []
      }
    }
  },
  components: {
    BaseTable,
    BarChart,
    SectorCard,
    ESPGrowthChart
  },
  computed: {
    ...mapGetters("market/sec/companyEarning", [
      "companyEarningData",
      "isLoading",
      "errorMessage",
    ]),
    symbol() {
      return this.$route.params.symbolname;
    },
    trendEstimateContent() {
      return `
        <h2>Estimate ESP</h2>
        <p><strong>Estimated Earnings Surprise Percentage</strong> refers to the difference between<br>
        an analyst's most recent forecast for a company's upcoming earnings report and<br>
        the prevailing consensus estimate. It attempts to predict the direction and<br>
        magnitude of the &quot;surprise&quot; between a company's actual earnings and market<br>
        expectations before the earnings report is released.</p>
        <br>
        <h2>Actual ESP</h2>
        <p><strong>Actual Earnings Surprise Percentage</strong> refers to the actual percentage difference<br>
        between a company's reported EPS or revenue and the &quot;market consensus<br>
        estimate.&quot; This is typically the percentage representation of the &quot;Surprise&quot;<br>
        mentioned above.</p>
      `;
    },
    EPSGrowthRateContent() {
      return `
        <p><strong>EPS Growth Rate</strong> measures the speed at which a company's Earnings Per Share (EPS) has<br>
           increased over different periods (e.g., year-over-year or quarter-over-quarter growth).</p>
      `;
    },
    earningsSuprisesContent() {
      return `
        <p>The <strong>Earnings Surprises</strong> chart typically displays the difference (or "surprise") between a company's<br> 
        actual EPS and analysts' estimated EPS over the past few quarters, often presented as a bar or <br>
        line chart. This chart clearly illustrates whether the company frequently beats or misses expectations, <br>
        as well as the magnitude of these surprises.</p>
      `;
    },
    revenueSuprisesContent() {
      return `
        <p>The <strong>Revenue Surprises</strong> chart displays the difference between a company's actual revenue and<br>
        analysts' estimated revenue over the past few quarters. Revenue forms the basis of profitability; <br>
        if a company consistently beats revenue expectations, it often signals an expanding market <br>
        share or strong demand for its products/services.</p>
      `;
    },
  },
  watch: {
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol) {
        this.fetchCompanyEarning(newSymbol);
      }
    },
    companyEarningData: {
      handler(newVal) {
        debugger
        if(isObject(newVal) && Object.keys(newVal).length > 0) {
          const {
            EarningsInfo, 
            EPSTrendEstimates, 
            EPSGrowthRate, 
            EarningSurprise, 
            RevenueSurprises, 
            EarningHistory, 
            EarningHistoryColumns, 
            UpcomingEarning, 
            UpcomingEarningColumns
          } = newVal
          this.EarningsInfo = EarningsInfo
          this.EPSTrendEstimates = EPSTrendEstimates
          this.EPSGrowthRate = EPSGrowthRate
          this.EarningSurprise = EarningSurprise
          this.RevenueSurprises = RevenueSurprises
          this.EarningHistory = EarningHistory
          this.EarningHistoryColumns = EarningHistoryColumns
          this.UpcomingEarning = UpcomingEarning
          this.UpcomingEarningColumns = UpcomingEarningColumns
        }
      },
      deep: true
    }
  },
  created() {
    this.fetchCompanyEarning(this.symbol);
  },
  methods: {
    ...mapActions("market/sec/companyEarning", ["fetchCompanyEarning"]),
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

