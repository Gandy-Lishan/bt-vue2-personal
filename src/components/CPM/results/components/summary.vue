<template>
  <div class="CPM-summary-container">
    <el-row :gutter="20">
      <el-col :span="6">
          <el-statistic
            title="Symbol"
          >
          <template slot="formatter">
              <h3>{{ summary.symbol }}</h3>
          </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="Lookback Period"
        >
        <template slot="formatter">
              <h3>{{ summary.lookback_period }} Years</h3>
        </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="Observation Period"
        >
        <template slot="formatter">
              <h3>{{ summary.observation_period }}</h3>
        </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="exclude overlapping"
        >
        <template slot="formatter">
              <h3>{{ summary.exclude_overlapping }}</h3>
        </template>
        </el-statistic>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <!-- <el-statistic
            title="index filter"
          >
          <template slot="formatter">
              {{ summary.index_filter }}
          </template>
        </el-statistic> -->
        </div>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="start date"
        >
        <template slot="formatter">
              {{ summary.start_date }}
        </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="end date"
        >
        <template slot="formatter">
              {{ summary.end_date }}
        </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="exclude overlapping"
        >
        <template slot="formatter">
              {{ summary.exclude_overlapping }}
        </template>
        </el-statistic>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <!-- <el-statistic
            title="index filter swap"
          >
          <template slot="formatter">
              {{ summary.index_filter_swap }}
          </template>
        </el-statistic> -->
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <!-- <el-statistic
           title="indicator level"
          >
          <template slot="formatter">
              {{ summary.indicator_level }}
          </template>
          </el-statistic> -->
        </div>
      </el-col>
      <el-col :span="6">
        <!-- <el-statistic
          title="market environment"
        >
        <template slot="formatter">
              {{ summary.market_environment }}
        </template>
        </el-statistic> -->
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <!-- <el-statistic
            title="index ma slope"
          >
          <template slot="formatter">
              {{ summary.index_ma_slope }}
          </template>
        </el-statistic> -->
        </div>
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
        symbol: 'CRUDE',
        time_frame: 'Daily',
        indicator: 'MACD',
        lookback_period: '15',
        observation_period: '15',
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
  methods: {
    displayData(data) {
      this.summary = {
        ...this.summary,
        ...data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.CPM-summary-container {
  padding: 20px 0px;
}
  /deep/ .el-statistic .head .title {
    justify-content: center;
    font-size: 14px;
    color: #aab5bc;
    font-weight: 600;
    text-transform: uppercase;
  }
  .el-statistic .con .number {
    font-size: 18px;
    font-weight: 300;
  }
  .el-statistic .con .number h3 {
    margin: 0 0 2px 0;
    padding: 0;
    font-size: 30px;
    font-weight: 400;
  }
  /deep/ .el-statistic {
    text-align: center;
  }
</style>