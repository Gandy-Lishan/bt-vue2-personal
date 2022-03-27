<template>
	<div class="senti-container">
		<el-form :model="risk">
			<!-- <div class="ids-container">
				<el-form-item label="Atr Period" prop="atr_period">
					<el-input
						v-model="risk.ids.atr_period"
						disabled
						oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
				<el-form-item label="Atr Multiplier" prop="atr_multiplier">
					<el-input
						disabled
						v-model="risk.ids.atr_multiplier"
						oninput="this.value=this.value.replace(/[^\-?\d.]/g,'')"
					></el-input>
				</el-form-item>
			</div> -->
			<div class="condition-container">
				<el-checkbox-group v-model="checkList">
					<div class="check-box" v-if="riskIndiValue === 'pl'">
						<el-checkbox label="Take Profit" disabled></el-checkbox>
						<el-input
							v-model="risk.take_profit"
							@input="setDesciption"
						></el-input>

						<p class="tpNote">(%)</p>
					</div>
					<div class="check-box" v-if="riskIndiValue === 'pl'">
						<el-checkbox label="Stop Loss" disabled></el-checkbox>
						<el-input
							v-model="risk.stop_loss"
							@input="setDesciption"
						></el-input>
						<p class="tpNote">(%)</p>
					</div>
					<div class="check-box" v-if="riskIndiValue === 'tim'">
						<el-checkbox label="Time In Market" disabled></el-checkbox
						><el-input
							v-model="risk.time_in_market"
							@input="setDesciption"
						></el-input>
						<p class="tpNote">{{ timeFra }}</p>
					</div>
				</el-checkbox-group>
			</div>
		</el-form>
	</div>
</template>
<script>
import { trix } from 'chartiq/js/advanced'
import { Store, mapGetters } from 'vuex'
const _ = require('lodash')
const throttle = _.throttle
export default {
	name: 'risk',
	inheritAttrs: true,
	props: {
		criteria: String,
		// riskUrl: String,
		timeFrame: String,
		riskVal: String,
		riskIndiValue: String,
		direction: String
	},
	// inject: ['timeFrame'],
	// computed: {
	// 	getTimeFrame() {
	// 		return this.timeFrame()
	// 	}
	// },
	watch: {
		timeFrame: {
			handler(newVal) {
				if (newVal == 'Daily') {
					this.timeFra = '(days)'
				} else if (newVal == 'Weekly') {
					this.timeFra = '(weeks)'
				} else if (newVal == 'Monthly') {
					this.timeFra = '(months)'
				} else {
					this.timeFra = '(days)'
				}
			},
			immediate: true,
			deep: true
		}
	},
	data() {
		return {
			risk: {
				take_profit: 20,
				stop_loss: 5,
				time_in_market: 120
				// indicator: 'RC',
				// analysis: 'Exit'
				//     'atr_period': '7',
				//     'atr_multiplier': '2.5'
			},
			description: '',
			editRiskVal: '',
			checkList: ['Take Profit', 'Stop Loss', 'Time In Market', 'Profit/Loss'],
			timeFra: ''
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.timeFra = '(days)'
		},
		validateStopLoss(num) {
			if (num < 0 || num > 100) {
				{
					this.$message({
						message:
							'Only positive integers less than or equal to 100 are allowed',
						type: 'error',
						offset: 300
					})
				}
				return false
			}
			const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(num) && num != 0) {
				{
					this.$message({
						message: 'Only two decimal points are allowed',
						type: 'error',
						offset: 300
					})
				}
				return false
			}
			return true
		},

		validateTakeProfit(num) {
			if (num < 0) {
				{
					this.$message({
						message: 'Only positive integers are allowed',
						type: 'error',
						offset: 300
					})
				}
				return false
			}
			const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
			if (!pattern.test(num) && num != 0) {
				{
					this.$message({
						message: 'Only two decimal points are allowed',
						type: 'error',
						offset: 300
					})
				}
				return false
			}
			return true
		},
		validateTimeInMarket(num) {
			if (isNaN(num) || num < 0 || !/^\d+$/.test(num)) {
				{
					this.$message({
						message: 'Only positive integers are allowed',
						type: 'error',
						offset: 300
					})
				}
				return false
			}
			return true
		},
		setDesciption() {
			let criteria = ''
			let direction = ''
			if (this.criteria == 'exit') {
				criteria = 'X:'
				if (this.direction == 'Long') {
					direction = 'Cover:'
				} else if (this.direction == 'Short') {
					direction = 'Close:'
				}
			}
			let riskVal = this.riskVal ? this.riskVal : this.editRiskVal
			let value1 = ''
			let value2 = ''
			let arr = ['Take Profit', 'Stop Loss', 'Time In Market', 'Profit/Loss']
			if (this.timeFrame)
				if (riskVal == arr[0]) {
					value1 = this.risk.take_profit + '%'
				} else if (riskVal == arr[1]) {
					value1 = this.risk.stop_loss + '%'
				} else if (riskVal == arr[2]) {
					value1 = this.risk.time_in_market + this.timeFra
				} else if (riskVal == arr[3]) {
					value1 = this.risk.take_profit + '%'
					value2 = this.risk.stop_loss + '%'
				}
			this.description = `${criteria} ${direction} ${riskVal} ${value1}`
			if (value2 && riskVal == arr[3]) {
				this.description = `${criteria} ${direction} Profit ${value1} / Loss ${value2}`
			}
		},
		saveCondition() {
			let checked = true
			// 判断有无空值
			let valid = true
			if (this.riskVal === 'Profit/Loss') {
				valid =
					this.validateStopLoss(this.risk.stop_loss) &&
					this.validateTakeProfit(this.risk.take_profit)
			} else {
				valid = this.validateTimeInMarket(this.risk.time_in_market)
			}
			if (valid) {
				let risk = this.risk
				let riskVal = this.riskVal
				let arr = ['Take Profit', 'Stop Loss', 'Time In Market', 'Profit/Loss']
				if (riskVal == arr[0]) {
					delete risk.stop_loss
					delete risk.time_in_market
				} else if (riskVal == arr[1]) {
					delete risk.take_profit
					delete risk.time_in_market
				} else if (riskVal == arr[2]) {
					delete risk.take_profit
					delete risk.stop_loss
				} else if (riskVal == arr[3]) {
					delete risk.time_in_market
				}
				risk.criteria = this.criteria
				risk.index = 0
				this.$store.commit('saveCondition', risk)
				let desObj = {}
				desObj.criteria = this.criteria
				desObj.description = this.description
				this.$store.commit('saveDescription', desObj)
				return checked
			} else {
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				if (
					newVal.exit.signals[0].sc.take_profit &&
					newVal.exit.signals[0].sc.stop_loss
				) {
					this.editRiskVal = 'Profit/Loss'
					this.risk.take_profit =
						newVal[this.criteria].signals[0].sc.take_profit
					this.risk.stop_loss = newVal[this.criteria].signals[0].sc.stop_loss
				} else if (newVal.exit.signals[0].sc.time_in_market) {
					this.editRiskVal = 'Time In Market'

					this.risk.time_in_market =
						newVal[this.criteria].signals[0].sc.time_in_market
				} else if (newVal.exit.signals[0].sc.take_profit) {
					this.editRiskVal = 'Take Profit'
					this.risk.take_profit =
						newVal[this.criteria].signals[0].sc.take_profit
				} else if (newVal.exit.signals[0].sc.stop_loss) {
					this.editRiskVal = 'Stop Loss'
					this.risk.stop_loss = newVal[this.criteria].signals[0].sc.stop_loss
				}
				this.setDesciption()
			}
		}
	}
}
</script>
<style lang="less" scoped>
.ids-container {
	display: flex;
	flex-wrap: wrap;
	.el-form-item {
		display: inline-flex;
	}
	border-bottom: 1px solid #797979;
}
.condition-container {
	border-top: 1px solid #797979;
	padding-top: 10px;
	display: flex;
	flex-direction: column;
	.check-box {
		display: flex;
		margin-bottom: 10px;
		.tpNote {
			font-size: 16px;
			margin: 0px 0px 0px 25px;
		}
	}
}
/deep/.el-input {
	width: 15%;
}
/deep/.el-checkbox {
	width: 120px;
}
/deep/ .el-input__inner {
	padding-left: 5px;
	margin-left: 5px;
}
/deep/.el-input--suffix .el-input__inner {
	padding-right: 5px;
}
/deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
	color: #409eff;
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
	color: #409eff;
	background-color: #409eff;
}
@media (min-width: 375px) and (max-width: 767px) {
	.condition-container .check-box .tpNote {
		font-size: 16px;
		margin: 0px 0px 0px 42px;
	}
}
</style>