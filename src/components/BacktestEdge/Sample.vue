<template>
	<el-row>
		<el-col :span="24">
			<div class="favoriteForm_container">
				<el-table
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
					<el-table-column align="center" width="230px">
						<template slot-scope="scope">
							<el-row>
								<!-- <el-tooltip
									class="item"
									effect="light"
									content="run backtest"
									placement="bottom-start"
								>
									<el-button
										type="success"
										icon="el-icon-caret-right"
										circle
										size="mini"
										@click="runbacktest(scope.row)"
									></el-button>
								</el-tooltip> -->
								<el-tooltip
									class="item"
									effect="light"
									content="copy backtest"
									placement="bottom-start"
								>
									<el-button
										type="info"
										icon="el-icon-copy-document"
										circle
										size="mini"
										@click="copyBacktest(scope.row)"
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
									content="view backtest results"
									placement="bottom-start"
								>
									<el-button
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
			loadTest: 'Loading'
		}
	},
	// created() {
	// 	this.getStrategyList()
	// 	this.getStrategyName()
	// },
	methods: {
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
				console.log('查看数据', des)
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
		async getStrategyList() {
			if (this.backtestList.length === 0) {
				this.loading = true
				let page = this.queryInfo.page
				const res = await this.$http.get(
					'/dev/strategy/?ordering=name,status,-create_date&page=' + page
				)
				if (res.status === 200) {
					this.backtestList = res.data.results
					if (this.backtestList.length != 0) {
						this.backtestList.forEach((element) => {
							if (element.result !== '')
								element.result = JSON.parse(element.result)
						})
					}
					console.log('sample', this.backtestList)
					this.queryInfo.total = res.data.count
					this.loading = false
				} else {
					this.$message.error('List request failed')
					this.loading = false
				}
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
						vm.getStrategyList()
						vm.loading = false
					}
				})
			}, 3000)
		},
		async getStatus(id) {
			const { res: data } = await this.$http.get('/dev/status/' + id + '/')
			return res.data.status
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
			})
			this.$store.commit('getRunBacktestData', row)
			this.$emit('goBacktestResultForm', row)
			vm.$emit('goTobacktestSetupForm', row.id)
		}, 5000),
		deleteBacktest(id) {
			this.$http
				.delete('/dev/backtest/' + id + '/')
				.then((res) => {
					if (res.status == 204) {
						this.getStrategyList()
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
		copyBacktest: throttle(function (row) {
			console.log('row', row)
			let params = {}
			this.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				if (res.status === 200) {
					params = res.data
					params.name = params.name + '(copy)'
					delete params.results
					delete params.uuid
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
								this.$emit('goToHistoryForm')
								this.$emit('refHistoryForm')
							} else {
								this.$notify.error({
									title: 'Failed',
									message: 'Copy failed',
									offset: 100
								})
							}
						})
						.catch((error) => {
							this.$notify.error({
								title: 'Has been Copied',
								message: 'The strategy has been copied',
								offset: 100
							})
						})
				}
			})
		}, 5000),
		viewBacktestResults: throttle(function (row) {
			if (row.result['Total Trades']) {
				document.getElementsByClassName('ciq-period')[0].style.display = 'none'
				this.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
					// 恢复indicator layout
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					console.log(JSON.parse(res.data.indicator_layout))
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
			this.getStrategyList()
		},
		restoreIndicatorLayout(data, freq) {
			this.$store.commit('getEntryIndicators', data.formIndicators.entry)
			this.$store.commit('getExitIndicators', data.formIndicators.exit)
			this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
			this.$store.commit('getMA', data.activatedMA)
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
			CIQ.addIndicators()
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
		addToFavorites(row) {
			let vm = this
			let params = {
				favorites: true
			}
			this.$http
				.put('/dev/backtest/' + row.id + '/', vm.$qs.stringify(params))
				.then((res) => {
					if (res.status === 200) {
						this.getStrategyList()
						this.$message.success({
							message: '已添加收藏',
							duration: 1000
						})

						this.$emit('goToFavoritesForm')
					} else {
						this.getStrategyList()
						this.$message.error({
							message: '收藏失败',
							duration: 1000
						})
					}
				})
		}
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
		padding: 5px 0px;
		margin-bottom: 5px;
	}
}
/deep/ .el-table .cell {
	padding: 0px;
	word-wrap: break-word;
}
</style>
