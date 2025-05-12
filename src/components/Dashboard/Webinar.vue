<template>
  <div class="main">
    <div class="container">
      <div class="row margin-bottom-40">
        <div class="col-md-12 col-sm-12">
          <div class="content-page">
            <div class="row margin-bottom-30">
              <div class="col-md-12">
                <div v-for="(row, index) in latestPosts" :key="index">
                  <h2 v-html="row.title"></h2>
                  <div class="blog-single-head-date">
                    <i class="fa fa-calendar" aria-hidden="true" style="margin-right: 5px;"></i>
                    <span v-html="row.date"></span>
                  </div>
                  <hr />
                  <article>
                    <div v-html="row.text1"></div>
                    <hr />
                    <div v-html="row.text2"></div>
                  </article>
                </div>
              </div>
            </div>
            <div class="row">
               <AboutUs></AboutUs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDashboardData } from "@/service/service";
import AboutUs from "@/components/Indicators/Table/AboutUs.vue";

export default {
  name: 'Webinar',
  // props: {
  //   latestPosts: Array
  // },
  components: {
    AboutUs
  },
  data() {
    return {
      dashBoardData: {}
    }
  },
  computed: {
    latestPosts() {
      return this.dashBoardData.htop_webinar || []
    }
  },
  beforeRouteEnter(to, from, next) {
  if(to.path.includes('/dashboard/htop_webinar')) {
    next(async _this => {
      let {data} = await getDashboardData()
      console.log('lishan data', data)
      _this.dashBoardData = data
    })
  }else {
    next()
  }
 },
};
</script>

<style lang="less" scoped>
@import "./index.less";
/* Add any custom styles if needed */
</style>