<template>
	<div class="senti-container">
		<el-form :model="tech" :rules="rules" ref="maForm">
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
							size="mini"
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
					<el-form-item prop="period">
						<el-input
							v-model="tech.period"
							:disabled="disabled"
							@input="getSCvalue"
							@blur="setDesciption"
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
					<el-form-item prop="ma_period">
						<el-input
							:disabled="!disabled"
							v-model="tech.ma_period"
							placeholder="Input Period"
							@input="getMaPeriodValue"
							oninput="value=value.replace(/[^\d]/g,'')"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.condition"
							filterable
							size="mini"
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
					<el-form-item prop="maPeriod">
						<el-input
							v-model="tech.maPeriod"
							:disabled="!disabled"
							placeholder="Input Period"
							@input="getMaValue"
							@blur="setDesciption"
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
	name: 'ma',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		// editIndiData: Object,
		direction: String
	},
	data() {
		let validatePeriod = (rule, value, callback) => {
			if (!/[1-9]\d*/.test(value)) {
				return callback(new Error('Please enter a positive integer'))
			}
			if (value === 0 || value === '') {
				return callback(new Error('Please input period'))
			}
			if (isNaN(value)) {
				return callback(new Error('Please enter the correct format'))
			}
			callback()
		}
		let validateMaPeriodRule = (rule, value, callback) => {
			if (!/[1-9]\d*/.test(value)) {
				return callback(new Error('Please enter a positive integer'))
			}
			if (value === 0 || value === '') {
				return callback(new Error('Please input period'))
			}
			if (isNaN(value)) {
				return callback(new Error('Please enter the correct format'))
			}
			callback()
		}
		let validateMaPeriod = (rule, value, callback) => {
			if (!/[1-9]\d*/.test(value)) {
				return callback(new Error('Please enter a positive integer'))
			}
			if (value === 0 || value === '') {
				return callback(new Error('Please input period'))
			}
			if (isNaN(value)) {
				return callback(new Error('Please enter the correct format'))
			}
			callback()
		}
		return {
			tech: {
				ids: { ma_category: 'SMA' },
				condition: 3,
				ma_period: 5,
				period: 20,
				maPeriod: 20
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
			maPeriod: 20,
			description: '',
			editTechVal: '',
			rules: {
				period: [{ validator: validatePeriod, trigger: 'blur' }],
				ma_period: [{ validator: validateMaPeriod, trigger: 'blur' }],
				maPeriod: [{ validator: validateMaPeriodRule, trigger: 'blur' }]
			}
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
		clearForm() {
			// Object.assign(this.$data, this.$options.data())
			// this.clearFormValidate()
			this.$refs.maForm.resetFields()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.maForm.clearValidate()
		},
		getConditionRadio(val) {
			this.conditionRadio = val
			this.clearFormValidate()
			CIQ.store.commit('setConditionRadio', val)
			if (val === 'Symbol Close') {
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
		setDesciption() {
			let criteria = ''
			let direction = ''
			if (this.criteria == 'entry') {
				criteria = 'E:'
				direction = this.direction + ':'
			} else if (this.criteria == 'exit') {
				criteria = 'X:'

				if (this.direction == 'Long') {
					direction = 'Cover:'
				} else if (this.direction == 'Short') {
					direction = 'Close:'
				}
			}
			let techVal = this.techVal
			// let period = this.tech.period ? this.tech.period : ''
			let period =
				this.conditionRadio === 'Symbol Close'
					? this.tech.period
					: this.tech.maPeriod
			// let ma_period = this.techVal ? this.techVal : this.editTechVal
			let ma_period =
				this.conditionRadio == 'Moving Average' ? this.tech.ma_period : ''
			// this.conditionRadio == 'Moving Average' ? this.tech.ma_period : ''
			let condition = this.conditions[this.tech.condition].label
			this.description = `${criteria} ${direction} ${this.conditionRadio} ${ma_period} ${condition} Moving Average ${period}`
		},
		getMaPeriodValue(val) {
			// this.period = val
			// this.tech.ma_period = this.period
			this.tech.ma_period = val
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
		getMaValue: throttle(function (val) {
			this.tech.maPeriod = val

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
		}, 500),
		saveCondition() {
			let checked = true
			let validForm
			if (this.conditionRadio === 'Symbol Close') {
				this.$refs['maForm'].validateField(['period'], (errorMsg) => {
					if (!errorMsg) {
						validForm = true
					}
				})
				let ids = {}
				if (validForm) {
					ids = { ma_category: 'SMA' }
					let tech = JSON.parse(JSON.stringify(this.tech))
					delete tech.ids
					delete tech.ma_period
					delete tech.maPeriod
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
					// this.$message({
					// 	message: 'Please Input Period',
					// 	type: 'error',
					// 	offset: 300
					// })
					checked = false
					return checked
				}
			} else {
				let validMa_Period = false
				let validMaPeriod = false
				this.$refs['maForm'].validateField(['ma_period'], (errorMsg) => {
					if (!errorMsg) {
						validMa_Period = true
					}
				})
				this.$refs['maForm'].validateField(['maPeriod'], (errorMsg) => {
					if (!errorMsg) {
						validMaPeriod = true
					}
				})
				validForm = validMa_Period && validMaPeriod
				if (validForm) {
					let ids = {}
					let tech = {}
					tech = this.tech
					ids = { ma_category: 'SMA' }
					delete tech.ids
					tech = Object.assign(ids, tech)
					tech.criteria = this.criteria
					tech.period = tech.maPeriod
					delete tech.maPeriod
					tech.index = 0
					this.$store.commit('saveCondition', tech)
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = this.description
					this.$store.commit('saveDescription', desObj)
					return checked
				} else {
					// this.$message({
					// 	message: 'Please Input Period',
					// 	type: 'error',
					// 	offset: 300
					// })
					checked = false
					return checked
				}
			}
		},
		// 设置编辑的数据
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				this.clearFormValidate()
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
					this.tech.maPeriod = this.tech.period
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
@media (min-width: 1280px) and (max-width: 1365px) {
	/deep/ .el-form-item__label {
		margin-right: 10px;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	/deep/ .el-form-item__label {
		margin-right: 0px;
	}
	.condition-container {
		display: flex;
		flex-wrap: wrap;
	}
}
</style>