<template>
	<el-row>
		<el-col :span="24">
			<div class="favoriteForm_container">
				<el-table
					:data="backtestList"
					v-loading="loading"
					element-loading-text="Loading"
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
					<!-- <el-table-column label="Entry & Exit" align="center">
						<template slot-scope="scope">
								<el-tooltip placement="top" effect="dark" transition  v-if="(scope.row.entry_description) instanceof Array">
								<div slot="content" v-for="(item,index) in scope.row.entry_description" :key="index">
									{{ item }}<br/>
								</div>
								<div v-for="(item,index) in scope.row.entry_description" :key="index">
								{{ scope.row.entry_description[0] }}<br/>
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
									{{ scope.row.exit_description[0] }}<br/>
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
					<el-table-column align="center" width="200px">
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
										type="warning"
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
								<!-- <el-button
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
								></el-button> -->
								<!-- <el-tooltip
									class="item"
									effect="dark"
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
								<!-- <el-tooltip
									class="item"
									effect="dark"
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
								</el-tooltip> -->
								<!-- <el-tooltip
									class="item"
									effect="dark"
									content="delete backtest"
									placement="bottom-start"
								>
									<el-popconfirm
										confirm-button-text="yes"
										cancel-button-text="no"
										icon="el-icon-info"
										icon-color="red"
										title="remove from favorites"
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
								</el-tooltip> -->
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
const throttle = require('lodash/throttle')
import {
	getFavoriteList,
	getStatus,
	seeParams,
	deleteBacktest,
	copyBacktest,
	favoriteBacktest
} from '@/service/service'
import { warn } from 'vue-class-component/lib/util'
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
	methods: {
async getFavoriteList(strategy) {
			//this.loading = true
			let page = this.queryInfo.page
			try {
				const res = await getFavoriteList(page)
				if (res.status === 200) {
					this.loading = false
					this.backtestList = res.data.results
					if (this.backtestList.length != 0) {
						this.backtestList.forEach((element) => {
														if (element.result !== '')
								element.result = JSON.parse(element.result)
								if(element.entry_description.indexOf("[") != -1) {
									element.entry_description = JSON.parse(element.entry_description)
								}else{
								element.entry_description = [element.entry_description]
							}
								if(element.exit_description.indexOf("[") != -1) {
									element.exit_description = JSON.parse(element.exit_description)
								}else{
								element.exit_description = [element.exit_description]
							}
						})
					}
					this.queryInfo.total = res.data.count
				}
			} catch (error) {
				console.log(error);
				//this.loading = false
			}
		},
		editBacktest: throttle(async function (row) {
			let vm = this
			try {
				CIQ.addCover('Fetching backtest information...')
				CIQ.nprogress.start()

				//vm.loading = true
				const res = await seeParams(row.id)
				document.getElementsByClassName('ciq-period')[0].style.display = ''
				// 恢复indicator layout
				this.$store.commit('getBacktestSymbol', res.data.symbol)
				CIQ.hideMarker()
				CIQ.isMarkerShown = false
				if (res.data.indicator_layout) {
					this.restoreIndicatorLayoutEdit(
						JSON.parse(res.data.indicator_layout),
						res.data.frequency,
						row, res.data
					)
				}
				else{
					this.$store.commit('getRunBacktestData', row)
					// emit同步调用
					this.$emit('goBacktestResultForm', row, ()=>{
						this.$emit('goTobacktestSetupForm', row.id, res.data,()=>{
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
					})
					//this.loading = false
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
					this.getFavoriteList()
					this.$emit('refHistoryForm')
				} else {
					this.$message.error({
						message: 'The deletion failed',
						duration: 1000
					})
				}
			} catch (error) {
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
			this.$store.commit('getBacktestSymbol', res.data.symbol)

			params = res.data
			params.name = params.name + '(copy)'
			delete params.uuid
			delete params.results
			delete params.user_id
			delete params.status
			delete params.backtest_id
			let paramsStr = this.$qs.stringify(params)
			try {
				const copyRes = await copyBacktest(paramsStr)
				if (copyRes.status === 201) {
					this.getFavoriteList()
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
						this.$notify.error({
							title: 'Service is busy',
							message: 'The internal server is busy, please try again later ',
							offset: 100
						})
					}
			}
		}, 500),
		viewBacktestResults: throttle(async function (row) {
			if (row.result['Total Trades']) {
				document.getElementsByClassName('ciq-period')[0].style.display = 'none'
				let vm = this
				try {
					CIQ.addCover('Fetching backtest information...')
					CIQ.nprogress.start()
					
					//vm.loading = true
					const res = await seeParams(row.id)
					// 恢复indicator layout
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					CIQ.hideMarker()
					CIQ.isMarkerShown = false
					if (res.data.indicator_layout) {
						this.restoreIndicatorLayoutView(
							JSON.parse(res.data.indicator_layout),
							JSON.parse(res.data.entry).frequency,
							row,res.data
						)
					}
					else{
						this.$store.commit('getRunBacktestData', row)
						// emit同步调用
						this.$emit('goTobacktestSetupForm', row.id, res.data, ()=>{
							this.$emit('goBacktestResultForm', row, ()=>{
								CIQ.hideCover()
								CIQ.nprogress.done()
							})
						})
						//this.loading = false
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
			this.getFavoriteList()
		},
		reloadData(data, freq){
			let frequency = ''
			this.$store.commit('getEntryIndicatorsList', data.formIndicators.entry)
			this.$store.commit('getExitIndicatorsList', data.formIndicators.exit)
			this.$store.commit('getExtraIndicators', [])
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
			// CIQ.addIndicatorsFromBacktest()
		},
		restoreIndicatorLayoutView(data, freq, row, resData) {
				this.reloadData(data, freq)
				var that = this
				CIQ.addIndicatorsFromBacktest(function(){
					that.$store.commit('getRunBacktestData', row)
					// emit同步调用
					that.$emit('goTobacktestSetupForm', row.id, resData, ()=>{
						that.$emit('goBacktestResultForm', row, ()=>{
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
					})
					
					//that.loading = false
				})
		},
		restoreIndicatorLayoutEdit(data, freq, row, resData) {
				this.reloadData(data, freq)
				var that = this
				CIQ.addIndicatorsFromBacktest(function(){
					that.$store.commit('getRunBacktestData', row)
					// emit同步调用
					
					that.$emit('goBacktestResultForm', row, ()=>{
						that.$emit('goTobacktestSetupForm', row.id, resData, ()=>{
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
					})
					//that.loading = false
				})
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
				const res = await seeParams(row.id)
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
					this.getFavoriteList()
					this.$emit('refHistoryForm')
				} else {
					this.getFavoriteList()
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
		}, 500),
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
					this.getFavoriteList()
					this.$emit('refHistoryForm')
				} else {
					this.getFavoriteList()
					this.$message.error({
						message: 'removed failed',
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
		}, 500)
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
	.entryBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
	.exitBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
}
</style>
