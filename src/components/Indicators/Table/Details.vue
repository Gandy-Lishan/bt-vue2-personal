<template>
  <div class="details">
    <!-- <div class="back">
			<span @click="$emit('showDetails', {}, false)"><i class="el-icon-arrow-left"></i>Back to {{backToListTitle}}</span>
		</div>
    <div class="chart-name">
      <h1>{{title}}<el-button type="text" @click="seeOnLargeChart"><em>(See this indicator on the large chart)</em></el-button></h1>
    </div>
    <div class="detail-title">
      <h3>
        Data Access -
        <small><em>For internal use only...no distribution is allowed.</em></small>
      </h3>
      <el-button type="primary" size="mini" @click="$emit('downloadCSV')">Download CSV File</el-button>
    </div>
    <div class="seasonality-detail-title">
      <h3>
        Chart Details - Data last updated on <em>January 2024</em>
      </h3>
    </div> -->
    <div class="chart-name">
      <h1>{{title}}<el-button type="text" @click="seeOnLargeChart"><em>(See this indicator on the large chart)</em></el-button></h1>
      <el-button type="text" icon="el-icon-back" @click="$emit('showDetails', {}, false)">Return</el-button>
    </div>
    <div class="centent">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Detail'" :class="{ 'selected': selectedTitle === 'Detail' }">Indicator Detail</h4>
            <h4  @click="selectedTitle = 'Research'" :class="{ 'selected': selectedTitle === 'Research' }">Research & Blog Posts</h4>
            <h4  @click="selectedTitle = 'Related'" :class="{ 'selected': selectedTitle === 'Related' }">Related Charts</h4>
            <div class="btns">
              <el-button type="primary" size="mini" @click="$emit('downloadCSV')">Download CSV File</el-button>
            </div>
          </div>
          <div>
            <Construction v-show="selectedTitle === 'Detail'" ref="Construction" :convertedHTML="convertedHTML" :title="title"></Construction>
            <Research v-show="selectedTitle === 'Research'" ref="Research" :blog_results="blog_results"></Research>
            <Related v-show="selectedTitle === 'Related'" ref="Related" :related="related"></Related>
          </div>
        </div>
    <!-- <el-collapse  v-model="activeName" accordion>
      <el-collapse-item name="1">
        <template slot="title">
          <h3 class="panel-title">
            Indicator Details and Other Charts
          </h3>
        </template>
      </el-collapse-item>
    </el-collapse> -->
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
      related: []
    }
  },
  watch: {
    row: {
      async handler(newValue) {
        if(!newValue.url) return;
        try {
          const convertToHTML = (text) => {
            // 替换换行符、制表符、大于号、和与号
            text = text.replace(/\\r/g, '<br>')
            text = text.replace(/\\n/g, '<br>')
            text = text.replace(/\\t/g, '&emsp;')
            text = text.replace(/&gt;/g, '>')
            text = text.replace(/&amp;/g, '&')
            text = text.replace(/&rsquo;/g, '\'')
            return text
          }
          this.title = newValue.chart_name
				  this.convertedHTML = convertToHTML(newValue.description)
          const res = await getIndicatorsRowData(newValue.url)
          let originalData = res?.data
          if(typeof originalData === 'string') {
            originalData = originalData.replace(/NaN/g, 'null')
            originalData = JSON.parse(originalData)
          }
          console.log('originalData', originalData)
          this.blog_results = originalData.blog_results
          this.related = originalData.related
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
    color: #697882;
  }
  .el-button--text {
    color: rgb(31, 119, 180);
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 0px 15px;
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