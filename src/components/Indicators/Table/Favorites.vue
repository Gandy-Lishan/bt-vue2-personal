<template>
  <div class="indicators-container">
    <div class="left" ref="ForTest">
     <template v-for="item in tableInfoList">
        <FavTable
          :key="item.type"
          v-bind="$attrs"
          :tableInfo="item"
          ref="favoriteVirtualScroll"
          @updateChart="updateChart" 
          :style="{ width: '65%', display: 'block' }"
        ></FavTable>
      </template>
      <SeasonalityChart :id="'FavChart'" :row="displayRow"  v-if="displayRow && displayRow.type && displayRow.type.includes('seasonality')" class="indicators-chart" :style="{ height: '694px'}"></SeasonalityChart>
      <Chart :row="displayRow"  v-else :id="'FavChart'" class="indicators-chart" :style="{height: '694px'}"></Chart>
    </div>
  </div>
 </template>
 
 <script>
 import FavTable from "./FavTable";
 import Chart from "./Chart"
import SeasonalityChart from "./SeasonalityChart"
 
 export default {
  name: 'ForTest',
  data () {
    return {
      tableInfoList: [
        {
          label: 'My Favorites',
          type: 'favorite',
          refName: 'favoriteVirtualScroll',
          itemSize: 50,
          keyProp: 'url',
          options: [
            {
              label: "Favorite's Indicator List",
              value: 'favorite',
              type: 'favorite',
            }
          ]
        }
      ],
      displayRow: {},
    }
  },
  components: {
    Chart,
    FavTable,
    SeasonalityChart
  },
  methods: {
    updateChart(row) {
      this.displayRow = row
      console.log(row)
    },
  }
 }
 </script>
 
 <style lang="less" scoped>
 .left {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  flex-grow: 1;
  .indicators-chart {
    width: 35%;
  }
 }
 </style>