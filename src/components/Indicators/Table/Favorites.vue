<template>
  <div class="indicators-container">
    <div class="footer-des">
      <Description v-if="!isShowDetails" :enlargedTable="'Stock'" :checkedType="'stock'"></Description>
    </div>
    <div class="indicator-left" ref="IndicatorTable">
     <template v-for="item in tableInfoList">
        <FavTable
          :key="item.type"
          v-bind="$attrs"
          :tableInfo="item"
          ref="favoriteVirtualScroll"
          @updateChart="updateChart" 
          @showDetails="showDetails"
          :style="{ width: '50%', display: !isShowDetails ? 'block' : 'none' }"
        ></FavTable>
      </template>
      <Details v-show="isShowDetails" :row="(isShowDetails) ? displayRow : {}" :checkedTitle="'Favorite\'s Indicator List'" :style="{width: '50%'}" @showDetails="showDetails"></Details>
      <SeasonalityChart :id="'FavChart'" :isShowDetails="isShowDetails" :row="displayRow"  v-if="displayRow && displayRow.type && displayRow.type.includes('seasonality')" class="indicators-chart" :style="{ height: isShowDetails ? '830px' : '725px', width: '50%'}"></SeasonalityChart>
      <Chart :row="displayRow"  v-else :id="'FavChart'" class="indicators-chart" :style="{height: isShowDetails ? '830px' : '725px', width: '50%'}"></Chart>
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
      this.updateChart(Object.keys(row).length !== 0 ? {...row} : this.displayRow)
      this.isShowDetails = isShowDetails
    }
  }
 }
 </script>
 
 <style lang="less" scoped>
 .indicator-left {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  flex-grow: 1;
  // .indicators-chart {
  //   width: 50%;
  // }
 }
 </style>