// History List
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
					<el-table-column type="expand">
						<template slot-scope="scope">
							<div class="descriptionBox">
								<div class="entryBox">
									<p>Entry Description</p>
									<template
										v-for="(item, index) in scope.row.entry_description"
									>
										<p :key="index"><span v-if="index != 0">&emsp;&emsp;{{index}}.</span>{{ item }}</p>
									</template>
								</div>
								<div class="exitBox">
									<p>Exit Description</p>
									<template v-for="(item, index) in scope.row.exit_description">
										<p :key="index"><span v-if="index != 0">&emsp;&emsp;{{index}}.</span>{{ item }}</p>
									</template>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="Entry & Exit" align="center">
						<template slot-scope="scope">
							{{ scope.row.entry_description[0] }}<br />
							<br />
							{{ scope.row.exit_description[0] }}<br />
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
									content="copy backtest link"
									placement="bottom-start"
								>
									<el-button
										plain
										icon="el-icon-link"
										circle
										size="mini"
										type="success"
										v-copy="scope.row.id"
									></el-button>
								</el-tooltip>
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
										:disabled="scope.row.status == 0 || scope.row.status == 3"
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
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'
import {copy,permission} from "@/tools/copyBacktestID";
import Cookies from 'vue-cookies'
const throttle = require('lodash/throttle')
import {
	copyBacktest,
	favoriteBacktest,
	getHistoryList,
	getStatus,
	seeParams,
	deleteBacktest,
	getBacktestName
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
			loadTest: 'Loading...',
			permission: Cookies.get('devbt2Userid')
		}
	},
	directives: {
    copy,
		permission
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

					if (res.data.results.length != 0) {
						res.data.results.forEach((element) => {
							historyNameList.push(element.name)
							if (element.result !== '')
								element.result = JSON.parse(element.result)
							if (element.entry_description.indexOf('[') != -1) {
								element.entry_description = JSON.parse(
									element.entry_description
								)
							}else{
								element.entry_description = [element.entry_description]
							}
							if (element.exit_description.indexOf('[') != -1) {
								element.exit_description = JSON.parse(element.exit_description)
							}else{
								element.exit_description = [element.exit_description]
							}
						})

						this.backtestList = res.data.results
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
			vm.loadTest = 'Generating Backtest report, please wait'
			
			vm.clearInterval = clearPromiseInterval
			let timer = setPromiseInterval(async () => {
				try {
					const res = await getStatus(id)
					CIQ.nprogress.inc()
				if (res.data.status == 2) {
					clearPromiseInterval(timer).then(() => {})
					vm.queryInfo.page = 1
					vm.getHistoryList()
					this.$emit('refFavoritesForm')
					

					let row = res.data
					row.result = JSON.parse(row.result)
					vm.viewBacktestResults(row)
				}
				if(res.data.status == 3) {
					clearPromiseInterval(timer).then(() => {})
					vm.queryInfo.page = 1
					vm.getHistoryList()
					this.$emit('refFavoritesForm')
					CIQ.hideCover()
					CIQ.nprogress.done()
					let row = res.data
					row.result = JSON.parse(row.result)
					vm.$notify({
					title: 'No trades',
					message: 'No trades, please change parameter.',
					offset: 100,
					type: 'warning'
				})
				}
				} catch (error) {
					vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
					})
					CIQ.addCover()
					CIQ.nprogress.start()
				}
			}, 3000)
		},
		editBacktest: throttle(async function (row) {
			console.log('row', row)
			let vm = this
			try {
				CIQ.addCover('Fetching backtest information...')
				CIQ.nprogress.start()
				const res = await seeParams(row.id)
				document.getElementsByClassName('ciq-period')[0].style.display = ''
				//  Restore indicator layout
				this.$store.commit('getBacktestSymbol', res.data.symbol)
				CIQ.hideMarker()
				CIQ.isMarkerShown = false
				if (res.data.indicator_layout) {
					this.restoreIndicatorLayoutEdit(
						JSON.parse(res.data.indicator_layout),
						res.data.frequency,
						row, res.data
					)
				} else {
					this.$store.commit('getRunBacktestData', row)
					// emit Synchronous call
					this.$emit('goBacktestResultForm', row, ()=>{
						this.$emit('goTobacktestSetupForm', row.id, res.data,()=>{
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
					})
				}
			} catch (error) {
				vm.$message({
					message: 'The internal server is busy, please try again later ',
					type: 'error',
					offset: 300
				})
			}
		}, 500),
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
			try {
			let params = {}
			const nameRes = await getBacktestName(row.name + '(copy)')
			
			if(nameRes.data.count != 0) {
				this.$notify.error({
						title: 'Has been Copied',
						message: 'The backtest has been copied',
						offset: 100
			    })
				return
			}
				const res = await seeParams(row.id)
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
					if (error.response.status === 500) {
						this.$notify.error({
							title: 'Service is busy',
							message: 'The internal server is busy, please try again later ',
							offset: 100
						})
					}
			}
			} catch (error) {
				this.$notify.error({
							title: 'Service is busy',
							message: 'The internal server is busy, please try again later ',
							offset: 100
						})
			}
		}, 1000),
		viewBacktestResults: throttle(async function (row) {
			if (row.result['Total Trades']) {
				document.getElementsByClassName('ciq-period')[0].style.display = 'none'
				try {
					
					CIQ.addCover('Fetching backtest information...')
					CIQ.nprogress.start()
					const res = await seeParams(row.id)
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					CIQ.hideMarker()
					CIQ.isMarkerShown = false
					if (res.data.indicator_layout) {
						this.restoreIndicatorLayoutView(
							JSON.parse(res.data.indicator_layout),
							res.data.frequency,
							row,res.data
						)
					} else {
						this.$store.commit('getRunBacktestData', row)
						this.$emit('goTobacktestSetupForm', row.id, res.data, ()=>{
							this.$emit('goBacktestResultForm', row, ()=>{
								CIQ.hideCover()
								CIQ.nprogress.done()
							})
						})
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
		}, 500),
		handleCurrentChange(newpage) {
			this.queryInfo.page = newpage
			this.getHistoryList()
		},
		reloadData(data, freq) {
			let frequency = ''
			this.$store.commit('getEntryIndicatorsList', data.formIndicators.entry)
			this.$store.commit('getExitIndicatorsList', data.formIndicators.exit)
			this.$store.commit('getExtraIndicators', [])
			// filter garbage in TechnicalIndicators
			// const technicalIndicators = data.technicalIndicators.filter(item=>{
			// 	data.formIndicators.entry.indexOf(item) != -1 || data.formIndicators.exit.indexOf(item) != -1
			// })
			this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
			this.$store.commit('getMA', data.activatedMA)
			this.$store.commit('setTechSD', data.savedTechSD)

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
		},
		restoreIndicatorLayoutView(data, freq, row, resData) {
			// After the run back test and between the view result, a chart will be loaded to output signalouput
			if (CIQ.isBacktestRun == true) {
				CIQ.isBacktestRun = false
				var that = this
				//The outputsignalsresult is no longer used. The exportcsv is placed before the backtest and the callback is placed in place
					that.$store.commit('getRunBacktestData', row)
					that.$emit('goTobacktestSetupForm', row.id, resData, ()=>{
						that.$emit('goBacktestResultForm', row, ()=>{
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
					})
			} else {
				this.reloadData(data, freq)
				var that = this
				CIQ.addIndicatorsFromBacktest(function () {
					that.$store.commit('getRunBacktestData', row)

					that.$emit('goTobacktestSetupForm', row.id, resData, ()=>{
						that.$emit('goBacktestResultForm', row, ()=>{
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
					})
					
				})
			}
		},
		restoreIndicatorLayoutEdit(data, freq, row, resData) {
				this.reloadData(data, freq)
				var that = this
				CIQ.addIndicatorsFromBacktest(function () {
					that.$store.commit('getRunBacktestData', row)
					
					that.$emit('goBacktestResultForm', row, ()=>{
						that.$emit('goTobacktestSetupForm', row.id, resData, ()=>{
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
					})
				})
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
.descriptionBox{
	display: flex;
	justify-content: space-around;
	.entryBox {
		p:first-child {
		font-weight: 500;
		color: #99a9bf;
	    }
	}
	.exitBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
}
</style>
