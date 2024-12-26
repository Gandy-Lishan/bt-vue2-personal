<template>
 <div class="indicators-container">
   <div class="footer-des">
      <Description v-if="!isShowDetails" :enlargedTable="'Stock'" :checkedType="'stock'"></Description>
    </div>
   <div class="indicator-left" ref="IndicatorTable">
     <template v-for="item in tableInfoList">
       <Table
        v-bind="$attrs"
        :key="item.type"
        :tableInfo="item"
        :ref="item.refName"
        :isShowDetails="isShowDetails"
        @updateChart="updateChart"
        @showDetails="showDetails"
        :style="{ width: '50%', display: !isShowDetails ? 'block' : 'none' }"
        ></Table>
     </template>
     <Details v-show="isShowDetails" :row="(isShowDetails) ? displayRow : {}" :checkedTitle="'Most Popular Charts'" :style="{width: '50%'}" @showDetails="showDetails" @downloadCSV="downloadCSV"></Details>
     <Chart :id="'popuChart'" :row="displayRow" class="indicators-chart" :style="{ height: isShowDetails ? '830px' : '725px', width: '50%'}" @passIndicatorData="passIndicatorData"></Chart>
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
import { getIndicatorsDownloadData } from "@/service/service";

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
     isShowDetails: false,
     indicatorCSVData: [],
     indicatorsCSVName: '',
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
    // this.displayRow = {...row}
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
      this.updateChart(Object.keys(row).length !== 0 ? {...row} : this.displayRow)
      this.isShowDetails = isShowDetails 
    },
    enLargeTable(row) {
      debugger
      this.$refs['popularVirtualScroll'][0].$refs['virtualScroll'].updateChart(row)
    },
    passIndicatorData(data, url) {
      this.indicatorCSVData = data
      this.indicatorsCSVName = url
    },
    filterRecentThreeMonths(data, currentDate) {
      // 使用 moment.js 计算三个月前的日期，确保是那一天的开始
      const threeMonthsAgo = moment(currentDate).subtract(3, 'months').startOf('day');
      return data.filter(item => {
        // 将字符串日期转换为 moment 对象，并比较
        return moment(item.date, 'YYYY-MM-DD').isAfter(threeMonthsAgo) || moment(item.date, 'YYYY-MM-DD').isSame(threeMonthsAgo, 'day');
      });
    },
    async downloadCSV() {
      const {type} = this.displayRow
      if(type && type.includes('_seasonality')) {
        this.popUpMsgBox('No data available for download')
        return
      }
      const xlsxName = this.indicatorsCSVName
      let data = this.indicatorCSVData
      try {
        const {data:_data} = await getIndicatorsDownloadData(xlsxName)
        data = _data
      } catch (error) {
        console.log('用户无 indicator api 权限', error)
        // 当前日期，确保是 UTC 时间
        const currentDate = new Date(); // 将当前日期转换为 'YYYY-MM-DD' 格式的字符串
        // 调用函数并传入数据和当前日期
        data = this.filterRecentThreeMonths(data, currentDate);
      }
      if (!data || !data.length) {
        this.popUpMsgBox('No data available for download')
        return
      }
      const _keySort = Array.from( Object.keys(data[0]))
      let csvContent = data.map(row => _keySort.map(key => `"${row[key]}"`).join(',')).join('\n');
      csvContent = `${_keySort.join(',')}\n${csvContent}`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${xlsxName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
.indicator-left {
 // display: grid;
 // grid-template-columns: repeat(2, 1fr);
 // grid-template-rows: repeat(3, 1fr);
 display: flex;
 flex-wrap: wrap;
 align-items: stretch;
 flex-grow: 1;
//  .indicators-chart {
//    width: 50%;
//  }
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