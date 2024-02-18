<template>
	<div class="favoriteForm_container">
		<el-button
			v-if="isSystem == 'system'"
			@click="runAllBacktest"
			class="fls-btn"
			size="mini"
			>run all backtest</el-button
		>
		<el-tooltip
			class="item"
			effect="dark"
			content="Migrate from backtest engine v1 to backtest engine v2"
			placement="bottom-start"
								>
		<el-button
			v-if="currentPage == 'Favorites'"
			@click="runBTV1Backtest"
			class="fls-btn"
			size="mini"
			>Migrate Backtest </el-button
		></el-tooltip>
		<el-button v-if="currentPage == 'Favorites'" @click="findLastSignal" class="fls-btn" size="mini">Find Last Signal</el-button>
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
			>
				<i slot="suffix" class="el-input__icon el-icon-search"></i>
			</el-input>
		</div>
    <el-table
      header-align="center"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="loadTest"
			:default-expand-all="isExpandAll"
      element-loading-spinner="el-icon-loading"
			@sort-change="onSortChange"
			style="width: 100%; height: 100%"
			:row-class-name="tableRowClassName"
			element-loading-background="rgba(0, 0, 0, 0.8)"
    >
    <el-table-column type="index" align="center">
        <template scope="scope">
          <span>{{ (queryInfo.page - 1) * 10 + scope.$index + 1 }}</span>
        </template>
		</el-table-column>
    <template v-for="item in tableCol">
      <el-table-column
        v-if="['Name', 'Symbol'].includes(item.label)"
        :label="item.label"
        :prop="item.field"
        :key="item.label"
				:width="item.width"
				show-overflow-tooltip
				align="center">
      </el-table-column>
			<el-table-column
				v-if="item.label == 'DesExpand'"
				:type="item.type"
				:key="item.label"
				>
				<template slot-scope="scope">
					<div class="expandArea">
						<div class="descriptionBox">
						<div class="entryBox">
							<p>Entry Description</p>
							<template
								v-for="(des, index) in scope.row.entry_description"
							>
								<p :key="index">
									<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
									>{{ des.commentDes }}
								</p>
							</template>
						</div>
						<div class="exitBox">
							<p>Exit Description</p>
							<template v-for="(des, index) in scope.row.exit_description">
								<p :key="index">
									<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
									>{{ des.commentDes }}
								</p>
							</template>
						</div>
					</div>
					<div class="urlBox" v-if="currentPage == 'Analyst'">
						<p>Analyst Report URL</p>
						<el-link :underline="false" :href="scope.row.report_url" target="_blank" type="primary">{{scope.row.report_url}}</el-link>
					</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				v-if="item.label == 'Entry & Exit'"
				:label="item.label"
				:key="item.label"
				align="center">
				<template slot-scope="scope">
					{{ scope.row.entry_description[0].commentDes }}<br />
					<br />
					{{ scope.row.exit_description[0].commentDes }}<br />
				</template>
			</el-table-column>
			<el-table-column
				v-if="item.label == 'Period'"
				:key="item.label"
				:label="item.label"
				show-overflow-tooltip
				align="center"
				:width="item.width"
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
				v-if="item.label == 'Timeframe'"
				:label="item.label"
				:key="item.label"
				:width="item.width"
				:prop="item.field"
				show-overflow-tooltip
				align="center"
				>
			</el-table-column>
			<el-table-column
				v-if="item.label == 'Last Signal Date' && currentPage == 'Favorites'"
				:key="item.label"
				:prop="item.field"
				align="center"
				show-overflow-tooltip
				:label="item.label"
				:sortable="item.label == 'Last Signal Date' ? 'custom' : false"
				:sort-orders="['ascending', 'descending', item.field]"
				:width="item.width"
			>
			<template slot-scope="scope">
					<div class="showDate">
						<el-button size="mini" type="info" plain
							>E: {{ scope.row.last_entry_signal_date ? scope.row.last_entry_signal_date : '' }}</el-button
						>
						<el-button size="mini" type="info" plain
							>X: {{ scope.row.last_exit_signal_date ? scope.row.last_exit_signal_date : '' }}</el-button
						>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				v-if="['Total Trades', 'Total Return'].includes(item.label)"
				:label="item.label"
				:key="item.label"
				:width="item.width"
				:prop="item.field"
				show-overflow-tooltip
				align="center"
				:sortable="[
					'Total Trades',
					'Total Return'
				].includes(item.label) ? 'custom' : false"
				:sort-orders="['ascending', 'descending', item.field]"
				>
			<template slot-scope="scope">
				<span v-if="item.label == 'Total Return'">{{scope.row[item.field] != 0 ? `${scope.row[item.field]}%` : scope.row[item.field]}}</span>
				<span v-else>{{scope.row[item.field]}}</span>
			</template>	
			</el-table-column>

    </template>
		<el-table-column align="center" width="280px">
						<template slot-scope="scope">
							<el-row>
								<el-tooltip
									class="item"
									effect="dark"
									content="rerun backtest"
									placement="bottom-start"
								>
									<el-button
										v-if="['History', 'Favorites'].includes(currentPage)"
										type="success"
										icon="el-icon-video-play"
										circle
										size="mini"
										@click="rerunBacktest(scope.row)"
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
										v-if="scope.row.favorites == false && currentPage == 'History'"
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
									v-if="scope.row.favorites == true && ['History', 'Favorites'].includes(currentPage)"
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
										v-if="['History', 'Favorites'].includes(currentPage)"
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
										v-if="['History', 'Favorites', 'Sample', 'Analyst'].includes(currentPage)"
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
											v-if="currentPage == 'History' && scope.row.favorites == false"
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
											v-if="currentPage == 'History' && scope.row.favorites == true"
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
								<el-tooltip
									class="item"
									effect="dark"
									content="optimize backtest results"
									placement="bottom-start"
								>
									<el-button
										v-if="['History', 'Favorites'].includes(currentPage) && isButtonVisible"
										:disabled="isOptRuning"
										type="success"
										icon="el-icon-data-analysis"
										circle
										size="mini"
										@click="optimizeBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="copy backtest link"
									placement="bottom-start"
								>
									<el-button
										v-if="currentPage == 'Analyst'"
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
		<div slot="empty" style="text-align: left">
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
		<Optimize ref="OPT" @refreshList="refreshList"></Optimize>
	</div>
</template>

<script>
import {
  getHistoryList,
	getSampleList,
  getFavoriteList,
	getAnalystList
} from '@/service/service.js'
import {isJson} from '@/utils'
import { throttle } from 'lodash'
import { CommonMethodsMixin } from "@/components/common/mixins/commonMethodsMixin"
import { copy } from "@/components/common/directives/copyBacktestID"
import { RefreshBus } from "../EventBus/Bus"
import Optimize from "@/components/common/optimizeBT/Optimize.vue";

export default {
	name: 'Table',
	components: {
		Optimize
	},
	props: {
		tableCol: Array,
		currentPage: String,
		isExpandAll: Boolean,
		loading: Boolean
	},
	mixins: [CommonMethodsMixin],
	data() {
		return {
			dataList: [],
			loadTest: 'Loading...',
			queryInfo: {
				page: 1,
				total: 0
     		},
			searchItem: '',
     		currentSort: {}, // 当前的排序信息
			searchItem: '',
			isButtonVisible: false
		}
	},
	directives: {
		copy
	},
	async created() {
		// 获取当前的域名
		const currentDomain = window.location.hostname;
		console.log('当前域名', currentDomain)
		// 如果当前域名是 devbt2.sentimentrader.com 或 localhost，则将 isButtonVisible 设置为 true
		if (currentDomain == 'devbt2.sentimentrader.com' || currentDomain == 'localhost') {
			this.isButtonVisible = true;
		}
		await this.getDataList(null)
	// 监听事件总线中的 refresh-list 事件
  	// RefreshBus.$on(`refresh-list`, (_) => {
    //   // 在这里执行刷新列表的操作，重新获取数据
    //   this.getDataList(null)
    // })
		this.loading = false
	},
	computed: {
		is_admin() {
      return this.$store.state.user.is_admin
    },
		isSystem() {
			return this.$store.state.form.role
		},
		isOptRuning() {
			return this.$refs['OPT'].optimizeState
		}
	},
	methods: {
		async refreshList() {
			// 重置查询页码并获取数据 History
			if (this.currentPage === 'History') {
				this.queryInfo.page = 1
				await this.getDataList(null)
			}
			if (['Sample', 'Favorites', 'Analyst'].includes(this.currentPage)) {
				this.$router.push('/backtester/list/history')
			}
			this.popUpMsgBox('Optimize successfully')
		},
		optimizeBacktest(data) {
			this.$refs['OPT'].optimizeBacktest(data)
		},
		async getDataList(orderby) {
			let res = null
			try {
				if(this.currentPage == 'History'){
					res = await getHistoryList(this.queryInfo.page, orderby, this.searchItem)
				}else if(this.currentPage == 'Favorites'){
					res = await getFavoriteList(this.queryInfo.page, orderby, this.searchItem)
				}else if(this.currentPage == 'Sample'){
					res = await getSampleList(this.queryInfo.page, orderby, this.searchItem)
				}else if(this.currentPage == 'Analyst'){
					res = await getAnalystList(this.queryInfo.page, orderby, this.searchItem)
				}
				if (res.status == 200) {
					let data = res.data.results
					data = data.map(item => {
						if(item.total_return == null || item.total_trader == null){
							/* 兼容之前的 result: "{\"Total Trades\": 108, \"Total Return (%)\": 92.58}" */
							if(isJson(item.result)) {
								const result = JSON.parse(item.result)
								item.total_return = result['Total Trades']
								item.total_trader = result['Total Return (%)']
							}
						}
						if(isJson(item.entry_description)) {
							item.entry_description = JSON.parse(item.entry_description)
						}else if(typeof item.entry_description === 'string') {
							const entryObj = {
								commentDes: item.entry_description,
								rocCond: {
									newCondition: 3,
									conditionPeriod: 5
								}
							}
							item.entry_description = [entryObj]
						}
						if(isJson(item.exit_description)) {
							item.exit_description = JSON.parse(item.exit_description)
						}else if(typeof item.exit_description === 'string'){
							const exitObj = {
								commentDes: item.exit_description,
								rocCond: {
									newCondition: 3,
									conditionPeriod: 5
								}
							}
							item.exit_description = [exitObj]
						}
						return item
					})
					this.dataList = data
					console.log('data', data)
					this.queryInfo.total = res.data.count
				}
			} catch(error) {
				console.log('报错了', error)
        if(error.response.status === 404) {
          let page = this.queryInfo.page
          const newPage = page != 1 ? page - 1 : 1
          this.handleCurrentChange(newPage)
        }
			}
		},
		tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 0) {
			return 'dark-row'
			}
			return ''
		},
		handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.applySort()
    },
		async onSortChange({ column, prop, order }) {
			
			if(this.queryInfo.page != 1) this.queryInfo.page = 1
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
      let { prop, order } = this.currentSort;
			console.log('order', order)
			console.log('prop', prop)
      //  order: 升 'ascending' | 降'descending' | 取消升降 null | order: total_return 
      if (order == null || order == prop) {
        // 不排序
        prop = null
      }
      if (order == 'ascending') {
        // 升序排列
        prop = `-${prop}`
      }
			this.getDataList(prop)
		},
		handleQuery: throttle(function() {
			this.getDataList()
		}, 500),
	}
}
</script>

<style lang="less" scoped>
.favoriteForm_container {
	background-color: #fff;
}
.searchBox {
  float: left;
  .search {
		margin: 20px 28px 10px 10px;
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
.descriptionBox {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	> * {
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
}
.fls-btn {
	float: right;
	color: white;
	background: #5b9bd1;
	width: 200px;
	margin-left: 20px;
	margin: 20px 28px 10px 10px
}
.urlBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
}
</style>