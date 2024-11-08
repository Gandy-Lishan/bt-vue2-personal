<template>
  <div class="indicators-container">
    <div class="indicator-left" ref="IndicatorTable">
      <template v-for="item in tableInfoList">
        <Table
         :key="item.type"
         :tableInfo="item"
         :ref="item.refName"
         @updateChart="updateChart" 
         :style="{ width: enlargedTable === item.label ? '60%' : '50%', display: enlargedTable === item.label || enlargedTable === null ? 'block' : 'none' }"
         ></Table>
      </template>
      <Chart :id="'indiChart'" v-if="enlargedTable && displayRow?.type !== 'commod_seasonality'" :row="displayRow" class="indicators-chart" :style="{ height: '600px'}"></Chart>
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
  name: 'Commodity',
  provide() {
    return {
      toggleEnlarge: this.toggleEnlarge
    };
  },
  data () {
    return {
      tableInfoList: [
        {
          label: 'Commodity Market Sentiment',
          type: 'commodity',
          refName: 'commodityVirtualScroll',
          itemSize: 40,
          keyProp: 'url',
          options: [
            {
              label: 'Commodity Market Sentiment',
              value: 'commodity',
              type: 'commodity',
              url: 'commodity_complete_list'
            }
          ]
        },
        {
          label: 'Commodity Sentiment & Seasonality Screen',
          type: 'cssScreen',
          refName: 'cssVirtualScroll',
          itemSize: 40,
          keyProp: 'url',
          options: [
            {
              label: 'Commodity Sentiment & Seasonality Screen',
              value: 'cssScreen',
              type: 'cssScreen',
              url: 'commod_sentiment_seasonality'
            }
          ]
        },
        {
          label: 'Commodity Sentiment & Trend Screen',
          type: 'cstScreen',
          refName: 'cstVirtualScroll',
          itemSize: 40,
          keyProp: 'url',
          options: [
            {
              label: 'Commodity Sentiment & Trend Screen',
              value: 'cstScreen',
              type: 'cstScreen',
              url: 'commod_optix_trend'
            }
          ]
        },
        {
          label: 'Commodity Hedgers - 3-year Min/Max',
          type: 'CHMinMax',
          refName: 'CHMinMaxVirtualScroll',
          itemSize: 40,
          keyProp: 'url',
          options: [
            {
              label: 'Commodity Hedgers - 3-year Min/Max',
              value: 'CHMinMax',
              type: 'CHMinMax',
              url: 'cot_max_min'
            }
          ]
        },
      ],
      displayRow: {},
      enlargedTable: null,
    }
  },
  computed: {
    ...mapGetters({
      indicatorsListData: 'getIndicatorsPageListData'
    })
  },
  components: {
    Chart,
    Table,
    SeasonalityChart
  },
  methods: {
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
.indicator-left {
  // display: grid;
  // grid-template-columns: repeat(2, 1fr);
  // grid-template-rows: repeat(3, 1fr);
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  flex-grow: 1;
  .indicators-chart {
    width: 50%;
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