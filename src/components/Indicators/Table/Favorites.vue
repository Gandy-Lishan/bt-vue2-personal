<template>
  <div class="indicators-container">
    <div class="left" ref="ForTest">
     <template v-for="item in tableInfoList">
        <FavTable
          v-bind="$attrs"
          :key="item.type"
          :tableInfo="item"
          :ref="item.refName"
          @updateChart="updateChart" 
          :style="{ width: '60%', display: 'block' }"
        ></FavTable>
      </template>
      <Chart :row="displayRow" :id="'FavChart'" class="indicators-chart" :style="{height: '600px'}"></Chart>
    </div>
    <div class="image-hover" :style="hoverStyle" v-if="showImg">
      <img style="height: 300px; width: 100%;" :src="hoveredImage" :alt="hoveredChartName" @load="onLoad" @error="onError"/>
    </div>
  </div>
 </template>
 
 <script>
 import FavTable from "./FavTable";
 import Chart from "./Chart"
 
 export default {
  name: 'ForTest',
  provide() {
    return {
      sendData: this.sendData
    };
  },
  data () {
    return {
      tableInfoList: [
        {
          label: 'My Favorites',
          type: 'favorite',
          refName: 'popularVirtualScroll',
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
      showImg: false,
      hoveredImage: `https://d1wrgh3h32hjn2.cloudfront.net/etf_spy_250.png`,
      hoverStyle: {display: 'none'},
      hoveredChartName: '',
      enlargedTable: 'Most Popular',
    }
  },
  components: {
    Chart,
    FavTable
  },
  methods: {
    updateChart(row) {
      debugger
      this.displayRow = row
    },
    sendData(data) {
      const clientHight = (this.$refs['ForTest'].offsetHeight)
      const clientWidth = (this.$refs['ForTest'].offsetWidth)
      console.log(this.$refs['ForTest'])
      console.log(clientHight, clientWidth)
      const container = this.$refs['ForTest']
      if(container) {
        console.log('container', container.getBoundingClientRect())
      }
      // if(data.refName) {
      //   const element = this.$refs[data.refName]
      //   if(element) console.log('element', element[0].getBoundingClientRect())
      // }
      this.showImg = data?.showImg
      this.hoveredImage = data?.hoveredImage
      this.hoverStyle = data?.hoverStyle
      console.log(data?.hoverStyle?.top, data?.hoverStyle?.left)
      this.hoveredChartName = data?.hoveredChartName
      console.log('Received data from child:', data);
    },
    onLoad() {
      this.showImg = true
    },
    onError() {
      this.showImg = false
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