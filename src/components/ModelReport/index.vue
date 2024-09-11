<template>
  <div class="ModelReport">
   <Sentimentedge :title="title" :latestPost="latestPost"></Sentimentedge>
   <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import Sentimentedge from "./Sentimentedge"
export default {
 name: 'ModelReport',
 components: {
  Sentimentedge
 },
 data() {
  return {
   title: "SentimentEdge",
   latestPost: {
    url: 'https://users.sentimentrader.com/users/sentimentedge/an-exceptionally-strong-time-for-developed-markets',
    title: 'An exceptionally strong time for developed markets',
    post_date: '2024-09-04',
    author: 'Jason Goepfert',
    post_content: '',
    forecasts: [
     {
      market: 'NASDAQ',
      forecast: 'Strong Buy',
      probability: 90,
     }
    ],
    /* tag */
    dbTags: [
      {
        id: 1,
        tag: 'Breadth'
      }
    ]
   }
  }
 }
}
</script>

<style lang="less">
@import "./index.css";

</style>