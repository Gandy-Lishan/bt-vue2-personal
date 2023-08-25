<template>
  <Table
    :tableCol="tableCol"
    :currentPage="currentPage"
    :isExpandAll="isExpandAll"
  >
  </Table>
</template>

<script>
import Table from "../table"
export default {
  name: 'Sample',
  components: {
    Table
  },
  data() {
    return {
      tableCol: [
        {
          label: 'Name',
          field: 'name',
          width: '250px'
        },
        {
          label: 'Symbol',
          field: 'symbol',
          width: '70px'
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
      isExpandAll: true,
      currentPage: 'Sample',
    }
  },
}
</script>

<style>

</style>