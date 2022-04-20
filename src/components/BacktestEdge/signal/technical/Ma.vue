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
						v-model="radio"
						label=" "
						@change="getRadioValue"
					></el-radio>
					<el-select
						v-model="conditionRadio"
						size="mini"
						filterable
						:disabled="disabled"
						@change="getConditionRadio"
						placeholder="Please select condition"
					>
						<el-option
							v-for="item in radioConditions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
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
						v-model="radio"
						label="Moving Average"
						@change="getRadioValue"
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
		panelIndex: Number,
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
				ids: 'SMA',
				condition: 3,
				comparison: 'SC',
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
			radio: ' ',
			disabled: false,
			maRadio: 'SMA',
			maPeriod: 20,
			description: '',
			editTechVal: '',
			emptyRadio: ' ',
			radioConditions: [
				{ value: 'Symbol Close', label: 'Symbol Close' },
				{ value: 'Symbol High', label: 'Symbol High' },
				{ value: 'Symbol Open', label: 'Symbol Open' },
				{ value: 'Symbol Low', label: 'Symbol Low' }
			],
			rules: {
				period: [{ validator: validatePeriod, trigger: 'blur' }],
				ma_period: [{ validator: validateMaPeriod, trigger: 'blur' }],
				maPeriod: [{ validator: validateMaPeriodRule, trigger: 'blur' }]
			}
		}
	},
	watch: {
		techVal: {
			handler(newVal) {
				var obj = CIQ.store.state.conditionRadio
				obj.MovingAverage_like = this.conditionRadio
				CIQ.store.commit('setConditionRadio', obj)
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		clearForm() {
			this.$refs.maForm.resetFields()
		},
		// 清除表单认证
		clearFormValidate() {
			this.$refs.maForm.clearValidate()
		},
		getRadioValue(val) {
			this.clearFormValidate()
			if (val === 'Moving Average') {
				// 添加附属ma
				this.disabled = !this.disabled
				this.tech.ma_period = 5
				this.tech.comparison = 'MA'
				this.tech.maPeriod = this.tech.period
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
			if (val === ' ') {
				this.conditionRadio = 'Symbol Close'
				if ('ma_period' in this.tech) {
					delete this.tech.ma_period
					delete this.tech.maPeriod
				}
				this.tech.comparison = 'SC'
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
			}
			this.setDesciption()
		},
		getConditionRadio(val) {
			this.conditionRadio = val
			this.clearFormValidate()
			var obj = CIQ.store.state.conditionRadio
			obj.MovingAverage_like = val
			CIQ.store.commit('setConditionRadio', obj)
			if (val === 'Symbol Close') {
				if ('ma_period' in this.tech) {
					delete this.tech.ma_period
					delete this.tech.maPeriod
				}
				this.tech.comparison = 'SC'
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
				//CIQ.exportEx()
				// keep current MA
				var objMA = {
					period: this.tech.ma_period,
					url: 'ma',
					type: this.maRadio
				}
				var activatedMAList = this.$store.state.activatedMA

				// remove current MA attached to an indicator
				var activatedMAList = this.$store.state.activatedMA
				var MAListIndex = activatedMAList.findIndex((item) => item.url == 'ma')
				if (MAListIndex != -1) {
					activatedMAList.splice(MAListIndex, 1)
				}
				this.$store.commit('getMA', activatedMAList)
			}
			if (val === 'Symbol High') {
			}
			if (val === 'Symbol Open') {
			}
			if (val === 'Symbol Low') {
			}
			this.setDesciption()
		},
		setDesciption(index) {
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
			let conditionRadio = this.radio == ' ' ? this.conditionRadio : this.radio
			let condition = this.conditions[this.tech.condition].label
			this.description = `${criteria} ${direction} ${conditionRadio} ${ma_period} ${condition} Moving Average ${period}`
		},
		getMaPeriodValue(val) {
			this.tech.ma_period = val
			for (var studyInstanceName in CIQ.stxx.layout.studies) {
				var sd = CIQ.stxx.layout.studies[studyInstanceName]
				if (sd.type == 'ST MA' && sd.panel == 'chart') {
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
		saveCondition(index) {
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
					let tech = JSON.parse(JSON.stringify(this.tech))
					tech.criteria = this.criteria
					tech.index = index
					this.$store.commit('saveCondition', tech)
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.index = index
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
					let tech = JSON.parse(JSON.stringify(this.tech))
					tech.criteria = this.criteria
					tech.index = index
					this.$store.commit('saveCondition', tech)
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = this.description
					desObj.index = index
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
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.period = obj.period
				this.tech.maPeriod = obj.period
				this.tech.comparison = obj.comparison
				if (this.tech.comparison === 'MA') {
					this.radio = 'Moving Average'
					this.disabled = true
					this.tech.ma_period = obj.ma_period
					this.getMaPeriodValue(obj.ma_period)
					this.getMaValue(obj.period)
				} else {
					this.radio = ' '
					switch (this.tech.comparison) {
						case 'SC':
							this.conditionRadio = 'Symbol Close'
							break
						case 'SH':
							this.conditionRadio = 'Symbol High'
							break
						case 'SO':
							this.conditionRadio = 'Symbol Open'
							break
						case 'SL':
							this.conditionRadio = 'Symbol Low'
							break
					}
					this.disabled = false
					this.getSCvalue(this.tech.period)
				}
				this.editTechVal = obj.indicator
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
/deep/ .el-radio {
	margin-right: -3px;
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