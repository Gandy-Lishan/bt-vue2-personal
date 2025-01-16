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
           <template v-if="dashboardType === 'grandfathered'">
             <template v-for="(row, index) in latestCommentary">
              <div :key="index">
               <a
                 class="item-name primary-link"
                 :href="getBlogUrl(row)"
               >
                 {{ row.title }}
               </a>
               <br />
               <em><small>Published: {{ row.postDate }}</small></em>
               <br />
               <p>
                 {{ getContent(row) }}
               </p>
              </div>
             </template>
           </template>

           <template v-else-if="dashboardType === 'indicatoredge'">
             <template v-if="LC_Length > 0">
               <template v-for="(row, index) in latestCommentary">
                <div :key="index">
                 <a
                   class="item-name primary-link"
                   :href="getBlogUrl(row)"
                 >
                   {{ row.title }}
                 </a>
                 <br />
                 <em><small>Published: {{ row.postDate }}</small></em>
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
export default {
 props: {
   dashboardType: {
     type: String,
     required: true,
   },
   // latestCommentary: {
   //   type: Array,
   //   default: () => [],
   // },
   LC_Length: {
     type: Number,
     default: 0,
   },
 },
 data() {
  latestCommentary: [
   {
    title: 'Register for Jan 15 Exclusive Monthly Client Webinar and Access Dec 11 Webinar Recording',
    postDate: '2022-02-20'
   }
  ]
 },
 computed: {
   getPanelTitle() {
     if (this.dashboardType === "grandfathered" || this.dashboardType === "indicatoredge") {
       return "Latest Commentary";
     }
     return "Other Services Available";
   },
 },
 methods: {
   getBlogUrl(row) {
     if (
       this.dashboardType === "indicatoredge" &&
       ["Jason Goepfert", "Dean Christians", "Jay Kaeppel"].includes(row.author)
     ) {
       return `/user/blog_post/${row.url}`;
     }
     return `/public/blog_post/${row.url}`;
   },
   getContent(row) {
     if (row.metaDescription && row.metaDescription.trim() !== "") {
       return row.metaDescription;
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