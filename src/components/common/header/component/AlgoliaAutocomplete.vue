<template>
    <div>
      <div ref="autocompleteContainer" />
    </div>
  </template>
  
  <script>
  import { autocomplete } from '@algolia/autocomplete-js';
  import algoliasearch from 'algoliasearch/lite';
  import '@algolia/autocomplete-theme-classic'; // 默认样式
  import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY } from './constants';

  export default {
    name: 'AutocompleteSearch',
    mounted() {
      const searchClient = algoliasearch(
        ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_KEY
      );
  
      autocomplete({
        container: this.$refs.autocompleteContainer,
        placeholder: 'Search for Research, Content and/or Charts...',
        openOnFocus: true,
        defaultActiveItemId: 0, // 默认选中第一项
        classNames: {
            root: 'autocomplete-container', // 为整个容器添加类
            panel: 'autocomplete-panel', // 搜索结果面板的类
            // input: 'autocomplete-input', // 为输入框添加类
            // list: 'autocomplete-list', // 为结果列表添加类
            // item: 'autocomplete-item', // 为每个搜索结果项添加类
        },

        getSources: ({ query }) => [
            {
                sourceId: 'charts',
                getItems() {
                return searchClient
                    .initIndex('charts')
                    .search(query, { hitsPerPage: 5 })
                    .then(res => res.hits);
                },
                templates: {
                    header({ html }) {
                        return html`<div>📈 Charts</div>`;
                    },
                    item({ item, html }) {
                        return html`<a href="/users/charts/${item.chart_url}" target="_blank" class="aa-ItemTitle">
                        ${item.chart_name}${item.premium === 1 ? ' ★' : ''}
                        </a>`;
                    },
                    footer({ html }) {
                        return html`
                        <div style="width: 100%; text-align: center;">
                            <button id="more-results-charts" class="more-results-button" style="margin: 0 auto; margin-bottom: 1em;">
                            More Search Results
                            </button>
                        </div>
                        `;
                    },
                },
            },
            {
                sourceId: 'reports',
                getItems() {
                return searchClient
                    .initIndex('reports')
                    .search(query, { hitsPerPage: 5 })
                    .then(res => res.hits);
                },
                templates: {
                    header({ html }) {
                        return html`<div>📄 Daily Reports</div>`;
                    },
                    item({ item, html }) {
                        return html`<a href="https://users.sentimentrader.com/users/report/${item.filename}" target="_blank" class="aa-ItemTitle">
                        ${item.title}
                        </a>`;
                    },
                    footer({ html }) {
                        return html`
                        <div style="width: 100%; text-align: center;">
                            <button id="more-results-reports" class="more-results-button" style="margin: 0 auto; margin-bottom: 1em;">
                            More Search Results
                            </button>
                        </div>
                        `;
                    },
                },
            },
            {
                sourceId: 'blogs',
                getItems() {
                return searchClient
                    .initIndex('blog')
                    .search(query, { hitsPerPage: 5 })
                    .then(res => res.hits.filter(i => i.category !== 'Lite'));
                },
                templates: {
                    header({ html }) {
                        return html`<div>📝 Blog Posts</div>`;
                    },
                    item({ item, html }) {
                        return html`<a href="/blogs/${item.slug}" class="aa-ItemTitle">
                        ${item.title}
                        </a>`;
                    },
                    footer({ html }) {
                        return html`
                        <div style="width: 100%; text-align: center;">
                            <button id="more-results-blogs" class="more-results-button" style="margin: 0 auto; margin-bottom: 1em;">
                            More Search Results
                            </button>
                        </div>
                        `;
                    },
                },
            },
        ],
        onStateChange: ({ state }) => {
            this.$nextTick(() => {
            const chartBtn = document.getElementById('more-results-charts');
            const reportBtn = document.getElementById('more-results-reports');
            const blogBtn = document.getElementById('more-results-blogs');

            if (chartBtn) {
                chartBtn.onclick = () => this.passToSearch(state.query, 'charts');
            }
            if (reportBtn) {
                reportBtn.onclick = () => this.passToSearch(state.query, 'reports');
            }
            if (blogBtn) {
                blogBtn.onclick = () => this.passToSearch(state.query, 'blogs');
            }
            });
        },
      });
    },
    methods: {
        passToSearch(query) {
            let url = '/search';
            if (query) {
                url += '?query=' + encodeURIComponent(query);
            }
            this.$router.push(url);
        }
    }
  };
  </script>
  
  <style scoped>

  </style>
  