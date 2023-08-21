<template>
	<div class="backtest_container setup_container">
    <el-form
      ref="backtestSetupForm"
      :model="bd"
      :label-position="formConfig.labelPosition"
      :label-width="formConfig.labelWidth"
      :size="formConfig.size"
      >
    </el-form>
  </div>
</template>

<script>
import { formConfig } from "./formConfig"
export default {
  name: 'BasicInfo',
  data() {
    return {
      bd: {
        name: '',
        symbol: 'SPX',
        benchmark: 'SPX',
        strategy: 'Signal',
        capital: 100000.0,
        capital_alloc: 1.0,
        commission: 0.1,
        win_rate: 0.0,
        slippage: 0.0,
        start_date: '',
        end_date: '',
        direction: 'Long',
        frequency: 'Daily',
        risk_control: '//',
        report_url: '',
        user_tag: 'client',
        backtest_period: '21',
        trade_price: 2,
        exclude_oo: 0,
        description: {
          Introduction: '',
          Rules: ''
        }
      },
      symbolList: [],
      indexList: [],
      loading: false,
      tp: 10,
      sl: 5,
      tim: 20,
      isRiskControl: true,
      isTakeProfit: false,
      isStopLoss: false,
      isTimeInMarket: true,
      sentimentIndicatorList: [],
    }
  }
}
</script>

<style>

</style>