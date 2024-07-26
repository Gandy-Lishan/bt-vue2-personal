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
      if(!this.row.url) return
      const {url, pess, opt, chart_name, last_value} = this.row;

      const createYAxisConfig = (series, url, pess, opt) => {
        return series.map((serie, i) => ({
          title: { text: serie?.name || 'SPY Optix' },
          opposite: i % 2 === 1,
          height: `${100 / series.length}%`,
          top: `${(100 / series.length) * i}%`,
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

      const createChart = (series, allKeysName) => {
        const yAxisConfig = createYAxisConfig(series, url, pess, opt);
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
            crosshair: { label: { enabled: false } },
            ordinal: false,
            min: minX
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
            xDateFormat: '%m-%d-%Y',
            followTouchMove: true,
            shared: true,
            useHTML: true,
            formatter: function () {
              let s = `${Highcharts.dateFormat('%m-%d-%Y', this.x)}<br>`;
              this.points.forEach(point => {
                s += `<b>${point.series.name}</b>: ${point.y}<br>`;
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
            yAxis: i
          })),
          chart: {
            events: {
              load: function() {
                const chart = this;
                const index = allKeysName.find(key => key !== url);
                const button = document.createElement('button');
                button.innerHTML = 'Backtest With Indicator';
                button.style.position = 'absolute';

                const subtitleBBox = chart.subtitle.getBBox();
                button.style.top = (subtitleBBox.y + subtitleBBox.height + chart.plotTop - 60) + 'px';
                button.style.left = (chart.chartWidth / 2 - 82) + 'px';
                button.style.fontSize = '16px';
                button.style.fontWeight = 600;
                button.style.color = '#1f77b4';
                button.style.border = 'unset';
                button.style.width = '220px';
                button.style.background = 'unset';

                button.onclick = function () {
                  const indexParam = url || 'etf_spy';
                  window.location.href = `/backtester/sr/setup?index=${index}&indicator=${url}`;
                };

                chart.container.parentNode.style.position = 'relative';
                chart.container.parentNode.appendChild(button);
              }
            }
          }
        });
      };

      try {
        const res = await axios.get(`/dev/st_data/get_data?index=${url || 'etf_spy'}`);
        console.log('res', res.data);
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

        createChart(series, allKeysName);
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