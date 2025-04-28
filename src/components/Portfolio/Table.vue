<template>
  <div class="CPM-list-container ScannerBTTable">
    <div class="search-box">
      <el-input placeholder="Search" v-model="searchItem" @keyup.enter.native="handleQuery" clearable @clear="handleQuery" @input="handleQuery" size="small">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
      </el-input>
    </div>
    <el-table
			ref="Table"
			class="ScannerBTTable"
      header-align="center"
			:data="tableData"
      empty-text="No data"
      v-loading="loading"
			@sort-change="onSortChange"
      size="small"
			style="width: 100%; height: 100%; margin: 0 auto;"
      stripe
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
		>
    <el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="AVERAGE WIN %">
							<span>{{ props.row['avg_win'] ? `${props.row['avg_win']}%` : '' }}</span>
						</el-form-item>
						<el-form-item label="AVERAGE LOSS %">
							<span>{{ props.row['avg_loss'] ? `${props.row['avg_loss']}%` : '' }}</span>
						</el-form-item>
						<el-form-item label="MEDIAN RETURN %">
							<span>{{ props.row['median_return'] ? `${props.row['median_return']}%` : '' }}</span>
						</el-form-item>
						<el-form-item label="TOTAL TRADES">
							<span>{{ props.row['total_trades'] ? props.row['total_trades'] : '' }}</span>
						</el-form-item>
						<el-form-item label="TOTAL POSITIVE">
							<span>{{ props.row['total_positive'] ?  props.row['total_positive'] : ''}}</span>
						</el-form-item>
						<el-form-item label="TOTAL NEGATIVE">
							<span>{{ props.row['total_negative'] ? props.row['total_negative'] : ''}}</span>
						</el-form-item>
					</el-form>
				</template>
		</el-table-column>
    <el-table-column align="center" width="50px">
      <template #header>
        <!-- 将表头内容替换成 -->
        <el-button type="text" icon="el-icon-refresh" title="Refresh List" @click="() => {currentPage = 1;getDataList(null)}"></el-button>
      </template>
				<template slot-scope="scope">
          <el-button-group>
            <el-button type="text" icon="el-icon-caret-right" @click="handleRowClick(scope.row)" title="View Backtest Details" :loading="scope.row.viewLoading"></el-button>
            <el-button type="text" icon="el-icon-close" @click="deleteRow(scope.row)" title="Delete Backtest" :loading="scope.row.deleteLoading" element-loading-spinner="el-icon-right"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
			<template v-for="(l) in tableCol">
				<el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
				  show-overflow-tooltip
          min-width="100px"
          v-if="l.label == 'Name'"
				>
					<template slot-scope="scope">
						<span class="tableText">
              {{ scope.row[l.value] }}
						</span>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Return', 'Max Risk %', 'STD. DEV'].includes(l.label)"
          :sortable="['Return', 'Max Risk %', 'STD. DEV'].includes(l.label) ? 'custom' : false"
				  :sort-orders="['ascending', 'descending', l.value]"
				>
					<template slot-scope="scope">
						<span class="tableText">
              <span class="tableText" v-if="!isNaN(scope.row[l.value]) && scope.row[l.value]">
							{{ scope.row[l.value] }}%
						</span>
            <span class="tableText" v-else-if="scope.row[l.value] == 0">
							{{ scope.row[l.value] }}%
						</span>
            <span class="tableText" v-else-if="isNaN(scope.row[l.value])">
							{{ '' }}
						</span>
            <span class="tableText" v-else>
							{{ scope.row[l.value] }}
						</span>
						</span>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Win Rate %'].includes(l.label)"
          :sortable="['Win Rate %'].includes(l.label) ? 'custom' : false"
				  :sort-orders="['ascending', 'descending', l.value]"
				>
					<template slot-scope="scope">
						<span class="tableText" v-if="!isNaN(scope.row[l.value]) && scope.row[l.value]">
							{{ scope.row[l.value] }}% 
						</span>
            <span class="tableText" v-else-if="scope.row[l.value] == 0">
							{{ scope.row[l.value] }}%
						</span>
            <span class="tableText" v-else-if="isNaN(scope.row[l.value])">
							{{ '' }}
						</span>
            <span class="tableText" v-else>
            {{ scope.row[l.value] }}
						</span>
					</template>
				</el-table-column>
        <el-table-column
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Status'].includes(l.label)"
				>
					<template slot-scope="scope">
            <span v-if="scope.row[l.value] == 'Finish'">{{scope.row[l.value]}}</span>
            <span v-if="scope.row[l.value] == 'Running'">{{scope.row[l.value]}}</span>
            <span v-if="scope.row[l.value] == 'Failed' || scope.row[l.value] == 'Fail'">{{scope.row[l.value]}}</span>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<el-pagination
		@current-change="handleCurrentChange"
    :current-page="currentPage"
		:page-size="pageSize"
		:total="total"
		layout="total, prev, pager, next, jumper"
		></el-pagination>
    <div v-if="isPopupVisible" :style="popupStyle" class="popup">
      <!-- 显示详细信息的内容 -->
      <div class="plan_box">
        <table border="2px">
          <thead>
            <template v-for="(item, index) in detailTableCol">
               <td class="head" :style="{'width': item.width}" :key="index">{{ item.label }}</td>
            </template>
          </thead>
          <tbody>
              <template v-for="(item, index) in strategy_combination">
                <tr :key="index">
                  <template v-for="(value, key) in item">
                    <td :key="key" v-if="['strategy', '#', 'percent'].includes(key)">{{ key !== 'percent' ? value : `${value}%` }}</td>
                  </template>
               </tr>  
              </template>
          </tbody>
       </table>
      </div>
    </div>
  </div>
</template>

<script>
import { delPortfolio, getRunPortfolioResults, getPortfolioList } from '@/service/service'
import { capitalizeFirstLetter, isJson } from "@/utils"

export default {
  name: 'ScannerBTTable',
  data() {
    return {
      loading: false,
      pageSize: 10, // Default page size
      currentPage: 1, // Default current page
      total: 0,
      searchKey: '',
      tableCol: [
        {
          label: 'Name',
          value: 'name',
          key: 'name'
        },
        {
          label: 'Status',
          value: 'status',
          key: 'status'
        },
        {
          label: 'Return',
          value: 'return',
          key: 'return'
        },
        {
          label: 'Win Rate %',
          value: 'winrate',
          key: 'winrate'
        },
        {
          label: 'STD. DEV',
          value: 'std_dev',
          key: 'std_dev'
        },
        {
          label: 'Max Risk %',
          value: 'max_risk',
          key: 'max_risk'
        }
      ],
      tableData: [],
      detailTableCol: [
      {
          label: '#',
          name: '#',
          key: '#',
          width: '50px'
        },
        {
          label: 'Strategies',
          name: 'strategy',
          key: 'strategy',
          width: '400px'
        },
        // {
        //   label: 'Model',
        //   name: 'model',
        //   key: 'model',
        //   width: '100px'
        // },
        {
          label: 'Weight',
          name: 'percent',
          key: 'percent',
          width: '80px'
        }
      ],
      currentSort: {}, // 当前的排序信息
      isPopupVisible: false,
      strategy_combination: [],
      mouseX: 0,
      mouseY: 0,
      strategiesList: []
    }
  },
  async created() {
    await this.getDataList()
    console.log('列表返回处理数据', this.tableData)
  },
  computed: {
    popupStyle() {
      return {
        position: 'fixed',
        'z-index': 30000,
        left: (this.mouseX-200) + 'px',
        top: (this.mouseY+50) + 'px'
      };
    }
  },
  methods: {
    async getDataList(orderby) {
      this.loading = true
      let res = null
      const page = this.currentPage
			try {
				res = await getPortfolioList(page, orderby, this.searchKey)
        console.log('列表响应', res)
				if (res.status == 200) {
					let data = res.data.results
					data = data.map(item => {
            const handleKey = ['return', 'winrate', 'std_dev', 'max_risk', 'avg_loss', 'avg_win', 'median_return', 'total_negative', 'total_positive', 'total_trades']
            item.status = capitalizeFirstLetter(item.status)
            item.strategy_combination = isJson(item.strategy_combination) ? JSON.parse(item.strategy_combination) : item.strategy_combination
            item.return = ((item.float_profit/item.cash)*100)
            const unifyNumber = (num) => {
            if (num === '') {
              return 0
            } else {
              let handleNum = parseFloat(num)
              let isToFixed = handleNum.toString().includes('.') && handleNum.toString().split('.')[1].length > 2
              if (isToFixed) {
                return isNaN(handleNum.toFixed(2)) ? NaN : handleNum.toFixed(2)
              } else {
                return isNaN(handleNum) ? NaN : handleNum
              }
            }
          }
            handleKey.forEach(key => {
              item[key] = unifyNumber(item[key])
            })
            item.viewLoading = false
            item.deleteLoading = false
						return item
					})
					this.tableData = data
					this.total = res.data.count
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
        
      } finally {
        this.loading = false
      }
    },
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
      await this.applySort()
		},
    async onSortChange({ column, prop, order }) {
			if(this.currentPage != 1) this.currentPage = 1
      if (column.sortable !== 'custom') return
      this.currentSort = {
        prop: prop,
        order: order,
      };
      await this.applySort()
    },
    async applySort() {
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
			await this.getDataList(prop)
		},
    handleCreate() {
      this.$router.push({
        name: 'CPMResults',
        params: {
          usedFor: 'createNewCPM',
        }
      })
    },
    async deleteRow(row) {
      const { url } = row
      const _this = this
      row.deleteLoading = true
			const res = await delPortfolio(url)
      const code = res.data.code
      if(code == 204) _this.popUpMsgBox('Successfully deleted')
      if(code == 403) _this.popUpMsgBox("Sorry, deleted item doesn't exist. Refresh the list")
      if(code == 404) {_this.popUpMsgBox('Delete failed')}
			row.deleteLoading = false
			await _this.getDataList(null)
    },
    async handleRowClick(row) {
      row.viewLoading = true
      const {url, status:preStatus} = row
      const _this = this
      let res
      try {
        
        res = await getRunPortfolioResults(url)
      } catch (error) {
        console.error('error', error)
        _this.popUpMsgBox('Details Not Found')
        row.viewLoading = false
        return
      }
      const code = res.data?.code
      
      const status = res.data?.data?.status || preStatus
      if(code == 403) {_this.popUpMsgBox('Sorry, details not found. Possibly deleted or moved'); return}
      if(code == 200) {
        _this.popUpMsgBox('Basket details viewed successfully')
        const data = res.data.data
        data.row = row
        _this.$emit('displayResultsData', data)
        // 如果说之前的状态是 running 之后的状态变成了 finish 或者 fail, 那么需要刷新列表
        if((preStatus === 'Running' || preStatus === 'running') && (['finish', 'Finish', 'Failed', 'failed', 'Fail', 'fail'].includes(status))) await _this.getDataList(null) // 成功后刷新列表
      }
      if(status === 'Failed' || status === 'failed' || status === 'Fail' || status === 'fail') _this.popUpMsgBox('Basket failed. Adjust filters and rerun')
      if(code == 203) {row.viewLoading = false; _this.popUpMsgBox('Basket in progress. Details and editing are unavailable');return}
      if(code != 200) {_this.$emit('displayResultsData', {row})}
      row.viewLoading = false
    },
    async handleQuery() {
      if(this.currentPage != 1) this.currentPage = 1
      await this.applySort()
    },
    handleCellMouseEnter(row, column, cell, event) {
      // 如果是第一， 第二列， 直接返回
      if(typeof column.id === 'string') {
      const parts = column.id.split('_');
      const lastPart = parts[parts.length - 1];
      const number = parseInt(lastPart);
      if (number <= 2) return
      }
      const sortObjectProperties = (data, order) => {
          return data.map(obj => {
            const sortedObj = {};
            order.forEach(key => {
                if (obj.hasOwnProperty(key)) {
                    sortedObj[key] = obj[key]
                }
            })
            return sortedObj
          })
      }
      try {
        const order = ['#', 'strategy', 'percent']
        let _strategy_combination = typeof row.strategy_combination === 'string' ? eval(row.strategy_combination) : row.strategy_combination
        _strategy_combination = _strategy_combination.map((item, index) => {
          delete item.model
          return {
            ...item,
            '#': index + 1
          }
        })
        this.strategy_combination = sortObjectProperties(_strategy_combination, order)
      } catch (error) {
        console.log('error', error)
        return
      }
      console.log('strategy_combination', this.strategy_combination)
       // 计算弹框位置
       this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      // 显示弹框
      this.isPopupVisible = true;
    },
    handleCellMouseLeave(row, column, cell, event) {
      this.isPopupVisible = false;
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
  /deep/ .el-input--suffix .el-input__inner {
    margin-left: 0px
  }
}
.el-input-group{
  width: 40%;
}
.CPM-list-container{
  padding: 20px 20px 20px 0px;
}
.showDate {
  margin: 5px 0;
}
.ScannerBTTable {
	position: relative;
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
.popup {
  background-color: white;
}
.plan_box {
 overflow: visible;
}
.plan_box table {
 border-spacing: 0;
 border-color: #dddddd;
}
.plan_box table thead tr:nth-child(2n+1) {
 background-color: #FAFAFA;
}
.plan_box table td {
 text-align: center;
 line-height: 20px;
 padding: 5px 0;
}
.plan_box table tr {
 font-size: 14px;
 color: 14px;
 line-height: 20px;
 font-weight: 400;
 text-align: center;
 padding: 5px 0;
}
.plan_box table tr:nth-child(2n) {
 background-color: #FAFAFA;
}
.plan_box table .head {
 font-size: 14px;
 color: #333341;
 line-height: 20px;
 font-weight: 600;
 padding: 8px 0;
}
/*# sourceMappingURL=index.css.map */


</style>