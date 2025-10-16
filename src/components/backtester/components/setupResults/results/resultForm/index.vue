// Set up information in Backtest Result 
<template>
	<div class="backtest_container result-container">
		<el-form :model="backtestEditData" label-position="left" size="mini">
			<el-row :gutter="20">
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item prop="strategy" inline="true" class="strategyBox" label="Backtest Type">
							<el-input v-model="backtestEditData.strategy" disabled></el-input>
						</el-form-item>
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item
						:label="backtestEditData.strategy !== 'Dual' ? 'Symbol:' : 'Symbol(1):'"
						prop="symbol"
					>
						<el-input
							:value="getProcessedSymbol(backtestEditData.symbol)"
							disabled
						></el-input>
					</el-form-item>
					</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item label="Starting Capital:" prop="startingCapital">
						<el-input v-model="backtestEditData.capital" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item label="Commission:" prop="commission">
						<el-input v-model="backtestEditData.commission" disabled>
							<template v-slot:append>
							(%)
						</template></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item label="Slippage:" prop="slippage">
						<el-input
							v-model="temp.slippage"
							disabled
						>
						<template v-slot:append>
							(per trade)
						</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item label="Benchmark:" prop="benchmark">
						<el-input disabled v-model="backtestEditData.benchmark"> </el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item label="Timeframe:" prop="frequency">
						<el-input disabled v-model="backtestEditData.frequency"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item label="Trade Price:" prop="trade_price">
						<el-input disabled v-model="tradePrice"></el-input>
					</el-form-item>	
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">	
					<el-form-item :label="backtestEditData.strategy === 'Dual' ? 'Direction(1):' : 'Direction:'">
						<el-input disabled v-model="backtestEditData.direction"></el-input>
					</el-form-item>		
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">	
					<el-form-item label="Backtest Period:">
						<el-input disabled v-model="backtestPeriod"> </el-input>
					</el-form-item>	
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
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
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item label="End date:">
						<el-input disabled v-model="backtestEditData.end_date">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<div class="exclude_oo">
					<el-form-item label="Exclude Overlapping Observations:" prop="exclude_oo" v-if="backtestEditData.exclude_oo != 0 && backtestEditData.strategy !== 'Dual'">
						<el-input disabled v-model="backtestEditData.exclude_oo"> </el-input>
					</el-form-item>
					</div>		
					<el-form-item label="Symbol(2):" prop="symbol2" v-if="backtestEditData.strategy === 'Dual'">
						<el-input disabled v-model="backtestEditData.symbol2"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6" :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
					<el-form-item label="Direction(2):" prop="direction2" v-if="backtestEditData.strategy === 'Dual'">
						<el-input disabled v-model="backtestEditData.direction2"> </el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="Name:" prop="name">
						<el-input disabled v-model="backtestEditData.name"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script>
import { trimTrailingZeros } from '@/utils'
import {getSymbolInfo} from '@/utils/globalFunc'
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
					// 兼容之前就的 strategy
					if(newVal.strategy === 'Signal') newVal.strategy = 'Single'
					if(typeof newVal.name === 'string') {
						newVal.name = newVal.name.replace('<br/>', '')
					}
          console.log('result', newVal)
          const commission =Number(newVal.commission)
          this.temp.commission =  trimTrailingZeros(commission.toFixed(2))
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
					this.temp.slippage = trimTrailingZeros(newVal.slippage)
        } else {
          this.temp.commission = ''
          this.temp.slippage = ''
        }
      },
      immediate: true,
      deep: true
    }
  },
  	methods: {
		// 处理custom symbol的特殊url显示
		getProcessedSymbol(symbol) {
			if (!symbol) return '';
			const { name, type } = getSymbolInfo(symbol);
			return type === 'custom' ? name : symbol;
		},
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
	/deep/ .el-input--mini .el-input__inner {
		margin-left: 0px;
	}
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