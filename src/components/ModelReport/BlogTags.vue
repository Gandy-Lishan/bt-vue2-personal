<template>
 <div class="main">
   <div class="container">
     <!-- BEGIN SIDEBAR & CONTENT -->
     <div class="row margin-bottom-40">
       <!-- BEGIN CONTENT -->
       <div class="col-md-12 col-sm-12">
         <div class="content-page">
           <h1 v-html="title"></h1>
           <hr />
           <div class="row margin-bottom-30">
             <!-- BEGIN INFO BLOCK -->
             <div class="col-md-12">
               <div v-for="post in tagPosts" :key="post.url">
                 <a :href="getPostUrl(post)">
                   <h2 v-html="post.title"></h2>
                 </a>
                 <div class="blog-single-head-date">
                   <i class="icon-calendar font-bluesteel"></i>
                   {{ formatDate(post.post_date) }} | {{ post.author }}
                 </div>
                 <br /><br />

                 <article>
                   <p v-if="post.meta_description">
                     {{ post.meta_description }}
                   </p>
                   <p v-else v-html="truncate(post.post_content, 300)"></p>

                   <!-- Read more -->
                   <!-- <ReadMore /> -->
                   <a class="btn grey-cascade" :href="post.url">Read More ... </a>
                   <hr />
                 </article>
               </div>

               <!-- Pagination -->
               <a
                 v-if="previousPage"
                 class="btn grey-cascade"
                 :href="getPageUrl(previousPage)"
               >
                 &larr; previous page
               </a>
               <a
                 v-if="nextPage"
                 class="btn grey-cascade"
                 style="float:right;"
                 :href="getPageUrl(nextPage)"
               >
                 next page &rarr;
               </a>
             </div>
             <!-- END INFO BLOCK -->
           </div>
         </div>
       </div>
       <!-- END CONTENT -->
     </div>
     <!-- END SIDEBAR & CONTENT -->
   </div>
 </div>
</template>

<script>
// import ReadMore from '@/components/ReadMore.vue'; // 引入组件
import { timestampToTime } from "@/utils";

export default {
  name: 'BlogTags',
//  components: {
//    ReadMore,
//  },
 props: {
   title: {
     type: String,
     required: true,
   },
   tagPosts: {
     type: Array,
     required: true,
   },
   previousPage: {
     type: Number,
     default: null,
   },
   nextPage: {
     type: Number,
     default: null,
   },
   tag: {
     type: String,
     required: true,
   },
 },
 methods: {
   getPostUrl(post) {
     // 使用 Vue Router 生成 URL
     return this.$router.resolve({
       name: 'BlogPost',
       params: { slug: post.url },
     }).href;
   },
   getPageUrl(pageNumber) {
     // 使用 Vue Router 生成分页 URL
     return this.$router.resolve({
       name: 'TagPosts',
       params: { tag: this.tag, page_number: pageNumber },
     }).href;
   },
   formatDate(date) {
     // 自定义日期格式化逻辑
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
</style>