<template>
    <div class="SNChart-container">
      <SNChart :plotConfiguration="plotConfiguration" :dataList="dataList" :dynamicId="dynamicId"></SNChart>
    </div>
  </template>
  
<script>
  import SNChart from "./index.vue"
import { getSeasonalityData } from "@/service/service";
import { checkProperties } from "@/utils";
    
  export default {
      name: 'SDChart',
      props: {
        plotConfiguration: Object,
        data: Object
      },
        data() {
            return {
              dynamicId: 'SDContainer',
              dataList: []
            }
        },
        components: {
            SNChart
        },
        watch: {
          plotConfiguration: {
            async handler(newVal, _) {
                if(Object.keys(newVal).length == 0) return

                const commonPropertiesToCheck = ['symbol', 'shift', 'start_date', 'end_date'];
                if (!checkProperties(newVal, commonPropertiesToCheck)) {console.log('公共属性存在空值'); return}
                // 需要判断请求的属性是否为空 null
                let url
                let shift = newVal.shift.length > 1 ? newVal.shift.join(',') : newVal.shift[0]
                let start_date = newVal.start_date
                if(start_date == '_') start_date = '1928'
                if(newVal.holidays != 'Custom Date'){
                  const propertiesToCheck = ['holidays']
                  if (!checkProperties(newVal, propertiesToCheck)) {console.log('holidays 为空'); return}
                  url = `/dev/seasonality/get_holiday_data?name=${newVal.symbol}&start=${start_date}&end=${newVal.end_date}&holiday=${newVal.holidays}&shift=${shift}`
                }else {
                  let [month, day] = newVal.customizeDate.split('-')
                  if (!month || !day) {console.log('month 或 day 为空'); return}
                  url = `/dev/seasonality/get_custom_day_data?name=${newVal.symbol}&start=${start_date}&end=${newVal.end_date}&month=${month}&day=${day}&shift=${shift}`
                }
                let {data: {data}} = await getSeasonalityData(url)
                if(data?.length === 0 || !data) {this.popUpMsgBox('Not found: Adjust your search criteria for the selected symbol'); data = []}
                this.dataList = data.map(item => [parseFloat(item['period']), parseFloat((Math.round(item['Return'] * 100) / 100).toFixed(2)), parseFloat((Math.round(item['Positive'] * 100) / 100).toFixed(2)), ])
                },
            deep: true,
            immediate: true,
          },
        },
    };
</script>
  
  <style>
  </style>
  