<template>
    <div class="SNChart-container">
      <SNChart :plotConfiguration="plotConfiguration" :dataList="dataList" :dynamicId="dynamicId" v-if="[0,1].includes(option)"></SNChart>
      <Table :tableData="dataList" :option="option" v-else></Table>
    </div>
  </template>
  
  <script>
import SNChart from "./index.vue"
import { getSeasonalityData } from "@/service/service";
import Table from "../Others/table.vue";
  
  export default {
    name: 'OCDChart',
    props: {
      plotConfiguration: Object,
      data: Object
    },
      data() {
          return {
              dynamicId: 'OCDContainer',
              dataList: [],
              option: 0
          }
      },
      components: {
          SNChart,
          Table
      },
      watch: {
          plotConfiguration: {
            async handler(newVal, _) {
                if(Object.keys(newVal).length == 0) return
                this.option = newVal.option
                let url

                if(newVal.option == 0) {
                  url = `/sn/Week_or_Month_data?name=${newVal.symbol}&option=${newVal.category}&start=${newVal.start_date}&end=${newVal.end_date}`
                }
                else if(newVal.option == 1){
                  url = `/sn/Week_or_Month_data?name=${newVal.symbol}&option=${newVal.category}&start=${newVal.start_date}&end=${newVal.end_date}`
                }
                else if(newVal.option == 2){
                  url = `/sn/get_day_of_month_data?name=${newVal.symbol}&start=${newVal.start_date}&end=${newVal.end_date}`
                }
                else if(newVal.option == 3) {
                  url = `/sn/get_day_of_year_data?name=${newVal.symbol}&start=${newVal.start_date}&end=${newVal.end_date}`
                }

                const {data} = await getSeasonalityData(url)
                console.log('data', data)
                if([0, 1].includes(newVal.option)) {
                  this.dataList = data.map(item => [item['Month'], parseFloat((item['Return'] * 100).toFixed(2)), parseFloat(item['Positive'].toFixed(2))])
                }else {
                  this.dataList = data.map(obj => {
                    for (const key in obj) {
                      if (!isNaN(obj[key])) {
                          // 如果属性值是数字，使用 parseFloat 转换，然后保留两位小数
                          obj[key] = parseFloat(obj[key]).toFixed(2);
                          // 去掉多余的零
                          obj[key] = parseFloat(obj[key]);
                      }
                    }
                    return obj;
                  });
                }
                },
            deep: true,
            immediate: true,
          },
        },
  };
  </script>
  
  <style>
  </style>
  