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
  if (!this.row.url) return;
  const { url, pess, opt, chart_name, market_symbol, type } = this.row;

  // 初始化基本图表配置
  let selector = 5
  if(url === 'risk_levels' || type === 'trend_reltrend') selector = 3
  if(url === 'smart_dumb') selector = 4
  if(type === 'trend_reltrend') selector = 3
  var basicChartOptions = {
    chart: {
      zoomType: 'x',
      pinchType: '',
      style: {
        fontFamily: "Open Sans , sans-serif"
      },
      animation: false,
      alignTicks: false,
      backgroundColor: 'transparent',
      renderTo: 'charts',
      events: {
        load: function(event) {
           var e = event.target.axes[0].getExtremes();
           this.defaultChartScale = [e.min, e.max];
          this.renderer.image('https://dnpgic06wp5lx.cloudfront.net/sentimentrader.png', 0, 600, 120, 33)
            .attr({ 'opacity': 0.25 })
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
        }
      }
    },
    title: {
      text: chart_name || 'SPY Optix',
      style: { fontWeight: 'bold', fontFamily: 'Arial' }
    },
    rangeSelector: {
      buttons: [
        { type: 'month', count: 3, text: '3m' },
        { type: 'month', count: 6, text: '6m' },
        { type: 'ytd', text: 'YTD' },
        { type: 'year', count: 1, text: '1y' },
        { type: 'year', count: 3, text: '3y' },
        { type: 'year', count: 5, text: '5y' },
        { type: 'year', count: 10, text: '10y' },
        { type: 'year', count: 15, text: '15y' },
        { type: 'year', count: 20, text: '20y' },
        { type: 'all', text: 'All' }
      ],
      selected: 5
    },
    yAxis: [
      { // 主 Y 轴配置
        labels: { style: { fontSize: '10px' } },
        title: {
          text: 'SPY Optix',
          style: { fontWeight: 'bold', fontSize: '10px', color: '#434348' }
        },
        opposite: false,
        gridLineWidth: 1
      }
    ],
    tooltip: {
      xDateFormat: '%m-%d-%Y',
      followTouchMove: true,
      shared: true,
      useHTML: true,
      crosshairs: true,
      formatter: function() {
        let s = `${Highcharts.dateFormat('%m-%d-%Y', this.x)}<br>`;
        this.points.forEach(point => {
          const colorSpan = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${point.series.color}; border-radius: 50%; margin-right: 5px;"></span>`;
          s += `${colorSpan}<span>${point.series.name}</span>: <b>${point.y}</b><br>`;
        });
        return s;
      }
    },
    series: [] // 初始化时不传入任何系列
  };

  // 创建图表
  const chart = Highcharts.stockChart(this.id, basicChartOptions);

  // 动态添加系列
  const addSeries = (series) => {
    series.forEach((s, i) => {
      const _type = i === 0 || type !== 'mff' ? 'line' : 'column';
      let color = i === 0 ? '#434348' : (i === 2 ? 'rgb(142, 35, 35)' : '#2f7ed8');
      if (s.name === 'opt') color = 'rgba(255, 0, 0, 1)';
      if (s.name === 'pess') color = 'rgba(0, 128, 0, 1)';
      
      chart.addSeries({
        name: s.name,
        data: s.data,
        type: _type,
        color: color,
        dashStyle: s.name === 'opt' || s.name === 'pess' ? 'Dash' : 'Solid',
        showInNavigator: s.name !== 'opt' && s.name !== 'pess',
        enableMouseTracking: s.name !== 'opt' && s.name !== 'pess',
        lineWidth: s.name === 'opt' || s.name === 'pess' ? 1 : 2
      });
    });
  };

  try {
    let res = await axios.get(`/dev/st_data/get_data?index=${url || 'etf_spy'}`);
    let originalData = res.data;

    // 清理数据 NaN 等情况
    if (typeof originalData === 'string') {
      originalData = originalData.replace(/NaN/g, 'null');
      originalData = JSON.parse(originalData);
    }

    if (originalData.length === 0) return;

    // 提取系列数据
    const series = Object.keys(originalData[0])
      .filter(keyName => keyName !== 'date' && keyName !== 'dumb')
      .map((key) => ({
        name: key,
        data: originalData.map(d => [Date.parse(d.date), d[key]])
      }));

    // 添加系列到图表
    addSeries(series);

  } catch (error) {
    console.error('Error fetching or processing data:', error);
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
.test {
 color: #000000;
}
</style>