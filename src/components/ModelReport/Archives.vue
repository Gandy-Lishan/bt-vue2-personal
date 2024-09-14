<template>
  <div :class="bodyClass">
    <div class="main">
      <div class="container">
        <div class="row margin-bottom-40">
          <div class="col-md-12 col-sm-12">
            <div class="content-page">
              <h1>{{ title }}</h1>
              <hr />
              <div class="row margin-bottom-30">
                <div class="col-md-12">
                  <div
                    v-if="serviceType === 'sentimentedge'"
                    class="analysis_solutions_yellow"
                  >
                    <img
                      align="center"
                      alt=""
                      src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/50434469-0496-c58b-44b7-4c1817cf1dac.png"
                      width="564"
                      style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                      class="mcnImage"
                    />
                  </div>
                  <div
                    v-else-if="serviceType === 'modeledge'"
                    class="analysis_solutions_yellow"
                  >
                    <img
                      align="center"
                      alt=""
                      src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/c317db3d-2d06-155d-5c53-b1abfba1bb3d.png"
                      width="564"
                      style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                      class="mcnImage"
                    />
                  </div>
                  <div
                    v-else-if="serviceType === 'quantedge'"
                    class="analysis_solutions_yellow"
                  >
                    <img
                      align="center"
                      alt=""
                      src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/13d4bb49-034a-7505-dba1-d8f33133b5a0.png"
                      width="564"
                      style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                      class="mcnImage"
                    />
                  </div>
                  <div
                    v-else-if="serviceType === 'portfolioedge'"
                    class="invest_solutions_green"
                  >
                    <img
                      align="center"
                      alt=""
                      src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/ae301b79-bc04-0f2a-a9f7-63a79fba0209.png"
                      width="564"
                      style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                      class="mcnImage"
                    />
                  </div>
                  <div
                    v-else-if="serviceType === 'tradingedge'"
                    class="analysis_solutions_yellow"
                  >
                    <img
                      align="center"
                      alt=""
                      src="https://mcusercontent.com/c1ba721d50cd9f9c0070e927f/images/cc8eb3aa-99a2-9543-8161-126926d8506e.png"
                      width="564"
                      style="max-width:880px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                      class="mcnImage"
                    />
                  </div>

                  <div v-if="messages.length" class="alert alert-success">
                    <strong v-for="message in messages" :key="message">{{ message }}</strong>
                  </div>

                  <div class="row" style="padding:10px">
                    <div
                      class="blog-sing
                      e-head"
                      v-for="post in blogPosts"
                      :key="post.url"
                    >
                      <h1 class="blog-single-head-title">
                        <router-link :to="{ name: 'blogPost', params: { slug: post.url } }">
                          {{ post.title }}
                        </router-link>
                      </h1>
                      <div class="blog-single-head-date">
                        <i class="icon-calendar font-bluesteel"></i>
                        {{ formatDate(post.post_date) }}
                        <span v-if="post.author === ''">
                          | <i class="icon-user font-bluesteel"></i>
                          <router-link :to="{ name: 'authorBlogs', params: { author: 'Jason Goepfert' } }">
                            Jason Goepfert
                          </router-link>
                        </span>
                      </div>
                      <div class="row" style="margin-bottom:10px;">
                          <article>
                            <img
                              v-if="post.image"
                              class="thumbnail"
                              style="margin-right:10px;margin-top:10px;"
                              height="200"
                              width="267"
                              :src="'https://dnpgic06wp5lx.cloudfront.net/' + post.image"
                              align="left"
                            />
                            <span v-if="post.meta_description">
                              {{ post.meta_description }}
                            </span>
                            <span v-else>
                              {{ truncate(post.post_content, 500) }}
                            </span>
                          </article>
                      </div>
                    </div>
                  </div>

                  <PreviousNextPage :previousPage="previousPage" :currentPage="currentPage" :nextPage="nextPage" :total="total" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PreviousNextPage from './component/PreviousNextPage'; // 假设你有这个分页组件
import { timestampToTime } from "@/utils";

export default {
  name: 'Archives',
  data() {
    return {
      title: 'SentimentEdge Archives', // 从服务器获取的标题
      serviceType: 'sentimentedge', // 获取服务类型
      messages: [], // 消息数组
      blogPosts: [
        {
          title: 'The Nasdaq quickly falls back into a correction',
          post_date: ' 2024-09-10',
          author: '',
          image: 'blog/20240909-195021_1725911420586.jpg',
          meta_description: '',
          post_content: 'The Nasdaq Composite and Nasdaq 100 both suffered corrections in August, partially recovering during torrid rallies, then fell back into correction territory. This has not been a sign of smart money distribution. Rather, both indexes had a strong tendency to rebound in the months ahead, with almost exclusive gains over the next 6-12 months.'
        },
        {
          title: 'The Nasdaq quickly falls back into a correction',
          post_date: ' 2024-09-10',
          author: '',
          image: 'blog/20240909-195021_1725911420586.jpg',
          meta_description: '',
          post_content: 'The Nasdaq Composite and Nasdaq 100 both suffered corrections in August, partially recovering during torrid rallies, then fell back into correction territory. This has not been a sign of smart money distribution. Rather, both indexes had a strong tendency to rebound in the months ahead, with almost exclusive gains over the next 6-12 months.'
        },
        {
          title: 'The Nasdaq quickly falls back into a correction',
          post_date: ' 2024-09-10',
          author: '',
          image: 'blog/20240909-195021_1725911420586.jpg',
          meta_description: '',
          post_content: 'The Nasdaq Composite and Nasdaq 100 both suffered corrections in August, partially recovering during torrid rallies, then fell back into correction territory. This has not been a sign of smart money distribution. Rather, both indexes had a strong tendency to rebound in the months ahead, with almost exclusive gains over the next 6-12 months.'
        }
      ], // 博客文章数组
      previousPage: 1,
      currentPage: 2, // 当前页码
      nextPage: 3,
      total: 139,

    };
  },
  components: {
    PreviousNextPage
  },
  computed: {
    bodyClass() {
      return 'page-sidebar-closed-hide-logo';
    }
  },
  methods: {
    formatDate(date) {
      // 实现你的日期格式化逻辑
      return timestampToTime(date)
    },
    truncate(text, length) {
      // 实现字符串截断逻辑
      return text.length > length ? text.slice(0, length) + '...' : text;
    }
  }
};
</script>

<style scoped>
a:hover {
 	font-weight: unset;
}
/* 保留原有的 CSS 样式 */
.aa-dropdown-menu {
  margin-top: 0px !important;
  width: 100% !important;
  border-radius: 0px !important;
}

.algolia-autocomplete {
  width: 100%;
  min-width: 100%;
}

.aa-input-search {
  margin: 10px 0px;
  width: 100% !important;
}

#aa-blog-search-input {
  background-image: -webkit-linear-gradient(
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, 0)
  );
}

.analysis_solutions_yellow {
  background-color: #fbc01f;
}

.invest_solutions_green {
  background-color: #009769;
}
</style>
