<template>
 <div class="dashboard">
    <div v-if="isMyDashboardPanel" class="dashboard-panel dashboard-panel-my">
      <div class="dashboard-switch-banner">
        <div class="dashboard-switch-copy">
          <strong>You are viewing My Dashboard.</strong>
          <span>Return to the classic Dashboard panel when needed.</span>
        </div>
        <button class="dashboard-switch-btn" type="button" @click="switchToClassicDashboard">
          Back to Classic Dashboard
        </button>
      </div>
      <NewDashboard />
    </div>

    <div v-else class="container">
      <div class="dashboard-switch-banner">
        <div class="dashboard-switch-copy">
          <strong>Want a quick view of your saved research?</strong>
          <span>Switch to My Dashboard to review your created signals, custom indicators, favorite indicators, and watchlists.</span>
        </div>
        <button class="dashboard-switch-btn" type="button" @click="switchToMyDashboard">
          Switch to My Dashboard
        </button>
      </div>
      <!-- Flashed Messages -->
      <!-- <div class="row">
        <FlashedMessages />
      </div> -->

      <!-- Commentary and Charts -->
      <div class="row">
        <div class="col-md-5">
          <Commentary :dashBoardData="dashBoardData"/>
        </div>
        <div class="col-md-7">
          <SmartDumbChart :dashBoardData="dashBoardData"/>
          <MarketOverview :dashBoardData="dashBoardData"/>
          <SPXMostRelevantIndicators :data="mostRelevantIndicatorsData" />
          <SP500SectorTrendScore />
        </div>
      </div>

      <!-- Overview Section -->
      <div class="row">
        <Overview :dashBoardData="dashBoardData"/>
      </div>
      <AboutUs></AboutUs>
    </div>
 </div>
</template>

<script>
import FlashedMessages from "./FlashedMessages.vue";
import Commentary from "./Commentary.vue";
import SmartDumbChart from "./SmartDumbChart.vue";
import MarketOverview from "./MarketOverview.vue";
import Overview from "./Overview.vue";
import { getDashboardData, getSPXMostRelevantIndicators } from "@/service/service";
import { isJson, trimTrailingZeros } from "@/utils";
import AboutUs from "@/components/Indicators/Table/AboutUs.vue";
import SPXMostRelevantIndicators from "./SPXMostRelevantIndicators.vue"
import SP500SectorTrendScore from "./SP500SectorTrendScore.vue"
import NewDashboard from "@/components/NewDashboard/index.vue";

export default {
 name: 'Dashboard',
 components: {
  FlashedMessages,
  Commentary,
  SmartDumbChart,
  MarketOverview,
  Overview,
  AboutUs,
  SPXMostRelevantIndicators,
  SP500SectorTrendScore,
  NewDashboard
 },
 data() {
  return {
    dashboardPanel: this.$route && this.$route.query && this.$route.query.panel === 'my' ? 'my' : 'classic',
    classicDashboardLoaded: false,
    dashBoardData: {},
    mostRelevantIndicatorsData: []
  }
 },
 computed: {
  isMyDashboardPanel() {
    return this.dashboardPanel === 'my'
  },
  dashBoardChartData() {
    return this.dashBoardData.data
  },
 },
 watch: {
  '$route.query.panel'(panel) {
    const nextPanel = panel === 'my' ? 'my' : 'classic'
    if (nextPanel === this.dashboardPanel) return
    this.dashboardPanel = nextPanel
    if (nextPanel === 'classic') this.loadClassicDashboard()
  }
 },
 async mounted() {
   if (!this.isMyDashboardPanel) await this.loadClassicDashboard()
 },
 methods: {
   async loadClassicDashboard() {
     if (!this.classicDashboardLoaded) {
       await this.getDashboardData()
       let {data} = await getSPXMostRelevantIndicators()
       data = data.map(item => {
        item.latest_value = item.latest_value.toFixed(2)
        item.corr_kendall = item.corr_kendall.toFixed(2)
        return item
       })
       this.mostRelevantIndicatorsData = data
       this.classicDashboardLoaded = true
     }
     this.$nextTick(() => {
       this.initializeChartPopups()
     })
   },
   switchToMyDashboard() {
     this.dashboardPanel = 'my'
     const query = { ...this.$route.query, panel: 'my' }
     this.$router.replace({ path: '/dashboard', query }).catch(() => {})
   },
   switchToClassicDashboard() {
     this.dashboardPanel = 'classic'
     const query = { ...this.$route.query }
     delete query.panel
     this.$router.replace({ path: '/dashboard', query }).catch(() => {})
     this.loadClassicDashboard()
   },
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
   },
   async getDashboardData() {
    let {data} = await getDashboardData()
    const parseData =  data
    this.dashBoardData = data
    console.log('dashBoardData', parseData)
    this.dashBoardData.forecasts = isJson(this.dashBoardData.forecasts) ? JSON.parse(this.dashBoardData.forecasts) : this.dashBoardData.forecasts
    const blogs_and_charts = isJson(this.dashBoardData.blogs_and_charts) ? JSON.parse(this.dashBoardData.blogs_and_charts) : this.dashBoardData.blogs_and_charts
    this.dashBoardData.blogs_and_charts = blogs_and_charts
    this.dashBoardData.dashboard_spotlight_data = isJson(this.dashBoardData.dashboard_spotlight_data) ? JSON.parse(this.dashBoardData.dashboard_spotlight_data) : this.dashBoardData.dashboard_spotlight_data
    this.dashBoardData.data = (isJson(this.dashBoardData.data) ? JSON.parse(this.dashBoardData.data) : this.dashBoardData.data) || []
    this.dashBoardData = parseData
    const heatmap_data = JSON.parse(parseData.heatmap_data)
    console.log('heatmap_data', heatmap_data)
    if(this.dashBoardData.pess_extreme && this.dashBoardData.opt_extreme) {
      this.dashBoardData.pess_extreme = this.dashBoardData.pess_extreme.map(obj => {
        if (obj['sub_type'] === 'vol') {
          obj['sub_type'] = 'Volatility';
        } else if (obj['sub_type'] === 'stock_sent') {
          obj['sub_type'] = 'Stock Sentiment';
        } else if (obj['sub_type'] === 'pc_ratio') {
          obj['sub_type'] = 'PutCall';
        }else if (['equity', 'cot'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'COT';
        } else if (['etf_index', 'etf_social_index'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Index';
        } else if (['etf_etf', 'etf_social_sector', 'etf_sector', 'mff_sector'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Sector';
        } else if (['etf_bond', 'etf_social_bond', 'mff_bond'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Bond';
        } else if (['etf_commod', 'etf_social_commod', 'mff_commod'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Commodity';
        } else if (obj['sub_type'] === 'etf_breadth') {
          obj['sub_type'] = 'Sector Breadth';
        } else if (['etf_country', 'etf_social_country'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Country';
        } else if (obj['sub_type'] === 'etf_social') {
          obj['sub_type'] = 'Social';
        } else if (obj['sub_type'] === 'seasonality') {
          obj['sub_type'] = 'Seasonality';
        } else if (obj['sub_type'] === 'optix') {
          obj['sub_type'] = 'Optix';
        } else if (obj['sub_type'] === 'model') {
          obj['sub_type'] = 'Model';
        } else if (obj['sub_type'] === 'more') {
          obj['sub_type'] = 'More';
        } else if (obj['sub_type'] === 'rydex') {
          obj['sub_type'] = 'Rydex';
        } else if (obj['sub_type'] === 'mff_stocks') {
          obj['sub_type'] = 'Stocks';
        } else if (obj['sub_type'].startsWith('etf_fund_')) {
          obj['sub_type'] = obj['sub_type'].split('_')[2].charAt(0).toUpperCase() + obj['sub_type'].split('_')[2].slice(1); // Capitalize the 3rd part
        } else {
          obj['sub_type'] = obj['sub_type'].charAt(0).toUpperCase() + obj['sub_type'].slice(1);
        }
        if(obj['last_change_type'] === 'percent') {
          if(obj['last_change'] !== '' && obj['last_change'] !== null && obj['last_change'] !== 'null') obj['last_change'] =  `${obj['last_change']}%`
          if(obj['last_value'] !== '' && obj['last_value'] !== null && obj['last_value'] !== 'null') obj['last_value'] =  `${obj['last_value']}%`
        }
        return obj
      })
      this.dashBoardData.opt_extreme = this.dashBoardData.opt_extreme.map(obj => {
        if (obj['sub_type'] === 'vol') {
          obj['sub_type'] = 'Volatility';
        } else if (obj['sub_type'] === 'stock_sent') {
          obj['sub_type'] = 'Stock Sentiment';
        } else if (obj['sub_type'] === 'pc_ratio') {
          obj['sub_type'] = 'PutCall';
        }else if (['equity', 'cot'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'COT';
        } else if (['etf_index', 'etf_social_index'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Index';
        } else if (['etf_etf', 'etf_social_sector', 'etf_sector', 'mff_sector'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Sector';
        } else if (['etf_bond', 'etf_social_bond', 'mff_bond'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Bond';
        } else if (['etf_commod', 'etf_social_commod', 'mff_commod'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Commodity';
        } else if (obj['sub_type'] === 'etf_breadth') {
          obj['sub_type'] = 'Sector Breadth';
        } else if (['etf_country', 'etf_social_country'].includes(obj['sub_type'])) {
          obj['sub_type'] = 'Country';
        } else if (obj['sub_type'] === 'etf_social') {
          obj['sub_type'] = 'Social';
        } else if (obj['sub_type'] === 'seasonality') {
          obj['sub_type'] = 'Seasonality';
        } else if (obj['sub_type'] === 'optix') {
          obj['sub_type'] = 'Optix';
        } else if (obj['sub_type'] === 'model') {
          obj['sub_type'] = 'Model';
        } else if (obj['sub_type'] === 'more') {
          obj['sub_type'] = 'More';
        } else if (obj['sub_type'] === 'rydex') {
          obj['sub_type'] = 'Rydex';
        } else if (obj['sub_type'] === 'mff_stocks') {
          obj['sub_type'] = 'Stocks';
        } else if (obj['sub_type'].startsWith('etf_fund_')) {
          obj['sub_type'] = obj['sub_type'].split('_')[2].charAt(0).toUpperCase() + obj['sub_type'].split('_')[2].slice(1); // Capitalize the 3rd part
        } else {
          obj['sub_type'] = obj['sub_type'].charAt(0).toUpperCase() + obj['sub_type'].slice(1);
        }
        if(obj['last_change_type'] === 'percent') {
          if(obj['last_change'] !== '' && obj['last_change'] !== null && obj['last_change'] !== 'null') obj['last_change'] =  `${obj['last_change']}%`
          if(obj['last_value'] !== '' && obj['last_value'] !== null && obj['last_value'] !== 'null') obj['last_value'] =  `${obj['last_value']}%`
        }
        return obj
      })
    }
    
   }
 }
};
</script>

<style lang="less" scoped>
@import "./index.less";

.dashboard-panel {
  min-height: 100%;
}

.dashboard-switch-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  max-width: 1200px;
  margin: 18px auto 16px;
  padding: 12px 16px;
  border: 1px solid #d7e2ec;
  border-radius: 4px;
  background: #f7fbff;
  color: #34495e;
}

.container > .dashboard-switch-banner {
  margin-top: 18px;
}

.dashboard-switch-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  line-height: 1.4;
}

.dashboard-switch-copy strong {
  color: #2f506f;
  font-size: 15px;
}

.dashboard-switch-copy span {
  color: #5d6d7e;
}

.dashboard-switch-btn {
  flex: 0 0 auto;
  padding: 7px 14px;
  border: 1px solid #5f7f9f;
  border-radius: 3px;
  background: #5f7f9f;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.dashboard-switch-btn:hover {
  background: #486985;
}

@media (max-width: 700px) {
  .dashboard-switch-banner {
    align-items: stretch;
    flex-direction: column;
  }

  .dashboard-switch-btn {
    width: 100%;
  }
}
</style>
