<template>
  <div class="portlet light page-content-wrapper asset-correlation" style="margin-top: 0px; padding-top:5px; padding-bottom: 0px;">
   <div class="portlet-title relevant-portlet-title">
     <div class="caption caption-md">
       <span class="caption-subject theme-font-color bold uppercase">S&P 500 Most correlated Indicators for last 3 months
        <el-tooltip  effect="dark" placement="top" style="word-wrap: break-word;display: inline">
          <span slot="content" v-html="titleTooltips">
          </span>
          <i class="iconfont icon-wenhao"></i>
         </el-tooltip>
       </span>
     </div>
   </div>
   <div class="portlet-body">
     <div class="row">
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
        <i class="updateDateText">Update Date: {{date}}</i>
     </div>
   </div>
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
     },
     titleTooltips: 'Displays the 5 indicators with the highest correlation to the S&P 500\'s daily returns, based on data from the last three months. <br/>This helps identify factors strongly associated with current S&P 500 price movements.'
   }
 },
 async mounted() {
 },
 computed: {
   columns() {
     // 获取动态列名（排除固定列和额外固定列）
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
@import "./index.less";
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
 i.updateDateText {
    // position: absolute;
    font-size: 12px;
    float: right;
    // bottom: 0px;
  }
</style>