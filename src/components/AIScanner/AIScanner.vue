<template>
	<div class="gridContainer">
		<el-card class="box-card">
		<el-collapse class='collape-title'>
		<el-collapse-item>
			<template slot="title">
				<div class="title-container">
					<h2 class="page-title">Smart Stock Scanner (click to expand)</h2>
					<div class="searchBox">
						<el-button class="tutorial" @click="jumpToTutoiral" icon="el-icon-video-camera" type="text">
							<span>Watch Smart Stock Scanner Tutorial</span>
						</el-button>
					</div>
				</div>
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
					<h4 style="margin: 0px">Daily Picks at the end of today</h4><h6 class="h6-text">Today's pick will be completed by 11:40pm US Eastern Time.</h6>
				</div>
			</div>
			<!-- 预留一个过滤器的div -->
			<div class="header-part2">
				<div class="filterBox">
							<!-- <el-date-picker
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
							</el-date-picker> -->
							<div class="date-picker-container">
							<div class="datePicker">
								<el-date-picker
								v-model="date"
								type="date"
								size="small"
								@change="selectDate"
								placeholder="- Start Date -"
								value-format="yyyy-MM-dd"
								:picker-options="startPickerOptions"
							>
							</el-date-picker>
								<span class="sign">-</span>
								<el-date-picker
									v-model="curDate"
								@change="selectDate"
									type="date"
									size="small"
									placeholder="- End Date -"
									value-format="yyyy-MM-dd"
									:picker-options="endPickerOptions"
								>
								</el-date-picker>
							</div>
							<el-input 
								placeholder="" 
								v-model="searchItem" 
								class="search"
								size="small"
								@input="handleQuery"
								clearable
								@clear="handleQuery"
							>
								<span slot="prepend" style="padding: 0 5px;">{{searchCategory}}</span>
								<el-button slot="append" icon="el-icon-search" @click="handleQuery" size="small"></el-button>
							</el-input>
							</div>
					<!-- <el-checkbox v-model="isShowShortChecked" @change="ShowShortChecked"
						>Only Show Direction Is Short
					</el-checkbox> -->
				</div>
				<div class="filter-section">
					<div class="left-side">
						<div class="datePicker">
							<el-checkbox v-model="isPLSChecked" @change="PLSChecked"
							>Only Show Profit Target > Stop Loss
							</el-checkbox>
						</div>
						<div class="direction">
								<label for="radioGroup" class="direction">Direction: </label>
								<el-radio-group id="radioGroup" v-model="isShowShortChecked" @change="ShowShortChecked">
									<el-radio :label='false'>Long</el-radio>
									<el-radio :label='true'>Short</el-radio>
								</el-radio-group>
						</div>
					</div>
					<div class="btns">
						<el-button size="small" type="info" @click="showFilterDialog = !showFilterDialog"><i class="el-icon-arrow-left el-icon-s-operation" style="margin-right: 5px;"></i>Filter</el-button>
						<el-button @click="toScannerBacktest" type="warning" size="small"><i class="el-icon-arrow-left el-icon-s-promotion" style="margin-right: 5px;"></i>Smart Scanner Backtest</el-button>
						<el-button @click="exportTable" type="primary" size="small" title="Export Table"><i class="el-icon-arrow-left el-icon-download"></i></el-button>
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

		<el-dialog
				title="Filter Criteria"
				:visible.sync="showFilterDialog"
				width="80%">
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
									<span class="sign"> - </span>
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
										<span class="sign"> - </span>
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
									<span class="sign"> - </span>
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
											<span class="sign"> - </span>
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
											<span class="sign"> - </span>
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
											<span class="sign"> - </span>
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
											<span class="sign"> - </span>
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
											<span class="sign"> - </span>
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
											<span class="sign"> - </span>
											<el-form-item prop="win_rate" label-width="0px">
											<el-input v-model="data.win_rate" placeholder="Enter number">
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
											Trend Score Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="trend_score_condition" label-width="0px">
												<el-input v-model="data.trend_score_condition" placeholder="Enter number">
												</el-input>
										</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="trend_score" label-width="0px">
											<el-input v-model="data.trend_score" placeholder="Enter number">
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
											RelTrend Score Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="reltrend_score_condition" label-width="0px">
												<el-input v-model="data.reltrend_score_condition" placeholder="Enter number">
												</el-input>
										</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="reltrend_score" label-width="0px">
											<el-input v-model="data.reltrend_score" placeholder="Enter number">
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
											Optix Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="optix_condition" label-width="0px">
												<el-input v-model="data.optix_condition" placeholder="Enter number">
												</el-input>
										</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="optix" label-width="0px">
											<el-input v-model="data.optix" placeholder="Enter number">
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
											Change Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="change_condition" label-width="0px">
												<el-input v-model="data.change_condition" placeholder="Enter number">
												<template v-slot:append>(%)</template>
												</el-input>
										</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="change" label-width="0px">
											<el-input v-model="data.change" placeholder="Enter number">
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
											Total Trades Range:
										</label>
									</template>
									<div class="_conditionBox">
										<el-form-item prop="total_trades_condition" label-width="0px">
												<el-input v-model="data.total_trades_condition" placeholder="Enter number">
												</el-input>
										</el-form-item>
											<span class="sign"> - </span>
											<el-form-item prop="total_trades" label-width="0px">
											<el-input v-model="data.total_trades" placeholder="Enter number">
											</el-input>
											</el-form-item>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button size="mini" type="info" @click="disableFilter">No Filter</el-button>
					<el-button size="mini" @click="resetForm">Reset Filter</el-button>
						<el-button size="mini" type="primary" @click="handleDialogClose">Apply Filter</el-button>
				</span>
		</el-dialog>
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
	  date: '',
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
		change_condition: 0,
		change: 100,
		trend_score_condition: 0,
		trend_score: 10,
		reltrend_score_condition: 0,
		reltrend_score: 10,
		optix_condition: 0,
		optix: 100,
		total_trades_condition: 1,
		total_trades: 100,
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
	startPickerOptions: {
		disabledDate: this.handleDisabledEndDate
	},
	endPickerOptions: {
			disabledDate: this.handleDisabledEndDate
	},
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
			change_condition: [  // ← 直接粘贴上面这段
				{
				validator: (rule, value, callback) => {
					if (value === '' || value === null || value === undefined) {
					return callback();
					}
					const regex = /^-?\d+(\.\d{1,2})?$/;
					if (!regex.test(value)) {
					return callback(new Error('e.g. 12.34 or -5.67 (max 2 decimals)'));
					}
					callback();
				},
				trigger: ['blur', 'change']
				}
			],
			change: [  // ← 直接粘贴上面这段（和上面一模一样）
				{
				validator: (rule, value, callback) => {
					if (value === '' || value === null || value === undefined) {
					return callback();
					}
					const regex = /^-?\d+(\.\d{1,2})?$/;
					if (!regex.test(value)) {
					return callback(new Error('e.g. 12.34 or -5.67 (max 2 decimals)'));
					}
					callback();
				},
				trigger: ['blur', 'change']
				}
			],
			signals: [
				{ validator: validateSignals, trigger: 'blur' },
				{ validator: validateSignals, trigger: 'change' },
			],
			trend_score_condition: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('trend score', 0, this.data.trend_score, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('trend score', 0, this.data.trend_score, true)(rule, value, callback), trigger: 'change' }
			],
			trend_score: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('trend score', 0, 10)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('trend score', 0, 10)(rule, value, callback), trigger: 'change' }
			],
			reltrend_score_condition: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('reltrend score', 0, this.data.trend_score, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('reltrend score', 0, this.data.trend_score, true)(rule, value, callback), trigger: 'change' }
			],
			reltrend_score: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('reltrend score', 0, 10)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('reltrend score', 0, 10)(rule, value, callback), trigger: 'change' }
			],
			optix_condition: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('optix', 0, this.data.optix, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('optix', 0, this.data.optix, true)(rule, value, callback), trigger: 'change' }
			],
			optix: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('optix', 0, 100)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('optix', 0, 100)(rule, value, callback), trigger: 'change' }
			],
			total_trades_condition: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('total trades', 1, this.data.total_trades, true)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('total trades', 1, this.data.total_trades, true)(rule, value, callback), trigger: 'change' }
			],
			total_trades: [
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('total trades', this.data.total_trades_condition)(rule, value, callback), trigger: 'blur' },
				{ validator: (rule, value, callback) => createPositiveScopeIntegerRule('total trades', this.data.total_trades_condition)(rule, value, callback), trigger: 'change' }
			],
    }
  }
  },
  async created(){	
	// 进入组件时还原筛选条件状态
	const state = this.$store.getters.getScannerAIFilterState
		debugger
	this.curDate = this.$store.state.chart.curDate
	if(state.date && Array.isArray(state.date) && state.date.length > 0) {
		this.date = state.date[0] || this.curDate
		this.curDate = state.date[1] || this.curDate
	}else {
		this.date = this.curDate
	}

	this.searchItem = state?.searchItem || ''
	this.searchCategory = state?.searchCategory || 'Symbol'
	this.isPLSChecked = state?.isPLSChecked || false
	//首先初始化数据
	this.loadData('US')
},
	beforeDestroy() {
		// 离开此组件前保存筛选条件状态
		const date = [this.date, this.curDate] || [this.curDate, this.curDate]
		this.$store.dispatch('states/set_scannerai_filter_state',{
			searchItem:this.searchItem,
			searchCategory:this.searchCategory,
			isPLSChecked:this.isPLSChecked,
			date:date,
		})
	},
	computed: {
		is_admin() {
			return this.$store.state.user.is_admin
		},
	},
	watch: {
		// 数据源更新时tableData同时响应,只会在getAIPick时获取originData
		originData: {
			async handler(newValue, oldValue){
				this.tableData = JSON.parse(JSON.stringify(this.originData))
				this.options = [...Array.from(new Set(this.tableData.content.map(ele => this.midTermMap[ele._Signal] ? this.midTermMap[ele._Signal] : ele._Signal).filter(ele => ele !== undefined && ele !== null && ele !== ''))).map(item => ({label: item, value: item, check: true}))]
				this.data.signals = ['All']
				if(this.$refs['SelectCheck']) this.$refs['SelectCheck'].optionsAllChange = true
				await this.filterData()
				console.log('this.options', this.options)
			},
			deep: true
		},
	},
  methods: {
			handleDisabledStartDate(time) {
			const today = timestampToTime(new Date());
			
			// 添加新限制：日期大于 curDate 或为周末
			const isDisabled = time.getDay() === 0 || time.getDay() === 6;
			
			// 如果 endDate 取消选择，则 startDate 可以选择全部
			if (this.curDate) {
					return isDisabled;
			} else {
					return isDisabled || timestampToTime(time) > today;
			}
	},

	handleDisabledEndDate(time) {
			const today = timestampToTime(new Date());

			// 添加新限制：日期大于 curDate 或为周末
			const isDisabled = time.getDay() === 0 || time.getDay() === 6;

			return isDisabled || timestampToTime(time) > today
	},
	// table filter*********
	disabledDate(time) {
		let dis = timestampToTime(time) > this.curDate || (time.getDay() === 0 || time.getDay() === 6)
		return dis
	},
	async handleDialogClose() {
		const validForm = await this.validForm('Form');
		if (!validForm) return
		this.disabledFilter = false
		this.showFilterDialog = false
		this.handleQuery();
	},
	handleQuery: throttle(async function () { this.$nextTick(async () => {await this.filterData()}) }, 500),
	async filterData(){
		this.tableData.content = this.filterShowShortCondition(this.filterPLSCondition(this.filterRangeCondition(this.getSearchresult())))
		this.tableData.content.forEach(item => {
			item['StopLoss'] = this.displayData(item['StopLoss'], true)
			item['ProfitTarget'] = this.displayData(item['ProfitTarget'], true)
			item['WinRate'] = this.displayData(item['WinRate'], true)
			item['ExpectedReturn'] = this.displayData(item['ExpectedReturn'])
			item['Z_Score'] = this.displayData(item['Z_Score'])
			item['StdDev'] = this.displayData(item['StdDev'])
			item['MaxRisk'] = this.displayData(item['MaxRisk'])
			item['TimeInMarket'] = this.displayData(item['TimeInMarket'], true)
			item['TrendScore'] = this.displayData(item['TrendScore'], true)
			item['Alloc'] = this.displayData(item['Alloc'])
			item['AvgWin'] = this.displayData(item['AvgWin'])
			item['AvgLoss'] = this.displayData(item['AvgLoss'])
			item['MaxRisk'] = this.displayData(item['MaxRisk'])
			item['AnnualReturn'] = this.displayData(item['AnnualReturn'])
			item['MedianReturn'] = this.displayData(item['MedianReturn'])
			item['AvgReturn'] = this.displayData(item['AvgReturn'])
			item['StdDev'] = this.displayData(item['StdDev'])
			item['SharpeRatio'] = this.displayData(item['SharpeRatio'])
			item['Optix'] = this.displayData(item['Optix'])
			// Change % 格式化
			item['PctChange'] = this.displayData(item['PctChange'], false, 2)
		})
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
		if(this.showFilterDialog || this.disabledFilter) return searchResult
		const {stop_loss_condition, stop_loss, 
			take_profit_condition, take_profit, 
			time_in_market_condition, time_in_market,
			signals,
			max_risk_condition, max_risk,
			z_score_condition, z_score,
			sharpe_ratio_condition, sharpe_ratio,
			std_dev_condition, std_dev,
			expected_return_condition, expected_return,
			win_rate_condition, win_rate,
			change_condition, change,
			trend_score_condition, trend_score,
			reltrend_score_condition, reltrend_score,
			optix_condition, optix,
			total_trades_condition, total_trades

		} = this.data
		console.log('this.data', this.data)
		console.log('signals filter', signals)
		const _signals = this.options.map(item => item.value)
		console.log('signals options', this.options)
		const condition = (signals.length === 1 && signals[0] === 'All') || (signals.length === 0)
		const result = searchResult
		.filter(item=>(
			((item['StopLoss'] === null || item['StopLoss'] === '') || (parseFloat(stop_loss_condition)<=parseFloat(item['StopLoss']) && parseFloat(stop_loss)>=parseFloat(item['StopLoss'])))
			&& ((item['ProfitTarget'] === null || item['ProfitTarget'] === '') || (parseFloat(take_profit_condition)<=parseFloat(item['ProfitTarget']) && parseFloat(take_profit)>=parseFloat(item['ProfitTarget'])))
			&& ((item['TimeInMarket'] === null || item['TimeInMarket'] === '') ||(parseFloat(time_in_market_condition)<=parseFloat(item['TimeInMarket']) && parseFloat(time_in_market)>=parseFloat(item['TimeInMarket'])))
			&& (condition || _signals.includes(this.midTermMap[item['_Signal']] ? this.midTermMap[item['_Signal']] : item['_Signal']))
			&& ((item['MaxRisk'] === null || item['MaxRisk'] === '')  || (parseFloat(max_risk_condition)<=parseFloat(item['MaxRisk']) && parseFloat(max_risk)>=parseFloat(item['MaxRisk'])))
			&& ((item['Z_Score'] === null || item['Z_Score'] === '')  || (parseFloat(z_score_condition)<=parseFloat(item['Z_Score']) && parseFloat(z_score)>=parseFloat(item['Z_Score'])))
			&& ((item['SharpeRatio'] === null || item['SharpeRatio'] === '')  || (parseFloat(sharpe_ratio_condition)<=parseFloat(item['SharpeRatio']) && parseFloat(sharpe_ratio)>=parseFloat(item['SharpeRatio'])))
			&& ((item['StdDev'] === null || item['StdDev'] === '')  ||  (parseFloat(std_dev_condition)<=parseFloat(item['StdDev']) && parseFloat(std_dev)>=parseFloat(item['StdDev'])))
			&& ((item['ExpectedReturn'] === null || item['ExpectedReturn'] === '')  || (parseFloat(expected_return_condition)<=parseFloat(item['ExpectedReturn']) && parseFloat(expected_return)>=parseFloat(item['ExpectedReturn'])))
			&& ((item['WinRate'] === null || item['WinRate'] === '')  || ( parseFloat(win_rate_condition)<=parseFloat(item['WinRate']) && parseFloat(win_rate)>=parseFloat(item['WinRate'])))
			&& ((item['PctChange'] === null || item['PctChange'] === '')  || ( parseFloat(change_condition)<=parseFloat(item['PctChange']) && parseFloat(change)>=parseFloat(item['PctChange'])))
			&& ((item['TrendScore'] === null || item['TrendScore'] === '')  || ( parseFloat(trend_score_condition)<=parseFloat(item['TrendScore']) && parseFloat(trend_score)>=parseFloat(item['TrendScore'])))
			&& ((item['RelTrendScore'] === null || item['RelTrendScore'] === '')  || ( parseFloat(reltrend_score_condition)<=parseFloat(item['RelTrendScore']) && parseFloat(reltrend_score)>=parseFloat(item['RelTrendScore'])))
			&& ((item['Optix'] === null || item['Optix'] === '')  || ( parseFloat(optix_condition)<=parseFloat(item['Optix']) && parseFloat(optix)>=parseFloat(item['Optix'])))
			&& ((item['TradeNumber'] === null || item['TradeNumber'] === '')  || ( parseFloat(total_trades_condition)<=parseFloat(item['TradeNumber']) && parseFloat(total_trades)>=parseFloat(item['TradeNumber'])))
		))
		return result
	},
	filterShowShortCondition(searchResult){
		debugger
		if(!this.isShowShortChecked) return searchResult.filter(item=>item["Direction"] === 'Long');
		if (this.isShowShortChecked) {
			// 当checkbox勾选时，返回被筛选过的数据
			return searchResult
					.filter(item=>item["Direction"] === 'Short');
		}
	},
	getSearchresult() {
	if (!this.searchItem) {
		return this.originData.content;
	}

	const trimmedStr = this.searchItem.trim();
	const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");

	// 过滤出匹配的
	let results = this.originData.content.filter(item => {
		let searchTarget = this.midTermMap[item[this.searchCategory]]
			? this.midTermMap[item[this.searchCategory]]
			: item[this.searchCategory];
		return regex.test(searchTarget);
	});

	// 排序
	results.sort((a, b) => {
		const searchTargetA = this.midTermMap[a[this.searchCategory]]
			? this.midTermMap[a[this.searchCategory]]
			: a[this.searchCategory];
		const searchTargetB = this.midTermMap[b[this.searchCategory]]
			? this.midTermMap[b[this.searchCategory]]
			: b[this.searchCategory];

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
	// getSearchresult(){
	// 	if(this.searchItem){
	// 		// 在搜索之前对搜索关键词进行转义
	// 		const trimmedStr = this.searchItem.trim()
	// 		const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");
	// 		return this.originData.content.filter(item => {
	// 			let searchTarget = this.midTermMap[item[this.searchCategory]]?this.midTermMap[item[this.searchCategory]]:item[this.searchCategory]
	// 			return regex.test(searchTarget)
	// 		});
	// 		//this.tableData.content = this.data.content.filter(item=>item[this.searchCategory].toLowerCase().indexOf(this.searchItem.toLowerCase())!=-1)
	// 	}else{
	// 		return this.originData.content
	// 	}
	// },
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
			await this.getAIPick()
			this.filterData()
		}
	},
	async getAIPick(){
		this.loading = true
		let date = [this.date, this.curDate] || [this.curDate,this.curDate]
		// 如果前者比后者大，就交换
		if (new Date(date[0]) > new Date(date[1])) {
			this.date = date[1]
			this.curDate = date[0]
			date = [date[1], date[0]];
		}
		if(!date[0] || !date[1]) { this.loading = false;return}
		let AIPickContent = await getAIPick(date)
		
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
			x['StopLoss'] = Number(x['StopLoss']).toFixed(1)
			x['ProfitTarget'] = Number(x['ProfitTarget']).toFixed(1)
			x['WinRate'] = Number(x['WinRate']).toFixed(1)
			x['ExpectedReturn'] = Number(x['ExpectedReturn']).toFixed(1)
			// 给一些定值默认值
			//x['Timing To Entry'] = 'Open'

			// 格式化 Change %
			if (x['PctChange'] !== undefined && x['PctChange'] !== null) {
				x['PctChange'] = Number(x['PctChange']).toFixed(2)
			}
		})
		let AIPickObj = {}

		AIPickObj['label'] = 'AI Picks at the end of today'
		AIPickObj['title'] = 'AI Picks at the end of today'
		AIPickObj['tableCol'] = [
			{label:'Date',value:'Date',labelHtml: 'Date'},
			{label:'Symbol',value:'Symbol',labelHtml: 'Symbol'},
			{label:'Close',value:'Close',labelHtml: 'Close'},
			{label:'Change (%)',value:'PctChange',labelHtml: 'Change (%)'},
			{label:'Trend',value:'Market',labelHtml: 'Market'},
			{label:'Trend Score',value:'TrendScore',labelHtml: 'Trend<br/>Score'},
			{label:'Direction',value:'Direction',labelHtml: 'Direction', width: '80px'},
			{label:'Signal',value:'_Signal',labelHtml: 'Signal'},
			{label:'Win Rate(%)',value:'WinRate',labelHtml: 'Win<br/>Rate(%)'},
			{label:'Stop Loss(%)',value:'StopLoss',labelHtml: 'Stop<br/>Loss(%)'},
			{label:'Profit Target(%)',value:'ProfitTarget',labelHtml: 'Profit<br/>Target(%)'},
			{label:'Best Time In Market(Bars)',value:'TimeInMarket',labelHtml: 'Best<br/>Time In<br/>Market<br/>(Bars)'},
			//{label:'Cash Alloc(%)',value:'Alloc'},//'Cash Alloc(%)'
			{label:'Expected Return(%)',value:'ExpectedReturn',labelHtml: 'Expected<br/>Return(%)'},
			{label:'Z-Score',value:'Z_Score',labelHtml: 'Z-Score'}, // 数据有误，先不显示	
		]
		// 测试
		//AIPickObj['tableCol'].unshift("Select")
		AIPickContent.sort((a,b) => {
			return new Date(a['Date']) - new Date(b['Date'])
		})
		AIPickObj['content'] = AIPickContent
		
		this.originData = AIPickObj

		if(!this.date) this.date = this.curDate
		
		this.loading = false
		console.timeEnd("ai timer")
	},
	async selectDate(){
		await this.getAIPick()
		await this.handleQuery()
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
	resetForm() {
		this.$refs['Form'].resetFields();
		this.options = [...Array.from(new Set(this.originData.content.map(ele => this.midTermMap[ele._Signal] ? this.midTermMap[ele._Signal] : ele._Signal).filter(ele => ele !== undefined && ele !== null && ele !== ''))).map(item => ({label: item, value: item, check: true}))]
		this.data.signals = ['All']
		this.$refs['SelectCheck'].optionsAllChange = true
		this.disabledFilter = false
		// this.showFilterDialog = false
		this.handleQuery();
	},
	disableFilter() {
		this.options = [...Array.from(new Set(this.originData.content.map(ele => this.midTermMap[ele._Signal] ? this.midTermMap[ele._Signal] : ele._Signal).filter(ele => ele !== undefined && ele !== null && ele !== ''))).map(item => ({label: item, value: item, check: true}))]
		this.data.signals = ['All']
		this.$refs['SelectCheck'].optionsAllChange = true
		this.disabledFilter = true
		this.showFilterDialog = false
		this.handleQuery();
	},
	jumpToTutoiral(){
			const path = 'https://youtu.be/C-wBYWy-fQY?si=1vVrxKsKiosrhYWb'
			window.open(path, '_blank')
	},
	displayData(data, removeZero = false, decimal = 1) {
			const numberRegex = /^-?\d+(\.\d+)?$/
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/

			if (numberRegex.test(data)) {
				if(!removeZero) return parseFloat(data).toFixed(decimal)
				// Convert to float, format to one decimal place, and remove unnecessary trailing zeros
				return parseFloat(data).toFixed(decimal).replace(/\.0$/, '')
			} else if (dateRegex.test(data)) {
				return data
			} else if(typeof data == 'string'){
				return data
			}else {
				return ''
			}
	},
	toOptionScanner(){
		this.$router.push({path: '/aiscanner/optionscanner'})
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
@media (max-width: 1200px) {
.title-container {
	display: block;
	font-size: 10px;
	h2 {
		margin: 0;
	}
	.searchBox {
		position: absolute;
	}
}
.table-header {
	margin-top: 50px;
	display: block;
}
.date-picker-container {
	display: block;
	/deep/ .el-input-group {
		margin: 10px;
		width: 100%;
	}
}
.filter-section {
	display: block;
}
}
</style>
