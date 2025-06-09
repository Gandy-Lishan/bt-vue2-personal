<template>
 <div class="indicators-container" ref="indiRef">
   <div class="footer-des">
     <Description :enlargedTable="enlargedTable" :checkedType="checkedType"></Description>
   </div>
   <div class="indicator-left">
     <template v-for="item in tableInfoList">
       <Table
         v-bind="$attrs"
         v-on="$listeners"
        :key="item.type"
        :tableInfo="item"
        :ref="item.refName"
        @updateChart="updateChart" 
        @showDetails="showDetails"
        @forceUpdateTable="(type, condition) => {_forceUpdateTable(type, condition)}"
        :style="{ 
             'width': (isFullScreen) ? '100%' : '50%', 
             'display': ((enlargedTable === item.label || enlargedTable === null) && !isShowDetails) ? 'block' : 'none' 
         }"
        ></Table>
     </template>
     <!-- 点击之后详情页放在这里 -->
     <Details v-show="enlargedTable && isShowDetails && !isFullScreen"  :row="(enlargedTable && isShowDetails) ? displayRow : {}" :style="{ width: '50%' }" @showDetails="showDetails" @downloadCSV="downloadCSV"></Details>
     <Chart :id="'indiChart'" v-if="!isFullScreen && enlargedTable !== null && displayRow && displayRow.type && !displayRow?.type.includes('seasonality') && checkedType !== 'TrendSector'" :row="displayRow" :style="{ height: isShowDetails ? '830px': '755px', width: '50%' }" @passIndicatorData="passIndicatorData" @downloadCSV="downloadCSV"></Chart>
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
import { mapGetters, mapActions } from 'vuex'
import { isJson } from '@/utils'
import moment from "moment";
import { getIndicatorsDownloadData, getIndicatorsRowData } from "@/service/service";

export default {
 name: 'TrendScore',
 provide() {
   return {
     toggleEnlarge: this.toggleEnlarge,
     checkedOption: this.checkedOption,
     enterOrExitFullScreenTrendScorePage: this.enterOrExitFullScreenTrendScorePage
   };
 },
 data () {
   return {
     tableInfoList: [
       {
         label: 'Absolute and Relative Trend Scores',
         type: 'SP500Score',
         refName: 'SP1500ScoreVirtualScroll',
         itemSize: 25,
         keyProp: 'url',
         options: [
           {
             label: 'S&P 500',
             value: 'SP500Score',
             type: 'SP1500Score',
             url: 'spx'
           },
           {
             label: 'S&P 1500',
             value: 'SP1500Score',
             type: 'SP1500Score',
             url: 'sp1500'
           },
           {
             label: 'NDX',
             value: 'NDX100Score',
             type: 'SP1500Score',
             url: 'ndx'
           },
           {
             label: 'Russell 3000',
             value: 'RussellScore',
             type: 'SP1500Score',
             url: 'russell'
           },
           {
             label: 'Domestic ETF',
             value: 'DomesticETFScore',
             type: 'SP1500Score',
             url: 'etf_domestic'
           },
           {
             label: 'Foreign ETF',
             value: 'ForeignETFScore',
             type: 'SP1500Score',
             url: 'etf_foreign'
           },
           {
             label: 'Other Assets',
             value: 'OtherAssetsETFScore',
             type: 'SP1500Score',
             url: 'etf_other'
           },
           {
             label: 'Crypto',
             value: 'CRPScore',
             type: 'SP1500Score',
             url: 'crp'
           },
           {
             label: 'Sector Summary',
             value: 'TrendSector',
             type: 'SP1500Score',
             url: 'sector_trend_score'
           },
           {
             label: 'My Favorites',
             value: 'WatchList',
             type: 'WatchList',
             url: 'watchlist'
           }
         ]
       }
     ],
     displayRow: {},
     enlargedTable: 'Absolute and Relative Trend Scores',
     checkedType: 'SP500Score',
     isShowDetails: false,
     indicatorCSVData: [],
     indicatorsCSVName: '',
     checkedTitle: '',
     enlargedTrendScoreTable: null,
   }
 },
 components: {
   Chart,
   Table,
  //  SeasonalityChart,
   Description,
   Details,
   AboutUs
 },
 computed: {
   ...mapGetters({
     indicatorsListData: 'getIndicatorsPageListData'
   }),
   isFullScreen() {
    const optionValues = (this.tableInfoList[0]?.options || []).map(ele => ele.value).filter(value => value !== 'TrendSector')
    return (
      this.checkedType === 'TrendSector'
      || (this.enlargedTrendScoreTable === 'Absolute and Relative Trend Scores' && optionValues.includes(this.checkedType))
    )
   }
 },
 async mounted() {
  const indicator = this.$route.query.indicator
  if(indicator) {
    await this.$nextTick(async () => {
      console.log('lishan trigger')
      await this.enlargeSelectIndicator(indicator)
    })
  }
 },
 methods: {
  ...mapActions('chart', ['fetchIndicatorsPageList']),
   toggleEnlarge(label) {
     console.log('toggleEnlarge', label)
     if (this.enlargedTable === label) {
       this.enlargedTable = null; // Restore all tables if already enlarged
     } else {
       this.enlargedTable = label; // Enlarge the clicked table
     }
   },
   enterOrExitFullScreenTrendScorePage(label) {
    console.log('enterOrExitFullScreenTrendScorePage', label)
      if (this.enlargedTrendScoreTable === label) {
        this.enlargedTrendScoreTable = null; // Restore all tables if already enlarged
      } else {
        this.enlargedTrendScoreTable = label; // Enlarge the clicked table
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
    debugger
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
    // 在放大之前要先看有没有数据
    if(checked) await this.$refs[findRefsName][0].loadMore(checked)
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
   },
   async enlargeSelectIndicator(searchUrl) {
    debugger
      // vol_vix_transform 不存在
      if(searchUrl === 'vol_vix_transform') {
        this.$message({
          message: `<strong>Unable to find the corresponding indicator</strong>`,
          center: true,
          dangerouslyUseHTMLString: true,
          showClose: true,
          duration: 8000,
          customClass: 'no-icon',
          type: 'warning'
        })
        return
      }
      // const urlTypes = Array.from(Object.keys(this.indicatorsListData)).filter(key => key !== 'most_popular')
      const urlTypes = Array.from(Object.keys(this.indicatorsListData))
      let sourceTable = urlTypes.map(type => {
        const list = isJson(this.indicatorsListData[type]) ? JSON.parse(this.indicatorsListData[type]) : []
          return list.map(item => {
            if(item.url.toLowerCase() === searchUrl.toLowerCase()) return item
          }).filter(item => item !== undefined)
      }).filter(item => item.length > 0).flat()
      console.log('sourceTable', sourceTable)
      // 存在第一次并未请求全部表单的情况
      if(sourceTable.length > 0) {
        const source_list = sourceTable[0].source_list // 只取第一个匹配到的 Table
        await this.enLargeTable(source_list, sourceTable[0])
      }else {
        let res = {}
        try {
          const {data:rowData} = await getIndicatorsRowData(searchUrl)
          res = rowData
        } catch (error) {
          if(error?.response?.status === 404) {
            this.$message({
              message: `<strong>Unable to find the corresponding indicator</strong>`,
              center: true,
              dangerouslyUseHTMLString: true,
              showClose: true,
              duration: 8000,
              customClass: 'no-icon',
              type: 'warning'
            })
            return
          }
        }
        const {type, groups, sub_type} = res
        let requireUrl = ''
        if(type === 'stock_nasdaq') {
          requireUrl = 'ndx_100_complete_list'
        }else if(type === 'stock_sent') {
          requireUrl = 'sp_1500_complete_list'
        }else if(type === 'stock_russell') {
          requireUrl = 'russell_3000_complete_list'
        }else if(sub_type === 'crp_stock') {
          requireUrl = 'crypt_complete_list'
        }else if(sub_type === 'all_country_breadth'){
          requireUrl = 'country_breadth'
        }else if(sub_type === 'crp_breadth') {
          requireUrl = 'crypto_breadth'
        }else if(groups === 'trend_reltrend') {
          // spx_trend spx_reltrend 没有处理
          const str = sub_type
          const match = str.match(/(.*?)_trend_reltrend/)
          const result = match ? match[1] : 'sp1500'
          requireUrl = result
        }else if(typeof groups === 'string' && groups.endsWith('_trend')) {
          // spx_trend 没有处理
          const str = sub_type
          const match = str.match(/(.*?)_trend/)
          const result = match ? match[1] : 'sp1500'
          requireUrl = result
        }else if(typeof groups === 'string' && groups.endsWith('_reltrend') && !groups.includes('_trend')) {
          // spx_reltrend 没有处理
          const str = sub_type
          const match = str.match(/(.*?)_reltrend/)
          const result = match ? match[1] : 'sp1500'
          requireUrl = result
        }else if(type === 'etf_opt') {
          requireUrl = 'etf_breadth'
        }else if(type === 'etf_fund') {
          requireUrl = 'etf_flow'
        }else if(type === 'mff') {
          requireUrl = 'monthly_fund_flows'
        }else if(type === 'shares') {
          requireUrl = 'shares_outstanding'
        }else if(type === 'etf_seasonality') {
          requireUrl = 'etf_seasonality'
        }else if(type === 'bond_seasonality') {
          requireUrl = 'bond_seasonality'
        }else if(groups === 'commod') {
          requireUrl = 'commodity_complete_list'
        }else if(groups === 'bonds'){
          requireUrl = 'bonds_complete_list'
        }else if(type === 'etf_opt') {
          reportUrl = 'etf_complete_list'
        }else if(type === 'commod_seasonality') {
          url = 'commod_seasonality'
        }else if(groups === 'stocks') {
          requireUrl = 'stock_complete_list'
        }else if(groups === 'macroeconomic') {
          requireUrl = 'macro_indicator_list'
        }
        if(!requireUrl) return
        await this.fetchIndicatorsPageList(requireUrl)
        const _list = isJson(this.indicatorsListData[requireUrl]) ? JSON.parse(this.indicatorsListData[requireUrl]) : []
        const _sourceList = _list.map(item => {
            if(item.url.toLowerCase() === searchUrl.toLowerCase()) return item
        }).filter(item => item !== undefined).shift()
        console.log('_sourceList', _sourceList)
        // 如果是对象并且对象为空, 说明没有匹配到数据
        if(!_sourceList || (((_sourceList !== null && typeof _sourceList === 'object' && !Array.isArray(_sourceList)) && Object.keys(_sourceList).length === 0))) {
          this.$message({
            message: `<strong>Unable to find the corresponding indicator</strong>`,
            center: true,
            dangerouslyUseHTMLString: true,
            showClose: true,
            duration: 8000,
            customClass: 'no-icon',
            type: 'warning'
          })
          return
        }
        // this.updateChart(_sourceList)
        await this.enLargeTable(_sourceList.source_list, _sourceList)
        /* 如果匹配不到, 使用下面的规则请求个别表单
        ndx_100_complete_list: type: stock_nasdaq
        sp_1500_complete_list: type: stock_sent
        russell_3000_complete_list: type: stock_russell
        commodity_complete_list: groups: commod
        etf_breadth: type: etf_opt
        country_breadth: sub_type: all_country_breadth
        crypto_breadth: sub_type: crp_breadth
        etf_flow: type: etf_fund
        monthly_fund_flows： type: mff
        shares_outstanding: type: shares
        etf_seasonality: type: etf_seasonality
        bond_seasonality: type: bond_seasonality
        */
        // window.location.assign(url);
      }
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