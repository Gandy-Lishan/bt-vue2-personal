<template>
<div>
  <Table
    ref="BTTable"
    :tableCol="tableCol"
    :currentPage="currentPage"
    :isExpandAll="isExpandAll"
    :loading="isListLoading"
  >
  </Table>
  <FLGbg @refreshList="refreshList"></FLGbg>
</div>
</template>

<script>
import FLGbg from "@/components/common/FLSbg/FLGbackground.vue";
import Table from "../table"
export default {
  name: 'Favorites',
  components: {
    Table,
    FLGbg,
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
          label: 'Last Signal Date',
          field: 'last_entry_signal_date',
          width: '150px'
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
      isExpandAll: false,
      currentPage: 'Favorites',
    }
  },
  computed: {
    isListLoading() {
      // 从 Vuex store 中获取全局 loading 状态
      return this.$store.state.form.isListLoading
    },
  },
  methods: {
    async refreshList() {
      await this.$refs.BTTable.getDataList(null)
    }
  }
}
</script>

<style>

</style>