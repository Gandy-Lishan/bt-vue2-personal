<template>
	<div class="exit-container">
		
			<!-- <p>{{indicatorRadioArr}}</p>
			<p>{{indicatorUrlArr}}</p>
			<p>{{indicatorValArr}}</p> -->
		<div class="signal-option-box">
			<el-tooltip
				style="diaplay: inline"
				effect="light"
				content="All params of exit criteria"
				placement="bottom"
			>
				<p class="criteria-title">Exit Criteria</p></el-tooltip
			>
			<div class="signal-container">
				<span class="scoreNote" v-if="relation === 2"
					><el-tooltip
						style="diaplay: inline"
						effect="light"
						content="Only use in multi signals and the value <= the len of signals"
						placement="bottom"
					>
						<span>Score:</span>
					</el-tooltip></span
				>
				<el-input-number
					v-model="score"
					:step="1"
					step-strictly
					v-if="relation === 2"
					:min="1"
					:max="editableTabs.length"
					size="mini"
				></el-input-number>
				<span class="scoreNote" v-if="relation === 3"
					><el-tooltip
						style="diaplay: inline"
						effect="light"
						content="Using in indicator formula"
						placement="bottom"
					>
						<span>Period:</span>
					</el-tooltip></span
				>
				<el-input-number
					v-model="signals_in_market"
					:step="1"
					step-strictly
					v-if="relation === 3"
					:min="1"
					size="mini"
				></el-input-number>
				<el-select v-model="relation" placeholder="Please select signal" @change="changeRelation">
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
							:criteria="'exit'"
							:panelIndex="index"
							:editableTabs="editableTabs"
							:editableTabsValue="editableTabsValue"
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
							:tabLength="indicatorRadioArr.length"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'CCI_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'rsi'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'MACD_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'MovingAverage_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
						<!-- <risk
							v-show="indicatorRadioArr[index] === 'risk'"
							ref="riskChild"
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'exit'"
							:riskIndiValue="riskIndiValue"
							:riskVal="riskValArr[index]"
						></risk> -->
						<bollinger-bands-like
							v-bind="$attrs"
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'BollingerBands_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'EFT_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Stochastics_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'ADX_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'ERI_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Aligator_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'LRF_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
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
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Trailingstop_like'
							"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							:criteria="'exit'"
							ref="trailingStopLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Trailingstop_like'
							"
						></trailing-stop-like>
						<div class="delay-bar-box">
							<el-checkbox v-model="isDelayBar"
								><el-tooltip
									style="diaplay: inline"
									effect="light"
									content="The number of bars delayed"
									placement="bottom"
								>
									<span>Delay of Bars</span>
								</el-tooltip></el-checkbox
							>
											<el-input-number
					v-model="delay_bars"
					:step="1"
					step-strictly
					:min="0"
					size="mini"
					:disabled="!isDelayBar"
				></el-input-number>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>
<script>
import indicator from '@/components/BacktestEdge/signal/indicator/indicator'
import senti from '@/components/BacktestEdge/signal/sentiment/Senti'
import cci from '@/components/BacktestEdge/signal/technical/Cci-like'
import rsi from '@/components/BacktestEdge/signal/technical/Rsi.vue'
import macd from '@/components/BacktestEdge/signal/technical/Macd-like.vue'
import SignalCode from '@/tools/codeTool.js'
import ma from '@/components/BacktestEdge/signal/technical/Ma.vue'
import risk from '@/components/BacktestEdge/signal/exit/Risk.vue'
import bollingerBandsLike from '@/components/BacktestEdge/signal/technical/Bollinger-Bands-like.vue'
import ehlerFisherTransformLike from '@/components/BacktestEdge/signal/technical/Ehler-Fisher-Transform-like.vue'
import stochasticMomentumIndexLike from '@/components/BacktestEdge/signal/technical/Stochastic-Momentum-Index-like.vue'
import ADXorDMSLike from '@/components/BacktestEdge/signal/technical/ADXorDMS-like.vue'
import elderRayIndexLike from '@/components/BacktestEdge/signal/technical/Elder-Ray-Index-like.vue'
import alligatorLike from '@/components/BacktestEdge/signal/technical/Alligator-like.vue'
import linearRegForecastLike from '@/components/BacktestEdge/signal/technical/Linear-RegForecast-like.vue'
import trailingStopLike from '@/components/BacktestEdge/signal/technical/Trailing-Stops-like.vue'
export default {
	name: 'exit',
	props: {
		exitSaveCheck: Boolean
	},
	inheritAttrs: false,
	data() {
		return {
			techIndiValue: '',
			// riskIndiValue: '',
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
				}
			],
			relation: 1,
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
			techIndiObj: new Array(5).fill(''),
			indicatorRadioArr: ['sentiment'],
			refs: {},
			indicatorUrlArr: new Array(5).fill(''),
			indicatorValArr: new Array(5).fill(''),
			// riskValArr: new Array(5).fill(''),
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
		exitSaveCheck: {
			handler(newVal) {
				//console.log("传到exit的值", newVal);
				if (newVal) {
					this.signalOptions = [
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
						{
							value: 0,
							label: 'Only Use Risk Control'
						}
					]
				} else {
					this.signalOptions = [
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
						}
					]
					this.relation = 1
					this.exitItemCheck = false
				}
			}
		},
		relation: {
			handler(newVal, oldVal) {
				if (newVal == 0) {
					this.exitItemCheck = true
				} else {
					this.exitItemCheck = false
				}
				this.$emit('isOnlyRiskControl', this.exitItemCheck)
				if (newVal == 3 && this.editableTabs.length > 3) {
					this.$message({
						message:
							'TimeOrder Multi-Signal supports up to three signals, please delete the panel',
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
				try{
					for (let i = 0; i < this.indicatorRadioArr.length; i++) {
						if(this.indicatorRadioArr[i]){
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
					}
				}catch(err){console.error(err)}

		},
		getTechIndiObj(obj) {
			this.techIndiObj.splice(obj.index, 1, obj.class)
		},
		handleTabsEdit(targetName, action) {
			if (action === 'add') {
				if (this.relation == 2 || this.relation == 3) {
					let num_key
					try {
						num_key =
							Number(this.editableTabs[this.editableTabs.length - 1].name) + 1
					} catch (err) {
						num_key = 1
					}
					let num = this.editableTabs.length
					let newTabName = num + 1 + ''
					// let newTabName = ++(this.editableTabs.length) + ''
					this.editableTabs.push({
						title: 'Signal' + newTabName,
						name: num_key + '',
						content: 'Signal' + newTabName + 'content'
					})
					this.editableTabsValue = Number(this.editableTabsValue) + 1 + ''
					this.indicatorRadioArr.push('sentiment')
				}
				if (this.editableTabs.length > 5 && this.relation == 2) {
					this.$message({
						message: 'Add up to five signals',
						type: 'error',
						offset: 300
					})
					this.editableTabs.pop()
					this.indicatorRadioArr.pop()
					this.editableTabsValue = this.editableTabs.length + ''
					this.tabIndex = this.editableTabs.length
				}
				if (this.relation == 3 && this.editableTabs.length > 3) {
					this.$message({
						message: 'Add up to three signals',
						type: 'error',
						offset: 300
					})
					this.editableTabs.pop()
					this.indicatorRadioArr.pop()
					this.editableTabsValue = this.editableTabs.length + ''
					this.tabIndex = this.editableTabs.length
				}
			}
			if (action === 'remove') {
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue
				var absoluteIndex = ''
				tabs.forEach((tab, index) => {
					if (tab.name == targetName) {
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
				panelArr.forEach((item, index) => {
					// item.name = index + 1 + ''
					item.title = 'Signal' + (index + 1)
					// item.content = 'Signal' + (index + 1) + 'content'
				})
				this.editableTabsValue = activeName
				this.indicatorValArr.splice(absoluteIndex, 1)
				this.indicatorValArr.push('')
				this.indicatorUrlArr.splice(absoluteIndex, 1)
				this.indicatorUrlArr.push('')
				this.indicatorRadioArr.splice(absoluteIndex, 1)
				this.techIndiObj.splice(absoluteIndex,1)
				this.techIndiObj.push('')

				// 移除某选项卡时，把indicatorUrlArr内的indicator依次载入vuex以刷新状态
				tabs.forEach((tab, index) => {
					this.$store.commit('getExitIndicators', {
						index: index,
						value: this.indicatorUrlArr[index]
					})
				})
			}
		},

		// getSentiUrl(obj) {
		// 	//console.log('getSentiUrl Exit',obj)
		// 	this.sentiUrlArr.splice(obj.index, 1, obj.url)
		// },
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
		// getRiskIndiValue(val) {
		// 	this.riskIndiValue = val
		// },
		getIndicatorRadio(obj) {
			this.indicatorRadio = obj.value
			this.indicatorRadioArr.splice(obj.index, 1, obj.value)
		},
		addExitSignalLength() {
		if(this.relation == 2 || this.relation == 3 || this.relation == 0) {
			    this.$emit('sendExitSignalIndex', this.indicatorRadioArr.length)
			}
			if(this.relation == 1){
				this.$emit('sendExitSignalIndex', 1)
			}
		},
		saveScoreValue() {
			let obj = {}
			obj.criteria = 'exit'
		 // 当选择 timeorder 和 signal 和 only risk 时，score 默认为 1
			if(this.relation == 1 || this.relation == 3 || this.relation == 0) {
				obj.value = 1
			}
			if(this.relation == 2) {
			    obj.value = this.score
			}
			this.$store.commit('saveScoreValue', obj)
		},
		saveSignalsInMarket() {
			let obj = {}
			obj.criteria = "exit"
			// 当选择 sameBar 和 signal 和 only risk时，signals_in_market 默认为 1
			if(this.relation == 1 || this.relation == 2 || this.relation == 0) {
				obj.value = 1
			}
			if(this.relation == 3) {
			   obj.value = this.signals_in_market
			}
			this.$store.commit('saveSignalsInMarket', obj)
		},
		saveDelayBar() {
			let obj = {}
			obj.criteria = 'exit'
			if(this.isDelayBar && !this.exitItemCheck) {
			    obj.value = this.delay_bars
			}
			if(this.exitItemCheck){
			   obj.value = 0
			}
			this.$store.commit('saveDelayBar', obj)
		},
		saveRelation() {
				let obj = {}
				obj.criteria = 'exit'

			if(this.indicatorRadioArr.length > 1 && !this.exitItemCheck) {
			   obj.value = this.relation
			}
			if(this.indicatorRadioArr.length == 1 && !this.exitItemCheck){
				obj.value = 1
			}
			if(this.exitItemCheck) {
				obj.value = 0
			}

				this.$store.commit('saveRelation', obj)
		},
		changeRelation(val) {
			if(val == 1) {
				this.editableTabsValue = '1'
			}
			this.$emit('getExitRelation',val)
		},
		saveBacktestData(index) {
			let checked = true
			// 将选择的 indicator 保存到 vuex 中
			console.log('exit的保存执行了' + index + '次')
			let vm = this
			if (vm.exitItemCheck) {
				// 保存 risk description
				let desObj = {}
				desObj.criteria = 'exit'
				desObj.index = 0
				desObj.description = vm.$store.state.riskDescription
				this.$store.commit('saveDescription', desObj)
				return (checked = true)
			}
			let indi = this.$refs.indiChild[index].saveIndicator(index)
			return indi.then((val) => {
				// 按照 sentiment 以及不同的 technical 触发不同组件的保存事件
				if(!val) {
					this.$message({
					message: 'Please check that the ' + (index+1) + 'th panel field is filled in correctly',
					type: 'error'
				})}
				if (indi) {
					if (vm.indicatorRadioArr[index] === 'sentiment') {
						vm.$refs.sentiChild[index].setDesciption(index)
						let senti = this.$refs.sentiChild[index].saveCondition(index)
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
						let smi =
							this.$refs.stochasticsLikeChild[index].saveCondition(index)
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
						let ts =
							this.$refs.trailingStopLikeChild[index].saveCondition(index)
						return (checked = ts)
					}
					// if (this.indicatorRadioArr[index] === 'risk') {
					// 	this.$refs.riskChild[index].setDesciption(index)
					// 	let risk = this.$refs.riskChild[index].saveCondition(index)
					// 	return (checked = risk)
					// }
				} else {
					checked = false
					return checked
				}
			})
		},
		setEditPanel(num, data) {
			this.clearForm()
			if (num == 1) {
				this.relation = 1
			}
			this.relation = data.exit.relation ? data.exit.relation : 1
			for (let i = 0; i < num - 1; i++) {
				this.handleTabsEdit(null, 'add')
			}
			this.refs = data
			this.$nextTick(() => {
				//console.log('当前的refs', this.$refs.indiChild)
				this.setEditData(this.refs)
			})
		},
		setEditData(data) {
			//console.log('编辑的exitdata', data)
			this.score = data.exit.score
			this.delay_bars = data.exit.delay_bars ? data.exit.delay_bars : 0
			if(this.delay_bars != 0) {
				this.isDelayBar = true
			}else{
				this.isDelayBar = false
			}
			this.signals_in_market = data.exit.signals_in_market
				? data.exit.signals_in_market
				: 1
			this.relation = data.exit.relation ? data.exit.relation : 1
			this.$emit('getExitRelation',this.relation)
			let length = data.exit.signals.length
			this.tabIndex = length
			for (let j = 0; j < length; j++) {
				//console.log('函数执行了' + j + '次，共' + length + '次')
				this.$refs.indiChild[j].setEditData(data)
				if (data.exit.signals[j].analysis === 'Sentiment') {
					this.indicatorValArr[j] = data.exit.signals[j].indicator
					this.indicatorRadioArr.splice(j, 1, 'sentiment')
					this.indicatorRadio = 'sentiment'
					this.$refs.sentiChild[j].setEditData(data)
					this.techIndiObj[j] = ''
				}
				if (data.exit.signals[j].analysis === 'Technical') {
					this.indicatorValArr[j] = data.exit.signals[j].indicator
					this.indicatorRadio = 'technical'
					this.indicatorRadioArr.splice(j, 1, 'technical')
					let formateTechnicalList
					if (this.$store.state.formateTechnicalList.length === 0) {
						this.$refs.indiChild[j].loadShortLong()
					}
					formateTechnicalList = this.$store.state.formateTechnicalList
					let indicatorName = data.exit.signals[j].indicator
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
				// if (data.exit.signals[j].analysis === 'Exit') {
				// 	this.indicatorRadioArr.splice(j, 1, 'risk')
				// 	if (
				// 		data.exit.signals[j].take_profit &&
				// 		data.exit.signals[j].stop_loss
				// 	) {
				// 		this.riskValArr[j] = 'Profit/Loss'
				// 	} else if (data.exit.signals[j].time_in_market) {
				// 		this.riskValArr[j] = 'Time In Market'
				// 	}
				// 	this.$refs.riskChild[j].setEditData(data)
				// }
			}
		},
		setRiskEditData(data) {
			//console.log('编辑的risk exitdata', data)
			this.score = data.exit.score
			this.delay_bars = data.exit.delay_bars ? data.exit.delay_bars : 0
			if(this.delay_bars != 0) {
				this.isDelayBar = true
			}else{
				this.isDelayBar = false
			}
			this.signals_in_market = data.exit.signals_in_market
				? data.exit.signals_in_market
				: 1
			this.signalOptions = [
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
				{
					value: 0,
					label: 'Only Use Risk Control'
				}
			]
			this.exitItemCheck = true
			this.$emit('isOnlyRiskControl', this.exitItemCheck)
			this.relation = 0
			this.$emit('getExitRelation',this.relation)
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
.exit-container {
	margin-right: 40px;
	margin-bottom: 10px;
}
@media (min-width: 1280px) and (max-width: 1365px) {
	.exit-container {
		// padding-left: 50px;
		// padding-right: 10px;
		margin: 0px 10px 10px 10px;
		// border-right: 1px solid #797979;
	}
}
@media (min-width: 820px) and (max-width: 1279px) {
	.exit-container {
		// padding-left: 50px;
		// padding-right: 10px;
		margin: 0px 40px 10px 40px;
		// border-right: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.exit-container {
		// padding-left: 50px;
		// padding-right: 10px;
		margin: 0px 40px 10px 40px;
		// border-right: 1px solid #797979;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.exit-container {
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
.delay-bar-box {
	display: flex;
	border-top: 1px solid #797979;
	padding-top: 10px;
}
/deep/ .el-input-number--mini{
	width: 118px;
}
</style>