<template>
 <div class="main">
   <div class="container">
     <!-- BEGIN SIDEBAR & CONTENT -->
     <div class="row margin-bottom-40">
       <!-- BEGIN CONTENT -->
       <div class="col-md-12 col-sm-12">
         <div class="content-page">
          <div class="page-head">
            <!-- <h1 v-html="title" class="page-title"></h1> -->
          </div>
           <!-- <hr /> -->
           <div class="row margin-bottom-30">
             <!-- BEGIN INFO BLOCK -->
             <div class="col-md-12">
               <div v-for="post in tagPosts" :key="post.url">
                 <a :href="`https://users.sentimentrader.com/blog/${post.url}`">
                   <h2 v-html="post.title"></h2>
                 </a>
                 <div class="blog-single-head-date">
                   <i class="icon-calendar font-bluesteel"></i>
                   {{ formatDate(post.post_date) }}{{ post.author }}
                 </div>
                 <br /><br />

                 <article>
                   <p v-if="post.meta_description">
                     {{ post.meta_description }}
                   </p>
                   <p v-else v-html="truncate(post.post_content, 300)"></p>

                   <!-- Read more -->
                   <!-- <ReadMore /> -->
                   <a class="btn grey-cascade" :href="`https://users.sentimentrader.com/blog/${post.url}`">Read More ... </a>
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
   <div class="pre-footer">
      <div class="container">
          <div style="text-align: center;"><img alt="" src="../../assets/as-seen-on_transparent.webp" width="1200px" height="277px"></div>
          <br><br><br>
        </div>
    </div>
    <AboutUs></AboutUs>
 </div>
</template>

<script>
// import ReadMore from '@/components/ReadMore.vue'; // 引入组件
import AboutUs from "@/components/Indicators/Table/AboutUs";
import { timestampToTime } from "@/utils";
import { getBlogReportList, getBlogReportInfo } from "@/service/service";

export default {
  name: 'BlogTags',
 components: {
  AboutUs,
 },
 data() {
  return {
    title: '',
    tagPosts: [],
    previousPage: null,
    nextPage: null,
  }
  },
 beforeRouteEnter(to, from, next) {
  console.log('to.params.serviceType', to.params)
  debugger
  if (to.path.includes('/MR/tags')) {
    next(async _this => {
      const blogTag = to.params.blogTag
      const page = to.params.page
      const {data: reports} =  await getBlogReportList({
        blog_tags: blogTag,
        page
      })
      const {next, previous, results} = reports
      _this.title =`Posts tagged as ${blogTag}${page ? `- Page ${page}` : ''}`
      const getPageValue = (url) => {
        if(url === null) return url
        const regex = /[?&]page=(\d+)/
        const match = url.match(regex)
        return match ? match[1] : null
      }
      _this.previousPage = getPageValue(previous)
      _this.nextPage = getPageValue(next)
      _this.tagPosts = results
    })
    } else {
      next()
    }
  },
 methods: {
   getPageUrl(pageNumber) {
     // 使用 Vue Router 生成分页 URL
     return this.$router.resolve({ path: `/MR/blog/${this.requestedType}/${pageNumber}`}).href;
   },
   formatDate(date) {
     if(!date) return ''
     return `${timestampToTime(date)} | `
   },
   truncate(text, length) {
     // 文本截断逻辑
     if (text.length > length) {
       return text.substring(0, length) + '...';
     }
     return text;
   },
 }
}
</script>

<style scoped>
.page-head {
  padding-top: 20px;
}
</style>