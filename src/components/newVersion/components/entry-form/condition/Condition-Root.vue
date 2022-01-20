<template>
	<div class="condition-form">
		<!-- signal-dialog -->
		<signal-dialog
			:dialogTableVisible="dialogTableVisible"
			@openSignalDialog="openSignalDialog"
			:tabIndex="tabIndex"
			:criteria="criteria"
		></signal-dialog>
		<el-form label-position="left">
			<div class="signalIndicatorBox">
				<div class="indicatorBox">
					<div>
						<h2 class="note">Signal Indicator</h2>
						<el-tooltip
							class="item"
							effect="dark"
							content="Signal Indicator"
							placement="bottom-start"
							><i class="iconfont icon-tishi"></i
						></el-tooltip>
					</div>
					<!-- sentiment indicator part -->
					<indicator-part
						@getIndicatorRadio="getIndicatorRadio"
						@getTechIndiValue="getTechIndiValue"
						@clearTechIndiValue="clearTechIndiValue"
						:indicatorEditData="indicatorEditData"
						@getSentiVal="getSentiVal"
						@getTechVal="getTechVal"
						@getSentiUrl="getSentiUrl"
						:tabIndex="tabIndex"
						:criteria="criteria"
						ref="indicatorPart"
					></indicator-part>
				</div>
				<!--sentiment default setting-->
				<con-default
					v-if="indicatorRadio === 'sentiment'"
					:tabIndex="tabIndex"
					:sentiUrl="sentiUrl"
					:criteria="criteria"
					:idsLoad="idsLoad"
					:editIds="editIds"
				></con-default>
				<!-- technical default setting-->
				<!-- cci -->
				<cci-default
					v-if="indicatorRadio === 'technical' && techIndiValue === 'cci'"
					:tabIndex="tabIndex"
					:idsLoad="idsLoad"
					:criteria="criteria"
					:editIds="editIds"
				></cci-default>
				<!-- ma -->
				<ma-default
					v-if="indicatorRadio === 'technical' && techIndiValue === 'ma'"
					:tabIndex="tabIndex"
					:editIds="editIds"
					:criteria="criteria"
				></ma-default>
				<!-- macd -->
				<macd-default
					v-if="indicatorRadio === 'technical' && techIndiValue === 'macd'"
					:tabIndex="tabIndex"
					:idsLoad="idsLoad"
					:criteria="criteria"
					:editIds="editIds"
				></macd-default>
				<!-- rsi -->
				<rsi-default
					v-if="indicatorRadio === 'technical' && techIndiValue === 'rsi'"
					:tabIndex="tabIndex"
					:scLoad="scLoad"
					:idsLoad="idsLoad"
					:criteria="criteria"
					:editIds="editIds"
				></rsi-default>
			</div>
			<!-- sentiment condition form -->
			<condition-form
				v-if="indicatorRadio === 'sentiment'"
				:sentiVal="sentiVal"
				:tabIndex="tabIndex"
				:scLoad="scLoad"
				:criteria="criteria"
			></condition-form>
			<!-- technical cci condition form -->
			<cci-condition-form
				v-if="indicatorRadio === 'technical' && techIndiValue === 'cci'"
				:tabIndex="tabIndex"
				:techVal="techVal"
				:criteria="criteria"
				:scLoad="scLoad"
			></cci-condition-form>
			<!-- ma -->
			<ma-condition-form
				v-if="indicatorRadio === 'technical' && techIndiValue === 'ma'"
				:techVal="techVal"
				:tabIndex="tabIndex"
				:criteria="criteria"
				:scLoad="scLoad"
			></ma-condition-form>
			<!-- macd -->
			<macd-condition-form
				v-if="indicatorRadio === 'technical' && techIndiValue === 'macd'"
				:techVal="techVal"
				:tabIndex="tabIndex"
				:scLoad="scLoad"
				:criteria="criteria"
			></macd-condition-form>
			<!-- rsi -->
			<rsi-condition-form
				v-if="indicatorRadio === 'technical' && techIndiValue === 'rsi'"
				:tabIndex="tabIndex"
				:criteria="criteria"
				:techVal="techVal"
				:scLoad="scLoad"
			></rsi-condition-form>
			<!-- <div class="btnBox">
				<el-button round @click="saveSignal"
					>Save Signal for Future Use</el-button
				>
				<el-button round @click="openSignalDialog"
					>Load Signal From Databse</el-button
				>
			</div> -->
		</el-form>
	</div>
</template>
<script>
import indicatorPart from './Indicator-Part.vue'
import conditionForm from './Condition-Form.vue'
import conDefault from './indicator-default-setting/Con-default.vue'
import cciDefault from './indicator-default-setting/Cci-defaullt.vue'
import cciConditionForm from './technical/Cci-Condition-Form.vue'
import maDefault from './indicator-default-setting/Ma-default.vue'
import maConditionForm from './technical/Ma-Condition-Form.vue'
import macdDefault from './indicator-default-setting/Macd-default.vue'
import macdConditionForm from './technical/Macd-Condition-Form.vue'
import rsiDefault from './indicator-default-setting/Rsi-default.vue'
import rsiConditionForm from './technical/Rsi-Condition-Form.vue'
import signalDialog from './signallist/Signal-Dialog.vue'
import deepClone1 from '@/tools/deepClone.js'
import Base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import SignalCode from '@/tools/codeTool.js'
import { Store, mapGetters } from 'vuex'
import loginFormateVue from '@/loginFormate.vue'
export default {
	extends: Base,
	data() {
		return {
			indicatorRadio: 'sentiment',
			sentimentIndicator: '',
			technicalIndicator: '',
			techIndiValue: '',
			dialogTableVisible: false,
			idsLoad: {},
			scLoad: {},
			sentiVal: '',
			techVal: '',
			indicatorEditData: {},
			editIds: {},
			sentiUrl: '',
			techUrl: ''
		}
	},
	inject: ['editBacktestData'],
	mounted() {
		this.$cookies.set('userid', 'test')
	},
	computed: {
		...mapGetters(['getSignalDialogData', ' getIsClearForm']),
		signalDialogData() {
			return this.getSignalDialogData
		},
		getEditBacktestData() {
			return this.editBacktestData()
		}
	},
	watch: {
		isClearForm: {
			handler(newVal) {
				let init = deepClone1(this.$options.data())
				for (let key in init) {
					if (JSON.stringify(init[key]) == '{}') {
						delete init[key]
					}
				}
				Object.assign(this.$data, init)
				console.log('conditionRott', Object.assign(this.$data, init))
			}
		},
		signalDialogData: {
			handler(newVal) {
				if (
					JSON.stringify(newVal) !== '{}' &&
					newVal.criteria == this.criteria
				) {
					console.log('判断', this.criteria)
					const fd = {}
					let vm = this
					fd.description = newVal.description
					fd.direction = newVal.direction
					fd.frequency = newVal.frequency
					fd.criteria = newVal.criteria
					this.$store.commit('setSignalDialogFd', fd)
					this.idsLoad = newVal.code.ids
					this.scLoad = newVal.code.sc
					if (newVal.code.analysis === 'Technical') {
						this.indicatorRadio = 'technical'
						let setObj = {}
						setObj.radio = 'Technical Indicators'
						setObj.technicalIndicator = newVal.code.indicator
						setObj.criteria = this.criteria
						setObj.index = this.tabIndex
						this.$refs.indicatorPart.setIndicatorRadio(setObj)
						const arr = [
							{ label: 'Moving Average', value: 'ma' },
							{ label: 'MACD', value: 'macd' },
							{ label: 'Commodity Channel Index', value: 'cci' },
							{ label: 'Relative Strength Index', value: 'rsi' }
						]
						arr.forEach((item) => {
							if (item.label === newVal.code.indicator) {
								this.techIndiValue = item.value
							}
						})
					} else if (newVal.code.analysis === 'Sentiment') {
						this.indicatorRadio = 'sentiment'
						let sentiObj = {}
						sentiObj.radio = 'Sentiment Indicators'
						sentiObj.sentimentIndicator = newVal.code.indicator
						sentiObj.criteria = this.criteria
						sentiObj.index = this.tabIndex
						vm.$refs.indicatorPart.setIndicatorRadio(sentiObj)
					}
				}
			},

			immediate: true,
			deep: true
		},
		getEditBacktestData: {
			handler(newVal) {
				if (newVal.entry.direction) {
					this.indicatorEditData = {}
					var signalCode = new SignalCode()
					var code = ''
					const data = newVal[this.criteria]['signals']
					if (data instanceof Array) {
						code = data[this.tabIndex]['code']
					}
					code = signalCode.decode(code)
					// this.idsLoad = code.ids

					if (!code.ids) {
						code.ids = {}
					}
					this.editIds = code.ids
					this.scLoad = code.sc
					if (code.analysis === 'Sentiment') {
						this.sentimentIndicator = code.indicator
						this.indicatorEditData.sentimentIndicator = code.indicator
						this.indicatorRadio = 'sentiment'
						this.sentiVal = code.indicator
					} else if (code.analysis === 'Technical') {
						const arr = [
							['Moving Average', 'ma'],
							['MACD', 'macd'],
							['Commodity Channel Index', 'cci'],
							['Relative Strength Index', 'rsi']
						]
						let indicatorMap = new Map(arr)
						for (let [key, value] of indicatorMap) {
							if (code.indicator === key) {
								this.techIndiValue = value
							}
						}
						this.technicalIndicator = code.indicator
						this.indicatorRadio = 'technical'
						this.techVal = code.indicator
						this.indicatorEditData.technicalIndicator = code.indicator
					}
				}
			},
			immediate: true,
			deep: true
		}
	},
	components: {
		'indicator-part': indicatorPart,
		'condition-form': conditionForm,
		'con-default': conDefault,
		'cci-default': cciDefault,
		'cci-condition-form': cciConditionForm,
		'ma-default': maDefault,
		'ma-condition-form': maConditionForm,
		'macd-default': macdDefault,
		'macd-condition-form': macdConditionForm,
		'rsi-default': rsiDefault,
		'rsi-condition-form': rsiConditionForm,
		'signal-dialog': signalDialog
	},
	methods: {
		getIndicatorRadio(val) {
			this.indicatorRadio = val
			console.log(this.indicatorRadio)
		},
		getTechIndiValue(val) {
			this.techIndiValue = val
		},
		clearTechIndiValue() {
			if (this.techIndiValue) {
				this.techIndiValue = ''
			}
		},
		openSignalDialog() {
			this.dialogTableVisible = !this.dialogTableVisible
		},
		saveBacktest() {
			console.log('save data', this.$store.state.backtestInfo)
			console.log('save entry', this.$store.state.backtestInfo.entry)
			const signalList = this.$store.state.backtestInfo.entry.signals
			const signalObj = []
			signalList.forEach((item) => {
				if (item.sentimentIndicator) {
					item.indicator = item.sentimentIndicator
					item.analysis = 'Sentiment'
					delete item.technicalIndicator
					delete item.sentimentIndicator
				}
				if (item.technicalIndicator) {
					item.indicator = item.technicalIndicator
					item.analysis = 'Technical'
					delete item.technicalIndicator
					delete item.sentimentIndicator
				}
			})
			const b = new SignalCode()
			for (var i in signalList) {
				b.encode(signalList[i])
				console.log(b.encode(signalList[i]))
			}
			console.log('解码')
		},
		getSentiVal(val) {
			this.sentiVal = val
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			obj.value = val
			this.$store.commit('getSentiValue', obj)
		},
		getTechVal(val) {
			this.techVal = val
			const obj = {}
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			obj.value = val
			this.$store.commit('getTechValue', obj)
		},
		getSentiUrl(val) {
			this.sentiUrl = val
		},
		saveSignal() {
			const a = new SignalCode()
			const obj = this.$store.state.backtestInfo[this.criteria]
			const signalList = this.$store.state.backtestInfo[this.criteria].signals
			signalList.forEach((item) => {
				if (item.sentimentIndicator) {
					item.indicator = item.sentimentIndicator
					item.analysis = 'Sentiment'
					delete item.technicalIndicator
					delete item.sentimentIndicator
				}
				if (item.technicalIndicator) {
					item.indicator = item.technicalIndicator
					item.analysis = 'Technical'
					delete item.technicalIndicator
					delete item.sentimentIndicator
				}
			})
			console.log('list', signalList)
			const params = {}
			params.description = obj.description
			params.direction = obj.direction
			params.frequency = obj.frequency
			let code = ''
			for (let key in signalList) {
				code = a.encode(signalList[key])
			}
			params.code = code
			console.log('save signal', params)
			const vm = this
			vm.$http
				.post('dev/signal/', vm.$qs.stringify(params), {
					withCredentials: true
				})
				.then((res) => {
					if (res.status === 201) {
						vm.$message.success('Save successfully')
					} else {
						vm.$message.error('Save failed')
					}
				})
		}
	}
}
</script>
<style lang="less" scoped>
.note {
	font-weight: 600;
	margin: 0px 0px 5px 0px;
	display: inline-block;
}
@media only screen and (min-width: 1600px) {
	.indicatorBox {
		flex: 1;
		border-right: 1px solid black;
		padding-right: 10px;
	}
	.sentimentConditionBox {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.sentimentConditionBox .el-radio {
		line-height: 35px;
	}
	.sentimentConditionBox .el-select .el-input {
		flex: 1;
	}
	.sentimentConditionBox .el-input {
		flex: 0.4;
		margin-left: 5px;
	}
	.sentimentConditionBox .sentimentConditionItem {
		display: flex;
		justify-content: flex-end;
	}
	.sentimentConditionBox .sentimentMABox {
		display: flex;
		justify-content: flex-end;
	}
	.sentimentConditionBox .sentimentMABox .el-input {
		flex: 1;
	}
	.sentimentConditionBox .sentimentMABox .el-input:first-child {
		margin-right: 5px;
	}
	.sentimentConditionBox .el-radio {
		margin-right: 2px;
	}
	.signalIndicatorBox {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid black;
		padding-bottom: 5px;
	}
	.signal-condition-box {
		padding-bottom: 10px;
		border-bottom: 1px solid black;
	}
	.extremumBox {
		display: flex;
		flex-direction: column;
		padding-top: 11px;
		margin-left: 10px;
		flex: 0.6;
	}

	.btnBox {
		display: flex;
		margin-top: 10px;
		justify-content: center;
		align-self: flex-end;
		flex-wrap: wrap;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.note {
		font-weight: 600;
		margin: 0px 0px 5px 0px;
		display: inline-block;
	}
	.indicatorBox {
		flex: 1;
	}
	.sentimentConditionBox {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.sentimentConditionBox .el-radio {
		line-height: 35px;
	}
	.sentimentConditionBox .el-select .el-input {
		flex: 1;
	}
	.sentimentConditionBox .el-input {
		flex: 0.4;
		margin-left: 5px;
	}
	.sentimentConditionBox .sentimentConditionItem {
		display: flex;
		justify-content: flex-end;
	}
	.sentimentConditionBox .sentimentMABox {
		display: flex;
		justify-content: flex-end;
	}
	.sentimentConditionBox .sentimentMABox .el-input {
		flex: 1;
	}
	.sentimentConditionBox .sentimentMABox .el-input:first-child {
		margin-right: 5px;
	}
	.sentimentConditionBox .el-radio {
		margin-right: 2px;
	}
	.signalIndicatorBox {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-bottom: 1px solid black;
		padding-bottom: 5px;
	}
	.signal-condition-box {
		padding-bottom: 10px;
		border-bottom: 1px solid black;
	}
	// .extremumBox .box{
	// 	display: flex;
	// 	flex-direction: row;
	// 	margin-left: 10px;
	// 	flex: 0.6;
	// }

	.btnBox {
		display: flex;
		margin-top: 10px;
		justify-content: center;
		align-self: flex-end;
		flex-wrap: wrap;
	}
}
@media (min-width: 768px) and(max-width:899px) {
	.signalIndicatorBox {
		border-bottom: 1px solid black;
	}
}
</style>