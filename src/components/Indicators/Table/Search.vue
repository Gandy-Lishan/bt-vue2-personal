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
import { mapGetters,mapActions } from "vuex";
import { isJson } from '@/utils'
import { getIndicatorsRowData } from "@/service/service";

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
  computed: {
    ...mapGetters({
      indicatorsListData: 'getIndicatorsPageListData'
    })
  },
  mounted() {
    console.log(window)
    const indicator = this.$route.query.indicator
    if(indicator) {
      this.$nextTick(async () => {
        await this.enlargeSelectIndicator(indicator)
      })
    }

    this.blogs = this.client.initIndex('blog');
    this.reports = this.client.initIndex('reports');
    this.charts = this.client.initIndex('charts');
    this.initAutocomplete();
  },
  methods: {
    ...mapActions('chart', ['fetchIndicatorsPageList']),
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
        .on('autocomplete:selected', async (event, suggestion, dataset) =>
          await this.performAutocomplete(suggestion, dataset)
        )
        .on('autocomplete:autocompleted', async (event, suggestion, dataset) =>
        await this.performAutocomplete(suggestion, dataset)
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
      // if((url.includes('trend') || url.includes('reltrend')) && url.includes('trend_reltrend')) {
      //   return `<a style="width: 515px; background-color: #fff; display: inline-block;">${value}</a>`;
      // }
      if((!url.includes('trend') && !url.includes('reltrend'))) return `<a style="width: 515px; background-color: #fff; display: inline-block;">${value}</a>`;
    },
    async performAutocomplete(suggestion, dataset) {
      let searchUrl = '';
      if (dataset === 'charts') {
        searchUrl = this.chartUrl(suggestion);
      } else if (dataset === 'reports') {
        searchUrl = this.reportUrl(suggestion);
      } else {
        if (suggestion.category === 'Lite') return;
        searchUrl = suggestion.url;
      }
      console.log('searchUrl', searchUrl)
      await this.enlargeSelectIndicator(searchUrl)
  },
    async enlargeSelectIndicator(searchUrl) {
      debugger
      // vol_vix_transform 不存在
      if(searchUrl === 'vol_vix_transform') {
        this.$message({
          message: `<strong>Unable to find the corresponding indicator</strong>`,
          center: true,
          dangerouslyUseHTMLString: true,
          showClose: true,
          duration: 8000,
          customClass: 'no-icon',
          type: 'warning'
        })
        return
      }
      // const urlTypes = Array.from(Object.keys(this.indicatorsListData)).filter(key => key !== 'most_popular')
      const urlTypes = Array.from(Object.keys(this.indicatorsListData))
      let sourceTable = urlTypes.map(type => {
        const list = isJson(this.indicatorsListData[type]) ? JSON.parse(this.indicatorsListData[type]) : []
          return list.map(item => {
            if(item.url.toLowerCase() === searchUrl.toLowerCase()) return item
          }).filter(item => item !== undefined)
      }).filter(item => item.length > 0).flat()
      console.log('sourceTable', sourceTable)
      // 存在第一次并未请求全部表单的情况
      if(sourceTable.length > 0) {
        const source_list = sourceTable[0].source_list // 只取第一个匹配到的 Table
        await this.$emit('enLargeTable', source_list, sourceTable[0])
      }else {
        let res = {}
        try {
          const {data:rowData} = await getIndicatorsRowData(searchUrl)
          res = rowData
        } catch (error) {
          if(error?.response?.status === 404) {
            this.$message({
              message: `<strong>Unable to find the corresponding indicator</strong>`,
              center: true,
              dangerouslyUseHTMLString: true,
              showClose: true,
              duration: 8000,
              customClass: 'no-icon',
              type: 'warning'
            })
            return
          }
        }
        const {type, groups, sub_type} = res
        let requireUrl = ''
        if(type === 'stock_nasdaq') {
          requireUrl = 'ndx_100_complete_list'
        }else if(type === 'stock_sent') {
          requireUrl = 'sp_1500_complete_list'
        }else if(type === 'stock_russell') {
          requireUrl = 'russell_3000_complete_list'
        }else if(sub_type === 'crp_stock') {
          requireUrl = 'crypt_complete_list'
        }else if(sub_type === 'all_country_breadth'){
          requireUrl = 'country_breadth'
        }else if(sub_type === 'crp_breadth') {
          requireUrl = 'crypto_breadth'
        }else if(groups === 'trend_reltrend') {
          const str = sub_type
          const match = str.match(/(.*?)_trend_reltrend/)
          const result = match ? match[1] : 'sp1500'
          requireUrl = result
        }else if(sub_type === 'etf_breadth') {
          requireUrl = 'etf_breadth'
        }else if(type === 'etf_fund') {
          requireUrl = 'etf_flow'
        }else if(type === 'mff') {
          requireUrl = 'monthly_fund_flows'
        }else if(type === 'shares') {
          requireUrl = 'shares_outstanding'
        }else if(type === 'etf_seasonality') {
          requireUrl = 'etf_seasonality'
        }else if(type === 'bond_seasonality') {
          requireUrl = 'bond_seasonality'
        }
        // else if(type === 'index_seasonality') {
        //   requireUrl = 'index_seasonality'
        // }
        else if(groups === 'commod') {
          requireUrl = 'commodity_complete_list'
        }else if(groups === 'bonds'){
          requireUrl = 'bonds_complete_list'
        }else if(type === 'etf_opt') {
          requireUrl = 'etf_complete_list'
        }else if(type === 'commod_seasonality') {
          url = 'commod_seasonality'
        }else if(groups === 'stocks') {
          requireUrl = 'stock_complete_list'
        }else if(groups === 'macroeconomic') {
          requireUrl = 'macro_indicator_list'
        }
        // if(!requireUrl) return
        let _sourceList = null
        if(requireUrl) {
          await this.fetchIndicatorsPageList(requireUrl)
          const _list = isJson(this.indicatorsListData[requireUrl]) ? JSON.parse(this.indicatorsListData[requireUrl]) : []
          _sourceList = _list.map(item => {
              if(item.url.toLowerCase() === searchUrl.toLowerCase()) return item
          }).filter(item => item !== undefined).shift()
          console.log('_sourceList', _sourceList)
        }
        if(!_sourceList || (((_sourceList !== null && typeof _sourceList === 'object' && !Array.isArray(_sourceList)) && Object.keys(_sourceList).length === 0))) {
          // 尝试看在不在 most_popular
          requireUrl = 'most_popular'
          await this.fetchIndicatorsPageList(requireUrl)
          const _list = isJson(this.indicatorsListData[requireUrl]) ? JSON.parse(this.indicatorsListData[requireUrl]) : []
          const _tempSourceList = _list.map(item => {
          if(item.url.toLowerCase() === searchUrl.toLowerCase()) return item
          }).filter(item => item !== undefined).shift()
          _sourceList = _tempSourceList
          // 如果是对象并且对象为空, 说明没有匹配到数据
          if(!_tempSourceList || (((_tempSourceList !== null && typeof _tempSourceList === 'object' && !Array.isArray(_tempSourceList)) && Object.keys(_tempSourceList).length === 0))) {
            this.$message({
              message: `<strong>Unable to find the corresponding indicator</strong>`,
              center: true,
              dangerouslyUseHTMLString: true,
              showClose: true,
              duration: 8000,
              customClass: 'no-icon',
              type: 'warning'
            })
            return
        }
        }
        await this.$emit('enLargeTable', _sourceList.source_list, _sourceList)
      /* 如果匹配不到, 使用下面的规则请求个别表单
      ndx_100_complete_list: type: stock_nasdaq
      sp_1500_complete_list: type: stock_sent
      russell_3000_complete_list: type: stock_russell
      commodity_complete_list: groups: commod
      etf_breadth: type: etf_opt
      country_breadth: sub_type: all_country_breadth
      crypto_breadth: sub_type: crp_breadth
      etf_flow: type: etf_fund
      monthly_fund_flows： type: mff
      shares_outstanding: type: shares
      etf_seasonality: type: etf_seasonality
      bond_seasonality: type: bond_seasonality
      */
      // window.location.assign(url);
    }
  },
    chartUrl(suggestion) {
      const chart_url = suggestion.chart_url.toLowerCase()
      // return `/backtester/sr/setup?index=${'Unknown'}&indicator=${chart_url}`;
      return `${chart_url}`
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
    background-color: #fff;
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
    color: #000000;
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
    color: #000000;
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
