<template>
 <div class="portlet light" style="margin-top: 0px; padding-top: 5px; padding-bottom: 0px;">
   <div class="portlet-title">
     <div class="caption caption-md">
       <span class="caption-subject theme-font-color bold uppercase">
         Smart Money / Dumb Money Confidence
       </span>
       <form
        @submit.prevent
        style="display:inline;float:right; margin-left:75px; margin-top:-5px;"
       >
         <button type="submit" class="btn grey-cascade" @click="JumpToBacktest">View larger chart</button>
       </form>
     </div>
   </div>
   <div class="portlet-body">
     <div class="row">
       <div class="col-md-12">
         <p>
           <a :href="getChartUrl('model_dumb_money')">Dumb Money Confidence</a> is
           <u>{{ sentimentInfo.dumb_money_text }}</u>
           and
           <a :href="getChartUrl('model_smart_money')">Smart Money Confidence</a> is
           <u>{{ sentimentInfo.smart_money_text }}</u>. This suggests an
           {{ sentimentInfo.smart_verbiage }} return of {{ sentimentInfo.smart_dumb_returns.toFixed(1) }}% over the next 2 months.
         </p>
         <div ref="chartContainer" class="highcharts-chart-container"></div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import { getSmartDumbSentiment, getPairDataDashboard } from '@/service/service'
import moment from 'moment';
import { LocalStorageUtil } from '@/utils'

Exporting(Highcharts);
ExportData(Highcharts);

export default {
 data() {
    return {
      chartData: null,
      title: "Smart Money / Dumb Money Confidence",
      id: "dumb_money_chart",
      legendTitle: ["Smart Money", "Dumb Money"],
      sentimentInfo: {
        smart_money_text: '...',
        dumb_money_text: '...',
        smart_dumb_returns: NaN,
        smart_verbiage: '...',
      },
      lineHeight: 195,
      lastSmart: null,
      lastDumb: null,
    }
 },
 async mounted() {
    const symbol = 'SPX'
    const startDate = moment.utc().subtract(Number(1), 'years').format('YYYY-MM-DD')
    this.chartData = await getPairDataDashboard(symbol,'daily',startDate,undefined,['model_dumb_money','model_smart_money']);
    this.lastSmart = this.chartData[this.chartData.length-1]['indicator_Close']
    this.lastDumb = this.chartData[this.chartData.length-1]['indicator2_Close']
    this.legendTitle[0] = this.legendTitle[0] + " (Last = " + this.lastDumb + ")"
    this.legendTitle[1] = this.legendTitle[1] + " (Last = " + this.lastSmart + ")"
    this.sentimentInfo = await getSmartDumbSentiment()

    this.$nextTick(() => {
        // 确保 DOM 渲染完成后再访问 chartContainer
        const chartContainer = this.$refs.chartContainer;
        if (chartContainer) {
          this.setupChart();
        }
      });
 },
 methods: {
   getChartUrl(indicator) {
     return `/backtester/sr/setup?index=${'Unknown'}&indicator=${indicator}`
   },
   JumpToBacktest() {
    // 携带两个 indicator 和 一个 symbol
    const symbol = 'SPX'
    const indicator1 = 'model_dumb_money'
    const indicator2 = 'model_smart_money'
    const jumpBacktestData = {}
    jumpBacktestData.symbol = symbol
    const date = new Date()
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const lastMonthEnd = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    jumpBacktestData.name = `${symbol} (${year}-${month}-${day} ${hour}:${minute}:${second})`
    jumpBacktestData.end_date = lastMonthEnd
    jumpBacktestData.start_date = '1800-10-01'
    jumpBacktestData.uuid = "UUID"
    jumpBacktestData.strategy = "Single"
    jumpBacktestData.commission = 0
    jumpBacktestData.slippage = 0
    jumpBacktestData.trade_price = 0
    jumpBacktestData.entry = {
      score:1,
      signals_in_market:1,
      relation:2,
      delay_bars:0,
      signals:[
        {code:"SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/"},
        {code:"SI:Dumb Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/"},
      ],
      cond:[
        {newCondition:3,conditionPeriod:"21",ma_type:"S"},
        {newCondition:3,conditionPeriod:"21",ma_type:"S"},
        {newCondition:3,conditionPeriod:"21",ma_type:"S"}
      ]
    }
    jumpBacktestData.exit = {
      score:1,
      signals_in_market:1,
      relation:0,
      delay_bars:0,
      signals:[{code:"SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999"}],
      cond:[null]
    }
    jumpBacktestData.indicator_layout = {
      savedTechSD:[],
        activatedMA:[
          {period:21,url:""}
        ],
        activatedMALayout:[],
        activatedTechLayout:[],
        formIndicators:{entry:["model_smart_money", "model_dumb_money"],exit:[""]}
     }
		jumpBacktestData.risk_control = '//21'
    LocalStorageUtil.set('jumpBacktestData', jumpBacktestData)
    window.open('/backtester/sr/setup', '_blank');
   },
    setupChart() {
      Highcharts.chart(this.$refs.chartContainer, {
        chart: {
          height: 500,
        },
        credits: {
          enabled: false
        },
        rangeSelector: {
          selected: 1,
        },
        title: {
          text: this.title
        },
        xAxis: {
          type: 'datetime',
          labels: {
            formatter: function () {
              return moment.utc(this.value).format('MMM ’YY'  );
            }
          }
        },
        yAxis: [{
            labels: {
              format: '{value}',
              align: 'right', // 标签对齐到右侧
              x: 0, // 向左微调
            },
            gridLineWidth: 0,
            title: {
              text: 'SPX',
              // align: 'high', // 标题位置
              // rotation: 0, // 水平显示
              // y: -20, // 上移
            },
            height: '45%', // 上半部分高度
            top: '0%', // 顶部起始位置
            lineWidth: 0,
            opposite: true, // 右侧显示
            offset: 20,
        }, {
            // 下半段 Y 轴：Dumb Money 和 Smart Money
            labels: {
              format: '{value}',
              align: 'right', // 标签对齐到右侧
              x: 0, // 向左微调
            },
            title: {
              text: `<div style="text-align: center;">
                      <span style="display: block; color: #0284C7;">${this.legendTitle[0]}</span>
                      <span style="display: block; color: #b40000;">${this.legendTitle[1]}</span>
                    </div>`,
              useHTML: true, // 使用 HTML 格式
              // align: 'low', // 位置靠下
              // rotation: 0, // 水平显示
              // y: 20, // 下移
            },
            top: '50%', // 从图表的 50% 高度开始
            height: '50%', // 下半部分高度
            lineWidth: 0,
            opposite: true, // 右侧显示
            offset: 20,
            max:1,
            min:0,
            tickInterval: 0.1,
            plotLines: [
              {
                  id: 'opt',
                  value: 0.7,
                  color: '#344054',
                  dashStyle: 'shortdash',
                  width: 1.5,
              },
              {
                  id: 'pess',
                  value: 0.3,
                  color: '#344054',
                  dashStyle: 'shortdash',
                  width: 1.5,
              },
            ]
        }],
        series: [
          {
            name: 'SPX',
            data: this.chartData.map(item => [moment.utc(item.DT).valueOf(), item.Close]),
            tooltip: {
              valueDecimals: 2
            },
            color: '#344054',
            yAxis: 0,
          },
          {
            name: this.legendTitle[0],
            data: this.chartData.map(item => [moment.utc(item.DT).valueOf(), item.indicator2_Close]),
            tooltip: {
              valueDecimals: 2
            },
            color: '#0284C7',
            yAxis: 1,
          },
          {
            name: this.legendTitle[1],
            data: this.chartData.map(item => [moment.utc(item.DT).valueOf(), item.indicator_Close]),
            tooltip: {
              valueDecimals: 2
            },
            color: '#b40000',
            yAxis: 1,
          }
        ],
        tooltip: {
              shared: true
        },
        legend: {
          layout: 'horizontal', // 横向排列
          align: 'center', // 居中对齐
          verticalAlign: 'top', // 在图表顶部
          floating: false, // 固定位置
          margin: 20, // 距离图表的间距
        },
      });
    }
  },
 }

</script>
<style lang="less" scoped>
@import "./index.less";
/* Add any custom styles if needed */

.chart {
  position: relative;
  padding: 0px 40px;
  border-radius: 10px;
  background: transparent;
  overflow: hidden;
  height: 595px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  h2 {
    font-size: 17px;
    line-height: 29px;
    margin: 10px;
    text-align: center;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #111827;
  }
  h5 {
    a {
      text-decoration: none;
      color: #2563eb;
    }
    span {
      font-weight: bold;
    }
    font-weight: normal;
  }
}

.legend {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  padding: 9px 15px;
  border-radius: 9.41879px;
  background: rgb(255 255 255 / 56%);
  box-shadow: 0 0.941879px 1.88376px rgba(0, 0, 0, 0.05);
  .line {
    display: grid;
    align-items: center;
    grid-template-columns: 25px 1fr;
    gap: 6.59px;
    margin: 0 5px;
    .date {
      grid-column: 1 / span 2;
    }
    div {
      width: 25px;
      height: 9.42px;
    }
    span {
      font-size: 12.2444px;
      font-weight: bold;
      line-height: 23px;
      text-transform: uppercase;
      color: #111827;
    }
  }
}

.highcharts-chart-container {
 min-width: 400px;
 height: 500px;
}
</style>