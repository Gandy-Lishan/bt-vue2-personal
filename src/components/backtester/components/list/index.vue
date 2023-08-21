<template>
  <Tabs :activeIndex="activeIndex" :mode="mode" :menuItems="menuItems" :handle-select="handleSelect"></Tabs>
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
      activeIndex: '1',
      mode: 'horizontal',
      menuItems: [
        {
          index: '1',
          lable: 'History'
        },
        {
          index: '2',
          lable: 'My Favorites'
        },
        {
          index: '3',
          lable: 'Sample Backtests'
        },
        {
          index: '4',
          lable: "Analysts' Backtest"
        }
      ]
    }
  },
  methods: {
    handleSelect(index) {
      let subUrl = null
      switch (index) {
        case '1':
          subUrl = 'history'
          break;
        case '2':
          subUrl = 'favorites'
          break;
        case '3':
          subUrl = 'sample'
          break;
        case '4':
          subUrl = 'analysts'
          break;
        default:
          subUrl = 'history'
          break;
      }
      const url = `/backtester/list/${subUrl}`
      this.$router.push(url)
    }
  }
}
</script>

<style lang="less" scoped>
</style>