<template>
  <div class="financials">
    <div class="title">SEC</div>
    <div class="spacing-lg"></div>
    <div class="grid-col-1">
      <section class="card financials__card">
        <base-table
          showSearch="true"
          :data="SECData"
          :columns="SECDataColumns"
          :loading="isLoading"
          :rowClickable="true" 
          :rowClickUrlField="'rowLink'" 
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <!-- 自定义操作按钮 -->
          <template #operations="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
          </template>
        </base-table>
      </section>
    </div>
  </div>
</template>

<script>
import BaseTable from "@/components/Market/components/tables/BaseTable.vue";
import { mapActions, mapGetters } from "vuex";
import { isObject } from "lodash";

export default {
  name: 'SEC',
  data() {
    return {
      SECData: [],
      SECDataColumns: [],
    }
  },
  components: {
    BaseTable,
  },
  computed: {
    ...mapGetters("market/sec/sec", [
      "companySECData",
      "isLoading",
      "errorMessage",
    ]),
    symbol() {
      return this.$route.params.symbolname;
    }
  },
  watch: {
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol) {
        this.fetchCompanySEC(newSymbol);
      }
    },
    companySECData: {
      handler(newVal) {
        if(isObject(newVal) && Object.keys(newVal).length > 0) {
          debugger
          const {
            SECData, 
            SECDataColumns
          } = newVal
          this.SECData = SECData
          this.SECDataColumns = SECDataColumns
        }
      },
      deep: true
    }
  },
  created() {
    this.fetchCompanySEC(this.symbol);
  },
  methods: {
    ...mapActions("market/sec/sec", ["fetchCompanySEC"]),
    handleSizeChange(size) {
      console.log('每页显示条数改变：', size)
    },
    handleCurrentChange(page) {
      console.log('当前页改变：', page)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/components/Market/market.scss";

.financials {
  margin: 0 auto;
  &__card {
    padding: 24px;

    position: relative; //爲了讓btn group position absolute顯示
  }
}

.btn-group {
  position: absolute;
  top: 80px;
}

@media (max-width: 768px) {
  .financials {
    &__card {
      padding: 16px;
    }
  }
}
</style>
