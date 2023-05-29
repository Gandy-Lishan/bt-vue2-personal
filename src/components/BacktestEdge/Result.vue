// Set up information in Backtest Result 
<template>
	<div class="backtest_container result-container">
		<el-form :model="backtestEditData" label-position="left">
			<el-row>
				<el-col :xs="15" :sm="14" :md="12" :lg="12" :xl="12">
					<el-form-item label="Starting Capital:" prop="startingCapital">
						<el-input v-model="backtestEditData.capital" disabled></el-input>
					</el-form-item>
					<el-form-item label="Commission:" prop="commission">
						<el-input v-model="temp.commission" disabled></el-input>
					</el-form-item>
					<span class="comUnitNote">(%)</span>
					<el-form-item label="Slippage:" prop="slippage">
						<el-input
							v-model="backtestEditData.slippage"
							disabled
						></el-input> </el-form-item
					><span class="sliUnitNote">(per trade)</span>
					<el-form-item label="Benchmark:" prop="benchmark">
						<el-input disabled v-model="backtestEditData.benchmark"> </el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="15" :sm="14" :md="12" :lg="12" :xl="12" :span="2">
					<div class="dateBox">
						<el-form-item label="Start date:">
							<el-input disabled v-model="backtestEditData.start_date">
							</el-input>
						</el-form-item>
					</div>
					<div class="dateBox">
						<el-form-item label="End date:">
							<el-input disabled v-model="backtestEditData.end_date">
							</el-input>
						</el-form-item>
					</div>
					<el-form-item label="Timeframe:" prop="frequency">
						<!-- <div class="selectBox"> -->
							<!-- <el-select
								v-model="editFrequency"
								placeholder="— Select Timeframe —"
								disabled
							>
								<el-option
									v-for="item in frequencyOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</div> -->
						<el-input disabled v-model="editFrequency"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<div class="nameBox border-set">
					<el-form-item
						label="Backtest Name:"
						prop="name"
						placeholder="Give the backtest a name"
					>
						<el-input
							v-model="backtestEditData.name"
							disabled
							style="width: 720px"
						></el-input>
					</el-form-item>
				</div>
			</el-row>
		</el-form>
	</div>
</template>
<script>
export default {
	props: { backtestEditData: Object, editFrequency: String },
	name: 'setUp',
	data() {
		return {
			historyOptions: [
				{
					value: 1,
					label: '1 Year'
				},
				{
					value: 2,
					label: '2 Year'
				},
				{
					value: 3,
					label: '3 Year'
				},
				{
					value: 4,
					label: '4 Year'
				},
				{
					value: 5,
					label: '5 Year'
				},
				{
					value: 10,
					label: '10 Year'
				},
				{
					value: 15,
					label: '15 Year'
				},
				{
					value: 20,
					label: '20 Year'
				},
				{
					value: 21,
					label: 'All History'
				},
				{
					value: 22,
					label: 'Custom...'
				}
			],
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
			historyValue: 1,
			symbolList: [],
			indexList: [],
			loading: false,
			options: [],
			temp: { commission: '', slippage: '' },
			sentimentIndicatorList: []
		}
	},
	watch: {
		backtestEditData: {
			handler(newVal) {
				if (JSON.stringify(newVal) != '{}') {
					console.log('result', newVal)
					const commission = Number(newVal.commission)
					this.temp.commission = commission.toFixed(2)
				}else{
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
	top: 56px;
}
.sliUnitNote {
	position: absolute;
	left: 335px;
	top: 105px;
}
.border-set {
	border-bottom: 1px solid #797979;
}
.result-container {
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
	.nameBox input[type="text"]:last-child{
		width: 30%;
	}
}
</style>