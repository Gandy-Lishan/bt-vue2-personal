// Sample Backtests List
<template>
	<el-row>
		<el-col :span="24">
			<div class="favoriteForm_container">
        <div class="searchBox">
				<el-input
					class="search"
					style="width: 30vw"
					size="mini"
					v-model="searchItem"
					placeholder="Search for the name of the backtest"
					@keyup.enter.native="handleQuery"
					clearable
					@clear="handleQuery"
				><i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>
				</div>
				<el-table
					:data="backtestList"
					v-loading="loading"
					:element-loading-text="loadTest"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"
					default-expand-all
					@sort-change="onSortChange"
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
						width="380px"
					>
					</el-table-column>
					<el-table-column
						label="Symbol"
						align="center"
						prop="symbol"
						width="100px"
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
							<div class="expandArea">
								<div class="descriptionBox">
									<div class="entryBox">
										<p>Entry Description</p>
										<template
											v-for="(item, index) in scope.row.entry_description"
										>
											<p :key="index"><span v-if="index != 0">&emsp;&emsp;{{index}}.</span>{{ item.commentDes
 }}</p>
										</template>
									</div>
									<div class="exitBox">
										<p>Exit Description</p>
										<template v-for="(item, index) in scope.row.exit_description">
											<p :key="index"><span v-if="index != 0">&emsp;&emsp;{{index}}.</span>{{ item.commentDes
 }}</p>
										</template>
									</div>
								</div>
								<div class="urlBox">
									<p>Analyst Report URL</p>
									<el-link :underline="false" :href="scope.row.report_url" target="_blank" type="primary">{{scope.row.report_url}}</el-link>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="Entry & Exit" align="center">
						<template slot-scope="scope">
							{{ scope.row.entry_description[0].commentDes
 }}<br />
							<br />
							{{ scope.row.exit_description[0].commentDes
 }}<br />
						</template>
					</el-table-column>
					<el-table-column
						label="Period"
						show-overflow-tooltip
						align="center"
						width="100px"
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
						width="115px"
					>
						<template slot-scope="scope">
							<p>{{ scope.row.frequency }}</p>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						show-overflow-tooltip
						label="Total Trades"
						prop="total_trader"
						sortable="custom"
						:sort-orders="['ascending','descending', 'total_trader']"
						width="125px"
					>
						<template slot-scope="scope">
							<!-- <span v-if="scope.row.result['Total Trades']">{{
								scope.row.result['Total Trades']
							}}</span> -->
							<span v-if="scope.row.total_trader">{{
								scope.row.total_trader
							}}</span>
							<span v-else>{{ 0 }}</span>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						show-overflow-tooltip
						label="Total Return"
						prop="total_return"
						sortable="custom"
						:sort-orders="['ascending', 'descending', 'total_return']"
						><template slot-scope="scope">
							<!-- <span v-if="scope.row.result['Total Return (%)']">{{
								scope.row.result['Total Return (%)'] + '%'
							}}</span> -->
							<span v-if="scope.row.total_return">{{
								scope.row.total_return + '%'
							}}</span>
							<span v-else>{{ 0 + '%' }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center">
						<template slot-scope="scope">
							<el-row>
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
								
								<el-tooltip
									class="item"
									effect="dark"
									content="copy backtest link"
									placement="bottom-start"
								>
									<el-button
									:disabled="scope.row.status == 0 || scope.row.status == 3"
										plain
										icon="el-icon-link"
										circle
										size="mini"
										type="success"
										v-copy="scope.row.id"

									></el-button>
								</el-tooltip>
							</el-row>
						</template>
					</el-table-column>
					<div slot="empty" style="text-align: left;">
						<el-empty image-size="80" description="No Data"></el-empty>
					</div>
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
import isJson from '@/tools/isJson.js'
import {copy,permission} from "@/tools/copyBacktestID";
const throttle = require('lodash/throttle')
import { CIQ } from 'chartiq/st-development/js/entryIndicator'

import {
	copyBacktest,
	seeParams,
	getAnalystList,
	getBacktestName,
	searchAnalystList
} from '@/service/service'
export default {
	name: 'Backtests',
	data() {
		return {
			backtestList: [],
			loading: false,
			queryInfo: {
				page: 1,
				total: 0
			},
			loadTest: 'Loading',
			searchItem: '',
      currentSort: {}, // 当前的排序信息
		}
	},
	directives: {
    copy,
		permission
  },
	mounted() {
		this.getAnalystList()
	},
	methods: {
		async getAnalystList(orderby) {
			this.loading = true
			try {
				let res
        res = await getAnalystList(this.queryInfo.page, orderby, this.searchItem)
				console.log('响应', res)
				if (res.status === 200) {
					this.backtestList = res.data.results
					console.log(this.backtestList)
					if (this.backtestList.length != 0) {
						this.backtestList.forEach((element) => {
							if(isJson(element.result) && element.result !== '')
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
				console.error(error)
				if(error.response.status === 500){
			     this.$notify({
							title: 'Failed',
							message: 'List request failed',
							type: 'error'
						})}
						
				this.loading = false
			}
		},
		copyBacktest: throttle(async function (row) {
			try {
				let params = {}
				const nameRes = await getBacktestName(row.name + '(copy)')
				if (nameRes.data.count != 0) {
          let nameChecked = true
          const nameResults = nameRes.data.results
          for (let i = 0; i < nameResults.length; i++) {
            if (nameResults[i].name == `${row.name}(copy)`) {
              // 重名
              nameChecked = false
              break
            }
          }
          if(!nameChecked){
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.error({
              title: 'Has been Copied',
              message: 'The backtest has been copied'
            })
            return
          }
				}
				let res = null
				try {
					res = await seeParams(row.id)
				} catch (error) {
					throw Error('Request Error')
				}
				if (res.status === 200) {
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					this.$store.commit('getRunBacktestData', row)
					params = res.data
					params.name = params.name + '(copy)'
					params.user_tag = 'client'
					params.report_url = ''
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
								message:
									'After copying successfully, you can edit the backtest',
									type: 'success'

							})
							this.$emit('goToHistoryForm')
							this.$emit('refHistoryForm')
						} else {
							this.$notify.error({
								title: 'Failed',
								message: 'Copy failed'
							})
						}
					} catch (error) {
						if (error.response.status === 403) {
							this.$notify.error({
								title: 'Has been Copied',
								message: 'The backtest has been copied'
							})
						}
						if (error.response.status === 500) {
							console.log(error)
							this.$notify.error({
								title: 'Service is busy',
								message: 'The internal server is busy, please try again later '
							})
						}
						CIQ.hideCover()
						CIQ.nprogress.done()
					}
				}
			} catch (error) {
				console.log(error)
				this.$notify.error({
					title: 'Service is busy',
					message: 'The internal server is busy, please try again later '
				})
				CIQ.hideCover()
				CIQ.nprogress.done()
			}
		}, 500),
		viewBacktestResults: throttle(async function (row) {
			const vm = this
			if (row.result['Total Trades']) {
				document.getElementsByClassName('ciq-period')[0].style.display = 'none'
				try {
					CIQ.addCover('Fetching backtest information...')
					CIQ.nprogress.start()
					let res = null
					try {
						res = await seeParams(row.id)
					} catch (error) {
						throw Error('Request Error')
					}
					this.$store.commit('getBacktestSymbol', res.data.symbol)
					CIQ.hideMarker()
					CIQ.isMarkerShown = false
					if (res.data.indicator_layout) {
						let parsedData = JSON.parse(res.data.indicator_layout.replaceAll('$r001$','\u200c'))
						this.restoreIndicatorLayoutView(
							parsedData,
							res.data.frequency,
							row,res.data
						)
					} else {
						this.$store.commit('getRunBacktestData', row)
						this.$emit('goTobacktestSetupForm', row.id, res.data, 'cannotDelView', ()=>{
							this.$emit('goBacktestResultForm', row, ()=>{
								CIQ.hideCover()
								CIQ.nprogress.done()
							})
						})
					}
				} catch (error) {
					console.error(error)
					vm.$message({
						message: 'The internal server is busy, please try again later ',
						type: 'error'
					})
					CIQ.hideCover()
					CIQ.nprogress.done()
				}
			} else {
				this.$notify({
					title: 'No trades',
					message: 'No trades, please change parameter.',
					type: 'warning'
				})
				CIQ.hideCover()
				CIQ.nprogress.done()
			}
		}, 500),
		restoreIndicatorLayoutView(data, freq, row, resData) {
			// After the run back test and between the view result, a chart will be loaded to output signalouput
			if (that.$store.getters.getIsBacktestRunningFlagState == true) {
				that.$store.dispatch('set_isBacktestRunning_flag',false)
				var that = this
				//The outputsignalsresult is no longer used. The exportcsv is placed before the backtest and the callback is placed in place
					that.$store.commit('getRunBacktestData', row)
					that.$emit('goTobacktestSetupForm', row.id, resData, 'cannotDelView', ()=>{
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

					that.$emit('goTobacktestSetupForm', row.id, resData, 'cannotDelView',()=>{
						that.$emit('goBacktestResultForm', row, ()=>{
							CIQ.hideCover()
							CIQ.nprogress.done()
						})
					})
					
				})
			}
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
			// 暂定，编辑时读取回测携带的ma位置和信息
			this.$store.commit('getMALayout', data.activatedMALayout)
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
		handleCurrentChange(newpage) {
			this.queryInfo.page = newpage
			// this.getAnalystList()
      this.applySort();
		},
		async onSortChange({ column, prop, order }) {
			/**
		 * 表格排序事件处理函数
		 * @param {object} {column,prop,order} 列数据|排序字段|排序方式
		 */
      if (column.sortable !== 'custom') return
      this.currentSort = {
        prop: prop,
        order: order,
      };
      await this.applySort()
    },
    async applySort() {
			console.log(this.currentSort)
      let { prop, order } = this.currentSort;
      //  order: 升 'ascending' | 降'descending' | 取消升降 null | order: total_return 
      if (order == null || order == prop) {
        // 不排序
        prop = null
      }
      if (order == 'ascending') {
        // 升序排列
        prop = `-${prop}`
      }
      this.loadTest = 'Loading...'
      this.loading = true
      const res = await getAnalystList(this.queryInfo.page, prop, this.searchItem)
      if (res.status === 200) {
        this.loading = false
        this.backtestList = res.data.results

        if (res.data.results.length != 0) {
          res.data.results.forEach((element) => {
            if (element.result !== '')
              element.result = JSON.parse(element.result)
            if (element.entry_description.indexOf('[') != -1) {
              element.entry_description = JSON.parse(
                element.entry_description
              )
            } else {
              element.entry_description = [element.entry_description]
            }
            if (element.exit_description.indexOf('[') != -1) {
              element.exit_description = JSON.parse(element.exit_description)
            } else {
              element.exit_description = [element.exit_description]
            }
          })

          this.backtestList = res.data.results
        }
        this.queryInfo.total = res.data.count
      }
      this.loading = false
    },
		handleQuery: throttle(function () { this.getAnalystList() }, 500)
	}
}
</script>
<style lang="less" scoped>
.searchBox {
  float: left;
  .search {
	margin-right: 28px;
}
}
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
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 20px;
	> *{
		flex: 1;
	}
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
	.urlBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
}
</style>
