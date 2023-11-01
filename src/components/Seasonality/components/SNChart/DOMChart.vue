<template>
  <div class="SNChart-container">
    <SNChart :plotConfiguration="plotConfiguration" :dataList="dataList" :dynamicId="dynamicId"></SNChart>
  </div>
</template>

<script>
import SNChart from "./index.vue"
import { getSeasonalityData } from "@/service/service";

export default {
    name: 'DOMChart',
    props: {
        plotConfiguration: Object,
        data: Object
    },
    data() {
        return {
            dynamicId: 'DOMContainer',
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

                const url = `/sn/get_month_data?name=${newVal.symbol}&month=${newVal.month}&start=${newVal.start_date}&end=${newVal.end_date}`
                const {data} = await getSeasonalityData(url)
                this.dataList = data.map(item => [parseFloat(item['Day']), parseFloat(item['Return'].toFixed(2)), parseFloat(item['Positive'].toFixed(2))])
                },
            deep: true,
            immediate: true,
            },
    },
};
</script>
