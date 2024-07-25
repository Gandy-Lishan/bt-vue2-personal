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
     <Chart :id="'popuChart'" :row="displayRow" class="indicators-chart" :style="{ height: '600px'}"></Chart>
   </div>
 </div>
</template>

<script>
import Table from "./Table";
import Chart from "./Chart"

export default {
 name: 'ForTest',
 data () {
   return {
     tableInfoList: [
       {
         label: 'Most Popular Charts',
         type: 'popular',
         refName: 'popularVirtualScroll',
         itemSize: 40,
         keyProp: 'url',
         options: [
           {
             label: 'Most Popular Charts',
             value: 'popular',
             type: 'popular',
           }
         ]
       }
     ],
     displayRow: {}
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