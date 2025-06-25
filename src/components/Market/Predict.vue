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
          this.tableData = PredictData;
          this.columns = PredictDataColumns;
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
}
</style>
