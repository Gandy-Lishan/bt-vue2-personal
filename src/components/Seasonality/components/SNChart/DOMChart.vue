<template>
  <div class="SNChart-container">
    <SNChart :plotConfiguration="plotConfiguration" :dataList="data" :dynamicId="dynamicId"></SNChart>
  </div>
</template>

<script>
import data from "./mock";
import SNChart from "./index.vue"

export default {
    name: 'DOMChart',
    data() {
        return {
            plotConfiguration: {
            title: 'Seasonality in the S&P 500',
            subtitle: 'Month of October',
            xAxisTitle: 'Day Of The Month',
            customScale: true, // 如果需要自定义刻度
            formatter: true, // 如果需要自定义数据提示
            scaleSettings: {
                positiveColor: '#00B050',
                negativeColor: '#C0504D',
                yAxis_1: {
                tickPositions: [-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5],
                max: 0.5,
                min: -0.5,
                format: '{value}'
                },
                yAxis_2: {
                tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                format: '{value} %'
                },
            }
            },
            dynamicId: 'DOMContainer'
        }
    },
    components: {
        SNChart
    },
    created() {
        try {
            this.data = data.map(item => [item[2], parseFloat(item[1].toFixed(2)), parseFloat((item[3] * 100).toFixed(2))])
        } catch (error) {
            console.log(error)
        }
    }
};
</script>
