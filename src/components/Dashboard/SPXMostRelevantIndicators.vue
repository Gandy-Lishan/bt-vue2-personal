<template>
 <div class="page-content-wrapper asset-correlation">
  <div class="table-title">
   <h4>S&P 500 Most Relevant Indicators </h4>
   <i class="updateDateText">Update Date: {{date}}</i>
  </div>
 <table>
   <thead>
     <tr>
         <th v-for="col in columns" :key="col">{{ colLabel[col] }}</th>
     </tr>
   </thead>
   <tbody>
     <tr v-for="(row, index) in data" :key="index" :class="{ stripe: index % 2 === 0 }">
         <td v-for="col in columns" :key="col">
          <a v-if="col === 'chart_name'" :href="getLink(row)" target="_blank" class="item-name primary-link">
           {{ row[col] }}
           </a>
           <span v-else>{{ row[col] }}</span>
         </td>
     </tr>
   </tbody>
 </table>
 </div>
</template>

<script>
import moment from "moment";

export default {
 name: 'AssetCorrelation',
 props: {
   data: Array
 },
 data() {
   return {
     fixedColumns: ['chart_name', 'latest_value', 'corr_kendall'],
     date: '',
     colLabel: {
      chart_name: 'Name',
      corr_kendall: 'Correlation',
      latest_value: 'Value'
     }
   }
 },
 async mounted() {
 },
 computed: {
   columns() {
     // 获取动态列名（排除固定列和额外固定列）
     debugger
     if((Array.isArray(this.data) && this.data.length === 0) || !this.data) return []
     // 按照接口返回的顺序排列动态列名
     this.date = moment.utc(this.data[0]?.last_updated_date).format('MM/DD/YYYY')
     return [...this.fixedColumns];
   }
 },
 methods: {
  getLink(item) {
    return  `/backtester/sr/setup?index=${'Unknown'}&indicator=${item.url}`
   },
 }
}
</script>

<style lang="less" scoped>
 table {
   width: 100%;
   border-collapse: collapse;
 }
 th, td {
   padding: 8px 10px;
   text-align: center;
   border-bottom: 1px solid #ddd;
   font-size: 14px;
   font-weight: 700;
 }
 th {
   // font-size: 14px;
 }
 .stripe {
   background-color: #f9f9f9;
 }
 .table-title {
  display: flex;
  border-bottom: 2px solid #eee;
  position: relative;
  font-size: 18px;
  line-height: 18px;
  font-weight: 600;
  color: #666;
  padding: 10px 0;
  i.updateDateText {
    position: absolute;
    right: 0px;
    bottom: 5px;
    font-size: 14px
}
 }

</style>