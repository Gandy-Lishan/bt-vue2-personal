<template>
  <div class="financials">
    <div class="title">News</div>
    <button-group 
      v-model="timeframe" 
      :options="[
        { label: 'All', value: 'all' },
        { label: 'Market News', value: 'market_news' },
        { label: 'Press Feed', value: 'press_feed' },
      ]" 
      backgroundColor="#fff" 
      :enableTransition="true" 
    />
    <div class="spacing-lg"></div>
    <div class="grid-col-1">
      <section class="card financials__card">
        <base-table
          showSearch="true"
          :data="tableData"
          :columns="columns"
          :loading="loading"
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
import ButtonGroup from '@/components/Market/components/baseButton/ButtonGroup.vue';
import { mapGetters, mapActions } from 'vuex';
import { isObject } from '@/utils';

export default {
  name: 'News',
  data() {
    return {
      timeframe: 'all',
      tableData: [],
     columns: [],
     loading: false
    }
  },
  components: {
    BaseTable,
    ButtonGroup,
  },
  computed: {    
    ...mapGetters("market/sec/news", [
      "companyNewsData",
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
        this.fetchCompanyNews(newSymbol);
      }
    },  
    companyNewsData: {
      handler(newVal) {
        if(isObject(newVal) && Object.keys(newVal).length > 0) {
          const {
            companyNewsData,
            companyNewsDataColumns
          } = newVal
          this.tableData = companyNewsData
          this.columns = companyNewsDataColumns
        }
      },
      deep: true
    }
  },
  created() {
    this.fetchCompanyNews(this.symbol);
  },
  methods: {
    ...mapActions("market/sec/news", ["fetchCompanyNews"]),
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
