<template>
    <div class="market">
      <aside class="market__sidebar">
        <nav class="market__nav">
          <ul class="market__nav-list">
            <li
              v-for="item in menuItems"
              :key="item.name"
              :class="['market__nav-item', { 'market__nav-item--active': isActive(item.path) }]"
              @click="goTo(item.path)"
            >
              {{ item.label }}
            </li>
          </ul>
        </nav>
      </aside>
  
      <section class="market__main">
        <div class="market__toolbar">
          <input class="market__search-input" placeholder="Search..." />
        </div>
        <div class="market__content">
          <router-view />
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Market',
    data() {
      return {
        menuItems: [
          { name: 'Overview', path: '/market/overview', label: 'Overview' },
          { name: 'TrendScore', path: '/market/trend_score', label: 'Trend Score' },
          { name: 'Sectors', path: '/market/sector_trend_score', label: 'Sector Trends' }
          // 可根据路由配置继续添加更多项
        ]
      };
    },
    methods: {
      isActive(path) {
        return this.$route.path === path;
      },
      goTo(path) {
        this.$router.push(path);
      }
    }
  };
  </script>

<style scoped lang="scss" >
 @import "./market.scss";
// ------------------------
// Market/index.vue 框架样式
// ------------------------

.market {
  display: flex;
  height: 100%;
  min-height: 800px;

  &__sidebar {
    width: 200px;
    background-color: $color-bg-sidebar;
    border-right: 1px solid $color-border-medium;
    padding: 16px 0;
  }

  &__nav {
    &-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &-item {
      padding: 12px 20px;
      color: $color-text-secondary;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: $color-bg-secondary;
      }

      &--active {
        background: $color-border-medium;
        font-weight: bold;
        color: $color-text-primary;
      }
    }
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__toolbar {
    position: sticky;
    top: 0;
    background-color: $color-bg-toolbar;
    padding: 12px 16px;
    z-index: 10;
    border-bottom: 1px solid $color-border-medium;
  }

  &__search-input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid $color-border-dark;
    background-color: darken($color-bg-primary, 5%);
    color: $color-text-primary;
  }

  &__content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }
}
</style>
  