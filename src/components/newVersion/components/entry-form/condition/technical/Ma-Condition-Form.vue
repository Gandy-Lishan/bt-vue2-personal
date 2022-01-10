<template>
	<div>
		<div class="signal-condition-box">
			<div>
				<h2 class="note">Signal Condition</h2>
				<el-tooltip
					class="item"
					effect="dark"
					content="please refer to the above Extreme Optimism / Extreme Pessimism to enter a number"
					placement="bottom-start"
					><i class="iconfont icon-tishi"></i
				></el-tooltip>
			</div>
			<div class="sentimentConditionBox">
				<el-radio
					v-model="conditionRadio"
					label="Symbol Close"
					@change="getConditionRadio"
				>
				</el-radio>
				<div class="sentimentConditionItem">
					<el-select
						v-model="maCondition"
						:disabled="disabled"
						filterable
						placeholder="Please select condition"
						@change="getConditionValue"
					>
						<el-option
							v-for="item in conditions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<span
						style="
							font-weight: 500;
							margin-left: 10px;
							line-height: 30px;
							font-size: 15px;
						"
						>Moving Average</span
					>
					<el-input
						v-model="sc.period"
						:disabled="disabled"
						@input="getSCvalue"
						oninput="value=value.replace(/[^\d]/g,'')"
						placeholder="Input Period"
					></el-input>
				</div>
			</div>
			<div class="sentimentConditionBox">
				<el-radio
					v-model="conditionRadio"
					label="Moving Average"
					@change="getConditionRadio"
				>
				</el-radio>
				<div class="sentimentMABox">
					<el-input
						:disabled="!disabled"
						v-model="sc.ma_period"
						placeholder="Input Period"
						@input="getMaPeriodValue"
						oninput="value=value.replace(/[^\d]/g,'')"

					></el-input>
					<el-select
						v-model="sc.condition"
						:disabled="!disabled"
						filterable
						placeholder="Please select condition"
					>
						<el-option
							v-for="item in conditions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<span
						style="
							font-weight: 500;
							margin-left: 10px;
							line-height: 30px;
							font-size: 15px;
						"
						>Moving Average</span
					>
					<el-input
						v-model="sc.period"
						:disabled="!disabled"
						placeholder="Input Period"
						@input="getMaValue"
						oninput="value=value.replace(/[^\d]/g,'')"
					></el-input>
				</div>
			</div>
		</div>
		<div class="signalDescriptionBox">
			<div>
				<h2 class="note">Signal Description</h2>
				<el-tooltip
					class="item"
					effect="dark"
					content="Your signal description"
					placement="bottom-start"
					><i class="iconfont icon-tishi"></i
				></el-tooltip>
			</div>
			<el-button plain style="margin: 5px 0px 5px 0px">{{
				`${techVal}&nbsp;&nbsp;${conditionRadio == 'Moving Average' ? 'moving average ' + sc.ma_period : ''}&nbsp;&nbsp;${conditions[sc.condition].label}&nbsp;&nbsp;Moving Average&nbsp;&nbsp;${sc.period}`
			}}</el-button>
		</div>
	</div>
</template>
<script>
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
export default {
	extends: base,
	props: { techVal: String },
	data() {
		return {

			period: 5,
			maRadio: 'SMA',
			conditionRadio: 'Symbol Close',
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			sc: {
				condition: 3,
				ma_period: 5,
				period: 20
			},
			disabled: false,
			maCondition: 3,
			des: this.$store.state.backtestInfo[this.criteria].signals[this.tabIndex]
		}
	},
	computed: {
		data () {
			return this.$store.state.maRadio
		}
	},
	watch: {
		techVal: {
			handler(newVal) {
				this.techVal = newVal
			}
		},
		data (val) {
			this.maRadio = val
		}	
	},
	methods: {
		getConditionRadio(val) {
			this.conditionRadio = val
			CIQ.store.commit("setConditionRadio",val)
			if (val === 'Symbol Close') {
				if ('ma_period' in this.sc) {
					delete this.sc.ma_period
				}
				this.disabled = !this.disabled
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName];
					if(sd.type == 'ST MA' && sd.panel == 'chart'){
						CIQ.Studies.removeStudy(
							CIQ.stxx,
							sd
						)
					}
				}
				
				// remove current MA attached to an indicator
				var activatedMAList = this.$store.state.activatedMA
				var MAListIndex = activatedMAList.findIndex(
					(item) => item.url == 'ma'
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
				console.log(this.$store.state.activatedMA)

			} else if(val === 'Moving Average'){
				// 添加附属ma
				this.disabled = !this.disabled
			    this.sc.ma_period = this.period
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName];
					if(sd.type == 'ST MA' && sd.panel == 'chart'){
						CIQ.Studies.removeStudy(
							CIQ.stxx,
							sd
						)
					}
				}
				var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
					Type: this.maRadio=="SMA"?"simple":"exponential",
					Period: this.sc.ma_period,
					display: 'ST MA',
				})

				// keep current MA
				var objMA = { period: this.sc.ma_period, url: 'ma', type: this.maRadio}
				var activatedMAList = this.$store.state.activatedMA

				// remove current MA attached to an indicator
				var MAListIndex = activatedMAList.findIndex(
					(item) => item.url == 'ma'
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				activatedMAList.push(objMA)

				this.$store.commit('getMA', activatedMAList)

				console.log(this.$store.state.activatedMA)
			}
		},
		getConditionValue(val) {
			this.sc.condition = val
		},
		getSCvalue(val) {
			if (this.conditionRadio === 'Symbol Close') {
				//   delete this.sc.ma_period
				const obj = {}
				obj.criteria = this.criteria
				obj.index = this.tabIndex
				obj.delete = 'ma_period'
				this.$store.commit('delete', obj)
				this.sc.period = val

				for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName];
				if(sd.type == 'ma'){
					// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
					// dialogHelper.updateStudy({ inputs: { Period: val } });
					var replaceStudy = {
						name: "Moving Average",
						overlay: true,
						calculateFN: CIQ.Studies.calculateMovingAverage,
						inputs: { Period: val, Field: "field", Type: this.maRadio=="SMA"?"simple":"exponential", Offset: 0 },
						outputs: { MA: "#FF0000" }
					}
					CIQ.Studies.studyLibrary[sd.type] = replaceStudy
					var st = CIQ.Studies.replaceStudy(
						CIQ.stxx,
						sd.inputs.id,
						sd.type,
					);
					CIQ.store.commit('getMaPeriod',val)
					console.log('replaced study: ',st)
				}
			}	
			}
		},
		getMaPeriodValue(val){
			this.period = val
			this.sc.ma_period = this.period
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName];
				if(sd.type == 'ST MA' && sd.panel == 'chart'){
					// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
					// dialogHelper.updateStudy({ inputs: { Period: val } });

					// 刷新附属ma
					var replaceStudy = {
						name: "Moving Average ",
						overlay: true,
						calculateFN: CIQ.Studies.calculateSTMovingAverage,
						inputs: { Period: val, Field: "field", Type: this.maRadio=="SMA"?"simple":"exponential", Offset: 0 },
						outputs: { MA: "#FF000" },
					}
					CIQ.Studies.studyLibrary[sd.type] = replaceStudy
					var st = CIQ.Studies.replaceStudy(
						CIQ.stxx,
						sd.inputs.id,
						sd.type,
					);
					console.log('replaced st ma: ',st)
				}
			}
			// keep current MA
				var objMA = { period: this.sc.ma_period, url: 'ma', type: this.maRadio}
				var activatedMAList = this.$store.state.activatedMA

				// remove current MA attached to an indicator
				var MAListIndex = activatedMAList.findIndex(
					(item) => item.url == 'ma'
				)
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				activatedMAList.push(objMA)

				this.$store.commit('getMA', activatedMAList)
				this.$store.commit('getStMaPeriod',val)

				console.log(this.$store.state.activatedMA)	
		},
		getMaValue(val) {
			this.sc.period = val
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName];
				if(sd.type == 'ma'){
					// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
					// dialogHelper.updateStudy({ inputs: { Period: val } });
					var replaceStudy = {
						name: "Moving Average",
						overlay: true,
						calculateFN: CIQ.Studies.calculateMovingAverage,
						inputs: { Period: val, Field: "field", Type: this.maRadio=="SMA"?"simple":"exponential", Offset: 0 },
						outputs: { MA: "#FF0000" }
					}
					CIQ.Studies.studyLibrary[sd.type] = replaceStudy
					var st = CIQ.Studies.replaceStudy(
						CIQ.stxx,
						sd.inputs.id,
						sd.type,
					);
					CIQ.store.commit('getMaPeriod',val)
					console.log('replaced study: ',st)
				}
			}	
		},
		setScLoad(val) {
			const rule = /^-?0?\d*?\.?\d*?$/
			for (let key in val) {
				if(typeof val[key] == 'string'){
				if (val[key].search(rule) != -1) {
					val[key] = Number(val[key])
				}}
			}
			if (val.ma_period) {
				this.conditionRadio = 'Moving Average'
				this.disabled = true
				this.sc = val
			} else {
				this.conditionRadio = 'Symbol Close'
				this.disabled = false
				this.sc = val
			}
		}
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.note {
		display: inline-block;
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
		flex: 0.6;
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
		flex: 0.4;
	}
	.sentimentConditionBox .sentimentMABox .el-input:first-child {
		margin-right: 5px;
	}
	.sentimentConditionBox .el-radio {
		margin-right: 2px;
	}
	.signal-condition-box {
		border-bottom: 1px solid black;
		padding-bottom: 10px;
	}
	.signalDescriptionBox {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding-bottom: 10px;
		border-bottom: 1px solid black;
	}
}

@media (min-width: 900px) and (max-width: 1599px) {
	.note {
		display: inline-block;
	}
	.sentimentConditionBox {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.sentimentConditionBox .el-radio {
		line-height: 35px;
	}
	.sentimentConditionBox .el-select .el-input {
		flex: 1;
	}
	.sentimentConditionBox .el-select {
		flex: 0.4;
		margin-left: 5px;
	}
	.sentimentConditionBox .el-input {
		flex: 0.2;
		margin-left: 5px;
	}
	.sentimentConditionBox .sentimentConditionItem {
		display: flex;
		justify-content: flex-start;
	}
	.sentimentConditionBox .sentimentMABox {
		display: flex;
		justify-content: flex-start;
	}
	.sentimentConditionBox .sentimentMABox .el-select {
		flex: 0.4;
	}
	.sentimentConditionBox .sentimentMABox .el-input {
		flex: 0.2;
	}
	.sentimentConditionBox .sentimentMABox .el-input:first-child {
		margin-right: 5px;
	}
	.sentimentConditionBox .el-radio {
		margin-right: 2px;
	}
	.signal-condition-box {
		padding-bottom: 10px;
		border-bottom: 1px solid black;
	}
	.signalDescriptionBox {
		display: flex;
		align-items: center;
		padding-bottom: 10px;
		border-bottom: 1px solid black;
		justify-content: space-around;
	}
}
</style>