import { CIQ } from '@/components/common/chart/st-development/js'
import {capitalizeFirstLetter, timestampToTime, isJson } from '@/utils'
import { getSymbolInfo,getCoresSymbolDual } from '@/utils/globalFunc'
import {
	getBacktestName,
	seeParams,
	copyBacktest,
	deleteBacktest,
	favoriteBacktest,
	getAllHistoryList,
	getAllFavoriteList,
	uploadS3,
	runBacktest,
	getStatus,
	findLastSignalApi,
	getBTV1Backtest,
	getOPTStatus
} from '@/service/service.js'
import UUID from '@/utils/cryptoUtils/uuid'
import SignalCode from '@/utils/cryptoUtils/codeTool'
import cloneDeep from 'lodash/cloneDeep'
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'
import { RefreshBus } from '@/components/backtester/components/list/EventBus/Bus'
import { conditionRadioMap } from './conditionRadioMap'

export const CommonMethodsMixin = {
	data() {
		return {
			favorite_array: [],
			isAllFLSRequestsDone: false, // 标识 find last signal 的所有请求有没有全部完成
		}
	},
	methods: {
		async viewBacktestResults(data) {
			CIQ.addCover('Fetching backtest information...')
			this.loading = true
			const currentPage = this.currentPage
			/* 如果 currentPage 是 History 或者 Favorites,则传入 old_uuid，否则不传*/
			if (['History', 'Favorites'].includes(currentPage)) {
				data.old_uuid = data.id
			} else {
				if (data.hasOwnProperty('old_uuid')) delete data.old_uuid
			}
			data.commission = (data.commission * 100).toFixed(2)
			this.$store.commit('form/RESULT_DATA_FOR_SETUP_DISPLAY', data) 
			this.$store.commit('form/CACHED_SCOPED_ROW_IMMUTABLE', data)
			// 在发送组件中进行路由跳转并传递参数
			this.$store.commit('form/getBacktestSymbol', data.symbol)
			this.$store.dispatch('states/set_isMarkerShown_flag', false)
			// indicator_layout肯定有，所以这里不用判断res.data.indicator_layout没有的情况
			let parsedData =
				typeof data.indicator_layout === 'string'
					? JSON.parse(data.indicator_layout.replaceAll('$r001$', '\u200c'))
					: data.indicator_layout
			this.restoreIndicatorLayoutView(parsedData, data.frequency, data, data)
		},
		async editBacktest(data) {
			CIQ.addCover('Fetching backtest information...')
			this.loading = true
			const currentPage = this.currentPage
			/* 如果 currentPage 是 History 或者 Favorites,则传入 old_uuid，否则不传*/
			if (['History', 'Favorites'].includes(currentPage)) {
				data.old_uuid = data.id
				data.user_tag = 'client'
			} else {
				if (data.hasOwnProperty('old_uuid')) delete data.old_uuid
			}
			data.commission = (data.commission * 100).toFixed(2)
			this.$store.commit('form/RESULT_DATA_FOR_SETUP_DISPLAY', data)
			this.$store.commit('form/CACHED_SCOPED_ROW_IMMUTABLE', data)
			//  Restore indicator layout
			document.getElementsByClassName('ciq-period')[0].style.display = ''
			this.$store.commit('form/getBacktestSymbol', data.symbol)
			this.$store.dispatch('states/set_isMarkerShown_flag', false)

			// indicator_layout肯定有，所以这里不用判断res.data.indicator_layout没有的情况
			let parsedData =
				typeof data.indicator_layout === 'string'
					? JSON.parse(data.indicator_layout.replaceAll('$r001$', '\u200c'))
					: data.indicator_layout
			await this.restoreIndicatorLayoutEdit(parsedData, data.frequency, data, data)
		},
		async copyBacktest(data) {
			try {
				this.loading = true
					/* 为防止出现重名, 在这里加上时间戳 */
					const generateCopyName = (name) => {
						const datePattern = /\(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\)/;
						
						// 去掉 data.name 中已有的日期时间部分
						const cleanedName = name.replace(datePattern, '');
						
						const now = new Date();
						const year = now.getFullYear();
						const month = String(now.getMonth() + 1).padStart(2, '0');
						const day = String(now.getDate()).padStart(2, '0');
						const hour = String(now.getHours()).padStart(2, '0');
						const minute = String(now.getMinutes()).padStart(2, '0');
						const second = String(now.getSeconds()).padStart(2, '0');
						
						const copyName = `${cleanedName}(copy) (${year}-${month}-${day} ${hour}:${minute}:${second})`;
						
						return copyName;
				}
				const copyName = generateCopyName(data.name)
				// 检查是否已经存在同名的 backtest
				const nameLookUp = await getBacktestName(copyName)
				const isDuplicate = nameLookUp.data.results.some(
					item => item.name === copyName
				)

				if (isDuplicate) {
					this.popUpMsgBox('The backtest has been copied')
				} else {
					data = JSON.parse(JSON.stringify(data))
					for (const key in data) {
						if (data.hasOwnProperty(key)) {
							if (data[key] !== null && (typeof data[key] === 'object' || Array.isArray(data[key]))) {
								data[key] = JSON.stringify(data[key]);
							}
						}
					}
					// 获取参数并准备复制
					const params = {
						...data,
						name: copyName,
						favorites: false,
						user_tag: 'client',
						strategy: data.strategy === 'Signal' ? 'Single' : data.strategy
					}
					delete params.uuid
					delete params.results
					delete params.user_id
					delete params.status
					delete params.backtest_id
					delete params.old_uuid
					delete params._last_entry_signal_date
					delete params._last_exit_signal_date

					// 发起复制请求
					await copyBacktest(this.$qs.stringify(params))

					// 重置查询页码并获取数据 History
					if (this.currentPage === 'History') {
						this.queryInfo.page = 1
						await this.getDataList(null)
					}
					if (['Sample', 'Favorites', 'Analyst'].includes(this.currentPage)) {
						this.$router.push('/backtester/list/history')
					}
					this.popUpMsgBox('Copy successfully')
				}
				this.loading = false
			} catch (error) {
				console.error('An error occurred:', error)
				this.loading = false
			}
		},

		async deleteBacktest(id) {
			this.loading = true
			await deleteBacktest(id)
			this.getDataList(null)
			this.loading = false
			this.popUpMsgBox('Successfully deleted')
			// RefreshBus.$emit('refresh-list')
		},
		async addToFavorites(data) {
			this.loading = true
			const params = {
				favorites: true
			}
			await favoriteBacktest(data.id, this.$qs.stringify(params))
			this.getDataList(null)
			this.loading = false
			this.popUpMsgBox('Successfully added to favorites')
			// RefreshBus.$emit('refresh-list')
		},
		async moveToFavorites(data) {
			this.loading = true
			const params = {
				favorites: false
			}
			await favoriteBacktest(data.id, this.$qs.stringify(params))
			this.getDataList(null)
			this.loading = false
			this.popUpMsgBox('Removed from favorites')
			// RefreshBus.$emit('refresh-list')
		},
		async rerunBacktest(data) {
			this.loading = true
			// 打开遮罩层，改变 loadingTest
			// this.$store.commit('form/SET_LIST_LOADING', true)
			this.loadTest = 'Re-running Backtest in Progress...'
			await this.rerunThisBacktest(cloneDeep(data))
			// rerun 后重新请求列表 我并不需要把所有列表都更新
			// await this.getDataList(null)
			await this.viewBacktestResults(this.$store.state.states.cacheReRunData)
			this.loading = false
		},
		async runOrFindAndLoop(actionType) {
			this.showFLSMASK()
			if (actionType === 'signal') {
				this.isAllFLSRequestsDone = false
				this.$store.commit('form/clearHashTable')
				this.favorite_array = await this.getAllFavoriteData(1)
				this.$store.commit(
					'form/SET_LASTSIGNAL_ARRAY',
					this.favorite_array.map(item => {
						return { name: item.name, content: item, state: 0, id: item.id }
					})
				)
				await this.loopAllFavorites()
			} else if (actionType === 'backtest') {
				this.favorite_array = await this.getAllHistoryListData(1)
				this.$store.commit(
					'form/SET_RUNALL_BACKTEST_ARRAY',
					this.favorite_array.map(item => {
						return { name: item.name, content: item, state: 0, id: item.id }
					})
				)
				await this.loopAllHistories()
			} else if (actionType === 'btv1') {
				this.favorite_array = await this.getAllBTV1Data()
				if (!this.favorite_array) {
					// 如果没有更多需要迁移的bt，则设为state == 3,并在弹窗判断为无需迁移值
					this.$store.commit('form/SET_RUNALL_BACKTEST_ARRAY', [{ state: 3 }])
					return
				}
				this.favorite_array.forEach(item=>{
					let parsedIndicatorLayout =
					typeof item['indicator_layout'] === 'string'
						? JSON.parse(item['indicator_layout'])
						: item['indicator_layout']
					parsedIndicatorLayout.savedTechSD = []
					item['indicator_layout'] = JSON.stringify(parsedIndicatorLayout)
				})


				// 先截取第一个结果看能不能跑
				//this.favorite_array = this.favorite_array.slice(0, 10)

				this.$store.commit(
					'form/SET_RUNALL_BACKTEST_ARRAY',
					this.favorite_array.map(item => {
						return { name: item.name, content: item, state: 0, id: item.id }
					})
				)
				await this.loopAllHistories()
			}
		},
		async findLastSignal() {
			// lishan 批量给列表调用
			// this.$store.commit('form/clearHashTable')
			// this.showFLSMASK()
			// this.favorite_array = await this.getAllFavoriteData(1)
			// this.$store.commit('form/SET_LASTSIGNAL_ARRAY', this.favorite_array.map(item => { return { name: item.name, content: item, state: 0, id: item.id } }))
			// await this.loopAllFavorites()
			await this.runOrFindAndLoop('signal')
		},
		async loopAllFavorites() {
			for (let i = 0; i < this.favorite_array.length; i++) {
				const item = this.favorite_array[i]
				this.$store.commit('form/getBacktestSymbol', item.symbol)
				// 参考 55 行 in viewBacktestResults
				let parsedData =
				typeof item.indicator_layout === 'string'
					? JSON.parse(item.indicator_layout.replaceAll('$r001$', '\u200c'))
					: item.indicator_layout
				this.reloadData(parsedData, item.frequency, item)
				await CIQ.addIndicators({type:'loadFromBacktest'},() => {})
				await this.loopCalculateNewConditions(item)
				this.uploadCSVWhileFLS(item)
			}
			await this.findAllFavoritesSignal()
			this.isAllFLSRequestsDone = true
			// 循环结束之后请求一次列表
			await this.getDataList(null)
			
			if (!CIQ.Studies) return
			this.$store.dispatch('chart/reset_chart_study_state')
			this.$store.dispatch('form/reset_chart_config_state')
			this.$store.commit('form/getFrequency', '')
		},
		async loopAllHistories() {
			for (let i = 0; i < this.favorite_array.length; i++) {
				await this.rerunThisBacktest(this.favorite_array[i])
			}
			// 循环结束之后请求一次列表
			await this.getDataList(null)

			if (!CIQ.Studies) return
			this.$store.dispatch('chart/reset_chart_study_state')
			this.$store.dispatch('form/reset_chart_config_state')
			this.$store.commit('form/getFrequency', '')
			CIQ.hideCover()
		},
		
		uploadCSVWhileFLS(row) {
			// lishan 在这里保存数据到 vuex favorite 中要用
			this.$store.dispatch('chart/set_span_period', {
				start_date: row.start_date.replace(/-/g, '') * 1000000000,
				end_date: row.end_date.replace(/-/g, '') * 1000000000
			})
			const {strategy} = row
			let  content2 = null
			const content = CIQ.exportEx()
			// dual symbol
			const comparisonSymbol = CIQ.store.getters.getComparisonSymbol
			if(strategy === 'Dual') content2 = CIQ.exportEx2(comparisonSymbol.url)
			let csvObj = {
				uuid: row.id,
				csv: content,
				entry: row.entry,
				exit: row.exit,
				...(strategy === 'Dual' && row.entry2 && row.exit2 && content2 ? { entry2: row.entry2, exit2: row.exit2, csv2: content2 } : {})
			};
			this.$store.commit('form/setHashTable', csvObj)
			// 暂时设置成成功
			this.$store.state.form.last_signal_array.map(item => {
				if (item.name == row.name) {
					item.state = 1
				}
			})
		},
		async findAllFavoritesSignal() {
			const list = this.$store.state.form.hashTable
			const requestMap = {} // 用于将请求和 uuid 关联起来的对象

			for (let i = 0; i < list.length; i++) {
				const uuid = list[i].uuid
				const request = findLastSignalApi(list[i])
				requestMap[uuid] = request // 将请求与 uuid 关联起来
			}

			let res = await Promise.allSettled(Object.values(requestMap)) // 等待所有请求完成

			// 获取成功的请求及其对应的 uuid
			const successRes = []
			for (const uuid in requestMap) {
				if (res[Object.keys(requestMap).indexOf(uuid)].status === 'fulfilled') {
					successRes.push({
						uuid,
						result: res[Object.keys(requestMap).indexOf(uuid)].value
					})
				}
			}
			const last_signal_array = this.$store.state.form.last_signal_array
			const successUUID = successRes.map(item => item.uuid)
			// 遍历 last_signal_array，并根据成功的 uuid 来更新 status
			last_signal_array.forEach(item => {
				if (successUUID.includes(item.id)) {
					item.state = 1
				} else {
					item.state = 2
				}
			})
			this.$store.commit('form/SET_LASTSIGNAL_ARRAY', last_signal_array)
		},
		async runAllBacktest() {
			// this.showFLSMASK()
			// this.favorite_array = await this.getAllHistoryListData(1)
			// this.$store.commit('form/SET_RUNALL_BACKTEST_ARRAY', this.favorite_array.map(item => { return { name: item.name, content: item, state: 0, id: item.id } }))
			// // 对数组做批量的上传 S3 和运行回测就行了
			// await this.loopAllHistories()
			await this.runOrFindAndLoop('backtest')
		},
		async runBTV1Backtest() {
			await this.runOrFindAndLoop('btv1')
		},

		async getAllHistoryListData(reqAfterPage) {
			const res = await getAllHistoryList(reqAfterPage)
			return res
		},
		async getAllFavoriteData(reqAfterPage) {
			const res = await getAllFavoriteList(reqAfterPage)
			return res
		},
		async getAllBTV1Data() {
			const res = await getBTV1Backtest()
			return res.data.data
		},
		async rerunThisBacktest(backtestInfo) {
			const { strategy, entry_description, exit_description, entry2_description, exit2_description } = backtestInfo
			CIQ.addCover('Fetching backtest information...')
			// 这里只需要执行两个请求，上传 S3 和直接运行当前的 backtest
			backtestInfo.capital_alloc = parseFloat(backtestInfo.capital_alloc)
			backtestInfo.slippage = parseFloat(backtestInfo.slippage)
			backtestInfo.win_rate = parseFloat(backtestInfo.win_rate)
			backtestInfo.commission = parseFloat(backtestInfo.commission)
			backtestInfo.old_uuid = backtestInfo.id || backtestInfo.uuid
			backtestInfo.market_environment = backtestInfo.market_environment || 0
			backtestInfo.index_moving_average_slope =
				backtestInfo.index_moving_average_slope || 0
			// 判断是否有 direction 没有设置默认值
			backtestInfo.direction = backtestInfo.direction
				? backtestInfo.direction
				: 'Long'
			backtestInfo.favorites = backtestInfo.hasOwnProperty('favorites')
				? backtestInfo.favorites
				: false
				backtestInfo.entry_description = Array.isArray(entry_description) ? JSON.stringify(entry_description) : entry_description;
				backtestInfo.exit_description = Array.isArray(exit_description) ? JSON.stringify(exit_description) : exit_description;
				if(strategy === 'Dual') {
					backtestInfo.entry2_description = Array.isArray(entry2_description) ? JSON.stringify(entry2_description) : entry2_description;
					backtestInfo.exit2_description = Array.isArray(exit2_description) ? JSON.stringify(exit2_description) : exit2_description;
					// 属性传递默认值
					// backtestInfo.risk_control = '//'
					backtestInfo.exclude_oo = 0
					backtestInfo.market_environment = 0
					backtestInfo.index_moving_average_slope = 0
				}
				if(strategy === 'Signal') backtestInfo.strategy = 'Single'
			// end_date 改成最新的，于此同时改变 start_date
			const end_date = timestampToTime(new Date())
			const backtest_period = backtestInfo.backtest_period
			if (backtest_period <= 20) {
				const str = end_date.split('-')
				str[0] = Number(str[0]) - Number(backtest_period) + ''
				const start_date = str.join('-')
				backtestInfo.start_date = start_date
			} else if (backtest_period == 21) {
				backtestInfo.start_date = '1800-10-01'
			}
			backtestInfo.end_date = end_date
			// 运行回测之前需要把 status 变成 0
			backtestInfo.status = 0
			if (backtestInfo.hasOwnProperty('total_trader'))
				delete backtestInfo.total_trader
			if (backtestInfo.hasOwnProperty('total_return'))
				delete backtestInfo.total_return
			this.$store.dispatch('chart/set_span_period', {
				start_date: backtestInfo.start_date.replace(/-/g, '') * 1000000000,
				end_date: backtestInfo.end_date.replace(/-/g, '') * 1000000000
			})
			this.$store.commit('form/SET_TRADE_PRICE', backtestInfo.trade_price
			)
			const copyBacktestData = cloneDeep(backtestInfo)
			copyBacktestData.currentdate = new Date().getTime()
			backtestInfo.pk = UUID(JSON.stringify(copyBacktestData))
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
			const backtestInfoSelectedProps = [
				'entry_description',
				'exit_description',
				'description',
				'direction',
				'frequency',
				'backtest_period',
				'entry',
				'exit',
				'name',
				'symbol',
				'benchmark',
				'strategy',
				'capital',
				'capital_alloc',
				'commission',
				'win_rate',
				'slippage',
				'start_date',
				'end_date',
				'risk_control',
				'report_url',
				'user_tag',
				'trade_price',
				'exclude_oo',
				'indicator_layout',
				'favorites',
				'pk',
				'old_uuid',
				'results',
				'market_environment',
				'index_moving_average_slope',
				'opted'
			]
			if(strategy === 'Dual') {
				selectedProps.push('entry2', 'exit2', 'direction2', 'symbol2')
				backtestInfoSelectedProps.push('entry2_description', 'exit2_description', 'entry2', 'exit2', 'direction2', 'symbol2')
			}
			let backtestParams = Object.assign(
				{},
				...selectedProps.map(prop => ({ [prop]: backtestInfo[prop] }))
			)
			let selectedBacktestInfo = Object.assign(
				{},
				...backtestInfoSelectedProps.map(prop => ({
					[prop]: backtestInfo[prop]
				}))
			)

			//  Restore indicator layout
			document.getElementsByClassName('ciq-period')[0].style.display = ''
			this.$store.commit('form/getBacktestSymbol', backtestInfo.symbol)
			this.$store.dispatch('states/set_isMarkerShown_flag', false)

			let parsedData =
			typeof backtestInfo.indicator_layout === 'string'
				? JSON.parse(backtestInfo.indicator_layout.replaceAll('$r001$', '\u200c'))
				: backtestInfo.indicator_layout
			this.reloadData(parsedData, backtestInfo.frequency, backtestInfo)
			const callback = this.handleRunAllCallback(
				backtestParams,
				selectedBacktestInfo
			)
			// symbol ohlcv 要做特殊处理
			const _this = this
			await CIQ.addIndicators({type:'loadFromBacktest'},() => {
				// 展示 result 时要用
				_this.$store.commit('form/getRunBacktestData', backtestInfo)
				//CIQ.hideCover()
			})
			
			await this.loopCalculateNewConditions(backtestInfo)
			await CIQ.uploadCSVJSON(backtestInfo.pk, callback)
		},
		async loopCalculateNewConditions(backtestInfo) {
			const {strategy} = backtestInfo
			const processSignals = async (signals, type) => {
				for (let index = 0; index < signals.length; index++) {
					await this.calculateNewConditions(signals[index], type, index);
				}
			};
			const decodeAndMapConditionRadio = async (entryType, exitType) => {
				let { signals: entrySignals } = this.decodeCriteria(backtestInfo, entryType)
				let { signals: exitSignals } = this.decodeCriteria(backtestInfo, exitType)
				exitSignals = exitSignals.filter(item => item)
				conditionRadioMap(entrySignals,exitSignals, entryType, exitType)
				await processSignals(entrySignals, entryType)
				await processSignals(exitSignals, exitType)
			}
			await decodeAndMapConditionRadio('entry', 'exit')
			if(strategy === 'Dual') await decodeAndMapConditionRadio('entry2', 'exit2')

			// let { signals: entrySignals } = this.decodeCriteria(backtestInfo, 'entry')
			// let { signals: exitSignals } = this.decodeCriteria(backtestInfo, 'exit')
			// 循环计算出显示在 chartIQ 的数据,只有当 analysis 是 'Symbol' 'Sentiment' 'User' 才计算
			// exitSignals = exitSignals.filter(item => item) // 过滤出 exit 的 only use risk control
			
			// 写一个函数来map所有情况的condition radio
			// conditionRadioMap(entrySignals,exitSignals)

			// 把對tech類型的判斷放在calculateNewConditions，防止indicator的panelIndex不一致的bug
			// if (entrySignals.length !== 0)
			// 	entrySignals = entrySignals.filter(item =>
			// 		['Symbol', 'Sentiment', 'User'].includes(item.analysis)
			// 	)
			// if (exitSignals.length !== 0)
			// 	exitSignals = exitSignals.filter(item =>
			// 		['Symbol', 'Sentiment', 'User'].includes(item.analysis)
			// 	)

			// for (let index = 0; index < entrySignals.length; index++) {
			// 	await this.calculateNewConditions(entrySignals[index], 'entry', index)
			// }
			// for (let index = 0; index < exitSignals.length; index++) {
			// 	await this.calculateNewConditions(exitSignals[index], 'exit', index)
			// }
		},

		calculateNewConditions(signals, criteria, panelIndex) {
			if( !['Symbol', 'Sentiment', 'User'].includes(signals.analysis) ) return
			const isROCLike = signals.isROCLike
			const indicator = signals.indicator
			const newCondition = signals.newCondition
			const conditionPeriod = signals.conditionPeriod
			const analysis = signals.analysis

			if (!isROCLike) return

			const conditionMap = new Map([
				[5, { name: 'Rate Of Change', abbr: 'ROC' }],
				[6, { name: '% of Previous Range', abbr: 'OPR' }],
				[7, { name: 'MA Ratio', abbr: 'MA' }],
				[8, { name: 'Range Rank', abbr: 'RR' }],
				[9, { name: 'DrawDown %', abbr: 'DD' }],
				[10, { name:'DrawUp %', abbr: 'DU' }],
				[11, { name:'Net Change', abbr: 'NC' }],
				[12, { name:'All-time High', abbr: 'ATH' }],
				[13, { name:'All-time Low', abbr: 'ATL' }],
				[14, { name:'Consecutive Number of Days Above', abbr: 'CNDA' }],
          		[15, { name:'Consecutive Number of Days Below', abbr: 'CNDB' }],
				[16, { name:'N-Day High', abbr: 'NH' }],
				[17, { name:'N-Day Low', abbr: 'NL' }],
			])
			let indicator_url = ''
			let indicator_url_with_ma = ''
			let fieldName = ''
			let stmaPeriod
			// if(signals.indicator == 'Crude oil price' && criteria=='entry' && panelIndex == 1){
			// 	debugger
			// } 

			if (analysis == 'Sentiment' || analysis == 'User') {
				let signal = CIQ.findSentiIndicator(indicator)
				// 是senti则为senti url, 反之为User的name
				indicator_url = signal?signal.url:indicator
			}
			if (indicator_url && analysis === 'Sentiment') {
				for (const studyInstanceName in CIQ.stxx.layout.studies) {
					if (
						CIQ.stxx.layout.studies[studyInstanceName].inputs.Field ==
							indicator_url &&
						CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria ==
							criteria &&
						CIQ.stxx.layout.studies[studyInstanceName].parameters.index ==
							panelIndex
					) {
						if (CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA') {
							indicator_url_with_ma = Object.keys(
								CIQ.stxx.layout.studies[studyInstanceName].outputMap
							)[0]
							stmaPeriod = CIQ.stxx.layout.studies[studyInstanceName].inputs.Period
							break
						}
					}
				}
			} else if (indicator_url && analysis === 'User') {
				// 考虑到User自定义的indicator_url是name,所以需要和senti区分开判断
				for (const studyInstanceName in CIQ.stxx.layout.studies) {
					const url = CIQ.stxx.layout.studies[studyInstanceName].type
					let field
					if(url && url.indexOf('CREATE') != -1 && url.split(/CREATE/)[0] == signals.indicator){
						field = signals.indicator
						fieldName = url
					}
					if(url && url.indexOf('HASH') != -1 && url.split(/HASH/)[0] == signals.indicator){
						field =signals.indicator
						fieldName = url
					}
					if (
						field == indicator_url &&
						CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria ==
							criteria &&
						CIQ.stxx.layout.studies[studyInstanceName].parameters.index ==
							panelIndex
					) {
						if (CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA') {
							indicator_url_with_ma = Object.keys(
								CIQ.stxx.layout.studies[studyInstanceName].outputMap
							)[0]
							stmaPeriod = CIQ.stxx.layout.studies[studyInstanceName].inputs.Period
							break
						}
					}
				}
			} else if (indicator && analysis === 'Symbol') {
				const symbolCond = CIQ.findSymbolIndicator(indicator, null)
				fieldName = symbolCond ? symbolCond.field : ''
			}

			for (const studyInstanceName in CIQ.stxx.layout.studies) {
				// 判断 senti,user
				const f1 =
					CIQ.stxx.layout.studies[studyInstanceName].inputs.Field ==
						indicator_url_with_ma ||
					(CIQ.stxx.layout.studies[studyInstanceName].inputs.Field ==
						indicator_url &&
						CIQ.stxx.layout.studies[studyInstanceName].type != 'ST MA')
				// 判断 symbol
				const f2 =
					CIQ.stxx.layout.studies[studyInstanceName].inputs.Field ==
						fieldName &&
					CIQ.stxx.layout.studies[studyInstanceName].type != 'ST MA'
				// 判断 condition
				const fc =
					CIQ.stxx.layout.studies[studyInstanceName].parameters.criteria ==
						criteria &&
					CIQ.stxx.layout.studies[studyInstanceName].parameters.index ==
						panelIndex
				if ((f1 || f2) && fc) {
					CIQ.Studies.removeStudy(
						CIQ.stxx,
						CIQ.stxx.layout.studies[studyInstanceName]
					)
				}
			}

			// this.$store.dispatch('chart/update_roclike_count','add')
			// var study = CIQ.Studies.studyLibrary['ST ROCLike']
			// study.panelHeight = CIQ.setPanelHeight()
			// CIQ.Studies.studyLibrary['ST ROCLike'] = study
		  	const field = fieldName ||
			  (indicator_url_with_ma ? indicator_url_with_ma : indicator_url)
			const symbolLabel = getCoresSymbolDual(criteria.endsWith('2'))
			let symbolLabelDisplay = ''
			if (!(analysis == 'Sentiment' || analysis == 'User')) {
				symbolLabelDisplay = `(${symbolLabel})`
			}
			const maType = signals.ma_type == 'S' ? ' SMA' : ' EMA'
			const name = indicator_url_with_ma
                  ? this.rocDisplayName(indicator_url) + maType + stmaPeriod
                  : this.rocDisplayName(fieldName || indicator_url)
			const condition = `${conditionMap.get(newCondition).name}(${conditionPeriod}-Bar)`
			CIQ.Studies.addStudy(
				CIQ.stxx,
				'ST ROCLike',
				{
					display: `${symbolLabelDisplay}${name} ${condition}`,
					Field: field,
					condition: conditionMap.get(newCondition).abbr,
					period: conditionPeriod
				},
				null,
				{
					criteria: criteria,
					index: panelIndex
				}
			)
			this.hideDuplicateROC()
			//if(CIQ.store.state.chart.trades.length == 0) return
			//CIQ.loadChart(CIQ.store.state.chart.trades, CIQ.addMarker)
		},
		// 处理用户自定义indicator的显示名
		rocDisplayName(field) {
			let display
			let senti = CIQ.findSentiIndicator(null,field)
			if(CIQ.isOwnIndicator(field)){
				display = field.split(/CREATE/)[0]
			}else if(CIQ.isUserIndicator(field)){
				display = field.split(/HASH/)[0]
			}else if(senti){
				display = senti.chart_name
			}else {
				display = field
			}
			return display
		},
		hideDuplicateROC(){
			// 隐藏重复的ROC
			for (var p in CIQ.stxx.panels) {
				CIQ.stxx.panels[p].hidden = false;
			}

			// 创建一个辅助对象用于记录出现过的 Field ,period 和 condition 组合
			const seen = {};
			// 遍历对象的值
			for (const key in CIQ.stxx.layout.studies) {
			if (CIQ.stxx.layout.studies.hasOwnProperty(key)) {
				const currentObject = CIQ.stxx.layout.studies[key];

				if(currentObject.type != 'ST ROCLike') continue

				const symbolThatBelong = currentObject.parameters.criteria.endsWith('2') ? 'comparison' : 'main' ///dual symbol情况下相同条件不同symbol可以同时显示多个
				const keyCombination = currentObject.inputs.Field + '|' + currentObject.inputs.period + '|' + currentObject.inputs.condition + '|' + symbolThatBelong;

				// 检查辅助对象中是否已经存在相同的 name 和 index 组合
				if (seen[keyCombination]) {
					for (var p in CIQ.stxx.panels) {
						if(CIQ.stxx.panels[p].name == key){
							CIQ.stxx.panels[p].hidden = true;
							//CIQ.store.dispatch('chart/update_roclike_count','remove')
						}
					}
				} else {
					seen[keyCombination] = true; // 否则，在辅助对象中记录当前组合
				}
			}
			}
			CIQ.stxx.resizeChart();
			CIQ.stxx.draw();
		},

		decodeCriteria(backtestInfo, criteriaStr) {
			let signalCode = new SignalCode()
			let criteria = isJson(backtestInfo[criteriaStr])
				? JSON.parse(backtestInfo[criteriaStr])
				: backtestInfo[criteriaStr]
			// 删除第一个 cond 元素
			if (!criteria.cond)
				throw Error('Missing cond attribute in entry and exit')
			if (criteria.cond.length > 1) criteria.cond.shift()
			criteria.cond = criteria.cond.map(item => {
				if (item)
					return {
						...item,
						isROCLike: 5 <= item.newCondition && item.newCondition <= 17
					}
				return null
			})	
			criteria.signals = criteria.signals.map((item, index) => {
				if (
					item.code ==
						'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999' &&
					criteriaStr == 'exit'
				)
					return null
				return { ...signalCode.decode(item.code), ...criteria.cond[index] }
			})
			return criteria
		},

		/* backtest opt*/
		validateSignalsType(backtestInfo) {
			let _backtestInfo = JSON.parse(JSON.stringify(backtestInfo))
			let signalCode = new SignalCode()
			let entry_criteria = isJson(_backtestInfo['entry'])
				? JSON.parse(_backtestInfo['entry'])
				: _backtestInfo['entry']
			let exit_criteria = isJson(_backtestInfo['exit'])
				? JSON.parse(_backtestInfo['exit'])
				: _backtestInfo['exit']

			if(backtestInfo.strategy != 'Single') {
				return 'We Only Support Single Symbol Backtests.'	
			}
			if(
				signalCode.decode(entry_criteria.signals[0].code).analysis != "Sentiment" ||
				signalCode.decode(exit_criteria.signals[0].code).analysis != "Sentiment"
			) {
				return 'We Only Support Single Condition Backtests with Sentiment Indicator.'	
			}

			// if(
			// 	(signalCode.decode(entry_criteria.signals[0].code).comparison == "SV" &&
			// 	signalCode.decode(entry_criteria.signals[0].code).value == "SVMA") ||
			// 	(signalCode.decode(exit_criteria.signals[0].code).comparison == "SV" &&
			// 	signalCode.decode(exit_criteria.signals[0].code).value == "SVMA")
			// ) {
			// 	return 'Sorry, this type of optimization is currently not supported.'	
			// }

			if(
				entry_criteria.signals.length > 1 ||
				exit_criteria.signals.length > 1
			) {
				return 'We Only Support Single Condition Backtests with Sentiment Indicator.'
			}

			// if(
			// 	_backtestInfo["risk_control"] == "//"
			// ) {
			// 	return false
			// }
			
			return ''
		},
		editSignalsCond(backtestInfo, criteriaStr, value) {
			const criteriaDesc = criteriaStr=='entry'?'entry_description':'exit_description'
			let _backtestInfo = JSON.parse(JSON.stringify(backtestInfo))
			let signalCode = new SignalCode()
			
			// long: todo修改description
			let desc = isJson(_backtestInfo[criteriaDesc])
				? JSON.parse(_backtestInfo[criteriaDesc])
				: _backtestInfo[criteriaDesc]
			
				const words = desc[0]['commentDes'].split(' ');
				words[words.length - 1] = value;
			desc[0]['commentDes'] = words.join(' ');
			_backtestInfo[criteriaDesc] = desc

			
			let criteria = isJson(_backtestInfo[criteriaStr])
				? JSON.parse(_backtestInfo[criteriaStr])
				: _backtestInfo[criteriaStr]
			let decodeRes = signalCode.decode(criteria.signals[0].code)

			// 修改值，如果是前两种条件则替换value和sc.value, 第三种情况替换period和sc.period 并替换indicator_layout
			if(
				decodeRes.comparison == "SV" &&
				decodeRes.value == "SVMA"
			){
				decodeRes.period = value
				decodeRes.sc.period = value
			}else {
				decodeRes.value = value
				decodeRes.sc.value = value
			}
			criteria.signals[0].code = decodeRes
			_backtestInfo[criteriaStr] = criteria

			// 如果是第三个条件，则需要修改layout
			if(
				decodeRes.comparison == "SV" &&
				decodeRes.value == "SVMA"
			){
				let parsedIndicatorLayout =
				typeof _backtestInfo['indicator_layout'] === 'string'
					? JSON.parse(_backtestInfo['indicator_layout'].replaceAll('$r001$', '\u200c'))
					: _backtestInfo['indicator_layout']
				
					//savedTechSD
				parsedIndicatorLayout['savedTechSD'] = []
					// activatedMA
				for (let i = 0; i < parsedIndicatorLayout['activatedMA'].length; i++) {
					if (parsedIndicatorLayout['activatedMA'][i]["criteria"] === criteriaStr && parsedIndicatorLayout['activatedMA'][i]["index"] === 0) {
						parsedIndicatorLayout['activatedMA'][i]["period"] = value;
					}
				}
				_backtestInfo['indicator_layout'] = JSON.stringify(parsedIndicatorLayout).replaceAll('\u200c', '$r001$')
			}

			return this.encodeSignalsCond(_backtestInfo,criteriaStr)      
		},
		encodeSignalsCond(backtestData,criteria) {
			const signalList = backtestData[criteria].signals
			const isOnlyUseRiskControl = backtestData[criteria].relation == 0
			const criteriaCapFirstL = capitalizeFirstLetter(criteria)
			const signal_list = []
			const b = new SignalCode()
			/*
			lishan:
			isHandleIndicator 需要你去判断退场是否是 isOnlyUseRiskControl 判断条件是看 code 是否等于
			SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999
			如果是 isOnlyUseRiskControl 且 criteria 是 exit 则不需要处理编码和解码
			*/
			const isHandleIndicator = criteria.startsWith('entry') || (criteria.startsWith('exit') && !isOnlyUseRiskControl)
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
			if(isHandleIndicator) signal = backtestData[criteria].signals.map(item => item.code).map(findSignal)

			if (isOnlyUseRiskControl && criteria.startsWith('exit')) {
				signal = ['']
				signal_list.push({
					code: 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999'
				})
			} else {
				for (let i = 0; i < signalList.length; i++) {
					console.log('未加密前的数据结构', signalList[i])
					const _code = signalList[i].code
					// 在此之前找出 sentiment indicator 的极值 lishan
					if(typeof _code.ids == 'string'){
						const regex = /EO([^\/]+)\/EP([^\/]+)/;
						const match = _code.ids.match(regex);
						_code.extreme_optimism = match[1]
						_code.extreme_pessimism = match[2]
					}

					delete _code.sc
					delete _code.ids
					const code = b.encode(_code)
					signal_list.push({
						code: code
					})
				}
			}
			backtestData[criteria].signals = signal_list
			backtestData[criteria] = JSON.stringify(backtestData[criteria])
			return backtestData
		},
		async pollingOPTResults(data) {
			/*
				根据 id 轮询回测结果
				todo lishan
			*/
			const _this = this
			return new Promise(async (resolve, reject) => {
				const { id, name } = data
				console.log('进入轮询')
				_this.clearInterval = clearPromiseInterval
				let timer = await setPromiseInterval(async () => {
					try{
						if(this.pollingState == false) {
							this.popUpMsgBox('Optimization canceled')
							resolve([])
							await clearPromiseInterval(timer)
						}

						const res = await getOPTStatus(id)
						// CIQ.nprogress.inc()
						const status = res.data.opt_status
						console.log('回测状态', status)
						const response = res.data.data
						// pollingState控制手动中断轮询请求
						if (status == 1) {
							console.log('结束轮询')

							// 处理轮询结果的异常情况
							let errMsg = ''
							switch(res.data.status){
								case 500:
									errMsg = 'Optimizing error occur'
									break;
								case 431:
									errMsg = res.data.msg
									break;
								case 432:
									errMsg = res.data.msg
									break;
								case 435:
									errMsg = res.data.msg
									break;
								case 204:
									errMsg = res.data.data
									break;
								default:
							}	
							if(errMsg){
								this.loading = false
								this.close()
								this.popUpMsgBox(errMsg)
							}	

							resolve(response) // 解决 Promise 表示轮询完成
							await clearPromiseInterval(timer) // 使用 await 等待清除计时器
						}
					}catch(err){
						console.log('轮询出现错误')
						this.loading = false
						this.close()
						reject(err); // 如果错误是无法处理的，可以在这里调用 reject 并传递错误信息
						await clearPromiseInterval(timer) // 使用 await 等待清除计时器
					}finally{
						
					}
				}, 1000)
			})
		},
		/* backtest opt*/

		showFLSMASK() {
			const myFLSbg = document.querySelector('#myFLSbg')
			myFLSbg.classList.add('activated')
		},

		/**
		 * 流程：
		 * 	edit editBacktest -> loopCalculateNewCond -> CalculateNewCond(load roc without loading marker*) -> setup.vue(update form state without calling local calculateNewCond)
		 *	view viewBacktest ->  loopCalculateNewCond -> CalculateNewCond(load roc without loading marker*) -> result.vue(load markers for all criteria)
		* @param {*} data 
		* @param {*} freq 
		* @param {*} row 
		* @param {*} resData 
		*/
		async restoreIndicatorLayoutView(data, freq, row, resData) {
			console.time('view time')
			// 跳转 result 去查看回测结果
			if (this.$store.getters.getIsBacktestRunningFlagState) {
				this.$store.dispatch('states/set_isBacktestRunning_flag', false)
				this.$store.commit('form/getRunBacktestData', row)
				this.$router.push({
					name: 'Results',
					params: { data: JSON.stringify(row), usedFor: 'showBTResults' }
				})
				this.loading = false
			} else {
				this.reloadData(data, freq, row)
				await CIQ.addIndicators({type:'loadFromBacktest'},() => {
					this.$store.commit('form/getRunBacktestData', row)
					this.$router.push({
						name: 'Results',
						params: { data: JSON.stringify(row), usedFor: 'showBTResults' }
					})
					this.loading = false

					CIQ.hideCover()
					CIQ.nprogress.done()
				})
				await this.loopCalculateNewConditions(row)
			}
		},
		async restoreIndicatorLayoutEdit(data, freq, row, resData) {
			console.time('edit time')
			const that = this
			that.reloadData(data, freq, row)
			await CIQ.addIndicators({type:'loadFromBacktest'},() => {
				that.$store.commit('form/getRunBacktestData', row)
				that.$router.push({
					name: 'SetUp',
					params: { data: JSON.stringify(row), usedFor: 'showBTForm' }
				},()=>{})
				that.loading = true

				CIQ.hideCover()
				CIQ.nprogress.done()
			})
			// long todo, 這一塊可以之後用loopCalculateNewConditions代替senti組件内部的CalculateNewConditions
			await that.loopCalculateNewConditions(row)	
		},
		reloadData(data, freq, row) {
			if (isJson(data)) data = JSON.parse(data)
			let {strategy, symbol2} = row
			let frequency = ''
			const commitIndicators = (criteria, list) => {
				this.$store.commit('chart/getCriteriaIndicatorsList', { criteria, list });
			};
			const commitSymbol2 = (symbol2) => {
				const {name,url,type} = getSymbolInfo(symbol2)
    			if(type == 'other'){
					this.$store.commit('form/setComparisonSymbol', {})
				}else{
					this.$store.commit('form/setComparisonSymbol', {
						name:name,
						url:url,
					})
				}
			}
			commitIndicators('entry', data.formIndicators.entry);
			commitIndicators('exit', data.formIndicators.exit);
			if(strategy === 'Dual') {
					commitIndicators('entry2', data.formIndicators.entry2);
					commitIndicators('exit2', data.formIndicators.exit2);
					commitSymbol2(symbol2)
			}else{
				commitIndicators('entry2', []);
				commitIndicators('exit2', []);
				commitSymbol2()
			}
			this.$store.commit('chart/getExtraIndicators', [])
			this.$store.commit('chart/getMA', data.activatedMA)
			// 暂定，读取回测携带的ma位置和信息
			/**
			 * todo: 兼容dual symbol, 
			 * 1. activatedMALayout加入cci等ma类的默认配置(遍历formIndicators，填入indicator对应criteri和index)
			 * 2. activatedTechLayout加入Tech(ma除外)的默认配置（symbol为symbol1）
			 */

			//兼容錯誤歷史版本上indicatorlayout沒有activatedTechLayout的情況
			if(!data.activatedTechLayout) data.activatedTechLayout = []; // 初始化新数组
			//兼容sample backtest普通Tech没有此属性的情况
			if (!data.activatedMALayout || (data.activatedMALayout.length>0 && !data.activatedMALayout[0].url)) {
				if(!data.activatedMALayout) data.activatedMALayout = []
				data.activatedTechLayout = []; // 初始化新数组
				const processIndicators = (indicators, criteria) => {
					for (var i in indicators) {
						const url = indicators[i];
						// ma已经有不用加了
						if (url != 'ma' && (CIQ.findBuiltinTechIndicator(null, url) || CIQ.findSymbolIndicator(url, null))) {
							if (CIQ.store.getters.getMaLikeTech.includes(url)) {
								data.activatedMALayout.push({
									url: url,
									criteria: criteria,
									index: i
								});
							} else {
								data.activatedTechLayout.push({
									url: url,
									//isComparison: false,
									criteria: criteria,
									index: i
								});
							}
						}
					}
				};
			
				processIndicators(data.formIndicators.entry, 'entry');
				processIndicators(data.formIndicators.exit, 'exit');
				
				// 此处需要把旧的ma也加上url属性
				data.activatedMALayout.forEach(item => {
					if(!item.url) item.url = 'ma'
				});
			}
			this.$store.commit('chart/getMALayout', data.activatedMALayout)
			this.$store.commit('chart/getTechLayout', data.activatedTechLayout)

			// 导入btv1时不调用这个
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
		handleRunAllCallback(backtestParams, backtestInfo) {
			const _this = this
			delete backtestParams.pk
			backtestParams = {
				uuid: backtestInfo.pk,
				...backtestParams
			}
			backtestParams = JSON.stringify(backtestParams)
			const uuid = backtestInfo.pk
			const backtestDataStr = _this.$qs.stringify(backtestInfo)
			return async function() {
				if (arguments[0] == 200) {
					const S3DataStr = _this.$qs.stringify({
						file_name: `${uuid}/${uuid}_backtest_params.json`,
						file_data: backtestParams
					})
					await uploadS3(S3DataStr)

					let res
					try {
						res = await runBacktest(backtestDataStr)
					} catch (error) {
						if (error.response?.status != 201) {
							return
						}
					}

					_this.$store.dispatch('states/set_isBacktestRunning_flag', true)
					//After saving successfully, clear the backtestinfo back to the original state
					_this.$store.commit('form/initialBacktestInfo')
					// _this.$refs.historyChild.refreshHistory(res.data.id)
					const pollingRes = await _this.pollingRunAllBTRunResults(res.data)
					console.log('pollingRes', pollingRes)
					_this.$store.dispatch('states/set_isMarkerShown_flag', false)
					//clear old_ uuid
					// if (_this.$store.state.form.backtestInfo.old_uuid) _this.$store.commit('form/clearBacktestUuid')
				}
			}
		},
		async pollingRunAllBTRunResults(data) {
			/*
				根据 id 轮询回测结果
				todo lishan
			*/
			const _this = this
			return new Promise(async (resolve, reject) => {
				const { id, name } = data
				console.log('进入轮询')
				_this.clearInterval = clearPromiseInterval
				let timer = await setPromiseInterval(async () => {
					try{
						const res = await getStatus(id)
						// CIQ.nprogress.inc()
						const status = res.data.status
						console.log('回测状态', status)
						const response = res.data
						if (status == 2 || status == 3) {
							console.log('结束轮询')
							_this.$store.dispatch(
								'states/set_isRunAllSignalProcessing_flag',
								false
							)
							_this.$store.state.form.run_all_backtest_array.map(item => {
								if (item.name == name) {
									item.state = 1
								}
							})
							// 把数据存起来，用于局部更新 rerun
							_this.$store.commit('states/CACHE_RERUN_DATA', response)
							resolve('fullfiled') // 解决 Promise 表示轮询完成
							await clearPromiseInterval(timer) // 使用 await 等待清除计时器
						}
					}catch(err){
						console.log('轮询出现错误')
						_this.$store.dispatch(
							'states/set_isRunAllSignalProcessing_flag',
							false
						)
						_this.$store.state.form.run_all_backtest_array.map(item => {
							if (item.name == name) {
								item.state = 2
							}
						})
						reject(err); // 如果错误是无法处理的，可以在这里调用 reject 并传递错误信息
						await clearPromiseInterval(timer) // 使用 await 等待清除计时器
					}finally{
						
					}
				}, 1000)
			})
		},
		handleCallback(backtestParams, backtestInfo) {
			const _this = this
			const start_date = backtestInfo.start_date
			const end_date = backtestInfo.end_date
			delete backtestParams.pk
			backtestParams = {
				uuid: backtestInfo.pk,
				...backtestParams
			}
			backtestParams = JSON.stringify(backtestParams)
			const uuid = backtestInfo.pk
			const backtestDataStr = _this.$qs.stringify(backtestInfo)
			return async function() {
				if (arguments[0] == 200) {
					const S3DataStr = _this.$qs.stringify({
						file_name: `${uuid}/${uuid}_backtest_params.json`,
						file_data: backtestParams
					})
					await uploadS3(S3DataStr)
					let res 
					try {
						res = await runBacktest(backtestDataStr)
						// should update old_uuid
						if(res.data.id && typeof res.data.id === 'string') _this.$store.form.backtestInfo.old_uuid = res.data.id
					} catch (error) {
						if (error.response?.status == 403) {
							_this.popUpMsgBox('The backtest name already exists')
							_this.setSetUpLoadingSetting(false, false, 0, '')
							CIQ.hideCover()
							CIQ.nprogress.done()
							return
						}
					}
					if (res.status != 201) return
					_this.$store.dispatch('states/set_isBacktestRunning_flag', true)
					//After saving successfully, clear the backtestinfo back to the original state
					// _this.$store.commit('form/initialBacktestInfo')

					let coverText =
						'Backtest data upload successful, backtest is in progress, please wait patiently for the results...'
					if (start_date && end_date) {
						const year = end_date.split('-')[0] - start_date.split('-')[0]
						if (year > 10)
							coverText =
								'In the case of backtesting exceeding 10 years, anticipate longer processing time. We appreciate your patience...'
					}
					_this.setSetUpLoadingSetting(true, true, 50, coverText)

					_this.pollingBTRunResults(res.data.id, coverText)
					_this.$store.dispatch('states/set_isMarkerShown_flag', false)
					//clear old_ uuid
					if (_this.$store.state.form.backtestInfo.old_uuid)
						_this.$store.commit('form/clearBacktestUuid')
				}
			}
		},
		pollingBTRunResults(id, coverText) {
			/*
			根据 id 轮询回测结果
			todo lishan
			*/
			console.log('进入轮询')
			const _this = this
			_this.clearInterval = clearPromiseInterval
			let percentage = 60
			let timer = setPromiseInterval(async () => {
				const res = await getStatus(id)
				// CIQ.nprogress.inc()
				const pullingAddVal = 1
				if (percentage + pullingAddVal != 100) percentage += pullingAddVal // 在每次轮询中递增
				_this.setSetUpLoadingSetting(true, true, percentage, coverText)
				const status = res.data.status
				const data = res.data
				console.log('回测运行状态', status)
				if (status == 2 || status == 3) {
					clearPromiseInterval(timer).then(() => {
						console.log('回测跑完了 状态码是', status)
						_this.setSetUpLoadingSetting(
							false,
							false,
							100,
							'Backtest completed successfully, navigate to the Results page to view the backtest results....'
						)
					})
					data.result = isJson(data.result)
						? JSON.parse(data.result)
						: data.result
					// 存入缓存数据，因为路由跳转时表单数据会丢失
					console.log('轮询后保存编辑数据', data)
					// 回测运行结束之后存缓存不可变缓存
					_this.$store.dispatch('form/cached_BT_basic_info_data', data)
					_this.viewBacktestResults(data)
					// 回测跑完不一定要调用这个去展示 set up form， 因为刚跑完这个 set up form 肯定是有数据的
					// await _this.displaySetUpForm(data)
				}
			}, 1000)
		},


		async transformOldName(data,criteria){
			const indicatorList = this.$store.getters.getIndicatorsList
			const stockList = this.$store.getters.getStockList
			data[criteria].signals.forEach(signal => {
				if(!signal) {console.log('No Signal')}
				else {
					const matchIndicatorsList = indicatorList.find(item=>item.chart_name == signal.indicator)
					const matchStockList = stockList.find(item=>item.name == signal.indicator)
					if(matchIndicatorsList && matchStockList){
						signal.indicator = matchIndicatorsList.url + ' Optix'
					}
				}
			  })
		}
	},
}
