<template>
  <div v-loading="loading" class="strategy-signal--chartcontainer" ref="strategySignalChartcontainer"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import moment from 'moment'
import {
  getSymbolStrategySigal
} from '@/service/service'

export default {
  name: 'StrategySigal',
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chart: null, // 存储图表实例
      loading: true,
    };
  },
  watch: {
    // 监视 symbol 变化，重新加载图表
    symbol: 'loadChart',
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
      const signalData = await getSymbolStrategySigal(this.symbol);
      const { trend_score, EntryDate, ExitDate } = signalData.data.data[0];
      this.plotData(JSON.parse(trend_score), EntryDate, ExitDate);

      this.loading = false
    },
    plotData(trend_score, EntryDate, ExitDate) {
      // find the start point
      const start = EntryDate[0] < ExitDate[0] ? EntryDate[0] : ExitDate[0]
      trend_score = trend_score.filter(item => moment(item.DT).isAfter(moment(start).subtract(1, 'month')))
      
      const dataX = trend_score.map(item => new Date(item.DT));
      const rData = trend_score.map(item => item.Close);
      const pData = trend_score.map(item => item.trend_score);

      const plotBands = pData.map((value, i) => {
        const intensity = Math.round(255 * (value / 100));
        const color = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
        return {
          from: i - 0.5,
          to: i + 0.5,
          color: color,
        };
      });

      const buyMarkerData = this.createMarkerData(dataX, rData, EntryDate, 'triangle', 'green');
      const sellMarkerData = this.createMarkerData(dataX, rData, ExitDate, 'triangle-down', 'red');

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
            },
          }
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
          text: "Trading Signal for AAPL",
          style: {
            fontWeight: 'bold',
            fontFamily: 'Arial',
          },
        },
        navigator: {
          enabled: true,
        },
        xAxis: {
          categories: dataX.map(date => date.toISOString().split('T')[0]),
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          tickPixelInterval: 1,
          title: {
            text: "Dates",
          },
          plotBands: plotBands,
        },
        yAxis: {
          gridLineDashStyle: 'Dash',
          labels: {
            format: '{value}',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          gridLineWidth: 0,
          title: {
            text: 'Close & Trend Score',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        tooltip: {
          shared: true,
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

      this.chart = Highcharts.chart(this.$refs.strategySignalChartcontainer, options);
      this.addDataSets(rData, pData, buyMarkerData, sellMarkerData);
    },
    createMarkerData(dataX, rData, markers, symbol, color) {
      return markers.map(date => {
        const index = dataX.findIndex(d => d.getTime() === new Date(date).getTime());
        if (index !== -1) {
          return {
            x: index,
            y: rData[index],
            marker: {
              symbol: symbol,
              enabled: true,
              radius: 6,
              fillColor: color,
            },
            dataLabels: {
              enabled: false,
              style: {
                color: color,
              },
              align: 'center',
              verticalAlign: symbol === 'triangle' ? 'top' : 'bottom',
            },
          };
        }
        return null;
      }).filter(Boolean);
    },
    addDataSets(rData, pData, buyMarkerData, sellMarkerData) {
      // this.chart.addSeries({
      //   name: 'Trend Score',
      //   data: pData,
      //   type: 'line',
      //   color: '#99CCFF',
      //   yAxis:  0,  // 绑定到唯一的 yAxis
      //   marker: {
      //     enabled: false,
      //   },
      // });
      this.chart.addSeries({
        name: 'Symbol Close',
        data: rData,
        type: 'line',
        color: '#01017D',
        yAxis:  0,  // 绑定到唯一的 yAxis
        marker: {
          enabled: false,
        },
      });
      // debugger
      this.chart.addSeries({
        name: 'Buy',
        data: buyMarkerData,
        type: 'scatter',
        marker: {
          symbol: 'triangle',
          enabled: true,
          fillColor: 'green',
        },
      });
      this.chart.addSeries({
        name: 'Sell',
        data: sellMarkerData,
        type: 'scatter',
        marker: {
          symbol: 'triangle-down',
          enabled: true,
          fillColor: 'red',
        },
      });
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
