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
    data: {
        autocompleteInstance: {}
    },
    mounted() {
      const searchClient = algoliasearch(
        ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_KEY
      );
  
      this.autocompleteInstance = autocomplete({
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
                        const isTrendScore = item.chart_url.includes('_trend') || item.chart_url.includes('_reltrend')
                        return html`<a href="/${isTrendScore?'trend_score':'indicators'}?indicator=${item.chart_url}" class="aa-ItemTitle">
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
                        return html`<a href="https://users.sentimentrader.com/users/report/${item.filename}" class="aa-ItemTitle">
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
                        return html`<a href="/MR/${item.category}/${item.url.split('/').pop()}" class="aa-ItemTitle">
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
                    chartBtn.onclick = () => {
                        this.passToSearch(state.query, 'charts');
                        this.autocompleteInstance.setIsOpen(false); // 👈关闭搜索面板
                    };
                }
                if (reportBtn) {
                    reportBtn.onclick = () => {
                        this.passToSearch(state.query, 'reports');
                        this.autocompleteInstance.setIsOpen(false);
                    };
                }
                if (blogBtn) {
                    blogBtn.onclick = () => {
                        this.passToSearch(state.query, 'blogs');
                        this.autocompleteInstance.setIsOpen(false);
                    };
                }

                // //点击任意搜索结果项 <a class="aa-ItemTitle"> 时关闭面板
                // const resultLinks = document.querySelectorAll('.aa-ItemTitle');
                // resultLinks.forEach(link => {
                //     link.onclick = () => {
                //         this.autocompleteInstance.setIsOpen(false);
                //     };
                // });
            });
        },
      });
    },
    // beforeDestroy() {
    // },
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
  