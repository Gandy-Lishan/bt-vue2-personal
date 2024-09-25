<template>
 <div class="col-md-3 blog-single-sidebar bordered blog-container">
   <h3 class="">Previous Research</h3>
   <div v-for="post in categoryPosts" :key="post.id">
     <a :href="`/MR/${requestedType}/${post.url}`">
       <h4 v-html="post.title"></h4>
     </a>
   </div>
   <hr />
   <button class="btn btn-block analysis_solutions_yellow">
     <a :href="`/MR/archives/${requestedType}`" style="color: #000000">
       View the {{ title }} Archives
     </a>
   </button>
 </div>
</template>

<script>
import { timestampToTime } from "@/utils";

export default {
 name: 'SidebarSentimentEdge',
 props: {
   categoryPosts: {
     type: Array,
     required: true,
   },
   title: {
     type: String,
     required: true,
   },
   serviceType: {
     type: String,
     required: true,
   },
 },
 computed: {
   requestedType() {
    if(this.serviceType.toLowerCase() === 'sentimentedge') return 'sentimentedge';
    else if(this.serviceType.toLowerCase() === 'quantedge') return 'quantedge';
    else if(this.serviceType.toLowerCase() === 'modeledge') return 'modeledge';
    else return this.serviceType.toLowerCase();
   }
 },
 methods: {
   formatDate(date) {
     if(!date) return ''
     return `${timestampToTime(date)} | `
   },
   truncate(text, length) {
     return text.length > length ? text.substring(0, length) + '...' : text;
   },
 },
};
</script>

<style scoped>
a:hover {
 	font-weight: unset;
}
</style>