<template>
	<div class="form-container">
		<el-row type="flex" class="main">
			<el-col :xs="24" :sm="12" :md="10" :lg="10" :xl="10">
				<div class="signalLeft">
					<div><p>Name/Description:</p></div>
					<div class="signalLeftForm">
						<!-- signal-dialog -->
						<entry-signal-dialog
							:type="entryData.entryType"
							:dialogTableVisible="dialogTableVisible"
							@openDialog="openEntryDialog"
							@setEntryData="setEntryData"
						></entry-signal-dialog>
						<el-form
							ref="entryForm"
							:model="entryData"
							:rules="signalFormRules"
							label-position="left"
						>
							<el-form-item label="Name:" prop="name">
								<el-input v-model="entryData.name" size="mini"></el-input>
							</el-form-item>
							<el-form-item label="Description:" prop="description">
								<el-input
									v-model="entryData.description"
									size="mini"
									type="textarea"
									:autosize="{ minRows: 2, maxRows: 8 }"
									resize="none"
								></el-input>
							</el-form-item>
							<el-form-item label="Direction:" size="mini" prop="entryType">
								<div class="selectBox">
									<el-select
										v-model="entryData.entryType"
										@change="selectEntryAction(entryData.entryType)"
										placeholder="Please select"
									>
										<el-option
											v-for="item in entryTypeOption"
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
									<el-select
										v-model="entryData.frequency"
										@change="selectFrequencyAction(entryData.frequency)"
										placeholder="Please select"
									>
										<el-option
											v-for="item in frequencyOption"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="14" :lg="14" :xl="14">
				<div class="condition-container">
					<entry-condition
						ref="conditionChild"
						:conditionFormData.sync="conditionFormData"
					></entry-condition>
				</div>
			</el-col>
		</el-row>

		<el-row class="entryBtns" type="flex">
			<el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
				<el-button type="info" @click="clearEntryFormData"
					>Clear Entry Signal</el-button
				>
			</el-col>
			<el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
				<el-button type="primary" @click="saveEntryFormData()"
					>Save Entry Signal</el-button
				>
			</el-col>
			<el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
				<el-button type="warning" v-on:click="openEntryDialog"
					>Load Entry Signal</el-button
				>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import entrySignalDialog from '../../stategy/strategyComponents/entrySignalDialog.vue'
import entryCondition from './entryCondition.vue'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
export default {
	name: 'entryForm',
	// props: { signalFormTagName: String, exitLabel: Array},
	data() {
		return {
			entryData: {
				name: '',
				description: '',
				entryType: '',
				frequency: ''
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
			entryTypeOption: [
				{ label: 'Long', value: 'long' },
				{ label: 'Short', value: 'short' }
			],
			frequencyOption: [
				{ label: 'Daily', value: 'Daily' },
				{ label: 'Weekly', value: 'Weeckly' },
				{ label: 'Monthly', value: 'Monthly' }
			],
			dialogTableVisible: false,
			conditionFormData: {}
		}
	},
	components: {
		'entry-condition': entryCondition,
		'entry-signal-dialog': entrySignalDialog
	},
	created() {
		// this.loadSentimentList()
	},
	methods: {
		async loadSentimentList() {
			const vm = this
			const res = await vm.$http.get(
				'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
				{
					auth: {
						username: 'sentimentrader_backtest_api',
						password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
					}
				}
			)
			this.$store.commit('getIndicatorsList', res.data)
		},
		clearEntryFormData() {
			this.entryData.name = ''
			this.entryData.description = ''
			this.entryData.frequency = ''
			this.entryData.entryType = ''
			this.$refs.conditionChild.clearConditionData()

			this.$store.commit('getEntryIndicators','')
			CIQ.addIndicators()
		},
		async saveEntryFormData() {
			this.$refs.conditionChild.getConditionData()
			console.log('condition', this.$store.state.saveConditionFormdata)
			const conditionData = this.$store.state.saveConditionFormdata
			const formData = {}
			const conObj = {}
			const conArr = []
			formData.name = this.entryData.name
			formData.description = this.entryData.description
			formData.type = this.entryData.entryType
			formData.frequency = this.entryData.frequency
			formData.analysis_basis = conditionData.analysis_basis
			formData.used_indicators = conditionData.used_indicators
			conditionData.conditionList.forEach((obj) => {
				for (let key in obj) {
					if (obj[key]) {
						conObj[key] = obj[key]
					}
				}
			})
			delete conObj.id
			delete conObj.signal
			conArr.push(conObj)
			formData.conditions = JSON.stringify(conArr)
			console.log('保存的Entry Data', formData)
			let vm = this
			const { data: res } = await vm.$http.post(
				'/demo/create_signal/',
				vm.$qs.stringify(formData),
				{
					auth: {
						username: 'demo01',
						password: 'admin123456'
					}
				}
			)
			if (res.status == 200) {
				this.$store.commit('getEntryData', formData)
				this.$message.success({
					message: 'Saved successfully',
					duration: 1000
				})
				this.$emit('goToExitFormData')
			} else {
				this.$message.error({
					message: 'The value of value entered is empty',
					duration: 1000
				})
			}
		},
		openEntryDialog() {
			this.dialogTableVisible = !this.dialogTableVisible
		},
		setEntryData(data) {
			this.entryData.name = data.name
			this.entryData.description = data.description
			this.entryData.frequency = data.frequency
			this.entryData.entryType = data.type
			this.conditionFormData = {}
			this.conditionFormData = data
			// console.log('condictionData', this.conditionFormData);
		},
		selectEntryAction(val) {
			this.$store.commit('getEntryType', val)
			this.$store.commit('getExitType', val)
			// clear exitType
			this.$emit('clearExitType')
		},
		selectFrequencyAction(val) {
			this.$store.commit('getFrequency', val)
		}
	}
}
</script>
<style lang="less" scoped>
@media (min-width: 768px) and(max-width:992px) {
	// sm size
}
@media (max-width: 767px) {
	// xs size
	.el-button--warning {
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

.signalLeft .el-form .el-form-item .el-form-item__content {
	flex: 1;
}
.signalRight .el-form-item__content {
	flex: 1;
}

.signalLeftForm {
	flex: 1;
}
.el-form .el-form-item .el-form-item__label {
	width: 80px !important;
}
.entryBtns {
	flex-wrap: wrap;
}
.entryBtns button {
	display: block;
	width: 80%;
	margin: 10px auto;
}
.condition-container {
	flex-grow: 1;
}
.active {
	background-color: 666;
}
</style>