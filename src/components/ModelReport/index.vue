<template>
  <div class="ModelReport">
   <!-- <Sentimentedge :title="title" :latestPost="latestPost"></Sentimentedge> -->
   <!-- <router-view></router-view> -->
   <!-- <Archives></Archives> -->
   <!-- <BlogTags :title="blogTagsTitle" :tagPosts="tagPosts" :previousPage="previousPage" :nextPage="nextPage"></BlogTags> -->
    <!-- <ReportArchives :title="reportArchivesTitle" :dailyReportBlogs="dailyReportBlogs"></ReportArchives> -->
    <!-- <ActiveStudies
     :title="archivesStudies"
     :showStudySubForm="true"
     :premium="'premium'"
     :userSubActiveStudy="true"
     :shortTermBullish="0"
     :shortTermBearish="0"
     :medTermBullish="0"
     :medTermBearish="0"
     :longTermBullish="0"
     :longTermBearish="0"
     :forecasts="forecasts"
    ></ActiveStudies> -->
    <ArchivedStudies
     :title="'Archived Studies'"
    >

    </ArchivedStudies>
  </div>
</template>

<script>
import Sentimentedge from "./Sentimentedge"
import Archives from "./Archives";
import BlogTags from "./BlogTags";
import ReportArchives from "./ReportArchives";
import ActiveStudies from "./ActiveStudies";
import ArchivedStudies from "./ArchivedStudies";

export default {
 name: 'ModelReport',
 components: {
  Sentimentedge,
  Archives,
  BlogTags,
  ReportArchives,
  ActiveStudies,
  ArchivedStudies
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
   },
   blogTagsTitle: 'Posts tagged ad Price Pattern',
   tagPosts: [
    {
      title: 'Beware beans',
      post_date: '2024-09-10',
      author: 'Jason Goepfert',
      meta_description: '',
      post_content: 'The approach of harvest season means there is little mystery regarding the nature of the current year\'s soybean crop. This situation typically leads to a lot of risk premium leaving the market as hedges are unwound. This can create a solid opportunity for speculators willing to play the short side.',
      url: 'https://sentimentrader.com/blog/the-nasdaq-quickly-falls-back-into-a-correction',
      dbTags: [
        {
          id: 1,
          tag: 'Price Pattern'
        }
      ]
    },
    {
      title: 'Beware beans',
      post_date: '2024-09-10',
      author: 'Jason Goepfert',
      meta_description: '',
      post_content: 'The approach of harvest season means there is little mystery regarding the nature of the current year\'s soybean crop. This situation typically leads to a lot of risk premium leaving the market as hedges are unwound. This can create a solid opportunity for speculators willing to play the short side.',
      url: 'https://sentimentrader.com/blog/the-nasdaq-quickly-falls-back-into-a-correction',
      dbTags: [
        {
          id: 1,
          tag: 'Price Pattern'
        }
      ]
    }
   ],
   previousPage: 1,
   nextPage: 3,
   reportArchivesTitle: 'Archived Reports for 2024',
   dailyReportBlogs: [
    {
      title: 'Daily Report : The Nasdaq quickly falls back into a correction',
      post_date: '2024-09-10',
      meta_description: '',
      post_content: 'The Nasdaq Composite and Nasdaq 100 both suffered corrections in August, partially recovering during torrid rallies, then fell back into correction territory. This has not been a sign of smart money distribution. Rather, both indexes had a strong tendency to rebound in the months ahead, with almost exclusive gains over the next 6-12 months.'
    },
    {
      title: 'Daily Report : The Nasdaq quickly falls back into a correction',
      post_date: '2024-09-10',
      meta_description: '',
      post_content: 'The Nasdaq Composite and Nasdaq 100 both suffered corrections in August, partially recovering during torrid rallies, then fell back into correction territory. This has not been a sign of smart money distribution. Rather, both indexes had a strong tendency to rebound in the months ahead, with almost exclusive gains over the next 6-12 months.'
    },
    {
      title: 'Daily Report : The Nasdaq quickly falls back into a correction',
      post_date: '2024-09-10',
      meta_description: '',
      post_content: 'The Nasdaq Composite and Nasdaq 100 both suffered corrections in August, partially recovering during torrid rallies, then fell back into correction territory. This has not been a sign of smart money distribution. Rather, both indexes had a strong tendency to rebound in the months ahead, with almost exclusive gains over the next 6-12 months.'
    }
   ],
   forecasts: [
     {
      market: 'NASDAQ',
      forecast: 'Strong Buy',
      probability: 90,
      index: 'test-blog',
      filename: 'test-blog.png'
     }
    ],
    archivesStudies: 'Archived Studies',
  }
 }
}
</script>

<style lang="less">
@import "./index.css";
</style>