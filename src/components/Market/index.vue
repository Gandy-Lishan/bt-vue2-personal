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
  
  <style lang="scss" src="./market.scss" />
  