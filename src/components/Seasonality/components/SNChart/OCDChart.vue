<template>
    <div class="SNChart-container">
      <SNChart :plotConfiguration="plotConfiguration" :dataList="data" :dynamicId="dynamicId"></SNChart>
    </div>
  </template>
  
  <script>
import data from "../Others/mock";
import SNChart from "./index.vue"
  
  export default {
    name: 'SDChart',
      data() {
          return {
            plotConfiguration: {
                title: 'Nasdaq Composite Avg Return Month',
                subtitle: '1971-2011',
                xAxisTitle: 'Month',
                customScale: true, // 如果需要自定义刻度
                formatter: true, // 如果需要自定义数据提示
                scaleSettings: {
                    positiveColor: '#00B050',
                    negativeColor: '#C0504D',
                    yAxis_1: {
                    tickPositions: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
                    max: 4,
                    min: -4,
                    format: '{value} %'
                    },
                    yAxis_2: {
                    tickPositions: [20, 30, 40, 50, 60, 70, 80],
                    format: '{value} %'
                    },
                }
              },
              dynamicId: 'OCDContainer'
          }
      },
      components: {
          SNChart
      },
      created() {
          try {
              this.data = data.map(item => [item[0], parseFloat((item[1] * 100).toFixed(2)), parseFloat(item[2].toFixed(2))])
          } catch (error) {
              console.log(error)
          }
      }
  };
  </script>
  
  <style>
  </style>
  