<template>
  <div>
	<div class="criteria-box">
		<div class="signal-option-box">
			<div class="entry-title-box">
				<p class="criteria-title">{{config['criteriaTitle']}}{{title}}</p>
				<el-tooltip  effect="dark" placement="top" style="word-wrap: break-word;display: inline">
					<span slot="content" v-html="config['criteriaTitleTP']">
          </span>
					<i class="iconfont icon-wenhao"></i>
				</el-tooltip>
			</div>
			<div class="signal-container">
				<span class="scoreNote" v-if="relation === 2">
					<span>Score: </span>
					<el-tooltip effect="dark" placement="top" style="display: inline">
						<span slot="content" v-html="config['scoreTP']">
            </span>
						<i class="iconfont icon-wenhao"></i>
					</el-tooltip>
				</span>
				<el-input-number
					v-model="score"
					:step="1"
					step-strictly
					v-if="relation === 2"
					:min="1"
					:max="editableTabs.length"
					size="mini"
				></el-input-number>
				<span class="scoreNote timeLimitBox" v-if="relation === 3">
					<div class="excludeBox">
						<el-checkbox v-model="isUsePeriodLimit" @change="changePeriodLimit"
							>Use Time Period Limit
							<el-tooltip effect="dark" placement="top">
								<span slot="content" v-html="config['timeLimitTP']">
								</span>
								<i class="iconfont icon-wenhao"></i>
							</el-tooltip>
						</el-checkbox>
					</div>
					<div class="period-box" v-if="isUsePeriodLimit">
						<span>Period: </span>
						<el-tooltip effect="dark" placement="top" style="display: inline; margin-right: 5px;">
							<span slot="content" v-html="config['periodTP']">
							</span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
						<el-input-number
							v-model="signals_in_market"
							:step="1"
							step-strictly
							v-if="relation === 3"
							:min="1"
							size="mini"
						></el-input-number>
					</div>
				</span>
				<el-select
					v-model="relation"
					placeholder="Please select signal"
					@change="(val) => {changeRelation(val, true)}"
					size="mini"
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
		<div :class="{'single': relation == 1, 'risk-control': relation == 0}">
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
							:criteria="config['criteriaNum']"
							:panelIndex="index"
							:editableTabs="editableTabs"
							:editableTabsValue="editableTabsValue"
							ref="indiChild"
							:isRiskControl="relation == 0"
							@getIndicatorUrl="getIndicatorUrl"
							@getIndicatorVal="getIndicatorVal"
							@getIndicatorRadio="getIndicatorRadio"
							@getTechIndiObj="getTechIndiObj"
							@userUploadFileContent="userUploadFileContent"
							@getFreqArray="getFreqArray"
						></indicator>
						<senti
							v-bind="$attrs"
							:tabLength="indicatorRadioArr.length"
							:criteria="config['criteriaNum']"
							:panelIndex="index"
							:isRiskControl="relation == 0"
							ref="sentiChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:sentiUrl="indicatorUrlArr[index]"
							:sentiVal="indicatorValArr[index]"
							:indicatorRadio="indicatorRadioArr[index]"
							v-if="indicatorRadioArr[index] === 'sentiment' || indicatorRadioArr[index] === 'user'"
						></senti>
						<symbol-indi
							v-bind="$attrs"
							:tabLength="indicatorRadioArr.length"
							:criteria="config['criteriaNum']"
							:panelIndex="index"
							:isRiskControl="relation == 0"
							ref="symbolChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:symUrl="indicatorUrlArr[index]"
							:symVal="indicatorValArr[index]"
							v-if="
								indicatorRadioArr[index] === 'symbol' &&
								indicatorUrlArr[index] !== ''
							"
						></symbol-indi>
						<cci
							v-bind="$attrs"
							:tabLength="indicatorRadioArr.length"
							:isActived="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'CCI_like'
							"
							:panelIndex="index"
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="cciChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="macdChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="maChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="bollBandsLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="EFTLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="stochasticsLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="ADXLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="ERILikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="aligatorLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="LRFLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
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
							:isRiskControl="relation == 0"
							:criteria="config['criteriaNum']"
							ref="trailingStopLikeChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:isLimit="isUsePeriodLimit"
							:techUrl="indicatorUrlArr[index]"
							:techVal="indicatorValArr[index]"
							v-if="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Trailingstop_like'
							"
						></trailing-stop-like>
						<div class="empty-senti-container" v-if="(indicatorRadioArr[index] === 'technical' && !techIndiObj[index]) || (indicatorRadioArr[index] === 'symbol' &&
								indicatorUrlArr[index] == '')">
						</div>
						<div class="delay-bar-box">
							<el-checkbox v-model="isDelayBar" @change="(val) => {delay_bars = val ? 1 : 0}">
								<span>Delay of Bars </span>
								<el-tooltip
									effect="dark"
									placement="top"
									style="display: inline"
								>
									<span slot="content" v-html="config['DOBTP']">
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
  </div>
</template>

<script>
import senti from './signal/sentiment/Senti'
import symbol from './signal/sentiment/Symbol'
import cci from './signal/technical/Cci-like'
import macd from './signal/technical/Macd-like.vue'
import ma from './signal/technical/Ma.vue'
import indicator from './signal/indicator/indicator'
import bollingerBandsLike from './signal/technical/Bollinger-Bands-like.vue'
import ehlerFisherTransformLike from './signal/technical/Ehler-Fisher-Transform-like.vue'
import stochasticMomentumIndexLike from './signal/technical/Stochastic-Momentum-Index-like.vue'
import ADXorDMSLike from './signal/technical/ADXorDMS-like.vue'
import elderRayIndexLike from './signal/technical/Elder-Ray-Index-like.vue'
import alligatorLike from './signal/technical/Alligator-like.vue'
import linearRegForecastLike from './signal/technical/Linear-RegForecast-like.vue'
import trailingStopLike from './signal/technical/Trailing-Stops-like.vue'
import { eventBus } from "./EventBus/Bus.ts";
import { CIQ } from '@/components/common/chart/st-development/js'
import { mapMutations } from "vuex"
import {searchKeys, isJson, capitalizeFirstLetter} from '@/utils'
export default {
  name: 'Criteria',
  inheritAttrs: false,
  props: {
    config: Object,
		isRiskControl: Boolean,
		symbolInfo: Object
  },
  components: {
    indicator,
    senti,
    'symbol-indi': symbol,
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
  data() {
    return {
			editableTabsValue: '1',
			editableTabs: [
				{
					title: 'Condition 1',
					name: '1',
					content: 'Condition 1 content'
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
			freqArray: new Array(5).fill(''),
			// riskValArr: new Array(5).fill(''),
			delay_bars: 0,
			isDelayBar: false,
			relation: 0,
			isUsePeriodLimit: false,
			signalOptions: [
				{ value: 1, label: 'Single-Condition' },
				{ value: 2, label: 'SameBar Multi-Condition' },
				{ value: 3, label: 'TimeOrder Multi-Condition' }
			],
    }
  },
  computed: {
		criteriaCapFirstL() {
			/* Entry or Exit */
			return this.config['criteriaCapFirstL']
		},
		criteria() {
			/* entry or exit */
			return this.config['criteria']
		},
		criteriaNum() {
			return this.config['criteriaNum']
		},
		title() {
			return this.symbolInfo.strategy !== 'Dual'? '': `(${this.criteriaNum === 'entry' || this.criteriaNum === 'exit' ? this.symbolInfo.symbol : this.symbolInfo.symbol2})`
		}
	},
	watch: {
		isRiskControl: {
			handler(val) {
				this.showRiskControlOptions(val)
			},
			deep: true,
      immediate: true
		}
	},
	created() {
		/* 用于自动填充 user custom indicators file */
  	eventBus.$on(`userFileSelect`, this.userFileSelect)
		 // 在 created 钩子中根据 criteria 计算 relation 的初始值
		if (this.criteriaNum.startsWith('entry')) {
      this.relation = 1;
		} else if(this.criteriaNum.startsWith('exit') && this.symbolInfo.strategy === 'Dual') {
				this.relation = 1
		} else if(this.criteriaNum === 'exit' && this.symbolInfo.strategy === 'Single' && this.isRiskControl){
				this.relation = 0;
		} else if(this.criteriaNum === 'exit' && this.symbolInfo.strategy === 'Single' && !this.isRiskControl){
				this.relation = 1;
		} else if(this.criteriaNum === 'exit2' && this.symbolInfo.strategy === 'Single'){
				this.relation = 1;
		}
	},
	beforeDestroy() {
   eventBus.$off('userFileSelect', this.userFileSelect);
			this.clearSubComponent()
	},
	methods: {
		...mapMutations('form', ['setFrequencyArray']),
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			if (this.criteriaNum.startsWith('entry')) {
				this.relation = 1;
			} else if(this.criteriaNum.startsWith('exit') && this.symbolInfo.strategy === 'Dual') {
				this.relation = 1
			} else if(this.criteriaNum === 'exit' && this.symbolInfo.strategy === 'Single' && this.isRiskControl){
				this.relation = 0;
			} else if(this.criteriaNum === 'exit' && this.symbolInfo.strategy === 'Single' && !this.isRiskControl){
					this.relation = 1;
			} else if(this.criteriaNum === 'exit2' && this.symbolInfo.strategy === 'Single'){
					this.relation = 1;
			}
			this.clearSubComponent()
		},
		clearSubComponent() {
			// Reset data for all subcomponents
			this.indicatorRadioArr.forEach((_,i) => {if(this.$refs.indiChild && this.$refs.indiChild[i]) this.$refs.indiChild[i].clearForm()})
			const [sentimentSymbolRadio, technicalRadio, symbolRadio] = this.classifyIndicatorRadio(this.indicatorRadioArr)
			sentimentSymbolRadio.forEach((_, i) => {
				if(this.$refs.sentiChild && this.$refs.sentiChild[i]) this.$refs.sentiChild[i].clearForm()
			})
			const [groupedIndicators, categoryMap] = this.classifyTechIndiObj(this.techIndiObj)
			if(technicalRadio.length) {
				groupedIndicators.forEach(subArr => {
					const category = categoryMap[subArr[0]]
					subArr.forEach((_, i) => {
						if(this.$refs[category] && this.$refs[category][i])this.$refs[category][i].clearForm(data)
					})
				})
			}
			symbolRadio.forEach((_, i) => {
				if(this.$refs.symbolChild && this.$refs.symbolChild[i]) this.$refs.symbolChild[i].clearForm(data)
			})
		},
		classifyIndicatorRadio(indicatorRadioArr) {
			const sentimentSymbolRadio = indicatorRadioArr.filter(radio => radio === 'sentiment' || radio === 'user')
			const technicalRadio = indicatorRadioArr.filter(radio => radio === 'technical')
			const symbolRadio = indicatorRadioArr.filter(radio => radio === 'symbol')
			return [sentimentSymbolRadio, technicalRadio, symbolRadio]
		},
		classifyTechIndiObj(techIndiObj) {
			const _techIndiObj = techIndiObj.filter(val => val)
			const groupedIndicators = _techIndiObj.reduce((acc, curr) => {
					if (curr) { // 过滤掉空字符串
							const existingGroup = acc.find(group => group.includes(curr));
							if (existingGroup) {
									existingGroup.push(curr); // 如果已经存在包含当前元素的组，则添加到该组
							} else {
									acc.push([curr]); // 否则创建一个新组
							}
					}
					return acc;
			}, []);
			console.log(groupedIndicators);
			const categoryMap = {
				'CCI_like': 'cciChild',
				'MACD_like': 'macdChild',
				'EFT_like': 'EFTLikeChild',
				'BollingerBands_like': 'bollBandsLikeChild',
				'Stochastics_like': 'stochasticsLikeChild',
				'ERI_like': 'ERILikeChild',
				'ADX_like': 'ADXLikeChild',
				'MovingAverage_like': 'maChild',
				'Aligator_like': 'aligatorLikeChild',
				'LRF_like': 'LRFLikeChild',
				'Trailingstop_like': 'trailingStopLikeChild',
			}
			return [groupedIndicators, categoryMap]
		},
		showRiskControlOptions(val) {
			const originalOptions = [
				{ value: 1, label: 'Single-Condition' },
				{ value: 2, label: 'SameBar Multi-Condition' },
				{ value: 3, label: 'TimeOrder Multi-Condition' }
			];	

			this.signalOptions = val ? [...originalOptions, { value: 0, label: 'Only Use Risk Control' }] : originalOptions;

			if (!val && this.criteriaNum.startsWith('exit') && this.relation === 0) {
				this.relation = 1;
				this.changeRelation(this.relation,false);
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
						title: 'Condition' + newTabName,
						name: num_key + '',
						content: 'Condition' + newTabName + 'content'
					})
					this.editableTabsValue = Number(this.editableTabsValue) + 1 + ''
					this.indicatorRadioArr.push('sentiment')
				}
				if (this.editableTabs.length > 5 && this.relation == 2) {
					this.popUpMsgBox('Add up to five conditions')
					this.editableTabs.pop()
					this.indicatorRadioArr.pop()
					// this.editableTabsValue = this.editableTabs.length + ''
					this.editableTabsValue = '5'
					// this.tabIndex = this.editableTabs.length
					this.tabIndex = 5
				}
				if (this.relation == 3 && this.editableTabs.length > 4) {
					this.popUpMsgBox('Add up to four conditions')
					this.editableTabs.pop()
					this.indicatorRadioArr.pop()
					// this.editableTabsValue = this.editableTabs.length + ''
					this.editableTabsValue = '4'
					// this.tabIndex = this.editableTabs.length
					this.tabIndex = 4
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
					// At least two conditions
					this.popUpMsgBox('Multiple conditions are currently selected, at least two conditions')
					return
				}
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue
				let absoluteIndex = ''
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
					item.title = 'Condition' + (index + 1)
				})
				this.editableTabsValue = activeName

				this.indicatorValArr.splice(absoluteIndex, 1)
				this.indicatorValArr.push('')
				let removedSenti = this.indicatorUrlArr.splice(absoluteIndex, 1)
				this.indicatorUrlArr.push('')
				this.indicatorRadioArr.splice(absoluteIndex, 1)
				this.techIndiObj.splice(absoluteIndex, 1)
				this.techIndiObj.push('')
				this.freqArray.splice(absoluteIndex, 1)
				this.freqArray.push('')
				const freqObj = {
					index: absoluteIndex,
					value: 'Daily',
					criteria: this.criteriaNum,
					key: `${this.criteriaNum}_${absoluteIndex}`
				}
				this.setFrequencyArray(freqObj)
				if (
					this.relation == 2 &&
					this.score >= this.indicatorRadioArr.length + 1
				) {
					this.score = this.indicatorRadioArr.length
				}

				/**  Begin: 移除indicator附属ma */
				let removedUrl = CIQ.findBuiltinTechIndicator(this.indicatorValArr[absoluteIndex],null)?.url
				let activatedMAList = this.$store.state.chart.activatedMA
				let MAListIndex = activatedMAList.findIndex(
				(item) =>
					item.url == (removedUrl || removedSenti) &&
					item.criteria == this.criteriaNum &&
					item.index == absoluteIndex
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('chart/getMA', activatedMAList)
				/**  End */
				//When removing a tab, remove the corresponding indicator from vuex to refresh the status
				this.$store.commit(`chart/getIndicators`, {
					index: absoluteIndex,
					value: '',
					criteria:  this.criteriaNum
				})
				
				// 如果是MA，则移除它的信息和位置
				CIQ.removeMALayout(removedUrl, this.criteriaNum, absoluteIndex)

				// 移除chartiq对应的extraIndicators
				let extraIndicators = []
				extraIndicators.push(...this.$store.state.chart.indicators.extraIndicators)
				extraIndicators = extraIndicators.filter(x=>x!=removedSenti)
				this.$store.commit('chart/getExtraIndicators',extraIndicators)

				CIQ.addIndicators({})
			}
		},
		getIndicatorUrl(obj) {
			this.indicatorUrlArr.splice(obj.index, 1, obj.url)
		},
		getIndicatorVal(obj) {
			this.indicatorValArr.splice(obj.index, 1, obj.value)
		},
		getFreqArray(obj) {
			this.freqArray.splice(obj.index, 1, obj.value)
		},
		getIndicatorRadio(obj) {
			this.indicatorRadioArr.splice(obj.index, 1, obj.value)
		},
		saveScoreValue() {
			let obj = {}
			obj.criteria = this.criteriaNum
			if (this.relation == 1 || this.relation == 3 || this.relation == 0) {
				obj.value = 1
			}
			if (this.relation == 2) {
				obj.value = this.score
			}
			this.$store.commit('form/saveScoreValue', obj)
		},
		saveSignalsInMarket() {
			let obj = {}
			obj.criteria = this.criteriaNum
			if (this.relation == 1 || this.relation == 2 || this.relation == 0) {
				obj.value = 1
			}
			if (this.relation == 3 && this.isUsePeriodLimit) {
				obj.value = this.signals_in_market
			}else if(this.relation == 3 && !this.isUsePeriodLimit) {
				obj.value = 100000
			}
			this.$store.commit('form/saveSignalsInMarket', obj)
		},
		saveDelayBar() {
			let obj = {}
			obj.criteria = this.criteriaNum
			const isRiskControl = this.relation == 0
			// Do not select isdelaybar
			if (!this.isDelayBar) {
				obj.value = 0
			}
			// Choose delaybar instead of only risk
			if (this.isDelayBar && !isRiskControl) {
				obj.value = this.delay_bars
			}
			// Select delaybar and only risk
			if (this.isDelayBar && isRiskControl) {
				obj.value = 0
			}
			this.$store.commit('form/saveDelayBar', obj)
		},
		saveRelation() {
			let obj = {}
			obj.criteria = this.criteriaNum
			obj.value = this.relation
			// if (this.indicatorRadioArr.length > 1) {
			// 	obj.value = this.relation
			// }
			// if (this.indicatorRadioArr.length == 1) {
			// 	obj.value = 1
			// }
			// if (this.indicatorRadioArr.length == 0) {
			// 	obj.value = 0
			// }

			this.$store.commit('form/saveRelation', obj)
		},
		changePeriodLimit(val) {
			this.isUsePeriodLimit = val
			if(this.signals_in_market == 100000) {
				this.signals_in_market = this.editableTabs.length
			}
		},
		/**
		 * 
		 * @param {*} val 
		 * @param {*} toUpdateChart changeRelation可能是下拉栏主动触发来修改single,multi,risk control类型，或者edit后触发，这里判断edit情况下不会像前者一样更新图表
		 */
		changeRelation(val, toUpdateChart) {
			if (val == 1) {
				// single-condition， 只保留第一个condition
				this.editableTabsValue = '1'
				this.editableTabs = [
				{
					title: 'Condition 1',
					name: '1',
					content: 'Condition 1 content'
				}
				]
				this.score = 1
				this.signals_in_market = 1

				// 移除chartiq对应的extraIndicators
				let extraIndicators = []
				extraIndicators.push(...this.$store.state.chart.indicators.extraIndicators)
				extraIndicators = extraIndicators.filter(x=>this.indicatorUrlArr.slice(1,5).indexOf(x)==-1)
				this.$store.commit('chart/getExtraIndicators',extraIndicators)

				// 移除	indicatorSentiArr
				const indiUrl = this.indicatorUrlArr[0]
				const indiVal = this.indicatorValArr[0]
				const indiRadio = this.indicatorRadioArr[0]
				const freqVal = this.freqArray[0]
				this.indicatorUrlArr = [indiUrl, ...(new Array(4).fill(''))]
				this.indicatorValArr = [indiVal, ...(new Array(4).fill(''))]
				this.indicatorRadioArr = [indiRadio]
				this.freqArray = [freqVal, ...(new Array(4).fill(''))]
				// 移除	indicatorTechArr
				const techObj = this.techIndiObj[0]
				this.techIndiObj = [techObj, ...(new Array(4).fill(''))]

				// 设定频率
				const freqObj = {
					index: 0,
					value: freqVal,
					criteria: this.criteriaNum,
					key: `${this.criteriaNum}_0`,
					relation: this.relation
				}
				try {
					this.setFrequencyArray(freqObj)
					for (let index = 1; index < this.indicatorUrlArr.length; index++) {
					this.$refs.indiChild[index]?.resetIndicator()
				}
				} catch (error) {
					console.log(error)
				}

				if(!toUpdateChart) return
				//When only keep the first tab, update the vuex status
				// 移除senti indicator附属ma
				let activatedMAList = this.$store.state.chart.activatedMA
				activatedMAList = activatedMAList.filter((item)=>
					item.criteria == this.criteriaNum &&
					item.index == 0
				)
				this.$store.commit('chart/getMA', activatedMAList)
				let indicatorList = this.$store.state.chart.indicators.formIndicators[this.criteriaNum]
				this.$store.commit(`chart/getCriteriaIndicatorsList`, {criteria: this.criteriaNum, list: [indicatorList[0], ...(new Array(4).fill(''))]})
				
				// 如果第一个是MA，则只保留第一个选项卡的的信息和位置
				CIQ.keepTheFirstMALayout(this.criteriaNum)

				CIQ.addIndicators({})
			}
			if (val == 2 || val == 3) {
				if (this.editableTabs.length <= 1) {
					this.handleTabsEdit(null, 'add')
					for (let i = 0; i < 2 - this.editableTabs.length; i++) {
						this.handleTabsEdit(null, 'add')
					}
					this.editableTabsValue = '1'
				}
				if (val == 2) {
					this.score = 2
				}
				if (val == 3) {
					this.signals_in_market = 2
				}
			}
			
			if(val == 0) {
					// only-risk-control， 移除所有退场condition

					// 移除chartiq对应的extraIndicators
					let extraIndicators = []
					extraIndicators.push(...this.$store.state.chart.indicators.extraIndicators)
					extraIndicators = extraIndicators.filter(x=>this.indicatorUrlArr.indexOf(x)==-1)
					this.$store.commit('chart/getExtraIndicators',extraIndicators)

					this.score = 1
					this.signals_in_market = 1
					this.delay_bars = 0
					this.editableTabs = [
					]

					this.indicatorUrlArr = new Array(5).fill('')
					this.indicatorValArr = new Array(5).fill('')
					this.indicatorRadioArr = ['sentiment']
					this.techIndiObj = new Array(5).fill('')
					const freqObj = {
						index: 0,
						value: 'Daily',
						criteria: this.criteriaNum,
						key: `${this.criteriaNum}_0`,
						relation: 0
					}
					try {
							this.setFrequencyArray(freqObj)
							for (let index = 0; index < this.indicatorUrlArr.length; index++) {
								this.$refs.indiChild[index]?.resetIndicator()
							}
					} catch (error) {
						console.log(error)
					}

					if(!toUpdateChart) return
					//When removing the exit criteria, update the vuex status
					// 移除senti indicator附属ma
					const oppositeCriteria = this.criteriaNum.startsWith('entry') ? (this.criteriaNum === 'entry' ? 'exit' : 'exit2') : this.criteriaNum
					let activatedMAList = this.$store.state.chart.activatedMA
					activatedMAList = activatedMAList.filter((item)=>
						item.criteria == oppositeCriteria
					)
					this.$store.commit('chart/getMA', activatedMAList)

					this.$store.commit(`chart/getCriteriaIndicatorsList`, {criteria: this.criteriaNum,list:[]})

					// 如果第一个是MA，则只保留第一个选项卡的的信息和位置
					CIQ.removeExitMALayout()

					CIQ.addIndicators({})
				}
			this.$store.commit(`form/clearSignalArr`, {criteria: this.criteriaNum})
			this.$store.commit('form/saveRelation', {
				criteria: this.criteriaNum,
				value: this.relation
			})
		},
		addSignalLength() {
			if (this.relation == 2 || this.relation == 3) {
				const filterValArr = this.indicatorValArr.filter(item => item != '')
				for (let i = 0; i < filterValArr.length; i++) {
					// Apply for space
					let obj = {}
					obj.criteria = this.criteriaNum
					obj.index = i
					this.$store.commit('form/addSignalLength', obj)
				}
				return filterValArr.length
			}
			if (this.relation == 1 || this.relation == 0) {
				return 1
			}
		},
		isSameSignal() {
			const description = this.$store.state.form.backtestInfo[`${this.criteriaNum}_description`]
			if (isJson(description)) {
					description = JSON.parse(vm.$store.state.form.backtestInfo.description)
   }
			debugger
			let sameSignalArr = searchKeys(description)
			if(this.relation == 3) sameSignalArr = []
			if(sameSignalArr.length >= 1) {
				for (let j = 0; j < sameSignalArr.length; j++) {
					let sameItem = []
					let str = ''
					sameItem = sameSignalArr[j].split(',')
					for (let n = 0; n < sameItem.length; n++) {
						str += 'Condition' + Number(sameItem[n]) + ' '
					}
					this.popUpMsgBox(`The current ${capitalizeFirstLetter(this.criteriaNum)} ${str} are the same, please change`)
					return false
        	}
			}
			return true
		},
		async saveData() {
			// Save the selected indicator to vuex
			debugger
			let indiChecked
			if (this.relation == 0) {
				// Save risk description
				let desObj = {
					index: 0,
					criteria: this.criteriaNum,
					description: {
						'commentDes':this.$store.state.form.riskDescription,
						'rocCond':null
					}
				}
				this.$store.commit('form/saveDescription', desObj)
				return true
			}
			for (let i = 0; i < this.indicatorRadioArr.length; i++) {
				const indi = this.$refs.indiChild[i].saveIndicator(i)
				indiChecked = await indi
				if(!indiChecked) return 
			}
			const [sentimentSymbolRadio, technicalRadio, symbolRadio] = this.classifyIndicatorRadio(this.indicatorRadioArr)
			for (let i = 0; i < sentimentSymbolRadio.length; i++) {
				this.$refs.sentiChild[i].setDesciption()
				let senti = this.$refs.sentiChild[i].saveCondition()
				if (!senti) return
			}
			const [groupedIndicators, categoryMap] = this.classifyTechIndiObj(this.techIndiObj)
			if(technicalRadio.length) {
				for (let i = 0; i < groupedIndicators.length; i++) {
					const subArr = groupedIndicators[i]
					const category = categoryMap[subArr[0]]
					const techChecked = subArr.find((_, i) => {
						this.$refs[category][i].setDesciption()
						let saveChecked = this.$refs[category][i].saveCondition()
						if (!saveChecked) return true
					})
					if(techChecked) return
			}
			}
			for (let i = 0; i < symbolRadio.length; i++) {
				this.$refs.symbolChild[i].setDesciption()
				let saveChecked = this.$refs.symbolChild[i].saveCondition()
				if (!saveChecked) return
			}
			return true
		},
		setEditPanel(num, data) {
			let criteria = this.criteriaNum
			this.relation = data[criteria].relation ? data[criteria].relation : 1

			for (let i = 0; i < num - 1; i++) {
				this.handleTabsEdit(null, 'add')
			}
			this.refs = data
			this.score = data[criteria].score
			this.delay_bars = data[criteria].delay_bars ? data[criteria].delay_bars : 0
			if (this.delay_bars != 0) {
				this.isDelayBar = true
			} else {
				this.isDelayBar = false
			}
			this.signals_in_market = data[criteria].signals_in_market
				? data[criteria].signals_in_market
				: 1
			this.isUsePeriodLimit = Boolean(data[criteria].signals_in_market != 100000)
			let length = data[criteria].signals.length
			this.tabIndex = length
			for (let j = 0; j < length; j++) {
				if (data[criteria].signals[j].analysis === 'Sentiment') {
					this.indicatorValArr[j] = data[criteria].signals[j].indicator
					this.indicatorRadioArr.splice(j, 1, 'sentiment')
					this.indicatorRadio = 'sentiment'
					this.techIndiObj[j] = ''
				}
				else if (data[criteria].signals[j].analysis === 'User') {
					this.indicatorValArr[j] = data[criteria].signals[j].indicator
					this.indicatorRadioArr.splice(j, 1, 'user')
					this.indicatorRadio = 'user'
					this.techIndiObj[j] = ''
				}
				else if (data[criteria].signals[j].analysis === 'Symbol') {
					this.indicatorValArr[j] = data[criteria].signals[j].indicator
					this.indicatorRadioArr.splice(j, 1, 'symbol')
					this.indicatorRadio = 'symbol'
					this.techIndiObj[j] = ''
				}
				else if (data[criteria].signals[j].analysis === 'Technical') {
					this.indicatorValArr[j] = data[criteria].signals[j].indicator
					this.indicatorRadio = 'technical'
					this.indicatorRadioArr.splice(j, 1, 'technical')
					
					this.techIndiObj[j] = CIQ.findBuiltinTechIndicator(data[criteria].signals[j].indicator,null)?.class
				}
			}
			console.log('techIndiObj', this.techIndiObj)
			// 先把 indicatorUrl 设置好 但是唯独 user indicator 没办法设置
			data[criteria].signals.forEach((signal, i) => {
				if(signal.analysis !== 'User') this.indicatorUrlArr.splice(i, 1, signal.indicator)
			})
			this.$nextTick(() => {
				this.setEditData(this.refs)
			})
		},
		setEditData(data) {
			let criteria = this.criteriaNum
			let length = data[criteria].signals.length
			for (let j = 0; j < length; j++) {this.$refs.indiChild[j].setEditData(data)}
			// classification radio button
			const [sentimentSymbolRadio, technicalRadio, symbolRadio] = this.classifyIndicatorRadio(this.indicatorRadioArr)
			sentimentSymbolRadio.forEach((_, i) => {
				this.$refs.sentiChild[i].setEditData(data)
			})
			const [groupedIndicators, categoryMap] = this.classifyTechIndiObj(this.techIndiObj)
			if(technicalRadio.length) {
				groupedIndicators.forEach(subArr => {
					const category = categoryMap[subArr[0]]
					subArr.forEach((_, i) => {
						this.$refs[category][i].setEditData(data)
					})
				})
			}
			symbolRadio.forEach((_, i) => {
				this.$refs.symbolChild[i].setEditData(data)
			})
		},
		setRiskEditData(data) {
			this.relation = 0
			this.exitItemCheck = true
			this.signalOptions = [
				{
					value: 1,
					label: 'Single-Condition'
				},
				{
					value: 2,
					label: 'SameBar Multi-Condition'
				},
				{
					value: 3,
					label: 'TimeOrder Multi-Condition'
				},
				{
					value: 0,
					label: 'Only Use Risk Control'
				}
			]
		},
		async userUploadFileContent(data) {
			let _this = this
			await _this.$refs.indiChild[data.index].changeIndicatorChecked("Users' Own Indicator")
			await _this.$refs.indiChild[data.index].handleUsersOwnIndicatorSelect(data.val.data)
			await _this.$refs.indiChild[data.index].autoFillUserIndicator(data.val.data)
			const oppositeCriteria = capitalizeFirstLetter(_this.criteriaNum.startsWith('entry') ? (this.criteriaNum === 'entry' ? 'exit' : 'exit2') : this.criteriaNum)
			const fileHash = _this.$store.state.form[`usersOwn${oppositeCriteria}FileHash`][data.index]
			console.log(`判断 ${oppositeCriteria} 有没有填充的值`, fileHash)
			if(fileHash == '' || fileHash == 'HASH') eventBus.$emit(`userFileSelect`, data)
		},
		async userFileSelect(data) {
			let _this = this
			if(_this.indicatorRadioArr[data.index] !== 'user') return
			await _this.$refs.indiChild[data.index].changeIndicatorChecked("Users' Own Indicator")
			await _this.$refs.indiChild[data.index].handleUsersOwnIndicatorSelect(data.val.data)
			await _this.$refs.indiChild[data.index].autoFillUserIndicator(data.val.data)
		},
		
	}
}
</script>

<style lang="less" scoped>
.criteria-title {
	font-size: 16px;
	font-weight: bold;
	margin-right: 5px;
	display: inline-block;
	margin: 0;
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
// .criteria-box {
// 	// margin-left: 40px;
// 	margin-bottom: 10px;
// 	flex: 1;
// }

// @media (min-width: 1280px) and (max-width: 1365px) {
// 	.criteria-box {
// 		margin: 0px 10px 10px 10px;
// 	}
// }
// @media (min-width: 820px) and (max-width: 1279px) {
// 	.criteria-box {
// 		margin: 0px 40px 10px 40px;
// 		border-bottom: 1px solid #797979;
// 	}
// }
// @media (min-width: 768px) and (max-width: 819px) {
// 	.criteria-box {
// 		margin: 0px 40px 10px 40px;
// 		border-bottom: 1px solid #797979;
// 	}
// }
// @media (min-width: 375px) and (max-width: 767px) {
// 	.criteria-box {
// 		border-bottom: 1px solid #797979;
// 	}
// 	.criteria-box {
// 		margin: 0px 0px 10px 0px;
// 	}
// 	.criteria-title {
// 		font-size: 15px;
// 	}
// }
.signal-option-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 5px;
}
.signal-container {
	display: flex;
	justify-content: center;
	align-items: center;
}
.scoreNote {
	font-size: 16px;
	font-weight: 500;
	margin-right: 5px;
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
/deep/ .single .multi-box .el-tabs--card > .el-tabs__header {
		opacity: 0;
}
.risk-control {
	display: none;
}
/deep/.el-tabs__nav .el-tabs__item:nth-child(1) span {
	display: none;
}
/deep/ .el-input-number--mini {
	width: 118px;
}
.delay-bar-box /deep/ label.el-checkbox {
	width: 146px;
}
.timeLimitBox{
	position: relative;
}
.period-box{
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 10;
}
.el-select-dropdown__item {
	padding: 0 5px;
} 
.el-select-dropdown__item:hover {
	padding: 0 5px;
	border-radius: 0px;
	margin: 0px;
} 
</style>