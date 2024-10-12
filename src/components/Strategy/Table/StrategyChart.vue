<template>
 <div id="strategy_chart"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import 'highcharts/indicators/indicators';
import 'highcharts/indicators/bollinger-bands';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';

export default {
 name: 'StrategyChart',
 data() {
   return {
     strategy_sets: {
       spx: [],
       spx2: [],
       buy_signal: [],
       buy_signal2: [],
       sell_signal: [],
       sell_signal2: []
     },
     strategy_titles: {
       spx: '',  // Assuming `index1` is passed from props or data
       spx2: '',  // Assuming `index1` is passed from props or data
       buy_signal: 'Buy Signal',
       buy_signal2: 'Buy Signal2',
       sell_signal: 'Sell Signal',
       sell_signal2: 'Sell Signal2'
     },
     strategy_types: {
       spx: 'line',
       spx2: 'line',
       buy_signal: 'scatter',
       buy_signal2: 'scatter',
       sell_signal: 'scatter',
       sell_signal2: 'scatter'
     },
     strategy_colors: {
       spx: "#000000",
       spx2: "#0000ff",
       buy_signal: "#008000",
       buy_signal2: "#00ff00",
       sell_signal: "#ff0000",
       sell_signal2: "#ffa500",
     },
     strategy_marker: {
       spx: "circle",
       spx2: "spuare",
       buy_signal: 'triangle',
       buy_signal2: 'triangle',
       sell_signal: 'triangle-down',
       sell_signal2: 'triangle-down'
     },
     strat_marker_radius: {
       spx: 5,
       spx2: 5,
       buy_signal: 7,
       buy_signal2: 7,
       sell_signal: 7,
       sell_signal2: 7
     }
   };
 },
 props: {
  /*
  数据说明
  strat_data: [
    [1609459200000, 3700, 1, null], // [时间戳, spx, buy_signal, sell_signal]
    [1609545600000, 3720, null, 1],
    [1609632000000, 3680, 1, null]
  ]
  index1: 指标的名称
  load_strategy_chart: 是否加载策略图表
  */
   strat_data: Object,
   index1: String,  // Assuming index1 is passed as a prop
   load_strategy_chart: Boolean,
 },
 watch: {
   strat_data: {
    handler(newValue, oldValue) {
      if(Array.from(Object.keys(newValue)).length !== 0) {
        const {strat_data, symbolName} = newValue

       if (strat_data && Array.isArray(strat_data) && strat_data.length > 0) {
          const [_strat_data, _strat_data2] = strat_data
          const {symbol1, symbol2} = symbolName
          this.strategy_titles = {
            ...this.strategy_titles,
            spx: symbol1 || '',
            spx2: symbol2 || '',
            buy_signal: `Buy Signal(${symbol1 || ''})`,
            sell_signal: `Sell Signal(${symbol1 || ''})`,
            buy_signal2: `Buy Signal(${symbol2 || ''})`,
            sell_signal2: `Sell Signal(${symbol2 || ''})`,
          }
         this.splitDataStrats(_strat_data, _strat_data2);
         this.createChartStrat();
       }
      }
    }, 
   deep: true
   }
  },
  mounted() {
    Exporting(Highcharts);
    ExportData(Highcharts);
  },
 methods: {
   splitDataStrats(data_strat, data_strat2) {
     const dataLength = data_strat.length;
     const offset = 15

      for (let i = 0; i < dataLength; i++) {
        const date = data_strat[i][0],
            spx = data_strat[i][1],
            buy_signal = data_strat[i][2],
            sell_signal = data_strat[i][3];

        // SPX 数据
        this.strategy_sets.spx.push([date, spx]);

        // Buy 和 Sell 信号放在 SPX 的线上
        if (buy_signal !== null) {
          this.strategy_sets.buy_signal.push([date, spx - offset]);  // 用 spx 值作为 buy_signal 的 y 轴值
        }
        if (sell_signal !== null) {
          this.strategy_sets.sell_signal.push([date, spx + offset]);  // 用 spx 值作为 sell_signal 的 y 轴值
        }
      }
      if(data_strat2 && Array.isArray(data_strat2) && data_strat2.length) {
        for (let i = 0; i < data_strat2.length; i++) {
          const date2 = data_strat2[i][0],
              spx2 = data_strat2[i][1],
              buy_signal2 = data_strat2[i][2],
              sell_signal2 = data_strat2[i][3];

          // SPX 数据
          this.strategy_sets.spx2.push([date2, spx2]);

          // Buy 和 Sell 信号放在 SPX 的线上
          if (buy_signal2 !== null) {
            this.strategy_sets.buy_signal2.push([date2, spx2 - offset]);  // 用 spx 值作为 buy_signal 的 y 轴值
          }
          if (sell_signal2 !== null) {
            this.strategy_sets.sell_signal2.push([date2, spx2 + offset]);  // 用 spx 值作为 sell_signal 的 y 轴值
          }
        }
      }
   },
   createChartStrat() {
     let yAxis = [
       {
         name: 'spx',
         labels: { align: 'right', x: 0, style: { color: this.strategy_colors['spx'] } },
         top: '0%',
         height: '100%',
         offset: 30
       },
       {
         name: 'buy_signal',
         linkedTo: 0,
         title: { enabled: false },
         labels: { enabled: false }
       },
       {
         name: 'sell_signal',
         linkedTo: 0,
         title: { enabled: false },
         labels: { enabled: false }
       }
     ];
     const {strat_data} = this.strat_data
     const [_strat1, _strat2] = strat_data
     if(_strat2 && Array.isArray(_strat2) && _strat2.length) {
        yAxis = [...yAxis, 
          {
            name: 'spx2',
            labels: { align: 'right', x: 0, style: { color: this.strategy_colors['spx2'] } },
            top: '0%',
            height: '100%',
            offset: 30
          },
          {
            name: 'buy_signal2',
            linkedTo: 3,
            title: { enabled: false },
            labels: { enabled: false }
          },
          {
            name: 'sell_signal2',
            linkedTo: 3,
            title: { enabled: false },
            labels: { enabled: false }
          }
        ]
     } 

     Highcharts.stockChart('strategy_chart', {
       title: { text: "" },
       navigator: { 
        series: [
          {
              color: '#2f7ed8'  // Set the color to match the bottom series
          },
          {
              color: '#333'  // Set the color to match the bottom series
          }
        ] 
        },
       rangeSelector: {
         selected: 3,
         allButtonsEnabled: true,
         buttons: [
           { type: 'month', count: 3, text: '3m' },
           { type: 'month', count: 6, text: '6m' },
           { type: 'ytd', text: 'YTD' },
           { type: 'year', count: 1, text: '1y' },
           { type: 'year', count: 3, text: '3y' },
           { type: 'year', count: 5, text: '5y' },
           { type: 'year', count: 10, text: '10y' },
           { type: 'all', text: 'All' }
         ]
       },
       legend: {
         enabled: true,
         align: 'center',
         verticalAlign: 'top',
         x: 0,
         y: 20
       },
       exporting: {
         filename: 'Strategy Chart',
         sourceWidth: 600,
         sourceHeight: 400,
         chartOptions: {
           navigator: { enabled: false },
           rangeSelector: { enabled: false },
           scrollbar: { enabled: false },
           chart: {
             backgroundColor: '#fff',
             plotBackgroundColor: '#fff'
           }
         }
       },
       yAxis: yAxis,
       chart: {
         zoomType: 'x',
         backgroundColor: 'transparent',
         height: 600
       },
       credits: {
         enabled: true,
         text: "SENTIMENTRADER",
         href: '#',
         position: {
           align: 'right',
           y: -125,
           x: -75
         }
       },
       tooltip: {
        xDateFormat: '%m-%d-%Y',
        crosshairs: true,
        useHTML: true,
        formatter: function () {
          if (this.points && Array.isArray(this.points)) {
            // 处理共享 tooltip
            let s = `${Highcharts.dateFormat('%m-%d-%Y', this.x)}<br>`;
            this.points.forEach(point => {
              // Add a colored circle before the series name
              const colorSpan = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${point.series.color}; border-radius: 50%; margin-right: 5px; border: 1px solid black"></span>`;
              s += `${colorSpan}<span>${point.series.name}</span>: <b>${point.y}</b><br>`;
            });
            return s;
          } else {
            // 处理独立点的 tooltip
            const name = this.series.name;
            const offset = name.includes('Sell') ? -15 : 15
            let s = `${name}<br>`;
            s += `<span>x: <b>${Highcharts.dateFormat('%m-%d-%Y', this.x)}</b></span><br><span>y: <b>${this.y + offset}</b></span><br>`;
            return s;
          }
        }
       },
       plotOptions: {
        scatter: {
          marker: {
            states: {
              hover: {
                enabled: true,
                lineWidth: 1,
                lineColor: '#000',  // 设置三角形的边框颜色
                fillColor: null,    // 根据需要设置填充颜色
                halo: false         // 禁用 halo 效果
              }
            }
          },
          events: {
            mouseOver: function () {
              // 暂时禁用 line 的鼠标跟踪，防止 tooltip 触发
              try {
                if(this.chart?.series) {
                    this.chart.series.forEach(series => {
                    if (series.type === 'line') {
                      series.update({ enableMouseTracking: false });
                    }
                  });
                }
              } catch (error) {
                console.log('error', error)
              }
              // 当 hover 到 scatter（三角形）时，隐藏其他 series 的 tooltip
              this.chart.tooltip.hide();
            },
            mouseOut: function () {
              console.log('mouseOut', this.chart);
              // 当移出 scatter 时，重新启用 line 的鼠标跟踪和 tooltip
              try {
                if(this.chart?.series) {
                  this.chart.series.forEach(series => {
                    if (series.type === 'line') {
                      series.update({ enableMouseTracking: true });
                    }
                  });
                }
              } catch (error) {
                console.log('error', error)
              }
              // 重新显示 tooltip
              this.chart.tooltip.refresh();
            }
          }
        },
        line: {
          lineWidth: 2,  // 设置线的宽度
          states: {
            hover: {
              enabled: true,  // 线在 hover 时继续保持边框
              lineWidthPlus: 0,  // hover 时不增加线宽
              borderColor: '#000'  // 确保线的边框颜色为黑色
            }
          },
          events: {
            mouseOver: function () {
              // 当 hover 到 line 时，确保显示 tooltip 和黑色边框
              this.chart.tooltip.refresh(this);
              this.update({
                states: {
                  hover: {
                    borderColor: '#000',  // 确保边框颜色为黑色
                  }
                }
              });
            },
            mouseOut: function () {
              // 当移出 line 时，tooltip 自动消失
              this.chart.tooltip.hide();
            }
          }
        }
      },
       series: this.getSeriesListStrat(yAxis)
     });
   },
   getSeriesListStrat(yAxis) {
      const strat_series = [];
      debugger
      for (let i = 0; i < yAxis.length; i++) {
        let name = yAxis[i].name;
        if(name.endsWith('2') && Array.isArray(this.strategy_sets[`${name}2`]) && this.strategy_sets[`${name}2`].length) name = `${name}2`
        const isSignal = ['buy_signal', 'buy_signal2', 'sell_signal', 'sell_signal2'].includes(name)
        const series = {
          name: this.strategy_titles[name],
          type: this.strategy_types[name],  // 继续使用 scatter 类型
          data: this.strategy_sets[name],
          yAxis: 0,  // 确保所有信号都在第一个 yAxis 上，与 spx 一致
          dataGrouping: { enabled: false },
          marker: {
            symbol: this.strategy_marker[name], 
            radius: this.strat_marker_radius[name],
            states: {
              hover: {
                enabled: true,  // 启用 hover 效果
                halo: {
                  size: 0  // 禁用点的 halo 效果
                },
                // 添加边框和阴影
                lineWidth: 1,  // 边框宽度
                lineColor: '#000000',  // 边框颜色
                fillColor: this.strategy_colors[name],  // 填充颜色
                // 使用 SVG 的 shadow 属性来添加阴影
                shadow: {
                  color: 'rgba(0, 0, 0, 0.5)',  // 阴影颜色
                  offsetX: 2,  // X轴偏移
                  offsetY: 2,  // Y轴偏移
                  opacity: 0.5,  // 阴影透明度
                  width: 3  // 阴影宽度
                }
              }
            }
          },
          color: this.strategy_colors[name],
          lineWidth: isSignal ? 0 : 2,  // 确保 scatter 类型不显示连线，只显示 marker
          zIndex: isSignal ? 4 : 1,  // 提升三角形的 zIndex，确保它在上方
          enableMouseTracking: true,
          states: {
            hover: {
              opacity: 1,
              lineWidthPlus: 1,
              borderColor: '#000',
            },
            inactive: {
              opacity: 1,
            },
          },
          showInNavigator: !isSignal
        }
        strat_series.push(series);
      }
      return strat_series;
    }
 }
};
</script>

<style scoped>
#strategy_chart {
 width: 100%;
}
</style>