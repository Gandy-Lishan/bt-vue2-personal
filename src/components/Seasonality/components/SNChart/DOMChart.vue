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
    props: {
        plotConfiguration: Object
    },
    data() {
        return {
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
