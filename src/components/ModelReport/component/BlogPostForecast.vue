<template>
 <div v-if="latestPost.forecasts && latestPost.forecasts.length" class="item-body">
   <div class="panel panel-default">
     <div class="panel-heading">
       <h3 class="panel-title">
         <center>Forecast(s) associated with this post</center>
       </h3>
       <span style="display: inline-block; float: right; margin-top: -23px;">
         <small>
           <i class="fa fa-question-circle"></i>
           <a href="https://users.sentimentrader.com/users/knowledge_base_article/How%20accurate%20are%20your%20studies%3F">What is this?</a>
         </small>
       </span>
     </div>
     <div class="panel-body">
       <table class="table table-light table-condensed">
         <thead>
           <tr>
             <th style="padding-right: 3px;">
               <center>Forecast</center>
             </th>
             <th>
               <center>Market</center>
             </th>
             <th>
               <center>Timeframe</center>
             </th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="forecast in latestPost.forecasts" :key="forecast.market">
             <template v-if="forecast.forecast !== 'None' && forecast.forecast !== ''">
               <td style="padding-right: 3px;">
                 <center>
                   <i
                     :class="{
                       'font-green-jungle font-lg fa fa-arrow-up': forecast.forecast === 'Up',
                       'font-red-thunderbird font-lg fa fa-arrow-down': forecast.forecast === 'Down',
                       'font-lg fa fa-minus': forecast.forecast !== 'Up' && forecast.forecast !== 'Down',
                     }"
                   ></i>
                 </center>
               </td>
               <td>
                 <b>
                   <center>{{ forecast.market }}</center>
                 </b>
               </td>
               <td v-if="forecast.timeframe">
                 <b>
                   <center>{{ forecast.timeframe }}</center>
                 </b>
               </td>
             </template>
           </tr>
         </tbody>
       </table>
     </div>
   </div>
 </div>
</template>

<script>
export default {
 name: 'BlogPostForecast',
 props: {
   latestPost: {
     type: Object,
     required: true
   },
 },
};
</script>

<style scoped>
.font-green-jungle {
 color: #26c281;
}

.font-red-thunderbird {
 color: #e7505a;
}

.font-lg {
 font-size: 1.5em;
}
</style>