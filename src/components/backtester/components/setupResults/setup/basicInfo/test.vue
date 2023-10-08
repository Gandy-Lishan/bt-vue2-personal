<template>
  <div class="setUp-container">
    <el-form
				ref="backtestSetupForm"
				:model="bd"
				label-position="top"
				:rules="rules"
				size="mini"
			>
				<div class="setupTop">
						<div class="setupCenter">
							<el-form-item prop="symbol" label="Symbol">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Choose a stock/index as backtest symbol. (default: SPX)<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<div class="enterSymbolBox">
									<el-select
										v-model="bd.symbol"
										id="symbolName"
										filterable
										remote
										reserve-keyword
										automatic-dropdown
										@change="getSymbol(bd.symbol)"
										placeholder="enter keywords"
										:remote-method="remoteMethod"
										:loading="loading"
									>
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</div>
							</el-form-item>
							<el-form-item
								prop="capital"
								label="
							Starting Capital"
							>
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Input the value of starting capital of the backtest.
										(default: 100000)<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<el-input
									v-model="bd.capital"
									@blur="bd.capital = removeDecimalPlaces(bd.capital)"
								></el-input>
							</el-form-item>
							<el-form-item prop="commission" label="Commission">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Input the percentage value of trading commission. (default:
										0.1%)<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<el-input
									v-model="bd.commission"
									@blur="bd.commission = removeDecimalPlaces(bd.commission)"
								></el-input>
							</el-form-item>
							<span class="comUnitNote">(%)</span>
							<el-form-item prop="slippage" label="Slippage">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Input the value of slippage of trading price. (default:
										0)<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<el-input v-model="bd.slippage" @blur="bd.slippage = removeDecimalPlaces(bd.slippage)"></el-input> </el-form-item
							><span class="sliUnitNote">(per trade)</span>
							<el-form-item prop="benchmark" label="Benchmark">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Choose a stock/index with simple entry on the Start date &
										exit on the End date as benchmark compared with this
										backtest. (default: SPX)<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<div class="enterSymbolBox">
									<el-select
										v-model="bd.benchmark"
										id="symbolName"
										filterable
										remote
										reserve-keyword
										automatic-dropdown
										placeholder="enter keywords"
										:remote-method="remoteMethod"
										:loading="loading"
									>
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</div>
							</el-form-item>
							<div class="userTagBoc">
								<el-form-item label="User Tag" prop="use_tag" v-if="is_admin">
									<el-tooltip effect="dark" placement="top">
										<span slot="content"
											>Choose the type of backtest you want to create.<br
										/></span>
										<i class="iconfont icon-wenhao"></i>
									</el-tooltip>
									<div class="selectBox">
										<el-select
											v-model="bd.user_tag"
											placeholder="— Select User Tag —"
										>
											<el-option
												v-for="item in userTagOptions"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											>
											</el-option>
										</el-select>
									</div>
								</el-form-item>
							</div>
						</div>
						<div class="setupCenter">
							<el-form-item prop="backtestHistory" label="Backtest Period">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Specify the start and end date of the backtest.<br />Choose
										'All History' to include all data since the inception of the
										backtesting stock/index.<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<div class="selectBox historySelectBox">
									<el-select
										@change="setBacktestHistory(bd.backtest_period)"
										@blur="setBacktestHistory(bd.backtest_period)"
										v-model="bd.backtest_period"
									>
										<el-option
											v-for="item in historyOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</div>
							</el-form-item>
							<div class="dateBox">
								<el-form-item label="Start Date">
									<el-date-picker
										v-if="bd.backtest_period == '22'"
										v-model="bd.start_date"
										@change="formateStartDate"
										type="date"
										placeholder="- Select Start Date -"
										prop="startDate"
										value-format="yyyy-MM-dd"
									>
									</el-date-picker>
									<el-input v-else disabled v-model="bd.start_date"> </el-input>
								</el-form-item>
							</div>
							<div class="dateBox">
								<el-form-item prop="endDate" label="End Date">
									<el-date-picker
										v-if="bd.backtest_period == '22'"
										v-model="bd.end_date"
										@change="formateEndDate"
										type="date"
										placeholder="- Select End Date -"
										value-format="yyyy-MM-dd"
									>
									</el-date-picker>
									<el-input v-else disabled v-model="bd.end_date"> </el-input>
								</el-form-item>
							</div>
							<el-form-item label="Timeframe" prop="frequency">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>Choose the timeframe of the backtest. The chart above will
										change accordingly to the selection of the timeframe.<br />if
										Daily is chosen, only daily sentiment indicators will be
										included in the below criteria sentiment indicators
										selection;<br />
										if Weekly is chosen, both weekly and daily sentiment
										indicators will be included in the below criteria sentiment
										indicators selection;<br />
										if Monthly is chosen, all monthly/weekly/daily sentiment
										indicators will be included in the below criteria sentiment
										indicators selection.<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<div class="selectBox">
									<el-select
										v-model="bd.frequency"
										placeholder="— Select Timeframe —"
										@change="changeTimeframe"
									>
										<el-option
											v-for="item in frequencyOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</div>
							</el-form-item>
							<el-form-item label="Trade Price" prop="trade_price">
								<el-tooltip effect="dark" placement="top">
									<span slot="content"
										>The price used during the transaction,<br />'Next'
										indicates that the trade will only be executed on the next
										bar after the conditions are met on the current day.<br
									/></span>
									<i class="iconfont icon-wenhao"></i>
								</el-tooltip>
								<div class="selectBox">
									<el-select
										v-model="bd.trade_price"
										placeholder="— Select Trade Price —"
										@change="getTradePrice"
									>
										<el-option
											v-for="item in tradePriceOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</div>
							</el-form-item>
							<div class="excludeBox">
								<!-- <el-form-item prop="exclude_oo"> -->
								<el-checkbox v-model="isExcludeOO" @change="changeExcludeOO"
									>Exclude Overlapping Observations
									<el-tooltip effect="dark" placement="top">
										<span slot="content"
											>Select this box if you want to exclude dates that are
											clustered together.<br />
											By selecting this option, the test will only allow one
											trade at a time. <br />
											For example, if you chose '10 days' in the Observation
											Period,
											<br />
											then once the Indicator meets the Indicator Level you
											specify,
											<br />
											the test will not allow another trade for the next 10
											days.<br />
										</span>
										<i class="iconfont icon-wenhao"></i> </el-tooltip
								></el-checkbox>
								<el-input
									v-model="bd.exclude_oo"
									:style="{ visibility: isExcludeOO ? 'visible' : 'hidden' }"
									size="mini"
                  @blur="validateExclude(bd.exclude_oo)"
								></el-input>
                <div class="exclude-error-message" v-if="excludeOOErrMsg">
                   {{ excludeOOErrMsg }}
                </div>
								<!-- </el-form-item> -->
							</div>
							<div class="backtestURLBox">
								<el-form-item
									label="Report URL"
									prop="report_url"
									size="mini"
									v-if="bd.user_tag === 'analyst' && is_admin"
								>
									<el-tooltip effect="dark" placement="top">
										<span slot="content"
											>Fill in the analyst's report url here.</span
										>
										<i class="iconfont icon-wenhao"></i>
									</el-tooltip>
									<el-input v-model="bd.report_url"></el-input>
								</el-form-item>
							</div>
						</div>
				</div>
				<div class="setupFooter">
							<div class="nameBox">
								<el-form-item
									label="Backtest Name"
									prop="name"
									placeholder="Give the backtest a name"
								>
									<el-tooltip effect="dark" placement="top">
										<span slot="content"
											>Input a unique name for each backtest.<br
										/></span>
										<i class="iconfont icon-wenhao"></i>
									</el-tooltip>
									<el-input
										v-model="bd.name"
										oninput="value=value.replace(/[\+]/g,'')"
									></el-input>
								</el-form-item>
							</div>
							<div class="descriptionBox">
								<a @click="isToggle = !isToggle"
									>Backtest Description (click to expand)<i
										:class="isToggle ? 'el-icon-minus' : 'el-icon-plus'"
									></i
								></a>
								<div class="des-content" v-show="isToggle">
									<div class="des">
										<!-- <el-form-item
            v-if="bd.description.Introduction != 'edit'"
							label="Introduction"
							prop="introduction"
							placeholder="Give the backtest a introduction"
						>
							<el-input
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 5 }"
								v-model="bd.description.Introduction"
							>
							</el-input>
						</el-form-item> -->
										<!-- 开放权限都可以改 -->
										<el-form-item
											label="Introduction"
											prop="introduction"
											placeholder="Give the backtest a introduction"
										>
											<el-input
												type="textarea"
												@input="change($event)"
												:autosize="false"
												v-model="bd.description.Introduction"
											>
											</el-input>
										</el-form-item>
										<!-- <el-form-item
								v-if="bd.description.Rules"
								label="Rules"
								prop="rules"
								placeholder="Give the backtest rules"
							>
								<el-input
                  disabled
									type="textarea"
									:autosize="{ minRows: 2, maxRows: 5 }"
									v-model="bd.description.Rules"
								>
								</el-input>
							</el-form-item> -->
										<!-- 开放权限都可以改 -->
										<el-form-item
											label="Rules"
											prop="rules"
											placeholder="Give the backtest rules"
										>
											<el-input
												type="textarea"
												@input="change($event)"
												:autosize="false"
												v-model="bd.description.Rules"
											>
											</el-input>
										</el-form-item>
									</div>
								</div>
							</div>
							<div class="direction">
								<el-form-item prop="direction" label="Direction">
									<el-tooltip effect="dark" placement="top">
										<span slot="content"
											>Select Long or Short to specify the starting position of
											the backtest.<br
										/></span>
										<i class="iconfont icon-wenhao"></i>
									</el-tooltip>
									<el-radio-group v-model="bd.direction" @change="getDirection">
										<el-radio label="Long">Long</el-radio>
										<el-radio label="Short">Short</el-radio>
									</el-radio-group>
								</el-form-item>
							</div>
							<div class="risk-control-container border-set">
								<div class="riskItem">
									<el-checkbox
										v-model="isRiskControl"
										border
										@change="selectRiskControl"
										>Risk Control at Exit

										<el-tooltip effect="dark" placement="top">
											<span slot="content"
												>Check this option to include three methods of risk
												control to exit position.<br />
												The specified methods will serve as first-come,
												first-execute.<br />
												This option can be used combinedly as an OR condition
												with the Exit Criteria selection or be solely used in
												the Exit Criteria "Only Use Risk Control".<br
											/></span>
											<i class="iconfont icon-wenhao"></i> </el-tooltip
									></el-checkbox>
								</div>
								<div class="tpContainer riskItem" v-if="isRiskControl">
									<el-checkbox v-model="isTakeProfit">
										Take Profit
										<el-tooltip effect="dark" placement="top">
											<span slot="content"
												>Input a value of percentage to exit position when the
												specified profit is reached. (default: 10%)<br
											/></span>
											<i class="iconfont icon-wenhao"></i>
										</el-tooltip>
									</el-checkbox>
									<el-input
										v-model="tp"
                    @blur="tp = removeDecimalPlaces(tp); validateTP(tp)"
										size="mini"
									></el-input>
									<p style="margin: 0px;">(%)</p>
                  <div class="error-message" v-if="tpValidErrMsg">
                   {{ tpValidErrMsg }}
                  </div>
								</div>
								<div class="slContainer riskItem" v-if="isRiskControl">
									<el-checkbox v-model="isStopLoss"
										>Stop Loss

										<el-tooltip effect="dark" placement="top">
											<span slot="content"
												>Input a value of percentage to exit position when the
												specified loss is reached. (default: 5%)<br
											/></span>
											<i class="iconfont icon-wenhao"></i> </el-tooltip
									></el-checkbox>
									<el-input
										v-model="sl"
                    @blur="sl = removeDecimalPlaces(sl); validateSL(sl)"
										size="mini"
									></el-input>
									<p>(%)</p>
                  <div class="error-message" v-if="slValidErrMsg">
                   {{ slValidErrMsg }}
                  </div>
								</div>
								<div class="timContainer riskItem" v-if="isRiskControl">
									<el-checkbox v-model="isTimeInMarket"
                  size="mini"
										>Time In Market
										<el-tooltip effect="dark" placement="top">
											<span slot="content"
												>Input a value of bars to stay in market after entry.<br />Exit
												position when the specified Time In Market is reached.
												(default: 20)<br
											/></span>
											<i class="iconfont icon-wenhao"></i> </el-tooltip
									></el-checkbox>
									<el-input
										v-model="tim"
                    @blur="validateTIM(tim)"
										size="mini"
									></el-input>
									<p>(Bars)</p>
                  <div class="error-message" v-if="timValidErrMsg">
                   {{ timValidErrMsg }}
                  </div>
								</div>
							</div>

				</div>
			</el-form>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.setUp-container{
  width: 100%;
}
</style>