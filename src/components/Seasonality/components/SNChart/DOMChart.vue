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
                const commonPropertiesToCheck = ['symbol', 'month', 'start_date', 'end_date'];
                if (!checkProperties(newVal, commonPropertiesToCheck)) {console.log('公共属性存在空值'); return}

                const url = `/dev/seasonality/get_month_data?name=${newVal.symbol}&start=${newVal.start_date}&end=${newVal.end_date}&month=${newVal.month}`
                const {data: {data}} = await getSeasonalityData(url)
                if(data?.length === 0) {this.popUpMsgBox('Not found: Adjust your search criteria for stock data')}
                this.dataList = data.map(item => [parseFloat(item['Day']), parseFloat((Math.round(item['Return'] * 100) / 100).toFixed(2)), parseFloat((Math.round(item['Positive'] * 100) / 100).toFixed(2))])
                },
            deep: true,
            immediate: true,
            },
    },
};
</script>
