<template>
 <div class="page-content-wrapper">
   <div class="page-content">
     <!-- Page Header -->
     <div class="page-head">
       <div class="container">
         <!-- BEGIN PAGE TITLE -->
         <div class="page-title">
           <h1>{{ title }}</h1>
         </div>
         <!-- END PAGE TITLE -->
       </div>
     </div>

     <div class="container">
       <!-- Flashed Messages -->
       <div class="row">
         <FlashedMessages />
       </div>

       <!-- Main Content -->
       <div class="row">
         <div class="col-md-12">
           <div class="portlet light">
             <div class="row">
               <div class="col-md-9">
                 <!-- Blog Posts -->
                 <div
                   v-for="(row, index) in dailyReportBlogs"
                   :key="index"
                   class="row"
                   style="padding:10px"
                 >
                   <h3>
                     <a :href="getPostUrl(row)">
                       {{ row.title }}
                     </a>
                   </h3>
                   <p>
                     <i>{{ formatDate(row.post_date) }}</i>
                   </p>

                   <!-- Post Content or Meta Description -->
                   <p v-if="row.meta_description">
                     {{ row.meta_description }}
                   </p>
                   <p v-else>
                     {{ truncate(row.post_content, 500) }}
                   </p>
                 </div>
               </div>

               <!-- Archives Sidebar -->
               <div class="col-md-3 well">
                 <div style="text-align: center;">
                   <h3>Archives by Year</h3>
                 </div>

                 <a
                   v-for="year in archiveYears"
                   :key="year"
                   :href="getArchiveUrl(year)"
                   class="btn blue btn-block"
                 >
                   {{ year }} Archives
                 </a>
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
//import FlashedMessages from '@/components/FlashedMessages.vue'; // 假设 FlashedMessages 是另一个组件
import { timestampToTime } from "@/utils";

export default {
 name: 'ReportArchives',
 components: {
   //FlashedMessages,
 },
 props: {
   title: {
     type: String,
     required: true,
   },
   dailyReportBlogs: {
     type: Array,
     required: true,
   },
 },
 data() {
   return {
     archiveYears: [
       2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
       2013, 2012,
     ],
   };
 },
 methods: {
   getPostUrl(row) {
     // 生成博客文章的 URL，假设使用 Vue Router
     return this.$router.resolve({
       name: 'UserBlogPost',
       params: { slug: row.url },
     }).href;
   },
   getArchiveUrl(year) {
     // 生成归档 URL
     return this.$router.resolve({
       name: `ArchivedReports${year}`,
     }).href;
   },
   formatDate(date) {
     // 日期格式化
     return timestampToTime(date)
   },
   truncate(text, length) {
     // 文本截断逻辑
     if (text.length > length) {
       return text.substring(0, length) + '...';
     }
     return text;
   },
 },
};
</script>

<style scoped>
/* 自定义样式 */
.well {
 background-color: #eee;
 border: 0;
 box-shadow: none;
}
.well {
 min-height: 20px;
 padding: 19px;
 margin-bottom: 20px;
 border-radius: 4px;
}
.well a {
 margin: 4px 0;
}
.blue.btn {
 color: #fff;
 background-color: #4b8df8;
}
.btn-block {
 display: block;
 width: 100%;
 padding-left: 0;
 padding-right: 0;
}
.btn {
 border-width: 0;
 padding: 7px 14px;
 font-size: 14px;
 outline: 0;
 background-image: none;
 filter: none;
 box-shadow: none;
 text-shadow: none;
}
</style>