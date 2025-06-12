<template>
  <div class="base-table-simple">
    <table class="base-table-simple__table">
      <tbody>
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
    </table>
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
    }
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

/* 第一列背景固定淺灰 */
.base-table-simple__cell--label {
  width: 45%;
  background-color: #f5f7fa;
}

/* 高亮最後一行 */
.base-table-simple__row--highlight .base-table-simple__cell {
  background-color: #f5f7fa;
}

/* hover 效果（不改變第一列） */
.base-table-simple__row:hover .base-table-simple__cell:not(.base-table-simple__cell--label) {
  /* background-color: #f0f9ff; */
  cursor: pointer;
}
</style>
