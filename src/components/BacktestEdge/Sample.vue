<template>
	<el-row>
		<el-col :span="24">
			<div class="favoriteForm_container">
				<el-table :data="backtestList" v-loading="loading">
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
						label="Entry"
						align="center"
						show-overflow-tooltip
						prop="entry_description"
					>
					</el-table-column>
					<el-table-column
						label="Exit"
						align="center"
						show-overflow-tooltip
						prop="exit_description"
					>
					</el-table-column>
					<el-table-column
						label="Backtest Period"
						show-overflow-tooltip
						align="center"
					>
						<template slot-scope="scope">
							<div class="dataBox">
								<el-button size="mini" type="info" plain>{{
									scope.row.start_date
								}}</el-button>
								<el-button size="mini" type="info" plain>{{
									scope.row.end_date
								}}</el-button>
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
						><template slot-scope="scope">
							<span v-if="scope.row.result['Total Return (%)']">{{
								scope.row.result['Total Return (%)'] + '%'
							}}</span>
							<span v-else>{{ 0 + '%' }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="300px">
						<template slot-scope="scope">
							<el-row>
								<el-tooltip
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
								</el-tooltip>
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
			}
		}
	},
	created() {
		this.getStrategyList()
		this.getStrategyName()
	},
	mounted() {
		this.$cookies.set('userid', 'test')
	},
	methods: {
		async getStrategyList() {
			this.loading = true
			const res = await this.$http.get(
				'/dev/strategy/?ordering=status,-create_date'
			)
			console.log('res', res)
			if (res.status === 200) {
				this.backtestList = res.data.results
				this.loading = false
				// this.total = res.count
			} else {
				this.$message.error('List request failed')
				this.loading = false
			}
		},
		refreshHistory(id) {
			let vm = this
			vm.loading = true
			vm.clearInterval = clearInterval()
			vm.timer = setInterval(() => {
				vm.$http.get('/dev/status/' + id + '/').then((res) => {
					if (res.data.status === 2) {
						clearInterval(vm.timer)
						vm.getBacktestList()
						vm.loading = false
						vm.$notify({
							title: 'The run was successful',
							message:
								'Run backtest is successful, click the view results button to see the results.',
							offset: 100,
							type: 'success',
							duration: 0
						})
					}
					// 报错， 有交易却显示没交易
					// else if (res.data.status === 0 || res.data.status === 3) {
					// 	clearInterval(vm.timer)
					// 	vm.getBacktestList()
					// 	vm.loading = false
					// 	vm.$notify({
					// 		title: 'No trades',
					// 		message: 'No trades, please change parameter.',
					// 		offset: 100,
					// 		type: 'warning'
					// 	})
					// }
				})
			}, 3000)
		},

		async getStrategyName() {
			const id = this.backtestList
			// const res = await this.$http.get('/demo/strategies' + id + '/')
		},
		editBacktest(row) {
			let vm = this
			vm.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				// 恢复indicator layout
				this.restoreIndicatorLayout(JSON.parse(res.data.indicator_layout))
			})
			this.$store.commit('getRunBacktestData', row)
			this.$emit('goBacktestResultForm', row)
			vm.$emit('goTobacktestSetupForm', row.id)
		},
		deleteBacktest(id) {
			this.$http
				.delete('/dev/backtest/' + id + '/')
				.then((res) => {
					if (res.status == 204) {
						this.$message.success({
							message: 'Successfully deleted',
							duration: 1000
						})
						this.getBacktestList()
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
		copyBacktest(row) {
			let params = {}
			this.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				params = res.data
				params.name = params.name + '(copy)'
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
							this.$message.success('Copy successfully')
							this.getBacktestList()
						} else {
							this.$message.error('Copy failed')
						}
					})
			})
		},
		viewBacktestResults(row) {
			if (row.result['Total Trades']) {
				document.getElementsByClassName('ciq-period')[0].style.display = 'none'
				this.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
					// 恢复indicator layout
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					this.restoreIndicatorLayout(JSON.parse(res.data.indicator_layout))
				})
				this.$store.commit('getRunBacktestData', row)
				this.$emit('goTobacktestSetupForm', row.id)
				this.$emit('goBacktestResultForm', row)
			} else {
				this.$notify({
					title: 'No trades',
					message: 'No trades, please change parameter.',
					offset: 100,
					type: 'warning'
				})
			}
		},
		handleCurrentChange(newpage) {
			this.queryInfo.page = newpage
			this.getBacktestList()
		},
		restoreIndicatorLayout(data) {
			this.$store.commit('getEntryIndicators', data.formIndicators.entry)
			this.$store.commit('getExitIndicators', data.formIndicators.exit)
			this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
			this.$store.commit('getMA', data.activatedMA)
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
		sendBack(row) {
			let vm = this
			this.$http.post('/dev/seeparams/' + row.id + '/').then((res) => {
				const des = res.data
				let str = ``
				for (let key in des) {
					str = str + '<p>' + `${key}:  ${des[key]}` + '</p>'
				}
				str = str + '<h3>FinalResult:</h3>'
				for (let key in des.FinalResult) {
					str = str + '<p>' + `${key}:  ${des.FinalResult[key]}` + '</p>'
				}
				str = str + '<h3>FinalResult.AnnualReturn:</h3>'
				for (let key in des.FinalResult.AnnualReturn) {
					str =
						str +
						'<p>' +
						`${key}:  ${des.FinalResult.AnnualReturn[key]}` +
						'</p>'
				}
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
		addToFavorites(row) {
			let vm = this
			let params = {
				favorites: true
			}
			this.$http
				.put('/dev/backtest/' + row.id + '/', vm.$qs.stringify(params))
				.then((res) => {
					if (res.status === 200) {
						this.getBacktestList()
						this.$message.success({
							message: '已添加收藏',
							duration: 1000
						})

						this.$emit('goToFavoritesForm')
					} else {
						this.getBacktestList()
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