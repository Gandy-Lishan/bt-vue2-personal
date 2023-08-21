<template>
  <Tabs :activeIndex="activeIndex" :mode="mode" :menuItems="menuItems" :handle-select="handleSelect"></Tabs>
</template>

<script>
import { Tabs } from "@/components/common"
export default {
  name: 'SetUpResults',
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
          lable: 'Set Up'
        },
        {
          index: '2',
          lable: 'Results'
        }
      ]
    }
  },
  methods: {
    handleSelect(index) {
      const subUrl = index == '1' ? 'setup' : 'results'
      const url = `/backtester/sr/${subUrl}`
      this.$router.push(url)
    }
  }
}
</script>

<style lang="less" scoped>
</style>