<template>
  <div style="width: 100%;">
    <!-- 图表容器 -->
    <div v-loading="loading" class="strategy-signal--chartcontainer" ref="strategySignalChartcontainer"></div>
  </div>
</template>

<script>
import { CIQ } from '@/components/common/chart/st-development/js/components'
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import moment from 'moment'
import { mapGetters, mapMutations } from "vuex";
import {
  getSymbolStrategySigal
} from '@/service/service'

export default {
  name: 'StrategySigal',
  props: {
    strategyIndex: Number
  },
  data() {
    return {
      chart: null, // 存储图表实例
      loading: true,
      symbol: CIQ.stxx.chart.symbol,
      strategies: [], // 保存从 API 获取的策略数据
      strategiesOptions: [],
      selectedStrategyIndex: 0,
      trendScore: [],
    };
  },
  watch: {
    symbol: 'loadChart', // 监视 symbol 变化，重新加载图表
    strategyIndex: {
       handler(val) {
        if(val != this.selectedStrategyIndex) {
          this.$nextTick(async () => {
            this.selectedStrategyIndex = val
            await this.loadChart()
          })
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['getTradingSignalStrategies'])
  },
  mounted() {
    this.loadChart(); // 初次加载图表
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },

  methods: {
    ...mapMutations('states',['SET_TRADING_SIGNAL_STRATEGY']),
    async loadChart(e) {
      if(e?.target?.value) this.$emit('changeStrategyIndex', e?.target?.value || 0)
      if (this.chart) {
        this.chart.destroy(); // 销毁旧图表
      }
      Exporting(Highcharts);
      ExportData(Highcharts);

      if (this.strategies.length > 0) {
        this.updateChartWithSelectedStrategy(); // 根据当前选择的策略更新图表
        this.loading = false;
        return;
      }

      try {
        const signalData = await getSymbolStrategySigal(this.symbol);
        if(signalData.data.status == 504) {
          this.popUpMsgBox('No relate symbol strategy signal.')
          this.$emit('error');  // 向父组件发出 'error' 事件
        }else {
          this.strategies = signalData.data.data; // 保存所有策略数据
          this.SET_TRADING_SIGNAL_STRATEGY(this.strategies)
          this.strategiesOptions = signalData.data.data.map(item => (item.Signal)).map((ele,i) => ({label: ele, value: i}))
          this.$emit('getStrategiesOptions', this.strategiesOptions)
          this.trendScore = JSON.parse(this.strategies[0].trend_score)  // trendScore只存在第一个Strategy内并且通用, 所以作为唯一变量储存
          this.updateChartWithSelectedStrategy();
        }
      } catch (error) {
        console.error(`Error fetching data for symbol: ${this.symbol}`, error);
        this.$emit('error');  // 向父组件发出 'error' 事件
      } finally {
        this.loading = false; // 无论成功或失败都结束 loading 状态
      }
    },
    updateChartWithSelectedStrategy() {
      const selectedStrategy = this.strategies[this.selectedStrategyIndex];
      if(!selectedStrategy) {this.$emit('changeStrategyIndex', 0); return}
      let { EntryDate, ExitDate, Direction } = selectedStrategy;
      if( selectedStrategy['Show Last'] == false ) {
        ExitDate = ExitDate.slice(0, ExitDate.length-1)
      }
      this.plotData( EntryDate, ExitDate, Direction);
    },
    plotData( EntryDate, ExitDate, Direction) {
      // find the start point
      const start = EntryDate[0] < ExitDate[0] ? EntryDate[0] : ExitDate[0]

      const filteredTrendScore = this.trendScore.filter(item => {
        const itemDate = moment(item.DT);
        const isAfterStart = itemDate.isAfter(moment(start).subtract(1, 'month'));
        
        // // 判断是否为 2024 年 9 月, for Testing Only
        // const isInSeptember2024 = itemDate.year() === 2024 && itemDate.month() === 8; // month() 返回值从 0 开始，8 代表 9 月
        
        return isAfterStart;
      });

      //const dataX = filteredTrendScore.map(item => new Date(item.DT));
      const rData = filteredTrendScore.map(item => [new Date(item.DT).getTime(), item.Close]);
      debugger
      const pData = filteredTrendScore.map(item => item.trend_score);

      const plotBands = rData.map(([timestamp], i) => {
        // 计算每个交易日的起始和结束时间
        //const nextTimestamp = rData[i + 1] ? rData[i + 1][0] : timestamp + 24 * 3600 * 1000; // 处理最后一个点
        const prevTimestamp = rData[i - 1] ? rData[i - 1][0] : timestamp - 24 * 3600 * 1000; // 如果是第一个交易日

        const value = pData[i]; // 对应的 trend_score
        const intensity = Math.round(255 * (value / 100));
        const color = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;

        return {
          from: prevTimestamp,           // 当前交易日的开始
          to: timestamp,         // 下一个交易日的开始（或者当前结束）
          color: color,              // 设置背景颜色
        };
      });
      // const plotBands = rData.map(([timestamp], i) => {
      //   // 当前交易日的开始时间
      //   const middleOfDay = timestamp
        
      //   // 当天中间时间段（可以根据需要调整，例如覆盖中午 12:00 ±几个小时）
      //   const startOfBar = moment(middleOfDay).add(12, 'hours').valueOf();
      //   const endOfBar = moment(middleOfDay).subtract(12, 'hours').valueOf();

      //   const value = pData[i]; // 对应的 trend_score
      //   const intensity = Math.round(255 * (value / 100));
      //   const color = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;

      //   return {
      //     from: startOfBar,   // 中间位置向前偏移一半
      //     to: endOfBar,     // 中间位置向后偏移一半
      //     color: color,                        // 设置背景颜色
      //   };
      // });

      const buyMarkerData = this.createMarkerData(rData, Direction=='Long'?EntryDate:ExitDate, 'triangle', 'green');
      const sellMarkerData = this.createMarkerData(rData, Direction=='Long'?ExitDate:EntryDate, 'triangle-down', 'red');
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
              this.renderer.image('https://dnpgic06wp5lx.cloudfront.net/sentimentrader.png', 80, 300, 120, 30)
                  .attr({
                      'opacity': 0.25
                  })
                  .add();
            },
          }
        };
      const options = {
        exporting: {
          enabled: true, // 启用导出功能
          buttons: {
            contextButton: {
              menuItems: ['printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
            },
          },
        },
        title: {
          text: `Trading Signal for ${this.symbol}`,
          style: {
            fontWeight: 'bold',
            fontFamily: 'Arial',
            fontSize: '18px',
          },
        },
        navigator: {
          enabled: true,
        },
        // xAxis: {
        //   categories: dataX.map(date => date.toISOString().split('T')[0]),
        //   gridLineWidth: 1,
        //   gridLineDashStyle: 'Dash',
        //   tickPixelInterval: 1,
        //   title: {
        //     text: "Dates",
        //   },
        //   plotBands: plotBands,
        // },
        xAxis: {
           type: 'datetime',
           ordinal: false,
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
           },
          // plotBands: plotBands,
         },
        yAxis: {
          gridLineDashStyle: 'Dash',
          labels: {
            format: '{value}',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          gridLineWidth: 0,
          title: {
            text: '',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        tooltip: {
          shared: false, // 单独显示每个点的 tooltip
          formatter: function () {
            const date = Highcharts.dateFormat('%A, %b %e, %Y', this.x);
            // 获取系列的颜色
            const color = this.series.color;

            if (this.series.name === 'Buy' || this.series.name === 'Sell') {
              return `
                <span style="color: ${color}; font-size: 10px;">●</span>
                <span style="font-size: 10px;">${this.series.name}</span><br>Date: ${date}<br>Close:
                <b>${this.y.toFixed(2)}</b>
              `;
            } else if (this.series.name === 'Symbol Close') {
              return `
                <span style="font-size: 10px;">${date}</span><br>
                <span style="color: ${color}; font-size: 10px;">●</span>
                Symbol Close: 
                <b>${this.y.toFixed(2)}</b>
              `;
            } else {
              return false; // 防止其他系列显示错误的提示框
            }
          },
        },
        legend: {
          layout: 'horizontal',
          verticalAlign: 'top',
          align: 'right',
          x: -60,
          y: 20,
          floating: true,
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
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
         chart: basicChartOptions,
      };

      this.chart = Highcharts.chart(this.$refs.strategySignalChartcontainer, options);
      this.addDataSets(rData, pData, buyMarkerData, sellMarkerData);
    },
    createMarkerData(rData, markers, symbol, color) {
      return markers.map(date => {
        const index = rData.findIndex(d => d[0] === new Date(date).getTime());
        if (index !== -1) {
          return {
            x: rData[index][0],
            y: rData[index][1],
            marker: {
              symbol: symbol,
              enabled: true,
              radius: 6,
              fillColor: color,
            },
            dataLabels: {
              enabled: false,
              style: {
                color: color,
              },
              align: 'center',
              verticalAlign: symbol === 'triangle' ? 'top' : 'bottom',
            },
          };
        }
        return null;
      }).filter(Boolean);
    },
    addDataSets(rData, pData, buyMarkerData, sellMarkerData) {
      // this.chart.addSeries({
      //   name: 'Trend Score',
      //   data: pData,
      //   type: 'line',
      //   color: '#99CCFF',
      //   yAxis:  0,  // 绑定到唯一的 yAxis
      //   marker: {
      //     enabled: false,
      //   },
      // });
      this.chart.addSeries({
        name: 'Symbol Close',
        data: rData,
        type: 'line',
        color: '#01017D',
        yAxis:  0,  // 绑定到唯一的 yAxis
        marker: {
          enabled: false,
        },
      });
      // debugger
      this.chart.addSeries({
        name: 'Buy',
        data: buyMarkerData,
        type: 'scatter',
        marker: {
          symbol: 'triangle',
          enabled: true,
          fillColor: 'green',
        },
      });
      this.chart.addSeries({
        name: 'Sell',
        data: sellMarkerData,
        type: 'scatter',
        marker: {
          symbol: 'triangle-down',
          enabled: true,
          fillColor: 'red',
        },
      });
    },
  },
};
</script>

<style scoped>
.strategy-signal--chartcontainer {
  width: 100%;
  height: 500px;
}
</style>
