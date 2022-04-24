<template>
	<div class="entry-container">
		<div class="signal-option-box">
			<p class="criteria-title">Entry Criteria</p>
			sentiValArr: {{sentiValArr}}
			<div class="signal-container">
				<span class="scoreNote" v-if="signalValue === 1">score:</span>
				<el-input
					size="mini"
					v-if="signalValue === 1"
					v-model="scoreValue"
					type="number"
					step="1"
					min="1"
					:max="editableTabsValue"
				></el-input>
				<el-select v-model="signalValue" placeholder="Please select signal">
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
		<div :class="signalValue === 0 ? 'multi' : ''">
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
							:editableTabsValue = "editableTabsValue"
							ref="indiChild"
							@getSentiUrl="getSentiUrl"
							@getTechUrl="getTechUrl"
							@getSentiVal="getSentiVal"
							@getTechVal="getTechVal"
							@getTechIndiValue="getTechIndiValue"
							@getIndicatorRadio="getIndicatorRadio"
							@getTechIndiObj="getTechIndiObj"
						></indicator>
						<senti
							v-bind="$attrs"
							:criteria="'entry'"
							:panelIndex="index"
							ref="sentiChild"
							:sentiUrlArr = "sentiUrlArr"
							:sentiUrl="sentiUrlArr[index]"
							:sentiVal="sentiValArr[index]"
							v-show="indicatorRadioArr[index] === 'sentiment'"
						></senti>
						<cci
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="cciChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'CCI_like'
							"
						></cci>
						<rsi
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="rsiChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'rsi'
							"
						></rsi>
						<macd
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="macdChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'MACD_like'
							"
						></macd>
						<ma
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="maChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'MovingAverage_like'
							"
						></ma>
						<bollinger-bands-like
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="bollBandsLikeChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'BollingerBands_like'
							"
						></bollinger-bands-like>
						<ehler-fisher-transform-like
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="EFTLikeChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'EFT_like'
							"
						></ehler-fisher-transform-like>
						<stochastic-momentum-index-like
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="stochasticsLikeChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Stochastics_like'
							"
						></stochastic-momentum-index-like>
						<ADX-or-DMS-Like
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="ADXLikeChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'ADX_like'
							"
						></ADX-or-DMS-Like>
						<elder-ray-index-like
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="ERILikeChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'ERI_like'
							"
						></elder-ray-index-like>
						<alligator-like
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="aligatorLikeChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'Aligator_like'
							"
						></alligator-like>
						<linear-regForecast-like
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="LRFLikeChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiObj[index] === 'LRF_like'
							"
						></linear-regForecast-like>
						<trailing-stop-like
							v-bind="$attrs"
							:panelIndex="index"
							:criteria="'entry'"
							ref="trailingStopLikeChild"
							:techUrl="techUrlArr[index]"
							:techVal="techValArr[index]"
							v-show="
								indicatorRadioArr[index] === 'technical' &&
								techIndiValue[index] === 'Trailingstop_like'
							"
						></trailing-stop-like>
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
					value: 0,
					label: 'single-signal'
				},
				{
					value: 1,
					label: 'multi-signal'
				}
			],
			signalValue: 0,
			editableTabsValue: '1',
			editableTabs: [
				{
					title: 'Signal 1',
					name: '1',
					content: 'Signal 1 content'
				}
			],
			tabIndex: 1,
			scoreValue: 1,
			techIndiObj: [''],
			indicatorRadioArr: ['sentiment'],
			refs: {}, 
			sentiUrlArr: new Array(5).fill(''),
			techUrlArr: new Array(5).fill(''),
			sentiValArr: new Array(5).fill(''),
			techValArr: new Array(5).fill(''),
			techVal: ''
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
			console.log(targetName, action)
			if (action === 'add') {
				if (this.editableTabs.length < 5) {
					let newTabName = ++this.tabIndex + ''
					this.editableTabs.push({
						title: 'Signal' + newTabName,
						name: newTabName,
						content: 'Signal 1 content'
					})
					// let obj = {}
					// obj.criteria = 'entry'
					// this.$store.commit('addSignalLength', obj)
					// this.saveBacktestData()
					this.editableTabsValue = newTabName
					this.indicatorRadioArr.push('sentiment')
				} else {
					this.$message({
						message: 'Add up to five signals',
						type: 'error',
						offset: 300
					})
				}
			}
			if (action === 'remove') {
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue
				console.log('activeName', targetName)
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
				this.editableTabsValue = activeName
				this.sentiValArr.splice(targetName-1,1)
				this.sentiValArr.push('')
				this.techValArr.splice(targetName-1,1)
				this.techValArr.push('')
				this.indicatorRadioArr.splice(targetName - 1, 1)
				this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
			}
		},

		// getSentiUrl(val) {
		// 	//console.log('getSentiUrl',val)
		// 	this.sentiUrl = val
		// },
		getSentiUrl(obj) {
			this.sentiUrlArr.splice(obj.index, 1, obj.url)
		},
		getTechUrl(obj) {
			this.techUrlArr.splice(obj.index, 1, obj.url)
		},
		getSentiVal(obj) {
			this.sentiValArr.splice(obj.index, 1, obj.value)
		},
		getTechVal(obj) {
			this.techVal = obj.value
			this.techValArr.splice(obj.index, 1, obj.value)
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
			obj.value = this.scoreValue
			this.$store.commit('saveScoreValue', obj)
		},
		saveBacktestData(index) {
			let checked = true
			console.log('entry的保存执行了' + index + '次')
			let indi = this.$refs.indiChild[index].saveIndicator(index)
			// 按照 sentiment 以及不同的 technical 触发不同组件的保存事件
			return indi.then((val) => { 
				// 按照 sentiment 以及不同的 technical 触发不同组件的保存事件
				if (indi) {
				if (this.indicatorRadioArr[index] === 'sentiment') {
					this.$refs.sentiChild[index].setDesciption(index)
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
			for (let i = 0; i < num - 1; i++) {
				this.handleTabsEdit(null, 'add')
			}
			this.refs = data
			this.$nextTick(() => {
				console.log('当前的refs', this.$refs.indiChild)
				this.setEditData(this.refs)
			})
		},
		async setEditData(data) {
			console.log('编辑的entrydata', data)
			this.scoreValue = data.entry.score
			let length = data.entry.signals.length
			this.tabIndex = length
			if (length > 1) {
				this.signalValue = 1
			}
			for (let j = 0; j < length; j++) {
				console.log('函数执行了' + j + '次，共' + length + '次')
				this.$refs.indiChild[j].setEditData(data)
				if (data.entry.signals[j].analysis === 'Sentiment') {
					this.sentiValArr[j] = data.entry.signals[j].indicator
					this.indicatorRadioArr.splice(j, 1, 'sentiment')
					this.indicatorRadio = 'sentiment'
					this.$refs.sentiChild[j].setEditData(data)
					this.techIndiObj[j] = ''
				}
				if (data.entry.signals[j].analysis === 'Technical') {
					this.techValArr[j] = data.entry.signals[j].indicator
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
.scoreNote {
	font-size: 16px;
	font-weight: 500;
}
/deep/.el-tabs__nav .el-tabs__item:nth-child(1) span {
	display: none;
}
</style>