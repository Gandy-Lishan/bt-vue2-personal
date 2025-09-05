<template>
 <div class="main">
   <div class="container">
     <!-- BEGIN SIDEBAR & CONTENT -->
     <div class="row margin-bottom-40">
       <!-- BEGIN CONTENT -->
       <div class="col-md-12 col-sm-12">
         <div class="content-page">
          <div class="page-head">
           <h1 v-html="title" class="page-title" v-if="serviceType === 'Blog'"></h1>
          </div>
           <!-- <hr /> -->
           <div class="row margin-bottom-30">
             <!-- BEGIN INFO BLOCK -->
             <div class="col-md-9" :class="{ 'blog': serviceType === 'Blog' }">
               <div class="analysis_solutions_yellow" v-if="serviceType === 'SentimentEdge'">
                 <img
                   align="center"
                   alt=""
                   src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/dbc38582-359b-c5e5-f142-3e82bb97904c.png"
                   width="564"
                   style="max-width: 880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                   class="mcnImage"
                 />
               </div>
               <div class="analysis_solutions_yellow" v-if="serviceType === 'quantedge' || serviceType === 'kaeppelscorner'">
                 <img
                   align="center"
                   alt=""
                   src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/13d4bb49-034a-7505-dba1-d8f33133b5a0.png"
                   width="564"
                   style="max-width: 880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                   class="mcnImage"
                 />
               </div>
               <div class="analysis_solutions_yellow" v-if="serviceType === 'ModelEdge'">
                 <img
                   align="center"
                   alt=""
                   src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/b9ffe0ae-74cc-9fb9-1b80-b4079091d020.png"
                   width="564"
                   style="max-width: 880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                   class="mcnImage"
                 />
               </div>
               <div class="analysis_solutions_yellow" v-if="serviceType === 'TradingEdge'">
                 <img
                   align="center"
                   alt=""
                   src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/4e911970-b3cd-6202-a435-734821c3c972.png"
                   width="564"
                   style="max-width: 880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                   class="mcnImage"
                 />
               </div>
                <a :href="`/MR/${requestedType}/${latestPost.url}`" v-if="serviceType !== 'Blog'">
                 <h2><strong v-html="latestPost.title"></strong></h2>
                </a>
               <div class="blog-single-head-date">
                <i class="fa fa-calendar" aria-hidden="true"></i>
                 {{ formatDate(latestPost.post_date) }}{{ latestPost.author }}
                 <button class="btn btn-default like-button no-print" @click="likePost(latestPost.url, latestPost.is_favorite)" v-if="serviceType !== 'Blog'">
                   <i class="fa fa-heart-o" id="like-icon" v-if="!latestPost.is_favorite"></i>
                   <i class="fa fa-heart" id="like-icon" v-else></i>
                 </button>
                 <button class="btn btn-default print-right no-print" @click="printPage" v-if="serviceType !== 'Blog'">
                   <i class="fa fa-print"></i>
                 </button>
               </div>
               <hr />
               <!-- Blog post forecast content -->
               <BlogPostForecast :latestPost="latestPost"/>
               <article v-html="latestPost.post_content"></article>
               <hr />
               <!-- Related content and tags -->
               <RelatedAndTags :latestPost="latestPost" class="no-print"/>
             </div>
             <!-- END INFO BLOCK -->
             <SidebarSentimentEdge v-if="serviceType !== 'Blog'" class="no-print" :categoryPosts="categoryPosts" :serviceType="serviceType" :title="title"/>
           </div>
         </div>
       </div>
       <!-- END CONTENT -->
     </div>
     <!-- END SIDEBAR & CONTENT -->
   </div>
   <AboutUs class="no-print"></AboutUs> 
 </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getBlogReportList, getBlogReportInfo, addMRFavorites, removeMRFavorites } from "@/service/service";
import { timestampToTime } from "@/utils";
import BlogPostForecast from "./component/BlogPostForecast.vue";
import RelatedAndTags from "./component/RelatedAndTags";
import SidebarSentimentEdge from "./component/SidebarSentimentEdge";
import AboutUs from "@/components/Indicators/Table/AboutUs";

export default {
 components: {
   BlogPostForecast,
   RelatedAndTags,
   SidebarSentimentEdge,
   AboutUs
 },
 data() {
  return {
   title: '',
   serviceType: '',
   latestPost: {},
   categoryPosts: []
  }
 },
 watch: {
  '$route'(to, from) {
    console.log('to', to)
    console.log('from', from)
  }
  },
 computed: {
  ...mapGetters({
    reportArchives: 'getReportArchives'
  }),
  requestedType() {
    if(this.serviceType.toLowerCase() === 'sentimentedge') return 'sentimentedge';
    else if(this.serviceType.toLowerCase() === 'quantedge' || this.serviceType.toLowerCase() === 'kaeppelscorner') return 'quantedge';
    else if(this.serviceType.toLowerCase() === 'modeledge') return 'modeledge';
    else return this.serviceType.toLowerCase();
  }
 },
 beforeRouteEnter(to, from, next) {
  console.log('to', to)
  console.log('from', from)
  const isPathSubstring = (paths, toPath) => {
    return paths.some(path => toPath.includes(path))
  }
  if (isPathSubstring([
    '/MR/sentimentedge',
    '/MR/quantedge',
    '/MR/kaeppelscorner',
    '/MR/modeledge',
    '/MR/tradingedge',
    '/MR/blog'
  ], to.path) && ['sentimentedge', 'quantedge', 'kaeppelscorner', 'modeledge', 'tradingedge','blog'].includes(to.params.serviceType)) {
    next(async _this => {
      let serviceType = to.params.serviceType
      const reportUrl = to.params.reportUrl
      if(serviceType === 'sentimentedge') {
        _this.title = 'SentimentEdge'
        _this.serviceType = 'SentimentEdge'
      }else if(serviceType === 'quantedge' || serviceType === 'kaeppelscorner') {
        _this.title = 'Kaeppel\'s Corner'
        _this.serviceType = 'quantedge'
        serviceType = 'quantedge'
      }else if(serviceType === 'modeledge') {
        _this.title = 'ModelEdge'
        _this.serviceType = 'ModelEdge'
      }else if(serviceType === 'tradingedge') {
        _this.title = 'TradingEdge'
        _this.serviceType = 'TradingEdge'
      }
      else if(serviceType === 'blog' && reportUrl) {
      }
      debugger
      /* 先拿对应的 report list 取最新的 post */
      let reportsArchivesTen = []
      debugger
      if(_this.reportArchives[serviceType]) {
        reportsArchivesTen = JSON.parse(_this.reportArchives[serviceType])
      }else {
        const {data: reports} =  await getBlogReportList({
          user_level: serviceType
        })
        _this.setReportArchives({serviceType, archives: reports.results})
        reportsArchivesTen = reports.results
      }
      const requestedBlog = reportUrl || reportsArchivesTen.slice(0, 1)[0]?.url
      const {data: latestPost} = await getBlogReportInfo(requestedBlog || '')
      _this.categoryPosts = reportsArchivesTen.slice(0, 10) || []
      if(!reportUrl) {
        latestPost.is_favorite = reportsArchivesTen.slice(0, 1)[0]?.is_favorite || false
      }else {
        const findBlog = reportsArchivesTen.find(x => x.url == requestedBlog)
        if(findBlog) latestPost.is_favorite = findBlog.is_favorite
        else {
          const {data: {results}} =  await getBlogReportList({
            url: requestedBlog
          })
          const findBlog = results.find(x => x.url == requestedBlog)
          if(findBlog) latestPost.is_favorite = findBlog.is_favorite
        }
      }
      _this.latestPost = latestPost
      console.log('_this.latestPost', _this.latestPost)
      if(serviceType === 'blog' && reportUrl) {
        _this.title = latestPost?.title
        _this.serviceType = 'Blog'
      }
    })
    } else {
      next()
    }
  },
 methods: {
  ...mapActions('states', ['setReportArchives']),
   formatDate(date) {
     if(!date) return ''
     return `${timestampToTime(date)} | `
   },
   async likePost(url, isFavorite) {
    debugger
    try {
      if(isFavorite) await removeMRFavorites(url)
      else await addMRFavorites(url)
      this.latestPost.is_favorite = !this.latestPost.is_favorite
    } catch (error) {
      console.log(error)
    }
     // 点赞按钮点击事件逻辑
     console.log(`Liked post ${url} by ${isFavorite}`);
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
 margin-top: 10px;
}
.article-des {
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-around;
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
  border-color: #ccc !important;
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
 .container{
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

.col-md-9.blog {
  width: 100%;
}
}
@media print {
  .navbar, .footer, .no-print {
    display: none;
  }

  /* 确保要打印的部分是可见的 */
  [ref="printableComponent"] {
    display: block;
  }
}
.page-head {
  padding-top: 35px;
}
</style>