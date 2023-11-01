import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';

const searchClient = algoliasearch(
    'PV3Q0OLVHA',
    'e9fe1099245c0558ce406ad57765682b'
)

export const AlgoliaMixin = {
  data() {
    return {
      searchClient: searchClient,
    }
  },
  methods: {
    renderAutocomplete(placeholder,id,index){
        autocomplete({
            container: id,
            placeholder: placeholder,
            insights: true,
            getSources({ query }) {
              return [
                {
                  sourceId: 'indicators',
                  getItems() {
                    return getAlgoliaResults({
                      searchClient,
                      queries: [
                        {
                          indexName: index,
                          query,
                          params: {
                            hitsPerPage: 5,
                            attributesToSnippet: ['chart_name:5'],
                            snippetEllipsisText: '…',
                          },
                        },
                      ],
                    });
                  },
                  templates: {
                    item({ item, components, html }) {
                    //   return html`<div class="aa-ItemWrapper">
                    //     <div class="aa-ItemContent">
                    //       <div class="aa-ItemContentBody">
                    //         <div class="aa-ItemContentTitle">
                    //           ${components.Highlight({
                    //             hit: item,
                    //             attribute: 'chart_name',
                    //           })}
                    //         </div>
                    //       </div>
                    //     </div>
                    //   </div>`;
                        return html`<div>
                            <div>
                                ${components.Highlight({ 
                                    hit: item, 
                                    attribute: 'chart_name' })
                                }
                            </div>
                        </div>`;
                    },
                  },
                },
              ];
            },
          })
    }
  }
};