// CCI-Like input box
<template>
	<div class="senti-container">
		<!-- <p class="hint">
			Hint: To change the indicator settings, right click the indicator in the
			above chart and select "Edit Setting"
		</p> -->
		<el-form :model="tech" :rules="rules" ref="cciForm" size="small">
			<div class="condition-container">
				<el-form-item class="indicator-alignment">
					<el-radio
						v-model="conditionRadio"
						label=" Indicator Value"
					></el-radio>
				</el-form-item>
				<div class="conditionSelect">
					<el-form-item>
						<el-select
							v-model="tech.condition"
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
					<el-form-item prop="value">
						<el-input v-model="tech.value" placeholder="Input Value"></el-input>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'cci',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		isRiskControl: Boolean,
		relation: [String, Number],
		score: [String, Number],
		period: [String, Number],
		delay_bars: [String, Number],
		tabLength: Number,
		isLimit: Boolean
	},
	data() {
    var validateValue = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Please input value'));
      } else if (isNaN(value)) {
        return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
      } else {
        // Convert ".X" to "0.X" format
        if (typeof value === 'string' && value.startsWith('.') && value.length > 1) {
          value = '0' + value;
          this.tech.value = value
        }
        const pattern = /^((-?[1-9][0-9]*)|(-?[0]\.\d{1,4}|-?[1-9][0-9]*\.\d{1,4}))$/;
        if (!pattern.test(value) && value != 0) {
          return callback(new Error('Only numbers with a maximum of four decimal places allowed.'));
        } else {
          callback();
        }
      }
    };
		return {
			tech: {
				ids: 'CCI',
				comparison: 'CCI',
				condition: 3,
				value: ''
			},
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			conditionRadio: ' Indicator Value',
			description: '',
			editTechVal: '',
			rules: { value: [{ validator: validateValue, trigger: 'blur' }] }
		}
	},
	computed: {
		...mapGetters(['getterDirection']),
		direction() {
      return this.getterDirection
    }
	},
	methods: {
		clearForm() {
			Object.assign(this.$data, this.$options.data())
			this.$refs.cciForm.resetFields()
		},
		// Clear form authentication
		clearFormValidate() {
			this.$refs.cciForm.clearValidate()
		},
		setDesciption(index) {
			let criteria = ''
			let direction = ''
			let commentDes
			if (index === 0) {
				if (this.criteria.startsWith('entry')) {
					criteria = 'E:'
					direction = this.direction + ':'
				}
				if (this.criteria.startsWith('exit')) {
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
						relation = "Single Condition;"
						break;
					case 2:
						relation = "SameBar Multi Condition;"
						score = 'Score: ' + this.score + ';'
						break
					case 3:
						relation = "TimeOrder Multi Condition;"
            const periodText = !this.isLimit ? 'No Limit' : this.period;
            period = 'Period: ' + periodText + ';'
						break
					default:
						break
				}
				let delay_bars = this.delay_bars
					? 'Delay Bars: ' + this.delay_bars + ';'
					: ''
				commentDes = `${criteria} ${direction} ${relation} ${
					score ? score : ''
				} ${period ? period : ''} ${delay_bars}`
				if (this.relation != 1) {
					let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = {
						'commentDes':commentDes,
						'rocCond':null
					}
					desObj.index = index
					this.$store.commit('form/saveDescription', desObj)
				}
			}
			let techVal = this.techVal ? this.techVal : this.editTechVal
			let period = this.tech.period ? this.tech.period : ''
			let condition = this.conditions[this.tech.condition].label
			this.description = `${techVal} ${period} ${condition} ${this.tech.value}`
			let desObj = {}
			desObj.criteria = this.criteria
			if (this.relation != 1) {
				desObj.description = {
					'commentDes':this.description,
					'rocCond':null
				}
				desObj.index = index + 1
			}
			if (this.relation == 1) {
				desObj.description = {
					'commentDes':commentDes + this.description,
					'rocCond':null
				}
				desObj.index = 0
			}
			this.$store.commit('form/saveDescription', desObj)
		},
		saveCondition(index) {
			let checked = true
			if (this.isRiskControl) {
				return (checked = true)
			}
			let validForm
			this.$refs.cciForm.validate((valid) => {
				validForm = valid
			})
			if (validForm) {
				let tech = JSON.parse(JSON.stringify(this.tech))
				tech.criteria = this.criteria
				tech.index = index
				this.$store.commit('form/saveCondition', tech)
				return checked
			} else {
				checked = false
				return checked
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let obj = newVal[this.criteria].signals[this.panelIndex]
				this.tech.ids = obj.ids
				this.tech.condition = Number(obj.condition)
				this.tech.value = obj.value
				this.tech.comparison = obj.comparison
				this.editTechVal = obj.indicator
        this.clearFormValidate()
			}
		}
	}
}
</script>
<style lang="less" scoped>
.ids-container {
	.el-form-item {
		display: inline-flex;
	}
  display: flex;
  justify-content: space-between;
}
.condition-container {
	display: flex;
  align-items: center;
}
.el-select {
  margin: 0 5px;
}
.el-radio, /deep/ .el-form-item__label {
  margin-right: 5px;
}
.indicator-alignment /deep/ label.el-radio {
  width: 135px;
}
</style>