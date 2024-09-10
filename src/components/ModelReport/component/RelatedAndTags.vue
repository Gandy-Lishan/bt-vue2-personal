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
</style>