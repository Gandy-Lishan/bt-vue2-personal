// Set up information in Backtest Result 
<template>
	<div class="backtest_container result-container">
		<el-form :model="backtestEditData" label-position="left" size="mini">
			<el-row :gutter="20">
				<el-col :span="6">
					<el-form-item label="Starting Capital:" prop="startingCapital">
						<el-input v-model="backtestEditData.capital" disabled></el-input>
					</el-form-item>
					<el-form-item label="Timeframe:" prop="frequency">
						<el-input disabled v-model="backtestEditData.frequency"></el-input>
					</el-form-item>
					<el-form-item label="Trade Price:" prop="trade_price">
						<el-input disabled v-model="tradePrice"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="Commission:" prop="commission">
						<el-input v-model="temp.commission" disabled>
							<template v-slot:append>
								(%)
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="Backtest Period:">
						<el-input disabled v-model="backtestPeriod"> </el-input>
					</el-form-item>
					<el-form-item label="Direction:" prop="direction">
						<el-input disabled v-model="backtestEditData.direction"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="Slippage:" prop="slippage">
						<el-input
							v-model="backtestEditData.slippage"
							disabled
						>
						<template v-slot:append>
							(per trade)
						</template>
						</el-input>
					</el-form-item>
					<el-form-item
						label="Start date:"
						v-if="backtestEditData.start_date != '1800-10-01'"
					>
						<el-input disabled v-model="backtestEditData.start_date">
						</el-input>
					</el-form-item>
					<el-form-item
						label="Start date:"
						v-if="backtestEditData.start_date == '1800-10-01'"
					>
						<el-input disabled> </el-input>
					</el-form-item>
					<el-form-item
						label="Backtest Name:"
						prop="name"
						placeholder="Give the backtest a name"
            size="mini"
					>
						<el-input
							v-model="backtestEditData.name"
							disabled
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="Benchmark:" prop="benchmark">
						<el-input disabled v-model="backtestEditData.benchmark"> </el-input>
					</el-form-item>
					<el-form-item label="End date:">
						<el-input disabled v-model="backtestEditData.end_date">
						</el-input>
					</el-form-item>
					<div class="exclude_oo">
					<el-form-item label="Exclude Overlapping Observations:" prop="exclude_oo" v-if="backtestEditData.exclude_oo != 0">
						<el-input disabled v-model="backtestEditData.exclude_oo"> </el-input>
					</el-form-item>
					</div>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script>
export default {
  props: { backtestEditData: Object },
  name: 'ResForm',
  data() {
    return {
      frequencyOptions: [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' }
      ],
      mmValue: 0,
      mmOptions: [
        {
          value: 0,
          label: 'All In / All Out (CASH)'
        }
      ],
      symbolList: [],
      indexList: [],
      loading: false,
      options: [],
      temp: { commission: '', slippage: '' },
      sentimentIndicatorList: [],
			historyOptions: {
				1: '1 Year',
				2: '2 Year',
				3: '3 Year',
				4: '4 Year',
				5: '5 Year',
				6: '6 Year',
				7: '7 Year',
				8: '8 Year',
				9: '9 Year',
				10: '10 Year',
				15: '15 Year',
				20: '20 Year',
				21: 'All History',
				22: 'Custom...'
			},
			tradePriceOptions: {
				0: 'Next Open',
				1: 'Next Close',
				2: 'Current Close'
			},
			backtestPeriod: '',
			tradePrice: ''
    }
  },
  watch: {
    backtestEditData: {
      handler(newVal) {
        if (JSON.stringify(newVal) != '{}') {
          console.log('result', newVal)
          const commission = Number(newVal.commission)
          this.temp.commission = commission.toFixed(2)
					try {
						this.backtestPeriod = this.historyOptions[newVal.backtest_period]
						if(newVal.backtest_period === null || newVal.backtest_period === undefined) {
							throw Error('不存在 backtest_period')
						}
					} catch (error) {
						console.error(error)
						let year
						let month
						let day
						let backtest_period
						if (newVal.start_date && newVal.start_date !== '1800-10-01') {
							const starArr = newVal.start_date.toString().split('-')
							const endArr = newVal.end_date.toString().split('-')
							year = Number(endArr[0]) - Number(starArr[0])
							month = Number(endArr[1]) - Number(starArr[1])
							day = Number(endArr[2]) - Number(starArr[2])
							if (month == 0 && day == 0) {
								backtest_period = year + ''
 							} else {
								backtest_period = 22 + ''
							}
						} else {
							backtest_period = 21 + ''
						}
						this.backtestPeriod = this.historyOptions[backtest_period]
					}
					this.tradePrice = this.tradePriceOptions[newVal.trade_price]
        } else {
          this.temp.commission = ''
          this.temp.slippage = ''
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
/deep/
	.el-form-item.is-required:not(.is-no-asterisk)
	> .el-form-item__label:before {
	content: ' ';
	width: 0px;
	margin-right: 0px;
}
/deep/.dateBox .el-input__icon {
	width: 17px;
}
.comUnitNote {
	position: absolute;

	left: 335px;
	top: 48px;
}
.sliUnitNote {
	position: absolute;
	left: 335px;
	top: 90px;
}
.border-set {
	border-bottom: 1px solid #797979;
}
.result-container {
	padding: 40px 10px 0 10px;
	margin-bottom: 20px;
}
@media (min-width: 1680px) {
	.comUnitNote {
		position: absolute;
		left: 454px;
		top: 56px;
	}
	.sliUnitNote {
		position: absolute;
		left: 454px;
		top: 105px;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.comUnitNote {
		position: absolute;
		left: 208px;
		top: 56px;
		font-size: 12px;
	}
	.sliUnitNote {
		position: absolute;
		left: 208px;
		top: 103px;
		font-size: 12px;
	}
	.el-input__suffix {
		right: 68px;
	}
	.nameBox input[type='text']:last-child {
		width: 30%;
	}
}
</style>