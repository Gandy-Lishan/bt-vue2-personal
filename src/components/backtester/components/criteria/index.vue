<template>
  <div>
	<div class="criteria-box">
		<div class="signal-option-box">
			<div class="entry-title-box">
				<p class="criteria-title">{{config['criteriaTitle']}}</p>
				<el-tooltip effect="dark" placement="top" style="diaplay: inline">
					<span slot="content">
            {{config['criteriaTitleTP']}}
          </span>
					<i class="iconfont icon-wenhao"></i>
				</el-tooltip>
			</div>
			<div class="signal-container">
				<span class="scoreNote" v-if="relation === 2">
					<span>Score: </span>
					<el-tooltip effect="dark" placement="top" style="diaplay: inline">
						<span slot="content">
              {{config['scoreTP']}}
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
				<span class="scoreNote" v-if="relation === 3">
					<span>Period: </span>
					<el-tooltip effect="dark" placement="top" style="diaplay: inline">
						<span slot="content">
              {{config['periodTP']}}
						</span>
						<i class="iconfont icon-wenhao"></i>
					</el-tooltip>
				</span>
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
					placeholder="Please select signal"
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
							:criteria="config['criteria']"
							:panelIndex="index"
							:editableTabs="editableTabs"
							:editableTabsValue="editableTabsValue"
							ref="indiChild"
							:exitItemCheck="exitItemCheck"
							@getIndicatorUrl="getIndicatorUrl"
							@getIndicatorVal="getIndicatorVal"
							@getIndicatorRadio="getIndicatorRadio"
							@getTechIndiObj="getTechIndiObj"
							@entryUserUploadFileContent="entryUserUploadFileContent"
							@getFreqArray="getFreqArray"
						></indicator>
						<senti
							v-bind="$attrs"
							:tabLength="indicatorRadioArr.length"
							:criteria="config['criteria']"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							ref="sentiChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:sentiUrl="indicatorUrlArr[index]"
							:sentiVal="indicatorValArr[index]"
							:indicatorRadio="indicatorRadioArr[index]"
							v-show="indicatorRadioArr[index] === 'sentiment' || indicatorRadioArr[index] === 'user'"
						></senti>
						<symbol-indi
							v-bind="$attrs"
							:tabLength="indicatorRadioArr.length"
							:criteria="config['criteria']"
							:panelIndex="index"
							:exitItemCheck="exitItemCheck"
							ref="symbolChild"
							:relation="relation"
							:score="score"
							:delay_bars="delay_bars"
							:period="signals_in_market"
							:symUrl="indicatorUrlArr[index]"
							:symVal="indicatorValArr[index]"
							v-show="
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
							:exitItemCheck="exitItemCheck"
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
							:criteria="config['criteria']"
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
									<span slot="content">
                    {{config['DOBTP']}}
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
import SignalCode from '@/tools/codeTool.js'
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
export default {
  name: 'Criteria',
  inheritAttrs: false,
  props: {
    config: Object
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
      indicatorRadio: 'sentiment',
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
			techVal: '',
			delay_bars: 0,
			isDelayBar: false
    }
  },
  computed: {
    signalOptions() {
      const options =  [
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
				}
			]
      if (!this.exitCheck) {
        return options // 如果 exitCheck 为 true，则返回原始选项
      } else {
        // 如果 exitCheck 为 false，则返回修改后的选项
        return [
          {
              value: 0,
              label: 'Only Use Risk Control'
          },
          ...options // 保留原始选项中的部分
        ];
      }
    },
    relation() {
      
      // return this.config['criteria'] == 'entry' ? 1 : 0
      return this.config['criteria'] == 'entry' ? 1 : 1
    },
    exitItemCheck() {
      // return this.config['criteria'] == 'entry' ? false : true
      return this.config['criteria'] == 'entry' ? false : false
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
.delay-bar-box {
	display: flex;
	border-top: 1px solid #797979;
	padding-top: 10px;
}
/deep/ .el-input-number--mini {
	width: 118px;
}
</style>