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
import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
export default {
	extends: base,
	data() {
		return {
			indicatorRadio: 'Sentiment Indicators',
			si: {
			sentimentIndicator: '',
			technicalIndicator: ''},
			isCheckedIndicators: false,
			sentimentIndicatorList: [],
			technicaltIndicatorList: []
		}
	},
	mounted() {
		this.loadSentimentList()
		this.technicaltIndicatorList = this.loadShortLong()
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
		handleSentimentSelect(item) {
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			obj.value = item.value
			this.$store.commit("clearSignal", obj)
			this.$store.commit("getSentiValue", obj)
			this.si.sentimentIndicator = item.value
			this.$emit("getSentiVal",item.value)
			console.log(obj.criteria)
			// remove MA
			var activatedMAList = this.$store.state.activatedMA
			if(obj.criteria == "entry"){
				var MAListIndex = activatedMAList.findIndex(
					(item) => item.url == this.$store.state.indicators.formIndicators.entry
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getEntryIndicators', item.url)
			}else{
				var MAListIndex = activatedMAList.findIndex(
					(item) => item.url == this.$store.state.indicators.formIndicators.exit
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getExitIndicators', item.url)
			}
			
			CIQ.addIndicators()
		},
		handleTechnicalSelect(item) {
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			obj.value = item.value
			this.$store.commit("clearSignal", obj)
			this.$store.commit("getTechValue", obj)
			this.si.technicalIndicator = item.value
			const vm = this
			let val = item.value
			const set = new Set([
				['Commodity Channel Index', 'ST CCI'],
				['Relative Strength Index', 'RSI'],
				['Moving Average', 'MA'],
				['MACD', 'MACD'],
			])
			const newMap = new Map(set)
			for(let item of newMap.entries()){
			  if(val === item[0]){
				  console.log(item)
				  this.$emit("getTechIndiValue", item[1])
					//这里还没加MA所以先不清除已有的MA
					if(obj.criteria == "entry"){
						this.$store.commit('getEntryIndicators', item[1])
					}else{
						this.$store.commit('getExitIndicators', item[1])
					}
					// store tech indicators in Vuex and use it in addIndicator to test if a member in list is belong to tech
					let techIndicators = []
					techIndicators.push(...CIQ.store.state.indicators.technicalIndicators)
					techIndicators.push(item[1])
					this.$store.commit('getTechnicalIndicators',techIndicators)
					CIQ.addIndicators()
					// remove MA from Vuex after loading Tech
					var activatedMAList = CIQ.store.state.activatedMA
					activatedMAList.splice(activatedMAList.findIndex(item=>item.url==item[1]),1)
					CIQ.store.commit("getMA",activatedMAList)
            }}
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
				this.$store.commit('deleteIndicator',obj)
			this.$emit("clearTechIndiValue")
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
			this.indicatorRadio = obj.radio
			if(obj.sentimentIndicator){
				this.si.sentimentIndicator = obj.sentimentIndicator
			}else if(obj.technicalIndicator) {
				this.si.technicalIndicator = obj.technicalIndicator
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
