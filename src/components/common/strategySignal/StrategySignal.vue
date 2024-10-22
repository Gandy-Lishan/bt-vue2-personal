<template>
  <div ref="chartContainer"></div>
</template>

<script>
import Highcharts from 'highcharts';
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
  async mounted() {
    const signalData = await getSymbolStrategySigal(symbol);
    const { trend_score, EntryDate, ExitDate } = signalData.data
    this.plotData(trend_score, EntryDate, ExitDate);
  },
  methods: {
    plotData(trend_score, EntryDate, ExitDate) {
      const dataX = trend_score.map(item => new Date(item.DT));
      const rData = trend_score.map(item => new Date(item.Close));
      const pData = trend_score.map(item => new Date(item.trend_score));

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

      const options = {
        title: {
          text: "Trading Signal for AAPL",
          style: {
            fontWeight: 'bold',
            fontFamily: 'Arial',
          },
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
          backgroundColor: "(Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'",
        },
        credits: {
          enabled: true,
          href: 'https://sentimentrader.com/',
          style: {
            fontSize: '15px',
          },
          position: {
            align: 'right',
            x: -80,
            y: -65,
          },
          text: 'sentimentrader',
        },
      };

      Highcharts.chart(this.$refs.chartContainer, options);
      this.addDataSets(rData, buyMarkerData, sellMarkerData);
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
    addDataSets(rData, buyMarkerData, sellMarkerData) {
      const chart = Highcharts.charts[0]; // 获取当前图表实例
      chart.addSeries({
        name: 'Symbol Close',
        data: rData,
        type: 'line',
        color: '#01017D',
        marker: {
          enabled: false,
        },
      });
      chart.addSeries({
        name: 'Buy',
        data: buyMarkerData,
        type: 'scatter',
        marker: {
          symbol: 'triangle',
          enabled: true,
          fillColor: 'green',
        },
      });
      chart.addSeries({
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
.chartContainer {
  width: 100%;
  height: 500px;
}
</style>
