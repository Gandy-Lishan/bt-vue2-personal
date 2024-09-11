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
a:hover {
 	font-weight: unset;
}
.font-green-jungle {
 color: #26c281;
}

.font-red-thunderbird {
 color: #e7505a;
}

.font-lg {
 font-size: 1.5em;
}
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
}
.panel-default {
 border-color: #e0e0e0;
}
.panel-default>.panel-heading {
  color: #333;
  background-color: #f9f9f9;
  border-color: #e0e0e0;
}
.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.panel .panel-body {
  font-size: 15px;
  padding: 15px;
}
.panel-title {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 0;
}
.panel-body:before, .panel-body:after {
  display: table;
  content: '';
}
.panel-body:after {
  clear: both;
}
table {
  background-color: transparent;
  border-spacing: 0;
  border-collapse: collapse;
}
.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}
.table.table-light {
  border: 0;
}
.table.table-light>thead>tr>th {
 font-weight: 600;
 font-size: 13px;
 color: #93a2a9;
 font-family: "Open Sans",sans-serif;
 border: 0;
 border-bottom: 1px solid #f2f5f8;
}
.table>thead:first-child>tr:first-child>th {
  border-top: 0;
}
.table-condensed>thead>tr>th, .table-condensed>tbody>tr>th, .table-condensed>tfoot>tr>th, .table-condensed>thead>tr>td, .table-condensed>tbody>tr>td, .table-condensed>tfoot>tr>td {
  padding: 5px;
}
.table>thead>tr>th, .table>tbody>tr>th, .table>tfoot>tr>th, .table>thead>tr>td, .table>tbody>tr>td, .table>tfoot>tr>td {
  line-height: 1.42857143;
}
.table>thead>tr>th {
  vertical-align: bottom;
}
.table.table-light>tbody>tr:last-child>td {
  border: 0;
}
.table.table-light>tbody>tr>td {
  color: #8896a0;
  vertical-align: middle;
}
</style>