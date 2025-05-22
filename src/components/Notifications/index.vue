<template>
  <div class="notifications-wrapper">
    <div class='page-title'>Notifications</div>
    <hr>
    <!-- 顶部操作栏 -->
    <div style="display: flex; justify-content: space-between; margin: 15px 0;">
      <!-- 每页条数选择 -->
      <div>
        Show
        <el-select class="pageSize" v-model="pageSize" @change="handleSizeChange" style="width: 80px; margin: 0 8px;">
          <el-option v-for="size in pageSizes" :key="size" :label="size" :value="size" />
        </el-select>
        entries
      </div>

      <!-- 搜索框 -->
      <el-input
        class="search"
        placeholder="Search"
        v-model="search"
        @input="handleSearch"
        clearable
        size="small"
        style="width: 250px;"
      />
    </div>

    <!-- 表格 -->
    <el-table
      class = "page-table"
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%;"
      @sort-change="handleSortChange"
    >
      <el-table-column
        label="Message"
        sortable="custom"
        :min-width="'250px'"
      >
        <template v-slot="scope">
          <span v-html="renderMessage(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="broadcast_type"
        label="Type"
        sortable="custom"
      />
      <el-table-column
        prop="created_date"
        label="Posted"
        sortable="custom"
      >
        <template v-slot="scope">
          <span v-html="_formatted_date(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      style="margin-top: 20px;"
    />
  </div>
</template>

<script>
import moment from 'moment-timezone'

export default {
  data() {
    return {
      tableData: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: '',
      sortProp: '',
      sortOrder: '',
      pageSizes: [10, 20, 30, 50]
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    renderMessage(row) {
      return row.message + this.createReadMoreLink(row.url)
    },
    createReadMoreLink(url) {
      if (url) {
        return ` <a href="${url}" target="_blank" style="color: #409EFF;">Read more</a>`
      }
      return ''
    },
    _formatted_date(row) {
      var date = moment.tz(row.ds, "America/Chicago");
      return date.format('MM/DD/YYYY, hh:mm A z');
    },
    async loadData() {
      this.loading = true

      this.$store.dispatch('states/fetchNotifications', {
        page: this.currentPage,
        pageSize: this.pageSize,
        search: this.search,
        sortProp: this.sortProp,
        sortOrder: this.sortOrder,
        forceReload: false
      }).then(({ items, total }) => {
        this.tableData = items
        this.total = total
      }).catch(err => {
        console.error('获取通知失败:', err)
      })

      this.loading = false
    },
    handlePageChange(page) {
      this.currentPage = page
      this.loadData()
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1
      this.loadData()
    },
    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },
    handleSortChange({ prop, order }) {
      this.sortProp = prop
      this.sortOrder = order === 'ascending' ? 'asc' : 'desc'
      this.loadData()
    }
  }
}
</script>
<style lang="less" scoped>
.page-title {
  color: #697882;
  font-size: 24px;
}
hr {
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #eee;
  border-bottom: 0;
}
.notifications-wrapper {
  padding: 5rem 8rem 10rem 8rem;
}
.search {
  /deep/ .el-input__inner {
    margin: 0;
  }
}

.pageSize {
  /deep/ .el-input__inner {
    margin: 0;
  }
}

.page-table {
  width: 100%;
  table-layout: fixed;
}
</style>