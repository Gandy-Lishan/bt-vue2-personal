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
				<el-form-item
						style="diaplay: inline"
						effect="light"
						content="Compare with indicator value"
						placement="bottom"
					>
					<el-radio v-model="radio" label=" " @change="setRadio"></el-radio>
						<el-select
							v-model="tech.comparison"
							size="mini"
							filterable
							:disabled="!(radio === ' ')"
							@change="getRadioSelect"
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
					<el-form-item
							style="diaplay: inline"
							effect="light"
							content="The way of comparing between comparison and value"
							placement="bottom"
						>
							<el-select
								v-model="tech.condition"
								:disabled="!(radio === ' ')"
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
								:disabled="!(radio === ' ')"
								@input="getSCvalue"
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
						@change="setRadio"
					></el-radio>
				</el-form-item>
				<div class="conditionInput">
					<el-form-item prop="ma_period">

							<el-input
								:disabled="!(radio === 'Moving Average')"
								v-model="tech.ma_period"
								placeholder="Input Period"
								@input="getMaPeriodValue"
							></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect">
					<el-form-item>
							<el-select
								v-model="tech.condition"
								filterable
								size="mini"
								:disabled="!(radio === 'Moving Average')"
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
								:disabled="!(radio === 'Moving Average')"
								placeholder="Input Period"
								@input="getMaValue"
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
const throttle = require('lodash/throttle')
export default {
	name: 'ma',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		direction: String,
		isActived: Boolean,
		exitItemCheck: Boolean,
		relation: [String, Number],
		score: [String, Number],
		period: [String, Number],
		delay_bars: [String, Number],
		tabLength: Number,

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
			radio: ' ',
			maRadio: 'SMA',
			description: '',
			editTechVal: '',
			radioConditions: [
				{ value: 'SC', label: 'Symbol Close' },
				{ value: 'SH', label: 'Symbol High' },
				{ value: 'SO', label: 'Symbol Open' },
				{ value: 'SL', label: 'Symbol Low' }
			],
			rules: {
				period: [{ validator: validatePeriod, trigger: 'blur' }],
				ma_period: [{ validator: validateMaPeriod, trigger: 'blur' }],
				maPeriod: [{ validator: validateMaPeriodRule, trigger: 'blur' }]
			}
		}
	},
	watch: {
		isActived: {
			handler(newVal) {
				if (newVal) {
					var obj = CIQ.store.state.conditionRadio
					obj[this.criteria][this.panelIndex] = this.radio
					//console.log('handle MA,',obj)
					CIQ.store.commit('setConditionRadio', obj)
				}
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
		setRadio(val) {
			this.clearFormValidate()
			var obj = CIQ.store.state.conditionRadio
			obj[this.criteria][this.panelIndex] = val
			console.log('MA radio change,', obj)
			CIQ.store.commit('setConditionRadio', obj)
			if (val === 'Moving Average') {
				// 添加附属ma
				this.tech.ma_period = 5
				this.tech.comparison = 'MA'
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
				this.tech.comparison = 'SC'
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
		},
		getRadioSelect(val) {
			// var obj = CIQ.store.state.conditionRadio
			// obj[this.criteria][this.panelIndex] = val
			// //console.log('MA radio change,',obj)
			// CIQ.store.commit('setConditionRadio', obj)
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
		},
		setDesciption(index) {
			let criteria = ''
			let direction = ''
			let commentDes
			if (index === 0) {
				if (this.criteria == 'entry') {
					criteria = 'E:'
					direction = this.direction + ':'
				}
				if (this.criteria == 'exit') {
					criteria = 'X:'

					if (this.direction == 'Long') {
						direction = 'Close:'
					} else if (this.direction == 'Short') {
						direction = 'Cover:'
					}
				}
				let relation = ''
				let score = ''
				let period = ''
				switch (this.relation) {
					case 0:
						relation = 'Only Risk;'
						break
					case 1:
						relation = 'Single Signal;'
						break
					case 2:
						relation = 'SameBar Multi Signal;'
						score = 'Score: ' + this.score + ';'
						break
					case 3:
						relation = 'TimeOrder Multi Signal;'
						period = 'Period: ' + this.period + ';'
						break
					default:
						break
				}
				let delay_bars = this.delay_bars ? 'Delay Bars: ' + this.delay_bars + ';' : ''
				commentDes = `${criteria} ${direction} ${relation} ${
					score ? score : ''
				} ${period ? period : ''} ${delay_bars}`
				if(this.relation != 1) {
				let desObj = {}
				desObj.criteria = this.criteria
				desObj.description = commentDes
				desObj.index = index
				this.$store.commit('saveDescription', desObj)}
			}
				let techVal = this.techVal ? this.techVal : this.editTechVal
				let period =
					this.radio !== 'Moving Average'
						? this.tech.period
						: this.tech.maPeriod
				let ma_period =
					this.radio == 'Moving Average' ? this.tech.ma_period : ''
				let conditionRadio =
					this.radio == ' ' ? this.tech.comparison : this.radio
				let comparison
				switch (this.tech.comparison) {
					case 'SC':
						comparison = 'Symbol Close'
						break
					case 'SH':
						comparison = 'Symbol High'
						break
					case 'SL':
						comparison = 'Symbol Low'
						break
					case 'SO':
						comparison = 'Symbol Open'
						break
					case 'MA':
						comparison = 'Moving Average'
						break
					default:
						break
				}
				let condition = this.conditions[this.tech.condition].label
				this.description = `${comparison} ${ma_period} ${condition} Moving Average ${period}`

				let desObj = {}
				desObj.criteria = this.criteria
				if(this.relation != 1) {
					desObj.description = this.description
					desObj.index = index + 1
					}
				if(this.relation == 1) {
						desObj.description = commentDes + this.description
						desObj.index = 0
				}
				this.$store.commit('saveDescription', desObj)
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
			if (this.radio == 'Moving Average') {
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
			if (this.tech.comparison === 'Symbol Close') {
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
			if (this.exitItemCheck) {
				return (checked = true)
			}
			let validForm
			if (this.radio !== 'Moving Average') {
				this.$refs['maForm'].validateField(['period'], (errorMsg) => {
					if (!errorMsg) {
						validForm = true
					}
				})
				if (validForm) {
					let tech = JSON.parse(JSON.stringify(this.tech))
					delete tech.ma_period
					delete tech.maPeriod
					tech.criteria = this.criteria
					tech.index = index
					this.$store.commit('saveCondition', tech)
					return checked
				} else {
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
					tech.period = tech.maPeriod
					delete tech.maPeriod
					tech.criteria = this.criteria
					tech.index = index
					this.$store.commit('saveCondition', tech)
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
								this.clearForm()

				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.comparison = obj.comparison
				if (this.tech.comparison === 'MA') {
					this.radio = 'Moving Average'
					this.tech.ma_period = obj.ma_period
					this.tech.maPeriod = obj.period
					this.getMaPeriodValue(obj.ma_period)
					this.getMaValue(obj.period)
				} else {
					this.radio = ' '
					this.tech.period = obj.period
					this.getSCvalue(this.tech.period)
				}
				this.editTechVal = obj.indicator
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