<template>
	<div class="exit-container">
		<p class="criteria-title">Exit Criteria</p>
		<el-form :model="fd" :rules="exitFormRules" ref="exitForm">
			<div class="radioBox">
				<el-form-item label="Direction:" prop="direction">
					<el-radio-group v-model="fd.direction" disabled>
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
		</el-form>
		<indicator
			:editIndiData="editIndiData"
			:criteria="'exit'"
			ref="indiChild"
			@getSentiUrl="getSentiUrl"
			@getTechUrl="getTechUrl"
			@getSentiVal="getSentiVal"
			@getTechVal="getTechVal"
			@getTechIndiValue="getTechIndiValue"
			@getIndicatorRadio="getIndicatorRadio"
		></indicator>
		<senti
			:editIndiData="editIndiData"
			:criteria="'exit'"
			ref="sentiChild"
			:sentiUrl="sentiUrl"
			:sentiVal="sentiVal"
			v-if="indicatorRadio === 'sentiment'"
		></senti>
		<cci
			:editIndiData="editIndiData"
			:criteria="'exit'"
			ref="cciChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-if="indicatorRadio === 'technical' && techIndiValue === 'cci'"
		></cci>
		<rsi
			:editIndiData="editIndiData"
			:criteria="'exit'"
			ref="rsiChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-if="indicatorRadio === 'technical' && techIndiValue === 'rsi'"
		></rsi>
		<macd
			:editIndiData="editIndiData"
			:criteria="'exit'"
			ref="macdChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-if="indicatorRadio === 'technical' && techIndiValue === 'macd'"
		></macd>
		<ma
			:editIndiData="editIndiData"
			:criteria="'exit'"
			ref="maChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-if="indicatorRadio === 'technical' && techIndiValue === 'ma'"
		></ma>
	</div>
</template>
<script>
import indicator from '@/components/BacktestEdge/signal/indicator/Indicator'
import senti from '@/components/BacktestEdge/signal/sentiment/Senti'
import cci from '@/components/BacktestEdge/signal/technical/Cci'
import rsi from '@/components/BacktestEdge/signal/technical/Rsi.vue'
import macd from '@/components/BacktestEdge/signal/technical/Macd.vue'
import SignalCode from '@/tools/codeTool.js'
import ma from '@/components/BacktestEdge/signal/technical/Ma.vue'
export default {
	name: 'exit',
	props: { exitDirection: String },
	data() {
		return {
			fd: {
				direction: 'Short'
			},
			exitFormRules: {
				direction: [
					{
						required: true,
						message: 'Please select direction',
						trigger: 'change'
					}
				]
			},
			sentiUrl: '',
			techUrl: '',
			sentiVal: '',
			techVal: '',
			techIndiValue: '',
			indicatorRadio: 'sentiment',
			editIndiData: {}
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
	watch: {
		exitDirection: {
			handler(newVal) {
				if (newVal) {
					if (newVal === 'Long') {
						this.fd.direction = 'Short'
					} else if (newVal === 'Short') {
						this.fd.direction = 'Long'
					}
				}
			}
		}
	},
	methods: {
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
			let checked = true
			// 将选择的 indicator 保存到 vuex 中
			let indi = this.$refs.indiChild.saveIndicator()
			// 按照 sentiment 以及不同的 technical 触发不同组件的保存事件
			if (indi) {
				if (this.indicatorRadio === 'sentiment') {
					let senti = this.$refs.sentiChild.saveCondition()
					return (checked = senti)
				} else if (
					this.indicatorRadio === 'technical' &&
					this.techIndiValue === 'cci'
				) {
					let cci = this.$refs.cciChild.saveCondition()
					return (checked = cci)
				} else if (
					this.indicatorRadio === 'technical' &&
					this.techIndiValue === 'rsi'
				) {
					let rsi = this.$refs.rsiChild.saveCondition()
					return (checked = rsi)
				} else if (
					this.indicatorRadio === 'technical' &&
					this.techIndiValue === 'macd'
				) {
					let macd = this.$refs.macdChild.saveCondition()
					return (checked = macd)
				} else if (
					this.indicatorRadio === 'technical' &&
					this.techIndiValue === 'ma'
				) {
					let ma = this.$refs.maChild.saveCondition()
					return (checked = ma)
				}
			} else {
				checked = false
				return checked
			}
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
				let edit = {}
				edit.entry_description = data.entry_description
				edit.exit_description = data.exit_description
				edit.entry = data.entry
				edit.exit = data.exit
				vm.editIndiData = edit
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
.radioBox {
	border-bottom: 1px solid #797979;
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
	margin-bottom: 10px;
	padding-left: 20px;
}
</style>