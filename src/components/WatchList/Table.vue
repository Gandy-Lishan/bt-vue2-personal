<template>
  <div class="CPM-list-container ScannerBTTable">
    <div class="search-box">
      <el-input placeholder="Search" v-model="searchKey" @keyup.enter.native="handleQuery" clearable @clear="handleQuery" @input="handleQuery" size="small">
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
		>
			<template v-for="(l) in tableCol">
        <el-table-column
          v-if="l.label === 'Columns'"
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
				>
					<template slot-scope="scope">
            <el-tooltip
            class="item"
            effect="dark"
            placement="top"
          >
          	<span slot="content" v-html="getTooltipContent(scope.row['columns'])"></span>
            <span class="tableText">
              {{ scope.row[l.value] }}
            </span>
          </el-tooltip>
					</template>
				</el-table-column>
				<el-table-column
          v-else
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
				  show-overflow-tooltip
          :sortable="
						[
							'Name',
              'Updated'
						].indexOf(l.label) !== -1
							? 'custom'
							: false
					"
				>
					<template slot-scope="scope">
						<span class="tableText">
              {{ scope.row[l.value] }}
						</span>
					</template>
				</el-table-column>
			</template>
      <el-table-column align="center" width="80px">
      <template #header>
        <!-- 将表头内容替换成 -->
        <el-button type="text" icon="el-icon-refresh" title="Refresh List" @click="() => {currentPage = 1;getDataList(null)}"></el-button>
      </template>
				<template slot-scope="scope">
          <el-button-group>
            <el-button class="viewDetailsBtn" type="text" icon="el-icon-view" @click="handleRowClick(scope.row)" title="View Watch List Details" :loading="scope.row.viewLoading"></el-button>
            <el-button type="text" icon="el-icon-close" @click="deleteRow(scope.row)" title="Delete Watch List" :loading="scope.row.deleteLoading" element-loading-spinner="el-icon-right"></el-button>
          </el-button-group>
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
import { deleteWatchlist, getWatchlist, getAllWatchlist } from '@/service/service'
import { capitalizeFirstLetter, isJson } from "@/utils"
const debounce = require('lodash/debounce')

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
          label: 'Tickers',
          value: '_tickers',
          key: '_tickers'
        },
        {
          label: 'Columns',
          value: '_columns',
          key: '_columns'
        },
        {
          label: 'Updated',
          value: 'updated_at',
          key: 'updated_at'
        }
      ],
      tableData: [],
      currentSort: {}, // 当前的排序信息
    }
  },
  async created() {
    await this.getDataList()
    console.log('列表返回处理数据', this.tableData)
  },
  methods: {
    async getDataList(orderby) {
      this.loading = true
      let res = null
      const page = this.currentPage
			try {
				res = await getAllWatchlist(page, orderby, this.searchKey)
        const removeStartEndNumbers = (str) => {
          return str
            .replace(/^\d+/, '')    // 去掉开头数字
            .replace(/\d+$/, '')    // 去掉结尾数字
            .trim();                // 去除首尾空格
        }
        console.log('列表响应', res)
				if (res.status == 200) {
					let data = res.data.results
					data = data.map(item => {
            const handleKey = ['columns', 'tickers', 'updated_at']
            handleKey.forEach(key => {
              item[key] = isJson(item[key]) ? JSON.parse(item[key]) : item[key]
              if(key === 'tickers' && Array.isArray(item[key])) item[`_${key}`] = item[key].join(', ')
              else if(key === 'updated_at' && item[key]) {
                item[key] = item[key].slice(0, 10)
              }else if(key === 'columns') {
                item[`_${key}`] = item[key].map((ele,index) => {
                  if(ele.hasOwnProperty('indicator') && ele.hasOwnProperty('bar')) {
                    let {indicator, bar} = ele
                     bar = `${bar && bar != 1 ? ` ${bar}` : ''}`
                     indicator = removeStartEndNumbers(indicator)
                     let label = `${indicator}${bar}`
                     if(label.includes('ROC')) label = `${bar} ${indicator}`

                    // const serialNumber = Array.isArray(item[key]) && item[key].length > 1 ? `${(index + 1)}. ` : ''
                    return `${label}`
                  }
                  return ele
                }).join(', ')
              }
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
			const res = await deleteWatchlist(url)
      const code = res.data.code
      if(code == 204) _this.popUpMsgBox('Successfully deleted')
      if(code == 403) _this.popUpMsgBox("Sorry, deleted item doesn't exist. Refresh the list")
      if(code == 404) {_this.popUpMsgBox('Delete failed')}
			row.deleteLoading = false
			await _this.getDataList(null)
    },
    async handleRowClick(row) {
      debugger
      row.viewLoading = true
      const {url} = row
      const _this = this
      let res
      try {
        
        res = await getWatchlist(url)
      } catch (error) {
        console.error('error', error)
        _this.popUpMsgBox('Details Not Found')
        row.viewLoading = false
        return
      }
      res.data =isJson(res.data) ? JSON.parse(res.data) : res.data
      const code = res.data?.code
      if(code == 403) {_this.popUpMsgBox('Sorry, details not found. Possibly deleted or moved'); return}
      if(code == 214) {
        _this.popUpMsgBox('Watch List details viewed successfully')
        const data = res.data.data
        _this.$emit('displayResultsData', {data, formData: row})
      }
      if(code == 203) {row.viewLoading = false; _this.popUpMsgBox('Watch List in progress. Details and editing are unavailable');return}
      if(code != 214) {_this.$emit('displayResultsData', {formData: row})}
      row.viewLoading = false
    },
    handleQuery: debounce(async function() {
      if(this.currentPage != 1) this.currentPage = 1
      await this.applySort()
    }, 500),
    getTooltipContent(columns) {
      const indicatorOptions = [
        { value: 'Trend Score', label: 'Trend Score', inputValue: 1 },
        { value: 'RelTrend Score', label: 'RelTrend Score', inputValue: 1 },
        { value: 'Optix', label: 'Optix', inputValue: 1 },
        { value: 'ROC', label: 'Rate of Change', inputValue: 1 },
        { value: 'Optix MA5', label: 'Symbol Optix 5-Day Moving Average', inputValue: 5 },
        { value: 'Optix MA10', label: 'Symbol Optix 10-Day Moving Average', inputValue: 10 },
        { value: 'Optix MA20', label: 'Symbol Optix 21-Day Moving Average', inputValue: 21 },
        { value: 'Optix MA63', label: 'Symbol Optix 63-Day Moving Average', inputValue: 63 },
        { value: 'Close MA5', label: 'Symbol Close 5-Day Moving Average', inputValue: 5 },
        { value: 'Close MA10', label: 'Symbol Close 10-Day Moving Average', inputValue: 10 },
        { value: 'Close MA21', label: 'Symbol Close 21-Day Moving Average', inputValue: 21 },
        { value: 'Close MA63', label: 'Symbol Close 63-Day Moving Average', inputValue: 63 },
        { value: 'Close MA126', label: 'Symbol Close 126-Day Moving Average', inputValue: 126 },
        { value: 'Close MA252', label: 'Symbol Close 252-Day Moving Average', inputValue: 252 },
        { value: 'ROC5', label: '5-Day Rate of Change', inputValue: 5 },
        { value: 'ROC10', label: '10-Day Rate of Change', inputValue: 10 },
        { value: 'ROC21', label: '21-Day Rate of Change', inputValue: 21 },
        { value: 'ROC63', label: '63-Day Rate of Change', inputValue: 63 },
        { value: 'ROC126', label: '126-Day Rate of Change', inputValue: 126 },
        { value: 'ROC252', label: '252-Day Rate of Change', inputValue: 252 }
      ];

      const columnLabels = columns
        .map(column => indicatorOptions.find(option => option.value === column.indicator)?.label || '')
        .filter(Boolean);

      // 如果只有一项，不加序号
      if (columnLabels.length === 1) {
        return `<ul><li>${columnLabels[0]}</li></ul>`;
      }

      // 多于一项，加序号
      const html = `<ul>${columnLabels.map((item, index) => `<li>${index + 1}. ${item}</li>`).join('')}</ul>`;
      return html;
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

button.el-button.viewDetailsBtn.el-button--text {
  margin-right: 8px;
}
</style>