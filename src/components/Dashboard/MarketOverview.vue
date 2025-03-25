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
  props: {
    dashBoardData: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
    }
 },
 computed: {
  stocksShortRiskImage() {
    return this.dashBoardData.stocks_short_risk_image
  },
  stocksMediumRiskImage() {
    return this.dashBoardData.stocks_medium_risk_image
  },
  bondsRiskImage() {
    return this.dashBoardData.bonds_risk_image
  },
  oilRiskImage() {
    return this.dashBoardData.oil_risk_image
  },
  goldRiskImage() {
    return this.dashBoardData.gold_risk_image
  },
  agRiskImage() {
    return this.dashBoardData.ag_risk_image
  }
 },
 methods: {
   getChartUrl(symbol) {
     return `/backtester/sr/setup?index=${'Unknown'}&indicator=${symbol}`
   },
 },
};
</script>

<style lang="less" scoped>
@import "./index.less";
/* Add any custom styles if needed */
</style>