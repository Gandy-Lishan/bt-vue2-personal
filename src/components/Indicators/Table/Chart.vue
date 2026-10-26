<template>
  <div :id="id" style="height: 800px; background-color: #fff;"></div>
 </template>
 
 <script>
 import Highcharts from 'highcharts/highstock';
 import 'highcharts/indicators/indicators';
 import 'highcharts/indicators/bollinger-bands';
 import Exporting from 'highcharts/modules/exporting';
 import ExportData from 'highcharts/modules/export-data';
 import axios from "@/axios";
 
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
      const _this = this
      let {url, pess, opt, chart_name, market_symbol, type, sub_type, groups, last_value, last_change_type} = this.row
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
        spacingRight: 50,
 
        events: {
          load: function (event) {
            let _url = url
            var e = event.target.axes[0].getExtremes();
            this.defaultChartScale = [e.min, e.max];
            this.renderer.image('https://dnpgic06wp5lx.cloudfront.net/sentimentrader.png', 0, 600, 120,33)
                .attr({
                    'opacity': 0.25
                })
                .add();
            // if(url === 'smart_dumb' || url === 'risk_levels') return
            const chart = this;
            const button = document.createElement('button');
            button.id = 'button'
            button.innerHTML = '<i class="el-icon-s-data" style="margin-right: 5px;"></i>View Large Chart Or Backtest This Indicator';
            button.style.position = 'absolute';
            button.style.top = `${chart.chartHeight/10}px`;
            //button.style.left = (chart.chartWidth / 2 - 82) + 'px';
            button.style.left = '50%'
            button.style.transform = 'translateX(-50%)';
            button.style.fontSize = '16px';
            button.style.fontWeight = 600;
            button.style.color = '#1f77b4';
            button.style.border = 'unset';
            // button.style.width = '220px';
            button.style.width = '400px';
            button.style.background = 'unset';
            button.style.whiteSpace = 'nowrap';
            // if(type.includes('trend_reltrend')) button.style.display = 'none'
            if(url === 'smart_dumb') _url = 'model_smart_money'
            else if(url === 'risk_levels') _url = 'model_risk_stocks_short'
            else if(type.includes('trend_reltrend')) {
              _url = url.replace(/(.*?)_trend_reltrend/, "$1_trend");
            }
            button.onclick = function () {
              let _market_symbol = market_symbol
              debugger
              if(sub_type === 'crp_trend_reltrend' || sub_type === 'crypto') {
                try {
                  const [startStr, endStr] = _market_symbol.split('_')
                  _market_symbol = `${startStr.toLocaleLowerCase()}_${endStr}`
                } catch (error) {
                  console.log('error', error)
                }
              }
              window.open(`/backtester/sr/setup?index=${_market_symbol || 'Unknown'}&indicator=${_url}`, '_blank')
            };

            chart.container.parentNode.style.position = 'relative';
            if(groups !== 'volatility_relvolatility') chart.container.parentNode.appendChild(button);
          },
        }
      };

      const createYAxisConfig = (series, row) => {
        const { sub_type, source_list, url } = row;
        const isCot = sub_type === 'cot' && url.startsWith('cot_') && source_list === 'commodity_complete_list';
        let sharedYAxisIndex = -1;
        let minYAxis, maxYAxis;

        return series.map((serie, i) => {
          const isOptPess = serie?.name === 'opt' || serie?.name === 'pess';

          if (i === 1 || i === 2) {
            const data = series.slice(1).flatMap(s => s.data.map(d => d[1]));
            const minDataValue = Math.min(...data);
            const maxDataValue = Math.max(...data);
            minYAxis = Math.min(minDataValue, pess || minDataValue, opt || minDataValue);
            maxYAxis = Math.max(maxDataValue, opt || maxDataValue, pess || maxDataValue);
          }
          let titleColor = i === 0 ? '#434348' : (i === 2 ? 'rgb(142, 35, 35)' : '#2f7ed8')
          if(sub_type && typeof sub_type === 'string' && sub_type.includes('trend_reltrend')) {
            if(serie?.name.includes('Relative')) {titleColor = 'rgb(142, 35, 35)'}
            else if(!serie?.name.includes('Relative') && serie?.name.includes('Trend')) {titleColor = '#2f7ed8'}
          }
          return {
            id: i === 0 ? 'top-axis' : 'bottom-axis',
            title: {
              text: !isOptPess ? serie?.name || 'SPY Optix' : '',
              style: {
                color: titleColor,
                fontWeight: 'bold',
                fontSize: '10px'
              },
              x: i === 2 ? 45 : 30
            },
            top: i === 0 ? '0%' : '40%',
            height: i === 0 ? '35%' : '60%',
            offset: 0,
            lineWidth: 0,
            gridLineWidth: 1,
            opposite: true,
            labels: { enabled: i === 0 || i === 1, x: 25, style: { fontSize: '10px' } },
            min: (i === 1 || i === 2) ? minYAxis : null,
            max: (i === 1 || i === 2) ? maxYAxis : null,
            plotLines: i >= 1 && i === series.length - 1 && !isCot ? [
              {
                value: pess || null,
                color: 'rgba(0, 128, 0, 1)',
                dashStyle: 'shortdash',
                width: 1,
                label: { text: `${pess || ''}`, style: { fontSize: '10px', color: 'rgba(0, 128, 0, 1)' } },
                zIndex: 5
              },
              {
                value: opt || null,
                color: 'rgba(255, 0, 0, 1)',
                dashStyle: 'shortdash',
                width: 1,
                label: { text: `${opt || ''}`, style: { fontSize: '10px', color: 'rgba(255, 0, 0, 1)' } },
                zIndex: 5
              }
            ] : [],
          };
        }).map((axisConfig, i) => {
          if (axisConfig.id === 'bottom-axis') {
            if (sharedYAxisIndex === -1) {
              sharedYAxisIndex = i;
            } else {
              axisConfig.linkedTo = sharedYAxisIndex;
            }
          }

          axisConfig.minPadding = 0.1;
          axisConfig.maxPadding = 0.1;

          return axisConfig;
        });
      };
      const createChart = (series, allKeysName, basicChartOptions, row) => {
        console.log('series: ', series);
        console.log('Highcharts', Highcharts)
        const yAxisConfig = createYAxisConfig(series, row);
        const allData = series.flatMap(s => s.data);
        const xData = [...allData.map(d => d[0])]
        console.log('xData', xData)
        const minX = Math.min(xData)
        const { url, type, market_symbol, sub_type } = row
        let selector = 4
        if(url === 'risk_levels') {
          selector = 3
        }
        if(url === 'smart_dumb') {
          selector = 4
        }
        if(typeof type === 'string' && type.includes('trend_reltrend')) selector = 3
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
              logScaleButton: {
                text: 'Price Log Scale',
                title: 'Toggle logarithmic scale for the price chart',
                align: 'right',
                verticalAlign: 'top',
                y: 100,
                theme: {
                  fill: '#eef4fb',
                  stroke: '#b8c7d9',
                  states: {
                    hover: {
                      fill: '#dce9f7'
                    },
                    select: {
                      fill: '#b9d5f2'
                    }
                  }
                },
                onclick: function (event) {
                  const priceAxis = this.get('top-axis');
                  if (!priceAxis) return;

                  const useLogScale = priceAxis.options.type !== 'logarithmic';
                  const hasNonPositiveValue = priceAxis.series.some(currentSeries =>
                    currentSeries.options.data.some(point => {
                      const value = Array.isArray(point) ? point[1] : point && point.y;
                      const numericValue = Number(value);
                      return value !== null && value !== '' && Number.isFinite(numericValue) && numericValue <= 0;
                    })
                  );

                  if (useLogScale && hasNonPositiveValue) {
                    _this.popUpMsgBox('Price Log scale is unavailable because the price chart contains zero or negative values.');
                    return;
                  }

                  priceAxis.update({
                    type: useLogScale ? 'logarithmic' : 'linear',
                    min: null,
                    max: null
                  }, false);
                  priceAxis.setExtremes(null, null, false);
                  this.redraw();

                  const logScaleButton = event && event.currentTarget
                    ? this.exportSVGElements.find(element => element.element === event.currentTarget)
                    : null;
                  if (logScaleButton) {
                    logScaleButton.setState(useLogScale ? 2 : 0);
                    logScaleButton.attr({
                      title: useLogScale ? 'Switch the price chart to linear scale' : 'Switch the price chart to logarithmic scale'
                    });
                  }
                }
              },
              contextButton: {
                menuItems: [
                  'printChart',
                  'downloadPNG',
                  'downloadJPEG',
                  'downloadPDF',
                  {
                    text: 'Export CSV',
                    onclick: function () {
                      // 这里调用你指定的函数，执行导出 CSV 的逻辑
                      _this.$emit('downloadCSV')
                    }
                  }
                ]
              }
            }
          },
          yAxis: yAxisConfig,
          xAxis: {
            type: 'category',
            tickPixelInterval: 150, 
            crosshair: { label: { enabled: false } },
            ordinal: false,
            min: minX,
            labels: {format: '{value:%Y}'},
            // labels: {
            //     formatter: function () {
            //         return Highcharts.dateFormat('%Y-%m-%d', this.value);  // 手动格式化日期
            //     }
            // },
            tickPositions: null,
            uniqueNames: false,  // 确保只使用你传入的时间点
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
            y: 40,
            itemStyle: {
              fontSize: '10px' // 字体大小
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
               s += `${colorSpan}<span>${point.series.name}</span>: <b>${point.y.toFixed(2)}</b><br>`;
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
              showInNavigator: true,
              connectNulls: false, // 禁用连接 null 数据点
              // dataGrouping: {
              //  enabled: false  // 确保数据分组被禁用
              // },
              pointStart: undefined,  // 确保不会有自动起点
              pointInterval: undefined,  // 确保不会有自动间隔
              events: {
                legendItemClick: function (event) {
                  // 只有下面这三种情况才会在 legend 显示隐藏时做处理
                  if(['smart_dumb', 'risk_levels'].includes(url) || type.includes('trend_reltrend') || groups === 'volatility_relvolatility') {
                    debugger
                    const allLegendNames = this.chart.legend.allItems.map(item => item.name)
                    const convertString = (inputString) => {
                        // 去除多余的空格
                        inputString = inputString.trim().replace(/\s+/g, ' ');
                        // 使用正则表达式提取主要部分
                        const regex = /(\w+)\s+(.*?)\s+\(Last\s+=\s+[\d.]+\)/;
                        const match = inputString.match(regex);
                        if (match) {
                            // 获取第一部分
                            const firstPart = match[1];
                            
                            // 获取第二部分并处理
                            const secondPart = match[2].toLowerCase().trim(); // 转为小写并去掉空格
                            
                            // 根据第二部分是否包含 "trend" 确定返回格式
                            if (secondPart.includes('relative')) {
                                return `${firstPart}_reltrend`;
                            } else if(((secondPart.includes('relative') && secondPart.includes('trend')) || ((sub_type === 'crp_trend_reltrend' || sub_type === 'crypto') && secondPart === 'trend score'))){
                                return `${firstPart}_trend`;
                            } else if(`${match[1]} ${match[2]}` === 'Smart Money') {
                              return `model_smart_money`
                            } else if(`${match[1]} ${match[2]}` === 'Dumb Money') {
                              return `model_dumb_money`
                            } else if(`${match[1]} ${match[2]}` === 'Short Term Risk Levels') {
                              return `model_risk_stocks_short`
                            } else if(`${match[1]} ${match[2]}` === 'Intermediate Term Risk Levels') {
                              return `model_risk_stocks_medium`
                            }
                        }
                        return null; // 如果没有匹配，返回 null
                    }
                    setTimeout(() => {
                      let _market_symbol = market_symbol || 'SPX'
                      debugger
                      const allLegend = this.chart.series.map(item => ({name: item.name, visible: item.visible}))
                      console.log('chart', allLegend)
                      const useLegend = allLegend.filter(item => (item.name !== _market_symbol  && item.visible === true && allLegendNames.includes(item.name)))
                      const useLen = useLegend.length
                      const button = this.chart.container.parentNode.querySelector('#button');
                      console.log('button', button)
                      if(useLen === 1) {
                        button.style.display = 'block'
                        const _url = convertString(useLegend[0]?.name)
                        button.onclick = function () {
                          if(sub_type === 'crp_trend_reltrend' || sub_type === 'crypto') {
                            try {
                              const [startStr, endStr] = _market_symbol.split('_')
                              _market_symbol = `${startStr.toLocaleLowerCase()}_${endStr}`
                            } catch (error) {
                              console.log('error', error)
                            }
                          }
                          window.open(`/backtester/sr/setup?index=${_market_symbol}&indicator=${_url}`, '_blank');
                        }
                        return true; // 允许默认图例切换操作
                      }else if(useLegend !== 1) {
                        // 默认取第一个
                        debugger
                        const useLegend = allLegend.filter(item => (item.name !== _market_symbol && allLegendNames.includes(item.name)))
                        const _url = convertString(useLegend[0]?.name)
                        button.onclick = function () {
                          if(sub_type === 'crp_trend_reltrend' || sub_type === 'crypto') {
                            try {
                              const [startStr, endStr] =  _market_symbol.split('_')
                              _market_symbol = `${startStr.toLocaleLowerCase()}_${endStr}`
                            } catch (error) {
                              console.log('error', error)
                            }
                          }
                          window.open(`/backtester/sr/setup?index=${_market_symbol}&indicator=${_url}`, '_blank');
                        }
                        return true; // 允许默认图例切换操作
                      }
                    }, 0)
                  }else {return true}
                }
              }
            }
          },
          series: series.map((s, i) => {
          const _type = i === 0 || type !== 'mff' ? 'line' : 'column'
          let color = i === 0 ? '#434348' : (i === 2 ? 'rgb(142, 35, 35)' : '#2f7ed8')
          console.log('s.name.', s.name)
          if(type.includes('trend_reltrend') && s.name.includes('Relative')) {
            color = 'rgb(142, 35, 35)'
          }else if(type.includes('trend_reltrend') && !s.name.includes('Relative') && s.name.includes('Trend Score')) {
            color = '#2f7ed8'
          }
          const isOptPess = s.name === 'opt' || s.name === 'pess'
          if(s.name === 'opt') color = 'rgba(255, 0, 0, 1)'
          if(s.name === 'pess') color = 'rgba(0, 128, 0, 1)'
          return{
            ...s,
            keys: ['x', 'y'],  // 明确指定数据的格式
            yAxis: i,
            type: _type,
            color,
            threshold: type === 'mff' ? 0 : null,
            pointWidth: type === 'mff' ? 2 : null,
            dashStyle: !isOptPess ? 'Solid' : 'Dash',
            showInNavigator: !isOptPess ? true : false,
            enableMouseTracking: !isOptPess ? true : false,
            showInLegend: !isOptPess ? true : false,
            lineWidth: !isOptPess ? 2 : 1,
            dataGrouping: {
                enabled: true
            }
          }}),
          chart: basicChartOptions
        })
      };
 
      try {
      // let {last_value, last_change_type, market_symbol, type, sub_type, groups} = this.row;
      console.log('market_symbol', market_symbol)
      let isRiskMeasure = false
      let zoonsData = [];
      console.log('this.row', this.row)
      let originalData
      if(this.row.source_list === 'country_breadth_overview' && !this.row.clickSource) url = 'breadth_all_country_above_10ma'
      try {
        const res = await axios.get(`https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/get_data?index=${url || 'etf_spy'}`);
        originalData = res.data
        debugger
        if(typeof originalData === 'string') {
          originalData = originalData.replace(/NaN/g, 'null')
          originalData = JSON.parse(originalData)
        }
      } catch (error) {
        if(error.response.status === 404) {
          _this.popUpMsgBox('Data for this indicator is unavailable.')
          createChart([], [], {}, {});
          return
        }
      }
        originalData = originalData.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log('originalData', originalData.slice(-3))
        try {
          if(typeof originalData === 'string') {
            originalData = originalData.replace(/NaN/g, 'null')
            originalData = JSON.parse(originalData)
          }
        } catch (error) {
          console.log('error', error)
        }
        if (originalData.length === 0) return;
        // if(groups === 'volatility_relvolatility') {
        //   originalData = originalData.map(item => ({[market_symbol]: item.Close, date: item.date, volatility: item.volatility, volatility_60d: item.volatility_60d}))
        // }
        console.log('originalData', originalData.slice(-3))
        this.$emit('passIndicatorData', originalData, url)
        let allKeysName = Object.keys(originalData[0]).filter(keyName => keyName !== 'date' && keyName !== 'dumb');
        allKeysName.sort((a, b) => {
          if(market_symbol && typeof market_symbol === 'string') {
            if(a.toLocaleLowerCase() === market_symbol.toLocaleLowerCase() && b.toLocaleLowerCase() !== market_symbol.toLocaleLowerCase()) return -1
            if(a.toLocaleLowerCase() !== market_symbol.toLocaleLowerCase() && b.toLocaleLowerCase() === market_symbol.toLocaleLowerCase()) return 1
          }
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
        console.log('allKeysName', allKeysName)
        if(allKeysName.includes('opt') && allKeysName.includes('pess') && !market_symbol) {
          allKeysName = allKeysName.filter(keyName => keyName !== 'opt' && keyName !== 'pess')
          allKeysName = allKeysName.concat(['opt', 'pess'])
        }
        if(allKeysName.includes('Color') && url === 'risk_measure') {
          isRiskMeasure = true
          allKeysName = allKeysName.filter(keyName => keyName !== 'Color')
          originalData.forEach(item => {
            const pointColor = item['Color'] ? '#ff0000' : '#000000';
            if (zoonsData.length === 0 || zoonsData[zoonsData.length - 1].color !== pointColor){
              const datatime = new Date(item['date']);
              // 使用 UTC 时间来确保一致性
              const utcTimestamp = Date.UTC(
                  datatime.getUTCFullYear(),
                  datatime.getUTCMonth(),
                  datatime.getUTCDate(),
                  datatime.getUTCHours(),
                  datatime.getUTCMinutes(),
                  datatime.getUTCSeconds()
              );

              zoonsData.push({
                  value: utcTimestamp,  // 使用 UTC 时间戳
                  color: pointColor     // 对应的颜色
              })
            }  // 红色为 false，黑色为 true
            
          })
        }
        if(groups === 'volatility_relvolatility') allKeysName.filter(key => !['High', 'Low', 'Open', 'Volume', 'Close'].includes(key))
        const data = allKeysName.reduce((acc, keyName) => {
          acc[keyName] = originalData.map(entry => {
            const datatime = new Date(entry['date'])
            // 使用 UTC 时间来确保一致性
            const utcTimestamp = Date.UTC(
                datatime.getUTCFullYear(),
                datatime.getUTCMonth(),
                datatime.getUTCDate(),
                datatime.getUTCHours(),
                datatime.getUTCMinutes(),
                datatime.getUTCSeconds()
            );
            return [utcTimestamp, entry[keyName]]
          });
          return acc;
        }, {});
        console.log('data', data)
        let series = Object.keys(data).map(key => {
          debugger
          let name = 'SPY Optix'
          if (!isNaN(last_value) && groups !== 'volatility_relvolatility' && groups !== 'trend_reltrend') {
               // 处理 last_value 的值类型
               if (typeof last_value === 'string' && last_value.includes('%'))  last_value = parseFloat(last_value.replace('%', '')) / 100;
              if (typeof last_value === 'string') {
                  // 尝试将字符串转换为数字
                  last_value = last_value.replace(/[^\d.-]/g, '');
                  // 尝试将字符串转换为数字
                  last_value = parseFloat(last_value);
              }
              
              if (typeof last_value === 'number' && !isNaN(last_value)) {
                  // 如果 last_value 是数字类型
                    last_value = last_value.toFixed(2);  // 处理一般的数值
              } else {
                  console.error('last_value 不是一个有效的数字:', last_value, typeof last_value);
                  last_value = null;  // 或者根据需求设置一个默认值或错误标识
              }
          }
          else {last_value = data[key].slice(-1)[0][1].toFixed(2)}
          console.log('last_value_chart', last_value)
          if((key.includes('_reltrend') || key.includes('_trend')) && type.includes('trend_reltrend')) {
            name = key.replace('_reltrend', ' Relative Trend Score')
            name = name.replace('_trend', '  Trend Score')
          }else if(key.includes('_') && url !== 'smart_dumb' && url !== 'risk_levels' && sub_type !== 'crp_trend_reltrend' && groups !== 'volatility_relvolatility') name = chart_name
          else if(groups === 'volatility_relvolatility' && (key === `${market_symbol}_volatility` || key === `${market_symbol}_volatility_60d` || key === `${market_symbol.toLowerCase()}_volatility` || key === `${market_symbol.toLowerCase()}_volatility_60d`)){
            if(key === `${market_symbol}_volatility` || key === `${market_symbol.toLowerCase()}_volatility`) name = 'Historical Volatility (20-Day)'
            else if(key === `${market_symbol}_volatility_60d` || key === `${market_symbol.toLowerCase()}_volatility_60d`) name = 'Historical Volatility (60-Day)'
          }else if(key.includes('_') && key === 'model_smart_money' && url === 'smart_dumb') name = 'Smart Money'
          else if(key.includes('_') && key === 'model_dumb_money' && url === 'smart_dumb') name = 'Dumb Money'
          else if(key.includes('_') && key === 'model_risk_stocks_short' && url === 'risk_levels') name = 'Short Term Risk Levels'
          else if(key.includes('_') && key === 'model_risk_stocks_medium' && url === 'risk_levels') name = 'Intermediate Term Risk Levels'
          else name = key
          return {
            name: `${name}${key.includes('_') && ((sub_type === 'crp_trend_reltrend' || sub_type === 'crp_stock' || sub_type === 'crypto' || groups === 'volatility_relvolatility' || groups === 'trend_reltrend') && key !== market_symbol) && last_value !== null && last_value !== undefined ? ` (Last = ${last_value})` : ''}`,
            data: data[key],
            zoneAxis: 'x',
            zones: url === 'risk_measure' ? zoonsData : []
          }
        })
        if(isRiskMeasure) {
          // 循环结束后，确保将最后一天的数据添加到 zones
          series.forEach(serie => {
            console.log('serie-forEach', serie)
            if(serie.data.length > 0) {
              const lastValue = serie.data[serie.data.length - 1]
              const lastPointColor = url === 'risk_measure' ? (lastValue['Color'] ? '#000000' : '#ff0000') : null;
              // 检查是否已经添加了最后一个区间，如果没有，则添加
              if (zoonsData.length === 0 || zoonsData[zoonsData.length - 1].value !== lastValue[0]) {
                zoonsData.push({
                  "value": lastValue[0],   // 最后一天时间点
                  "color": lastPointColor  // 最后一天对应的颜色
                });
              }
            }
          })
        }
        console.log('series', series)
        createChart(series, allKeysName, basicChartOptions, this.row);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }
  }
 }
 </script>
 
 <style lang="less" scoped>
 .test {
  color: #000000;
 }
 </style>
