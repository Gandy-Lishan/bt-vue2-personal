<template>
  <div class="SNChart-container">
    <div id="container"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import data from "./mock";

export default {
  mounted() {
    Exporting(Highcharts);
    ExportData(Highcharts);
    // 传入的数据格式
    const mergedList = data.map(item => [item[2], item[1], item[3] * 100])
    console.log(mergedList)

    // 绘制图表的配置
    const plotConfiguration = {
      title: 'Seasonality in the S&P 500',
      subtitle: 'Month of October',
      xAxisTitle: 'Day Of The Month',
      customScale: true, // 如果需要自定义刻度
      formatter: true // 如果需要自定义数据提示
    };

    // 在 mounted 钩子中调用绘图函数
    this.plotData(mergedList, plotConfiguration);
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
    plotData(mergedList, plotConfiguration) {
      // 将上述 JavaScript 代码放在这里
      // 确保导入 Highcharts 库以使此代码正常工作
      // 传入的数据 mergedList 和配置 plotConfiguration 作为参数
      const categories = [];
      const tData = [];
      const pData = [];

      for (const dataPoint of mergedList) {
          categories.push(dataPoint[0]);
          tData.push(dataPoint[1]);
          pData.push(dataPoint[2]);
      }

      const H = Highcharts.chart('container', {
          title: {
              text: plotConfiguration.title,
              style: {
                  fontWeight: 'bold',
                  fontFamily: 'Arial'
              }
          },
          subtitle: {
              text: plotConfiguration.subtitle
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
                    'downloadSVG',
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
                  text: plotConfiguration.xAxisTitle
              }
          },
          yAxis: [
              {
                  gridLineDashStyle: 'Dash',
                  labels: {
                      format: '{value}',
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
                  tickPositions: [-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5], // 设置左边的刻度值
                  max: 0.5, // 设置最大值
                  min: -0.5, // 设置最小值
              },
              {
                  tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // 设置右边的刻度值
                  gridLineDashStyle: 'Dash',
                  labels: {
                      format: '{value} %',
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
          credits: {
              enabled: true,
              href: 'https://sentimentrader.com/',
              style: {
                  fontSize: '15px'
              },
              position: {
                  align: 'right',
                  x: -90,
                  y: -70
              },
              text: 'sentimentrader'
          }
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

              return '<b>Day: ' + this.x + '</b><br/>' +
                  'Avg Return (%): ' + this.points[0].y.toFixed(2) + '<br/>' +
                  'Percent Positive (%) ' + this.points[1].y.toFixed(2);
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


      const positiveColor = '#00B050';
      const negativeColor = '#C0504D';

      const dataWithColor = tData.map(value => ({
          y: value,
          color: value >= 0 ? positiveColor : negativeColor
      }));

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

<style>
#container {
    width: 1100px;
    height: 400px;
    border: 1px solid #ddd;
    padding: 10px;
}
</style>
