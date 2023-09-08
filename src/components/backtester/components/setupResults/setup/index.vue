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
					<el-button @click="displaySetUpForm">按钮</el-button>
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
import {isJson} from '@/tools/isJson'
import SignalCode from '@/tools/codeTool.js'
import { CIQ } from '@/components/common/chart/st-development/js'
import { runBacktest, getStatus, uploadS3, seeParams} from '@/service/service'
import UUID from '@/tools/uuid.js'
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'
import { CommonMethodsMixin } from "@/components/common/mixins/commonMethodsMixin"


export default {
	name: 'SetUpResults',
	components: {
		BasicInfo,
		Criteria
	},
	mixins: [CommonMethodsMixin],
	data() {
		return {
			isRiskControl: true
		}
	},
	beforeRouteEnter(to, from, next) {
	// 	if (to.path !== '/backtester/sr/setup') {
	// 		next()
	// 		return
	// 	}

  // next(async  _this => {
  //   const cachedData = _this.$store.getters.cachedBTBasicInfoData;
  //   if (Object.keys(cachedData).length !== 0) {
  //     await _this.displaySetUpForm(cachedData)
  //   }
  // })
	if (to.path === '/backtester/sr/setup') {
    next(async _this => {
      if(to.params.usedFor && to.params.usedFor === 'showBTForm'){
        console.log('说明是路由跳转过来携带参数的，用于展示表单数据')
        // 说明是路由跳转过来携带参数的
        const { data } = to.params
        const backtestEditData = isJson(data) ? JSON.parse(data) : data
        await _this.displaySetUpForm(backtestEditData)
      }else {
        // 说明不是路由跳转，而是从其他界面访问过来的，这个时候读缓存
        console.log('说明不是路由跳转，而是从其他界面访问过来的，这个时候先用编辑数据没有再读缓存')
        let editData = _this.$store.getters.rowDataForDisplay
        let cachedData = _this.$store.getters.cachedBTBasicInfoData
				let dataToUse = editData || cachedData
				console.log('editData', editData)
				console.log('cachedData', cachedData)
        if (Object.keys(dataToUse).length !== 0) {
          dataToUse = isJson(dataToUse) ? JSON.parse(dataToUse) : dataToUse
          await _this.displaySetUpForm(dataToUse)
        }
      }
    });
  } else {
    next();
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
		async runBacktest() {
			const _this = this
			_this.$refs['basicInfo'].saveData()
			const entryErr = await _this.saveCriteriaData('entryChild')
			const exitErr = await _this.saveCriteriaData('exitChild')
			console.log('entryErr', entryErr, 'exitErr', exitErr)
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
				score: backtestData[criteria].score,
				signals_in_market: backtestData[criteria].signals_in_market,
				relation: backtestData[criteria].relation,
				delay_bars: backtestData[criteria].delay_bars,
				signals: signal_list,
				cond: criteriaDescription.map((i) => i.rocCond)
			}
			saveObj[criteria] = criteriaObj
			saveObj[`${criteria}_description`] = criteriaDescription
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
			const isOnlyUseRiskControl = backtestData.risk_control.split('/').some(item => (item !== ''))
			const criteriaCapFirstL = capitalizeFirstLetter(criteria)
			const signal_list = []
			const b = new SignalCode()
			const isHandleIndicator = criteria == 'entry' || (criteria == 'exit' && !isOnlyUseRiskControl)
			if (isHandleIndicator) {
				signalList.forEach((item) => {
					// publicProperties 中的属性列表都应该保留
					const publicProperties = [
						'extreme_optimism',
						'extreme_pessimism',
						'comparison',
						'condition',
						'newCondition',
						'value',
						'conditionPeriod',
						'period',
						'ids',
						'comparison',
						'ma_period',
						'take_profit',
						'time_in_market',
						'stop_loss'
				]
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
						if (item[key] || publicProperties.includes(item[key])) {
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
				}

				const usersOwnList = this.$store.state.form[`usersOwn${criteriaCapFirstL}FileHash`]
				return usersOwnList[index] !== ''
						? usersOwnList[index]
						: signal?.url || ''
			}

			let signal = null
			if(isHandleIndicator) signal = backtestData[criteria].signals.map(findSignal)

			if (isOnlyUseRiskControl && criteria == 'exit') {
				signal = ['']
				signal_list.push({
					code: 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'
				})
			} else {
				for (let i = 0; i < signalList.length; i++) {
					console.log('未加密前的数据结构', signalList[i])
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
			backtestInfo.indicator_layout = JSON.stringify(indicatorLayout).replaceAll('\u200c', '$r001$')
			backtestInfo.description = JSON.stringify(backtestInfo.description)
			backtestInfo.entry = JSON.stringify(entrySaveObj.entry)
			backtestInfo.exit = JSON.stringify(exitSaveObj.exit)
			backtestInfo.entry_description = JSON.stringify(entrySaveObj.entry_description)
			backtestInfo.exit_description = JSON.stringify(exitSaveObj.exit_description)

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
			console.log('backtestInfo', backtestInfo)
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
			CIQ.outputSignalsResult(backtestInfo.pk, callback)
		},
		handleCallback(backtestParams, backtestInfo) {
			// todo lishan
			const _this = this
			// backtestParams.uuid = backtestParams.pk
			delete backtestParams.pk
			backtestParams = {
				uuid: backtestInfo.pk,
				...backtestParams
			}
			backtestParams = JSON.stringify(backtestParams)
			const uuid = backtestInfo.pk
			const backtestDataStr = _this.$qs.stringify(backtestInfo)
			return async function() {
				if(arguments[0] == 200) {
					const S3DataStr = _this.$qs.stringify({
						file_name: `${uuid}/${uuid}_backtest_params.json`,
						file_data: backtestParams
					})
					await uploadS3(S3DataStr)
					const res = await runBacktest(backtestDataStr)
					if(res.status != 201) return
					_this.$store.dispatch('states/set_isBacktestRunning_flag',true)
					//After saving successfully, clear the backtestinfo back to the original state
					_this.$store.commit('form/initialBacktestInfo')
					// _this.$refs.historyChild.refreshHistory(res.data.id)
					_this.pollingBTRunResults(res.data.id)
					_this.$store.dispatch('states/set_isMarkerShown_flag',false)
					//clear old_ uuid
					if (_this.$store.state.form.backtestInfo.old_uuid) _this.$store.commit('form/clearBacktestUuid')
				}
			}
		},
		pollingBTRunResults(id) {
			/*
			根据 id 轮询回测结果
			todo lishan
			*/
			console.log('进入轮询')
			const _this = this
			_this.clearInterval = clearPromiseInterval
			let timer = setPromiseInterval(async () => {
				const res = await getStatus(id)
				CIQ.nprogress.inc()
				const status = res.data.status
				const data = res.data
				console.log('回测运行状态', status)
				if(status == 2 || status == 3) {
					clearPromiseInterval(timer).then(() => {console.log('回测跑完了 状态码是', status)})
					data.result = isJson(data.result) ? JSON.parse(data.result) : data.result
					// 存入缓存数据，因为路由跳转时表单数据会丢失
					_this.$store.dispatch('form/cached_BT_basic_info_data', data)
					_this.viewBacktestResults(data)
					// 回测跑完不一定要调用这个去展示 set up form， 因为刚跑完这个 set up form 肯定是有数据的
					// await _this.displaySetUpForm(data)
				}
			}, 1000)
		},
		async displaySetUpForm(data) {
			/* 填充和展示 Set Up 表单的数据 */
			let _this = this
			/* 用于测试是否能查看结果 start */
			// data = {
			// 	id: "04c846e4-63a5-9c78-b06d-0d2492e4efd3",
			// 	user: "04f7c8dc-93fb-4f38-b680-638b06e108b7",
			// 	name: "SPX  2023-9-4  17:56:22",
			// 	capital: 100000,
			// 	symbol: "SPX",
			// 	benchmark: "SPX",
			// 	create_date: "2023-09-04T09:56:51.783347Z",
			// 	start_date: "1800-10-01",
			// 	end_date: "2023-09-04",
			// 	capital_alloc: "1.000000",
			// 	commission: "0.10",
			// 	slippage: "0.00",
			// 	frequency: "Daily",
			// 	win_rate: "0.0000",
			// 	risk_control: "//20",
			// 	user_tag: "client",
			// 	report_url: "",
			// 	direction: "Long",
			// 	favorites: false,
			// 	indicator_layout: "{\"technicalIndicators\":[],\"savedTechSD\":[{\"type\":\"model_smart_money\",\"inputs\":{\"Period\":13,\"Overlay\":false,\"id\":\"$r001$model_smart_money$r001$ (13,n)\",\"display\":\"$r001$model_smart_money$r001$ (13,n)\"},\"outputs\":{},\"parameters\":{\"studyOverZonesEnabled\":false,\"studyOverBoughtValue\":0.3,\"studyOverBoughtColor\":\"#FF0000\",\"studyOverSoldValue\":0.7,\"studyOverSoldColor\":\"#00DD00\",\"chartName\":\"chart\",\"editMode\":true,\"panelName\":\"$r001$model_smart_money$r001$ (13,n)\"},\"panel\":\"$r001$model_smart_money$r001$ (13,n)\"}],\"activatedMA\":[{\"period\":21,\"url\":\"\"}],\"activatedMALayout\":[],\"formIndicators\":{\"entry\":[\"model_smart_money\"],\"exit\":[\"\"]}}",
			// 	strategy: "Signal",
			// 	result: {
			// 	"Total Trades": 62,
			// 	"Total Return (%)": -24.84
			// 	},
			// 	seconds: 12,
			// 	url_data: "",
			// 	backtest_period: "21",
			// 	trade_price: 2,
			// 	exclude_oo: 0,
			// 	total_trader: 62,
			// 	total_return: -24.84,
			// 	description: {
			// 	Introduction: "",
			// 	Rules: ""
			// 	},
			// 	last_entry_signal_date: null,
			// 	last_exit_signal_date: null
			// }
			// _this.$store.dispatch('form/cached_BT_basic_info_data', data)
			// _this.viewBacktestResults(data)
			/* 用于测试是否能查看结果 end */
			_this.$refs['basicInfo'].setEditData(data)
			/*
				data 中并没有 entry 和 exit
				但是 view result 和 edit backtest 按钮拿到的 row 数据中有 entry 和 exit,
				所以先判断点击按钮时有没有存，没存再发请求
			*/
			let displayData = _this.$store.getters.rowDataForDisplay
			const hasEntryOrExit = Object.hasOwnProperty.call(displayData, 'entry') && Object.hasOwnProperty.call(displayData, 'exit')
			if(!hasEntryOrExit) {
				const res = await seeParams(data.id)
				displayData = res.data
			}
			console.log('displayData', displayData)
			let signalCode = new SignalCode();

			// 解析 JSON 字符串
			displayData.entry = isJson(displayData.entry) ? JSON.parse(displayData.entry) : displayData.entry;
			displayData.exit = isJson(displayData.exit) ? JSON.parse(displayData.exit) : displayData.exit;

			// 处理 entry.signals
			if (Array.isArray(displayData.entry.signals)) {
				displayData.entry.signals = displayData.entry.signals
					.filter(item => item.code) // 过滤掉没有 code 属性的元素
					.map(value => signalCode.decode(value.code));
			}

			// 设置 entryChild 的编辑面板
			let entryPanel = displayData.entry.signals.length;
			let entryData = { entry: displayData.entry };
			_this.$refs.entryChild.setEditPanel(entryPanel, entryData);

			// 处理 exit.signals
			if (Array.isArray(displayData.exit.signals)) {
				displayData.exit.signals = displayData.exit.signals
					.filter(item => item.code && item.code !== 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999')
					.map(value => signalCode.decode(value.code));

				if (displayData.exit.signals.length === 0 || displayData.exit.signals.includes(undefined)) {
					displayData.exit.signals = [{ code: '' }];
					_this.$nextTick(() => {
						_this.$refs.exitChild.setRiskEditData(displayData);
					});
				} else {
					let exitPanel = displayData.exit.signals.length;
					let exitData = { exit: displayData.exit };
					_this.$refs.exitChild.setEditPanel(exitPanel, exitData);
				}
			}

			// this.$refs['entryChild'].setEditData()
			// this.$refs['exitChild'].setEditData()
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