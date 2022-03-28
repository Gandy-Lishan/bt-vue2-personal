<template>
	<div class="exit-container">
		<p class="criteria-title">Exit Criteria</p>
		<el-form :model="fd" ref="exitForm">
			<div class="radioBox">
				<!-- <el-form-item label="Direction:" prop="direction">
					<el-radio-group v-model="fd.direction" disabled>
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item> -->
			</div>
		</el-form>
		<indicator
			:criteria="'exit'"
			ref="indiChild"
			@getSentiUrl="getSentiUrl"
			@getTechUrl="getTechUrl"
			@getSentiVal="getSentiVal"
			@getTechVal="getTechVal"
			@getRiskVal="getRiskVal"
			@getTechIndiValue="getTechIndiValue"
			@getRiskIndiValue="getRiskIndiValue"
			@getIndicatorRadio="getIndicatorRadio"
		></indicator>
		<senti
			:criteria="'exit'"
			:direction="fd.direction"
			ref="sentiChild"
			:sentiUrl="sentiUrl"
			:sentiVal="sentiVal"
			v-show="indicatorRadio === 'sentiment'"
		></senti>
		<cci
			:direction="fd.direction"
			:criteria="'exit'"
			ref="cciChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-show="indicatorRadio === 'technical' && techIndiValue === 'cci'"
		></cci>
		<rsi
			:direction="fd.direction"
			:criteria="'exit'"
			ref="rsiChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-show="indicatorRadio === 'technical' && techIndiValue === 'rsi'"
		></rsi>
		<macd
			:direction="fd.direction"
			:criteria="'exit'"
			ref="macdChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-show="indicatorRadio === 'technical' && techIndiValue === 'macd'"
		></macd>
		<ma
			:direction="fd.direction"
			:criteria="'exit'"
			ref="maChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-show="indicatorRadio === 'technical' && techIndiValue === 'ma'"
		></ma>
		<risk
			v-show="indicatorRadio === 'risk'"
			ref="riskChild"
			:direction="fd.direction"
			:criteria="'exit'"
			:riskIndiValue="riskIndiValue"
			:riskVal="riskVal"
			v-bind="$attrs"
		></risk>
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
export default {
	name: 'exit',
	inheritAttrs: true,
	data() {
		return {
			fd: {
				direction: 'Short'
			},
			sentiUrl: '',
			techUrl: '',
			sentiVal: '',
			techVal: '',
			techIndiValue: '',
			riskVal: '',
			riskIndiValue: '',
			indicatorRadio: 'sentiment'
			// editIndiData: {}
		}
	},
	components: {
		indicator,
		senti,
		cci,
		rsi,
		macd,
		ma,
		risk
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
			this.$refs.indiChild.clearForm()
			this.$refs.sentiChild.clearForm()
			this.$refs.cciChild.clearForm()
			this.$refs.maChild.clearForm()
			this.$refs.macdChild.clearForm()
			this.$refs.rsiChild.clearForm()
			this.$refs.riskChild.clearForm()
		},
		getSentiUrl(val) {
			this.sentiUrl = val
		},
		getTechUrl(val) {
			this.techUrl = val
		},
		getSentiVal(val) {
			this.sentiVal = val
		},
		getTechVal(val) {
			this.techVal = val
		},
		getRiskVal(val) {
			this.riskVal = val
		},
		getTechIndiValue(val) {
			this.techIndiValue = val
		},
		getRiskIndiValue(val) {
			this.riskIndiValue = val
		},
		getIndicatorRadio(val) {
			this.indicatorRadio = val
		},
		setDirection(data) {
			this.fd.direction = data
		},
		saveBacktestData() {
			let checked = true
			// 将选择的 indicator 保存到 vuex 中
			let indi = this.$refs.indiChild.saveIndicator()
			return indi.then( val => {
			// 按照 sentiment 以及不同的 technical 触发不同组件的保存事件
			if (val) {
				if (this.indicatorRadio === 'sentiment') {
					this.$refs.sentiChild.setDesciption()
					let senti = this.$refs.sentiChild.saveCondition()
					return (checked = senti)
				} else if (
					this.indicatorRadio === 'technical' &&
					this.techIndiValue === 'cci'
				) {
					this.$refs.cciChild.setDesciption()
					let cci = this.$refs.cciChild.saveCondition()
					return (checked = cci)
				} else if (
					this.indicatorRadio === 'technical' &&
					this.techIndiValue === 'rsi'
				) {
					this.$refs.rsiChild.setDesciption()
					let rsi = this.$refs.rsiChild.saveCondition()
					return (checked = rsi)
				} else if (
					this.indicatorRadio === 'technical' &&
					this.techIndiValue === 'macd'
				) {
					this.$refs.macdChild.setDesciption()
					let macd = this.$refs.macdChild.saveCondition()
					return (checked = macd)
				} else if (
					this.indicatorRadio === 'technical' &&
					this.techIndiValue === 'ma'
				) {
					this.$refs.maChild.setDesciption()
					let ma = this.$refs.maChild.saveCondition()
					return (checked = ma)
				} else if (this.indicatorRadio === 'risk') {
					this.$refs.riskChild.setDesciption()
					let risk = this.$refs.riskChild.saveCondition()
					return (checked = risk)
				}
			} else {
				checked = false
				return checked
			}
			})
		},
		setEditData(id) {
			let vm = this
			this.$http.get('/dev/seeparams/' + id + '/').then((res) => {
				let data = res.data
				data.entry = JSON.parse(data.entry)
				data.exit = JSON.parse(data.exit)
				let signalCode = new SignalCode()
				if (data.entry.signals instanceof Array) {
					data.entry.signals[0] = signalCode.decode(
						data.entry.signals[0]['code']
					)
				}
				if (data.exit.signals instanceof Array) {
					data.exit.signals[0] = signalCode.decode(data.exit.signals[0]['code'])
				}
				let edit = {}
				edit.entry_description = data.entry_description
				edit.exit_description = data.exit_description
				edit.entry = data.entry
				edit.exit = data.exit
				if (edit.exit.signals[0].analysis == 'Sentiment') {
					this.sentiVal = edit.exit.signals[0].indicator
				} else if (edit.exit.signals[0].analysis == 'Technical') {
					this.techVal = edit.exit.signals[0].indicator
				} else if (edit.exit.signals[0].analysis == 'Exit') {
					this.$refs.indiChild.changeIndicatorChecked('Risk Control')
					if (
						edit.exit.signals[0].sc.take_profit &&
						edit.exit.signals[0].sc.stop_loss
					) {
						this.riskVal = 'Profit/Loss'
					} else if (edit.exit.signals[0].sc.time_in_market) {
						this.riskVal = 'Time In Market'
					}
					// else if (edit.exit.signals[0].sc.take_profit) {
					// 	this.riskVal = 'Take Profit'
					// } else if (edit.exit.signals[0].sc.stop_loss) {
					// 	this.riskVal = 'Stop Loss'
					// }
					let obj = {}
					obj.value = this.riskVal
					this.$refs.indiChild.handleRiskSelect(obj)
				}
				// vm.editIndiData = edit
				vm.$refs.indiChild.setEditData(edit)
				// 判断使用那个组件
				if (edit.exit.signals[0].analysis == 'Sentiment') {
					vm.indicatorRadio = 'sentiment'
					vm.$refs.sentiChild.setEditData(edit)
				} else if (
					edit.exit.signals[0].analysis == 'Technical' &&
					edit.exit.signals[0].indicator == 'Commodity Channel Index'
				) {
					vm.indicatorRadio = 'technical'
					vm.techIndiValue = 'cci'
					vm.$refs.cciChild.setEditData(edit)
				} else if (
					edit.exit.signals[0].analysis == 'Technical' &&
					edit.exit.signals[0].indicator == 'Relative Strength Index'
				) {
					vm.indicatorRadio = 'technical'
					vm.techIndiValue = 'rsi'
					vm.$refs.rsiChild.setEditData(edit)
				} else if (
					edit.exit.signals[0].analysis == 'Technical' &&
					edit.exit.signals[0].indicator == 'Moving Average'
				) {
					vm.indicatorRadio = 'technical'
					vm.techIndiValue = 'ma'
					vm.$refs.maChild.setEditData(edit)
				} else if (
					edit.exit.signals[0].analysis == 'Technical' &&
					edit.exit.signals[0].indicator == 'MACD'
				) {
					vm.indicatorRadio = 'technical'
					vm.techIndiValue = 'macd'
					vm.$refs.macdChild.setEditData(edit)
				} else if (edit.exit.signals[0].analysis == 'Exit') {
					this.$refs.riskChild.setEditData(edit)
				}
			})
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
}
</style>