<template>
	<div class="signalDialog">
		<el-dialog
			@open="getList"
			title="Select from signalList"
			:visible.sync="dialogTableVisible"
			:before-close="closeDialog"
			v-loading="loading"
		>
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="system" name="first">
					<el-pagination
						@current-change="handleCurrentChange"
						:current-page="queryInfo.page"
						:page-size="10"
						layout="total, prev, pager, next"
						:total="total"
					>
					</el-pagination>
					<el-table :data="signalList" border stripe size="mini">
						<el-table-column width="50px" 
							align="center">
							<template slot-scope="scope">
								<el-radio
									v-model="radio"
									@change="checkEntry(scope.row)"
									:label="scope.row.id"
									>{{''}}</el-radio
								>
							</template>
						</el-table-column>
						<el-table-column
							label="indicator"
							prop="indicator"
							align="center"
						></el-table-column>
						<el-table-column
							label="description"
							prop="description"
							align="center"
						></el-table-column>
						<!-- <el-table-column
							label="direction"
							prop="direction"
							align="center"
						></el-table-column> -->
						<el-table-column
							label="source"
							prop="user"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.user === 'system'">System</span>
								<span v-else>Custom</span>
							</template>
						</el-table-column>
						<el-table-column
							label="frequency"
							prop="frequency"
							align="center"
						>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="custom" name="second">
					<el-pagination
						@current-change="handleCurrentChange"
						:current-page="customInfo.page"
						:page-size="30"
						layout="total, prev, pager, next"
						:total="customTotal"
					>
					</el-pagination>
					<el-table :data="customList" border stripe size="mini">
						<el-table-column>
							<template slot-scope="scope">
								<el-radio
									v-model="radio"
									@change="checkEntry(scope.row)"
									:label="scope.row.id"
									>{{ '' }}</el-radio
								>
							</template>
						</el-table-column>
						<el-table-column
							label="indicator"
							prop="indicator"
							align="center"
						></el-table-column>
						<el-table-column
							label="description"
							prop="description"
							align="center"
						></el-table-column>
						<el-table-column
							label="analysis basis"
							prop="analysis"
							align="center"
						></el-table-column>
						<el-table-column label="source" prop="user" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.user === 'admin'">system</span>
								<span v-else>custom</span>
							</template>
						</el-table-column>
						<el-table-column label="frequency" prop="frequency" align="center">
						</el-table-column>
						<el-table-column align="center">
							<template slot-scope="scope">
								<el-popconfirm
									confirm-button-text="yes"
									cancel-button-text="no"
									icon="el-icon-info"
									icon-color="red"
									title="Are you sure you want to delete it?"
									@confirm="deleteFavoriteSignal(scope.row)"
								>
									<el-button
										type="danger"
										icon="el-icon-delete"
										circle
										size="mini"
										slot="reference"
									></el-button>
								</el-popconfirm>
								<!-- </span> -->
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
	</div>
</template>
<script>
import { Store } from 'vuex'
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import SignalCode from '@/tools/codeTool.js'
export default {
	extends: base,
	props: {
		dialogTableVisible: Boolean
	},
	name: 'signalDialog',
	data() {
		return {
			sentimentIndicatorList: [],
			technicalIndicatorList: [
				{value:'Commodity Channel Index', url:'ST CCI'},
				{value:'Relative Strength Index', url:'ST MACD'},
				{value:'Moving Average', url:'ma'},
				{value:'MACD', url:'ST MACD'}
			],
			signalList: [{ entryChecked: false }],
			queryInfo: {
				page: 1
			},
			radio: '',
			total: 0,
			loading: false,
			favoriteList: [],
			customList: [],
			activeName: 'first',
			customTotal: 0,
			customInfo: {
				page: 1
			}
		}
	},
	mounted(){
		this.loadSentimentList()
	},
	methods: {
		//  load sentiment list
		async loadSentimentList() {
			const vm = this
			var indicatorList = []
			if(this.$store.state.indicatorsList.length == 0){
				console.log('no data in indicatorList from signal-dialog',this.$store.state.indicatorsList.length)
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
			vm.sentimentIndicatorList =indicatorList.map((obj) => {
				return { value: obj.chart_name, url: obj.url }
			})
			this.$store.commit('getIndicatorsList', indicatorList)
		},
		getList() {
			this.getSignallist('system')
			this.getCustomList('custom_signal')
		},
		async getSignallist(users) {
			const user = users
			let analysisBasis = this.$store.state.entryIndicatorRadio
			let indicator
			let type = this.$store.state.exitDirection
			if (!type) {
				type = JSON.stringify(['Long', 'Short'])
			}
			if (this.criteria === 'exit' && type) {
				if (type === 'Long') {
					type = 'Short'
				} else if (type === 'Short') {
					type = 'Long'
				}
			}
			if (analysisBasis === 'sentiment') {
				indicator = ''
			}
			if (analysisBasis === 'technical') {
				indicator = JSON.stringify([
					'Commodity Channel Index',
					'Relative Strength Index',
					'MACD',
					'Moving Average'
				])
			}

			//console.log(type,analysisBasis,indicator);
			this.signalList = []
			this.loading = true
			const { data: signalRes } = await this.$http.get(
				'/dev/signal/',
				{
					params: {
						page: this.queryInfo.page,
						direction: type,
						user: user,
						analysis: analysisBasis,
						indicator: indicator
					}
				},
				{ withCredentials: true }
			)
			this.signalList = signalRes.results
			this.total = signalRes.count
			if (this.signalList.length !== 0) {
				this.loading = false
			}
			console.log(this.signalList)
			// this.total = systemRes.count + favoriteRes.count + customRes.count
			if (this.signalList.length <= 0) {
				this.loading = false
			}
		},
		async getCustomList(users) {
			const user = users
			let analysisBasis = this.$store.state.entryIndicatorRadio
			let indicator
			let type = this.$store.state.entryType
			if (this.type) {
				type = JSON.stringify(['Long', 'Short'])
			}
			if (analysisBasis === 'sentiment') {
				indicator = ''
			}
			if (analysisBasis === 'technical') {
				indicator = JSON.stringify([
					'Commodity Channel Index',
					'Relative Strength Index',
					'MACD',
					'Moving Average'
				])
			}

			//console.log(type,analysisBasis,indicator);
			this.signalList = []
			this.loading = true
			const { data: res } = await this.$http.get(
				'/dev/signal/',
				{
					params: {
						page: this.queryInfo.page,
						direction: type,
						user: user,
						analysis: analysisBasis,
						indicator: indicator
					}
				},
				{ withCredentials: true }
			)
			this.customList = res.results
			this.customTotal = res.count
			if (res.results.length <= 0) {
				this.loading = false
			}
			this.loading = false
		},
		closeDialog() {
			this.$emit('openSignalDialog'), (this.queryInfo.page = 1)
		},
		checkEntry(scope) {
			console.log(scope)
			const obj = scope
			const a = new SignalCode()
			obj.code = a.decode(obj.code)
			obj.criteria = this.criteria
			obj.index = this.tabIndex
			const newObj = { fd: {}, si: {} }
			// form detail
			newObj.fd.description = obj.description
			newObj.fd.direction = obj.direction
			newObj.fd.frequency = obj.frequency
			// signal indicator
			if (obj.code.analysis === 'Technical') {
				newObj.si.technicalIndicator = obj.code.indicator
				newObj.si.sentimentIndicator = ''
			} else if (obj.code.analysis === 'Sentiment') {
				newObj.si.sentimentIndicator = obj.code.indicator
				newObj.si.technicalIndicator = ''
			}
			this.$store.commit('setSignalDialogData', obj)
			this.closeDialog()
			this.signalList.entryChecked = !this.signalList.entryChecked

			var list = this.sentimentIndicatorList.concat(this.technicalIndicatorList)
			for(var item in list){
				if(list[item].value == obj.indicator){
					// remove a MA tat already exists in current criteria before loadin
					var activatedMAList = this.$store.state.activatedMA
					
					if (obj.criteria == 'entry') {
						var MAListIndex = activatedMAList.findIndex(
							(item) =>
								item.url == this.$store.state.indicators.formIndicators.entry
						)
						if (MAListIndex != -1) {
							activatedMAList.splice(MAListIndex, 1)
						}
						this.$store.commit('getMA', activatedMAList)
						this.$store.commit('getEntryIndicators', list[item].url)
					} else {
						var MAListIndex = activatedMAList.findIndex(
							(item) => item.url == this.$store.state.indicators.formIndicators.exit
						)
						if (MAListIndex != -1) {
							activatedMAList.splice(MAListIndex, 1)
						}
						this.$store.commit('getMA', activatedMAList)
						this.$store.commit('getExitIndicators', list[item].url)
					}

					if (obj.code.analysis === 'Technical') {
						// store tech indicators in Vuex and use it in addIndicator to test if a member in list is belong to tech
						let techIndicators = []
						techIndicators.push(...CIQ.store.state.indicators.technicalIndicators)
						techIndicators.push(list[item].url)
						this.$store.commit('getTechnicalIndicators', techIndicators)
					}

					console.log('SinalDialo MA LIST: ',CIQ.store.state.activatedMA)
					CIQ.addIndicators()
				}
			}
		
		
		},
		handleCurrentChange(newpage) {
			this.queryInfo.page = newpage
			this.getSignallist('system')
		},
		async deleteFavoriteSignal(row) {
			const { data: res } = await this.$http.delete(
				'/dev/signal/' + row.id + '/'
			)
			this.$message.success({
				message: 'Successfully deleted',
				duration: 1000
			})
			this.getCustomList('custom_signal')
		}
	}
}
</script>
<style scoped>
</style>