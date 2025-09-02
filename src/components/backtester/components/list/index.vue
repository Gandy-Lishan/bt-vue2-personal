<template>
  <Tabs :activeIndex="activeItem" :mode="mode" :menuItems="menuItems" :handle-select="handleSelect" id="scrollAnchor"></Tabs>
</template>

<script>
import { Tabs } from "@/components/common"
export default {
  name: 'List',
  components: {
    Tabs
  },
  data() {
    return {
      mode: 'horizontal',
      menuItems: [
        {
          index: 'history',
          lable: 'History'
        },
        {
          index: 'favorites',
          lable: 'My Favorites'
        },
        {
          index: 'sample',
          lable: 'Sample Backtests'
        },
        {
          index: 'analyst',
          lable: "Analysts' Backtests"
        },
        // {
        //   index: 'shared',
        //   lable: "Subscriber Shared Backtests"
        // }
      ]
    }
  },
  computed: {
    activeItem() {
      return this.$route.meta.activeItem;
    },
  },
  methods: {
    handleSelect(subUrl) {
      const url = `/backtester/list/${subUrl}`
      this.$router.push(url)
    }
  }
}
</script>

<style lang="less" scoped>
</style>