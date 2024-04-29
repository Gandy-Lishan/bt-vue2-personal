<template>
  <div class="SNChart-container">
    <div :id="dynamicId" :style="containerStyle"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';


export default {
  name: 'SNChart',
  props: {
    dataList: Array,
    plotConfiguration: Object,
    dynamicId: String
  },
  data() {
    return {
      containerStyle: {
        width: '1100px',
        height: '400px',
        border: '1px solid #ddd',
        padding: '10px'
      }
    }
  },
  watch: {
    dataList: {
    handler(newVal, _) {
      this.plotData(this.dataList, this.plotConfiguration);
    },
    deep: true,
    immediate: true,
    },
  },
  mounted() {
    Exporting(Highcharts);
    ExportData(Highcharts);
    // 传入的数据格式

    // 在 mounted 钩子中调用绘图函数
    this.plotData(this.dataList, this.plotConfiguration);
    // Hide default Highcharts export button
    document.querySelectorAll('.highcharts-button').forEach(button => {
      button.style.display = 'none';
    });

    // Show the custom export button
    document.querySelectorAll('.highcharts-contextbutton').forEach(button => {
      button.style.display = 'block';
    });
  },
  methods: {
    calculateTickPositions(minValue, maxValue, numberOfTicks) {
  const range = maxValue - minValue;
  const unroundedTickSize = range / (numberOfTicks - 1); // 计算未圆整的刻度大小
  const x = Math.ceil(Math.log10(unroundedTickSize) - 1); // 取对数，计算刻度的数量级
  const pow10X = Math.pow(10, x); // 计算数量级对应的值

  const roundedTickSize = Math.ceil(unroundedTickSize / pow10X) * pow10X; // 圆整刻度大小

  const newMin = Math.floor(minValue / roundedTickSize) * roundedTickSize;
  const newMax = Math.ceil(maxValue / roundedTickSize) * roundedTickSize;

  const tickPositions = [];
  for (let i = newMin; i <= newMax + 0.0001; i += roundedTickSize) {
    tickPositions.push(Number(i.toFixed(2))); // 使用 toFixed(2) 以确保小数点后两位
  }

  return tickPositions;
}

,
    plotData(dataList, plotConfiguration) {
      console.log('绘制的图表数据', dataList)
      const tList = dataList.map(item => (item[1]))
      // const pList = dataList.map(item => (item[2]))
      const yAxis_1 = this.calculateTickPositions(Math.min(...tList), Math.max(...tList), 10)
      // const yAxis_2 = this.calculateTickPositions(Math.min(...pList), Math.max(...pList), 10)
      // 将上述 JavaScript 代码放在这里
      // 确保导入 Highcharts 库以使此代码正常工作
      // 传入的数据 dataList 和配置 plotConfiguration 作为参数
      const categories = [];
      const tData = [];
      const pData = [];
      const id = this.dynamicId
      const title = plotConfiguration.title
      const subtitle = plotConfiguration.subtitle
      const xAxisTitle = plotConfiguration.xAxisTitle
      const positiveColor = plotConfiguration.scaleSettings.positiveColor
      const negativeColor = plotConfiguration.scaleSettings.negativeColor
      // const tickPositions_1 = plotConfiguration.scaleSettings.yAxis_1.tickPositions
      const tickPositions_1 = yAxis_1
      const tickPositions_2 = plotConfiguration.scaleSettings.yAxis_2.tickPositions
      // const tickPositions_2 = yAxis_2
      const max_1 = plotConfiguration.scaleSettings.yAxis_1.max
      const min_1 = plotConfiguration.scaleSettings.yAxis_1.min
      const format_1 = plotConfiguration.scaleSettings.yAxis_1.format
      const format_2 = plotConfiguration.scaleSettings.yAxis_2.format
      const DayOrMonthTag = plotConfiguration.option != 1 ? 'Day' : 'Month'

      for (const dataPoint of dataList) {
          categories.push(dataPoint[0]);
          tData.push(dataPoint[1]);
          pData.push(dataPoint[2]);
      }
      // 如果 x 轴包含 0， 则提示
      // if (categories.includes(0) && DayOrMonthTag == 'Day') {
      //   this.popUpMsgBox('Day 0 represents the selected day, when it is a trading day')
      // }
      const H = Highcharts.chart(id, {
          title: {
              text: title,
              style: {
                  fontWeight: 'bold',
                  fontFamily: 'Arial'
              },
              margin: 20 // 调整这里的值
          },
          chart: {
            events: {
                load: function () {
                    // After the chart is loaded, add the watermark image
                    this.renderer.image('https://assets-global.website-files.com/650486dd4239644e595569c1/650486dd4239644e59556a01_ST%20Logo.png', 0, 0, 200, 35)
                        .attr({
                            zIndex: 5,
                            opacity: 0.5,
                        })
                        .add()
                        .align({
                            align: 'left',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: -35,
                        }, false, 'plotBox');
                }
            }
        },
          subtitle: {
              text: subtitle
          },
          credits: {
                enabled: false
            },
            exporting: {
                enabled: true, // 启用导出按钮
                buttons: {
                contextButton: {
                    menuItems: [
                    'printChart',
                    'downloadPNG',
                    'downloadJPEG',
                    // 'downloadSVG',
                    'downloadPDF'
                    ]
                }
                }
            },
          xAxis: {
              categories: categories,
              gridLineWidth: 1,
              gridLineDashStyle: 'Dash',
              tickPixelInterval: 1,
              title: {
                  text: xAxisTitle
              }
          },
          yAxis: [
              {
                  gridLineDashStyle: 'Dash',
                  labels: {
                      format: format_1,
                      style: {
                          color: Highcharts.getOptions().colors[1]
                      }
                  },
                  gridLineWidth: 0,
                  title: {
                      text: 'Average Return',
                      style: {
                          color: Highcharts.getOptions().colors[1]
                      }
                  },
                  tickPositions: tickPositions_1, // 设置左边的刻度值
                  max: max_1, // 设置最大值
                  min: min_1, // 设置最小值
              },
              {
                  tickPositions: tickPositions_2, // 设置右边的刻度值
                  gridLineDashStyle: 'Dash',
                  labels: {
                      format: format_2,
                      style: {
                          color: Highcharts.getOptions().colors[1]
                      }
                  },
                  title: {
                      text: '% of Time Positive',
                      style: {
                          color: Highcharts.getOptions().colors[1]
                      }
                  },
                  opposite: true
              }
          ],
          tooltip: {
              shared: true
          },
          legend: {
              layout: 'horizontal',
              verticalAlign: 'top',
              align: 'right',
              x: -60,
              y: 20,
              floating: true,
              backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
          },
          // credits: {
          //     enabled: true,
          //     href: 'https://sentimentrader.com/',
          //     style: {
          //         fontSize: '15px'
          //     },
          //     position: {
          //         align: 'right',
          //         x: -90,
          //         y: -70
          //     },
          //     text: 'sentimentrader'
          // }
      });

    //   if (plotConfiguration.customScale) {
    //       const tickPositions = [];
    //       for (let i = -5; i <= 5; i++) {
    //           tickPositions.push(Math.round(i * 0.1, 1));
    //       }
    //       console.log(tickPositions)
    //       H.yAxis[0].update({
    //           tickPositions: tickPositions
    //       });
    //   }

      if (plotConfiguration.formatter) {
          H.tooltip.options.formatter = function () {
            var barColor = this.points[0].color;
            if(this.points[0] && this.points[1]){
               return `<b>${DayOrMonthTag}: ` + this.x + '</b><br/>' +
                  'Avg Return (%): ' + this.points[0].y + '<br/>' +
                  'Percent Positive (%) ' + this.points[1].y;
            }
            if(this.points[0]) {
                return `<b>${DayOrMonthTag}: ` + this.x + '</b><br/>' +
                  'Percent Positive (%): ' + this.points[0].y + '<br/>'
            }
            if(this.points[1]) {
                     return `<b>${DayOrMonthTag}: ` + this.x + '</b><br/>' +
                  'PAvg Return (%): ' + this.points[1].y;
            }

          };
      }

    // if (plotConfiguration.formatter) {
    //     H.tooltip.options.formatter = function () {
    //         // 获取当前柱子的颜色
    //         var barColor = this.points[0].color;
            
    //         // 创建 CSS 样式字符串来设置边框和背景颜色
    //         var style = `background-color: ${barColor};`;
            
    //         // 创建 'Avg Return (%) ' 和 'Percent Positive (%) ' 的圆点样式
    //         var dotStyle = "width: 10px; height: 10px; background-color: " + barColor + "; display: inline-block; margin-right: 5px; border-radius: 50%;";
            
    //         return '<div style="' + style + '"><b>Day: ' + this.x + '</b><br/>' +
    //             '<span style="' + dotStyle + '"></span> Avg Return (%): ' + this.points[0].y.toFixed(2) + '<br/>' +
    //             '<span style="' + dotStyle + '"></span> Percent Positive (%) ' + this.points[1].y.toFixed(2) + '</div>';
    //     };
    // }

      const dataWithColor = tData.map(value => ({
          y: value,
          color: value >= 0 ? positiveColor : negativeColor
      }));

      // 添加水印图片
      // H.renderer.image(logoPNG, 0, 0, 200, 50) // 请替换 'watermark.png' 为你的水印图片的路径
      //   .attr({
      //     zIndex: 5, // 确保水印显示在图表的顶层
      //     opacity: 0.5, // 设置水印图片透明度
      //   })
      //   .add()
      //   .align({
      //     align: 'left',
      //     verticalAlign: 'bottom',
      //     x: 0, // 可以根据需要调整水印相对于左下角的位置
      //     y: -50, // 可以根据需要调整水印相对于左下角的位置
      //   }, false, 'plotBox');

      H.addSeries({
          data: dataWithColor,
          type: 'column',
          name: 'Avg Return (%)',
          yAxis: 0,
          marker: {
              enabled: true
          },
        //   dashStyle: 'shortdot',
          color: positiveColor,
          zones: [{
              value: 0,
              color: negativeColor
          }, {
              color: positiveColor
          }]
      });

      H.addSeries({
          data: pData,
          type: 'line',
          name: 'Percent Positive (%)',
          yAxis: 1,
          color: '#01017D',
          marker: {
              enabled: true,
              radius: 5,
              symbol: 'diamond'
          }
      });
      return H;
    }
  }
};
</script>
