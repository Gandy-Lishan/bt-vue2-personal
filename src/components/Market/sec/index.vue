<template>
  <div class="sec-layout">
    <!-- 左侧公司信息栏 -->
    <aside class="sec-layout__sidebar card">
      <div class="card__content">
        <div class="grid">
          <!-- <div class="text--muted">Market Cap</div>
          <div class="text--highlight color--green">$3.5T</div> -->
          <company-stats 
            :company-details="companyDetails"
            :trading-stats="tradingStats"
          />
          <!-- 可继续添加其他信息 -->
        </div>
      </div>
    </aside>

    <!-- 右侧内容区域 -->
    <section class="sec-layout__main">
      <div class="sec-layout__title">
        <h1>{{symbolHeader}}</h1>
        <p>{{symbolDescription}}</p>
      </div>
      <!-- 子导航 -->
      <nav class="sec-layout__nav">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="`/market/sec/${symbol}/${tab.route}`"
          class="sec-layout__nav-item"
          active-class="sec-layout__nav-item--active"
        >
          <span class="sec-layout__nav-text">{{ tab.name }}</span>
        </router-link>
      </nav>

      <!-- 子页面内容 -->
      <div class="sec-layout__content">
        <router-view />
      </div>
    </section>
  </div>
</template>

<script>
import CompanyStats from "@/components/Market/components/CompanyStats";
export default {
  name: 'SecLayout',
  components: {
    CompanyStats
  },
  computed: {
    symbol() {
      return this.$route.params.symbolname;
    }
  },
  data() {
    return {
      tabs: [
        { name: 'Chart', route: 'chart' },
        { name: 'Analysts', route: 'analysts' },
        { name: 'Earnings', route: 'earnings' },
        { name: 'Financials', route: 'financials' },
        { name: 'News', route: 'news' },
      ],
      symbolHeader: 'Apple Inc.(AAPL)',
      symbolDescription: `Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.`,
      prevOverflow: '', // 存储滚动条状态

      // 新增虚拟数据
      companyDetails: [
        { label: 'Market Cap', value: '$2.85T' },
        { label: 'P/E Ratio', value: '29.45' },
        { label: 'P/B Ratio', value: '15.32' },
        { label: 'EV/Sales', value: '7.89' },
        { label: 'EV/EBITDA', value: '22.15' },
        { label: 'P/S Ratio', value: '6.78' },
        { label: 'Beta', value: '1.28' },
        { label: 'Return on Equity', value: '147.25%' },
        { label: 'ROIC', value: '172.63%' },
        { label: 'Current Ratio', value: '0.94' },
        { label: 'FCF Yield', value: '3.45%' },
        { label: 'Dividend Yield', value: '0.51%' }
      ],
      tradingStats: [
        { label: 'Price', value: '$175.84' },
        { label: 'Open', value: '$176.24' },
        { label: 'Previous Close', value: '$175.04' },
        { label: 'Day High', value: '$177.24' },
        { label: 'Day Low', value: '$174.93' },
        { label: '52W High', value: '$198.23' },
        { label: '52W Low', value: '$124.17' },
        { label: 'Volume', value: '52.34M' },
        { label: 'Avg Volume', value: '58.76M' },
        { label: 'ATR (14)', value: '$3.24' },
        { 
          label: '200MA Distance', 
          value: '-8.45%',
          isNegative: true
        },
        { label: 'Relative Volume', value: '0.89x' }
      ]
    };
  },
  mounted() {
    document.documentElement.classList.remove('scroll');
    this.prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';     // 如果是内联 style
  },
  unmounted() {
    //组件卸载时恢复 scroll，避免影响别的组件
    document.documentElement.style.overflow = this.prevOverflow;
  },
};
</script>

<style scoped lang="scss">
   @import "@/components/Market/market.scss";

.sec-layout {
  display: flex;
  height: 100%;

  &__sidebar {
    width: 280px;
    padding: $spacing-md;
    border-right: 1px solid $color-border-medium;
    background-color: $color-bg-sidebar;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      background-color: $color-bg-primary;
    }
    &::-webkit-scrollbar-thumb {
      background: $color-bg-toolbar;
      border-radius: 25px;
    }
  }

  &__title {
    color: $color-text-secondary;
    padding: $spacing-md;
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      background-color: $color-bg-primary;
    }
    &::-webkit-scrollbar-thumb {
      background: $color-bg-toolbar;
      border-radius: 25px;
    }
  }

  &__nav {
    display: flex;
    border-bottom: 1px solid $color-border-medium;
    padding: 0 $spacing-md;
    background-color: $color-bg-toolbar;
  }

  &__nav-item {
    padding: $spacing-sm $spacing-md;
    color: $color-text-secondary;
    text-decoration: none;
    font-weight: 500;

    &--active {
      color: $color-text-primary;
      border-bottom: 2px solid $color-text-highlight;
    }

    &:hover {
      color: $color-text-highlight;
    }
  }

  &__content {
    padding: $spacing-md;
    background-color: $color-bg-primary;
    flex: 1;
  }
}
</style>
