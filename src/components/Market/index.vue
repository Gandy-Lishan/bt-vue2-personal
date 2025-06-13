<template>
  <div class="layout">
    <header class="layout__header">
      <div v-if="!isSecDetailRoute"class="layout__header-left">
        <div class="layout__menu-toggle" @click="toggleSidebar">
          <i class="el-icon-menu"></i>
        </div>
        <div class="layout__logo">Meta Data</div>
      </div>
      <div v-else class="layout__header-left back">
				<router-link to="/market"><i class="el-icon-arrow-left"></i><span>Back to Meta Data</span></router-link>
			</div>
      <div class="layout__header-right">
        <!-- <search-bar placeholder="搜索行情..." /> -->
      </div>
    </header>

    <div class="layout__body">
      <!-- <aside
        v-if="!isSecDetailRoute"
        :class="['layout__sidebar', { 'layout__sidebar--collapsed': sidebarCollapsed }]"
      >
        <nav class="layout__nav">
          <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="layout__nav-item">
            <i :class="item.icon"></i>
            <span class="layout__nav-text">{{ item.label }}</span>
          </router-link>
        </nav>
      </aside> -->

      <main class="layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>
  
<script>
//import SearchBar from '@/components/common/SearchBar.vue';

export default {
  name: 'Layout',
  //components: { SearchBar },
  data() {
    return {
      sidebarCollapsed: false,
      menuItems: [
        { path: '/market-overview', label: 'Market Overview', icon: 'el-icon-data-analysis' },
        { path: '/equities', label: 'Equities', icon: 'el-icon-s-data' },
        { path: '/commodities', label: 'Commodities', icon: 'el-icon-s-goods' },
        { path: '/cryptocurrencies', label: 'Crypto Currencies', icon: 'el-icon-coin' },
        { path: '/crypto-funding-rates', label: 'Crypto Funding Rates', icon: 'el-icon-money' },
        { path: '/earnings-calendar', label: 'Earnings Calendar', icon: 'el-icon-date' },
        { path: '/economic-dashboard', label: 'Economic Dashboard', icon: 'el-icon-s-marketing' },
        { path: '/news-feed', label: 'News', icon: 'el-icon-news' }
      ],
      prevOverflow: '', // 存储滚动条状态
    };
  },
  computed: {
    isSecDetailRoute() {
      return this.$route.path.startsWith('/market/sec/');
    }
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
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }
};
</script>


<style scoped lang="scss" >
@import "@/components/Market/market.scss";
// ------------------------
// Market/index.vue 框架样式
// ------------------------

.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  // height: 827px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 $spacing-md;
    background-color: $color-bg-toolbar;
    color: $color-text-secondary;
    border-bottom: 1px solid $color-border-medium;
    box-shadow: 0 1px 4px rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;

    &-left {
      display: flex;
      align-items: center;
    }

    &-right {
      display: flex;
      align-items: center;
    }

    .back {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // margin: 30px 0px 20px 0px;
      font-size: 1.1rem;
      i {
        font-weight: bold;
      }
      a {
        color: $color-text-secondary;
        font-weight: bold;
        &:hover {
          color: $color-text-highlight;
        }
      }
    }
  }

  &__menu-toggle {
    margin-right: $spacing-md;
    cursor: pointer;
    font-size: 20px;
  }

  &__logo {
    font-size: 18px;
    font-weight: 500;
  }

  &__body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__sidebar {
    width: 220px;
    background-color: $color-bg-sidebar;
    border-right: 1px solid $color-border-medium;
    transition: width 0.3s;
    overflow-y: auto;

    &--collapsed {
      width: 64px;

      .layout__nav-text {
        display: none;
      }

      .layout__nav-item {
        justify-content: center;
      }
    }
  }

  &__nav {
    padding: $spacing-md 0;

    &-item {
      display: flex;
      align-items: center;
      padding: $spacing-sm $spacing-md;
      color: $color-text-secondary;
      transition: background-color 0.3s;
      text-decoration: none;

      i {
        margin-right: $spacing-sm;
        font-size: 18px;
      }

      &:hover {
        background-color: $color-bg-secondary;
      }

      &.router-link-active {
        color: $color-text-primary;
        background-color: $color-border-medium;
        font-weight: 500;
      }
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    background-color: $color-bg-primary;
  }
}

</style>
  