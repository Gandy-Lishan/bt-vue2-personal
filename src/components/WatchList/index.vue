<template>
  <div class="CPMResults-container">
    <div class="portfolio-header">
      <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <p class="page-title">My Watch List (click to expand)</p>
        </template>
        <div class="portfolio-des">
          <p>
          Create, customize, and monitor your personal stock watchlists.
          </p>
          <p>This page allows you to build and name your own watchlists by selecting specific stock tickers. You can customize the information displayed by choosing from various indicators such as Trend Score, RelTrend Score, Optix, and Rate of Change.</p>
          <p>Before saving, you can preview your watchlist as a list or a heatmap. Once satisfied, save the list to track your selected securities and their chosen data points efficiently. This tool provides a tailored way to manage and monitor your investments.</p>
        </div>
      </el-collapse-item>
    </el-collapse>
    </div>
    <el-collapse v-model="activeNames" :accordion="false" class="CPMResults-content">
      <el-collapse-item name="1" class="form">
        <template v-slot:title>
          <div class="title">
            <p>Watch List</p>
          </div>
        </template>
        <div class="content">
            <Table ref="Table" @displayResultsData="displayResultsData" @deleteRowURL="deleteRowURL"></Table>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" class="form">
        <template v-slot:title>
          <div class="title" ref="formTarget">
            <p>Create Watch List</p>
            <p>
              <el-tooltip class="item" effect="dark" content="Create New Watch List" placement="bottom-start">
                <el-button  type="warning" plain class="delete-btn" @click.stop="resetForm" size="small" icon="el-icon-plus">Create New</el-button>
              </el-tooltip>
            </p>
          </div>
        </template>
        <Form
         ref="Form"
         :parent-context="this"
         @changeSecondTab="changeSecondTab"
         @displayResultsAndFilter="displayResultsAndFilter" 
         @refreshList="refreshList" 
         @scrollToTarget="scrollToTarget" 
         @clearResults="clearResults"
         @deleteManageColumns="deleteManageColumns"
         @retainFormTicker="retainFormTicker"
         >
        </Form>
      </el-collapse-item>
      <el-collapse-item name="3" class="form">
        <template v-slot:title>
          <div class="title" ref="scrollTarget">
            <p @click.stop="() => {changeSecondTab('list')}" :class="{ secondActive: activeSecondTab == 'list' || '' }">Preview List</p>
            <p @click.stop="() => {changeSecondTab('heatmap')}" :class="{ secondActive: activeSecondTab == 'heatmap' || '' }">HeatMap</p>
          </div>
          <div class="downLoadCsvBtn">
            <el-button
              @click.stop="() => {handleDownloadCsv()}"
              style="display: inline-block"
              type="primary"
              size="small"
              icon="el-icon-download"
              title="Export Data"
              ></el-button
            >
          </div>
        </template>
         <ColumnsTable v-show="activeSecondTab == 'list'" ref="ColumnsTable"
          :data="filterTableData" 
          :label="filterTableData.label" 
          :tableCol="filterTableData.tableCol" 
          :loading="loading"
          @deleteFormTicker="deleteFormTicker"
          @deleteHeatMapTicker="deleteHeatMapTicker"
        ></ColumnsTable>
        <HeatMap v-show="activeSecondTab == 'heatmap'" ref="HeatMap" :heatmap_data="heatmap"></HeatMap>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import HeatMap from "./HeatMap";
import Form from "./Form";
import Table from "./Table";
import ColumnsTable from "./ColumnsTable";
import { isJson } from '@/utils';
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Portfolio',
  data() {
    return {
      activeNames: ['1', '2', '3'],
      activeSecondTab: 'list',
      loading: false,
      filterTableData: {
        content: [],
        tableCol: []
      },
      heatmap: []
    }
  },
  components: {
    Form,
    Table,
    ColumnsTable,
    HeatMap
  },
  methods: {
    changeSecondTab(val) {
      this.activeSecondTab = val
      this.$nextTick(() => {
      this.activeSecondTab = val    
      })
    },
    scrollToTarget(refName, height=-80) {
      this.$nextTick(() => {
          const element = this.$refs[refName];
          const rect = element.getBoundingClientRect();
          const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
          const offset = rect.top + scrollPosition + height; // 往上滚动 200px
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });
        });
    },
    displayResultsAndFilter(data) {
      // 至展示 filter 和 result 不重新赋值 form
      this.activeSecondTab = 'list'
      this.displaySummary(data)
      this.scrollToTarget('scrollTarget')
    },
    displayResultsData(data) {
      debugger
      const {data:_data, formData} = data
      this.$refs['Form'].displayData(formData)
      this.activeSecondTab = 'list'
      if(!_data || !_data) {this.popUpMsgBox('Watch List is empty. Please adjust filters');this.scrollToTarget('formTarget', -200); this.clearResults(); return}
      this.displaySummary(data)
      this.scrollToTarget('scrollTarget')
    },
    displaySummary(data) {
      debugger
      console.log('lishan content', data)
      const {formData, data:content}  = data
      if(!formData) return
      const removeStartEndNumbers = (str) => {
        return str
          .replace(/^\d+/, '')    // 去掉开头数字
          .replace(/\d+$/, '')    // 去掉结尾数字
          .trim();                // 去除首尾空格
      }
      const tickersColumns = formData.columns.map(column => {
        debugger
        let { indicator, bar } = column
        /*
        Optix
        Optix MA5
        Close MA5
        ROC5
        */
        bar = `${bar && bar != 1 ? ` ${bar}-Day ` : ''}`
        let originalIndicator = indicator
        indicator = removeStartEndNumbers(indicator)
        let label = `${indicator}${bar}`
        let value = `${indicator}${bar}`
        if(indicator === 'Optix MA' || indicator === 'Close MA') {
          label = indicator.replace(/ /g, bar)
        }
        if(label.includes('ROC')) {label = `${bar} ${indicator}`; value = `${bar} ${indicator}`}
        return {...column, value, label, originalIndicator}
      })
      /* 
      [
        {
          value: 'Trend Score 20'
          label: 'Trend Score 20',
          indicator: 'Trend Score',
          bar: 20
        }
      ]
      */
     const parseField = (str) => {
        const match = str.match(/^([a-zA-Z_]+)(\d+)$/);
        if (match) {
          return {
            prefix: match[1],
            number: Number(match[2])
          };
        } else {
          return {
            prefix: str,
            number: null  // 或 false/undefined，根据你需要
          };
        }
      }

      const calculateROC = (arr, preNum) => {
        if (!Array.isArray(arr) || arr.length < preNum) {
          return ''; // 或者提示 "数据不足 preNum 项"
        }

        const last = parseFloat(arr[arr.length - 1]);
        const prev = parseFloat(arr[arr.length - preNum]);

        if (isNaN(last) || isNaN(prev) || prev === 0) {
          return ''; // 防止除以 0 或无效数据
        }

        const rate = (last - prev) / Math.abs(prev);
        return rate; // 返回小数形式，比如 0.25 表示增长 25%
      }
      const getLastBarAvg = (arr, preNum) => {
        if (!Array.isArray(arr) || arr.length < preNum) {
          return ''; // 或者抛出错误：数据不足 preNum 项
        }
        const lastBar = arr.slice(-preNum); // 获取最后 preNum 项
        const sum = lastBar.reduce((acc, val) => acc + parseFloat(val), 0);
        return parseFloat((sum / preNum).toFixed(2))
      }
      const getColor = (normalizedValue) => {
        if (normalizedValue <= 0) return '#41A317';       // 极端悲观（绿色）
        if (normalizedValue <= 20) return '#89C35C';      // 较强的悲观（浅绿色）
        if (normalizedValue <= 30) return '#99C68E';      // 中等的悲观（淡绿）
        if (normalizedValue <= 50) return '#FFF8DC';      // 中立
        if (normalizedValue <= 70) return '#E18B6B';      // 较强的乐观（橙色）
        if (normalizedValue <= 80) return '#F75D59';      // 极端乐观（红色）
        return '#FF0000';                                // 非常乐观（红色）
      };
      const getTrendColor = (normalizedValue) => {
      if (normalizedValue <= 0) return '#41A317';      // 极端悲观（绿色）
      if (normalizedValue <= 2) return '#89C35C';      // 较强的悲观（浅绿色）
      if (normalizedValue <= 3) return '#99C68E';      // 中等的悲观（淡绿）
      if (normalizedValue <= 5) return '#FFF8DC';      // 中立
      if (normalizedValue <= 7) return '#E18B6B';      // 较强的乐观（橙色）
      if (normalizedValue <= 8) return '#F75D59';      // 极端乐观（红色）
      return '#FF0000';                                // 非常乐观（红色）
    };
      const _content = []
      const heatMapName = ['Optix', 'RelTrend Score', 'Trend Score']
      let _heatMap = heatMapName.map(name => ({data: [], name}))
      for (const ticker in content) {
        if (Object.prototype.hasOwnProperty.call(content, ticker)) {
          const element = content[ticker];
          let {optix_url, records, ticker_name} = element
          records = isJson(records) ? JSON.parse(records) : records
          if(!records || (Array.isArray(records) && !records.length))continue
          const tickerObj = {}
          const Closes = records.map(ele => (ele.Close))
          const Optix = records.map(ele => (ele.Optix))
          const TrendScore = records.map(ele => (ele['Trend']))
          const RelTrendScore = records.map(ele => (ele['RelTrend']))
          const lastClose = Closes.at(-1)
          const _lastOptix = Optix.at(-1)
          const lastHV20 =  records.map(ele => (ele['Historical Volatility (20-Day)'])).at(-1)
          const lastHV60 =  records.map(ele => (ele['Historical Volatility (60-Day)'])).at(-1)
          const lastOptix = _lastOptix !== null ? parseFloat(_lastOptix.toFixed(2)) : ''
          const lastTrend = TrendScore.at(-1)
          const lastRelTrend = RelTrendScore.at(-1)
          const colorValue = getColor(_lastOptix)
          const updateHeatMapData = (name, value, useGetTrendColor = true) => {
            debugger
            const index = _heatMap.findIndex(ele => ele.name === name)
            if (index !== -1) {
              const processedValue = value !== null ? value : ''
              const color = useGetTrendColor ? getTrendColor(processedValue) : colorValue
              _heatMap[index].data.push([ticker, optix_url, processedValue, color])
            }
          }

          updateHeatMapData('Optix', lastOptix, false)
          updateHeatMapData('RelTrend Score', lastRelTrend)
          updateHeatMapData('Trend Score', lastTrend)
          if(lastHV20) {
            if(!_heatMap.find(ele => ele.name === 'Historical Volatility (20-Day)')) _heatMap.push({name: 'Historical Volatility (20-Day)', data: []});
            updateHeatMapData('Historical Volatility (20-Day)', lastHV20, false)
          }
          if(lastHV60) {
            if(!_heatMap.find(ele => ele.name === 'Historical Volatility (60-Day)'))_heatMap.push({name: 'Historical Volatility (60-Day)', data: []});
            updateHeatMapData('Historical Volatility (60-Day)', lastHV60, false)
          }
          tickerObj['Ticker'] = ticker
          tickerObj['Name'] = ticker_name
          tickerObj['Close'] = lastClose !== null ? parseFloat(lastClose.toFixed(2)) : ''
          const minClose =  Math.min(...Closes) || 0
          const maxClose =  Math.max(...Closes) || 0
          const normalized = (lastClose - minClose) / (maxClose - minClose || 1); // 防止除以 0
          tickersColumns.forEach(column => {
            let {label, indicator, bar, value} = column
            indicator = removeStartEndNumbers(indicator)
            console.log('indicator', indicator)
            console.log('label', label)
            console.log('value', value)
            console.log('bar', bar)
            if(indicator === 'Optix') {
              tickerObj[value] = lastOptix
            }
            else if(indicator === 'RelTrend Score') {
              tickerObj[value] = lastRelTrend !== null ? lastRelTrend : ''
            }
            else if(indicator === 'Trend Score') {
              tickerObj[value] = lastTrend !== null ? lastTrend : ''
            }
            else if(indicator.includes('ROC')) {
              if(!lastClose) {tickerObj[value] = '';}else{
                const ROCRate = calculateROC(Closes, Number(bar) + 1)
                const ROC = !isNaN(ROCRate) ? `${(ROCRate * 100).toFixed(2)}%` : ROCRate
                tickerObj[value] = ROC
              }
            } else if(indicator === 'Close MA') {
              if(!lastClose) {tickerObj[value] = '';}else{
                tickerObj[value] = getLastBarAvg(Closes, Number(bar))
              }
            } else if(indicator === 'HV' && bar === 20) {
              if(!lastHV20) {tickerObj[value] = '';}else{
                tickerObj[value] = lastHV20
              }
            } else if(indicator === 'HV' && bar === 60) {
              if(!lastHV60) {tickerObj[value] = '';}else{
                tickerObj[value] = lastHV60
              }
            }else if(indicator === 'Optix MA') {
              if(!lastOptix) {tickerObj[value] = '';}else{
                const _lastOptix = getLastBarAvg(Optix, Number(bar))
                const optixColor = getColor(_lastOptix)
                const findIndex = _heatMap.findIndex(ele => ele.name === label)
                if(findIndex === -1) {
                  _heatMap.push({name: label, data: [[ticker, optix_url, _lastOptix, optixColor]]})
                }else {
                  _heatMap[findIndex].data.push([ticker, optix_url, _lastOptix, optixColor])
                }
                tickerObj[value] = _lastOptix
              }
            }
          })
          _content.push(tickerObj)
        }
      }
      console.log('_heatMap', _heatMap)
      console.log('_content', _content)
      const buttonColumns = {
				label: 'Button',
				value: '',
				key: '',
				width: '50px'
			}
      let tableCol =  [{value: 'Ticker', label: 'Ticker'}, {value: 'Name', label: 'Name'}, {value: 'Close', label: 'Close'}, ...tickersColumns, buttonColumns]
      tableCol = tableCol.map(column => {
        const obj = {...column}
        const {label, indicator} = column
        console.log('label', label)
        console.log('indicator', indicator)
        if(indicator === 'RelTrend Score') {
          obj.labelHtml = 'RelTrend <br/>Score'
        }else if(indicator === 'Trend Score') {
          obj.labelHtml = 'Trend <br/>Score'
        }else if(label.includes('Close MA')) {
          obj.labelHtml = label.replace(/\s+/, '<br/>')
        } else if(label.includes('Optix MA')) {
          obj.labelHtml = label.replace(/\s+/, '<br/>')
        } else if(indicator === 'HV20') {
          obj.labelHtml = 'Historical Volatility (20-Day)'
        } else if(indicator === 'HV60') {
          obj.labelHtml = 'Historical Volatility (60-Day)'
        }else{
          obj.labelHtml = label
        }
        return obj
      })
      this.$nextTick(() => {
         this.filterTableData = {
          ...this.filterTableData,
          tableCol: [...tableCol],
          content: _content
        }
      })
      this.heatmap = _heatMap
    },
    clearResults() {
      this.activeSecondTab = 'list'
      this.filterTableData = {
        content: [],
        tableCol: []
      }
      this.heatmap = [[]]
    },
    resetForm() {
      this.$nextTick(() => {
        const NoResetAllowed = this.$refs['Form'].resetForm()
        if(NoResetAllowed) return     
        this.clearResults()
      })
    },
    async refreshList() {
      await this.$refs['Table'].getDataList()
    },
    deleteFormTicker(row) {
      debugger
      this.$refs['Form'].deleteFormTicker(row)
    },
    retainFormTicker(tickers) {
      debugger
      if(this.notEmptyArray(tickers)) {
        // 删除 table ticker
        const {content} = this.filterTableData
        if(this.notEmptyArray(content)) {
          const _content = content.filter(ele => tickers.includes(ele.Ticker))
          this.filterTableData = {
            ...this.filterTableData,
            content: _content
          }
        }
        // 删除 heatmap
        if(this.notEmptyArray(this.heatmap) && this.notEmptyArray(this.heatmap[0])) {
          const _heatmap = this.heatmap[0].filter(ele => (tickers.includes(ele[0])))
          this.heatmap = [_heatmap]
        }
      }
    },
    notEmptyArray(arr) {
      return Array.isArray(arr) && arr.length !== 0
    },
    deleteHeatMapTicker(row) {
      debugger
      console.log(this.heatmap)
      if(this.notEmptyArray(this.heatmap) && this.notEmptyArray(this.heatmap[0])) {
        const findIndex = this.heatmap[0].findIndex(ele => (ele[0] === row.Ticker))
        if(findIndex !== -1) {
          this.heatmap[0].splice(findIndex, 1)
        }
      }
    },
    deleteManageColumns(row) {
      debugger
      const {tableCol, content} = this.filterTableData
      if(this.notEmptyArray(tableCol)) {
        const findIndex = tableCol.findIndex(ele => (ele.bar == row.bar && ele.indicator === row.indicator))
        if(findIndex !== -1) this.filterTableData.tableCol.splice(findIndex, 1)
      }
    },
    handleDownloadCsv() {
      this.$refs.ColumnsTable.downloadCSV()
    },
    deleteRowURL(url) {
      debugger
      this.$refs['Form'].deleteRowURL(url)
    }
  }
}
</script>

<style lang="less" scoped>
.CPMResults-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  // margin: 50px auto auto auto;
  // width: 80%;
  width: 100%;
  // padding: 20px;
  overflow-y: hidden;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  font-weight: 300;
  color: #666;
  position: relative;
  flex-wrap: wrap;
  height: auto;
}

.portfolio-header {
  /deep/ .el-collapse-item__header {
    height: 48px;
  }
}
.title {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  font-weight: 300;
  color: #000000;
  flex-wrap: wrap;
}
.title p {
  padding: 0 20px;
  margin: 0;
}
.title p:hover {
  color: #428bca;
}
.secondActive {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}
.active {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}
.chart {
  background-color: inherit;
  margin-bottom: 20px;
}
/deep/ .el-collapse {
  border-top: unset;
  border-bottom: unset;
}
.page-title {
  margin: 0;
  padding: 0 5px 0 20px;
  color: #000000;
}
.portfolio-des {
  padding: 0 20px;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
}
.CPMResults-container {
  margin: 0 auto;
  padding-top: 50px;
  padding-right: 15px;
  padding-left: 15px;
  background-color: #fff;
  color: #000000;
  user-select: text;
  /deep/ .el-collapse {
    overflow: hidden;
  }
}
@media (min-width: 768px) {
  .CPMResults-container {
      width: 750px;
  }
}
@media (min-width: 992px) {
  .CPMResults-container {
      width: 970px;
  }
}
@media (min-width: 1200px) {
  .CPMResults-container {
      width: 1170px;
  }
}
.downLoadCsvBtn {
	position: absolute;
	right: 90px;
  margin-left: 10px;
	color: #333333;
}
@media (max-width: 1200px) {
  .CPMResults-container {
    padding-right: 0px;
    padding-left: 0px;
  }
}
</style>