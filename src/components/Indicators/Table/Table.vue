<template>
  <div class="outsideTable">
    <VirtualScrollTable
        v-bind="$attrs"
        v-on="$listeners"
        :refName="tableInfo['refName']"
        :itemSize="tableInfo['itemSize']"
        :options="tableInfo['options']"
        :type="tableInfo['type']"
        :label="tableInfo['label']"
        :tableData="tableData"
        :isOver="isOver"
        :loading="loading"
        :firstRow="firstRow"
        :cssMonthLabel="cssMonthLabel"
        @loadMore="loadMore"
        >
    </VirtualScrollTable>
  </div>
</template>

<script>
import VirtualScrollTable from "./VirtualScrollTable"
import { mapActions, mapGetters } from 'vuex'
import { isJson } from '@/utils'

export default {
  props: {
    tableInfo: Object,
    selectedTitle: String
  },
  name: 'Table',
  data() {
    return {
      tableData: [],
      page: 0,
      isOver: {
      },
      loading: false,
      optionsChecked: '', // 默认值
      cssMonthLabel: '',
      urlMap:{
        stock: 'stock_complete_list',
        NASDAQ: 'ndx_100_complete_list',
        SP1500: 'sp_1500_complete_list',
        bond: 'bond_complete_list',
        BondSeasonality: 'bond_seasonality',
        CommoditySeasonality: 'commod_seasonality',
        ETFSeasonality: 'etf_seasonality',
        ETFSector: 'etf_complete_list',
        ETFSectorBreadth: 'etf_breadth',
        ETFFundFlow: 'etf_flow',
        ETFMonthlyFund: 'monthly_fund_flows',
        ETFShares: 'shares_outstanding',
        popular: 'most_popular',
        commodity: 'commodity_complete_list',
        cssScreen: 'commod_sentiment_seasonality',
        cstScreen: 'commod_optix_trend',
        CHMinMax: 'cot_max_min'
      },
      firstRow: {}
    }
  },
  components: {
    VirtualScrollTable,
  },
  computed: {
    ...mapGetters({
      indicatorsListData: 'getIndicatorsPageListData',
      favoritesBtv1List: 'getFavoriteIndicatorListBtv1',
      favoritesBtv2List: 'getFavoriteIndicatorList'
    })
  },
  watch: {
    selectedTitle: {
      handler (title) {
        if(title === 'Popular') this.$emit('updateChart', this.firstRow)
      },
    }
  },
  async mounted() {
    await this.loadMore(this.tableInfo['type'])
  },
  methods: {
    ...mapActions('chart', ['fetchIndicatorsPageList']),
    async loadMore (type) {
      this.optionsChecked = type
      if(this.tableData.length === 0) this.loading = true
      let _results
      try {
        const url = this.urlMap[this.optionsChecked]
        await this.fetchIndicatorsPageList(url)
        _results = isJson(this.indicatorsListData[url]) ? JSON.parse(this.indicatorsListData[url]) : []
          console.log(url, _results)
      } catch (error) {
        console.log('error', error)
        _results = []
       this.loading = false
      }
      this.tableData = [..._results]
      this.firstRow = this.tableData[0] || {}
      this.loading = false
    },
  }

}
</script>

<style lang="less" scoped>
.outsideTable {
  margin-bottom: 10px;
}
</style>