<template>
 <div class="overview-table">
   <p>This page provides an overview of our main Optimism Index (Optix) Indicators covering the major markets, commodities, and currencies.</p>
   <p>
     Each market in the table is accompanied by a "dot". That dot shows the current level of Sentiment for that market relative to its recent range.
     "Extremely Pessimistic" (the far left, darkest green) means the indicator is showing that investors have likely already sold and that market should rise;
     "Extremely Optimistic" (the far right, darkest red), on the other hand, means that Sentiment is suggesting investors are too confident and that market may fall going forward. The more extreme the indicator, the stronger the contrary signal.
   </p>

   <div class="table-responsive">
     <div class="tg-wrap">
       <table id="tg-Uj6mS" class="tg">
         <thead>
           <tr>
             <th class="tg-7btt"></th>
             <th class="tg-7btt"></th>
             <th class="tg-7btt"></th>
             <th class="tg-uzvj" colspan="8">SentimentTrader Optimism Index (Optix)</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td class="tg-7btt">Market</td>
             <td class="tg-7btt">Date</td>
             <td class="tg-7btt">Close</td>
             <td class="tg-7btt">Value</td>
             <td class="tg-7btt" colspan="3">Pessimism</td>
             <td class="tg-7btt">Neutral</td>
             <td class="tg-7btt" colspan="3">Optimism</td>
           </tr>

           <tr v-for="(row, index) in marketOverviewData" :key="index">
             <td class="tg-c3ow">
               <a :href="getChartUrl(row.symbol)">
                 {{ row.chart_name === 'Intermediate Term Optimism Index (Optix)' ? 'S&P 500' : row.chart_name }}
               </a>
             </td>
             <td class="tg-c3ow">{{ row.date }}</td>
             <td class="tg-c3ow">{{ row.close }}</td>
             <td class="tg-c3ow">{{ row.closeSentiment }}</td>

             <td class="tg-hw1o"><i v-if="row.closeSentiment == 1" class="fa fa-circle"></i></td>
             <td class="tg-fpwh"><i v-if="row.closeSentiment === 2" class="fa fa-circle"></i></td>
             <td class="tg-kndx"><i v-if="row.closeSentiment === 3" class="fa fa-circle"></i></td>
             <td class="tg-c3owN"><i v-if="row.closeSentiment === 4" class="fa fa-circle"></i></td>
             <td class="tg-bolj"><i v-if="row.closeSentiment === 5" class="fa fa-circle"></i></td>
             <td class="tg-vswx"><i v-if="row.closeSentiment === 6" class="fa fa-circle"></i></td>
             <td class="tg-1jni"><i v-if="row.closeSentiment === 7" class="fa fa-circle"></i></td>
           </tr>

           <tr>
             <td class="tg-c3ow1" colspan="11">
               <img :src="getImageUrl()" alt="SentimenTrader" class="logo" width="200px" />
             </td>
           </tr>
         </tbody>
       </table>
     </div>
   </div>
 </div>
</template>

<script>
export default {
 data() {
   return {
     // 模拟 market_overview_data 数据结构
     marketOverviewData: [
       {
         chart_name: 'S&P 500',
         symbol: 'SPX',
         date: '2021-12-31',
         close: 3750.85,
         closeSentiment: 3,
       },
       {
         chart_name: 'Intermediate Term Optimism Index (Optix)',
         symbol: 'SPX',
         date: '2021-12-31',
         close: 3750.85,
         closeSentiment: 7,
       },
       // 更多数据...
     ],
   };
 },
 methods: {
   // 返回图表的链接
   getChartUrl(symbol) {
     return `/charts/${symbol}`;
   },
   // 返回图片的 URL
   getImageUrl() {
     return 'https://cdn.prod.website-files.com/650486dd4239644e595569c1/650486dd4239644e59556a01_ST%20Logo.png';
   },
 },
};
</script>

<style lang="less" scoped>
@import "./index.less";
.overview-table{
 color: #333;
 font-family: "Open Sans", sans-serif;
 line-height: 1.5em;
 font-weight: 400;
}
.tg {
 border-collapse: collapse;
 border-color: #ccc;
 border-spacing: 0;
 margin: 0px auto;
 width: 100%;
}

.tg td {
 background-color: #fff;
 border-color: #ccc;
 border-style: solid;
 border-width: 1px;
 color: #333;
 font-family: 'Open Sans', sans-serif;
 font-size: 14px;
 overflow: hidden;
 padding: 5px 5px;
 word-break: normal;
}

.tg th {
 background-color: #f0f0f0;
 border-color: #ccc;
 border-style: solid;
 border-width: 1px;
 color: #333;
 font-family: 'Open Sans', sans-serif;
 font-size: 14px;
 font-weight: normal;
 overflow: hidden;
 padding: 5px 5px;
 word-break: normal;
}

.tg .tg-vswx {
 background-color: #fd6864;
 font-size: 14px;
 border-color: inherit;
 text-align: center;
 vertical-align: top;
 width: 45px;
}

.tg .tg-fpwh {
 background-color: #32cb00;
 font-size: 14px;
 border-color: inherit;
 text-align: center;
 vertical-align: top;
 width: 45px;
}

.tg .tg-kndx {
 background-color: #9aff99;
 font-size: 14px;
 border-color: inherit;
 text-align: center;
 vertical-align: top;
 width: 45px;
}

.tg .tg-c3ow {
 border-color: inherit;
 font-size: 14px;
 text-align: center;
 vertical-align: top;
}

.tg .tg-c3owN {
 border-color: inherit;
 font-size: 14px;
 text-align: center;
 vertical-align: top;
 width: 75px;
}

.tg .tg-c3ow1 {
 border-color: inherit;
 font-size: 16px;
 text-align: right;
 vertical-align: top;
 border: 0;
}

.tg .tg-7btt {
 border-color: inherit;
 font-size: 14px;
 font-weight: bold;
 text-align: center;
 vertical-align: top;
}

.tg .tg-uzvj {
 border-color: inherit;
 font-size: 14px;
 font-weight: bold;
 text-align: center;
 vertical-align: middle;
}

.tg .tg-hw1o {
 background-color: #009901;
 font-size: 14px;
 border-color: inherit;
 text-align: center;
 vertical-align: top;
 width: 45px;
}

.tg .tg-bolj {
 background-color: #ffccc9;
 font-size: 14px;
 border-color: inherit;
 text-align: center;
 vertical-align: top;
 width: 45px;
}

.tg .tg-1jni {
 background-color: #cb0000;
 font-size: 14px;
 border-color: inherit;
 text-align: center;
 vertical-align: top;
 width: 45px;
}

.tg-sort-header::-moz-selection {
 background: 0 0;
}

.tg-sort-header::selection {
 background: 0 0;
}

.tg-sort-header {
 cursor: pointer;
}

.tg-sort-header:after {
 content: '';
 float: right;
 margin-top: 7px;
 border-width: 0 5px 5px;
 border-style: solid;
 border-color: #404040 transparent;
 visibility: hidden;
}

.tg-sort-header:hover:after {
 visibility: visible;
}

.tg-sort-asc:after,
.tg-sort-asc:hover:after,
.tg-sort-desc:after {
 visibility: visible;
 opacity: 0.4;
}

.tg-sort-desc:after {
 border-bottom: none;
 border-width: 5px 5px 0;
}

@media screen and (max-width: 767px) {
 .tg {
   width: auto !important;
 }
 .tg col {
   width: auto !
   important;
  }
  .tg-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: auto 0px;
  }
}
</style>