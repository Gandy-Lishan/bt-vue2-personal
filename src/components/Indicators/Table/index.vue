<template>
  <div>
    <div class="strategy-container">
    <br>
    <div class="strategy-main">
      <div class="strategy-header">
        <div class="tableHeader">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Indicators'" :class="{ 'selected': selectedTitle === 'Indicators' }">Indicators</h4>
            <!-- <h4  @click="selectedTitle = 'Commodity'" :class="{ 'selected': selectedTitle === 'Commodity' }">Commodity</h4> -->
            <h4  @click="selectedTitle = 'Popular'" :class="{ 'selected': selectedTitle === 'Popular' }">Most Popular</h4>
            <h4  @click="selectedTitle = 'My Favorites'" :class="{ 'selected': selectedTitle === 'My Favorites' }">My Favorites</h4>
          </div>
          <div class="search-container">
            <Search></Search>
          </div>
          <div class="searchBox">
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
      <Favorites v-show="selectedTitle === 'My Favorites'" ref="Favorites" :selectedTitle="selectedTitle"></Favorites>
      <!-- <Commodity v-show="selectedTitle === 'Commodity'" ref="Commodity" :selectedTitle="selectedTitle"></Commodity> -->
    </div>
    </div>
  </div>
</template>
<script> 
import StrategiesTable from "./ForTest";
import Favorites from "./Favorites";
import Search from "./Search";
import Popular from "./Popular";
import Commodity from "./Commodity";
import { mapActions, mapGetters } from 'vuex'
import { getIndicatorsRowData } from "@/service/service";
import { isJson, LocalStorageUtil } from "@/utils";
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/algolia-min.css';
const XLSX = require('xlsx');

export default {
  name: 'IndicatorsList',
  provide() {
    return {
      removeIndicatorsFavorites: this.removeIndicatorsFavorites
    };
  },
  data() {
    return {
      searchClient: algoliasearch(
        'K88SIIDLSF',
        '080aea2b84a5e1263909139a3d6f1df1'
      ),
      selectedTitle: 'Indicators',
      searchKey: '',
      hasSearched: true,
      searchCategory: ''
    }
  },
  computed: {
    ...mapGetters({
      indicatorsListData: 'getIndicatorsPageListData',
      cssMonthLabel: 'getCssMonthLabel'
    }),
    categories() {
      if(this.selectedTitle === 'Indicators') {
        this.searchCategory = 'stock_complete_list'
        return [
        {
          label: 'Stocks Indicator List',
          value: 'stock_complete_list'
        },
        {
          label: 'NASDAQ 100 Optix',
          value: 'ndx_100_complete_list'
        },
        {
          label: 'S&P 1500 Optix',
          value: 'sp_1500_complete_list'
        },
        {
          label: 'Bond Indicator List',
          value: 'bond_complete_list'
        },
        {
          label: 'ETF Sector List',
          value: 'etf_complete_list'
        },
        {
          label: 'ETF Sector Breadth',
          value: 'etf_breadth'
        },
        {
          label: 'ETF Fund Flow',
          value: 'etf_flow'
        },
        {
          label: 'ETF Monthly Fund Flow',
          value: 'monthly_fund_flows'
        },
        {
          label: 'ETF Shares Outstanding',
          value: 'shares_outstanding'
        },
        {
          label: 'Commodity Seasonality',
          value: 'commod_seasonality'
        },
        {
          label: 'Bond Seasonality',
          value: 'bond_seasonality'
        },
        {
          label: 'ETF Seasonality',
          value: 'etf_seasonality'
        }
      ]
      }
      if(this.selectedTitle === 'Popular') {
        this.searchCategory = 'most_popular'
        return [
          {
            label: 'Most Popular Charts',
            value: 'most_popular'
          }
        ]
      }
      if(this.selectedTitle === 'My Favorites') {
        this.searchCategory = 'my_favorites'
        return [
          {
            label: 'My Favorites',
            value: 'my_favorites'
          }
        ]
      }
      if(this.selectedTitle === 'Commodity') {
        this.searchCategory = 'commodity_complete_list'
        return [
          {
            label: 'Commodity Indicator List',
            value: 'commodity_complete_list'
          },
          {
            label: 'Commodity Sentiment & Seasonality Screen',
            value: 'commod_sentiment_seasonality',
            name: 'CSScreen'
          },
          {
            label: 'Commodity Sentiment & Trend Screen',
            value: 'commod_optix_trend',
            name: 'CSTcreen'
          },
          {
            label: 'Commodity Hedgers - 3-year Min/Max',
            value: 'cot_max_min',
            name: 'ComHedgMinMax'
          }
        ]
      }
    },
  },
  components: {
    StrategiesTable,
    Favorites,
    Popular,
    Search,
    // Commodity
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
    ...mapActions('chart', ['fetchIndicatorsPageList']),
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
    async downloadCSV() {
      // 访问组件示例数据
      const type = this.searchCategory
      let data = isJson(this.indicatorsListData[type]) ? JSON.parse(this.indicatorsListData[type]) : []
      let cssMonthLabel = this.cssMonthLabel
      let xlsxName = null
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
      let keysSort = ['Optix', 'Symbol', 'Name', 'Breadth Measure', 'Symbol', 'Groups', 'Time Frame', 'Value', 'Optix Value', 'Last Value', 'Z-Score', 'Change', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date', 'Optix Date', 'Last Update', '3-Year Max', '3-Year Min' ]
      if(type === 'commod_sentiment_seasonality') {const insertIndex = keysSort.findIndex(key => key === 'Avg Return'); if(insertIndex !== -1) keysSort.splice(insertIndex, 0, `Avg Return (%) for ${cssMonthLabel}`)}
      if(type === 'commod_seasonality' || type === 'bond_seasonality' || type === 'etf_seasonality') keysSort = ['Symbol','Name', 'Groups', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date']
      const keysMap = new Map([
        ['chart_name', 'Name'],
        ['sub_type', 'Groups'],
        ['timeframe', 'Time Frame'],
        ['time_frame', 'Time Frame'],
        ['last_value', 'Value'],
        ['last_change', 'Change'],
        ['last_update', 'Date']
      ])
      if(type === 'etf_breadth') keysMap.set('chart_name', 'Breadth Measure')
      if(type === 'bond_seasonality' || type === 'commod_seasonality' || type === 'etf_seasonality'){keysMap.set('win_rate', 'Win Rate');keysMap.set('avg_return', 'Avg Return')}
      if(type === 'commod_seasonality' || type === 'etf_seasonality') {keysMap.set('chart_name', 'Symbol');keysMap.set('underlying_name', 'Name')}
      if(type === 'etf_seasonality') keysMap.set('avg_net_return', 'Avg Net Return')
      if(type === 'ndx_100_complete_list' || type === 'sp_1500_complete_list') {keysMap.set('url', 'Symbol'); keysMap.set('z_score', 'Z-Score')}
      if(['etf_complete_list', 'etf_flow', 'monthly_fund_flows', 'shares_outstanding', 'commod_seasonality', 'etf_seasonality'].includes(type)) keysMap.set('chart_name', 'Symbol')
      if(type === 'commod_sentiment_seasonality' || type === 'commod_optix_trend') {keysMap.set('chart_name', 'Optix');keysMap.set('name', 'Name');keysMap.set('last_value', 'Optix Value');}
      if(type === 'commod_sentiment_seasonality') {keysMap.set('last_update', 'Optix Date');keysMap.set('AvgReturn', `Avg Return (%) for ${cssMonthLabel}`);}
      if(type === 'commod_optix_trend') {keysMap.set('close', 'Close');keysMap.set('MA', '200-Day Moving Average');}
      if(type === 'cot_max_min') {keysMap.set('chart_name', 'Name');keysMap.set('symbol', 'Symbol');keysMap.set('last_value', 'Last Value');keysMap.set('last_update', 'Last Update');keysMap.set('three_year_max', '3-Year Max');keysMap.set('three_year_min', '3-Year Min');}

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
      const category = this.categories.find(item => item.value === type)
      if(!['commod_sentiment_seasonality', 'commod_optix_trend', 'cot_max_min'].includes(type)) xlsxName = category.label
      if(['commod_sentiment_seasonality', 'commod_optix_trend', 'cot_max_min'].includes(type)) xlsxName = category.name
			const ws = XLSX.utils.json_to_sheet(sortedArray);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, xlsxName);
      XLSX.writeFile(wb, `${xlsxName}.xlsx`);
    },
    
    async removeIndicatorsFavorites(row) {   
      const sourceRefNameMap = new Map([
        [[
          'stock_complete_list', 'ndx_100_complete_list', 'sp_1500_complete_list',
          'bond_complete_list', 'etf_complete_list', 'etf_breadth', 'etf_flow',
          'monthly_fund_flows', 'shares_outstanding', 'commod_seasonality',
          'bond_seasonality', 'etf_seasonality'
        ],'Indicators'],
        [[
          'commodity_complete_list', 'commod_sentiment_seasonality', 
          'commod_optix_trend', 'cot_max_min'
        ],'Commodity'],
        [['most_popular'], 'Popular']
      ])
      // 改变 vuex 和 table 的数据
      const _row = row[0]
      const url = _row.source_list
      const pRefName = sourceRefNameMap.get(Array.from(sourceRefNameMap.keys()).find(keys => keys.find(key => key === url)))
      this.$refs[pRefName].updateTable(_row)
      // 移除收藏的时候同步 most popular 数据
      const _results = isJson(this.indicatorsListData['most_popular']) ? JSON.parse(this.indicatorsListData['most_popular']) : []
      const findIndex =_results.findIndex(item => item.url === _row.url)
      if(findIndex !== -1 && url !== 'most_popular') {_row.source_list = 'most_popular';this.$refs['Popular'].updateTable(_row)}
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