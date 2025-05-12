<template>
  <div class='row' style="margin-left:10px; margin-right:10px;">
    <div class="panel" style="border: 1px solid #67809F;">
      <div class="panel-heading  bg-blue-hoki bg-font-blue-hoki">
        <h3 class="panel-title">Highlighted Indicators</h3>
      </div>
      <div class="panel-body">
        <p>
          Below is a list of indicators that we've discussed / highlighted in recent research.
        </p>

        <div id="example_wrapper" class="dataTables_wrapper no-footer">
          <div class="filter-div">
            <el-row type="flex" justify="end">
              <el-col :span="6">
                <el-input @input="handleQuery" size="small" placeholder="Search" v-model="searchInput" clearable>
                </el-input>
              </el-col>
            </el-row>
          </div>
          <table id="example" class="display compact_active_studies table-active-toolbar dataTable no-footer"
            cellspacing="0" width="100%">
            <thead>
              <tr>
                <th :class="getSortClass('date')" @click="sortTable('date')" tabindex="0" aria-controls="example"
                  rowspan="1" colspan="1" aria-sort="descending" aria-label="Date: activate to sort column ascending"
                  style="width: 75px;">Date Published</th>
                <th :class="getSortClass('title')" @click="sortTable('title')" tabindex="0" aria-controls="example"
                  rowspan="1" colspan="1" aria-label="Study Title: activate to sort column ascending"
                  style="width: 270px;">Recent</th>
                <th :class="getSortClass('chart_name')" @click="sortTable('chart_name')" tabindex="0" aria-controls="example"
                  rowspan="1" colspan="1" aria-label="chart_name: activate to sort column ascending" style="width: 270px;">
                  Indicator</th>
                <th :class="getSortClass('last_value')" @click="sortTable('last_value')" tabindex="0"
                  aria-controls="example" rowspan="1" colspan="1"
                  aria-label="last_value: activate to sort column ascending" style="width: 69px;">Last Value</th>
                <th :class="getSortClass('sentiment')" @click="sortTable('sentiment')" tabindex="0" aria-controls="example"
                  rowspan="1" colspan="1" aria-label="sentiment: activate to sort column ascending" style="width: 71px;">
                  Sentiment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(forecast, index) in paginatedData" :key="index">
                <td>
                  <center>{{ formatDate(forecast.date) }}</center>
                </td>

                <td>
                  <a :href="postLink(forecast)" target="_blank" class="item-name primary-link">
                    {{ forecast.title }}
                  </a>
                </td>

                <td>
                  <a :href="chartLink(forecast)" target="_blank" class="item-name primary-link">
                    {{ forecast.chart_name }}
                  </a>
                </td>

                <td>
                  <center>{{ forecast.last_value }}</center>
                </td>

                <td>
                  <center>
                    <img 
                      :src="`https://users.sentimentrader.com/static/img/bull_bear_${forecast.sentiment}.gif`"
                      :data-order="forecast.sentiment"
                      :title="forecast.sentiment"
                    />
                  </center>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="dataTables_info" id="example_info" role="status" aria-live="polite">Showing {{ start }} to {{ total
            >= perPage
            ? end : total }} of {{ total }} entries</div>
          <div class="dataTables_paginate paging_simple_numbers" id="example_paginate"
            style="display:inline-flex;justify-content:space-between;">
            <a class="paginate_button previous" :class="{ disabled: currentPage === 1 }" @click="prevPage">
              Previous
            </a>
            <div class="pagination" style="flex-grow:1;text-align:center">
              <!-- 显示第一页的链接，如果当前页不在第一页 -->
              <a v-if="currentPage > 5" class="paginate_button" :class="{ current: currentPage === 1 }"
                @click="goToPage(1)">
                1
              </a>
              <span v-if="currentPage > 6">...</span>
              <!-- 显示当前页前的两页 -->
              <a v-for="pageNum in getPageRange(currentPage - 4, currentPage - 1)" :key="pageNum" v-if="pageNum > 0"
                class="paginate_button" :class="{ current: currentPage === pageNum }" @click="goToPage(pageNum)">
                {{ pageNum }}
              </a>
              <!-- 当前页 -->
              <a class="paginate_button current" href="#">{{ currentPage }}</a>
              <!-- 显示当前页后的两页 -->
              <a v-for="pageNum in getPageRange(currentPage + 1, currentPage + 4)" :key="pageNum"
                v-if="pageNum <= totalPages" class="paginate_button" :class="{ current: currentPage === pageNum }"
                @click="goToPage(pageNum)">
                {{ pageNum }}
              </a>
              <!-- 显示最后一页的链接，如果当前页不在最后几页 -->
              <span v-if="currentPage < totalPages - 5">...</span>
              <a v-if="currentPage < totalPages - 4" class="paginate_button"
                :class="{ current: currentPage === totalPages }" @click="goToPage(totalPages)">
                {{ totalPages }}
              </a>
            </div>
            <!-- 下一页 -->
            <a v-if="currentPage < totalPages" class="paginate_button" style="float:right;align-self:center"
              @click="nextPage">
              Next
            </a>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>
<script>
const debounce = require('lodash/debounce')

export default {
  name: 'RecentIndicators',
  data() {
    return {
      filterData: [],
      start: 1,
      end: 25,
      currentPage: 1,
      perPage: 25,
      currentSortColumn: '',
      currentSortDirection: '',
      searchInput: '',
    };
  },
  props: {
    forecasts: {
      type: Array,
      required: true,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filterData.length / this.perPage)
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      this.start = start + 1
      this.end = end
      return this.filterData.slice(start, end);
    },
    total() {
      return this.filterData.length
    },
  },
  watch: {
		// 数据源更新时tableData同时响应,只会在getAIPick时获取originData
		forecasts: {
			async handler(newValue, oldValue){
        if(Array.isArray(newValue) && newValue.length !== 0) {
          this.filterData = JSON.parse(JSON.stringify(newValue))
          this.currentSortColumn = 'date'
          this.currentSortDirection = 'descending'
          this.sortTable('date')
        }
			},
			deep: true
		},
	},
  methods: {
    formatDate(date) {
      // Formatting the date to 'Month Day, Year' format (like 'January 01, 2025')
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date));
    },
    postLink(item) {
    return `https://sentimentrader.com/blog/${item.url}`;
   },
   chartLink(item) {
    return `/backtester/sr/setup?index=${item.market_symbol || 'Unknown'}&indicator=${item.chart_url}`
   },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    getSortClass(column) {
      // 返回 class 用于改变图标和样式
      if (this.currentSortColumn === column) {
        return this.currentSortDirection === 'descending'
          ? 'sorting_asc'
          : 'sorting_desc';
      }
      return 'sorting';
    },
    sortTable(column) {
      // 如果点击的列和当前排序的列相同，切换排序方向
      if (this.currentSortColumn === column) {
        this.currentSortDirection =
          this.currentSortDirection === 'ascending' ? 'descending' : 'ascending';
      } else {
        // 如果点击的是新列，默认使用降序排序
        this.currentSortColumn = column;
        this.currentSortDirection = 'descending';
      }
      // 判断是否需要排序
      if (!this.currentSortColumn) return
      console.log('currentSortColumn', this.currentSortColumn)
      this.filterData.sort((a, b) => {
        const key = this.currentSortColumn;
        const isAsc = this.currentSortDirection === 'descending';

        if (a[key] < b[key]) return isAsc ? -1 : 1;
        if (a[key] > b[key]) return isAsc ? 1 : -1;
        return 0;
      });
    },
    handleQuery: debounce(function () { this._filterData() }, 500),
    _filterData(){
		  this.filterData = this.getSearchResult()
      if(this.currentPage != 1) this.currentPage = 1
    },

    getSearchResult() {
      if(this.searchInput){
        // 在搜索之前对搜索关键词进行转义
        const trimmedStr = this.searchInput.trim()
        const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");
        return this.forecasts.filter(item => {
            // 获取所有需要匹配的属性
            const properties = [
              item['date'],
              item['title'],
              item['chart_name'],
            ];
          // 检查任意一个属性是否匹配
          return properties.some(property => regex.test(property));
        });
      }else{
        return this.forecasts
      }
    },
    // 使用反斜杠转义特殊字符
    escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },

    getPageRange(start, end) {
      let range = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    }
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";

th {
  text-align: left;
}

td,
th {
  padding: 0;
}

.nowrap {
  white-space: nowrap;
}

.tg {
  border-collapse: collapse;
  border-spacing: 0;
  border-color: #ccc;
}

.tg td,
.tg th {
  font-family: Arial, sans-serif;
  font-size: 14px;
  padding: 10px 5px;
  border-style: solid;
  border-width: 0px;
  word-break: normal;
  border-color: #ccc;
}

.tg td {
  color: #333;
  background-color: #fff;
}

.tg th {
  background-color: #f0f0f0;
}

.tg .tg-m0ac {
  font-weight: bold;
  background-color: #656565;
  color: #ffffff;
  text-align: center;
}

.tg .tg-w7sd {
  font-weight: bold;
  background-color: #32cb00;
  color: #ffffff;
  text-align: center;
}

.tg .tg-0mq6 {
  font-weight: bold;
  background-color: #fe0000;
  color: #ffffff;
  text-align: center;
}

.tg .tg-baqh {
  text-align: center;
  vertical-align: top;
}

.tg td {
  font-family: Arial, sans-serif;
  font-size: 14px;
  padding: 10px 5px;
  border-style: solid;
  border-width: 0px;
  overflow: hidden;
  word-break: normal;
  border-color: #ccc;
  color: #333;
  background-color: #fff;
  border-top-width: 1px;
  border-bottom-width: 1px;
}

.table {
  background-color: transparent;
  display: table;
  border-collapse: separate;
  box-sizing: border-box;
  text-indent: initial;
  unicode-bidi: isolate;
  line-height: normal;
  font-weight: normal;
  font-size: medium;
  font-style: normal;
  color: -internal-quirk-inherit;
  text-align: start;
  border-spacing: 2px;
  border-color: gray;
  white-space: normal;
  font-variant: normal;
}

table.dataTable {
  margin: 0 auto;
  clear: both;
  border-collapse: separate;
  border-spacing: 0;
}

table.dataTable,
table.dataTable th,
table.dataTable td {
  box-sizing: content-box
}

table.dataTable.no-footer {
  border-bottom: 1px solid #111;
}

table.dataTable thead th,
table.dataTable tfoot th {
  font-weight: bold
}

table.dataTable thead th,
table.dataTable thead td {
  padding: 10px 18px;
  border-bottom: 1px solid #111;
}

table.dataTable thead .sorting,
table.dataTable thead .sorting_asc,
table.dataTable thead .sorting_desc {
  cursor: pointer;
}

table.dataTable thead .sorting,
table.dataTable thead .sorting_asc,
table.dataTable thead .sorting_desc,
table.dataTable thead .sorting_asc_disabled,
table.dataTable thead .sorting_desc_disabled {
  background-repeat: no-repeat;
  background-position: center right;
}

table.dataTable thead .sorting {
  background-image: url("../../assets/sort_both.png");
}

table.dataTable thead .sorting_desc {
  background-image: url('../../assets/sort_desc.png');
}

table.dataTable thead .sorting_asc {
  background-image: url("../../assets/sort_asc.png");
}

.dataTable>thead>tr>th.sorting,
.dataTable>thead>tr>th.sorting_asc,
.dataTable>thead>tr>th.sorting_desc {
  padding-right: 18px;
}

table.dataTable tbody tr {
  background-color: #ffffff;
}

table.dataTable.stripe tbody tr.odd,
table.dataTable.display tbody tr.odd {
  background-color: #f9f9f9;
}

table.dataTable.stripe tbody tr.odd,
table.dataTable.display tbody tr.odd {
  background-color: #f6f3f3;
}

.nowrap {
  white-space: nowrap;
}

table.dataTable tbody th,
table.dataTable tbody td {
  padding: 8px 10px;
}

table.dataTable.row-border tbody th,
table.dataTable.row-border tbody td,
table.dataTable.display tbody th,
table.dataTable.display tbody td {
  border-top: 1px solid #ddd;
}

table.dataTable.row-border tbody tr:first-child th,
table.dataTable.row-border tbody tr:first-child td,
table.dataTable.display tbody tr:first-child th,
table.dataTable.display tbody tr:first-child td {
  border-top: none;
}

.dataTables_wrapper .dataTables_info {
  clear: both;
  float: left;
  padding-top: 0.755em;
}

.dataTables_wrapper .dataTables_length,
.dataTables_wrapper .dataTables_filter,
.dataTables_wrapper .dataTables_info,
.dataTables_wrapper .dataTables_processing,
.dataTables_wrapper .dataTables_paginate {
  color: #333;
}

.dataTables_wrapper .dataTables_paginate .paginate_button {
  box-sizing: border-box;
  display: inline-block;
  min-width: 1.5em;
  padding: 0.5em 1em;
  margin-left: 2px;
  text-align: center;
  text-decoration: none !important;
  cursor: pointer;
  color: #333 !important;
  border: 1px solid transparent;
  border-radius: 2px;
}

.dataTables_wrapper .dataTables_paginate .paginate_button.disabled,
.dataTables_wrapper .dataTables_paginate .paginate_button.disabled:hover,
.dataTables_wrapper .dataTables_paginate .paginate_button.disabled:active {
  cursor: default;
  color: #666 !important;
  border: 1px solid transparent;
  background: transparent;
  box-shadow: none;
}

.dataTables_wrapper .dataTables_paginate .paginate_button.current,
.dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
  color: #333 !important;
  border: 1px solid #979797;
  background: linear-gradient(to bottom, white 0%, #dcdcdc 100%);
}

.dataTables_wrapper .dataTables_paginate .paginate_button:hover {
  color: white !important;
  border: 1px solid #111;
  background: linear-gradient(to bottom, #585858 0%, #111 100%);
}

.center {
  text-align: center;
}

.nowrap {
  white-space: nowrap;
}

@media (min-width: 992px) {
  .col-md-7 {
    width: 58.33%;
  }

  .col-md-4 {
    width: 33.33%;
  }
}

.page-head .page-title>h1 {
  color: #656565;
  font-size: 22px;
  font-weight: 400;
  margin: 0;
  margin-left: 20px;
}

h4 {
  font-size: 18px;
  line-height: 1.25em;
}

.primary-link {
  color: #65a0d0;
  font-weight: 600;
}

.dataTables_wrapper .dataTables_paginate {
  float: right;
  text-align: right;
  padding-top: 0.25em;
}

.filter-div {
  padding-bottom: 20px;
}

.filter-div /deep/ .el-input__inner {
  margin-left: 0px;
}

.filter-div .btns .el-button {
  margin-right: 10px;
}

.filter-div .select-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #d9d9d9;
  border-radius: 4px;
  margin-right: 10px;
  padding: 3px;
}

.filter-div .select-option span {
  font-size: 14px;
  margin-right: 5px
}

.page-head {
  padding-top: 20px;
}

.accordion {
  padding: 0px 0px 10px 0px;
}

.accordion /deep/ .el-collapse-item__content {
  font-size: 16px;
  color: #3e4d5c;
  direction: ltr;
  background: #fff;
  font-weight: 400;
}

.accordion /deep/ .el-collapse-item__content {
  padding-bottom: 0px;
  line-height: 1.5;
}

.accordion p.page-title {
  margin: 0 0 0 5px;
}

.accordion /deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  font-weight: 300;
  color: #666;
  position: relative;
  flex-wrap: wrap;
  height: auto;
}
</style>