<template>
 <div class="col-md-12">
   <div class="portlet light">
     <div class="portlet-title">
       <div class="caption caption-md">
         <span class="caption-subject theme-font-color bold uppercase">Market Overview</span> - 
         <small><em>Data current as of {{ formattedDate }}</em></small>
       </div>
     </div>
     <div class="portlet-body">
       <div class="tabbable-line">
         <ul class="nav nav-tabs">
           <li :class="{ active: activeTab === 'summary' }">
             <a href="#" @click.prevent="setActiveTab('summary')">Summary</a>
           </li>
           <li :class="{ active: activeTab === 'market' }">
             <a href="#" @click.prevent="setActiveTab('market')">Market Overview</a>
           </li>
           <li :class="{ active: activeTab === 'activeStudies' }">
             <a href="#" @click.prevent="setActiveTab('activeStudies')">Active Studies</a>
           </li>
           <li :class="{ active: activeTab === 'heatmap' }">
             <a href="#" @click.prevent="setActiveTab('heatmap')">Heatmap</a>
           </li>
           <li :class="{ active: activeTab === 'phaseTable' }">
             <a href="#" @click.prevent="setActiveTab('phaseTable')">Phase Table</a>
           </li>
           <li :class="{ active: activeTab === 'ranks' }">
             <a href="#" @click.prevent="setActiveTab('ranks')">Ranks</a>
           </li>
           <li :class="{ active: activeTab === 'extremes' }">
             <a href="#" @click.prevent="setActiveTab('extremes')">% Extremes</a>
           </li>
           <li :class="{ active: activeTab === 'pessimism' }">
             <a href="#" @click.prevent="setActiveTab('pessimism')">Excess Pessimism</a>
           </li>
           <li :class="{ active: activeTab === 'optimism' }">
             <a href="#" @click.prevent="setActiveTab('optimism')">Excess Optimism</a>
           </li>
         </ul>

         <div class="tab-content">
           <div v-if="activeTab === 'summary'" class="tab-pane active">
             <div class="row" style="margin: 10px;">
               <div class="panel" style="border: 1px solid #67809F;">
                 <div class="panel-heading bg-blue-hoki bg-font-blue-hoki">
                   <h3 class="panel-title">Indicator Summary</h3>
                 </div>
                 <div class="panel-body">
                   <p>The range for the Short-Term and Intermediate-Term indicators is 0 (Maximum Pessimism) to 100 (Maximum Optimism).</p>
                   <div class="col-md-6">
                     <h4>Short-Term Indicators</h4>
                     <!-- <chart 
                        v-for="(chartData, index) in [shortIndicatorsChart]" 
                        :key="index"
                        :chartClass="chartData.chartClass"
                        :dataName="chartData.dataName"
                        :middleValue="chartData.middleValue" /> -->
                        <NewD3Chart chartClass="short_indicators" :data="dashBoardData.short_indicators_data" :dataUrl="dashBoardData.short_indicators" :middleValue="50" />
                    </div>
                   <div class="col-md-6">
                     <h4>Intermediate-Term Indicators</h4>
                     <NewD3Chart chartClass="int_indicators" :data="dashBoardData.int_indicators_data" :dataUrl="dashBoardData.int_indicators" :middleValue="50" />
                   </div>
                 </div>
               </div>
             </div>
             <RecentIndicators :forecasts="dashBoardData.blogs_and_charts"></RecentIndicators>
             <Charts :dashboard_spotlight_data="dashBoardData.dashboard_spotlight_data"></Charts>
           </div>
           <div v-if="activeTab === 'market'" class="tab-pane active">
             <div class="row" style="margin: 10px;">
               <div class="panel" style="border: 1px solid #67809F;">
                 <div class="panel-heading bg-blue-hoki bg-font-blue-hoki">
                   <h3 class="panel-title">Market Sentiment Overview</h3>
                 </div>
                 <div class="panel-body">
                  <OverviewTable :market_overview_data="dashBoardData.market_overview_data"></OverviewTable>
                 </div>
               </div>
             </div>
           </div>
           <div v-if="activeTab === 'activeStudies'" class="tab-pane active">
             <div class="row" style="margin: 10px;">
               <div class="panel" style="border: 1px solid #67809F;">
                 <div class="panel-heading bg-blue-hoki bg-font-blue-hoki">
                   <h3 class="panel-title">Active Studies</h3>
                 </div>
                 <div class="panel-body">
                  <ActiveStudies></ActiveStudies>
                 </div>
               </div>
             </div>
           </div>

          <div v-if="activeTab === 'heatmap'" class="tab-pane active">
            <div class='row' style="margin: 10px;">
                <div class="panel" style="border: 1px solid #67809F;">
                        <div class="panel-heading  bg-blue-hoki bg-font-blue-hoki">
                            <h3 class="panel-title">Optimism Index (Optix) Heatmap</h3>
                        </div>
                        <div class="panel-body"> 
                          <Heatmap :heatmap_data="dashBoardData.heatmap_data"></Heatmap>
                        </div>
                    </div>
                </div>
          </div>
          <div v-if="activeTab === 'phaseTable'" class="tab-pane active">
            <div class='row' style="margin: 10px;">
                <div class="panel" style="border: 1px solid #67809F;">
                        <div class="panel-heading  bg-blue-hoki bg-font-blue-hoki">
                            <h3 class="panel-title">Phase Table</h3>
                        </div>
                        <div class="panel-body"> 
                          <PhaseTable :phase_table_data="dashBoardData.phase_table_data"></PhaseTable>
                        </div>
                    </div>
                </div>
          </div>
          <div v-if="activeTab === 'ranks'" class="tab-pane active">
            <div class='row' style="margin: 10px;">
                <div class="panel" style="border: 1px solid #67809F;">
                        <div class="panel-heading  bg-blue-hoki bg-font-blue-hoki">
                            <h3 class="panel-title">Rank Charts</h3>
                        </div>
                        <div class="panel-body"> 
                          <RankCharts :dashBoardData="dashBoardData"></RankCharts>
                        </div>
                </div>
            </div>
          </div>
          
          <div v-if="activeTab === 'extremes'" class="tab-pane active">
            <div class='row' style="margin: 10px;">
                <div class="panel" style="border: 1px solid #67809F;">
                        <div class="panel-heading  bg-blue-hoki bg-font-blue-hoki">
                            <h3 class="panel-title">Extremes</h3>
                        </div>
                        <div class="panel-body"> 
                          <Extremes :dashBoardData="dashBoardData"></Extremes>
                        </div>
                    </div>
                </div>
          </div>
          <div v-if="activeTab === 'pessimism'" class="tab-pane active">
             <DashboardTable 
             :key="activeTab"
              type="pess"
              :extreme="dashBoardData.pess_extreme" 
              stock_complete_list='/indicators?enlarge=stock' 
              :date="dashBoardData.date"  
              :len_extreme="dashBoardData.len_pess"
             ></DashboardTable>
          </div>
          <div v-if="activeTab === 'optimism'" class="tab-pane active">
             <DashboardTable 
             :key="activeTab"
              type="opt"
              :extreme="dashBoardData.opt_extreme" 
              stock_complete_list='/indicators?enlarge=stock' 
              :date="dashBoardData.date"  
              :len_extreme="dashBoardData.len_opt"
             ></DashboardTable>
          </div>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>
<script>
import RecentIndicators from './RecentIndicators'
import Charts from './Charts'
import OverviewTable from "./OverviewTable";
import ActiveStudies from "@/components/ModelReport/ActiveStudies";
import DashboardTable from "./DashboardTable";
import Heatmap from "./Heatmap";
import PhaseTable from "./PhaseTable";
import RankCharts from "./RankCharts";
import Extremes from "./Extremes";
import D3Chart from "./D3Chart";
import NewD3Chart from "./NewD3Chart";

export default {
  components: {
    RecentIndicators,
    Charts,
    ActiveStudies,
    OverviewTable,
    ActiveStudies,
    DashboardTable,
    Heatmap,
    PhaseTable,
    RankCharts,
    Extremes,
    D3Chart,
    NewD3Chart
  },
  props: {
  dashBoardData: {
    type: Object,
    required: true,
  }
 },
  data() {
    return {
      activeTab: 'summary', // Default active tab
      shortIndicatorsChart: {
        chartClass: 'short_indicators',
        dataName: '/users/barchart_data/short_indicators',
        middleValue: 50
      },
    };
  },
  computed: {
    formattedDate() {
      return this.dashBoardData.date
    },
  },
  methods: {
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
/* Add any custom styles if needed */
</style>