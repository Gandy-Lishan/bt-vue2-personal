<template>
 <div>
   <div id="highcharts"></div>
 </div>
</template>

<script>
 import Highcharts from 'highcharts/highstock';
 import 'highcharts/indicators/indicators';
 import 'highcharts/indicators/bollinger-bands';
 import Exporting from 'highcharts/modules/exporting';
 import ExportData from 'highcharts/modules/export-data';
 import axios from "@/axios";
 import { getTempData } from "@/service/service";

export default {
 name: 'CumulativeReturnChart',
 data() {
   return {
   };
 },
 mounted() {
  Exporting(Highcharts);
  ExportData(Highcharts);
  this.fetchData();
 },
 methods: {
   plotData(data) {
     const date = data[0];
     const benchmark = data[1];
     const data1 = data[2];
     const data2 = data[3];
     const data3 = data[4];

     const chartOptions = {
       chart: {
         type: 'line',
         width: 1200,
         height: 600
       },
       title: {
         text: 'Performance Summary',
         style: {
           fontWeight: 'bold',
           fontFamily: 'Arial'
         }
       },
       xAxis: {
         categories: date,
         gridLineWidth: 1,
         gridLineDashStyle: 'Dash',
         tickPixelInterval: 1,
         title: {
           text: 'Date'
         }
       },
       yAxis: [{
         gridLineDashStyle: 'Dash',
         labels: {
           format: '{value} %',
           style: {
             color: Highcharts.getOptions().colors[1]
           }
         },
         title: {
           text: 'Cumulative Return',
           style: {
             color: Highcharts.getOptions().colors[1]
           }
         },
         opposite: true
       }],
       tooltip: {
         shared: true
       },
       legend: {
         layout: 'horizontal',
         verticalAlign: 'top',
         align: 'right',
         x: -60,
         y: 20,
         floating: false,
         backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
       },
       series: [
         {
           name: 'Strategy_1 (%)',
           data: data1,
           color: '#FF0000'
         },
         {
           name: 'Strategy_2 (%)',
           data: data2,
           color: '#FF7F50'
         },
         {
           name: 'Strategy_3 (%)',
           data: data3,
           color: '#FFA500'
         },
         {
           name: 'Benchmark (%)',
           data: benchmark,
           color: '#C0C0C0'
         }
       ]
     };

     Highcharts.stockChart('highcharts', chartOptions)
   },
   async fetchData() {
     const today = '2024-10-10';
     const symbolName = 'AAPL';

     // 获取信号数据
     const signalData = await getTempData();
     console.log('signalData', signalData)
     const resultDf = signalData.data.map(item => {
      item['Cumulative Json'] = item['Cumulative Json'].replace(/NaN/g, 'null')
      item['Cumulative Json'] = JSON.parse(item['Cumulative Json']);
      item['EntryDate'] = eval(item['EntryDate'])
      item['ExitDate'] = eval(item['ExitDate'])
      return item
     })
     const processCumulativeJson = (resultDf, keys) => {
      let result = [];
      const jsonData = resultDf.map(item => item['Cumulative Json']);

      // date 和 Buy and Hold Cumulative 始终从 jsonData[0] 提取
      result[0] = jsonData[0].map(item => item['date']);

      // Strategy Cumulative 从不同的 jsonData 项中提取
      for (let i = 0; i < jsonData.length; i++) {
          result[i + 1] = jsonData[i].map(item => item['Strategy Cumulative']);
      }
      result[jsonData.length + 1] = jsonData[0].map(item => item['Buy and Hold Cumulative']);

      return result;
    }
    const result = processCumulativeJson(resultDf, ['Date', 'Strategy Cumulative', 'Strategy Cumulative', 'Strategy Cumulative', 'Buy and Hold Cumulative']);
    console.log('result', result)
     this.plotData(result);
   },
   mergeData(data1, data2) {
     // 实现两个数据集的合并
     return data1.map((row, i) => ({ ...row, ...data2[i] }));
   },
   transposeData(data) {
     // 将 DataFrame 转置为适合 Highcharts 的格式
     return Object.keys(data[0]).map((key) => data.map((row) => row[key]));
   }
 },
};
</script>

<style scoped>
/* 可根据需要调整样式 */
</style>