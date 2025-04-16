<template>
 <div class="indicators-container" ref="indiRef">
   <br/>
   <br/>
   <div class="footer-des">
     <Description v-if="!isShowDetails" :enlargedTable="enlargedTable" :checkedType="checkedType"></Description>
   </div>
   <div class="indicator-left">
     <template v-for="item in tableInfoList">
       <Table
         v-bind="$attrs"
         v-on="$listeners"
        :key="item.type"
        :tableInfo="item"
        :ref="item.refName"
        :sectorIndex="sectorIndex"
        :sectorTitle="sectorTitle"
        @updateChart="updateChart" 
        @showDetails="showDetails"
        @forceUpdateTable="(type, condition) => {_forceUpdateTable(type, condition)}"
        :style="{ 
             'width': ((checkedType === 'TrendSector')) ? '100%' : '50%', 
             'display': 'block'
         }"
        ></Table>
     </template>
     <!-- 点击之后详情页放在这里 -->
     <!-- <Details v-show="enlargedTable && isShowDetails"  :row="(enlargedTable && isShowDetails) ? displayRow : {}" :style="{ width: '50%' }" @showDetails="showDetails" @downloadCSV="downloadCSV"></Details> -->
     <Chart :id="'indiChart'" v-if="enlargedTable !== null && displayRow && displayRow.type && !displayRow?.type.includes('seasonality') && checkedType !== 'TrendSector'" :row="displayRow" :style="{ height: isShowDetails ? '830px': '755px', width: '50%' }" @passIndicatorData="passIndicatorData" @downloadCSV="downloadCSV"></Chart>
     <!-- <SeasonalityChart :id="'indiChart'" :isShowDetails="isShowDetails" v-if="enlargedTable !== null && displayRow && displayRow.type && displayRow?.type.includes('seasonality')" :row="displayRow" class="indicators-chart" :style="{ height: isShowDetails ? '830px': '755px', width: '50%' }"></SeasonalityChart> -->
     <AboutUs></AboutUs>
   </div>
 </div>
</template>

<script>
import Table from "../Table/Table";
import Chart from "../Table/Chart"
import SeasonalityChart from "../Table/SeasonalityChart"
import Description from "../Table/Description";
import Details from "../Table/Details";
import AboutUs from "../Table/AboutUs";
import { mapGetters } from 'vuex'
import { isJson } from '@/utils'
import moment from "moment";
import { getIndicatorsDownloadData, getSectorTrendRelTrend } from "@/service/service";

export default {
 name: 'RelatedStockSectors',
 provide() {
   return {
     toggleEnlarge: this.toggleEnlarge,
     checkedOption: this.checkedOption,
   };
 },
 data () {
   return {
     tableInfoList: [
       {
         label: 'Selected Sector/Index',
         type: 'SectorTrendRelTrend',
         refName: 'SectorTrendRelTrendVirtualScroll',
         itemSize: 25,
         keyProp: 'url',
         options: [
           {
             label: 'Sector Trend RelTrend',
             value: 'SectorTrendRelTrend',
             type: 'SectorTrendRelTrend',
             url: 'sector_trend_reltrend'
           }
         ]
       }
     ],
     displayRow: {},
     enlargedTable: 'SectorTrendRelTrend',
     checkedType: 'SectorTrendRelTrend',
     isShowDetails: false,
     indicatorCSVData: [],
     indicatorsCSVName: '',
     checkedTitle: '',
     sectorTitle: '',
     sectorIndex: ''
   }
 },
 components: {
   Chart,
   Table,
  //  SeasonalityChart,
   Description,
  //  Details,
   AboutUs
 },
 computed: {
   ...mapGetters({
     indicatorsListData: 'getIndicatorsPageListData'
   })
 },
 beforeRouteEnter(to, from, next) {
  const index = to.query.index
  if (to.path.includes('/sector_trend_score') && index) {
    next(async _this => {
     // 发送请求
     const {data: {Title, data}} = await getSectorTrendRelTrend('sector_trend_reltrend', index)
     const _data = isJson(data) ? JSON.parse(data) : data
     _this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url: 'sector_trend_reltrend', data: _data})
     console.log('Title',Title)
     console.log('data', _data)
     _this.sectorIndex = index
     _this.$nextTick(() => {
       _this.sectorTitle = Title
       // _this.tableInfoList[0].label = Title
       _this.tableInfoList[0].options[0].label = Title
       _this.enLargeTable = Title
       _this.checkedType = 'SectorTrendRelTrend'
     })
    });
    } else {
      next();
    }
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
   checkedOption(checkedType) {
     this.checkedType = checkedType
   },
   updateChart(row) {
     console.log('updateChart', row)
     this.displayRow = row
     // this.displayRow = {...row}
   },
   showDetails(row, isShowDetails, checkedType) {
     console.log('showDetails', row)
     this.updateChart(Object.keys(row).length !== 0 ? {...row} : this.displayRow)
     this.isShowDetails = isShowDetails
     this.checkedTitle = checkedType
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
   async enLargeTable(source_list, row) {
     const findTable = this.tableInfoList.find(ele => ele.options.find(option => option.url === source_list))
     console.log('findTable', findTable)
     if(!findTable) return
     const checked = findTable.options.find(ele => ele.url === source_list).value
     const findRefsName = findTable?.refName
     // 应该清空缩小已放大的 table
     const clearRefName = this.tableInfoList.map(item => item.refName).filter(item => item !== findRefsName)
     console.log('clearRefName', clearRefName)
     clearRefName.forEach(item => {
       this.$refs[item][0].clearEnlarge()
     })
     await this.$refs[findRefsName][0].enLargeTable(checked, row)
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
   _forceUpdateTable(type, condition) {
     console.log('type, condition', type, condition)
     console.log('updateRefs', this.$refs)
     // this.$nextTick(() => {
       this.$refs['SP1500ScoreVirtualScroll'][0].loadMore(type, null, condition)
       this.$forceUpdate()
     // })
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
 .indicators-chart {
   width: 50%;
 }
}
.showDetailsChart {
 margin-top: 50px;
}
/deep/ .virtualScroll .el-table--scrollable-x .el-table__body-wrapper {
 overflow-x: scroll !important;
}
// /deep/ .el-table__footer-wrapper, /deep/ .el-table__header-wrapper {
//   width: 100% !important; /* 确保宽度占满父容器 */
// }
.indicators-container {
  color: #333;
  padding: 0 20px;
}
</style>