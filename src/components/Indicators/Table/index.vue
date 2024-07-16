<template>
  <div>
    <div class="strategy-container">
    <br>
    <div class="strategy-main">
      <div class="strategy-header">
        <div class="tableHeader">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Indicators'" :class="{ 'selected': selectedTitle === 'Indicators' }">Indicators</h4>
            <h4  @click="selectedTitle = 'Popular'" :class="{ 'selected': selectedTitle === 'Popular' }">Most Popular</h4>
            <h4  @click="selectedTitle = 'My Favorites'" :class="{ 'selected': selectedTitle === 'My Favorites' }">My Favorites</h4>
          </div>
          <div class="search-container">
            <Search></Search>
            <!-- <ais-instant-search
            :search-client="searchClient"
            index-name="charts"
            :insights="true"
            >
            <div class="search-panel">
                <div class="search-panel__search-box">
                  <ais-search-box
                    placeholder="Search here…"
                    class="searchbox"
                    onchange="onInputChange"
                  />
                </div>
                <div class="search-panel__results" :class="{ active: hasSearched }">
                  <ais-hits>
                    <template v-slot:default="{ items }">
                    <ul v-if="Number(items.length) > 0">
                      <li v-for="item in items" :key="item.objectID">
                        <span @click="openScreen(item)"><ais-highlight :hit="item" attribute="chart_name" class="chart_name"/></span>
                      </li>
                    </ul>
                    </template>
                  </ais-hits>
                </div>
              </div>
            </ais-instant-search> -->
          </div>
          <div class="searchBox" v-show="selectedTitle === 'Indicators'">
            <el-select v-model="searchCategory" slot="prepend" placeholder="" size="mini">
							<el-option
								v-for="category in categories"
								:key="category.value"
								:label="category.label"
								:value="category.value"
							></el-option>
						</el-select>
            <el-button type="primary" size="mini" @click="downloadCSV"><i class="el-icon-download" style="margin-right: 10px"></i>Download CSV</el-button>
          </div>
        </div>
      </div>
      <br>
      <StrategiesTable v-show="selectedTitle === 'Indicators'" ref="Indicators"></StrategiesTable>
      <Popular v-show="selectedTitle === 'Popular'" ref="Popular" :selectedTitle="selectedTitle"></Popular>
      <SummaryTable v-show="selectedTitle === 'My Favorites'" ref="My Favorites" :urlToNameMap="urlToNameMap" :tag="tag"></SummaryTable>
    </div>
    </div>
  </div>
</template>
<script> 
import StrategiesTable from "./ForTest";
import SummaryTable from "./SummaryTable";
import Search from "./Search";
import Popular from "./Popular";
import { mapActions, mapGetters } from 'vuex'
import { getIndicatorsRowData } from "@/service/service";
import { LocalStorageUtil } from "@/utils";
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/algolia-min.css';
const XLSX = require('xlsx');

export default {
  name: 'IndicatorsList',
  data() {
    return {
      searchClient: algoliasearch(
        'K88SIIDLSF',
        '080aea2b84a5e1263909139a3d6f1df1'
      ),
      selectedTitle: 'Indicators',
      urlToNameMap: [],
      searchKey: '',
      tag: 'All',
      searchCategory: '',
      hasSearched: true,
      categories: [
        {
          label: 'Stocks Indicator List',
          value: 'stock_complete_list',
          refName: 'stockVirtualScroll'
        },
        {
          label: 'NASDAQ 100 Optix',
          value: 'ndx_100_complete_list',
          refName: 'stockVirtualScroll'
        },
        {
          label: 'S&P 1500 Optix',
          value: 'sp_1500_complete_list',
          refName: 'stockVirtualScroll'
        },
        {
          label: 'Bond Indicator List',
          value: 'bond_complete_list',
          refName: 'bondVirtualScroll'
        },
        // {
        //   label: 'Commodity Indicator List',
        //   value: 'commodity_complete_list',
        //   refName: 'commodityVirtualScroll'
        // },
        {
          label: 'ETF Sector List',
          value: 'etf_complete_list',
          refName: 'ETFVirtualScroll'
        },
        {
          label: 'ETF Sector Breadth',
          value: 'etf_breadth',
          refName: 'ETFVirtualScroll'
        },
        {
          label: 'ETF Fund Flow',
          value: 'etf_flow',
          refName: 'ETFVirtualScroll'
        },
        {
          label: 'ETF Monthly Fund Flow',
          value: 'monthly_fund_flows',
          refName: 'ETFVirtualScroll'
        },
        {
          label: 'ETF Shares Outstanding',
          value: 'shares_outstanding',
          refName: 'ETFVirtualScroll'
        },
        {
          label: 'Commodity Seasonality',
          value: 'commod_seasonality',
          refName: 'seasonalityVirtualScroll'
        },
        {
          label: 'Bond Seasonality',
          value: 'bond_seasonality',
          refName: 'seasonalityVirtualScroll'
        },
        {
          label: 'ETF Seasonality',
          value: 'etf_seasonality',
          refName: 'seasonalityVirtualScroll'
        }
      ],
      searchCategory: 'stock_complete_list'
    }
  },
  computed: {
    ...mapGetters(['getIndicatorsPageListData']),
    indicatorsListData() {
      return this.getIndicatorsPageListData
    }
  },
  components: {
    StrategiesTable,
    SummaryTable,
    Popular,
    Search
  },
  mounted() {
    // 使用 querySelector 获取 input 元素
    const inputElement = document.querySelector('.ais-SearchBox-input');

    if (inputElement) {
      // 监听 input 事件
      inputElement.addEventListener('input', this.handleInput);
      // 监听 change 事件
      inputElement.addEventListener('change', this.handleChange);
      // 监听 blur 事件
      inputElement.addEventListener('blur', this.handleBlur);
    }
  },
  beforeDestroy () {
    // 离开此组件前保存筛选条件状态
    console.log('离开此组件前保存筛选条件状态', {selectedTitle: this.selectedTitle, highlightedTag: this.tag})
    LocalStorageUtil.set('strategy_filter_state', {selectedTitle: this.selectedTitle, highlightedTag: this.tag})
     // 使用 querySelector 获取 input 元素
     const inputElement = this.$el.querySelector('.ais-SearchBox-input');
    if (inputElement) {
      // 移除事件监听
      inputElement.removeEventListener('input', this.handleInput);
      inputElement.removeEventListener('change', this.handleChange);
      inputElement.removeEventListener('blur', this.handleBlur);
    }
  },
  methods: {
    ...mapActions('states', ['fetchIndicatorsPageList']),
    handleInput(event) {
      console.log('Input event:', event.target.value);
    },
    handleChange(event) {
      console.log('Change event:', event.target.value);
    },
    handleBlur(event) {
      console.log('Blur event:', event.target.value);
    },
    onInputChange(event) {
      console.log('onInputChange', event)
      this.hasSearched = event.currentTarget.value.trim().length > 0;
    },
    async openScreen(item) {
      if(!item.chart_url) return
      const rowData = await getIndicatorsRowData(item.chart_url)
      const {market_symbol, url} = rowData?.data
      window.location.href = `/backtester/sr/setup?index=${market_symbol || 'SPX'}&indicator=${url || item.chart_url}`
      // this.$router.push({
      //     name: 'IndicatorChart',
      //     query: {
      //       name: item.chart_name,
      //       url: item.chart_url
      //     }
      //   })
    },
    onSearch(items) {
      this.hasSearched = items.length > 0;
    },
    portfolio() {
      this.$refs['Indicators'].portfolio()
    },
    async getUrlToNameMap(map) {
      this.urlToNameMap = map
      await this.$refs['My Favorites'].getDataList()
    },
    // handleQuery() {
    //   this.$refs[this.selectedTitle].handleQuery(this.searchKey)
    // },
    highlightedTag(tag) {
      console.log('tag', tag)
      this.tag = tag
      this.$refs['My Favorites'].highlightedTag(tag)
    },
    async downloadCSV() {
      // 访问组件示例数据
      const type = this.searchCategory
      let data = this.indicatorsListData[type]
      if(!data || !data.length) {
        await this.fetchIndicatorsPageList(type)
        data = this.indicatorsListData[type] || []
      }
      if (!data.length) {
        this.popUpMsgBox('No data available for download')
        return
      }
      /* 
      NASDAQColumns 多 url(Symbol) z_score
      SP1500Columns 多 url(Symbol) z_score
      ETFSectorColumns chart_name 名为 Symbol
      ETFSectorBreadthColumns chart_name 名为 Breadth Measure
      ETFFundFlowColumns chart_name 名为 Symbol
      ETFMonthlyFundColumns chart_name 名为 Symbol
      ETFSharesColumns chart_name 名为 Symbol
      BondSeasonalityColumns 多 win_rate, avg_return
      CommoditySeasonalityColumns chart_name 名为 Symbol,  多 win_rate, avg_return
      ETFSeasonalityColumns chart_name 名为 Symbol
      */
      const keysSort = ['Name', 'Breadth Measure', 'Symbol', 'Groups', 'Time Frame', 'Value', 'Change', 'Win Rate', 'Avg Return', 'Date' ]
      const keysMap = new Map([
        ['chart_name', 'Name'],
        ['groups', 'Groups'],
        ['timeframe', 'Time Frame'],
        ['time_frame', 'Time Frame'],
        ['last_value', 'Value'],
        ['last_change', 'Change'],
        ['last_update', 'Date']
      ])
      if(type === 'etf_breadth') keysMap.set('chart_name', 'Breadth Measure')
      if(type === 'bond_seasonality' || type === 'commod_seasonality'){keysMap.set('win_rate', 'Win Rate');keysMap.set('avg_return', 'Avg Return')}
      if(type === 'ndx_100_complete_list' || type === 'sp_1500_complete_list') {keysMap.set('url', 'Symbol'); keysMap.set('z_score', 'Z-Score')}
      if(['etf_complete_list', 'etf_flow', 'monthly_fund_flows', 'shares_outstanding', 'commod_seasonality', 'etf_seasonality'].includes(type)) keysMap.set('chart_name', 'Symbol')

			const processedData = data.map(item => {
        const obj = {}
        const itemKeys = Array.from(Object.keys(item))
        itemKeys.forEach(key => {
          if(keysMap.get(key)) obj[keysMap.get(key)] = item[key]
        })
        return obj
			})
      const sortObjectKeys = (obj) => {
      const sortedObj = {}
        keysSort.forEach(key => {
            if (key in obj) {
                sortedObj[key] = obj[key]
            }
        })
        return sortedObj
      }
      const sortedArray = processedData.map(obj => sortObjectKeys(obj))
      const name = this.categories.find(item => item.value === type).label
			const ws = XLSX.utils.json_to_sheet(sortedArray);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, name);
      XLSX.writeFile(wb, `${name}.xlsx`);
    }
  }
}
</script>

<style lang="less" scoped>
@import "../index.less";
.searchBox {
  /deep/ .el-select .el-input__inner, /deep/ .el-input-group--append .el-input__inner {
    width: 178px;
    margin-left: 0px;
  }
}
.ais-Highlight-highlighted {
  background: cyan;
  font-style: normal;
}
.search-container {
  margin-left: 10px;
  position: relative;
}
.search-panel__search-box {
  position: relative;
}
.pagination {
  margin: 2rem auto;
  text-align: center;
}.search-panel__results {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.search-panel__results.active {
  display: block;
}
// .search-panel__results ul {
//   display: none;
// }

// .search-panel__results ul.active {
//   display: block;
// }
.pagination {
  display: none;
}

.pagination.active {
  display: block;
}
::v-deep .ais-SearchBox-input {
  width: 250px;
  height: 15px;
}
.chart_name {
  cursor: pointer;
  color: #5b9bd1;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
    color: #409EFF
  }
}
</style>