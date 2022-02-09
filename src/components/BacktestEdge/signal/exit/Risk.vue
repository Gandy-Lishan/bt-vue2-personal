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
					<div
						class="check-box"
						v-if="riskIndiValue === 'tp' || riskIndiValue === 'pl'"
					>
						<el-checkbox label="Take Profit"></el-checkbox>
						<el-input
							v-model="risk.take_profit"
							@input="setDesciption"
						></el-input>

						<span class="tpNote">(%)</span>
					</div>
					<div
						class="check-box"
						v-if="riskIndiValue === 'sl' || riskIndiValue === 'pl'"
					>
						<el-checkbox label="Stop Loss"></el-checkbox>
						<el-input
							v-model="risk.stop_loss"
							@input="setDesciption"
						></el-input>
						<span class="tpNote">(%)</span>
					</div>
					<div class="check-box" v-if="riskIndiValue === 'tim'">
						<el-checkbox label="Time in Market"></el-checkbox
						><el-input
							v-model="risk.time_in_market"
							@input="setDesciption"
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
				console.log('timeFrame', newVal)
				if (newVal == 'Daily') {
					this.timeFra = '(days)'
				} else if (newVal == 'Weekly') {
					this.timeFra = '(weeks)'
				} else if (newVal == 'Monthly') {
					this.timeFra = 'months'
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
			},
			description: '',
			editRiskVal: '',
			checkList: ['Take Profit'],
			timeFra: 'days'
		}
	},
	methods: {
		setDesciption() {
			let criteria = ''
			if (this.criteria == 'exit') {
				criteria = 'X:'
			}
			let direction = this.direction + ':'
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
			console.log('描述', this.description)
		}
		// saveCondition() {
		// 	let checked = true
		// 	if (this.risk.value) {
		// 		let ids = {
		// 			over_bought_bound: 100,
		// 			over_sold_bound: -100,
		// 			period: 20
		// 		}
		// 		let risk = this.risk
		// 		delete risk.ids
		// 		risk = Object.assign(ids, risk)
		// 		risk.criteria = this.criteria
		// 		risk.index = 0
		// 		this.$store.commit('saveCondition', risk)
		// 		let desObj = {}
		// 		desObj.criteria = this.criteria
		// 		desObj.description = this.description
		// 		this.$store.commit('saveDescription', desObj)
		// 		return checked
		// 	} else {
		// 		this.$message.error('Please Input Value')
		// 		checked = false
		// 		return checked
		// 	}
		// },
		// setEditData(newVal) {
		// 	if (JSON.stringify(newVal) != '{}') {
		// 		this.risk.ids = newVal[this.criteria].signals[0].ids
		// 		this.risk.condition = Number(newVal[this.criteria].signals[0].condition)
		// 		this.risk.value = newVal[this.criteria].signals[0].value
		// 		this.editRiskVal = newVal[this.criteria].signals[0].indicator
		// 		this.setDesciption()
		// 	}
		// }
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
</style>