import { isJson } from '@/tools/isJson'
import { CIQ } from '@/components/common/chart/st-development/js'
import { timestampToTime } from '@/tools/formatDate'
import {
	getBacktestName,
	seeParams,
	copyBacktest,
	deleteBacktest,
	favoriteBacktest,
	getAllHistoryList,
	uploadS3,
	runBacktest,
	getStatus,
	findLastSignalApi
} from '@/service/service.js'
import UUID from '@/tools/uuid.js'
import cloneDeep from 'lodash/cloneDeep'
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'


export const CommonMethodsMixin = {
	data() {
		return {
			favorite_array: []
		}
	},
	methods: {
		async viewBacktestResults(data) {
			console.log('公共方法 viewBacktestResults', data)
			this.$store.commit('form/RESULT_DATA_FOR_SETUP_DISPLAY', data)
			// 在发送组件中进行路由跳转并传递参数
			// this.$router.push({
			//   name: 'SetUpResults',
			//   params: { data: JSON.stringify(data), usedFor: 'viewResults' },
			// });
			this.$store.commit('form/getBacktestSymbol', data.symbol)
			this.$store.dispatch('states/set_isMarkerShown_flag', false)
			// indicator_layout肯定有，所以这里不用判断res.data.indicator_layout没有的情况
			let parsedData =
				typeof data.indicator_layout === 'string'
					? JSON.parse(data.indicator_layout.replaceAll('$r001$', '\u200c'))
					: data.indicator_layout
			this.restoreIndicatorLayoutView(parsedData, data.frequency, data, data)
		},
		editBacktest(data) {
			const currentPage = this.currentPage
			/* 如果 currentPage 是 History 或者 Favorites,则传入 old_uuid，否则不传*/
			if (['History', 'Favorites'].includes(currentPage)) {
				data.old_uuid = data.id
			} else{
				if (data.hasOwnProperty('old_uuid')) delete data.old_uuid
			}
			this.$store.commit('form/RESULT_DATA_FOR_SETUP_DISPLAY', data)
			//  Restore indicator layout
			this.$store.commit('form/getBacktestSymbol', data.symbol)
			this.$store.dispatch('states/set_isMarkerShown_flag', false)

			// indicator_layout肯定有，所以这里不用判断res.data.indicator_layout没有的情况
			let parsedData =
				typeof data.indicator_layout === 'string'
					? JSON.parse(data.indicator_layout.replaceAll('$r001$', '\u200c'))
					: data.indicator_layout
			this.restoreIndicatorLayoutEdit(parsedData, data.frequency, data, data)
		},
		async copyBacktest(data) {
			try {
				const copyName = `${data.name}(copy)`

				// 检查是否已经存在同名的 backtest
				const nameLookUp = await getBacktestName(copyName)
				const isDuplicate = nameLookUp.data.results.some(
					item => item.name === copyName
				)

				if (isDuplicate) {
					this.$notify.error({
						title: 'Has been Copied',
						message: 'The backtest has been copied'
					})
				} else {
					// 获取参数并准备复制
					const paramsRes = await seeParams(data.id)
					const params = {
						...paramsRes.data,
						name: copyName,
						favorites: false,
						user_tag: 'client',
						report_url: '',
						uuid: undefined,
						results: undefined,
						user_id: undefined,
						status: undefined,
						backtest_id: undefined
					}

					// 发起复制请求
					await copyBacktest(this.$qs.stringify(params))

					// 重置查询页码并获取数据
					this.queryInfo.page = 1
					await this.getDataList(null)
				}
			} catch (error) {
				console.error('An error occurred:', error)
			}
		},
		async deleteBacktest(id) {
			const res = await deleteBacktest(id)
			this.getDataList(null)
		},
		async addToFavorites(data) {
			data.favorites = true
			const params = {
				favorites: true
			}
			const res = await favoriteBacktest(data.id, this.$qs.stringify(params))
			this.getDataList(null)
		},
		async moveToFavorites(data) {
			data.favorites = false
			const params = {
				favorites: false
			}
			const res = await favoriteBacktest(data.id, this.$qs.stringify(params))
			this.getDataList(null)
		},
		async rerunBacktest(data) {
			console.log(data)
			await this.rerunThisBacktest(data)
			// rerun 后重新请求列表
			await this.getDataList(null)
		},
		async runAllBacktest() {
      this.showFLSMASK()
      this.favorite_array = await this.getAllHistoryListData(1)
      this.$store.commit('form/SET_RUNALL_BACKTEST_ARRAY', this.favorite_array.map(item => { return { name: item.name, content: item, state: 0, id: item.id } }))
			// 对数组做批量的上传 S3 和运行回测就行了
			await this.loopAllHistories()
		},
		async loopAllHistories() {
			for (let i = 0; i < this.favorite_array.length; i++) {
				await this.rerunThisBacktest(this.favorite_array[i])
			}
			// 循环结束之后请求一次列表
			await this.getDataList(null)
		},
		async getAllHistoryListData(reqAfterPage) {
      // lishan 用于获取所有的 favorite 列表 Request the specified data on the following page
      const res = await getAllHistoryList(reqAfterPage)
      return res
    },
		processingBacktest(backtest_arr) {
      if (backtest_arr.length <= 0) return false;

      let backtest_info = backtest_arr.shift()
      // // 跳过用户自定义时间的情况
      // let backtest_info
      // while (1) {
      //   backtest_info = backtest_arr.pop()
      //   if (backtest_info.backtest_period != 22) break
      // }

      return backtest_info

    },
		postRunbacktest(favorite) {
			// 继续上传数据并且运行回测
      // lishan 做迭代 
      this.findThisBTSignal(favorite)
      // 轮询可用于等待上一个回测结束，也可定时刷新进度条进度
      let interval = setInterval(async () => {
        if (this.$store.getters.getIsEditFinishFlagState == false) {
          clearInterval(interval)
          // this.$store.dispatch('states/set_isEditFinish_flag',true)

          var favorite_info = this.processingBacktest(this.favorite_array)
          if (favorite_info == false) {
            // this.$store.dispatch('states/set_isEditFinish_flag',false)
            const array = this.$store.state.form._last_signal_array
            let removedItems = [];
            for (let i = array.length - 1; i >= 0; i--) {
              if (array[i].state == 2 || array[i].state == 0) {
                removedItems.push(array.splice(i, 1)[0]);
              }
            }
            if (removedItems.length != 0) {
              // 把所有 state 为 0 的设置成 2
              removedItems = removedItems.map(item => {
                return {
                  ...item,
                  state: 2
                }
              })
              const new_last_signal_array = [...array, ...removedItems]
              this.$store.commit('form/SET_RUNALL_BACKTEST_ARRAY', new_last_signal_array)
            }
            // 找出状态不为 2 的 并删除掉 list 中状态不为 2 的
            const list = this.$store.state.form.hashTable
            const filteredArray = list.filter(item => !removedItems.includes(item.id))
            const requestList = []
            for (let i = 0; i < filteredArray.length; i++) {
              requestList.push(findLastSignalApi(filteredArray[i]))
            }
            // const res = await Promise.all(requestList)
            let res = await Promise.allSettled(requestList)
            // lishan 这个时候已经处理完，批量发请求给后台， 拿到 lastSignal
            res = res.filter(item => item.status === 'fulfilled')
            let lastSignalList = res.map((item) => {
              return {
                lastEntrySignalDate: item.value.data.lastEntrySignalDate,
                lastExitSignalDate: item.value.data.lastExitSignalDate
              }
            })
						console.log('lastSignalList', lastSignalList)
            //this.removeFLSMASK()

          this.getDataList(null)
            return // 处理任务结束
          }
          this.postRunbacktest(favorite_info)

          // 是否添加一个成功列表
        }
      }, 1000) // 2秒查询一次
    },
		async rerunThisBacktest(backtestInfo) {
			// 这里只需要执行两个请求，上传 S3 和直接运行当前的 backtest
			const copyBacktestData = cloneDeep(backtestInfo)
			copyBacktestData.currentdate = new Date().getTime()
			backtestInfo.pk = UUID(JSON.stringify(copyBacktestData))
			backtestInfo.capital_alloc = parseFloat(backtestInfo.capital_alloc)
			backtestInfo.slippage = parseFloat(backtestInfo.slippage)
			backtestInfo.win_rate = parseFloat(backtestInfo.win_rate)
			backtestInfo.commission = parseFloat(backtestInfo.commission)
			backtestInfo.old_uuid = backtestInfo.id
			backtestInfo.favorites = backtestInfo.hasOwnProperty('favorites') ? backtestInfo.favorites : false
			const entry_description = backtestInfo.entry_description
			const exit_description = backtestInfo.exit_description
			backtestInfo.entry_description = Array.isArray(entry_description) ? JSON.stringify(entry_description) : entry_description
			backtestInfo.exit_description = Array.isArray(exit_description) ? JSON.stringify(exit_description) : exit_description
			// end_date 改成最新的，于此同时改变 start_date
			const end_date = timestampToTime(new Date())
			const backtest_period = backtestInfo.backtest_period
			if(backtest_period <= 20) {
				const str = end_date.split('-')
				str[0] = Number(str[0]) - Number(backtest_period) + ''
				const start_date = str.join('-')
				backtestInfo.start_date = start_date
			}else if(backtest_period == 21) {
				backtestInfo.start_date = '1800-10-01'
			}
			backtestInfo.end_date = end_date
			// 运行回测之前需要把 status 变成 0
			backtestInfo.status = 0
			if(backtestInfo.hasOwnProperty('total_trader')) delete backtestInfo.total_trader
			if(backtestInfo.hasOwnProperty('total_return')) delete backtestInfo.total_return
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
			const backtestInfoSelectedProps = [
				'entry_description', 
				'exit_description', 
				'description', 
				'direction',
				'frequency', 
				'backtest_period', 
				'entry', 'exit', 
				'name', 'symbol', 
				'benchmark', 'strategy', 
				'capital', 'capital_alloc', 
				'commission', 'win_rate', 
				'slippage', 'start_date', 
				'end_date', 'risk_control', 
				'report_url', 'user_tag', 
				'trade_price', 'exclude_oo', 
				'indicator_layout',
				'favorites',
				'pk', 'old_uuid']
			let backtestParams = Object.assign(
				{},
				...selectedProps.map((prop) => ({ [prop]: backtestInfo[prop] }))
			)
			let selectedBacktestInfo = Object.assign(
				{},
				...backtestInfoSelectedProps.map((prop) => ({ [prop]: backtestInfo[prop] }))
			)
			this.reloadData(backtestInfo.indicator_layout, backtestInfo.frequency)
			const callback = this.handleRunAllCallback(backtestParams, selectedBacktestInfo)
			await CIQ.outputSignalsResult(backtestInfo.pk, callback)
			// await this.executeOutputSignalsResult(backtestInfo.pk, callback);
		},
		showFLSMASK() {
      const myFLSbg = document.querySelector('#myFLSbg')
      myFLSbg.classList.add('activated')
    },
		restoreIndicatorLayoutView(data, freq, row, resData) {
			// 跳转 result 去查看回测结果
			if (this.$store.getters.getIsBacktestRunningFlagState) {
				this.$store.dispatch('states/set_isBacktestRunning_flag', false)
				this.$store.commit('form/getRunBacktestData', row)
				this.$router.push({
					name: 'Results',
					params: { data: JSON.stringify(row), usedFor: 'showBTResults' }
				})
			} else {
				this.reloadData(data, freq)
				CIQ.addIndicatorsFromBacktest(() => {
					this.$store.commit('form/getRunBacktestData', row)
					this.$router.push({
						name: 'Results',
						params: { data: JSON.stringify(row), usedFor: 'showBTResults' }
					})
				})
			}
		},
		restoreIndicatorLayoutEdit(data, freq, row, resData) {
			const that = this
			that.reloadData(data, freq)
			CIQ.addIndicatorsFromBacktest(function() {
				that.$store.commit('form/getRunBacktestData', row)
				that.$router.push({
					name: 'SetUp',
					params: { data: JSON.stringify(row), usedFor: 'showBTForm' }
				})
			})
		},
		reloadData(data, freq) {
			if (isJson(data)) data = JSON.parse(data)
			let frequency = ''
			this.$store.commit(
				'chart/getEntryIndicatorsList',
				data.formIndicators.entry
			)
			this.$store.commit(
				'chart/getExitIndicatorsList',
				data.formIndicators.exit
			)
			this.$store.commit('chart/getExtraIndicators', [])
			this.$store.commit(
				'chart/getTechnicalIndicators',
				data.technicalIndicators
			)
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
					const pollingRes = await _this.pollingRunAllBTRunResults(res.data)
					console.log('pollingRes', pollingRes)
					_this.$store.dispatch('states/set_isMarkerShown_flag',false)
					//clear old_ uuid
					if (_this.$store.state.form.backtestInfo.old_uuid) _this.$store.commit('form/clearBacktestUuid')
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
				const { id, name } = data;
					console.log('进入轮询');
					this.clearInterval = clearPromiseInterval;
					let timer = await setPromiseInterval(async () => {
						const res = await getStatus(id);
						// CIQ.nprogress.inc()
						const status = res.data.status;
						console.log('回测状态', status)
						const response = res.data;
						if (status == 2 || status == 3) {
							console.log('结束轮询');
							_this.$store.dispatch('states/set_isRunAllSignalProcessing_flag',false)
							_this.$store.state.form.run_all_backtest_array.map(item=>{
								if(item.name == name){
									item.state = 1
								}
							});
							resolve('fullfiled'); // 解决 Promise 表示轮询完成
							await clearPromiseInterval(timer); // 使用 await 等待清除计时器
						}
					}, 1000);
			})
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
					_this.setSetUpLoadingSetting(true, 40, 'Uploading backtest data...')
					await uploadS3(S3DataStr)
					_this.setSetUpLoadingSetting(true, 45, 'Uploading backtest data...')
					const res = await runBacktest(backtestDataStr)
					if(res.status != 201) return
					_this.$store.dispatch('states/set_isBacktestRunning_flag',true)
					//After saving successfully, clear the backtestinfo back to the original state
					_this.$store.commit('form/initialBacktestInfo')
					// _this.$refs.historyChild.refreshHistory(res.data.id)
					_this.setSetUpLoadingSetting(true, 50, 'Backtest data upload successful, backtest is in progress, please wait patiently for the results...')
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
			let percentage = 60
			let timer = setPromiseInterval(async () => {
				const res = await getStatus(id)
				// CIQ.nprogress.inc()
				if(percentage + 2 != 100) percentage += 2; // 在每次轮询中递增 2
				_this.setSetUpLoadingSetting(true, percentage, 'Backtest data upload successful, backtest is in progress, please wait patiently for the results...')
				const status = res.data.status
				const data = res.data
				console.log('回测运行状态', status)
				if(status == 2 || status == 3) {
					clearPromiseInterval(timer).then(() => {console.log('回测跑完了 状态码是', status); _this.setSetUpLoadingSetting(false, 100, 'Backtest completed successfully, navigate to the Results page to view the backtest results....')})
					data.result = isJson(data.result) ? JSON.parse(data.result) : data.result
					// 存入缓存数据，因为路由跳转时表单数据会丢失
					_this.$store.dispatch('form/cached_BT_basic_info_data', data)
					_this.viewBacktestResults(data)
					// 回测跑完不一定要调用这个去展示 set up form， 因为刚跑完这个 set up form 肯定是有数据的
					// await _this.displaySetUpForm(data)
				}
			}, 1000)
		},
	}
}
