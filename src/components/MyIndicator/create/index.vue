<template>
  <div class="create-indicator-container">
    <div class="chart">
      <MIChart :chart_data="chart_data"></MIChart>
    </div>
    <div class="form">
      <MIForm :formConfig="formConfig" :formData="formData" ref="MIForm" v-show="!isCreateLoading"></MIForm>
      <div v-show="isCreateLoading">
        <div class="loading">
          <span class="progress-text"><i class="el-icon-loading"></i>{{progressText}}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import MIForm from "./components/MIForm"
import MIChart from "./components/MIChart.vue"
import {capitalizeFirstLetter, isJson} from '@/utils'

export default {
  name: "CreateIndicator",
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
  computed: {
    isCreateLoading() {
      // 从 Vuex store 中获取全局 loading 状态
      return this.$store.state.isCreateLoading
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

          const sentimentList = JSON.parse(localStorage.getItem('sentimentList'))
          const symbolList = JSON.parse(localStorage.getItem('symbolList'))

          if (_data.mul_indicator && _data.indicator_weight && _data.calculate == 'weight_c') {
            const mul_indicator_obj = JSON.parse(_data.mul_indicator);
            const indicator_weight_arr = _data.indicator_weight.includes('_') ? _data.indicator_weight.split('_') : [_data.indicator_weight];
            const weightData = indicator_weight_arr.map((weight, index) => {
            const url = mul_indicator_obj[`indicator_${index + 1}`]
            const typeAttribute = mul_indicator_obj[`type_${index + 1}`] || 'indicator'
            const indicator = (typeAttribute == 'indicator') && sentimentList.find(ele => ele.url === url)?.label
            const symbol = (typeAttribute == 'symbol') && symbolList.find(ele => ele.url === url)?.label
            const result = indicator || symbol
            const type = typeAttribute ? capitalizeFirstLetter(typeAttribute) : (symbol && 'Symbol') || (indicator && 'Indicator')
              return {
              weight: (weight * 100).toFixed(2),
              indicator: result,
              indicator_url: url,
              weightValidErrMsg: '',
              type
              }
            });
            console.log('处理后的结果------', weightData);
            _data.weightData = weightData
          }
          _this.chart_data = _data
					// 展示出 indicator 那一行的数据
					_this.$refs['MIForm'].displayData(_data)
				}
			})
		} else {
			next()
		}
	},
  components: {
    MIForm,
    MIChart
  }
}
</script>

<style lang="less" scoped>
.create-indicator-container {
  display: grid;
  grid-template-rows: 1fr auto; /* 上下两行，上面占1份，下面占2份 */
  grid-gap: 20px; /* 可选，设置上下两部分之间的间隔 */
  // height: 100vh; /* 设置容器高度占满整个视口 */
}

.chart {
  background-color: #f0f0f0; /* 图表部分的样式 */
  padding: 20px;
}

.form {
  background-color: #ffffff; /* 表单部分的样式 */
  padding: 20px;
}
.loading {
  background: rgba(0, 0, 0, 0.8);
	border-radius: 5px;
	height: 100vh;
	/* opacity: 0.5; */
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	flex-direction: column;
  .progress-text{
	font-size: 12px;
	color: #409eff;
	margin-top: 10px;
	i {
		margin-right: 10px;
	}
}
}

</style>