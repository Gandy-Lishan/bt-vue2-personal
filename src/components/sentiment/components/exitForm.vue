<template>
	<div class="form-container">
		<el-row type="flex" class="main">
			<el-col :xs="24" :sm="12" :md="10" :lg="10" :xl="10">
					<div class="signalLeft">
						<div><p>Name/Description:</p></div>
						<div class="signalLeftForm">
							<!-- signal-dialog -->
							<exit-signal-dialog
								:type="exitData.exitType"
								:dialogTableVisible="dialogTableVisible"
								@openDialog="openExitDialog"
								@setEntryData="setExitData"
							></exit-signal-dialog>
							<el-form
								ref="exitForm"
								:model="exitData"
								:rules="signalFormRules"
								label-position="left"
							>
								<el-form-item label="Name:" prop="name">
									<el-input v-model="exitData.name" size="mini"></el-input>
								</el-form-item>
								<el-form-item label="Description:" prop="description">
									<el-input
										v-model="exitData.description"
										size="mini"
										type="textarea"
										:autosize="{ minRows: 2, maxRows: 8 }"
										resize="none"
									></el-input>
								</el-form-item>
								<el-form-item label="Direction:" size="mini" prop="exitType">
									<div class="selectBox">
										<el-select
											v-model="exitData.exitType"
											@change="selectExitAction(exitData.exitType)"
											placeholder="Please select"
										>
											<el-option
												v-for="item in this.$store.state.customExitType"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											>
											</el-option>
										</el-select>
									</div>
								</el-form-item>
								<el-form-item label="Frequency:" size="mini" prop="frequency">
									<div class="selectBox">
                    <el-input v-model="this.$store.state.exitFrequency" size="mini" disabled></el-input>
									</div>
								</el-form-item>
							</el-form>
						</div>
					</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="14" :lg="14" :xl="14">		
					<div class="condition-container">
						<exit-condition ref="conditionChild" :conditionFormData.sync="conditionFormData" :myType="myExitType"></exit-condition>
						<div class="entryBtnsBox">
						<el-button class="saveBtn"  round @click="saveExitFormData()"
							>Save Signal</el-button
						>
						<el-button class="loadBtn" round v-on:click="openExitDialog"
							>Load Signal</el-button
						>
						<el-button class="removeBtn" round @click="removeExitFormData"
							>Remove Signal</el-button
						>
					</div>
					</div>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import exitSignalDialog from '../../stategy/strategyComponents/exitSignalDialog.vue'
import exitCondition from './exitCondition.vue'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store } from 'vuex'
export default {
	name: 'exitForm',
	data() {
		return {
			exitData: {
				name: '',
				description: '',
				exitType: '',
			},
			// Form validation rules
			signalFormRules: {
				name: [
					{
						required: true,
						message: 'Please enter the name of the signal',
						trigger: 'blur'
					}
				],
				description: [
					{
						required: true,
						message: 'Please enter a description of the signal',
						trigger: 'blur'
					}
				]
			},
			frequencyOption: [
				{ label: 'Daily', value: 'Daily' },
				{ label: 'Weekly', value: 'Weeckly' },
				{ label: 'Monthly', value: 'Monthly' }
			],
			dialogTableVisible: false,
      conditionFormData: {},
			myExitType: ''
		}
	},
	components: { 'exit-condition': exitCondition, 'exit-signal-dialog': exitSignalDialog },
	methods: {
		clearExitFormData() {
      this.exitData.name  = ''
      this.exitData.description  = ''
      this.exitData.frequency  = ''
      this.exitData.exitType  = ''
      this.$refs.conditionChild.clearConditionData()
		},
			removeExitFormData() {
			this.$refs.conditionChild.clearConditionData()
		},	
		async saveExitFormData() {
      this.$refs.conditionChild.getConditionData()
      console.log('condition',this.$store.state.saveConditionFormdata);
      const conditionData = this.$store.state.saveConditionFormdata
      const formData = {}
      const conObj = {}
      const conArr = []
      formData.name = this.exitData.name
      formData.description = this.exitData.description
      formData.type = this.exitData.exitType
      formData.frequency = this.$store.state.exitFrequency
      formData.analysis_basis = conditionData.analysis_basis
      formData.used_indicators = conditionData.used_indicators
      conditionData.conditionList.forEach(obj => {
        for(let key in obj){
          if(obj[key]){
            conObj[key] = obj[key]
          }
        }
      })
      delete conObj.id
      delete conObj.signal
      conArr.push(conObj)
      formData.conditions = JSON.stringify(conArr)
      console.log('保存的exit Data',formData)
      let vm = this
      const { data: res } = await vm.$http.post("/demo/create_signal/", vm.$qs.stringify(formData),{
        auth: {
          username: 'demo01',
          password: 'admin123456'
        }
      })
      if(res.status == 200){
        this.$store.commit('getExitData',formData)
        this.$message.success({
              message: 'Saved successfully',
              duration: 1000
            })
        this.saveStrategy()
      }else {
        this.$message.error({
          message: 'The value of value entered is empty',
          duration: 1000
        })
      }
		},
		openExitDialog() {
			this.dialogTableVisible = !this.dialogTableVisible
		},
		setExitData(data) {
      this.exitData.name = data.name
      this.exitData.description = data.description
      this.exitData.frequency = data.frequency
      this.exitData.exitType = data.type
      this.conditionFormData = {}
      this.conditionFormData = data
      // console.log('condictionData', this.conditionFormData);
		},
    selectExitAction(val) {
      this.$store.commit('getExitTechList',val)
			this.myExitType = val
      this.$refs.conditionChild.getTechDrapDownList()
    },
    // clear exitType
    clearExitType() {
      this.exitData.exitType = ''
    },
    // save strategy
    saveStrategy() {
      const vm = this
      const entryData = this.$store.state.strategyEntryData
      const exitData = this.$store.state.strategyExitData
      const data = {}
      data.name = Math.random().toString(36).slice(-8)
      data.description = Math.random().toString(36)
      data.signal_entry = entryData
      data.signal_exit = exitData
      data.signal_entry.entryAction = entryData.type
      data.signal_exit.exitAction = exitData.type
      const params = {
        name: data.name,
        description: data.description,
        signal_entry: JSON.stringify(data.signal_entry),
        signal_exit: JSON.stringify(data.signal_exit),
        user: ''
      }
    this.$http.post('/demo/strategies/',vm.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {
        vm.$store.commit('getStrategyId',res.data.id)
        if(res.status === 201){
          }else{this.$message.error({
            message: 'The save failed',
            duration: 1000
          })}}).catch(error => {
      console.error(error);
      })
    },
		// show edit backtest data
		getBacktestEditData() {
			const editData = this.$store.state.editBacktestData
			if(Object.keys(editData).length !== 0){
			const data = editData.strategy.signal_exit
      this.exitData.name = data.name
			this.exitData.description = data.description
			this.$store.commit('getFrequency',data.frequency)
      this.exitData.frequency = data.frequency
      this.exitData.exitType = data.type
			this.$refs.conditionChild.setConditionEditData()
			}
		}
	}
}
</script>
<style lang="less" scoped>

@media (min-width:768px)and(max-width:992px){
  // sm size
}
@media (max-width:767px){
  // xs size
  .el-button--warning{
    width: 90% !important;
  }
}

.main {
  margin-top: 20px;
  flex-wrap: wrap;
  // el-form-item__content{
  //   flex:0.8;
  // }
}
.signalLeft {
	margin: 20px 20px;
	border: 2px solid #6c6c6c;
	border-radius: 10px;
	flex-grow: 1;
	padding: 10px;
	
}

.signalLeft .el-form-item__content{
  flex:0.8;
}
.signalRight .el-form-item__content{
  flex:0.8;
}

.signalLeftForm {
  flex: 1;
}
.el-form .el-form-item .el-form-item__label {
	width: 80px !important;
}
.entryBtns{
  flex-wrap: wrap;
}
.entryBtns button{
  display: block;
  width:80%;
  margin: 10px auto;
}
.condition-container {
	flex-grow: 1;
}
.active {
	background-color: 666;
}
.condition-container{
	position: relative;
}
.entryBtnsBox{
	position: absolute;
	top: 122px;
	left: 722px;
	display: flex;
	flex-direction: column;
	height: 200px;
	justify-content: space-between
}
</style>