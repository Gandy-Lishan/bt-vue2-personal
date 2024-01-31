<template>
  <div class="create-cpm-container">
    <div class="chart">
      <Chart :default_symbol="default_symbol" :chart_data="chart_data" :breadcrumbTitle="breadcrumbTitle" @calculateBarDistance="calculateBarDistance"></Chart>
    </div>
    <div class="form">
      <div class="form-header">
        <h3 class="form-title">Correlation Pattern Match Parameters</h3>
      </div>
      <Form ref="Form"></Form>
    </div>
  </div>

</template>

<script>
import Form from "./components/Form"
import Chart from "./components/Chart"
import {isJson} from '@/utils'

export default {
  name: "CreateCPM",
  data() {
    return {
      chart_data: {},
      breadcrumbTitle: 'Back to Correlation Pattern Match List',
      default_symbol: ''
    }
  },
  components: {
    Form,
    Chart
  },
  created() {
    // 如果不携带表单参数则显示默认symbol并分段加载
    if (this.$route.params.usedFor && this.$route.params.usedFor === 'showCPMFormData'){
      this.default_symbol = ''
    }else{
      this.default_symbol = process.env.VUE_APP_DEFAULT_SYMBOL
    }
  },
  methods: {
    calculateBarDistance() {
      const _this = this
      _this.$nextTick(() => {
            _this.$refs['Form'].calculateBarDistance()
          });
      }
  }
}
</script>

<style lang="less" scoped>
.create-cpm-container {
  display: flex;
  flex-direction: column;
  grid-gap: 20px;
  margin: 0 auto;
  align-items: center;
  .chart {
    // width: 90%;
  }
  .form {
    // width: 90%;
  }
}

.form {
  background-color: #ffffff; /* 表单部分的样式 */
  font-family: "Open Sans",sans-serif;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
.form-header {
  padding: 10px 15px;
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  .form-title {
    font-weight: 300;
    font-size: 18px;
  }
}
</style>