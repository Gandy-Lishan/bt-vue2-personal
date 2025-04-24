<template>
  <div class="ModelReport">
    <div class="strategy-header no-print">
      <div class="tableHeader">
        <div class="headerSelect">
          <a
            v-for="(item, index) in navItems"
            :key="item.value"
            :href="item.link"
            :style="{ marginRight: navItems.length <= 5 ? '10px' : '0' }"
          >
            <h4
              @click="handleClick(item)"
              :class="{ selected: selectedTitle === item.value }"
            >
              {{ item.label }}
            </h4>
          </a>
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
import { getCookieData } from "@/utils/cryptoUtils/cookie";
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
   reportArchivesTitle: 'Archived Reports for 2025',
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
    navItems: [
      { value: 'sentimentedge', label: 'SentimentEdge', link: '/MR/sentimentedge' },
      { value: 'modeledge', label: 'ModelEdge', link: '/MR/modeledge' },
      { value: 'quantedge', label: "Kaeppel's Corner", link: '/MR/quantedge' },
      { value: 'tradingedge', label: 'TradingEdge', link: '/MR/tradingedge' },
      { value: 'favorites', label: 'My Favorites', link: '/MR/favorites' },
      { value: 'archived_studies', label: 'Archived Studies', link: '/MR/archived_studies' },
      { value: 'archived_reports', label: 'Daily Report', link: '' }, // link 由函数生成
      { value: 'active_studies', label: 'Active Studies', link: '/MR/active_studies' }
    ]
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
    debugger
    const access_level = getCookieData()?.access_level
		const coreliteUser = access_level.some(item => item.includes('corelite'))
		const reportsUser = access_level.some(item => item.includes('reports'))
		if(coreliteUser || reportsUser) {
      this.navItems = [
        { value: 'sentimentedge', label: 'SentimentEdge', link: '/MR/sentimentedge' },
        { value: 'modeledge', label: 'ModelEdge', link: '/MR/modeledge' },
        { value: 'quantedge', label: "Kaeppel's Corner", link: '/MR/quantedge' }
      ]
    }
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
    '/MR/quantedge',
    '/MR/modeledge',
    '/MR/tradingedge',
    '/MR/archives/sentimentedge',
    '/MR/archives/quantedge',
    '/MR/archives/modeledge',
    '/MR/archives/tradingedge',
    '/MR/blog',
    '/MR/archived_reports',
    '/MR/active_studies',
    '/MR/archived_studies',
    '/MR/old_archived_reports',
    '/MR/favorites'
  ], to.path)) {
    next(async _this => {
      if(isPathSubstring(['/MR/sentimentedge', '/MR/archives/sentimentedge'], to.path)) _this.selectedTitle = 'sentimentedge'
      if(isPathSubstring(['/MR/quantedge', '/MR/archives/quantedge'], to.path)) _this.selectedTitle = 'quantedge'
      if(isPathSubstring(['/MR/modeledge', '/MR/archives/modeledge'], to.path)) _this.selectedTitle = 'modeledge'
      if(isPathSubstring(['/MR/tradingedge', '/MR/archives/tradingedge'], to.path)) _this.selectedTitle = 'tradingedge'
      if(isPathSubstring(['/MR/blog', '/MR/archived_reports', 'old_archived_reports'], to.path)) {
        _this.selectedTitle = 'archived_reports'
      }
      if(isPathSubstring(['/MR/active_studies'], to.path)) _this.selectedTitle = 'active_studies'
      if(isPathSubstring(['/MR/archived_studies'], to.path)) _this.selectedTitle = 'archived_studies'
      if(isPathSubstring(['/MR/favorites'], to.path)) _this.selectedTitle = 'favorites'
    })
    } else {
      next(_this => {
        if(!to.path.includes('/MR/tags')) {
          _this.selectedTitle = 'sentimentedge'
          _this.$router.push({
            path: '/MR/sentimentedge'
          })
        }
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
    generatedMRLink() {
      // 自定义生成 Daily Report 的链接
      const path = this.$route.path
      if(path.includes('/MR/blog/daily_report')) {
        const year = path.match(/(\d{4})$/)[0]
        this.selectedTitle = 'archived_reports'
        return `/MR/archived_reports/${year}`
      }else {
        return `/MR/archived_reports/${this.currentYear}`
      }
    },
    handleClick(item) {
      this.selectedTitle = item.value;
      // 对于 Daily Report 特殊处理
      if (item.value === 'archived_reports') {
        item.link = this.generatedMRLink();
      }
    }
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
  margin-top: 15px;
	.tableHeader {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    border-bottom: 1px solid #eee;
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
    font-size: 18px;
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
@media (min-width: 768px) {
  .tableHeader {
    width: 100%;
  }
}
@media (min-width: 992px) {
  .tableHeader {
    width: 1100px;
  }
}
@media (min-width: 1200px) {
  .tableHeader{
    width: 1300px;
  }
}
@media print {
  .no-print {
    display: none;
  }
}
</style>