<template>
	<el-row>
		<el-col :span="24">
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
							<el-radio-group v-model="fd.direction" @change="getExitDirection">
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
								<el-radio label="Daily"
									>Daily</el-radio
								>
								<el-radio label="Weekly"
									>Weekly</el-radio
								>
								<el-radio label="Monthly"
									>Monthly</el-radio
								>
							</el-radio-group>
						</el-form-item>
					</el-form>
					<!-- <div class="signalBtnBox">
						<el-button round style="width: 100%" @click="showSignal"
							>Click Here to Add Criteria Signal</el-button
						>
					</div> -->
				</div>
				<div class="signalRight">
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
// import { throttle } from '@/tools/throttle.js'
import deepClone1 from '@/tools/deepClone.js'
const _ = require('lodash')
const throttle = _.throttle
export default {
	extends: form_base,
	props: {
		fdLoad: Object,
		editData: Object
	},
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
			sentimentIndicatorList: [],
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
				{ label: 'Weekly', value: 'Weekly' },
				{ label: 'Monthly', value: 'Monthly' }
			],
			dialogTableVisible: false,
			conditionFormData: {}
		}
	},
	inject: ['editBacktestData'],
	computed: {
		...mapGetters(['getIsClearForm']),
		isClearForm() {
			return this.getIsClearForm
		},
		getEditBacktestData() {
			return this.editBacktestData()
		},
		updateFreq() {
			return this.$store.state.pairDataFreq
		}

		// updateFreq () {
		// 	return this.$store.state.pairDataFreq
		// }
	},
	mounted() {
		this.getIndicatorsList()
	},
	mounted() {
		this.getIndicatorsList()
	},
	watch: {
		updateFreq(val) {
			switch (val) {
				case 'weekly': {
					this.dailyDisabled = true
					break
				}
				case 'monthly': {
					this.dailyDisabled = true
					this.weeklyDisabled = true
					break
				}
			}
		},
		// updateFreq(val){
		// 	switch(val){
		// 		case "daily": {
		// 			this.fd.frequency = Daily
		// 			break
		// 		}
		// 		case "weekly": {
		// 			this.fd.frequency = Weekly
		// 			break
		// 		}
		// 		case "monthly": {
		// 			this.fd.frequency = Monthly
		// 			break
		// 		}
		// 	}
		// },
		isClearForm: {
			handler(newVal) {
				let init = deepClone1(this.$options.data())
				Object.assign(this.$data, init)
			}
		},
		getEditBacktestData: {
			handler(newVal) {
				const data = deepClone1(newVal.entry)
				this.$set(this.fd, 'description', data.description)
				this.$set(this.fd, 'direction', data.direction)
				this.$set(this.fd, 'frequency', data.frequency)
				this.loadSentimentList(data.frequency)
				this.signalVisiable = false
				this.getExitDirection(data.direction)
				this.getFrequency(data.frequency)
				const obj = {}
				obj.criteria = this.criteria
				obj.description = data.description
				obj.direction = data.direction
				obj.frequency = data.frequency
				this.$store.commit('setFd', obj)
			},
			immediate: true,
			deep: true
		},

		fdLoad: {
			handler(newVal) {
				this.fd = newVal
				this.$store.commit('getExitDirection', newVal.direction)
			},
			immediate: true,
			deep: true
		}
	},
	components: {
		'condition-tab': conditionTab
	},
	methods: {
		async loadSentimentList(val) {
			const vm = this
			var frequency = val
			var indicatorList = []
			if(this.$store.state.indicatorsList.length != 0){
				//console.log('data in indicatorList from entry-form',this.$store.state.indicatorsList.length)
				indicatorList = this.$store.state.indicatorsList
			}else{
				const res = await vm.$http.get(
					'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
					{
						auth: {
							username: 'sentimentrader_backtest_api',
							password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
						}
					}
				)
				indicatorList = res.data
			}
			// vm.sentimentIndicatorList = res.data.map((obj) => {
			// 	if (frequency.toUpperCase().indexOf(obj.updated.toUpperCase()) !== -1) {
			// 		return { value: obj.chart_name, url: obj.url, updated: obj.updated }
			// 	}
			// })
			vm.sentimentIndicatorList = []
			indicatorList.forEach((element) => {
				if (frequency.toUpperCase().indexOf(element.updated.toUpperCase()) !== -1) {
					vm.sentimentIndicatorList.push({ value: element.chart_name, url: element.url, updated: element.updated }) 
				}
			})
			this.$store.commit('getIndicatorsList', indicatorList)
			this.$store.commit('getSentimentList', vm.sentimentIndicatorList)

			const data = vm.$store.state.indicatorsList
			if (frequency !== '') {
				if (frequency == 'Daily') {
					vm.setSentiList(['Daily'], data)
				} else if (frequency == 'Weekly') {
					vm.setSentiList(['Daily', 'Weekly'], data)
				} else if (frequency == 'Monthly') {
					vm.setSentiList(['Daily', 'Weekly', 'Monthly'], data)
				}
			}
		},
		getExitDirection(val) {
			this.$store.commit('getExitDirection', val)

			this.fd.direction = val
			this.fd.criteria = 'entry'
			this.$store.commit('setFd', this.fd)
		},
		setSentiList(arr, data) {
			const vm = this
			vm.sentimentIndicatorList = []
			arr.forEach((fre) => {
				data.forEach((element) => {
					if (fre.toUpperCase().indexOf(element.updated.toUpperCase()) !== -1) {
						vm.sentimentIndicatorList.push({
							value: element.chart_name,
							url: element.url,
							updated: element.updated
						})
					}
				})
			})
			this.$store.commit('getSentimentList', vm.sentimentIndicatorList)
		},
		async getIndicatorsList() {
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
		getDes: throttle(function (val) {
			this.fd.description = val
			this.fd.criteria = 'entry'
			this.$store.commit('setFd', this.fd)
		}, 3000),
		getFrequency(val) {
			//console.log(val)
			this.$store.commit('getFrequency', val)
			this.fd.frequency = val
			this.fd.criteria = 'entry'
			this.loadSentimentList(val)
			this.$store.commit('setFd', this.fd)
		},
		showSignal() {
			this.signalVisiable = !this.signalVisiable
		}
		// validateEntryForm() {
		// 	const data = this.fd
		// 	console.log('0000000000',this.si,this.ids,this.sc);
		// 	let check = false
		// 	for(let key in data) {
		// 		if(!data[key]) {
		// 			check = true
		// 			break
		// 		}
		// 	}
		// 	if(check) {
		// 		 this.$notify({
		//   title: 'Field missing',
		//   message: 'Please fill out the form completely',
		//   offset: 100,
		//   type: 'warning'
		// });
		// }else {
		// 		// this.$emit('goToExitForm')
		// 	}
		// }
	}
}
</script>
<style lang="less" scoped>
.active {
	display: none;
}
.note {
	display: inline-block;
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
@media (min-width: 768px) and (max-width: 992px) {
	.border-set {
		border-bottom: 1px solid black;
		padding-bottom: 15px;
	}
}
@media (max-width: 767px) {
	.border-set {
		border-bottom: 1px solid black;
		padding-bottom: 15px;
	}
}
</style>