<template>
 <div class="portlet light" style="margin-top: 0px; padding-top: 5px; padding-bottom: 0px;">
   <div class="portlet-title">
     <div class="caption caption-md">
       <span class="caption-subject theme-font-color bold uppercase">
         Smart Money / Dumb Money Confidence
       </span>
       <form
         :action="getChartUrl('smart_dumb')"
         style="display:inline;float:right; margin-left:75px; margin-top:-5px;"
         method="get"
       >
         <button type="submit" class="btn grey-cascade">View larger chart</button>
       </form>
     </div>
   </div>
   <div class="portlet-body">
     <div class="row">
       <div class="col-md-12">
         <p>
           <a :href="getChartUrl('model_dumb_money')">Dumb Money Confidence</a> is
           <u>{{ dumbMoneyText }}</u>
           and
           <a :href="getChartUrl('model_smart_money')">Smart Money Confidence</a> is
           <u>{{ smartMoneyText }}</u>. This suggests an
           {{ smartVerbiage }} return of {{ smartDumbReturns.toFixed(1) }}% over the next 2 months.
         </p>
         <div id="charts" class="watermark" style="min-width: 400px; height: 500px;"></div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
export default {
 props: {
   dumbMoneyText: {
     type: String,
     required: true,
   },
   smartMoneyText: {
     type: String,
     required: true,
   },
   smartVerbiage: {
     type: String,
     required: true,
   },
   smartDumbReturns: {
     type: Number,
     required: true,
   },
 },
 methods: {
   getChartUrl(symbol) {
     return `/user/charts?symbol=${symbol}`;
   },
 },
};
</script>
<style lang="less" scoped>
@import "./index.less";
/* Add any custom styles if needed */
</style>