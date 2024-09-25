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
                     <a :href="`/MR/blog/${row.url}`">
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
                   :href="`/MR/archived_reports/${year}`"
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
import { getArchivedReports } from "@/service/service";

export default {
 name: 'ReportArchives',
 components: {
   //FlashedMessages,
 },
 data() {
   return {
     archiveYears: [
       2024, 2023, 2022, 2021, 2020
     ],
     dailyReportBlogs: [],
     reportDetails: {
      title: 'Daily Report : Risk appetite is waning despite stocks\' rise',
      url: 'daily_report_09_18_2024',
      user_level: 'basic',
      post_content: ``,
      post_date: '2024-09-18 18:32:04',
      author: 'Jason Goepfert',
      published: '',
      publish_date: '',
      confidence: '',
      bias: '',
      meta_description: '',
      timeframe: '',
      asset: '',
      count_likes: ''
     }
   };
 },
 beforeRouteEnter(to, from, next) {
  console.log('to', to)
  console.log('from', from)
  if (to.path.includes('/MR/archived_reports')) {
    next(async _this => {
      const year = to.params.year || (new Date()).getFullYear()
      _this.title = `Archived Reports for ${year}`
      const {data: {results}} = await getArchivedReports(year)
      console.log('res', results)
      _this.dailyReportBlogs = results
    })
    } else {
      next()
    }
  },
 methods: {
   formatDate(dateStr) {
     let formattedDate = ''
    if (dateStr) {
      const dateObj = new Date(dateStr);

      if (!isNaN(dateObj)) {
          const options = { year: 'numeric', month: 'long', day: '2-digit' };
          formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
      } else {
          console.log("Invalid date format");
      }
    } else {
        console.log("Date is null or undefined");
    }
    return formattedDate
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
.page-head {
  padding-top: 0px;
}
</style>