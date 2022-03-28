<template>
	<div class="entry-container">
		<p class="criteria-title">Entry Criteria</p>
		<el-form :model="fd" ref="entryForm">
			<div class="radioBox">
				<!-- <el-form-item label="Direction:" prop="direction">
					<el-radio-group v-model="fd.direction" @change="getExitDirection">
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item> -->
			</div>
		</el-form>
		<indicator
			:criteria="'entry'"
			ref="indiChild"
			@getSentiUrl="getSentiUrl"
			@getTechUrl="getTechUrl"
			@getSentiVal="getSentiVal"
			@getTechVal="getTechVal"
			@getTechIndiValue="getTechIndiValue"
			@getIndicatorRadio="getIndicatorRadio"
		></indicator>
		<senti
			:direction="fd.direction"
			:criteria="'entry'"
			ref="sentiChild"
			:sentiUrl="sentiUrl"
			:sentiVal="sentiVal"
			v-show="indicatorRadio === 'sentiment'"
		></senti>
		<cci
			:direction="fd.direction"
			:criteria="'entry'"
			ref="cciChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-show="indicatorRadio === 'technical' && techIndiValue === 'cci'"
		></cci>
		<rsi
			:direction="fd.direction"
			:criteria="'entry'"
			ref="rsiChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-show="indicatorRadio === 'technical' && techIndiValue === 'rsi'"
		></rsi>
		<macd
			:direction="fd.direction"
			:criteria="'entry'"
			ref="macdChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-show="indicatorRadio === 'technical' && techIndiValue === 'macd'"
		></macd>
		<ma
			:direction="fd.direction"
			:criteria="'entry'"
			ref="maChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-show="indicatorRadio === 'technical' && techIndiValue === 'ma'"
		></ma>
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
export default {
	name: 'entry',
	data() {
		return {
			fd: {
				direction: 'Long'
			},
			sentiUrl: '',
			techUrl: '',
			sentiVal: '',
			techVal: '',
			techIndiValue: '',
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
		ma
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
		},
		setDirection(val) {
			this.fd.direction = val
		},
		getExitDirection(val) {
			this.$emit('setExitDirection', val)
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
		getTechIndiValue(val) {
			this.techIndiValue = val
		},
		getIndicatorRadio(val) {
			this.indicatorRadio = val
		},
		saveBacktestData() {
			// 将选择的 indicator 保存到 vuex 中
			let checked = true
			let indi = this.$refs.indiChild.saveIndicator()
			return indi.then((val) => {
				// 按照 sentiment 以及不同的 technical 触发不同组件的保存事件
				if (val) {
					if (this.indicatorRadio === 'sentiment') {
						this.$refs.sentiChild.setDesciption()
						let senti = this.$refs.sentiChild.saveCondition()
						return (checked = senti)
					}
					if (
						this.indicatorRadio === 'technical' &&
						this.techIndiValue === 'cci'
					) {
						this.$refs.cciChild.setDesciption()
						let cci = this.$refs.cciChild.saveCondition()
						return (checked = cci)
					}
					if (
						this.indicatorRadio === 'technical' &&
						this.techIndiValue === 'rsi'
					) {
						this.$refs.rsiChild.setDesciption()
						let rsi = this.$refs.rsiChild.saveCondition()
						return (checked = rsi)
					}
					if (
						this.indicatorRadio === 'technical' &&
						this.techIndiValue === 'macd'
					) {
						this.$refs.macdChild.setDesciption()
						let macd = this.$refs.macdChild.saveCondition()
						return (checked = macd)
					}
					if (
						this.indicatorRadio === 'technical' &&
						this.techIndiValue === 'ma'
					) {
						this.$refs.maChild.setDesciption()
						let ma = this.$refs.maChild.saveCondition()
						return (checked = ma)
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
				vm.fd.direction = data.entry.direction
				vm.getExitDirection(data.entry.direction)
				let edit = {}
				edit.entry_description = data.entry_description
				edit.exit_description = data.exit_description
				edit.entry = data.entry
				edit.exit = data.exit

				if (edit.entry.signals[0].analysis == 'Sentiment') {
					this.sentiVal = edit.entry.signals[0].indicator
				} else if (edit.entry.signals[0].analysis == 'Technical') {
					this.techVal = edit.entry.signals[0].indicator
				}
				// 监听
				// vm.editIndiData = edit
				// 改成直接触发
				vm.$refs.indiChild.setEditData(edit)
				// 判断使用那个组件
				// vm.$refs.sentiChild.setEditData(edit)
				if (edit.entry.signals[0].analysis == 'Sentiment') {
					vm.indicatorRadio = 'sentiment'
					vm.$refs.sentiChild.setEditData(edit)
				} else if (
					edit.entry.signals[0].analysis == 'Technical' &&
					edit.entry.signals[0].indicator == 'Commodity Channel Index'
				) {
					vm.indicatorRadio = 'technical'
					vm.techIndiValue = 'cci'
					vm.$refs.cciChild.setEditData(edit)
				} else if (
					edit.entry.signals[0].analysis == 'Technical' &&
					edit.entry.signals[0].indicator == 'Relative Strength Index'
				) {
					vm.indicatorRadio = 'technical'
					vm.techIndiValue = 'rsi'
					vm.$refs.rsiChild.setEditData(edit)
				} else if (
					edit.entry.signals[0].analysis == 'Technical' &&
					edit.entry.signals[0].indicator == 'Moving Average'
				) {
					vm.indicatorRadio = 'technical'
					vm.techIndiValue = 'ma'
					vm.$refs.maChild.setEditData(edit)
				} else if (
					edit.entry.signals[0].analysis == 'Technical' &&
					edit.entry.signals[0].indicator == 'MACD'
				) {
					vm.indicatorRadio = 'technical'
					vm.techIndiValue = 'macd'
					vm.$refs.macdChild.setEditData(edit)
				}
				// if (vm.editIndiData.entry.signals[0].analysis === 'Technical') {
				// 	this.$refs.maChild.setEditData(vm.editIndiData)
				// }
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
}
</style>