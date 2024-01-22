<template>
  <div class="create-cpm-container">
    <div class="chart">
      <Chart :chart_data="chart_data" :breadcrumbTitle="breadcrumbTitle"></Chart>
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
      breadcrumbTitle: 'Back to CPM list'
    }
  },
  beforeRouteEnter(to, from, next) {
		if (to.path === '/cpm/create') {
			next((_this) => {
				if (to.params.usedFor && to.params.usedFor === 'showCPMFormData') {
					const { data } = to.params
					const _data = isJson(data) ? JSON.parse(data) : data
          _this.chart_data = _data
					// 展示出 indicator 那一行的数据
					_this.$nextTick(() => {
            _this.$refs['Form'].displayData(_data)
          })
				}else if(from.path.includes('/cpm/results')) {
          try {
            const data = JSON.parse(sessionStorage.getItem('cpmResultsData'))
          _this.chart_data = data
					_this.$nextTick(() => {
            _this.$refs['Form'].displayData(data)
          })
          } catch (error) {
            console.error('error', error)
          }
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
  display: flex;
  flex-direction: column;
  grid-gap: 20px;
  margin: 0 auto;
  align-items: center;
  .chart {
    width: 90%;
  }
  .form {
    width: 1200px;
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