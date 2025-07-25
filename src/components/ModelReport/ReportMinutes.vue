<template>
 <div class="main">
  <div class="container">
   <div class="row">
     <div class="col-md-12">
       <div class="portlet light">
        <div class="page-head">
          <h1 class="page-title">SentimenTrader Minutes</h1>
        </div>
         <h5>
           <em>
             SentimenTrader Minutes are short notes that may not be worthy of being published
             as a stand-alone blog post. They are published throughout the day and a 'digest'
             of these posts are published toward the end of each day on the blog. This page
             will list the last ten SentimenTrader Minute posts.
           </em>
         </h5>

         <hr />

         <div v-if="premium">
          <div class="row" style="padding:10px">
          <div v-for="(item, index) in minutes" :key="index">
            <div class="blog-single-head">
              <h2 class="blog-single-head-title">{{ item[1] }}</h2>
            </div>
            <div
              style="padding: 2px 4px 4px 4px; color: #555; background-color: #eee; border: #666 5px; border-top-style: solid; width: 250px; float: right;"
            >
              <ul>
                <li>Published: <br />{{ formatDate(item[5]) }}</li>
                <li>Author: {{ item[7] }}</li>
                <!-- <li v-if="item.timeframe !== 'NULL'">Timeframe: {{ item.timeframe }}</li>
                <li v-if="item.bias !== 'NULL'">Bias: {{ item.bias }}</li>
                <li v-if="item.confidence !== 'NULL'">Confidence: {{ item.confidence }}</li> -->
              </ul>
            </div>
            <div class="row" style="margin-bottom:10px; margin-left:15px; margin-top:5px;">
              <div v-html="item[4]"></div>
            </div>
            <hr />
          </div>
        </div>
         </div>

         <div v-else class="row" style="padding: 10px">
           <div class="note note-info col-md-12">
             <center>
               <h4><em>This is a premium feature.</em></h4>
             </center>
             <div class="col-md-8">
               <p>
                 Upgrade to our premium service to have access to the full chart below as well as all other premium charts
                 and additional premium features. Find out more about our premium service by
                 <a :href="premiumUrl">clicking here</a>.
               </p>
             </div>
             <div class="col-md-4">
               <h5>
                 Premium service is available at the following rates:<br />
                 $69 Monthly / $699 Yearly
               </h5>
               <center>
                 <a
                   :href="subscriptionUrl"
                   class="btn btn-primary"
                   style="color: white; background-color: #e15a46"
                 >
                   UPGRADE YOUR ACCOUNT <i class="m-icon-swapright m-icon-white"></i>
                 </a>
               </center>
             </div>
             <div class="col-md-11">
               <br />
               <center>
                 <h5>
                   <em>
                     If you have previously upgraded your account and are still seeing this
                     message, please
                     <a :href="refreshUrl">click here</a>
                     to refresh permissions/cookies
                   </em>
                 </h5>
               </center>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
  </div>
 </div>
</template>

<script>
import { getCookieData } from "@/utils/cryptoUtils/cookie";
import { getIntradayMinutes } from "@/service/service";
import { isJson} from "@/utils";
export default {
 name: "MinutesPage",
 data() {
   return {
     title: "SentimenTrader Minutes", // 可替换为 props 或后端传值
     premiumUrl: "https://users.sentimentrader.com/users/premium/",
     subscriptionUrl: "https://account.sentimentrader.com/",
     refreshUrl: "/MR/minutes", // 可根据路由动态生成
     minutes: [],
   };
 },
 computed: {
  premium() {
   const access_level = getCookieData()?.access_level
   if (access_level.some(str => str.includes('premium')) ||
      access_level.some(str => str.includes('premium-data-yearly')) ||
      access_level.some(str => str.includes('instituational')) ||  
      access_level.some(str => str.includes('everything'))) {
    return true
   }
   return false
  }
},
 async mounted() {
   const res = await getIntradayMinutes()
   debugger
   const _res = isJson(res.data) ? JSON.parse(res.data) : []
   this.minutes = _res
 },
 methods: {
  formatDate(timestamp) {
    const date = new Date(timestamp);

    // 保证显示固定，不受系统时区影响
    const pad = (n) => n.toString().padStart(2, '0');

    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const year = date.getUTCFullYear();

    let hours = date.getUTCHours();
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    const ampm = hours < 12 ? 'AM' : 'PM';

    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hourStr = pad(hours);

    const formatted = `${month}/${day}/${year}, ${hourStr}:${minutes}:${seconds} ${ampm} UTC`;

    return formatted
   },
 }
};
</script>

<style scoped>
/* 样式可按需添加 */
</style>