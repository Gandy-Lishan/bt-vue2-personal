<template>
  <div class="page-content-wrapper asset-correlation">
  <table>
    <thead>
      <tr>
          <th v-for="col in columns" :key="col" :width="col === 'Name' ? '180px' : 'auto'">{{ col }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index" :class="{ stripe: index % 2 === 0 }">
          <td v-for="col in columns" :key="col" :style="getCellStyle(row, col)">
              {{ row[col] }}
          </td>
      </tr>
    </tbody>
  </table>
  <p v-show="date" style="margin-top: 10px"><strong>Correlation matrix of monthly asset returns for the period 01/01/2008 to {{date}}.</strong></p>
  </div>
</template>

<script>
import { getAssetCorrelation } from "@/service/service";
import moment from "moment";

export default {
  name: 'AssetCorrelation',
  props: {
    data: Array
  },
  data() {
    return {
      fixedColumns: ['Name', 'Ticker'],
      additionalFixedColumns: [
        'Annualized Return',
        'Daily Standard Deviation',
        'Monthly Standard Deviation',
        'Annualized Standard Deviation'
      ],
      date: ''
    }
  },
  async mounted() {
    const {data} = await getAssetCorrelation()
    this.data = data || []
  },
  computed: {
    columns() {
      // 获取动态列名（排除固定列和额外固定列）
      if((Array.isArray(this.data) && this.data.length === 0) || !this.data) return []
      const dynamicColumns = Object.keys(this.data[0]).filter(
          key => !this.fixedColumns.includes(key) && !this.additionalFixedColumns.includes(key)
      );
      // 按照接口返回的顺序排列动态列名
      this.date = moment.utc(this.data[0].last_updated).format('MM/DD/YYYY')
      const orderedDynamicColumns = Object.keys(this.data[0]).filter(
          key => dynamicColumns.includes(key)
      ).filter(ele => ele !== 'last_updated')
      // 合并列名：固定列 + 动态列 + 额外固定列
      return [...this.fixedColumns, ...orderedDynamicColumns, ...this.additionalFixedColumns];
    }
  },
  methods: {
    // getCellStyle(row, col) {
    //   // 固定列和额外固定列不需要颜色渐变
    //   if (this.fixedColumns.includes(col) || this.additionalFixedColumns.includes(col)) {
    //       return {};
    //   }
    //   // 动态列的值在 0 到 1 之间，进行颜色渐变
    //   const value = row[col];
    //   if (typeof value === 'number' && value >= 0 && value <= 1) {
    //       const color = Math.floor(value * 255);
    //       return {
    //           backgroundColor: `rgb(${255 - color}, ${255 - color}, 255)`
    //       };
    //   }
    //   return {};
    // },
    getCellStyle(row, col) {
        // 固定列和额外固定列不应用颜色渐变
        if (this.fixedColumns.includes(col) || this.additionalFixedColumns.includes(col)) {
            return {};
        }
        const value = row[col];
        if (typeof value !== 'number') return {};
        
        // 负数区间：-1 到 0（白色 → #cdb8b5）
        if (value < 0) {
            const intensity = Math.abs(value); // 取绝对值
            const r = 255 - Math.floor(intensity * (255 - 0xcd));
            const g = 255 - Math.floor(intensity * (255 - 0xb8));
            const b = 255 - Math.floor(intensity * (255 - 0xb5));
            return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
        }
        // 正数区间：0 到 1（白色 → #7296b5）
        else if (value > 0) {
            const r = 255 - Math.floor(value * (255 - 0x72));
            const g = 255 - Math.floor(value * (255 - 0x96));
            const b = 255 - Math.floor(value * (255 - 0xb5));
            return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
        }
        // 零值：白色
        return { backgroundColor: '#ffffff' };
    }
  }
}
</script>

<style lang="less" scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 2px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    font-weight: 700;
  }
  th {
    font-size: 14px;
  }
  .stripe {
    background-color: #f9f9f9;
  }
</style>