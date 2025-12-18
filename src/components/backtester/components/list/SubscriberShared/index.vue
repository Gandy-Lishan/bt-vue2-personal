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
 name: 'SubscriberShared',
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
        label: 'Shared Date',
        field: 'shared_date',
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
         labelHtml: 'Last Signal<br/>Date',
         field: 'last_entry_signal_date',
         width: '1100px'
       },
       {
          label: 'TOTAL TRADES',
          labelHtml: 'TOTAL<br/>TRADES',
          field: 'total_trader',
          width: '90px'
        },
        {
          label: 'TOTAL RETURN',
          labelHtml: 'TOTAL<br/>RETURN %',
          field: 'total_return',
          width: '90px'
        }
     ],
     isExpandAll: true,
     currentPage: 'SubscriberShared',
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