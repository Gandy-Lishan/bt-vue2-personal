<template>
  <div class="sec-layout">
    <!-- 左侧公司信息栏 -->
    <aside class="sec-layout__sidebar">
      <company-stats 
        :company-details="companyDetails"
        :trading-stats="tradingStats"
      />
    </aside>

    <!-- 右侧内容区域 -->
    <section class="sec-layout__main">
      <div class="sec-layout__header">
        <div class="sec-layout__header-heading heading">
          <img
            :src="`https://images.financialmodelingprep.com/symbol/${symbol}.png`"
            alt="symbol icon"
            class="sec-layout__symbol-icon"
          />
          {{ symbolHeading }}
        </div>
        <div class="sec-layout__header-details text--muted">
          <div>Industry: {{ symbolIndustry }}</div>
          <div>Exchange: {{symbolExchange }}</div>
          <div>Is ETF: {{ symbolIsETF }}</div>
          <div>Is Fund: {{ symbolIsFund }}</div>
        </div>
        <div class="spacing-md"></div>
        <div class="sec-layout__header-description">
          <ExpandableText :text="symbolDescription" :maxLines="2" />
        </div>
      </div>
      <!-- 子导航 -->
      <nav class="sec-layout__nav">
        <router-link v-for="tab in tabs" :key="tab.name" :to="`/market/sec/${symbol}/${tab.route}`"
          class="sec-layout__nav-item" active-class="sec-layout__nav-item--active">
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
import ExpandableText from '@/components/Market/components/ExpandableText.vue';
import CompanyStats from "@/components/Market/components/CompanyStats";
export default {
  name: 'SecLayout',
  components: { ExpandableText,CompanyStats },

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
        { name: 'Ownership', route: 'ownership' },
      ],

      // symbol header mock data
      symbolHeading: 'Apple Inc.(AAPL)',
      symbolDescription: `Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod. It also provides AppleCare support and cloud services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts, as well as advertising services include third-party licensing arrangements and its own advertising platforms. In addition, the company offers various subscription-based services, such as Apple Arcade, a game subscription service; Apple Fitness+, a personalized fitness service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was founded in 1976 and is headquartered in Cupertino, California.`,
      symbolIndustry: 'Consumer Electronic',
      symbolExchange: 'NASDAQ Global Select',
      symbolIsETF: 'No',
      symbolIsFund: 'No',

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
  overflow-y: auto;

  &__sidebar {
    position: sticky;
    top: 0;
    height: 100%;
    width: 280px;
    padding: $spacing-md;
    border-right: 1px solid $color-border-medium;
    background-color: $color-bg-sidebar;
    overflow-y: auto;
    box-sizing: border-box;
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

  &__header {
    color: $color-text-secondary;
    padding: $spacing-md;

    &-heading {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .sec-layout__symbol-icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
    }

    &-details {
      display: flex;
      flex-direction: row;
      gap: $spacing-md;
    }

    &-description {}

  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
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
    background-color: $color-bg-secondary;
    flex: 1;
  }
}

.sec-layout__header-description-wrapper {
  margin-top: $spacing-xs;
}

.sec-layout__header-description {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  font-size: 14px;
  line-height: 1.6;
  column-gap: $spacing-sm;

  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.expanded span {
    -webkit-line-clamp: unset;
    overflow: visible;
    white-space: normal;
  }
}

.sec-layout__header-toggle {
  background: none;
  border: none;
  color: $color-text-highlight;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  align-self: end;
}
</style>
