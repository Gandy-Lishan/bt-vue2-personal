<template>
	<div class="setup">
		<div class="setupBox">
			<BasicInfo ref="basicInfo"></BasicInfo>
		</div>
		<div class="set-up-container">
			<div class="criteria-container">
				<div class="criteria">
					<Criteria
						ref="entryChild"
						:config="setConfig('entry')"
						:isRiskControl="false"
						@getEntryRelation="getEntryRelation"
						@sendEntrySignalIndex="sendEntrySignalIndex"
					></Criteria>
				</div>
				<div class="divider"></div>
				<div class="criteria">
					<Criteria
						ref="exitChild"
						:config="setConfig('exit')"
						:isRiskControl="isRiskControl"
						@isOnlyRiskControl="isOnlyRiskControl"
						@getExitRelation="getExitRelation"
						@sendExitSignalIndex="sendExitSignalIndex"
					></Criteria>
				</div>
			</div>
		</div>
		<div class="backtest-btns">
			<el-tooltip
				class="item"
				effect="dark"
				content="Clear the backtest set up form "
				placement="bottom"
			>
				<el-button type="danger" @click="clearForm"> Clear Form</el-button>
			</el-tooltip>
			<el-tooltip
				class="item"
				effect="dark"
				content="Complete the form filling, run the backtest, and view the results"
				placement="bottom"
			>
				<el-button type="success" @click="runBacktest"
					>Run Backtest</el-button
				></el-tooltip
			>
			<!-- <el-checkbox style="margin-left:10px" v-model="test" label="download test csv" border></el-checkbox> -->
		</div>
	</div>
</template>

<script>
import BasicInfo from './basicInfo'
import Criteria from './criteria'
import { generateConfig } from './criteria/config'
import cloneDeep from 'lodash/cloneDeep'
import capitalizeFirstLetter from '@/tools/capitalizeFirstLetter'
import isJson from '@/tools/isJson'
import SignalCode from '@/tools/codeTool.js'
import { CIQ } from '@/components/common/chart/st-development/js'
import { runBacktest, getStatus, uploadS3} from '@/service/service'
import UUID from '@/tools/uuid.js'
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'


export default {
	name: 'SetUp',
	components: {
		BasicInfo,
		Criteria
	},
	data() {
		return {
			isRiskControl: true
		}
	},
	methods: {
		setConfig(criteria) {
			// 传入 entry 和 exit 的配置
			return generateConfig(criteria)
		},
		clearForm() {
			this.$refs['basicInfo'].clearForm()
		},
		runBacktest() {
			const _this = this
			_this.$refs['basicInfo'].saveData()
			const entryErr = _this.saveCriteriaData('entryChild')
			const exitErr = _this.saveCriteriaData('exitChild')
			if (!entryErr || !exitErr) return
			// 处理上传到后端的数据
			let entrySaveObj = _this.handleSavedData('entry')
			let exitSaveObj = _this.handleSavedData('exit')
			console.log('entrySaveObj', entrySaveObj)
			console.log('exitSaveObj', exitSaveObj)
			let indicatorLayout = _this.saveIndicatorLayoutData()
			indicatorLayout.formIndicators = {
				entry: entrySaveObj.indicatorLayout.formIndicators.entrySignal,
				exit: exitSaveObj.indicatorLayout.formIndicators.exitSignal
			}
			_this.reassignBTAttributes(entrySaveObj, exitSaveObj, indicatorLayout)
		},
		async saveCriteriaData(criteriaRef) {
			const _this = this
			const tabLength = _this.$refs[criteriaRef].addSignalLength()
			for (let index = 0; index < tabLength; index++) {
				const valid = await _this.$refs[criteriaRef].saveData(index)
				if (!valid) return false
			}
			_this.$refs[criteriaRef].saveScoreValue()
			_this.$refs[criteriaRef].saveSignalsInMarket()
			_this.$refs[criteriaRef].saveDelayBar()
			_this.$refs[criteriaRef].saveRelation()
			return _this.$refs[criteriaRef].isSameSignal()
		},
		handleSavedData(criteria) {
			/*
			saveObj should be like this:
			{
				[entry or exit]: {
					description: '',
					score: '',
					signals_in_market: '',
					relation: '',
					delay_bars: '',
					signals: [],
					cond: []
				},
				[entry or exit description]: JSON parsed array,
				indicatorLayout: {
					formIndicators: {
						[entry or exit Signal]: ''
					},
				}
			}
		*/
			const backtestData = cloneDeep(this.$store.state.form.backtestInfo)
			const { signal_list, signal } = this.encodeSignalList(criteria)
			let criteriaDescription = backtestData[`${criteria}_description`]
			let saveObj = {}
			const criteriaObj = {
				description: backtestData[criteria].description,
				score: backtestData[criteria].score,
				signals_in_market: backtestData[criteria].signals_in_market,
				relation: backtestData[criteria].relation,
				delay_bars: backtestData[criteria].delay_bars,
				signals: signal_list,
				cond: criteriaDescription.map((i) => i.rocCond)
			}
			saveObj[criteria] = JSON.stringify(criteriaObj)
			if (Array.isArray(criteriaDescription)) {
				saveObj[`${criteria}_description`] = JSON.stringify(criteriaDescription)
			} else {
				saveObj[`${criteria}_description`] = criteriaDescription
			}
			// saveObj.indicatorLayout.formIndicators[`${criteria}Signal`] = signal
			saveObj.indicatorLayout = {
				formIndicators: {
					[`${criteria}Signal`]: signal
				}
			}
			return saveObj
		},
		encodeSignalList(criteria) {
			const backtestData = cloneDeep(this.$store.state.form.backtestInfo)
			const signalList = backtestData[criteria].signals
			const isOnlyUseRiskControl = backtestData.relation == 0
			const criteriaCapFirstL = capitalizeFirstLetter(criteria)
			const signal_list = []
			const b = new SignalCode()

			if (!isOnlyUseRiskControl) {
				signalList.forEach((item) => {
					const indicators = {
						sentimentIndicator: {
							indicator: item.sentimentIndicator,
							analysis: 'Sentiment'
						},
						technicalIndicator: {
							indicator: item.technicalIndicator,
							analysis: 'Technical'
						},
						riskIndicator: { indicator: 'RC', analysis: 'Exit' },
						symbolIndicator: {
							indicator: item.symbolIndicator,
							analysis: 'Symbol'
						},
						usersOwnIndicator: {
							indicator: item.usersOwnIndicator,
							analysis: 'User'
						}
					}

					for (const [key, value] of Object.entries(indicators)) {
						if (item[key]) {
							item.indicator = value.indicator
							item.analysis = value.analysis
							for (const deleteKey of Object.keys(indicators)) {
								delete item[deleteKey]
							}
						}
					}
				})
			}
			const findSignal = (item, index) => {
				let signal = CIQ.findSentiIndicator(item.indicator, null)
				if (!signal) {
					signal = CIQ.findBuiltinTechIndicator(item.indicator, null)
				}
				// 在 symbol indicator list内检索url
				if (!signal) {
					if (CIQ.findSymbolIndicator(item.indicator, null)) {
						return item.indicator
					}
					const usersOwnList =
						this.$store.state.form[`usersOwn${criteriaCapFirstL}FileHash`]
					return usersOwnList[index] !== ''
						? usersOwnList[index]
						: signal?.url || ''
				}
			}

			let signal = backtestData[criteria].signals.map(findSignal)

			if (isOnlyUseRiskControl) {
				signal = ['']
				signal_list.push({
					code: 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'
				})
			} else {
				for (let i = 0; i < signalList.length; i++) {
					const code = b.encode(signalList[i])
					signal_list.push({
						code: code
					})
				}
			}
			delete backtestData[criteria].signals
			return { signal_list, signal }
		},
		saveIndicatorLayoutData() {
			/*
				保存除了 formIndicators 之外的 indicatorLayout 属性
			*/
			let indicatorLayout = {}
			indicatorLayout.technicalIndicators =
				this.$store.state.chart.indicators.technicalIndicators
			let savedTechSD = []
			for (let i in CIQ.stxx.layout.studies) {
				let output = {}
				if (!CIQ.findSentiIndicator(null, CIQ.stxx.layout.studies[i].type)) {
					output = CIQ.stxx.layout.studies[i].outputs
				}
				savedTechSD.push({
					type: CIQ.stxx.layout.studies[i].type,
					inputs: CIQ.stxx.layout.studies[i].inputs,
					outputs: output,
					parameters: CIQ.stxx.layout.studies[i].parameters,
					panel: CIQ.stxx.layout.studies[i].panel
				})
			}
			indicatorLayout.savedTechSD = savedTechSD
			indicatorLayout.activatedMA = this.$store.state.chart.activatedMA
			// 暂定，把MA对应位置和信息存在回测内
			indicatorLayout.activatedMALayout =
				this.$store.state.chart.activatedMALayout
			return indicatorLayout
		},
		reassignBTAttributes(entrySaveObj, exitSaveObj, indicatorLayout) {
			const backtestInfo = cloneDeep(this.$store.state.form.backtestInfo)
			backtestInfo.indicator_layout = JSON.stringify(
				indicatorLayout
			).replaceAll('\u200c', '$r001$')
			backtestInfo.description = JSON.stringify(backtestInfo.description)
			backtestInfo.entry = JSON.stringify(entrySaveObj.entry)
			backtestInfo.exit = JSON.stringify(exitSaveObj.exit)
			backtestInfo.entry_description = JSON.stringify(
				entrySaveObj.entry_description
			)
			backtestInfo.exit_description = JSON.stringify(
				exitSaveObj.exit_description
			)

			const copyBacktestData = cloneDeep(backtestInfo)
			copyBacktestData.currentdate = new Date().getTime()

			backtestInfo.pk = UUID(JSON.stringify(copyBacktestData))
			// Restore a numeric string in an object to a number
			backtestInfo.capital_alloc = parseFloat(backtestInfo.capital_alloc)
			backtestInfo.slippage = parseFloat(backtestInfo.slippage)
			backtestInfo.win_rate = parseFloat(backtestInfo.win_rate)
			this.$store.dispatch('chart/set_span_period', {
				start_date: backtestInfo.start_date.replace(/-/g, '') * 1000000000,
				end_date: backtestInfo.end_date.replace(/-/g, '') * 1000000000
			})
			const selectedProps = [
				'pk',
				'benchmark',
				'capital',
				'capital_alloc',
				'commission',
				'create_date',
				'direction',
				'end_date',
				'entry',
				'exit',
				'frequency',
				'name',
				'risk_control',
				'slippage',
				'start_date',
				'strategy',
				'symbol',
				'win_rate',
				'backtest_period',
				'trade_price',
				'exclude_oo',
				'description'
			]
			let backtestParams = Object.assign(
				{},
				...selectedProps.map((prop) => ({ [prop]: backtestInfo[prop] }))
			)

			 // Before the back test, load the data of the whole period and generate CSV to upload S3, and then update the form when the results come out
			 this.reloadData(indicatorLayout, backtestInfo.frequency)
			// 1. Upload data file
			// 2. Upload parameter file
			// 3. Judge the file upload status. If an error is reported, run back test will not be performed
			const callback = this.handleCallback(backtestParams, backtestInfo)
			CIQ.outputSignalsResult(backtestInfo.uuid, callback)
		},
		handleCallback(backtestParams, backtestInfo) {
			// todo lishan
			const _this = this
			backtestParams.uuid = backtestInfo.pk
			backtestParams = JSON.stringify(backtestParams)
			const uuid = backtestInfo.uuid
			const backtestDataStr = _this.$qs.stringify(backtestInfo)
			return async function() {
				if(arguments[0] == 200) {
					const S3DataStr = _this.$qs.stringify({
						file_name: `${uuid}/${uuid}__backtest_params.json`,
						file_name: backtestParams
					})
					await uploadS3(S3DataStr)
					const res = await runBacktest(backtestDataStr)
					if(res.status != 201) return
					//After saving successfully, clear the backtestinfo back to the original state
					_this.$store.commit('form/initialBacktestInfo')
					//clear old_ uuid
					if (_this.$store.state.form.backtestInfo.old_uuid) _this.$store.commit('form/clearBacktestUuid')
					// _this.$refs.historyChild.refreshHistory(res.data.id)
					_this.pollingBTRunResults(res.data.id)
				}
			}
		},
		pollingBTRunResults(id) {
			/*
			根据 id 轮询回测结果
			todo lishan
			*/
			const _this = this
			_this.clearInterval = clearPromiseInterval
			let timer = setPromiseInterval(async () => {
				const res = await getStatus(id)
				CIQ.nprogress.inc()
				const status = res.data.status
				const data = res.data
				if(status == 2) {
					clearPromiseInterval(timer).then(() => {console.log('回测跑完了')})
					data.result = isJson(data.result) ? JSON.parse(data.result) : data.result
					// 接下来会调用 view result 和 edit 方法
				}
			}, 1000)
		},
		reloadData(data, freq) {
      let frequency = ''
      this.$store.commit('chart/getEntryIndicatorsList', data.formIndicators.entry)
      this.$store.commit('chart/getExitIndicatorsList', data.formIndicators.exit)
      this.$store.commit('chart/getExtraIndicators', [])
      this.$store.commit('chart/getTechnicalIndicators', data.technicalIndicators)
      this.$store.commit('chart/getMA', data.activatedMA)
      // 暂定，读取回测携带的ma位置和信息
      this.$store.commit('chart/getMALayout', data.activatedMALayout)
      this.$store.commit('chart/setTechSD', data.savedTechSD)

      switch (freq) {
        case 'Daily': {
          frequency = 'daily'
          break
        }
        case 'Weekly': {
          frequency = 'weekly'
          break
        }
        case 'Monthly': {
          frequency = 'monthly'
          break
        }
        default: {
          break
        }
      }
      this.$store.commit('form/setRestoreFreq', frequency)
    },
	}
}
</script>

<style lang="less" scoped>
.setup {
	padding: 5px;
	background-color: #fff;
	border-radius: 12px;
}

.criteria {
	// margin-left: 40px;
	margin-bottom: 10px;
	flex: 1;
}
.criteria-container {
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #797979;
	align-items: flex-start;
}
.backtest-btns {
	margin-top: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20px;
	padding-bottom: 10px;
	margin-bottom: 12px;
	.el-button:first-child {
		background: rgb(251, 192, 92);
		border: none;
		width: 250px;
	}
	.el-button:first-child:hover {
		background-color: #f59e0b;
	}
	.el-button:last-child {
		background: #5b9bd1;
		border: none;
		width: 250px;
	}
	.el-button:last-child:hover {
		background-color: #409eff;
	}
}
@media (min-width: 820px) and (max-width: 1279px) {
	.criteria-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.criteria-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.criteria-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
	.backtest-btns {
		.el-button {
			padding: 7px;
			font-size: 12px;
		}
	}
}
.divider {
	width: 1.5px;
	background-color: #e8e6e6;
	opacity: 0.8;
	margin: 10px;
	align-self: stretch;
}
@media (min-width: 1280px) and (max-width: 1365px) {
	.criteria {
		margin: 0px 10px 10px 10px;
	}
}
@media (min-width: 820px) and (max-width: 1279px) {
	.criteria {
		margin: 0px 40px 10px 40px;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.criteria {
		margin: 0px 40px 10px 40px;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.criteria {
		border-bottom: 1px solid #797979;
	}
	.criteria {
		margin: 0px 0px 10px 0px;
	}
	.criteria-title {
		font-size: 15px;
	}
}
</style>