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
						label="Description"
						align="center"
						show-overflow-tooltip
						prop="description"
					>
					</el-table-column> -->
					<el-table-column
						label="Entry & Exit"
						align="center"
						show-overflow-tooltip
					>
						<template slot-scope="scope">
							<p>{{ scope.row.entry_description }}</p>
							<p>{{ scope.row.exit_description }}</p>
						</template>
					</el-table-column>
					<!-- <el-table-column
						label="Exit"
						align="center"
						show-overflow-tooltip
						prop="exit_description"
					>
					</el-table-column> -->
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
					<!-- <el-table-column label="Status" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.status == 0">Ready to run</span>
							<span v-else-if="scope.row.status == 1"
								><img src="'@/assets/loading.gif'" width="25px"
							/></span>
							<span v-else-if="scope.row.status == 2">Run completed</span>
							<span v-else-if="scope.row.status == 3">Invalid test</span>
						</template>
					</el-table-column> -->
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
									effect="light"
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
									effect="light"
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
									effect="light"
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
									effect="light"
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
									effect="light"
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
									effect="light"
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
const _ = require('lodash')
const throttle = _.throttle
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
	// created() {
	// 	this.getBacktestList()
	// },
	methods: {
		async getBacktestList(strategy) {
			this.loadTest = 'Loading...'
			this.loading = true
			let page = this.queryInfo.page
			let res = await this.$http.get(
				'/dev/backtest/?ordering=-create_date&page=' + page
			)
			if (res.status === 200) {
				this.loading = false
				let historyNameList = []
				this.backtestList = res.data.results
				if (this.backtestList.length != 0) {
					this.backtestList.forEach((element) => {
						historyNameList.push(element.name)
						if (element.result !== '')
							element.result = JSON.parse(element.result)
					})
					this.$store.commit('getBacktestName', historyNameList)
				}
				this.queryInfo.total = res.data.count
			} else {
				this.loading = false
			}
		},
		refreshHistory(id) {
			let vm = this
			vm.loadTest = 'Backtest is running, please wait'
			vm.loading = true
			vm.clearInterval = clearInterval()
			vm.timer = setInterval(() => {
				vm.$http.get('/dev/status/' + id + '/').then((res) => {
					if (res.data.status !== 1 && res.data.status !== 0) {
						vm.$notify({
							title: 'The run was successful',
							message:
								'Run backtest is successful, click the view results button to see the results.',
							offset: 100,
							type: 'success',
							duration: 1000
						})
						clearInterval(vm.timer)
						vm.getBacktestList()
						vm.loading = false
					}
				})
			}, 3000)
		},

		async getStrategyName() {
			const id = this.backtestList
			// const res = await this.$http.get('/demo/strategies' + id + '/')
		},
		editBacktest: throttle(function (row) {
			let vm = this
			vm.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				// 恢复indicator layout
				if (res.data.indicator_layout) {
					this.restoreIndicatorLayout(
						JSON.parse(res.data.indicator_layout),
						JSON.parse(res.data.entry).frequency
					)
				}
				this.$store.commit('getRunBacktestData', row)
				this.$emit('goBacktestResultForm', row)
				vm.$emit('goTobacktestSetupForm', row.id)
			})
		}, 5000),
		deleteBacktest(id) {
			this.$http
				.delete('/dev/backtest/' + id + '/')
				.then((res) => {
					if (res.status == 204) {
						this.getBacktestList()
						this.$emit('refFavoritesForm')
					} else {
						this.$message.error({
							message: 'The deletion failed',
							duration: 1000
						})
					}
				})
				.catch((error) => {
					//(error);
					this.$message.error({
						message: 'The deletion failed',
						duration: 1000
					})
				})
		},
		// async copyBacktest(row) {
		// 	let vm = this
		// 	try {
		// 		const res = await this.$http.get('/dev/seeparams/' + row.id + '/')
		// 		console.log('相应数据', res.data)
		// 		let data = res.data
		// 		data.name = data.name + '(copy)'
		// 		delete data.backtest_id
		// 		// console.log('copy', data)
		// 		const seRes = await vm.$http.post(
		// 			'/dev/runbt/',
		// 			vm.$qs.stringify(data),
		// 			{
		// 				withCredentials: true
		// 			}
		// 		)
		// 		console.log('wwwww', seRes)
		// 		this.refreshHistory(seRes.data.id)
		// 	} catch (error) {
		// 		console.log(error)
		// 	}
		// },
		copyBacktest: throttle(function (row) {
			let params = {}
			this.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				// 恢复indicator layout
				this.$store.commit('getBacktestSymbol', res.data.symbol)
				if (res.data.indicator_layout) {
					this.restoreIndicatorLayout(
						JSON.parse(res.data.indicator_layout),
						JSON.parse(res.data.entry).frequency
					)
				}
				this.$store.commit('getRunBacktestData', row)
				// this.$emit('goTobacktestSetupForm', row.id)
				// this.$emit('goBacktestResultForm', row)

				params = res.data
				params.name = params.name + '(copy)'
				params.favorites = false
				delete params.uuid
				delete params.results
				delete params.user_id
				delete params.status
				delete params.backtest_id
				this.$http
					.post('/dev/backtest/', this.$qs.stringify(params), {
						withCredentials: true
					})
					.then((res) => {
						if (res.status === 201) {
							this.$notify({
								title: 'Copy successfully',
								message:
									'After copying successfully, you can edit the backtest',
								type: 'success',
								offset: 100
							})
							console.log('复制以后的运行', res.data)
							this.getBacktestList()
							this.$emit('refFavoritesForm')
						} else {
							this.$message.error('Copy failed')
						}
					})
			})
		}, 50000),
		viewBacktestResults: throttle(function (row) {
			if (row.result['Total Trades']) {
				document.getElementsByClassName('ciq-period')[0].style.display = 'none'
				this.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
					// 恢复indicator layout
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					if (res.data.indicator_layout) {
						this.restoreIndicatorLayout(
							JSON.parse(res.data.indicator_layout),
							JSON.parse(res.data.entry).frequency
						)
					}

					this.$store.commit('getRunBacktestData', row)
					this.$emit('goTobacktestSetupForm', row.id)
					this.$emit('goBacktestResultForm', row)
				})
			} else {
				this.$notify({
					title: 'No trades',
					message: 'No trades, please change parameter.',
					offset: 100,
					type: 'warning'
				})
			}
		}, 5000),
		handleCurrentChange(newpage) {
			this.queryInfo.page = newpage
			this.getBacktestList()
		},
		restoreIndicatorLayout(data, freq) {
			this.$store.commit('getEntryIndicators', data.formIndicators.entry)
			this.$store.commit('getExitIndicators', data.formIndicators.exit)
			this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
			this.$store.commit('getMA', data.activatedMA)
			this.$store.commit('setTechSD', data.savedTechSD)
			var frequency = ''
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
			CIQ.addIndicatorsFromBacktest()
		},
		showDes(row) {
			const datades = {}
			let vm = this
			vm.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
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
			})
		},
		sendBack(row) {
			let vm = this
			this.$http.get('/dev/report/?uuid=' + row.id).then((res) => {
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
			})
		},
		addToFavorites: throttle(function (row) {
			let vm = this
			row.favorites = true
			let params = {
				favorites: true
			}
			this.$http
				.put('/dev/backtest/' + row.id + '/', vm.$qs.stringify(params))
				.then((res) => {
					if (res.status === 200) {
						this.getBacktestList()
						this.$notify({
							title: 'Added to favorites',
							message:
								'Favorites have been added and you can view them in My Favorites',
							type: 'success',
							offset: 100
						})

						this.$emit('refFavoritesForm')
					} else {
						this.getBacktestList()
						this.$message.error({
							message: 'Collection failed',
							duration: 1000
						})
					}
				})
		}, 5000),
		moveToFavorites: throttle(function (row) {
			let vm = this
			row.favorites = false
			let params = {
				favorites: false
			}
			this.$http
				.put('/dev/backtest/' + row.id + '/', vm.$qs.stringify(params))
				.then((res) => {
					if (res.status === 200) {
						this.getBacktestList()

						this.$emit('refFavoritesForm')
					} else {
						this.getBacktestList()
						this.$message.error({
							message: 'Add failed',
							duration: 1000
						})
					}
				})
		}, 5000)
	}
}
</script>
<style lang="less" scoped>
/deep/.el-button + .el-button {
	margin-left: 2px;
}
/deep/ .el-button--mini,
.el-button--mini.is-round {
	margin-bottom: 5px;
}
.showDate {
	display: flex;
	flex-direction: column;
	/deep/.el-button + .el-button {
		margin-left: 0px;
	}
	/deep/ .el-button--mini,
	.el-button--mini.is-round {
		padding: 5px 0px;
		margin-bottom: 5px;
	}
}
/deep/ .el-table .cell {
	padding: 0px;
}
/deep/ .el-button--mini.is-circle {
	margin-right: 5px;
}
</style>
