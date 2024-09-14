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
             <div class="col-md-9">
               <div class="analysis_solutions_yellow">
                 <img
                   align="center"
                   alt=""
                   src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/b339eded-b1af-945a-2a41-50b18255e7be.png"
                   width="564"
                   style="max-width: 880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                   class="mcnImage"
                 />
               </div>
               <router-link :to="{ name: 'sentimentedge_post', params: { slug: latestPost.url }}">
                 <h2><strong v-html="latestPost.title"></strong></h2>
               </router-link>
               <div class="blog-single-head-date">
                 <i class="icon-calendar font-bluesteel"></i>
                 {{ formatDate(latestPost.post_date) }} | {{ latestPost.author }}
                 <button class="btn btn-default like-button" @click="likePost(latestPost.id, latestPost.author)">
                   <i class="fa fa-thumbs-o-up" id="like-icon"></i>
                 </button>
                 <button class="btn btn-default print-right" @click="printPage">
                   <i class="fa fa-print"></i>
                 </button>
               </div>
               <hr />
               <!-- Blog post forecast content -->
               <BlogPostForecast :latestPost="latestPost"/>
               <article v-html="latestPost.post_content"></article>
               <hr />
               <!-- Related content and tags -->
               <RelatedAndTags :latestPost="latestPost" />
             </div>
             <!-- END INFO BLOCK -->
             <SidebarSentimentEdge :categoryPosts="categoryPosts" :serviceType="serviceType" :title="title"/>
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
import BlogPostForecast from "./component/BlogPostForecast.vue";
import RelatedAndTags from "./component/RelatedAndTags";
import SidebarSentimentEdge from "./component/SidebarSentimentEdge";

export default {
 components: {
   BlogPostForecast,
   RelatedAndTags,
   SidebarSentimentEdge,
 },
 props: {
   title: {
     type: String,
     required: true,
   },
   latestPost: {
     type: Object,
     required: true,
   },
 },
 data() {
  return {
   categoryPosts: [
    {
     id: 1,
     url: '/sentimentedge-post',
     title: "SentimentEdge Post",
    },
    {
     id: 1,
     url: '/sentimentedge-post',
     title: "SentimentEdge Post",
    },
    {
     id: 1,
     url: '/sentimentedge-post',
     title: "SentimentEdge Post",
    }
   ],
   title: 'SentimentEdge',
   serviceType: 'SentimentEdge',
  }
 },
 methods: {
   formatDate(date) {
     // 自定义日期格式化方法
     const options = { year: "numeric", month: "long", day: "numeric" };
     return new Date(date).toLocaleDateString(undefined, options);
   },
   likePost(postId, author) {
     // 点赞按钮点击事件逻辑
     console.log(`Liked post ${postId} by ${author}`);
     // 你可以在此处添加你的点赞逻辑，比如发送 API 请求
   },
   printPage() {
     // 打印页面逻辑
     window.print();
   },
 },
};
</script>

<style>
.analysis_solutions_yellow {
 background-color: #fbc01f;
}
.blog-single-head-date {
 position: relative;
}
.btn>i {
  font-size: 14px;
}
.btn-default>i {
  color: #aaa;
}
.btn-block {
  display: block;
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}
.print-right {
 position: absolute;
 right: 0;
 margin-top: -10px;
 margin-right: 15px;
}
.btn-default {
  color: #333;
  background-color: #fff;
  border-color: #ccc;
  border-width: 1px;
  padding: 6px 12px;
}
.like-button {
 position: absolute;
 right: 50px;
 margin-top: -10px;
 margin-right: 15px;
}
.fa-thumbs-up {
 color: #5b9bd1 !important;
}
.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 768px) {
 .container {
   width: 750px;
 }
}
@media (min-width: 992px) {
 .container {
   width: 970px;
 }
}
@media (min-width: 1200px) {
 .container {
   width: 1170px;
 }
}

@media (min-width: 992px) {
  .col-md-12 {
    width: 100%;
  }
  .col-md-9 {
    width: 75%;
  }
  .col-md-3 {
    width: 25%;
  }
  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
    float: left;
  }
}
</style>