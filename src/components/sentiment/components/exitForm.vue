<template>
	<div class="form-container">
		<el-row>
			<el-col :span="20">
				<div class="signal-container">
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
					<div class="condition-container">
						<exit-condition ref="conditionChild" :conditionFormData.sync="conditionFormData"></exit-condition>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="16">
				<div class="exitBtns">
					<el-button type="info" @click="clearExitFormData"
						>Clear Exit Signal</el-button
					>
					<el-button type="primary" @click="saveExitFormData()"
						>Save Exit Signal</el-button
					>
					<el-button type="warning" v-on:click="openExitDialog"
						>Load Exit Signal</el-button
					>
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
      conditionFormData: {}
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
    }
	}
}
</script>
<style lang="less" scoped>
.form-container {
	margin-top: 20px;
}
.signal-container {
	display: flex;
	flex-direction: row;
}
.signalLeft {
	margin-right: 20px;
	border: 2px solid #6c6c6c;
	border-radius: 10px;
	flex-grow: 1;
	padding: 10px;
}
.el-form .el-form-item .el-form-item__label {
	width: 80px !important;
}
.exitBtns button {
	margin: 30px 75px 0px 75px;
}
.condition-container {
	flex-grow: 1;
}
.active {
	background-color: 666;
}
</style>