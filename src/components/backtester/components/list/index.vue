<template>
  <Tabs :activeIndex="activeItem" :mode="mode" :menuItems="menuItems" :handle-select="handleSelect" id="scrollAnchor"></Tabs>
</template>

<script>
import { Tabs } from "@/components/common"
import { getCookieData } from "@/utils/cryptoUtils/cookie";

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
    openUserFunction() {
      const email = getCookieData()?.username
      const allowedUserList = ['jay@sentimentrader.com', 'dean@sentimentrader.com', 'jason@sentimentrader.com', 'hao@sentimentrader.com', 'jinjing@elixiroftechnology.com']
      return allowedUserList.includes(email)
		},
    canOnlyAccessPartOfReport() {
      const access_level = getCookieData()?.access_level
      return access_level.some(str => str.includes('reports')) || access_level.some(str => str.includes('corelite'))
    }
  },
  mounted() {
    console.log('openUserFunction', this.openUserFunction)
    if(this.canOnlyAccessPartOfReport) {
      this.menuItems = [
        {
          index: 'sample',
          lable: 'Sample Backtests'
        },
        {
          index: 'analyst',
          lable: "Analysts' Backtests"
        }
      ]
    }
    if(this.openUserFunction) {
      this.menuItems.push({
        index: 'shared',
        lable: "Subscriber Shared Backtests"
      })
    }
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