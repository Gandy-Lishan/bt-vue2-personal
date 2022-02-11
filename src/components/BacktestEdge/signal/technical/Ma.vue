<template>
	<div class="senti-container">
		<el-form :model="tech">
			<!-- <div class="ids-container">
				<el-radio-group v-model="tech.ids.ma_category" @change="getMaRadio">
					<el-radio label="SMA" style="margin-bottom: 30px"
						>Simple moving average</el-radio
					>
					<el-radio label="EMA">Exponential moving average</el-radio>
				</el-radio-group>
			</div> -->
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="Symbol Close"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.condition"
							:disabled="disabled"
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
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item>
						<el-button type="text">Moving Average</el-button>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item>
						<el-input
							v-model="tech.period"
							:disabled="disabled"
							@input="getSCvalue, setDesciption"
							oninput="value=value.replace(/[^\d]/g,'')"
							placeholder="Input Period"
						></el-input>
					</el-form-item>
				</div>
			</div>
			<div class="condition-container">
				<el-form-item>
					<el-radio
						v-model="conditionRadio"
						label="Moving Average"
						@change="getConditionRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionInput">
					<el-form-item>
						<el-input
							:disabled="!disabled"
							v-model="tech.ma_period"
							placeholder="Input Period"
							@input="getMaPeriodValue, setDesciption"
							oninput="value=value.replace(/[^\d]/g,'')"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.condition"
							filterable
							:disabled="!disabled"
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
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item>
						<el-button type="text">Moving Average</el-button>
					</el-form-item>
				</div>
				<div class="conditionInput">
					<el-form-item>
						<el-input
							v-model="tech.period"
							:disabled="!disabled"
							placeholder="Input Period"
							@input="getMaValue, setDesciption"
							oninput="value=value.replace(/[^\d]/g,'')"
						></el-input>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store, mapGetters } from 'vuex'
const _ = require('lodash')
const throttle = _.throttle
export default {
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		// editIndiData: Object,
		direction: String
	},
	data() {
		return {
			tech: {
				ids: { ma_category: 'SMA' },
				condition: 3,
				ma_period: 5,
				period: 20
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			conditionRadio: 'Symbol Close',
			disabled: false,
			maRadio: 'SMA',
			period: 5,
			description: '',

			editTechVal: ''
		}
	},
	watch: {
		// editIndiData: {
		// 	handler(newVal) {
		// 		if (JSON.stringify(newVal) != '{}') {
		// 			this.tech.ids = newVal[this.criteria].signals[0].ids
		// 			this.tech.condition = Number(
		// 				newVal[this.criteria].signals[0].condition
		// 			)
		// 			this.tech.period = newVal[this.criteria].signals[0].period
		// 			this.conditionRadio = 'Symbol Close'
		// 			this.disabled = false
		// 			this.getSCvalue(this.tech.period)
		// 			let ma_period = newVal[this.criteria].signals[0].ma_period
		// 			if (ma_period) {
		// 				this.conditionRadio = 'Moving Average'
		// 				this.disabled = true
		// 				this.tech.ma_period = ma_period
		// 				this.getMaPeriodValue(ma_period)
		// 				this.getMaValue(newVal[this.criteria].signals[0].period)
		// 			}
		// 			this.setDesciption()
		// 		}
		// 	},
		// 	immediate: true,
		// 	deep: true
		// }
	},
	methods: {
		getConditionRadio(val) {
			this.conditionRadio = val
			CIQ.store.commit('setConditionRadio', val)
			if (val === 'Symbol Close') {
				if ('ma_period' in this.tech) {
					delete this.tech.ma_period
				}
				this.disabled = !this.disabled
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName]
					if (sd.type == 'ST MA' && sd.panel == 'chart') {
						CIQ.Studies.removeStudy(CIQ.stxx, sd)
					}
				}

				// remove current MA attached to an indicator
				var activatedMAList = this.$store.state.activatedMA
				var MAListIndex = activatedMAList.findIndex((item) => item.url == 'ma')
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
			} else if (val === 'Moving Average') {
				// 添加附属ma
				this.disabled = !this.disabled
				this.tech.ma_period = this.period
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName]
					if (sd.type == 'ST MA' && sd.panel == 'chart') {
						CIQ.Studies.removeStudy(CIQ.stxx, sd)
					}
				}
				var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
					Type: this.maRadio == 'SMA' ? 'simple' : 'exponential',
					Period: this.tech.ma_period,
					display: 'ST MA'
				})

				// keep current MA
				var objMA = {
					period: this.tech.ma_period,
					url: 'ma',
					type: this.maRadio
				}
				var activatedMAList = this.$store.state.activatedMA

				// remove current MA attached to an indicator
				var MAListIndex = activatedMAList.findIndex((item) => item.url == 'ma')
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				activatedMAList.push(objMA)

				this.$store.commit('getMA', activatedMAList)
			}
			this.setDesciption()
		},
		setDesciption: throttle(function () {
			let criteria = ''
			if (this.criteria == 'entry') {
				criteria = 'E:'
			} else if (this.criteria == 'exit') {
				criteria = 'X:'
			}
			let direction = this.direction + ':'
			let techVal = this.techVal
			let period = this.tech.period ? this.tech.period : ''
			let ma_period = this.techVal ? this.techVal : this.editTechVal
			this.conditionRadio == 'Moving Average' ? this.tech.ma_period : ''
			let condition = this.conditions[this.tech.condition].label
			this.description = `${criteria} ${direction} ${ma_period} ${condition} ${this.conditionRadio} ${this.tech.period}`
			console.log('描述', this.description)
		}, 500),
		getMaPeriodValue(val) {
			console.log('getMaPeriodValue')
			this.period = val
			this.tech.ma_period = this.period
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]
				if (sd.type == 'ST MA' && sd.panel == 'chart') {
					// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
					// dialogHelper.updateStudy({ inputs: { Period: val } });

					// 刷新附属ma
					var replaceStudy = {
						name: 'Moving Average ',
						overlay: true,
						calculateFN: CIQ.Studies.calculateSTMovingAverage,
						inputs: {
							Period: val,
							Field: 'field',
							Type: this.maRadio == 'SMA' ? 'simple' : 'exponential',
							Offset: 0
						},
						outputs: { MA: '#FF000' }
					}
					CIQ.Studies.studyLibrary[sd.type] = replaceStudy
					var st = CIQ.Studies.replaceStudy(CIQ.stxx, sd.inputs.id, sd.type)
				}
			}
			// keep current MA
			var objMA = { period: this.tech.ma_period, url: 'ma', type: this.maRadio }
			var activatedMAList = this.$store.state.activatedMA

			// remove current MA attached to an indicator
			var MAListIndex = activatedMAList.findIndex((item) => item.url == 'ma')
			if (MAListIndex != -1) {
				activatedMAList.splice(MAListIndex, 1)
			}
			activatedMAList.push(objMA)

			this.$store.commit('getMA', activatedMAList)
			this.$store.commit('getStMaPeriod', val)
		},
		getMaRadio(val) {
			//console.log(val)
			this.tech.ids.ma_category = val
			CIQ.store.commit('setMaRadio', val)

			if (val == 'SMA') {
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName]
					if (sd.type == 'ma') {
						// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						// dialogHelper.updateStudy({ inputs: { Period: val } });

						var replaceStudy = {
							name: 'Moving Average',
							overlay: true,
							calculateFN: CIQ.Studies.calculateMovingAverage,
							inputs: {
								Period: CIQ.store.state.maPeriod
									? CIQ.store.state.maPeriod
									: 50,
								Field: 'field',
								Type: 'simple',
								Offset: 0
							},
							outputs: { MA: '#FF0000' }
						}
						CIQ.Studies.studyLibrary[sd.type] = replaceStudy
						var st = CIQ.Studies.replaceStudy(CIQ.stxx, sd.inputs.id, sd.type)
					}
				}
			} else if (val == 'EMA') {
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName]
					if (sd.type == 'ma') {
						// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						// dialogHelper.updateStudy({ inputs: { Period: val } });

						// var st = CIQ.Studies.replaceStudy(
						// 	CIQ.stxx,
						// 	sd.inputs.id,
						// 	sd.type,
						// 	{Type: "exponential"}
						// );

						var replaceStudy = {
							name: 'Moving Average',
							overlay: true,
							calculateFN: CIQ.Studies.calculateMovingAverage,
							inputs: {
								Period: CIQ.store.state.maPeriod
									? CIQ.store.state.maPeriod
									: 50,
								Field: 'field',
								Type: 'exponential',
								Offset: 0
							},
							outputs: { MA: '#FF0000' }
						}
						CIQ.Studies.studyLibrary[sd.type] = replaceStudy
						var st = CIQ.Studies.replaceStudy(CIQ.stxx, sd.inputs.id, sd.type)
					}
				}
			}
			if (this.conditionRadio == 'Moving Average') {
				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName]
					if (sd.type == 'ST MA' && sd.panel == 'chart') {
						// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						// dialogHelper.updateStudy({ inputs: { Period: val } });

						// 刷新附属ma
						var replaceStudy = {
							name: 'Moving Average ',
							overlay: true,
							calculateFN: CIQ.Studies.calculateSTMovingAverage,
							inputs: {
								Period: CIQ.store.state.stMaPeriod
									? CIQ.store.state.stMaPeriod
									: 5,
								Field: 'field',
								Type:
									this.tech.ids.ma_category == 'SMA' ? 'simple' : 'exponential',
								Offset: 0
							},
							outputs: { MA: '#FF000' }
						}
						CIQ.Studies.studyLibrary[sd.type] = replaceStudy
						var st = CIQ.Studies.replaceStudy(CIQ.stxx, sd.inputs.id, sd.type)
					}
				}
				// keep current MA
				var objMA = {
					period: CIQ.store.state.stMaPeriod ? CIQ.store.state.stMaPeriod : 5,
					url: 'ma',
					type: this.tech.ids.ma_category
				}
				var activatedMAList = this.$store.state.activatedMA

				// remove current MA attached to an indicator
				var MAListIndex = activatedMAList.findIndex((item) => item.url == 'ma')
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				activatedMAList.push(objMA)

				this.$store.commit('getMA', activatedMAList)
			}
		},
		getSCvalue(val) {
			if (this.conditionRadio === 'Symbol Close') {
				//   delete this.sc.ma_period
				// const obj = {}
				// obj.criteria = this.criteria
				// obj.index = this.tabIndex
				// obj.delete = 'ma_period'
				// this.$store.commit('delete', obj)
				this.tech.period = val

				for (var studyInstanceName in CIQ.stxx.layout.studies) {
					var sd = CIQ.stxx.layout.studies[studyInstanceName]
					if (sd.type == 'ma') {
						// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
						// dialogHelper.updateStudy({ inputs: { Period: val } });
						var replaceStudy = {
							name: 'Moving Average',
							overlay: true,
							calculateFN: CIQ.Studies.calculateMovingAverage,
							inputs: {
								Period: val,
								Field: 'field',
								Type: this.maRadio == 'SMA' ? 'simple' : 'exponential',
								Offset: 0
							},
							outputs: { MA: '#FF0000' }
						}
						CIQ.Studies.studyLibrary[sd.type] = replaceStudy
						var st = CIQ.Studies.replaceStudy(CIQ.stxx, sd.inputs.id, sd.type)
						CIQ.store.commit('getMaPeriod', val)
					}
				}
			}
		},
		getMaValue(val) {
			console.log('getMaValue')
			this.tech.period = val
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]
				if (sd.type == 'ma') {
					// let dialogHelper = new CIQ.Studies.DialogHelper({ stx: CIQ.stxx, sd: sd });
					// dialogHelper.updateStudy({ inputs: { Period: val } });
					var replaceStudy = {
						name: 'Moving Average',
						overlay: true,
						calculateFN: CIQ.Studies.calculateMovingAverage,
						inputs: {
							Period: val,
							Field: 'field',
							Type: this.maRadio == 'SMA' ? 'simple' : 'exponential',
							Offset: 0
						},
						outputs: { MA: '#FF0000' }
					}
					CIQ.Studies.studyLibrary[sd.type] = replaceStudy
					var st = CIQ.Studies.replaceStudy(CIQ.stxx, sd.inputs.id, sd.type)
					CIQ.store.commit('getMaPeriod', val)
				}
			}
		},
		saveCondition() {
			let checked = true
			console.log('保存 condition')
			if (this.conditionRadio === 'Symbol Close') {
				if (this.tech.period) {
					let ids = this.tech.ids
					let tech = this.tech
					delete tech.ids
					delete tech.ma_period
					tech = Object.assign(ids, tech)
					tech.criteria = this.criteria
					tech.index = 0
					this.$store.commit('saveCondition', tech)
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = this.description
					this.$store.commit('saveDescription', desObj)
					return checked
				} else {
					this.$message.error('Please Input Period')
					checked = false
					return checked
				}
			} else {
				if (this.tech.period && this.tech.ma_period) {
					let ids = {}
					let tech = {}
					tech = this.tech
					ids = this.tech.ids
					delete tech.ids
					tech = Object.assign(ids, tech)
					tech.criteria = this.criteria
					tech.index = 0
					this.$store.commit('saveCondition', tech)
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = this.description
					this.$store.commit('saveDescription', desObj)
					return checked
				} else {
					this.$message.error('Please Input Period')
					checked = false
					return checked
				}
			}
		},
		// 设置编辑的数据
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				this.tech.ids = newVal[this.criteria].signals[0].ids
				this.tech.condition = Number(newVal[this.criteria].signals[0].condition)
				this.tech.period = newVal[this.criteria].signals[0].period
				this.conditionRadio = 'Symbol Close'
				this.disabled = false
				this.getSCvalue(this.tech.period)
				let ma_period = newVal[this.criteria].signals[0].ma_period
				if (ma_period) {
					this.conditionRadio = 'Moving Average'
					this.disabled = true
					this.tech.ma_period = ma_period
					this.getMaPeriodValue(ma_period)
					this.getMaValue(newVal[this.criteria].signals[0].period)
				}
				this.editTechVal = newVal[this.criteria].signals[0].indicator
				this.setDesciption()
			}
		}
	}
}
</script>
<style lang="less" scoped>
.ids-container {
	// hide attributes of technical indicators
	display: none;
	flex-wrap: wrap;
	.el-form-item {
		display: inline-flex;
	}
}
.condition-container {
	display: flex;
}
/deep/ .el-input__inner {
	padding-left: 5px;
	margin-left: 5px;
}
/deep/.el-input--suffix .el-input__inner {
	padding-right: 5px;
}
/deep/ .el-form-item__label {
	margin-right: 36px;
}
</style>