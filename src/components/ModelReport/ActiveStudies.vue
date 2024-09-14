<template>
 <div class="main">
  <div class="container">
   <div class="row margin-bottom-40">
    <div class="col-md-12 col-sm-12">
     <div class="content-page">
      <h1 v-html="title"></h1>
      <hr />
      <!-- <div class="row thumbnail">
       <div class="col-md-9">
        <p>As a premium subscriber, you have the option to subscribe to our Study Alerts. These alerts will be emailed out 
         whenever we publish a new study that isn't part of our daily report.
         To subscribe, click the "subscribe to Study Alerts" button to the right. 
         If you would like to stop receiving these emails, just click 'Unsubscribe from Study Alerts'.
         <em>Note: You may also visit the <router-link :to="'/user/preferences'">User Preferences</router-link> page to subscribe/unsubscribe
         from these digests.</em>
         </p>
       </div>
       <div class="col-md-3 align-right">
         <br />
          <template v-if="userSubActiveStudy">
           <form @submit.prevent="unsubscribeFromStudyAlerts" style="display: inline;">
            <button class="btn red btn-block" type="submit">Unsubscribe from Study Alerts</button>
           </form>
           <br />
           <p><center>You are subscribed to Alerts.</center></p>
          </template>
          <template v-else>
            <form @submit.prevent="subscribeToStudyAlerts" style="display: inline;">
              <button class="btn btn-primary btn-block" type="submit">Subscribe to Study Alerts</button>
            </form>
            <br />
            <p><center>You are <b>not</b> subscribed to Alerts.</center></p>
          </template>
       </div>
      </div> -->
     </div>
    </div>
   </div>
  </div>
  <div class="container">
   <div class="row">
    <div class="col-md-12">
     <div class="portlet light">
      <div class="col-md-12">

       <div class="col-md-7">
        <h4>Active Studies Description</h4>
        <span class="well well-sm" style="float: right; display: inline-block;">
          <p><b>What is an "active study"?</b></p>
          <p>For every study we do that has a solid conclusion, we track it in the Active Studies. Research that includes one of these compelling studies will have a forecast attached to it, that looks like the following. It shows whether the forecast is for higher prices (green up arrow), or lower prices (red down arrow), an ETF that tracks the appropriate market, and whether the time frame is short-term (< 1 month), medium-term (1-6 months) or long-term (> 6 months). 
            <a href="https://www.sentimentrader.com/users/knowledge_base_article/How%20accurate%20are%20your%20studies%3F">Learn more</a>
          </p>
        </span>
        <p>This page lists all studies that are provided in the Daily Report that are still considered to be active. 
          You may filter the listings below by market/symbol and timeframe.
        </p>
        <p>Forecast Legend: 
          <i class="font-green-jungle font-lg fa fa-arrow-up" aria-hidden="true"></i> (Up), 
          <i class="font-red-thunderbird font-lg fa fa-arrow-down" aria-hidden="true"></i> (Down), 
          <i class="font-lg fa fa-minus" aria-hidden="true"></i> (Flat).
        </p>
      </div>

       <div class="col-md-4">
         <h4>Active Studies Summary (stocks-only)</h4>
         <table class="tg" style="table-layout: fixed; width: 415px;">
           <tr>
             <th class="tg-m0ac">Time Frame</th>
             <th class="tg-w7sd">Bullish</th>
             <th class="tg-0mq6">Bearish</th>
           </tr>
           <tr>
             <td class="tg-baqh">Short-Term</td>
             <td class="tg-baqh">{{ shortTermBullish }}</td>
             <td class="tg-baqh">{{ shortTermBearish }}</td>
           </tr>
           <tr>
             <td class="tg-baqh">Medium-Term</td>
             <td class="tg-baqh">{{ medTermBullish }}</td>
             <td class="tg-baqh">{{ medTermBearish }}</td>
           </tr>
           <tr>
             <td class="tg-baqh">Long-Term</td>
             <td class="tg-baqh">{{ longTermBullish }}</td>
             <td class="tg-baqh">{{ longTermBearish }}</td>
           </tr>
         </table>
       </div>

       <div style="clear:both;"></div>
       <hr />
       <div id="example_wrapper" class="dataTabkes_wrapper no-footer">
        <table id="example" class="display compact_active_studies table-active-toolbar" cellspacing="0" width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Study Title</th>
              <th>Market</th>
              <th>Forecast</th>
              <th>Timeframe</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="forecast in forecasts" :key="forecast.index" v-if="forecast.market">
              <td class="nowrap">{{ forecast.date }}</td>
              <td>
                <a :href="forecastLink(forecast)" target="_blank" class="item-name primary-link">
                  {{ forecast.title }}
                </a>
              </td>
              <td>{{ forecast.market }}</td>
              <td class="center">
                <i v-if="forecast.forecast === 'Up'" class="font-green-jungle font-lg fa fa-arrow-up" aria-hidden="true"></i>
                <i v-if="forecast.forecast === 'Down'" class="font-red-thunderbird font-lg fa fa-arrow-down" aria-hidden="true"></i>
                <i v-if="forecast.forecast === 'Flat'" class="font-lg fa fa-minus" aria-hidden="true"></i>
              </td>
              <td>{{ forecast.timeframe }}</td>
            </tr>
          </tbody>
        </table>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script>
export default {
 props: {
   title: String,
   showStudySubForm: Boolean,
   premium: Boolean,
   userSubActiveStudy: Boolean,
   shortTermBullish: Number,
   shortTermBearish: Number,
   medTermBullish: Number,
   medTermBearish: Number,
   longTermBullish: Number,
   longTermBearish: Number,
   forecasts: Array
 },
 methods: {
   subscribeToStudyAlerts() {
     // 处理订阅逻辑
   },
   unsubscribeFromStudyAlerts() {
     // 处理取消订阅逻辑
   },
   forecastLink(forecast) {
     if (forecast.index.endsWith('-blog')) {
       return `/public/blog_post/${forecast.filename}`;
     } else {
       return `/user/download_file/${forecast.filename}`;
     }
   }
 }
};
</script>

<style scoped>
/* 样式可保持不变 */
.tg {
 border-collapse: collapse;
 border-spacing: 0;
 border-color: #ccc;
}

.tg td,
.tg th {
 font-family: Arial, sans-serif;
 font-size: 14px;
 padding: 10px 5px;
 border-style: solid;
 border-width: 0px;
 word-break: normal;
 border-color: #ccc;
}

.tg td {
 color: #333;
 background-color: #fff;
}

.tg th {
 background-color: #f0f0f0;
}

.tg .tg-m0ac {
 font-weight: bold;
 background-color: #656565;
 color: #ffffff;
 text-align: center;
}

.tg .tg-w7sd {
 font-weight: bold;
 background-color: #32cb00;
 color: #ffffff;
 text-align: center;
}

.tg .tg-0mq6 {
 font-weight: bold;
 background-color: #fe0000;
 color: #ffffff;
 text-align: center;
}

.center {
 text-align: center;
}

.nowrap {
 white-space: nowrap;
}
@media (min-width: 992px) {
	.col-md-7 {
		width: 58.33%;
	}
 .col-md-4 {
  width: 33.33%;
 }
}
</style>