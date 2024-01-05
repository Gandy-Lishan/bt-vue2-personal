<template>
  <div class="create-cpm-container">
    <div class="chart">
      <Chart :chart_data="chart_data"></Chart>
    </div>
    <div class="form">
      <div class="form-header">
        <h3 class="form-title">Backtest Parameters</h3>
      </div>
      <Form :formConfig="formConfig" :formData="formData" ref="Form"></Form>
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
      formConfig: [
        {
          label: 'Name',
          type: 'input',
          filed: 'name'
        },
        {
          label: 'Categories',
          type: 'select',
          filed: 'categories',
          option: [
            {
              label: 'Indicator spread',
              value: 'Indicator spread'
            },
            {
              label: 'Indicator ratio',
              value: 'Indicator ratio'
            },
            {
              label: 'Symbol spread',
              value: 'Symbol spread'
            },
            {
              label: 'Symbol ratio',
              value: 'Symbol ratio'
            }
          ]
        },
        {
          type: 'autocomplete1',
          filed: 'indicator1',
        },
        {
          type: 'autocomplete2',
          filed: 'indicator2',
        },
        {
          type: 'inputWithCheckbox1',
          label: 'Moving Average',
          filed: 'ma1'
        },
        {
          type: 'inputWithCheckbox2',
          label: 'Moving Average',
          filed: 'ma2'
        },
        {
          type: 'EOInputWithCheckbox',
          label: 'Extreme Optimism',
          filed: 'extremeOptimism'
        },
        {
          type: 'EPInputWithCheckbox',
          label: 'Extreme Pessimism',
          filed: 'extremePessimism'
        }
      ],
      formData: {
        name: '',
        categories: '',
        indicator1: '',
        indicator2: '',
        ma1: '',
        ma2: '',
        extremeOptimism: '',
        extremePessimism: ''
      },
      progressText: 'Loading...'
    }
  },
  beforeRouteEnter(to, _, next) {
		if (to.path === '/myindicator/create') {
			next((_this) => {
				if (to.params.usedFor && to.params.usedFor === 'showMyIndicators') {
					console.log('说明是路由跳转过来携带参数的')
					// 说明是路由跳转过来携带参数的
					const { data } = to.params
					const _data = isJson(data) ? JSON.parse(data) : data
          _this.chart_data = _data
					// 展示出 indicator 那一行的数据
					_this.$refs['Form'].displayData(_data)
				}
			})
		} else {
			next()
		}
	},
  components: {
    Form,
    Chart
  }
}
</script>

<style lang="less" scoped>
.create-cpm-container {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  width: 80vw;
  margin: 0 auto;
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