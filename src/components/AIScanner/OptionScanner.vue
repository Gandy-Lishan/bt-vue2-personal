<template>
	<div class="gridContainer">
		<el-card class="box-card">
		<el-collapse class='collape-title'>
		<el-collapse-item>
			<template slot="title">
				<div class="title-container">
					<h2 class="page-title">Smart Option Scanner (click to expand)</h2>
					<div class="searchBox">
						<el-button class="tutorial" @click="jumpToQA" icon="el-icon-document" type="text">
							<span>Smart Option Scanner Q&A</span>
						</el-button>
					</div>
				</div>
			</template>
			<div class="description-container">
				<p>Designed exclusively for Option Sellers, this tool scans over 4,200 assets (S&P 500, Indices, ETFs) to identify premium Short Put opportunities. </p>
				<p>We target the statistical "sweet spot"—contracts with 95%–99% Probability of Profit (POP) that maintain a positive Expected Value (EV). Filter by Risk-Adjusted CAGR and EV Score to find the optimal balance between safety and yield, powered by real-time Black-Scholes analytics. </p>
				<p>Currently, the table covers option contracts for over 4,200 underlying assets, including S&P 500 components, major indices (e.g., SPX, NDX), and core ETFs. We’ll announce updates when additional underlying assets (from other market indices) are added. Helping traders target the "sweet spot" of high win rates (typically 95%–99%). </p>
				<p>By default, the table displays critical option metrics like Prob. of Profit (POP_est), Return %, and Days to Expiration (DTE) to prioritize contracts with balanced risk-reward profiles. You can refine results further using built-in filters—sort by POP_est (to focus on high-probability trades), Return % (for yield-focused picks), or DTE (to align with your time horizon). </p>
				<p>For deeper analysis, each contract has a dropdown menu that reveals additional details, including implied volatility (IV), Delta, and the full calculation logic for Break Even and Margin. All metrics (e.g., POP_est, CAGR %) are calculated using industry-standard models (Black-Scholes) and anchored to 252 trading days per year—ensuring consistency with market-wide risk and return benchmarks. These calculations, paired with real-time market data, ensure the reliability of the contract list and support informed trading decisions.</p>
			</div>
		</el-collapse-item>
		</el-collapse>
		<div class="table-header">
			<!-- 预留一个过滤器的div -->
			<div class="header-part2">
				<div class="filterBox">
					<div class="date-picker-container">
						<div class="datePicker">
							<el-date-picker
								v-model="date"
								type="date"
								size="small"
								@change="selectDate"
								placeholder="- Select Date -"
								value-format="yyyy-MM-dd"
								:picker-options="startPickerOptions"
							>
						</el-date-picker>
						</div>
						<div class="btns">
						<el-button size="small" type="info" @click="showFilterDialog = !showFilterDialog"><i class="el-icon-arrow-left el-icon-s-operation" style="margin-right: 5px;"></i>Filter</el-button>
					</div>
						</div>
				</div>
				<div class="filter-section">

				</div>
			</div>
		</div>
			<Table 
				:data="tableData" 
				:label="tableData.label" 
				:key="index" 
				:tableCol="tableData.tableCol" 
				currTabPage="OptionScanner" 
				:loading="loading"
				ref="tableChild">
			</Table>
		</el-card>

		<el-dialog
				title="Filter Criteria"
				:visible.sync="showFilterDialog"
				width="80%">
				<el-form
						ref="Form"
						:model="data"
						size="small"
						:rules="rules"
						label-position="top"
						>
						<el-row type="flex"  :gutter="20">
							<el-col :span="8">
								<el-form-item
									prop="risk_control_filter"
								class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											VOLUME:
										</label>
									</template>
									<div class="_conditionBox">
											<el-form-item prop="volumeMin" label-width="0px">
												<el-input v-model="data.volumeMin" placeholder="Min">
												</el-input>
											</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="volumeMax" label-width="0px">
												<el-input v-model="data.volumeMax" placeholder="Max">
												</el-input>
											</el-form-item>
									</div>
									</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item
									prop="risk_control_filter"
								class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											OPEN INTEREST:
										</label>
									</template>
									<div class="_conditionBox">
											<el-form-item prop="openInterestMin" label-width="0px">
												<el-input v-model="data.openInterestMin" placeholder="Min">
												</el-input>
											</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="openInterestMax" label-width="0px">
												<el-input v-model="data.openInterestMax" placeholder="Max">
												</el-input>
											</el-form-item>
									</div>
									</el-form-item>
							</el-col>
						</el-row>
						<el-row type="flex"  :gutter="20">
							<el-col :span="8">
								<el-form-item
									prop="risk_control_filter"
								class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											IMPLIED VOLATILITY:
										</label>
									</template>
									<div class="_conditionBox">
											<el-form-item prop="impliedVolatilityMin" label-width="0px">
												<el-input v-model="data.impliedVolatilityMin" placeholder="Min">
													<template v-slot:append>(%)</template>
												</el-input>
											</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="impliedVolatilityMax" label-width="0px">
												<el-input v-model="data.impliedVolatilityMax" placeholder="Max">
													<template v-slot:append>(%)</template>
												</el-input>
											</el-form-item>
									</div>
									</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item
									prop="risk_control_filter"
								class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											DELTA:
										</label>
									</template>
									<div class="_conditionBox">
											<el-form-item prop="deltaMin" label-width="0px">
												<el-input v-model="data.deltaMin" placeholder="Min">
												</el-input>
											</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="deltaMax" label-width="0px">
												<el-input v-model="data.deltaMax" placeholder="Max">
												</el-input>
											</el-form-item>
									</div>
									</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item
									prop="risk_control_filter"
								class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											VEGA:
										</label>
									</template>
									<div class="_conditionBox">
											<el-form-item prop="vegaMin" label-width="0px">
												<el-input v-model="data.vegaMin" placeholder="Min">
												</el-input>
											</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="vegaMax" label-width="0px">
												<el-input v-model="data.vegaMax" placeholder="Max">
												</el-input>
											</el-form-item>
									</div>
									</el-form-item>
							</el-col>
						</el-row>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button size="mini" type="info" @click="disableFilter">No Filter</el-button>
					<!-- <el-button size="mini" @click="resetForm">Reset Filter</el-button> -->
						<el-button size="mini" type="primary" @click="handleDialogClose">Apply Filter</el-button>
				</span>
		</el-dialog>
	</div>
</template>

<script>

const throttle = require('lodash/throttle')
const debounce = require('lodash/debounce')
import { timestampToTime } from '@/utils'
import { createPositiveScopeIntegerRule, createTPSLScopeValidateRule } from '@/utils/formValidate'
import SelectCheck from "./ScannerBacktest/SelectCheck";
import OptionData from "./OptionScanner.json";
import Table from "./Table.vue";
import { getOptionScanner } from '@/service/service'

export default {
  name: 'scannerai',
	components: {
		Table,
		SelectCheck
	},
  data() {
		var validateSignals = (rule, value, callback) => {
      if(Array.isArray(value) && value.length === 0) {
        callback(new Error('Please select at least one signal'))
      }else {
        callback()
      }
    };
    return {
    originData: {},
    tableData: {
		content: []
	},
    searchItem: '', // 搜索关键词
    searchCategory: "Symbol", // 存储选择的搜索类别
	loading: false,
	showFilterDialog: false,
	disabledFilter: true,
	data: {
		stop_loss_condition: 2,
		take_profit_condition: 2,
		time_in_market_condition: 5,
		stop_loss: 15,
		take_profit: 20,
		time_in_market: 42,
		max_risk_condition: 5,
		max_risk: 50,
		z_score_condition: 0,
		z_score: 10,
		sharpe_ratio_condition: 0,
		sharpe_ratio: 2,
		std_dev_condition: 0,
		std_dev: 10,
		expected_return_condition: 0,
		expected_return: 5,
		win_rate_condition: 52,
		win_rate: 80,
		trend_score_condition: 0,
		trend_score: 10,
		signals: ['All'],
		volumeSelect: 5,
		volumeMin: 10,
		volumeMax: '',
		openInterestMin: 100,
		openInterestMax: '',
		impliedVolatilityMin: 10,
		impliedVolatilityMax: 150,
		deltaMin: 0,
		deltaMax: 0.08,
		vegaMin: 0,
		vegaMax: 1,
	},
	options: ['All'],
	date: '',
	startPickerOptions: {
		disabledDate: this.handleDisabledStartDate
	},
	showFilterDialog: false,
	rules: {
			volumeMin: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('volume', 0, this.data.volumeMax, true, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('volume', 0, this.data.volumeMax, true, true)(rule, value, callback), trigger: 'change' }
			],
			volumeMax: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('volume', this.data.volumeMin, null, true, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('volume', this.data.volumeMin, null, true, true)(rule, value, callback), trigger: 'change' }
			],
			openInterestMin: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('OPEN INTEREST', 0, this.data.openInterestMax, true, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('OPEN INTEREST', 0, this.data.openInterestMax, true, true)(rule, value, callback), trigger: 'change' }
			],
			openInterestMax: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('OPEN INTEREST', this.data.openInterestMin, null, false, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('OPEN INTEREST', this.data.openInterestMin, null, false, true)(rule, value, callback), trigger: 'change' }
			],
			impliedVolatilityMin: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.impliedVolatilityMax, true, true, null, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.impliedVolatilityMax, true, true, null, true)(rule, value, callback), trigger: 'change' }
			],
			impliedVolatilityMax: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.impliedVolatilityMin, null, true, null, null, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.impliedVolatilityMin, null, true, null, null, true)(rule, value, callback), trigger: 'change' }
			],
			deltaMin: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.deltaMax, true, true, null, null)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.deltaMax, true, true, null, null)(rule, value, callback), trigger: 'change' }
			],
			deltaMax: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.deltaMin, null, true, null, null, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.deltaMin, null, true, null, null, true)(rule, value, callback), trigger: 'change' }
			],
			vegaMin: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.vegaMax, true, true, null, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.vegaMax, true, true, null, true)(rule, value, callback), trigger: 'change' }
			],
			vegaMax: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.vegaMin, null, true, null, null, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.vegaMin, null, true, null, null, true)(rule, value, callback), trigger: 'change' }
			],

    }
  }
  },
	async created(){	
				await this.loadData()
				if(Array.isArray(this.originData.content) && this.originData.content.length) this.date = this.originData.content[0].trade_date
 },
	beforeDestroy() {
	},
	computed: {
		is_admin() {
			return this.$store.state.user.is_admin
		}
	},
	watch: {
		originData: {
			async handler(newValue, oldValue){
				this.tableData = JSON.parse(JSON.stringify(this.originData))
				console.log('this.tableData', this.tableData)
				await this.filterData()
			},
			deep: true
		},
	},
  methods: {
	handleDisabledStartDate(time) {
			const today = timestampToTime(new Date());

			// 添加新限制：日期大于 curDate 或为周末
			const isDisabled = time.getDay() === 0 || time.getDay() === 6;

			return isDisabled || timestampToTime(time) > today
	},
	async handleDialogClose() {
		const validForm = await this.validForm('Form');
		if (!validForm) return
		this.disabledFilter = false
		this.showFilterDialog = false
		this.handleQuery();
	},
	handleQuery: throttle(async function () { this.$nextTick(async () => {await this.filterData()}) }, 1000),
	async filterData(){
		this.tableData.content =(this.filterPLSCondition(this.filterRangeCondition(this.getSearchresult())))
		this.$refs.tableChild.pageReset()
	},
	filterPLSCondition(searchResult){
		return searchResult
	},
	async validForm(formName) {
		const validateForm = async (formRef) => {
			return new Promise(resolve => {
				this.$refs[formRef].validate(valid => {
					resolve(valid);
				});
			});
		};
		return await validateForm(formName)
	},
	filterRangeCondition(searchResult){
		debugger
		if(this.showFilterDialog || this.disabledFilter) return searchResult
		console.log('searchResult', searchResult)
			const results =  searchResult.filter(item => 
			 this.compareValue(
				Number(item['Volume']),
				this.data.volumeMin,
				this.data.volumeMax
			) && this.compareValue(
				Number(item['OI']),
				this.data.openInterestMin,
				this.data.openInterestMax
			) && this.compareValue(
				parseFloat(item['IV'].replace('%', '')),
				this.data.impliedVolatilityMin,
				this.data.impliedVolatilityMax
			) && this.compareValue(
				Number(item['Delta']),
				this.data.deltaMin,
				this.data.deltaMax
			) && this.compareValue(
				Number(item['Vega']),
				this.data.vegaMin,
				this.data.vegaMax
			)
			)
			console.log(results)
			return results
	},
	getSearchresult() {
	if (!this.searchItem) {
		return this.originData.content;
	}

	const trimmedStr = this.searchItem.trim();
	const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");

	// 过滤出匹配的
	let results = this.originData.content.filter(item => {
		let searchTarget = item[this.searchCategory];
		return regex.test(searchTarget);
	});

	// 排序
	results.sort((a, b) => {
		const searchTargetA = a[this.searchCategory];
		const searchTargetB = b[this.searchCategory];

		const scoreA = this.getMatchScore(searchTargetA, trimmedStr);
		const scoreB = this.getMatchScore(searchTargetB, trimmedStr);

		if (scoreA === scoreB) {
			// 分数相同，按字母顺序
			return searchTargetA.localeCompare(searchTargetB);
		}
		return scoreB - scoreA;
	});

	return results;
},

getMatchScore(target, keyword) {
	if (!target) return 0;
	const lowerTarget = target.toLowerCase();
	const lowerKeyword = keyword.toLowerCase();

	// 完全匹配
	if (lowerTarget === lowerKeyword) return 1000;

	// 前缀匹配
	if (lowerTarget.startsWith(lowerKeyword)) return 800;

	// 子串匹配（位置越靠前优先级越高）
	const index = lowerTarget.indexOf(lowerKeyword);
	if (index !== -1) {
		return 600 - index; 
		// 位置 0 的话就是 600 分
		// 位置越靠后，分数越低
	}

	// 不匹配
	return 0;
},
	// 使用反斜杠转义特殊字符
	escapeRegExp(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	},
    //**************table filter


	async loadData(){
		let AIPickObj = {}
		AIPickObj['label'] = 'Scanner Option'
		AIPickObj['title'] = 'Scanner Option'
		AIPickObj['tableCol'] = [
			{label:'Symbol',value:'ticker',labelHtml: 'Symbol'},
			{label:'Last Close',value:'stkpx',labelHtml: 'Last<br/>Close'},
			{label:'Expire Date',value:'expirDate',labelHtml: 'Expire<br/>Date'},
			{label:'DTE',value:'DTE',labelHtml: 'DTE'},
			{label:'Strike',value:'strike',labelHtml: 'Strike'},
			{label:'Break Even',value:'be',labelHtml: 'Break<br/>Even'},
			{label:'Prob. of Profit',value:'POP_est',labelHtml: 'Prob. of Profit'},
			{label:'Credit',value:'credit',labelHtml: 'Credit'},
			{label:'Margin',value:'margin',labelHtml: 'Margin'},
			{label:'Return %',value:'return_per',labelHtml: 'Return %'},
			// {label:'Contract Symbol',value:'ContractSymbol',labelHtml: 'Contract Symbol'},
			{label:'Expected Value Score',value:'ev_score',labelHtml: 'Expected Value Score'},
			{label:'CAGR %',value:'cagr',labelHtml: 'CAGR %'},
			// {label:'Volume',value:'Volume',labelHtml: 'Volume'},
			// {label:'OI',value:'OI',labelHtml: 'OI'},
			// {label:'IV',value:'IV',labelHtml: 'IV'},
			// {label:'Delta',value:'Delta',labelHtml: 'Delta'},
			// {label:'Vega',value:'Vega',labelHtml: 'Vega'},
			// {label:'Earnings Date',value:'earnings_date',labelHtml: 'Earnings Date'}

			// 'Contract Symbol', 'ev_score', 'Volume', 'OI', 'IV','Delta', 'Vega'
		]
		const res = await getOptionScanner(this.date)
		if(Array.isArray(res.data) && res.data.length && Object.hasOwn(res.data[0], 'Latest Trade Date') && !this.date){this.date = res.data[0]['Latest Trade Date']; AIPickObj.content = []; this.originData = AIPickObj; this.tableData = AIPickObj; return;}
   AIPickObj.content = res.data.map(item => {
			for (const key in item) {
				if (Object.prototype.hasOwnProperty.call(item, key)) {
					if(key === 'stkpx') item[key] = item[key].toFixed(2)
					else if(key === 'expirDate') item[key] = item[key].split('T')[0]
					else if(['Volume', 'OI', 'DTE', 'Strike', 'Margin'].includes(key)) item[key] = this.displayData(item[key], true, 0)
					else if(['IV'].includes(key)) item[key] = `${this.displayData(item[key] * 100)}%`
					else if(['Vega', 'Delta'].includes(key)) item[key] = this.displayData(item[key], null, 4)
					else if(['POP_est', 'be', 'credit', 'ev_score', 'return_per', 'cagr'].includes(key)) item[key] = this.displayData(item[key], null, 2)
					else item[key] = this.displayData(item[key])
				}
			}
			return item
		})
		this.originData = AIPickObj
		this.tableData = AIPickObj
	},
	selected(signals){
		console.log('触发了', signals)
		this.data.signals = Array.from(new Set(signals))
	},
	resetForm() {
		this.$refs['Form'].resetFields();
		this.disabledFilter = false
		this.showFilterDialog = false
		this.handleQuery();
	},
	disableFilter() {
		this.disabledFilter = true
		this.showFilterDialog = false
		this.handleQuery();
	},
	jumpToQA() {
		const path = 'https://btv2.sentimentrader.com/doc/QA/2'
		window.open(path, '_blank')
	},
	displayData(data, removeZero = false, numberDecimal = 1) {
		const numberRegex = /^-?\d+(\.\d+)?$/
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/

		if (numberRegex.test(data)) {
			if(!removeZero) return parseFloat(data).toFixed(numberDecimal)
			// Convert to float, format to one decimal place, and remove unnecessary trailing zeros
			return parseFloat(data).toFixed(numberDecimal).replace(/\.0$/, '')
		} else if (dateRegex.test(data)) {
			return data
		} else if(typeof data == 'string'){
			return data
		}else {
			return ''
		}
	},
	async selectDate(){
		await this.loadData()
		this.handleQuery()
	},
	compareValue(targetValue, inputMin, inputMax) {
			debugger

			const normalize = (val) => {
				if (val === null || val === undefined || val === '') return null

				return parseFloat(
					String(val)
						.replace(/,/g, '')
						.replace('%', '')
				)
			}

			const target = normalize(targetValue)

			// target 空值直接通过
			if (target === null || isNaN(target)) {
				return true
			}

			const valueMin = normalize(inputMin)
			const valueMax = normalize(inputMax)

			// 最小值和最大值都没设置
			if (valueMin === null && valueMax === null) {
				return true
			}

			// 只设置最小值
			if (valueMin !== null && valueMax === null) {
				return target >= valueMin
			}

			// 只设置最大值
			if (valueMin === null && valueMax !== null) {
				return target <= valueMax
			}

			// 同时设置最小值和最大值
			return target >= valueMin && target <= valueMax
		}
 }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.gridContainer {
	display: grid;
	grid-template-columns: 100%;

	min-width: 65vw;
	background: #f9fafb;
	// padding: 50px 50px;
}

h4 {
	color: #2d3a4b;
}

.gridContainer,.box-card {
	height: fit-content;
	box-shadow: unset;
	border: unset;
}

.collape-title {
	margin-bottom: 10px;
}
.filter-section, .left-side {
 display: flex;
	align-items: center;
	justify-content: space-between;
}
.direction {
	font-weight: 600;
	color: #000000;
	margin: 0 10px 0 5px;
	align-items: center;
 display: flex
}

// filter
.table-header {
	
	.header-part1{
		display: flex;
		align-items: end;
		justify-content: space-between;
		// .categoryBtnGroup {
		// 	margin-left: 50px;
		// 	button {
		// 		width: 180px;
		// 		&.active {
		// 		/* 高亮状态的样式 */
		// 			color: #409EFF;
		// 			border-color: #c6e2ff;
		// 			background-color: #ecf5ff;	
		// 		}
		// 	}
		// }
	}
	.header-part2{
		margin-top: 10px;
	}
}

// mobile
@media only screen and (max-width: 992px) {
	.table-header {
		display: flex;
		align-items: flex-end;
		> :nth-child(1) {
			flex: 1;
			.el-input {
				width: 100%;
			}
		}
		> :nth-child(2) {
			flex: 1;
			margin-left: 8px;
			button {
				width: fit-content;
				height: 4rem;
				border-radius: 8px;
			}
		}
	}
}
.el-popper[x-placement^=right] .popper__arrow::after{
	border-right-color: aqua;
}
/deep/ .el-range-editor.el-input__inner{
	margin: 0;
	width: 100%;
}
.longShortLine{
	text-align: center;
	color: #000000;
	font-weight: 600;
}
._conditionBox {
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 0px;
      width: 100%;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
		/deep/ .el-input-group__append, .el-input-group__prepend {
			padding: 0 5px;
		}
}
._filterConditionBox /deep/ .el-select {
	width: 100%;
}
._filterConditionBox.el-form-item--small /deep/ .el-form-item__content {
	width: 100%;
}
.portfolioCheckedBox {
  border: #cacaca solid 1px;
  padding: 0 5px 0 10px;
  border-radius: 4px;
  line-height: 28px;
  border-radius: 4px;
		margin-top: 10px;
		color: #000000;
		font-weight: 600;
		font-size: 14px;
  }
  .portfolioCheckedBox a {
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    padding: 5px 5px 5px 0px
  }
  .portfolioCheckedBox a:hover {
    color: #5b9bd1;
  }
  .des-content {
    margin-top: 10px;
  }
		.btns {
			display: flex;
			justify-content: flex-end;
			margin: 10px 0px 10px 0px;
			float: right;
		}
		.sign {
			margin: 0 5px;
		}
		.datePicker {
			display: flex;
			align-items: center;
		}
		.h6-text {
			margin: 0px 0px 0px 5px;
		}
/deep/ .el-collapse-item__content {
	font-size: 16px;
	font-weight: 400;
}
._filterConditionBox {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
}
.date-picker-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	/deep/ .el-input-group {
		width: 330px;
	}
}
.tableLabel {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}
.title-container {
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
}
.description-container {
	p {
		margin: 0;
	}
}
</style>
