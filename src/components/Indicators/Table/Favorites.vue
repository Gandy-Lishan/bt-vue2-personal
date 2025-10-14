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
          class="indicator-table"
          :style="{ display: !isShowDetails ? 'block' : 'none' }"
        ></FavTable>
      </template>
      <Details class="details-container" v-show="isShowDetails" :row="(isShowDetails) ? displayRow : {}" :checkedTitle="'Favorite\'s Indicator List'" @showDetails="showDetails" @downloadCSV="downloadCSV"></Details>
      <SeasonalityChart :id="'FavChart'" :isShowDetails="isShowDetails" :row="displayRow"  v-if="displayRow && displayRow.type && displayRow.type.includes('seasonality')" class="indicators-chart" :style="{ height: isShowDetails ? '830px' : '725px'}"></SeasonalityChart>
      <Chart :row="displayRow"  v-else :id="'FavChart'" class="indicators-chart" :style="{height: isShowDetails ? '830px' : '725px'}" @passIndicatorData="passIndicatorData"></Chart>
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
import { getIndicatorsDownloadData } from "@/service/service";
 
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
      isShowDetails: false,
      indicatorCSVData: [],
      indicatorsCSVName: '',
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
 .indicator-left {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  flex-grow: 1;
  // .indicators-chart {
  //   width: 50%;
  // }
 }
 .indicator-table, #FavChart, .details-container {
  width: 50%;
 }
 @media (max-width: 1200px) {
  .indicator-table, #FavChart, .details-container {
    width: 100%;
  }
 }
 </style>