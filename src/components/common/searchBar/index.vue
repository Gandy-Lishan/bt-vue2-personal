<template>
    <div :id="id_name" />
</template>
    
<script>

import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';


const searchClient = algoliasearch(
    'PV3Q0OLVHA',
    'e9fe1099245c0558ce406ad57765682b'
)
export default {
    name: 'searchBar',
    props: {
        id_name: String,
        placeholder: String,
        index: Array,
        display: String
    },
    data() {
        return {
        }
    },
    methods: {
        handleSelect(item){
            this.$emit('select',item.item)
        },
        // 生成组合请求
        generateQueries(query){
            return this.index.map((item)=>{return {
                indexName: item,
                query,
                params: {
                hitsPerPage: 2000,
                attributesToSnippet: ['chart_name:5','stock:5','symbol:5'],
                snippetEllipsisText: '…',
                },
            }})
        }
    },
    mounted() {
        const _that = this
        
        autocomplete({
            container: '#'+_that.id_name,
            placeholder: _that.placeholder,
            insights: { //事件配置
                onSelect: _that.handleSelect
            },
            openOnFocus: true,  //打开即请求
            getSources({ query }) {
                return [
                {
                    sourceId: 'indicators',
                    getItems() {
                        return getAlgoliaResults({
                            searchClient,
                            queries: _that.generateQueries(query)
                        });
                    },
                    templates: {
                    item({ item, components, html }) {
                      return html`<div class="aa-ItemWrapper">
                        <div class="aa-ItemContent">
                          <div class="aa-ItemContentBody">
                            <div class="aa-ItemContentTitle">
                              ${components.Highlight({
                                hit: item,
                                attribute: _that.display,
                              })}
                            </div>
                          </div>
                        </div>
                      </div>`;
                        // return html`<div>
                        //     <div>
                        //         ${components.Highlight({ 
                        //             hit: item, 
                        //             attribute: 'chart_name' })
                        //         }
                        //     </div>
                        // </div>`;
                    },
                    },
                },
                ];
            },
        })
    }
}
</script>
    
    <style lang="less" scoped>
</style>