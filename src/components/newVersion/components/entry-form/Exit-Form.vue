<template>
	<div class="entry-form-container">
		<div class="signalLeft">
			<el-form :model="fd" label-width="80px" label-position="left">
				<div><h2 class="note">Criteria Entry Description</h2></div>
				<el-form-item
					label="Description:"
					prop="description"
					class="border-set"
				>
					<el-input
						v-model="fd.description"
						type="textarea"
						:autosize="{ minRows: 3, maxRows: 10 }"
						resize="none"
						placeholder="Please enter the description"
						@input="getDes"
					></el-input>
				</el-form-item>
				<div><h2 class="note">Criteria Direction/Frequency</h2></div>
				<el-form-item label="Direction:" prop="entryType">
					<el-radio-group v-model="fd.direction" disabled>
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="Frequency:" prop="frequency" class="border-set">
					<el-radio-group v-model="fd.frequency" disabled>
						<el-radio label="Daily">Daily</el-radio>
						<el-radio label="Weeckly">Weeckly</el-radio>
						<el-radio label="Monthly">Monthly</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div class="signalBtnBox">
				<el-button round style="width: 100%"
					>Click Here to Add Criteria Signal</el-button
				>
			</div>
		</div>
		<div class="signalRight">
			<div class="btns">
				<el-button round @click="saveBacktest">Save Backtesst</el-button>
			</div>
			<condition-tab :criteria="criteria"></condition-tab>
		</div>
	</div>
</template>
<script>
import { Store, mapGetters } from 'vuex'
import SignalCode from '@/tools/codeTool.js'
import conditionTab from './condition/Condition-Tab.vue'
import form_base from '@/components/newVersion/components/baisc/from.vue'
export default {
	extends: form_base,
	props: {
		fdLoad: Object
	},
	data() {
		return {
			obj: {
				Long: 'Short',
				Short: 'Long'
			},
			fd: {
				description: '',
				direction: '',
				frequency: '',
				relation: 0,
				score: 0
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
	computed: {
		...mapGetters(['getBacktestEntryFrequency', 'getBacktestEntryDirection']),
		exitFrequency() {
			return this.getBacktestEntryFrequency
		},
		exitDirection() {
			return this.getBacktestEntryDirection
		}
	},
	watch: {
		// exitDirection: {
		// 	handler(newVal) {
		// 		// 数据变化后，绑定 direction， frequency
		// 		this.fd.direction = newVal
		// 		console.log('数据变化', newVal)
		// 		if (newVal=== 'Long') {
		// 			this.fd.direction = 'Short'
		// 		} else if (newVal === 'Short') {
		// 			this.fd.direction = 'Long'
		// 		}
		// 	},
		// 	immediate: true
		// },
		// exitFrequency: {
		// 	handler(newVal) {
		// 		this.fd.frequency = newVal.frequency
		// 	},

		// 	immediate: true
		// },
		fdLoad: {
			handler(newVal) {
				var obj = {
					Long: 'Short',
					Short: 'Long'
				}
				// this.fd = newVal

				this.fd['direction'] = obj[newVal['direction']]
				this.fd['frequency'] = newVal['frequency']
				this.fd.criteria = "exit"
				this.$store.commit("setFd",this.fd)
				// console.log();
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		this.$cookies.set('username', 'test')
	},
	components: {
		'condition-tab': conditionTab
	},
	methods: {
		saveBacktest() {
			console.log('save data', this.$store.state.backtestInfo)
			const backtestData = this.$store.state.backtestInfo
			const signalEntryList = backtestData.entry.signals
			const signalExitList = backtestData.exit.signals
	
			signalEntryList.forEach((item) => {
				if (item.sentimentIndicator) {
					item.indicator = item.sentimentIndicator
					item.analysis = 'Sentiment'
					delete item.technicalIndicator
					delete item.sentimentIndicator
				}
				if (item.technicalIndicator) {
					item.indicator = item.technicalIndicator
					item.analysis = 'Technical'
					delete item.technicalIndicator
					delete item.sentimentIndicator
				}
			})
			signalExitList.forEach((item) => {
				if (item.sentimentIndicator) {
					item.indicator = item.sentimentIndicator
					item.analysis = 'Sentiment'
					delete item.technicalIndicator
					delete item.sentimentIndicator
				}
				if (item.technicalIndicator) {
					item.indicator = item.technicalIndicator
					item.analysis = 'Technical'
					delete item.technicalIndicator
					delete item.sentimentIndicator
				}
			})
			const b = new SignalCode()
			var entry_signal_list = []
			var exit_signal_list  = []
			delete backtestData.entry.signals
			for (var i in signalEntryList) {
				let code = b.encode(signalEntryList[i])
				var singal = {
					"code":code,
				}
				entry_signal_list.push(singal)
				// backtestData.entry = {signalList}
				// backtestData.entry = [{description: 'entry test', code: ""}]
				// backtestData.entry[0].code = code
			}
			delete backtestData.exit.signals
			for (var i in signalExitList) {
				let code = b.encode(signalExitList[i])
				var singal = {
					"code":code,
				}
				exit_signal_list.push(singal)

				// delete backtestData.exit.description
				// delete backtestData.exit.frequency
				// backtestData.exit = [{description: 'exit test', code: ""}]
				// backtestData.exit[0].code = code
			}
			let entry = {
				description : backtestData.entry.description,
				direction : backtestData.entry.direction,
				frequency : backtestData.entry.frequency,
				signals : entry_signal_list,

			}
			let exit  = {
				description : backtestData.exit.description,
				direction : backtestData.exit.direction,
				frequency : backtestData.exit.frequency,
				signals : exit_signal_list,

			}
			delete backtestData.entry
			delete backtestData.exit

			backtestData.entry = JSON.stringify(entry)
			backtestData.exit = JSON.stringify(exit)

			console.log('保存的backtest信息', backtestData)
			 this.$http.post('/dev/backtest/',this.$qs.stringify(backtestData),{
					withCredentials: true
				}).then(res => {console.log("相应数据", res);})
		},
		getDes(val) {
		this.fd.description = val
		this.fd.criteria = "exit"
		this.$store.commit("setFd",this.fd)
	},
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.entry-form-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.signalLeft,
	.signalRight {
		border: 1px solid black;
		border-radius: 5px;
		width: 47%;
		padding: 10px;
	}
	.signalRight {
		padding-top: 30px;
	}
	.border-set {
		border-bottom: 1px solid black;
		padding-bottom: 15px;
	}
	.signalBtnBox {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.btns {
		position: absolute;
		top: -66px;
		left: 502px;
	}
	.signalRight {
		position: relative;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.entry-form-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.signalLeft,
	.signalRight {
		border: 1px solid black;
		border-radius: 5px;
		width: 47%;
		padding: 10px;
	}
	.signalRight {
		padding-top: 30px;
	}
	.border-set {
		border-bottom: 1px solid black;
		padding-bottom: 15px;
	}
	.signalBtnBox {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>