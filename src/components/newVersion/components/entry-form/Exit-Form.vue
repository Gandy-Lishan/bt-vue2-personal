<template>
	<div class="entry-form-container">
		<div class="signalLeft">
			<el-form :model="fd" label-width="80px" label-position="left">
				<div>
					<h2 class="note">Criteria Entry Description</h2>
					<el-tooltip
						class="item"
						effect="dark"
						content="Criteria Entry Description"
						placement="bottom-start"
						><i class="iconfont icon-tishi"></i
					></el-tooltip>
				</div>
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
				<div>
					<h2 class="note">Criteria Direction/Frequency</h2>
					<el-tooltip
						class="item"
						effect="dark"
						content="Criteria Direction/Frequency"
						placement="bottom-start"
						><i class="iconfont icon-tishi"></i
					></el-tooltip>
				</div>
				<el-form-item label="Direction:" prop="entryType">
					<el-radio-group v-model="fd.direction" disabled>
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="Frequency:" prop="frequency" class="border-set">
					<el-radio-group v-model="fd.frequency" disabled>
						<el-radio label="Daily">Daily</el-radio>
						<el-radio label="Weekly">Weekly</el-radio>
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
		<div class="signalRight">
			<condition-tab
				@goToFavorite="goToFavorite"
				:criteria="criteria"
			></condition-tab>
		</div>
	</div>
</template>
<script>
import { Store, mapGetters } from 'vuex'
import SignalCode from '@/tools/codeTool.js'
import conditionTab from './condition/Condition-Tab.vue'
import form_base from '@/components/newVersion/components/baisc/from.vue'
import deepClone1 from '@/tools/deepClone.js'
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
				{ label: 'Weekly', value: 'Weekly' },
				{ label: 'Monthly', value: 'Monthly' }
			],
			dialogTableVisible: false,
			conditionFormData: {}
		}
	},
	inject: ['editBacktestData'],
	computed: {
		getEditBacktestData() {
			return this.editBacktestData()
		},
		...mapGetters(['getIsClearForm']),
		isClearForm() {
			return this.getIsClearForm
		}
	},
	watch: {
		isClearForm: {
			handler(newVal) {
				let init = deepClone1(this.$options.data())
				Object.assign(this.$data, init)
			}
		},
		getEditBacktestData: {
			handler(newVal) {
				const data = newVal.exit
				this.fd.description = data.description
				this.fd.direction = data.direction
				this.fd.frequency = data.frequency
				this.signalVisiable = false
			},
			immediate: true,
			deep: true
		},
		fdLoad: {
			handler(newVal) {
				var obj = {
					Long: 'Short',
					Short: 'Long'
				}
				this.fd['direction'] = obj[newVal['direction']]
				this.fd['frequency'] = newVal['frequency']
				this.fd.criteria = 'exit'
				this.$store.commit('setFd', this.fd)
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
			this.fd.criteria = 'exit'
			this.$store.commit('setFd', this.fd)
		},
		goToFavorite() {
			this.$emit('goToFavorite')
		},
		showSignal() {
			this.signalVisiable = !this.signalVisiable
			this.$emit('showBacktestBtn')
		}
	}
}
</script>
<style lang="less" scoped>
.active {
	display: none;
}
@media only screen and (min-width: 1600px) {
	.note {
		display: inline-block;
	}
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