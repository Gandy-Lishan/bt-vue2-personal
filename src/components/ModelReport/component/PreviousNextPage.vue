<template>
 <div class="pagination-container" style="display:flex;justify-content:space-between;">
   <!-- 上一页 -->
   <a 
     v-if="previousPage" 
     class="btn grey-cascade" 
     style="align-self:center" 
     :href="getPageUrl(previousPage)"
   >
     &larr; previous page
   </a>

   <div class="pagination" style="flex-grow:1;text-align:center">
     <!-- 显示第一页的链接，如果当前页不在第一页 -->
     <a 
       v-if="currentPage > 5" 
       class="btn grey-cascade" 
       :href="getPageUrl(1)"
     >
       1
     </a>

     <span v-if="currentPage > 6">...</span>

     <!-- 显示当前页前的两页 -->
     <a 
       v-for="pageNum in getPageRange(currentPage - 4, currentPage - 1)" 
       :key="pageNum" 
       v-if="pageNum > 0" 
       class="btn grey-cascade" 
       :href="getPageUrl(pageNum)"
     >
       {{ pageNum }}
     </a>

     <!-- 当前页 -->
     <a class="btn grey-cascade active" href="#">{{ currentPage }}</a>

     <!-- 显示当前页后的两页 -->
     <a 
       v-for="pageNum in getPageRange(currentPage + 1, currentPage + 4)" 
       :key="pageNum" 
       v-if="pageNum <= total" 
       class="btn grey-cascade" 
       :href="getPageUrl(pageNum)"
     >
       {{ pageNum }}
     </a>

     <!-- 显示最后一页的链接，如果当前页不在最后几页 -->
     <span v-if="currentPage < total - 5">...</span>
     <a 
       v-if="currentPage < total - 4" 
       class="btn grey-cascade" 
       :href="getPageUrl(total)"
     >
       {{ total }}
     </a>
   </div>

   <!-- 下一页 -->
   <a 
     v-if="nextPage" 
     class="btn grey-cascade" 
     style="float:right;align-self:center" 
     :href="getPageUrl(nextPage)"
   >
     next page &rarr;
   </a>
 </div>
</template>

<script>
export default {
  name: 'PreviousNextPage',
 props: {
   currentPage: {
     type: Number,
     required: true
   },
   previousPage: {
     type: Number,
     default: null
   },
   nextPage: {
     type: Number,
     default: null
   },
   total: {
     type: Number,
     required: true
   },
   serviceType: {
     type: String,
     required: true
   }
 },
 methods: {
   getPageUrl(pageNumber) {
     // 根据具体路由需求生成 URL，这里假设使用 Vue Router
     return this.$router.resolve({ name: 'YourRouteName', params: { service: this.serviceType, page_number: pageNumber }}).href;
   },
   getPageRange(start, end) {
     let range = [];
     for (let i = start; i <= end; i++) {
       range.push(i);
     }
     return range;
   }
 }
};
</script>

<style scoped>
/* 样式根据需求自定义 */
a {
  background: 0 0;
}
a:hover {
 	font-weight: unset;
}
.btn {
  border-width: 0;
  padding: 7px 14px;
  outline: 0;
  filter: none;
  box-shadow: none;
  text-shadow: none;
}
.pagination {
  margin: 10px 0;
}
.pagination {
  display: inline-block;
  padding-left: 0;
  border-radius: 4px;
}
.pagination a {
    margin: 0 2px;
  }
</style>