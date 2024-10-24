<template>
  <div :id="id" style="height: 800px; background-color: #fff;"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import axios from "@/axios";


export default {
  name: 'Chart',
  props: {
    row: Object,
    id: String
  },
  data() {
    return {
      chart: null, // 存储图表实例
    };
  },
  watch: {
    row: {
      handler(newValue){
        if(!newValue.url) return;
        this.loadChart();
      },
      deep: true
    }
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
    async loadChart() {
      if (this.chart) {
        this.chart.destroy(); // 销毁旧图表
      }
      Exporting(Highcharts);
      ExportData(Highcharts);

      let {last_value, last_change_type, market_symbol, type, url, chart_name} = this.row;
      try {
        let isRiskMeasure = false
        console.log('this.row', this.row)
        const res = await axios.get(`/dev/st_data/get_data?index=${url || 'etf_spy'}`);
        let originalData = res.data
        console.log('originalData', originalData)
        try {
          if(typeof originalData === 'string') {
            originalData = originalData.replace(/NaN/g, 'null')
            originalData = JSON.parse(originalData)
          }
        } catch (error) {
          console.log('error', error)
        }
        if (originalData.length === 0) return;
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
              zoonsData.push({
              value: new Date(item['date']).getTime(),   // 时间点
              color: pointColor  // 对应的颜色
            })
            }  // 红色为 false，黑色为 true
            
          })
        }
        const data = allKeysName.reduce((acc, keyName) => {
          acc[keyName] = originalData.map(entry => [new Date(entry['date']).getTime(), entry[keyName]]);
          return acc;
        }, {});
        console.log('data', data)
        let series = Object.keys(data).map(key => {
          let name = 'SPY Optix'
          if (last_value !== null && last_value !== undefined) {
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
          if((key.includes('_reltrend') || key.includes('_trend')) && type === 'trend_reltrend') {
            name = key.replace('_reltrend', ' Real Trend')
            name = name.replace('_trend', ' Trend')
          }else if(key.includes('_') && url !== 'smart_dumb' && url !== 'risk_levels') name = chart_name
          else if(key.includes('_') && key === 'model_smart_money' && url === 'smart_dumb') name = 'Smart Money'
          else if(key.includes('_') && key === 'model_dumb_money' && url === 'smart_dumb') name = 'Dumb Money'
          else if(key.includes('_') && key === 'model_risk_stocks_short' && url === 'risk_levels') name = 'Short Term Risk Levels'
          else if(key.includes('_') && key === 'model_risk_stocks_medium' && url === 'risk_levels') name = 'Intermediate Term Risk Levels'
          else name = key
          return {
            name: `${name}${key.includes('_') && last_value !== null && last_value !== undefined ? ` (Last = ${last_value})` : ''}`,
            data: data[key],
            zoneAxis: 'x',
            zones: url === 'risk_measure' ? zoonsData : [],
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
        this.plotData(series);
      } catch (error) {
        console.error(`Error fetching data for`, error);
      }
    },
    plotData(series) {
      const {url, pess, opt, chart_name, market_symbol, type} = this.row
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
              this.renderer.image('https://dnpgic06wp5lx.cloudfront.net/sentimentrader.png', 100, 350, 120, 33)
                  .attr({
                      'opacity': 0.65
                  })
                  .add();
                  if(url === 'smart_dumb' || url === 'risk_levels' || type === 'trend_reltrend') return
                  const chart = this;
                  const button = document.createElement('button');
                  button.innerHTML = '<i class="el-icon-s-data" style="margin-right: 5px;"></i>Backtest This Indicator';
                  button.style.position = 'absolute';
                  button.style.top = `${chart.chartHeight/10}px`;
                  button.style.left = (chart.chartWidth / 2 - 82) + 'px';
                  button.style.fontSize = '16px';
                  button.style.fontWeight = 600;
                  button.style.color = '#1f77b4';
                  button.style.border = 'unset';
                  button.style.width = '220px';
                  button.style.background = 'unset';
      
                  button.onclick = function () {
                    window.open(`/backtester/sr/setup?index=${market_symbol || 'Unknown'}&indicator=${url}`, '_blank')
                  };
      
                  chart.container.parentNode.style.position = 'relative';
                  chart.container.parentNode.appendChild(button);
            },
          }
        };
        const createYAxisConfig = (series, row) => {
        const {sub_type, source_list, url, type} = row
        const isCot = sub_type === 'cot' && url.startsWith('cot_') && source_list === 'commodity_complete_list'
        // commodity_complete_list
        // 如果 sub_type = 'cot' 并且 url 以 cot_ 开头, 那么极值是曲线
        return series.map((serie, i) => {
          let minYAxis, maxYAxis;
          const isOptPess = serie?.name === 'opt' || serie?.name === 'pess';
          
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
              text: !isOptPess ? serie?.name || 'SPY Optix' : '',
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
            plotLines: (i === series.length - 1) && !isCot ? [
              {
                value: pess || null,
                color: 'rgba(0, 128, 0, 1)',
                dashStyle: 'shortdash',
                width: 1,
                label: { text: `${pess || ''}`, style: {fontSize: '10px', color: 'rgba(0, 128, 0, 1)'} },
                zIndex: 5
              },
              {
                value: opt || null,
                color: 'rgba(255, 0, 0, 1)',
                dashStyle: 'shortdash',
                width: 1,
                label: { text: `${opt || ''}`, style: {fontSize: '10px', color: 'rgba(255, 0, 0, 1)'} },
                zIndex: 5
              }
            ] : [],
          };
        });
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
          //  plotBands: plotBands,
         },
        yAxis: createYAxisConfig(series, this.row),
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
               s += `${colorSpan}<span>${point.series.name}</span>: <b>${point.y}</b><br>`;
             });
             return s;
           }
        },
        legend: {
          layout: 'horizontal',
          verticalAlign: 'top',
          align: 'right',
          x: -60,
          y: 0,
          floating: true,
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
        },
        credits: {
           enabled: true,
           text: "Source: Sentiment",
           href: 'https://sentimentrader.com',
           position: {
             align: 'right',
             y: -120,
             x: -80
           }
         },
         chart: basicChartOptions,
      };

      this.chart = Highcharts.chart(this.id, options);
      this.addDataSets(series);
    },
    addDataSets(series) {
      const {url, pess, opt, chart_name, market_symbol, type} = this.row
      series.forEach((s, i) => {
        const _type = i === 0 || type !== 'mff' ? 'line' : 'column'
        let color = i === 0 ? '#434348' : (i === 2 ? 'rgb(142, 35, 35)' : '#2f7ed8')
        const isOptPess = s.name === 'opt' || s.name === 'pess'
        if(s.name === 'opt') color = 'rgba(255, 0, 0, 1)'
        if(s.name === 'pess') color = 'rgba(0, 128, 0, 1)'
        this.chart.addSeries({
          ...s,
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
        })})
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