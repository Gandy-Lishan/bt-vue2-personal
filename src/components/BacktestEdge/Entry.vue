<template>
	<div class="entry-container">
		<p class="criteria-title">Entry Criteria</p>
		<el-form :model="fd" :rules="entryFormRules" ref="entryForm">
			<div class="radioBox">
				<el-form-item label="Direction:" prop="direction">
					<el-radio-group v-model="fd.direction" @change="getExitDirection">
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
		</el-form>
		<indicator
			:editData="editData"
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
			:criteria="'entry'"
			ref="sentiChild"
			:sentiUrl="sentiUrl"
			:sentiVal="sentiVal"
			v-if="indicatorRadio === 'sentiment'"
		></senti>
		<cci
			:criteria="'entry'"
			ref="cciChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-if="indicatorRadio === 'technical' && techIndiValue === 'cci'"
		></cci>
		<rsi
			:criteria="'entry'"
			ref="rsiChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-if="indicatorRadio === 'technical' && techIndiValue === 'rsi'"
		></rsi>
		<macd
			:criteria="'entry'"
			ref="macdChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-if="indicatorRadio === 'technical' && techIndiValue === 'macd'"
		></macd>
		<ma
			:criteria="'entry'"
			ref="maChild"
			:techUrl="techUrl"
			:techVal="techVal"
			v-if="indicatorRadio === 'technical' && techIndiValue === 'ma'"
		></ma>
	</div>
</template>
<script>
import senti from '@/components/BacktestEdge/signal/sentiment/Senti'
import cci from '@/components/BacktestEdge/signal/technical/Cci'
import rsi from '@/components/BacktestEdge/signal/technical/Rsi.vue'
import macd from '@/components/BacktestEdge/signal/technical/Macd.vue'
import ma from '@/components/BacktestEdge/signal/technical/Ma.vue'
import indicator from '@/components/BacktestEdge/signal/indicator/Indicator'
export default {
	name: 'entry',
	props: { editBacktestData: Object },
	data() {
		return {
			fd: {
				direction: 'Long'
			},
			entryFormRules: {
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
			editData: {}
		}
	},
	watch: {
		editBacktestData: {
			handler(newVal) {
				if (JSON.stringify(newVal) != '{}') {
					this.fd.direction = newVal.entry.direction
					this.getExitDirection(newVal.entry.direction)
					console.log('传到entry的编辑数据', newVal)
					let data = newVal
					delete data.exit
					delete data.exit_description
					this.editData = data
				}
			},
			immediate: true,
			deep: true
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
	methods: {
		getExitDirection(val) {
			this.$store.commit('getExitDirection', val)
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
					this.$refs.maChild.saveCondition()
				}
			} else {
				checked = false
				return checked
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
.entry-container {
	padding-right: 20px;
	border-right: 1px solid #797979;
	margin-bottom: 10px;
}
</style>