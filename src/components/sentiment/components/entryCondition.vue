<template>
	<div class="signalRight">
		<el-form label-position="left" ref="signalRight">
			<div class="radioBox">
				<div @click="changeSentimentChecked(), resetFormData()">
					<el-radio
						v-model="indicatorRadio"
						label="Sentiment_Indicators:"
						style="
							 {
								position: relative;
								left: 0px;
								top: 30px;
							}
						"
					></el-radio>
				</div>

				<el-form-item>
					<div class="searchBox">
						<el-autocomplete
							prefix-icon="el-icon-search"
							class="inline-input"
							v-model="sentimentIndicator"
							:disabled="isCheckedIndicators"
							:fetch-suggestions="indicatorSentimentSearch"
							placeholder="Please enter the sentiment indicator"
							@select="handleSentimentSelect"
							size="mini"
							highlight-first-item
						></el-autocomplete>
					</div>
				</el-form-item>
				<div @click="changeTechnicalChecked(), resetFormData()">
					<el-radio
						v-model="indicatorRadio"
						label="Technical_Indicators:"
					></el-radio>
				</div>
				<el-form-item label="" size="mini" prop="techIndicator">
					<div class="searchBox">
						<el-autocomplete
							:disabled="!isCheckedIndicators"
							class="inline-input"
							prefix-icon="el-icon-search"
							v-model="technicalIndicator"
							:fetch-suggestions="indicatorTechnicalSearch"
							placeholder="Please enter the technical indicator"
							@select="handleTechnicalSelect"
						></el-autocomplete>
					</div>
				</el-form-item>
			</div>
		</el-form>
		<el-form ref="rightForm" label-position="left" label-width="80px">
			<div v-for="(item, index) in conditionList" :key="index">
				<!-- 必需 -->
				<el-form-item label="Condition_description:" size="mini" v-show="false">
					<el-input
						v-model="conditionList[index].condition_description"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item label="Parameter:" size="mini">
					<el-radio
						v-model="parameterRadio"
						label="1"
						v-if="
							(conditionList[index].parameter == '') &
							(indicatorRadio === 'Sentiment_Indicators:')
						"
						>sentiment value</el-radio
					>
					<el-radio
						v-model="parameterRadio"
						label="1"
						v-else-if="
							(conditionList[index].parameter == '') &
							(indicatorRadio === 'Technical_Indicators:')
						"
						>technical value</el-radio
					>
					<el-radio v-model="parameterRadio" label="1" v-else>{{
						conditionList[index].parameter
					}}</el-radio>
					<el-radio
						v-model="parameterRadio"
						label="2"
						v-if="indicatorRadio === 'Sentiment_Indicators:'"
						>sentiment moving average</el-radio
					>
				</el-form-item>
				<div class="ma-container">
					<el-form-item
						width="width: 154px;"
						v-if="parameterRadio == '2'"
						label="Moving average period
:"
						size="mini"
					>
						<el-input v-model="maValue" @blur="renderMA(maValue)"></el-input>
					</el-form-item>
				</div>
				<el-form-item label="Condition:" size="mini" v-if="hideCondition">
					<div class="selectBox">
						<el-select
							v-model="conditionList[index].condition"
							v-if="parameterRadio == '1'"
							filterable
							placeholder="Please select condition"
						>
							<el-option
								v-for="item in conditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
						<el-select
							v-model="conditionsOption"
							v-else
							filterable
							placeholder="Please select condition"
						>
							<el-option
								v-for="item in parameterConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</div>
				</el-form-item>
				<el-form-item
					v-if="
						['Two Moving Average CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Two Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Three Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="FastMA:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].fast_ma"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['Three Moving Average CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Two Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Three Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="MiddleMA:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].middle_ma"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['Two Moving Average CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Three Moving Average CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Two Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Three Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="LowMA:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].low_ma"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['MACD CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['MACD CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="MACDFast:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].macd_fast"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['MACD CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['MACD CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="MACDSlow:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].macd_slow"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['MACD CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['MACD CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="MACDSig:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].macd_sig"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['Parabolic SAR CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Parabolic SAR CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['price lower Low'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Accumulation & Distribution Higher'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Price Higher High'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Accumulation & Distribution Lower'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['ATR trailing stop (Close) line CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['ATR trailing stop (High) line CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['ATR trailing stop (Close) line CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['MACD CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['MACD CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Above Bollinger Upper Band'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Below Bollinger Lower Band'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Bollinger Band Width Greater'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Bollinger Band Width Less'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['EMA200 Less'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['EMA200 Greater'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Chandelier Exits CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Chandelier Exits CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['NAsdAQ Composite / S&P 500 Greater'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['S&P 500 Moving Average Greater'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Moving Average CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Two Moving Average CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Two Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Three Moving Average CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Three Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Stop Loss and Take profit'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Stay Above Moving Average'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Stay Below Moving Average'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Touch Above Moving Average'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Touch Below Moving Average'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Breakout Support'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Breakout Resistance'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Bollinger Upper Band CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Bollinger Lower Band CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['Triple Tap Trend Reversal Divergence'].indexOf(
							conditionList[index].condition_description
						) === -1 &&
						['stay how many days in the market'].indexOf(
							conditionList[index].condition_description
						) === -1
					"
					label="Value:"
					prop="value"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].value"
						@input="conditionList[index].value"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['Parabolic SAR CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Parabolic SAR CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['ATR trailing stop (Close) line CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Bollinger Band Width Less'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['CMFI CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['CMFI CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Moving Average CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Moving Average CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Stay Above Moving Average'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Stay Below Moving Average'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['stay how many days in the market'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="Period:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].period"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['ATR trailing stop (Close) line CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['ATR trailing stop (High) line CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['ATR trailing stop (Close) line CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Chandelier Exits CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Chandelier Exits CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="ATR_multiplier:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].atr_multiplier"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['ATR trailing stop (Close) line CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['ATR trailing stop (High) line CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['ATR trailing stop (Close) line CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Chandelier Exits CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Chandelier Exits CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="ATR_period:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].atr_period"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item
					v-if="
						['Above Bollinger Upper Band'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Below Bollinger Lower Band'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="SD:"
					size="mini"
				>
					<el-input v-model="conditionList[index].sd" size="mini"></el-input>
				</el-form-item>

				<el-form-item
					v-if="
						['Parabolic SAR CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Parabolic SAR CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="Max_step:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].max_step"
						size="mini"
					></el-input>
				</el-form-item>

				<el-form-item
					v-if="
						['Parabolic SAR CrossBelow'].indexOf(
							conditionList[index].condition_description
						) === 0 ||
						['Parabolic SAR CrossAbove'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="Acceleration_factor:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].acceleration_factor"
						size="mini"
					></el-input>
				</el-form-item>

				<el-form-item
					v-if="
						['Stop Loss and Take profit'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="Stop_loss:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].stop_loss"
						size="mini"
					></el-input>
				</el-form-item>

				<el-form-item
					v-if="
						['Stop Loss and Take profit'].indexOf(
							conditionList[index].condition_description
						) === 0
					"
					label="Take_profit:"
					size="mini"
				>
					<el-input
						v-model="conditionList[index].take_profit"
						size="mini"
					></el-input>
				</el-form-item>

				<el-form-item
					v-if="index !== conditionList.length - 1"
					label="Combination:"
					size="mini"
				>
					<el-radio-group v-model="combination">
						<el-radio :label="0">AND</el-radio>
						<el-radio :label="1">OR</el-radio>
						<el-radio :label="2">SUM</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>
<script>
import { Store } from 'vuex'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
export default {
	name: 'condition',
	props: {
		conditionFormData: Object
	},
	data() {
		return {
			conditionList: [
				{
					condition_description: '',
					parameter: 'sentiment value',
					maValue: '',
					condition: '',
					value: ''
				}
			],
			indicatorRadio: 'Sentiment_Indicators:',
			sentimentIndicator: '',
			isCheckedIndicators: false,
			sentimentIndicatorList: [],
			technicalIndicator: '',
			technicaltIndicatorList: [],
			conditionsOption: '',
			parameterRadio: '1',
			maValue: '',
			hideCondition: true,
			parameterConditions: [
				{ value: 5, label: 'sentiment crossAbove' },
				{ value: 6, label: 'sentiment crossBelow' }
			],
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			combinationArr: ['AND', 'OR', 'SUM'],
			combination: ''
		}
	},
	mounted() {
		this.loadSentimentList()
		this.technicaltIndicatorList = this.loadShortLong()
	},
	watch: {
		conditionFormData: {
			handler(newName, oldName) {
				this.setConditionData()
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		//  load sentiment list
		async loadSentimentList() {
			const vm = this
			const res = await vm.$http.get(
				'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
				{
					auth: {
						username: 'sentimentrader_backtest_api',
						password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
					}
				}
			)
			vm.sentimentIndicatorList = res.data.map((obj) => {
				return { value: obj.chart_name, url: obj.url }
			})
			this.$store.commit('getIndicatorsList', res.data)
		},
		renderMA(ma) {
			console.log('renderMa')
			let result
			this.$store.state.indicatorsList.forEach((value, index) => {
				if (this.sentimentIndicator) {
					if (value.chart_name.indexOf(this.sentimentIndicator) !== -1) {
						result = value
						console.log('result')
						console.log(result)
					}
				} else {
					if (value.chart_name.indexOf(this.sentimentIndicator) !== -1) {
						result = value
						console.log('result')
						console.log(result)
					}
				}
			})
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				if (
					CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == result.url
				) {
					CIQ.Studies.removeStudy(
						CIQ.stxx,
						CIQ.stxx.layout.studies[studyInstanceName]
					)
				}
			}
			var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
				Period: ma,
				display: 'ST MA',
				Field: result.url
			})
			// keep current MA
			var objMA = { period: ma, url: result.url }
			var activatedMAList = this.$store.state.activatedMA

			// remove current MA attached to an indicator
			var MAListIndex = activatedMAList.findIndex(
				(item) => item.url == result.url
			)
			if (MAListIndex != -1) {
				activatedMAList.splice(MAListIndex, 1)
			}
			activatedMAList.push(objMA)
			// const set = new Set(activatedMAList)
			// activatedMAList = [...set]
			this.$store.commit('getMA', activatedMAList)

			console.log(this.$store.state.activatedMA)
		},
		// load short and long technical list
		loadShortLong() {
			return [
				{ value: 'Commodity Channel Index' },
				{ value: 'Relative Strength Index' },
				{ value: 'MACD' },
				{ value: 'Moving Average' }
			]
		},
		// sentiment search
		indicatorSentimentSearch(queryString, cb) {
			var sentimentIndicatorList = this.sentimentIndicatorList
			var results = queryString
				? sentimentIndicatorList.filter(
						this.createStateSentimentFilter(queryString)
				  )
				: sentimentIndicatorList

			clearTimeout(this.sentimentTimeout)
			this.sentimentTimeout = setTimeout(() => {
				cb(results)
			}, 3000 * Math.random())
		},
		createStateSentimentFilter(queryString) {
			return (state) => {
				return (
					state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
				)
			}
		},
		handleSentimentSelect(item) {
			this.sentimentIndicator = item.value
			// remove MA
			var activatedMAList = this.$store.state.activatedMA
			var MAListIndex = activatedMAList.findIndex(
				(item) => item.url == this.$store.state.indicators.formIndicators.entry
			)
			if (MAListIndex != -1) {
				activatedMAList.splice(MAListIndex, 1)
			}
			this.$store.commit('getMA', activatedMAList)
			this.$store.commit('getEntryIndicators', item.url)
			CIQ.addIndicators()
		},
		// technical search
		indicatorTechnicalSearch(queryString, cb) {
			var technicaltIndicatorList = this.technicaltIndicatorList
			var results = queryString
				? technicaltIndicatorList.filter(
						this.createTechnicalFilter(queryString)
				  )
				: technicaltIndicatorList
			// 调用 callback 返回建议列表的数据
			cb(results)
		},
		createTechnicalFilter(queryString) {
			return (technicaltIndicatorList) => {
				return (
					technicaltIndicatorList.value
						.toLowerCase()
						.indexOf(queryString.toLowerCase()) === 0
				)
			}
		},
		handleTechnicalSelect(item) {
			const vm = this
			vm.technicalIndicator = item.value

			//这里还没加MA所以先不清除已有的MA
			let techIndicators = []
			techIndicators.push(...CIQ.store.state.indicators.technicalIndicators)
			techIndicators.push(vm.techIndicators)

			console.log(techIndicators)
			CIQ.store.commit('getTechnicalIndicators', techIndicators)
			CIQ.addTechIndicators()

			const used_indicators = JSON.stringify([item.value])
			vm.$http
				.get(
					'/demo/signal/',
					{
						params: {
							page: 1,
							type: vm.$store.state.entryType,
							user: 'system',
							analysis_basis: 'technical',
							used_indicators: used_indicators
						}
					},
					{
						auth: {
							username: 'sentimentrader_backtest_api',
							password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
						}
					}
				)
				.then((res) => {
					let conductionId
					res.data.results.forEach((item) => {
						conductionId = item.id
					})
					this.$http
						.get('/demo/condition/', {
							params: { id: conductionId }
						})
						.then((val) => {
							const initData = val.data.results
							if ((vm.exitType == 'longexit') | (vm.exitType == 'shortexit')) {
								vm.hideCondition = false
							}
							vm.initTechCondiction = initData[0].condition
							vm.conditionList = initData
						})
				})
		},
		// input -> disabled
		changeSentimentChecked() {
			this.isCheckedIndicators = false
			this.indicatorRadio = 'Sentiment_Indicators:'
			this.$store.commit('getIndicatorRadio', this.indicatorRadio)
		},
		changeTechnicalChecked() {
			this.isCheckedIndicators = true
			this.indicatorRadio = 'Technical_Indicators:'
			this.$store.commit('getIndicatorRadio', this.indicatorRadio)
		},
		// change indicator, reset form data
		resetFormData() {
			this.technicalIndicators = ''
			// this.clearEntryFormData()
			this.indicatorRadio = 'Sentiment_Indicators:'
			this.sentimentIndicator = ''
			const data = this.conditionList
			// this.conditionList = []
			data.forEach((item) => {
				item.parameter = ''
				item.condition_description = ''
				item.condition = ''
				item.value = ''
			})
			this.conditionsOption = ''
			this.parameterRadio = '1'
			this.maValue = ''
		},
		clearConditionData() {
			this.indicatorRadio = 'Sentiment_Indicators:'
			this.$store.commit('getIndicatorRadio', 'Sentiment_Indicators:')
			this.isCheckedIndicators = false
			const data = this.conditionList
			for (var key in data) {
				data[key] = ''
			}
			this.conditionsOption = ''
			this.parameterRadio = '1'
			this.technicalIndicator = ''
			this.sentimentIndicator = ''
			this.maValue = ''
			this.conditionList = [
				{
					condition_description: '',
					parameter: 'sentiment value',
					maValue: '',
					condition: '',
					value: ''
				}
			]
			this.$store.commit('clearEntrySignal')
		},
		setConditionData() {
			const data = this.conditionFormData
			const allSymbolList = this.$store.state.indicatorsList
			let vm = this
			if (this.indicatorRadio === 'Sentiment_Indicators:') {
				let result
				allSymbolList.forEach((value, index) => {
					if (value.chart_name.indexOf(data.used_indicators) !== -1) {
						result = value
					}
				})
				if (result.url !== undefined) {
					// remove MA
					var activatedMAList = this.$store.state.activatedMA
					var MAListIndex = activatedMAList.findIndex(
						(item) =>
							item.url == this.$store.state.indicators.formIndicators.entry
					)
					if (MAListIndex != -1) {
						activatedMAList.splice(MAListIndex, 1)
					}
					// const set = new Set(activatedMAList)
					// activatedMAList = [...set]
					this.$store.commit('getMA', activatedMAList)
					this.$store.commit('getEntryIndicators', result.url)
					CIQ.addIndicators()
				} else {
					return
				}
			}
			const res = this.$http
				.get('/demo/condition/', {
					params: { id: data.id }
				})
				.then((res) => {
					if (res.status == 200) {
						vm.conditionList = res.data.results
					}
				})
			//('data',data)
			if (vm.indicatorRadio === 'Sentiment_Indicators:') {
				this.sentimentIndicator = data.used_indicators
			} else {
				vm.technicalIndicator = data.used_indicators
			}
		},
		getConditionData() {
			let data = {}
			data.conditionList = this.conditionList
			if (this.indicatorRadio === 'Sentiment_Indicators:') {
				data.analysis_basis = 'sentiment'
				data.used_indicators = this.sentimentIndicator
			} else {
				data.analysis_basis = 'technical'
				data.used_indicators = this.technicalIndicator
			}
			if (this.parameterRadio == 2) {
				data.conditionList[0].parameter = 'sentiment moving average'
				data.conditionList[0].condition = this.conditionsOption
				data.conditionList[0].maValue = this.maValue
			}
			this.$store.commit('saveCondictionData', data)
		}
	}
}
</script>
<style lang="less" scoped>
.signalRight {
	  margin: 20px 20px;
		border-radius: 10px;
		padding: 65px 10px 10px 10px;
		//flex-grow: 1;
		border: 2px solid #6c6c6c;
}

</style>