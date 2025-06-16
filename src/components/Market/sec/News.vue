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
export default {
  name: 'News',
  data() {
    return {
      timeframe: 'all',
      tableData: [
       {
         time: '05/12/2025 8:30 PM',
         symbol: 'AAPL',
         source: 'https://example.com',
         title: 'Samsung launches thin S25 Edge as Aoole reportedly prepares the Ipone \'AIR\''
       },
       {
         time: '05/12/2025 8:30 PM',
         symbol: 'AAPL',
         source: 'https://example.com',
         title: 'Samsung launches thin S25 Edge as Aoole reportedly prepares the Ipone \'AIR\''
       },
     ],
     columns: [
       { prop: 'time', label: 'Time', sortable: true },
       { prop: 'symbol', label: 'Symbol', sortable: true },
       { 
         prop: 'source', 
         label: 'source', 
         type: 'link',
         formatter: (row) => 'cnbc.com'
       },
       { prop: 'title', label: 'Title', sortable: true },
     ],
     loading: false
    }
  },
  components: {
    BaseTable,
    ButtonGroup,
  },
  computed: {
  },
  methods: {
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
