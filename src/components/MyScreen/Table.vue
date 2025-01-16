<template>
  <div class="CPM-list-container ScannerBTTable">
    <div class="search-box">
      <el-input placeholder="Search" v-model="searchItem" @keyup.enter.native="handleQuery" clearable @clear="handleQuery" @input="handleQuery" size="small">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
      </el-input>
      <span v-show="isShowLastSignalDate">Highlighted rows indicate the last signal date is today.</span>
      <!-- <el-popconfirm
        confirm-button-text="Continue"
        cancel-button-text="Cancel"
        icon="el-icon-info"
        icon-color="red"
        v-if="currentPageTab === 'MyScreen'"
        @confirm="runAllMySignals"
        title="Re-running all signals will update the last signal dates to the most recent.This process might take a while for larger lists. Confirm to continue."
        >
        <template #reference>
          <el-button type="warning" plain :loading="btnLoading" size="small">Find All Last Signal</el-button>
        </template>
      </el-popconfirm> -->
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
      :row-class-name="tableRowClassName"
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
          :min-width="l.minWidth"
          :width="l.width"
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
        <el-table-column align="center" width="130px">
              <template slot-scope="scope">
                <el-row>
                  <!-- <el-tooltip
                    class="item"
                    effect="dark"
                    content="rerun signal"
                    placement="bottom-start"
                    v-if="currentPageTab === 'MyScreen'"
                  >
                    <el-button
                      type="warning"
                      icon="el-icon-video-play"
                      circle
                      size="mini"
                      :loading="scope.row.rerunLoading"
                      v-if="currentPageTab === 'MyScreen'"
                      @click="rerunSignal(scope.row)"
                    ></el-button>
                  </el-tooltip> -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="edit signal"
                    placement="bottom-start"
                    v-if="currentPageTab === 'MyScreen'"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      size="mini"
                      v-if="currentPageTab === 'MyScreen'"
                      @click="handleRowClick(scope.row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="copy start"
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
									content="view backtest results"
									placement="bottom-start"
								>
									<el-button
										type="warning"
										icon="el-icon-view"
										circle
										size="mini"
                    :loading="scope.row.viewLoading"
										@click="viewResults(scope.row)"
									></el-button>
								</el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="delete signal"
                    placement="bottom-start"
                    v-if="currentPageTab === 'MyScreen'"
                  >
                    <el-popconfirm
                      confirm-button-text="yes"
                      cancel-button-text="no"
                      icon="el-icon-info"
                      icon-color="red"
                      v-if="currentPageTab === 'MyScreen'"
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
import { getMyScreensList, saveMyScreenForm, deleteMyScreen, editMyScreenForm } from '@/service/service'
import { capitalizeFirstLetter, isJson, timestampToTime } from "@/utils"
const debounce = require('lodash/debounce')

export default {
  name: 'SignalsTable',
  props: {
    currentPageTab: String,
    lastSignalDate: String
  },
  data() {
    return {
      currentPage: 1, // Default current page
      searchItem: '',
      currentSort: {}, // 当前的排序信息
      filterData: [],
      loading: false,
      btnLoading: false,
      pageSize: 10,
      total: 0,
      tableCol: [
        {
          label: 'Name',
          value: 'name',
          key: 'name'
        },
        {
          label: 'Category',
          value: 'category',
          key: 'category',
          width: '120px'
        },
        {
          label: 'Timeframe',
          value: 'timeframe',
          key: 'timeframe',
          width: '150px'
        },
        {
          label: 'Screen',
          value: 'description',
          key: 'description',
          minWidth: '150px' 
        },
        {
          label: 'Last Screen Date',
          value: 'last_signal_date',
          key: 'last_signal_date',
          width: '190px'
        }
      ],
      tableData: [],
      isShowLastSignalDate: false
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
    async getDataList(tab, doNotResetPage = false) {
      // A request that requires writing two lists
      // if(this.currentPageTab === 'MyScreen') {
      debugger
				this.loading = true
        if(this.currentPage !== 1 && !doNotResetPage) this.currentPage = 1
        let res = await getMyScreensList(`dev/myscreen_app/get_myscreen_records${tab === 'Sample' ? '?sample=1' : ''}`)
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
            item.rerunLoading = false
            item.last_signal_date = item.lastdate === '2099-01-01' ? '' : item.lastdate
            item.description = parseJsonOrString(item.description)
						return item
					})
					this.tableData = results
          this.filterData = this.tableData
          this.total = this.filterData.length
          const totalPages = Math.ceil(this.total / this.pageSize)
          if(this.currentPage > totalPages && doNotResetPage) this.currentPage = totalPages
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
      if (['last_signal_date'].indexOf(colName) !== -1) {
        this.filterData.sort((a, b) => {
          const dateA = a[colName] ? new Date(a[colName]) : null;
          const dateB = b[colName] ? new Date(b[colName]) : null;

          // 处理空值，将空值排在最后面
          if (!dateA && !dateB) return 0; // 两个都为空
          if (!dateA) return 1; // `a`为空，排在后面
          if (!dateB) return -1; // `b`为空，排在后面

          // 正常比较日期
          if (sortingOrder === 'ascending') {
              return dateA - dateB;
          } else if (sortingOrder === 'descending') {
              return dateB - dateA;
          }

          return 0; // 默认情况下不排序
        });
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
    async handleRowClick(row) {
      this.$emit('displayFormData', row)
    },
    viewResults(row) {
      this.$emit('displayFormData', row)
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
          data.copyLoading = false
					this.popUpMsgBox('The signals has been copied')
				} else {
					// 获取参数并准备复制
					const params = {
						...data,
						name: copyName
					}
          const prepareData = this.reassignBTAttributes(params)
					// 发起复制请求
					const res = await saveMyScreenForm(prepareData)
          console.log('res', res)
          const code = res.data.code
          if(code == 211) {
            await _this.$emit('changeSecondTab', 'MyScreen')
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
    async rerunSignal(data) {
			try {
        data.rerunLoading = true
					// 获取参数并准备复制
					const params = {
						...data
					}
          const prepareData = this.reassignBTAttributes(params)
					// 发起复制请求
					const res = await editMyScreenForm(prepareData, data.url)
          console.log('res', res)
          const code = res.data.code
          const _data = isJson(res.data.data) ? JSON.parse(res.data.data) : res.data.data
          const last_signal_date = _data.lastdate //2099-12-31
          if(code == 211 || code == 213) {
            await this.$emit('refreshBTList')
            let msg = 'Screens re-run successfully. Last signal dates are now up to date'
            if(last_signal_date === '2099-12-31') msg = 'Signal re-run successful. No last signal date found. Adjust trigger conditions.'
            this.popUpMsgBox(msg)
          }else {
            this.popUpMsgBox('Failed to re-run signals')
            
          }
          data.rerunLoading = false
			} catch (error) {
        data.rerunLoading = false
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
			await deleteMyScreen(url)
			await this.getDataList(null, true)
			this.popUpMsgBox('Successfully deleted')
    },
    tableRowClassName({row, rowIndex}) {
      if(this.lastSignalDate && this.lastSignalDate === row.last_signal_date) {this.isShowLastSignalDate = true;return 'highlighted'}
      return ''
		},
    viewResults(row) {

    },
    }
  }
</script>

<style lang="less" scoped>
.search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px 20px 0px;
  border-bottom: 2px solid #dddddd;
}
.el-input-group{
  width: 20%;
}
.CPM-list-container{
  padding: 20px 20px 20px 20px;
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
/deep/ .el-input--suffix .el-input__inner {
  margin-left: 0px
}
.el-table /deep/ tr.el-table__row.highlighted{
  background-color: yellow !important;
}
</style>