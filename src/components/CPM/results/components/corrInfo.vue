<template>
  <div class="CPM-CorrInfo">
    <div class="CPM-TIM">
          <el-table
            :data="StartEndDateArray"
            show-header
            stripe
            border
            style="height: 100%; margin: 0 auto"
          >
            <el-table-column prop="StartDate" label="Start Date" align="center">
              <template slot-scope="scope">{{scope.row.StartDate}}</template>
            </el-table-column>
						<el-table-column prop="EndDate" label="End Date" align="center">
              <template slot-scope="scope">{{scope.row.EndDate}}</template>
            </el-table-column>
            <el-table-column prop="CorrelationPercentage" label="Correlation Percentage" align="center">
              <template slot-scope="scope">{{scope.row.CorrelationPercentage}}%</template>
            </el-table-column>
          </el-table>
		</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      StartEndDateArray: []
    }
  },
  methods: {
    prepareData(data) {
     this.$nextTick(() => {
      this.StartEndDateArray = data
      console.log('this.StartEndDateArray', this.StartEndDateArray)
     })
    },
    exportData() {
			return {StartEndDateArray: this.StartEndDateArray};
		}
  }
}
</script>

<style lang="less" scoped>
.CPM-CorrInfo {
  margin: 0 auto;
}
@media (min-width: 1600px) {
	.CPM-CorrInfo {
		width: 1093px
	}
}
@media (min-width: 1280px) and (max-width: 1600px) {
	.CPM-CorrInfo {
		width: 830px
	}
}
</style>