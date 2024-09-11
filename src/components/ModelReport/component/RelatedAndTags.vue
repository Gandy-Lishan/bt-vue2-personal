<template>
 <div class="blog-single-foot">
   <h3>Tagged As:</h3>
   <ul class="blog-post-tags">
     <li v-for="tag in latestPost.dbTags" :key="tag.id" class="uppercase">
       <router-link :to="{ name: 'tagged_blogs', params: { tag: tag.tag }}">
         <span v-html="tag.tag"></span>
       </router-link>
     </li>
   </ul>
 </div>
</template>

<script>
export default {
 name: 'RelatedAndTags',
 props: {
   latestPost: {
     type: Object,
     required: true,
   },
 },
};
</script>

<style scoped>
.uppercase {
 text-transform: uppercase;
}
.blog-post-tags {
  text-align: left;
  padding: 0;
  margin: 0;
  color: #a0a9b4;
  font-size: 11px;
  font-weight: 600;
  padding: 7px 10px;
}
.blog-post-tags>li {
  list-style: none;
  display: inline-block;
  margin-right: 5px;
  margin-top: 20px;
}
.blog-post-tags>li>a {
  color: #a0a9b4;
  font-size: 13px;
  font-weight: 900;
  background-color: #f4f6f8;
  padding: 7px 10px;
}
</style>