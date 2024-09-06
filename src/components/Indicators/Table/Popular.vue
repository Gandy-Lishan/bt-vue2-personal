<template>
 <div class="indicators-container">
   <div class="footer-des">
      <Description v-if="!isShowDetails" :enlargedTable="'Stock'" :checkedType="'stock'"></Description>
    </div>
   <div class="left" ref="IndicatorTable">
     <template v-for="item in tableInfoList">
       <Table
        v-bind="$attrs"
        :key="item.type"
        :tableInfo="item"
        :ref="item.refName"
        :isShowDetails="isShowDetails"
        @updateChart="updateChart"
        @showDetails="showDetails"
        :style="{ width: '65%', display: !isShowDetails ? 'block' : 'none' }"
        ></Table>
     </template>
     <Details v-show="isShowDetails" :row="(isShowDetails) ? displayRow : {}" :checkedTitle="'Most Popular Charts'" style="width: 65%" @showDetails="showDetails"></Details>
     <Chart :id="'popuChart'" :row="displayRow" class="indicators-chart" :style="{ height: '745px', marginTop: isShowDetails ? '125px' : '0'}"></Chart>
     <AboutUs></AboutUs>
   </div>
 </div>
</template>

<script>
import Table from "./Table";
import Chart from "./Chart"
import Description from "./Description";
import Details from "./Details";
import AboutUs from "./AboutUs";
import { mapGetters } from 'vuex'
import { isJson } from '@/utils'

export default {
 name: 'IndicatorTable',
 data () {
   return {
     tableInfoList: [
       {
         label: 'Most Popular',
         type: 'popular',
         refName: 'popularVirtualScroll',
         itemSize: 40,
         keyProp: 'url',
         options: [
           {
             label: 'Most Popular Charts',
             value: 'popular',
             type: 'popular',
             url: 'most_popular'
           }
         ]
       }
     ],
     displayRow: {},
     isShowDetails: false
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
   Description,
   Details,
   AboutUs
 },
 methods: {
   updateChart(row) {
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
        _results.splice(findIndex, 1, {...find, favorite: !find.favorite, loading: false})
        this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url, data: _results})
        this.$refs[refName][0].loadMore(value)
      }
    },
    showDetails(row, isShowDetails) {
      this.isShowDetails = isShowDetails 
    },
    enLargeTable(row) {
      debugger
      this.$refs['popularVirtualScroll'][0].$refs['virtualScroll'].updateChart(row)
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