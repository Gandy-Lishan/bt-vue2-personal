<template>
 <div>
  <p>To view a larger version of this chart, <a
   href="#"> click here</a>.</p>
   <div class="col-md-12">
     <h4>About the Phase Table</h4>
     <p>The Phase Table shows sentiment regimes for major assets and ETFs. It is based on the level and trend of the Optimism Index for each market. Generally, markets with low and/or rising optimism (Phases 1 and 2) have the best chance for price gains. Markets with high and/or declining optimism (Phases 3 and 4) have a lower probability.</p>
     <p>The Phases are determined by the level and direction of the Optimism Index (10-day average for ETFs and 5-day average for futures)</p>
   </div>

   <div id="phase-table">
     <div class="row">
       <div class="col-sm-12 phase-table-columns">
         <div class="col-sm-3" v-for="(header, index) in phaseTableHeaders" :key="index">
           <div :class="['column-header', 'thumbnail', header[0], 'bg-font-red']">
             <div>{{ header[1] }}</div>
             <div>{{ header[2] }}</div>
             <div><small>{{ header[3] }}</small></div>
           </div>

           <div class="column-data">
             <table>
               <thead>
                 <tr>
                   <th>Market</th>
                   <th class="column-data-optix-header">Optix</th>
                 </tr>
               </thead>
               <tbody>
                 <!-- Empty row for spacing -->
                 <tr><td>&nbsp;</td><td></td></tr>
                 <tr v-for="(phaseSymbol, i) in phaseTableData[index]" :key="i">
                   <td :class="{'phase-grey': phaseSymbol[0]}">
                     <a :href="`/user/charts/${phaseSymbol[1]}`">
                       {{ phaseSymbol[3] }}
                     </a>
                   </td>
                   <td>{{ phaseSymbol[2] }}</td>
                 </tr>
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
export default {
 data() {
   return {
     phaseTableHeaders: [
       ["bg-green-jungle", "PHASE 1", "Extremely Low Optimism", "Watch for capitulatory action, reversals and a move into Phase 2"],
       ["bg-green-turquoise", "PHASE 2", "Rising but not High Optimism", "Watch for rising prices and a possible move into Phase 3"],
       ["bg-red-thunderbird", "PHASE 3", "Extremely High Optimism", "Watch for blow-off moves, reversals and a move into Phase 4"],
       ["bg-red-pink", "PHASE 4", "Falling but not Low Optimism", "Watch for falling prices and a possible move into Phase 1"],
     ],
     phaseTableData: [
       [
         [true, "marketA", "67", "Market A"],
         [false, "marketB", "4", "Market B"],
         [true, "marketC", "7", "Market C"],
         [false, "marketD", "2", "Market D"],
         [false, "marketE", "6", "Market E"],
       ],
       [
         [false, "marketA", "2", "Market A"],
         [true, "marketB", "3", "Market B"],
         [false, "marketC", "5", "Market C"],
         [false, "marketD", "4", "Market D"],
         [true, "marketE", "7", "Market E"],
       ],
       [
         [true, "marketA", "1", "Market A"],
         [false, "marketB", "2", "Market B"],
         [true, "marketC", "4", "Market C"],
         [false, "marketD", "5", "Market D"],
         [false, "marketE", "6", "Market E"],
       ],
       [
         [true, "marketA", "3", "Market A"],
         [true, "marketB", "1", "Market B"],
         [false, "marketC", "7", "Market C"],
         [true, "marketD", "4", "Market D"],
         [false, "marketE", "6", "Market E"],
       ],
       [
         [false, "marketA", "5", "Market A"],
         [true, "marketB", "6", "Market B"],
         [false, "marketC", "2", "Market C"],
         [true, "marketD", "3", "Market D"],
         [true, "marketE", "7", "Market E"],
       ]
     ]
   };
 },
};
</script>

<style lang="less" scoped>
@import "./index.less";

/* Your custom styles */
.column-header {
 background-color: #e6e6e6;
 padding: 10px;
 text-align: center;
}

.thumbnail {
 border-radius: 5px;
}

.column-data {
 padding: 10px;
}

.phase-grey {
 background-color: #e0e0e0;
}

.bg-font-red {
 color: #f00;
}

.bg-green-jungle {
 background-color: #1b6b34;
}

.bg-green-turquoise {
 background-color: #2bbf9c;
}

.bg-red-thunderbird {
 background-color: #d44a5b;
}

.bg-red-pink {
 background-color: #f5a5b4;
}
</style>