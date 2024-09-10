<template>
 <div class="col-md-3 blog-single-sidebar bordered blog-container">
   <h3>Previous Research</h3>
   <div v-for="post in categoryPosts" :key="post.id">
     <router-link :to="{ name: 'sentimentedge_post', params: { slug: post.url }}">
       <h4 v-html="post.title"></h4>
     </router-link>
   </div>
   <hr />
   <button class="btn btn-block analysis_solutions_yellow">
     <router-link :to="{ name: 'blog', params: { service: serviceType } }" style="color: #000000">
       View the {{ title }} Archives
     </router-link>
   </button>
 </div>
</template>

<script>
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
 methods: {
   formatDate(date) {
     const options = { year: 'numeric', month: 'long', day: 'numeric' };
     return new Date(date).toLocaleDateString(undefined, options);
   },
   truncate(text, length) {
     return text.length > length ? text.substring(0, length) + '...' : text;
   },
 },
};
</script>

<style scoped>
.analysis_solutions_yellow {
 background-color: #fbc01f;
}
</style>