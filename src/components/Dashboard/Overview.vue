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
                     <svg class="short_indicators"></svg>
                   </div>
                   <div class="col-md-6">
                     <h4>Intermediate-Term Indicators</h4>
                     <svg class="int_indicators"></svg>
                   </div>
                 </div>
               </div>
             </div>
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

         </div>
       </div>
     </div>
   </div>
 </div>
</template>
<script>
import OverviewTable from "./OverviewTable";
import ActiveStudies from "@/components/ModelReport/ActiveStudies";
export default {
  data() {
    return {
      activeTab: 'summary', // Default active tab
      date: new Date().toISOString(), // Replace with your actual data
    };
  },
  components: {
    OverviewTable,
    ActiveStudies
  },
  computed: {
    formattedDate() {
      const dateObj = new Date(this.date);
      return dateObj.toLocaleDateString(); // Format as needed
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