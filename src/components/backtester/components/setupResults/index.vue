<template>
  <Tabs :activeIndex="activeItem" :mode="mode" :menuItems="menuItems" :handle-select="handleSelect" id="scrollAnchor"></Tabs>
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
      mode: 'horizontal',
      menuItems: [
        {
          index: 'setup',
          lable: 'Set Up'
        },
        {
          index: 'results',
          lable: 'Results'
        }
      ]
    }
  },
  computed: {
    activeItem() {
      return this.$route.meta.activeItem
    }
  },
  methods: {
    handleSelect(subUrl) {
      const url = `/backtester/sr/${subUrl}`
      this.$router.push(url)
    }
  }
}
</script>

<style lang="less" scoped>
</style>