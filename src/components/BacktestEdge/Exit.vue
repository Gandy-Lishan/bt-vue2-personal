// Exit Criteria
<template>
	<div class="exit-container">
		<div class="signal-option-box">
			<div class="entry-title-box">
				<p class="criteria-title">Exit Criteria</p>
				<el-tooltip effect="dark" placement="top" style="diaplay: inline">
					<span slot="content"
						>Set the criteria/criterias which trigger the backtest exit criteria.<br />
						Choose one of the three options for exit criteria:<br />
						1. Single Criteria: One criteria will trigger the backtest criteria.<br />
						2. SameBar Multi-Criteria: More than one criterias (limit to 5)
						occurring at the same bar,will trigger the backtest criteria.<br />
						3. TimeOrder Multi-Criteria: More than one criterias (limit to 3)
						occurring within a number of bars,will trigger the backtest
						criteria.<br />
						4. Only Use Risk Control: If the 'Risk Control at Exit' is set, this
						option can be chosen to trigger the backtest criteria.<br />
					</span>
					<i class="iconfont icon-wenhao"></i>
				</el-tooltip>
			</div>
			<div class="signal-container">
				<span class="scoreNote" v-if="relation === 2">
					<span>Score: </span>
					<el-tooltip effect="dark" placement="top" style="diaplay: inline">
						<span slot="content"
							>Choose a value to specify how many following criterias will occur
							at the same bar to trigger the backtest criteria.<br />
							if choose score 1, meanning if any one criteria of the following
							criterias occur the backtest criteria is met.<br />
							if choose score 2, meanning if any two of the criterias of the
							following criterias occur the backtest criteria is met.<br />
							etc.<br />
							For example:<br />
							If the backtest criteria needs to have a "AND" condition of 2
							criterias, set two criterias below and choose score 2.<br />
							If the backtest criteria needs to have a "OR" condition of 2
							criterias, set two criterias below and choose score 1.<br />
							etc.<br />
						</span>
						<i class="iconfont icon-wenhao"></i> </el-tooltip
				></span>
				<el-input-number
					v-model="score"
					:step="1"
					step-strictly
					v-if="relation === 2"
					:min="1"
					:max="editableTabs.length"
					size="mini"
				></el-input-number>
				<span class="scoreNote" v-if="relation === 3">
					<span>Period:</span>
					<el-tooltip effect="dark" placement="top" style="diaplay: inline">
						<span slot="content"
							>Choose a value to specify how many bars within which the
							following criterias will occur in time order to trigger the backtest
							criteria.<br />
							if choose period 1, meanning if the following criterias occur at the
							same bar the backtest criteria is met.<br />
							if choose period 2, meanning if the following criterias occur within
							two bars the backtest criteria is met.<br />
							etc.<br />
							For example:<br />
							If the backtest criteria needs to have two consecutive criterias,
							set two criterias below and choose period 2.<br />
							If the backtest criteria needs to have two criterias occur within 3
							bars, set two criterias below and choose period 3.<br />
							etc.<br />
						</span>
						<i class="iconfont icon-wenhao"></i> </el-tooltip
				></span>
				<el-input-number
					v-model="signals_in_market"
					:step="1"
					step-strictly
					v-if="relation === 3"
					:min="1"
					size="mini"
				></el-input-number>
				<el-select
					v-model="relation"
					placeholder="Please select criteria"
					@change="changeRelation"
				>
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
						<symbol-indi
							v-bind="$attrs"
							:tabLength="indicatorRadioArr.length"
							:criteria="'exit'"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							ref="symbolChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:sentiUrl="indicatorUrlArr[index]"
							:sentiVal="indicatorValArr[index]"
							v-show="indicatorRadioArr[index] === 'symbol'"
						></symbol-indi>
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
							<el-checkbox v-model="isDelayBar" @change="isCheckDelayBar">
								<span>Delay of Bars </span>
								<el-tooltip
									effect="dark"
									placement="top"
									style="diaplay: inline"
								>
									<span slot="content"
										>Check this option to delay the specified number of bars to
										exit when the exit criteria is met.<br />
									</span>
									<i class="iconfont icon-wenhao"></i> </el-tooltip
							></el-checkbox>
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
import symbol from '@/components/BacktestEdge/signal/sentiment/Symbol'
import cci from '@/components/BacktestEdge/signal/technical/Cci-like'
import macd from '@/components/BacktestEdge/signal/technical/Macd-like.vue'
import SignalCode from '@/tools/codeTool.js'
import ma from '@/components/BacktestEdge/signal/technical/Ma.vue'
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
	inheritAttrs: false,
	data() {
		return {
			techIndiValue: '',
			indicatorRadio: 'sentiment',
			signalOptions: [
				{
					value: 1,
					label: 'Single-Criteria'
				},
				{
					value: 2,
					label: 'SameBar Multi-Criteria'
				},
				{
					value: 3,
					label: 'TimeOrder Multi-Criteria'
				}
			],
			relation: 1,
			editableTabsValue: '1',
			editableTabs: [
				{
					title: 'Criteria 1',
					name: '1',
					content: 'Criteria 1 content'
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
		'symbol-indi' :symbol,
		cci,
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
		},
		riskControl() {
			return this.$store.state.riskControl
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
				if (newVal == 0) {
					this.exitItemCheck = true
				} else {
					this.exitItemCheck = false
				}
				this.$emit('isOnlyRiskControl', this.exitItemCheck)
			if(newVal == 3 && this.editableTabs.length > 3) {
  this.$confirm('TimeOrder Multi-Criteria supports up to three criterias,Currently your multi-criteria count is '+ this.editableTabs.length + ', are you sure you want to delete the last '+(this.editableTabs.length - 3) + 'th panels ?', 'Tips', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
			const currentTabs = this.editableTabs.length
			for(let i=0;i<( currentTabs - 3);i++) {
				this.handleTabsEdit(this.editableTabs.length + '','remove')
			}
          this.$message({
            type: 'success',
            offset: 300,
			message: 'The deletion is successful and has been automatically switched to TimeOrder Multi-Criteria'
          });
		  this.relation = newVal
        }).catch(() => {
		this.relation = oldVal
          this.$message({
            type: 'info',
			offset: 300,
            message: 'With the deletion undeleted, you can switch to The SaveBar Multi-Criteria to delete the criteria panel to less than 3'
          });          
        });
      }
			}
		},
		riskControl: {
			handler(newVal) {
				if (!newVal && this.relation == 0) {
					this.relation = 1
				}
			},
			immediate: true
		}
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			// Reset data for all subcomponents
			try {
				for (let i = 0; i < this.indicatorRadioArr.length; i++) {
					if (this.indicatorRadioArr[i]) {
						this.$refs.indiChild[i].clearForm()
						this.$refs.sentiChild[i].clearForm()
						this.$refs.symbolChild[i].clearForm()
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
			} catch (err) {
				console.error(err)
			}
		},
		addRiskControlOption(newVal) {
			if (newVal) {
				this.signalOptions = [
					{
						value: 1,
						label: 'Single-Criteria'
					},
					{
						value: 2,
						label: 'SameBar Multi-Criteria'
					},
					{
						value: 3,
						label: 'TimeOrder Multi-Criteria'
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
						label: 'Single-Criteria'
					},
					{
						value: 2,
						label: 'SameBar Multi-Criteria'
					},
					{
						value: 3,
						label: 'TimeOrder Multi-Criteria'
					}
				]
				this.exitItemCheck = false
			}
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
					this.editableTabs.push({
						title: 'Criteria' + newTabName,
						name: num_key + '',
						content: 'Criteria' + newTabName + 'content'
					})
					this.editableTabsValue = Number(this.editableTabsValue) + 1 + ''
					this.indicatorRadioArr.push('sentiment')
				}
				if (this.editableTabs.length > 5 && this.relation == 2) {
					this.$message({
						message: 'Add up to five criterias',
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
						message: 'Add up to three criterias',
						type: 'error',
						offset: 300
					})
					this.editableTabs.pop()
					this.indicatorRadioArr.pop()
					this.editableTabsValue = this.editableTabs.length + ''
					this.tabIndex = this.editableTabs.length
				}
				if (this.relation == 2) {
					this.score = this.indicatorRadioArr.length
				}
				if (this.relation == 3) {
					this.signals_in_market = this.indicatorRadioArr.length
				}
			}
			if (action === 'remove') {
				if (
					(this.relation == 2 || this.relation == 3) &&
					this.editableTabs.length == 2
				) {
					// At least two criterias
					this.$message({
						message:
							'Multiple criterias are currently selected, at least two criterias',
						type: 'error',
						offset: 300
					})
					return
				}
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
					item.title = 'Criteria' + (index + 1)
				})
				this.editableTabsValue = activeName
				this.indicatorValArr.splice(absoluteIndex, 1)
				this.indicatorValArr.push('')
				this.indicatorUrlArr.splice(absoluteIndex, 1)
				this.indicatorUrlArr.push('')
				this.indicatorRadioArr.splice(absoluteIndex, 1)
				this.techIndiObj.splice(absoluteIndex, 1)
				this.techIndiObj.push('')
				if (this.relation == 2) {
					this.score = this.indicatorRadioArr.length
				}
				if (this.relation == 3) {
					this.signals_in_market = this.indicatorRadioArr.length
				}
//When removing a tab, load the indicators in the indicatorurlarr into vuex to refresh the status
				tabs.forEach((tab, index) => {
					this.$store.commit('getExitIndicators', {
						index: index,
						value: this.indicatorUrlArr[index]
					})
				})
			}
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
		addExitSignalLength() {
			if (this.relation == 2 || this.relation == 3 || this.relation == 0) {
				this.$emit('sendExitSignalIndex', this.indicatorRadioArr.length)
				for (let i = 0; i < this.indicatorRadioArr.length; i++) {
					// Apply for space
					let obj = {}
					obj.criteria = 'exit'
					obj.index = i
					this.$store.commit('addSignalLength', obj)
				}
			}
			if (this.relation == 1) {
				this.$emit('sendExitSignalIndex', 1)
			}
		},
		saveScoreValue() {
			let obj = {}
			obj.criteria = 'exit'
			if (this.relation == 1 || this.relation == 3 || this.relation == 0) {
				obj.value = 1
			}
			if (this.relation == 2) {
				obj.value = this.score
			}
			this.$store.commit('saveScoreValue', obj)
		},
		saveSignalsInMarket() {
			let obj = {}
			obj.criteria = 'exit'
			if (this.relation == 1 || this.relation == 2 || this.relation == 0) {
				obj.value = 1
			}
			if (this.relation == 3) {
				obj.value = this.signals_in_market
			}
			this.$store.commit('saveSignalsInMarket', obj)
		},
		saveDelayBar() {
			let obj = {}
			obj.criteria = 'exit'
			// Do not select isdelaybar
			if (!this.isDelayBar) {
				obj.value = 0
			}
			// Choose delaybar instead of only risk
			if (this.isDelayBar && !this.exitItemCheck) {
				obj.value = this.delay_bars
			}
			// Select delaybar and only risk
			if (this.isDelayBar && this.exitItemCheck) {
				obj.value = 0
			}
			this.$store.commit('saveDelayBar', obj)
		},
		isCheckDelayBar(val) {
			if (val) {
				this.delay_bars = 1
			} else {
				this.delay_bars = 0
			}
		},
		saveRelation() {
			let obj = {}
			obj.criteria = 'exit'

			if (this.indicatorRadioArr.length > 1 && !this.exitItemCheck) {
				obj.value = this.relation
			}
			if (this.indicatorRadioArr.length == 1 && !this.exitItemCheck) {
				obj.value = 1
			}
			if (this.exitItemCheck) {
				obj.value = 0
			}

			this.$store.commit('saveRelation', obj)
		},
		changeRelation(val) {
			if (val == 1) {
				this.editableTabsValue = '1'
				this.score = 1
				this.signals_in_market = 1
			}
			if (val == 2 || val == 3) {
				if (this.editableTabs.length === 1) {
					this.handleTabsEdit(null, 'add')
					this.editableTabsValue = '1'
				}
				if (val == 2) {
					this.score = 2
				}
				if (val == 3) {
					this.signals_in_market = 2
				}
			}
			this.$emit('getExitRelation', val)
			this.$store.commit('clearExitSignalArr')

		},
		saveBacktestData(index) {
			let checked = true
			// Save the selected indicator to vuex
			let vm = this
			if (vm.exitItemCheck) {
				// Save risk description
				let desObj = {}
				desObj.criteria = 'exit'
				desObj.index = 0
				//desObj.description = vm.$store.state.riskDescription
				desObj.description = {
					'commentDes':vm.$store.state.riskDescription,
					'rocCond':null
				}
				this.$store.commit('saveDescription', desObj)
				return (checked = true)
			}
			
			let indi = this.$refs.indiChild[index].saveIndicator(index)
			return indi.then((val) => {
				if (val) {
					if (vm.indicatorRadioArr[index] === 'sentiment') {
						vm.$refs.sentiChild[index].setDesciption(index)
						let senti = this.$refs.sentiChild[index].saveCondition(index)
						if (!senti) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = senti)
					}
					if (vm.indicatorRadioArr[index] === 'symbol') {
						vm.$refs.symbolChild[index].setDesciption(index)
						let symbol = vm.$refs.symbolChild[index].saveCondition(index)
						if(!symbol) {
						vm.$message({
						message: 'Please check that the #' + (index+1) + ' entry panel field is filled in correctly',
						type: 'error'
						})
						} 
						return (checked = symbol)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'CCI_like'
					) {
						this.$refs.cciChild[index].setDesciption(index)
						let cci = this.$refs.cciChild[index].saveCondition(index)
						if (!cci) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = cci)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'MACD_like'
					) {
						
						this.$refs.macdChild[index].setDesciption(index)
						let macd = this.$refs.macdChild[index].saveCondition(index)
						if (!macd) {
							this.$message({
								message:
								'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = macd)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'MovingAverage_like'
					) {
						this.$refs.maChild[index].setDesciption(index)
						let ma = this.$refs.maChild[index].saveCondition(index)
						if (!ma) {
							this.$message({
								message:
								'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = ma)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'EFT_like'
					) {
						this.$refs.EFTLikeChild[index].setDesciption(index)
						let eft = this.$refs.EFTLikeChild[index].saveCondition(index)
						if (!eft) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = eft)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'ADX_like'
					) {
						this.$refs.ADXLikeChild[index].setDesciption(index)
						let adx = this.$refs.ADXLikeChild[index].saveCondition(index)
						if (!adx) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = adx)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'Aligator_like'
					) {
						this.$refs.aligatorLikeChild[index].setDesciption(index)
						let aligator =
							this.$refs.aligatorLikeChild[index].saveCondition(index)
						if (!aligator) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = aligator)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'LRF_like'
					) {
						this.$refs.LRFLikeChild[index].setDesciption(index)
						let lrf = this.$refs.LRFLikeChild[index].saveCondition(index)
						if (!lrf) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = lrf)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'BollingerBands_like'
					) {
						this.$refs.bollBandsLikeChild[index].setDesciption(index)
						let blb = this.$refs.bollBandsLikeChild[index].saveCondition(index)
						if (!blb) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = blb)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'Stochastics_like'
					) {
						this.$refs.stochasticsLikeChild[index].setDesciption(index)
						let smi =
							this.$refs.stochasticsLikeChild[index].saveCondition(index)
						if (!smi) {
							this.$message({
								message:
								'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = smi)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'ERI_like'
					) {
						this.$refs.ERILikeChild[index].setDesciption(index)
						let eri = this.$refs.ERILikeChild[index].saveCondition(index)
						if (!eri) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = eri)
					}
					if (
						this.indicatorRadioArr[index] === 'technical' &&
						this.techIndiObj[index] === 'Trailingstop_like'
					) {
						this.$refs.trailingStopLikeChild[index].setDesciption(index)
						let ts =
							this.$refs.trailingStopLikeChild[index].saveCondition(index)
						if (!ts) {
							this.$message({
								message:
									'Please check that the #' +
									(index + 1) +
									' exit panel field is filled in correctly',
								type: 'error'
							})
						}
						return (checked = ts)
					}
				} else {
					checked = false
					return checked
				}
			})
		},
		setEditPanel(num, data) {
			this.relation = data.exit.relation ? data.exit.relation : 1
			
							let formateTechnicalList
					if (this.$store.state.formateTechnicalList.length === 0) {
						this.$refs.indiChild[0].loadShortLong()
					}
			for (let i = 0; i < num - 1; i++) {
				this.handleTabsEdit(null, 'add')
			}
			this.refs = data
			this.score = data.exit.score
			this.delay_bars = data.exit.delay_bars ? data.exit.delay_bars : 0
			if (this.delay_bars != 0) {
				this.isDelayBar = true
			} else {
				this.isDelayBar = false
			}
			this.signals_in_market = data.exit.signals_in_market
				? data.exit.signals_in_market
				: 1
			this.relation = data.exit.relation ? data.exit.relation : 1
			this.$emit('getExitRelation', this.relation)
			let length = data.exit.signals.length
			this.tabIndex = length
				for (let j = 0; j < length; j++) {
				if (data.exit.signals[j].analysis === 'Sentiment') {
					this.indicatorValArr[j] = data.exit.signals[j].indicator
					this.indicatorRadioArr.splice(j, 1, 'sentiment')
					this.indicatorRadio = 'sentiment'
					this.techIndiObj[j] = ''
				}
				if (data.exit.signals[j].analysis === 'Technical') {
					this.indicatorValArr[j] = data.exit.signals[j].indicator
					this.indicatorRadio = 'technical'
					this.indicatorRadioArr.splice(j, 1, 'technical')
					formateTechnicalList = this.$store.state.formateTechnicalList
					let indicatorName = data.exit.signals[j].indicator
					for (let i = 0; i < formateTechnicalList.length; i++) {
						if (indicatorName === formateTechnicalList[i].value) {
							this.techIndiValue = formateTechnicalList[i].class
							this.techIndiObj[j] = formateTechnicalList[i].class
							break
						}
					}}}
			this.$nextTick(() => {
				this.setEditData(this.refs)
			})
		},
		setEditData(data) {
			let length = data.exit.signals.length
			for (let j = 0; j < length; j++) {
				this.$refs.indiChild[j].setEditData(data)
				this.$refs.indiChild[j].setEditData(data)
				if (this.indicatorRadioArr[j] === 'sentiment') {
					this.$refs.sentiChild[j].setEditData(data)
				}
				if (this.indicatorRadioArr[j] === 'symbol') {
					this.$refs.symbolChild[j].setEditData(data)
				}
				if (this.indicatorRadioArr[j] === 'technical') {
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
		},
		setRiskEditData(data) {
			this.relation = 0
			this.exitItemCheck = true
			this.signalOptions = [
				{
					value: 1,
					label: 'Single-Criteria'
				},
				{
					value: 2,
					label: 'SameBar Multi-Criteria'
				},
				{
					value: 3,
					label: 'TimeOrder Multi-Criteria'
				},
				{
					value: 0,
					label: 'Only Use Risk Control'
				}
			]
			this.$emit('isOnlyRiskControl', this.exitItemCheck)
			this.$emit('getExitRelation', this.relation)
		}
	}
}
</script>
<style lang="less" scoped>
.criteria-title {
	font-size: 18px;
	font-weight: bold;
	margin-right: 5px;
	display: inline-block;
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
/deep/ .el-input-number--mini {
	width: 118px;
}
</style>