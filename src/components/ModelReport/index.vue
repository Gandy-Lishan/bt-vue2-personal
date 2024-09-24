<template>
  <div class="ModelReport">
    <div class="container">
      <div class="strategy-header MRHeader" :class="{ 'fixed': isHeaderFixed }" ref="MRHeader">
        <div class="tableHeader">
          <div class="headerSelect">
            <a :href="`/MR/sentimentedge`">
              <h4 @click="selectedTitle = 'sentimentedge'" :class="{ 'selected': selectedTitle === 'sentimentedge' }">SentimentEdge</h4>
            </a>
            <a :href="`/MR/modeledge`">
              <h4 @click="selectedTitle = 'modeledge'" :class="{ 'selected': selectedTitle === 'modeledge' }">ModelEdge</h4>
            </a>
            <a :href="`/MR/kaeppelscorner`">
              <h4 @click="selectedTitle = 'kaeppelscorner'" :class="{ 'selected': selectedTitle === 'kaeppelscorner' }">Kaeppel's Corner</h4>
            </a>
            <a :href="`/MR/tradingedge`">
              <h4 @click="selectedTitle = 'tradingedge'" :class="{ 'selected': selectedTitle === 'tradingedge' }">TradingEdge</h4>
            </a>
            <a :href="`/MR/favorites`">
              <h4 @click="selectedTitle = 'favorites'" :class="{ 'selected': selectedTitle === 'favorites' }">My Favorites</h4>
            </a>
            <a :href="`/MR/archived_studies`">
              <h4 @click="selectedTitle = 'archived_studies'" :class="{ 'selected': selectedTitle === 'archived_studies' }">Archived Studies</h4>
            </a>
            <a :href="generatedLink()">
              <h4 :class="{ 'selected': selectedTitle === 'archived_reports' }">Daily Report</h4>
            </a>
            <a :href="`/MR/active_studies`">
              <h4 @click="selectedTitle = 'active_studies'" :class="{ 'selected': selectedTitle === 'active_studies' }">Active Studies</h4>
            </a>
          </div>
          <div class="search-container">
            <Search></Search>
          </div>
        </div>
      </div>
    </div>
   <!-- <Sentimentedge :title="title" :latestPost="latestPost"></Sentimentedge> -->
   <!-- <router-view></router-view> -->
   <!-- <Archives></Archives>
   <BlogTags :title="blogTagsTitle" :tagPosts="tagPosts" :previousPage="previousPage" :nextPage="nextPage"></BlogTags>
    <ReportArchives :title="reportArchivesTitle" :dailyReportBlogs="dailyReportBlogs"></ReportArchives>
    <ActiveStudies
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
    ></ActiveStudies>
    <ArchivedStudies
     :title="'Archived Studies'"
    >
    </ArchivedStudies> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Sentimentedge from "./Sentimentedge"
import Archives from "./Archives";
import BlogTags from "./BlogTags";
import ReportArchives from "./ReportArchives";
import ActiveStudies from "./ActiveStudies";
import ArchivedStudies from "./ArchivedStudies";
import { getBlogReportList, getBlogReportInfo } from "@/service/service";

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
    selectedTitle: 'sentimentedge',
    currentYear: (new Date()).getFullYear(),
    isHeaderFixed: false,
    lastScrollY: 0,
    scrollingUp: false,
  }
 },
 watch: {
  '$route'(to, from) {
    console.log('to', to)
    console.log('from', from)
  }
  },
  computed: {
    currentYear() {
      const path = this.$route.path
      if(path.includes('/MR/blog/daily_report')) {
        const year = path.match(/(\d{4})$/)[0]
        this.selectedTitle = 'archived_reports'
        return `/MR/archived_reports/${year}`
      }else {
        return `/MR/archived_reports/${this.currentYear}`
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
 beforeRouteEnter(to, from, next) {
  const isPathSubstring = (paths, toPath) => {
    return paths.some(path => toPath.includes(path))
  }
  if (isPathSubstring([
    '/MR/sentimentedge',
    '/MR/kaeppelscorner',
    '/MR/modeledge',
    '/MR/tradingedge',
    '/MR/archives/sentimentedge',
    '/MR/archives/kaeppelscorner',
    '/MR/archives/modeledge',
    '/MR/archives/tradingedge',
    '/MR/blog',
    '/MR/archived_reports',
    '/MR/active_studies',
    '/MR/archived_studies',
    '/MR/favorites'
  ], to.path)) {
    next(async _this => {
      if(isPathSubstring(['/MR/sentimentedge', '/MR/archives/sentimentedge'], to.path)) _this.selectedTitle = 'sentimentedge'
      if(isPathSubstring(['/MR/kaeppelscorner', '/MR/archives/kaeppelscorner'], to.path)) _this.selectedTitle = 'kaeppelscorner'
      if(isPathSubstring(['/MR/modeledge', '/MR/archives/modeledge'], to.path)) _this.selectedTitle = 'modeledge'
      if(isPathSubstring(['/MR/tradingedge', '/MR/archives/tradingedge'], to.path)) _this.selectedTitle = 'tradingedge'
      if(isPathSubstring(['/MR/blog', '/MR/archived_reports'], to.path)) {
        _this.selectedTitle = 'archived_reports'
      }
      if(isPathSubstring(['/MR/active_studies'], to.path)) _this.selectedTitle = 'active_studies'
      if(isPathSubstring(['/MR/archived_studies'], to.path)) _this.selectedTitle = 'archived_studies'
      if(isPathSubstring(['/MR/favorites'], to.path)) _this.selectedTitle = 'favorites'
    })
    } else {
      next(_this => {
        _this.selectedTitle = 'sentimentedge'
        _this.$router.push({
          path: '/MR/sentimentedge'
        })
      })
    }
  },
  methods: {
    changeSelectTitle() {
      console.log('route', this.$route.path)
      const path = this.$route.path
      if(path.includes('/MR/blog/daily_report')) {
        const year = path.match(/(\d{4})$/)[0]
        this.selectedTitle = 'archived_reports'
        this.$router.push({
          path: `/MR/archived_reports/${year}`
        })
      }else {
        this.$router.push({
          path: `/MR/archived_reports/${this.currentYear}`
        })
      }
    },
    generatedLink() {
      // 动态生成的跳转链接
      const path = this.$route.path;
      let year;

      if (path.includes('/MR/blog/daily_report')) {
        year = path.match(/(\d{4})$/)[0];
        this.selectedTitle = 'archived_reports';
        return `/MR/archived_reports/${year}`;
      } else {
        return `/MR/archived_reports/${this.currentYear}`;
      }
    },
    handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > this.lastScrollY) {
        // 向上滚动，显示并固定 header
        this.scrollingUp = true;
        this.isHeaderFixed = true;
      } else {
        // 向下滚动，隐藏 header
        this.scrollingUp = false;
        this.isHeaderFixed = false;
      }

      this.lastScrollY = currentScrollY;
    },
  }
}
</script>

<style lang="less" scoped>
@import "./index.css";

.strategy-header {
	display: flex;
	align-items: flex-end;
  justify-content: center;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
	.tableHeader {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
	}
	.searchBox {
    display: flex;
    align-content: flex-end;
    margin-left: 20px;
    .el-select .el-input__inner {
      width: 180px;
    }
	}
	h4 {
    margin: 0 5px;
    padding: 10px 0;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    &:hover{
        color: #1d4ed7;
    }
    &.selected {
      border-bottom: 4px solid #1d4ed7;
      color: #1d4ed7;
    }
	}
	.headerSelect {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    a {
      text-decoration: none;
      color: #333;
    }
	}
	.btns {
    display: flex;
    justify-content: space-between;
    button.el-button.el-button--primary.el-button--mini {
      width: 145px;
    }
	}
}
// .strategy-header {
//   position: relative;
// }
.MRHeader {
  position: absolute;
  top: 60px;
  left: 0;
  z-index: 2000;
  width: 100%;
  transition: transform 0.3s ease; /* 平滑的过渡效果 */
}
.MRHeader.fixed {
  top: 79px;
}

.MRHeader.fixed {
  position: fixed;
  transform: translateY(0); /* 固定在页面顶部 */
}

.MRHeader:not(.fixed) {
  transform: translateY(-100%); /* 隐藏 header */
  box-shadow: none;
  position: relative;
  border-bottom: 2px solid rgba(233, 233, 233);
}
@media (min-width: 768px) {
  .strategy-header.fixed .tableHeader {
    width: 750px;
  }
}
@media (min-width: 992px) {
  .strategy-header.fixed .tableHeader {
    width: 970px;
  }
}
@media (min-width: 1200px) {
  .strategy-header.fixed .tableHeader {
    width: 1170px;
  }
}
</style>