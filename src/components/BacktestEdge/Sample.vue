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
					default-expand-all
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
					<!-- <el-table-column label="Entry & Exit" align="center" 
					
						show-overflow-tooltip>
						<template slot-scope="scope">
							<el-tooltip placement="top">
								<div>
									<p>{{ scope.row.entry_description }}</p>
									<p>{{ scope.row.exit_description }}</p>
								</div>
								<div slot="content">
									{{ scope.row.entry_description }}<br />{{
										scope.row.exit_description
									}}
								</div>
							</el-tooltip>
						</template>
					</el-table-column> -->
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
					<!-- <el-table-column
						label="Timeframe"
						show-overflow-tooltip
						align="center"
						width="90px"
					>
						<template slot-scope="scope">
							<p>{{ scope.row.frequency }}</p>
						</template>
					</el-table-column> -->
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
					<el-table-column align="center">
						<template slot-scope="scope">
							<el-row>
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
								<!-- <el-button
									plain
									icon="el-icon-s-comment"
									circle
									@click="sendBack(scope.row)"
									size="mini"
								></el-button> -->
								<!-- <el-button
									plain
									icon="el-icon-check"
									circle
									@click="showDes(scope.row)"
									size="mini"
								></el-button> -->
								<el-tooltip
									class="item"
									effect="dark"
									content="view backtest results"
									placement="bottom-start"
								>
									<el-button
										type="warning"
										:disabled="scope.row.status == 0 || scope.row.status == 3"
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
const throttle = require('lodash/throttle')
import {
	copyBacktest,
	getSampleList,
	seeParams,
	seeReport
} from '@/service/service'
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
	methods: {
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
				console.log(error)
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
				console.log(error)
			}
		},
		async getSampleList() {
			this.loading = true
			let page = this.queryInfo.page
			try {
				const res = await getSampleList(page)
				if (res.status === 200) {
					this.backtestList = res.data.results
					console.log(this.backtestList)
					if (this.backtestList.length != 0) {
						this.backtestList.forEach((element) => {
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
					}
					this.queryInfo.total = res.data.count
					this.loading = false
				}
			} catch (error) {
				console.log(error)
				this.$message.error('List request failed')
				this.loading = false
			}
		},
		copyBacktest: throttle(async function (row) {
			let params = {}
			const res = await seeParams(row.id)
			if (res.status === 200) {
				this.$store.commit('getBacktestSymbol', res.data.symbol)
				this.$store.commit('getRunBacktestData', row)
				params = res.data
				params.name = params.name + '(copy)'
				delete params.results
				delete params.uuid
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
						this.$emit('goToHistoryForm')
						this.$emit('refHistoryForm')
					} else {
						this.$notify.error({
							title: 'Failed',
							message: 'Copy failed',
							offset: 100
						})
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
			}
		}, 500),
		viewBacktestResults: throttle(async function (row) {
			if (row.result['Total Trades']) {
				document.getElementsByClassName('ciq-period')[0].style.display = 'none'
				try {
					const res = await seeParams(row.id)
					// 恢复indicator layout
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					CIQ.hideMarker()
					CIQ.isMarkerShown = false
					if (res.data.indicator_layout) {
						this.restoreIndicatorLayout(
							JSON.parse(res.data.indicator_layout),
							JSON.parse(res.data.entry).frequency,
							row
						)
					} else {
						this.$store.commit('getRunBacktestData', row)
						this.$emit('goTobacktestSetupForm', row.id)
						this.$emit('goBacktestResultForm', row)
					}
				} catch (error) {
					this.$message({
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
			this.getSampleList()
		},
		reloadData(data, freq) {
			let frequency = ''
			this.$store.commit('getEntryIndicators', data.formIndicators.entry)
			this.$store.commit('getExitIndicators', data.formIndicators.exit)
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
		},
		restoreIndicatorLayout(data, freq, row) {
			this.reloadData(data, freq)
			var that = this
			CIQ.addIndicatorsFromBacktest(function () {
				that.$store.commit('getRunBacktestData', row)
				that.$emit('goTobacktestSetupForm', row.id)
				that.$emit('goBacktestResultForm', row)
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
