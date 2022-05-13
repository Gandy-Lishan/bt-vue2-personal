<template>
	<el-row>
		<el-col :span="24">
			<div class="favoriteForm_container">
				<el-table
					header-align="center"
					:data="backtestList"
					v-loading="loading"
					:element-loading-text="loadTest"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"
				>
					<el-table-column type="index" align="center">
						<template scope="scope">
							<span>{{ (queryInfo.page - 1) * 10 + scope.$index + 1 }}</span>
						</template>
					</el-table-column>
					<el-table-column
						label="Name"
						align="center"
						prop="name"
						show-overflow-tooltip
						width="150px"
					>
					</el-table-column>
					<el-table-column
						label="Symbol"
						align="center"
						prop="symbol"
						width="70px"
					>
					</el-table-column>
					<!-- <el-table-column
						label="Entry & Exit"
						align="center"
						show-overflow-tooltip
					>
						<template slot-scope="scope">
							<div
								v-for="item in scope.row.entry_description"
								:key="item"
							>
								<p>{{ item }}</p>
							</div>
							<div
								v-for="item in scope.row.exit_description"
								:key="item"
							>
								<p>{{ item }}</p>
							</div>
						</template>
					</el-table-column> -->
					<el-table-column label="Entry & Exit" align="center">
						<template slot-scope="scope">
								<el-tooltip placement="top" effect="dark" transition  v-if="(scope.row.entry_description) instanceof Array">
								<div slot="content" v-for="(item,index) in scope.row.entry_description" :key="index">
									{{ item }}<br/>
								</div>
								<div v-for="(item,index) in scope.row.entry_description" :key="index">
								{{ scope.row.entry_description[1] }}<br/>
								</div>
							</el-tooltip>
							   <el-tooltip placement="top" effect="dark" transition v-if="!((scope.row.entry_description) instanceof Array)">
								<div slot="content">
									{{ scope.row.entry_description }}<br/>
								</div>
								<div>
								{{ scope.row.entry_description }}<br/>
								</div>
							</el-tooltip>
							<br/>
							<el-tooltip placement="bottom" effect="light" transition v-if="(scope.row.exit_description) instanceof Array">
								<div slot="content" v-for="(item,index) in scope.row.exit_description" :key="index">
									{{ item }}<br/>
								</div>
								<div  v-for="(item,index) in scope.row.exit_description" :key="index">
									{{ scope.row.exit_description[1] || scope.row.exit_description[0] }}<br/>
								</div>
							</el-tooltip>
								<el-tooltip placement="top" effect="light" transition v-if="!((scope.row.exit_description) instanceof Array)">
								<div slot="content">
									{{ scope.row.exit_description }}<br/>
								</div>
								<div>
								{{ scope.row.exit_description }}<br/>
								</div>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column
						label="Period"
						show-overflow-tooltip
						align="center"
						width="90px"
					>
						<template slot-scope="scope">
							<div class="showDate">
								<el-button
									size="mini"
									type="info"
									v-if="scope.row.start_date === '1800-10-01'"
									plain
									>All History</el-button
								>
								<el-button
									size="mini"
									type="info"
									v-if="scope.row.start_date !== '1800-10-01'"
									plain
									>{{ scope.row.start_date }}</el-button
								>
								<el-button
									size="mini"
									type="info"
									v-if="scope.row.start_date !== '1800-10-01'"
									plain
									>{{ scope.row.end_date }}</el-button
								>
							</div>
						</template>
					</el-table-column>
					
					<el-table-column
						label="Timeframe"
						show-overflow-tooltip
						align="center"
						width="90px"
					>
						<template slot-scope="scope">
							<p>{{ scope.row.frequency }}</p>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						show-overflow-tooltip
						label="Total Trades"
						width="100px"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.result['Total Trades']">{{
								scope.row.result['Total Trades']
							}}</span>
							<span v-else>{{ 0 }}</span>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						show-overflow-tooltip
						label="Total Return"
						width="97px"
						><template slot-scope="scope">
							<span v-if="scope.row.result['Total Return (%)']">{{
								scope.row.result['Total Return (%)'] + '%'
							}}</span>
							<span v-else>{{ 0 + '%' }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="250px">
						<template slot-scope="scope">
							<el-row>
								<el-tooltip
									class="item"
									effect="dark"
									content="add to favorites"
									v-if="scope.row.favorites == false"
									placement="bottom-start"
								>
									<el-button
										v-if="scope.row.favorites == false"
										plain
										icon="el-icon-star-off"
										circle
										@click="addToFavorites(scope.row)"
										size="mini"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="remove from favorites"
									v-if="scope.row.favorites == true"
									placement="bottom-start"
								>
									<el-button
										v-if="scope.row.favorites == true"
										type="warning"
										icon="el-icon-star-on"
										circle
										@click="moveToFavorites(scope.row)"
										size="mini"
									></el-button>
								</el-tooltip>
								<el-button
									plain
									icon="el-icon-s-comment"
									circle
									@click="sendBack(scope.row)"
									size="mini"
								></el-button>
								<el-button
									plain
									icon="el-icon-check"
									circle
									@click="showDes(scope.row)"
									size="mini"
								></el-button>
								<el-tooltip
									class="item"
									effect="dark"
									content="edit backtest"
									placement="bottom-start"
								>
									<el-button
										type="primary"
										icon="el-icon-edit"
										circle
										size="mini"
										@click="editBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="copy backtest"
									placement="bottom-start"
								>
									<el-button
										:disabled="scope.row.status == 0"
										type="info"
										icon="el-icon-copy-document"
										circle
										size="mini"
										@click="copyBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="delete backtest"
									placement="bottom-start"
								>
									<el-popconfirm
										v-if="scope.row.favorites == false"
										confirm-button-text="yes"
										cancel-button-text="no"
										icon="el-icon-info"
										icon-color="red"
										title="Are you sure you want to delete it?"
										@confirm="deleteBacktest(scope.row.id)"
									>
										<el-button
											type="danger"
											icon="el-icon-delete"
											circle
											size="mini"
											slot="reference"
										></el-button>
									</el-popconfirm>
									<el-popconfirm
										v-if="scope.row.favorites == true"
										confirm-button-text="yes"
										cancel-button-text="no"
										icon="el-icon-info"
										icon-color="red"
										title="Favorite will also remove the backtest, are you sure delete it?"
										@confirm="deleteBacktest(scope.row.id)"
									>
										<el-button
											type="danger"
											icon="el-icon-delete"
											circle
											size="mini"
											slot="reference"
										></el-button>
									</el-popconfirm>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="view backtest results"
									placement="bottom-start"
								>
									<el-button
										:disabled="scope.row.status == 0"
										type="warning"
										icon="el-icon-view"
										circle
										size="mini"
										@click="viewBacktestResults(scope.row)"
									></el-button>
								</el-tooltip>
							</el-row>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					@current-change="handleCurrentChange"
					:current-page="queryInfo.page"
					:page-size="10"
					layout="total, prev, pager, next"
					:total="queryInfo.total"
				>
				</el-pagination>
			</div>
		</el-col>
	</el-row>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { Store } from 'vuex'
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'
const throttle = require('lodash/throttle')
import {
	copyBacktest,
	favoriteBacktest,
	getHistoryList,
	getStatus,
	seeParams,
	seeReport,
	deleteBacktest
} from '@/service/service.js'
export default {
	data() {
		return {
			backtestList: [],
			strategyName: '',
			checkList: [],
			checked: false,
			backtestId: [],
			dialogVisible: false,
			img_data: '',
			loading: false,
			currentBacktestList: [],
			backtestItemId: 0,
			backtestResultList: [],
			editData: {},
			queryInfo: {
				page: 1,
				total: 0
			},
			loadTest: 'Loading...'
		}
	},
	created() {
		this.getHistoryList()
	},
	methods: {
		async getHistoryList() {
			this.loadTest = 'Loading...'
			this.loading = true
			let page = this.queryInfo.page
			try {
				let res = await getHistoryList(page)
				if (res.status === 200) {
					this.loading = false
					let historyNameList = []
					this.backtestList = res.data.results
					
				    console.log('history列表',res.data.results);
					if (res.data.results.length != 0) {
						res.data.results.forEach((element) => {
							historyNameList.push(element.name)
							if (element.result !== '')
								element.result = JSON.parse(element.result)
								if(element.entry_description.indexOf("[") != -1) {
									element.entry_description = JSON.parse(element.entry_description)
								}
								// else{
								// 	element.entry_description = [].push(entry_description)
								// }
								if(element.exit_description.indexOf("[") != -1) {
									element.exit_description = JSON.parse(element.exit_description)
								}
								// if(!(element.entry_description instanceof Array)) {
								// 	element.entry_description = [element.entry_description]
								// }
								// else{
								// 	element.exit_description = [].push(exit_description)
								// }
						})
						
						this.backtestList = res.data.results
				        console.log('处理过后history列表',this.backtestList);
						this.$store.commit('getBacktestName', historyNameList)
					}
					this.queryInfo.total = res.data.count
				}
			} catch (error) {
				console.log(error)
				this.loading = false
			}
		},
		refreshHistory(id) {
			let vm = this
			vm.loadTest = 'Backtest is running, please wait'
			vm.loading = true
			vm.clearInterval = clearPromiseInterval
			let timer = setPromiseInterval(async () => {
				try {
					const res = await getStatus(id)
					console.log("状态码",res.data.status)
				if (res.data.status !== 1 && res.data.status !== 0) {
					clearPromiseInterval(timer).then(() => {})
					// vm.$notify({
					// 	title: 'The run was successful',
					// 	message:
					// 		'Run backtest is successful, click the view results button to see the results.',
					// 	offset: 100,
					// 	type: 'success',
					// 	duration: 1000
					// })
					vm.queryInfo.page = 1
					vm.getHistoryList()
					this.$emit('refFavoritesForm')
					vm.loading = false
					let row = res.data
					row.result = JSON.parse(row.result)
					vm.viewBacktestResults(row)
				}
				} catch (error) {
					vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
				vm.loading = true
				}
			}, 3000)
		},
		editBacktest: throttle(async function (row) {
			let vm = this
			try {
				this.isEditDone = true
				const res = await seeParams(row.id)
				document.getElementsByClassName('ciq-period')[0].style.display = ''
				this.isEditDone = false
				// 恢复indicator layout
				this.$store.commit('getBacktestSymbol', res.data.symbol)
				CIQ.hideMarker()
				CIQ.isMarkerShown = false
				if (res.data.indicator_layout) {
					this.restoreIndicatorLayoutEdit(
						JSON.parse(res.data.indicator_layout),
						JSON.parse(res.data.entry).frequency,
						row
					)
				} else {
					this.$store.commit('getRunBacktestData', row)
					this.$emit('goBacktestResultForm', row)
					this.$emit('goTobacktestSetupForm', row.id)
				}
			} catch (error) {
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
			}
		}, 1000),
		async deleteBacktest(id) {
			try {
				const res = await deleteBacktest(id)
				if (res.status == 204) {
					this.getHistoryList()
					this.$emit('refFavoritesForm')
				} else {
					this.$message.error({
						message: 'The deletion failed',
						duration: 1000
					})
				}
			} catch (error) {
				console.log(error)
				this.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
			}
		},
		copyBacktest: throttle(async function (row) {
			let params = {}
			const res = await seeParams(row.id)
			console.log("恢复indicator layout")
			// 恢复indicator layout
			this.$store.commit('getBacktestSymbol', res.data.symbol)
			this.$store.commit('getRunBacktestData', row)
			params = res.data
			params.name = params.name + '(copy)'
			params.favorites = false
			delete params.uuid
			delete params.results
			delete params.user_id
			delete params.status
			delete params.backtest_id
			let paramsStr = this.$qs.stringify(params)
			try {
				const copyRes = await copyBacktest(paramsStr)
				if (copyRes.status === 201) {
					this.$notify({
						title: 'Copy successfully',
						message: 'After copying successfully, you can edit the backtest',
						type: 'success',
						offset: 100
					})
					this.queryInfo.page = 1
					this.getHistoryList()
					this.$emit('refFavoritesForm')
				} else {
					this.$message.error('Copy failed')
				}
			} catch (error) {
				if (error.response.status === 403) {
					this.$notify.error({
						title: 'Has been Copied',
						message: 'The backtest has been copied',
						offset: 100
					})
				}
				if (error.response.status === 500) {
					this.$message({
						message: 'The internal server is busy, please try again later ',
						type: 'error',
						offset: 300
					})
				}
			}
		}, 1000),
		viewBacktestResults: throttle(async function (row) {
			if (row.result['Total Trades']) {
				document.getElementsByClassName('ciq-period')[0].style.display = 'none'
				try {
					const res = await seeParams(row.id)
					// 恢复indicator layout
					// console.log(res,row)
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					CIQ.hideMarker()
					CIQ.isMarkerShown = false
					if (res.data.indicator_layout) {
						this.restoreIndicatorLayoutView(
							JSON.parse(res.data.indicator_layout),
							JSON.parse(res.data.entry).frequency,
							row
						)
					} else {
						this.$store.commit('getRunBacktestData', row)
						this.$emit('goTobacktestSetupForm', row.id, 'fromView')
						this.$emit('goBacktestResultForm', row)
					}
				} catch (error) {
					vm.$message({
						message: 'The internal server is busy, please try again later ',
						type: 'error',
						offset: 300
					})
				}
			} else {
				this.$notify({
					title: 'No trades',
					message: 'No trades, please change parameter.',
					offset: 100,
					type: 'warning'
				})
			}
		}, 1000),
		handleCurrentChange(newpage) {
			this.queryInfo.page = newpage
			this.getHistoryList()
		},
		reloadData(data, freq) {
			let frequency = ''
			this.$store.commit('getEntryIndicatorsList', data.formIndicators.entry)
			this.$store.commit('getExitIndicatorsList', data.formIndicators.exit)
			this.$store.commit('getExtraIndicators', [])
			this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
			this.$store.commit('getMA', data.activatedMA)
			this.$store.commit('setTechSD', data.savedTechSD)
			// CIQ.savedTechSD = data.savedTechSD
			//console.log(data.formIndicators)
			switch (freq) {
				case 'Daily': {
					frequency = 'daily'
					break
				}
				case 'Weekly': {
					frequency = 'weekly'
					break
				}
				case 'Monthly': {
					frequency = 'monthly'
					break
				}
				default: {
					break
				}
			}
			this.$store.commit('setRestoreFreq', frequency)
			// CIQ.addIndicatorsFromBacktest()
		},
		restoreIndicatorLayoutView(data, freq, row) {
			//console.log("在跑完回测后和view result之间会加载一次chart去输出SignalOuput")
			//在跑完回测后和view result之间会加载一次chart去输出SignalOuput
			if (CIQ.isBacktestRun == true) {
				CIQ.isBacktestRun = false
				//this.reloadData(data, freq)
				var that = this
				//不再使用outputSignalsResult，exportcsv放置在回测前，callback置于原地
				//CIQ.outputSignalsResult(function () {
					console.log("after output uploaded to S3")
					that.$store.commit('getRunBacktestData', row)
					that.$emit('goTobacktestSetupForm', row.id)
					that.$emit('goBacktestResultForm', row)
				//})
			} else {
				this.reloadData(data, freq)
				var that = this
				console.log("after clicking view")
				CIQ.addIndicatorsFromBacktest(function () {
					that.$store.commit('getRunBacktestData', row)
					that.$emit('goTobacktestSetupForm', row.id)
					that.$emit('goBacktestResultForm', row)
				})
			}
		},
		restoreIndicatorLayoutEdit(data, freq, row) {
			//在跑完回测后和view result之间会加载一次chart去输出SignalOuput
			// if (CIQ.isBacktestRun == true) {
			// 	CIQ.isBacktestRun = false
			// 	this.reloadData(data, freq)
			// 	var that = this
			// 	CIQ.outputSignalsResult(function () {
			// 		that.$store.commit('getRunBacktestData', row)
			// 		that.$emit('goBacktestResultForm', row)
			// 		that.$emit('goTobacktestSetupForm', row.id)
			// 	})
			// } else {
				console.log("restoreIndicatorLayoutEdit")
				this.reloadData(data, freq)
				var that = this
				CIQ.addIndicatorsFromBacktest(function () {
					that.$store.commit('getRunBacktestData', row)
					that.$emit('goBacktestResultForm', row)
					that.$emit('goTobacktestSetupForm', row.id)
				})
			//}
		},
		async showDes(row) {
			const datades = {}
			let vm = this
			try {
				const res = await seeParams(row.id)
				const des = res.data
				let str = ``
				for (let key in des) {
					str = str + '<p>' + `${key}:  ${des[key]}` + '</p>'
				}

				vm.$alert(str, '标题名称', {
					confirmButtonText: '确定',
					dangerouslyUseHTMLString: true,
					lockScroll: false,
					callback: (action) => {
						vm.$message({
							type: 'info',
							message: `action: ${action}`
						})
					}
				})
			} catch (error) {
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
			}
		},
		async sendBack(row) {
			let vm = this
			try {
				const res = await seeReport(row.id)
				const des = res.data
				let str = ``
				for (let key in des) {
					str = str + '<p>' + `${key}:  ${des[key]}` + '</p>'
				}
				// for (let key in des.FinalResult.AnnualReturn) {
				// 	str =
				// 		str +
				// 		'<p>' +
				// 		`${key}:  ${des.FinalResult.AnnualReturn[key]}` +
				// 		'</p>'
				// }
				vm.$alert(str, '标题名称', {
					confirmButtonText: '确定',
					dangerouslyUseHTMLString: true,
					callback: (action) => {
						vm.$message({
							type: 'info',
							message: `action: ${action}`
						})
					}
				})
			} catch (error) {
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
			}
		},
		addToFavorites: throttle(async function (row) {
			let vm = this
			row.favorites = true
			let params = {
				favorites: true
			}
			let paramsStr = vm.$qs.stringify(params)
			try {
				const res = await favoriteBacktest(row.id, paramsStr)
				if (res.status === 200) {
					this.getHistoryList()
					this.$notify({
						title: 'Added to favorites',
						message:
							'Favorites have been added and you can view them in My Favorites',
						type: 'success',
						offset: 100
					})

					this.$emit('refFavoritesForm')
				} else {
					this.getHistoryList()
					this.$message.error({
						message: 'Collection failed',
						duration: 1000
					})
				}
			} catch (error) {
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
			}
		}, 1000),
		moveToFavorites: throttle(async function (row) {
			let vm = this
			row.favorites = false
			let params = {
				favorites: false
			}
			let paramsStr = vm.$qs.stringify(params)
			try {
				const res = await favoriteBacktest(row.id, paramsStr)
				if (res.status === 200) {
					this.getHistoryList()
					this.$emit('refFavoritesForm')
				}
			} catch (error) {
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
			}
		}, 1000)
	}
}
</script>
<style lang="less" scoped>
.showDate {
	display: flex;
	flex-direction: column;
	/deep/.el-button + .el-button {
		margin-left: 0px;
	}
	/deep/ .el-button--mini,
	.el-button--mini.is-round {
		margin-bottom: 5px;
	}
}
/deep/ .el-table .cell {
	padding: 0px 10px 0px 10px;
	word-wrap: break-word;
}
/deep/.el-button + .el-button {
	margin-left: 0px;
}
/deep/ .el-button--mini.is-circle {
	margin-right: 5px;
	margin-bottom: 5px;
}
/deep/ .showDate .el-button--mini,
.el-button--mini.is-round {
	padding: 7px 0px;
}
.el-button--mini.is-circle {
	padding: 7px;
}
.el-table__body-wrapper {
	overflow-x: scroll;
}
</style>
