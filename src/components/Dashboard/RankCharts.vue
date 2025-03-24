<template>
 <div>
     <p>
       The Sector, Bonds, Countries, Commodities, and Currency names are links to the
       actual charts. Click any name in this rank chart and you'll be taken to the
       chart. <em>Note: The Industries and Stocks Rank charts are not hyperlinked</em>.
     </p>

     <div class="col-md-6">
       <h4>Sectors Ranked by Lowest-Highest Optimism Index</h4>
       <NewD3Chart chartClass="sector_chart" :data="dashBoardData.sector_chart_data" :dataUrl="dashBoardData.sector_chart" :middleValue="50" />
     </div>

     <div class="col-md-6">
       <h4>Sectors Ranked by Lowest-Highest Money Flow</h4>
       <NewD3Chart chartClass="sector_flow_chart" :data="dashBoardData.sector_flow_chart_data" :dataUrl="dashBoardData.sector_flow_chart" :middleValue="50" />
     </div>

     <div class="col-md-12">
       <hr />
     </div>

     <div class="col-md-6">
       <h4>Sectors Ranked by Oversold - Overbought Breadth</h4>
       <NewD3Chart chartClass="sector_breadth_chart" :data="dashBoardData.sector_breadth_chart_data" :dataUrl="dashBoardData.sector_breadth_chart" :middleValue="50" />
     </div>

     <div class="col-md-6">
       <h4>Bonds Ranked by Lowest-Highest Optimism Index</h4>
       <NewD3Chart chartClass="bond_bar" :data="dashBoardData.bond_bar_data" :dataUrl="dashBoardData.bond_bar" :middleValue="50" />
     </div>

     <div class="col-md-12">
       <hr />
     </div>

     <div class="col-md-6">
       <h4>Countries ranked by Lowest-Highest Optimism Index</h4>
       <NewD3Chart chartClass="country_chart" :data="dashBoardData.country_chart_data" :dataUrl="dashBoardData.country_chart" :middleValue="50" />
     </div>

     <div class="col-md-6">
       <h4>Countries ranked by Lowest-Highest Money Flow</h4>
       <NewD3Chart chartClass="country_flow_chart" :data="dashBoardData.country_flow_chart_data" :dataUrl="dashBoardData.country_flow_chart" :middleValue="50" />
     </div>

     <div class="col-md-12">
       <hr />
     </div>

     <div class="col-md-6">
       <h4>Commodities Ranked by Lowest-Highest Optimism Index</h4>
       <NewD3Chart chartClass="commods" :data="dashBoardData.commods_data" :dataUrl="dashBoardData.commods" :middleValue="50" />
     </div>

     <div class="col-md-6">
       <h4>Currencies Ranked by Lowest-Highest Optimism Index</h4>
       <NewD3Chart chartClass="currency" :data="dashBoardData.currency_data" :dataUrl="dashBoardData.currency" :middleValue="50" />
     </div>

     <div class="col-md-12">
       <hr />
     </div>

     <div class="col-md-6">
       <h4>Stocks Ranked by Lowest-Highest Optimism Index</h4>
       <NewD3Chart chartClass="stock_chart" :data="dashBoardData.stock_chart_data" :dataUrl="dashBoardData.stock_chart" :middleValue="50" />
     </div>
 </div>
</template>

<script>
import NewD3Chart from "./NewD3Chart";

export default {
props: {
  dashBoardData: {
    type: Object,
    required: true,
  }
 },
  components: {
    NewD3Chart
  },
 mounted() {
   // Initialize chart rendering
   this.renderCharts();
 },
 methods: {
   renderCharts() {
     this.renderSectorChart();
     this.renderSectorFlowChart();
     this.renderSectorBreadthChart();
     this.renderBondBar();
     this.renderCountryChart();
     this.renderCountryFlowChart();
     this.renderCommodsChart();
     this.renderCurrencyChart();
     this.renderStockChart();
   },
   renderSectorChart() {
     // Example: Render chart for sector_chart (use D3.js or Chart.js here)
     console.log("Render Sector Chart");
   },
   renderSectorFlowChart() {
     // Example: Render chart for sector_flow_chart (use D3.js or Chart.js here)
     console.log("Render Sector Flow Chart");
   },
   renderSectorBreadthChart() {
     // Example: Render chart for sector_breadth_chart (use D3.js or Chart.js here)
     console.log("Render Sector Breadth Chart");
   },
   renderBondBar() {
     // Example: Render chart for bond_bar (use D3.js or Chart.js here)
     console.log("Render Bond Bar");
   },
   renderCountryChart() {
     // Example: Render chart for country_chart (use D3.js or Chart.js here)
     console.log("Render Country Chart");
   },
   renderCountryFlowChart() {
     // Example: Render chart for country_flow_chart (use D3.js or Chart.js here)
     console.log("Render Country Flow Chart");
   },
   renderCommodsChart() {
     // Example: Render chart for commods (use D3.js or Chart.js here)
     console.log("Render Commodities Chart");
   },
   renderCurrencyChart() {
     // Example: Render chart for currency (use D3.js or Chart.js here)
     console.log("Render Currency Chart");
   },
   renderStockChart() {
     // Example: Render chart for stock_chart (use D3.js or Chart.js here)
     console.log("Render Stock Chart");
   }
 }
};
</script>

<style lang="less" scoped>
@import "./index.less";
.panel-body {
 padding: 20px;
}

.col-md-6,
.col-md-12 {
 margin-bottom: 15px;
}

h4 {
 font-weight: bold;
}

hr {
 border: 1px solid #ccc;
}

svg {
 width: 100%;
 height: 300px;
 border: 1px solid #ddd;
 border-radius: 5px;
}
</style>