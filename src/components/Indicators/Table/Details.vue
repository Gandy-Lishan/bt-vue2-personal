<template>
  <div class="details">
    <div class="chart-name">
      <h1>{{title}}<el-button style="margin-left: 5px;" v-if="row && row.type && !row.type.includes('seasonality') && row.url && !['smart_dumb', 'risk_levels'].includes(row.url)" type="text" @click="seeOnLargeChart"><em>(See this indicator on the large chart)</em></el-button></h1>
      <el-button type="text" icon="el-icon-back" @click="$emit('showDetails', {}, false)">Return</el-button>
    </div>
    <ul class="indicator-info">
      <li :key="index" v-for="(item, index) in indicatorInfo">{{item}}</li>
    </ul>
    <div class="centent">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Detail'" :class="{ 'selected': selectedTitle === 'Detail' }">Indicator Detail</h4>
            <h4  @click="selectedTitle = 'Research'" :class="{ 'selected': selectedTitle === 'Research' }">Research & Blog Posts</h4>
            <h4  @click="selectedTitle = 'Related'" :class="{ 'selected': selectedTitle === 'Related' }" v-show="isShowRelated">Related Charts</h4>
            <div class="btns">
              <el-button type="primary" size="mini" @click="$emit('downloadCSV')">Download CSV File</el-button>
            </div>
          </div>
          <div>
            <Construction v-show="selectedTitle === 'Detail'" ref="Construction" :convertedHTML="convertedHTML" :title="title">
             <div v-show="showReturns">
									<h4><b>Threshold Return Analysis:</b></h4>
									<p>
										In order to provide more detailed information about our indicators, threshold return analysis has been performed for each.
										The below data describes the annualized returns for the underlying while the indicator value is above / below the extreme values 
										as well as the returns of the underlying while the indicator is between the extreme values. Note that the returns provided are 
										describing the periods that the indicator is only in the threshold region (e.g., above, between, below).
									</p>
									<div class='col-md-6'>
										<table class="threshold-table">
											<thead>
												<tr>
													<th>Location of Indicator</th>
													<th>Annualized Return</th>
													<th>% of Time</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Above Extreme</td>
													<td>{{ Above_Annualized }}%</td>
													<td>{{ percent_time_above }}%</td>
												</tr>
												<!-- The between and below are reversed for some reason. Reversed them here. -->
												<tr>
													<td>Between Extremes</td>
													<td>{{ Below_Annualized }}%</td>
													<td>{{ percent_time_below }}%</td>
												</tr>
												<tr>
													<td>Below Extreme</td>
													<td>{{ Between_Annualized }}%</td>
													<td>{{ percent_time_between }}%</td>
												</tr>
											</tbody>
										</table>
										<br>
									</div>
								</div>
            </Construction>
            <Research v-show="selectedTitle === 'Research'" ref="Research" :blog_results="blog_results"></Research>
            <Related v-show="selectedTitle === 'Related' && isShowRelated" ref="Related" :related="related"></Related>
          </div>
        </div>
  </div>
</template>

<script>
import Research from "./Research";
import Construction from "./Construction";
import Related from "./Related";
import { getIndicatorsRowData } from '@/service/service'

export default {
  props: {
    row: Object,
    checkedTitle: String
  },
  name: 'Details',
  data() {
    return {
      activeName: ['1'],
      activeTab: 'first',
      selectedTitle: 'Detail',
      convertedHTML: '',
      title: '',
      blog_results: [],
      related: [],
      indicatorInfo: [],
      showReturns: false,
      percent_time_above: '',
      percent_time_below: '',
      percent_time_between: '',
      Above_Annualized: '',
      Below_Annualized: '',
      Between_Annualized: ''
    }
  },
  watch: {
    row: {
      async handler(newValue) {
        if(!newValue.url) return
        try {
          if(this.selectedTitle !== 'Detail') this.selectedTitle = 'Detail'
          const convertToHTML = (text) => {
            // 替换换行符、制表符、大于号、和与号
            text = text.replace(/\\r/g, '<br>')
            text = text.replace(/\\n/g, '<br>')
            text = text.replace(/\\t/g, '&emsp;')
            text = text.replace(/&gt;/g, '>')
            text = text.replace(/&amp;/g, '&')
            text = text.replace(/&rsquo;/g, '\'')
            // 正则表达式匹配 <a href="{{url_for('user.anything_here')}}">...</a>
            const regex = /<a href="{{url_for\('user\.([^']+)'\)}}">([^<]+)<\/a>/g;

            // 替换匹配到的内容为相应的 URL，并添加 target="_blank"
            text = text.replace(regex, (match, p1, p2) => {
            return `<a href="https://users.sentimentrader.com/users/charts/${p1}" target="_blank">${p2}</a>`;
            });
            return text
          }
          const res = await getIndicatorsRowData(newValue.url)
          let originalData = res?.data
          if(typeof originalData === 'string') {
            originalData = originalData.replace(/NaN/g, 'null')
            originalData = JSON.parse(originalData)
          }
          console.log('originalData', originalData)
          this.blog_results = originalData.blog_results
          this.related = originalData.related
          this.title = originalData.chart_name
				  this.convertedHTML = convertToHTML(originalData.description)
          const indicatorInfo = []
          const unifyNumber = (num) => {
            if (num === '') {
              return 0
            } else {
              let handleNum = parseFloat(num)
              let isToFixed = handleNum.toString().includes('.') && handleNum.toString().split('.')[1].length > 1
              if (isToFixed) {
                return isNaN(handleNum.toFixed(1)) ? NaN : handleNum.toFixed(1)
              } else {
                return isNaN(handleNum) ? NaN : handleNum
              }
            }
          }
          for (const key in originalData) {
            if (Object.prototype.hasOwnProperty.call(originalData, key)) {
              const element = originalData[key];
              if(key === 'timeframe') indicatorInfo.push(`Time Frame: ${element}`)
              if(key === 'updated') {
                const str = (element || 'Daily')
                const firstWord = str.split(' ')[0]
                indicatorInfo.push(`Update Schedule: ${firstWord}`)
              }
              if(key === 'source') indicatorInfo.push(`Source: ${element || 'Sentimentrader'}`)
              if(key === 'show_returns' && element) {
                this.showReturns = true
                this.percent_time_above = unifyNumber(originalData.percent_time_above)
                this.percent_time_below = unifyNumber(originalData.percent_time_below)
                this.percent_time_between = unifyNumber(originalData.percent_time_between)
                this.Above_Annualized = unifyNumber(originalData.Above_Annualized)
                this.Below_Annualized = unifyNumber(originalData.Below_Annualized)
                this.Between_Annualized = unifyNumber(originalData.Between_Annualized)
              }else if(key === 'show_returns' && !element) {
                this.showReturns = false
                this.percent_time_above = ''
                this.percent_time_below = ''
                this.percent_time_between = ''
                this.Above_Annualized = ''
                this.Below_Annualized = ''
                this.Between_Annualized = ''
              }
            }
          }
          this.indicatorInfo = indicatorInfo
        } catch (error) {
          console.log('error', error)
          return
        }
      },
      deep: true
    },
  },
  computed: {
    backToListTitle() {
      const map = new Map([
        ['stock', 'Stock Market Sentiment'],
        ['NASDAQ', 'NASDAQ 100 Stock Sentiment'],
        ['SP1500', 'S&P 1500 Stock Sentiment'],
        ['bond', 'Bond Market Sentiment'],
        ['commodity', 'Commodity Market Sentiment'],
        ['ETFSector', 'Most Active ETF Sentiment'],
        ['ETFSectorBreadth', 'ETF Sector Breadth'],
        ['ETFFundFlow', 'Most Active ETF Fund Flow'],
        ['ETFMonthlyFund', 'Monthly Fund Flow'],
        ['ETFShares', 'Most Active ETF Shares Outstanding'],
        ['CommoditySeasonality', 'Commodity Market Seasonality'],
        ['BondSeasonality', 'Bond Market Seasonality'],
        ['ETFSeasonality', 'ETF Seasonality']
      ])
      if(map.has(this.checkedTitle)) return map.get(this.checkedTitle)
      else return this.checkedTitle
    },
    isShowRelated() {
      return this.row && this.row.source_list && !['ndx_100_complete_list', 'sp_1500_complete_list'].includes(this.row.source_list)
    }
  },
  components: {
    Research,
    Construction,
    Related
  },
  methods: {
    seeOnLargeChart() {
      const {market_symbol, url} = this.row
      if(!url) return
      window.open(`/backtester/sr/setup?index=${market_symbol || 'Unknown'}&indicator=${url}`, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.details {
  user-select: text;
  .back {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    padding: 10px;
    cursor: pointer;
    background-color: #d9d9d9;
    border-radius: 4px 4px 0px 0px;
    i {
      font-weight: bold;
    }
    span {
      color: #525456;
      font-weight: 400;
      &:hover {
        color: #5b9bd1;
      }
    }
  }
}
.chart-name {
  h1 {
    margin: 0;
    font-weight: 500;
    font-size: 24px;
  }
  .el-button--text {
    color: rgb(31, 119, 180);
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 0px 15px;
}
.indicator-info {
  padding: 15px 15px 0px 15px;
  font-weight: 700;
  list-style-type: disc;
  li {
    margin-left: 15px;
  }
}
.detail-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  h3 {
    font-size: 16px;
    font-weight: 400;
  }
}
.seasonality-detail-title {
  padding: 10px;
  h3 {
    font-size: 16px;
    font-weight: 400;
    margin: 0px;
    padding: 0px;
  }
}
.panel-title {
  font-weight: 300;
  margin: 0px 0px 0px 10px;
}
h3 {  
  margin: 0;
  padding: 0;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  color: #666;
  position: relative;
  flex-wrap: wrap;
  height: auto;
}
.el-button.el-button--primary.el-button--mini {
  background-color: #67809f;
}
.el-button--text {
  padding: 0px;
}
.centent {
  padding: 15px 15px 0px 15px;
}
.el-collapse-item {
  border: 1px solid #c0c4cc5c;
  border-radius: 3px;
}
.el-collapse-item:first-child {
  margin-bottom: 25px;
}
.headerSelect {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  h4 {
    margin: 0;
    color: #737373;
    cursor: pointer;
    font-size: 15px;
    font-weight: 400;
    padding: 10px 15px;
    &.selected {
      border-bottom: 4px solid #1c5271;
      color: #333;
    }
    &:hover {
      color: #333;
    }
  }
  .btns {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .el-button--text {
    color: #1c5271;
  }
}
.details-container {
  padding: 15px;
  .well {
    font-size: 18px;
    background-color: #eee;
    padding: 10px;
  }
  h4 {
    font-size: 18px;
    margin: 10px 0px 10px 0px;
  }
  p {
    margin: 0 0 10px 0;
    font-size: 15px;
    color: #333;
    font-weight: 400;
  }
}
.convertedHTML p {
    margin: 0 0 10px 0;
    font-size: 15px;
    color: #333;
    font-weight: 400;
}
</style>