<template>
 <div>
   <!-- COMMENTARY SECTION -->
   <div class="portlet light">
     <div class="portlet-body">
       <div class="panel" style="border: 1px solid #67809F;">
         <div class="panel-heading bg-blue-hoki bg-font-blue-hoki">
           <h4 class="panel-title">
             <b>{{ getPanelTitle }}</b>
           </h4>
         </div>
         <div class="panel-body">
           <template v-if="dashboard_type === 'grandfathered'">
             <template v-for="(row, index) in latest_commentary">
              <div :key="index">
               <a
                 class="item-name primary-link"
                 :href="getBlogUrl(row)"
               >
                 {{ row.title }}
               </a>
               <br />
               <em><small>Published: {{ row.post_date }}</small></em>
               <br />
               <p>
                 {{ getContent(row) }}
               </p>
              </div>
             </template>
           </template>

           <template v-else-if="dashboard_type === 'indicatoredge'">
            <template v-if="htop_webinar_exist">
              <template v-for="(row, index) in htop_webinar">
                <div :key="index">
                 <a
                   class="item-name primary-link"
                   :href="getWebinarUrl(row)"
                   target="_blank"
                 >
                   {{ row.title }}
                 </a>
                 <br />
                 <em><small>Published: {{ row.post_date }}</small></em>
                 <br />
                 <p>
                   {{ getContent(row) }}
                 </p>
                </div>
               </template>
            </template>
             <template v-if="LC_Length > 0">
               <template v-for="(row, index) in latest_commentary">
                <div :key="index">
                 <a
                   class="item-name primary-link"
                   :href="getBlogUrl(row)"
                 >
                   {{ row.title }}
                 </a>
                 <br />
                 <em><small>Published: {{ row.post_date }}</small></em>
                 <br />
                 <p>
                   {{ getContent(row) }}
                 </p>
                </div>
               </template>
             </template>
             <p v-else>
               Please consider adding a research subscription to have access to
               content.
             </p>
           </template>

           <template v-else>
             <p>Please consider adding a research subscription to have access to content.</p>
           </template>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
import { isJson, timestampToTime } from '@/utils';
import moment from "moment";

export default {
 props: {
  dashBoardData: {
    type: Object,
    required: true,
  }
 },
 data() {
 },
 computed: {
  LC_Length() {
    return this.dashBoardData.LC_Length
  },
  latest_commentary() {
    const latest_commentary = isJson(this.dashBoardData.latest_commentary) ? JSON.parse(this.dashBoardData.latest_commentary) : this.dashBoardData.latest_commentary
    return latest_commentary.map(ele => {
      if(ele.post_date) {
        const formattedDate = moment.utc(ele.post_date).format('YYYY-MM-DD');
        ele.post_date = formattedDate
      }
      return ele
    })
  },
  htop_webinar() {
    return this.dashBoardData.htop_webinar
  },
  htop_webinar_exist() {
    return Array.isArray(this.htop_webinar) && this.htop_webinar.length !== 0
  },
  dashboard_type() {
    console.log('this.dashBoardData.dashboard_type;', this.dashBoardData.dashboard_type)
     return this.dashBoardData.dashboard_type;
   },
   getPanelTitle() {
     if (this.dashBoardData.dashboard_type === "grandfathered" || this.dashBoardData.dashboard_type === "indicatoredge") {
       return "Latest Commentary";
     }
     return "Other Services Available";
   },
 },
 watch: {
  latest_commentary(value) {
    console.log('lishan latest_commentary', value)
  }
 },
 methods: {
   getBlogUrl(row) {
     if (
       this.dashboard_type === "indicatoredge" &&
       ["Jason Goepfert", "Dean Christians", "Jay Kaeppel"].includes(row.author) &&
       ['sentimentedge', 'modeledge', 'quantedge', 'tradingedge'].includes(row.user_level)
     ) {
       return `/MR/${row.user_level}/${row.url}`;
     }
     return `/MR/blog/${row.url}`;
   },
   getWebinarUrl(row) {
    return `/dashboard/htop_webinar`
    return `/dashboard/htop_webinar/${row.date}`
   },
   getContent(row) {
     if (row.meta_description && row.meta_description.trim() !== "") {
       return row.meta_description;
     }
     return row.content ? row.content.substring(0, 100) : "No content available";
   },
 },
};
</script>
<style lang="less" scoped>
@import "./index.less";
/* Add any custom styles if needed */
</style>