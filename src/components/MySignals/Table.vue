<template>
  <div class="CPM-list-container ScannerBTTable">
    <div class="search-box">
      <el-input placeholder="Search" v-model="searchItem" @keyup.enter.native="handleQuery" clearable @clear="handleQuery" @input="handleQuery" size="small">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
      </el-input>
     <div class="sortDateBtn">
        <el-tooltip class="item" effect="dark" placement="bottom-start">
          <span slot="content" v-html="textContent">
          </span>
          <el-button type="warning" size="small" @click="sortByDateCreated" style="margin-right: 10px;">Sort By Date Created</el-button>
      </el-tooltip>
      <span v-show="isShowLastSignalDate">Highlighted rows indicate the last signal date is today.</span>
     </div>

      <!-- <el-popconfirm
        confirm-button-text="Continue"
        cancel-button-text="Cancel"
        icon="el-icon-info"
        icon-color="red"
        v-if="currentPageTab === 'MySignal'"
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
      :default-expand-all="true"
		>
    <el-table-column type="expand" v-if="currentPageTab === 'Sample'">
				<template slot-scope="scope">
					<div class="expandArea">
					<div class="urlBox">
						<span>Analyst Report URL: </span>
						<el-link :underline="false" :href="scope.row.report_url" target="_blank" type="primary">{{scope.row.report_url}}</el-link>
					</div>
					</div>
				</template>
		</el-table-column>
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
                    v-if="currentPageTab === 'MySignal'"
                  >
                    <el-button
                      type="warning"
                      icon="el-icon-video-play"
                      circle
                      size="mini"
                      :loading="scope.row.rerunLoading"
                      v-if="currentPageTab === 'MySignal'"
                      @click="rerunSignal(scope.row)"
                    ></el-button>
                  </el-tooltip> -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="edit signal"
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
                    content="copy signal"
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
import { delScannerBT, getMySignalsList, saveMySignalForm, deleteMySignal, runAllMySignals, editMySignalForm } from '@/service/service'
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
      tableData: [],
      isShowLastSignalDate: false,
      textContent: `Click this button to sort the list in ascending or descending order based on the signals' creation date. <br/>This helps you quickly find the most recently or earliest created signals'. Click again to toggle the sorting direction.`
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
    tableCol() {
      const _tableCol =  [
        {
          label: 'Name',
          value: 'name',
          key: 'name'
        },
        {
          label: 'Symbol',
          value: 'symbol',
          key: 'symbol',
          width: '110px'
        },
        {
          label: 'Timeframe',
          value: 'timeframe',
          key: 'timeframe',
          width: '150px'
        },
        {
          label: 'Signal',
          value: 'description',
          key: 'description',
          minWidth: '150px' 
        },
        {
          label: 'Last Signal Date',
          value: 'last_signal_date',
          key: 'last_signal_date',
          width: '190px'
        }
      ]
      if(this.currentPageTab === 'Sample') return [
        ..._tableCol,
        {
          label: 'Category',
          value: 'category',
          key: 'category'
        }
      ]
      return _tableCol
    }
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
    sortByDateCreated() {
      this.currentSort.prop = 'create_date'
      console.log('this.currentSort', this.currentSort)
      this.currentSort.order = this.currentSort.order === 'ascending' ? 'descending' : 'ascending'
      this.handleCurrentChange(1)
    },
    async getDataList(tab, doNotResetPage = false) {
      // A request that requires writing two lists
      // if(this.currentPageTab === 'MySignal') {
      debugger
				this.loading = true
        if(this.currentPage !== 1 && !doNotResetPage) this.currentPage = 1
        let res = await getMySignalsList(`/dev/mysignal_app/get_mysignal_records${tab === 'Sample' ? '?sample=2' : ''}`)
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
            item.last_signal_date = item.lastdate === '2099-12-31' ? '' : item.lastdate
            item.description = parseJsonOrString(item.description)
            if(tab === 'Sample'){
              if(typeof item.signal_info === 'string') {
                item.signal_info = item.signal_info.replace(/^"+|"+$/g, '')
                item.signal_info = item.signal_info.replace(/'/g, '"')
                item.signal_info = isJson(item.signal_info) ? JSON.parse(item.signal_info) : item.signal_info
              }
              item.category = item.signal_info.category
              item.report_url = item.signal_info.report_url
            }
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
      if (['last_signal_date', 'create_date'].indexOf(colName) !== -1) {
        this.filterData.sort((a, b) => {
          const dateA = a[colName] ? new Date(a[colName]) : null;
          const dateB = b[colName] ? new Date(b[colName]) : null;

          // 处理空值，将空值排在最后面
          if (!dateA && !dateB) return 0; // 两个都为空
          if (!dateA) return 1; // `a`为空，排在后面
          if (!dateB) return -1; // `b`为空，排在后面

          // 正常比较日期
          if (sortingOrder === 'descending') {
              return dateA - dateB;
          } else if (sortingOrder === 'ascending') {
              return dateB - dateA;
          }

          return 0; // 默认情况下不排序
        });
      }
			// 字符串类型排序
			if(['name','symbol','timeframe', 'category'].indexOf(colName) !== -1){
				if(sortingOrder == 'descending'){
					this.filterData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'ascending'){
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
    async rerunSignal(data) {
			try {
        data.rerunLoading = true
					// 获取参数并准备复制
					const params = {
						...data
					}
          const prepareData = this.reassignBTAttributes(params)
					// 发起复制请求
					const res = await editMySignalForm(prepareData, data.url)
          console.log('res', res)
          const code = res.data.code
          const _data = isJson(res.data.data) ? JSON.parse(res.data.data) : res.data.data
          const last_signal_date = _data.lastdate //2099-12-31
          if(code == 211 || code == 213) {
            await this.$emit('refreshBTList')
            let msg = 'Signals re-run successfully. Last signal dates are now up to date'
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
			await deleteMySignal(url)
			await this.getDataList(null, true)
      this.searchItem = ''
			this.popUpMsgBox('Successfully deleted')
    },
    async runAllMySignals() {
      try {
        this.btnLoading = true
        const {data: {code}} = await runAllMySignals()
        console.log('run all res', code)
        if(code === 216) this.popUpMsgBox('Signals re-run successfully. Last signal dates are now up to date')
        this.$emit('refreshBTList')
      } catch (error) {
        console.error(error);
        
      } finally {
        this.btnLoading = false
      }
    },
    tableRowClassName({row, rowIndex}) {
      if(this.lastSignalDate && this.lastSignalDate === row.last_signal_date) {this.isShowLastSignalDate = true;return 'highlighted'}
      return ''
		}
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
@media (max-width: 992px) {
  .el-input-group {
    width: 100%;
  }
  .search-box{
    flex-wrap: wrap;
  }
  .sortDateBtn {
    width: 100%;
    margin-top: 10px;
  }
  /deep/ .el-button--small, .el-button--small.is-round {
    width: 100%;
  }
}
.urlBox {
  span:first-child {
    font-weight: 600;
    color: #000000;
    margin-right: 5px;
  }
}
</style>