<template>
  <div>
    <div class="strategy-container">
    <div class="strategy-main">
      <div class="strategy-header">
        <div class="tableHeader">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Indicators'" :class="{ 'selected': selectedTitle === 'Indicators' }">Indicators</h4>
            <!-- <h4  @click="selectedTitle = 'Commodity'" :class="{ 'selected': selectedTitle === 'Commodity' }">Commodity</h4> -->
            <h4  @click="selectedTitle = 'Popular'" :class="{ 'selected': selectedTitle === 'Popular' }">Most Popular</h4>
            <h4  @click="selectedTitle = 'My Favorites'" :class="{ 'selected': selectedTitle === 'My Favorites' }">My Favorites</h4>
            <!-- <h4  @click="selectedTitle = 'Trend Score'" :class="{ 'selected': selectedTitle === 'Trend Score' }">Trend Scores for Sector</h4> -->
          </div>
          <div class="search-container">
            <Search @enLargeTable="enLargeTable"></Search>
          </div>
        </div>
      </div>
      <IndicatorTable v-if="selectedTitle === 'Indicators'" ref="Indicators"></IndicatorTable>
      <Popular v-if="selectedTitle === 'Popular'" ref="Popular" :selectedTitle="selectedTitle"></Popular>
      <Favorites v-if="selectedTitle === 'My Favorites'" ref="Favorites" :selectedTitle="selectedTitle"></Favorites>
      <!-- <TrendScoreTable v-show="selectedTitle === 'Trend Score'"></TrendScoreTable> -->
      <!-- <Commodity v-show="selectedTitle === 'Commodity'" ref="Commodity" :selectedTitle="selectedTitle"></Commodity> -->
    </div>
    </div>
  </div>
</template>
<script> 
import IndicatorTable from "./IndicatorTable";
import Favorites from "./Favorites";
import Search from "./Search";
import Popular from "./Popular";
// import TrendScoreTable from "./TrendScoreTable";
import { mapActions, mapGetters } from 'vuex'
import { isJson } from "@/utils";

export default {
  name: 'IndicatorsList',
  provide() {
    return {
      removeIndicatorsFavorites: this.removeIndicatorsFavorites,
      enLargeTableFromIndex: this.enLargeTable
    };
  },
  data() {
    return {
      selectedTitle: 'Indicators',
    }
  },
  computed: {
    ...mapGetters({
      indicatorsListData: 'getIndicatorsPageListData',
      cssMonthLabel: 'getCssMonthLabel'
    }),
  },
  components: {
    IndicatorTable,
    Favorites,
    Popular,
    Search,
    // TrendScoreTable
    // Commodity
  },
  // async created() {
  //   await this.get_indicator_page_btv1_list()
  //   await this.get_favorite()
  // },
  beforeDestroy() {
    this.$refs['Indicators'] = null
    this.$refs['Popular'] = null
    this.$refs['Favorites'] = null
  },
  watch: {
    // 数据源更新时tableData同时响应,只会在getAIPick时获取originData
    selectedTitle: {
      async handler(newValue){
        if(newValue === 'My Favorites') {
          await this.get_favorite()
        }
      }
    }
  },
  methods: {
    ...mapActions('chart', ['fetchIndicatorsPageList', 'get_favorite']),
    async removeIndicatorsFavorites(row, isSyncPopular) {   
      const sourceRefNameMap = new Map([
        [[
          'stock_complete_list', 'ndx_100_complete_list', 'sp_1500_complete_list', 'russell_3000_complete_list',
          'bond_complete_list', 'etf_complete_list', 'etf_breadth', 'country_complete_list', 'crypto_breadth_complete_list', 'etf_flow',
          'monthly_fund_flows', 'shares_outstanding', 'commod_seasonality',
          'bond_seasonality', 'etf_seasonality', 'commodity_complete_list'
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
      // this.$refs[pRefName].updateTable({...row, loading: false})
      // 移除收藏的时候同步 most popular 数据
      // const _results = isJson(this.indicatorsListData['most_popular']) ? JSON.parse(this.indicatorsListData['most_popular']) : []
      // const findIndex =_results.findIndex(item => item.url === _row.url)
      // if(findIndex !== -1 && url !== 'most_popular' && isSyncPopular) {_row.source_list = 'most_popular';this.$refs['Popular'].updateTable(_row)}
    },
    async enLargeTable(source_list, row) {
      if(source_list === 'most_popular') {
        if(this.selectedTitle !== 'Popular') this.selectedTitle = 'Popular'
        this.$refs['Popular'].enLargeTable(row)
        return
      }
      if(this.selectedTitle !== 'Indicators') this.selectedTitle = 'Indicators'
      await this.$refs['Indicators'].enLargeTable(source_list, row)
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
  position: absolute;
  right: 0;
  bottom: 0;
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
.strategy-main {
  background-color: #fff;
}
</style>