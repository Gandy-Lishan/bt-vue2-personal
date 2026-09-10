<template>
  <div class="predict-layout">
    <!-- <h2 class="heading">Predict</h2> -->

    <div class="predict-layout__main">
      <!-- 第一行：三列 -->
      <section class="predict-layout__table">
      <div class="contentWrapper">
         <p style="font-weight: 400; font-size: 14px;">
          The Market Prediction summarizes the market's leading analysts' forecasts for the target price of a particular Ticker for the next three months. Based on analysts' professional interpretation of the current market conditions and latest data, we have compiled these informative estimates of future price movements for you, helping you to gain a better insight into potential market opportunities.
         </p>
         <div class="summary-toolbar">
          <h3 class="table-title">Market Prediction Summary</h3>
         </div>
         <div class="tabel-input">
            <el-input
              v-model.trim="searchKeyword"
              class="summary-search"
              placeholder="Search"
              prefix-icon="el-icon-search"
              size="small"
              clearable
            />
         </div>
        <base-table
          :tableData="filteredTableData"
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
import { mapGetters, mapActions } from 'vuex';
import BaseTable from "@/components/Market/components/tables/BaseTable";
import { isObject } from '@/utils';

export default {
  name: 'Predict',
  components: { 
    BaseTable
  },
  data() {
    return {
      loading: false,
      tableData: [],
      columns: [],
      searchKeyword: '',
    };
  },
  computed: {
    ...mapGetters("market/predict", [
      "predictData",
      "isLoading",
      "errorMessage",
    ]),
    symbol() {
      return this.$route.params.symbolname;
    },
    filteredTableData() {
      const rows = Array.isArray(this.tableData) ? this.tableData : [];
      const keyword = String(this.searchKeyword || '').trim().toLowerCase();
      if (!keyword) return rows;

      const columns = Array.isArray(this.columns) ? this.columns : [];
      return rows.filter(row => {
        const values = columns.length
          ? columns.map(column => row && row[column.prop])
          : Object.values(row || {});

        return values.some(value => String(value || '').toLowerCase().includes(keyword));
      });
    },
  },
  mounted() {
    this.fetchPredict();
  },
  watch: {
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol) {
        this.fetchPredict(newSymbol);
      }
    },
    predictData: {
      handler(newVal) {
        if(isObject(newVal) && Object.keys(newVal).length > 0) {
          const {
            PredictData,
            PredictDataColumns
          } = newVal;
          this.tableData = Array.isArray(PredictData) ? PredictData : [];
          this.columns = Array.isArray(PredictDataColumns) ? PredictDataColumns : [];
        }
      },
    }
  },
  methods: {
    ...mapActions('market/predict', ['fetchPredict']),
    handleSizeChange(size) {
      console.log('每页显示条数改变：', size)
    },
    handleCurrentChange(page) {
      console.log('当前页改变：', page)
    },
  },
};
</script>

<style scoped lang="scss">
 @import "@/components/Market/market.scss";

.predict-layout {
  padding: $spacing-md;
  height: 100%;
  overflow: auto;

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

  .summary-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  .summary-toolbar .table-title {
    margin: 0;
  }

  .summary-search {
    width: min(320px, 100%);
    flex: 0 0 auto;
  }

  @media (max-width: 768px) {
    .summary-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .summary-search {
      width: 100%;
    }
  }
}
.tabel-input {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
}
</style>
