<template>
  <div>
    <div id="line-chart-container"></div>
    <div id="bar-chart-container"></div>
  </div>
 </template>
 
 <script>
 import Highcharts from 'highcharts/highstock';
 import 'highcharts/indicators/indicators';
 import 'highcharts/indicators/bollinger-bands';
 import Exporting from 'highcharts/modules/exporting';
 import ExportData from 'highcharts/modules/export-data';
 import axios from "@/axios";
 export default {
  name: 'SeasonalityChart',
   props: {
     row: Object
   },
   mounted() {
     Exporting(Highcharts);
     ExportData(Highcharts);
     // 在需要的时候调用渲染函数
     this.renderChart();
   },
   watch: {
     row: {
         handler(newValue){
             if(!newValue.url) return
             this.renderChart();
         },
         deep: true
     }
   },
  methods: {
    async renderChart() {
      if (!this.row.url) return;
      const { url, chart_name, last_value } = this.row;
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
         redraw: function (event) {
             //don't repeatadly find scale extremes 
             clearTimeout(zoomTime);
 
             zoomTime = setTimeout(function() {
             
                 var e = event.target.axes[0].getExtremes();
                 window.favoriteConfig.chartScale = [e.min, e.max].join(",");
 
             }, 50);
         }
     }
 };
      try {
        const res = await axios.get(`/dev/st_data/get_data?index=${url || 'etf_spy'}`);
        console.log('res', res.data);
        const originalData = res.data;
        debugger
        if (originalData.length === 0) return;
 
        // 处理折线图数据
        const dayOfYearData = originalData.day_of_year.map((entry, index) => ({
          x: index + 1,  // 假设`day_of_year`数据是按顺序排列的
          y: entry.AvgReturn
        }));
        const currentDayOfYearData = originalData.current_day_of_year.map(entry => ({
          x: entry.day,
          y: entry.balance
        }));
 
        // 处理柱状图数据
        const monthData = originalData.month.map(entry => ({
          name: this.getMonthName(entry.symbol),
          y: entry.AvgReturn
        }));
 
        this.createLineChart(dayOfYearData, currentDayOfYearData, chart_name, last_value, basicChartOptions);
        this.createBarChart(monthData, basicChartOptions);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    },
    getMonthName(monthIndex) {
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return monthNames[monthIndex - 1];
    },
    createLineChart(dayOfYearData, currentDayOfYearData, chart_name, last_value, basicChartOptions) {
       // 计算数据的最大值和最小值
       const allData = dayOfYearData.concat(currentDayOfYearData.map(point => ({
         x: point.x,
         y: point.y
       })));
       const currentDay = currentDayOfYearData?.length || 0
       const yValues = allData.map(point => point.y);
       const minY = Math.min(...yValues);
       const maxY = Math.max(...yValues);
 
       Highcharts.chart('line-chart-container', {
       chart: {
         marginBottom: 0, // 调整图表底部边距
         spacingBottom: 0 // 调整图表与容器底部的间距
       },
         title: {
           text: chart_name || 'SPY Optix',
           style: { fontWeight: 'bold', fontFamily: 'Arial' }
         },
         subtitle: {
           text: last_value !== undefined && last_value !== null ? `Last Value: ${last_value}` : ''
         },
         yAxis: {
           title: {
           enabled: true,
             text: 'Cumulative Return (%)',
             style: {"color": "#000000", "fontWeight": "bold", 'fontSize': '10px'}
           },
           plotLines: [{
               color: '#dddddd',
               width: 1,
               value: 0
           }],
           tickInterval: (maxY - minY) / 10, // 动态设置 y 轴刻度间隔
           min: minY,
           max: maxY,
           endOnTick: false,
           startOnTick: false,
           labels: {
             enabled: true,
             formatter: function () {
               return Highcharts.numberFormat(this.value, 1); // 保留小数点后一位
             }
           },
           gridLineWidth: 0,
           tickPixelInterval: 37
         },
         xAxis: {
         type: 'linear',
         plotLines: [{
             color: 'darkgreen',
             width: 1,
             label: {
                 verticalAlign: 'bottom',
                 y: -10,
                 textAlign: 'right',
                 style: {
                     color: 'darkgreen',
                     fontWeight: 'bold'
                 }
             },
             value: currentDay
         }],
         title: {
             enabled: true,
             text: "Trading Day Of The Year",
             style: {"color": "#000000", "fontWeight": "bold"}
         },
         tickWidth: 0,
         tickInterval: 10
         },
         series: [{
           type: 'line',
           name: 'Average of All Years',
           animation: true,
           color: "#2f7ed8",
           dashStyle: "",
           data: dayOfYearData,
           dataGrouping: {
               enabled: false,
               enableMouseTracking: true
           },
           id: "seasonality_line_chart_avg",
           lineWidth: 2,
           showInLegend: true
         }, {
           type: 'line',
           name: 'Current Year Performance',
           animation: true,
           color: "#8E2323",
           data: currentDayOfYearData,
           dataGrouping: {
               enabled: false,
               enableMouseTracking: true
           },
           id: "seasonality_line_chart_current",
           lineWidth: 2,
           showInLegend: true,
           visible: false
         }],
         rangeSelector: {enabled: false},
         navigator: {enabled: false},
         legend: {
             enabled: true,
             padding: 10,
             itemMarginTop: 15,
             verticalAlign: 'top' 
         },
         navigation: {enabled: false},
         credits: {
             enabled: true,
             text: "SENTIMENTRADER",
             href: 'https://sentimentrader.com',
             position: {
                 align: 'right',
                 y:-65,
                 x:-20
             }
         },
         tooltip: { 
           shared: true, 
           crosshairs: true, 
           headerFormat: '<span style="font-size: 10px">Day {point.key}</span><br/>', 
           valueDecimals: 2 
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
         plotOptions: {
           series: {
             states: {
               hover: {
                 enabled: false
               },
               inactive: {
                 enabled: false
               }
             }
           }
         },
         chart: basicChartOptions
       });
    },
    createBarChart(monthData, basicChartOptions) {
      // 计算数据的最大值和最小值
      const yValues = monthData.map(entry => entry.y);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
 
      Highcharts.chart('bar-chart-container', {
        chart: {
          type: 'column',
        },
        title: false,
        yAxis: [{
          title: {
            enabled: true,
            text: "Average Return",
            style: {"color": "#000000", "fontWeight": "bold", 'fontSize': '10px'}
           },
           labels: {
               enabled: true,
               format: '{value:.1f}%'
           },
           plotLines: [{
               color: '#dddddd',
               width: 1,
               value: 0
           }],
           gridLineWidth: 0,
           tickPixelInterval: 37
         }],
         xAxis: [{
           categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
           title: {
             enabled: true,
             text: "Month Of The Year",
            style: {"color": "#000000", "fontWeight": "bold"}
          },
          gridLineColor: '#dddddd',
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          tickWidth: 0,
          lineWidth: 0
        }],
        series: [{
          data: monthData.map(entry => ({
            y: entry.y,
            color: entry.y >= 0 ? 'rgb(90, 190, 123)' : 'rgb(218, 138, 138)' // 根据值的正负设置颜色
          })),
          animation: true,
          dashStyle: "",
          dataGrouping: {
            enabled: false,
            enableMouseTracking: true
          },
          id: "seasonality_column_chart",
          lineWidth: 3,
          borderColor: false,
          color: "#5abe7b",
          negativeColor: '#da8a8a',
          name: 'Average Return',
          tooltip: {
              valueDecimals: 3,
              valueSuffix: '%'
          },
          showInLegend: true,
          type: "column"
        }],
        rangeSelector: {enabled: false},
        navigator: {enabled: false},
        legend: {enabled: false},
        navigation: {enabled: false},
        credits: {
            enabled: true,
            text: "SENTIMENTRADER",
            href: 'https://sentimentrader.com',
            position: {
                align: 'right',
                y:-65,
                x:-20
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
            colorByPoint: true // 允许每个点设置颜色
          }
        },
        chart: basicChartOptions
      });
    }
  },
  mounted() {
    this.renderChart();
  }
};
</script>

<style scoped>
#container {
 display: flex;
 flex-direction: column;
 align-items: center;
}

#line-chart-container,
#bar-chart-container {
 width: 100%;
}
#line-chart-container {
 height: 420px;
}
#bar-chart-container {
 height: 180px;
}

#bar-chart-container {
 margin-top: 20px;
}
</style>