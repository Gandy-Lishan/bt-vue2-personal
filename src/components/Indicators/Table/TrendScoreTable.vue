<template>
  <div class="trend-score-container page-content-wrapper" :class="{'enlarge-score-container': enlarged}">
   <div class="description" v-show="enlarged">
     <h4 style="margin: 10px 0;"><b>A Sector-by-Sector Examination of Trend Scores for S&P 500 Members</b></h4>
      <p>
       Relative to the S&P 500 and measured as a percentage of total sector stocks
       <el-button style="margin-left: 10px;" type="primary" size="small" @click="downloadCSV" title="download csv"><i class="el-icon-download"></i></el-button>
      </p>
   </div>
    <table class="threshold-table trend-score-table" :class="{'enlarge-table': enlarged}">
       <thead>
        <tr>
         <th width="180px" :class="getSortClass('index_name')" @click="sortTable('index_name')">Index/Sector</th>
         <th :class="getSortClass('ts_above_zero')" @click="sortTable('ts_above_zero')">Trend Score >=8</th>
         <th :class="getSortClass('ts_above_five')" @click="sortTable('ts_above_five')">Trend Score <=2</th>
         <th :class="getSortClass('ts_equal_ten')" @click="sortTable('ts_equal_ten')">Relative Score >=8</th>
         <th :class="getSortClass('rts_above_zero')" @click="sortTable('rts_above_zero')">Relative Score <=2</th>
         <th :class="getSortClass('rts_above_five')" @click="sortTable('rts_above_five')">Trend & Rel Score >=8</th>
         <th :class="getSortClass('rts_equal_ten')" @click="sortTable('rts_equal_ten')">Trend & Rel Score <=2</th>
         <th v-if="enlarged" :class="getSortClass('rts_equal_ten_spx')" @click="sortTable('rts_equal_ten_spx')">Relative Score >=8 in S&P 500</th>
         <th v-if="enlarged" width="100px" :class="getSortClass('last_date')" @click="sortTable('last_date')">Last Date</th>
        </tr>
       </thead>
       <tbody>
        <template v-for="(ele, index) in data">
         <tr :key="index">
          <template v-for="(key, keyIndex) in enlarged ? columns.concat(['rts_equal_ten_spx', 'last_date']) : columns">
           <td :key="keyIndex" :class="{'bold-td': key === 'index_name', 'odd': index % 2 === 1, 'even': index % 2 === 0}">
            {{ele[key] !== 'Communication Ser' ? `${ele[key]}${!['index_name', 'last_date'].includes(key) ? '%' : ''}` : 'Communication Service'}}
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

export default {
 name: 'TrendScoreTable',
 props: {
  enlarged: Boolean
 },
 data() {
  return {
   data: [],
   columns: ['index_name', 'ts_above_zero', 'ts_above_five', 'ts_equal_ten', 'rts_above_zero', 'rts_above_five', 'rts_equal_ten'],
   currentSortColumn: '',
  }
 },
 async mounted() {
  const res = await getSectorTrendScore()
  this.data =  res.data
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
        if (a[key] < b[key]) return isAsc ? -1 : 1;
        if (a[key] > b[key]) return isAsc ? 1 : -1;
        return 0;
      });
    },
    downloadCSV() {
      const xlsxName = 'Sector Summary'
      const _keySort = Array.from(Object.keys(this.data[0]))
      const renameMap = new Map([
        [`index_name`, 'Index/Sector'],
        [`ts_above_zero`, 'Trend Score >=8'],
        [`ts_above_five`, 'Trend Score <=2'],
        [`ts_equal_ten`, 'Relative Score >=8'],
        [`rts_above_zero`, 'Relative Score <=2'],
        [`rts_above_five`, 'Trend & Rel Score >=8'],
        [`rts_equal_ten`, 'Trend & Rel Score <=2'],
        [`rts_equal_ten_spx`, 'Relative Score >=8 in S&P 500'],
        [`last_date`, 'Date']
      ])
      let csvContent = this.data.map(row => _keySort.map(key => `${row[key]}${!['index_name', 'last_date'].includes(key) ? '%' : ''}`).join(',')).join('\n');
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