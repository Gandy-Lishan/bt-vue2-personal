<template>
  <div class="indicators-container">
    <div class="left" ref="ForTest">
     <template v-for="item in tableInfoList">
        <FavTable
          v-bind="$attrs"
          :key="item.type"
          :tableInfo="item"
          ref="favoriteVirtualScroll"
          @updateChart="updateChart" 
          :style="{ width: '60%', display: 'block' }"
        ></FavTable>
      </template>
      <Chart :row="displayRow" :id="'FavChart'" class="indicators-chart" :style="{height: '600px'}"></Chart>
    </div>
  </div>
 </template>
 
 <script>
 import FavTable from "./FavTable";
 import Chart from "./Chart"
 
 export default {
  name: 'ForTest',
  data () {
    return {
      tableInfoList: [
        {
          label: 'My Favorites',
          type: 'favorite',
          refName: 'favoriteVirtualScroll',
          itemSize: 40,
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
    FavTable
  },
  methods: {
    updateChart(row) {
      this.displayRow = row
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
    width: 40%;
  }
 }
 .image-hover {
  position: fixed;
    z-index: 2000;
    border: 1px solid #ccc;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
 </style>