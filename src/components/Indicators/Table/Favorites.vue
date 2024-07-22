<template>
 <div class="indicators-container">
   <div class="left" ref="ForTest">
     <template v-for="item in tableInfoList">
       <Table
        v-bind="$attrs"
        :key="item.type"
        :tableInfo="item"
        :ref="item.refName"
        @updateChart="updateChart" 
        :style="{ width: '60%', display: 'block' }"
        ></Table>
     </template>
     <Chart :row="displayRow" class="indicators-chart" :style="{ height: '600px'}"></Chart>
   </div>
   <div class="image-hover" :style="hoverStyle" v-if="showImg">
     <img style="height: 300px; width: 100%;" :src="hoveredImage" :alt="hoveredChartName" @load="onLoad" @error="onError"/>
   </div>
 </div>
</template>

<script>
import Table from "./Table";
import Chart from "./Chart"

export default {
 name: 'Favorites',
 provide() {
   return {
     sendData: this.sendData
   };
 },
 data () {
   return {
     tableInfoList: [
       {
         label: 'Most Popular',
         type: 'stock',
         refName: 'popularVirtualScroll',
         itemSize: 40,
         keyProp: 'url',
         options: [
           {
             label: 'Stocks Indicator List',
             value: 'stock',
             type: 'stock',
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
   Table
 },
 methods: {
   updateChart(row) {
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

.image-hover {
 position: fixed;
   z-index: 2000;
   border: 1px solid #ccc;
   background: #fff;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
 }
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