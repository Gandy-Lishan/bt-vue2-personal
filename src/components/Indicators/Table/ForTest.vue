<template>
  <div class="indicators-container">
    <div class="left" ref="ForTest">
      <template v-for="item in tableInfoList">
        <Table
         :key="item.type"
         :tableInfo="item"
         :ref="item.refName"
         @updateChart="updateChart" 
         :style="{ width: enlargedTable === item.label ? '60%' : '50%', display: enlargedTable === item.label || enlargedTable === null ? 'block' : 'none' }"
         ></Table>
      </template>
      <Chart :id="'indiChart'" v-if="enlargedTable !== null && displayRow?.type !== 'commod_seasonality'" :row="displayRow" class="indicators-chart" :style="{ height: '600px'}"></Chart>
      <SeasonalityChart v-if="enlargedTable !== null && displayRow?.type === 'commod_seasonality'" :row="displayRow" class="indicators-chart" :style="{ height: '600px'}"></SeasonalityChart>
    </div>
    <!-- <div class="image-hover" :style="hoverStyle">
      <img style="height: 300px; width: 100%;" v-if="showImg" :src="hoveredImage" :alt="hoveredChartName" @load="onLoad" @error="onError"/>
    </div> -->
  </div>
</template>

<script>
import Table from "./Table";
import Chart from "./Chart"
import SeasonalityChart from "./SeasonalityChart"

export default {
  name: 'ForTest',
  provide() {
    return {
      sendData: this.sendData,
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
              type: 'stock'
            },
            {
              label: 'NASDAQ 100 Optix',
              value: 'NASDAQ',
              type: 'stock'
            },
            {
              label: 'S&P 1500 Optix',
              value: 'SP1500',
              type: 'stock'
            }
          ]
        },
        {
          label: 'Bond',
          type: 'bond',
          refName: 'bondVirtualScroll',
          itemSize: 50,
          keyProp: 'url',
          options: [
            {
              label: 'Bond Indicator List',
              value: 'bond',
              type: 'bond'
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
              type: 'ETF'
            },
            {
              label: 'ETF Sector Breadth',
              value: 'ETFSectorBreadth',
              type: 'ETF'
            },
            {
              label: 'ETF Fund Flow',
              value: 'ETFFundFlow',
              type: 'ETF'
            },
            {
              label: 'ETF Monthly Fund Flow',
              value: 'ETFMonthlyFund',
              type: 'ETF'
            },
            {
              label: 'ETF Shares Outstanding',
              value: 'ETFShares',
              type: 'ETF'
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
              type: 'seasonality'
            },
            {
              label: 'Bond Seasonality',
              value: 'BondSeasonality',
              type: 'seasonality'
            },
            {
              label: 'ETF Seasonality',
              value: 'ETFSeasonality',
              type: 'seasonality'
            }
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
      showImg: false,
      hoveredImage: `https://d1wrgh3h32hjn2.cloudfront.net/etf_spy_250.png`,
      hoverStyle: {display: 'none'},
      hoveredChartName: '',
      enlargedTable: null,
    }
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
    sendData(data) {
      const clientHight = (this.$refs['ForTest'].offsetHeight)
      const clientWidth = (this.$refs['ForTest'].offsetWidth)
      console.log(this.$refs['ForTest'])
      // console.log(clientHight, clientWidth)
      const container = this.$refs['ForTest']
      if(container) {
        console.log('container', container.getBoundingClientRect())
      }
      // if(data.refName) {
      //   const element = this.$refs[data.refName]
      //   if(element) console.log('element', element[0].getBoundingClientRect())
      // }
      debugger
      this.showImg = data?.showImg
      this.hoveredImage = data?.hoveredImage
      this.hoverStyle = data?.hoverStyle
      console.log(data?.hoverStyle?.top, data?.hoverStyle?.left)
      this.hoveredChartName = data?.hoveredChartName
      console.log('Received data from child:', data);
    },
    onLoad() {
      debugger
      this.showImg = true
    },
    onError() {
      this.showImg = false
    },
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
    width: 40%;
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