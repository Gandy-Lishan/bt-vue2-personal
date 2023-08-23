<template>
  <Table
    :tableCol="tableCol"
    :currentPage="currentPage"
  >
  </Table>
</template>

<script>
import Table from "../../table"
export default {
  name: 'History',
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
          label: 'Timeframe',
          field: 'frequency',
          width: '115px'
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
      currentPage: 'History',
    }
  },
}
</script>

<style>

</style>