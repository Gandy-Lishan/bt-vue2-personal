<template>
  <div class="create-indicator-container">
    <div class="chart">
      <MIChart :default_symbol='default_symbol' :chart_data="chart_data"></MIChart>
    </div>
    <div class="form">
      <MIForm :formConfig="formConfig" :formData="formData" ref="MIForm"></MIForm>
      <!-- <div v-show="isCreateLoading">
        <div class="loading">
          <span class="progress-text"><i class="el-icon-loading"></i>{{progressText}}</span>
        </div>
      </div> -->
    </div>
  </div>

</template>

<script>
import MIForm from "./components/MIForm"
import MIChart from "./components/MIChart.vue"
import {isJson} from '@/utils'

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
					_this.$refs['MIForm'].displayData(_data)
				}
			})
		} else {
			next()
		}
	},
  created() {
    // 如果不携带表单参数则显示默认symbol并分段加载
    if (this.$route.params.usedFor && this.$route.params.usedFor === 'showMyIndicators'){
      this.default_symbol = ''
    }else{
      this.default_symbol = process.env.VUE_APP_DEFAULT_SYMBOL
    }

    // vuex存储myindicator_benchmark
    const { data } = this.$route.params
		const _data = isJson(data) ? JSON.parse(data) : data
    this.$store.commit('chart/SEI_MI_BENCHMARK',_data?.benchmark)
  },
  components: {
    MIForm,
    MIChart
  },
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
  margin: 20px;
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
	font-size: 16px;
	color: #409eff;
	margin-top: 10px;
	i {
		margin-right: 10px;
	}
}
}

</style>