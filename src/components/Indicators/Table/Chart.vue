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
      const {url, pess, opt, chart_name, last_value} = this.row;
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
            button.innerHTML = 'Backtest With Indicator';
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
              window.location.href = `/backtester/sr/setup?index=${indexParam}&indicator=${url}`;
            };
 
            chart.container.parentNode.style.position = 'relative';
            chart.container.parentNode.appendChild(button);
          },
        }
      };
 
      const createYAxisConfig = (series) => {
        return series.map((serie, i) => ({
          title: {
            text: serie?.name || 'SPY Optix',
            style: { color: i === 0 ? '#434348' : '#2f7ed8', fontWeight: 'bold', fontSize: '10px'
             }
          },
          opposite: true,
          top: `${(100 / series.length) * i}%`,
          height: `${100 / series.length}%`,
          offset: 0,
          lineWidth: 0, // 去掉右边 Y 轴的竖线
          gridLineWidth: 1,
          plotLines: serie?.name === url ? [
             {
               value: pess || 20,
               color: 'rgba(0, 128, 0, 1)',
               dashStyle: 'shortdash',
               width: 2,
               label: { text: `${pess || 20}` },
               zIndex: 5
             },
             {
               value: opt || 80,
               color: 'rgba(255, 0, 0, 1)',
               dashStyle: 'shortdash',
               width: 2,
               label: { text: `${opt || 80}` },
               zIndex: 5
             }
           ] : []
        }));
      };
 
      const createChart = (series, allKeysName, basicChartOptions) => {
        const yAxisConfig = createYAxisConfig(series);
        const allData = series.flatMap(s => s.data);
        const minX = Math.min(...allData.map(d => d[0]));
        const maxX = Math.max(...allData.map(d => d[0]));
 
        Highcharts.stockChart(this.id, {
          rangeSelector: { selected: 4 },
          title: {
            text: chart_name || 'SPY Optix',
            style: { fontWeight: 'bold', fontFamily: 'Arial' }
          },
          subtitle: {
            text: last_value !== undefined && last_value !== null ? `Last Value: ${last_value}` : ''
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
          yAxis: yAxisConfig,
          xAxis: {
            type: 'datetime',
            crosshair: { label: { enabled: false } },
            ordinal: false,
            min: minX,
            max: maxX
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 20
          },
          credits: {
            enabled: true,
            text: "Source: Sentiment",
            href: 'https://sentimentrader.com',
            position: {
              align: 'right',
              y: -125,
              x: -100
            }
          },
          tooltip: {
           shared: true,
           useHTML: true,
           crosshairs: true, 
           formatter: function () {
             let s = `${Highcharts.dateFormat('%m-%d-%Y', this.x)}<br>`;
             this.points.forEach(point => {
               // Add a colored circle before the series name
               const colorSpan = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${point.series.color}; border-radius: 50%; margin-right: 5px;"></span>`;
               s += `${colorSpan}<span>${point.series.name}</span>: ${Highcharts.numberFormat(point.y, 2)}<br>`;
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
              }
            }
          },
          series: series.map((s, i) => ({
            ...s,
            yAxis: i,
            type: 'line',
            color: i === 0 ? '#434348' : '#2f7ed8'  // Ensure the series colors
          })),
          chart: basicChartOptions
        });
      };
 
      try {
        const res = await axios.get(`/dev/st_data/get_data?index=${url || 'etf_spy'}`);
        const originalData = res.data;
 
        if (originalData.length === 0) return;
 
        const allKeysName = Object.keys(originalData[0]).filter(keyName => keyName !== 'date');
        const data = allKeysName.reduce((acc, keyName) => {
          acc[keyName] = originalData.map(entry => [new Date(entry['date']), entry[keyName]]);
          return acc;
        }, {});
 
        const series = Object.keys(data).map(key => ({
          name: key.includes('_') ? chart_name || 'SPY Optix' : key,
          data: data[key]
        }));
        createChart(series, allKeysName, basicChartOptions);
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