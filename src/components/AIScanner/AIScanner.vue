<template>
	<div class="gridContainer">
		<el-card class="box-card">
		<el-collapse class='collape-title'>
		<el-collapse-item>
			<template slot="title">
			Click here to view Smart Stock Scanner Description<i class="header-icon el-icon-info"></i>
			</template>
			<h4>Our Smart Stock Scanner is updated nightly by 11:40 PM Eastern Time. This system is designed to provide you with a list of stocks that have triggered a "Signal-for-Action", worthy of consideration for trading at the opening of the next market day. Currently, our system can scan the 1500 S&P stocks. We will announce when additional stocks from other market indices are included.</h4>
			<div>•	The system’s default setting displays the “end of today” shortlisting results. You can find historical results by selecting start and end dates from the past.</div>
			<div>•	Since our scan includes all stocks that trigger a signal, we've built a filter that sorts the list to show only "take profit > stop loss"</div>
			<div>•	The list can also be filtered by entering a symbol or a specific signal for a specific day or period of time.</div>
			<div>•	In addition to the default display of key metrics, there's a dropdown menu for each stock that displays additional metrics.</div>
			<div>•	By clicking on the stock symbol, the system will direct you to detailed historical backtest results and a summary of key metrics for that stock. These backtest results ensure the reliability and accuracy of the "Signal-for-Action" list displayed by our system.</div>
		</el-collapse-item>
		</el-collapse>
		<div class="table-header">
			<div class='header-part1'>
				<div class="tableLabel">
					<h4>Daily Picks at the end of today</h4>
				</div>

				<div class="searchBox">
					<h6>Today's pick will be completed by 11:40pm US Eastern Time .</h6>
					<el-input 
						placeholder="" 
						v-model="searchItem" 
						class="search"
						@input="handleQuery"
						clearable
						@clear="handleQuery"
					>
						<span slot="prepend" style="padding: 0 5px;">{{searchCategory}}</span>
						<el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
					</el-input>
					<el-button @click="toScannerBacktest" type="warning" round size="mini" style="float: right; margin: 20px 5px 0px 10px; cursor: pointer;"><i class="el-icon-arrow-left el-icon-s-promotion" style="margin-right: 5px;"></i>Smart Scanner Backtest</el-button>
					<el-button @click="exportTable" type="primary" round size="mini" style="float: right; margin-top: 20px;"><i class="el-icon-arrow-left el-icon-download" style="margin-right: 5px;"></i>Export table</el-button>
				</div>
			</div>
			<!-- 预留一个过滤器的div -->
			<div class="header-part2">
				<div class="filterBox _filterConditionBox">
					<el-row :gutter="20">
						<el-col :span="6">
							<el-date-picker
								v-model="date"
								class="aiscanner-date"
								type="daterange"
								unlink-panels
								range-separator="to"
								start-placeholder="Start date"
								end-placeholder="End date"
								:picker-options="pickerOptions"
								@change="selectDate"
								value-format="yyyy-MM-dd"
							>
							</el-date-picker>
						</el-col>
						<el-col :span="6">
							<el-checkbox v-model="isPLSChecked" @change="PLSChecked"
								>Only Show Profit Target > Stop Loss
							</el-checkbox>
						</el-col>
						<el-col :span="6">
							<label for="radioGroup" class="direction">Direction: </label>
							<el-radio-group id="radioGroup" v-model="isShowShortChecked" @change="ShowShortChecked">
								<el-radio :label='false'>Long</el-radio>
								<el-radio :label='true'>Short</el-radio>
							</el-radio-group>
						</el-col>
					</el-row>
					<!-- <el-checkbox v-model="isShowShortChecked" @change="ShowShortChecked"
						>Only Show Direction Is Short
					</el-checkbox> -->
				</div>
			</div>
			<div class="header-part">
				<div class="portfolioCheckedBox">
					<a @click="isFilter = !isFilter" style="cursor: pointer;"
						>Filter Criteria<i :class="isFilter ? 'el-icon-minus' : 'el-icon-plus'"></i></a>
					<div class="des-content" v-show="isFilter">
						<el-form
						ref="Form"
						:model="data"
						label-position="top"
						size="small"
						:rules="rules"
						style="margin-top: 10px;"
						>
						<el-row type="flex" :gutter="20" justify="center" align="middle">
							<el-col :span="6">
								<el-form-item
								prop="signals"
								class="_filterConditionBox"
								>
								<template slot="label">
								<label>
									Signals Filters:
								</label>
								</template>
									<SelectCheck ref="SelectCheck" :options="options" @selected="selected"/>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item
								prop="risk_control_filter"
								class="_filterConditionBox"
								>
								<template slot="label">
									<label>
										Profit Target Range:
									</label>
								</template>
								<div class="_conditionBox">
								<el-form-item prop="take_profit_condition" label-width="0px">
										<el-input v-model="data.take_profit_condition" placeholder="Enter number">
											<template v-slot:append>(%)</template>
										</el-input>
								</el-form-item>
									<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
								<el-form-item prop="take_profit" label-width="0px">
								<el-input v-model="data.take_profit" placeholder="Enter number">
									<template v-slot:append>(%)</template>
								</el-input>
								</el-form-item>
								</div>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item
								prop="risk_control_filter"
								class="_filterConditionBox"
								>
								<template slot="label">
									<label>
										Stop Loss Range:
									</label>
								</template>
								<div class="_conditionBox">
									<el-form-item prop="stop_loss_condition" label-width="0px">
											<el-input v-model="data.stop_loss_condition" placeholder="Enter number">
												<template v-slot:append>(%)</template>
											</el-input>
									</el-form-item>
										<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
										<el-form-item prop="stop_loss" label-width="0px">
										<el-input v-model="data.stop_loss" placeholder="Enter number">
											<template v-slot:append>(%)</template>
										</el-input>
										</el-form-item>
								</div>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item
								prop="risk_control_filter"
								class="_filterConditionBox"
								>
								<template slot="label">
									<label>
										Time In Market Range:
									</label>
								</template>
								<div class="_conditionBox">
								<el-form-item prop="time_in_market_condition" label-width="0px">
										<el-input v-model="data.time_in_market_condition" placeholder="Enter number">
											<template v-slot:append>(bars)</template>
										</el-input>
								</el-form-item>
									<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
								<el-form-item prop="time_in_market" label-width="0px">
								<el-input v-model="data.time_in_market" placeholder="Enter bars">
									<template v-slot:append>(bars)</template>
								</el-input>
								</el-form-item>
								</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row type="flex"  :gutter="20">
							<el-col :span="6">
								<el-form-item
									prop="risk_control_filter"
									class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											Max Risk Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="max_risk_condition" label-width="0px">
												<el-input v-model="data.max_risk_condition" placeholder="Enter number">
													<template v-slot:append>(%)</template>
												</el-input>
										</el-form-item>
											<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
											<el-form-item prop="max_risk" label-width="0px">
											<el-input v-model="data.max_risk" placeholder="Enter number">
												<template v-slot:append>(%)</template>
											</el-input>
											</el-form-item>
									</div>
									</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item
									prop="risk_control_filter"
									class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											Z-Score Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="z_score_condition" label-width="0px">
												<el-input v-model="data.z_score_condition" placeholder="Enter number">
												</el-input>
										</el-form-item>
											<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
											<el-form-item prop="z_score" label-width="0px">
											<el-input v-model="data.z_score" placeholder="Enter number">
											</el-input>
											</el-form-item>
									</div>
									</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item
									prop="risk_control_filter"
									class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											Sharpe Ratio Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="sharpe_ratio_condition" label-width="0px">
												<el-input v-model="data.sharpe_ratio_condition" placeholder="Enter number">
												</el-input>
										</el-form-item>
											<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
											<el-form-item prop="sharpe_ratio" label-width="0px">
											<el-input v-model="data.sharpe_ratio" placeholder="Enter number">
											</el-input>
											</el-form-item>
									</div>
									</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item
									prop="risk_control_filter"
									class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											STD.DEV Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="std_dev_condition" label-width="0px">
												<el-input v-model="data.std_dev_condition" placeholder="Enter number">
												</el-input>
										</el-form-item>
											<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
											<el-form-item prop="std_dev" label-width="0px">
											<el-input v-model="data.std_dev" placeholder="Enter number">
											</el-input>
											</el-form-item>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="6">
								<el-form-item
									prop="risk_control_filter"
									class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											Expected Return Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="expected_return_condition" label-width="0px">
												<el-input v-model="data.expected_return_condition" placeholder="Enter number">
												<template v-slot:append>(%)</template>
												</el-input>
										</el-form-item>
											<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
											<el-form-item prop="expected_return" label-width="0px">
											<el-input v-model="data.expected_return" placeholder="Enter number">
												<template v-slot:append>(%)</template>
											</el-input>
											</el-form-item>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item
									prop="risk_control_filter"
									class="_filterConditionBox"
									>
									<template slot="label">
										<label>
											Win Rate Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="win_rate_condition" label-width="0px">
												<el-input v-model="data.win_rate_condition" placeholder="Enter number">
												<template v-slot:append>(%)</template>
												</el-input>
										</el-form-item>
											<span class="sign">&nbsp;&nbsp;to&nbsp;&nbsp;</span>
											<el-form-item prop="win_rate" label-width="0px">
											<el-input v-model="data.win_rate" placeholder="Enter number">
												<template v-slot:append>(%)</template>
											</el-input>
											</el-form-item>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						</el-form>
					</div>
				</div>
			</div>
		</div>
			<Table 
				:data="tableData" 
				:label="tableData.label" 
				:key="index" 
				:tableCol="tableData.tableCol" 
				currTabPage="AIRecommendation" 
				:loading="loading"
				ref="tableChild">
			</Table>
		</el-card>
	</div>
</template>

<script>

const throttle = require('lodash/throttle')
const debounce = require('lodash/debounce')
import { getAIPick } from '@/service/ai'
import { timestampToTime } from '@/utils'
import { createPositiveScopeIntegerRule, createTPSLScopeValidateRule } from '@/utils/formValidate'
import SelectCheck from "./ScannerBacktest/SelectCheck";

import Table from "./Table.vue";

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
	  tableData: {},
	  curDate: '',
	  
	//table filter:
	// date selector
	  date: [],
	  pickerOptions: {
		disabledDate: this.disabledDate,
	  },
	// search bar
	  searchItem: '', // 搜索关键词
	  searchCategory: "Symbol", // 存储选择的搜索类别

	midTermMap: {
		'Symbol Close > its\' MA200 and Optix MA5 < 35':'Optix #1',
		'Symbol Close > its\' MA200 and Optix < 30':'Optix #2',
		'Optix MA10 < 30 and Optix < 20':'Optix #3',
		'Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35':'Optix #5',
		'Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35':'Optix #6',
		'Symbol Close > its\' MA200 and Optix > 43 After Below 30':'Optix #7',
	},
	isPLSChecked: false,
	isShowShortChecked: false,
	loading: false,
	isFilter: false,
	data: {
		stop_loss_condition: 0,
		take_profit_condition: 0,
		time_in_market_condition: 5,
		stop_loss: 15,
		take_profit: 20,
		time_in_market: 21,
		max_risk_condition: 0,
		max_risk: 50,
		z_score_condition: -1,
		z_score: 5,
		sharpe_ratio_condition: 0,
		sharpe_ratio: 1,
		std_dev_condition: 0,
		std_dev: 10,
		expected_return_condition: 0,
		expected_return: 20,
		win_rate_condition: 55,
		win_rate: 80,
		signals: ['All']
	},
	options: ['All'],
	typeOptions: [
		{ value: 'stock', label: 'Stock' },
		{ value: 'etf', label: 'ETF' },
		{ value: 'stock/etf', label: 'Stock & ETF' },
	],
	directionOptions: [
		{value: false, label: 'Long'},
		{value: true, label: 'Short'}
	],
	rules: {
			time_in_market_condition: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('time in market', 0, this.data.time_in_market, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('time in market', 0, this.data.time_in_market, true)(rule, value, callback), trigger: 'change' }
			],
			time_in_market: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('time in market', this.data.time_in_market_condition)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('time in market', this.data.time_in_market_condition)(rule, value, callback), trigger: 'change' }
			],
			stop_loss_condition: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.stop_loss, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.stop_loss, true, true)(rule, value, callback), trigger: 'change' }
			],
			stop_loss: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.stop_loss_condition, 100, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.stop_loss_condition, 100, true)(rule, value, callback), trigger: 'change' }
			],
			take_profit_condition: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.take_profit, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.take_profit, true, true)(rule, value, callback), trigger: 'change' }
			],
			take_profit: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.take_profit_condition, 100, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.take_profit_condition, 100, true)(rule, value, callback), trigger: 'change' }
			],
			max_risk_condition: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.max_risk, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.max_risk, true, true)(rule, value, callback), trigger: 'change' }
			],
			max_risk: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.max_risk_condition, 100, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.max_risk_condition, 100, true)(rule, value, callback), trigger: 'change' }
			],
			z_score_condition: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(null, this.data.z_score, true, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(null, this.data.z_score, true, true, true)(rule, value, callback), trigger: 'change' }
			],
			z_score: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.z_score_condition, null, true, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.z_score_condition, null, true, true, true)(rule, value, callback), trigger: 'change' }
			],
			sharpe_ratio_condition: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(null, this.data.sharpe_ratio, true, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(null, this.data.sharpe_ratio, true, true, true)(rule, value, callback), trigger: 'change' }
			],
			sharpe_ratio: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.sharpe_ratio_condition, null, true, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.sharpe_ratio_condition, null, true, true, true)(rule, value, callback), trigger: 'change' }
			],
			std_dev_condition: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(null, this.data.std_dev, true, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(null, this.data.std_dev, true, true, true)(rule, value, callback), trigger: 'change' }
			],
			std_dev: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.std_dev_condition, null, true, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.std_dev_condition, null, true, true, true)(rule, value, callback), trigger: 'change' }
			],
			expected_return_condition: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.expected_return, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.expected_return, true, true)(rule, value, callback), trigger: 'change' }
			],
			expected_return: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.expected_return_condition, 100, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.expected_return_condition, 100, true)(rule, value, callback), trigger: 'change' }
			],
			win_rate_condition: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.win_rate, true, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(0, this.data.win_rate, true, true)(rule, value, callback), trigger: 'change' }
			],
			win_rate: [
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.win_rate_condition, 100, true)(rule, value, callback), trigger: 'blur' },
			{ validator: (rule, value, callback) => createTPSLScopeValidateRule(this.data.win_rate_condition, 100, true)(rule, value, callback), trigger: 'change' }
			],
			signals: [
				{ validator: validateSignals, trigger: 'blur' },
				{ validator: validateSignals, trigger: 'change' },
			]
    }
  }
  },
  async created(){	
	// 进入组件时还原筛选条件状态
	const state = this.$store.getters.getScannerAIFilterState

	this.curDate = this.$store.state.chart.curDate
	this.date = state?.date || [this.curDate,this.curDate]

	this.searchItem = state?.searchItem || ''
	this.searchCategory = state?.searchCategory || 'Symbol'
	this.isPLSChecked = state?.isPLSChecked || false
	//首先初始化数据
	this.loadData('US')
},
	beforeDestroy() {
		// 离开此组件前保存筛选条件状态
		this.$store.dispatch('states/set_scannerai_filter_state',{
			searchItem:this.searchItem,
			searchCategory:this.searchCategory,
			isPLSChecked:this.isPLSChecked,
			date:this.date,
		})
	},
	computed: {
		is_admin() {
			return this.$store.state.user.is_admin
		}
	},
	watch: {
		// 数据源更新时tableData同时响应,只会在getAIPick时获取originData
		originData: {
			async handler(newValue, oldValue){
				this.tableData = JSON.parse(JSON.stringify(this.originData))
				this.options = [...Array.from(new Set(this.tableData.content.map(ele => ele._Signal).filter(ele => ele !== undefined && ele !== null && ele !== ''))).map(item => ({label: item, value: item, check: true}))]
				this.data.signals = ['All']
        this.$refs['SelectCheck'].optionsAll = true
				await this.filterData()
				console.log('this.options', this.options)
			},
			deep: true
		},
		data: {
			handler: debounce(async function (newValue, oldValue) {
				console.log('data change', newValue);
				
				const validForm = await this.validForm('Form');
				if (!validForm) {
					return;
				}
				this.handleQuery();
			}, 500), // 500ms 的 debounce 时间，可根据需求调整
			deep: true
		},
		isFilter: {
			handler: debounce(async function (newValue, oldValue) {
				console.log('data change', newValue);
				if(!newValue) {
					this.handleQuery()
					return
				}else {
					const validForm = await this.validForm('Form');
					if (!validForm) {
						return;
					}
					this.handleQuery();
				}
			}, 500)
		}
	},
  methods: {
	scannerBacktest() {
	},
	// table filter*********
	disabledDate(time) {
		let dis = timestampToTime(time) > this.curDate || (time.getDay() === 0 || time.getDay() === 6)
		return dis
	},

	handleQuery: throttle(async function () { await this.filterData() }, 1000),
	async filterData(){
		this.tableData.content = this.filterShowShortCondition(this.filterPLSCondition( this.filterRangeCondition(this.getSearchresult())))
		console.log('signals', this.tableData.content.map(item => item._Signal))
		this.$refs.tableChild.pageReset()
	},
	filterPLSCondition(searchResult){
		if (this.isPLSChecked) {
			// 当checkbox勾选时，返回被筛选过的数据
			return searchResult
					.filter(item=>parseFloat(item["ProfitTarget"])>parseFloat(item['StopLoss']));
		}
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
		if(!this.isFilter) return searchResult
		const {stop_loss_condition, stop_loss, 
			take_profit_condition, take_profit, 
			time_in_market_condition, time_in_market,
			signals,
			max_risk_condition, max_risk,
			z_score_condition, z_score,
			sharpe_ratio_condition, sharpe_ratio,
			std_dev_condition, std_dev,
			expected_return_condition, expected_return,
			win_rate_condition, win_rate
		} = this.data
		console.log('this.data', this.data)
		console.log('signals filter', signals)
		console.log('signals options', this.options)
		const condition = (signals.length === 1 && signals[0] === 'All') || (signals.length === 0)
		return searchResult
		.filter(item=>(
			(item['StopLoss'] === null || (parseFloat(stop_loss_condition)<=parseFloat(item['StopLoss']) && parseFloat(stop_loss)>=parseFloat(item['StopLoss'])))
			&& (item['ProfitTarget'] === null || (parseFloat(take_profit_condition)<=parseFloat(item['ProfitTarget']) && parseFloat(take_profit)>=parseFloat(item['ProfitTarget'])))
			&& (item['TimeInMarket'] === null ||(parseFloat(time_in_market_condition)<=parseFloat(item['TimeInMarket']) && parseFloat(time_in_market)>=parseFloat(item['TimeInMarket'])))
			&& (condition || signals.includes(item['_Signal']))
			&& (item['MaxRisk'] === null  || (parseFloat(max_risk_condition)<=parseFloat(item['MaxRisk']) && parseFloat(max_risk)>=parseFloat(item['MaxRisk'])))
			&& (item['Z_Score'] === null  || (parseFloat(z_score_condition)<=parseFloat(item['Z_Score']) && parseFloat(z_score)>=parseFloat(item['Z_Score'])))
			&& (item['SharpeRatio'] === null  || (parseFloat(sharpe_ratio_condition)<=parseFloat(item['SharpeRatio']) && parseFloat(sharpe_ratio)>=parseFloat(item['SharpeRatio'])))
			&& (item['StdDev'] === null  ||  (parseFloat(std_dev_condition)<=parseFloat(item['StdDev']) && parseFloat(std_dev)>=parseFloat(item['StdDev'])))
			&& (item['ExpectedReturn'] === null  || (parseFloat(expected_return_condition)<=parseFloat(item['ExpectedReturn']) && parseFloat(expected_return)>=parseFloat(item['ExpectedReturn'])))
			&& (item['WinRate'] === null  || ( parseFloat(win_rate_condition)<=parseFloat(item['WinRate']) && parseFloat(win_rate)>=parseFloat(item['WinRate'])))
		))
	},
	filterShowShortCondition(searchResult){
		debugger
		if (this.isShowShortChecked) {
			// 当checkbox勾选时，返回被筛选过的数据
			return searchResult
					.filter(item=>item["Direction"] == 'Short');
		}
		return searchResult.filter(item=>item["Direction"] == 'Long');
	},
	getSearchresult(){
		if(this.searchItem){
			// 在搜索之前对搜索关键词进行转义
			const trimmedStr = this.searchItem.trim()
			const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");
			return this.originData.content.filter(item => {
				let searchTarget = this.midTermMap[item[this.searchCategory]]?this.midTermMap[item[this.searchCategory]]:item[this.searchCategory]
				return regex.test(searchTarget)
			});
			//this.tableData.content = this.data.content.filter(item=>item[this.searchCategory].toLowerCase().indexOf(this.searchItem.toLowerCase())!=-1)
		}else{
			return this.originData.content
		}
	},
	// 使用反斜杠转义特殊字符
	escapeRegExp(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	},
	PLSChecked(){
		this.handleQuery()
	},
	ShowShortChecked(){
		this.handleQuery()
	},
    //**************table filter


	async loadData(marketType){
		//this.activeIndex = index
		if(marketType=='US'){
			this.getAIPick()
		}
	},
	async getAIPick(){
		this.loading = true
		let AIPickContent = await getAIPick(this.date || [this.curDate,this.curDate])
		
		// let AIPickContentString = JSON.stringify(AIPickContent)
		// 						.replace(/TimeInMarket/g,'Best Time In Market(Bars)')
		// 						.replace(/_Signal/g,'Signal')
		// 						.replace(/Alloc/g,'Cash Alloc(%)')
		// 						.replace(/StopLoss/g,'Stop Loss(%)')
		// 						.replace(/ProfitTarget/g,'Profit Target(%)')
		// 						.replace(/WinRate/g,'Win Rate(%)')
		// 						.replace(/Z_Score/g,'Z-Score')
		// 						.replace(/ExpectedReturn/g,'Expected Return(%)')

		// AIPickContent = JSON.parse(AIPickContentString)	
		AIPickContent.forEach(x=>{
			x['Close'] = x['Close'].toFixed(2)
			x['Alloc'] = (x['Alloc']*100).toFixed(0)
			x['StopLoss'] = Number(x['StopLoss']).toFixed(2)
			x['ProfitTarget'] = Number(x['ProfitTarget']).toFixed(2)
			x['WinRate'] = Number(x['WinRate']).toFixed(2)
			x['ExpectedReturn'] = Number(x['ExpectedReturn']).toFixed(2)
			// 给一些定值默认值
			//x['Timing To Entry'] = 'Open'
		})
		let AIPickObj = {}

		AIPickObj['label'] = 'AI Picks at the end of today'
		AIPickObj['title'] = 'AI Picks at the end of today'
		AIPickObj['tableCol'] = [
			{label:'Date',value:'Date'},
			{label:'Symbol',value:'Symbol'},
			{label:'Close',value:'Close'},
			{label:'Trend',value:'Market'},
			{label:'Direction',value:'Direction'},
			{label:'Signal',value:'_Signal'},
			{label:'Win Rate(%)',value:'WinRate'},
			{label:'Stop Loss(%)',value:'StopLoss'},
			{label:'Profit Target(%)',value:'ProfitTarget'},
			{label:'Best Time In Market(Bars)',value:'TimeInMarket'},
			//{label:'Cash Alloc(%)',value:'Alloc'},//'Cash Alloc(%)'
			{label:'Expected Return(%)',value:'ExpectedReturn'},
			{label:'Z-Score',value:'Z_Score'}, // 数据有误，先不显示	
		]
		// 测试
		//AIPickObj['tableCol'].unshift("Select")
		AIPickObj['content'] = AIPickContent
		
		this.originData = AIPickObj

		if(!this.date) this.date = [this.curDate,this.curDate]
		
		this.loading = false
	},
	selectDate(){
		this.getAIPick()
	},
	exportTable() {
		this.$refs.tableChild.exportTable()
	},
	toScannerBacktest() {
		this.$router.push({path: '/scannerai/backtest'})
	},
	selected(signals){
		console.log('触发了', signals)
		this.data.signals = Array.from(new Set(signals))
	},
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
	padding: 50px 50px;
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
	margin-bottom: 20px;
}

.direction {
	font-weight: 500;
    color: #606266;
    margin: 0 10px 0 20px;
}

// filter
.table-header {
	margin-bottom: 10px;
	
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
		.searchBox {
			margin-left: 50px;
		}
	}
	.header-part2{
		margin-top: 20px;
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
	color: #606266;
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
.portfolioCheckedBox {
  border: #cacaca solid 1px;
  padding: 0 5px 0 10px;
  border-radius: 4px;
  line-height: 28px;
  border-radius: 4px;
	margin-top: 10px;
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
</style>
