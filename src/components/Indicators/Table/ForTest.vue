<template>
  <div class="indicators-container" ref="indiRef">
    <div class="left">
      <template v-for="item in tableInfoList">
        <Table
          v-bind="$attrs"
          v-on="$listeners"
         :key="item.type"
         :tableInfo="item"
         :ref="item.refName"
         @updateChart="updateChart" 
         :style="{ width: enlargedTable === item.label ? '65%' : '50%', display: enlargedTable === item.label || enlargedTable === null ? 'block' : 'none' }"
         ></Table>
      </template>
      <Chart :chartHight="chartHight" :id="'indiChart'" v-if="enlargedTable !== null && !displayRow?.type.includes('seasonality')" :row="displayRow" class="indicators-chart" :style="{ height: `600px`}"></Chart>
      <SeasonalityChart v-if="enlargedTable !== null && displayRow?.type.includes('seasonality')" :row="displayRow" class="indicators-chart" :style="{ height: `600px`}"></SeasonalityChart>
    </div>
  </div>
</template>

<script>
import Table from "./Table";
import Chart from "./Chart"
import SeasonalityChart from "./SeasonalityChart"
import { mapActions, mapGetters } from 'vuex'
import { isJson } from '@/utils'

export default {
  name: 'ForTest',
  provide() {
    return {
      toggleEnlarge: this.toggleEnlarge
    };
  },
  data () {
    return {
      tableInfoList: [
        {
          label: 'Stock',
          type: 'stock',
          refName: 'stockVirtualScroll',
          itemSize: 50,
          keyProp: 'url',
          options: [
            {
              label: 'Stocks Indicator List',
              value: 'stock',
              type: 'stock',
              url: 'stock_complete_list'
            },
            {
              label: 'NASDAQ 100 Optix',
              value: 'NASDAQ',
              type: 'stock',
              url: 'ndx_100_complete_list',
            },
            {
              label: 'S&P 1500 Optix',
              value: 'SP1500',
              type: 'stock',
              url: 'sp_1500_complete_list',
            }
          ]
        },
        {
          label: 'Bond & Commodity',
          type: 'bond',
          refName: 'bondVirtualScroll',
          itemSize: 50,
          keyProp: 'url',
          options: [
            {
              label: 'Bond Indicator List',
              value: 'bond',
              type: 'bond',
              url: 'bond_complete_list'
            },
            {
              label: 'Commodity Indicator List',
              value: 'commodity',
              type: 'commodity',
              url: 'commodity_complete_list'
            }
          ]
        },
        // {
        //   label: 'Commodity',
        //   type: 'commodity',
        //   refName: 'commodityVirtualScroll',
        //   itemSize: 50,
        //   keyProp: 'url',
        //   options: [
        //     {
        //       label: 'Commodity Indicator List',
        //       value: 'commodity',
        //       type: 'commodity'
        //     }
        //   ]
        // },
        {
          label: 'ETF',
          type: 'ETFSector',
          refName: 'ETFVirtualScroll',
          itemSize: 50,
          keyProp: 'url',
          options: [
            {
              label: 'ETF Sector List',
              value: 'ETFSector',
              type: 'ETF',
              url: 'etf_complete_list'
            },
            {
              label: 'ETF Sector Breadth',
              value: 'ETFSectorBreadth',
              type: 'ETF',
              url: 'etf_breadth'
            },
            {
              label: 'ETF Fund Flow',
              value: 'ETFFundFlow',
              type: 'ETF',
              url: 'etf_flow'
            },
            {
              label: 'ETF Monthly Fund Flow',
              value: 'ETFMonthlyFund',
              type: 'ETF',
              url: 'monthly_fund_flows'
            },
            {
              label: 'ETF Shares Outstanding',
              value: 'ETFShares',
              type: 'ETF',
              url: 'shares_outstanding'
            },
          ]
        },
        {
          label: 'Seasonality',
          type: 'CommoditySeasonality',
          refName: 'seasonalityVirtualScroll',
          itemSize: 50,
          keyProp: 'url',
          options: [
            {
              label: 'Commodity Seasonality',
              value: 'CommoditySeasonality',
              type: 'seasonality',
              url: 'commod_seasonality'
            },
            {
              label: 'ETF Seasonality',
              value: 'ETFSeasonality',
              type: 'seasonality',
              url: 'etf_seasonality'
            },
            {
              label: 'Bond Seasonality',
              value: 'BondSeasonality',
              type: 'seasonality',
              url: 'bond_seasonality'
            },
          ]
        },
        // {
        //   label: 'Most Popular',
        //   type: 'stock',
        //   refName: 'popularVirtualScroll',
        //   itemSize: 50,
        //   keyProp: 'url',
        //   options: [
        //     {
        //       label: 'Stocks Indicator List',
        //       value: 'stock',
        //       type: 'mostPopular',
        //     }
        //   ]
        // },
      ],
      displayRow: {},
      enlargedTable: null,
      chartHight: '600px'
    }
  },
  components: {
    Chart,
    Table,
    SeasonalityChart
  },
  computed: {
    ...mapGetters({
      indicatorsListData: 'getIndicatorsPageListData'
    })
  },
  mounted() {
    this.getDistanceFromBottom();
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.getDistanceFromBottom);
    // 监听滚动事件
    window.addEventListener('scroll', this.getDistanceFromBottom);
  },
  beforeDestroy() {
    // 清除事件监听器
    window.removeEventListener('resize', this.getDistanceFromBottom);
    window.removeEventListener('scroll', this.getDistanceFromBottom);
  },
  methods: {
    getDistanceFromBottom() {
      const element = this.$refs.indiRef;
      const rect = element.getBoundingClientRect();
      console.log('window', window)
      console.log('rect', rect)
      const elementBottomToViewportBottom = window.innerHeight - rect.top;
      // const scrollY = window.scrollY;
      // const distanceFromBottom = elementBottomToViewportBottom + scrollY;

      console.log(`Distance from bottom: ${elementBottomToViewportBottom}px`);
      this.chartHight = elementBottomToViewportBottom
      // this.$forceUpdate();
      // return distanceFromBottom;
    },
    toggleEnlarge(label) {
      console.log('toggleEnlarge', label)
      if (this.enlargedTable === label) {
        this.enlargedTable = null; // Restore all tables if already enlarged
      } else {
        this.enlargedTable = label; // Enlarge the clicked table
      }
    },
    updateChart(row) {
      console.log('updateChart', row)
      this.displayRow = row
    },
    updateTable(row) {
      const url = row.source_list
      const findTable = this.tableInfoList.find(ele => ele.options.find(option => option.url === url))
      const value = findTable.options.find(ele => ele.url === url).value
      const refName = findTable.refName
      // 改数据
      const  _results = isJson(this.indicatorsListData[url]) ? JSON.parse(this.indicatorsListData[url]) : []
      const findIndex = _results.findIndex(ele => ele.url === row.url)
      if(findIndex !== -1) {
        const find = _results[findIndex]
        _results.splice(findIndex, 1, {...find, favorite: !find.favorite})
        this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url, data: _results})
        this.$refs[refName][0].loadMore(value)
      }
    },
    async enLargeTable(source_list, row) {
      const findTable = this.tableInfoList.find(ele => ele.options.find(option => option.url === source_list))
      console.log('findTable', findTable)
      if(!findTable) return
      const checked = findTable.options.find(ele => ele.url === source_list).value
      const findRefsName = findTable?.refName
      // 应该清空缩小已放大的 table
      const clearRefName = this.tableInfoList.map(item => item.refName).filter(item => item !== findRefsName)
      console.log('clearRefName', clearRefName)
      clearRefName.forEach(item => {
        this.$refs[item][0].clearEnlarge()
      })
      await this.$refs[findRefsName][0].enLargeTable(checked, row)
    }
  }
}
</script>

<style lang="less" scoped>
.indicators-container {
  // display: grid;
  // grid-template-columns: 70% 30%;
  // position: relative;
  // display: flex;
}
.left {
  // display: grid;
  // grid-template-columns: repeat(2, 1fr);
  // grid-template-rows: repeat(3, 1fr);
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  flex-grow: 1;
  .indicators-chart {
    width: 35%;
  }
}

// .image-hover {
//   position: fixed;
//     z-index: 2000;
//     border: 1px solid #ccc;
//     background: #fff;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
//   }
// .right {
//   display: grid;
//   grid-template-columns: 1fr;
//   grid-template-rows: 400px auto;
//   .image-hover {
//     height: 400px;
//   }
  // .indicators-chart {
  //   width: 100%;
  // }
// }
</style>