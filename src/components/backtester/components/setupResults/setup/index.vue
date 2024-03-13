<template>
	<div class="setup">
		<div>
			<div class="setupBox">
			<BasicInfo ref="basicInfo" @IsRiskControl="IsRiskControl" @changeStrategy="changeStrategy"></BasicInfo>
		</div>
		<div class="set-up-container">
		<el-tabs v-model="activeName" :class="{'Signal': strategy == 'Signal', 'Dual': strategy == 'Dual', 'set-up-criteria': true}">
    <el-tab-pane label="Symbol(1)" name="first" class="symbol-pane">
			<div class="criteria-container">
				<Criteria
					class="criteria"
					ref="entryChild1"
					:config="setConfig('entry')"
					:isRiskControl="false"
				>
				</Criteria>
				<div class="divider"></div>
				<Criteria
					class="criteria"
					ref="exitChild1"
					:config="setConfig('exit')"
					:isRiskControl="isRiskControl"
				>
				</Criteria>
			</div>
		</el-tab-pane>
    <el-tab-pane label="Symbol(2)" name="second" class="symbol-pane">
			<div class="criteria-container">
				<Criteria
					class="criteria"
					ref="entryChild2"
					:config="setConfig('entry2')"
					:isRiskControl="false"
				>
				</Criteria>
				<div class="divider"></div>
				<Criteria
					class="criteria"
					ref="exitChild2"
					:config="setConfig('exit2')"
					:isRiskControl="isRiskControl"
				>
				</Criteria>
			</div>
		</el-tab-pane>
  </el-tabs>
		</div>
		<div class="backtest-btns">
			<el-tooltip
				class="item"
				effect="dark"
				content="Clear the backtest set up form "
				placement="bottom"
			>
				<el-button type="danger" @click="clearForm">Clear Form</el-button>
			</el-tooltip>
			<el-tooltip
				class="item"
				effect="dark"
				content="Complete the form filling, run the backtest, and view the results"
				placement="bottom"
			>
				<el-button :disabled="isDisabled" type="success" @click="runBacktest"
					>Run Backtest</el-button
				></el-tooltip
			>
			<!-- <el-checkbox style="margin-left:10px" v-model="test" label="download test csv" border></el-checkbox> -->
		</div>
	</div>
		<LoadingOverlay
			:isLoading="setUpLoadingSetting.isSetupLoading"
			:showProgress="setUpLoadingSetting.showProgress"
			:percentage="setUpLoadingSetting.percentage"
			:progressText="setUpLoadingSetting.progressText"
		>
		</LoadingOverlay>
	</div>
</template>

<script>
import BasicInfo from './basicInfo'
import Criteria from './criteria'
import { generateConfig } from './criteria/config'
import cloneDeep from 'lodash/cloneDeep'
import {capitalizeFirstLetter, isJson, LocalStorageUtil} from "@/utils"
import SignalCode from '@/utils/cryptoUtils/codeTool'
import { CIQ } from '@/components/common/chart/st-development/js'
import { LoadingOverlay } from "@/components/common"
import { seeParams} from '@/service/service'
import UUID from '@/utils/cryptoUtils/uuid'
import { CommonMethodsMixin } from "@/components/common/mixins/commonMethodsMixin"


export default {
	name: 'SetUp',
	components: {
		BasicInfo,
		Criteria,
		LoadingOverlay
	},
	mixins: [CommonMethodsMixin],
	data() {
		return {
			isRiskControl: true,
			isDisabled: false,
			activeName: 'first',
			strategy: 'Signal'
		}
	},
	beforeRouteEnter(to, from, next) {
	if (to.path === '/backtester/sr/setup' && from.path.includes('/backtester')) {
    next(async _this => {
				_this.setSetUpLoadingSetting(true, false, 0, 'Loading...')
				_this.$refs['entryChild1'].clearForm()
				_this.$refs['exitChild1'].resetForm()
				_this.$refs['entryChild2'].clearForm()
				_this.$refs['exitChild2'].resetForm()
				if(to.params.usedFor && to.params.usedFor === 'showBTForm'){
					console.log('说明是路由跳转过来携带参数的，用于展示表单数据')
					// 说明是路由跳转过来携带参数的
					const { data } = to.params
					const backtestEditData = isJson(data) ? JSON.parse(data) : data
					await _this.displaySetUpForm(backtestEditData)
				}else {
					// 说明不是路由跳转，而是从其他界面访问过来的，这个时候读缓存
					console.log('说明不是路由跳转，而是从其他界面访问过来的，这个时候先用编辑数据没有再读缓存')
					let editData = _this.$store.state.form.rowDataForDisplay // scope.row 点击过来的缓存
					let cachedData = _this.$store.state.form.cachedBTBasicInfoData // 回测运行结束的缓存
					let dataToUse = editData || cachedData
					console.log('editData', editData)
					console.log('cachedData', cachedData)
					if (Object.keys(dataToUse).length !== 0) {
						dataToUse = isJson(dataToUse) ? JSON.parse(dataToUse) : dataToUse
						dataToUse.old_uuid = dataToUse.id
						await _this.displaySetUpForm(dataToUse)
					}
				}
				_this.setSetUpLoadingSetting(false, false, 0, 'Loading...')
				CIQ.hideCover()
    });
  } else {
    next(async _this => {
			// 如果跳转携带 backtestID 则填充
			const backtestID = LocalStorageUtil.get('backtestID')
			if(backtestID) {
				const res = await seeParams(backtestID)
				res.data.commission = (res.data.commission * 100).toFixed(2)
				_this.$store.state.form.favoriteBacktestRowData.id = res.data.id
				res.data.user_tag = 'client'

				_this.editBacktest(res.data)
				await _this.displaySetUpForm(res.data)
				LocalStorageUtil.remove('backtestID')
			}else {
				_this.$store.state.form.rowDataForDisplay = {};
				_this.$store.state.form.cachedBTBasicInfoData = {}
			}
		});
  }
	},
	// beforeRouteLeave(to, from, next) {
	// 	if(from.name == 'SetUp' || from.path == '/backtester/sr/setup') {
	// 		// 提醒用户表单更改会失效
	// 		this.$confirm('Unsaved changes detected. Would you like to save them before leaving the page?', 'Confirmation message', {
  //         distinguishCancelAndClose: true,
  //         confirmButtonText: 'Save',
  //         cancelButtonText: 'Discard changes'
  //       })
  //         .then(() => {
  //           this.$message({
  //             type: 'info',
  //             message: 'Save changes'
  //           });
	// 				next()
  //         })
  //         .catch(action => {
  //           this.$message({
  //             type: 'info',
  //             message: action === 'cancel'
  //               ? 'Discard changes and leave the page'
  //               : 'Stay on the current page'
  //           })
	// 		   next()
  //         });
	// 	}else {next()}
  // },
	computed: {
    setUpLoadingSetting() {
      // 从 Vuex store 中获取全局 loading 状态
      return this.$store.state.form.setUpLoadingSetting
    },
	chartLoadingSetting() {
      // 从 Vuex store 中获取chart loading 状态
      return this.$store.state.chart.chartLoadingSetting
    },
  },
	watch: {
    setUpLoadingSetting: {
      handler(newValue, _) {
        // 在对象属性发生变化时触发的处理逻辑
				this.setUpLoadingSetting = newValue
      },
      deep: true, // 启用深度监听，监视对象属性的变化
    },
    chartLoadingSetting: {
      handler(newValue, _) {
		this.isDisabled = newValue.isChartLoading?true:false
      },
      deep: true, // 启用深度监听，监视对象属性的变化
    },
  },
	methods: {
		setConfig(criteria) {
			// 传入 entry 和 exit 的配置
			return generateConfig(criteria)
		},
		IsRiskControl(isRiskControl) {
			this.isRiskControl = isRiskControl
		},
		changeStrategy(val) {
			this.strategy = val
		},
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.$store.commit('initialBacktestInfo');
			['basicInfo', 'entryChild1', 'exitChild1', 'entryChild2', 'exitChild2'].forEach(refName => {
				this.$refs[refName].clearForm();
			});
		},
		setSetUpLoadingSetting(isSetupLoading, showProgress, percentage, progressText) {
			this.$store.commit('form/SET_SETUP_LOADING', {
				isSetupLoading,
				showProgress,
				percentage,
				progressText
			})
		},
		async runBacktest() {
			debugger
			const _this = this
			const basicErr = await _this.$refs['basicInfo'].saveData()
			if(basicErr) {_this.setSetUpLoadingSetting(false, false, 0, ''); return}
			CIQ.addCover()
			_this.setSetUpLoadingSetting(true, true, 5, 'Saving backtest basic information...')
			_this.setSetUpLoadingSetting(true, true, 10, 'Saving backtest entry and exit criteria...')
			const saveAndCheckCriteriaErrors = async (childName) => {
				const err = await _this.saveCriteriaData(childName);
				return err;
			};
			const checkAndHandleError = (err, errMsg) => {
				if (!err) {
					_this.setSetUpLoadingSetting(false, false, 0, errMsg);
					_this.popUpMsgBox(errMsg);
					CIQ.hideCover();
					return true;
				}
				return false;
			};
			const entryErr = await saveAndCheckCriteriaErrors('entryChild1')
			const exitErr = await saveAndCheckCriteriaErrors('exitChild1')
			const errMsg = 'Error saving backtest entry and exit criteria...'
			if (checkAndHandleError(entryErr, errMsg) || checkAndHandleError(exitErr, errMsg)) return
			if(_this.strategy === 'Dual') {
				const entryErr2 = await saveAndCheckCriteriaErrors('entryChild2')
				const exitErr2 = await saveAndCheckCriteriaErrors('exitChild2')
				const errMsg2 = 'Error saving backtest entry2 and exit2 criteria...'
				if (checkAndHandleError(entryErr2, errMsg2) || checkAndHandleError(exitErr2, errMsg2)) return
			}
			// 处理上传到后端的数据
			debugger
			const saveObj = (type) => _this.handleSavedData(type);
			const entrySaveObj = saveObj('entry');
			const exitSaveObj = saveObj('exit');
			let indicatorLayout = _this.saveIndicatorLayoutData();// 只需要调用一次就能存储 formIndicators 以外的数据
			const setAndSaveIndicator = (entrySaveObj, exitSaveObj, type) => {
				const exitType = type === 'entry' ? 'exit' : 'exit2'
				_this.setSetUpLoadingSetting(true, true, 20, 'Saving backtest indicator...');
				indicatorLayout.formIndicators = {
					...indicatorLayout.formIndicators,
					[type]: entrySaveObj.indicatorLayout.formIndicators[`${type}Signal`],
					[exitType]: exitSaveObj.indicatorLayout.formIndicators[`${exitType}Signal`]
				};
			};
			setAndSaveIndicator(entrySaveObj, exitSaveObj, 'entry');
			let additionalSaveObj = null
			if (_this.strategy === 'Dual') {
				const entrySaveObj2 = saveObj('entry2');
				const exitSaveObj2 = saveObj('exit2');
				setAndSaveIndicator(entrySaveObj2, exitSaveObj2, 'entry2');
				additionalSaveObj = {
					entrySaveObj2,
					exitSaveObj2
				}
			}
			_this.setSetUpLoadingSetting(true, true, 25, 'Processing saved backtest information...');
			_this.reassignBTAttributes(entrySaveObj, exitSaveObj, indicatorLayout, additionalSaveObj);

		},
		async saveCriteriaData(criteriaRef) {
			debugger
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
			debugger
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
			const isOnlyUseRiskControl = backtestData[criteria].relation == 0
			const criteriaCapFirstL = capitalizeFirstLetter(criteria)
			const signal_list = []
			const b = new SignalCode()
			const isHandleIndicator = criteria.startsWith('entry') || (criteria.startsWith('exit') && !isOnlyUseRiskControl)
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

			if (isOnlyUseRiskControl && criteria.startsWith('exit')) {
				signal = ['']
				signal_list.push({
					code: 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999'
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
		reassignBTAttributes(entrySaveObj, exitSaveObj, indicatorLayout, additionalSaveObj) {
			debugger
			const backtestInfo = cloneDeep(this.$store.state.form.backtestInfo)
			const shouldAddExtraProperty = additionalSaveObj !== null && typeof additionalSaveObj === 'object' && Object.keys(additionalSaveObj).length
			backtestInfo.indicator_layout = JSON.stringify(indicatorLayout).replaceAll('\u200c', '$r001$')
			backtestInfo.description = JSON.stringify(backtestInfo.description)
			backtestInfo['entry'] = JSON.stringify(entrySaveObj['entry'])
			backtestInfo['exit'] = JSON.stringify(exitSaveObj['exit'])
			if(shouldAddExtraProperty) {
				// 新增保存属性
				backtestInfo['entry2'] = JSON.stringify(additionalSaveObj['entrySaveObj2']['entry2'])
				backtestInfo['exit2'] = JSON.stringify(additionalSaveObj['exitSaveObj2']['exit2'])
				backtestInfo['entry2_description'] = JSON.stringify(additionalSaveObj['entrySaveObj2']['entry2_description'])
				backtestInfo['exit2_description'] = JSON.stringify(additionalSaveObj['exitSaveObj2']['exit2_description'])
			}
			backtestInfo['entry_description'] = JSON.stringify(entrySaveObj['entry_description'])
			backtestInfo['exit_description'] = JSON.stringify(exitSaveObj['exit_description'])
			backtestInfo.old_uuid = backtestInfo.old_uuid
			if(!backtestInfo.old_uuid) delete backtestInfo.old_uuid
			// 判断是否有 direction 没有设置默认值
			backtestInfo.direction = backtestInfo.direction ? backtestInfo.direction : 'Long'

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
				'description',
				'market_environment',
				'index_moving_average_slope',
				'opted'
			]
			console.log('backtestInfo', backtestInfo)
			if(shouldAddExtraProperty) selectedProps.push('entry2', 'exit2', 'direction2', 'symbol2')
			let backtestParams = Object.assign(
				{},
				...selectedProps.map((prop) => ({ [prop]: backtestInfo[prop] }))
			)
			// Before the back test, load the data of the whole period and generate CSV to upload S3, and then update the form when the results come out
			this.setSetUpLoadingSetting(true, true, 30, 'Processing saved backtest information...')
			this.reloadData(indicatorLayout, backtestInfo.frequency)
			// 1. Upload data file
			// 2. Upload parameter file
			// 3. Judge the file upload status. If an error is reported, run back test will not be performed
			
			this.setSetUpLoadingSetting(true, true, 40, 'Uploading backtest data...')
			const callback = this.handleCallback(backtestParams, backtestInfo)
			CIQ.addIndicators({type:'outputSignalsResult',pk:backtestInfo.pk},callback)
		},
		async displaySetUpForm(data) {
			/* 填充和展示 Set Up 表单的数据 */
			if(!data.id) return
			let _this = this
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
			await this.transformOldName(displayData,'entry')

			// 设置 entryChild1 的编辑面板
			let entryPanel = displayData.entry.signals.length;
			let entryData = { entry: displayData.entry };
			_this.$refs.entryChild1.setEditPanel(entryPanel, entryData);

			// 处理 exit.signals
			if (Array.isArray(displayData.exit.signals)) {
				displayData.exit.signals = displayData.exit.signals
					.filter(item => item.code && (item.code !== 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999'  && item.code !== 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'))
					.map(value => signalCode.decode(value.code));
			const riskValArr = data.risk_control.split('/');
			_this.isRiskControl = !riskValArr.every(item => item === '');
				if (displayData.exit.signals.length === 0 || displayData.exit.signals.includes(undefined)) {
					displayData.exit.signals = [{ code: '' }];
					_this.$nextTick(() => {
						_this.$refs.exitChild1.setRiskEditData(displayData);
					});
				} else {
					await this.transformOldName(displayData,'exit')

					let exitPanel = displayData.exit.signals.length;
					let exitData = { exit: displayData.exit };
					_this.$refs.exitChild1.setEditPanel(exitPanel, exitData);
				}
			}

			
			// this.$refs['entryChild1'].setEditData()
			// this.$refs['exitChild1'].setEditData()
		},
	}
}
</script>

<style lang="less" scoped>
.setup {
	background-color: #fff;
	border-radius: 12px;
	position: relative;
}
.criteria {
	// margin-left: 40px;
	flex: 1;
}
.criteria-container {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}
.set-up-criteria {
	padding: 10px;
	border-bottom: 2px solid #cacaca;
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
	background-color: #cacaca;
	opacity: 0.8;
	margin: 0 10px;
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
/deep/ .Signal > .el-tabs__header {
		// opacity: 0;
		display: none;
}
/deep/ .Dual > .el-tabs__header {
		// opacity: 1;
		display: block;
}
</style>