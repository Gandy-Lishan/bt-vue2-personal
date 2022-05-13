<template>
	<div class="entry-container">
		<div class="signal-option-box">
			<el-tooltip style="diaplay:inline" effect="light" content="All params of entry criteria" placement="bottom">
			<p class="criteria-title">Entry Criteria</p></el-tooltip>
			<div class="signal-container">
				<span class="scoreNote" v-if="relation === 2">
					<el-tooltip style="diaplay:inline" effect="light" content="Only use in multi signals and the value <= the len of signals" placement="bottom">
                       <span>Score:</span>
                        </el-tooltip>
				</span>
				<el-input
					size="mini"
					v-if="relation === 2"
					v-model="score"
					type="number"
					step="1"
					min="1"
					:max="editableTabsValue"
				></el-input>
			<span class="scoreNote" v-if="relation === 3"><el-tooltip style="diaplay:inline" effect="light" content="Using in indicator formula" placement="bottom">
                       <span>Period:</span>
                        </el-tooltip></span>
				<el-input
					size="mini"
					v-if="relation === 3"
					v-model="signals_in_market"
					type="number"
					step="1"
					min="1"
				></el-input>
				<el-select v-model="relation" placeholder="Please select signal">
					<el-option
						v-for="item in signalOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</div>
		</div>
		<div :class="relation === 1 ? 'multi' : ''" v-if="exitItemCheck === false">
			<div class="multi-box">
				<el-tabs
					v-model="editableTabsValue"
					type="card"
					editable
					@edit="handleTabsEdit"
				>
					<el-tab-pane
						:key="item.name"
						v-for="(item, index) in editableTabs"
						:label="item.title"
						:name="item.name"
					>
						<indicator
							:criteria="'entry'"
							:panelIndex="index"
							:editableTabs = "editableTabs"
							:editableTabsValue = "editableTabsValue"
							ref="indiChild"
							:exitItemCheck="exitItemCheck"
							@getIndicatorUrl="getIndicatorUrl"
							@getIndicatorVal="getIndicatorVal"
							@getTechIndiValue="getTechIndiValue"
							@getIndicatorRadio="getIndicatorRadio"
							@getTechIndiObj="getTechIndiObj"
						></indicator>
						<senti
							v-bind="$attrs"
							:criteria="'entry'"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							ref="sentiChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:sentiUrl="indicatorUrlArr[index]"
							:sentiVal="indicatorValArr[index]"
							v-show="indicatorRadioArr[index] === 'sentiment'"
						></senti>
						<cci
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'CCI_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="cciChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'CCI_like'
							"
						></cci>
						<rsi
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'rsi'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="rsiChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'rsi'
							"
						></rsi>
						<macd
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'MACD_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="macdChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'MACD_like'
							"
						></macd>
						<ma
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'MovingAverage_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="maChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'MovingAverage_like'
							"
						></ma>
						<bollinger-bands-like
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'BollingerBands_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="bollBandsLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'BollingerBands_like'
							"
						></bollinger-bands-like>
						<ehler-fisher-transform-like
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'EFT_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="EFTLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'EFT_like'
							"
						></ehler-fisher-transform-like>
						<stochastic-momentum-index-like
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Stochastics_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="stochasticsLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Stochastics_like'
							"
						></stochastic-momentum-index-like>
						<ADX-or-DMS-Like
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'ADX_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="ADXLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'ADX_like'
							"
						></ADX-or-DMS-Like>
						<elder-ray-index-like
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'ERI_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="ERILikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'ERI_like'
							"
						></elder-ray-index-like>
						<alligator-like
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Aligator_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="aligatorLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Aligator_like'
							"
						></alligator-like>
						<linear-regForecast-like
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'LRF_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="LRFLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'LRF_like'
							"
						></linear-regForecast-like>
						<trailing-stop-like
							v-bind="$attrs"
							:isActived ="
								indicatorRadioArr[index] === 'technical' &&
								techIndiValue[index] === 'Trailingstop_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'entry'"
							ref="trailingStopLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiValue[index] === 'Trailingstop_like'
							"
						></trailing-stop-like>
						<div class="delay-bar-box">
							 <el-checkbox v-model="isDelayBar"><el-tooltip style="diaplay:inline" effect="light" content="The number of bars delayed" placement="bottom">
                       <span>Delay of Bars</span>
                        </el-tooltip></el-checkbox>
							<el-input
								size="mini"
								v-model="delay_bars"
								type="number"
								step="1"
								min="0"
							></el-input>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>
<script>
import senti from '@/components/BacktestEdge/signal/sentiment/Senti'
import cci from '@/components/BacktestEdge/signal/technical/Cci-like'
import rsi from '@/components/BacktestEdge/signal/technical/Rsi.vue'
import macd from '@/components/BacktestEdge/signal/technical/Macd-like.vue'
import ma from '@/components/BacktestEdge/signal/technical/Ma.vue'
import indicator from '@/components/BacktestEdge/signal/indicator/indicator'
import SignalCode from '@/tools/codeTool.js'
import bollingerBandsLike from '@/components/BacktestEdge/signal/technical/Bollinger-Bands-like.vue'
import ehlerFisherTransformLike from '@/components/BacktestEdge/signal/technical/Ehler-Fisher-Transform-like.vue'
import stochasticMomentumIndexLike from '@/components/BacktestEdge/signal/technical/Stochastic-Momentum-Index-like.vue'
import ADXorDMSLike from '@/components/BacktestEdge/signal/technical/ADXorDMS-like.vue'
import elderRayIndexLike from '@/components/BacktestEdge/signal/technical/Elder-Ray-Index-like.vue'
import alligatorLike from '@/components/BacktestEdge/signal/technical/Alligator-like.vue'
import linearRegForecastLike from '@/components/BacktestEdge/signal/technical/Linear-RegForecast-like.vue'
import trailingStopLike from '@/components/BacktestEdge/signal/technical/Trailing-Stops-like.vue'
export default {
	name: 'entry',
	inheritAttrs: false,
	data() {
		return {
			techIndiValue: '',
			indicatorRadio: 'sentiment',
			signalOptions: [
				{
					value: 1,
					label: 'Single-Signal'
				},
				{
					value: 2,
					label: 'SameBar Multi-Signal'
				},
				{
					value: 3,
					label: 'TimeOrder Multi-Signal'
				},
			],
			relation: 1,
			periodValue: 1,
			editableTabsValue: '1',
			editableTabs: [
				{
					title: 'Signal 1',
					name: '1',
					content: 'Signal 1 content'
				}
			],
			tabIndex: 1,
			score: 1,
			signals_in_market: 1,
			techIndiObj: [''],
			indicatorRadioArr: ['sentiment'],
			refs: {}, 
			indicatorUrlArr: new Array(5).fill(''),
			indicatorValArr: new Array(5).fill(''),
			techVal: '',
			exitItemCheck: false,
			delay_bars: 0,
			isDelayBar: false
		}
	},
	components: {
		indicator,
		senti,
		cci,
		rsi,
		macd,
		ma,
		'bollinger-bands-like': bollingerBandsLike,
		'ehler-fisher-transform-like': ehlerFisherTransformLike,
		'stochastic-momentum-index-like': stochasticMomentumIndexLike,
		'ADX-or-DMS-Like': ADXorDMSLike,
		'elder-ray-index-like': elderRayIndexLike,
		'alligator-like': alligatorLike,
		'linear-regForecast-like': linearRegForecastLike,
		'trailing-stop-like': trailingStopLike
	},
	computed: {
		updateSenti() {
			return this.$store.state.currentSenti
		},
		updateTech() {
			return this.$store.state.currentTech
		}
	},
	watch: {
		updateSenti(val) {
			if (this.indicatorRadio == 'technical' && this.techVal == '') {
				this.indicatorRadio = 'sentiment'
			}
		},
		updateTech(val) {
			this.indicatorRadio = 'technical'
		},
	   relation: {
		handler(newVal, oldVal) {
			if(newVal == 3 && this.editableTabs.length > 3) {
				this.$message({
						message: 'TimeOrder Multi-Signal supports up to three signals, please delete the panel',
						type: 'error',
						offset: 300
					})
					this.relation = oldVal
			}
		}
	}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			// 重置所有子组件的数据
			for (let i = 0; i < this.indicatorRadioArr.length; i++) {
				this.$refs.indiChild[i].clearForm()
				this.$refs.sentiChild[i].clearForm()
				this.$refs.cciChild[i].clearForm()
				this.$refs.maChild[i].clearForm()
				this.$refs.macdChild[i].clearForm()
				this.$refs.bollBandsLikeChild[i].clearForm()
				this.$refs.EFTLikeChild[i].clearForm()
				this.$refs.stochasticsLikeChild[i].clearForm()
				this.$refs.ADXLikeChild[i].clearForm()
				this.$refs.ERILikeChild[i].clearForm()
				this.$refs.aligatorLikeChild[i].clearForm()
				this.$refs.LRFLikeChild[i].clearForm()
				this.$refs.trailingStopLikeChild[i].clearForm()
			}
		},
		getTechIndiObj(obj) {
			this.techIndiObj.splice(obj.index, 1, obj.class)
		},
		handleTabsEdit(targetName, action) {
			if (action === 'add') {
				if ((this.relation == 2) || (this.relation == 3)) {
					let num_key
					try{
						 num_key = Number(this.editableTabs[this.editableTabs.length-1].name) + 1
		
					}catch(err){
						num_key = 1
					}
					let num = this.editableTabs.length
					let newTabName = (num +1)  + ''
					// let newTabName = ++(this.editableTabs.length) + ''

					this.editableTabs.push({
						title: 'Signal' + newTabName,
						name: num_key + "",
						content: 'Signal' + newTabName + 'content'
					})
					this.editableTabsValue = Number(this.editableTabsValue) + 1 + ''
					this.indicatorRadioArr.push('sentiment')
				}
				if(this.editableTabs.length > 5 && this.relation == 2){
						this.$message({
							message: 'Add up to five signals',
							type: 'error',
							offset: 300
						})
						this.editableTabs.pop()
						this.editableTabsValue = this.editableTabs.length + ''
				        this.tabIndex =this.editableTabs.length
				}
					if(this.relation == 3 && this.editableTabs.length > 3) {
					this.$message({
						message: 'Add up to three signals',
						type: 'error',
						offset: 300
					})
						this.editableTabs.pop()
						this.editableTabsValue = this.editableTabs.length + ''
				        this.tabIndex =this.editableTabs.length
					}
				}
			if (action === 'remove') {
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue

				var absoluteIndex = ''
				tabs.forEach((tab, index) => {
					if(tab.name==targetName){
						absoluteIndex = index
					}
				})

				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1]
							if (nextTab) {
								activeName = nextTab.name
							}
						}
					})
				}
				let panelArr = tabs.filter((tab) => tab.name !== targetName) 
				this.editableTabs = panelArr
				panelArr.forEach((item,index) => {
						// item.name = index + 1 + ''
						item.title = 'Signal' + (index + 1)
						// item.content = 'Signal' + (index + 1) + 'content'
					})

				// this.editableTabs = panelArr
				// try{
				// 	activeName = (panelArr.length)-1

				// }catch(error){
				// 	activeName = 1
				// }
				this.editableTabsValue = activeName
				this.indicatorUrlArr.splice(absoluteIndex,1)
				this.indicatorUrlArr.push('')
				this.indicatorValArr.splice(absoluteIndex,1)
				this.indicatorValArr.push('')
				this.indicatorRadioArr.splice(absoluteIndex,1)

				// 移除某选项卡时，把indicatorUrlArr内的indicator依次载入vuex以刷新状态
				tabs.forEach((tab, index) => {
					this.$store.commit('getEntryIndicators', {index: index, value: this.indicatorUrlArr[index]})
				})
			}
			
					console.log('refs',this.$refs)
		},
		getIndicatorUrl(obj) {
			this.indicatorUrlArr.splice(obj.index, 1, obj.url)
		},
		getIndicatorVal(obj) {
			this.techVal = obj.value
			this.indicatorValArr.splice(obj.index, 1, obj.value)
		},
		getTechIndiValue(val) {
			this.techIndiValue = val
		},
		getIndicatorRadio(obj) {
			this.indicatorRadio = obj.value
			this.indicatorRadioArr.splice(obj.index, 1, obj.value)
		},
		addEntrySignalLength() {
			this.$emit('sendEntrySignalIndex', this.indicatorRadioArr.length)
		},
		saveScoreValue() {
			let obj = {}
			obj.criteria = 'entry'
			obj.value = this.score
			this.$store.commit('saveScoreValue', obj)
		},
		saveSignalsInMarket() {
			let obj = {}
			obj.criteria = "entry"
			obj.value = this.signals_in_market
			this.$store.commit('saveSignalsInMarket',obj)
		},
		saveDelayBar() {
			let obj = {}
			obj.criteria = "entry"
			obj.value = this.delay_bars
			this.$store.commit("saveDelayBar",obj)
		},
		saveRelation() {
		if(this.editableTabs.length>1) {
			let obj = {}
			obj.criteria = "entry"
			obj.value = this.relation
			this.$store.commit("saveRelation",obj)}
		},
		saveBacktestData(index) {
			let checked = true
			//console.log('entry的保存执行了' + index + '次')
			let indi = this.$refs.indiChild[index].saveIndicator(index)
			// 按照 sentiment 以及不同的 technical 触发不同组件的保存事件
			return indi.then((val) => { 
				// 按照 sentiment 以及不同的 technical 触发不同组件的保存事件
				if(!val) {
					this.$message({
					message: 'Please check that the ' + (index+1) + 'th panel field is filled in correctly',
					type: 'error'
				})}
				if (indi) {
				if (this.indicatorRadioArr[index] === 'sentiment') {
					this.$refs.sentiChild[index].setDesciption(index)
					let senti = this.$refs.sentiChild[index].saveCondition(index)
					if(!senti) {
					this.$message({
					message: 'Please check that the ' + (index+1) + 'th panel field is filled in correctly',
					type: 'error'
				    })
					} 
					return (checked = senti)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'CCI_like'
				) {
					this.$refs.cciChild[index].setDesciption(index)
					let cci = this.$refs.cciChild[index].saveCondition(index)
					return (checked = cci)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'rsi'
				) {
					this.$refs.rsiChild[index].setDesciption(index)
					let rsi = this.$refs.rsiChild[index].saveCondition(index)
					return (checked = rsi)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'MACD_like'
				) {
					this.$refs.macdChild[index].setDesciption(index)
					let macd = this.$refs.macdChild[index].saveCondition(index)
					return (checked = macd)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'MovingAverage_like'
				) {
					this.$refs.maChild[index].setDesciption(index)
					let ma = this.$refs.maChild[index].saveCondition(index)
					return (checked = ma)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'EFT_like'
				) {
					this.$refs.EFTLikeChild[index].setDesciption(index)
					let eft = this.$refs.EFTLikeChild[index].saveCondition(index)
					return (checked = eft)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'ADX_like'
				) {
					this.$refs.ADXLikeChild[index].setDesciption(index)
					let adx = this.$refs.ADXLikeChild[index].saveCondition(index)
					return (checked = adx)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'Aligator_like'
				) {
					this.$refs.aligatorLikeChild[index].setDesciption(index)
					let aligator =
						this.$refs.aligatorLikeChild[index].saveCondition(index)
					return (checked = aligator)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'LRF_like'
				) {
					this.$refs.LRFLikeChild[index].setDesciption(index)
					let lrf = this.$refs.LRFLikeChild[index].saveCondition(index)
					return (checked = lrf)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'BollingerBands_like'
				) {
					this.$refs.bollBandsLikeChild[index].setDesciption(index)
					let blb = this.$refs.bollBandsLikeChild[index].saveCondition(index)
					return (checked = blb)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'Stochastics_like'
				) {
					this.$refs.stochasticsLikeChild[index].setDesciption(index)
					let smi = this.$refs.stochasticsLikeChild[index].saveCondition(index)
					return (checked = smi)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'ERI_like'
				) {
					this.$refs.ERILikeChild[index].setDesciption(index)
					let eri = this.$refs.ERILikeChild[index].saveCondition(index)
					return (checked = eri)
				}
				if (
					this.indicatorRadioArr[index] === 'technical' &&
					this.techIndiObj[index] === 'Trailingstop_like'
				) {
					this.$refs.trailingStopLikeChild[index].setDesciption(index)
					let ts = this.$refs.trailingStopLikeChild[index].saveCondition(index)
					return (checked = ts)
				}
			} else {
				checked = false
			}
			})
		},
		setEditPanel(num, data) {
			this.clearForm()
		    if(num == 1) {
				this.relation = 1
			}
			this.relation = data.entry.relation ? data.entry.relation : 1
			for (let i = 0; i < num-1; i++) {
				this.handleTabsEdit(null, 'add')
			}
			this.refs = data
			this.$nextTick(() => {
				console.log('当前的refs', this.$refs.indiChild)
				this.setEditData(this.refs)
			})
		},
		setEditData(data) {
			let vm = this
			console.log('编辑的entrydata', data)
			this.score = data.entry.score
			this.delay_bars =  data.entry.delay_bars ? data.entry.delay_bars : 0
			this.signals_in_market = data.entry.signals_in_market ? data.entry.signals_in_market : 1
			let length = data.entry.signals.length
			this.tabIndex = length
            this.relation = data.entry.relation ? data.entry.relation : 1
			for (let j = 0; j < length; j++) {
				console.log('函数执行了' + j + '次，共' + length + '次')
				vm.$refs.indiChild[j].setEditData(data)
				if (data.entry.signals[j].analysis === 'Sentiment') {
					this.indicatorValArr[j] = data.entry.signals[j].indicator
					this.indicatorRadioArr.splice(j, 1, 'sentiment')
					this.indicatorRadio = 'sentiment'
					this.$refs.sentiChild[j].setEditData(data)
					this.techIndiObj[j] = ''
				}
				if (data.entry.signals[j].analysis === 'Technical') {
					this.indicatorValArr[j] = data.entry.signals[j].indicator
					this.indicatorRadio = 'technical'
					this.indicatorRadioArr.splice(j, 1, 'technical')
					let formateTechnicalList
					if (this.$store.state.formateTechnicalList.length === 0) {
						this.$refs.indiChild[j].loadShortLong()
					}
					formateTechnicalList = this.$store.state.formateTechnicalList
					let indicatorName = data.entry.signals[j].indicator
					for (let i = 0; i < formateTechnicalList.length; i++) {
						if (indicatorName === formateTechnicalList[i].value) {
							this.techIndiValue = formateTechnicalList[i].class
							// this.techIndiObj.splice(i, 1, formateTechnicalList[j].class)
							this.techIndiObj[j] = formateTechnicalList[i].class
							break
						}
					}
					if (this.techIndiObj[j] === 'CCI_like') {
						this.$refs.cciChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'MovingAverage_like') {
						this.$refs.maChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'MACD_like') {
						this.$refs.macdChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'EFT_like') {
						this.$refs.EFTLikeChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'ADX_like') {
						this.$refs.ADXLikeChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'Aligator_like') {
						this.$refs.aligatorLikeChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'LRF_like') {
						this.$refs.LRFLikeChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'BollingerBands_like') {
						this.$refs.bollBandsLikeChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'Stochastics_like') {
						this.$refs.stochasticsLikeChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'ERI_like') {
						this.$refs.ERILikeChild[j].setEditData(data)
					}
					if (this.techIndiObj[j] === 'Trailingstop_like') {
						this.$refs.trailingStopLikeChild[j].setEditData(data)
					}
				}
			}
		}
	}
}
</script>
<style lang="less" scoped>
.criteria-title {
	font-size: 18px;
	font-weight: bold;
}
.radioBox .el-form-item {
	display: flex;
}
/deep/.radioBox .el-form-item .el-form-item__label {
	margin-right: 40px;
	width: 70px;
	font-size: 16px;
}
/deep/
	.el-form-item.is-required:not(.is-no-asterisk)
	> .el-form-item__label:before {
	content: ' ';
	width: 0px;
	margin-right: 0px;
}
/deep/ .el-form-item {
	margin-bottom: 10px;
}
.entry-container {
	// padding-left: 50px;
	// padding-right: 10px;
	margin-left: 40px;
	// border-right: 1px solid #797979;
	margin-bottom: 10px;
}
@media (min-width: 1280px) and (max-width: 1365px) {
	.entry-container {
		// padding-left: 50px;
		// padding-right: 10px;
		margin: 0px 10px 10px 10px;
	}
}
@media (min-width: 820px) and (max-width: 1279px) {
	.entry-container {
		// padding-left: 50px;
		// padding-right: 10px;
		margin: 0px 40px 10px 40px;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.entry-container {
		// padding-left: 50px;
		// padding-right: 10px;
		margin: 0px 40px 10px 40px;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.entry-container {
		border-bottom: 1px solid #797979;
	}
	.entry-container {
		margin: 0px 0px 10px 0px;
	}
	.criteria-title {
		font-size: 15px;
	}
}
.signal-option-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.signal-container {
	display: flex;
	justify-content: center;
	align-items: center;
}
/deep/ .multi .multi-box .el-tabs--card > .el-tabs__header {
	display: none;
}
.scoreNote {
	font-size: 16px;
	font-weight: 500;
}
/deep/.el-tabs__nav .el-tabs__item:nth-child(1) span {
	display: none;
}
.signal-option-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.signal-container {
	display: flex;
	justify-content: center;
	align-items: center;
}
/deep/ .multi .multi-box .el-tabs--card > .el-tabs__header {
	display: none;
}
/deep/.el-tabs__nav .el-tabs__item:nth-child(1) span {
	display: none;
}
.delay-bar-box{
	display: flex;
	border-top: 1px solid #797979;
	padding-top: 10px;
}
</style>