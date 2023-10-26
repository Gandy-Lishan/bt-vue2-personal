<template>
    <div class="SNChart-container">
      <SNChart :plotConfiguration="plotConfiguration" :dataList="data" :dynamicId="dynamicId"></SNChart>
    </div>
  </template>
  
  <script>
import data from "../SpecificDay/mock";
import SNChart from "./index.vue"
  
  export default {
    name: 'SDChart',
      data() {
          return {
              plotConfiguration: {
                title: 'Performance Surrounding Independence Day',
                subtitle: 'S&P 500, 1950-2011',
                xAxisTitle: 'Days Surrounding Holiday',
                customScale: true, // 如果需要自定义刻度
                formatter: true, // 如果需要自定义数据提示
                scaleSettings: {
                    positiveColor: '#00B050',
                    negativeColor: '#C0504D',
                    yAxis_1: {
                    tickPositions: [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3],
                    max: 0.3,
                    min: -0.3,
                    format: '{value} %'
                    },
                    yAxis_2: {
                    tickPositions: [20, 30, 40, 50, 60, 70, 80],
                    format: '{value} %'
                    },
              }
              },
              dynamicId: 'SDContainer'
          }
      },
      components: {
          SNChart
      },
      created() {
          try {
              this.data = data.map(item => [item[0], parseFloat((item[1]).toFixed(2)), parseFloat(item[2].toFixed(2))])
          } catch (error) {
              console.log(error)
          }
      }
  };
  </script>
  
  <style>
  </style>
  