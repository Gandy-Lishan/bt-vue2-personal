<template>
  <div class="sec-layout">
    <!-- 左侧公司信息栏 -->
    <aside class="sec-layout__sidebar card">
      <div class="card__title">{{ symbol }} Info</div>
      <div class="divider" />
      <div class="card__content">
        <div class="grid">
          <div class="text--muted">Market Cap</div>
          <div class="text--highlight color--green">$3.5T</div>
          <!-- 可继续添加其他信息 -->
        </div>
      </div>
    </aside>

    <!-- 右侧内容区域 -->
    <section class="sec-layout__main">
      <div class="sec-layout__header">
        <div class="sec-layout__header-heading heading">{{ symbolHeading }}</div>
        <div class="sec-layout__header-details text--muted">
          <div>Industry: {{ 'Consumer Electronic' }}</div>
          <div>Exchange: {{ 'NASDAQ Global Select' }}</div>
          <div>Is ETF: {{ 'No' }}</div>
          <div>Is Fund: {{ 'No' }}</div>
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
export default {
  name: 'SecLayout',
  components: { ExpandableText },
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
      symbolHeading: 'Apple Inc.(AAPL)',
      symbolDescription: `Apple nc,desians,manuactures,and markets smartohone
Mac,a line of personalcomputers Pad, a lne of mul
Ty, Apple Watch, Beats products, and HomePod. t also provides AppleCare support and cloud services; and operates various platfoms,including the A.
purpose tablets: and wearables, home.
and accessories comprising AirPods.`,
    };
  },
  mounted() {

  },
  watch: {

  },
  methods: {

  }
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
  }

  &__header {
    color: $color-text-secondary;
    padding: $spacing-md;

    &-heading {}

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
    overflow: hidden;
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
    overflow-y: auto;
    background-color: $color-bg-primary;
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
