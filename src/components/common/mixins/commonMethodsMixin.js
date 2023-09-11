import { isJson } from '@/tools/isJson'
import { CIQ } from '@/components/common/chart/st-development/js'
import {
	getBacktestName,
	seeParams,
	copyBacktest,
	deleteBacktest,
	favoriteBacktest
} from '@/service/service.js'

export const CommonMethodsMixin = {
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
		}
	}
}
