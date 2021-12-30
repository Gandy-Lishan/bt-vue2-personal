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
			<condition-tab @goToFavorite="goToFavorite" :criteria="criteria"></condition-tab>
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
		getDes(val) {
		this.fd.description = val
		this.fd.criteria = "exit"
		this.$store.commit("setFd",this.fd)
	},
	goToFavorite() {
		this.$emit("goToFavorite")
	}
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