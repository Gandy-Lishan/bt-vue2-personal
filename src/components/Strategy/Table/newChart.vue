<template>
 <div>
   <div ref="chartContainer" style="width: 100%; height: 600px;"></div>
 </div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";

// 启用模块
Exporting(Highcharts);
ExportData(Highcharts);

export default {
 props: {
   data: {
     type: Object,
     required: true,
   },
   singleModel: {
    type: String,
    require: true
   }
 },
 data() {
   return {
     chart: null,
     strategyTitles: {
       spx: "",
       spx2: "",
       buy_signal: "Buy Signal",
       buy_signal2: "Buy Signal2",
       sell_signal: "Sell Signal",
       sell_signal2: "Sell Signal2",
     },
     strategyTypes: {
       spx: "line",
       spx2: "line",
       buy_signal: "scatter",
       buy_signal2: "scatter",
       sell_signal: "scatter",
       sell_signal2: "scatter",
     },
     strategyColors: {
       spx: "#000000",
       spx2: "#0000ff",
       buy_signal: "#008000",
       buy_signal2: "#00ff00",
       sell_signal: "#ff0000",
       sell_signal2: "#ffa500",
     },
     strategyMarker: {
       spx: "circle",
       spx2: "square",
       buy_signal: "triangle",
       buy_signal2: "triangle",
       sell_signal: "triangle-down",
       sell_signal2: "triangle-down",
     },
     stratMarkerRadius: {
       spx: 5,
       spx2: 5,
       buy_signal: 7,
       buy_signal2: 7,
       sell_signal: 7,
       sell_signal2: 7,
     },
   };
 },
 watch: {
  data: {
   handler(newValue) {
    if(Array.from(Object.keys(newValue)).length !== 0) {
      const {strat_data, symbolName} = newValue

     if (strat_data && Array.isArray(strat_data) && strat_data.length > 0) {
        const [_strat_data, _strat_data2] = strat_data
        const {symbol1, symbol2} = symbolName
        this.strategyTitles = {
          ...this.strategyTitles,
          spx: symbol1 || '',
          spx2: symbol2 || '',
          buy_signal: `Buy Signal(${symbol1 || ''})`,
          sell_signal: `Sell Signal(${symbol1 || ''})`,
          buy_signal2: `Buy Signal(${symbol2 || ''})`,
          sell_signal2: `Sell Signal(${symbol2 || ''})`,
        }
        this.initializeChart();
     }
    }
   }
  }
 },
 // mounted() {
 //   this.initializeChart();
 // },
 methods: {
   initializeChart() {
    const isSingle = this.singleModel === 'False'
     const seriesData = this.data.strat_data.map((lineData, index) => {
      if(!lineData) return null
       const yAxisIndex = index === 0 ? 0 : 1;
       const lineName = index === 0 ? "spx" : "spx2";
       const buySignalName = index === 0 ? "buy_signal" : "buy_signal2";
       const sellSignalName = index === 0 ? "sell_signal" : "sell_signal2";

       // 主线
       const lineSeries = {
         name: this.strategyTitles[lineName],
         type: this.strategyTypes[lineName],
         color: this.strategyColors[lineName],
         marker: {
           symbol: this.strategyMarker[lineName],
           radius: this.stratMarkerRadius[lineName],
         },
         states: {
           hover: {
             enabled: true,  // 启用 hover 效果
             halo: {
               size: 0  // 禁用点的 halo 效果
             },
             // 添加边框和阴影
             lineWidth: 1,  // 边框宽度
             lineColor: '#000000',  // 边框颜色
             fillColor: this.strategyColors[name],  // 填充颜色
             // 使用 SVG 的 shadow 属性来添加阴影
             shadow: {
               color: 'rgba(0, 0, 0, 0.5)',  // 阴影颜色
               offsetX: 2,  // X轴偏移
               offsetY: 2,  // Y轴偏移
               opacity: 0.5,  // 阴影透明度
               width: 3  // 阴影宽度
             }
           }
         },
         yAxis: yAxisIndex,
         data: lineData.map((point) => [point[0], point[1]]),
         showInNavigator: true
       };

       // 买点
       const buySignalSeries = {
         name: this.strategyTitles[buySignalName],
         type: this.strategyTypes[buySignalName],
         color: this.strategyColors[buySignalName],
         marker: {
           symbol: this.strategyMarker[buySignalName],
           radius: this.stratMarkerRadius[buySignalName],
         },
         showInNavigator: false,
         enableMouseTracking: true,
         yAxis: yAxisIndex,
         data: lineData
           .filter((point) => point[2] === 1)
           .map((point) => ({
             x: point[0],
             y: point[1],
           })),
       };

       // 卖点
       const sellSignalSeries = {
         name: this.strategyTitles[sellSignalName],
         type: this.strategyTypes[sellSignalName],
         color: this.strategyColors[sellSignalName],
         marker: {
           symbol: this.strategyMarker[sellSignalName],
           radius: this.stratMarkerRadius[sellSignalName],
         },
         showInNavigator: false,
         yAxis: yAxisIndex,
         enableMouseTracking: true,
         data: lineData
           .filter((point) => point[3] === -1)
           .map((point) => ({
             x: point[0],
             y: point[1],
           })),
       };

       return [lineSeries, buySignalSeries, sellSignalSeries];
     });

     // 展平系列数据
     const series = seriesData.flat();

     // 初始化 Highcharts 图表
     this.chart = Highcharts.stockChart(this.$refs.chartContainer, {
       chart: {
         zoomType: "x",
         height: 600
       },
       title: {
        enabled: false
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
       yAxis: [
         {
           title: { text: this.strategyTitles['spx'] },
           labels: {
            align: "left", // 标签靠左
            style: { color: this.strategyColors['spx'] }
          },
         opposite: true, // Y 轴在右侧
         },
         {
          title: { text: !isSingle ? '' : this.strategyTitles['spx2'] },
          labels: {
            align: "right", // 标签靠右
          },
         opposite: false, // Y 轴在右侧
         enabled: !isSingle
        },
       ],
       legend: {
        enabled: true,
         align: 'center',
         verticalAlign: 'top',
         x: 0,
         y: 20
       },
       rangeSelector: {
        selected: 1,
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
              const colorSpan = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${point.series.color}; border-radius: 50%; margin-right: 5px;"></span>`;
              s += `${colorSpan}<span>${point.series.name}</span>: <b>${point.y.toFixed(2)}</b><br>`;
            });
            return s
          } else {
            // 处理独立点的 tooltip
            const name = this.series.name;
            const offset = name.includes('Sell') ? -15 : 15
            let s = `${name}<br>`;
            s += `<span>x: <b>${Highcharts.dateFormat('%m-%d-%Y', this.x)}</b></span><br><span>y: <b>${(this.y + offset).toFixed(2)}</b></span><br>`;
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
                lineColor: '#000000',  // 设置三角形的边框颜色
                fillColor: null,    // 根据需要设置填充颜色
                halo: {
                  size: 0  // 禁用点的 halo 效果
                },
                // 使用 SVG 的 shadow 属性来添加阴影
                shadow: {
                  color: 'rgba(0, 0, 0, 0.5)',  // 阴影颜色
                  offsetX: 2,  // X轴偏移
                  offsetY: 2,  // Y轴偏移
                  opacity: 0.5,  // 阴影透明度
                  width: 3  // 阴影宽度
                }
              }
            },
          },
          // events: {
          //   mouseOver: function () {
          //    console.log('this.chart?.series', this.chart?.series)
          //     // 暂时禁用 line 的鼠标跟踪，防止 tooltip 触发
          //     try {
          //       if(this.chart?.series) {
          //           this.chart.series.forEach(series => {
          //           if (series.initialType === 'line') {
          //             series.update({ enableMouseTracking: false });
          //           }
          //         });
          //       }
          //     } catch (error) {
          //       console.log('error', error)
          //     }
          //     // 当 hover 到 scatter（三角形）时，隐藏其他 series 的 tooltip
          //     this.chart.tooltip.hide();
          //   },
          //   mouseOut: function () {
          //    console.log('mouseOut', this.chart);
          //    try {
          //      // 当移出 scatter 时，重新启用 line 的鼠标跟踪和 tooltip
          //      if (this.chart?.series) {
          //        this.chart.series.forEach((series) => {
          //          if (series.initialType === 'line') {
          //            series.update({ enableMouseTracking: true });
          //          }
          //        });
          //      }
          //      this.chart.tooltip.refresh()
          //    } catch (error) {
          //      console.error('Error in mouseOut:', error);
          //    }
          //  }
          // }
        },
        line: {
          lineWidth: 2,  // 设置线的宽度
          states: {
            hover: {
              enabled: true,  // 线在 hover 时继续保持边框
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
       series,
     })
   },
   destroyChart() {
     if (this.chart) {
       this.chart.destroy();
       this.chart = null;
     }
   },
 },
 beforeDestroy() {
   this.destroyChart();
 },
};
</script>