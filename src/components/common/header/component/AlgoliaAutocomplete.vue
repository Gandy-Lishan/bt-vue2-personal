<template>
    <div>
      <div ref="autocompleteContainer" />
    </div>
  </template>
  
  <script>
  import { autocomplete } from '@algolia/autocomplete-js';
  import algoliasearch from 'algoliasearch/lite';
  import '@algolia/autocomplete-theme-classic'; // 默认样式
  
  export default {
    name: 'AutocompleteSearch',
    mounted() {
      const searchClient = algoliasearch(
        'K88SIIDLSF',
        '080aea2b84a5e1263909139a3d6f1df1'
      );
  
      autocomplete({
        container: this.$refs.autocompleteContainer,
        placeholder: 'Search for Research, Content and/or Charts...',
        openOnFocus: true,
        defaultActiveItemId: 0, // 默认选中第一项

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
                        <button id="more-results-button" style="margin: 0 auto; margin-bottom: 1em;">
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
                },
            },
        ],
        onStateChange: ({ state }) => {
        this.$nextTick(() => {
            const btn = document.getElementById('more-results-button');
            if (btn) {
                btn.onclick = () => {
                    this.passToSearch(state.query);
                }
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
  