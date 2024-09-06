<template>
  <div class="indicators-container">
    <div class="footer-des">
      <Description v-if="!isShowDetails" :enlargedTable="'Stock'" :checkedType="'stock'"></Description>
    </div>
    <div class="left" ref="IndicatorTable">
     <template v-for="item in tableInfoList">
        <FavTable
          :key="item.type"
          v-bind="$attrs"
          :tableInfo="item"
          ref="favoriteVirtualScroll"
          @updateChart="updateChart" 
          @showDetails="showDetails"
          :style="{ width: '65%', display: !isShowDetails ? 'block' : 'none' }"
        ></FavTable>
      </template>
      <Details v-show="isShowDetails" :row="(isShowDetails) ? displayRow : {}" :checkedTitle="'Favorite\'s Indicator List'" style="width: 65%" @showDetails="showDetails"></Details>
      <SeasonalityChart :id="'FavChart'" :row="displayRow"  v-if="displayRow && displayRow.type && displayRow.type.includes('seasonality')" class="indicators-chart" :style="{ height: '745px', marginTop: isShowDetails ? '125px' : '0'}"></SeasonalityChart>
      <Chart :row="displayRow"  v-else :id="'FavChart'" class="indicators-chart" :style="{height: '745px', marginTop: isShowDetails ? '125px' : '0'}"></Chart>
      <AboutUs></AboutUs>
    </div>
  </div>
 </template>
 
 <script>
 import FavTable from "./FavTable";
 import Chart from "./Chart"
import SeasonalityChart from "./SeasonalityChart"
import Description from "./Description";
import Details from "./Details";
import AboutUs from "./AboutUs";
 
 export default {
  name: 'IndicatorTable',
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
      isShowDetails: false
    }
  },
  components: {
    Chart,
    FavTable,
    SeasonalityChart,
    Description,
    Details,
    AboutUs
  },
  methods: {
    updateChart(row) {
      this.displayRow = row
      console.log(row)
    },
    showDetails(row, isShowDetails) {
      this.isShowDetails = isShowDetails
    }
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