// symbol indicator input box
<template>
	<div class="senti-container">
		<el-form :model="tech" ref="symbolForm">
			<div class="condition-container">
				<el-form-item>
					<el-select 
						v-model="tech.rocCondition"
						placeholder="Please select condition"
						@change="SymbolConditionChange"
					>
						<el-option
							v-for="item in ROCConditions"
							:key="item.value"
							:label="item.obj.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<div class="conditionSelect new">
					<el-form-item>
						<el-select
							v-model="tech.newCondition"
							class='newCond'
							filterable
							placeholder="Please select condition"
							@change="ROCLikeChange"
						>
							<el-option
								v-for="item in newConditions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="conditionInput period" v-show="isROCLike">
					<el-form-item prop="value">
						<el-input
							@input="calculateNewConditions"
							v-model="tech.conditionPeriod"
							placeholder="Condition Period"
						></el-input>
					</el-form-item>
				</div>
				<div class="conditionSelect" v-show="isROCLike">
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
						 
						<el-input
							v-model="tech.value"
							placeholder="Input Value"
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
	name: 'symbol',
	props: {
		criteria: String,
		techUrl: String,
		techVal: String,
		panelIndex: Number,
		direction: String,
		exitItemCheck: Boolean,
		relation: [String, Number],
		score: [String, Number],
		period: [String, Number],
		delay_bars: [String, Number],
		tabLength: Number,
	},
	data() {
		return {
			isROCLike: false,
			ROCConditions : [
				{ value: 0, obj: {label:'Symbol Open',field:'Open'} },
				{ value: 1, obj: {label:'Symbol High',field:'High'} },
				{ value: 2, obj: {label:'Symbol Low',field:'Low'} },
				{ value: 3, obj: {label:'Symbol Close',field:'Close'} },
				{ value: 4, obj: {label:'Symbol Volume',field:'Volume'} },
			],
			//preload: false,
			tech: {
				ids: 'CCI',
				comparison: 'CCI',
				condition: 3,
				newCondition: 3,
				value: '',
				conditionPeriod: '5',
				rocCondition: 0,
			},
			newConditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' },
				{ value: 5, label: 'Rate Of Change' },
				{ value: 6, label: 'Range Of Rank' },
				{ value: 7, label: 'MA Ratio' }
			],
			conditions: [
				{ value: 0, label: '>' },
				{ value: 1, label: '=' },
				{ value: 2, label: '<' },
				{ value: 3, label: 'CrossAbove' },
				{ value: 4, label: 'CrossBelow' }
			],
			description: '',
			editTechVal: '',
		}
	},
	methods: {
		ROCLikeChange(val){
			this.isROCLike = 5<=val && val<=7
			// 如果不是ROC类型，则这两个condition值一致
			if(!this.isROCLike){
				this.tech.condition = this.tech.newCondition
			}
			// 开始计算数据并加载新的附属indicator
			this.calculateNewConditions()
		},
		SymbolConditionChange(){
			// 如果不是ROC类型，则这两个condition值一致
			if(this.isROCLike){
				// 开始计算数据并加载新的附属indicator
				this.calculateNewConditions()
			}	
		},
		change(e) {
			this.$forceUpdate()
		},
		clearForm() {
			this.$refs.symbolForm.resetFields()
		},
		// Clear form authentication
		clearFormValidate() {
			this.$refs.symbolForm.clearValidate()
		},
		setDesciption(index) {
			let rocCond = {
				'newCondition':this.tech.newCondition,
				'conditionPeriod':this.tech.conditionPeriod,
				'rocCondition':this.tech.rocCondition
			}
			let criteria = ''
			let direction = ''
			let commentDes
			if(index === 0) {
				if (this.criteria == 'entry') {
					criteria = 'E:'
					direction = this.direction + ';'
				}
				if (this.criteria == 'exit') {
					criteria = 'X:'
					if (this.direction == 'Long') {
						direction = 'Close;'
					} else if (this.direction == 'Short') {
						direction = 'Cover;'
					}
				}
				let relation = ''
				let score = ''
				let period = ''
				switch (this.relation) {
					case 0:
						relation = "Only Risk;"
						break;
					case 1:
						relation = "Single Signal"
						break;
					case 2:
						relation = "SameBar Multi Signal;"
						score = 'Score: ' + this.score + ';'
						break;
					case 3:
						relation = "TimeOrder Multi Signal;"
						period = 'Period: ' + this.period+ ';'
						break;
					default:
						break;
				}
				let delay_bars = this.delay_bars?'Delay Bars: ' + this.delay_bars + ';':''
				commentDes = `${criteria} ${direction} ${relation} ${score?score:''} ${period?period:''} ${delay_bars}`
				
				if(this.relation != 1) {
				   let desObj = {}
					desObj.criteria = this.criteria
					desObj.description = {
						'commentDes':commentDes,
						'rocCond':rocCond
					}
					desObj.index = index

					console.log('this.relation != 1',this.criteria,desObj)
					this.$store.commit('saveDescription', desObj)
				}

			}
			let period = this.tech.period ? this.tech.period : ''
			let condition = this.conditions[this.tech.condition].label
			let techVal = this.techVal ? this.techVal : this.editTechVal
			this.description = `${techVal} ${period} ${condition} ${this.tech.value}`

					let desObj = {}
					desObj.criteria = this.criteria
					if(this.relation != 1) {
						desObj.description = {
							'commentDes':this.description,
							'rocCond':rocCond
						}
						desObj.index = index + 1
					}
					if(this.relation == 1) {
						desObj.description = {
							'commentDes':commentDes+ this.description,
							'rocCond':rocCond
						}
						desObj.index = 0
					}
					console.log('saveDescription',desObj,this.criteria)
					this.$store.commit('saveDescription', desObj)

		},
		calculateNewConditions(){
			if(!this.isROCLike) return

			// let indicator_url = this.$store.state.indicators.formIndicators[this.criteria][this.panelIndex]
			// if(indicator_url){
				// for (var studyInstanceName in CIQ.stxx.layout.studies) {
				// 	if (
				// 		CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == indicator_url
				// 	) {
				// 		// 添加ROCLike（包括修改study）前先清除已有的
				// 		CIQ.Studies.removeStudy(
				// 			CIQ.stxx,
				// 			CIQ.stxx.layout.studies[studyInstanceName]
				// 		)
				// 	}
				// }
				const conditionMap = new Map([
					[5, {name:'Rate Of Change',abbr:'ROC'}],
					[6, {name:'Range Of Rank',abbr:'ROR'}],
					[7, {name:'MA Ratio',abbr:'MA'}]
				])
				const fieldName = this.ROCConditions.find(item=>item.value==this.tech.rocCondition).obj.field
				var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST ROCLike', {
					display: conditionMap.get(this.tech.newCondition).name,
					Field: fieldName,
					condition:conditionMap.get(this.tech.newCondition).abbr,
					period:this.tech.conditionPeriod
				})
				console.log(sd)
			//}
		},
		saveCondition(index) {
			let checked = true
			let validForm
			if (!this.exitItemCheck) {
				this.$refs['symbolForm'].validateField(['value'], (errorMsg) => {
					if (!errorMsg) {
						validForm = true
					}
				})
				if (validForm) {
					let tech = JSON.parse(JSON.stringify(this.tech))
					tech.criteria = this.criteria
					tech.index = index
					// 定义一个 vuex 新事件用于保存 condition数据
					this.$store.commit('saveCondition', tech)
					return checked
				} else {
					checked = false
					return checked
				}
			}
			if(this.exitItemCheck) {
				return checked = true
			}
		},
		setEditData(newVal) {
			if (JSON.stringify(newVal) != '{}') {
				let obj = newVal[this.criteria].signals[this.panelIndex]
				// test在samebar(relation 2/3)的情况下
				let cond = newVal[this.criteria].cond[(this.relation==2||this.relation==3)?this.panelIndex+1:this.panelIndex]
				this.tech.condition = Number(obj.condition)
				this.tech.value = obj.value
				this.tech.comparison = obj.comparison

				this.tech.newCondition = Number(cond.newCondition)?Number(cond.newCondition):this.tech.condition
				this.tech.conditionPeriod = cond.conditionPeriod?cond.conditionPeriod:''
				this.tech.rocCondition = Number(cond.rocCondition)?Number(cond.rocCondition):0
				this.editTechVal = obj.indicator
				this.ROCLikeChange(this.tech.newCondition)
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
	border-bottom: 1px solid #797979;
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
		font-size: 12px;
	}
	.condition-container {
		display: flex;
		flex-wrap: wrap;
	}
}
</style>