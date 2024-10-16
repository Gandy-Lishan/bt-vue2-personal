<template>
 <div class="pagination-container" style="display:flex;justify-content:space-between;">
   <!-- 上一页 -->
   <a 
     v-if="currentPage > 1" 
     class="btn grey-cascade" 
     style="align-self:center" 
     :href="`/MR/${requestedType}/${currentPage - 1}`"
   >
     Previous
   </a>

   <div class="pagination" style="flex-grow:1;text-align:center">
     <!-- 显示第一页的链接，如果当前页不在第一页 -->
     <a 
       v-if="currentPage > 5" 
       class="btn grey-cascade" 
       :href="`/MR/${requestedType}`"
     >
       1
     </a>

     <span v-if="currentPage > 6">...</span>

     <!-- 显示当前页前的两页 -->
      <template v-for="pageNum in getPageRange(currentPage - 4, currentPage)">
        <a 
          v-if="pageNum > 0 && pageNum != currentPage"
          :key="pageNum" 
          class="btn grey-cascade" 
          :href="`/MR/${requestedType}/${pageNum}`"
        >
          {{ pageNum }}
        </a>
      </template>

     <!-- 当前页 -->
     <a class="btn grey-cascade active" href="#">{{ currentPage }}</a>

     <!-- 显示当前页后的两页 -->
        <a 
        v-for="pageNum in getPageRange(currentPage + 1, currentPage + 5)" 
        v-if="pageNum <= total"
        :key="pageNum" 
        class="btn grey-cascade" 
        :href="`/MR/${requestedType}/${pageNum}`"
        >
          {{ pageNum }}
        </a>

     <!-- 显示最后一页的链接，如果当前页不在最后几页 -->
     <span v-if="currentPage < total - 5">...</span>
     <a 
       v-if="currentPage < total - 4"
       class="btn grey-cascade" 
       :href="`/MR/${requestedType}/${total}`"
     >
       {{ total }}
     </a>
   </div>

   <!-- 下一页 -->
   <a 
     v-if="nextPage" 
     class="btn grey-cascade" 
     style="float:right;align-self:center" 
     :href="`/MR/${this.requestedType}/${nextPage}`"
   >
     Next
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
 computed: {
   requestedType() {
    if(this.serviceType.toLowerCase() === 'sentimentedge') return 'archives/sentimentedge';
    else if(this.serviceType.toLowerCase() === 'quantedge') return 'archives/quantedge';
    else if(this.serviceType.toLowerCase() === 'modeledge') return 'archives/modeledge';
    else return this.serviceType.toLowerCase();
   }
 },
 methods: {
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