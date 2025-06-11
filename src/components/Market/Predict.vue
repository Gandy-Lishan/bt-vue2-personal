<template>
  <div class="predict-layout">
    <h2 class="heading">Predict</h2>

    <div class="predict-layout__main">
      <!-- 第一行：三列 -->
      <section class="predict-layout__table">
      <div class="contentWrapper">
        <h3 class="table-title">Predict Table</h3>
        <base-table
          :data="tableData"
          :columns="columns"
          :loading="loading"
          tip-text=""
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </base-table>
      </div>
      </section>
    </div>
  </div>
</template>

<script>
import BaseTable from "@/components/Market/components/tables/BaseTable";

export default {
  name: 'Predict',
  components: { 
    BaseTable
  },
  data() {
    return {
      loading: false,
      tableData: [
        {
          Ticker: "A",
          PublishTime: "2024-10-15",
          PublishPrice: 144.25,
          Target: 151.67,
          PredictEndDate: "2025-01-01",
          PhaseMinPrice: 124.89,
          PhaseMaxPrice: 148.19,
          Date: "2025-06-05",
          Close: 113.94,
          MeanAcc: 82.64,
          LastWinRate: 87
        },
        {
          Ticker: "OGS",
          PublishTime: "2024-12-09",
          PublishPrice: 72.54,
          Target: 79.0,
          PredictEndDate: "2025-03-01",
          PhaseMinPrice: 66.38,
          PhaseMaxPrice: 75.64,
          Date: "2025-06-05",
          Close: 73.41,
          MeanAcc: 95.4,
          LastWinRate: 73
        },
        // ... 其他数据项
      ],
      columns: [
        { 
          prop: 'Ticker', 
          label: 'Ticker', 
          sortable: true 
        },
        { 
          prop: 'PublishTime', 
          labelHTML: 'Publish<br>Time', 
          sortable: true 
        },
        { 
          prop: 'PublishPrice', 
          labelHTML: 'Publish<br>Price', 
          sortable: true,
          formatter: (row) => `$${row.PublishPrice.toFixed(2)}`
        },
        { 
          prop: 'Target',   
          label: 'Target', 
          sortable: true,
          formatter: (row) => `$${row.Target.toFixed(2)}`
        },
        { 
          prop: 'PredictEndDate', 
          labelHTML: 'Predict<br>End Date', 
          sortable: true 
        },
        { 
          prop: 'PhaseMinPrice', 
          label: 'Min Price', 
          sortable: true,
          formatter: (row) => `$${row.PhaseMinPrice.toFixed(2)}`
        },
        { 
          prop: 'PhaseMaxPrice', 
          label: 'Max Price', 
          sortable: true,
          formatter: (row) => `$${row.PhaseMaxPrice.toFixed(2)}`
        },
        { 
          prop: 'Close', 
          label: 'Close', 
          sortable: true,
          formatter: (row) => `$${row.Close.toFixed(2)}`
        },
        { 
          prop: 'MeanAcc', 
          labelHTML: 'Mean<br>Accuracy', 
          sortable: true,
          formatter: (row) => `${row.MeanAcc.toFixed(2)}%`
        },
        { 
          prop: 'LastWinRate', 
          labelHTML: 'Last<br>Win Rate', 
          sortable: true,
          formatter: (row) => `${row.LastWinRate}%`
        }
      ]
    };
  },
  mounted() {

  },
  methods: {
    handleSizeChange(size) {
      console.log('每页显示条数改变：', size)
    },
    handleCurrentChange(page) {
      console.log('当前页改变：', page)
    },
  }
};
</script>

<style scoped lang="scss">
 @import "@/components/Market/market.scss";

.predict-layout {
  padding: $spacing-md;

  .heading {
    color: $color-text-secondary;
  }
  .contentWrapper {
    background-color: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
  }
}
</style>
