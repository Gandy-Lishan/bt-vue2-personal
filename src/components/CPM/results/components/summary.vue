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
              <h3 v-if="summary.lookback_period && summary.lookback_period != 'All'">{{ summary.lookback_period }} Years</h3>
              <h3 v-else-if="summary.lookback_period && summary.lookback_period == 'All'">{{ summary.lookback_period }} History</h3>
              <h3 v-else>{{ summary.lookback_period }}</h3>
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
          title="direction"
        >
        <template slot="formatter">
            <h3> {{ summary.direction }}</h3>
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
          title="Pattern Start Date"
        >
        <template slot="formatter">
              {{ summary.start_date }}
        </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="Pattern End Date"
        >
        <template slot="formatter">
              {{ summary.end_date }}
        </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic
          title="Correlation Percentage"
        >
        <template slot="formatter">
          <span v-if="summary.corr_per">{{ summary.corr_per }}%</span>
          <span v-else>{{ summary.corr_per }}</span>
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
import { getSymbolInfo } from '@/utils/globalFunc'
export default {
  name: 'CPMSummary',
  data() {
    return {
      summary: {
      }
    };
  },
  methods: {
    displayData(data) {
      this.summary = {
        ...data
      }
      const {name,type} = getSymbolInfo(this.summary.symbol)
      if(type == 'custom'){
        this.summary.symbol = name
      }
    }
  }
}
</script>

<style lang="less" scoped>
.CPM-summary-container {
  padding: 20px 0px 0px 0px;
}
  /deep/ .el-statistic .head .title {
    justify-content: center;
    font-size: 16px;
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