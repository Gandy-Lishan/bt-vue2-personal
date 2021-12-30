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
					<div><h2 class="note">Signal Indicator</h2></div>
					<!-- sentiment indicator part -->
					<indicator-part
						@getIndicatorRadio="getIndicatorRadio"
						@getTechIndiValue="getTechIndiValue"
						@clearTechIndiValue="clearTechIndiValue"
						@getSentiVal="getSentiVal"
						:tabIndex="tabIndex"
						:criteria="criteria"
						ref="indicatorPart"
					></indicator-part>
				</div>
				<!--sentiment default setting-->
				<con-default
					v-if="indicatorRadio === 'sentiment'"
					:tabIndex="tabIndex"
					:criteria="criteria"
					:idsLoad="idsLoad"
				></con-default>
				<!-- technical default setting-->
				<!-- cci -->
				<cci-default
					v-if="indicatorRadio === 'technical' && techIndiValue === 'CCI'"
					:tabIndex="tabIndex"
					:idsLoad="idsLoad"
					:criteria="criteria"
				></cci-default>
				<!-- ma -->
				<ma-default
					v-if="indicatorRadio === 'technical' && techIndiValue === 'MA'"
					:tabIndex="tabIndex"
					:idsLoad="idsLoad"
					:criteria="criteria"
				></ma-default>
				<!-- macd -->
				<macd-default
					v-if="indicatorRadio === 'technical' && techIndiValue === 'MACD'"
					:tabIndex="tabIndex"
					:idsLoad="idsLoad"
					:criteria="criteria"
				></macd-default>
				<!-- rsi -->
				<rsi-default
					v-if="indicatorRadio === 'technical' && techIndiValue === 'RSI'"
					:tabIndex="tabIndex"
				    :scLoad="scLoad"
					:idsLoad="idsLoad"
					:criteria="criteria"
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
				v-if="indicatorRadio === 'technical' && techIndiValue === 'CCI'"
				:tabIndex="tabIndex"
				:criteria="criteria"
				:scLoad="scLoad"
			></cci-condition-form>
			<!-- ma -->
			<ma-condition-form
				v-if="indicatorRadio === 'technical' && techIndiValue === 'MA'"
				:tabIndex="tabIndex"
				:criteria="criteria"
				:scLoad="scLoad"
			></ma-condition-form>
			<!-- macd -->
			<macd-condition-form
				v-if="indicatorRadio === 'technical' && techIndiValue === 'MACD'"
				:tabIndex="tabIndex"
				:scLoad="scLoad"
				:criteria="criteria"
			></macd-condition-form>
			<!-- rsi -->
			<rsi-condition-form
				v-if="indicatorRadio === 'technical' && techIndiValue === 'RSI'"
				:tabIndex="tabIndex"
				:criteria="criteria"
				:scLoad="scLoad"
			></rsi-condition-form>
			<div class="btnBox">
				<el-button round @click="saveSignal"
					>Save Signal for Future Use</el-button
				>
				<el-button round @click="openSignalDialog"
					>Load Signal for From Databse</el-button
				>
			</div>
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
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import SignalCode from '@/tools/codeTool.js'
import { Store, mapGetters } from 'vuex'
import loginFormateVue from '@/loginFormate.vue'
export default {
	extends: base,
	// props: {
	// 	tabIndex: Number,
	// 	criteria: String
	// },
	data() {
		return {
			indicatorRadio: 'sentiment',
			sentimentIndicator: '',
			technicalIndicator: '',
			techIndiValue: '',
			dialogTableVisible: false,
			idsLoad: {},
			scLoad: {},
			sentiVal: ""
		}
	},
	mounted() {
		this.$cookies.set('username', 'test')
	},
	computed: {
		...mapGetters(['getSignalDialogData']),
		signalDialogData() {
			return this.getSignalDialogData
		}
	},
	watch: {
		signalDialogData: {
			handler(newVal) {
				console.log('弹框中的数据', newVal)
				const fd = {}
				fd.description = newVal.description
				fd.direction = newVal.direction
				fd.frequency = newVal.frequency
				fd.criteria = newVal.criteria
				this.$store.commit("setSignalDialogFd",fd)
				this.idsLoad = newVal.code.ids
				this.scLoad = newVal.code.sc
				if (newVal.code.analysis === 'Technical') {
					this.indicatorRadio = 'technical'
					const obj = {}
					obj.radio = 'Technical Indicators'
					obj.technicalIndicator = newVal.code.indicator
					this.$refs.indicatorPart.setIndicatorRadio(obj)
					const arr = [
						{ label: 'Moving Average', value: 'MA' },
						{ label: 'MACD', value: 'MACD' },
						{ label: 'Commodity Channel Index', value: 'CCI' },
						{ label: 'Relative Strength Index', value: 'RSI' }
					]
					arr.forEach((item) => {
						if (item.label === newVal.code.indicator) {
							this.techIndiValue = item.value
						}
					})
				} else if (newVal.code.analysis === 'Sentiment') {
					this.$refs.indicatorPart.setIndicatorRadio('Sentiment Indicators')
					this.indicatorRadio = 'sentiment'
					const obj = {}
					obj.radio = 'Sentiment Indicators'
					obj.sentimentIndicator = newVal.code.indicator
					this.$refs.indicatorPart.setIndicatorRadio(obj)
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
						vm.$emit('goToFavorite')
					} else {
						vm.$message.error('Save failed')
					}
				})
		}
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.miniNote {
		font-weight: 600;
		margin: 0px 0px 5px 0px;
	}
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
	.miniNote {
		font-weight: 600;
		margin: 0px 0px 5px 0px;
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
</style>