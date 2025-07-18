<template>
  <div class="trend-score-container page-content-wrapper" :class="{'enlarge-score-container': enlarged}">
   <div class="description" v-show="enlarged">
     <h4 style="margin: 10px 0;"><b>A Sector-by-Sector Examination of Trend Scores for S&P 500 Members {{`(${last_date})`}}</b></h4>
      <p>
       Relative to the S&P 500 and measured as a percentage of total sector stocks
       <el-button style="margin-left: 10px;" type="primary" size="small" @click="downloadCSV" title="download csv"><i class="el-icon-download"></i></el-button>
      </p>
   </div>
   <a href="https://www.espenet.com/blog/sector-trend-score-sp-500-members" target="_blank"></a>
    <table class="threshold-table trend-score-table" :class="{'enlarge-table': enlarged}">
       <thead>
        <tr>
         <th width="180px" :class="getSortClass('index_name')" @click="sortTable('index_name')">Index/Sector</th>
         <th :class="getSortClass('trend_above8_ratio')" @click="sortTable('trend_above8_ratio')">Trend Score >=8</th>
         <th :class="getSortClass('trend_below2_ratio')" @click="sortTable('trend_below2_ratio')">Trend Score <=2</th>
         <th :class="getSortClass('reltrend_above8_ratio')" @click="sortTable('reltrend_above8_ratio')">Relative Score >=8</th>
         <th :class="getSortClass('reltrend_below2_ratio')" @click="sortTable('reltrend_below2_ratio')">Relative Score <=2</th>
         <th :class="getSortClass('trend_and_reltrend_above8_ratio')" @click="sortTable('trend_and_reltrend_above8_ratio')">Trend & Rel Score >=8</th>
         <th :class="getSortClass('trend_and_reltrend_below2_ratio')" @click="sortTable('trend_and_reltrend_below2_ratio')">Trend & Rel Score <=2</th>
         <th :class="getSortClass('reltrend_above8_spx_ratio')" @click="sortTable('reltrend_above8_spx_ratio')">Relative Score >=8 in S&P 500</th>
         <th :class="getSortClass('constituent_trend_score')" @click="sortTable('constituent_trend_score')">Trend Score (Average)</th>
         <th :class="getSortClass('pct_rank_10_gte_80')" @click="sortTable('pct_rank_10_gte_80')">10-Day RSRR >= 80%</th>
         <th :class="getSortClass('pct_rank_10_lte_20')" @click="sortTable('pct_rank_10_lte_20')">10-Day RSRR <= 20%</th>
         <th :class="getSortClass('pct_rank_42_gte_80')" @click="sortTable('pct_rank_42_gte_80')">42-Day RSRR >= 80%</th>
         <th :class="getSortClass('pct_rank_42_lte_20')" @click="sortTable('pct_rank_42_lte_20')">42-Day RSRR <= 20%</th>
         <th :class="getSortClass('pct_rank_126_gte_80')" @click="sortTable('pct_rank_126_gte_80')">126-Day RSRR >= 80%</th>
         <th :class="getSortClass('pct_rank_126_lte_20')" @click="sortTable('pct_rank_126_lte_20')">126-Day RSRR <= 20%</th>
         <!-- <th width="100px" :class="getSortClass('last_date')" @click="sortTable('last_date')">Last Date</th> -->
        </tr>
       </thead>
       <tbody>
        <template v-for="(ele, index) in data">
         <tr :key="index">
          <template v-for="(key, keyIndex) in columns">
           <td :key="keyIndex" :class="{'bold-td': key === 'index_name', 'odd': index % 2 === 1, 'even': index % 2 === 0}">
              <a v-if="key === 'index_name'" :href="`/sector_trend_score?index=${ele['sector']}`">{{ ele[key] }}</a> 
              <!-- <span v-else-if="key === 'last_date'">{{ ele[key] }}</span> -->

              <a v-else-if="key === 'constituent_trend_score'" :href="`/indicators?indicator=${ele['sector']}_${key}`">{{ ele[key] }}</a> 

              <a v-else :href="`/indicators?indicator=${ele['sector']}_${key}`">{{ ele[key] }}</a>

           </td>
          </template>
         </tr>
        </template>
       </tbody>
      </table>
  </div>
</template>

<script>
import { getSectorTrendScore } from "@/service/service";
import { formatNumber } from "@/utils";

export default {
 name: 'TrendScoreTable',
 props: {
  enlarged: Boolean
 },
 data() {
  return {
   data: [],
   /*
   其中对应现在展示的列的字段名为：
    Trend Score >=8 ： trend_above8_ratio
    Trend Score <=2： trend_below2_ratio
    Relative Score >=8： reltrend_above8_ratio
    Relative Score <=2： reltrend_below2_ratio
    Trend & Rel Score >=8： trend_and_reltrend_above8_ratio
    Trend & Rel Score <=2： trend_and_reltrend_below2_ratio
    Relative Score >=8 in S&P 500： reltrend_above8_spx_ratio
    然后再新增七列，展示名字和字段对应关系为：
    Trend Score (Average)：constituent_trend_score
    10-Day RSRR >= 80%：pct_rank_10_gte_80
    10-Day RSRR <= 20%：pct_rank_10_lte_20
    126-Day RSRR >= 80%：pct_rank_126_gte_80
    126-Day RSRR <= 20%：pct_rank_126_lte_20
    42-Day RSRR >= 80%：pct_rank_42_gte_80
    42-Day RSRR <= 20%：pct_rank_42_lte_20
    */
   columns: [
    'index_name', 
    'trend_above8_ratio', 
    'trend_below2_ratio', 
    'reltrend_above8_ratio', 
    'reltrend_below2_ratio', 
    'trend_and_reltrend_above8_ratio', 
    'trend_and_reltrend_below2_ratio',
    'reltrend_above8_spx_ratio',
    'constituent_trend_score',
    'pct_rank_10_gte_80',
    'pct_rank_10_lte_20',
    'pct_rank_42_gte_80',
    'pct_rank_42_lte_20',
    'pct_rank_126_gte_80',
    'pct_rank_126_lte_20',
    // 'last_date'
  ],
   currentSortColumn: '',
   last_date: ''
  }
 },
 async mounted() {
  const res = await getSectorTrendScore()
  this.data =  res.data.map(item => {
    // 保留两位小数 toFixed 可能报错
    const columns = this.columns.filter(col => col !== 'index_name' && col !== 'last_date')
    columns.forEach(col => {
      if(col === 'constituent_trend_score') {
        item[col] = formatNumber(item[col])
      }else{
        item[col] = formatNumber(item[col], 'customSign', '%')
      }
    })
    return item
  })
  this.last_date = res.data[0].last_date
  this.$emit('trendScoreTableDate', this.last_date)
  // columns 默认使用 average 排序
  this.currentSortColumn = 'constituent_trend_score'
  this.currentSortDirection = 'descending'
  this.sortTable('constituent_trend_score')
 },
 methods: {
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
    downloadCSV() {
      const xlsxName = 'Sector Summary'
      const _keySort = this.columns
      const renameMap = new Map([
        [`index_name`, 'Index/Sector'],
        [`trend_above8_ratio`, 'Trend Score >=8'],
        [`trend_below2_ratio`, 'Trend Score <=2'],
        [`reltrend_above8_ratio`, 'Relative Score >=8'],
        [`reltrend_below2_ratio`, 'Relative Score <=2'],
        [`trend_and_reltrend_above8_ratio`, 'Trend & Rel Score >=8'],
        [`trend_and_reltrend_below2_ratio`, 'Trend & Rel Score <=2'],
        [`reltrend_above8_spx_ratio`, 'Relative Score >=8 in S&P 500'],
        [`constituent_trend_score`, 'Trend Score (Average)'],
        [`pct_rank_10_gte_80`, '10-Day RSRR >= 80%'],
        [`pct_rank_10_lte_20`, '10-Day RSRR <= 20%'],
        [`pct_rank_126_gte_80`, '126-Day RSRR >= 80%'],
        [`pct_rank_126_lte_20`, '126-Day RSRR <= 20%'],
        [`pct_rank_42_gte_80`, '42-Day RSRR >= 80%'],
        [`pct_rank_42_lte_20`, '42-Day RSRR <= 20%'],
        // [`last_date`, 'Date']
      ])
      let csvContent = this.data.map(row => _keySort.map(key => `${row[key]}`).join(',')).join('\n');
      _keySort.forEach(key => {
        if(renameMap.has(key)) {
          _keySort[_keySort.indexOf(key)] = renameMap.get(key)
        }
      })
      csvContent = `${_keySort.join(',')}\n${csvContent}`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${xlsxName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
 }
}
</script>

<style lang="less" scoped>
.trend-score-container {
 .description {
  margin-bottom: 1rem;
 }
 .threshold-table {
  width: 100%;
 }
}
.enlarge-score-container {
 height: 800px;
}
.enlarge-table {
  height: 600px;
}
table.trend-score-table thead .sorting, table.trend-score-table thead .sorting_asc, table.trend-score-table thead .sorting_desc, table.trend-score-table thead .sorting_asc_disabled, table.trend-score-table thead .sorting_desc_disabled {
  background-repeat: no-repeat;
  background-position: center right;
}
table.trend-score-table thead .sorting, table.trend-score-table thead .sorting_asc, table.trend-score-table thead .sorting_desc {
  cursor: pointer;
}
table.trend-score-table thead .sorting {
    background-image: url("../../../assets/sort_both.png");
}
table.trend-score-table thead .sorting_desc {
  background-image: url('../../../assets/sort_desc.png');
}
table.trend-score-table thead .sorting_asc {
    background-image: url("../../../assets/sort_asc.png");
}
</style>