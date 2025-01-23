<template>
 <div class="portlet light" style="margin-top: 0px; padding-top:5px; padding-bottom: 0px;">
   <div class="portlet-title">
     <div class="caption caption-md">
       <span class="caption-subject theme-font-color bold uppercase">Risk Summary</span>
     </div>
   </div>
   <div class="portlet-body">
     <div class="row">
       <div class="col-md-6">
         <h4>Stocks Short-Term</h4>
         <a :href="getChartUrl('model_risk_stocks_short')">
           <img
             style="width: 250px"
             :src="`https://dnpgic06wp5lx.cloudfront.net/daily/${stocksShortRiskImage}`"
             alt="Stocks Short-Term"
           />
         </a>
       </div>
       <div class="col-md-6">
         <h4>Stocks Medium-Term</h4>
         <a :href="getChartUrl('model_risk_stocks_medium')">
           <img
             style="width: 250px"
             :src="`https://dnpgic06wp5lx.cloudfront.net/daily/${stocksMediumRiskImage}`"
             alt="Stocks Medium-Term"
           />
         </a>
       </div>
     </div>
     <div class="row">
       <div class="col-md-6">
         <h4>Bonds</h4>
         <a :href="getChartUrl('model_risk_bonds')">
           <img
             style="width: 250px"
             :src="`https://dnpgic06wp5lx.cloudfront.net/daily/${bondsRiskImage}`"
             alt="Bonds"
           />
         </a>
       </div>
       <div class="col-md-6">
         <h4>Crude Oil</h4>
         <a :href="getChartUrl('model_risk_oil')">
           <img
             style="width: 250px"
             :src="`https://dnpgic06wp5lx.cloudfront.net/daily/${oilRiskImage}`"
             alt="Crude Oil"
           />
         </a>
       </div>
     </div>
     <div class="row">
       <div class="col-md-6">
         <h4>Gold</h4>
         <a :href="getChartUrl('model_risk_gold')">
           <img
             style="width: 250px"
             :src="`https://dnpgic06wp5lx.cloudfront.net/daily/${goldRiskImage}`"
             alt="Gold"
           />
         </a>
       </div>
       <div class="col-md-6">
         <h4>Agriculture</h4>
         <a :href="getChartUrl('model_risk_ag')">
           <img
             style="width: 250px"
             :src="`https://dnpgic06wp5lx.cloudfront.net/daily/${agRiskImage}`"
             alt="Agriculture"
           />
         </a>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
export default {
  data() {
    return {
      stocksShortRiskImage: '',
      stocksMediumRiskImage: '',
      bondsRiskImage: '',
      oilRiskImage: '',
      goldRiskImage: '',
      agRiskImage: '',
    }
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