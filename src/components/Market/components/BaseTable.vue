<template>
  <div class="base-table">
    <!-- <div class="base-table__controls mb-8">
      <el-input
        v-model="searchQuery"
        placeholder="Search..."
        size="small"
        class="base-table__search"
        clearable
      />
    </div> -->
    <el-table
      :data="filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      border
      stripe
      style="width: 100%;"
      :header-cell-style="{ background: '#1e1e1e', color: '#ccc' }"
      :cell-style="{ color: '#ccc' }"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
      />
    </el-table>

    <div class="base-table__pagination mt-16">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="filteredData.length"
        :page-size="pageSize"
        @current-change="handlePageChange"
        :current-page="currentPage"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    searchableFields: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.data;
      const q = this.searchQuery.toLowerCase();
      return this.data.filter(item =>
        this.searchableFields.some(field =>
          String(item[field] || '').toLowerCase().includes(q)
        )
      );
    }
  },
  methods: {
    handlePageChange(val) {
      this.currentPage = val;
    }
  }
};
</script>

<style scoped>
.base-table__controls {
  display: flex;
  justify-content: flex-start;
}

.base-table__search {
  max-width: 200px;
}
</style>
