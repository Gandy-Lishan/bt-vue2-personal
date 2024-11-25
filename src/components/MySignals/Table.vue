<template>
  <div class="CPM-list-container ScannerBTTable">
    <div class="search-box">
      <el-input placeholder="Search" v-model="searchItem" @keyup.enter.native="handleQuery" clearable @clear="handleQuery" @input="handleQuery" size="small">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" size="small"></el-button>
      </el-input>
    </div>
    <el-table
			ref="Table"
			class="ScannerBTTable"
      header-align="center"
			:data="paginatedData"
      empty-text="No data"
      v-loading="loading"
			@sort-change="onSortChange"
      size="small"
			style="width: 100%; height: 100%; margin: 0 auto;"
      stripe
		>
			<template v-for="(l) in tableCol">
        <el-table-column
          v-if="l.key === 'description'"
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          :min-width="l.minWidth"
				>
					<template slot-scope="scope">
            <template  v-if="Array.isArray(scope.row.description)">
              <template v-for="(item, index) in scope.row.description">
                <p :key="index">{{item}}</p>
              </template>
            </template>
					</template>
				</el-table-column>
        <el-table-column
          v-else
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          :sortable="'custom'"
				  :sort-orders="['ascending', 'descending']"
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
        <el-table-column align="center" width="280px">
              <template slot-scope="scope">
                <el-row>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="edit backtest"
                    placement="bottom-start"
                    v-if="currentPageTab === 'MySignal'"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      size="mini"
                      v-if="currentPageTab === 'MySignal'"
                      @click="handleRowClick(scope.row)"
                    ></el-button>
                  </el-tooltip>
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
                      :loading="scope.row.copyLoading"
                      @click="copySignals(scope.row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="delete signal"
                    placement="bottom-start"
                    v-if="currentPageTab === 'MySignal'"
                  >
                    <el-popconfirm
                      confirm-button-text="yes"
                      cancel-button-text="no"
                      icon="el-icon-info"
                      icon-color="red"
                      v-if="currentPageTab === 'MySignal'"
                      title="Are you sure you want to delete it?"
                      @confirm="deleteSignals(scope.row.url)"
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
                </el-row>
              </template>
      </el-table-column>
		</el-table>
		<el-pagination
		@current-change="handleCurrentChange"
    :current-page="currentPage"
		:page-size="pageSize"
		:total="total"
		layout="total, prev, pager, next, jumper"
		></el-pagination>
  </div>
</template>

<script>
import { delScannerBT, getMySignalsList, saveMySignalForm, deleteMySignal } from '@/service/service'
import { capitalizeFirstLetter, isJson, timestampToTime } from "@/utils"
const debounce = require('lodash/debounce')

export default {
  name: 'SignalsTable',
  props: {
    currentPageTab: String
  },
  data() {
    return {
      currentPage: 1, // Default current page
      searchItem: '',
      currentSort: {}, // 当前的排序信息
      filterData: [],
      loading: false,
      pageSize: 10,
      total: 0,
      tableCol: [
        {
          label: 'Name',
          value: 'name',
          key: 'name'
        },
        {
          label: 'Symbol',
          value: 'symbol',
          key: 'symbol'
        },
        {
          label: 'Timeframe',
          value: 'timeframe',
          key: 'timeframe'
        },
        {
          label: 'Signal',
          value: 'description',
          key: 'description',
          minWidth: '200px' 
        },
        {
          label: 'Last Signal Date',
          value: 'last_signal_date',
          key: 'last_signal_date'
        }
      ],
      tableData: []
    }
  },
  computed: {
		// Filtered and paginated data to be displayed in the table
		paginatedData() {
			const startIndex = (this.currentPage - 1) * this.pageSize;
			const endIndex = startIndex + this.pageSize;
			// 当checkbox未勾选时，返回原始数据
			return this.filterData?.slice(startIndex, endIndex);
		},
	},
  watch: {
    tableData: {
      handler(newValue) {
        if(Array.isArray(newValue) && newValue.length !== 0) this.filterData = this.tableData
      },
      immediate: true
    }
  },
  methods: {
    async getDataList(tab) {
      // A request that requires writing two lists
      // if(this.currentPageTab === 'MySignal') {
      debugger
				this.loading = true
        if(this.currentPage !== 1) this.currentPage = 1
        let res = await getMySignalsList(`/dev/mysignal_app/get_mysignal_records${tab === 'Sample' ? '?sample=1' : ''}`)
        let {data: results, status} = res
        console.log('results', res)
        const parseJsonOrString = (value) => {
          if (typeof value === 'string') {
              try {
                  return JSON.parse(value);
              } catch (error) {
                  return [{
                      commentDes: value,
                      rocCond: {
                        newCondition: 3,
                        conditionPeriod: 5
                      }
                  }];
              }
          }
          return value;
				};
        if(status === 200) {
					results = results.map(item => {
            // item.status = capitalizeFirstLetter(item.status)
            // item.period = [item.start_date, item.end_date]
            item.signals = isJson(item.signals) ? JSON.parse(item.signals) : item.signals
            item.cond = isJson(item.cond) ? JSON.parse(item.cond) : item.cond
            item.copyLoading = false
            // item.deleteLoading = false
            item.last_signal_date = item.lastdate === '2099-12-31' ? '' : item.lastdate
            item.description = parseJsonOrString(item.description)
						return item
					})
					this.tableData = results
          this.filterData = this.tableData
          this.total = this.filterData.length
          this.loading = false
        // }
      }
    },
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
      await this.applySort()
		},
    async onSortChange({ column, prop, order }) {
			// if(this.currentPage != 1) this.currentPage = 1
      if (column.sortable !== 'custom') return
      this.currentSort = {
        prop: prop,
        order: order,
      };
      // Is there an input box query
      this.handleQuery()
      await this.applySort()
    },
    handleQuery: debounce(function() {
      if (this.currentPage !== 1) this.currentPage = 1;
      const trimmedStr = this.searchItem.trim();
      if(trimmedStr === '') {this.filterData = this.tableData; this.total = this.filterData.length; return}
      const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");
      let result = [];
      for (const item of this.tableData) {
        let matchFound = false;
        for (const key in item) {
          if (key !== 'last_signal_date') {
            if (regex.test(String(item[key]).toLowerCase())) {
              matchFound = true;
              break;
            }
          }
        }
        if (matchFound) {
          result.push(item);
        }
      }
      this.filterData = result;
      this.total = this.filterData.length
    }, 500),
    // 使用反斜杠转义特殊字符
    escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
    async applySort() {
      let { prop:colName, order:sortingOrder } = this.currentSort;
      console.log(colName, sortingOrder)
			// 日期类型排序
			if(['last_signal_date'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.filterData.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.filterData.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
			// 字符串类型排序
			if(['name','symbol','timeframe'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.filterData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.filterData.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else{
				}
			}
		},
    async deleteSCBT(row) {
      const { url } = row
      const _this = this
      row.deleteLoading = true
			const res = await delScannerBT(url)
      const code = res.data.code
      if(code == 204) _this.popUpMsgBox('Successfully deleted')
      if(code == 403) _this.popUpMsgBox("Sorry, deleted item doesn't exist. Refresh the list")
      if(code == 404) {_this.popUpMsgBox('Delete failed')}
			row.deleteLoading = false
			await _this.getDataList(null)
    },
    async handleRowClick(row) {
      this.$emit('displayResultsData', row)
    },
    async copySignals(data) {
      debugger
      const _this = this
			try {
        data.copyLoading = true
				const copyName = `${data.name}(copy)`

				// 检查是否已经存在同名的 signals
				const isDuplicate = this.tableData.some(
					item => item.name === copyName
				)

				if (isDuplicate) {
					this.popUpMsgBox('The signals has been copied')
				} else {
					// 获取参数并准备复制
					const params = {
						...data,
						name: copyName
					}
          const prepareData = this.reassignBTAttributes(params)
					// 发起复制请求
					const res = await saveMySignalForm(prepareData)
          console.log('res', res)
          const code = res.data.code
          if(code == 211) {
            await _this.$emit('changeSecondTab', 'MySignal')
            this.popUpMsgBox('Copy successfully')
          }else if(code == 411) {
            this.popUpMsgBox('The signal has been copied')
            
          }
          data.copyLoading = false
				}
			} catch (error) {
        data.copyLoading = false
				console.error('An error occurred:', error)
			}
		},
    reassignBTAttributes(data) {
      debugger
      // use for copy
      data['cond'] = isJson(data['cond']) ? data['cond'] : JSON.stringify(data['cond'])
      data['description'] = isJson(data['description']) ? data['description'] : JSON.stringify(data['description'])
      data['signals'] = isJson(data['signals']) ? data['signals'] : JSON.stringify(data['signals'])
			const selectedProps = [
				'name',
				'symbol',
				'timeframe',
				'signals',
        'score',
        'signals_in_market',
        'relation',
        'start_date',
        'end_date',
        'delay_bars',
        'subscribe',
        'cond',
        'description'
			]
			let backtestParams = Object.assign(
				{},
				...selectedProps.map((prop) => ({ [prop]: data[prop] }))
			)
      console.log('backtestParams', backtestParams)
      return backtestParams
		},
    async deleteSignals(url) {
			await deleteMySignal(url)
			await this.getDataList(null)
			this.popUpMsgBox('Successfully deleted')
    }
    },
  }
</script>

<style lang="less" scoped>
.search-box{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0px 0px 20px 0px;
  border-bottom: 2px solid #dddddd;
}
.el-input-group{
  width: 20%;
}
.CPM-list-container{
  padding: 20px 20px 20px 0px;
}
.showDate {
  margin: 5px 0;
}
.ScannerBTTable .el-button i {
  font-size: 16px;
}
.ScannerBTTable .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  /deep/ .el-form-item__label {
    width: 200px;
  }
}
.demo-table-expand {
  margin-left: 130px;
}
/deep/ .el-button--mini.is-circle {
  margin: 0 2px;
}
</style>