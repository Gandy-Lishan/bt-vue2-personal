<template>
  <div id="extreme_indicators" class="watermark" style="width:100%; min-width:400px; max-width:1000px;   height: 600px; margin: 0 auto"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';

Exporting(Highcharts);
ExportData(Highcharts);

export default {
  name: 'ExtremeIndicatorsChart',
  data() {
    return {
      chart_data: {
        data: [],
        title: '',
        pess: '',
        opt: '',
        model: '',
        market: '',
        opt_message: '',
        pess_message: '',
        chart_type: '',
        smart_signal_title: '',
        dumb_signal_title: '',
        dumb_enabled: '',
        timeframe_selected: '',
        rangeSelector_enabled: '',
        navigator_enabled: '',
        opt_color: '',
        pess_color: '',
        data_extreme: '',
        seasonality: '',
        seasonality_day_of_year_data: '',
        seasonality_month_of_year_data: ''
      },
      extreme_sets: {
        spx: [],
        pess: [],
        opt: []
      },
      extreme_titles: {
        spx: 'SPX',
        pess: '% Showing Excess Pessimism',
        opt: '% Showing Excess Optimism'
      },
      extreme_types: {
        spx: 'line',
        pess: 'line',
        opt: 'line'
      },
      extreme_colors: {
        spx: '#000000',
        pess: '#228b22',
        opt: '#FF0000'
      },
      extreme_suffixes: {
        spx: '',
        pess: '%',
        opt: '%'
      }
    };
  },
  mounted() {
    //if (this.chart_data.data_extreme) {
      this.splitDataExtreme(this.chart_data.data_extreme);
      this.createChartExtreme();
    //}
  },
  methods: {
    splitDataExtreme(data_extreme) {
      const dataLength = data_extreme.length;
      for (let i = 0; i < dataLength; i++) {
        const date = data_extreme[i][0];
        const spx = data_extreme[i][3];
        const pess = data_extreme[i][1];
        const opt = data_extreme[i][2];

        this.extreme_sets.spx.push([date, spx]);
        if (pess !== 'undefined' && pess !== null) {
          this.extreme_sets.pess.push([date, pess]);
        }
        if (opt !== 'undefined' && opt !== null) {
          this.extreme_sets.opt.push([date, opt]);
        }
      }
    },
    createChartExtreme() {
      const yAxis = [
        {
          name: 'spx',
          title: { text: this.extreme_titles['spx'], style: { color: this.extreme_colors['spx'] } },
          labels: { align: 'right', x: 0, style: { color: this.extreme_colors['spx'] } },
          top: '0%',
          height: '40%',
          offset: 30,
          opposite: true, // 右侧显示
        },
        {
          name: 'pess',
          title: { text: '% Indicators', style: { color: 'black' } },
          labels: { align: 'right', x: 0, style: { color: 'black' } },
          top: '41%',
          height: '59%',
          offset: 30,
          min: 0,
          max: 100,
          opposite: true, // 右侧显示
        },
        {
          name: 'opt',
          top: '41%',
          height: '59%',
          linkedTo: 1,
          title: { enabled: false },
          labels: { enabled: false },
          offset: 0,
          min: 30,
          max: 100,
          opposite: true, // 右侧显示
        }
      ];

      Highcharts.stockChart('extreme_indicators', {
        title: { text: '% of Indicators at an Extreme' },
        rangeSelector: {
          selected: 3,
          allButtonsEnabled: true,
          buttons: [
            { type: 'month', count: 3, text: '3m' },
            { type: 'month', count: 6, text: '6m' },
            { type: 'ytd', text: 'YTD' },
            { type: 'year', count: 1, text: '1y' },
            { type: 'year', count: 3, text: '3y' },
            { type: 'year', count: 5, text: '5y' },
            { type: 'year', count: 10, text: '10y' },
            { type: 'all', text: 'All' }
          ]
        },
        legend: {
          enabled: true,
          align: 'center',
          verticalAlign: 'top',
          x: 0,
          y: 20
        },
        exporting: {
          filename: '% of Indicators at an Extreme',
          sourceWidth: 600,
          sourceHeight: 400,
          style: { fontFamily: 'Open Sans, sans-serif' },
          chartOptions: {
            navigator: { enabled: false },
            rangeSelector: { enabled: false },
            scrollbar: { enabled: false },
            chart: {
              backgroundColor: '#fff',
              plotBackgroundColor: '#fff'
            }
          }
        },
        yAxis: yAxis,
        chart: {
          zoomType: 'x',
          style: { fontFamily: 'Open Sans, sans-serif' },
          backgroundColor: 'transparent',
          renderTo: 'charts'
        },
        credits: {
          enabled: true,
          text: 'SENTIMENTRADER',
          href: '#',
          position: { align: 'right', y: -125, x: -75 }
        },
        tooltip: {
          xDateFormat: '%m-%d-%Y'
        },
        series: this.getSeriesListExtreme(yAxis)
      });
    },
    getSeriesListExtreme(yAxis) {
      const extreme_series = [];
      for (let i = 0; i < yAxis.length; i++) {
        const name = yAxis[i].name;
        const s = {
          name: this.extreme_titles[name],
          type: this.extreme_types[name],
          data: this.extreme_sets[name],
          tooltip: {
            valueSuffix: this.extreme_suffixes[name]
          },
          yAxis: i,
          dataGrouping: { enabled: false },
          marker: { symbol: 'circle' },
          color: this.extreme_colors[name]
        };
        extreme_series.push(s);
      }
      return extreme_series;
    }
  }
};
</script>

<style scoped>
#charts {
  width: 100%;
  height: 500px;
}
</style>