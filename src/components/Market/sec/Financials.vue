<template>
  <div class="financials">
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
    <div class="grid-col-3">
      <section class="card financials__card">
        <div class="card__subtitle">Margin Analysis</div>
        <base-table-simple
          :data="financialsData['marginAnalysis'].data"
          :highlight-last-row="false"
          :isLoading="isLoading"
        />
      </section>
      <section class="card financials__card">
        <div class="card__subtitle">Earnings Surprises</div>
        <base-table-simple
          :data="financialsData['earningsSurprises'].data"
          :highlight-last-row="false"
          :isLoading="isLoading"
        />
      </section>
      <section class="card financials__card">
        <div class="card__subtitle">Financial Scores</div>
        <base-table-simple
          :data="financialsData['financialScores'].data"
          :highlight-last-row="false"
          :isLoading="isLoading"
        />
      </section>
    </div>
    <section class="card financials__card">
      <h3 class="card__subtitle">Financial Trends</h3>
      <button-group 
        class="btn-group"
        v-model="trendsOption" 
        :options="[
          { label: 'Revenue', value: 'revenue' },
          { label: 'Gross Profit', value: 'grossProfit' },
          { label: 'Operating', value: 'operating' },
          { label: 'Net Income', value: 'netIncome' },
          { label: 'EBITDA', value: 'ebitda' },
        ]" 
        backgroundColor="#e7e7e7" 
        :enableTransition="true" 
      />
      <BarChart
        :chartData="financialsData[trendsOption].data.chartData"
        :seriesConfigs="financialsData[trendsOption].data.seriesConfigs"
        titleText=""
        yAxisTitleText=""
        orientation="column"
        :enableExporting="false"
        legendPosition="topright"
        chartHeight="400px"
        :isLoading="isLoading"
      />
      <!-- 預留sector card -->
      <div class="divider"></div>
      <div class="grid-col-3">
      <SectorCard
        :title="financialsData['financialsTrendInfo'][trendsOption].title"
        :desc="financialsData[trendsOption].desc"
        :total-premium="financialsData['financialsTrendInfo'][trendsOption].current"
        :isLoading="isLoading"
        :disable-border="true"
        :center="true"
      />

      <SectorCard
        title="YoY Growth"
        desc="Year-over-Year (YoY) Growth refers to the percentage increase in current period operating<br /> revenue compared to the operating revenue from the same period last year.<br /><br />This is a dynamic indicator that reflects the growth rate of a company's operating revenue.<br /> Positive growth indicates business expansion, while a high growth rate signifies strong<br /> momentum, which is typically viewed favorably by the market."
        :total-premium="financialsData['financialsTrendInfo'][trendsOption].yoy"
        :total-premium-color="financialsData['financialsTrendInfo'][trendsOption].yoyColor"
        :isLoading="isLoading"
        :disable-border="true"
        :center="true"
      />

      <SectorCard
        title="% of Revenue"
        desc="Operating Income Margin refers to the percentage of operating income relative to total<br /> revenue (or sales).<br /><br />This ratio reflects a company's efficiency in controlling operating costs while generating<br /> revenue. A higher percentage means the company is earning more operating profit from each<br /> unit of revenue, demonstrating stronger core business profitability."
        :total-premium="financialsData['financialsTrendInfo'][trendsOption].ratio"
        :isLoading="isLoading"
        :disable-border="true"
        :center="true"
      />
    </div>
    </section>
    <div class="grid-col-2">
      <section class="card financials__card">
        <div class="card__subtitle">{{ financialsData['incomeMetics'].title }}</div>
        <BarChart
          :chartData="financialsData['incomeMetics'].data.chartData"
          :seriesConfigs="financialsData['incomeMetics'].data.seriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="bottomcenter"
          chartHeight="400px"
          :isLoading="isLoading"
        />
      </section>
      <section class="card financials__card">
        <div class="card__subtitle">
          {{ financialsData['cashDebt'].title }}
          <el-tooltip v-if="financialsData['cashDebt'].desc" effect="dark" placement="top">
            <span slot="content" v-html="financialsData['cashDebt'].desc">
            </span>
            <i class="iconfont icon-wenhao" style="font-size: 18px;font-weight: 300;"></i>
          </el-tooltip>
        </div>
        <BarChart
          :chartData="financialsData['cashDebt'].data.chartData"
          :seriesConfigs="financialsData['cashDebt'].data.seriesConfigs"
          titleText=""
          yAxisTitleText=""
          orientation="column"
          :enableExporting="false"
          legendPosition="bottomcenter"
          chartHeight="400px"
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
  name: 'Financials',
  data() {
    return {
      timeframe: 'annual',

      // trends mockdata
      trendsOption: 'revenue',
    }
  },
  components: {
    BaseTableSimple,
    BarChart,
    SectorCard,
    ButtonGroup,
  },
  computed: {
    ...mapGetters("market/sec/financials", [
      "financialsData",
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
    },
  },
  created() {
    this.fetchData();
    // console.log(financialsData)
  },
  methods: {
    ...mapActions("market/sec/financials", ["fetchFinancials"]),
    fetchData() {
      this.fetchFinancials({
        symbol: this.symbol,
        period: this.timeframe
      });
    },
    
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

.financials {
  margin: 0 auto;
  &__card {
    padding: 24px;

    position: relative; //爲了讓btn group position absolute顯示
  }
}

.btn-group {
  position: absolute !important;
  top: 80px;
}

@media (max-width: 768px) {
  .financials {
    &__card {
      padding: 16px;
    }
  }
}
</style>
