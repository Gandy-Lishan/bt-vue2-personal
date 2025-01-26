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
                     <svg class="short_indicators" width="435" height="100"><g transform="translate(40,0)"><g><text class="values" y="8" x="120" dy=".35em" style="text-anchor: end;">Optix</text></g><g><text class="values" y="26" x="120" dy=".35em" style="text-anchor: end;">Volatility</text></g><g><text class="values" y="44" x="120" dy=".35em" style="text-anchor: end;">Options</text></g><g><text class="values" y="62" x="120" dy=".35em" style="text-anchor: end;">Oscillator</text></g><g><text class="values" y="80" x="120" dy=".35em" style="text-anchor: end;">TICK</text></g><text class="values" y="8" x="290.2" dy=".35em" style="text-anchor: start;">71</text><text class="values" y="26" x="296.2" dy=".35em" style="text-anchor: start;">76</text><text class="values" y="44" x="279.4" dy=".35em" style="text-anchor: start;">62</text><text class="values" y="62" x="243" dy=".35em" style="text-anchor: end;">40</text><text class="values" y="80" x="267.4" dy=".35em" style="text-anchor: start;">52</text><line x1="260" y1="5" x2="260" y2="75" stroke-width="0.5" stroke="#d9d9d9"></line><rect fill="#da8a8a" y="0" x="260" width="25.19999999999999" height="13"></rect><rect fill="#da8a8a" y="18" x="260" width="31.19999999999999" height="13"></rect><rect fill="#da8a8a" y="36" x="260" width="14.399999999999977" height="13"></rect><rect fill="#63be7b" y="54" x="248" width="12" height="13"></rect><rect fill="#da8a8a" y="72" x="260" width="2.3999999999999773" height="13"></rect></g></svg>                   </div>
                   <div class="col-md-6">
                     <h4>Intermediate-Term Indicators</h4>
                      <svg class="int_indicators" width="435" height="200"><g transform="translate(40,0)"><g><text class="values" y="8" x="120" dy=".35em" style="text-anchor: end;">Optix</text></g><g><text class="values" y="27" x="120" dy=".35em" style="text-anchor: end;">Volatility</text></g><g><text class="values" y="46" x="120" dy=".35em" style="text-anchor: end;">Options</text></g><g><text class="values" y="65" x="120" dy=".35em" style="text-anchor: end;">Breadth</text></g><g><text class="values" y="84" x="120" dy=".35em" style="text-anchor: end;">Surveys</text></g><g><text class="values" y="103" x="120" dy=".35em" style="text-anchor: end;">COT</text></g><g><text class="values" y="122" x="120" dy=".35em" style="text-anchor: end;">Hedging</text></g><g><text class="values" y="141" x="120" dy=".35em" style="text-anchor: end;">Cash</text></g><g><text class="values" y="160" x="120" dy=".35em" style="text-anchor: end;">Insiders</text></g><g><text class="values" y="179" x="120" dy=".35em" style="text-anchor: end;">Rydex</text></g><text class="values" y="8" x="269.8" dy=".35em" style="text-anchor: start;">54</text><text class="values" y="27" x="296.2" dy=".35em" style="text-anchor: start;">76</text><text class="values" y="46" x="285.4" dy=".35em" style="text-anchor: start;">67</text><text class="values" y="65" x="272.2" dy=".35em" style="text-anchor: start;">56</text><text class="values" y="84" x="245.40000000000003" dy=".35em" style="text-anchor: end;">42</text><text class="values" y="103" x="232.2" dy=".35em" style="text-anchor: end;">31</text><text class="values" y="122" x="239.4" dy=".35em" style="text-anchor: end;">37</text><text class="values" y="141" x="296.2" dy=".35em" style="text-anchor: start;">76</text><text class="values" y="160" x="322.6" dy=".35em" style="text-anchor: start;">98</text><text class="values" y="179" x="322.6" dy=".35em" style="text-anchor: start;">98</text><line x1="260" y1="5" x2="260" y2="175" stroke-width="0.5" stroke="#d9d9d9"></line><rect fill="#da8a8a" y="0" x="260" width="4.800000000000011" height="13"></rect><rect fill="#da8a8a" y="19" x="260" width="31.19999999999999" height="13"></rect><rect fill="#da8a8a" y="38" x="260" width="20.399999999999977" height="13"></rect><rect fill="#da8a8a" y="57" x="260" width="7.199999999999989" height="13"></rect><rect fill="#63be7b" y="76" x="250.40000000000003" width="9.599999999999966" height="13"></rect><rect fill="#63be7b" y="95" x="237.2" width="22.80000000000001" height="13"></rect><rect fill="#63be7b" y="114" x="244.4" width="15.599999999999994" height="13"></rect><rect fill="#da8a8a" y="133" x="260" width="31.19999999999999" height="13"></rect><rect fill="#da8a8a" y="152" x="260" width="57.60000000000002" height="13"></rect><rect fill="#da8a8a" y="171" x="260" width="57.60000000000002" height="13"></rect></g></svg>

                   </div>
                 </div>
               </div>
             </div>
             <RecentIndicators></RecentIndicators>
             <Charts></Charts>
           </div>
           <div v-if="activeTab === 'market'" class="tab-pane active">
             <div class="row" style="margin: 10px;">
               <div class="panel" style="border: 1px solid #67809F;">
                 <div class="panel-heading bg-blue-hoki bg-font-blue-hoki">
                   <h3 class="panel-title">Market Sentiment Overview</h3>
                 </div>
                 <div class="panel-body">
                  <OverviewTable></OverviewTable>
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
           <!-- Additional tabs rendered similarly -->
          <div v-if="activeTab === 'market'" class="tab-pane active">
            <div class='row' style="margin: 10px;">
              <div class="panel" style="border: 1px solid #67809F;">
                  <div class="panel-heading  bg-blue-hoki bg-font-blue-hoki">
                      <h3 class="panel-title">Market Sentiment Overview</h3>
                  </div>
                  <div class="panel-body"> 
                      //  TODO overview-data component
                     
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
                          <Heatmap></Heatmap>
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
                          <PhaseTable></PhaseTable>
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
                          <RankCharts></RankCharts>
          <div v-if="activeTab === 'extremes'" class="tab-pane active">
            <div class='row' style="margin: 10px;">
                <div class="panel" style="border: 1px solid #67809F;">
                        <div class="panel-heading  bg-blue-hoki bg-font-blue-hoki">
                            <h3 class="panel-title">Extremes</h3>
                        </div>
                        <div class="panel-body"> 
                          <Extremes 

                            ></Extremes>
                        </div>
                    </div>
                </div>
          </div>
          <div v-if="activeTab === 'pessimism'" class="tab-pane active">
             <DashboardTable 
             :key="activeTab"
              type="pess"
              :extreme="overviewData.pess_extreme" 
              stock_complete_list='#' 
              :date="overviewData.date"  
              :len_extreme="overviewData.len_pess"
             ></DashboardTable>
          </div>
          <div v-if="activeTab === 'optimism'" class="tab-pane active">
             <DashboardTable 
             :key="activeTab"
              type="opt"
              :extreme="overviewData.opt_extreme" 
              stock_complete_list='#' 
              :date="overviewData.date"  
              :len_extreme="overviewData.len_opt"
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
    Extremes
  },
  data() {
    return {
      activeTab: 'summary', // Default active tab
      date: new Date().toISOString(), // Replace with your actual data

      overviewData: null,
    };
  },
  computed: {
    formattedDate() {
      const dateObj = new Date(this.date);
      return dateObj.toLocaleDateString(); // Format as needed
    },
  },
  mounted() {
    this.overviewData = {

        // pess & opt
        opt_extreme: [
          // Sample data
          {
            url: 'some-url',
            underlying_name: 'Indicator 1',
            group: 'group 1',
            timeframe: 'Short',
            last_value: '17.00%',
            last_change: '-22%',
            last_update: new Date(),
            sentiment: 2,
          },
          {
            url: 'some-url-2',
            underlying_name: 'Indicator 2',
            group: 'group 2',
            timeframe: 'Short',
            last_value: '17.00%',
            last_change: '-22%',
            last_update: new Date(),
            sentiment: 3,
          },          
          {
            url: 'some-url-3',
            underlying_name: 'Indicator 3',
            group: 'group 3',
            timeframe: 'Short',
            last_value: '17.00%',
            last_change: '-22%',
            last_update: new Date(),
            sentiment: 1,
          },
        ], 
        pess_extreme: [
          // Sample data
          {
            url: 'some-url',
            underlying_name: 'Indicator 1',
            group: 'group 1',
            timeframe: 'Long',
            last_value: '17.00%',
            last_change: '-22%',
            last_update: new Date(),
            sentiment: 2,
          },
          {
            url: 'some-url-2',
            underlying_name: 'Indicator 2',
            group: 'group 2',
            timeframe: 'Long',
            last_value: '17.00%',
            last_change: '-22%',
            last_update: new Date(),
            sentiment: 3,
          },          
          {
            url: 'some-url-3',
            underlying_name: 'Indicator 3',
            group: 'group 3',
            timeframe: 'Long',
            last_value: '17.00%',
            last_change: '-22%',
            last_update: new Date(),
            sentiment: 1,
          },
        ], 
        date: 'January 20, 2025'
      }
      this.overviewData['len_opt'] = this.overviewData['opt_extreme'].length
      this.overviewData['len_pess'] = this.overviewData['pess_extreme'].length
      
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