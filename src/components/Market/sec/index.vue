<template>
  <div class="sec-layout" v-loading="isLoading">
    <!-- 左侧公司信息栏 -->
    <aside class="sec-layout__sidebar">
      <company-stats 
        :company-details="companyProfileData?.companyDetails"
        :trading-stats="companyProfileData?.tradingStats"
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
          {{ companyProfileData?.profile?.companyName }}
        </div>
        <div class="sec-layout__header-details text--muted">
          <div>Industry: {{ companyProfileData?.profile?.industry }}</div>
          <div>Exchange: {{ companyProfileData?.profile?.exchange }}</div>
          <div>Is ETF: {{ companyProfileData?.profile?.isEtf }}</div>
          <div>Is Fund: {{ companyProfileData?.profile?.isFund }}</div>
        </div>
        <div class="spacing-md"></div>
        <div v-if="!isLoading" class="sec-layout__header-description">
          <ExpandableText :text="companyProfileData?.profile?.description" :maxLines="2" />
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
import { mapGetters, mapActions } from "vuex";
import ExpandableText from '@/components/Market/components/ExpandableText.vue';
import CompanyStats from "@/components/Market/components/CompanyStats";
export default {
  name: 'SecLayout',
  components: { ExpandableText,CompanyStats },

  computed: {
    symbol() {
      return this.$route.params.symbolname;
    },
    ...mapGetters("market/sec/companyProfile", [
      "companyProfileData",
      "isLoading",
      "errorMessage",
    ]),
  },
  watch: {
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol) {
        this.fetchCompanyProfile(newSymbol);
      }
    }
  },
  created() {
    this.fetchCompanyProfile(this.symbol);
  },
  data() {
    return {
      tabs: [
        { name: 'Chart', route: 'chart' },
        { name: 'Analysts', route: 'analysts' },
        { name: 'Earnings', route: 'earnings' },
        { name: 'Financials', route: 'financials' },
        { name: 'Balance Sheet', route: 'balancesheet' },
        { name: 'Cash Flow', route: 'cashflow' },
        { name: 'Ownership', route: 'ownership' },
        { name: 'News', route: 'news' },
        { name: 'SEC', route: 'sec' },
      ],
      prevOverflow: '', // 存储滚动条状态
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
  methods: {
    ...mapActions("market/sec/companyProfile", ["fetchCompanyProfile"]),
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
        width: 50px;
        // height: 24px;
        object-fit: contain;
        // scale:2;
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
