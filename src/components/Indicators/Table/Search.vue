<template>
  <div>
    <div id="aa-input-container">
      <input
        id="aa-search-input"
        v-model="searchInput"
        class="form-control"
        placeholder="Search here…"
        autocomplete="off"
      />
    </div>
    <!-- <button @click="filterEvent" id="searchSelected">
      {{ filterButton }}<i class="fa fa-angle-down" aria-hidden="true"></i>
    </button> -->
    <div v-if="suggestions.length">
      <div v-for="suggestion in suggestions" :key="suggestion.objectID">
        <div v-if="suggestion._highlightResult.chart_name">
          <a :href="chartUrl(suggestion)">
            <div v-html="suggestion._highlightResult.chart_name.value"></div>
          </a>
        </div>
        <div v-if="suggestion._highlightResult.title">
          <a :href="suggestion.category === 'report' ? reportUrl(suggestion) : suggestion.url">
            <div v-html="suggestion._highlightResult.title.value"></div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import algoliasearch from 'algoliasearch/lite';
// import autocomplete from 'autocomplete.js/dist/autocomplete';

export default {
  data() {
    return {
      client: algoliasearch('K88SIIDLSF', '080aea2b84a5e1263909139a3d6f1df1'),
      blogs: null,
      reports: null,
      charts: null,
      searchInput: '',
      filterButton: 'Search Everything',
      params: { hitsPerPage: 5 },
      filters: {
        searchEverything: '',
        searchStocks: 'groups:"stocks" OR groups:"stock_sent"',
        searchBonds: 'groups:"bonds"',
        searchCommodities: 'groups:"commod"',
        searchETF: 'groups:"etf"',
        searchBlogs: 'groups:"blog"',
        searchReports: 'groups:"report"',
      },
      suggestions: [],
    };
  },
  mounted() {
    console.log(window)
    this.blogs = this.client.initIndex('blog');
    this.reports = this.client.initIndex('reports');
    this.charts = this.client.initIndex('charts');
    this.initAutocomplete();
  },
  methods: {
    initAutocomplete() {
      autocomplete('#aa-search-input', {}, [
        {
          source: autocomplete.sources.hits(this.charts, this.params),
          displayKey: 'chart_name',
          name: 'charts',
          templates: {
            header: '<div class="aa-suggestions-category"></div>',
            suggestion: (suggestion) =>
              this.anchorFromUrlAndValue(
                this.chartUrl(suggestion),
                suggestion._highlightResult.chart_name.value
              ),
          },
        },
      ])
        .on('autocomplete:selected', (event, suggestion, dataset) =>
          this.performAutocomplete(suggestion, dataset)
        )
        .on('autocomplete:autocompleted', (event, suggestion, dataset) =>
          this.performAutocomplete(suggestion, dataset)
        );
    },
    filterEvent(event) {
      const selection = event.currentTarget.innerText;
      const selectionID = event.currentTarget.id;
      this.filterButton = selection + ' <i class="fa fa-angle-down" aria-hidden="true"></i>';
      // Clear the old value to apply filters
      this.searchInput = 'loading...';
      this.params.filters = this.filters[selectionID];
      this.searchInput = null;
    },
    anchorFromUrlAndValue(url, value) {
      console.log('hehehe', url, value)
      return `<a href="${url}" target="_blank" style="width: 515px; background-color: #fff; display: inline-block;">${value}</a>`;
    },
    performAutocomplete(suggestion, dataset) {
      let url = '';
      if (dataset === 'charts') {
        url = this.chartUrl(suggestion);
      } else if (dataset === 'reports') {
        url = this.reportUrl(suggestion);
      } else {
        if (suggestion.category === 'Lite') return;
        url = suggestion.url;
      }

      window.location.assign(url);
    },
    chartUrl(suggestion) {
      const chart_url = suggestion.chart_url.toLowerCase()
      return `/backtester/sr/setup?index=${'Unknown'}&indicator=${chart_url}`;
    },
    reportUrl(suggestion) {
      return `/users/report/${suggestion.filename}`;
    },
  },
};
</script>
<style scoped>
/* Add your styles here */
.aa-input-container {
    display: inline-block;
    position: relative;
}

.aa-input-search {
    padding: 12px 28px 12px 12px;
    border: 2px solid #e4e4e4;
    border-radius: 4px;
    margin-top: 13px;
    -webkit-transition: .2s;
    transition: .2s;
    font-family: "Montserrat", sans-serif;
    box-shadow: 4px 4px 0 rgba(241, 241, 241, 0.35);
    font-size: 14px;
    box-sizing: border-box;
    color: #333;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.right-center {
    text-align: center;
}

.aa-input-search::-webkit-search-decoration,
.aa-input-search::-webkit-search-cancel-button,
.aa-input-search::-webkit-search-results-button,
.aa-input-search::-webkit-search-results-decoration {
    display: none;
}

.aa-input-search:focus {
    outline: 0;
    border-color: #3a96cf;
    box-shadow: 4px 4px 0 rgba(58, 150, 207, 0.1);
}

.aa-input-icon {
    height: 16px;
    width: 16px;
    position: absolute;
    top: 50%;
    right: 16px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    fill: #e4e4e4;
    pointer-events: none;
}

.aa-hint {
    color: #e4e4e4;
}

.aa-dropdown-menu {
    background-color: #fff;
    border: 2px solid rgba(228, 228, 228, 0.6);
    border-top-width: 0;
    font-family: "Montserrat", sans-serif;
    margin-top: 10px;
    box-shadow: 4px 4px 0 rgba(241, 241, 241, 0.35);
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}

.aa-suggestion {
    padding: 6px 12px;
    cursor: pointer;
    -webkit-transition: .2s;
    transition: .2s;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.aa-suggestion:hover,
.aa-suggestion.aa-cursor {
    background-color: rgba(241, 241, 241, 0.35);
}

.aa-suggestion>span:first-child {
    color: #333;
}

.aa-suggestion>span:last-child {
    text-transform: uppercase;
    color: #a9a9a9;
}

.aa-suggestions-category {
    text-transform: uppercase;
    border-bottom: 2px solid rgba(228, 228, 228, 0.6);
    border-top: 2px solid rgba(228, 228, 228, 0.6);
    padding: 6px 12px;
    color: #a9a9a9;
    background-color: #fff;
}

.aa-suggestion>span:first-child em,
.aa-suggestion>span:last-child em {
    font-weight: 700;
    font-style: normal;
    background-color: rgba(58, 150, 207, 0.1);
    padding: 2px 0 2px 2px;
}
input#aa-search-input {
  width: 500px;
}
</style>
