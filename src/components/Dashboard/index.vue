<template>
 <div class="dashboard">
    <div class="container">
      <!-- Flashed Messages -->
      <!-- <div class="row">
        <FlashedMessages />
      </div> -->

      <!-- Commentary and Charts -->
      <div class="row">
        <div class="col-md-5">
          <Commentary />
        </div>
        <div class="col-md-7">
          <SmartDumbChart />
          <MarketOverview />
        </div>
      </div>

      <!-- Overview Section -->
      <div class="row">
        <Overview />
      </div>
    </div>
 </div>
</template>

<script>
import FlashedMessages from "./FlashedMessages.vue";
import Commentary from "./Commentary.vue";
import SmartDumbChart from "./SmartDumbChart.vue";
import MarketOverview from "./MarketOverview.vue";
import Overview from "./Overview.vue";

export default {
 name: 'Dashboard',
 components: {
  FlashedMessages,
  Commentary,
  SmartDumbChart,
  MarketOverview,
  Overview
 },
 mounted() {
   // Equivalent to $(document).ready
   this.initializeChartPopups();
 },
 methods: {
   initializeChartPopups() {
     // Equivalent to chart_thumb_popup_non_dt functionality
     this.bindChartPopups("#phase-table a");

     // Handle chart rendering after "show-rank-charts" is clicked
     const showRankCharts = document.querySelector("#show-rank-charts");
     if (showRankCharts) {
       showRankCharts.addEventListener("click", () => {
         setTimeout(() => {
           this.bindChartPopups("#tab_ranks a", 0, 23); // Add offsets as per original logic
         }, 100);
       });
     }

     // Handle DataTable redraw events
     const dataTable = document.querySelector("table.dataTable");
     if (dataTable) {
       this.bindChartPopups("table.dataTable tbody tr");
       dataTable.addEventListener("draw.dt", () => {
         this.bindChartPopups("table.dataTable tbody tr");
       });
     }

     // Hide Highcharts credits
     const highchartsCredits = document.querySelector(".highcharts-credits");
     if (highchartsCredits) {
       highchartsCredits.style.display = "none";
     }
   },
   bindChartPopups(selector, offsetX = 0, offsetY = 0) {
     const elements = document.querySelectorAll(selector);
     elements.forEach((element) => {
       // Example popup binding logic, replace with your implementation
       element.addEventListener("mouseover", () => {
         // Show popup logic here
         console.log("Popup logic triggered for:", element, offsetX, offsetY);
       });
     });
   }
 }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>