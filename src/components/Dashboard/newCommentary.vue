<template>
  <div>
    <!-- Grandfathered Users Section -->
    <div v-if="dashboardType === 'grandfathered' && !currentUserServiceLevels.includes('datalite')" class="portlet light">
      <div class="portlet-body">
        <div class="panel" style="border: 1px solid #67809F;">
          <div class="panel-heading bg-blue-hoki bg-font-blue-hoki">
            <h4 class="panel-title">
              <b>Latest Commentary</b>
            </h4>
          </div>
          <div class="panel-body">
            <div v-for="(row, index) in latestCommentary" :key="index">
              <a class="item-name primary-link" :href="urlForBlogPost(row.url)">
                {{ row.title }}
              </a>
              <br />
              <em><small>Published: {{ row.post_date }}</small></em>
              <br />
              <p>
                {{ row.meta_description || row.content | truncate(100) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicatoredge Users Section -->
    <div v-else-if="dashboardType === 'indicatoredge' && !currentUserServiceLevels.includes('datalite')" class="portlet light">
      <div class="portlet-body">
        <div class="panel" style="border: 1px solid #67809F;">
          <div class="panel-heading bg-blue-hoki bg-font-blue-hoki">
            <h4 class="panel-title">
              <b>Latest Commentary</b>
            </h4>
          </div>
          <div class="panel-body">
            <!-- Webinar Section -->
            <div v-if="htopWebinar.length > 0">
              <div v-for="(row, index) in htopWebinar" :key="index">
                <a class="item-name primary-link" :href="urlForWebinarDetail(row.date)">
                  {{ row.title }}
                </a>
                <br />
                <em><small>Published: {{ row.date }}</small></em>
                <br />
                <p>
                  {{ row.meta_description || row.content | truncate(100) }}
                </p>
              </div>
            </div>

            <!-- Commentary Section -->
            <div v-if="latestCommentary.length > 0">
              <div v-for="(row, index) in latestCommentary" :key="index">
                <a
                  class="item-name primary-link"
                  :href="row.author === 'Jason Goepfert' || row.author === 'Dean Christians' || row.author === 'Jay Kaeppel' ? urlForBlogPost(row.url) : urlForPublicBlogPost(row.url)"
                >
                  {{ row.title }}
                </a>
                <br />
                <em><small>Published: {{ row.post_date }}</small></em>
                <br />
                <p>
                  {{ row.meta_description || row.content | truncate(100) }}
                </p>
              </div>
            </div>
            <div v-else>
              Please consider adding a research subscription to have access to content.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Default Section -->
    <div v-else class="portlet light">
      <div class="portlet-body">
        <div class="panel" style="border: 1px solid #67809F;">
          <div class="panel-heading bg-blue-hoki bg-font-blue-hoki">
            <h4 class="panel-title">
              <b>Other Services available</b>
            </h4>
          </div>
          <div class="panel-body">
            Please consider adding a research subscription to have access to content.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashboardType: 'grandfathered', // 示例值，可以是 'grandfathered' 或 'indicatoredge'
      currentUserServiceLevels: [], // 示例值，例如 ['datalite']
      latestCommentary: [], // 示例值，从后端获取
      htopWebinar: [], // 示例值，从后端获取
    };
  },
  methods: {
    urlForBlogPost(slug) {
      return `/user/blog_post/${slug}`;
    },
    urlForPublicBlogPost(slug) {
      return `/public/blog_post/${slug}`;
    },
    urlForWebinarDetail(date) {
      return `/user/webinar_detail/${date}`;
    },
  },
  filters: {
    truncate(value, length) {
      if (!value) return '';
      if (value.length > length) {
        return value.substring(0, length) + '...';
      }
      return value;
    },
  },
};
</script>

<style scoped>
/* 添加样式 */
.portlet {
  margin-bottom: 20px;
}
.panel {
  border-radius: 4px;
}
.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.panel-body {
  padding: 15px;
}
.bg-blue-hoki {
  background-color: #67809F;
  color: white;
}
.primary-link {
  color: #337ab7;
  text-decoration: none;
}
.primary-link:hover {
  text-decoration: underline;
}
</style>