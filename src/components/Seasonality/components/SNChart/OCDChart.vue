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
    props: {
      plotConfiguration: Object
    },
      data() {
          return {
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
  