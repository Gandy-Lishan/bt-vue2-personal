<template>
  <div class="base-table-simple">
    <div v-if="isLoading" class="table-loading">Loading data...</div>
    <div v-else>
      <table class="base-table-simple__table">
        <thead v-if="title">
          <tr>
            <th
              class="base-table-simple__title"
              :colspan="transpose ? data.length : 2"
            >
              {{ title }}
            </th>
          </tr>
        </thead>
        <!-- 標準表格 -->
        <tbody v-if="!transpose">
          <tr
            v-for="(row, index) in data"
            :key="index"
            :class="{
              'base-table-simple__row': true,
              'base-table-simple__row--highlight': highlightLastRow && index === data.length - 1
            }"
          >
            <td class="base-table-simple__cell base-table-simple__cell--label">
              {{ row.label }}
            </td>
            <td class="base-table-simple__cell">
              {{ row.value }}
            </td>
          </tr>
        </tbody>

        <!-- 轉置表格（無 Label/Value header） -->
        <tbody v-else>
          <tr class="base-table-simple__row">
            <td
              v-for="(row, index) in data"
              :key="'label-' + index"
              class="base-table-simple__cell base-table-simple__cell--label"
            >
              {{ row.label }}
            </td>
          </tr>
          <tr class="base-table-simple__row">
            <td
              v-for="(row, index) in data"
              :key="'value-' + index"
              class="base-table-simple__cell"
            >
              {{ row.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTableSimple',
  props: {
    data: {
      type: Array,
      required: true
    },
    highlightLastRow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    transpose: {
      type: Boolean,
      default: false
    },
    isLoading: { type: Boolean, default: false },
  }
}
</script>

<style scoped>
.base-table-simple__table {
  width: 100%;
  border-collapse: collapse;
}

.base-table-simple__row {
  transition: background-color 0.2s;
}

.base-table-simple__cell {
  padding: 8px 12px;
  border: 1px solid #ebeef5;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}

.base-table-simple__cell--label {
  background-color: #f5f7fa;
}

.base-table-simple__row--highlight .base-table-simple__cell {
  background-color: #f5f7fa;
}

.base-table-simple__row:hover .base-table-simple__cell:not(.base-table-simple__cell--label) {
  cursor: pointer;
}

.base-table-simple__title {
  text-align: left;
  font-weight: bold;
  font-size: 16px;
  padding: 12px;
  border: 1px solid #ebeef5;
}

.table-loading, .table-error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 111px;
  color: #888;
  font-style: italic;
  border: 1px dashed #ccc;
  box-sizing: border-box;
}
.table-error {
  color: #D32F2F;
  background-color: #FFEBEE;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #FFCDD2;
}
</style>
