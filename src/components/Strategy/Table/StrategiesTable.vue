<template>
	<div class="StrategiesContent">
		<!-- <div class="tagBox">
			<el-tag
				v-for="tag in tags"
				:key="tag.label"
				:type="tag.type"
				@click="highlightTag(tag)"
				:class="{ 'highlighted-tag': tag.value === highlightedTag }"
				effect="plain"
			>
				{{ tag.label }}
			</el-tag>
		</div> -->
		<div class="strategiesTable">
			<el-table
				ref="Table"
				:data="paginatedData"
				empty-text="No data"
				v-loading="loading"
				@sort-change="onSortChange"
				size="small"
				style="width: 100%; height: 100%; margin: 0 auto"
				:row-class-name="tableRowClassName"
			>
				<!-- <el-table-column prop="isRight" width="50px">
					<template slot="header" slot-scope="scope">
						<div>
							<el-checkbox
								v-model="selection"
								:indeterminate="isIndeterminate"
								@click.prevent.stop.native="
									handleSelectedFn('selection', 'isIndeterminate', scope)
								"
							>
							</el-checkbox>
						</div>
					</template>
					<template slot-scope="scope">
						<div>
							<el-checkbox
								v-model="scope.row.selection"
								@click.prevent.stop.native="
									handleListSelectedFn('selection', 'isIndeterminate', scope)
								"
							>
							</el-checkbox>
						</div>
					</template>
				</el-table-column> -->
				<template v-for="l in tableCol">
					<el-table-column
						:label="l.label"
						:prop="l.value"
						:key="l.key"
						show-overflow-tooltip
						:min-width="l.minWidth"
						:max-width="l.maxWidth"
						:width="l.width"
						v-if="
							[
								'model_name',
								'type',
								'current_state',
								'date',
								'update_frequency',
								'YTD_return'
							].includes(l.value)
						"
						:sortable="
							[
								'model_name',
								'type',
								'current_state',
								'date',
								'update_frequency',
								'YTD_return'
							].includes(l.value)
								? 'custom'
								: false
						"
					>
						<template #header>
							<span v-html="l.label"></span>
						</template>
						<template slot-scope="scope">
							<span class="tableText" v-if="l.value === 'model_name'">
								<el-button
									type="text"
									@click="
										() => {
											viewSignalDescription(scope.row)
										}
									"
									>{{ scope.row[l.value] }}</el-button
								>
							</span>
							<span class="tableText" v-else>
								{{ scope.row[l.value] }}
							</span>
						</template>
					</el-table-column>
					<el-table-column
						:key="l.key"
						:width="l.width"
						v-if="['btn'].includes(l.value)"
					>
						<template slot-scope="scope">
							<el-row>
								
							<el-tooltip
									class="item"
									effect="dark"
									content="Add To Favorites" 
									v-if="!scope.row.favorite"
									placement="bottom-start"
								>
									<el-button
										v-if="!scope.row.favorite"
										round
										icon="el-icon-star-off"
										@click="addToFavorites(scope.row)"
										size="mini"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="Remove From Favorites"
									v-if="scope.row.favorite"
									placement="bottom-start"
								>
									<el-button
										v-if="scope.row.favorite"
										type="warning"
										round
										icon="el-icon-star-on"
										@click="moveToFavorites(scope.row)"
										size="mini"
									></el-button>
								</el-tooltip>
							<el-tooltip
									class="item"
									effect="dark"
									content="Backtest This Strategy"
									placement="bottom-start"
								>
								<el-button
									round
									size="mini"
									type="primary"
									icon="el-icon-right"
									@click="handleRowClick(scope.row)"
								></el-button>
							</el-tooltip>
							</el-row>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:page-sizes="[10, 30, 50, 100, 200]"
				:page-size="pageSize"
				:current-page="currentPage"
				:total="immutableTableData.length"
				layout="total, sizes, prev, pager, next, jumper"
			></el-pagination>
		</div>
	</div>
</template>

<script>
import { getStrategyList, getStrategiesJSON, addStrategyFavorites, moveStrategyFavorites } from '@/service/service'
import { LocalStorageUtil, timestampToTime } from '@/utils'
import moment from 'moment';

export default {
	name: 'StrategiesTable',
	props: {
		highlightedTag: String
	},
	data() {
		return {
			tags: [
				{ type: 'info', label: 'All', value: 'All' },
				{ type: 'info', label: 'Legacy Index', value: 'Legacy' },
				{ type: 'info', label: 'Index', value: 'INDEX' },
				{ type: 'info', label: 'Bond', value: 'Bond' },
				{ type: 'info', label: 'Factors', value: 'Factors' },
				{ type: 'info', label: 'Sector', value: 'Sector' },
				{ type: 'info', label: 'My Favorites', value: 'Favorites' }
			],
			loading: false,
			pageSize: 10, // Default page size
			currentPage: 1, // Default current page
			total: 0,
			searchItem: '',
			tableCol: [],
			tableData: [],
			immutableTableData: [],
			currentSort: {}, // 当前的排序信息
			dataList: [],
			selection: false,
			isIndeterminate: false,
			strategiesJSON: [],
			portfolioList: []
		}
	},
	computed: {
		paginatedData() {
			// 计算分页数据
			const startIndex = (this.currentPage - 1) * this.pageSize
			const endIndex = startIndex + this.pageSize
			return this.immutableTableData.slice(startIndex, endIndex)
		}
	},
	async mounted() {
		// if (!this.tableData.length || !this.tableData) await this.getDataList()
		// await this.getStrategyJSON()

// 计算上个月的最后一天（使用本地时间）
const lastMonthEnd = moment().subtract(1, 'months').endOf('month').format('MM/DD/YY');

this.tableCol = [
  {
    label: 'Model Name',
    value: 'model_name',
    key: 'model_name',
    minWidth: '170px',
  },
  {
    label: 'Time<br/>Frame',
    value: 'type',
    key: 'type',
    width: '120px'
  },
  {
    label: 'Current Signal:<br/>(e.g., Long, Sell, etc)',
    value: 'current_state',
    key: 'current_state',
    width: '240px'
  },
  {
    label: 'Last Signal Date: (last change in Signal)',
    value: 'date',
    key: 'date',
    width: '120px'
  },
  {
    label: 'Model Update<br/>Frequency',
    value: 'update_frequency',
    key: 'update_frequency',
    width: '100px'
  },
  {
    label: `YTD until<br/>${lastMonthEnd}<br/>Return(%)`, // 动态更新日期
    value: 'YTD_return',
    key: 'YTD_return',
    width: '125px'
  },
  {
    label: 'To BTV3',
    value: 'btn',
    key: 'btn',
    width: '120px'
  }
];

	console.log(`✅ 计算出的上个月最后一天: ${lastMonthEnd}`);
	},
	methods: {
		async mountedRequestList() {
			if (!this.tableData.length || !this.tableData) await this.getDataList()
			await this.getStrategyJSON()
		},
		handleSizeChange(size) {
			this.pageSize = size
			this.currentPage = 1 // Reset to the first page when the page size changes
		},
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage
			const strategy_filter_state = LocalStorageUtil.get('strategy_filter_state')
			LocalStorageUtil.set('strategy_filter_state', {...(!strategy_filter_state ? {} : strategy_filter_state) , currentStrategiesPage: currentPage})
		},
		handleSelectedFn(selectionvalue, isIndeterminatevalue) {
			// 点击table头部全选框
			// 头部全选框状态改变
			this[selectionvalue] = !this[selectionvalue]
			// 列表选择框状态改变
			for (let i = 0; i < this.paginatedData.length; i++) {
				this.paginatedData[i][selectionvalue] = this[selectionvalue]
				this[isIndeterminatevalue] = false
			}
			console.log('this.paginatedData.filter((item) => item.selection)', this.paginatedData.filter((item) => item.selection))
		},
		handleListSelectedFn(selectionvalue, isIndeterminatevalue, scope) {
			// 点击table列表内的选择框
			// table列表内选择框状态改变
			this.paginatedData[scope.$index][selectionvalue] =
				!this.paginatedData[scope.$index][selectionvalue]
			this.portfolioList = [...this.portfolioList.filter((item) => item.selection), ...this.paginatedData.filter((item) => item.selection)].filter((item, index, self) =>
      index === self.findIndex((t) => t.model_name === item.model_name))
			// 判断是否在全选状态下
			let statusSelectio = this.allSelectionFn(selectionvalue)
			if (statusSelectio) {
				// 列表全部被选中,头部变更为选中状态
				this[selectionvalue] = true
				this[isIndeterminatevalue] = false
				return false
			}
			// 列表有选中且非全选，头部全选框待定状态
			for (let i = 0; i < this.paginatedData.length; i++) {
				if (this.paginatedData[i][selectionvalue] === true) {
					this[isIndeterminatevalue] = true
					return false
				}
			}
			// 列表有没有选中，头部全选框未选状态
			this[isIndeterminatevalue] = false
			this[selectionvalue] = false
		},
		allSelectionFn(selectionvalue) {
			// 判断是否在全选状态下
			for (let i = 0; i < this.paginatedData.length; i++) {
				if (this.paginatedData[i][selectionvalue] !== true) {
					return false
				}
			}
			return true
		},
		highlightTag(tagValue) {
			const highlightedTag = tagValue
			// 重置分页和排序信息
			this.currentPage = 1
			if (highlightedTag !== 'All' && highlightedTag !== 'Favorites') {
				this.immutableTableData = this.tableData.filter(
					(item) => item.category === highlightedTag
				)
			} else if(highlightedTag === 'All'){
				this.immutableTableData = [...this.tableData]
			}else if(highlightedTag === 'Favorites'){
				this.immutableTableData = this.tableData.filter(item => item.favorite == 1)
			}
			// 如果有 searchItem, 进一步处理
			if(this.searchItem) {
				const trimmedStr = this.searchItem.trim();
        const regex = new RegExp(this.escapeRegExp(trimmedStr), 'i');
        this.immutableTableData = this.immutableTableData.filter((item) => {
          return regex.test(item.model_name);
        });
			}
		},
		portfolio() {
			// 处理跳转的数据
			const tags = {
        'Legacy': 'Legacy Index',
        'INDEX': 'Index',
        'Bond': 'Bond',
        'Factors': 'Factors',
        'Sector': 'Sector'
      }
			const _portfolioList = this.portfolioList.map(item => {
				return { strategy: item.model_name, url: item.url, _category: item.category, category: tags[item.category], model_name: item.model_name }
			})
			if(!_portfolioList.length) {
				this.popUpMsgBox('Please select at least 1 strategies')
				return
			}
			this.$router.push({
				name: 'Portfolio',
				params: { data: JSON.stringify(_portfolioList), usedFor: 'SetPortfolio' }
			},()=>{})
		},
		async getDataList() {
			if(this.tableData.length !== 0) return
			this.loading = true
			let res = null
			const {currentStrategiesPage} = LocalStorageUtil.get('strategy_filter_state') ? LocalStorageUtil.get('strategy_filter_state') : {}
			const page = currentStrategiesPage || 1
			try {
				res = await getStrategyList()
				const code = res?.data?.code
				if (code == 200) {
					const data = res?.data?.data
					for (let obj of data) {
						obj.selection = false
						obj.date = timestampToTime(obj.date)
					}
					this.tableData = data
					this.tableData.sort((a, b) => {
						return new Date(b['date']) - new Date(a['date'])
					})
					this.total = data.length
				}
			} catch (error) {
				console.log('报错了', error)
				if (error.response.status === 404) {
					const newPage = page != 1 ? page - 1 : 1
					this.handleCurrentChange(newPage)
					return
				}
				this.currentPage = 1
				this.tableData = []
			} finally {
				this.loading = false
				LocalStorageUtil.set('strategiesList', this.tableData)
				if (this.highlightedTag !== 'All' && this.highlightedTag !== 'Favorites') {
					this.immutableTableData = this.tableData.filter(
						(item) => item.category === this.highlightedTag
					)
				} else if(this.highlightedTag === 'All'){
					this.immutableTableData = [...this.tableData]
				}else if(this.highlightedTag === 'Favorites'){
					this.immutableTableData = this.tableData.filter(item => item.favorite == 1)
				}
				if(this.searchItem) {
					const trimmedStr = this.searchItem.trim();
					const regex = new RegExp(this.escapeRegExp(trimmedStr), 'i');
					this.immutableTableData = this.immutableTableData.filter((item) => {
						return regex.test(item.model_name);
					});
				}
				this.currentPage = page
			}
			const urlToNameMap = {}
			for (const item of this.tableData) {
				urlToNameMap[item.url] = {
					model_name: item['model_name'],
					updated: item['updated'],
					category: item['category'],
					favorite: item['favorite']
				}
			}
			LocalStorageUtil.set('urlToNameMap', urlToNameMap)
			this.$emit('getUrlToNameMap', urlToNameMap)
			return urlToNameMap
		},
		onSortChange(column) {
			var sortingOrder = column.order
			var colName = column.prop
			console.log('colName', colName)
			this.currentSort = {
				prop: colName,
				order: sortingOrder
			}
			// 数字字符串转数字类型排序
			if (['YTD_return'].indexOf(colName) !== -1) {
				if (sortingOrder == 'ascending') {
					this.immutableTableData.sort((a, b) => {
						b[colName] =
							typeof b[colName] === 'number' ? b[colName] + '' : b[colName]
						a[colName] =
							typeof a[colName] === 'number' ? a[colName] + '' : a[colName]
						let _b = b[colName].match(/-?\d+(\.\d+)?/g).reduce((pre, cur) => {
							return parseFloat(pre) + parseFloat(cur)
						})
						let _a = a[colName].match(/-?\d+(\.\d+)?/g).reduce((pre, cur) => {
							return parseFloat(pre) + parseFloat(cur)
						})
						return _b - _a
					})
				} else if (sortingOrder == 'descending') {
					this.immutableTableData.sort((a, b) => {
						b[colName] =
							typeof b[colName] === 'number' ? b[colName] + '' : b[colName]
						a[colName] =
							typeof a[colName] === 'number' ? a[colName] + '' : a[colName]
						let _b = b[colName].match(/-?\d+(\.\d+)?/g).reduce((pre, cur) => {
							return parseFloat(pre) + parseFloat(cur)
						})
						let _a = a[colName].match(/-?\d+(\.\d+)?/g).reduce((pre, cur) => {
							return parseFloat(pre) + parseFloat(cur)
						})
						return _a - _b
					})
				} else {
				}
			}
			// 数字类型排序
			// if(['WinRate', 'ExpectedReturn', 'Z_Score', 'Close'].indexOf(colName) !== -1){
			// 	if(sortingOrder == 'ascending'){
			// 		this.tableData.sort((a,b) => {
			// 			return b[colName] - a[colName]
			// 		})
			// 	}else if(sortingOrder == 'descending'){
			// 		this.tableData.sort((a,b) => {
			// 			return a[colName] - b[colName]
			// 		})
			// 	}else{
			// 	}
			// }
			// 日期类型排序
			if (['date'].indexOf(colName) !== -1) {
				if (sortingOrder == 'ascending') {
					this.immutableTableData.sort((a, b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				} else if (sortingOrder == 'descending') {
					this.immutableTableData.sort((a, b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				} else {
				}
			}
			// 字符串类型排序
			if (
				['update_frequency', 'current_state', 'model_name', 'type'].indexOf(colName) !==
				-1
			) {
				if (sortingOrder == 'ascending') {
					this.immutableTableData.sort((a, b) =>
						b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' })
					)
				} else if (sortingOrder == 'descending') {
					this.immutableTableData.sort((a, b) =>
						a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' })
					)
				} else {
				}
			}
		},
		async viewSignalDescription(row) {
			const { url, model_name, frequency } = row
			this.$router.push({
				path: '/strategy/descriptions',
				query: {
					url,
					frequency,
          name: model_name
				}
			})
		},
		handleQuery(searchItem) {
			this.searchItem = searchItem
			this.highlightTag('All')
      if (searchItem) {
        const trimmedStr = searchItem.trim();
        const regex = new RegExp(this.escapeRegExp(trimmedStr), 'i');
        this.immutableTableData = this.immutableTableData.filter((item) => {
          return regex.test(item.model_name);
        });
      } else {
        this.immutableTableData = this.tableData;
      }
		},
		// 使用反斜杠转义特殊字符
		escapeRegExp(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		},
		async getStrategyJSON() {
			// if (!LocalStorageUtil.get('strategiesJSON')) {
				const res = await getStrategiesJSON()
				const data = res?.data
        this.strategiesJSON = data
        console.log('this.strategiesJSON 保存', this.strategiesJSON)
			// }
			// this.strategiesJSON = LocalStorageUtil.get('strategiesJSON')
		},
		async handleRowClick(row) {
			console.log(this.strategiesJSON)
			// const matchStrategy = this.strategiesJSON.find((item) => {
			// 	// 去除特殊字符并将搜索词转换为小写
			// 	const sanitizedSearchTerm = row['model_name']
			// 		.replace(/[^\w\s]/gi, '')
			// 		.toLowerCase()
			// 	// 去除特殊字符并将策略名称转换为小写
			// 	const sanitizedStrategyName = item['name']
			// 		.replace(/[^\w\s]/gi, '')
			// 		.toLowerCase()
			// 	// 使用正则表达式进行模糊匹配
			// 	console.log('Sanitized search term:', sanitizedSearchTerm)
			// 	console.log('Sanitized strategy name:', sanitizedStrategyName)

			// 	const regex = new RegExp(sanitizedStrategyName, 'i')
			// 	return regex.test(sanitizedSearchTerm)
			// })
      console.log('this.strategiesJSON', this.strategiesJSON.map(item => item['name']))
      const matchStrategy = this.strategiesJSON.find((item) => item['name'] == row['model_name'])
			if (matchStrategy) {
				// matchStrategy.indicator_layout = {
				// 	activatedMA: [],
				// 	activatedMALayout: [],
				// 	formIndicators: {
				// 		entry: ['model_percent_bearish'],
				// 		exit: ['model_smart_money']
				// 	}
				// }
					/* 为防止跳转 BT 出现重名, 在这里加上时间戳 */
					const date = new Date()
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const day = date.getDate();
					const hour = date.getHours();
					const minute = date.getMinutes();
					const second = date.getSeconds();
					const lastMonthEnd = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
					matchStrategy.name = `${matchStrategy.name} (${year}-${month}-${day} ${hour}:${minute}:${second})`
					matchStrategy.end_date = lastMonthEnd
					this.$store.commit('form/getRunBacktestData', matchStrategy)

					this.$router.push({
							name: 'SetUp',
							params: { data: JSON.stringify(matchStrategy), usedFor: 'showBTForm' }
					},()=>{})
			}
			console.log('matchStrategy', matchStrategy)
		},
		async addToFavorites(scope) {
			const { url } = scope
			const res = await addStrategyFavorites({url})
			const code = res?.data?.code
			if(code == 200) {await this.getDataList();this.popUpMsgBox('Successfully added to favorites')}
			if(code == 400) {this.popUpMsgBox('Failed to add favorites')}
		},
		async moveToFavorites(scope) {
			const { url } = scope
			const res = await moveStrategyFavorites(url)
			const code = res?.data?.code
			if(code == 200) {await this.getDataList();this.popUpMsgBox('Removed from favorites')}
			if(code == 400) {this.popUpMsgBox('Failed to move favorites')}
		},
		tableRowClassName({row, rowIndex}) {
				if(row.current_day) return 'highlighted'
				return ''
		}
	}
}
</script>

<style lang="less" scoped>
@import '../index.less';
.el-table /deep/ tr.highlighted{
  background-color: yellow;
}
/deep/ .el-button {
	font-weight: 600;
}
</style>
