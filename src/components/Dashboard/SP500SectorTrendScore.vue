<template>
  <div class="portlet light page-content-wrapper asset-correlation" style="margin-top: 0px; padding-top:5px; padding-bottom: 0px;">
   <div class="portlet-title relevant-portlet-title">
     <div class="caption caption-md">
       <span class="caption-subject theme-font-color bold uppercase">S&P 500 Sector Trend Score
       </span>
     </div>
   </div>
   <div class="portlet-body">
     <div class="row">
        <table>
          <thead>
            <tr>
                <th v-for="col in fixedColumns" :key="col" :class="getSortClass(col)" @click="sortTable(col)">{{ colLabel[col] }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data" :key="index" :class="{ stripe: index % 2 === 0 }">
                <td v-for="col in fixedColumns" :key="col">
                 <a v-if="col === 'index_name'" :href="`/sector_trend_score?index=${row['sector']}`" target="_blank" class="item-name primary-link">
                  {{ row[col] }}
                  </a>
                  <a v-else-if="col === 'constituent_trend_score'" :href="`/indicators?indicator=${row['sector']}_${col}`" target="_blank" class="item-name primary-link">
                    {{ row[col] }}
                  </a>
                  <span v-else>{{ row[col] }}</span>
                </td>
            </tr>
          </tbody>
        </table>
     </div>
   </div>
 </div>
</template>

<script>
import { getSectorTrendScore } from "@/service/service";
import moment from "moment";

export default {
 name: 'AssetCorrelation',
 data() {
   return {
     fixedColumns: ['index_name', 'constituent_trend_score'],
     date: '',
     colLabel: {
      index_name: 'Index/Sector',
      constituent_trend_score: 'Trend Score (Average)'
     },
   currentSortColumn: '',
   currentSortDirection: ''
   }
 },
 async mounted() {
  const res = await getSectorTrendScore()
  this.data =  res.data.map(item => {
    // 保留两位小数 toFixed 可能报错
    return item
  })
  this.currentSortColumn = 'constituent_trend_score'
  this.currentSortDirection = 'descending'
  this.sortTable('constituent_trend_score')
 },
 methods: {
  getLink(item) {
    return  `/backtester/sr/setup?index=${'Unknown'}&indicator=${item.url}`
   },
   getSortClass(column) {
      // 返回 class 用于改变图标和样式
      if (this.currentSortColumn === column) {
        return this.currentSortDirection === 'descending'
          ? 'sorting_asc'
          : 'sorting_desc';
      }
      return 'sorting';
    },
   sortTable(column) {
      // 如果点击的列和当前排序的列相同，切换排序方向
      if (this.currentSortColumn === column) {
        this.currentSortDirection =
          this.currentSortDirection === 'ascending' ? 'descending' : 'ascending';
      } else {
        // 如果点击的是新列，默认使用降序排序
        this.currentSortColumn = column;
        this.currentSortDirection = 'descending';
      }
      // 判断是否需要排序
      if (!this.currentSortColumn) return
      console.log('currentSortColumn', this.currentSortColumn)
      const key = this.currentSortColumn;
      if(key === 'index_name'){
        debugger
        if(this.currentSortDirection == 'ascending'){
          this.data.sort((a, b) => a[key].localeCompare(b[key], 'en', { sensitivity: 'base' }));
        }else if(this.currentSortDirection == 'descending'){
          this.data.sort((a, b) => b[key].localeCompare(a[key], 'en', { sensitivity: 'base' }));
        }
        return
      }
      this.data.sort((a, b) => {
        const key = this.currentSortColumn;                                                                                                                                                                                                                                                                                                                      
        const isAsc = this.currentSortDirection === 'descending';

        if(key === 'last_date') {
          if(!isAsc){
            this.data.sort((a,b) => {
              return new Date(b[key]) - new Date(a[key])
            })
          }else if(isAsc){
            this.data.sort((a,b) => {
              return new Date(a[key]) - new Date(b[key])
            })
          }else{
          }
        }
        if (parseFloat(a[key]) < parseFloat(b[key])) return isAsc ? -1 : 1;
        if (parseFloat(a[key]) > parseFloat(b[key])) return isAsc ? 1 : -1;
        return 0;
      });
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
  table thead .sorting, table thead .sorting_asc, table thead .sorting_desc, table thead .sorting_asc_disabled, table thead .sorting_desc_disabled {
    background-repeat: no-repeat;
    background-position: center right;
  }
  table thead .sorting {
    background-image: url("../../assets/sort_both.png");
  }
  table thead .sorting_desc {
    background-image: url('../../assets/sort_desc.png');
  }
  table thead .sorting_asc {
    background-image: url("../../assets/sort_asc.png");
  }
</style>