<template>
  <div :id="id" style="height: 100%"></div>
 </template>
 
 <script>
 import Highcharts from 'highcharts/highstock';
 import 'highcharts/indicators/indicators';
 import 'highcharts/indicators/bollinger-bands';
 import Exporting from 'highcharts/modules/exporting';
 import ExportData from 'highcharts/modules/export-data';
 import axios from "@/axios";
import { isJson } from '@/utils';
 
 export default {
  name: 'Chart',
  props: {
    row: Object,
    id: String
  },
  mounted() {
    Exporting(Highcharts);
    ExportData(Highcharts);
    this.renderChart();
  },
  watch: {
    row: {
      handler(newValue){
        if(!newValue.url) return;
        this.renderChart();
      },
      deep: true
    }
  },
  methods: {
    async renderChart() {
      if(!this.row.url) return;
      const {url, pess, opt, chart_name} = this.row;
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
            this.renderer.image('https://dnpgic06wp5lx.cloudfront.net/sentimentrader.png', 0, 450, 120,33)
                .attr({
                    'opacity': 0.25
                })
                .add();
 
            const chart = this;
            const button = document.createElement('button');
            button.innerHTML = 'Backtest This Indicator';
            button.style.position = 'absolute';
            button.style.top = `${chart.chartHeight/7}px`;
            button.style.left = (chart.chartWidth / 2 - 82) + 'px';
            button.style.fontSize = '12px';
            button.style.fontWeight = 600;
            button.style.color = '#1f77b4';
            button.style.border = 'unset';
            button.style.width = '200px';
            button.style.background = 'unset';
 
            button.onclick = function () {
              const indexParam = url || 'etf_spy';
              window.open(`/backtester/sr/setup?index=${indexParam}&indicator=${url}`, '_blank')
            };
 
            chart.container.parentNode.style.position = 'relative';
            chart.container.parentNode.appendChild(button);
          },
        }
      };
 
      const createYAxisConfig = (series, row) => {
        debugger
        const {type, sub_type} = row
        // commodity_complete_list
        // 如果 sub_type = 'cot' 并且 url 以 cot_ 开头, 那么极值是曲线
        return series.map((serie, i) => {
          let minYAxis, maxYAxis;
          
          // Calculate min and max for the y-axis only for the bottom axis
          if (i === series.length - 1) {
            const data = serie.data.map(d => d[1]);
            const minDataValue = Math.min(...data);
            const maxDataValue = Math.max(...data);

            // Determine the min and max values for the bottom y-axis
            minYAxis = Math.min(minDataValue, pess || minDataValue, opt || minDataValue);
            maxYAxis = Math.max(maxDataValue, opt || maxDataValue, pess || maxDataValue);

            console.log(`minYAxis: ${minYAxis}, maxYAxis: ${maxYAxis}`);
          }

          return {
            title: {
              text: serie?.name || 'SPY Optix',
              style: {
                color: i === 0 ? '#434348' : (i === 2 ? 'rgb(142, 35, 35)' : '#2f7ed8'),
                fontWeight: 'bold',
                fontSize: '10px'
              },
              x: i === 2 ? 10 : 0
            },
            top: `${i===0?0:35}%`,
            height: `${i===0?35:60}%`,
            offset: 0,
            lineWidth: 0, // Remove the right-side y-axis line
            gridLineWidth: 1,
            opposite: true,
            labels: { enabled: (i === 0 || i === 1), style: {fontSize: '10px'} },
            min:  (i === series.length - 1) ? minYAxis : null, // Set the calculated min value for the bottom axis
            max:  (i === series.length - 1) ? maxYAxis : null, // Set the calculated max value for the bottom axis
            plotLines: i === series.length - 1 ? [
              {
                value: pess || null,
                color: 'rgba(0, 128, 0, 1)',
                dashStyle: 'shortdash',
                width: 2,
                label: { text: `${pess || ''}`, style: {fontSize: '10px', color: 'rgba(0, 128, 0, 1)', fontWeight: 'bold'} },
                zIndex: 5
              },
              {
                value: opt || null,
                color: 'rgba(255, 0, 0, 1)',
                dashStyle: 'shortdash',
                width: 2,
                label: { text: `${opt || ''}`, style: {fontSize: '10px', color: 'rgba(255, 0, 0, 1)', fontWeight: 'bold'} },
                zIndex: 5
              }
            ] : [],
          };
        });
      };
 
      const createChart = (series, allKeysName, basicChartOptions, row) => {
        console.log('series: ', series);
        const yAxisConfig = createYAxisConfig(series, row);
        const allData = series.flatMap(s => s.data);
        const minX = Math.min(...allData.map(d => d[0]))
        const { url, type } = row
        const selector = url !== 'risk_levels' ? 6 : 3
        // const maxX = Math.max(...allData.map(d => d[0]));
        Highcharts.stockChart(this.id, {
          rangeSelector: {
            inputEnabled: true,
            inputDateFormat: '%Y/%m/%d',
            inputEditDateFormat: '%Y/%m%d',
            buttons: [
            {
              type: 'month',
              count: 3,
              text: '3m'
            }, {
              type: 'month',
              count: 6,
              text: '6m'
            }, {
              type: 'ytd',
              text: 'YTD'
            }, {
              type: 'year',
              count: 1,
              text: '1y'
            }, {
              type: 'year',
              count: 3,
              text: '3y'
            }, {
              type: 'year',
              count: 5,
              text: '5y'
            }, {
              type: 'year',
              count: 10,
              text: '10y'
            }, {
              type: 'year',
              count: 15,
              text: '15y'
            }, {
              type: 'year',
              count: 20,
              text: '20y'
            }, {
              type: 'all',
              text: 'All'
            }
          ],
          selected: selector // Sets the default selected button (4 corresponds to '1y')
          },
          title: {
            text: chart_name || 'SPY Optix',
            style: { fontWeight: 'bold', fontFamily: 'Arial' }
          },
          // subtitle: {
          //   text: last_value !== undefined && last_value !== null ? `Last Value: ${last_value}` : ''
          // },
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
          yAxis: yAxisConfig,
          xAxis: {
            type: 'datetime',
            crosshair: { label: { enabled: false } },
            ordinal: false,
            min: minX,
            labels: {format: '{value:%Y}'}
          },
          navigator: {
            series: {
                color: '#2f7ed8'  // Set the color to match the bottom series
            },
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
            fontSize: '10px' // 字体大小
          },
          },
          credits: {
            enabled: true,
            text: "Source: Sentiment",
            href: 'https://sentimentrader.com',
            position: {
              align: 'right',
              y: -120,
              x: -50
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
               s += `${colorSpan}<span>${point.series.name}</span>: <b>${Highcharts.numberFormat(point.y,2)}</b><br>`;
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
          series: series.map((s, i) => ({
            ...s,
            yAxis: i,
            type: i === 0 || type !== 'mff' ? 'line' : 'column',
            color: i === 0 ? '#434348' : (i === 2 ? 'rgb(142, 35, 35)' : '#2f7ed8'),
            threshold: type === 'mff' ? 0 : null,
            pointWidth: type === 'mff' ? 2 : null
          })),
          chart: basicChartOptions
        });
      };
 
      try {
      const {last_value, last_change_type} = this.row;
      console.log('this.row', this.row)
        const res = await axios.get(`/dev/st_data/get_data?index=${url || 'etf_spy'}`);
        let originalData = res.data;
        debugger
        originalData = isJson(originalData) ? JSON.parse(originalData) : [];
        if (originalData.length === 0) return;
 
        const allKeysName = Object.keys(originalData[0]).filter(keyName => keyName !== 'date');
        allKeysName.sort((a, b) => {
          // 检查元素中是否含有下划线
          const aHasUnderscore = a.includes('_');
          const bHasUnderscore = b.includes('_');

          if (!aHasUnderscore && bHasUnderscore) {
              // 如果a没有下划线而b有，那么a应该排在b前面
              return -1;
          } else if (aHasUnderscore && !bHasUnderscore) {
              // 如果a有下划线而b没有，那么b应该排在a前面
              return 1;
          } else {
              // 如果两者都有或都没有下划线，则按字母顺序排序
              return a.localeCompare(b);
          }
        });
        const data = allKeysName.reduce((acc, keyName) => {
          acc[keyName] = originalData.map(entry => [new Date(entry['date']).getTime(), entry[keyName]]);
          return acc;
        }, {});
 
        const series = Object.keys(data).map(key => {
          let name = 'SPY Optix'
          let last_val = null
          if(last_value !== null && last_value !== undefined) {
              if(last_change_type === 'percent') last_val = parseFloat((parseFloat(last_value)/100)).toFixed(2)
              else last_val = last_value.toFixed(2)
          }
          else {last_val = data[key].slice(-1)[0][1].toFixed(2)}
          if(key.includes('_') && url !== 'smart_dumb' && url !== 'risk_levels') name = chart_name
          else if(key.includes('_') && key === 'model_smart_money' && url === 'smart_dumb') name = 'Smart Money'
          else if(key.includes('_') && key === 'model_dumb_money' && url === 'smart_dumb') name = 'Dumb Money'
          else if(key.includes('_') && key === 'model_risk_stocks_short' && url === 'risk_levels') name = 'Short Term Risk Levels'
          else if(key.includes('_') && key === 'model_risk_stocks_medium' && url === 'risk_levels') name = 'Intermediate Term Risk Levels'
          else name = key
          return {
            name: `${name}${key.includes('_') && last_val !== null && last_val !== undefined ? ` (Last = ${last_val})` : ''}`,
            data: data[key]
          }
        })
        createChart(series, allKeysName, basicChartOptions, this.row);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }
  }
 }
 </script>
 
 <style lang="less" scoped>
 .highcharts-container {
  width: 100% !important;
  height: 100% !important;
 }
 </style>