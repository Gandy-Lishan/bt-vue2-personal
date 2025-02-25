<template>
	<div class="StrategiesContent">
		<div class="strategiesTable">
			<el-table
				ref="Table"
				class="ScannerBTTable"
				:data="paginatedData"
				empty-text="No data"
				v-loading="loading"
				@sort-change="onSortChange"
				size="small"
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
					<template #header>
							<span v-html="l.label"></span>
					</template>
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
						:min-width="l.minWidth"
						:max-width="l.maxWidth"
						v-if="['CAGR', 'benchmark_CAGR', 'max_drawdown', 'net_profit_pct', 'profit_loss_ratio', 'average_win', 'average_loss', 'win_rate_pct'].includes(l.value)"
            :sortable="
							['CAGR', 'benchmark_CAGR', 'max_drawdown', 'net_profit_pct', 'profit_loss_ratio', 'average_win', 'average_loss', 'win_rate_pct'].includes(l.value)
								? 'custom'
								: false
						"
					>
					<template #header>
							<span v-html="l.label"></span>
					</template>
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
	</div>
</template>

<script>
import { getStrategySummaryList } from '@/service/service'
import { LocalStorageUtil, timestampToTime } from "@/utils"
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
          label: 'Model<br/>Name',
          value: 'model_name',
          key: 'model_name',
										minWidth: '130px',
        },
        {
          label: 'Strategy<br/>CAGR',
          value: 'CAGR',
          key: 'CAGR'
        },
        {
          label: 'Benchmark<br/>CAGR',
          value: 'benchmark_CAGR',
          key: 'benchmark_CAGR',
										minWidth: '90px'
        },
        {
          label: 'Max<br/>Drawdown',
          value: 'max_drawdown',
          key: 'max_drawdown',
										minWidth: '85px'
        },
        {
          label: 'Net<br/>Profit(%)',
          value: 'net_profit_pct',
          key: 'net_profit_pct'
        },
        {
          label: 'Sharpe<br/>Ratio',
          value: 'sharp_ratio',
          key: 'sharp_ratio'
        },
        {
          label: 'Profit/Loss<br/>Ratio',
          value: 'profit_loss_ratio',
          key: 'profit_loss_ratio',
										minWidth: '90px'
        },
        {
          label: 'Average<br/>Win',
          value: 'average_win',
          key: 'average_win'
        },
        {
          label: 'Average<br/>Loss',
          value: 'average_loss',
          key: 'average_loss'
        },
        {
          label: 'Total<br/>Trades',
          value: 'total_trades',
          key: 'total_trades'
        },
        {
          label: 'Win<br/>Rate(%)',
          value: 'win_rate_pct',
          key: 'win_rate_pct'
        }
      ],
      tableData: [],
      immutableTableData: [],
      currentSort: {}, // 当前的排序信息
      dataList: [],
    }
  },
  computed: {
		paginatedData() {
      // 计算分页数据
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.immutableTableData.slice(startIndex, endIndex);
		},
	},
  // async mounted() {
  //   await this.getDataList()
  // },
  methods: {
    handleSizeChange(size) {
			this.pageSize = size;
			this.currentPage = 1; // Reset to the first page when the page size changes
		},
    handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
			const strategy_filter_state = LocalStorageUtil.get('strategy_filter_state')
			LocalStorageUtil.set('strategy_filter_state', {...(!strategy_filter_state ? {} : strategy_filter_state) , currentSummaryPage: currentPage})
		},
    portfolio() {
      console.log('paginatedData', this.paginatedData.filter(item => item.selection))
    },
    async getDataList() {
			if (this.tableData.length !== 0) return
      this.loading = true
      let res = null
			debugger
			const {currentSummaryPage} = LocalStorageUtil.get('strategy_filter_state') ? LocalStorageUtil.get('strategy_filter_state') : {}
			const page = currentSummaryPage || 1
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
				this.currentPage = page
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
/deep/ .el-button {
	font-weight: 600;
}
</style>