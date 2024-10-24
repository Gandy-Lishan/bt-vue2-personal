<template>
  <div class="trend-score-container page-content-wrapper" :class="{'enlarge-table': enlarged}">
   <div class="description" v-show="enlarged">
     <h4 style="margin: 10px 0;"><b>A Sector-by-Sector Examination of Trend Scores for S&P 500 Members</b></h4>
      <p>
       Relative to the s&p 500 and measured as a percentage of total sector stocks
      </p>
   </div>
    <table class="threshold-table trend-score-table">
       <thead>
        <tr>
         <th width="180px">Index/Sector</th>
         <th>Trend Score Equal to 0</th>
         <th>Trend Score Above 5</th>
         <th>Trend Score Above to 10</th>
         <th>Relative Score Equal to 0</th>
         <th>Relative Score Above 5</th>
         <th>Relative Score Equal to 10</th>
        </tr>
       </thead>
       <tbody>
        <template v-for="(ele, index) in data">
         <tr :key="index">
          <template v-for="(key, keyIndex) in ['index_name', 'ts_above_zero', 'ts_above_five', 'ts_equal_ten', 'rts_above_zero', 'rts_above_five', 'rts_equal_ten']">
           <td :key="keyIndex" :class="{'bold-td': key === 'index_name', 'odd': index % 2 === 1, 'even': index % 2 === 0}">
            {{ele[key] !== 'Communication Ser' ? ele[key] : 'Communication Service'}}
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
   data: []
  }
 },
 async mounted() {
  const res = await getSectorTrendScore()
  this.data =  res.data
 }
}
</script>

<style lang="less" scoped>
.trend-score-container {
 .description {
  margin-bottom: 1rem;
 }
 height: 400px;
}
.enlarge-table {
 height: 700px;
}
</style>