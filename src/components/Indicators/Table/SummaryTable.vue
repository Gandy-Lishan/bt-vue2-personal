<template>
	<div class="StrategiesContent">
			<el-table
				ref="Table"
				class="my-favorite-table"
				:data="paginatedData"
				empty-text="No data"
				v-loading="loading"
				@sort-change="onSortChange"
				size="mini"
				style="width: 100%; height: 100%; margin: 0 auto"
				stripe
			>
				<template v-for="l in tableCol">
					<el-table-column
						:label="l.label"
						:prop="l.value"
						:key="l.key"
						show-overflow-tooltip
						:min-width="l.minWidth"
						:max-width="l.maxWidth"
						v-if="
							[
								'model_name',
								'sharp_ratio',
								'total_trades'
							].includes(l.value)
						"
						:sortable="
							[
								'model_name',
								'sharp_ratio',
								'total_trades'
							].includes(l.value)
								? 'custom'
								: false
						"
					>
						<template slot-scope="scope">
							<span class="tableText" v-if="l.value === 'model_name'">
								<el-button type="text" @click="
										() => {
											viewSignalDescription(scope.row)
										}
									">{{ scope.row[l.value] }}</el-button>
							</span>
							<span class="tableText" v-else>
								{{ scope.row[l.value] }}
							</span>
						</template>
					</el-table-column>
					<el-table-column
						:label="l.label"
						:prop="l.value"
						:key="l.key"
						show-overflow-tooltip
						:width="l.width"
						v-if="['CAGR', 'benchmark_CAGR', 'max_drawdown', 'net_profit_pct', 'profit_loss_ratio', 'average_win', 'average_loss', 'win_rate_pct'].includes(l.value)"
            :sortable="
							['CAGR', 'benchmark_CAGR', 'max_drawdown', 'net_profit_pct', 'profit_loss_ratio', 'average_win', 'average_loss', 'win_rate_pct'].includes(l.value)
								? 'custom'
								: false
						"
					>
					<template slot-scope="scope">
						<span class="tableText" v-if="!isNaN(scope.row[l.value]) && scope.row[l.value]">
							{{ scope.row[l.value] }}%
						</span>
            <span class="tableText" v-else>
							{{ scope.row[l.value] }}
						</span>
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
</template>

<script>
import { getStrategySummaryList } from '@/service/service'
import { LocalStorageUtil, timestampToTime } from "@/utils"
import { mapGetters } from 'vuex'

export default {
  name: 'SummaryTable',
  props: {
    urlToNameMap: Object,
		tag: String
  },
  data() {
    return {
      loading: false,
      pageSize: 10, // Default page size
      currentPage: 1, // Default current page
      total: 0,
      searchKey: '',
      tableCol: [
								{
										key: 'chart_name',
										label: 'Name',
										value: 'chart_name'
								},
								{
										key: 'groups',
										label: 'Groups',
										value: 'groups'
								},
								{
										key: 'timeframe',
										label: 'Time Frame',
										value: 'timeframe'
								},
								{
										key: 'last_value',
										label: 'Value',
										value: 'last_value'
								},
								{
										key: 'last_change',
										label: 'Change',
										value: 'last_change'
								},
								{
										key: 'last_update',
										label: 'Date',
										value: 'last_update'
								},
								{
										key: 'sentiment',
										label: 'Sentiment',
										value: 'sentiment'
								}
      ],
      tableData: [],
      immutableTableData: [],
      currentSort: {}, // 当前的排序信息
      dataList: [],
    }
  },
  computed: {
		...mapGetters(['getFavoriteIndicatorListBtv1', 'getMyIndicatorList']),
		paginatedData() {
      // 计算分页数据
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.immutableTableData.slice(startIndex, endIndex);
		},
		favoritesList() {
				return this.getFavoriteIndicatorListBtv1
		},
		indicatorsList() {
				return this.getMyIndicatorList
		}
	},
	created() {
		debugger
		console.log('favoritesList', this.favoritesList)
		console.log('indicatorsList', this.indicatorsList)
		// if(this.favoritesList) {
		// 	const res = [...favIndicatorList.data.data].map(item=>
		// 	({
		// 		name:item.chart_name[0],
		// 		url:item.url[0]
		// 	}))
		// }
	},
  methods: {
			see() {
		console.log('favoritesList', this.favoritesList)
		console.log('indicatorsList', this.indicatorsList)

			},
    handleSizeChange(size) {
			this.pageSize = size;
			this.currentPage = 1; // Reset to the first page when the page size changes
		},
    handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},
    portfolio() {
      console.log('paginatedData', this.paginatedData.filter(item => item.selection))
    },
    async getDataList() {
      this.loading = true
      let res = null
      const page = this.currentPage
			try {
				res = await getStrategySummaryList()
        const code = res?.data?.code
				if (code == 200) {
          const data = res?.data?.data
          for (const item of data) {
            item.selection = false;
            item.date = timestampToTime(item.date)
						const urlToNameMap = Object.keys(this.urlToNameMap).length > 0 ? this.urlToNameMap : LocalStorageUtil.get('urlToNameMap')
              const {model_name, updated, category, favorite} = urlToNameMap[item.model]
              if (model_name !== undefined) {
                  item['model_name'] = model_name;
                  item['updated'] = updated
									item['category'] = category
									item['favorite'] = favorite
              }
          }
					this.tableData = data
          this.immutableTableData = data
          console.log('Summary 列表数据', this.immutableTableData)
					this.total = data.length
				}
			} catch(error) {
				console.log('报错了', error)
        if(error.response.status === 404) {
          const newPage = page != 1 ? page - 1 : 1
          this.handleCurrentChange(newPage)
          return
        }
        this.currentPage = 1
        this.total = 0
        this.tableData = []
        this.immutableTableData = data
      } finally {
        this.loading = false
				this.highlightedTag(this.tag)
      }
    },
    onSortChange(column){
			var sortingOrder = column.order
			var colName = column.prop
      console.log('colName', colName)
      this.currentSort = {
        prop: colName,
        order: sortingOrder
      };
			// 数字字符串转数字类型排序
			if(['CAGR', 'benchmark_CAGR', 'max_drawdown', 'net_profit_pct', 'profit_loss_ratio', 'average_win', 'average_loss', 'win_rate_pct'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.immutableTableData.sort((a,b) => {
            b[colName] = typeof b[colName] === 'number' ? b[colName] + '' : b[colName]
            a[colName] = typeof a[colName] === 'number' ? a[colName] + '' : a[colName]
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _b - _a
					})
				}else if(sortingOrder == 'descending'){
					this.immutableTableData.sort((a,b) => {
            b[colName] = typeof b[colName] === 'number' ? b[colName] + '' : b[colName]
            a[colName] = typeof a[colName] === 'number' ? a[colName] + '' : a[colName]
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _a - _b
					})
				}else{
				}
			}
			// 数字类型排序
			if(['sharp_ratio', 'total_trades'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.immutableTableData.sort((a,b) => {
						return b[colName] - a[colName]
					})
				}else if(sortingOrder == 'descending'){
					this.immutableTableData.sort((a,b) => {
						return a[colName] - b[colName]
					})
				}else{
				}
			}
			// 日期类型排序
			if(['date'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.immutableTableData.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.immutableTableData.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
			// 字符串类型排序
			if(['model_name'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.immutableTableData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.immutableTableData.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else{
				}
			}
		},
    handleQuery(searchItem){
      if (searchItem) {
				const trimmedStr = searchItem.trim();
				const regex = new RegExp(this.escapeRegExp(trimmedStr), 'i');
				this.immutableTableData = this.tableData.filter((item) => {
					return regex.test(item.model_name);
				});
			} else {
				this.immutableTableData = this.tableData;
			}
    },
    // 使用反斜杠转义特殊字符
    escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
    async viewSignalDescription(row) {
			const { model: url, model_name } = row
			this.$router.push({
				path: '/strategy/descriptions',
				query: {
					url,
          name: model_name
				}
			})
		},
		highlightedTag(tag) {
			// 重置分页和排序信息
			this.currentPage = 1;
			if (tag !== 'All' && tag !== 'Favorites') {
				this.immutableTableData = this.tableData.filter(
					(item) => item.category === tag
				)
			} else if(tag === 'All'){
				this.immutableTableData = [...this.tableData]
			}else if(tag === 'Favorites'){
				this.immutableTableData = this.tableData.filter(item => item.favorite == 1)
			}
		}
  }
}
</script>

<style lang="less" scoped>
@import "../index.less";
</style>