<template>
	<el-row>
		<el-col :span="24">
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
							<el-radio-group
								v-model="fd.direction"
								@change="getEntryDirection"
							>
								<el-radio label="Long">Long</el-radio>
								<el-radio label="Short">Short</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item
							label="Frequency:"
							prop="frequency"
							class="border-set"
						>
							<el-radio-group v-model="fd.frequency" @change="getFrequency">
								<el-radio label="Daily">Daily</el-radio>
								<el-radio label="Weeckly">Weeckly</el-radio>
								<el-radio label="Monthly">Monthly</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-form>
					<div class="signalBtnBox">
						<el-button round style="width: 100%" @click="showSignal"
							>Click Here to Add Criteria Signal</el-button
						>
					</div>
				</div>
				<div class="signalRight" :class="signalVisiable ? 'active' : ''">
					<condition-tab
						:entrySignalEditData="entrySignalEditData"
						:criteria="criteria"
					></condition-tab>
				</div>
			</div>
		</el-col>
	</el-row>
</template>
<script>
import conditionTab from './condition/Condition-Tab.vue'
import { Store, mapGetters } from 'vuex'
// import base from "@/components/newVersion/components/baisc/sgnial-baisc.vue"
import SignalCode, { SingaCode } from '@/tools/codeTool'
import form_base from '@/components/newVersion/components/baisc/from.vue'
import { throttle } from '@/tools/throttle.js'
export default {
	extends: form_base,
	props: {
		fdLoad: Object,
		editData: Object
	},
	inject: ['editEntryData'],
	data() {
		return {
			fd: {
				description: '',
				direction: '',
				frequency: '',
				relation: 0,
				score: 0,
				criteria: 'entry'
			},
			entrySignalEditData: {},
			signalVisiable: true,
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
	watch: {
		"this.editEntryData": {
			handler(newVal) {
				console.log("inject",newVal);
			},
			immediate: true,
			deep: true
		},
		editData: {
			handler(newVal) {
				console.log('entryData', newVal)
				var code = new SignalCode()
				this.fd = Object.assign(this.fd, newVal)
				for (var i = 0; i < this.fd.signals.length; i++) {
					var tmp = code.decode(this.fd.signals[i].code)
					this.fd.signals[i] = Object.assign(this.fd.signals[i], tmp)
				}
				this.entrySignalEditData = newVal
			},
			immediate: true,
			deep: true
		},
		fdLoad: {
			handler(newVal) {
				this.fd = newVal
			},
			immediate: true,
			deep: true
		}
	},
	components: {
		'condition-tab': conditionTab
	},
	methods: {
		getEntryDirection(val) {
			this.$store.commit('getEntryDirection', val)

			this.fd.direction = val
			this.fd.criteria = 'entry'
			this.$store.commit('setFd', this.fd)
		},
		getFrequency(e) {
			this.$store.commit('getFrequency', e)
		},
		getDes: throttle(function (val) {
			this.fd.description = val
			this.fd.criteria = 'entry'
			this.$store.commit('setFd', this.fd)
		}, 3000),
		getFrequency(val) {
			console.log(val)
			this.fd.frequency = val
			this.fd.criteria = 'entry'
			this.$store.commit('setFd', this.fd)
		},
		showSignal() {
			this.signalVisiable = !this.signalVisiable
		}
	}
}
</script>
<style lang="less" scoped>
.active {
	display: none;
}
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