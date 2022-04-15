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
							oninput="value=value.replace(/[^\d]/g,'')"
							@input="setDesciption"
						></el-input>

						<span class="tpNote">(%)</span>
					</div>
					<div class="check-box" v-if="riskIndiValue === 'pl'">
						<el-checkbox label="Stop Loss" disabled></el-checkbox>
						<el-input
							v-model="risk.stop_loss"
							@input="setDesciption"
							@change="validateStopLoss"
						></el-input>
						<span class="tpNote">(%)</span>
					</div>
					<div class="check-box" v-if="riskIndiValue === 'tim'">
						<el-checkbox label="Time In Market" disabled></el-checkbox
						><el-input
							v-model="risk.time_in_market"
							@input="setDesciption"
							oninput="value=value.replace(/[^\d]/g,'')"
						></el-input>
						<span class="tpNote">{{ timeFra }}</span>
					</div>
				</el-checkbox-group>
			</div>
		</el-form>
	</div>
</template>
<script>
import { Store, mapGetters } from 'vuex'
const _ = require('lodash')
const throttle = _.throttle
export default {
	name: 'risk',
	inheritAttrs: true,
	props: {
		criteria: String,
		panelIndex: Number,
		editableTabsValue: String,
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
				stop_loss: 10,
				ids: '',
				time_in_market: 120
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
			if (isNaN(num) || num <= 0 || num >= 101 || !/^\d+$/.test(num)) {
				{
					alert('提示', '请输入正确的数值,只允许输入小于等于100的正整数!')
				}
			}
		},
		setDesciption(index) {
			let criteria = ''
			let direction = ''
			if (this.criteria == 'exit') {
				criteria = 'X:'
				if (this.direction == 'Long') {
					direction = 'Close:'
				} else if (this.direction == 'Short') {
					direction = 'Cover:'
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
		saveCondition(index) {
			let checked = true
			// 判断有无空值
			if (
				this.risk.take_profit ||
				this.risk.stop_loss ||
				this.risk.time_in_market
			) {
				let risk = this.risk
				let riskVal = this.riskVal
				let arr = ['Take Profit', 'Stop Loss', 'Time In Market', 'Profit/Loss']
				if (riskVal == arr[0]) {
					risk.stop_loss = ''
					risk.time_in_market = ''
				} else if (riskVal == arr[1]) {
					risk.take_profit = ''
					risk.time_in_market = ''
				} else if (riskVal == arr[2]) {
					risk.take_profit = ''
					risk.stop_loss = ''
				} else if (riskVal == arr[3]) {
					risk.time_in_market = ''
				}
				risk.criteria = this.criteria
				risk.index = index
				this.$store.commit('saveCondition', risk)
				let desObj = {}
				desObj.criteria = this.criteria
				desObj.index = index
				desObj.description = this.description
				this.$store.commit('saveDescription', desObj)
				return checked
			} else {
				this.$message.error('Please Input Risk Value')
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let obj = newVal[this.criteria].signals[this.panelIndex]
				if (obj.take_profit && obj.stop_loss) {
					this.editRiskVal = 'Profit/Loss'
					this.risk.take_profit = obj.take_profit
					this.risk.stop_loss = obj.stop_loss
				} else if (obj.time_in_market) {
					this.editRiskVal = 'Time In Market'

					this.risk.time_in_market = obj.time_in_market
				} else if (obj.take_profit) {
					this.editRiskVal = 'Take Profit'
					this.risk.take_profit = obj.take_profit
				} else if (obj.stop_loss) {
					this.editRiskVal = 'Stop Loss'
					this.risk.stop_loss = obj.stop_loss
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
			width: 50px;
			font-size: 16px;
		}
	}
}
/deep/ .el-checkbox {
	width: 180px;
}
/deep/ .el-input {
	width: 22%;
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
</style>