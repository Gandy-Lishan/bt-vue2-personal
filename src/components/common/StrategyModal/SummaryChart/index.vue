<template>
  <div style="width: 100%;">
    <!-- 添加下拉框 -->
    <div class="strategy-dropdown">
      <label for="strategy-select" style="margin-right: 15px; font-weight: bold;">Select Strategy:</label>
      <select :value="selectedStrategyIndex" @change="renderChart">
        <option v-for="(strategy, index) in strategiesOptions" :key="index" :value="strategy.value">
          {{strategy.label}}
        </option>
      </select>
    </div>
    <!-- Summary Container -->
    <div v-loading="loading" class="perfomance-chart page-content-wrapper">
    <div id="summaryChart"  style="height: 450px;"></div>
    <div class="summary-table" v-if="resultDf">
      <div class="table">
        <table class="threshold-table sum-threshold-table" style="width: 100%;">
          <thead>
          <tr>
            <th></th>
            <th v-for="(key, keyIndex) in columns" :key="keyIndex" style="text-align: center">
              <b>{{key}}</b>
            </th>
          </tr>
          </thead>
          <tbody>
            <tr style="text-align: center">
              <template v-for="(key, keyIndex) in columns">
                <template>
                <td v-if="keyIndex === 0" :key="keyIndex" style="text-align: left"><b>Buy & Hold</b></td>
                <td :key="keyIndex">{{resultDf[`Benchmark ${key}`]}}</td>
              </template>
              </template>
            </tr>
            <tr style="text-align: center">
              <template v-for="(key, keyIndex) in columns">
                <template>
                <td v-if="keyIndex === 0" :key="keyIndex" style="text-align: left"><b>Strategy</b></td>
                <td :key="keyIndex">{{resultDf[`Symbol ${key}`]}}</td>
              </template>
              </template>
            </tr>
        </tbody>
        </table>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import { getSymbolStrategySigal } from "@/service/service";
import { CIQ } from '@/components/common/chart/st-development/js'
import { mapGetters } from "vuex";
import signal_desc from "./signal_desc.json";

export default {
 name: 'summaryChart',
 props: {
  strategyIndex: Number
 },
 data() {
  return {
   resultDf: null,
   loading: true,
   symbol: CIQ.stxx.chart.symbol,
   strategies: [], // 保存从 API 获取的策略数据
   selectedStrategyIndex: 0,
   strategiesOptions: [],
   columns: ['Total Trading Days', 'Buy Signal', 'Exposure', 'Total Return', 'Max Drawdown']
  }
 },
 watch: {
    // 监视 symbol 变化，重新加载图表
    symbol: 'loadChart',
    strategyIndex: {
       handler(val) {
        if(val != this.selectedStrategyIndex) {
          this.$nextTick(async () => {
            this.selectedStrategyIndex = val
            await this.renderChart()
          })
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['getTradingSignalStrategies'])
  },
 async mounted() {
   Exporting(Highcharts);
   ExportData(Highcharts);
   console.log('initialize Summary Chart!', 'signal_desc', signal_desc)
   try {
    await this.renderChart();
   } catch (error) {
    console.log(error)
    this.$emit('error');  // 向父组件发出 'error' 事件
   }
 },
 methods: {
   async renderChart(e) {
    if(e?.target?.value) this.$emit('changeStrategyIndex', e?.target?.value || 0)
    this.strategies = this.getTradingSignalStrategies
    this.strategiesOptions = this.strategies.map(item => (item.Signal)).map((ele,i) => ({label: ele, value: i}))
    let resultDf = this.strategies
    try {
      resultDf = this.strategies.map(item => {
      item['Cumulative Json'] =  item['Cumulative Json'].replace(/NaN/g, 'null')
      item['Cumulative Json'] = JSON.parse(item['Cumulative Json']);
      item['EntryDate'] = eval(item['EntryDate'])
      item['ExitDate'] = eval(item['ExitDate'])
      return item
    })
    } catch (error) {
    }
    console.log('resultDf', resultDf)
    this.updateChartWithSelectedStrategy(resultDf)
     this.loading = false
   },
   updateChartWithSelectedStrategy(resultDf) {
    const _this = this
     _this.$nextTick(() => {
      _this.resultDf = resultDf.map((item,index) => {
       if(index === _this.selectedStrategyIndex) {
        return {
        ['Symbol Total Trading Days']: item['Symbol Total Trading Days'],
        ['Symbol Buy Signal']: item['Symbol Buy Signals'],
        ['Symbol Avg.Holding Period']: `${item['Avg.Holding Period']}%`,
        ['Symbol Exposure']: `${item['Symbol Exposure']}%`,
        ['Symbol Total Return']: `${item['Symbol Signal Return']}%`,
        ['Symbol Max Drawdown']: `${item['Symbol Max Drawdown']}%`,
        ['Benchmark Total Trading Days']: item['Total Trading Days'],
        ['Benchmark Buy Signal']: '',
        ['Benchmark Avg.Holding Period']: '',
        ['Benchmark Exposure']: '100%',
        ['Benchmark Total Return']: `${item['Benchmark Signal Return']}%`,
        ['Benchmark Max Drawdown']: `${item['Benchmark Max Drawdown']}%`
       }}
      }).filter(ele => ele !== null && ele !== '' && ele !== undefined).shift(0)

      console.log(' _this.resultDf',  _this.resultDf)
     })
     const processCumulativeJson = (resultDf, keys) => {
      let result = [];
      const jsonData = resultDf.map(item => item['Cumulative Json']);

      // date 和 Buy and Hold Cumulative 始终从 jsonData[0] 提取
      result[0] = jsonData[0].map(item => new Date(item['Date']).getTime());

      // Strategy Cumulative 从不同的 jsonData 项中提取
      for (let i = 0; i < jsonData.length; i++) {
          result[i + 1] = jsonData[i].map(item => item['Strategy Cumulative']);
      }
      result[jsonData.length + 1] = jsonData[0].map(item => item['Buy and Hold Cumulative']);

      return result;
    }
    const data = processCumulativeJson(resultDf, ['Date', 'Strategy Cumulative', 'Strategy Cumulative', 'Strategy Cumulative', 'Buy and Hold Cumulative']);
    console.log('data', data)
    const date = data[0];
    const benchmark = data[4];
    const data1 = data[1];
    const data2 = data[2];
    const data3 = data[3];
    let series = [
       {
         name: 'Benchmark',
         data: date.map((d, i) => [d, benchmark[i]]),
         color: '#7f7f7f'
       }
     ]
     const name = _this.strategiesOptions.find(item => item.value == _this.selectedStrategyIndex)?.label
     if(_this.selectedStrategyIndex === 0) {
      series = [
       {
         name,
         data: date.map((d, i) => [d, data1[i]]),
         color: '#1f77b4'
       },
      ...series]
     }else if(_this.selectedStrategyIndex === 1) {
      series = [
       {
         name,
         data: date.map((d, i) => [d, data2[i]]),
         color: '#ff7f0e'
       },
      ...series]
     }else if(_this.selectedStrategyIndex === 2) {
      series = [
       {
         name,
         data: date.map((d, i) => [d, data3[i]]),
         color: '#2ca02c'
       },
      ...series
       ]
     }

     const createChart = (series) => {
       console.log('series: ', series);
       const allData = series.flatMap(s => s.data);
       const minX = Math.min(...allData.map(d => d[0]))
       const maxX = Math.max(...allData.map(d => d[0]));
       const timeSpan = maxX - minX;
       // 根据时间跨度动态设置 selected
       let selected;
       if (timeSpan >= 20 * 365 * 24 * 3600 * 1000) { // 大于20年
         selected = 9; // 'All'
       } else if (timeSpan >= 15 * 365 * 24 * 3600 * 1000) { // 15-20年
         selected = 8; // '20y'
       } else if (timeSpan >= 10 * 365 * 24 * 3600 * 1000) { // 10-15年
         selected = 7; // '15y'
       } else if (timeSpan >= 5 * 365 * 24 * 3600 * 1000) { // 5-10年
         selected = 6; // '10y'
       } else if (timeSpan >= 3 * 365 * 24 * 3600 * 1000) { // 3-5年，选择 '3 年'
         selected = 4; // '3y'
       } else if (timeSpan >= 1 * 365 * 24 * 3600 * 1000) { // 1-3年
         selected = 3; // '1y'
       } else if (timeSpan >= 6 * 30 * 24 * 3600 * 1000) { // 6-12个月
         selected = 2; // 'YTD'
       } else if (timeSpan >= 3 * 30 * 24 * 3600 * 1000) { // 3-6个月
         selected = 1; // '6m'   
       } else {
         selected = 0; // '3m'
       }
       console.log('selected', selected)


        var basicChartOptions = {
          zoomType: 'x',
          pinchType: '',
          style: {
            "fontFamily": "Open Sans , sans-serif"
          },
          animation: false,
          alignTicks: false,
          backgroundColor: 'transparent',
          renderTo: 'charts',

          events: {
            load: function (event) {
              var e = event.target.axes[0].getExtremes();
              this.defaultChartScale = [e.min, e.max];
              this.renderer.image('https://dnpgic06wp5lx.cloudfront.net/sentimentrader.png', 0, 300, 120,33)
                  .attr({
                      'opacity': 0.25
                  })
                  .add();
            },
          }
        };
       // const maxX = Math.max(...allData.map(d => d[0]));
       Highcharts.stockChart('summaryChart', {
         rangeSelector: {
           inputEnabled: true,
           inputDateFormat: '%Y/%m/%d',
           inputEditDateFormat: '%Y/%m%d',
           buttons: [
           { type: 'month', count: 3, text: '3m' },
           { type: 'month', count: 6, text: '6m' },
           { type: 'ytd', text: 'YTD' },
           { type: 'year', count: 1, text: '1y' },
           { type: 'year', count: 3, text: '3y' },
           { type: 'year', count: 5, text: '5y' },
           { type: 'year', count: 10, text: '10y' },
           { type: 'year', count: 15, text: '15y' },
           { type: 'year', count: 20, text: '20y' },
           { type: 'all', text: 'All' }
         ],
         selected: selected // Sets the default selected button (4 corresponds to '1y')
         },
         // subtitle: {
         //   text: last_value !== undefined && last_value !== null ? `Last Value: ${last_value}` : ''
         // },
         title: {
          text: 'Performance Summary',
          style: {
            color: '#333',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Arial'
          }
         },
         exporting: {
           enabled: true,
           buttons: {
             contextButton: {
               menuItems: [
                 'printChart',
                 'downloadPNG',
                 'downloadJPEG',
                 'downloadPDF'
               ]
             }
           }
         },
         yAxis: [{
           gridLineDashStyle: 'Dash',
           labels: {
             format: '{value} %',
             align: 'left',
             style: {
               color: Highcharts.getOptions().colors[1],
             }
           },
           title: {
             text: '',
             style: {
               color: Highcharts.getOptions().colors[1]
             }
           },
           // opposite: true
         }],
         xAxis: {
           type: 'datetime',
           ordinal: false,
           min: minX,
           crosshair: { label: { enabled: false } },
           labels: {
             formatter: function() {
               const range = this.axis.max - this.axis.min;

               // 设置不同时间范围下的格式
               if (range > 3 * 365 * 24 * 3600 * 1000) {
                 // 大于 3 年，显示年份
                 return Highcharts.dateFormat('%Y', this.value);
               } else if (range > 365 * 24 * 3600 * 1000) {
                 // 1 - 3 年，显示季度
                 return Highcharts.dateFormat('%Y %b', this.value);
               } else if (range > 30 * 24 * 3600 * 1000) {
                 // 1 - 12 个月，显示月份和天
                 return Highcharts.dateFormat('%b %d', this.value);
               } else if (range > 7 * 24 * 3600 * 1000) {
                 // 7 - 30 天，显示具体日期
                 return Highcharts.dateFormat('%b %e', this.value);
               } else {
                 // 小于 7 天，显示小时和日期
                 return Highcharts.dateFormat('%b %e, %H:%M', this.value);
               }
             }
           }
         },
         navigator: {
           series: {
            color: '#2f7ed8'  // Set the color to match the bottom series
           },
           series: [
            {
             color: '#1f77b4'
            },
            {
             color: '#ff7f0e',
            },
            {
             color: '#2ca02c'
            },
            {
             color: '#7f7f7f'
            }
           ],
           xAxis: {
            labels: {
                format: '{value:%Y}' // Format for navigator x-axis labels
            }
           }
         },
         legend: {
           enabled: true,
           align: 'center',
           verticalAlign: 'top',
           layout: 'horizontal',
           x: 0,
           y: 20,
           itemStyle: {
           fontSize: '12px',
           fontWeight: 'bold'
         },
         },
         credits: {
           enabled: true,
           text: "Source: SentimenTrader",
           href: 'https://sentimentrader.com',
           position: {
             align: 'right',
             y: -120,
             x: -80
           }
         },
         tooltip: {
          xDateFormat: '%m-%d-%Y',
          followTouchMove: true,
          shared: true,
          useHTML: true,
          crosshairs: true, 
          formatter: function () {
            let s = `${Highcharts.dateFormat('%m-%d-%Y', this.x)}<br>`;
            this.points.forEach(point => {
              // Add a colored circle before the series name
              const colorSpan = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${point.series.color}; border-radius: 50%; margin-right: 5px;"></span>`;
              s += `${colorSpan}<span>${point.series.name}</span>: <b>${point.y}%</b><br>`;
            });
            return s;
          }
        },
         plotOptions: {
           series: {
             states: {
               hover: {
                 enabled: false
               },
               inactive: {
                 enabled: false
               }
             },
             showInNavigator: true
           }
         },
         series: series.map((s, i) => {
         return{
           ...s,
           showInNavigator: true,
           enableMouseTracking: true,
           showInLegend: true,
           lineWidth: 2,
           dataGrouping: {
               enabled: false
           }
         }}),
         chart: basicChartOptions
       });
     };
     createChart(series)
   }
 }
}
</script>

<style lang="less" scoped>
.perfomance-chart {
 overflow: hidden;
 background-color: #fff;
 #summaryChart {
  // border: 1px solid #ccc;
 }
}
.sum-threshold {
  width: 100%;
}
select {
  font-weight: bold !important;
}
</style>