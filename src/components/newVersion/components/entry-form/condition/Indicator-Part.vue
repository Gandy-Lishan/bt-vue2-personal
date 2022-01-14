<template>
	<div>
		<el-form-item>
			<div class="radioBox">
				<el-radio
					v-model="indicatorRadio"
					label="Sentiment Indicators"
					@change="changeIndicatorChecked"
				>
				</el-radio>
				<div class="indicatorSearchBox">
					<el-autocomplete
						prefix-icon="el-icon-search"
						class="inline-input"
						v-model="si.sentimentIndicator"
						:disabled="isCheckedIndicators"
						:fetch-suggestions="indicatorSentimentSearch"
						placeholder="Input the sentiment indicator"
						@select="handleSentimentSelect"
						highlight-first-item
					></el-autocomplete>
				</div>
			</div>
		</el-form-item>
		<el-form-item>
			<div class="radioBox">
				<el-radio
					v-model="indicatorRadio"
					label="Technical Indicators"
					@change="changeIndicatorChecked"
				>
				</el-radio>
				<!-- <el-input v-model="technicalIndicator"></el-input> -->
				<div class="indicatorSearchBox">
					<el-autocomplete
						:disabled="!isCheckedIndicators"
						class="inline-input"
						prefix-icon="el-icon-search"
						v-model="si.technicalIndicator"
						:fetch-suggestions="indicatorTechnicalSearch"
						placeholder="Input the technical indicator"
						@select="handleTechnicalSelect"
					></el-autocomplete>
				</div>
			</div>
		</el-form-item>
	</div>
</template>
<script>
import { Store, mapGetters } from 'vuex'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import deepClone1 from '@/tools/deepClone.js'
export default {
	extends: base,
	props: {
		indicatorEditData: Object
	},
	data() {
		return {
			indicatorRadio: 'Sentiment Indicators',
			si: {
				sentimentIndicator: '',
				technicalIndicator: ''
			},
			isCheckedIndicators: false,
			sentimentIndicatorList: []
		}
	},
	computed: {
		...mapGetters(['getIsClearForm']),
		isClearForm() {
			return this.getIsClearForm
		},
	},
	watch: {
		isClearForm: {
			handler(newVal) {
				let init = deepClone1(this.$options.data())
				Object.assign(this.$data, init)
			}
		},
		indicatorEditData: {
			handler(newVal) {
				if (newVal.sentimentIndicator) {
					this.indicatorRadio = 'Sentiment Indicators'
					this.isCheckedIndicators = false
					this.si.sentimentIndicator = newVal.sentimentIndicator
					const obj = {}
					obj.criteria = this.criteria
					obj.index = this.tabIndex
					obj.value = newVal.sentimentIndicator
					this.$store.commit('getSentiValue', obj)
				} else if (newVal.technicalIndicator) {
					this.indicatorRadio = 'Technical Indicators'
					this.isCheckedIndicators = true
					this.si.technicalIndicator = newVal.technicalIndicator
					const obj = {}
					obj.criteria = this.criteria
					obj.index = this.tabIndex
					obj.value = newVal.technicalIndicator
					this.$store.commit('getTechValue', obj)
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		//  load sentiment list
		async loadSentimentList() {
			const vm = this
			var frequency = vm.$store.state.backtestInfo["entry"]["frequency"]
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
				console.log(frequency.toUpperCase().indexOf(obj.updated.toUpperCase()));
				if (frequency.toUpperCase().indexOf(obj.updated.toUpperCase()) !== -1){
				return { value: obj.chart_name, url: obj.url, updated: obj.updated }
				}
			})
			this.$store.commit('getIndicatorsList', res.data)
			this.$store.commit('getSentimentList', vm.sentimentIndicatorList)
		},
		// sentiment search
		indicatorSentimentSearch(queryString, cb) {
			var sentimentIndicatorList = this.$store.state.sentimentIndicatorList
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
				return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
			}
		},
		// technical search
		indicatorTechnicalSearch(queryString, cb) {
			var technicaltIndicatorList = this.loadShortLong()
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
		handleSentimentSelect(item) {
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			obj.value = item.value
			this.$store.commit('clearSignal', obj)
			this.si.sentimentIndicator = item.value
			this.$emit('getSentiVal', item.value)
			// remove a MA tat already exists in current criteria before loadin
			var activatedMAList = this.$store.state.activatedMA

			if (obj.criteria == 'entry') {
				var MAListIndex = activatedMAList.findIndex(
					(item) =>
						item.url == this.$store.state.indicators.formIndicators.entry
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getEntryIndicators', item.url)
				this.$emit('getSentiUrl', item.url)
			} else {
				var MAListIndex = activatedMAList.findIndex(
					(item) => item.url == this.$store.state.indicators.formIndicators.exit
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getExitIndicators', item.url)
				this.$emit('getSentiUrl', item.url)
			}
			console.log('SentimentSelect MA LIST: ', CIQ.store.state.activatedMA)
			CIQ.addIndicators()
		},
		handleTechnicalSelect(item) {
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			obj.value = item.value
			this.$store.commit('clearSignal', obj)
			this.si.technicalIndicator = item.value
			this.$emit('getTechVal', item.value)
			const vm = this
			let val = item.value
			const set = new Set([
				['Commodity Channel Index', 'ST CCI'],
				['Relative Strength Index', 'ST RSI'],
				['Moving Average', 'ma'],
				['MACD', 'ST MACD']
			])

			const newMap = new Map(set)
			for (let i of newMap.entries()) {
				if (val === i[0]) {
					this.$emit('getTechIndiValue', i[1])
					// remove a MA tat already exists in current criteria before loadin
					if (obj.criteria == 'entry') {
						// remove MA from Vuex after loading Tech
						var activatedMAList = CIQ.store.state.activatedMA

						var MAListIndex = activatedMAList.findIndex(
							(ma) =>
								ma.url == this.$store.state.indicators.formIndicators.entry
						)
						if (MAListIndex != -1) {
							activatedMAList.splice(MAListIndex, 1)
						}
						CIQ.store.commit('getMA', activatedMAList)
						this.$store.commit('getEntryIndicators', i[1])
					} else {
						// remove MA from Vuex after loading Tech
						var activatedMAList = CIQ.store.state.activatedMA

						var MAListIndex = activatedMAList.findIndex(
							(ma) => ma.url == this.$store.state.indicators.formIndicators.exit
						)
						if (MAListIndex != -1) {
							activatedMAList.splice(MAListIndex, 1)
						}

						CIQ.store.commit('getMA', activatedMAList)
						this.$store.commit('getExitIndicators', i[1])
					}
					// store tech indicators in Vuex and use it in addIndicator to test if a member in list is belong to tech
					let techIndicators = []
					techIndicators.push(...CIQ.store.state.indicators.technicalIndicators)
					techIndicators.push(i[1])
					this.$store.commit('getTechnicalIndicators', techIndicators)

					console.log('TechnicalSelect MA LIST', CIQ.store.state.activatedMA)
					CIQ.addIndicators()
				}
			}
			vm.si.technicalIndicator = item.value
		},
		changeIndicatorChecked() {
			this.isCheckedIndicators = !this.isCheckedIndicators
			const arr = ['Sentiment Indicators', 'Technical Indicators']
			// 清空 technical 当前选中的 indicator 值
			this.si.sentimentIndicator = ''
			this.si.technicalIndicator = ''
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			this.$store.commit('deleteIndicator', obj)
			this.$emit('clearTechIndiValue')
			if (this.indicatorRadio === arr[0]) {
				this.$emit('getIndicatorRadio', 'sentiment')
				this.$store.commit('getEntryIndicatorRadio', 'sentiment')
			} else {
				this.$emit('getIndicatorRadio', 'technical')
				this.$store.commit('getEntryIndicatorRadio', 'technical')
			}
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
		setIndicatorRadio(obj) {
			let vm = this
			console.log('load')
			this.indicatorRadio = obj.radio
			var data = Object.assign(obj)
			if (data.sentimentIndicator) {
				vm.si['sentimentIndicator'] = data['sentimentIndicator']
				vm.$set(vm.si, 'sentimentIndicator', data.sentimentIndicator)
				this.$emit('getSentiVal', data.sentimentIndicator)
				const sentiObj = data
				sentiObj.value = sentiObj.sentimentIndicator
				this.$store.commit('getSentiValue', sentiObj)
				this.isCheckedIndicators = false
			} else if (data.technicalIndicator) {
				vm.$set(this.si, 'technicalIndicator', obj.technicalIndicator)
				this.$emit('getTechVal', obj.technicalIndicator)
				const sentiObj = data
				sentiObj.value = sentiObj.technicalIndicator
				this.$store.commit('getTechValue', sentiObj)
				this.isCheckedIndicators = true
			}
		}
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.radioBox {
		display: flex;
	}
	.radioBox .indicatorSearchBox {
		flex: 1;
	}
	.radioBox .el-radio {
		line-height: 35px;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.radioBox {
		display: flex;
	}
	.radioBox .indicatorSearchBox {
		flex: 1;
	}
	.radioBox .el-radio {
		line-height: 35px;
	}
}
</style>
