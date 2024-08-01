<template>
  <Table
    :tableCol="tableCol"
    :currentPage="currentPage"
    :isExpandAll="isExpandAll"
    :loading="isListLoading"
  >
  </Table>
</template>

<script>
import Table from "../table"
export default {
  name: 'Analyst',
  components: {
    Table
  },
  data() {
    return {
      tableCol: [
        {
          label: 'Type',
          field: 'strategy',
          width: '80px'
        },
        {
          label: 'Name',
          field: 'name',
          width: '250px'
        },
        {
          label: 'Symbol',
          field: 'symbol',
          width: '100px'
        },
        {
          label: 'DesExpand',
          type: 'expand'
        },
        {
          label: 'Entry & Exit',
        },
        {
          label: 'Period',
          width: '90px'
        },
        {
          label: 'Timeframe',
          field: 'frequency',
          width: '120px'
        },
        {
          label: 'Total Trades',
          field: 'total_trader',
          width: '125px'
        },
        {
          label: 'Total Return',
          field: 'total_return',
          width: '125px'
        }
      ],
      isExpandAll: true,
      currentPage: 'Analyst',
    }
  },
  computed: {
    isListLoading() {
      // 从 Vuex store 中获取全局 loading 状态
      return this.$store.state.form.isListLoading
    },
  },
}
</script>

<style>

</style>