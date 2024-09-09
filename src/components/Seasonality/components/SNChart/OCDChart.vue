<template>
    <div class="SNChart-container">
      <SNChart :plotConfiguration="plotConfiguration" :dataList="dataList" :dynamicId="dynamicId" v-if="[0,1].includes(option)"></SNChart>
      <Table :tableData="dataList" :option="option" class="default-table-class" :tradingIndex="tradingIndex" :newest_day="newest_day" :newest_month="newest_month" v-else></Table>
    </div>
  </template>
  
  <script>
import SNChart from "./index.vue"
import { getSeasonalityData } from "@/service/service";
import Table from "../Others/table.vue";
import { checkProperties } from "@/utils";
  
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
              option: 0,
              tradingIndex: 'empty',
              newest_day: null,
              newest_month: null
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
                const commonPropertiesToCheck = ['symbol', 'start_date', 'end_date'];
                if (!checkProperties(newVal, commonPropertiesToCheck)) {console.log('公共属性存在空值'); return}

                this.option = newVal.option
                let url

                if(newVal.option == 0) {
                  url = `/dev/seasonality/get_weekday_or_month_data?name=${newVal.symbol}&start=${newVal.start_date}&end=${newVal.end_date}&option=${newVal.category}`
                }
                else if(newVal.option == 1){
                  url = `/dev/seasonality/get_weekday_or_month_data?name=${newVal.symbol}&start=${newVal.start_date}&end=${newVal.end_date}&option=${newVal.category}`
                }
                else if(newVal.option == 2){
                  url = `/dev/seasonality/get_day_of_month_data?name=${newVal.symbol}&start=${newVal.start_date}&end=${newVal.end_date}`
                }
                else if(newVal.option == 3) {
                  url = `/dev/seasonality/get_day_of_year_data?name=${newVal.symbol}&start=${newVal.start_date}&end=${newVal.end_date}`
                }
                const {data: {data, current_trading_index, newest_day, newest_month}} = await getSeasonalityData(url)
                if(data?.length === 0) {this.popUpMsgBox('Not found: Adjust your search criteria for the selected symbol')}
                if([0, 1].includes(newVal.option)) {
                  this.dataList = data.map(item => [item['Date'] || item['Month'], parseFloat((Math.round(item['Return'] * 100) / 100).toFixed(2)), parseFloat((Math.round(item['Positive'] * 100) / 100).toFixed(2))])
                }else {
                  this.tradingIndex = current_trading_index
                  if(newest_day !== null && newest_month !== null) {
                    this.newest_day = newest_day
                    this.newest_month = newest_month
                  }
                  this.dataList = data.map(obj => {
                    for (const key in obj) {
                      if (!isNaN(obj[key])) {
                          // 如果属性值是数字，使用 parseFloat 转换，然后保留两位小数
                          const roundedNum = Math.round(obj[key] * 100) / 100
                          obj[key] = parseFloat(roundedNum.toFixed(2));
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
  