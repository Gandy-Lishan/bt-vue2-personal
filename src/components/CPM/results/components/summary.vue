<template>
  <div class="CPM-summary-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-statistic
            title="Symbol"
          >
           <template slot="formatter">
            {{summary.symbol}}
           </template>
        </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic
           title="Indicator"
           :value="summary.indicator"
          >
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <el-statistic
          :value="summary.lookback_period"
          title="Lookback Period"
        >
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          :value="summary.observation_period"
          title="Observation Period"
        >
        </el-statistic>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'CPMSummary',
  data() {
    return {
      symbol: 'CRUDE',
      summary: {
        time_frame: 'Daily',
        indicator: 'MACD',
        lookback_period: '15 Years',
        observation_period: '15 Days',
        index_filter: 'None',
        indicator_smoothing: 'None',
        exclude_overlapping: 'True',
        index_filter_swap: 'False',
        indicator_level: 'Crossed Above 1.05',
        start_date: '2020-01-01',
        end_date: '2020-12-31',
        market_environment: 'All Market Environments',
        index_ma_slope: 'None',
      }
    };
  },
}
</script>

<style lang="less" scoped>
.CPM-summary-container {
  padding: 20px 0px;
}
  .like {
    cursor: pointer;
    font-size: 25px;
    display: inline-block;
  }
  /deep/ .el-statistic .head .title {
    justify-content: center;
  }
  /deep/ .el-statistic {
    text-align: center;
  }
</style>