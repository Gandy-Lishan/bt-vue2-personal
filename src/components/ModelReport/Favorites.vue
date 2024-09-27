<template>
 <div :class="bodyClass">
   <div class="main">
     <div class="container">
       <div class="row margin-bottom-40">
         <div class="col-md-12 col-sm-12">
           <div class="content-page">
             <div class="page-head">
               <!-- <h1 class="page-title">{{ title }}</h1> -->
               <div class="date-picker">
                 <el-date-picker
                   v-model="start_date"
                   type="date"
                   size="small"
                   @change="changeDate"
                  value-format="yyyy-MM-dd"
                  :picker-options="startPickerOptions"
                   placeholder="Select Start Date">
                 </el-date-picker>
                 <span class="date-picker-span">-</span>
                 <el-date-picker
                   v-model="end_date"
                   type="date"
                   size="small"
                   @change="changeDate"
                  value-format="yyyy-MM-dd"
                 :picker-options="endPickerOptions"
                   placeholder="Select End Date">
                 </el-date-picker>
               </div>
             <Search></Search>
             </div>
             <hr />
             <div class="row margin-bottom-30">
               <div class="col-md-12">
                 <div
                   v-if="serviceType === 'sentimentedge'"
                   class="analysis_solutions_yellow"
                 >
                   <img
                     align="center"
                     alt=""
                     src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/50434469-0496-c58b-44b7-4c1817cf1dac.png"
                     width="564"
                     style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                     class="mcnImage"
                   />
                 </div>
                 <div
                   v-else-if="serviceType === 'modeledge'"
                   class="analysis_solutions_yellow"
                 >
                   <img
                     align="center"
                     alt=""
                     src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/c317db3d-2d06-155d-5c53-b1abfba1bb3d.png"
                     width="564"
                     style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                     class="mcnImage"
                   />
                 </div>
                 <div
                   v-else-if="serviceType === 'quantedge'"
                   class="analysis_solutions_yellow"
                 >
                   <img
                     align="center"
                     alt=""
                     src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/13d4bb49-034a-7505-dba1-d8f33133b5a0.png"
                     width="564"
                     style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                     class="mcnImage"
                   />
                 </div>
                 <div
                   v-else-if="serviceType === 'portfolioedge'"
                   class="invest_solutions_green"
                 >
                   <img
                     align="center"
                     alt=""
                     src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/ae301b79-bc04-0f2a-a9f7-63a79fba0209.png"
                     width="564"
                     style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                     class="mcnImage"
                   />
                 </div>
                 <div
                   v-else-if="serviceType === 'tradingedge'"
                   class="analysis_solutions_yellow"
                 >
                   <img
                     align="center"
                     alt=""
                     src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/cc8eb3aa-99a2-9543-8161-126926d8506e.png"
                     width="564"
                     style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                     class="mcnImage"
                   />
                 </div>

                 <div v-if="messages.length" class="alert alert-success">
                   <strong v-for="message in messages" :key="message">{{ message }}</strong>
                 </div>

                 <div class="row" style="padding:10px">
                   <div
                     class="blog-sing
                     e-head"
                     v-for="post in blogPosts"
                     :key="post.url"
                   >
                     <h1 class="blog-single-head-title">
                       <a  href="javascript:void(0)" @click.prevent="goToModelReport(post.url)">
                         {{ post.title }}
                       </a>
                       <!-- <router-link :to="{ name: 'blogPost', params: { slug: post.url } }">
                         {{ post.title }}
                       </router-link> -->
                     </h1>
                     <div class="blog-single-head-date">
                      <i class="fa fa-calendar" aria-hidden="true"></i>
                       {{ formatDate(post.post_date) }}
                       <span>
                         | {{post.author}}
                       </span>
                       <button class="btn btn-default like-button no-print" @click="likePost(post.url, true)" title="Unlike this post">
                          <i class="fa fa-heart" id="like-icon"></i>
                        </button>
                     </div>
                     <div class="row" style="margin-bottom:10px;">
                         <article>
                           <img
                             v-if="post.image"
                             class="thumbnail"
                             style="margin-right:10px;margin-top:10px;"
                             height="200"
                             width="267"
                             :src="post.image"
                             align="left"
                           />
                           <span v-if="post.meta_description">
                             {{ post.meta_description }}
                           </span>
                           <span v-else v-html="truncate(post.post_content, 500)">
                           </span>
                         </article>
                     </div>
                   </div>
                 </div>

                 <PreviousNextPage :previousPage="previousPage" :currentPage="currentPage" :nextPage="nextPage" :total="total" :serviceType="serviceType" />
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
import { timestampToTime } from "@/utils";
import { getMRFavoritesList, getBlogReportInfo, removeMRFavorites} from "@/service/service";
import PreviousNextPage from './component/PreviousNextPage';
import Search from "./component/Search";

export default {
 name: 'Favorites',
 data() {
   return {
     title: 'My Favorites', // 从服务器获取的标题
     messages: [], // 消息数组
     previousPage: null,
     currentPage: 1, // 当前页码
     nextPage: 2,
     total: 0,
     serviceType: 'favorites',
     blogPosts: [],
     start_date: null,
     end_date: null,
     startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
   };
 },
 beforeRouteEnter(to, from, next) {
  const isPathSubstring = (paths, toPath) => {
    return paths.some(path => toPath.includes(path))
  }
 if ((isPathSubstring(['/MR/favorites'], to.path))) {
   next(async _this => {
     const page = to.params.page || ''
     debugger
     const {data: {results, count, previous, next}} = await getMRFavoritesList({
      start_date: _this.start_date,
      end_date: _this.end_date,
      page: !page ? _this.currentPage : page
     })
     const getPageValue = (url) => {
        if(url === null) return url
        const regex = /[?&]page=(\d+)/
        const match = url.match(regex)
        return match ? match[1] : null
      }
      _this.total = Math.ceil(Number(count) / 10)
      _this.previousPage = getPageValue(previous)
      _this.nextPage = getPageValue(next)
      if(_this.nextPage) _this.currentPage = (Number(_this.nextPage) - 1)
      if(page) _this.currentPage = Number(page)
      _this.blogPosts = results
     
   })
   } else {
     next()
   }
 },
 components: {
    PreviousNextPage,
    Search
  },
 computed: {
   bodyClass() {
     return 'page-sidebar-closed-hide-logo';
   }
 },
 methods: {
  async goToModelReport(url) {
    const {data: latestPost } = await getBlogReportInfo(url)
    console.log(latestPost.user_level);
    window.location.href = `/MR/${latestPost.user_level}/${url}`;
  },
   formatDate(date) {
    if(!date) return ''
    return `${timestampToTime(date)}`
   },
   truncate(text, length) {
     // 实现字符串截断逻辑
     return text.length > length ? text.slice(0, length) + '...' : text;
   },
   handleDisabledStartDate(time) {
      const today = timestampToTime(new Date())
      const endDay = timestampToTime(new Date(this.end_date))
      // 如果endDate取消选择，则startDate可以选择全部
      if(this.end_date){
        return timestampToTime(time) >= endDay
      }else{
        return (timestampToTime(time) > today)
      }
    },
    handleDisabledEndDate(time) {
      const today = timestampToTime(new Date())
      const startDay = timestampToTime(new Date(this.start_date))
      return (timestampToTime(time) > today) || (timestampToTime(time) <= startDay)
    },
   async changeDate(val) {
     console.log(val);
     console.log(this.start_date, this.end_date);
     const _this = this
     const page = this.$route.params.page
     const {data: {results, count, previous, next}} = await getMRFavoritesList({
       page: !page ? _this.currentPage : page,
       start_date: _this.start_date,
       end_date: _this.end_date
     })

     const getPageValue = (url) => {
       if(url === null) return url
       const regex = /[?&]page=(\d+)/
       const match = url.match(regex)
       return match ? match[1] : null
     }
     _this.total = Math.ceil(Number(count) / 10)
     _this.previousPage = getPageValue(previous)
     _this.nextPage = getPageValue(next)
     if(_this.nextPage) _this.currentPage = (Number(_this.nextPage) - 1)
     if(page) _this.currentPage = Number(page)
     _this.blogPosts = results
   },
   async likePost(url, isFavorite) {
    const _this = this
    try {
      await removeMRFavorites(url)
      const {data: {results, count, previous, next}} = await getMRFavoritesList({
      start_date: _this.start_date,
      end_date: _this.end_date,
      page: _this.currentPage
     })
     const getPageValue = (url) => {
        if(url === null) return url
        const regex = /[?&]page=(\d+)/
        const match = url.match(regex)
        return match ? match[1] : null
      }
      _this.total = Math.ceil(Number(count) / 10)
      _this.previousPage = getPageValue(previous)
      _this.nextPage = getPageValue(next)
      if(_this.nextPage) _this.currentPage = (Number(_this.nextPage) - 1)
      _this.blogPosts = results
    } catch (error) {
      console.log(error)
    }
   },
 }
};
</script>

<style less scoped >
a:hover {
 font-weight: unset;
}
/* 保留原有的 CSS 样式 */
.aa-dropdown-menu {
 margin-top: 0px !important;
 width: 100% !important;
 border-radius: 0px !important;
}

.algolia-autocomplete {
 width: 100%;
 min-width: 100%;
}

.aa-input-search {
 margin: 10px 0px;
 width: 100% !important;
}

#aa-blog-search-input {
 background-image: -webkit-linear-gradient(
   hsla(0, 0%, 100%, 0),
   hsla(0, 0%, 100%, 0)
 );
}

.analysis_solutions_yellow {
 background-color: #fbc01f;
}

.invest_solutions_green {
 background-color: #009769;
}
.date-picker /deep/ .el-input--prefix .el-input__inner {
  margin-left: 0px;
}
.date-picker /deep/ .el-input--suffix .el-input__inner {
  margin-left: 0px;
}
.date-picker .date-picker-span {
  margin: 0px 5px;
}
.page-head {
  display: flex;
  padding-top: 35px;
  align-items: center;
  justify-content: space-between;
}
.like-button {
  position: static;
}
</style>
