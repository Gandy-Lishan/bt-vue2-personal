<template>
  <div class="search-container">
  <ais-instant-search :search-client="searchClient" index-name="charts">
    <ais-configure :hitsPerPage="15" />
    <div class="search-header">
      <div class="search-box"><ais-search-box v-model="searchQuery" placeholder="Search for Research, Content or Charts…" /></div>
      <div class="search-filter"><SourceFilter v-model="visibleSources" /></div>
    </div>

    <div class="results-grid">
      <div class="result-column">
        <h3>Chart Results</h3>
        <ais-index index-name="charts" v-show="visibleSources.includes('charts')">
          <ais-hits :transform-items="filterChartHits">
            <template #default="{ items }">
              <div v-if="items.length === 0">No Results</div>
                <div v-else>
                  <div v-for="item in items" :key="item.objectID" class="hit-item">
                    <a :href="generateChartUrl(item)" target="_blank" rel="noopener">
                      <ais-highlight :hit="item" attribute="chart_name" />
                      <span v-if="item.premium === 1" style="margin-left: 4px;">★</span>
                    </a>
                  </div>
                </div>
            </template>
          </ais-hits>
          <!-- <ais-pagination /> -->
        </ais-index>
      </div>

      <div class="result-column">
        <h3>Report Results</h3>
        <ais-index index-name="reports" v-show="visibleSources.includes('reports')">
          <ais-hits>
            <template #default="{ items }">
              <div v-if="items.length === 0">No Results</div>
                <div v-else>
                  <div
                    v-for="item in items"
                    :key="item.objectID"
                    class="hit-item"
                  >
                    <a :href="`https://users.sentimentrader.com/users/report/${item.filename}`" target="_blank" rel="noopener">
                      <ais-highlight :hit="item" attribute="title" />
                      <p class="sml-dt">
                        Publish Date: {{ datestamp_to_string(item.date) }}
                      </p>
                    </a>
                  </div>
                </div>
            </template>
          </ais-hits>
          <!-- <ais-pagination /> -->
        </ais-index>
      </div>

      <div class="result-column">
        <h3>Blog Results</h3>
        <ais-index index-name="blog" v-show="visibleSources.includes('blogs')">
          <ais-hits>
            <template #default="{ items }">
              <div v-if="items.filter(i => i.category !== 'Lite').length === 0">
                  No Results
                </div>
                <div v-else>
                  <div
                    v-for="item in items"
                    :key="item.objectID"
                    v-if="item.category !== 'Lite'"
                    class="hit-item"
                  >
                    <a :href="`/MR/${item.category}/${item.url.split('/').pop()}`" target="_blank" rel="noopener">
                      <ais-highlight :hit="item" attribute="title" />
                      <p class="sml-dt">
                        Publish Date: {{ formatModified(item.modified) }}
                      </p>
                      <div v-if="item.category === 'Premium' "class=" search-result-premium"><em> ★ Premium Note</em></div>
                    </a>
                  </div>
                </div>
            </template>
          </ais-hits>
          <!-- <ais-pagination /> -->
        </ais-index>
      </div>
    </div>
    <ais-pagination class="shared-pagination" @page-change="scrollToTop" />
  </ais-instant-search>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import SourceFilter from './SourceFilter.vue';
import 'instantsearch.css/themes/algolia-min.css';
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY } from './constants';

export default {
  name: "MultiIndexSearch",
  components: {
    SourceFilter,
  },
  data() {
    return {
      searchClient: algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY),
      visibleSources: ["charts", "reports", "blogs"],
      searchQuery: '',
    };
  },
  watch: {
    // 监听路由变化，当 query 参数变化时更新 searchQuery
    '$route.query.query': function(newQuery) {
      this.searchQuery = newQuery || "";
    }
  },
  created() {
    // 如果 URL 中有 query 参数，设置 searchQuery 为该参数值
    if (this.$route.query.query) {
      this.searchQuery = this.$route.query.query;
    }
  },
  methods: {
    /**
     * 过滤掉不该显示的 charts 记录。
     * @param {Array} items Algolia 传入的原始 hits
     * @returns {Array} 过滤后的 hits
     */
    filterChartHits(items) {
      return items.filter(item => {
        if (item.chart_url.includes('_trend_reltrend')) return false;

        // ❸ 其他规则按需添加
        // if (item.someFlag === 'hide') return false;

        return true;            // 其余保留
      });
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    formatModified(modified) {
      if (!modified) return 'N/A';
      if (modified.includes('-')) {
        const parts = modified.split('-');
        const dt = new Date(parts[0], +parts[1] - 1, parts[2]);
        return this.datestamp_to_string(dt.getTime());
      } else {
        return modified;
      }
    },

    datestamp_to_string(stamp) {
        //March 16, 2017
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var d = new Date(stamp);
        var ds = months[d.getMonth()] + ' ' + d.getUTCDate() + ', ' + d.getFullYear();
        return ds;
    },

    generateChartUrl(item) {
      const isTrendScore = item.chart_url.includes('_trend') || item.chart_url.includes('_reltrend')
      return `/${isTrendScore?'trend_score':'indicators'}?indicator=${item.chart_url}`;
    }
  },
};
</script>

<style scoped lang="less">
/deep/ .ais-Hits-list {
  flex-direction: column;
}
/deep/ .ais-Hits-item {
  width: auto !important;
}

/** SearchBox Input */
/deep/ .ais-SearchBox-input:focus {
    border-bottom: 5px solid #4d729b;
  }

/** Pagination item */
.shared-pagination {
  margin: 2rem 0;
  display: flex;
  justify-content: center;

  /deep/ .ais-Pagination-list {
    display: flex;
    list-style: none;
    padding: 0;
    gap: 0.5rem;
  }

  /deep/ .ais-Pagination-item {
    a {
      display: block;
      padding: 0.5rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      text-decoration: none;
      color: #333;
      font-weight: bold;
      transition: all 0.2s ease;

      &:hover {
        background: #f5f5f5;
      }
    }

    &.ais-Pagination-item--selected a {
      background-color: #2e7dff;
      color: white;
      border-color: #2e7dff;
    }

    &.ais-Pagination-item--disabled a {
      color: #bbb;
      pointer-events: none;
    }
  }
}

/** Common Item */

.search-container {
  padding: 5rem 8rem;
}
.search-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;

  /deep/ .ais-SearchBox-input {
    min-width: 700px;
    padding: 0.8rem 0 0.8rem 3rem;
    width: 100%;
  }
  /deep/ .ais-SearchBox-submit {
    left: .8rem;
  }
}

.results-grid {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}
.result-column {
  flex: 1;
  min-width: 250px;
  h3 {
    border-bottom: 1px solid rgba(228, 228, 228, 0.6);
    font-size: 1.2em;
    padding: 6px 12px;
  }
}
.hit-item {
  padding: 6px 12px;
  // line-height: 1.5rem;
  :hover {
    text-decoration: underline;
  }
  .ais-Highlight {
    font-size: 1.2em;
  }
  .sml-dt {
    font-size: 12px;
    font-style: italic;
  }
}


.search-result-premium {
  font-size: 8pt;
  margin-left: 10px;
  color: #5b9bd1;
  padding: 4px;
  vertical-align: middle;
  em {
    font-weight: bold;
    font-style: normal;
    background-color: #eaf4fa;
  }
}
</style>
