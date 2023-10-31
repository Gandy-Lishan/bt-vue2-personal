<template>
    <div class="SNChart-container">
      <SNChart :plotConfiguration="plotConfiguration" :dataList="dataList" :dynamicId="dynamicId"></SNChart>
    </div>
  </template>
  
<script>
  import SNChart from "./index.vue"
import { getSeasonalityData } from "@/service/service";
    
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
                let url
                let shift = newVal.shift.length > 1 ? newVal.shift.join(',') : newVal.shift[0]
                if(newVal.holiday != 'Custom Time'){
                  url = `/sn/get_holiday_data?name=${newVal.symbol}&shift=${shift}&start=${newVal.start_date}&end=${newVal.end_date}&holiday=${newVal.holidays}`
                }else {
                  const [month, day] = newVal.customizeDate.split('-')
                  url = `/sn/get_custom_day_data?name=${newVal.symbol}&shift=${shift}&start=${newVal.start_date}&end=${newVal.end_date}&month=${month}&day=${day}`
                }
                const {data} = await getSeasonalityData(url)
                this.dataList = data.map(item => [parseFloat(item['period']), parseFloat(item['Return'].toFixed(2)), parseFloat(item['Positive'].toFixed(2))])
                },
            deep: true,
            immediate: true,
          },
        },
    };
</script>
  
  <style>
  </style>
  