<template>
	<el-row>
		<el-col :span="24">
			<div class="favoriteForm_container">
				<el-table :data="backtestList" v-loading="loading">
					<el-table-column
        type="index"
        align="center">
    <template scope="scope">
        <span>{{(queryInfo.page - 1) * 10 + scope.$index + 1}}</span>
    </template>
</el-table-column>
					<el-table-column label="Name" align="center" prop="name">
					</el-table-column>
					<el-table-column label="Symbol" align="center" prop="symbol">
					</el-table-column>
					<el-table-column
						label="description"
						align="center"
						show-overflow-tooltip
						prop="description"
					>
					</el-table-column>
					<el-table-column label="Backtest Period" >
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
					<el-table-column label="Status" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.status == 0">ready to run</span>
							<span v-else-if="scope.row.status == 1"
								><img src="../../../assets/loading.gif" width="25px"
							/></span>
							<span v-else-if="scope.row.status == 2">run completed</span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="300px">
						<template slot-scope="scope">
							<el-row>
								<el-button
									type="warning"
									icon="el-icon-star-off"
									circle
									@click="sendBack(scope.row)"
									size="mini"
								></el-button>
								<el-button
									type="success"
									icon="el-icon-check"
									circle
									@click="showDes(scope.row)"
									size="mini"
								></el-button>
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
										v-if="scope.row.status == 2"
										circle
										size="mini"
										@click="viewBacktestResults(scope.row)"
									></el-button>
									<el-button
										type="warning"
										icon="el-icon-view"
										v-else
										disabled
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
		this.getBacktestList()
		this.getStrategyName()
	},
	mounted() {
		this.$cookies.set('username', 'test')
	},
	methods: {
		async getBacktestList(strategy) {
			console.log(111)
			this.loading = true
			let page = this.queryInfo.page
			const res = await this.$http.get('/dev/backtest/?page=' + page)
			if (res.status === 200) {
				this.loading = false
				this.backtestList = res.data.results
				this.queryInfo.total = res.data.count
			} else {
				this.loading = false
			}
		},
		runbacktest(row) {
			let vm = this
			vm.clearInterval = clearInterval()
			if (row.status == 0) {
				row.status = 1
				vm.$http.post('/dev/runbacktest/?uuid=' + row.id).then((res) => {
					if (res.status == 200) {
						vm.timer = setInterval(() => {
							vm.$http.get('/dev/status/' + row.id + '/').then((res) => {
								//(res.data.status)
								//console.log("内层",res);
								if (res.data.status === 2) {
									clearInterval(vm.timer)
									vm.getBacktestList()
									vm.$message.success(
										'Run backtest is successful, click the view results button to see the results.'
									)
								} else if(res.data.status === 0){
									clearInterval(vm.timer)
									vm.getBacktestList()
									vm.$message.error('No trades, please change the parameters.')
								}
							})
						}, 3000)
					}else {
					vm.$message.error('An error occurred on the server')

					}
				})
			} else if(row.status == 2){
				vm.loading = false
				vm.$message.error('The policy is complete')
			} else if(row.status == 1) {
				vm.loading = false
				vm.$message.error('Please wait while running')
			}
		},

		async getStrategyName() {
			const id = this.backtestList
			// const res = await this.$http.get('/demo/strategies' + id + '/')
		},
		editBacktest(row) {
			let vm = this
			vm.$emit('goTobacktestSetupForm', row.id)
			
			vm.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				// 恢复indicator layout
				this.restoreIndicatorLayout(JSON.parse(res.data.indicator_layout))
			})
			this.$store.commit('getRunBacktestData', row)
			this.$emit('goBacktestResultForm', row)
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
			console.log('行', row)
			let params = {}
			this.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				params = res.data
				params.name = params.name + '(copy)'
				delete params.uuid
				delete params.results
				delete params.user_id
				delete params.status
				delete params.backtest_id
				console.log(params)
				this.$http
					.post('/dev/backtest/', this.$qs.stringify(params), {
						withCredentials: true
					})
					.then((res) => {
						if (res.status === 201) {
							this.$message.success('Copy successfully')
							this.getBacktestList()
						} else {
							this.$message.success('Copy failed')
						}
					})
			})
		},
		viewBacktestResults(row) {
			let vm = this
			vm.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				// 恢复indicator layout
				this.restoreIndicatorLayout(JSON.parse(res.data.indicator_layout))
			})
			this.$store.commit('getRunBacktestData', row)
			this.$emit('goBacktestResultForm', row)
		},
		handleCurrentChange(newpage) {
			this.queryInfo.page = newpage
			this.getBacktestList()
		},
		restoreIndicatorLayout(data){
			this.$store.commit('getEntryIndicators', data.formIndicators.entry)
			this.$store.commit('getExitIndicators', data.formIndicators.exit)
			this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
			this.$store.commit('getMA', data.activatedMA)
			CIQ.addIndicators()
		}
		,
		showDes(row) {
			const datades = {}

			console.log(row)
			let vm = this
			vm.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				console.log('详情')
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
		}
	}
}
</script>